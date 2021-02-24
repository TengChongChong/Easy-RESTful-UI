<template>
  <a-card title="导入规则" :bordered="false">
    <a-form-model
      ref="form"
      :model="model"
      :label-col="FORM_LAYOUT.labelCol"
      :wrapper-col="FORM_LAYOUT.wrapperCol">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="8">
          <a-form-model-item label="导入表" prop="importTable">
            {{ model.importTable }}
          </a-form-model-item>
        </a-col>
        <a-col :lg="8">
          <a-form-model-item label="名称" prop="name">
            {{ model.name }}
          </a-form-model-item>
        </a-col>
        <a-col :lg="8">
          <a-form-model-item label="模板代码" prop="importCode">
            {{ model.importCode }}
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-col :sm="24">
        <a-table
          id="fieldSet"
          row-key="fieldName"
          :columns="columns"
          :data-source="data"
          :pagination="false"
          :scroll="{ x: tableScrollX, y: tableScrollY }">
          <span slot="needImport" slot-scope="text, record">
            <a-checkbox v-model="record.needImport"/>
          </span>
          <span slot="titleSlots" slot-scope="text, record">
            <a-input :disabled="!record.needImport" v-model="record.title"/>
          </span>

          <span slot="needReplace" slot-scope="text, record">
            <a-checkbox :disabled="!record.needImport" v-model="record.needReplace"/>
          </span>
          <span slot="replaceTable" slot-scope="text, record">
            <a-select
              show-search
              :disabled="!record.needImport || !record.needReplace"
              option-filter-prop="children"
              :allowClear="true"
              v-model="record.replaceTable"
              @change="onReplaceTableChange(record)"
              style="width: 100%">
              <a-select-option v-for="item in tableList" :key="item.value">
                {{ item.value }} - {{ item.text }}
              </a-select-option>
            </a-select>
          </span>
          <span slot="replaceTableDictType" slot-scope="text, record">
            <a-select
              show-search
              :disabled="!record.needImport || !record.needReplace || record.replaceTable !== 'sys_dict'"
              option-filter-prop="children"
              :allowClear="true"
              v-model="record.replaceTableDictType"
              style="width: 100%">
              <a-select-option v-for="item in dictTypes" :key="item.type">
                {{ item.name }}（{{ item.type }}）
              </a-select-option>
            </a-select>
          </span>
          <span slot="replaceTableFieldName" slot-scope="text, record">
            <e-table-field
              :disabled="!record.needImport || !record.needReplace"
              :table="record.replaceTable"
              v-model="record.replaceTableFieldName"/>
          </span>
          <span slot="replaceTableFieldValue" slot-scope="text, record">
            <e-table-field
              :disabled="!record.needImport || !record.needReplace"
              :table="record.replaceTable"
              v-model="record.replaceTableFieldValue"/>
          </span>

          <span slot="required" slot-scope="text, record">
            <a-checkbox :disabled="!record.needImport" v-model="record.required"/>
          </span>
          <span slot="only" slot-scope="text, record">
            <a-checkbox :disabled="!record.needImport" v-model="record.only"/>
          </span>
        </a-table>
        <div class="input-btn-group" style="margin-top: 15px">
          <e-btn-save
            :permissions="SYS_PERMISSIONS_CODE.SYS_IMPORT_EXCEL_TEMPLATE_SAVE"
            :loading="saveLoading"
            :click-callback="save"/>
          <a-button
            icon="ordered-list"
            v-if="settingCount > 1"
            @click="showOrderModal()">
            排序
          </a-button>
        </div>
      </a-col>
    </a-form-model>
    <a-modal
      title="排序"
      :visible="orderModalVisible"
      @cancel="() => this.orderModalVisible = false"
      @ok="onOrderOk"
    >
      <a-alert message="请拖动下方标签调整Excel中字段显示顺序" type="info" show-icon style="margin-bottom: 10px"/>
      <div class="order-list">
        <draggable v-model="orderData" v-bind="{ghostClass: 'ghost'}">
          <transition-group type="transition" :name="'flip-list'">
            <span class="item" :key="item.fieldName" v-for="item in orderData">
              {{ item.title }}<br/>
              {{ item.fieldName }}
            </span>
          </transition-group>
        </draggable>
      </div>
    </a-modal>
  </a-card>
</template>
<script>
import draggable from 'vuedraggable'
import { FORM_LAYOUT } from '@/utils/const/form'
import { get } from '@/api/sys/import-excel-template'
import { select, save } from '@/api/sys/import-excel-template-details'
import { selectFields, selectTable } from '@/api/generator'
import { getElementOffset, isNotBlank } from '@/utils/util'
import { selectAll } from '@/api/sys/dict-type'
import ETableField from '@/views/sys/import-excel-template-details/TableField'
import { SYS_PERMISSIONS_CODE } from '@/utils/const/sys/PermissionsCode'
import { saveSuccessTip } from '@/utils/tips'
import EBtnSave from '@/components/Easy/general/BtnSave'

/**
 * 偏好设置
 * 选择以下表如果替换字段没选默认为以下值
 */
const SETTING = {
  // 字典
  'sys_dict': {
    name: 'name',
    value: 'code'
  },
  // 组织机构
  'sys_dept': {
    name: 'name',
    value: 'id'
  },
  // 行政区划
  'sys_district': {
    name: 'name',
    value: 'code'
  }
}

const columns = [
  {
    dataIndex: 'needImport',
    title: '导入',
    width: 50,
    scopedSlots: { customRender: 'needImport' }
  },
  {
    title: '字段',
    children: [
      {
        dataIndex: 'fieldName',
        title: '列名',
        width: 140,
        ellipsis: true
      },
      {
        dataIndex: 'fieldType',
        title: '字段类型',
        width: 100,
        ellipsis: true
      },
      {
        dataIndex: 'title',
        title: '标题',
        width: 120,
        ellipsis: true,
        scopedSlots: { customRender: 'titleSlots' }
      }
    ]
  },
  {
    title: '字段转换',
    children: [
      {
        dataIndex: 'needReplace',
        title: '替换',
        width: 50,
        scopedSlots: { customRender: 'needReplace' }
      },
      {
        dataIndex: 'replaceTable',
        title: '替换表',
        width: 180,
        scopedSlots: { customRender: 'replaceTable' }
      },
      {
        dataIndex: 'replaceTableDictType',
        title: '字典类别',
        width: 180,
        scopedSlots: { customRender: 'replaceTableDictType' }
      },
      {
        dataIndex: 'replaceTableFieldName',
        title: '导入值',
        width: 160,
        scopedSlots: { customRender: 'replaceTableFieldName' }
      },
      {
        dataIndex: 'replaceTableFieldValue',
        title: '替换值',
        width: 160,
        scopedSlots: { customRender: 'replaceTableFieldValue' }
      }
    ]
  },
  {
    dataIndex: 'required',
    title: '必填',
    width: 50,
    scopedSlots: { customRender: 'required' }
  },
  {
    dataIndex: 'only',
    title: '唯一',
    width: 50,
    scopedSlots: { customRender: 'only' }
  }
]
export default {
  name: 'ImportExcelTemplateDetailsInput',
  components: { EBtnSave, ETableField, draggable },
  data () {
    this.columns = columns
    return {
      id: this.$route.query.id,
      saveLoading: false,
      FORM_LAYOUT: FORM_LAYOUT,
      SYS_PERMISSIONS_CODE: SYS_PERMISSIONS_CODE,
      orderModalVisible: false,
      model: {},
      tableList: [],
      dictTypes: [],
      fields: [],
      data: [],
      orderData: [],
      tableScrollX: 900,
      tableScrollY: 300,
      timer: null,
      SETTING: SETTING
    }
  },
  mounted () {
    get(this.id).then((res) => {
      this.model = res.data
      this.initData()
    })
    selectTable().then(res => {
      this.tableList = res.data
    })
    selectAll().then(res => {
      this.dictTypes = res.data
    })
    this.calcHeight()
    // 添加 resize 绑定事件
    window.addEventListener('resize', this.resizeCallback, false)
  },
  computed: {
    settingCount () {
      let count = 0
      this.data.map(item => {
        if (item.needImport) {
          count++
        }
      })
      return count
    }
  },
  methods: {
    initData () {
      this.data = []
      select(this.model.id).then(res => {
        selectFields(this.model.importTable).then(({ data }) => {
          const isSetting = []
          res.data.map(item => {
            const filed = this.findFields(item.fieldName, data.fields)
            const { type, propertyName } = filed
            this.data.push(Object.assign(item, {
              propertyName,
              needImport: true,
              fieldType: type,
              needReplace: isNotBlank(item.replaceTable)
            }))
            isSetting.push(item.fieldName)
          })

          this.fields = data.fields
          this.initNoSettings()
        })
      })
    },
    /**
     * 根据字段名查询数据最新字段属性
     *
     * @param columnName 字段名
     * @param fields {array} 字段
     * @return 字段 {object}
     */
    findFields (columnName, fields) {
      let res = []
      if (fields && fields.length) {
        res = fields.filter(item => item.columnName === columnName)
      }
      return res.length ? res[0] : {}
    },
    onReplaceTableChange (record) {
      record.replaceTableFieldName = null
      record.replaceTableFieldName = null

      if (SETTING[record.replaceTable]) {
        record.replaceTableFieldName = SETTING[record.replaceTable].name
        record.replaceTableFieldValue = SETTING[record.replaceTable].value
      }

      if (record.replaceTable === 'sys_dict') {
        const res = this.dictTypes.filter(item => item.type === record.propertyName)
        if (res.length) {
          record.replaceTableDictType = record.propertyName
        }
      } else {
        record.replaceTableDictType = null
      }
    },
    initNoSettings () {
      const isSetting = []
      this.data.map(item => {
        isSetting.push(item.fieldName)
      })
      const noSettings = this.fields.filter(item => !isSetting.includes(item.columnName))

      noSettings.map(item => {
        const { columnName, type, comment, propertyName } = item
        this.data.push({
          propertyName,
          needImport: false,
          fieldName: columnName,
          fieldType: type,
          title: comment,
          needReplace: false,
          replaceTable: null,
          replaceTableDictType: null,
          replaceTableFieldName: null,
          replaceTableFieldValue: null,
          required: false,
          only: false
        })
      })
    },
    showOrderModal () {
      this.orderData = this.data.filter(item => item.needImport)
      this.orderModalVisible = true
    },
    onOrderOk () {
      this.orderModalVisible = false
      this.data = this.orderData
      this.initNoSettings()
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
      this.tableScrollY = deviceHeight - offset.actualTop - 120
      this.tableScrollX = deviceWidth - offset.actualLeft - 50
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveLoading = true
          const setting = this.data.filter(item => item.needImport)
          setting.map((item, index) => {
            if (!item.needReplace) {
              item.replaceTable = null
              item.replaceTableDictType = null
              item.replaceTableFieldName = null
              item.replaceTableFieldValue = null
            }
            item.orderNo = index + 1
          })

          save(this.model.id, setting).then((res) => {
            this.saveLoading = false
            saveSuccessTip()
          }).catch(({ response }) => {
            this.saveLoading = false
          })
        }
      })
    }
  },
  beforeDestroy () {
    // 删除绑定的resize事件
    window.removeEventListener('resize', this.resizeCallback)
  }
}
</script>
<style lang="less">
.ant-table-thead > tr > th {
  padding: 5px 10px;
}

.ant-table-tbody > tr > td {
  padding: 2px 10px;
}

.order-list {
  .item {
    display: inline-block;
    padding: 5px 10px;
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
