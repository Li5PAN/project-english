<template>
  <div class="student-home">
    <!-- 第一层：学习概览 + 日历打卡 + 未完成任务 + 班级进度 -->
    <a-row :gutter="16">
      <!-- 学习概览 -->
      <a-col :span="6">
        <a-card title="学习概览" :bordered="false" class="overview-card">
          <div class="overview-item">
            <div class="overview-icon" style="background: #e6f7ff;">
              <BookOutlined style="color: #1890ff; font-size: 24px;" />
            </div>
            <div class="overview-content">
              <div class="overview-title">单词学习</div>
              <div class="overview-value">今日已学 <strong>{{ todayWords }}</strong> 个单词</div>
              <div class="overview-tip">继续学习，完成今日目标</div>
            </div>
          </div>

          <div class="overview-item">
            <div class="overview-icon" style="background: #fff1f0;">
              <FileTextOutlined style="color: #f5222d; font-size: 24px;" />
            </div>
            <div class="overview-content">
              <div class="overview-title">错题查看</div>
              <div class="overview-value">错题本共 <strong>{{ errorCount }}</strong> 个单词</div>
              <div class="overview-tip">复习错题，巩固记忆</div>
            </div>
          </div>

          <div class="overview-item">
            <div class="overview-icon" style="background: #f6ffed;">
              <TeamOutlined style="color: #52c41a; font-size: 24px;" />
            </div>
            <div class="overview-content">
              <div class="overview-title">我的班级</div>
              <div class="overview-value">班级排名 <strong>第{{ myRank }}名</strong></div>
              <div class="overview-tip">查看班级学习情况</div>
            </div>
          </div>

          <div class="overview-item">
            <div class="overview-icon" style="background: #fffbe6;">
              <CheckSquareOutlined style="color: #faad14; font-size: 24px;" />
            </div>
            <div class="overview-content">
              <div class="overview-title">我的任务</div>
              <div class="overview-value">待完成 <strong>{{ pendingTasksCount }}</strong> 个任务</div>
              <div class="overview-tip">完成任务，获得奖励</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- 日历打卡 -->
      <a-col :span="10">
        <a-card title="学习打卡" :bordered="false" class="calendar-card">
          <a-calendar 
            :fullscreen="false" 
            @select="onDateSelect"
          >
            <template #dateCellRender="{ current }">
              <div class="calendar-cell">
                <div 
                  v-if="isCheckedInDate(current)" 
                  class="check-mark"
                >
                  ✓
                </div>
              </div>
            </template>
          </a-calendar>
          <div class="check-in-footer">
            <a-button 
              type="primary" 
              :disabled="isCheckedIn"
              @click="handleCheckIn"
              block
            >
              <template #icon>
                <CheckCircleOutlined v-if="isCheckedIn" />
                <ClockCircleOutlined v-else />
              </template>
              {{ isCheckedIn ? '今日已打卡' : '立即打卡' }}
            </a-button>
            <div class="check-stats">
              <span>连续打卡 <strong>{{ checkInStats.continuousDays }}</strong> 天</span>
              <span>累计打卡 <strong>{{ checkInStats.totalDays }}</strong> 天</span>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- 未完成任务列表 -->
      <a-col :span="8">
        <a-card title="未完成任务" :bordered="false" class="pending-tasks-card">
          <template #extra>
            <a @click="$router.push('/student/my-tasks')">查看全部</a>
          </template>
          <a-list :data-source="pendingTasksList" size="small" class="task-list">
            <template #renderItem="{ item }">
              <a-list-item class="task-item">
                <div class="task-content">
                  <div class="task-title-row">
                    <span class="task-title">{{ item.title }}</span>
                  </div>
                  <div class="task-info-row">
                    <span class="task-deadline">截止：{{ item.deadline }}</span>
                    <a-tag :color="getTaskUrgencyColor(item.deadline)" class="task-urgency-tag">
                      {{ getTaskUrgency(item.deadline) }}
                    </a-tag>
                  </div>
                </div>
              </a-list-item>
            </template>
          </a-list>
          
          <!-- 班级任务完成进度 -->
          <a-divider style="margin: 12px 0;">班级任务完成进度</a-divider>
          <div class="class-progress">
            <div class="progress-stats">
              <div class="stat-row">
                <span class="stat-label">已完成任务</span>
                <span class="stat-value">{{ classProgress.completed }} / {{ classProgress.total }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">完成率</span>
                <span class="stat-value">{{ classProgress.rate }}%</span>
              </div>
            </div>
            <a-progress 
              :percent="classProgress.rate" 
              :stroke-color="getProgressColor(classProgress.rate)"
              :stroke-width="12"
            />
            <div class="progress-tip">
              班级排名：第 {{ classRanking }} 名 / 共 {{ totalClasses }} 个班级
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 第二层：每日任务完成图表 + 单词学习趋势图 -->
    <a-row :gutter="16" style="margin-top: 16px;">
      <!-- 每日任务完成题数统计 -->
      <a-col :span="12">
        <a-card title="近7天任务完成情况" :bordered="false">
          <div ref="taskChartRef" style="width: 100%; height: 350px;"></div>
        </a-card>
      </a-col>

      <!-- 单词学习趋势 -->
      <a-col :span="12">
        <a-card title="单词学习趋势" :bordered="false">
          <div ref="wordTrendChartRef" style="width: 100%; height: 350px;"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 第三层：快捷入口按钮 -->
    <a-row :gutter="16" style="margin-top: 16px;">
      <a-col :span="6">
        <a-button 
          type="primary" 
          size="large" 
          block 
          class="quick-btn"
          @click="$router.push('/student/word-learn')"
        >
          <BookOutlined />
          单词学习
        </a-button>
      </a-col>
      <a-col :span="6">
        <a-button 
          type="primary" 
          size="large" 
          block 
          class="quick-btn"
          danger
          @click="$router.push('/student/my-errors')"
        >
          <FileTextOutlined />
          错题查看
        </a-button>
      </a-col>
      <a-col :span="6">
        <a-button 
          type="primary" 
          size="large" 
          block 
          class="quick-btn"
          style="background: #52c41a; border-color: #52c41a;"
          @click="$router.push('/student/my-class')"
        >
          <TeamOutlined />
          我的班级
        </a-button>
      </a-col>
      <a-col :span="6">
        <a-button 
          type="primary" 
          size="large" 
          block 
          class="quick-btn"
          style="background: #faad14; border-color: #faad14;"
          @click="$router.push('/student/my-tasks')"
        >
          <CheckSquareOutlined />
          我的任务
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import {
  BookOutlined,
  FileTextOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons-vue'

// 打卡相关数据
const isCheckedIn = ref(false)
const checkInStats = ref({
  continuousDays: 7,
  totalDays: 45,
})

// 打卡日期记录（模拟数据）
const checkedInDates = ref([
  '2026-02-06', '2026-02-07', '2026-02-08', '2026-02-09', 
  '2026-02-10', '2026-02-11', '2026-02-12'
])

// 判断某个日期是否已打卡
const isCheckedInDate = (date) => {
  const dateStr = dayjs(date).format('YYYY-MM-DD')
  return checkedInDates.value.includes(dateStr)
}

// 日期选择
const onDateSelect = (date) => {
  console.log('选择日期:', dayjs(date).format('YYYY-MM-DD'))
}

// 打卡功能
const handleCheckIn = () => {
  const today = dayjs().format('YYYY-MM-DD')
  if (!checkedInDates.value.includes(today)) {
    checkedInDates.value.push(today)
  }
  isCheckedIn.value = true
  checkInStats.value.continuousDays++
  checkInStats.value.totalDays++
  message.success('打卡成功！连续打卡' + checkInStats.value.continuousDays + '天')
}

// 未完成任务列表
const pendingTasksList = ref([
  {
    id: 1,
    title: '第三单元单词测试',
    deadline: '2026-02-14',
    questionCount: 50,
  },
  {
    id: 2,
    title: '阅读理解练习',
    deadline: '2026-02-16',
    questionCount: 30,
  },
  {
    id: 3,
    title: '单词听写',
    deadline: '2026-02-20',
    questionCount: 40,
  },
  {
    id: 4,
    title: '语法练习',
    deadline: '2026-02-22',
    questionCount: 25,
  },
])

// 班级任务完成进度（整体）
const classProgress = ref({
  completed: 12,  // 已完成任务数
  total: 18,      // 总任务数
  rate: 67,       // 完成率
})

const classRanking = ref(3)  // 班级排名
const totalClasses = ref(8)  // 总班级数

const getProgressColor = (rate) => {
  if (rate >= 80) return '#52c41a'
  if (rate >= 50) return '#1890ff'
  return '#faad14'
}

const getTaskUrgency = (deadline) => {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const diffMilliseconds = deadlineDate - today
  const diffHours = diffMilliseconds / (1000 * 60 * 60)
  const diffDays = diffMilliseconds / (1000 * 60 * 60 * 24)
  
  // 紧急：小于12小时
  if (diffHours < 12) return '紧急'
  // 即将到期：小于等于2天但大于12小时
  if (diffDays <= 2) return '即将到期'
  // 正常：大于2天但小于等于4天
  if (diffDays <= 4) return '正常'
  // 超过4天显示为"充裕"
  return '充裕'
}

const getTaskUrgencyColor = (deadline) => {
  const urgency = getTaskUrgency(deadline)
  if (urgency === '紧急') return 'red'
  if (urgency === '即将到期') return 'orange'
  if (urgency === '正常') return 'green'
  return 'blue'  // 充裕
}

// 每日任务完成图表
const taskChartRef = ref(null)
const initTaskChart = () => {
  const chart = echarts.init(taskChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLabel: {
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      name: '完成题数',
    },
    series: [
      {
        name: '完成题数',
        type: 'bar',
        data: [45, 52, 38, 65, 48, 72, 58],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' },
            ]),
          },
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}题',
        },
      },
    ],
  }
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 单词学习趋势图表
const wordTrendChartRef = ref(null)
const initWordTrendChart = () => {
  const chart = echarts.init(wordTrendChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['学习单词数', '正确率'],
      bottom: 0,  // 放置在底部
      left: 'center',  // 水平居中
      itemGap: 20,  // 图例项之间的间距
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '40px',  // 增加底部空间，为图例留出位置（横坐标 + 5px间距 + 图例高度）
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: [
      {
        type: 'value',
        name: '单词数',
        position: 'left',
      },
      {
        type: 'value',
        name: '正确率(%)',
        position: 'right',
        max: 100,
      },
    ],
    series: [
      {
        name: '学习单词数',
        type: 'line',
        data: [25, 32, 28, 35, 30, 42, 38],
        smooth: true,
        itemStyle: {
          color: '#1890ff',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
          ]),
        },
      },
      {
        name: '正确率',
        type: 'line',
        yAxisIndex: 1,
        data: [82, 85, 88, 84, 86, 90, 87],
        smooth: true,
        itemStyle: {
          color: '#52c41a',
        },
      },
    ],
  }
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 快捷功能数据
const todayWords = ref(25)
const errorCount = ref(15)
const myRank = ref(8)
const pendingTasksCount = ref(4)

onMounted(() => {
  initTaskChart()
  initWordTrendChart()
  // TODO: 从后端获取打卡状态
  // checkTodayCheckIn()
})
</script>

<style scoped>
.student-home {
  padding: 0;
}

/* 学习概览样式 */
.overview-card {
  height: 100%;
}

.overview-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  margin-bottom: 12px;
  background: #fafafa;
  border-radius: 8px;
  transition: all 0.3s;
}

.overview-item:last-child {
  margin-bottom: 0;
}

.overview-item:hover {
  background: #f0f0f0;
  transform: translateX(4px);
}

.overview-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.overview-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.overview-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.overview-value {
  font-size: 13px;
  color: #666;
}

.overview-value strong {
  color: #1890ff;
  font-size: 16px;
  margin: 0 2px;
}

.overview-tip {
  font-size: 12px;
  color: #999;
}

/* 快捷按钮样式 */
.quick-btn {
  height: 56px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
}

.quick-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.quick-btn :deep(.anticon) {
  font-size: 20px;
  margin-right: 8px;
}

/* 移除旧的快捷入口样式 */

/* 日历打卡样式 */
.calendar-card {
  height: 100%;
}

.calendar-card :deep(.ant-picker-calendar) {
  padding: 0;
}

.calendar-card :deep(.ant-picker-calendar-header) {
  padding: 8px 0;
}

.calendar-card :deep(.ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner) {
  background: #1890ff;
}

.calendar-cell {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-mark {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  background: #52c41a;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.check-in-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.check-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

.check-stats strong {
  color: #1890ff;
  font-size: 18px;
  margin: 0 4px;
}

/* 未完成任务样式 */
.pending-tasks-card {
  height: 100%;
}

.task-list {
  max-height: 240px;
  overflow-y: auto;
}

.task-item {
  padding: 8px 0 !important;
}

.task-content {
  width: 100%;
}

.task-title-row {
  margin-bottom: 8px;
}

.task-title {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.task-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-deadline {
  font-size: 12px;
  color: #999;
}

.task-urgency-tag {
  margin: 0;
  margin-right: 5px;
}

/* 班级进度样式 */
.class-progress {
  margin-top: 12px;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.stat-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
}

.progress-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  text-align: center;
}

/* 滚动条样式 */
.task-list::-webkit-scrollbar {
  width: 6px;
}

.task-list::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}

.task-list::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}
</style>
