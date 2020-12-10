<template>
  <div>
    <pro-table title="字典类型" :advanced.sync="advanced">
      <template slot="query">
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="类型">
            <a-input v-model="queryParam.type"/>
          </a-form-model-item>
        </a-col>
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="类型名称">
            <a-input v-model="queryParam.name"/>
          </a-form-model-item>
        </a-col>
        <template v-if="advanced">
          <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
            <a-form-model-item label="状态">
              <dict-select type="commonStatus" v-model="queryParam.status" @change="$refs.table.refresh(true)"></dict-select>
            </a-form-model-item>
          </a-col>
        </template>
      </template>

      <template slot="button">
        <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
        <btn-remove-batch :ids="selectedRowKeys" :on-click="remove"/>
      </template>

      <template slot="table">
        <s-table
          ref="table"
          :columns="columns"
          :data="loadData"
          :alert="true"
          :rowSelection="rowSelection"
          showPagination="auto"
        >
          <template
            v-for="col in ['type', 'name']"
            :slot="col"
            slot-scope="text, record"
          >
            <div :key="col">
              <a-input
                v-if="record.editable"
                :value="text"
                @change="e => handleChange(e.target.value, record.key, col)"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>

          <span slot="status" slot-scope="text, record">
            <dict-select v-if="record.editable" type="commonStatus" v-model="record.status" @change="e => handleChange(e.target.value, record.key, 'status')"></dict-select>
            <template v-else>
              <dict-tag type="commonStatus" :code="record.status"></dict-tag>
            </template>
          </span>

          <span slot="action" slot-scope="text, record">
            <template>
              <btn-remove :id="record.id" :divider="false" :on-click="remove"></btn-remove>
              <a-divider type="vertical" />
              <span v-if="record.editable">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>保存</span>
                  </template>
                  <a-button type="primary" size="small" icon="save" @click="() => save(record.key)"/>
                </a-tooltip>
                <a-divider type="vertical" />

                <a-tooltip placement="top">
                  <template slot="title">
                    <span>取消编辑</span>
                  </template>
                  <a-button size="small" icon="rollback" @click="() => cancel(record.key)"/>
                </a-tooltip>
              </span>
              <span v-else>
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>修改</span>
                  </template>
                  <a-button type="primary" size="small" icon="edit" :disabled="editingKey !== ''" @click="() => edit(record.key)"/>
                </a-tooltip>
              </span>
            </template>
          </span>
        </s-table>
      </template>
    </pro-table>
    <a-modal v-model="addModalVisible" title="新增字典类型" @ok="saveData" okText="保存并关闭">
      <a-form-model
        ref="form"
        :model="object"
        :rules="rules"
        :label-col="formLayout.labelCol"
        :wrapper-col="formLayout.wrapperCol">
        <a-row class="form-row" :gutter="16">
          <a-col>
            <a-form-model-item label="类型" prop="type">
              <a-input v-model="object.type"/>
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item label="类型名称" prop="name">
              <a-input v-model="object.name"/>
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item label="状态" prop="status">
              <dict-radio name="status" v-model="object.status" type="commonStatus"/>
            </a-form-model-item>
          </a-col></a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select, remove, save } from '@/api/sys/dict-type'
import DictTag from '@/components/Easy/data-entry/DictTag'
import DictSelect from '@/components/Easy/data-entry/DictSelect'
import ProTable from '@/components/ProTable/Index'
import BtnAdd from '@/components/Easy/general/BtnAdd'
import BtnEdit from '@/components/Easy/general/BtnEdit'
import BtnRemove from '@/components/Easy/general/BtnRemove'
import BtnRemoveBatch from '@/components/Easy/general/BtnRemoveBatch'
import { FORM_LAYOUT } from '@/utils/const/form'
import { saveSuccessTip } from '@/utils/tips'
import DictRadio from '@/components/Easy/data-entry/DictRadio'

const columns = [
  {
    title: '类型',
    dataIndex: 'type',
    sorter: true,
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '类型名称',
    dataIndex: 'name',
    sorter: true,
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SysDictList',
  components: {
    DictRadio,
    BtnRemoveBatch,
    BtnRemove,
    BtnEdit,
    BtnAdd,
    ProTable,
    DictSelect,
    DictTag,
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      allowClear: true,
      dictTypes: [],
      selectedRowKeys: [],
      selectedRows: [],
      editingKey: '',
      cacheData: [],

      // 新增窗口
      addModalVisible: false,
      formLayout: FORM_LAYOUT,
      object: {},
      rules: {
        type: [
          { required: true, message: '请输入字典类型', trigger: 'blur' },
          { max: 50, message: '请输入字典类型不能超过50个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入字典类型名称', trigger: 'blur' },
          { max: 80, message: '字典类型名称字数不能超过80个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择字典类型状态', trigger: 'blur' }
        ]
      }
    }
  },
  activated () {
    this.$refs.table.refresh(true)
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    loadData (parameter) {
      const requestParameters = Object.assign({}, parameter, this.queryParam)
      return select(requestParameters)
        .then(res => {
          this.cacheData = res.data.data.map(item => ({ ...item }))
          return res.data
        })
    },
    handleChange (value, key, column) {
      const newData = [...this.$refs.table.localDataSource]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.$refs.table.localDataSource = newData
      }
    },
    handleAdd () {
      this.addModalVisible = true
      this.object = {
        status: '1'
      }
    },
    edit (key) {
      const newData = [...this.$refs.table.localDataSource]
      const target = newData.filter(item => key === item.key)[0]
      this.editingKey = key
      if (target) {
        target.editable = true
        this.$refs.table.localDataSource = newData
      }
    },
    saveData () {
      this.$refs.form.validate(valid => {
        if (valid) {
          save(this.object).then((res) => {
            this.$refs.table.refresh(true)
            saveSuccessTip()
            this.addModalVisible = false
          })
        }
      })
    },
    save (key) {
      const newData = [...this.$refs.table.localDataSource]
      const newCacheData = [...this.cacheData]
      const target = newData.filter(item => key === item.key)[0]
      const targetCache = newCacheData.filter(item => key === item.key)[0]
      if (target && targetCache) {
        save(target).then(res => {
          delete target.editable
          this.$refs.table.localDataSource = newData
          Object.assign(targetCache, target, res.data)
          this.cacheData = newCacheData
        })
      }
      this.editingKey = ''
    },
    cancel (key) {
      const newData = [...this.$refs.table.localDataSource]
      const target = newData.filter(item => key === item.key)[0]
      this.editingKey = ''
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
        delete target.editable
        this.$refs.table.localDataSource = newData
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    remove (id) {
      remove(id).then(res => {
        this.$refs.table.refresh(true)
      })
    }
  }
}
</script>
