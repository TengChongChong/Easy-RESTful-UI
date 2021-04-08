<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="rules"
    :label-col="FORM_LAYOUT.labelCol"
    :wrapper-col="FORM_LAYOUT.wrapperCol">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="12" :sm="24">
        <a-form-model-item label="表名" prop="tableName">
          <a-select
            show-search
            option-filter-prop="children"
            v-model="model.tableName"
            @change="onTableNameChange">
            <a-select-option v-for="item in tableList" :key="item.value">
              {{ item.value }} - {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :lg="12" :sm="24">
        <a-form-model-item prop="businessName">
          <span slot="label">
            业务名称
            <a-tooltip title="controller/entity/dao/service注释">
              <a-icon type="question-circle-o"/>
            </a-tooltip>
          </span>
          <a-input v-model="model.businessName"/>
        </a-form-model-item>
      </a-col>
      <a-col :lg="12" :sm="24">
        <a-form-model-item label="实体类名称" prop="modelName">
          <a-input v-model="model.modelName"/>
        </a-form-model-item>
      </a-col>
      <a-col :lg="12" :sm="24">
        <a-form-model-item prop="author">
          <span slot="label">
            作者
            <a-tooltip title="注释中的 @author">
              <a-icon type="question-circle-o"/>
            </a-tooltip>
          </span>
          <a-input v-model="model.author"/>
        </a-form-model-item>
      </a-col>

      <a-col :lg="12" :sm="24">
        <a-form-model-item label="生成模板" prop="generatorTemplate">
          <e-dict-select
            type="generatorTemplate"
            v-model="model.generatorTemplate"
            @change="onGeneratorTemplateChange"/>
        </a-form-model-item>
      </a-col>
      <a-col :lg="12" :sm="24">
        <a-form-model-item prop="menuName">
          <span slot="label">
            菜单名称
            <a-tooltip title="如填写会自动添加菜单及权限">
              <a-icon type="question-circle-o"/>
            </a-tooltip>
          </span>
          <a-input v-model="model.menuName"/>
        </a-form-model-item>
      </a-col>

      <a-col :lg="12" :sm="24">
        <a-form-model-item prop="packagePath">
          <span slot="label">
            包路径
            <a-tooltip title="后端包路径">
              <a-icon type="question-circle-o"/>
            </a-tooltip>
          </span>
          <a-input v-model="model.packagePath"/>
        </a-form-model-item>
      </a-col>

      <a-col :lg="12" :sm="24">
        <a-form-model-item prop="permissionsCode">
          <span slot="label">
            权限标识
            <a-tooltip title="Controller方法中的@RequiresPermissions值前缀">
              <a-icon type="question-circle-o"/>
            </a-tooltip>
          </span>
          <a-input v-model="model.permissionsCode"/>
        </a-form-model-item>
      </a-col>
      <a-col :lg="12" :sm="24">
        <a-form-model-item prop="controllerMapping">
          <span slot="label">
            @RequestMapping：
            <a-tooltip title="Controller的@RequestMapping值">
              <a-icon type="question-circle-o"/>
            </a-tooltip>
          </span>
          <a-input v-model="model.controllerMapping"/>
        </a-form-model-item>
      </a-col>
      <a-col :lg="12" :sm="24">
        <a-form-model-item prop="viewPath">
          <span slot="label">
            页面路径
            <a-tooltip title="*.vue存放路径">
              <a-icon type="question-circle-o"/>
            </a-tooltip>
          </span>
          <a-input v-model="model.viewPath"/>
        </a-form-model-item>
      </a-col>
      <a-col :lg="12" :sm="24">
        <a-form-model-item prop="apiPath">
          <span slot="label">
            接口路径
            <a-tooltip title="接口js存放路径">
              <a-icon type="question-circle-o"/>
            </a-tooltip>
          </span>
          <a-input v-model="model.apiPath"/>
        </a-form-model-item>
      </a-col>

      <a-col :sm="24">
        <a-form-model-item
          label="需要生成的方法"
          :labelCol="FULL_FORM_LAYOUT.labelCol"
          :wrapperCol="FULL_FORM_LAYOUT.wrapperCol"
          prop="genMethod">
          <e-dict-checkbox type="genMethod" v-model="model.genMethod"/>
        </a-form-model-item>
      </a-col>
      <a-col :sm="24">
        <a-form-model-item
          label="需要生成的文件"
          :labelCol="FULL_FORM_LAYOUT.labelCol"
          :wrapperCol="FULL_FORM_LAYOUT.wrapperCol"
          prop="genFile">
          <e-dict-checkbox type="genFile" v-model="model.genFile"/>
        </a-form-model-item>
      </a-col>
      <a-col :sm="24">
        <a-form-model-item
          :labelCol="FULL_FORM_LAYOUT.labelCol"
          :wrapperCol="FULL_FORM_LAYOUT.wrapperCol"
          prop="backEndPath">
          <span slot="label">
            后端项目路径
            <a-tooltip title="idea中的项目绝对路径，无需/结尾">
              <a-icon type="question-circle-o"/>
            </a-tooltip>
          </span>
          <a-input v-model="model.backEndPath">
            <a-select
              v-model="choseModule"
              :show-search="true"
              :allow-clear="true"
              slot="addonBefore"
              placeholder="选择一个模块或直接输入路径"
              style="width: 260px"
              @change="onModuleChange">
              <a-select-option v-for="item in modules" :key="item.value">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-input>
        </a-form-model-item>
      </a-col>
      <a-col :sm="24">
        <a-form-model-item
          :labelCol="FULL_FORM_LAYOUT.labelCol"
          :wrapperCol="FULL_FORM_LAYOUT.wrapperCol"
          prop="frontEndPath">
          <span slot="label">
            前端项目路径
            <a-tooltip title="idea中的项目绝对路径，无需/结尾">
              <a-icon type="question-circle-o"/>
            </a-tooltip>
          </span>
          <a-input v-model="model.frontEndPath"/>
        </a-form-model-item>
      </a-col>
    </a-row>
  </a-form-model>
</template>

<script>
import { FORM_LAYOUT, FULL_FORM_LAYOUT } from '@/utils/const/form'
import { selectFields, selectModules, selectTable } from '@/api/generator'
import { mapGetters } from 'vuex'
import { generatorTemplate, getControllerMapping, getPermissionsCode } from '@/views/generator/_util'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import EDictCheckbox from '@/components/Easy/data-entry/DictCheckbox'
import { isBlank, isNotBlank } from '@/utils/util'

export default {
  name: 'GeneratorBaseInfo',
  components: { EDictCheckbox, EDictSelect },
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  watch: {
    model: {
      deep: true,
      handler: function () {
        this.$emit('input', this.model)
      }
    }
  },
  data () {
    return {
      FORM_LAYOUT: FORM_LAYOUT,
      FULL_FORM_LAYOUT: FULL_FORM_LAYOUT,
      VUE_APP_FRONT_END_PATH: process.env.VUE_APP_FRONT_END_PATH,
      tableList: [],
      modules: [],
      choseModule: null,
      model: this.value,
      rules: {
        tableName: [
          { required: true, message: '请选择表名', trigger: 'blur' }
        ],
        businessName: [
          { required: true, message: '请输入业务名称', trigger: 'blur' },
          { max: 50, message: '业务名称不能超过50个字符', trigger: 'blur' }
        ],
        modelName: [
          { required: true, message: '请输入实体类名称', trigger: 'blur' },
          { max: 50, message: '实体类名称不能超过50个字符', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入作者', trigger: 'blur' },
          { max: 50, message: '作者不能超过50个字符', trigger: 'blur' }
        ],
        generatorTemplate: [
          { required: true, message: '请选择生成模板', trigger: 'blur' }
        ],
        menuName: [
          { max: 10, message: '菜单名称超过10个字符', trigger: 'blur' }
        ],
        genFile: [
          { required: true, message: '请选择需要生成的文件', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    selectTable().then(res => {
      this.tableList = res.data
    })
    selectModules().then(res => {
      this.modules = res.data
    })
    this.model = Object.assign({ ...this.model }, {
      author: this.user.nickname,
      backEndPath: null,
      frontEndPath: this.VUE_APP_FRONT_END_PATH
    })
    this.onGeneratorTemplateChange(this.model.generatorTemplate)
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    onTableNameChange (value) {
      selectFields(value).then(({ data }) => {
        const { comment, entityName, name, fields } = data
        this.model = Object.assign({ ...this.model }, {
          businessName: comment,
          menuName: comment,
          modelName: entityName,
          permissionsCode: getPermissionsCode(name),
          packagePath: `com.easy.restful.${name.substr(0, name.indexOf('_'))}`,
          controllerMapping: `/${getControllerMapping(name)}`,
          viewPath: `/views/${getControllerMapping(name)}`,
          apiPath: `/api/${getControllerMapping(name)}.js`,
          tableFields: fields
        })
      })
      if (isBlank(this.model.backEndPath)) {
        let matchingModule
        if (value.indexOf('_') !== -1) {
          matchingModule = `easy-${value.substr(0, value.indexOf('_'))}`
        } else {
          matchingModule = `easy-${value}`
        }
        this.modules.map(item => {
          if (item.text.indexOf(matchingModule) !== -1) {
            this.model.backEndPath = item.value
            this.choseModule = item.value
          }
        })
      }
    },
    onModuleChange (val) {
      if (isNotBlank(val)) {
        this.model.backEndPath = val
      }
    },
    onGeneratorTemplateChange (value) {
      const template = value && generatorTemplate[value] || {}
      this.model = Object.assign({ ...this.model }, {
        genMethod: template.method || [],
        genFile: template.file || []
      })
    },
    validate (callback) {
      this.$refs.form.validate(valid => {
        callback(valid)
      })
    }
  }
}
</script>

<style scoped>

</style>
