<template>
  <div class="my-tasks-container">
    <a-card title="我的任务">
      <template #extra>
        <a-space>
          <a-button 
            :type="taskStatus === 'pending' ? 'primary' : 'default'"
            @click="taskStatus = 'pending'"
          >
            未完成
          </a-button>
          <a-button 
            :type="taskStatus === 'completed' ? 'primary' : 'default'"
            @click="taskStatus = 'completed'"
          >
            已完成
          </a-button>
        </a-space>
      </template>

      <!-- 未完成任务列表 -->
      <a-table 
        v-if="taskStatus === 'pending'"
        :columns="pendingColumns" 
        :data-source="pendingTasks" 
        :pagination="{ pageSize: 10 }"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'taskType'">
            <a-tag :color="getTaskTypeColor(record.taskType)">
              {{ record.taskType }}
            </a-tag>
          </template>
          <template v-if="column.key === 'timeRange'">
            <div style="font-size: 12px">
              <div>开始：{{ record.startTime }}</div>
              <div>截止：{{ record.endTime }}</div>
            </div>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="primary" size="small" @click="startTask(record)">
              去做
            </a-button>
          </template>
        </template>
      </a-table>

      <!-- 已完成任务列表 -->
      <a-table 
        v-if="taskStatus === 'completed'"
        :columns="completedColumns" 
        :data-source="completedTasks" 
        :pagination="{ pageSize: 10 }"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'taskType'">
            <a-tag :color="getTaskTypeColor(record.taskType)">
              {{ record.taskType }}
            </a-tag>
          </template>
          <template v-if="column.key === 'timeRange'">
            <div style="font-size: 12px">
              <div>开始：{{ record.startTime }}</div>
              <div>截止：{{ record.endTime }}</div>
            </div>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="link" size="small" @click="viewDetail(record)">
              查看详情
            </a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 做题弹窗 -->
    <a-modal
      v-model:open="doTaskModalVisible"
      :title="currentTask?.taskName"
      width="1000px"
      :footer="null"
      @cancel="closeTaskModal"
      :bodyStyle="{ maxHeight: '70vh', overflowY: 'auto', padding: '24px' }"
    >
      <div class="task-modal-content">
        <a-alert
          :message="`任务信息：${currentTask?.taskType} | 题目总量：${currentTask?.questionCount}题`"
          type="info"
          show-icon
          style="margin-bottom: 20px"
        />

        <div v-for="(question, index) in currentQuestions" :key="index" class="question-item">
          <div class="question-title">
            <span class="question-number">{{ index + 1 }}.</span>
            <span>{{ question.question }}</span>
          </div>
          
          <a-radio-group 
            v-if="question.type === 'single'"
            v-model:value="question.userAnswer"
            style="width: 100%"
          >
            <a-radio 
              v-for="(option, optIndex) in question.options" 
              :key="optIndex"
              :value="option.key"
              style="display: block; margin: 10px 0"
            >
              {{ option.key }}. {{ option.value }}
            </a-radio>
          </a-radio-group>

          <a-input 
            v-if="question.type === 'input'"
            v-model:value="question.userAnswer"
            placeholder="请输入答案"
            style="margin-top: 10px"
          />
        </div>

        <div style="text-align: center; margin-top: 30px">
          <a-space>
            <a-button @click="closeTaskModal">取消</a-button>
            <a-button type="primary" @click="submitTask">提交答案</a-button>
          </a-space>
        </div>
      </div>
    </a-modal>

    <!-- 详情查看弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      :title="`任务详情 - ${currentTask?.taskName}`"
      width="1000px"
      :footer="null"
      :bodyStyle="{ maxHeight: '70vh', overflowY: 'auto', padding: '24px' }"
    >
      <div class="detail-modal-content">
        <a-descriptions bordered :column="2" style="margin-bottom: 20px">
          <a-descriptions-item label="任务名称">{{ currentTask?.taskName }}</a-descriptions-item>
          <a-descriptions-item label="任务类型">
            <a-tag :color="getTaskTypeColor(currentTask?.taskType)">
              {{ currentTask?.taskType }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="题目总量">{{ currentTask?.questionCount }}题</a-descriptions-item>
          <a-descriptions-item label="所属班级">{{ currentTask?.className }}</a-descriptions-item>
          <a-descriptions-item label="授课老师">{{ currentTask?.teacher }}</a-descriptions-item>
          <a-descriptions-item label="完成时间">{{ currentTask?.completedTime }}</a-descriptions-item>
        </a-descriptions>

        <a-divider>题目与答案</a-divider>

        <div v-for="(question, index) in currentTaskDetail" :key="index" class="detail-question-item">
          <div class="question-title">
            <span class="question-number">{{ index + 1 }}.</span>
            <span>{{ question.question }}</span>
          </div>
          
          <div v-if="question.type === 'single'" class="question-options">
            <div 
              v-for="(option, optIndex) in question.options" 
              :key="optIndex"
              class="option-item"
              :class="{ 
                'correct-answer': option.key === question.correctAnswer,
                'user-answer': option.key === question.userAnswer && option.key !== question.correctAnswer
              }"
            >
              {{ option.key }}. {{ option.value }}
              <a-tag v-if="option.key === question.correctAnswer" color="success" style="margin-left: 10px">
                正确答案
              </a-tag>
              <a-tag v-if="option.key === question.userAnswer && option.key !== question.correctAnswer" color="error" style="margin-left: 10px">
                您的答案
              </a-tag>
            </div>
          </div>

          <div v-if="question.type === 'input'" class="answer-section">
            <div class="answer-item">
              <strong>正确答案：</strong>
              <span class="correct-text">{{ question.correctAnswer }}</span>
            </div>
            <div v-if="question.userAnswer !== question.correctAnswer" class="answer-item">
              <strong>您的答案：</strong>
              <span class="wrong-text">{{ question.userAnswer }}</span>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'

// 任务状态：pending-未完成，completed-已完成
const taskStatus = ref('pending')

// 未完成任务列配置
const pendingColumns = [
  { title: '任务名称', dataIndex: 'taskName', key: 'taskName', width: 180 },
  { title: '任务类型', dataIndex: 'taskType', key: 'taskType', width: 100 },
  { title: '题目总量', dataIndex: 'questionCount', key: 'questionCount', width: 100 },
  { title: '时间范围', key: 'timeRange', width: 180 },
  { title: '所属班级', dataIndex: 'className', key: 'className', width: 120 },
  { title: '授课老师', dataIndex: 'teacher', key: 'teacher', width: 100 },
  { title: '操作', key: 'action', width: 100, fixed: 'right' },
]

// 已完成任务列配置
const completedColumns = [
  { title: '任务名称', dataIndex: 'taskName', key: 'taskName', width: 180 },
  { title: '任务类型', dataIndex: 'taskType', key: 'taskType', width: 100 },
  { title: '题目总量', dataIndex: 'questionCount', key: 'questionCount', width: 100 },
  { title: '时间范围', key: 'timeRange', width: 180 },
  { title: '所属班级', dataIndex: 'className', key: 'className', width: 120 },
  { title: '授课老师', dataIndex: 'teacher', key: 'teacher', width: 100 },
  { title: '操作', key: 'action', width: 100, fixed: 'right' },
]

// 未完成任务数据（仅显示当前班级的任务）
const pendingTasks = ref([
  {
    id: 1,
    taskName: '第三单元单词测试',
    taskType: '单词测试',
    questionCount: 20,
    startTime: '2024-02-01 08:00',
    endTime: '2024-02-10 23:59',
    className: 'B2班',
    teacher: '张老师',
  },
  {
    id: 2,
    taskName: '阅读理解练习',
    taskType: '阅读理解',
    questionCount: 15,
    startTime: '2024-02-05 08:00',
    endTime: '2024-02-12 23:59',
    className: 'B2班',
    teacher: '张老师',
  },
  {
    id: 3,
    taskName: '语法专项训练',
    taskType: '语法练习',
    questionCount: 25,
    startTime: '2024-02-08 08:00',
    endTime: '2024-02-15 23:59',
    className: 'B2班',
    teacher: '张老师',
  },
])

// 已完成任务数据（包含历史所有班级的任务）
const completedTasks = ref([
  {
    id: 4,
    taskName: '第二单元单词测试',
    taskType: '单词测试',
    questionCount: 20,
    startTime: '2024-01-20 08:00',
    endTime: '2024-01-30 23:59',
    className: 'B2班',
    teacher: '张老师',
    completedTime: '2024-01-28 15:30',
  },
  {
    id: 5,
    taskName: '时态语法练习',
    taskType: '语法练习',
    questionCount: 18,
    startTime: '2024-01-15 08:00',
    endTime: '2024-01-25 23:59',
    className: 'C1班',
    teacher: '周老师',
    completedTime: '2024-01-23 10:20',
  },
  {
    id: 6,
    taskName: '听力理解训练',
    taskType: '听力练习',
    questionCount: 12,
    startTime: '2024-01-10 08:00',
    endTime: '2024-01-20 23:59',
    className: 'C1班',
    teacher: '周老师',
    completedTime: '2024-01-18 14:45',
  },
])

// 任务类型颜色
const getTaskTypeColor = (type) => {
  const colors = {
    '单词测试': 'blue',
    '阅读理解': 'green',
    '语法练习': 'orange',
    '听力练习': 'purple',
  }
  return colors[type] || 'default'
}

// 做题弹窗相关
const doTaskModalVisible = ref(false)
const currentTask = ref(null)
const currentQuestions = ref([])

// 开始做题
const startTask = (task) => {
  currentTask.value = task
  // 模拟生成题目
  currentQuestions.value = generateQuestions(task.questionCount)
  doTaskModalVisible.value = true
}

// 生成模拟题目
const generateQuestions = (count) => {
  const questions = []
  for (let i = 0; i < count; i++) {
    if (i % 2 === 0) {
      // 单选题
      questions.push({
        type: 'single',
        question: `单词 "example${i + 1}" 的中文意思是？`,
        options: [
          { key: 'A', value: '例子' },
          { key: 'B', value: '样本' },
          { key: 'C', value: '示范' },
          { key: 'D', value: '模板' },
        ],
        correctAnswer: 'A',
        userAnswer: null,
      })
    } else {
      // 填空题
      questions.push({
        type: 'input',
        question: `请翻译单词 "word${i + 1}"`,
        correctAnswer: '单词',
        userAnswer: '',
      })
    }
  }
  return questions
}

// 关闭做题弹窗
const closeTaskModal = () => {
  doTaskModalVisible.value = false
  currentTask.value = null
  currentQuestions.value = []
}

// 提交任务
const submitTask = () => {
  // 检查是否所有题目都已作答
  const unanswered = currentQuestions.value.some(q => !q.userAnswer)
  if (unanswered) {
    message.warning('请完成所有题目后再提交')
    return
  }

  // 模拟提交
  message.success('任务提交成功！')
  
  // 将任务从未完成移到已完成
  const taskIndex = pendingTasks.value.findIndex(t => t.id === currentTask.value.id)
  if (taskIndex > -1) {
    const completedTask = {
      ...pendingTasks.value[taskIndex],
      completedTime: new Date().toLocaleString('zh-CN'),
    }
    completedTasks.value.unshift(completedTask)
    pendingTasks.value.splice(taskIndex, 1)
  }
  
  closeTaskModal()
}

// 详情查看相关
const detailModalVisible = ref(false)
const currentTaskDetail = ref([])

// 查看详情
const viewDetail = (task) => {
  currentTask.value = task
  // 模拟获取任务详情（包含用户答案和正确答案）
  currentTaskDetail.value = generateTaskDetail(task.questionCount)
  detailModalVisible.value = true
}

// 生成任务详情（模拟数据）
const generateTaskDetail = (count) => {
  const details = []
  for (let i = 0; i < count; i++) {
    if (i % 2 === 0) {
      // 单选题
      const correctAnswer = 'A'
      const userAnswer = i % 3 === 0 ? 'B' : 'A' // 模拟部分答错
      details.push({
        type: 'single',
        question: `单词 "example${i + 1}" 的中文意思是？`,
        options: [
          { key: 'A', value: '例子' },
          { key: 'B', value: '样本' },
          { key: 'C', value: '示范' },
          { key: 'D', value: '模板' },
        ],
        correctAnswer,
        userAnswer,
      })
    } else {
      // 填空题
      const correctAnswer = '单词'
      const userAnswer = i % 5 === 0 ? '词语' : '单词' // 模拟部分答错
      details.push({
        type: 'input',
        question: `请翻译单词 "word${i + 1}"`,
        correctAnswer,
        userAnswer,
      })
    }
  }
  return details
}
</script>

<style scoped>
.my-tasks-container {
  padding: 20px;
}

.task-modal-content {
  /* 移除固定高度，使用modal的bodyStyle控制 */
}

.question-item {
  margin-bottom: 30px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.question-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #333;
  line-height: 1.6;
}

.question-number {
  display: inline-block;
  width: 35px;
  color: #1890ff;
  font-weight: bold;
  font-size: 18px;
}

.detail-modal-content {
  /* 移除固定高度，使用modal的bodyStyle控制 */
}

.detail-question-item {
  margin-bottom: 25px;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
  border-left: 3px solid #1890ff;
}

.question-options {
  margin-top: 10px;
}

.option-item {
  padding: 10px;
  margin: 8px 0;
  border-radius: 4px;
  background: white;
}

.option-item.correct-answer {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
}

.option-item.user-answer {
  background: #fff2e8;
  border: 1px solid #ffbb96;
}

.answer-section {
  margin-top: 10px;
  padding: 10px;
  background: white;
  border-radius: 4px;
}

.answer-item {
  margin: 8px 0;
  font-size: 14px;
}

.correct-text {
  color: #52c41a;
  font-weight: 500;
}

.wrong-text {
  color: #ff4d4f;
  font-weight: 500;
}
</style>
