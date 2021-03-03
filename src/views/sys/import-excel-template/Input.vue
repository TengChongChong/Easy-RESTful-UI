<template>
  <a-card title="导入模板" :bordered="false">
    <a-form-model
      ref="form"
      :model="model"
      :rules="rules"
      :label-col="FORM_LAYOUT.labelCol"
      :wrapper-col="FORM_LAYOUT.wrapperCol">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="导入表" prop="importTable">
            <a-select
              show-search
              option-filter-prop="children"
              v-model="model.importTable"
              @change="changeTable"
            >
              <a-select-option v-for="item in tableList" :key="item.value">
                {{ item.value }} - {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="名称" prop="name">
            <a-input v-model="model.name"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item prop="importCode">
            <span slot="label">
              模板代码
              <a-tooltip title="模板代码不可重复">
                <a-icon type="question-circle-o"/>
              </a-tooltip>
            </span>
            <a-input v-model="model.importCode"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item prop="permissionCode">
            <span slot="label">
              权限标识
              <a-tooltip title="用于检查当前登录用户是否允许使用此模板">
                <a-icon type="question-circle-o"/>
              </a-tooltip>
            </span>
            <a-input v-model="model.permissionCode"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item prop="callback">
            <span slot="label">
              回调Class
              <a-tooltip
                title="用于导入前&后处理数据（需实现com.easy.restful.sys.service.ImportService），如不需要可忽略。示例（sampleImportDataServiceImpl）">
                <a-icon type="question-circle-o"/>
              </a-tooltip>
            </span>
            <a-input v-model="model.callback"/>
          </a-form-model-item>
        </a-col>
        <a-col :sm="24">
          <a-form-model-item
            label="备注"
            :labelCol="FULL_FORM_LAYOUT.labelCol"
            :wrapperCol="FULL_FORM_LAYOUT.wrapperCol"
            prop="tips">
            <a-textarea v-model="model.tips"/>
          </a-form-model-item>
        </a-col>
        <a-col :sm="24">
          <div class="input-btn-group">
            <e-btn-save
              :permissions="SYS_PERMISSIONS_CODE.SYS_CONFIG_SAVE"
              :loading="saveLoading"
              :click-callback="save"/>
          </div>
        </a-col>
      </a-row>
    </a-form-model>
  </a-card>
</template>

<script>
import { FORM_LAYOUT, FULL_FORM_LAYOUT } from '@/utils/const/form'
import { get, save } from '@/api/sys/import-excel-template'
import { saveSuccessTip } from '@/utils/tips'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import { isNotBlank } from '@/utils/util'
import EBtnSave from '@/components/Easy/general/BtnSave'
import { DATA_TYPE_CONST } from '@/utils/const/sys/DataTypeConst'
import { SYS_PERMISSIONS_CODE } from '@/utils/const/sys/PermissionsCode'
import { selectTable } from '@/api/generator'

export default {
  name: 'SysImportExcelTemplateInput',
  components: {
    EBtnSave,
    EDictSelect
  },
  data () {
    return {
      id: this.$route.query.id,

      // 表单
      SYS_PERMISSIONS_CODE: SYS_PERMISSIONS_CODE,
      DATA_TYPE_CONST: DATA_TYPE_CONST,
      saveLoading: false,
      FORM_LAYOUT: FORM_LAYOUT,
      FULL_FORM_LAYOUT: FULL_FORM_LAYOUT,
      tableList: [],
      model: {},
      rules: {
        importTable: [
          { required: true, message: '请选择表名', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 50, message: '名称不能超过50个字符', trigger: 'blur' }
        ],
        importCode: [
          { required: true, message: '请输入模板代码', trigger: 'blur' },
          { max: 50, message: '模板代码不能超过50个字符', trigger: 'blur' }
        ],
        permissionCode: [
          { required: true, message: '请输入权限标识', trigger: 'blur' },
          { max: 50, message: '权限标识不能超过50个字符', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入value', trigger: 'blur' }
        ],
        tips: [
          { max: 200, message: '备注不能超过200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    selectTable().then(res => {
      this.tableList = res.data
    })
    if (isNotBlank(this.id)) {
      this.edit(this.id)
    }
  },
  methods: {
    edit (id) {
      get(id).then((res) => {
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
            this.model = res.data
          }).catch(({ response }) => {
            this.saveLoading = false
          })
        }
      })
    },
    changeTable (value) {
      const tableInfo = this.tableList.filter(item => item.value === value)
      this.model.name = tableInfo[0].text
      this.model.importCode = value.replace(new RegExp('_', 'g'), ':')
      this.model.permissionCode = `${this.model.importCode}:import:data`
      this.model.callback = `${this.underlineToHump(value)}ServiceImpl`
    },
    /**
     * 下换下转驼峰
     *
     * @param tableName {string} 表名
     * @return {string} 驼峰命名
     */
    underlineToHump (tableName) {
      const temp = tableName.split('_')
      let modelName
      if (temp.length === 1) {
        modelName = tableName
      } else {
        modelName = ''
        temp.map((item, index) => {
          if (index !== 0) {
            modelName += item.substr(0, 1).toLocaleUpperCase() + item.substr(1, item.length)
          } else {
            modelName += item
          }
        })
      }
      return modelName
    }
  }
}
</script>
