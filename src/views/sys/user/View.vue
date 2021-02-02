<template>
  <a-row :gutter="16">
    <a-col :xl="6" :md="8">
      <a-card title="部门" :bordered="false" id="tree-card">
        <a-tooltip placement="top" :visible="searchTooltipVisible">
          <template slot="title">
            <span>请输入部门名称后查询</span>
          </template>
          <a-input-search v-model="query" placeholder="输入部门名称搜索" @search="onSearch"/>
        </a-tooltip>

        <div class="tree-wrapper">
          <a-alert v-if="noResults" :style="{marginTop: '5px', marginBottom: '5px'}" message="未查询到数据" banner/>
          <tree
            :load-data="onLoadData"
            :tree-data="treeData"
            :expanded-keys="expandedKeys"
            :selected-keys="selectedKeys"
            show-icon
            draggable
            show-line
            @select="onSelect"
            @expand="onExpand"
          >
            <a-icon v-for="item in iconArrays" :key="item" :slot="item" :type="item"/>
          </tree>
          <a-button size="small" v-if="search" @click="firstLoadData">
            返回
          </a-button>
        </div>
      </a-card>
    </a-col>
    <a-col :xl="18" :md="16">
      <e-pro-table title="用户" :advanced.sync="advanced">
        <template slot="query">
          <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
            <a-form-model-item label="用户名">
              <a-input v-model="queryParam.username"/>
            </a-form-model-item>
          </a-col>
          <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
            <a-form-model-item label="手机号">
              <a-input v-model="queryParam.phone"/>
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
          <e-btn-add :permissions="SYS_PERMISSIONS_CODE.SYS_USER_SAVE" to="/sys/user/input" :params="{deptId: queryParam.deptId}"/>
          <e-btn-remove-batch :permissions="SYS_PERMISSIONS_CODE.SYS_USER_REMOVE" :loading.sync="removeBathLoading" :ids="selectedRowKeys" :click-callback="remove"/>
        </template>

        <template slot="table">
          <s-table
            ref="eTable"
            :columns="columns"
            :data="loadTableData"
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
            <span slot="status" slot-scope="text, record, index">
              <a-switch
                size="small"
                :data-id="record.id"
                :data-index="index"
                :loading="switchLoading[index]"
                :default-checked="text === USER_STATUS_CONST.ENABLE"
                @change="statusChange"/>
            </span>
            <span slot="sex" slot-scope="text">
              <e-dict-tag type="sex" :code="text"/>
            </span>
            <span slot="avatar" slot-scope="text, record">
              <e-avatar :avatar="text" :nickname="record.nickname"/>
            </span>
            <span slot="action" slot-scope="text, record">
              <e-btn-edit :permissions="SYS_PERMISSIONS_CODE.SYS_USER_SAVE" :to="`/sys/user/input`" :tab-name="record.nickname" :id="record.id"/>
              <e-btn-remove :permissions="SYS_PERMISSIONS_CODE.SYS_USER_REMOVE" :id="record.id" :click-callback="remove"/>
              <a-popconfirm
                v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_USER_RESET_PASSWORD)"
                :title="`确定要将密码重置为${defaultPassword}吗?`"
                @confirm="() => resetPassword(record.id)"
              >
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>重置密码</span>
                  </template>
                  <a-button type="danger" size="small" icon="undo"/>
                </a-tooltip>
              </a-popconfirm>
            </span>
          </s-table>
        </template>
      </e-pro-table>
    </a-col>
  </a-row>
</template>
<script>
import { Tree } from 'ant-design-vue'
import { STable, Ellipsis } from '@/components'
import EDictTag from '@/components/Easy/data-display/DictTag'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import EBtnAdd from '@/components/Easy/general/BtnAdd'
import EBtnEdit from '@/components/Easy/general/BtnEdit'
import EBtnRemove from '@/components/Easy/general/BtnRemove'
import EBtnRemoveBatch from '@/components/Easy/general/BtnRemoveBatch'
import {
  selectByPId,
  selectByTitle
} from '@/api/sys/dept'
import { convertTree, formatDate, isNotBlank } from '@/utils/util'
import {
  convertTreeData,
  generatorNodeIcon, updateNodeLeaf
} from '@/utils/ant-design/data-display/tree'
import { select, remove, disableUser, enableUser, resetPassword } from '@/api/sys/user'
import EProTable from '@/components/Easy/data-display/ProTable'
import { USER_STATUS_CONST } from '@/utils/const/sys/UserStatusConst'
import EAvatar from '@/components/Easy/data-display/Avatar'
import { successTip } from '@/utils/tips'
import { getByKey } from '@/api/sys/config'
import { SYS_CONFIG_KEY } from '@/utils/const/sys/SysConfigKey'
import { SYS_PERMISSIONS_CODE } from '@/utils/const/sys/PermissionsCode'

const baseId = '0'
const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    sorter: true,
    width: 120
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    sorter: true,
    width: 120
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    width: 80,
    scopedSlots: { customRender: 'avatar' }
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    sorter: true,
    width: 140
  },
  {
    title: '性别',
    dataIndex: 'sex',
    sorter: true,
    width: 80,
    scopedSlots: { customRender: 'sex' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    width: 100,
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '最后登录时间',
    dataIndex: 'lastLogin',
    sorter: true,
    width: 170,
    sortField: 'last_login',
    customRender: (text) => formatDate(text)
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    sorter: true,
    width: 170,
    customRender: (text) => formatDate(text)
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
  name: 'SysUserView',
  components: {
    EAvatar,
    EProTable,
    Tree,
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
      USER_STATUS_CONST: USER_STATUS_CONST,
      SYS_PERMISSIONS_CODE: SYS_PERMISSIONS_CODE,
      // 默认密码
      defaultPassword: null,

      query: '',
      search: false,
      noResults: false,
      searchTooltipVisible: false,

      // 树相关
      treeData: [],
      expandedKeys: [],
      selectedKeys: [],
      iconArrays: [],

      // 列表
      // 高级搜索 展开/关闭
      advanced: false,
      tableLoading: false,
      removeBathLoading: false,
      // 查询参数
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      switchLoading: []
    }
  },
  created () {
    this.firstLoadData()
    this.selectedKeys = [this.$store.getters.user.deptId]
    this.queryParam.deptId = this.$store.getters.user.deptId
    getByKey(SYS_CONFIG_KEY.DEFAULT_PASSWORD).then(res => {
      this.defaultPassword = res.data.value
    })
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
    firstLoadData () {
      this.query = ''
      this.search = false
      this.noResults = false
      this.searchTooltipVisible = false
      selectByPId(baseId).then(res => {
        this.treeData = convertTreeData(convertTree(res.data))
        if (this.treeData[0].id === baseId) {
          this.treeData[0].selectable = false
        }
        // 默认展开根节点
        this.expandedKeys.push(baseId)
        this.iconArrays = generatorNodeIcon(this.treeData, this.iconArrays)
      })
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    /**
     * 异步加载节点数据
     *
     * @param treeNode
     * @return {Promise<unknown>}
     */
    onLoadData (treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }

        this.loadData(treeNode.dataRef, () => {
          resolve()
        })
      })
    },
    loadData (treeNode, callback) {
      selectByPId(treeNode.id).then(res => {
        treeNode.children = convertTreeData(res.data)
        updateNodeLeaf(treeNode)
        this.treeData = [...this.treeData]
        if (callback) {
          callback()
        }
        this.iconArrays = generatorNodeIcon(this.treeData, this.iconArrays)
      })
    },
    onSearch () {
      if (isNotBlank(this.query)) {
        this.searchTooltipVisible = false
        this.search = true
        selectByTitle(this.query).then(res => {
          this.noResults = res.data.length === 0
          this.treeData = convertTreeData(res.data)
          this.iconArrays = generatorNodeIcon(this.treeData, this.iconArrays)
        })
      } else {
        this.searchTooltipVisible = true
      }
    },
    /**
     * 节点点击回调
     *
     * @param selectedKeys
     * @param e
     */
    onSelect (selectedKeys, e) {
      this.selectedKeys = selectedKeys
      if (e.node.dataRef.id !== baseId) {
        this.queryParam.deptId = e.node.dataRef.id
        this.$refs.eTable.refresh(true)
      }
    },
    // 加载数据方法 必须为 Promise 对象
    loadTableData (parameter) {
      const requestParameters = Object.assign({}, parameter, this.queryParam)
      return select(requestParameters)
        .then(res => {
          let dataLength = res.data.data.length
          while (dataLength--) {
            this.switchLoading[dataLength] = false
          }
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
    statusChange (checked, event) {
      const index = Number(event.target.dataset.index)
      this.switchLoading.splice(index, 1, true)
      if (checked) {
        enableUser(event.target.dataset.id).then(res => {
          this.switchLoading.splice(index, 1, false)
        })
      } else {
        disableUser(event.target.dataset.id).then(res => {
          this.switchLoading.splice(index, 1, false)
        })
      }
    },
    /**
     * 重置密码
     *
     * @param id {string} id
     */
    resetPassword (id) {
      resetPassword(id).then(res => {
        successTip('重置成功')
      })
    }
  }
}
</script>
