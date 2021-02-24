<template>
  <activiti-task-list status="claimed" title="待办任务"/>
</template>

<script>
import ActivitiTaskList from '@/views/activiti/task/List'
export default {
  name: 'ActivitiTaskToDo',
  components: {
    ActivitiTaskList
  }
}
</script>
