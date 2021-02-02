<template>
  <div>
    <e-pro-table title="字典类型" :advanced.sync="advanced">
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
              <e-dict-select type="commonStatus" v-model="queryParam.status" @change="$refs.eTable.refresh(true)"/>
            </a-form-model-item>
          </a-col>
        </template>
      </template>

      <template slot="button">
        <a-button v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_DICT_TYPE_SAVE)" type="primary" icon="plus" @click="handleAdd">新增</a-button>
        <e-btn-remove-batch :permissions="SYS_PERMISSIONS_CODE.SYS_DICT_TYPE_REMOVE" :loading="removeBathLoading" :ids="selectedRowKeys" :click-callback="remove"/>
      </template>

      <template slot="table">
        <s-table
          ref="eTable"
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
                @change="e => handleChange(e.target.value, record.id, col)"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>

          <span slot="status" slot-scope="text, record">
            <e-dict-select
              v-if="record.editable"
              type="commonStatus"
              v-model="record.status"
              @change="e => handleChange(e.target.value, record.id, 'status')"/>
            <template v-else>
              <e-dict-tag type="commonStatus" :code="record.status"/>
            </template>
          </span>

          <span slot="action" slot-scope="text, record">
            <template>
              <e-btn-remove :id="record.id" :divider="false" :click-callback="remove"/>
              <template v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_DICT_TYPE_SAVE)">
                <a-divider type="vertical"/>
                <span v-if="record.editable">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>保存</span>
                    </template>
                    <a-button type="primary" size="small" icon="save" @click="() => save(record.id)"/>
                  </a-tooltip>
                  <a-divider type="vertical"/>

                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>取消编辑</span>
                    </template>
                    <a-button size="small" icon="rollback" @click="() => cancel(record.id)"/>
                  </a-tooltip>
                </span>
                <span v-else>
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>修改</span>
                    </template>
                    <a-button
                      type="primary"
                      size="small"
                      icon="edit"
                      :disabled="editingId !== ''"
                      @click="() => edit(record.id)"/>
                  </a-tooltip>
                </span>
              </template>
            </template>
          </span>
        </s-table>
      </template>
    </e-pro-table>
    <a-modal v-model="addModalVisible" :confirmLoading="confirmLoading" title="新增字典类型" @ok="saveData" okText="保存并关闭">
      <a-form-model
        ref="form"
        :model="model"
        :rules="rules"
        :label-col="FORM_LAYOUT.labelCol"
        :wrapper-col="FORM_LAYOUT.wrapperCol">
        <a-form-model-item label="类型" prop="type">
          <a-input v-model="model.type"/>
        </a-form-model-item>
        <a-form-model-item label="类型名称" prop="name">
          <a-input v-model="model.name"/>
        </a-form-model-item>
        <a-form-model-item label="状态" prop="status">
          <e-dict-radio name="status" v-model="model.status" type="commonStatus"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select, remove, save } from '@/api/sys/dict-type'
import EDictTag from '@/components/Easy/data-display/DictTag'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import EBtnAdd from '@/components/Easy/general/BtnAdd'
import EBtnEdit from '@/components/Easy/general/BtnEdit'
import EBtnRemove from '@/components/Easy/general/BtnRemove'
import EBtnRemoveBatch from '@/components/Easy/general/BtnRemoveBatch'
import { FORM_LAYOUT } from '@/utils/const/form'
import { saveSuccessTip } from '@/utils/tips'
import EDictRadio from '@/components/Easy/data-entry/DictRadio'
import EProTable from '@/components/Easy/data-display/ProTable'
import { COMMON_STATUS_CONST } from '@/utils/const/sys/CommonStatusConst'
import { SYS_PERMISSIONS_CODE } from '@/utils/const/sys/PermissionsCode'

const columns = [
  {
    title: '类型',
    dataIndex: 'type',
    sorter: true,
    width: 300,
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '类型名称',
    dataIndex: 'name',
    sorter: true,
    width: 300,
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    width: 200,
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 140,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SysDictTypeList',
  components: {
    EProTable,
    EDictRadio,
    EBtnRemoveBatch,
    EBtnRemove,
    EBtnEdit,
    EBtnAdd,
    EDictSelect,
    EDictTag,
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      SYS_PERMISSIONS_CODE: SYS_PERMISSIONS_CODE,
      COMMON_STATUS_CONST: COMMON_STATUS_CONST,

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      dictTypes: [],
      selectedRowKeys: [],
      selectedRows: [],
      editingId: '',
      cacheData: [],
      removeBathLoading: false,

      // 新增窗口
      addModalVisible: false,
      confirmLoading: false,
      FORM_LAYOUT: FORM_LAYOUT,
      model: {},
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
    this.$refs.eTable.refresh(true)
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
    handleChange (value, id, column) {
      const newData = [...this.$refs.eTable.localDataSource]
      const target = newData.filter(item => id === item.id)[0]
      if (target) {
        target[column] = value
        this.$refs.eTable.localDataSource = newData
      }
    },
    handleAdd () {
      this.addModalVisible = true
      this.model = {
        status: COMMON_STATUS_CONST.ENABLE
      }
    },
    edit (id) {
      const newData = [...this.$refs.eTable.localDataSource]
      const target = newData.filter(item => id === item.id)[0]
      this.editingId = id
      if (target) {
        target.editable = true
        this.$refs.eTable.localDataSource = newData
      }
    },
    saveData () {
      this.$refs.form.validate(valid => {
        this.confirmLoading = true
        if (valid) {
          save(this.model).then((res) => {
            this.$refs.eTable.refresh(true)
            saveSuccessTip()
            this.addModalVisible = false
            this.confirmLoading = false
          }).catch(({ response }) => {
            this.confirmLoading = false
          })
        }
      })
    },
    save (id) {
      const newData = [...this.$refs.eTable.localDataSource]
      const newCacheData = [...this.cacheData]
      const target = newData.filter(item => id === item.id)[0]
      const targetCache = newCacheData.filter(item => id === item.id)[0]
      if (target && targetCache) {
        save(target).then(res => {
          saveSuccessTip()
          delete target.editable
          this.$refs.eTable.localDataSource = newData
          Object.assign(targetCache, target, res.data)
          this.cacheData = newCacheData
        })
      }
      this.editingId = ''
    },
    cancel (id) {
      const newData = [...this.$refs.eTable.localDataSource]
      const target = newData.filter(item => id === item.id)[0]
      this.editingId = ''
      if (target) {
        Object.assign(target, this.cacheData.filter(item => id === item.id)[0])
        delete target.editable
        this.$refs.eTable.localDataSource = newData
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    remove (id) {
      remove(id).then(res => {
        this.$refs.eTable.refresh(true)
        this.removeBathLoading = false
      }).catch(({ response }) => {
        this.removeBathLoading = false
      })
    }
  }
}
</script>
