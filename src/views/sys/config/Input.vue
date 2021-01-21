<template>
  <a-card title="系统参数" :bordered="false">
    <a-form-model
      ref="form"
      :model="model"
      :rules="rules"
      :label-col="formLayout.labelCol"
      :wrapper-col="formLayout.wrapperCol">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="key" prop="sysKey">
            <a-input v-model="model.sysKey"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="value" prop="value">
            <a-input v-if="DATA_TYPE_CONST.STRING === model.type" v-model="model.value"/>
            <a-input-number v-if="DATA_TYPE_CONST.INTEGER === model.type" v-model="model.value"/>
            <e-dict-select v-if="DATA_TYPE_CONST.BOOLEAN === model.type" v-model="model.value" type="boolean"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="类型" prop="type">
            <e-dict-select v-model="model.type" type="dataType"/>
          </a-form-model-item>
        </a-col>

        <a-col :sm="24">
          <a-form-model-item label="备注" :labelCol="FULL_FORM_LAYOUT.labelCol" :wrapperCol="FULL_FORM_LAYOUT.wrapperCol" prop="tips">
            <a-textarea v-model="model.tips"/>
          </a-form-model-item>
        </a-col>
        <a-col :sm="24">
          <div class="input-btn-group">
            <e-btn-save :loading="saveLoading" :click-callback="save"/>
          </div>
        </a-col>
      </a-row>
    </a-form-model>
  </a-card>
</template>

<script>
import { FORM_LAYOUT, FULL_FORM_LAYOUT } from '@/utils/const/form'
  import { get, save } from '@/api/sys/config'
  import { saveSuccessTip } from '@/utils/tips'
  import EDictSelect from '@/components/Easy/data-entry/DictSelect'
  import { isNotBlank } from '@/utils/util'
  import EBtnSave from '@/components/Easy/general/BtnSave'
  import { DATA_TYPE_CONST } from '@/utils/const/sys/DataTypeConst'

  export default {
    name: 'SysConfigInput',
    components: {
      EBtnSave,
      EDictSelect
    },
    data () {
      return {
        id: this.$route.query.id,

        // 表单
        DATA_TYPE_CONST: DATA_TYPE_CONST,
        saveLoading: false,
        formLayout: FORM_LAYOUT,
        FULL_FORM_LAYOUT: FULL_FORM_LAYOUT,
        model: {
          type: DATA_TYPE_CONST.STRING
        },
        rules: {
          sysKey: [
            { required: true, message: '请输入key', trigger: 'blur' },
            { max: 50, message: 'key不能超过50个字符', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '请输入value', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择类型', trigger: 'blur' }
          ],
          tips: [
            { max: 200, message: '备注不能超过200个字符', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
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
            }).catch(({ response }) => {
              this.saveLoading = false
            })
          }
        })
      }
    }
  }
</script>
