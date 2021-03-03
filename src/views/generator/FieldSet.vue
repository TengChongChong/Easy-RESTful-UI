<template>
  <div id="fieldSet" style="margin-bottom: 20px">
    <a-table
      row-key="columnName"
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :scroll="{ x: tableScrollX, y: tableScrollY }">
      <span slot="propertyName" slot-scope="text, record">
        <a-icon v-if="record.columnKey" type="key"/>
        <a-popover placement="top">
          <template slot="content">
            <span>列名：{{ record.columnName }}</span><br/>
            <span>类型：{{ record.columnType }}</span><br/>
            <span>属性：{{ record.propertyName }}</span><br/>
            <span>注释：{{ record.columnComment ? record.columnComment : '-' }}</span>
          </template>
          <span class="property-name">{{ text }}</span>
        </a-popover>
      </span>
      <span slot="showInList" slot-scope="text, record">
        <a-checkbox v-model="record.showInList"/>
      </span>
      <span slot="titleSlots" slot-scope="text, record">
        <a-input v-model="record.title"/>
      </span>
      <span slot="showInSearch" slot-scope="text, record">
        <a-checkbox v-model="record.showInSearch"/>
      </span>
      <span slot="matchingMode" slot-scope="text, record">
        <e-dict-select type="matchingMode" v-model="record.matchingMode"/>
      </span>

      <span slot="showInInput" slot-scope="text, record">
        <a-checkbox v-model="record.showInInput"/>
      </span>
      <span slot="label" slot-scope="text, record">
        <a-input v-model="record.label"/>
      </span>
      <span slot="inputGrid" slot-scope="text, record">
        <e-dict-select type="grid" v-model="record.inputGrid"/>
      </span>
      <span slot="elementType" slot-scope="text, record">
        <e-dict-select type="elementType" v-model="record.elementType"/>
      </span>
      <span slot="dictType" slot-scope="text, record">
        <a-select show-search option-filter-prop="children" :allowClear="true" v-model="record.dictType" style="width: 100%">
          <a-select-option v-for="item in dictTypes" :key="item.type">
            {{ item.name }}（{{ item.type }}）
          </a-select-option>
        </a-select>
      </span>
      <span slot="required" slot-scope="text, record">
        <a-checkbox v-model="record.required"/>
      </span>
      <span slot="validate" slot-scope="text, record">
        <a-input v-model="record.validate"/>
      </span>
      <span slot="exportData" slot-scope="text, record">
        <a-checkbox v-model="record.exportData"/>
      </span>
      <span slot="importData" slot-scope="text, record">
        <a-checkbox v-model="record.importData"/>
      </span>
    </a-table>
  </div>
</template>

<script>
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import { getElementOffset } from '@/utils/util'
import { getCheckStatusByPreferenceSetting, getDefaultDictByPreferenceSetting } from '@/views/generator/_util'
import { preferenceSetting } from '@/views/generator/_setting'
import { selectAll } from '@/api/sys/dict-type'
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { GENERATOR_METHOD } from '@/utils/const/generator/GeneratorMethod'
import { GENERATOR_FILE } from '@/utils/const/generator/GeneratorFile'

export default {
  name: 'GeneratorFieldSet',
  components: { EDictSelect },
  props: {
    tableFields: PropTypes.array.def([]),
    model: PropTypes.object.def({})
  },
  mounted () {
    // 初始化表列
    this.columns = this.initColumns()
    selectAll().then(res => {
      this.dictTypes = res.data
    })
    this.initData()
    // 添加 resize 绑定事件
    window.addEventListener('resize', this.resizeCallback, false)
  },
  watch: {
    tableFields () {
      this.initData()
    },
    model: {
      handler () {
        this.columns = this.initColumns()
      },
      deep: true
    }
  },
  data () {
    return {
      GENERATOR_METHOD: GENERATOR_METHOD,
      GENERATOR_FILE: GENERATOR_FILE,
      columns: [],
      dictTypes: [],
      data: [],
      tableScrollX: 900,
      tableScrollY: 300,
      timer: null
    }
  },
  methods: {
    initColumns () {
      const columns = [
        {
          dataIndex: 'propertyName',
          title: '属性',
          width: 120,
          ellipsis: true,
          scopedSlots: { customRender: 'propertyName' }
        }
      ]
      if (!this.model) {
        return columns
      }
      let genList = false
      let genInput = false
      if (this.model.genFile && this.model.genFile.length) {
        genList = this.model.genFile.indexOf(GENERATOR_FILE.LIST_VUE) > -1
        genInput = this.model.genFile.indexOf(GENERATOR_FILE.INPUT_VUE) > -1
      }
      if (genList) {
        columns.push({
          title: '列表',
          children: [
            {
              dataIndex: 'showInList',
              title: '显示',
              width: 50,
              scopedSlots: { customRender: 'showInList' }
            },
            {
              dataIndex: 'title',
              title: '标题',
              width: 120,
              scopedSlots: { customRender: 'titleSlots' }
            },
            {
              dataIndex: 'showInSearch',
              title: '查询',
              width: 50,
              scopedSlots: { customRender: 'showInSearch' }
            },
            {
              dataIndex: 'matchingMode',
              title: '匹配方式',
              width: 100,
              scopedSlots: { customRender: 'matchingMode' }
            }
          ]
        })
        if (!genInput) {
          // 如果没有input页面这里需要显示字典
          columns.push({
            dataIndex: 'dictType',
            title: '字典类型',
            width: 200,
            scopedSlots: { customRender: 'dictType' }
          })
        }
      }

      if (genInput) {
        columns.push({
          title: '表单',
          children: [
            {
              dataIndex: 'showInInput',
              title: '编辑',
              width: 50,
              scopedSlots: { customRender: 'showInInput' }
            },
            {
              dataIndex: 'label',
              title: 'label',
              width: 120,
              scopedSlots: { customRender: 'label' }
            },
            {
              dataIndex: 'inputGrid',
              title: '栅格',
              width: 120,
              scopedSlots: { customRender: 'inputGrid' }
            },
            {
              dataIndex: 'elementType',
              title: '元素类型',
              width: 130,
              scopedSlots: { customRender: 'elementType' }
            },
            {
              dataIndex: 'dictType',
              title: '字典类型',
              width: 200,
              scopedSlots: { customRender: 'dictType' }
            },
            {
              dataIndex: 'required',
              title: '必填',
              width: 50,
              scopedSlots: { customRender: 'required' }
            },
            {
              dataIndex: 'validate',
              title: '验证',
              width: 120,
              scopedSlots: { customRender: 'validate' }
            }
          ]
        })
      }
      if (this.model.genMethod && this.model.genMethod.length) {
        const genImport = this.model.genMethod.indexOf(GENERATOR_METHOD.IMPORT_DATA) > -1
        const genExport = this.model.genMethod.indexOf(GENERATOR_METHOD.EXPORT_DATA) > -1

        if (genImport) {
          columns.push({
            dataIndex: 'importData',
            title: '导入',
            width: 50,
            scopedSlots: { customRender: 'importData' }
          })
        }
        if (genExport) {
          columns.push({
            dataIndex: 'exportData',
            title: '导出',
            width: 50,
            scopedSlots: { customRender: 'exportData' }
          })
        }
        if ((genExport || genExport) && !genList && !genInput) {
          columns.push({
            dataIndex: 'dictType',
            title: '字典类型',
            width: 200,
            scopedSlots: { customRender: 'dictType' }
          })
        }
      }
      return columns
    },
    initData () {
      this.data = []
      this.tableFields.map((item, index) => {
        const { name, keyFlag, type, comment, propertyName, propertyType } = item
        this.data.push({
          index: index,
          columnName: name,
          isNullable: !keyFlag,
          columnType: type,
          columnKey: keyFlag,
          columnComment: comment,
          propertyName,
          propertyType,
          // 列表
          showInList: !getCheckStatusByPreferenceSetting(propertyName, preferenceSetting.list.exclude),
          title: comment,
          showInSearch: !getCheckStatusByPreferenceSetting(propertyName, preferenceSetting.list.excludeSearch),
          matchingMode: getDefaultDictByPreferenceSetting({
            propertyName,
            setting: preferenceSetting.list.matching,
            defaultValue: 'eq',
            ignoreDict: true
          }),
          listGrid: null,
          // 表单
          showInInput: !getCheckStatusByPreferenceSetting(propertyName, preferenceSetting.input.exclude),
          label: comment,
          elementType: getDefaultDictByPreferenceSetting({
            propertyName,
            propertyType,
            setting: preferenceSetting.input.type,
            defaultValue: 'text'
          }),
          dictType: this.getDictType(propertyName),
          required: false,
          validate: null,
          tips: null,
          inputGrid: '2',
          newRow: null,
          importData: !getCheckStatusByPreferenceSetting(propertyName, preferenceSetting.importExclude),
          exportData: !getCheckStatusByPreferenceSetting(propertyName, preferenceSetting.exportExclude)
        })
      })
    },
    getDictType (propertyName) {
      // eslint-disable-next-line no-undef
      return SYS_DICT[propertyName] ? propertyName : ''
    },
    /**
     * 窗口改变回调
     */
    resizeCallback () {
      // 使用定时器调用，防止持续拖动多次调用
      clearInterval(this.timer)
      this.timer = setTimeout(() => {
        this.calcHeight()
      }, 500)
    },
    calcHeight () {
      const el = document.getElementById('fieldSet')
      const offset = getElementOffset(el)
      const deviceHeight = document.documentElement.clientHeight
      const deviceWidth = document.documentElement.clientWidth
      this.tableScrollY = deviceHeight - offset.actualTop - 190
      this.tableScrollX = deviceWidth - offset.actualLeft - 100
    }
  },
  beforeDestroy () {
    // 删除绑定的resize事件
    window.removeEventListener('resize', this.resizeCallback)
  }
}
</script>

<style>
.ant-table-thead > tr > th {
  padding: 5px 10px;
}

.ant-table-tbody > tr > td {
  padding: 2px 10px;
}
.ant-table-tbody .property-name{
  cursor: pointer;
  border-bottom: 1px dashed #ddd;
}
</style>
