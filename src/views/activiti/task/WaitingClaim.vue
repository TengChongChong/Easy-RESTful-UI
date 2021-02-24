<template>
  <activiti-task-list status="waitingClaim" title="待签任务"/>
</template>

<script>
import ActivitiTaskList from '@/views/activiti/task/List'
export default {
  name: 'ActivitiTaskWaitingClaim',
  components: {
    ActivitiTaskList
  }
}
</script>
