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

    <!-- 待处理事项卡片 -->
    <div class="pending-section">
      <a-row :gutter="16">
        <a-col :xs="24" :sm="8">
          <a-card hoverable class="pending-card" @click="goToClassManagement">
            <div class="pending-content">
              <div class="pending-icon" style="background: #fff7e6;">
                <AuditOutlined style="color: #fa8c16; font-size: 32px;" />
              </div>
              <div class="pending-info">
                <div class="pending-title">待审核班级</div>
                <div class="pending-count" style="color: #fa8c16;">{{ pendingTasks.pendingClasses }}</div>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="8">
          <a-card hoverable class="pending-card" @click="goToUserManagement">
            <div class="pending-content">
              <div class="pending-icon" style="background: #e6f7ff;">
                <UserAddOutlined style="color: #1890ff; font-size: 32px;" />
              </div>
             
            </div>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="8">
          <a-card hoverable class="pending-card">
            <div class="pending-content">
              <div class="pending-icon" style="background: #f6ffed;">
                <CheckCircleOutlined style="color: #52c41a; font-size: 32px;" />
              </div>
              <div class="pending-info">
                <div class="pending-title">今日活跃用户</div>
                <div class="pending-count" style="color: #52c41a;">{{ pendingTasks.activeUsers }}</div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 中间可视化图表区域 -->
    <div class="charts-section">
      <a-row :gutter="[16, 16]">
        <!-- 用户增长趋势图 -->
        <a-col :xs="24" :lg="12">
          <a-card title="用户增长趋势" :bordered="false">
            <div ref="userGrowthChart" style="width: 100%; height: 350px;"></div>
          </a-card>
        </a-col>

        <!-- 各等级班级分布饼图 -->
        <a-col :xs="24" :lg="12">
          <a-card title="各等级班级分布" :bordered="false">
            <div ref="classDistributionChart" style="width: 100%; height: 350px;"></div>
          </a-card>
        </a-col>

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
import { useRouter } from 'vue-router'
import { Empty } from 'ant-design-vue'
import * as echarts from 'echarts'
import UserOutlined from '@ant-design/icons-vue/UserOutlined'
import TeamOutlined from '@ant-design/icons-vue/TeamOutlined'
import SolutionOutlined from '@ant-design/icons-vue/SolutionOutlined'
import AuditOutlined from '@ant-design/icons-vue/AuditOutlined'
import UserAddOutlined from '@ant-design/icons-vue/UserAddOutlined'
import CheckCircleOutlined from '@ant-design/icons-vue/CheckCircleOutlined'

const router = useRouter()

// 总数据统计
const statistics = reactive({
  totalStudents: 156,
  totalClasses: 8,
  totalTeachers: 12
})

// 待处理事项
const pendingTasks = reactive({
  pendingClasses: 3,
  newUsers: 8,
  activeUsers: 45
})

// 图表数据标识
const hasTransferData = ref(true)
const hasQuitData = ref(true)
const hasClassCreateData = ref(true)

// 图表实例引用
const transferChart = ref(null)
const quitChart = ref(null)
const classCreateChart = ref(null)
const userGrowthChart = ref(null)
const classDistributionChart = ref(null)

let transferChartInstance = null
let quitChartInstance = null
let classCreateChartInstance = null
let userGrowthChartInstance = null
let classDistributionChartInstance = null

// 跳转到班级管理
const goToClassManagement = () => {
  router.push('/admin/class-management')
}

// 跳转到用户管理
const goToUserManagement = () => {
  router.push('/admin/user-management')
}

// 初始化用户增长趋势图
const initUserGrowthChart = () => {
  if (userGrowthChartInstance) {
    userGrowthChartInstance.dispose()
  }
  
  userGrowthChartInstance = echarts.init(userGrowthChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['学生', '教师'],
      bottom: 0,
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
    },
    yAxis: {
      type: 'value',
      name: '人数'
    },
    series: [
      {
        name: '学生',
        type: 'line',
        data: [20, 35, 48, 65, 88, 120, 156],
        smooth: true,
        itemStyle: {
          color: '#1890ff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
          ])
        }
      },
      {
        name: '教师',
        type: 'line',
        data: [2, 3, 5, 6, 8, 10, 12],
        smooth: true,
        itemStyle: {
          color: '#52c41a'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
            { offset: 1, color: 'rgba(82, 196, 26, 0.1)' }
          ])
        }
      }
    ]
  }
  
  userGrowthChartInstance.setOption(option)
}

// 初始化各等级班级分布饼图
const initClassDistributionChart = () => {
  if (classDistributionChartInstance) {
    classDistributionChartInstance.dispose()
  }
  
  classDistributionChartInstance = echarts.init(classDistributionChart.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}个 ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      left: 'center',
      data: ['A级', 'B级', 'C级', 'D级']
    },
    series: [
      {
        name: '班级等级',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{c}个'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data: [
          { 
            value: 2, 
            name: 'A级',
            itemStyle: { color: '#ff4d4f' }
          },
          { 
            value: 2, 
            name: 'B级',
            itemStyle: { color: '#ff7a45' }
          },
          { 
            value: 2, 
            name: 'C级',
            itemStyle: { color: '#1890ff' }
          },
          { 
            value: 2, 
            name: 'D级',
            itemStyle: { color: '#52c41a' }
          }
        ]
      }
    ]
  }
  
  classDistributionChartInstance.setOption(option)
}

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
  userGrowthChartInstance?.resize()
  classDistributionChartInstance?.resize()
}

onMounted(() => {
  nextTick(() => {
    initUserGrowthChart()
    initClassDistributionChart()
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
  userGrowthChartInstance?.dispose()
  classDistributionChartInstance?.dispose()
})
</script>

<style scoped src="./home.css"></style>
