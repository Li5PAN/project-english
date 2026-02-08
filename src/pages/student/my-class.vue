<template>
  <div class="my-class-container">
    <!-- 未入班状态：显示A/B/C/D级班级列表 -->
    <div v-if="!hasClass">
      <a-card title="选择班级">
        <a-alert
          v-if="isFirstJoin"
          message="首次入班提示"
          description="您还未加入任何班级，请从以下班级中选择一个提交入班申请，等待老师审核。首次入班仅可选择D级班级。"
          type="info"
          show-icon
          style="margin-bottom: 20px"
        />
        <a-alert
          v-else
          message="重新入班提示"
          :description="`您上次的班级等级为${lastClassLevel}级，只能选择${lastClassLevel}级或更低等级的班级。`"
          type="warning"
          show-icon
          style="margin-bottom: 20px"
        />
        
        <!-- 等级标签切换 -->
        <div style="margin-bottom: 20px">
          <a-space :size="6">
            <a-button 
              :type="selectedLevel === 'A' ? 'primary' : 'default'"
              size="large"
              @click="selectedLevel = 'A'"
            >
              A级
            </a-button>
            <a-button 
              :type="selectedLevel === 'B' ? 'primary' : 'default'"
              size="large"
              @click="selectedLevel = 'B'"
            >
              B级
            </a-button>
            <a-button 
              :type="selectedLevel === 'C' ? 'primary' : 'default'"
              size="large"
              @click="selectedLevel = 'C'"
            >
              C级
            </a-button>
            <a-button 
              :type="selectedLevel === 'D' ? 'primary' : 'default'"
              size="large"
              @click="selectedLevel = 'D'"
            >
              D级
            </a-button>
          </a-space>
        </div>
        
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="cls in filteredClasses" :key="cls.id">
            <a-card hoverable class="class-card" @click="applyToClass(cls)">
              <div class="class-header">
                <a-tag :color="getLevelColor(cls.level)" class="level-tag">{{ cls.level }}级</a-tag>
                <div class="class-name">{{ cls.name }}</div>
              </div>
              <a-divider style="margin: 12px 0" />
              <div class="class-info">
                <div class="info-item">
                  <UserOutlined class="info-icon" />
                  <span class="info-label">授课老师：</span>
                  <span class="info-value">{{ cls.teacher }}</span>
                </div>
                <div class="info-item">
                  <TeamOutlined class="info-icon" />
                  <span class="info-label">班级人数：</span>
                  <span class="info-value">{{ cls.studentCount }}人</span>
                </div>
                <div class="info-item">
                  <TrophyOutlined class="info-icon" />
                  <span class="info-label">任务数量：</span>
                  <span class="info-value">{{ cls.totalTasks }}个</span>
                </div>
              </div>
              <a-button 
                type="primary" 
                block 
                style="margin-top: 12px"
                :disabled="!canApplyClass(cls.level)"
              >
                {{ getApplyButtonText(cls.level) }}
              </a-button>
            </a-card>
          </a-col>
        </a-row>
      </a-card>
    </div>

    <!-- 已入班状态：显示班级详情 -->
    <div v-else>
      <a-card title="我的班级">
        <template #extra>
          <a-space>
            <a-button 
              type="default"
              danger
              style="background-color: #fffbe6; border-color: #ffe58f; color: #d48806"
              @click="showExitModal"
            >
              退出班级
            </a-button>
            <a-button 
              type="primary" 
              @click="goToChangeClass"
            >
              班级中心
            </a-button>
          </a-space>
        </template>

        <a-descriptions bordered :column="2">
          <a-descriptions-item label="班级名称">
            <a-tag :color="getLevelColor(currentClass.level)">{{ currentClass.level }}级</a-tag>
            {{ currentClass.name }}
          </a-descriptions-item>
          <a-descriptions-item label="授课老师">{{ currentClass.teacher }}</a-descriptions-item>
          <a-descriptions-item label="班级总人数">{{ currentClass.studentCount }}人</a-descriptions-item>
          <a-descriptions-item label="个人班级排名">第{{ currentClass.myRank }}名</a-descriptions-item>
          <a-descriptions-item label="班级任务平均完成率">{{ currentClass.avgCompletionRate }}%</a-descriptions-item>
          <a-descriptions-item label="我的任务完成率">
            <a-progress 
              :percent="currentClass.myCompletionRate" 
              :status="currentClass.myCompletionRate === 100 ? 'success' : 'active'"
            />
          </a-descriptions-item>
        </a-descriptions>

        <a-alert
          v-if="currentClass.myCompletionRate < 100"
          message="换班提示"
          :description="`您当前的任务完成率为 ${currentClass.myCompletionRate}%，需要完成 100% 的班级任务才能申请换班。`"
          type="warning"
          show-icon
          style="margin-top: 16px"
        />
        
        <a-divider>班级前15名轮播</a-divider>
        
        <div class="rank-carousel-container">
          <a-table 
            :columns="rankColumns" 
            :data-source="displayRankData" 
            :pagination="false"
            size="small"
            :scroll="{ y: 300 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'rank'">
                <a-tag v-if="record.rank === 1" color="gold">🥇 {{ record.rank }}</a-tag>
                <a-tag v-else-if="record.rank === 2" color="silver">🥈 {{ record.rank }}</a-tag>
                <a-tag v-else-if="record.rank === 3" color="bronze">🥉 {{ record.rank }}</a-tag>
                <span v-else>{{ record.rank }}</span>
              </template>
              <template v-if="column.key === 'name'">
                <span :style="{ fontWeight: record.isMe ? 'bold' : 'normal', color: record.isMe ? '#1890ff' : '' }">
                  {{ record.name }} {{ record.isMe ? '(我)' : '' }}
                </span>
              </template>
            </template>
          </a-table>
        </div>
      </a-card>
    </div>

    <!-- 入班申请确认弹窗 -->
    <a-modal
      v-model:open="applyModalVisible"
      title="确认入班申请"
      @ok="confirmApply"
      @cancel="applyModalVisible = false"
    >
      <p>您确定要申请加入 <strong>{{ selectedClass?.name }}</strong> 吗？</p>
      <p>提交后需要等待老师审核通过才能正式入班。</p>
    </a-modal>

    <!-- 退出班级确认弹窗 -->
    <a-modal
      v-model:open="exitModalVisible"
      title="确认退出班级"
      @ok="confirmExit"
      @cancel="exitModalVisible = false"
      ok-text="确认退出"
      cancel-text="取消"
    >
      <a-alert
        message="警告"
        description="退出班级后，您的学习进度和排名数据将被清空，需要重新申请加入班级。确定要退出吗？"
        type="warning"
        show-icon
        style="margin-bottom: 16px"
      />
      <p>当前班级：<strong>{{ currentClass.name }}</strong></p>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons-vue'

const router = useRouter()

// 是否已加入班级（模拟数据，实际应从后端获取）
const hasClass = ref(true) // 改为 false 可查看未入班状态

// 是否是首次入班（首次入班只能选D级）
const isFirstJoin = ref(true) // 如果之前加入过班级，改为 false

// 上一次班级等级（用于退出班级后的限制）
const lastClassLevel = ref(null) // 退出班级后会记录上次等级

// 选中的等级
const selectedLevel = ref('D')

// 所有班级列表
const allClasses = ref([
  // A级班级
  { id: 1, level: 'A', name: 'A1班', teacher: '王老师', studentCount: 30, avgCompletionRate: 95, totalTasks: 120 },
  { id: 2, level: 'A', name: 'A2班', teacher: '李老师', studentCount: 28, avgCompletionRate: 93, totalTasks: 120 },
  { id: 3, level: 'A', name: 'A3班', teacher: '赵老师', studentCount: 32, avgCompletionRate: 94, totalTasks: 120 },
  
  // B级班级
  { id: 7, level: 'B', name: 'B1班', teacher: '刘老师', studentCount: 35, avgCompletionRate: 85, totalTasks: 100 },
  { id: 8, level: 'B', name: 'B2班', teacher: '张老师', studentCount: 45, avgCompletionRate: 82, totalTasks: 100 },
  { id: 9, level: 'B', name: 'B3班', teacher: '陈老师', studentCount: 38, avgCompletionRate: 84, totalTasks: 100 },
  { id: 10, level: 'B', name: 'B4班', teacher: '孙老师', studentCount: 40, avgCompletionRate: 83, totalTasks: 100 },
  
  // C级班级
  { id: 13, level: 'C', name: 'C1班', teacher: '周老师', studentCount: 40, avgCompletionRate: 78, totalTasks: 80 },
  { id: 14, level: 'C', name: 'C2班', teacher: '吴老师', studentCount: 42, avgCompletionRate: 76, totalTasks: 80 },
  { id: 15, level: 'C', name: 'C3班', teacher: '郑老师', studentCount: 38, avgCompletionRate: 77, totalTasks: 80 },
  { id: 16, level: 'C', name: 'C4班', teacher: '钱老师', studentCount: 41, avgCompletionRate: 75, totalTasks: 80 },
  
  // D级班级
  { id: 19, level: 'D', name: 'D1班', teacher: '王老师', studentCount: 32, avgCompletionRate: 75, totalTasks: 60 },
  { id: 20, level: 'D', name: 'D2班', teacher: '李老师', studentCount: 28, avgCompletionRate: 78, totalTasks: 60 },
  { id: 21, level: 'D', name: 'D3班', teacher: '张老师', studentCount: 30, avgCompletionRate: 72, totalTasks: 60 },
  { id: 22, level: 'D', name: 'D4班', teacher: '刘老师', studentCount: 35, avgCompletionRate: 80, totalTasks: 60 },
  { id: 23, level: 'D', name: 'D5班', teacher: '陈老师', studentCount: 29, avgCompletionRate: 76, totalTasks: 60 },
  { id: 24, level: 'D', name: 'D6班', teacher: '赵老师', studentCount: 31, avgCompletionRate: 74, totalTasks: 60 },
])

// 根据选中等级过滤班级
const filteredClasses = computed(() => {
  return allClasses.value.filter(cls => cls.level === selectedLevel.value)
})

// D级班级列表（保留兼容性）
const dLevelClasses = computed(() => {
  return allClasses.value.filter(cls => cls.level === 'D')
})

// 当前班级信息
const currentClass = ref({
  level: 'B',
  name: 'B2班',
  teacher: '张老师',
  studentCount: 45,
  myRank: 8,
  avgCompletionRate: 82,
  myCompletionRate: 100, // 改为 100 可测试换班按钮启用
  totalTasks: 80,
  completedTasks: 80
})

// 是否可以换班（任务完成率达到100%）
const canChangeClass = computed(() => currentClass.value.myCompletionRate === 100)

// 班级等级颜色
const getLevelColor = (level) => {
  const colors = { A: 'red', B: 'orange', C: 'blue', D: 'green' }
  return colors[level] || 'default'
}

const getLevelColorHex = (level) => {
  const colors = { A: '#f5222d', B: '#fa8c16', C: '#1890ff', D: '#52c41a' }
  return colors[level] || '#666'
}

// 等级排序（A最高，D最低）
const levelOrder = { A: 4, B: 3, C: 2, D: 1 }

// 判断是否可以申请该班级
const canApplyClass = (classLevel) => {
  // 首次入班只能选D级
  if (isFirstJoin.value) {
    return classLevel === 'D'
  }
  
  // 退出班级后，不能选择比上次更高等级的班级
  if (lastClassLevel.value) {
    return levelOrder[classLevel] <= levelOrder[lastClassLevel.value]
  }
  
  return true
}

// 获取申请按钮文字
const getApplyButtonText = (classLevel) => {
  if (isFirstJoin.value && classLevel !== 'D') {
    return '首次仅可选D级'
  }
  
  if (lastClassLevel.value && levelOrder[classLevel] > levelOrder[lastClassLevel.value]) {
    return '等级不符'
  }
  
  return '申请入班'
}

// 排行榜列配置
const rankColumns = [
  { title: '排名', dataIndex: 'rank', key: 'rank', width: 80 },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '任务完成率', dataIndex: 'completionRate', key: 'completionRate', width: 120 },
  { title: '平均分', dataIndex: 'avgScore', key: 'avgScore', width: 100 },
]

// 前15名数据
const topRankData = ref([
  { key: '1', rank: 1, name: '李明', completionRate: '100%', avgScore: 92, isMe: false },
  { key: '2', rank: 2, name: '王芳', completionRate: '98%', avgScore: 90, isMe: false },
  { key: '3', rank: 3, name: '张伟', completionRate: '96%', avgScore: 88, isMe: false },
  { key: '4', rank: 4, name: '刘洋', completionRate: '95%', avgScore: 87, isMe: false },
  { key: '5', rank: 5, name: '陈静', completionRate: '93%', avgScore: 86, isMe: false },
  { key: '6', rank: 6, name: '赵强', completionRate: '92%', avgScore: 86, isMe: false },
  { key: '7', rank: 7, name: '孙丽', completionRate: '90%', avgScore: 85, isMe: false },
  { key: '8', rank: 8, name: '我', completionRate: '85%', avgScore: 85, isMe: true },
  { key: '9', rank: 9, name: '周杰', completionRate: '83%', avgScore: 84, isMe: false },
  { key: '10', rank: 10, name: '吴娜', completionRate: '82%', avgScore: 83, isMe: false },
  { key: '11', rank: 11, name: '郑浩', completionRate: '80%', avgScore: 82, isMe: false },
  { key: '12', rank: 12, name: '钱敏', completionRate: '78%', avgScore: 81, isMe: false },
  { key: '13', rank: 13, name: '孙涛', completionRate: '76%', avgScore: 80, isMe: false },
  { key: '14', rank: 14, name: '李娜', completionRate: '75%', avgScore: 79, isMe: false },
  { key: '15', rank: 15, name: '王强', completionRate: '73%', avgScore: 78, isMe: false },
])

// 轮播相关
const currentIndex = ref(0)
const itemsPerPage = 5
let carouselTimer = null

// 当前显示的数据（循环显示）
const displayRankData = computed(() => {
  const data = []
  for (let i = 0; i < itemsPerPage; i++) {
    const index = (currentIndex.value + i) % topRankData.value.length
    data.push(topRankData.value[index])
  }
  return data
})

// 启动轮播
const startCarousel = () => {
  carouselTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % topRankData.value.length
  }, 3000) // 每3秒滚动一次
}

// 停止轮播
const stopCarousel = () => {
  if (carouselTimer) {
    clearInterval(carouselTimer)
    carouselTimer = null
  }
}

// 入班申请相关
const applyModalVisible = ref(false)
const selectedClass = ref(null)

const applyToClass = (cls) => {
  // 检查是否符合申请条件
  if (!canApplyClass(cls.level)) {
    message.warning('您当前的条件不符合进入该班级')
    return
  }
  
  selectedClass.value = cls
  applyModalVisible.value = true
}

const confirmApply = () => {
  // 实际应调用后端API提交入班申请
  message.success(`已提交入班申请到 ${selectedClass.value.name}，请等待老师审核`)
  applyModalVisible.value = false
  
  // 模拟申请成功后的状态（实际应等待审核通过）
  // hasClass.value = true
}

// 退出班级相关
const exitModalVisible = ref(false)

const showExitModal = () => {
  exitModalVisible.value = true
}

const confirmExit = () => {
  // 记录当前班级等级
  lastClassLevel.value = currentClass.value.level
  
  // 实际应调用后端API退出班级
  message.success(`已成功退出班级，您上次的班级等级为${lastClassLevel.value}级`)
  exitModalVisible.value = false
  hasClass.value = false
  isFirstJoin.value = false // 退出后再入班就不是首次了
  stopCarousel()
  
  // 重置为上次等级或D级标签
  selectedLevel.value = lastClassLevel.value || 'D'
}

// 跳转到换班中心
const goToChangeClass = () => {
  router.push('/student/change-class')
}

// 生命周期
onMounted(() => {
  if (hasClass.value) {
    startCarousel()
  }
})

onUnmounted(() => {
  stopCarousel()
})
</script>

<style scoped>
.my-class-container {
  padding: 20px;
}

.class-card {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.class-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.class-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.level-tag {
  font-size: 14px;
  font-weight: bold;
  padding: 2px 12px;
}

.class-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.class-info {
  text-align: left;
  font-size: 14px;
}

.info-item {
  margin: 8px 0;
  display: flex;
  align-items: center;
  color: #666;
}

.info-icon {
  margin-right: 6px;
  color: #1890ff;
}

.info-label {
  color: #999;
  min-width: 70px;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.rank-carousel-container {
  position: relative;
  overflow: hidden;
}

.rank-carousel-container :deep(.ant-table-body) {
  transition: transform 0.5s ease-in-out;
}

.rank-carousel-container :deep(.ant-table-row) {
  transition: all 0.5s ease-in-out;
}
</style>
