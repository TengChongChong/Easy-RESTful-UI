<template>
  <!-- 如无需展开查询，请移除:advanced.sync="advanced"并添加:no-advanced="true" -->
  <e-pro-table title="数据导入示例" :advanced.sync="advanced">
    <template slot="query">
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="姓名">
          <a-input v-model="queryParam.name"/>
        </a-form-model-item>
      </a-col>
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="性别">
          <e-dict-select type="sex" v-model="queryParam.sex" @change="$refs.eTable.refresh(true)"/>
        </a-form-model-item>
      </a-col>
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="手机号码">
          <a-input v-model="queryParam.phone"/>
        </a-form-model-item>
      </a-col>
      <template v-if="advanced">
        <!-- 点击展开显示的查询条件 -->
      </template>
    </template>

    <template slot="button">
      <e-btn-import import-code="sample:general"/>
      <a-button icon="download" @click="exportData">导出数据</a-button>
    </template>

    <template slot="table">
      <s-table
        ref="eTable"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span slot="sex" slot-scope="text">
          <e-dict-tag type="sex" :code="text"/>
        </span>
      </s-table>
    </template>
  </e-pro-table>
</template>

<script>
import { exportData, select } from '@/api/sample/general'
import { STable, Ellipsis } from '@/components'
import EProTable from '@/components/Easy/data-display/ProTable'
import EDictTag from '@/components/Easy/data-display/DictTag'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import EBtnImport from '@/components/Easy/general/BtnImport'
import { downloadFileById } from '@/utils/util'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: 100,
    sorter: true
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 100,
    sorter: true,
    scopedSlots: { customRender: 'sex' }
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    width: 100,
    sorter: true
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    sorter: true
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: 100,
    sorter: true
  }
]

export default {
  name: 'SampleImportList',
  components: {
    EBtnImport,
    STable,
    Ellipsis,
    EProTable,
    EDictTag,
    EDictSelect
  },
  data () {
    this.columns = columns
    return {

      // 查询参数
      advanced: false,
      queryParam: {}
    }
  },
  activated () {
    this.$refs.eTable.refresh(true)
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
    exportData () {
      exportData(this.queryParam).then(res => {
        downloadFileById(res.data)
      })
    }
  }
}
</script>
