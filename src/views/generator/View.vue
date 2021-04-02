<template>
  <a-card title="代码生成" :bordered="false">
    <div>
      <a-steps :current="current" type="navigation" size="small" :style="stepStyle">
        <a-step :key="item.title" v-for="item in steps" :title="item.title" :disabled="item.disabled"/>
      </a-steps>
      <div class="steps-content">
        <generator-base-info ref="steps0" v-model="model" v-show="current === 0"/>
        <generator-field-set ref="steps1" :table-fields="model.tableFields" :model="model" v-show="current === 1"/>
        <generator-list-config ref="steps2" :query-items="model.queryItems" :table-items="model.tableItems" v-show="current === 2"/>
        <generator-input-config ref="steps3" :input-items="model.inputItems" v-show="current === 3"/>
        <generator-import-and-export-config ref="steps4" :import-items="model.importItems" :export-items="model.exportItems" v-show="current === 4"/>
        <generator-complete ref="steps5" :model="model" v-if="current === 5"/>
      </div>
      <div class="steps-action">
        <a-button v-if="current > 0" icon="left" @click="prev">
          上一步
        </a-button>
        <a-button v-if="current < steps.length - 1" icon="right" type="primary" @click="next">
          下一步
        </a-button>
        <a-button
          v-if="current === steps.length - 1"
          icon="check"
          type="primary"
          @click="complete"
        >
          完成
        </a-button>
        <a-checkbox v-model="model.replace">
          覆盖已有文件
        </a-checkbox>
      </div>
    </div>
  </a-card>
</template>

<script>
import GeneratorBaseInfo from '@/views/generator/BaseInfo'
import GeneratorFieldSet from '@/views/generator/FieldSet'
import GeneratorListConfig from '@/views/generator/ListConfig'
import GeneratorInputConfig from '@/views/generator/InputConfig'
import GeneratorComplete from '@/views/generator/Complete'
import { generate } from '@/api/generator'
import { successTip } from '@/utils/tips'
import { selectEnableItems, selectFormItems, selectQueryItems } from '@/views/generator/_util'
import GeneratorImportAndExportConfig from '@/views/generator/ImportAndExportConfig'
import { GENERATOR_FILE } from '@/utils/const/generator/GeneratorFile'
import { GENERATOR_METHOD } from '@/utils/const/generator/GeneratorMethod'

export default {
  name: 'GeneratorView',
  components: { GeneratorImportAndExportConfig, GeneratorComplete, GeneratorInputConfig, GeneratorListConfig, GeneratorFieldSet, GeneratorBaseInfo },
  data () {
    return {
      GENERATOR_FILE: GENERATOR_FILE,
      GENERATOR_METHOD: GENERATOR_METHOD,
      model: {
        generatorTemplate: 'default',
        tableFields: [],
        fieldSets: [],
        queryItems: [],
        tableItems: [],
        inputItems: [],
        importItems: [],
        exportItems: []
      },

      // 步骤
      current: 0,
      stepStyle: {
        boxShadow: '0px -1px 0 0 #e8e8e8 inset'
      },
      steps: [
        { title: '基本信息', disabled: false },
        { title: '字段信息', disabled: true },
        { title: '列表页面', disabled: true },
        { title: '详情页面', disabled: true },
        { title: '导入&导出', disabled: true },
        { title: '完成', disabled: false }
      ]
    }
  },
  methods: {
    next () {
      this.$refs.steps0.validate(valid => {
        if (valid) {
          // this.steps[this.current + 1].disabled = false
          switch (this.current) {
            case 0:
              this.steps[1].disabled = this.model.genFile.indexOf(GENERATOR_FILE.LIST_VUE) === -1 && this.model.genFile.indexOf(GENERATOR_FILE.INPUT_VUE) === -1
              break
            case 1:
              this.model.fieldSets = this.$refs.steps1.data
              this.setViewConfig()
              this.steps[2].disabled = this.model.genFile.indexOf(GENERATOR_FILE.LIST_VUE) === -1
              this.steps[3].disabled = this.model.genFile.indexOf(GENERATOR_FILE.INPUT_VUE) === -1
              this.steps[4].disabled = this.model.genMethod.indexOf(GENERATOR_METHOD.EXPORT_DATA) === -1 && this.model.genMethod.indexOf(GENERATOR_METHOD.IMPORT_DATA) === -1
              break
            default:
              break
          }
          this.current = this.getNext(1)
          if (this.current === 1) {
            setTimeout(() => {
              this.$refs.steps1.calcHeight()
            }, 500)
          }
        }
      })
    },
    prev () {
      this.current = this.getNext(-1)
    },
    getNext (step) {
      let current = this.current
      while (true) {
        current += step
        if (!this.steps[current].disabled) {
          return current
        }
      }
    },
    setViewConfig () {
      this.model.queryItems = selectQueryItems(this.model.fieldSets)
      this.model.inputItems = selectFormItems(this.model.fieldSets)
      this.model.tableItems = selectEnableItems(this.model.fieldSets, 'showInList')
      this.model.importItems = this.model.genMethod.indexOf(GENERATOR_METHOD.IMPORT_DATA) === -1 ? [] : selectEnableItems(this.model.fieldSets, 'importData')
      this.model.exportItems = this.model.genMethod.indexOf(GENERATOR_METHOD.EXPORT_DATA) === -1 ? [] : selectEnableItems(this.model.fieldSets, 'exportData')
    },
    complete () {
      this.model.queryItems = this.$refs.steps2.queryData
      this.model.tableItems = this.$refs.steps2.tableData
      this.model.inputItems = this.$refs.steps3.data
      this.model.importItems = this.$refs.steps4.importData
      this.model.exportItems = this.$refs.steps4.exportData
      generate(this.model).then(res => {
          successTip()
      })
    }
  }
}
</script>
<style scoped lang="less">
.steps-content {
  margin-top: 30px;
}

.steps-action {
  text-align: right;

  .ant-btn {
    margin-right: 10px;
  }
}
</style>
