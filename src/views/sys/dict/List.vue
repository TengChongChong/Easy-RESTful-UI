<template>
  <e-pro-table title="字典管理" :advanced.sync="advanced">
    <template slot="query">
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="字典类型">
          <a-select show-search option-filter-prop="children" :allowClear="true" v-model="queryParam.dictType" @change="$refs.table.refresh(true)">
            <a-select-option v-for="item in dictTypes" :key="item.type">
              {{ item.name }}（{{ item.type }}）
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="字典编码">
          <a-input v-model="queryParam.code"/>
        </a-form-model-item>
      </a-col>
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="字典名称">
          <a-input v-model="queryParam.name"/>
        </a-form-model-item>
      </a-col>
      <template v-if="advanced">
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="状态">
            <e-dict-select type="commonStatus" v-model="queryParam.status" @change="$refs.table.refresh(true)"/>
          </a-form-model-item>
        </a-col>
      </template>
    </template>

    <template slot="button">
      <e-btn-add to="/sys/dict/input" :params="{dictType: queryParam.dictType}"/>
      <router-link to="/sys/dict/type/list">
        <a-button icon="bars">字典类型管理</a-button>
      </router-link>
      <a-tooltip placement="top">
        <template slot="title">
          <span>重新生成字典js文件</span>
        </template>
        <a-button icon="sync" @click="generateDictData">更新字典资源</a-button>
      </a-tooltip>

      <e-btn-remove-batch :loading="removeBathLoading" :ids="selectedRowKeys" :click-callback="remove"/>
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
        <span slot="name" slot-scope="text, record">
          <template v-if="record.css != null && record.css !== ''">
            <a-tag :color="record.css">{{ record.name }}</a-tag>
          </template>
          <template v-if="record.css == null || record.css === ''">
            {{ record.name }}
          </template>
        </span>
        <span slot="status" slot-scope="text, record">
          <e-dict-tag type="commonStatus" :code="record.status"/>
        </span>

        <span slot="dictType" slot-scope="text, record">
          {{ record.dictTypeName }}（{{ record.dictType }}）
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <e-btn-add-sub :to="`/sys/dict/input`" :tab-name="`新增下级 - ${record.name}`" :params="{ pId: record.id, dictType: record.dictType }"/>

            <e-btn-edit :to="`/sys/dict/input`" :tab-name="record.name" :id="record.id"/>

            <e-btn-remove :id="record.id" :divider="false" :click-callback="remove"/>
          </template>
        </span>
      </s-table>
    </template>
  </e-pro-table>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select, remove, generateDictData } from '@/api/sys/dict'
import { selectAll } from '@/api/sys/dict-type'
import EDictTag from '@/components/Easy/data-entry/DictTag'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import EBtnAddSub from '@/components/Easy/general/BtnAddSub'
import EBtnAdd from '@/components/Easy/general/BtnAdd'
import EBtnEdit from '@/components/Easy/general/BtnEdit'
import EBtnRemove from '@/components/Easy/general/BtnRemove'
import { successTip } from '@/utils/tips'
import EBtnRemoveBatch from '@/components/Easy/general/BtnRemoveBatch'
import EProTable from '@/components/Easy/data-display/ProTable'

const columns = [
  {
    title: '字典编码',
    dataIndex: 'code',
    sorter: true,
    width: 200
  },
  {
    title: '字典名称',
    dataIndex: 'name',
    sorter: true,
    width: 200,
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '字典类型',
    dataIndex: 'dictType',
    sorter: true,
    width: 200,
    scopedSlots: { customRender: 'dictType' }
  },
  {
    title: '排序值',
    dataIndex: 'orderNo',
    width: 100,
    sorter: true
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    width: 100,
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 130,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SysDictList',
  components: {
    EProTable,
    EBtnRemoveBatch,
    EBtnRemove,
    EBtnEdit,
    EBtnAdd,
    EBtnAddSub,
    EDictSelect,
    EDictTag,
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
      dictTypes: [],
      selectedRowKeys: [],
      selectedRows: [],
      removeBathLoading: false
    }
  },
  created () {
    this.loadDictTypes()
  },
  activated () {
    this.$refs.table.refresh(true)
    this.loadDictTypes()
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
    // 加载数据方法 必须为 Promise 对象
    loadData (parameter) {
      const requestParameters = Object.assign({}, parameter, this.queryParam)
      return select(requestParameters)
        .then(res => {
          return res.data
        })
    },
    loadDictTypes () {
      selectAll().then(res => {
        this.dictTypes = res.data
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    remove (id) {
      remove(id).then(res => {
        this.$refs.table.refresh(true)
        this.removeBathLoading = false
      }).catch(({ response }) => {
        this.removeBathLoading = false
      })
    },
    generateDictData () {
      generateDictData().then(res => {
        successTip()
      })
    }
  }
}
</script>
