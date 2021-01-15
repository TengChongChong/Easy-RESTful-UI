<template>
  <a-card title="用户详情" :bordered="false">
    <a-form-model
      ref="form"
      :model="model"
      :rules="rules"
      :label-col="formLayout.labelCol"
      :wrapper-col="formLayout.wrapperCol">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="所属部门">
            {{ model.deptName }}
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16" v-if="model.avatar != null && model.avatar !== ''">
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="头像">
            <a-avatar size="large" :src="VUE_APP_API_BASE_URL + model.avatar" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="用户名" prop="username">
            <a-input v-model="model.username"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="昵称" prop="nickname">
            <a-input v-model="model.nickname"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="角色" prop="roles">
            <a-select show-search option-filter-prop="children" :allowClear="true" mode="multiple" v-model="model.roles">
              <a-select-option v-for="item in roles" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="性别" prop="sex">
            <e-dict-radio name="sex" v-model="model.sex" type="sex"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="手机号" prop="phone">
            <a-input v-model="model.phone"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="生日" prop="birthday">
            <e-date-picker v-model="model.birthday"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="邮箱" prop="email">
            <a-input v-model="model.email"/>
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
  import { FORM_LAYOUT } from '@/utils/const/form'
  import EDictRadio from '@/components/Easy/data-entry/DictRadio'
  import { add, get, save } from '@/api/sys/user'
  import { saveSuccessTip } from '@/utils/tips'
  import { isNotBlank } from '@/utils/util'
  import EBtnSave from '@/components/Easy/general/BtnSave'
  import EDatePicker from '@/components/Easy/data-entry/DatePicker'
  import { selectRoleByDept } from '@/api/sys/dept-type'

  export default {
    name: 'SysUserInput',
    components: {
      EDatePicker,
      EBtnSave,
      EDictRadio
    },
    data () {
      return {
        id: this.$route.query.id,
        deptId: this.$route.query.deptId,

        // 表单
        saveLoading: false,
        VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,
        formLayout: FORM_LAYOUT,
        roles: [],
        model: {},
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { max: 32, message: '用户名不能超过32个字符', trigger: 'blur' }
          ],
          nickname: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
            { max: 20, message: '昵称字数不能超过20个字符', trigger: 'blur' }
          ],
          roles: [
            { required: true, message: '请选择角色', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '请选择性别', trigger: 'blur' }
          ],
          phone: [
            { pattern: new RegExp(/^[1]([3-9])[0-9]{9}$/), message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          email: [
            { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        if (isNotBlank(this.id)) {
          this.edit(this.id)
        } else {
          this.add(this.deptId)
        }
      },
      add (deptId) {
        add(deptId).then((res) => {
          this.model = res.data
          this.loadRoleTree()
        })
      },
      edit (id) {
        get(id).then((res) => {
          this.model = res.data
          this.roleCheckedKeys = res.data.roles
          this.loadRoleTree()
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
      },
      loadRoleTree () {
        selectRoleByDept(this.model.deptId).then((res) => {
          this.roles = res.data
        })
      }
    }
  }
</script>
