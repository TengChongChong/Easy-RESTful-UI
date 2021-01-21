<template>
  <div>
    <a-list item-layout="horizontal" :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta
          :description="`${item.applyUser} ${fromNow(item.createTime)}`"
        >
          <a slot="title" type="link" @click="handleTask(item)">
            <a-tag color="blue">{{ item.name }}</a-tag>
            {{ item.businessTitle }}
          </a>
          <template slot="avatar">
            <e-avatar :avatar="item.avatar" :nickname="item.applyUser" />
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { select } from '@/api/activiti/task'
import { fromNow, openView } from '@/utils/util'
import EAvatar from '@/components/Easy/data-display/Avatar'

export default {
  name: 'EToDoList',
  props: {
    size: {
      type: Number,
      default: 5
    }
  },
  components: {
    EAvatar
  },
  data () {
    return {
      data: []
    }
  },
  activated () {
    this.loadData()
  },
  mounted () {
    this.loadData()
  },
  methods: {
    // 加载数据方法 必须为 Promise 对象
    loadData () {
      return select('claimed', {
        size: this.size
      })
        .then(res => {
          this.data = res.data.data
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
