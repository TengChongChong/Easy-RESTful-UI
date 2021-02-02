<template>
  <a-row :gutter="16">
    <a-col :xl="6" :md="8">
      <a-card title="菜单管理" :bordered="false" id="tree-card">
        <a-tooltip placement="top" :visible="searchTooltipVisible">
          <template slot="title">
            <span>请输入菜单名称后查询</span>
          </template>
          <a-input-search v-model="query" placeholder="输入菜单名称搜索" @search="onSearch"/>
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
              :draggable="$permissions(SYS_PERMISSIONS_CODE.SYS_PERMISSIONS_MOVE)"
              show-line
              @drop="onDrop"
              @select="onSelect"
              @expand="onExpand"
              @rightClick="rightClick"
            >
              <a-icon v-for="item in iconArrays" :key="item" :slot="item" :type="item"/>
            </tree>
            <a-menu slot="overlay" @click="onRightMenuClick">
              <a-menu-item key="add" v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_PERMISSIONS_SAVE)"><a-icon type="plus"/> 新增下级</a-menu-item>
              <a-menu-item key="edit" v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_PERMISSIONS_SAVE)" :disabled="!rightMenuState.edit"><a-icon type="edit"/> 修改</a-menu-item>
              <a-menu-item key="remove" v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_PERMISSIONS_REMOVE)" :disabled="!rightMenuState.remove"><a-icon type="delete"/> 删除</a-menu-item>
              <a-menu-item key="copy" v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_PERMISSIONS_SAVE)" :disabled="!rightMenuState.copy"><a-icon type="copy"/> 复制</a-menu-item>
              <a-menu-item key="paste" v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_PERMISSIONS_SAVE)" :disabled="!rightMenuState.paste"><a-icon type="paste"/> 粘贴</a-menu-item>
              <a-menu-item key="enable" v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_PERMISSIONS_SAVE)" :disabled="!rightMenuState.enable"><a-icon type="check"/> 启用</a-menu-item>
              <a-menu-item key="disable" v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_PERMISSIONS_SAVE)" :disabled="!rightMenuState.disable"><a-icon type="stop"/> 禁用</a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-button size="small" v-if="search" @click="firstLoadData">
            返回
          </a-button>
        </div>
      </a-card>
    </a-col>
    <a-col :xl="18" :md="16">
      <a-card title="菜单详情" :bordered="false">
        <a-form-model
          ref="form"
          :model="model"
          :rules="rules"
          v-if="hasData"
          :label-col="FORM_LAYOUT.labelCol"
          :wrapper-col="FORM_LAYOUT.wrapperCol">
          <a-row class="form-row" :gutter="16">
            <a-col :xl="12" :lg="24">
              <a-form-model-item label="上级菜单">
                <a-input v-model="model.pName" :disabled="true"/>
              </a-form-model-item>
            </a-col>
            <a-col :xl="12" :lg="24">
              <a-form-model-item label="菜单类型" prop="type">
                <e-dict-radio name="type" v-model="model.type" type="permissionsType"/>
              </a-form-model-item>
            </a-col>
            <a-col :xl="12" :lg="24">
              <a-form-model-item label="菜单名称" prop="name">
                <a-input v-model="model.name"/>
              </a-form-model-item>
            </a-col>
            <a-col :xl="12" :lg="24">
              <a-form-model-item prop="code">
                <span slot="label">
                  权限标识
                  <a-tooltip title="controller中定义的权限标识">
                    <a-icon type="question-circle-o"/>
                  </a-tooltip>
                </span>
                <a-input v-model="model.code"/>
              </a-form-model-item>
            </a-col>
            <a-col :xl="12" :lg="24" v-if="model.type === PERMISSIONS_TYPE_CONST.MENU">
              <a-form-model-item label="链接(Path)" prop="path">
                <a-input v-model="model.path"/>
              </a-form-model-item>
            </a-col>
            <a-col :xl="12" :lg="24" v-if="model.type === PERMISSIONS_TYPE_CONST.MENU">
              <a-form-model-item label="页面地址" class="component-input" prop="component">
                <a-input v-model="model.component" prefix="@/views"/>
              </a-form-model-item>
            </a-col>
            <a-col :xl="12" :lg="24">
              <a-form-model-item label="状态" prop="status">
                <e-dict-radio name="status" v-model="model.status" type="commonStatus"/>
              </a-form-model-item>
            </a-col>
            <a-col :xl="12" :lg="24" v-if="model.type === PERMISSIONS_TYPE_CONST.MENU">
              <a-form-model-item label="是否显示" prop="hide">
                <e-dict-radio name="hide" v-model="model.hide" type="hideMenu"/>
              </a-form-model-item>
            </a-col>
            <a-col :xl="12" :lg="24" v-if="model.type === PERMISSIONS_TYPE_CONST.MENU">
              <a-form-model-item label="图标" prop="icon">
                <a-input v-model="model.icon" @click="handleIconInputClick">
                  <a-icon slot="addonAfter" v-if="model.icon != null && model.icon !== ''" :type="model.icon"/>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :xl="12" :lg="24" v-if="model.type === PERMISSIONS_TYPE_CONST.MENU">
              <a-form-model-item label="打开方式">
                <e-dict-radio name="target" v-model="model.target" type="target"/>
              </a-form-model-item>
            </a-col>
            <a-col :xl="12" :lg="24">
              <a-form-model-item label="备注">
                <a-textarea v-model="model.tips"/>
              </a-form-model-item>
            </a-col>
            <a-col :sm="24">
              <div class="input-btn-group">
                <e-btn-save :permissions="SYS_PERMISSIONS_CODE.SYS_PERMISSIONS_SAVE" :loading="saveLoading" :click-callback="save"/>
                <a-popconfirm
                  title="确定要删除吗?"
                  @confirm="() => remove(model.id)"
                >
                  <a-button type="danger" icon="delete" v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_PERMISSIONS_REMOVE) && model.id != null && model.id !== ''">
                    删除
                  </a-button>
                </a-popconfirm>

                <a-button type="default" icon="plus" @click="$permissions(SYS_PERMISSIONS_CODE.SYS_PERMISSIONS_SAVE) && add(model.id)" v-if="model.id != null && model.id !== ''">
                  新增下级
                </a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
        <a-modal width="960px" v-model="iconModalVisible" title="选择图标" @ok="handleOk">
          <icon-selector v-model="currentSelectedIcon" @change="handleIconChange"/>
        </a-modal>
      </a-card>
    </a-col>
  </a-row>
</template>
<script>
import IconSelector from '@/components/IconSelector'
import { Tree } from 'ant-design-vue'
import { selectByPId, get, save, add, remove, move, setStatus, copyNodes, selectByTitle } from '@/api/sys/permissions'
import { convertTree, getElementOffset, isNotBlank } from '@/utils/util'
import EDictRadio from '@/components/Easy/data-entry/DictRadio'
import {
  convertTreeData, dropNode,
  generatorNodeIcon,
  getTreeNode,
  removeTreeNode, updateNodeLeaf,
  updateTreeNode
} from '@/utils/ant-design/data-display/tree'
import { FORM_LAYOUT, FULL_FORM_LAYOUT } from '@/utils/const/form'
import { removeSuccessTip, saveSuccessTip, successTip } from '@/utils/tips'
import EBtnSave from '@/components/Easy/general/BtnSave'
import { PERMISSIONS_TYPE_CONST } from '@/utils/const/sys/PermissionsTypeConst'
import { SYS_PERMISSIONS_CODE } from '@/utils/const/sys/PermissionsCode'

const baseId = '0'

export default {
  name: 'SysPermissionsView',
  components: {
    EBtnSave,
    EDictRadio,
    Tree,
    IconSelector
  },
  data () {
    return {
      SYS_PERMISSIONS_CODE: SYS_PERMISSIONS_CODE,

      PERMISSIONS_TYPE_CONST: PERMISSIONS_TYPE_CONST,

      query: '',
      search: false,
      noResults: false,
      searchTooltipVisible: false,
      // 显示图标对话框
      iconModalVisible: false,
      currentSelectedIcon: null,

      elementOffset: {},
      // 树相关
      treeData: [],
      expandedKeys: [],
      selectedKeys: [],
      iconArrays: [],

      // 右键菜单
      rightClickChoseNode: null,
      rightMenuVisible: false,
      copyCacheNode: null,
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
      FULL_FORM_LAYOUT: FULL_FORM_LAYOUT,
      model: {},
      rules: {
        type: [
          { required: true, message: '请选择菜单类型', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { max: 10, message: '菜单名称字数不能超过10个字符', trigger: 'blur' }
        ],
        code: [
          { max: 50, message: '权限标识不能超过50个字符', trigger: 'blur' }
        ],
        path: [
          { max: 200, message: '链接(Path)不能超过200个字符', trigger: 'blur' }
        ],
        component: [
          { max: 200, message: '页面地址不能超过200个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择菜单状态', trigger: 'blur' }
        ],
        hide: [
          { required: true, message: '请选择是否显示', trigger: 'blur' }
        ],
        icon: [
          { max: 32, message: '图标不能超过32个字符', trigger: 'blur' }
        ],
        tips: [
          { max: 200, message: '备注不能超过200个字符', trigger: 'blur' }
        ]
      },
      created: false
    }
  },
  mounted () {
    this.firstLoadData()
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
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    handleIconChange (icon) {
      this.currentSelectedIcon = icon
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
        this.rightMenuState.copy = true
        this.rightMenuState.enable = true
        this.rightMenuState.disable = true
      }
      if (this.copyCacheNode != null) {
        this.rightMenuState.paste = true
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
        case 'copy':
          this.copyCacheNode = this.rightClickChoseNode
          break
        case 'paste':
          this.copyNodes()
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
    handleIconInputClick () {
      this.currentSelectedIcon = this.model.icon
      this.iconModalVisible = true
    },
    handleOk () {
      this.model.icon = this.currentSelectedIcon
      this.iconModalVisible = false
    },
    add (id) {
      add(id).then((res) => {
        this.hasData = true
        this.selectedKeys = []
        this.model = res.data
      })
    },
    edit (id) {
      get(id).then((res) => {
        this.hasData = true
        this.model = res.data
      })
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveLoading = true
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
    copyNodes () {
      const nodeIds = this.copyCacheNode.id
      const targetId = this.rightClickChoseNode.id
      copyNodes(nodeIds, targetId).then((res) => {
        const treeNode = getTreeNode(this.treeData, targetId)
        if (treeNode.children) {
          res.data.forEach((item) => {
            treeNode.children.push({
              id: item.id,
              key: item.id,
              title: item.name,
              slots: { icon: item.icon ? item.icon : null },
              isLeaf: true
            })
          })
          updateNodeLeaf(treeNode)
        } else {
          this.loadData(treeNode)
        }
        successTip()
      })
    }
  },
  beforeDestroy () {
    // 删除绑定的click事件
    window.removeEventListener('click', this.closeRightMenu)
  }
}
</script>
<style>
.component-input .ant-input-affix-wrapper .ant-input:not(:first-child) {
  padding-left: 70px;
}

.component-input .ant-input-affix-wrapper .ant-input-prefix {
  color: #888;
}
</style>
