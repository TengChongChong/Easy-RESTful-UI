<template>
  <a-card title="系统参数" :bordered="false">
    <a-form-model
      ref="form"
      :model="object"
      :rules="rules"
      :label-col="formLayout.labelCol"
      :wrapper-col="formLayout.wrapperCol">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="key" prop="sysKey">
            <a-input v-model="object.sysKey"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="value" prop="value">
            <a-input v-model="object.value"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="类型" prop="type">
            <dict-select name="type" v-model="object.type" type="dataType"/>
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
          </div>
        </a-col>
      </a-row>
    </a-form-model>
  </a-card>
</template>

<script>
  import { FORM_LAYOUT } from '@/utils/const/form'
  import { get, save } from '@/api/sys/config'
  import { saveSuccessTip } from '@/utils/tips'
  import DictSelect from '@/components/Easy/data-entry/DictSelect'
  import { isNotBlank } from '@/utils/util'

  export default {
    name: 'SysDictInput',
    components: {
      DictSelect
    },
    data () {
      return {
        id: this.$route.query.id,
        pId: this.$route.query.pId,
        dictType: this.$route.query.dictType,

        // 表单
        formLayout: FORM_LAYOUT,
        object: {},
        rules: {
          sysKey: [
            { required: true, message: '请输入key', trigger: 'blur' },
            { max: 50, message: 'key不能超过50个字符', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '请输入value', trigger: 'blur' },
            { max: 200, message: 'value不能超过200个字符', trigger: 'blur' }
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
