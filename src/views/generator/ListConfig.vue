<template>
  <div>
    <a-alert message="请拖动下方标签调整查询条件与表格显示顺序" type="info" show-icon style="margin-bottom: 10px"/>
    <a-card title="查询条件顺序">
      <div class="query-items">
        <a-row :gutter="16">
          <draggable v-model="queryData" v-bind="{ghostClass: 'ghost'}">
            <transition-group type="transition" :name="'flip-list'">
              <a-col
                v-for="item in queryData"
                :key="item.propertyName"
                :xxl="6"
                :xl="8"
                :lg="12"
                :sm="24">
                <span class="item">{{ item.label }}：{{ item.propertyName }}</span>
              </a-col>
            </transition-group>
          </draggable>
        </a-row>
      </div>
    </a-card>
    <a-card title="表格显示顺序">
      <div class="table-items">
        <draggable v-model="tableData" v-bind="{ghostClass: 'ghost'}">
          <transition-group type="transition" :name="'flip-list'">
            <span class="item" v-for="item in tableData" :key="item.propertyName">
              {{ item.title }}
              <br/>
              {{ item.propertyName }}
            </span>
          </transition-group>
        </draggable>
      </div>

    </a-card>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'GeneratorListConfig',
  components: {
    draggable
  },
  props: {
    queryItems: {
      type: Array,
      default: null
    },
    tableItems: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      queryData: [],
      tableData: [],
      dragging: false
    }
  },
  watch: {
    queryItems (newVal) {
      this.queryData = newVal
    },
    tableItems (newVal) {
      this.tableData = newVal
    }
  },
  mounted () {
    this.queryData = this.queryItems
    this.tableData = this.tableItems
  }
}
</script>

<style lang="less" scoped>
.query-items,
.table-items {
  .item {
    display: inline-block;
    min-width: 100px;
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

.query-items {
  .item {
    width: 100%;
  }
}
</style>
