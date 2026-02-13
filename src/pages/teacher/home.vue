<template>
  <div class="teacher-home-container">
    <!-- 核心数据统计卡片 -->
    <div class="statistics-section">
      <a-row :gutter="16">
        <a-col :xs="24" :sm="12" :md="6">
          <a-card hoverable>
            <a-statistic 
              title="学生总人数" 
              :value="statistics.totalStudents" 
              suffix="人"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <TeamOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-card hoverable>
            <a-statistic 
              title="班级总数" 
              :value="statistics.totalClasses" 
              suffix="个"
              :value-style="{ color: '#52c41a' }"
            >
              <template #prefix>
                <HomeOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-card hoverable class="pending-card">
            <a-statistic 
              title="待审核申请数" 
              :value="statistics.pendingReviews" 
              suffix="个"
              :value-style="{ color: '#cf1322' }"
            >
              <template #prefix>
                <BellOutlined />
              </template>
            </a-statistic>
            <a-badge :count="statistics.pendingReviews" :offset="[10, -10]" />
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-card hoverable>
            <a-statistic 
              title="待完成任务数" 
              :value="statistics.pendingTasks" 
              suffix="个"
              :value-style="{ color: '#faad14' }"
            >
              <template #prefix>
                <FileTextOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 快捷操作入口 -->
    <div class="quick-actions-section">
      <a-card title="快捷操作" :bordered="false">
        <a-row :gutter="16">
          <a-col :xs="24" :sm="8">
            <div class="action-card" @click="goToPublishTask">
              <div class="action-icon" style="background: #1890ff;">
                <PlusCircleOutlined />
              </div>
              <div class="action-content">
                <h3>快速发布任务</h3>
                <p>为班级发布新的学习任务</p>
              </div>
            </div>
          </a-col>
          <a-col :xs="24" :sm="8">
            <div class="action-card" @click="goToReview">
              <div class="action-icon" style="background: #cf1322;">
                <CheckCircleOutlined />
              </div>
              <div class="action-content">
                <h3>查看待审核申请</h3>
                <p>处理学生的入班、换班申请</p>
                <a-badge :count="statistics.pendingReviews" style="margin-left: 8px;" />
              </div>
            </div>
          </a-col>
          <a-col :xs="24" :sm="8">
            <div class="action-card" @click="goToErrors">
              <div class="action-icon" style="background: #faad14;">
                <WarningOutlined />
              </div>
              <div class="action-content">
                <h3>查看最近错题</h3>
                <p>分析学生的错题情况</p>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </div>

    <!-- 图表可视化区域 -->
    <div class="charts-section">
      <a-row :gutter="[16, 16]">
        <!-- 各班级任务完成率对比 -->
        <a-col :xs="24" :lg="12">
          <a-card title="各班级任务完成率对比" :bordered="false">
            <div ref="taskCompletionChart" style="width: 100%; height: 350px;"></div>
          </a-card>
        </a-col>

        <!-- 学生活跃度趋势 -->
        <a-col :xs="24" :lg="12">
          <a-card title="学生活跃度趋势（最近7天）" :bordered="false">
            <div ref="activityTrendChart" style="width: 100%; height: 350px;"></div>
          </a-card>
        </a-col>

        <!-- 错题类型分布 -->
        <a-col :xs="24" :lg="12">
          <a-card title="错题类型分布" :bordered="false">
            <div ref="errorTypeChart" style="width: 100%; height: 350px;"></div>
          </a-card>
        </a-col>

        <!-- 班级等级分布 -->
        <a-col :xs="24" :lg="12">
          <a-card title="班级等级分布" :bordered="false">
            <div ref="classLevelChart" style="width: 100%; height: 350px;"></div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import TeamOutlined from '@ant-design/icons-vue/TeamOutlined'
import HomeOutlined from '@ant-design/icons-vue/HomeOutlined'
import BellOutlined from '@ant-design/icons-vue/BellOutlined'
import FileTextOutlined from '@ant-design/icons-vue/FileTextOutlined'
import PlusCircleOutlined from '@ant-design/icons-vue/PlusCircleOutlined'
import CheckCircleOutlined from '@ant-design/icons-vue/CheckCircleOutlined'
import WarningOutlined from '@ant-design/icons-vue/WarningOutlined'

const router = useRouter()

// 核心统计数据
const statistics = reactive({
  totalStudents: 156,
  totalClasses: 8,
  pendingReviews: 12,
  pendingTasks: 5
})

// 图表实例引用
const taskCompletionChart = ref(null)
const activityTrendChart = ref(null)
const errorTypeChart = ref(null)
const classLevelChart = ref(null)

let taskChart = null
let activityChart = null
let errorChart = null
let levelChart = null

// 初始化各班级任务完成率对比图
// 数据来源: 教师的班级列表
// 统计规则: 每日下午5点整点后统计当日任务完成率
const initTaskCompletionChart = () => {
  if (taskChart) {
    taskChart.dispose()
  }
  
  taskChart = echarts.init(taskCompletionChart.value)
  
  // TODO: 从后端获取教师的班级列表和完成率数据
  // 示例数据结构:
  // const classData = await fetchTeacherClasses()
  // const completionData = await fetchDailyCompletion(classData, '17:00')
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['完成率'],
      bottom: 0,  // 放置在底部
      left: 'center',  // 水平居中
      itemGap: 20  // 图例项之间的间距
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '40px',  // 增加底部空间，为图例留出位置（横坐标 + 8px间距 + 图例高度）
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['A级-高级班', 'B级-中级班', 'C级-初级班', 'D级-基础班', 'A级-进阶班', 'B级-提高班', 'C级-入门班', 'D级-启蒙班'],
      axisLabel: {
        interval: 0,
        rotate: 30  // 旋转标签避免重叠
      }
    },
    yAxis: {
      type: 'value',
      name: '完成率(%)',
      max: 100
    },
    series: [
      {
        name: '完成率',
        type: 'bar',
        data: [85, 78, 92, 65, 88, 75, 80, 70],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%'
        }
      }
    ]
  }
  
  taskChart.setOption(option)
}

// 初始化学生活跃度趋势图
const initActivityTrendChart = () => {
  if (activityChart) {
    activityChart.dispose()
  }
  
  activityChart = echarts.init(activityTrendChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['完成任务数', '练习题数'],
      bottom: 0,  // 放置在底部
      left: 'center',  // 水平居中
      itemGap: 20  // 图例项之间的间距
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '40px',  // 增加底部空间，为图例留出位置（横坐标 + 8px间距 + 图例高度）
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '完成任务数',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310],
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
      },
      {
        name: '练习题数',
        type: 'line',
        data: [150, 232, 201, 154, 190, 330, 410],
        smooth: true,
        itemStyle: {
          color: '#faad14'
        }
      }
    ]
  }
  
  activityChart.setOption(option)
}

// 初始化错题类型分布图
const initErrorTypeChart = () => {
  if (errorChart) {
    errorChart.dispose()
  }
  
  errorChart = echarts.init(errorTypeChart.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}题 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['选择题', '填空题', '单词拼写']
    },
    series: [
      {
        name: '错题类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{c}题 ({d}%)'
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
            value: 335, 
            name: '选择题',
            itemStyle: { color: '#1890ff' }
          },
          { 
            value: 234, 
            name: '填空题',
            itemStyle: { color: '#52c41a' }
          },
          { 
            value: 148, 
            name: '单词拼写',
            itemStyle: { color: '#faad14' }
          }
        ]
      }
    ]
  }
  
  errorChart.setOption(option)
}

// 初始化班级等级分布图
// 数据来源: 教师的班级列表,按等级统计班级数量
const initClassLevelChart = () => {
  if (levelChart) {
    levelChart.dispose()
  }
  
  levelChart = echarts.init(classLevelChart.value)
  
  // TODO: 从后端获取教师的班级列表并按等级分组统计
  // 示例数据结构:
  // const classData = await fetchTeacherClasses()
  // const levelStats = groupByLevel(classData)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}个班级 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['A级', 'B级', 'C级', 'D级']
    },
    series: [
      {
        name: '班级等级',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{c}个 ({d}%)'
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
  
  levelChart.setOption(option)
}

// 快捷操作跳转
const goToPublishTask = () => {
  router.push('/teacher/my-classes')
}

const goToReview = () => {
  router.push('/teacher/student-review')
}

const goToErrors = () => {
  router.push('/teacher/error-management')
}

// 窗口大小变化时重新渲染图表
const handleResize = () => {
  taskChart?.resize()
  activityChart?.resize()
  errorChart?.resize()
  levelChart?.resize()
}

onMounted(() => {
  nextTick(() => {
    initTaskCompletionChart()
    initActivityTrendChart()
    initErrorTypeChart()
    initClassLevelChart()
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
  })
})

// 组件卸载时清理
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  taskChart?.dispose()
  activityChart?.dispose()
  errorChart?.dispose()
  levelChart?.dispose()
})
</script>

<style scoped>
.teacher-home-container {
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

.pending-card {
  position: relative;
}

.pending-card :deep(.ant-badge) {
  position: absolute;
  top: 16px;
  right: 16px;
}

.quick-actions-section {
  margin-bottom: 24px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  height: 100%;
}

.action-card:hover {
  background: #e6f7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
}

.action-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #fff;
  flex-shrink: 0;
}

.action-content {
  flex: 1;
}

.action-content h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.action-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.charts-section {
  margin-bottom: 24px;
}

.charts-section :deep(.ant-card) {
  height: 100%;
}

.charts-section :deep(.ant-card-head-title) {
  font-size: 16px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .action-card {
    margin-bottom: 12px;
  }
  
  .statistics-section :deep(.ant-col) {
    margin-bottom: 16px;
  }
}
</style>
