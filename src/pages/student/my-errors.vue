<template>
  <div class="my-errors-container">
    <a-card title="我的错题">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="showImportModal">
            <UploadOutlined /> 导入错题
          </a-button>
          <a-dropdown>
            <template #overlay>
              <a-menu @click="handleExport">
                <a-menu-item key="excel">
                  <FileExcelOutlined /> 导出为 Excel
                </a-menu-item>
                <a-menu-item key="pdf">
                  <FilePdfOutlined /> 导出为 PDF
                </a-menu-item>
              </a-menu>
            </template>
            <a-button>
              <DownloadOutlined /> 导出错题
              <DownOutlined />
            </a-button>
          </a-dropdown>
        </a-space>
      </template>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <a-space size="middle" wrap>
          <a-select
            v-model:value="filterType"
            placeholder="题目类型"
            style="width: 150px"
            allowClear
          >
            <a-select-option value="">全部类型</a-select-option>
            <a-select-option value="选择题">选择题</a-select-option>
            <a-select-option value="单词拼写">单词拼写</a-select-option>
            <a-select-option value="填空题">填空题</a-select-option>
          </a-select>

          <a-range-picker
            v-model:value="filterDateRange"
            format="YYYY-MM-DD"
            placeholder="['开始日期', '结束日期']"
            style="width: 280px"
          />

          <a-button type="primary" @click="applyFilter">
            <SearchOutlined /> 筛选
          </a-button>
          <a-button @click="resetFilter">
            <ReloadOutlined /> 重置
          </a-button>
        </a-space>
      </div>

      <!-- 批量操作 -->
      <div class="batch-actions" v-if="selectedRowKeys.length > 0">
        <a-space>
          <span>已选择 {{ selectedRowKeys.length }} 项</span>
          <a-button danger size="small" @click="batchDelete">
            批量删除
          </a-button>
        </a-space>
      </div>

      <!-- 错题列表 -->
      <a-table
        :columns="columns"
        :data-source="filteredErrors"
        :row-selection="rowSelection"
        :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'question'">
            <div class="question-cell">
              {{ record.question }}
            </div>
          </template>
          <template v-if="column.key === 'questionType'">
            <a-tag :color="getQuestionTypeColor(record.questionType)">
              {{ record.questionType }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="viewDetail(record)">
                详情
              </a-button>
              <a-button type="link" size="small" @click="editError(record)">
                编辑
              </a-button>
              <a-popconfirm
                title="确定要删除这道错题吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="deleteError(record)"
              >
                <a-button type="link" danger size="small">
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 导入错题弹窗 -->
    <a-modal
      v-model:open="importModalVisible"
      title="导入错题"
      @ok="handleImport"
      @cancel="importModalVisible = false"
    >
      <a-upload-dragger
        v-model:fileList="fileList"
        :before-upload="beforeUpload"
        accept=".xlsx,.xls"
        :max-count="1"
      >
        <p class="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p class="ant-upload-hint">
          仅支持 Excel 格式文件（.xlsx, .xls）
        </p>
      </a-upload-dragger>
    </a-modal>

    <!-- 错题详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="错题详情"
      width="800px"
      :footer="null"
    >
      <div v-if="currentError" class="error-detail">
        <a-descriptions bordered :column="2">
          <a-descriptions-item label="题目类型">
            <a-tag :color="getQuestionTypeColor(currentError.questionType)">
              {{ currentError.questionType }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="所属班级">{{ currentError.className }}</a-descriptions-item>
          <a-descriptions-item label="错误日期" :span="2">{{ currentError.errorDate }}</a-descriptions-item>
        </a-descriptions>

        <a-divider>题目内容</a-divider>
        <div class="question-content">
          <p><strong>题目：</strong>{{ currentError.question }}</p>
        </div>

        <div v-if="currentError.options && currentError.options.length > 0" class="options-section">
          <p><strong>选项：</strong></p>
          <div 
            v-for="(option, index) in currentError.options" 
            :key="index"
            class="option-item"
            :class="{
              'correct-option': option.key === currentError.correctAnswer,
              'wrong-option': option.key === currentError.userAnswer && option.key !== currentError.correctAnswer
            }"
          >
            {{ option.key }}. {{ option.value }}
            <a-tag v-if="option.key === currentError.correctAnswer" color="success" style="margin-left: 10px">
              正确答案
            </a-tag>
            <a-tag v-if="option.key === currentError.userAnswer && option.key !== currentError.correctAnswer" color="error" style="margin-left: 10px">
              您的答案
            </a-tag>
          </div>
        </div>

        <div v-else class="answer-section">
          <p><strong>正确答案：</strong><span class="correct-text">{{ currentError.correctAnswer }}</span></p>
          <p><strong>您的答案：</strong><span class="wrong-text">{{ currentError.userAnswer }}</span></p>
        </div>

        <div v-if="currentError.explanation" class="explanation-section">
          <a-divider>解析</a-divider>
          <p>{{ currentError.explanation }}</p>
        </div>
      </div>
    </a-modal>

    <!-- 编辑错题弹窗 -->
    <a-modal
      v-model:open="editModalVisible"
      title="编辑错题"
      @ok="saveEdit"
      @cancel="editModalVisible = false"
      width="700px"
    >
      <a-form :model="editForm" layout="vertical">
        <a-form-item label="题目内容">
          <a-textarea v-model:value="editForm.question" :rows="3" />
        </a-form-item>
        <a-form-item label="题目类型">
          <a-select v-model:value="editForm.questionType">
            <a-select-option value="选择题">选择题</a-select-option>
            <a-select-option value="单词拼写">单词拼写</a-select-option>
            <a-select-option value="填空题">填空题</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="正确答案">
          <a-input v-model:value="editForm.correctAnswer" />
        </a-form-item>
        <a-form-item label="解析">
          <a-textarea v-model:value="editForm.explanation" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import {
  UploadOutlined,
  DownloadOutlined,
  DownOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  SearchOutlined,
  ReloadOutlined,
  InboxOutlined
} from '@ant-design/icons-vue'

// 表格列配置
const columns = [
  { title: '题目', dataIndex: 'question', key: 'question', width: 300, ellipsis: true },
  { title: '题目类型', dataIndex: 'questionType', key: 'questionType', width: 120 },
  { title: '所属班级', dataIndex: 'className', key: 'className', width: 120 },
  { title: '错误日期', dataIndex: 'errorDate', key: 'errorDate', width: 150 },
  { title: '操作', key: 'action', width: 200, fixed: 'right' },
]

// 错题数据（模拟从任务中自动记录的错题）
const errorList = ref([
  {
    id: 1,
    question: '单词 "abandon" 的中文意思是？',
    questionType: '选择题',
    className: 'B2班',
    errorDate: '2024-02-08 14:30',
    options: [
      { key: 'A', value: '放弃' },
      { key: 'B', value: '能力' },
      { key: 'C', value: '缺席' },
      { key: 'D', value: '吸收' },
    ],
    correctAnswer: 'A',
    userAnswer: 'B',
    explanation: 'abandon 是动词，意为"放弃、抛弃"。',
  },
  {
    id: 2,
    question: '请翻译单词 "ability"',
    questionType: '单词拼写',
    className: 'B2班',
    errorDate: '2024-02-08 14:35',
    correctAnswer: '能力',
    userAnswer: '才能',
    explanation: 'ability 的准确翻译是"能力"。',
  },
  {
    id: 3,
    question: '单词 "absent" 的中文意思是？',
    questionType: '选择题',
    className: 'C1班',
    errorDate: '2024-01-25 10:20',
    options: [
      { key: 'A', value: '出席的' },
      { key: 'B', value: '缺席的' },
      { key: 'C', value: '抽象的' },
      { key: 'D', value: '绝对的' },
    ],
    correctAnswer: 'B',
    userAnswer: 'A',
    explanation: 'absent 是形容词，意为"缺席的、不在的"。',
  },
  {
    id: 4,
    question: '填空：I have the _____ to finish this task. (能力)',
    questionType: '填空题',
    className: 'B2班',
    errorDate: '2024-02-07 16:45',
    correctAnswer: 'ability',
    userAnswer: 'abilities',
    explanation: '此处应该用单数形式 ability。',
  },
  {
    id: 5,
    question: '单词 "accept" 的中文意思是？',
    questionType: '选择题',
    className: 'C1班',
    errorDate: '2024-01-20 09:15',
    options: [
      { key: 'A', value: '拒绝' },
      { key: 'B', value: '接受' },
      { key: 'C', value: '期待' },
      { key: 'D', value: '除了' },
    ],
    correctAnswer: 'B',
    userAnswer: 'D',
    explanation: 'accept 是动词，意为"接受、认可"。注意不要与 except（除了）混淆。',
  },
])

// 筛选条件
const filterType = ref('')
const filterDateRange = ref(null)

// 筛选后的错题列表
const filteredErrors = computed(() => {
  let result = [...errorList.value]

  // 按题目类型筛选
  if (filterType.value) {
    result = result.filter(item => item.questionType === filterType.value)
  }

  // 按日期范围筛选
  if (filterDateRange.value && filterDateRange.value.length === 2) {
    const [startDate, endDate] = filterDateRange.value
    result = result.filter(item => {
      const errorDate = new Date(item.errorDate)
      return errorDate >= startDate && errorDate <= endDate
    })
  }

  return result
})

// 应用筛选
const applyFilter = () => {
  message.success('筛选已应用')
}

// 重置筛选
const resetFilter = () => {
  filterType.value = ''
  filterDateRange.value = null
  message.info('筛选条件已重置')
}

// 题目类型颜色
const getQuestionTypeColor = (type) => {
  const colors = {
    '选择题': 'blue',
    '单词拼写': 'green',
    '填空题': 'orange',
  }
  return colors[type] || 'default'
}

// 行选择
const selectedRowKeys = ref([])
const rowSelection = {
  selectedRowKeys: selectedRowKeys,
  onChange: (keys) => {
    selectedRowKeys.value = keys
  },
}

// 批量删除
const batchDelete = () => {
  message.success(`已删除 ${selectedRowKeys.value.length} 条错题`)
  errorList.value = errorList.value.filter(item => !selectedRowKeys.value.includes(item.id))
  selectedRowKeys.value = []
}

// 删除单个错题
const deleteError = (record) => {
  const index = errorList.value.findIndex(item => item.id === record.id)
  if (index > -1) {
    errorList.value.splice(index, 1)
    message.success('删除成功')
  }
}

// 导入相关
const importModalVisible = ref(false)
const fileList = ref([])

const showImportModal = () => {
  importModalVisible.value = true
}

const beforeUpload = (file) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                  file.type === 'application/vnd.ms-excel'
  if (!isExcel) {
    message.error('只能上传 Excel 文件！')
  }
  return false // 阻止自动上传
}

const handleImport = () => {
  if (fileList.value.length === 0) {
    message.warning('请先选择文件')
    return
  }
  // 实际应调用后端API处理Excel文件
  message.success('导入成功！')
  importModalVisible.value = false
  fileList.value = []
}

// 导出相关
const handleExport = ({ key }) => {
  if (key === 'excel') {
    message.success('正在导出为 Excel 格式...')
    // 实际应调用后端API生成Excel文件
  } else if (key === 'pdf') {
    message.success('正在导出为 PDF 格式...')
    // 实际应调用后端API生成PDF文件
  }
}

// 详情查看
const detailModalVisible = ref(false)
const currentError = ref(null)

const viewDetail = (record) => {
  currentError.value = record
  detailModalVisible.value = true
}

// 编辑错题
const editModalVisible = ref(false)
const editForm = ref({
  id: null,
  question: '',
  questionType: '',
  correctAnswer: '',
  explanation: '',
})

const editError = (record) => {
  editForm.value = {
    id: record.id,
    question: record.question,
    questionType: record.questionType,
    correctAnswer: record.correctAnswer,
    explanation: record.explanation || '',
  }
  editModalVisible.value = true
}

const saveEdit = () => {
  const index = errorList.value.findIndex(item => item.id === editForm.value.id)
  if (index > -1) {
    errorList.value[index] = {
      ...errorList.value[index],
      ...editForm.value,
    }
    message.success('编辑成功')
    editModalVisible.value = false
  }
}
</script>

<style scoped>
.my-errors-container {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.batch-actions {
  margin-bottom: 16px;
  padding: 12px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
}

.question-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.error-detail {
  padding: 10px 0;
}

.question-content {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin: 16px 0;
}

.options-section {
  margin: 16px 0;
}

.option-item {
  padding: 12px;
  margin: 8px 0;
  border-radius: 4px;
  background: white;
  border: 1px solid #d9d9d9;
}

.option-item.correct-option {
  background: #f6ffed;
  border-color: #b7eb8f;
}

.option-item.wrong-option {
  background: #fff2e8;
  border-color: #ffbb96;
}

.answer-section {
  margin: 16px 0;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.correct-text {
  color: #52c41a;
  font-weight: 500;
  margin-left: 8px;
}

.wrong-text {
  color: #ff4d4f;
  font-weight: 500;
  margin-left: 8px;
}

.explanation-section {
  margin-top: 16px;
  padding: 16px;
  background: #e6f7ff;
  border-radius: 8px;
  border-left: 3px solid #1890ff;
}
</style>
