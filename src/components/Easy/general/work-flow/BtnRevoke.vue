<template>
  <span>
    <a-tooltip placement="top">
      <template slot="title">
        <span>{{ name }}</span>
      </template>
      <a-button type="danger" :loading="loading" size="small" :icon="icon" @click="revoke"/>
    </a-tooltip>
    <a-divider v-if="divider" type="vertical"/>
    <!--  撤销申请  -->
    <a-modal v-model="revokeModalVisible" :confirm-loading="revokeConfirmLoading" title="撤销申请" @ok="revoke">
      <a-form
        :label-col="FORM_LAYOUT.labelCol"
        :wrapper-col="FORM_LAYOUT.wrapperCol">
        <a-form-item label="撤销原因" :prop="deleteReason" class="last">
          <a-textarea v-model="deleteReason"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </span>
</template>
<script>
import { FORM_LAYOUT } from '@/utils/const/form'
import { revoke } from '@/api/activiti/task'
import { errorTip, successTip } from '@/utils/tips'
import { isBlank, isNotBlank, refreshList } from '@/utils/util'
import { selectTask } from '@/api/activiti/historic'
import PropTypes from 'ant-design-vue/es/_util/vue-types'

export default {
  name: 'EBtnWorkFlowRevoke',
  components: {},
  props: {
    name: PropTypes.string.def('撤销申请'),
    icon: PropTypes.string.def('rollback'),
    divider: PropTypes.bool.def(true),
    businessKey: PropTypes.string.def(),
    processInstanceId: PropTypes.string.def(),
    // 是否需要填写原因
    reason: PropTypes.bool.def(false)
  },
  data () {
    return {
      loading: false,
      FORM_LAYOUT: FORM_LAYOUT,
      // -- 撤销
      revokeModalVisible: false,
      revokeConfirmLoading: false,
      // 撤销原因
      deleteReason: null
    }
  },
  watch: {},
  methods: {
    /**
     * 撤销申请
     */
    revoke () {
      if (this.reason && isBlank(this.deleteReason)) {
        if (this.revokeModalVisible) {
          errorTip('请输入原因')
        }
        this.revokeModalVisible = true
        return
      }
      if (isNotBlank(this.businessKey)) {
        selectTask(this.businessKey).then(res => {
          revoke(res.data.executionId, res.data.processInstanceId).then(res => {
            this.revokeCallback()
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {
          this.loading = false
        })
      } else {
        if (isBlank(this.processInstanceId) || isBlank(this.deleteReason)) {
          console.warn('参数businessKey与processInstanceId&deleteReason必须有一组不为空')
          return
        }
        revoke(this.processInstanceId, this.deleteReason).then(res => {
          this.revokeCallback()
        }).catch(() => {
          this.loading = false
        })
      }
    },
    revokeCallback () {
      successTip('撤销成功')
      this.revokeModalVisible = false
      this.deleteReason = null
      this.loading = false
      this.refreshList()
    },
    refreshList () {
      refreshList(this)
    }
  }
}
</script>
