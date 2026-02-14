<template>
  <div class="class-data-container">
    <!-- 顶部筛选 -->
    <a-card style="margin-bottom: 16px;">
      <a-space :size="16">
        <span>选择班级：</span>
        <a-select 
          v-model:value="selectedClass" 
          placeholder="请选择班级" 
          style="width: 200px"
          @change="handleClassChange"
        >
          <a-select-option 
            v-for="cls in classList" 
            :key="cls.id" 
            :value="cls.id"
          >
            <a-tag :color="getLevelColor(cls.level)" size="small">{{ cls.level }}级</a-tag>
            {{ cls.name }}
          </a-select-option>
        </a-select>
      </a-space>
    </a-card>

    <!-- 图表区域 -->
    <a-row :gutter="[16, 16]">
      <!-- 班级任务完成对比图 -->
      <a-col :span="24">
        <a-card title="班级任务完成对比图" :bordered="false">
          <div ref="taskCompletionChart" style="width: 100%; height: 400px;"></div>
        </a-card>
      </a-col>

      <!-- 学生学习活跃分析图 -->
      <a-col :span="12">
        <a-card title="学生学习活跃分析图" :bordered="false">
          <div ref="studentActivityChart" style="width: 100%; height: 400px;"></div>
        </a-card>
      </a-col>

      <!-- 学生错题类型分析图 -->
      <a-col :span="12">
        <a-card title="学生错题类型分析图" :bordered="false">
          <div ref="errorTypeChart" style="width: 100%; height: 400px;"></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

// 选中的班级
const selectedClass = ref(1)

// 班级列表
const classList = ref([
  { id: 1, name: '高级英语班', level: 'A' },
  { id: 2, name: '中级英语班', level: 'B' },
  { id: 3, name: '初级英语班', level: 'C' },
  { id: 4, name: '基础英语班', level: 'D' }
])

// 图表实例
const taskCompletionChart = ref(null)
const studentActivityChart = ref(null)
const errorTypeChart = ref(null)

let taskChart = null
let activityChart = null
let errorChart = null

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

// 初始化班级任务完成对比图
const initTaskCompletionChart = () => {
  if (taskChart) {
    taskChart.dispose()
  }
  
  taskChart = echarts.init(taskCompletionChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['已完成', '未完成'],
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
      data: ['任务1', '任务2', '任务3', '任务4', '任务5', '任务6', '任务7', '任务8']
    },
    yAxis: {
      type: 'value',
      name: '人数'
    },
    series: [
      {
        name: '已完成',
        type: 'bar',
        stack: 'total',
        data: [35, 38, 32, 40, 36, 39, 37, 34],
        itemStyle: {
          color: '#52c41a'
        }
      },
      {
        name: '未完成',
        type: 'bar',
        stack: 'total',
        data: [5, 2, 8, 0, 4, 1, 3, 6],
        itemStyle: {
          color: '#ff4d4f'
        }
      }
    ]
  }
  
  taskChart.setOption(option)
}

// 初始化学生学习活跃分析图
const initStudentActivityChart = () => {
  if (activityChart) {
    activityChart.dispose()
  }
  
  activityChart = echarts.init(studentActivityChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['完成任务数', '练习题数'],
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

// 初始化学生错题类型分析图
const initErrorTypeChart = () => {
  if (errorChart) {
    errorChart.dispose()
  }
  
  errorChart = echarts.init(errorTypeChart.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
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
          formatter: '{b}: {c}题 ({d}%)'
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

// 处理班级切换
const handleClassChange = () => {
  // 重新加载图表数据
  initTaskCompletionChart()
  initStudentActivityChart()
  initErrorTypeChart()
}

// 窗口大小变化时重新渲染图表
const handleResize = () => {
  taskChart?.resize()
  activityChart?.resize()
  errorChart?.resize()
}

onMounted(() => {
  nextTick(() => {
    initTaskCompletionChart()
    initStudentActivityChart()
    initErrorTypeChart()
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
  })
})

// 组件卸载时清理
import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  taskChart?.dispose()
  activityChart?.dispose()
  errorChart?.dispose()
})
</script>

<style scoped src="./class-data.css"></style>
