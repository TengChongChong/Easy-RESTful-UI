<template>
  <a-card title="代码生成" :bordered="false">
    <div>
      <a-steps :current="current" type="navigation" size="small" :style="stepStyle">
        <a-step :key="item.title" v-for="item in steps" :title="item.title" :disabled="item.disabled"/>
      </a-steps>
      <div class="steps-content">
        <generator-base-info ref="steps0" v-model="model" v-show="current === 0"/>
        <generator-field-set ref="steps1" :table-fields="model.tableFields" v-show="current === 1"/>
        <generator-list-config ref="steps2" :query-items="model.queryItems" :table-items="model.tableItems" v-show="current === 2"/>
        <generator-input-config ref="steps3" :input-items="model.inputItems" v-show="current === 3"/>
        <generator-complete ref="steps4" :model="model" v-if="current === 4"/>
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
import { selectFormItems, selectQueryItems, selectTableItems } from '@/views/generator/_util'

export default {
  name: 'GeneratorView',
  components: { GeneratorComplete, GeneratorInputConfig, GeneratorListConfig, GeneratorFieldSet, GeneratorBaseInfo },
  data () {
    return {
      model: {
        generatorTemplate: 'default',
        tableFields: [],
        fieldSets: [],
        queryItems: [],
        tableItems: [],
        inputItems: []
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
        { title: '完成页面', disabled: true }
      ]
    }
  },
  methods: {
    next () {
      this.$refs.steps0.validate(valid => {
        if (valid) {
          this.steps[this.current + 1].disabled = false
          switch (this.current) {
            case 0:
              break
            case 1:
              this.model.fieldSets = this.$refs.steps1.data
              this.setViewConfig()
              this.steps[2].disabled = this.model.genFile.indexOf('List.vue') === -1
              this.steps[3].disabled = this.model.genFile.indexOf('Input.vue') === -1
              if (this.steps[2].disabled && this.steps[3].disabled) {
                this.steps[4].disabled = false
              }
              break
            default:
              break
          }
          this.current = this.getNext(1)
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
      this.model.tableItems = selectTableItems(this.model.fieldSets)
      this.model.inputItems = selectFormItems(this.model.fieldSets)
    },
    complete () {
      this.model.queryItems = this.$refs.steps2.queryData
      this.model.tableItems = this.$refs.steps2.tableData
      this.model.inputItems = this.$refs.steps3.data
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
