<template>
  <div>
    <a-alert message="请拖动下方标签调整字段顺序" type="info" show-icon style="margin-bottom: 10px"/>
    <a-card title="导入字段顺序">
      <div v-if="importItems.length" class="table-items">
        <draggable v-model="importData" v-bind="{ghostClass: 'ghost'}">
          <transition-group type="transition" :name="'flip-list'">
            <span class="item" v-for="item in importData" :key="item.propertyName">
              {{ item.title }}
              <br/>
              {{ item.propertyName }}
            </span>
          </transition-group>
        </draggable>
      </div>
    </a-card>

    <a-card v-if="exportItems.length" title="导出字段顺序">
      <div class="table-items">
        <draggable v-model="exportData" v-bind="{ghostClass: 'ghost'}">
          <transition-group type="transition" :name="'flip-list'">
            <span class="item" v-for="item in exportData" :key="item.propertyName">
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
  name: 'GeneratorImportAndExportConfig',
  components: {
    draggable
  },
  props: {
    importItems: {
      type: Array,
      default: null
    },
    exportItems: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      exportData: [],
      importData: [],
      dragging: false
    }
  },
  watch: {
    importItems (newVal) {
      this.importData = newVal
    },
    exportItems (newVal) {
      this.exportData = newVal
    }
  },
  mounted () {
    this.exportData = this.exportItems
    this.importData = this.importItems
  }
}
</script>

<style lang="less" scoped>
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
</style>
