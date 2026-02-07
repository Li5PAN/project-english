<template>
  <div>
    <a-card title="我的学情">
      <a-row :gutter="16" style="margin-bottom: 24px;">
        <a-col :span="8">
          <a-statistic title="累计学习天数" :value="studyDays" suffix="天">
            <template #prefix>
              <CalendarOutlined />
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="8">
          <a-statistic title="累计学习单词" :value="totalWords" suffix="个">
            <template #prefix>
              <BookOutlined />
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="8">
          <a-statistic title="平均正确率" :value="avgAccuracy" suffix="%" :precision="1">
            <template #prefix>
              <TrophyOutlined />
            </template>
          </a-statistic>
        </a-col>
      </a-row>
      
      <a-divider>学习趋势</a-divider>
      
      <div ref="chartRef" style="width: 100%; height: 400px;"></div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { CalendarOutlined, BookOutlined, TrophyOutlined } from '@ant-design/icons-vue'

const chartRef = ref(null)
const studyDays = ref(45)
const totalWords = ref(368)
const avgAccuracy = ref(85.6)

onMounted(() => {
  initChart()
})

const initChart = () => {
  const chart = echarts.init(chartRef.value)
  
  const option = {
    backgroundColor: '#fff',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['学习单词数', '正确率']
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
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
        max: 100
      }
    ],
    series: [
      {
        name: '学习单词数',
        type: 'bar',
        data: [25, 32, 28, 35, 30, 42, 38],
        itemStyle: {
          color: '#1890ff'
        }
      },
      {
        name: '正确率',
        type: 'line',
        yAxisIndex: 1,
        data: [82, 85, 88, 84, 86, 90, 87],
        itemStyle: {
          color: '#52c41a'
        },
        smooth: true
      }
    ]
  }
  
  chart.setOption(option)
  
  // 响应式
  window.addEventListener('resize', () => {
    chart.resize()
  })
}
</script>

<style scoped>
div {
  background: #fff;
}
</style>
