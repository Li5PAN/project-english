<template>
  <div class="my-progress-container">
    <!-- 顶部数据展示 -->
    <a-row :gutter="16" style="margin-bottom: 20px">
      <a-col :xs="24" :sm="8">
        <a-card>
          <a-statistic
            title="累计查词量"
            :value="statistics.totalWords"
            suffix="个"
          >
            <template #prefix>
              <BookOutlined style="color: #1890ff" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="8">
        <a-card>
          <a-statistic
            title="一周学习总时长"
            :value="statistics.weekTotalTime"
            suffix="小时"
            :precision="1"
          >
            <template #prefix>
              <ClockCircleOutlined style="color: #52c41a" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="8">
        <a-card>
          <a-statistic
            title="一周日均学习时长"
            :value="statistics.weekAvgTime"
            suffix="小时"
            :precision="1"
          >
            <template #prefix>
              <FieldTimeOutlined style="color: #faad14" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- 中间可视化图表 -->
    <a-row :gutter="16" style="margin-bottom: 20px">
      <!-- 每日学习数据折线图 -->
      <a-col :xs="24" :lg="12">
        <a-card title="每日学习数据" :bodyStyle="{ padding: '20px' }">
          <div ref="dailyChartRef" style="width: 100%; height: 350px"></div>
        </a-card>
      </a-col>

      <!-- 班级 vs 个人完成率走势 -->
      <a-col :xs="24" :lg="12">
        <a-card title="班级 vs 个人完成率走势" :bodyStyle="{ padding: '20px' }">
          <div ref="compareChartRef" style="width: 100%; height: 350px"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 底部班级排名 -->
    <a-card>
      <template #title>
        <div class="card-title-wrapper">
          <span class="title-text">班级排名</span>
          <a-space :size="5" class="title-buttons">
            <a-button 
              :type="rankType === 'time' ? 'primary' : 'default'"
              @click="rankType = 'time'"
            >
              按学习时长
            </a-button>
            <a-button 
              :type="rankType === 'words' ? 'primary' : 'default'"
              @click="rankType = 'words'"
            >
              按掌握单词量
            </a-button>
          </a-space>
        </div>
      </template>

      <a-table
        :columns="rankColumns"
        :data-source="currentRankData"
        :pagination="{ pageSize: 10, showTotal: (total) => `共 ${total} 名学生` }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'rank'">
            <a-tag v-if="record.rank === 1" color="gold">
              🥇 {{ record.rank }}
            </a-tag>
            <a-tag v-else-if="record.rank === 2" color="silver">
              🥈 {{ record.rank }}
            </a-tag>
            <a-tag v-else-if="record.rank === 3" color="bronze">
              🥉 {{ record.rank }}
            </a-tag>
            <span v-else :style="{ fontWeight: record.isMe ? 'bold' : 'normal' }">
              {{ record.rank }}
            </span>
          </template>
          <template v-if="column.key === 'name'">
            <span :style="{ fontWeight: record.isMe ? 'bold' : 'normal', color: record.isMe ? '#1890ff' : '' }">
              {{ record.name }} {{ record.isMe ? '(我)' : '' }}
            </span>
          </template>
          <template v-if="column.key === 'studyTime'">
            <a-progress
              :percent="(record.studyTime / maxStudyTime) * 100"
              :show-info="false"
              :stroke-color="record.isMe ? '#1890ff' : '#52c41a'"
            />
            <span style="margin-left: 10px">{{ record.studyTime }}小时</span>
          </template>
          <template v-if="column.key === 'masteredWords'">
            <a-progress
              :percent="(record.masteredWords / maxWords) * 100"
              :show-info="false"
              :stroke-color="record.isMe ? '#1890ff' : '#52c41a'"
            />
            <span style="margin-left: 10px">{{ record.masteredWords }}个</span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import {
  BookOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons-vue'

// 顶部统计数据
const statistics = ref({
  totalWords: 1250, // 累计查词量
  weekTotalTime: 18.5, // 一周学习总时长
  weekAvgTime: 2.6, // 一周日均学习时长
})

// 图表实例
const dailyChartRef = ref(null)
const compareChartRef = ref(null)
let dailyChart = null
let compareChart = null

// 每日学习数据
const dailyData = {
  dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  studyTime: [2.5, 3.2, 2.8, 3.5, 2.0, 2.8, 1.7], // 学习时长（小时）
  masteredWords: [45, 58, 52, 62, 38, 50, 32], // 掌握单词数
}

// 班级vs个人完成率数据
const compareData = {
  dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  classAvg: [75, 78, 80, 82, 85, 87, 88], // 班级平均完成率
  personal: [70, 75, 82, 85, 88, 90, 92], // 个人完成率
}

// 排名类型
const rankType = ref('time')

// 排名表格列
const rankColumns = computed(() => {
  const baseColumns = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 100 },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 150 },
  ]

  if (rankType.value === 'time') {
    return [
      ...baseColumns,
      { title: '学习时长', key: 'studyTime', width: 300 },
      { title: '掌握单词量', dataIndex: 'masteredWords', key: 'masteredWordsText', width: 150 },
    ]
  } else {
    return [
      ...baseColumns,
      { title: '掌握单词量', key: 'masteredWords', width: 300 },
      { title: '学习时长', dataIndex: 'studyTime', key: 'studyTimeText', width: 150 },
    ]
  }
})

// 按学习时长排名数据
const rankByTime = ref([
  { key: 1, rank: 1, name: '李明', studyTime: 22.5, masteredWords: 385, isMe: false },
  { key: 2, rank: 2, name: '王芳', studyTime: 21.2, masteredWords: 368, isMe: false },
  { key: 3, rank: 3, name: '张伟', studyTime: 20.8, masteredWords: 352, isMe: false },
  { key: 4, rank: 4, name: '刘洋', studyTime: 19.5, masteredWords: 340, isMe: false },
  { key: 5, rank: 5, name: '陈静', studyTime: 18.8, masteredWords: 328, isMe: false },
  { key: 6, rank: 6, name: '我', studyTime: 18.5, masteredWords: 337, isMe: true },
  { key: 7, rank: 7, name: '赵强', studyTime: 17.2, masteredWords: 315, isMe: false },
  { key: 8, rank: 8, name: '孙丽', studyTime: 16.5, masteredWords: 298, isMe: false },
  { key: 9, rank: 9, name: '周杰', studyTime: 15.8, masteredWords: 285, isMe: false },
  { key: 10, rank: 10, name: '吴娜', studyTime: 14.2, masteredWords: 268, isMe: false },
])

// 按掌握单词量排名数据
const rankByWords = ref([
  { key: 1, rank: 1, name: '李明', studyTime: 22.5, masteredWords: 385, isMe: false },
  { key: 2, rank: 2, name: '王芳', studyTime: 21.2, masteredWords: 368, isMe: false },
  { key: 3, rank: 3, name: '张伟', studyTime: 20.8, masteredWords: 352, isMe: false },
  { key: 4, rank: 4, name: '刘洋', studyTime: 19.5, masteredWords: 340, isMe: false },
  { key: 5, rank: 5, name: '我', studyTime: 18.5, masteredWords: 337, isMe: true },
  { key: 6, rank: 6, name: '陈静', studyTime: 18.8, masteredWords: 328, isMe: false },
  { key: 7, rank: 7, name: '赵强', studyTime: 17.2, masteredWords: 315, isMe: false },
  { key: 8, rank: 8, name: '孙丽', studyTime: 16.5, masteredWords: 298, isMe: false },
  { key: 9, rank: 9, name: '周杰', studyTime: 15.8, masteredWords: 285, isMe: false },
  { key: 10, rank: 10, name: '吴娜', studyTime: 14.2, masteredWords: 268, isMe: false },
])

// 当前排名数据
const currentRankData = computed(() => {
  return rankType.value === 'time' ? rankByTime.value : rankByWords.value
})

// 计算最大值用于进度条
const maxStudyTime = computed(() => {
  return Math.max(...currentRankData.value.map(item => item.studyTime))
})

const maxWords = computed(() => {
  return Math.max(...currentRankData.value.map(item => item.masteredWords))
})

// 初始化每日学习数据图表
const initDailyChart = () => {
  if (!dailyChartRef.value) return

  dailyChart = echarts.init(dailyChartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['学习时长', '掌握单词数'],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dailyData.dates,
    },
    yAxis: [
      {
        type: 'value',
        name: '时长(小时)',
        position: 'left',
        axisLabel: {
          formatter: '{value}h',
        },
      },
      {
        type: 'value',
        name: '单词数(个)',
        position: 'right',
        axisLabel: {
          formatter: '{value}',
        },
      },
    ],
    series: [
      {
        name: '学习时长',
        type: 'line',
        smooth: true,
        data: dailyData.studyTime,
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
        name: '掌握单词数',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: dailyData.masteredWords,
        itemStyle: {
          color: '#52c41a',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
            { offset: 1, color: 'rgba(82, 196, 26, 0.05)' },
          ]),
        },
      },
    ],
  }

  dailyChart.setOption(option)
}

// 初始化对比图表
const initCompareChart = () => {
  if (!compareChartRef.value) return

  compareChart = echarts.init(compareChartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['班级平均完成率', '个人完成率'],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: compareData.dates,
    },
    yAxis: {
      type: 'value',
      name: '完成率(%)',
      max: 100,
      axisLabel: {
        formatter: '{value}%',
      },
    },
    series: [
      {
        name: '班级平均完成率',
        type: 'line',
        smooth: true,
        data: compareData.classAvg,
        itemStyle: {
          color: '#faad14',
        },
        lineStyle: {
          width: 3,
        },
      },
      {
        name: '个人完成率',
        type: 'line',
        smooth: true,
        data: compareData.personal,
        itemStyle: {
          color: '#1890ff',
        },
        lineStyle: {
          width: 3,
        },
      },
    ],
  }

  compareChart.setOption(option)
}

// 窗口大小改变时重新渲染图表
const handleResize = () => {
  dailyChart?.resize()
  compareChart?.resize()
}

onMounted(() => {
  initDailyChart()
  initCompareChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  dailyChart?.dispose()
  compareChart?.dispose()
})
</script>

<style scoped>
.my-progress-container {
  padding: 20px;
}

.card-title-wrapper {
  display: flex;
  align-items: center;
}

.title-text {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.title-buttons {
  margin-left: 10px;
}
</style>
