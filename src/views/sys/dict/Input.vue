<template>
  <a-card title="字典详情" :bordered="false">
    <a-form-model
      ref="form"
      :model="object"
      :rules="rules"
      :label-col="formLayout.labelCol"
      :wrapper-col="formLayout.wrapperCol">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="字典类型">
            <a-select show-search option-filter-prop="children" v-model="object.dictType" @change="onDictTypeChange">
              <a-select-option v-for="item in dictTypes" :key="item.type">
                {{ item.name }}（{{ item.type }}）
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="上级字典">
            <a-select show-search option-filter-prop="children" v-model="object.pCode">
              <a-select-option v-for="item in upDictDataArray" :key="item.value">
                {{ item.text }}（{{ item.value }}）
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="字典编码" prop="code">
            <a-input v-model="object.code"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="字典名称" prop="name">
            <a-input v-model="object.name"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="状态" prop="status">
            <dict-radio name="status" v-model="object.status" type="commonStatus"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="排序值" prop="orderNo">
            <a-input-number v-model="object.orderNo"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="颜色" prop="css">
            <a-select
              v-model="object.css"
              option-label-prop="label"
            >
              <a-select-option :key="item" v-for="item in cssItems" :value="item" :label="item">
                <a-tag :color="item">
                  {{ item }}
                </a-tag>
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="图标" prop="icon">
            <a-input v-model="object.icon" @click="handleIconInputClick">
              <a-icon slot="addonAfter" v-if="object.icon != null && object.icon !== ''" :type="object.icon"/>
            </a-input>
          </a-form-model-item>
        </a-col>

        <a-col :sm="24">
          <a-form-model-item label="备注" :labelCol="{ span: 3 }" :wrapperCol="{ span: 19 }" prop="tips">
            <a-textarea v-model="object.tips"/>
          </a-form-model-item>
        </a-col>
        <a-col :sm="24">
          <div class="input-btn-group">
            <a-button type="primary" icon="save" @click="save">
              保存
            </a-button>

            <a-button type="default" icon="plus" @click="add(object.id)" v-if="object.id != null && object.id !== ''">
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
</template>

<script>
  import { FORM_LAYOUT } from '@/utils/const/form'
  import IconSelector from '@/components/IconSelector'
  import DictRadio from '@/components/Easy/data-entry/DictRadio'
  import { selectAll } from '@/api/sys/dict-type'
  import { add, get, save, selectByDictType } from '@/api/sys/dict'
  import { saveSuccessTip } from '@/utils/tips'
  import DictSelect from '@/components/Easy/data-entry/DictSelect'
  import { isNotBlank } from '@/utils/util'

  export default {
    name: 'SysDictInput',
    components: {
      DictSelect,
      DictRadio,
      IconSelector
    },
    data () {
      return {
        id: this.$route.query.id,
        pId: this.$route.query.pId,
        dictType: this.$route.query.dictType,

        // 显示图标对话框
        iconModalVisible: false,
        currentSelectedIcon: null,

        cssItems: ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'],

        // 表单
        formLayout: FORM_LAYOUT,
        dictTypes: [],
        upDictDataArray: [],
        object: {},
        rules: {
          dictType: [
            { required: true, message: '请选择字典类型', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入字典编码', trigger: 'blur' },
            { max: 50, message: '字典编码不能超过50个字符', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入字典名称', trigger: 'blur' },
            { max: 80, message: '字典名称字数不能超过80个字符', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择字典状态', trigger: 'blur' }
          ],
          orderNo: [
            { required: true, message: '请输入排序值', trigger: 'blur' },
            { type: 'number', max: 999, message: '排序值不能大于999', trigger: 'blur' },
            { type: 'number', min: 0, message: '排序值不能小于0', trigger: 'blur' }
          ],
          icon: [
            { max: 32, message: '图标不能超过32个字符', trigger: 'blur' }
          ],
          tips: [
            { max: 200, message: '备注不能超过200个字符', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      selectAll().then(res => {
        this.dictTypes = res.data
      })
      this.init()
    },
    methods: {
      init () {
        if (isNotBlank(this.id)) {
          this.edit(this.id)
        } else {
          this.add(this.pId, this.dictType)
        }
      },
      /**
       * 字典类型改变
       */
      onDictTypeChange () {
        // 重置上级字典
        this.object.pId = ''
        this.loadUpDictDataArray()
      },
      loadUpDictDataArray () {
        if (isNotBlank(this.object.dictType)) {
          selectByDictType(this.object.dictType).then(res => {
            this.upDictDataArray = res.data
          })
        } else {
          this.upDictDataArray = []
        }
      },
      handleIconInputClick () {
        this.currentSelectedIcon = this.object.icon
        this.iconModalVisible = true
      },
      handleOk () {
        this.object.icon = this.currentSelectedIcon
        this.iconModalVisible = false
      },
      handleIconChange (icon) {
        this.currentSelectedIcon = icon
      },
      add (pId, dictType) {
        add(pId, dictType).then((res) => {
          this.object = res.data
          this.loadUpDictDataArray()
        })
      },
      edit (id) {
        get(id).then((res) => {
          this.object = res.data
          this.loadUpDictDataArray()
        })
      },
      save () {
        this.$refs.form.validate(valid => {
          if (valid) {
            save(this.object).then((res) => {
              saveSuccessTip()
            })
          }
        })
      }
    }
  }
</script>
