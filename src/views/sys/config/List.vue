<template>
  <e-pro-table title="系统参数" :no-advanced="true">
    <template slot="query">
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="key">
          <a-input v-model="queryParam.sysKey"/>
        </a-form-model-item>
      </a-col>
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="value">
          <a-input v-model="queryParam.value"/>
        </a-form-model-item>
      </a-col>
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="类型">
          <e-dict-select type="dataType" v-model="queryParam.type" @change="$refs.eTable.refresh(true)"/>
        </a-form-model-item>
      </a-col>
    </template>

    <template slot="button">
      <e-btn-add :permissions="SYS_PERMISSIONS_CODE.SYS_CONFIG_SAVE" to="/sys/config/input"/>
      <a-button v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_CONFIG_SAVE)" type="primary" icon="sync" @click="refreshCache">更新缓存数据</a-button>
      <e-btn-remove-batch :permissions="SYS_PERMISSIONS_CODE.SYS_CONFIG_REMOVE" :loading="removeBathLoading" :ids="selectedRowKeys" :click-callback="remove"/>
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
        <span slot="type" slot-scope="text, record">
          <e-dict-tag type="dataType" :code="record.type"/>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <e-btn-edit :permissions="SYS_PERMISSIONS_CODE.SYS_CONFIG_SAVE" :to="`/sys/config/input`" :tab-name="record.key" :id="record.id"/>
            <e-btn-remove :permissions="SYS_PERMISSIONS_CODE.SYS_CONFIG_REMOVE" :id="record.id" :divider="false" :click-callback="remove"/>
          </template>
        </span>
      </s-table>
    </template>
  </e-pro-table>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select, remove, refreshCache } from '@/api/sys/config'
import EDictTag from '@/components/Easy/data-display/DictTag'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import EBtnAdd from '@/components/Easy/general/BtnAdd'
import EBtnEdit from '@/components/Easy/general/BtnEdit'
import EBtnRemove from '@/components/Easy/general/BtnRemove'
import { successTip } from '@/utils/tips'
import EBtnRemoveBatch from '@/components/Easy/general/BtnRemoveBatch'
import EProTable from '@/components/Easy/data-display/ProTable'
import { SYS_PERMISSIONS_CODE } from '@/utils/const/sys/PermissionsCode'

const columns = [
  {
    title: 'sysKey',
    dataIndex: 'sysKey',
    width: 300,
    sorter: true
  },
  {
    title: 'value',
    dataIndex: 'value',
    width: 300,
    sorter: true
  },
  {
    title: '类型',
    dataIndex: 'type',
    sorter: true,
    width: 100,
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '备注',
    dataIndex: 'tips',
    width: 200,
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 90,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SysConfigList',
  components: {
    EProTable,
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

      // 查询参数
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      removeBathLoading: false
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
    // 加载数据方法 必须为 Promise 对象
    loadData (parameter) {
      const requestParameters = Object.assign({}, parameter, this.queryParam)
      return select(requestParameters)
        .then(res => {
          return res.data
        })
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
    },
    refreshCache () {
      refreshCache().then(res => {
        successTip()
      })
    }
  }
}
</script>
