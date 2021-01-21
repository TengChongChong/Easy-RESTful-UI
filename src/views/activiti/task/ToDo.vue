<template>
  <activiti-task-list status="claimed"/>
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
