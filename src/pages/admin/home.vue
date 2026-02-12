<template>
  <div class="admin-home-container">
    <!-- 顶部总数据卡片 -->
    <div class="statistics-section">
      <a-row :gutter="16">
        <a-col :xs="24" :sm="8">
          <a-card hoverable>
            <a-statistic 
              title="总学生人数" 
              :value="statistics.totalStudents" 
              suffix="人"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="8">
          <a-card hoverable>
            <a-statistic 
              title="总班级数" 
              :value="statistics.totalClasses" 
              suffix="个"
              :value-style="{ color: '#52c41a' }"
            >
              <template #prefix>
                <TeamOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="8">
          <a-card hoverable>
            <a-statistic 
              title="总教师数" 
              :value="statistics.totalTeachers" 
              suffix="人"
              :value-style="{ color: '#faad14' }"
            >
              <template #prefix>
                <SolutionOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 中间可视化图表区域 -->
    <div class="charts-section">
      <a-row :gutter="[16, 16]">
        <!-- 换班变化图 -->
        <a-col :xs="24" :lg="8">
          <a-card title="换班变化趋势" :bordered="false">
            <div v-if="hasTransferData" ref="transferChart" style="width: 100%; height: 350px;"></div>
            <a-empty v-else description="暂无数据" :image="Empty.PRESENTED_IMAGE_SIMPLE" />
          </a-card>
        </a-col>

        <!-- 退班变化图 -->
        <a-col :xs="24" :lg="8">
          <a-card title="退班变化趋势" :bordered="false">
            <div v-if="hasQuitData" ref="quitChart" style="width: 100%; height: 350px;"></div>
            <a-empty v-else description="暂无数据" :image="Empty.PRESENTED_IMAGE_SIMPLE" />
          </a-card>
        </a-col>

        <!-- 教师班级创建图 -->
        <a-col :xs="24" :lg="8">
          <a-card title="班级创建趋势" :bordered="false">
            <div v-if="hasClassCreateData" ref="classCreateChart" style="width: 100%; height: 350px;"></div>
            <a-empty v-else description="暂无数据" :image="Empty.PRESENTED_IMAGE_SIMPLE" />
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { Empty } from 'ant-design-vue'
import * as echarts from 'echarts'
import UserOutlined from '@ant-design/icons-vue/UserOutlined'
import TeamOutlined from '@ant-design/icons-vue/TeamOutlined'
import SolutionOutlined from '@ant-design/icons-vue/SolutionOutlined'

// 总数据统计
const statistics = reactive({
  totalStudents: 156,
  totalClasses: 8,
  totalTeachers: 12
})

// 图表数据标识
const hasTransferData = ref(true)
const hasQuitData = ref(true)
const hasClassCreateData = ref(true)

// 图表实例引用
const transferChart = ref(null)
const quitChart = ref(null)
const classCreateChart = ref(null)

let transferChartInstance = null
let quitChartInstance = null
let classCreateChartInstance = null

// 初始化换班变化图
const initTransferChart = () => {
  if (!hasTransferData.value) return
  
  if (transferChartInstance) {
    transferChartInstance.dispose()
  }
  
  transferChartInstance = echarts.init(transferChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
    },
    yAxis: {
      type: 'value',
      name: '换班人数'
    },
    series: [
      {
        name: '换班人数',
        type: 'bar',
        data: [5, 8, 12, 6, 10, 15, 9],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        label: {
          show: true,
          position: 'top'
        }
      }
    ]
  }
  
  transferChartInstance.setOption(option)
}

// 初始化退班变化图
const initQuitChart = () => {
  if (!hasQuitData.value) return
  
  if (quitChartInstance) {
    quitChartInstance.dispose()
  }
  
  quitChartInstance = echarts.init(quitChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
    },
    yAxis: {
      type: 'value',
      name: '退班人数'
    },
    series: [
      {
        name: '退班人数',
        type: 'line',
        data: [3, 5, 2, 8, 4, 6, 3],
        smooth: true,
        itemStyle: {
          color: '#ff4d4f'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 77, 79, 0.3)' },
            { offset: 1, color: 'rgba(255, 77, 79, 0.1)' }
          ])
        }
      }
    ]
  }
  
  quitChartInstance.setOption(option)
}

// 初始化班级创建图
const initClassCreateChart = () => {
  if (!hasClassCreateData.value) return
  
  if (classCreateChartInstance) {
    classCreateChartInstance.dispose()
  }
  
  classCreateChartInstance = echarts.init(classCreateChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
    },
    yAxis: {
      type: 'value',
      name: '创建班级数'
    },
    series: [
      {
        name: '创建班级数',
        type: 'bar',
        data: [2, 3, 1, 4, 2, 3, 2],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#95de64' },
            { offset: 0.5, color: '#52c41a' },
            { offset: 1, color: '#52c41a' }
          ])
        },
        label: {
          show: true,
          position: 'top'
        }
      }
    ]
  }
  
  classCreateChartInstance.setOption(option)
}

// 窗口大小变化时重新渲染图表
const handleResize = () => {
  transferChartInstance?.resize()
  quitChartInstance?.resize()
  classCreateChartInstance?.resize()
}

onMounted(() => {
  nextTick(() => {
    initTransferChart()
    initQuitChart()
    initClassCreateChart()
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
  })
})

// 组件卸载时清理
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  transferChartInstance?.dispose()
  quitChartInstance?.dispose()
  classCreateChartInstance?.dispose()
})
</script>

<style scoped>
.admin-home-container {
  padding: 0;
}

.statistics-section {
  margin-bottom: 24px;
}

.statistics-section :deep(.ant-card) {
  transition: all 0.3s;
}

.statistics-section :deep(.ant-card:hover) {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.charts-section :deep(.ant-card) {
  height: 100%;
}

.charts-section :deep(.ant-card-head-title) {
  font-size: 16px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .statistics-section :deep(.ant-col) {
    margin-bottom: 16px;
  }
}
</style>
