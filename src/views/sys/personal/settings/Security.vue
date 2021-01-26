<template>
  <div>
    <a-list
      itemLayout="horizontal"
      :dataSource="data"
    >
      <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
        <a-list-item-meta>
          <a slot="title">{{ item.title }}</a>
          <span slot="description">
            <span class="security-list-description">{{ item.description }}</span>
            <span v-if="item.value"> : </span>
            <span class="security-list-value">{{ item.value }}</span>
          </span>
        </a-list-item-meta>
        <template v-if="item.actions">
          <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
        </template>
      </a-list-item>
    </a-list>

    <a-modal
      title="修改密码"
      :visible="changePasswordModalVisible"
      @ok="savePassword"
      @cancel="() => {this.changePasswordModalVisible = false}"
    >
      <a-form-model
        ref="changePasswordForm"
        :model="changePasswordModel"
        :rules="changePasswordRules"
        :label-col="FORM_LAYOUT.labelCol"
        :wrapper-col="FORM_LAYOUT.wrapperCol">
        <a-row class="form-row" :gutter="16">
          <a-col>
            <a-form-model-item label="原密码" prop="password">
              <a-input-password v-model="changePasswordModel.password"/>
            </a-form-model-item>
            <a-form-model-item label="新密码" prop="newPassword">
              <a-input-password v-model="changePasswordModel.newPassword"/>
              <password v-model="changePasswordModel.newPassword" @score="showScore" :strength-meter-only="true"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>

    <a-modal
      title="绑定手机"
      :visible="bindingPhoneModalVisible"
      :confirm-loading="bindingPhoneModalOkBtnState"
      @ok="savePhone"
      @cancel="() => {this.bindingPhoneModalVisible = false}"
    >
      <a-form-model
        ref="bindingPhoneForm"
        :model="bindingPhoneModel"
        :rules="bindingPhoneRules"
        :label-col="FORM_LAYOUT.labelCol"
        :wrapper-col="FORM_LAYOUT.wrapperCol">
        <a-row class="form-row" :gutter="16">
          <a-col>
            <a-form-model-item label="手机号" prop="phone">
              <a-input v-model="bindingPhoneModel.phone"/>
            </a-form-model-item>
            <a-form-model-item label="验证码" prop="captcha">
              <a-row :gutter="16">
                <a-col class="gutter-row" :span="14">
                  <a-form-item>
                    <a-input v-model="bindingPhoneModel.captcha" placeholder="验证码"/>
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="10">
                  <a-button
                    class="getCaptcha"
                    tabindex="-1"
                    :disabled="state.smsSendBtn"
                    @click.stop.prevent="sendBindingPhoneCaptcha"
                    v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
                  ></a-button>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>

    <a-modal
      title="绑定邮箱"
      :visible="bindingEmailModalVisible"
      @ok="saveEmail"
      @cancel="() => {this.bindingEmailModalVisible = false}"
    >
      <a-form-model
        ref="bindingEmailForm"
        :model="bindingEmailModel"
        :rules="bindingEmailRules"
        :label-col="FORM_LAYOUT.labelCol"
        :wrapper-col="FORM_LAYOUT.wrapperCol">
        <a-row class="form-row" :gutter="16">
          <a-col>
            <a-form-model-item label="邮箱" prop="email">
              <a-input v-model="bindingEmailModel.email"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import Password from 'vue-password-strength-meter'
import { FORM_LAYOUT } from '@/utils/const/form'
import { applicationBindingEmail, bindingPhone, changePassword } from '@/api/sys/personal-center'
import { successTip } from '@/utils/tips'
import { getByKey } from '@/api/sys/config'
import { SYS_CONFIG_KEY } from '@/utils/const/sys/SysConfigKey'
import notification from 'ant-design-vue/lib/notification'
import { mapActions, mapGetters } from 'vuex'
import { getSysDictNameByQuery } from '@/utils/util'
import md5 from 'md5'
import { sendBindingPhoneCaptcha } from '@/api/sys/captcha'

export default {
  components: { Password },
  data () {
    return {
      FORM_LAYOUT: FORM_LAYOUT,

      // 修改密码
      changePasswordModalVisible: false,
      changePasswordModel: {
        password: null,
        newPassword: null
      },
      score: 0,
      passwordSecurityLevel: 0,
      changePasswordRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码字数不能低于6个字符', trigger: 'blur' },
          { type: 'string', max: 20, message: '密码字数不能超过20个字符', trigger: 'blur' }
        ]
      },

      // 绑定手机
      bindingPhoneModalVisible: false,
      bindingPhoneModalOkBtnState: false,
      bindingPhoneModel: {
        phone: '',
        captcha: ''
      },
      bindingPhoneRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: new RegExp(/^[1]([3-9])[0-9]{9}$/), message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { type: 'string', length: 6, message: '验证码长度为6位', trigger: 'blur' }
        ]
      },
      state: {
        time: 60,
        smsSendBtn: false
      },

      // 绑定邮箱
      bindingEmailModalVisible: false,
      bindingEmailModel: {
        email: null
      },
      bindingEmailRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
        ]
      },

      data: []
    }
  },
  created () {
    // 获取密码强度
    getByKey(SYS_CONFIG_KEY.PASSWORD_SECURITY_LEVEL).then(res => {
      if (res.data) {
        this.passwordSecurityLevel = Number(res.data.value)
        if (this.user.passwordStrength < this.passwordSecurityLevel) {
          this.data[0].description = '当前密码强度较低，建议修改密码'
        }
      }
    })
    const currentPasswordStrengthDictName = getSysDictNameByQuery('passwordStrength', this.user.passwordStrength)
    this.data = [
      {
        title: '账户密码',
        description: '当前密码强度' + (currentPasswordStrengthDictName || this.user.passwordStrength),
        actions: {
          title: '修改',
          callback: () => {
            this.changePasswordModalVisible = true
          }
        }
      },
      {
        title: '密保手机',
        description: '已绑定手机',
        value: this.user.phone,
        actions: {
          title: '修改',
          callback: () => {
            this.bindingPhoneModalVisible = true
          }
        }
      },
      {
        title: '密保邮箱',
        description: '已绑定邮箱',
        value: this.user.email,
        actions: {
          title: '修改',
          callback: () => {
            this.bindingEmailModalVisible = true
          }
        }
      }
    ]
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapActions(['UpdateUser']),
    /**
     * 密码强度
     *
     * @param score {number} 强度
     */
    showScore (score) {
      this.score = score + 1
    },
    /**
     * 保存密码
     */
    savePassword () {
      this.$refs.changePasswordForm.validate(valid => {
        if (valid) {
          if (this.score < this.passwordSecurityLevel) {
            notification.error({
              message: `密码强度最低为${this.passwordSecurityLevel}级`,
              description: '保存失败'
            })
            return
          }
          changePassword(md5(this.changePasswordModel.password), md5(this.changePasswordModel.newPassword), this.score).then(res => {
            this.changePasswordModalVisible = false
            successTip()
          })
        }
      })
    },
    sendBindingPhoneCaptcha (e) {
      e.preventDefault()
      this.$refs.bindingPhoneForm.validateField('phone', (err, values) => {
        if (!err) {
          if (this.bindingPhoneModel.phone === this.user.phone) {
            this.$notification.warning({
              message: '警告',
              description: '新手机号不能与原绑定手机号一样'
            })
            return
          }
          this.state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (this.state.time-- <= 0) {
              this.state.time = 60
              this.state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          sendBindingPhoneCaptcha(this.bindingPhoneModel.phone).then(res => {
            setTimeout(hide, 1)
            this.$notification['success']({
              message: '成功',
              description: '验证码获取成功，验证码为：' + res.data,
              duration: 8
            })
          }).catch(err => {
            setTimeout(hide, 1)
            clearInterval(interval)
            this.state.time = 60
            this.state.smsSendBtn = false
            this.requestFailed(err)
          })
        }
      })
    },
    /**
     * 保存手机号
     */
    savePhone () {
      this.$refs.bindingPhoneForm.validate(valid => {
        if (valid) {
          this.bindingPhoneModalOkBtnState = true
          bindingPhone(this.bindingPhoneModel).then(res => {
            this.bindingPhoneModalOkBtnState = false
            this.bindingPhoneModalVisible = false
            this.data[1].value = this.bindingPhoneModel.phone
            successTip()
            this.UpdateUser()
            // 清除表单数据
            this.bindingPhoneModel = { phone: null, captcha: null }

            this.state.time = 60
            this.state.smsSendBtn = false
          })
        }
      })
    },
    /**
     * 保存邮箱
     */
    saveEmail () {
      this.$refs.bindingEmailForm.validate(valid => {
        if (valid) {
          applicationBindingEmail(this.bindingEmailModel.email).then(res => {
            this.bindingEmailModalVisible = false
            successTip()
            // 清除表单数据
            this.bindingPhoneModel.email = null
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
