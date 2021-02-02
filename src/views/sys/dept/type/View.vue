<template>
  <a-row :gutter="16">
    <a-col :xl="6" :md="8">
      <a-card title="部门类型管理" :bordered="false" id="tree-card">
        <a-tooltip placement="top" :visible="searchTooltipVisible">
          <template slot="title">
            <span>请输入部门类型名称后查询</span>
          </template>
          <a-input-search v-model="query" placeholder="输入类型名称搜索" @search="onSearch"/>
        </a-tooltip>

        <div class="tree-wrapper">
          <a-alert v-if="noResults" :style="{marginTop: '5px', marginBottom: '5px'}" message="未查询到数据" banner/>
          <a-dropdown :trigger="['contextmenu']" :visible="rightMenuVisible">
            <tree
              :load-data="onLoadData"
              :tree-data="treeData"
              :expanded-keys="expandedKeys"
              :selected-keys="selectedKeys"
              show-icon
              draggable
              show-line
              @drop="onDrop"
              @select="onSelect"
              @expand="onExpand"
              @rightClick="rightClick"
            >
              <a-icon v-for="item in iconArrays" :key="item" :slot="item" :type="item"/>
            </tree>

            <a-menu slot="overlay" @click="onRightMenuClick">
              <a-menu-item key="add" v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_DEPT_TYPE_SAVE)"><a-icon type="plus"/> 新增下级</a-menu-item>
              <a-menu-item key="edit" v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_DEPT_TYPE_SAVE)" :disabled="!rightMenuState.edit"><a-icon type="edit"/> 修改</a-menu-item>
              <a-menu-item key="remove" v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_DEPT_TYPE_REMOVE)" :disabled="!rightMenuState.remove"><a-icon type="delete"/> 删除</a-menu-item>
              <a-menu-item key="enable" v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_DEPT_TYPE_SAVE)" :disabled="!rightMenuState.enable"><a-icon type="check"/> 启用</a-menu-item>
              <a-menu-item key="disable" v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_DEPT_TYPE_SAVE)" :disabled="!rightMenuState.disable"><a-icon type="stop"/> 禁用</a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-button size="small" v-if="search" @click="firstLoadData">
            返回
          </a-button>
        </div>
      </a-card>
    </a-col>
    <a-col :xl="18" :md="16">
      <a-card title="部门类型详情" :bordered="false">
        <a-form-model
          ref="form"
          :model="model"
          :rules="rules"
          v-if="hasData"
          :label-col="FORM_LAYOUT.labelCol"
          :wrapper-col="FORM_LAYOUT.wrapperCol">
          <a-row class="form-row" :gutter="16">
            <a-col :xl="12" :lg="24">
              <a-form-model-item label="上级类型">
                <a-input v-model="model.pName" :disabled="true"/>
              </a-form-model-item>
              <a-form-model-item label="类型代码" prop="code">
                <a-input v-model="model.code"/>
              </a-form-model-item>
              <a-form-model-item label="类型名称" prop="name">
                <a-input v-model="model.name"/>
              </a-form-model-item>
              <a-form-model-item label="状态" prop="status">
                <e-dict-radio name="status" v-model="model.status" type="commonStatus"/>
              </a-form-model-item>
              <a-form-model-item label="备注">
                <a-textarea v-model="model.tips"/>
              </a-form-model-item>
            </a-col>
            <a-col :xl="12" :lg="24">
              <div class="tree-wrapper">
                <tree
                  ref="roleTree"
                  v-model="roleCheckedKeys"
                  :tree-data="roleTreeData"
                  :expanded-keys="roleExpandedKeys"
                  :checkStrictly="checkStrictly"
                  show-icon
                  show-line
                  checkable
                  @expand="onRoleExpand"
                >
                  <a-icon v-for="item in iconArrays" :key="item" :slot="item" :type="item"/>
                </tree>
              </div>
            </a-col>
            <a-col :sm="24">
              <div class="input-btn-group">
                <e-btn-save :loading="saveLoading" :click-callback="save"/>
                <a-popconfirm
                  title="确定要删除吗?"
                  @confirm="() => remove(model.id)"
                >
                  <a-button type="danger" icon="delete" v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_DEPT_TYPE_REMOVE) && model.id != null && model.id !== ''">
                    删除
                  </a-button>
                </a-popconfirm>

                <a-button type="default" icon="plus" @click="$permissions(SYS_PERMISSIONS_CODE.SYS_DEPT_TYPE_SAVE) && add(model.id)" v-if="model.id != null && model.id !== ''">
                  新增下级
                </a-button>
                <a-dropdown :trigger="['click']" placement="topCenter">
                  <a-menu slot="overlay" @click="handleTreeHelpClick">
                    <a-menu-item key="enableRelation"> 父子关联</a-menu-item>
                    <a-menu-item key="disableRelation"> 取消关联</a-menu-item>
                    <a-menu-item key="checkAll"> 全部勾选</a-menu-item>
                    <a-menu-item key="unCheckAll"> 全部取消</a-menu-item>
                    <a-menu-item key="expandAll"> 展开所有</a-menu-item>
                    <a-menu-item key="unExpandAll"> 收起所有</a-menu-item>
                  </a-menu>
                  <a-button> 树操作
                    <a-icon type="up"/>
                  </a-button>
                </a-dropdown>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </a-card>
    </a-col>
  </a-row>
</template>
<script>
import IconSelector from '@/components/IconSelector'
import { Tree } from 'ant-design-vue'
import { selectByPId, get, save, add, remove, move, setStatus, selectByTitle } from '@/api/sys/dept-type'
import { convertTree, getElementOffset, isNotBlank } from '@/utils/util'
import EDictRadio from '@/components/Easy/data-entry/DictRadio'
import { removeSuccessTip, saveSuccessTip, successTip } from '@/utils/tips'
import {
  convertTreeData, dropNode,
  generatorNodeIcon, getAllKeys,
  getTreeNode,
  removeTreeNode, updateNodeLeaf,
  updateTreeNode
} from '@/utils/ant-design/data-display/tree'
import { selectAll } from '@/api/sys/role'
import { FORM_LAYOUT } from '@/utils/const/form'
import EBtnSave from '@/components/Easy/general/BtnSave'

const baseId = '0'

export default {
  name: 'SysDeptTypeView',
  components: {
    EBtnSave,
    EDictRadio,
    Tree,
    IconSelector
  },
  data () {
    return {
      query: '',
      search: false,
      noResults: false,
      searchTooltipVisible: false,

      elementOffset: {},
      // 树相关
      treeData: [],
      expandedKeys: [],
      selectedKeys: [],
      iconArrays: [],

      // 树相关 - 角色
      roleTreeData: [],
      roleExpandedKeys: [],
      roleCheckedKeys: {
        checked: [],
        halfChecked: []
      },
      checkStrictly: true,

      // 右键菜单
      rightClickChoseNode: null,
      rightMenuVisible: false,
      rightMenuState: {
        edit: false,
        remove: false,
        copy: false,
        paste: false,
        enable: false,
        disable: false
      },

      // 表单
      saveLoading: false,
      hasData: false,
      FORM_LAYOUT: FORM_LAYOUT,
      model: {},
      rules: {
        code: [
          { required: true, message: '请输入类型代码', trigger: 'blur' },
          { max: 10, message: '类型代码字数不能超过10个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入类型名称', trigger: 'blur' },
          { max: 50, message: '类型名称字数不能超过50个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
        tips: [
          { max: 200, message: '备注字数不能超过200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.firstLoadData()
    this.loadRoleTree()
  },
  mounted () {
    this.firstLoadData()
    this.loadRoleTree()
    document.addEventListener('click', this.closeRightMenu)
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
        this.elementOffset = getElementOffset(document.getElementById('tree-card'))
      })
    },
    loadRoleTree () {
      selectAll().then((res) => {
        this.roleTreeData = convertTreeData(convertTree(res.data))
        if (this.roleTreeData[0].id === baseId) {
          this.roleTreeData[0].selectable = false
        }
        // 默认展开根节点
        this.roleExpandedKeys.push(baseId)
        this.iconArrays = generatorNodeIcon(this.roleTreeData, this.iconArrays)
      })
    },
    onRoleExpand (expandedKeys) {
      this.roleExpandedKeys = expandedKeys
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
        this.edit(e.node.dataRef.id)
      }
    },
    onDrop (info) {
      const { data, loadDataNode, id, parent, oldParent, position, oldPosition } = dropNode(this.treeData, info)
      if (parent !== oldParent || position !== oldPosition) {
        move(id, parent, oldParent, position, oldPosition).then(() => {
          saveSuccessTip()

          if (loadDataNode) {
            this.loadData(loadDataNode)
          }
        })
      }
      this.treeData = data
    },
    rightClick ({ node }) {
      this.rightClickChoseNode = node.dataRef
      this.rightMenuVisible = true
      Object.keys(this.rightMenuState).forEach((key) => {
        this.rightMenuState[key] = false
      })
      if (this.rightClickChoseNode.id !== baseId) {
        this.rightMenuState.edit = true
        this.rightMenuState.remove = true
        this.rightMenuState.enable = true
        this.rightMenuState.disable = true
      }
    },
    onRightMenuClick ({ key }) {
        switch (key) {
          case 'add':
            this.add(this.rightClickChoseNode.id)
            break
          case 'edit':
            this.edit(this.rightClickChoseNode.id)
            break
          case 'remove':
            const vm = this
            this.$confirm({
              title: '确定要删除"' + this.rightClickChoseNode.title + '"吗？',
              content: '删除后无法恢复，请谨慎操作',
              onOk () {
                vm.remove(vm.rightClickChoseNode.id)
              }
            })
            break
          case 'enable':
            this.setStatus(this.rightClickChoseNode.id, 1)
            break
          case 'disable':
            this.setStatus(this.rightClickChoseNode.id, 2)
            break
        }
    },
    closeRightMenu () {
      this.rightMenuVisible = false
    },
    add (id) {
      add(id).then((res) => {
        this.hasData = true
        this.selectedKeys = []
        this.model = res.data
        this.roleCheckedKeys = res.data.roles
      })
    },
    edit (id) {
      get(id).then((res) => {
        this.hasData = true
        this.model = res.data
        this.roleCheckedKeys = res.data.roles
      })
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveLoading = true
          if (this.roleCheckedKeys && this.roleCheckedKeys.checked) {
            this.model.roles = this.roleCheckedKeys.checked
          } else {
            this.model.roles = this.roleCheckedKeys
          }
          save(this.model).then((res) => {
            this.saveLoading = false
            saveSuccessTip()
            if (this.model.id != null) {
              this.model = res.data
              updateTreeNode(this.treeData, {
                key: this.model.id,
                title: this.model.name,
                slots: { icon: this.model.icon ? this.model.icon : null }
              })
            } else {
              this.model = res.data
              const treeNode = getTreeNode(this.treeData, res.data.pId)
              if (treeNode.children) {
                treeNode.children.push({
                  id: this.model.id,
                  key: this.model.id,
                  title: this.model.name,
                  slots: { icon: this.model.icon ? this.model.icon : null },
                  isLeaf: true
                })
              } else {
                this.loadData(treeNode)
              }
            }

            generatorNodeIcon(this.treeData, this.iconArrays)
          }).catch(({ response }) => {
            this.saveLoading = false
          })
        }
      })
    },
    remove (id) {
      remove(id).then((res) => {
        this.selectedKeys = [id]
        this.hasData = false
        removeSuccessTip()
        removeTreeNode(this.treeData, [id])
        this.model = null
      })
    },
    setStatus (id, status) {
      setStatus(id, status).then((res) => {
        successTip()
        if (this.model.id === id) {
          this.model.status = status
        }
      })
    },
    handleTreeHelpClick ({ key }) {
      switch (key) {
        case 'enableRelation':
          this.checkStrictly = false
          break
        case 'disableRelation':
          this.checkStrictly = true
          break
        case 'checkAll':
          if (this.checkStrictly) {
            this.roleCheckedKeys = {
              checked: getAllKeys(this.roleTreeData),
              halfChecked: []
            }
          } else {
            this.roleCheckedKeys = getAllKeys(this.roleTreeData)
          }
          break
        case 'unCheckAll':
          if (this.checkStrictly) {
            this.roleCheckedKeys = {
              checked: [],
              halfChecked: []
            }
          } else {
            this.roleCheckedKeys = []
          }
          break
        case 'expandAll':
          this.roleExpandedKeys = getAllKeys(this.roleTreeData)
          break
        case 'unExpandAll':
          this.roleExpandedKeys = [baseId]
          break
      }
    }
  },
  beforeDestroy () {
    // 删除绑定的click事件
    window.removeEventListener('click', this.closeRightMenu)
  }
}
</script>
