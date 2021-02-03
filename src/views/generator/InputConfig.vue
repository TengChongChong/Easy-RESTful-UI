<template>
  <div>
    <a-alert message="请拖动下方标签调整表单显示顺序" type="info" show-icon style="margin-bottom: 10px"/>
    <a-card title="表单显示顺序">
      <div class="form-items">
        <a-row class="form-row" :gutter="16">
          <draggable v-model="data" v-bind="{ghostClass: 'ghost'}">
            <transition-group type="transition" :name="'flip-list'">
              <template v-for="item in data">
                <a-col v-if="item.inputGrid === '2'" :lg="12" :sm="24" :key="item.propertyName">
                  <span class="item">{{ item.title }}：{{ item.propertyName }}</span>
                </a-col>
                <a-col v-else :sm="24" :key="item.propertyName">
                  <span class="item">{{ item.title }}：{{ item.propertyName }}</span>
                </a-col>
              </template>
            </transition-group>
          </draggable>
        </a-row>
      </div>

    </a-card>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'GeneratorInputConfig',
  components: {
    draggable
  },
  props: {
    inputItems: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      data: [],
      dragging: false
    }
  },
  watch: {
    inputItems (newVal) {
      this.data = newVal
    }
  },
  mounted () {
    this.data = this.inputItems
  }
}
</script>

<style lang="less" scoped>
.form-items {
  .item {
    display: inline-block;
    width: 100%;
    padding: 10px 20px;
    margin: 5px;
    text-align: center;
    border-radius: 4px;
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;

    &:hover {
      cursor: move;
      box-shadow: 2px 2px 2px rgba(0, 0, 0, .1);
    }
  }
}
</style>
