<template>
  <div id="fieldSet" style="margin-bottom: 20px">
    <a-table
      row-key="columnName"
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :scroll="{ x: tableScrollX, y: tableScrollY }">
      <span slot="columnName" slot-scope="text, record">
        <a-icon v-if="record.columnKey" type="key"/>
        {{ text }}
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
    </a-table>
  </div>
</template>

<script>
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import { getElementOffset } from '@/utils/util'
import { getCheckStatusByPreferenceSetting, getDefaultDictByPreferenceSetting } from '@/views/generator/_util'
import { preferenceSetting } from '@/views/generator/_setting'
import { selectAll } from '@/api/sys/dict-type'

const columns = [
  {
    title: '字段',
    children: [
      {
        dataIndex: 'columnName',
        title: '列名',
        width: 140,
        ellipsis: true,
        scopedSlots: { customRender: 'columnName' }
      },
      {
        dataIndex: 'columnType',
        title: '字段类型',
        width: 100,
        ellipsis: true
      },
      {
        dataIndex: 'columnComment',
        title: '注释',
        width: 120,
        ellipsis: true
      },
      {
        dataIndex: 'propertyName',
        title: '属性',
        width: 140,
        ellipsis: true
      },
      {
        dataIndex: 'propertyType',
        title: '类型',
        width: 120,
        ellipsis: true
      }
    ]
  },
  {
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
  },
  {
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
  }
]
export default {
  name: 'GeneratorFieldSet',
  components: { EDictSelect },
  props: {
    tableFields: {
      type: Array,
      default: null
    }
  },
  mounted () {
    selectAll().then(res => {
      this.dictTypes = res.data
    })
    this.initData()
    this.calcHeight()
    // 添加 resize 绑定事件
    window.addEventListener('resize', this.resizeCallback, false)
  },
  watch: {
    tableFields () {
      this.initData()
    }
  },
  data () {
    this.columns = columns
    return {
      dictTypes: [],
      data: [],
      tableScrollX: 900,
      tableScrollY: 300,
      timer: null
    }
  },
  methods: {
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
          newRow: null
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
      this.tableScrollX = deviceWidth - offset.actualLeft
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
</style>
