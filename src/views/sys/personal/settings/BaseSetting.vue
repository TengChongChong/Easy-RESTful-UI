<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form-model
          ref="form"
          :model="model"
          :rules="rules"
          :label-col="formLayout.labelCol"
          :wrapper-col="formLayout.wrapperCol">
          <a-row class="form-row" :gutter="16">
            <a-col>
              <a-form-model-item label="昵称" prop="nickname">
                <a-input v-model="model.nickname"/>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item label="性别" prop="sex">
                <e-dict-radio name="sex" v-model="model.sex" type="sex"/>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item label="生日" prop="birthday">
                <e-date-picker v-model="model.birthday"/>
              </a-form-model-item>
            </a-col>
            <a-col :sm="24">
              <div class="input-btn-group">
                <e-btn-save :click-callback="save"/>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus"/>
          </div>
          <img v-if="avatar != null && avatar !== ''" :src="avatar"/>
          <a-avatar v-else :size="180" icon="user"/>
        </div>
      </a-col>
    </a-row>
    <avatar-modal ref="modal" @ok="setAvatar"/>
  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import { FORM_LAYOUT } from '@/utils/const/form'
import { currentUser, saveUserInfo } from '@/api/sys/personal-center'
import EDatePicker from '@/components/Easy/data-entry/DatePicker'
import EDictRadio from '@/components/Easy/data-entry/DictRadio'
import EBtnSave from '@/components/Easy/general/BtnSave'
import { saveSuccessTip } from '@/utils/tips'
import { mapActions } from 'vuex'

export default {
  components: {
    EBtnSave,
    EDictRadio,
    EDatePicker,
    AvatarModal
  },
  created () {
    this.currentUser()
  },
  data () {
    return {
      formLayout: FORM_LAYOUT,
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,

      model: {},
      avatar: null,
      newAvatar: null,
      rules: {
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { max: 20, message: '昵称字数不能超过20个字符', trigger: 'blur' }
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
  methods: {
    ...mapActions(['SetUser']),
    currentUser () {
      currentUser().then(res => {
        this.model = res.data
        this.avatar = this.model.avatar
      })
    },
    setAvatar (data) {
      this.avatar = this.VUE_APP_API_BASE_URL + data.url
      this.newAvatar = data.url
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          saveUserInfo({
            id: this.model.id,
            nickname: this.model.nickname,
            sex: this.model.sex,
            birthday: this.model.birthday,
            avatar: this.newAvatar
          }).then((res) => {
            saveSuccessTip()
            this.SetUser(res.data)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

.avatar-upload-wrapper {
  height: 200px;
  width: 100%;
}

.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img, .mask {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    overflow: hidden;
  }

  .ant-avatar {
    position: static;
  }
}
</style>
