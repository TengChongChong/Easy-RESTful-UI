<template>
  <div>
    <a-card title="Redis" :bordered="false">
      <a-row>
        <a-col :sm="24" :md="12" :lg="6">
          <a-menu v-model="current" @click="onPrefixClick" mode="inline" style="border-right: 0">
            <a-menu-item v-for="item in redisPrefix" :key="item.code">
              <a-icon type="mail"/>
              {{ item.name }}
            </a-menu-item>
          </a-menu>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8">
          <div class="key-wrapper">
            <a-list :data-source="keys">
              <a-list-item slot="renderItem" slot-scope="item, index">
                <a-button @click="onKeyClick(item)" size="small" type="link">{{ index + 1 }}.{{ item }}</a-button>
              </a-list-item>
            </a-list>
          </div>
        </a-col>
        <a-col :md="24" :lg="10">
          <a-descriptions :column="1" bordered v-if="model != null" style="margin-bottom: 15px">
            <a-descriptions-item label="Key">
              {{ model.key }}
            </a-descriptions-item>
            <a-descriptions-item label="Expire">
              {{ model.expire }}
            </a-descriptions-item>
            <a-descriptions-item label="Value">
              <div class="value-wrapper">
                <pre>{{ model.value }}</pre>
              </div>
            </a-descriptions-item>
          </a-descriptions>
          <div class="text-center" v-if="$permissions(SYS_PERMISSIONS_CODE.SYS_REDIS_REMOVE)">
            <a-popconfirm
              title="确定要删除吗?"
              @confirm="() => remove()"
            >
              <a-button type="danger" icon="delete" :loading="loading" bordered v-if="model != null">删除</a-button>
            </a-popconfirm>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>

import { getSysDictArrayByDictType } from '@/utils/util'
import { selectByPrefix, get, remove } from '@/api/sys/redis'
import { SYS_PERMISSIONS_CODE } from '@/utils/const/sys/PermissionsCode'

export default {
  name: 'SysRedisView',
  data () {
    return {
      SYS_PERMISSIONS_CODE: SYS_PERMISSIONS_CODE,

      redisPrefix: [],
      current: null,
      keys: [],

      // form
      model: null,
      loading: false
    }
  },
  created () {
    this.redisPrefix = getSysDictArrayByDictType('redisPrefix')
  },
  methods: {
    onPrefixClick (e) {
      this.current = [e.key]
      this.selectByPrefix()
    },
    selectByPrefix () {
      selectByPrefix(this.current).then(res => {
        this.keys = res.data
      })
    },
    onKeyClick (key) {
      get(key).then(res => {
        this.model = res.data
      })
    },
    remove () {
      this.loading = true
      remove(this.model.key).then(res => {
        this.loading = false
        this.model = null
        this.selectByPrefix()
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="less">
.key-wrapper {
  padding: 0 15px;
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
  border-left: 1px solid #e8e8e8;

  .ant-list-split .ant-list-item {
    padding: 4px 0;
  }
}

.value-wrapper {
  max-height: 360px;
  max-width: 100%;
  overflow: auto;
}

</style>
