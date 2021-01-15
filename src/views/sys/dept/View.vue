<template>
  <a-row :gutter="16">
    <a-col :xl="6" :md="8">
      <a-card title="部门管理" :bordered="false" id="tree-card">
        <router-link slot="extra" to="/sys/dept/type">部门类型管理</router-link>

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
            @rightClick="rightClick"
          >
            <a-icon v-for="item in iconArrays" :key="item" :slot="item" :type="item"/>
          </tree>
          <a-button size="small" v-if="search" @click="firstLoadData">
            返回
          </a-button>
        </div>
        <div class="right-menu" v-show="rightMenuVisible" @click="onRightMenuClick">
          <div class="ant-dropdown" :style="{top: rightMenu.top + 'px', left: rightMenu.left + 'px'}">
            <ul
              class="ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-root ant-dropdown-menu-light ant-dropdown-content">
              <li data-key="add" class="ant-dropdown-menu-item">
                <a-icon type="plus"/>
                新增下级
              </li>
              <li
                data-key="edit"
                :class="['ant-dropdown-menu-item', rightMenuState.edit ? '' : 'ant-dropdown-menu-item-disabled']">
                <a-icon type="edit"/>
                修改
              </li>
              <li
                data-key="remove"
                :class="['ant-dropdown-menu-item', rightMenuState.remove ? '' : 'ant-dropdown-menu-item-disabled']">
                <a-icon type="delete"/>
                删除
              </li>
              <li
                data-key="copy"
                :class="['ant-dropdown-menu-item', rightMenuState.copy ? '' : 'ant-dropdown-menu-item-disabled']">
                <a-icon type="copy"/>
                复制
              </li>
              <li
                data-key="paste"
                :class="['ant-dropdown-menu-item', rightMenuState.paste ? '' : 'ant-dropdown-menu-item-disabled']">
                <a-icon type="snippets"/>
                粘贴
              </li>
              <li
                data-key="enable"
                :class="['ant-dropdown-menu-item', rightMenuState.enable ? '' : 'ant-dropdown-menu-item-disabled']">
                <a-icon type="check"/>
                启用
              </li>
              <li
                data-key="disable"
                :class="['ant-dropdown-menu-item', rightMenuState.disable ? '' : 'ant-dropdown-menu-item-disabled']">
                <a-icon type="stop"/>
                禁用
              </li>
            </ul>
          </div>
        </div>
      </a-card>
    </a-col>
    <a-col :xl="18" :md="16">
      <a-card title="部门详情" :bordered="false">
        <a-form-model
          ref="form"
          :model="model"
          :rules="rules"
          v-if="hasData"
          :label-col="formLayout.labelCol"
          :wrapper-col="formLayout.wrapperCol">
          <a-row class="form-row" :gutter="16">
            <a-col :lg="12" :sm="24">
              <a-form-model-item label="部门类型" prop="typeCode">
                <a-select show-search option-filter-prop="children" v-model="model.typeCode">
                  <a-select-option v-for="item in departTypes" :key="item.value">
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :lg="12" :sm="24">
              <a-form-model-item label="上级部门" prop="pId">
                <a-select show-search option-filter-prop="children" v-model="model.pId">
                  <a-select-option v-if="parentDeparts.length > 0" v-for="item in parentDeparts" :key="item.value">
                    {{ item.text }}
                  </a-select-option>
                  <a-select-option v-if="parentDeparts.length === 0" key="0">无</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :lg="12" :sm="24">
              <a-form-model-item label="部门名称" prop="name">
                <a-input v-model="model.name"/>
              </a-form-model-item>
            </a-col>
            <a-col :lg="12" :sm="24">
              <a-form-model-item label="部门编码" prop="code">
                <a-input v-model="model.code"/>
              </a-form-model-item>
            </a-col>
            <a-col :lg="12" :sm="24">
              <a-form-model-item label="部门简称" prop="simpleName">
                <a-input v-model="model.simpleName"/>
              </a-form-model-item>
            </a-col>
            <a-col :lg="12" :sm="24">
              <a-form-model-item label="状态" prop="status">
                <e-dict-radio name="status" v-model="model.status" type="commonStatus"/>
              </a-form-model-item>
            </a-col>
            <a-col :lg="12" :sm="24">
              <a-form-model-item label="排序值" prop="orderNo">
                <a-tooltip placement="top" title="数字越小排名越靠前">
                  <a-input-number v-model="model.orderNo"/>
                </a-tooltip>
              </a-form-model-item>
            </a-col>
            <a-col :sm="24">
              <a-form-model-item label="备注" :labelCol="{ span: 3 }" :wrapperCol="{ span: 19 }">
                <a-textarea v-model="model.tips"/>
              </a-form-model-item>
            </a-col>
            <a-col :sm="24">
              <div class="input-btn-group">
                <e-btn-save :loading="saveLoading" :click-callback="save"/>
                <a-popconfirm
                  title="确定要删除吗?"
                  @confirm="() => remove(model.id)"
                >
                  <a-button type="danger" icon="delete" v-if="model.id != null && model.id !== ''">
                    删除
                  </a-button>
                </a-popconfirm>

                <a-button type="default" icon="plus" @click="add(model.id)" v-if="model.id != null && model.id !== '' && canAdd">
                  新增下级
                </a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </a-card>
    </a-col>
  </a-row>
</template>
<script>
  import { Tree } from 'ant-design-vue'
  import {
    selectByPId,
    get,
    save,
    add,
    remove,
    setStatus,
    selectByTitle,
    selectDeptTypeOption,
    selectUpDeptOption
  } from '@/api/sys/dept'
  import { convertTree, getElementOffset, isBlank, isNotBlank } from '@/utils/util'
  import EDictRadio from '@/components/Easy/data-entry/DictRadio'
  import { removeSuccessTip, saveSuccessTip, successTip } from '@/utils/tips'
  import {
    convertTreeData,
    getTreeNode,
    removeTreeNode, updateNodeLeaf,
    updateTreeNode,
    generatorNodeIcon
  } from '@/utils/ant-design/data-display/tree'
  import { checkHasChild } from '@/api/sys/dept-type'
  import { FORM_LAYOUT } from '@/utils/const/form'
  import EBtnSave from '@/components/Easy/general/BtnSave'

  const baseId = '0'

  export default {
    name: 'SysDeptView',
    components: {
      EBtnSave,
      EDictRadio,
      Tree
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

        // 右键菜单
        rightClickChoseNode: null,
        rightMenuVisible: false,
        copyCacheNode: null,
        rightMenu: {
          top: 0,
          right: 0
        },
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
        formLayout: FORM_LAYOUT,
        model: {},
        canAdd: false,
        departTypes: [],
        parentDeparts: [],
        rules: {
          typeCode: [
            { required: true, message: '请选择部门类型', trigger: 'blur' }
          ],
          pId: [
            { required: true, message: '请选择上级部门', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入部门名称', trigger: 'blur' },
            { max: 100, message: '部门名称字数不能超过100个字符', trigger: 'blur' }
          ],
          code: [
            { max: 50, message: '部门编码字数不能超过50个字符', trigger: 'blur' }
          ],
          sampleName: [
            { max: 20, message: '部门简称字数不能超过20个字符', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择部门状态', trigger: 'blur' }
          ],
          orderNo: [
            { required: true, message: '请输入排序值', trigger: 'blur' },
            { type: 'number', max: 999, message: '排序值不能大于999', trigger: 'blur' },
            { type: 'number', min: 0, message: '排序值不能小于0', trigger: 'blur' }
          ],
          tips: [
            { max: 200, message: '备注不能超过200个字符', trigger: 'blur' }
          ]

        }
      }
    },
    created () {
      this.firstLoadData()
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
      rightClick ({ event, node }) {
        this.rightClickChoseNode = node.dataRef
        this.rightMenu.left = event.pageX - this.elementOffset.actualLeft
        this.rightMenu.top = event.pageY - this.elementOffset.actualTop
        this.rightMenuVisible = true
        document.addEventListener('click', this.closeRightMenu)
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
      onRightMenuClick (e) {
        if (e.target.nodeName === 'LI') {
          const key = e.target.dataset.key
          console.log('key', key)
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
        }
      },
      closeRightMenu () {
        this.rightMenuVisible = false
        document.removeEventListener('click', this.closeRightMenu)
      },
      add (id) {
        add(id).then((res) => {
          this.hasData = true
          this.selectedKeys = []
          this.model = res.data
          selectDeptTypeOption(this.model.pId, this.model.typeCode).then(res => {
            this.departTypes = res.data
            if (isBlank(this.model.typeCode) && this.departTypes.length > 0) {
              // 默认第一个类型
              this.model.typeCode = this.departTypes[0].value
            }
            selectUpDeptOption(this.model.pId, this.model.typeCode).then(res => {
              this.parentDeparts = res.data
            })
          })
        })
      },
      edit (id) {
        get(id).then((res) => {
          this.hasData = true
          this.model = res.data
          selectDeptTypeOption(this.model.pId, this.model.typeCode).then(res => {
            this.departTypes = res.data
          })
          selectUpDeptOption(this.model.pId, this.model.typeCode).then(res => {
            this.parentDeparts = res.data
          })

          checkHasChild(this.model.typeCode).then(res => {
            this.canAdd = res.data
          })
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
                  title: this.model.name
                })
              } else {
                this.model = res.data
                const treeNode = getTreeNode(this.treeData, res.data.pId)
                if (treeNode.children) {
                  treeNode.children.push({
                    id: this.model.id,
                    key: this.model.id,
                    title: this.model.name,
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
      }
    }
  }
</script>
