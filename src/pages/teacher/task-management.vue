<template>
  <div class="task-management-container">
    <!-- 筛选功能 -->
    <div class="filter-section">
      <a-space :size="12">
        <span class="filter-label">班级等级：</span>
        <div class="level-filter-buttons">
          <button 
            v-for="level in levelOptions" 
            :key="level.value"
            :class="['level-btn', level.value || 'all', { active: filterLevel === level.value }]"
            @click="filterLevel = level.value"
          >
            {{ level.label }}
          </button>
        </div>
      </a-space>
    </div>

    <!-- 任务卡片展示 -->
    <div class="tasks-grid">
      <a-row :gutter="[16, 16]">
        <a-col 
          v-for="task in filteredTasks" 
          :key="task.id" 
          :xs="24" 
          :sm="12" 
          :md="8" 
          :lg="6"
        >
          <a-card class="task-card" hoverable>
            <!-- 任务信息 -->
            <div class="task-info">
              <h3 class="task-name">{{ task.taskName }}</h3>
              
              <div class="info-item">
                <ApartmentOutlined />
                <span>班级等级：</span>
                <a-tag :color="getLevelColor(task.classLevel)" size="small">
                  {{ task.classLevel }}级
                </a-tag>
              </div>
              
              <div class="info-item">
                <TeamOutlined />
                <span>班级名称：{{ task.className }}</span>
              </div>
              
              <div class="info-item">
                <FileTextOutlined />
                <span>题目数量：{{ task.questionCount }}题</span>
              </div>
              
              <div class="info-item">
                <ClockCircleOutlined />
                <span>开始时间：{{ task.startTime }}</span>
              </div>
              
              <div class="info-item">
                <ClockCircleOutlined />
                <span>截止时间：{{ task.deadline }}</span>
              </div>
              
              <div class="info-item">
                <CheckCircleOutlined />
                <span>完成人数：{{ task.completedCount }}/{{ task.totalStudents }}</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="task-actions">
              <a-button type="primary" size="small" @click="showTaskDetail(task)">
                查看详情
              </a-button>
              <a-button type="default" size="small" @click="remindStudents(task)">
                督促完成
              </a-button>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <!-- 空状态 -->
      <a-empty v-if="filteredTasks.length === 0" description="暂无任务数据" />
    </div>

    <!-- 任务详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="任务详情"
      :footer="null"
      width="900px"
      :body-style="{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }"
    >
      <div v-if="selectedTask" class="task-detail">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="任务名称">{{ selectedTask.taskName }}</a-descriptions-item>
          <a-descriptions-item label="班级等级">
            <a-tag :color="getLevelColor(selectedTask.classLevel)">
              {{ selectedTask.classLevel }}级
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="班级名称">{{ selectedTask.className }}</a-descriptions-item>
          <a-descriptions-item label="题目数量">{{ selectedTask.questionCount }}题</a-descriptions-item>
          <a-descriptions-item label="开始时间">{{ selectedTask.startTime }}</a-descriptions-item>
          <a-descriptions-item label="截止时间">{{ selectedTask.deadline }}</a-descriptions-item>
          <a-descriptions-item label="完成情况">
            {{ selectedTask.completedCount }}/{{ selectedTask.totalStudents }}
          </a-descriptions-item>
          <a-descriptions-item label="发布时间">{{ selectedTask.createTime }}</a-descriptions-item>
        </a-descriptions>

        <a-divider>题目列表</a-divider>

        <div class="questions-detail">
          <div 
            v-for="(question, index) in selectedTask.questions" 
            :key="index"
            class="question-detail-item"
          >
            <div class="question-header">
              <a-tag color="blue">{{ getQuestionTypeLabel(question.type) }}</a-tag>
              <span class="question-title">题目 {{ index + 1 }}</span>
            </div>
            
            <div class="question-content">
              <p><strong>题目内容：</strong>{{ question.content }}</p>
              
              <!-- 选择题选项 -->
              <div v-if="question.type === 'choice' && question.options">
                <p><strong>选项：</strong></p>
                <div 
                  v-for="(option, optIndex) in question.options" 
                  :key="optIndex"
                  class="option-item"
                >
                  <span :class="{ 'correct-answer': question.correctIndexes && question.correctIndexes.includes(optIndex) }">
                    {{ String.fromCharCode(65 + optIndex) }}. {{ option }}
                    <a-tag v-if="question.correctIndexes && question.correctIndexes.includes(optIndex)" color="success" size="small">
                      正确答案
                    </a-tag>
                  </span>
                </div>
              </div>
              
              <!-- 填空题和单词拼写答案 -->
              <p v-else>
                <strong>正确答案：</strong>
                <a-tag color="success">{{ question.answer }}</a-tag>
              </p>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import TeamOutlined from '@ant-design/icons-vue/TeamOutlined'
import FileTextOutlined from '@ant-design/icons-vue/FileTextOutlined'
import ClockCircleOutlined from '@ant-design/icons-vue/ClockCircleOutlined'
import CheckCircleOutlined from '@ant-design/icons-vue/CheckCircleOutlined'
import ApartmentOutlined from '@ant-design/icons-vue/ApartmentOutlined'

// 筛选条件
const filterLevel = ref('')

// 等级选项
const levelOptions = [
  { value: '', label: '全部' },
  { value: 'A', label: 'A级' },
  { value: 'B', label: 'B级' },
  { value: 'C', label: 'C级' },
  { value: 'D', label: 'D级' }
]

// 任务列表
const taskList = ref([])

// 详情弹窗
const detailModalVisible = ref(false)
const selectedTask = ref(null)

// 筛选后的任务列表
const filteredTasks = computed(() => {
  if (!filterLevel.value) {
    return taskList.value
  }
  return taskList.value.filter(item => item.classLevel === filterLevel.value)
})

// 获取等级颜色
const getLevelColor = (level) => {
  const colorMap = {
    A: 'red',
    B: 'orange',
    C: 'blue',
    D: 'green'
  }
  return colorMap[level] || 'default'
}

// 获取题型标签
const getQuestionTypeLabel = (type) => {
  const typeMap = {
    choice: '选择题',
    fillBlank: '填空题',
    spelling: '单词拼写'
  }
  return typeMap[type] || '未知题型'
}

// 显示任务详情
const showTaskDetail = (task) => {
  selectedTask.value = task
  detailModalVisible.value = true
}

// 督促完成
const remindStudents = (task) => {
  const uncompletedCount = task.totalStudents - task.completedCount
  if (uncompletedCount === 0) {
    message.info('所有学生已完成该任务')
    return
  }
  
  message.success(`已向 ${uncompletedCount} 名未完成学生发送督促提示`)
  console.log('督促任务:', task.taskName, '未完成人数:', uncompletedCount)
}

// 加载数据
const loadData = () => {
  // 模拟任务数据
  taskList.value = [
    {
      id: 1,
      taskName: '第一单元词汇测试',
      className: '高级英语班',
      classLevel: 'A',
      questionCount: 20,
      startTime: '2024-02-10 08:00',
      deadline: '2024-02-15 23:59',
      completedCount: 25,
      totalStudents: 40,
      createTime: '2024-02-08 10:30',
      questions: [
        {
          type: 'choice',
          content: 'What is the capital of France?',
          options: ['London', 'Paris', 'Berlin', 'Madrid'],
          correctIndexes: [1],
          answer: 'B'
        },
        {
          type: 'fillBlank',
          content: 'The sky is ___.',
          answer: 'blue'
        },
        {
          type: 'spelling',
          content: '拼写单词：美丽的',
          answer: 'beautiful'
        }
      ]
    },
    {
      id: 2,
      taskName: '语法练习题',
      className: '中级英语班',
      classLevel: 'B',
      questionCount: 15,
      startTime: '2024-02-11 08:00',
      deadline: '2024-02-16 23:59',
      completedCount: 40,
      totalStudents: 45,
      createTime: '2024-02-08 14:20',
      questions: [
        {
          type: 'choice',
          content: 'Choose the correct tense: I ___ to school yesterday.',
          options: ['go', 'went', 'going', 'goes'],
          correctIndexes: [1],
          answer: 'B'
        }
      ]
    },
    {
      id: 3,
      taskName: '阅读理解练习',
      className: '初级英语班',
      classLevel: 'C',
      questionCount: 10,
      startTime: '2024-02-09 08:00',
      deadline: '2024-02-14 23:59',
      completedCount: 48,
      totalStudents: 50,
      createTime: '2024-02-07 09:15',
      questions: []
    },
    {
      id: 4,
      taskName: '听力训练',
      className: '基础英语班',
      classLevel: 'D',
      questionCount: 12,
      startTime: '2024-02-12 08:00',
      deadline: '2024-02-17 23:59',
      completedCount: 10,
      totalStudents: 35,
      createTime: '2024-02-08 16:45',
      questions: []
    }
  ]
}

onMounted(() => {
  loadData()
})
</script>

<style scoped src="./task-management.css"></style>
