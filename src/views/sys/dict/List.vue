<template>
  <div>
    <pro-table title="字典管理" :advanced.sync="advanced">
      <template slot="query">
        <a-col :xl="6" :lg="8" :sm="24">
          <a-form-item label="字典类型">
            <a-select show-search option-filter-prop="children" :allowClear="allowClear" v-model="queryParam.dictType" @change="$refs.table.refresh(true)">
              <a-select-option v-for="item in dictTypes" :key="item.type">
                {{ item.name }}（{{ item.type }}）
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xl="6" :lg="8" :sm="24">
          <a-form-item label="字典编码">
            <a-input v-model="queryParam.code"/>
          </a-form-item>
        </a-col>
        <a-col :xl="6" :lg="8" :sm="24">
          <a-form-item label="字典名称">
            <a-input v-model="queryParam.name"/>
          </a-form-item>
        </a-col>
        <template v-if="advanced">
          <a-col :xl="6" :lg="8" :sm="24">
            <a-form-item label="状态">
              <dict-select type="commonStatus" v-model="queryParam.status" @change="refresh"></dict-select>
            </a-form-item>
          </a-col>
        </template>
      </template>

      <template slot="button">
        <a-button type="primary" icon="plus">新建</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
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
            <dict-tag type="commonStatus" :code="record.status"></dict-tag>
          </span>

          <span slot="dictType" slot-scope="text, record">
            {{ record.dictTypeName }}（{{ record.dictType }}）
          </span>

          <span slot="action">
            <template>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>新增下级</span>
                </template>
                <a-button type="primary" size="small" icon="plus" />
              </a-tooltip>
              <a-divider type="vertical" />
              <a-tooltip placement="top">
                <template slot="title">
                  <span>修改</span>
                </template>
                <a-button type="primary" size="small" icon="edit" />
              </a-tooltip>
              <a-divider type="vertical" />
              <a-tooltip placement="top">
                <template slot="title">
                  <span>删除</span>
                </template>
                <a-button type="danger" size="small" icon="delete" />
              </a-tooltip>
            </template>
          </span>
        </s-table>
      </template>
    </pro-table>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select } from '@/api/sys/dict'

import { selectAll } from '@/api/sys/dict-type'
import DictTag from '@/components/Easy/DictTag'
import DictSelect from '@/components/Easy/DictSelect'
import ProTable from '@/components/ProTable/Index'

const columns = [
  {
    title: '字典编码',
    dataIndex: 'code',
    sorter: true
  },
  {
    title: '字典名称',
    dataIndex: 'name',
    sorter: true,
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '字典类型',
    dataIndex: 'dictType',
    sorter: true,
    scopedSlots: { customRender: 'dictType' }
  },
  {
    title: '排序值',
    dataIndex: 'orderNo',
    sorter: true
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
  name: 'TableList',
  components: {
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
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return select(requestParameters)
          .then(res => {
            return res.data
          })
      },
      allowClear: true,
      dictTypes: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
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
    loadDictTypes () {
      selectAll().then(res => {
        this.dictTypes = res.data
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>
