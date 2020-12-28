<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="6">
        <a-card :bordered="false">
          <div class="account-center-avatarHolder">
            <div class="avatar">
              <img :src="user.avatar">
            </div>
            <a-tag v-if="SEX_CONST.BOY === user.sex" color="blue">
              <a-icon type="man"/>
            </a-tag>
            <a-tag v-if="SEX_CONST.GIRL === user.sex" color="pink">
              <a-icon type="woman"/>
            </a-tag>
            <a-tag v-if="user.sex === null || user.sex === ''">-</a-tag>
            <a-tag color="cyan">
              {{ user.age }} 岁
            </a-tag>
            <div class="username">{{ user.nickname }}</div>
            <div class="bio">{{ user.dept.name }}</div>
          </div>
          <div class="account-center-detail">
            <p>
              <a-icon type="phone"/>
              {{ user.phone }}
            </p>
            <p>
              <a-icon type="mail"/>
              {{ user.email }}
            </p>
            <p>
              <a-icon type="team"/>
              <a-tag :key="item" v-for="item in user.roleNames">{{ item }}</a-tag>
            </p>
          </div>
        </a-card>
      </a-col>
      <a-col :md="24" :lg="18">
        <a-card title="我的消息" :bordered="false" style="max-height: 300px;margin-bottom: 24px">
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </a-card>
        <a-card title="待办任务" :bordered="false" style="max-height: 300px">
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EDictTag from '@/components/Easy/data-entry/DictTag'
import { SEX_CONST } from '@/utils/const/sys/SexConst'

export default {
  name: 'SysPersonalCenterView',
  components: { EDictTag },
  data () {
    return {
      SEX_CONST: SEX_CONST
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    & > .avatar {
      margin: 0 auto 20px auto;
      width: 104px;
      height: 104px;
      border-radius: 50%;
      overflow: hidden;

      img {
        height: 100%;
        width: 100%;
      }
    }

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 4px;
    }
  }

  .account-center-detail {
    p {
      margin-bottom: 8px;
      position: relative;

      .anticon {
        margin-right: 12px;
      }
    }
  }
}
</style>
