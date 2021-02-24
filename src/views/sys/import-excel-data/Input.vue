<template>
  <a-card :title="`导入数据 - ${template.name}`" :bordered="false">
    <a-steps :current="current">
      <a-step v-for="item in steps" :key="item" :title="item"/>
    </a-steps>
    <div class="steps-content">
      <div v-if="current === 0">
        <a-alert message="请先下载模板，填写完成后导入" type="info" show-icon style="margin-bottom: 10px"/>
        <div class="btn-group">
          <a-button icon="download" @click="downloadTemplate(template.importCode)">下载模板</a-button>
          <e-upload accept=".xls,.xlsx" :max-files="1" :max-file-size="10" v-model="file"/>
        </div>
      </div>
      <div v-if="current === 1">
        <div class="spin">
          <a-spin tip="正在解析文件，请稍候..." size="large"/>
        </div>
      </div>
      <div v-if="current === 2">
        <a-alert
          v-if="summary.total"
          :message="summary.total === summary.success ? `共${summary.total}条数据，全部验证通过` : summary.success > 0 ? `共${summary.total}条数据，验证通过${summary.success}条，验证失败${summary.fail}条` : `共${summary.total}条数据，全部验证失败`"
          :type="summary.total === summary.success ? 'success' : summary.success > 0 ? 'warning' : 'error'"
          style="margin-bottom: 10px"
          show-icon/>
        <s-table
          ref="eTable"
          :columns="columns"
          :data="loadData"
          showPagination="auto"
        >

          <template v-for="item in dictionaries" :slot="item" slot-scope="text">
            <e-dict-tag :key="item" :type="item" :code="text"/>
          </template>

          <span slot="verificationResults" slot-scope="text, record">
            <a-tag :color="record.verificationStatus === '1' ? 'cyan' : 'red'">
              {{ record.verificationStatus === '1' ? '验证通过' : text }}
            </a-tag>
          </span>
          <span slot="action" slot-scope="text, record">
            <e-btn-edit :to="`/sys/config/input`" :tab-name="record.field1" :id="record.id"/>
            <e-btn-remove :id="record.id" :divider="false" :click-callback="remove"/>
          </span>
        </s-table>
      </div>
      <div v-if="current === 3">
        <div class="spin" v-if="!isComplete">
          <a-spin tip="正在保存数据，请稍候..." size="large"/>
        </div>
        <a-result
          v-else
          :title="`成功导入${completeCount}条数据`"
          :sub-title="summary.fail ? `${summary.fail}条数据由于验证失败未导入，你可以下载验证失败数据修改后重新导入。` : null"
          :status="completeCount === summary.total ? 'success' : completeCount > 0 ? 'warning' : 'error'">
          <template #extra>
            <a-button icon="upload" type="primary" @click="reImport">
              继续导入
            </a-button>
            <a-button
              icon="download"
              v-if="summary.fail > 0"
              @click="exportVerificationFailData"
            >
              下载验证失败数据
            </a-button>
          </template>
        </a-result>
      </div>
    </div>
    <div class="steps-action">
      <a-button icon="upload" @click="reImport" v-if="current === 2">
        重新选择文件
      </a-button>
      <a-button
        icon="right"
        :loading="nextLoading"
        v-if="current === 0 && this.file.length > 0"
        type="primary"
        @click="next">
        下一步
      </a-button>
      <a-button
        icon="download"
        v-if="summary.fail > 0 && current !== steps.length - 1"
        @click="exportVerificationFailData"
      >
        下载验证失败数据
      </a-button>
      <a-button
        icon="check"
        v-if="current === steps.length - 2 && summary.success > 0"
        type="primary"
        @click="insertData"
      >
        保存验证通过数据
      </a-button>
    </div>
  </a-card>
</template>
<script>
import { STable, Ellipsis } from '@/components'
import { analysis, exportVerificationFailData, insertData, select, selectSummary } from '@/api/sys/import-excel-data'
import { selectTemporaryData, remove, cleanMyImport } from '@/api/sys/import-excel-temporary'
import { downloadTemplate } from '@/api/sys/import-excel-template'
import { downloadFileById } from '@/utils/util'
import EUpload from '@/components/Easy/data-entry/Upload'
import { selectTableHeadByTemplateCode } from '@/api/sys/import-excel-template-details'
import EDictTag from '@/components/Easy/data-display/DictTag'
import EBtnEdit from '@/components/Easy/general/BtnEdit'
import EBtnRemove from '@/components/Easy/general/BtnRemove'

export default {
  name: 'ImportExcelDataInput',
  components: { EBtnRemove, EBtnEdit, EDictTag, EUpload, STable, Ellipsis },
  data () {
    return {
      importCode: this.$route.query.importCode,
      steps: [
        '上传数据', '解析数据', '查看数据', '导入数据'
      ],
      current: 0,
      nextLoading: false,
      hasLast: false,
      template: {},
      summary: {},
      file: [],
      columns: [],
      dictionaries: [],
      isComplete: false,
      completeCount: 0
    }
  },
  mounted () {
    if (this.importCode) {
      select(this.importCode).then(res => {
        const { hasLast, template } = res.data
        this.hasLast = hasLast
        this.template = template

        if (this.hasLast) {
          const _this = this
          this.$confirm({
            title: '你有上次未处理完的数据，是否继续处理？',
            content: h => <div style="color:#ff4d4f;">如选择取消，未处理完数据将丢失，请谨慎操作</div>,
            onOk () {
              // 上次导入数据未确认
              _this.current = 2
              _this.loadTable()
            },
            onCancel () {
              _this.reImport()
            }
          })
        }
      })
    }
  },
  computed: {},
  methods: {
    next () {
      switch (this.current) {
        case 0:
          this.nextLoading = true
          this.current++
          analysis(this.template.id, this.file[0].path).then(res => {
            this.nextLoading = false
            this.current++
            this.loadTable()
          }).catch(({ response }) => {
            this.nextLoading = false
            this.current = 0
          })
          break
        case 1:
          break
        case 2:
          break
        case 3:
          break
        case 4:
          break
      }
    },
    prev () {
      this.current--
    },
    /**
     * 下载模板
     *
     * @param importCode {string} 模板代码
     */
    downloadTemplate (importCode) {
      downloadTemplate(importCode).then(res => {
        downloadFileById(res.data)
      })
    },
    selectSummary () {
      selectSummary(this.template.id).then(({ data }) => {
        this.summary = data
      })
    },
    // 加载数据方法 必须为 Promise 对象
    loadData (parameter) {
      const requestParameters = Object.assign({ templateId: this.template.id }, parameter, this.queryParam)
      return selectTemporaryData(requestParameters)
        .then(res => {
          return res.data
        })
    },
    loadTable () {
      this.selectSummary()
      this.columns = []
      // 加载表头
      selectTableHeadByTemplateCode(this.template.id).then(({ data }) => {
        data.map(item => {
          if (item.dictType) {
            !this.dictionaries.includes(item.dictType) && this.dictionaries.push(item.dictType)
          }
          this.columns.push({
            title: item.title,
            dataIndex: item.field,
            width: 160,
            scopedSlots: { customRender: item.dictType }
          })
        })
        this.columns.push({
          title: '验证结果',
          dataIndex: 'verificationResults',
          width: 160,
          scopedSlots: { customRender: 'verificationResults' }
        })
        this.columns.push({
          title: '操作',
          dataIndex: 'action',
          width: 90,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        })
      })
      // 加载数据
    },
    remove (id) {
      remove(id).then(res => {
        this.$refs.eTable.refresh(true)
        this.selectSummary()
      })
    },
    // 插入数据
    insertData () {
      this.current++
      insertData(this.template.id).then(({ data }) => {
        this.completeCount = data
        this.isComplete = true
      }).catch(({ response }) => {
        this.isComplete = false
        this.current--
      })
    },
    // 导出验证失败数据
    exportVerificationFailData () {
      exportVerificationFailData(this.template.id).then(({ data }) => {
        downloadFileById(data)
      })
    },
    // 清空指定导入代码中数据
    cleanMyImport () {
      cleanMyImport(this.template.id).then(res => {
      })
    },
    reImport () {
      this.current = 0
      this.nextLoading = false
      this.hasLast = false
      this.summary = {}
      this.file = []
      this.columns = []
      this.cleanMyImport()
    }
  }
}
</script>
<style lang="less">
.steps-content {
  padding: 20px 0;
}

.steps-action {
  text-align: right;

  .ant-btn {
    margin-right: 10px;
  }
}

.spin {
  padding: 50px;
  text-align: center;
}

.btn-group {
  max-width: 520px;
}
</style>
