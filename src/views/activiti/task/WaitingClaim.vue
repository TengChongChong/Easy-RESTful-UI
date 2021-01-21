<template>
  <activiti-task-list status="waitingClaim"/>
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
