<template>
  <a-card title="指令权限" :bordered="false">
    <p>使用 <code>$role(xxx)</code> 验证用户是否具有指定角色权限</p>
    <div class="btn-group">
      <template v-for="role in roles">
        <a-button type="primary" :key="role.code" v-if="$role(role.code)">
          拥有[{{ role.code }}]按钮权限
        </a-button>
        <a-button type="danger" :key="role.code" v-else>
          未拥有[{{ role.code }}]按钮权限
        </a-button>
      </template>
    </div>
    <p>使用 <code>$permissions(xxx)</code> 验证用户是否具有指定权限</p>
    <a-descriptions :column="1" bordered>
      <a-descriptions-item label="用户权限">
        Select：
        <a-tag v-if="$permissions('sys:user:select')" color="green">
          有
        </a-tag>
        <a-tag v-else color="red">
          无
        </a-tag>

        Save：
        <a-tag v-if="$permissions('sys:user:save')" color="green">
          有
        </a-tag>
        <a-tag v-else color="red">
          无
        </a-tag>

        Remove：
        <a-tag v-if="$permissions('sys:user:remove')" color="green">
          有
        </a-tag>
        <a-tag v-else color="red">
          无
        </a-tag>

        Disable：
        <a-tag v-if="$permissions('sys:user:disable')" color="green">
          有
        </a-tag>
        <a-tag v-else color="red">
          无
        </a-tag>

        Copy：
        <a-tag v-if="$permissions('sys:user:copy')" color="green">
          有
        </a-tag>
        <a-tag v-else color="red">
          无
        </a-tag>
      </a-descriptions-item>

      <a-descriptions-item label="测试权限">
        Select：
        <a-tag v-if="$permissions('test:select')" color="green">
          有
        </a-tag>
        <a-tag v-else color="red">
          无
        </a-tag>

        Save：
        <a-tag v-if="$permissions('test:save')" color="green">
          有
        </a-tag>
        <a-tag v-else color="red">
          无
        </a-tag>

        Remove：
        <a-tag v-if="$permissions('test:remove')" color="green">
          有
        </a-tag>
        <a-tag v-else color="red">
          无
        </a-tag>
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>

<script>
import { selectRole } from '@/api/sys/role'

export default {
  name: 'SamplePermissionsView',
  data () {
    return {
      roles: []
    }
  },
  mounted () {
    this.selectRole()
  },
  methods: {
    selectRole () {
      selectRole({ isSelect: true }).then(res => {
        this.roles = res.data
      })
    }
  }
}
</script>
