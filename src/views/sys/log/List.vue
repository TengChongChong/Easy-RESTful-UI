<template>
  <e-pro-table title="访问日志" :advanced.sync="advanced">
    <template slot="query">
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="模块">
          <a-input v-model="queryParam.modular"/>
        </a-form-model-item>
      </a-col>
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="方法">
          <a-input v-model="queryParam.method"/>
        </a-form-model-item>
      </a-col>
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="ip">
          <a-input v-model="queryParam.ip"/>
        </a-form-model-item>
      </a-col>
      <template v-if="advanced">
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="uri">
            <a-input v-model="queryParam.uri"/>
          </a-form-model-item>
        </a-col>
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="操作人">
            <a-input v-model="queryParam.nickname"/>
          </a-form-model-item>
        </a-col>
      </template>
    </template>

    <template slot="table">
      <s-table
        ref="eTable"
        :columns="columns"
        :data="loadData"
        :alert="true"
        showPagination="auto"
      >
        <span slot="class" slot-scope="text, record">
          {{ record.clazz }}.{{ record.methodName }}()
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <e-btn-info
              :to="`/sys/log/input`"
              :tab-name="record.method || record.modular"
              :id="record.id"
              :divider="false"/>
          </template>
        </span>
      </s-table>
    </template>
  </e-pro-table>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select } from '@/api/sys/log'
import EProTable from '@/components/Easy/data-display/ProTable'
import EBtnInfo from '@/components/Easy/general/BtnInfo'
import { formatDate } from '@/utils/util'

const columns = [
  {
    title: '模块',
    dataIndex: 'modular',
    sorter: true,
    width: 100
  },
  {
    title: '方法',
    dataIndex: 'method',
    sorter: true,
    width: 160
  },
  {
    title: 'ip',
    dataIndex: 'ip',
    sorter: true,
    width: 120
  },
  {
    title: 'uri',
    dataIndex: 'uri',
    sorter: true,
    width: 160
  },
  {
    title: 'class',
    dataIndex: 'clazz',
    sorter: true,
    width: 360,
    scopedSlots: { customRender: 'class' }
  },
  {
    title: '操作人',
    dataIndex: 'operationUser',
    sorter: true,
    width: 100
  },
  {
    title: '操作时间',
    dataIndex: 'operationDate',
    sorter: true,
    width: 170,
    customRender: (text) => formatDate(text)
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 60,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SysLogList',
  components: {
    EBtnInfo,
    EProTable,
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
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
    }
  }
}
</script>
