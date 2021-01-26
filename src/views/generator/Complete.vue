<template>
  <div>
    <h3 style="margin-bottom: 20px">点击完成将生成以下文件</h3>
    <timeline>
      <timeline-item :key="item" v-for="item in fileList">{{ item }}</timeline-item>
    </timeline>
  </div>
</template>

<script>
import { Timeline } from 'ant-design-vue'
const TimelineItem = Timeline.Item

export default {
  name: 'GeneratorComplete',
  components: {
    Timeline,
    TimelineItem
  },
  props: {
    model: {
      type: Object,
      default: null
    }
  },
  watch: {
    model () {
      this.initFileList()
    }
  },
  mounted () {
    this.initFileList()
  },
  data () {
    return {
      fileList: []
    }
  },
  methods: {
    initFileList () {
      const fileList = []
      this.model.genFile.map(item => {
        switch (item) {
          case 'model':
            fileList.push(`${this.model.backEndPath}/src/main/java/${this.model.packagePath.replace(/\./g, '/')}/model/${this.model.modelName}.java`)
            break
          case 'dao':
            fileList.push(`${this.model.backEndPath}/src/main/java/${this.model.packagePath.replace(/\./g, '/')}/dao/${this.model.modelName}Mapper.java`)
            break
          case 'mapping':
            fileList.push(`${this.model.backEndPath}/src/main/java/${this.model.packagePath.replace(/\./g, '/')}/dao/mapping/${this.model.modelName}Mapper.xml`)
            break
          case 'service':
            fileList.push(`${this.model.backEndPath}/src/main/java/${this.model.packagePath.replace(/\./g, '/')}/service/${this.model.modelName}Service.java`)
            break
          case 'serviceImpl':
            fileList.push(`${this.model.backEndPath}/src/main/java/${this.model.packagePath.replace(/\./g, '/')}/service/impl/${this.model.modelName}ServiceImpl.java`)
            break
          case 'controller':
            fileList.push(`${this.model.backEndPath}/src/main/java/${this.model.packagePath.replace(/\./g, '/')}/controller/${this.model.modelName}Controller.java`)
            break
          case 'List.vue':
            fileList.push(`${this.model.frontEndPath}/src${this.model.viewPath}/List.vue`)
            break
          case 'Input.vue':
            fileList.push(`${this.model.frontEndPath}/src${this.model.viewPath}/Input.vue`)
            break
          case 'api.js':
            fileList.push(`${this.model.frontEndPath}/src${this.model.apiPath}`)
            break
        }
      })
      this.fileList = fileList
    }
  }
}
</script>

<style scoped>

</style>
