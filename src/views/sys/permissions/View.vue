<template>
  <a-row :gutter="20">
    <a-col :xl="6" :md="8">
      <a-card title="菜单管理" :bordered="false">
        <tree
          :load-data="onLoadData"
          :tree-data="treeData"
          :expanded-keys="expandedKeys"
          :selected-keys="selectedKeys"
          show-icon
          @select="onSelect"
          @expand="onExpand">
          <a-icon v-for="item in iconArrays" :key="item" :slot="item" :type="item"/>
        </tree>
      </a-card>
    </a-col>
    <a-col :xl="18" :md="16">
      <a-card title="菜单详情" :bordered="false">
        <a-form-model
          ref="form"
          :model="menu"
          :rules="rules"
          v-show="hasData"
          :label-col="labelCol"
          :wrapper-col="wrapperCol">
          <a-row class="form-row" :gutter="16">
            <a-col :lg="12" :sm="24">
              <a-form-model-item label="上级菜单">
                <a-input v-model="menu.pName" :disabled="true"/>
              </a-form-model-item>
            </a-col>
            <a-col :lg="12" :sm="24">
              <a-form-model-item label="菜单类型" prop="type">
                <dict-radio name="type" v-model="menu.type" type="permissionsType"/>
              </a-form-model-item>
            </a-col>
            <a-col :lg="12" :sm="24">
              <a-form-model-item label="菜单名称" prop="name">
                <a-input v-model="menu.name"/>
              </a-form-model-item>
            </a-col>
            <a-col :lg="12" :sm="24">
              <a-form-model-item label="权限标识">
                <a-input v-model="menu.code"/>
              </a-form-model-item>
            </a-col>
            <a-col :lg="12" :sm="24">
              <a-form-model-item label="链接(Path)">
                <a-input v-model="menu.path"/>
              </a-form-model-item>
            </a-col>
            <a-col :lg="12" :sm="24">
              <a-form-model-item label="页面地址" class="component-input">
                <a-input v-model="menu.component" prefix="@/views"/>
              </a-form-model-item>
            </a-col>
            <a-col :lg="12" :sm="24">
              <a-form-model-item label="状态" prop="status">
                <dict-radio name="status" v-model="menu.status" type="commonStatus"/>
              </a-form-model-item>
            </a-col>
            <a-col :lg="12" :sm="24">
              <a-form-model-item label="图标">
                <a-input v-model="menu.icon" @click="handleIconInputClick">
                  <a-icon slot="addonAfter" v-if="menu.icon != null && menu.icon !== ''" :type="menu.icon" />
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :sm="24">
              <a-form-model-item label="备注" :labelCol="{ span: 3 }" :wrapperCol="{ span: 19 }">
                <a-textarea v-model="menu.tips"/>
              </a-form-model-item>
            </a-col>
            <a-col :sm="24">
              <div class="input-btn-group">
                <a-button type="primary" icon="save" @click="save">
                  保存
                </a-button>
                <a-popconfirm
                  title="确定要删除吗?"
                  @confirm="() => remove()"
                >
                  <a-button type="danger" icon="delete" v-if="menu.id != null && menu.id !== ''">
                    删除
                  </a-button>
                </a-popconfirm>

                <a-button type="default" icon="plus" @click="add" v-if="menu.id != null && menu.id !== ''">
                  新增下级
                </a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
        <a-modal v-model="iconModalVisible" title="选择图标" @ok="handleOk">
          <icon-selector v-model="currentSelectedIcon" @change="handleIconChange"/>
        </a-modal>
      </a-card>
    </a-col>
  </a-row>
</template>
<script>
  import IconSelector from '@/components/IconSelector'
  import { Tree } from 'ant-design-vue'
  import { selectByPId, get, save, add, remove } from '@/api/sys/permissions'
  import { convertTree, convertTreeData, getTreeNode, removeTreeNode, updateTreeNode } from '@/utils/util'
  import DictRadio from '@/components/Easy/DictRadio'
  import DictCheckbox from '@/components/Easy/DictCheckbox'
  import { removeSuccessTip, saveSuccessTip } from '@/utils/tips'

  const baseId = '0'
  export default {
    components: {
      DictCheckbox,
      DictRadio,
      Tree,
      IconSelector
    },
    data () {
      return {
        // 显示图标对话框
        iconModalVisible: false,
        hasData: false,

        treeData: [],
        expandedKeys: [],
        selectedKeys: [],
        iconArrays: [],

        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        menu: {},

        currentSelectedIcon: null,

        rules: {
          name: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
            { max: 10, message: '菜单名称字数不能超过10个字符', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择菜单类型', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择菜单状态', trigger: 'blur' }
          ]

        }
      }
    },
    created () {
      selectByPId(baseId).then(res => {
        this.treeData = convertTreeData(convertTree(res.data))
        console.log(this.treeData)
        if (this.treeData[0].id === baseId) {
          this.treeData[0].selectable = false
        }
        // 默认展开根节点
        this.expandedKeys.push(baseId)
        this.generatorIcon()
      })
    },
    methods: {
      onExpand (expandedKeys) {
        this.expandedKeys = expandedKeys
      },
      handleIconChange (icon) {
        this.currentSelectedIcon = icon
      },
      /**
       * 获取菜单中所有图标
       */
      generatorIcon () {
        this.iconArrays = []
        function addIcon (icon, iconArrays) {
          if (icon) {
            let isHaving = false
            iconArrays.map((item) => {
              if (item === icon) {
                isHaving = true
              }
            })
            if (!isHaving) {
              iconArrays.push(icon)
            }
          }
        }

        function getIcon (items, iconArrays) {
          items.map((item) => {
            addIcon(item.icon, iconArrays)
            if (item.children) {
              getIcon(item.children, iconArrays)
            }
          })
        }

        getIcon(this.treeData, this.iconArrays)
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
          selectByPId(treeNode.dataRef.id).then(res => {
            treeNode.dataRef.children = convertTreeData(res.data)
            this.treeData = [...this.treeData]
            this.generatorIcon()
            resolve()
          })
        })
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
          get(e.node.dataRef.id).then((res) => {
            this.hasData = true
            this.menu = res.data
          })
        }
      },
      handleIconInputClick () {
        this.currentSelectedIcon = this.menu.icon
        this.iconModalVisible = true
      },
      handleOk () {
        this.menu.icon = this.currentSelectedIcon
        this.iconModalVisible = false
      },
      add () {
        add(this.menu.id).then((res) => {
          this.selectedKeys = []
          this.menu = res.data
        })
      },
      save () {
        this.$refs.form.validate(valid => {
          if (valid) {
            save(this.menu).then((res) => {
              saveSuccessTip()
              if (this.menu.id != null) {
                this.menu = res.data
                this.treeData = updateTreeNode(this.treeData, {
                  key: this.menu.id,
                  title: this.menu.name,
                  slots: { icon: this.menu.icon ? this.menu.icon : null }
                })
              } else {
                this.menu = res.data
                const treeNode = getTreeNode(this.treeData, res.data.pId)
                if (treeNode.children) {
                  console.log('手动添加')
                } else {
                  selectByPId(treeNode.id).then(res => {
                    treeNode.children = convertTreeData(res.data)
                    this.treeData = [...this.treeData]
                    this.expandedKeys.push(this.menu.pId)
                    this.generatorIcon()
                  })
                }
              }

              this.generatorIcon()
              console.log(this.treeData)
            })
          }
        })
      },
      remove () {
        remove(this.menu.id).then((res) => {
          removeSuccessTip()
          removeTreeNode(this.treeData, [this.menu.id])
          this.menu = null
        })
      }
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
