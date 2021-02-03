<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main user-personal-center">
    <div class="ant-page-header">
      <div class="ant-page-header-content">
        <div class="ant-pro-page-header-wrap-detail">
          <div class="ant-pro-page-header-wrap-main">
            <div class="ant-pro-page-header-wrap-row">
              <div class="ant-pro-page-header-wrap-content">
                <div class="page-header-content">
                  <div class="avatar">
                    <e-avatar :relative-path="false" :avatar="user.avatar" :nickname="user.nickname"/>
                  </div>
                  <div class="content">
                    <div class="content-title">
                      {{ timeFix() }}，{{ user.nickname }}
                    </div>
                    <div>
                      <template v-if="user.sex != null && user.sex !== ''">
                        <a-tag v-if="SEX_CONST.BOY === user.sex" color="blue">
                          <a-icon type="man"/>
                        </a-tag>
                        <a-tag v-if="SEX_CONST.GIRL === user.sex" color="pink">
                          <a-icon type="woman"/>
                        </a-tag>
                      </template>
                      <a-tag v-if="user.age != null" :color="SEX_CONST.GIRL === user.sex ? 'pink' : 'cyan'">
                        {{ user.age }} 岁
                      </a-tag>

                      {{ user.dept && user.dept.name }} |
                      <span :key="item" v-for="item in user.roleNames">{{ item }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="ant-pro-page-header-wrap-extra-content">
                <div class="extra-content">
                  <div class="stat-item">
                    <a-statistic title="消息" :value="unreadCount"/>
                  </div>
                  <div class="stat-item">
                    <a-statistic title="待办任务" :value="toDoCount"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-row :gutter="16">
      <a-col :lg="16">
        <a-card
          class="project-list"
          style="margin-bottom: 24px;"
          :bordered="false"
          title="待办任务"
          :body-style="{ padding: 0 }">
          <a slot="extra">
            <router-link slot="extra" to="/activiti/task/to-do">
              全部任务
            </router-link>
          </a>
          <div>
            <a-card-grid class="project-card-grid" :key="i" v-for="(item, i) in toDoList">
              <a-card :bordered="false" :body-style="{ padding: 0 }">
                <a-card-meta>
                  <div slot="title" class="card-title">
                    <e-avatar size="small" :avatar="item.avatar" :nickname="item.applyUser"/>
                    <a>{{ item.applyUser }}</a>
                  </div>
                  <div slot="description" class="card-description">
                    <a slot="title" :title="item.businessTitle" type="link" @click="handleTask(item)">
                      {{ item.businessTitle }}
                    </a>
                  </div>
                </a-card-meta>
                <div class="project-item">
                  <span class="node-name">{{ item.name }}</span>
                  <span class="datetime">{{ fromNow(item.createTime) }}</span>
                </div>
              </a-card>
            </a-card-grid>
          </div>
        </a-card>
      </a-col>
      <a-col :lg="8">
        <a-card title="我的消息" :bordered="false" :body-style="{padding: '0px 20px'}">
          <router-link slot="extra" to="/sys/message">
            全部消息
          </router-link>
          <message-list/>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EDictTag from '@/components/Easy/data-display/DictTag'
import { SEX_CONST } from '@/utils/const/sys/SexConst'
import MessageList from '@/views/sys/message/MessageList'
import EAvatar from '@/components/Easy/data-display/Avatar'
import EToDoList from '@/views/activiti/task/ToDoList'
import { select } from '@/api/activiti/task'
import { fromNow, openView, timeFix } from '@/utils/util'

export default {
  name: 'SysPersonalCenterView',
  components: { EToDoList, EAvatar, EDictTag, MessageList },
  data () {
    return {
      SEX_CONST: SEX_CONST,
      toDoList: [],
      toDoCount: 0
    }
  },
  computed: {
    ...mapGetters(['user', 'unreadCount'])
  },
  activated () {
    this.loadToDoData()
  },
  mounted () {
    this.loadToDoData()
  },
  methods: {
    timeFix: timeFix,
    // 加载数据方法 必须为 Promise 对象
    loadToDoData () {
      return select('claimed', {
        size: 6
      }).then(res => {
        this.toDoList = res.data.data
        this.toDoCount = res.data.total
      })
    },
    fromNow (time) {
      return fromNow(time)
    },
    handleTask (record) {
      openView(this.$router, `/activiti/task/input/${record.id}`, record.processDefinitionName)
    }
  }
}
</script>

<style lang="less" scoped>
@import "View";
</style>
