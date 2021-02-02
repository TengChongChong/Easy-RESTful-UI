<template>
  <pro-layout
    :menus="[]"
    layout="topmenu"
    :handleMediaQuery="()=>{}"
    :handleCollapse="()=>{}"
    contentWidth="Fixed"
  >
    <template v-slot:menuHeaderRender>
      <div>
        <logo-svg/>
        <h1>{{ title }}</h1>
      </div>
    </template>
    <template v-slot:rightContentRender>
      <div class="ant-pro-global-header-index-right">
        <router-link to="/user/login">
          <a-button type="link" icon="login" ghost>登录</a-button>
        </router-link>
      </div>
    </template>
    <a-card title="找回密码" :bordered="false">
      <a-steps :current="current">
        <a-step v-for="item in steps" :key="item" :title="item"/>
      </a-steps>
      <div class="steps-content">
        <div v-if="current === 0">
          <a-list item-layout="horizontal">
            <a-list-item @click="choseFindType(findTypeConst.MAIL)">
              <div class="ant-list-item-icon">
                <a-icon type="mail"/>
              </div>
              <a-list-item-meta description="你需要用密保邮箱进行邮箱验证">
                <a slot="title" href="https://www.antdv.com/">通过密保邮箱找回</a>
              </a-list-item-meta>
            </a-list-item>
            <a-list-item @click="choseFindType(findTypeConst.PHONE)">
              <div class="ant-list-item-icon">
                <a-icon type="mobile"/>
              </div>
              <a-list-item-meta description="你需要用密保手机进行短信验证">
                <a slot="title" href="https://www.antdv.com/">通过密保手机找回</a>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </div>
        <div v-if="current === 1">
          <a-form-model
            ref="form"
            :model="model"
            :rules="rules"
            :label-col="FORM_LAYOUT.labelCol"
            :wrapper-col="FORM_LAYOUT.wrapperCol">
            <a-row class="form-row" :gutter="16">
              <a-col>
                <a-form-model-item label="用户名" prop="username">
                  <a-input v-model="model.username"/>
                </a-form-model-item>
              </a-col>
              <a-col v-if="findTypeConst.PHONE === findType">
                <a-form-model-item label="手机号" prop="phone">
                  <a-input v-model="model.phone"/>
                </a-form-model-item>
              </a-col>
              <a-col v-if="findTypeConst.MAIL === findType">
                <a-form-model-item label="邮箱" prop="mail">
                  <a-input v-model="model.mail"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
        <div v-if="current === 2">
          <a-form
            :label-col="FORM_LAYOUT.labelCol"
            :wrapper-col="FORM_LAYOUT.wrapperCol">
            <a-row class="form-row" :gutter="16">
              <a-col>
                <a-form-item label="验证码">
                  <a-input v-model="model.code"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div v-if="current === 3">
          <a-form
            :label-col="FORM_LAYOUT.labelCol"
            :wrapper-col="FORM_LAYOUT.wrapperCol">
            <a-row class="form-row" :gutter="16">
              <a-col>
                <a-form-item label="密码">
                  <a-input-password v-model="model.password"/>
                  <password v-model="model.password" @score="showScore" :strength-meter-only="true"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div v-if="current === 4">
          <a-result title="密码重置成功" status="success">
            <template #extra>
              <router-link to="/user/login">
                <a-button icon="login" type="primary">
                  登录
                </a-button>
              </router-link>
            </template>
          </a-result>
        </div>
      </div>
      <div class="steps-action">
        <a-button icon="left" v-if="current > 0 && current < steps.length - 1" @click="prev">
          上一步
        </a-button>
        <a-button icon="right" :loading="loading" v-if="current > 0 && current < steps.length - 1" type="primary" @click="next">
          下一步
        </a-button>
      </div>
    </a-card>
    <template v-slot:footerRender>
      <pro-global-footer/>
    </template>
  </pro-layout>
</template>
<script>
import Password from 'vue-password-strength-meter'
import LogoSvg from '@/assets/logo.svg?inline'
import defaultSettings from '@/config/defaultSettings'
import ProGlobalFooter from '@/components/GlobalFooter'
import { FORM_LAYOUT } from '@/utils/const/form'
import { resetPassword, sendMail, sendMessage, verifiesCode } from '@/api/sys/retrieve-password'
import { successTip } from '@/utils/tips'
import notification from 'ant-design-vue/lib/notification'
import md5 from 'md5'
import { getByKey } from '@/api/sys/config'
import { SYS_CONFIG_KEY } from '@/utils/const/sys/SysConfigKey'

export default {
  name: 'RetrievePassword',
  components: {
    ProGlobalFooter,
    LogoSvg,
    Password
  },
  data () {
    return {
      FORM_LAYOUT: FORM_LAYOUT,

      title: defaultSettings.title,
      findTypeConst: {
        MAIL: 'mail',
        PHONE: 'phone'
      },

      loading: false,
      model: {},
      passwordSecurityLevel: 0,
      score: 0,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { max: 32, message: '用户名不能超过32个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: new RegExp(/^[1]([3-9])[0-9]{9}$/), message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
        ]
      },
      findType: null,

      current: 0,
      steps: [
        '选择方式',
        '填写信息',
        '身份验证',
        '设置新密码',
        '完成'
      ]
    }
  },
  mounted () {
    // 获取密码强度
    getByKey(SYS_CONFIG_KEY.PASSWORD_SECURITY_LEVEL).then(res => {
      if (res.data) {
        this.passwordSecurityLevel = Number(res.data.value)
      }
    })
  },
  methods: {
    next () {
      if (this.current === 1) {
        const _this = this
        this.$refs.form.validate(valid => {
          if (valid) {
            _this.loading = true
            switch (_this.findType) {
              case _this.findTypeConst.PHONE:
                sendMessage(_this.model.username, _this.model.phone).then(res => {
                  successTip(`短信验证码：${res.data}`)
                  _this.loading = false
                  this.current++
                }).catch(({ response }) => {
                  this.loading = false
                })
                break
              case _this.findTypeConst.MAIL:
                sendMail(_this.model.username, _this.model.mail).then(res => {
                  successTip(`验证码发送成功，请前往邮箱查看`)
                  this.current++
                  _this.loading = false
                }).catch(({ response }) => {
                  this.loading = false
                })
                break
            }
          }
        })
      } else if (this.current === 2) {
        this.loading = true
        verifiesCode(this.model.username, this.model.code).then(res => {
          this.current++
          this.loading = false
        }).catch(({ response }) => {
          this.loading = false
        })
      } else if (this.current === 3) {
        if (this.score < this.passwordSecurityLevel) {
          notification.error({
            message: `密码强度最低为${this.passwordSecurityLevel}级`,
            description: '保存失败'
          }).catch(({ response }) => {
            this.loading = false
          })
          return
        }
        this.loading = true
        resetPassword(this.model.username, this.model.code, md5(this.model.password)).then(res => {
          this.current++
          this.loading = false
        }).catch(({ response }) => {
          this.loading = false
        })
      } else {
        this.current++
      }
    },
    prev () {
      this.current--
    },
    /**
     * 密码强度
     *
     * @param score {number} 强度
     */
    showScore (score) {
      this.score = score + 1
    },
    choseFindType (type) {
      this.findType = type
      this.current++
    }
  }
}
</script>
<style scoped lang="less">
@import '~ant-design-vue/es/style/themes/default.less';

.steps-content {
  margin: 50px;

  .ant-list {
    .ant-list-item {
      cursor: pointer;

      .ant-list-item-icon {
        padding: 0 20px;

        .anticon {
          font-size: 32px;
        }
      }
    }
  }
}

.steps-action {
  text-align: right;

  .ant-btn {
    margin-right: 10px;
  }
}
@media (max-width: @screen-xs) {
  .steps-content {
    margin: 16px 0;
  }
}
</style>
