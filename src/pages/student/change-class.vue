<template>
  <div class="change-class-container">
    <a-card title="换班中心">
      <template #extra>
        <a-button type="default" @click="goToMyClass">
          我的班级
        </a-button>
      </template>
      <!-- 当前班级信息 -->
      <a-alert
        message="当前班级信息"
        type="info"
        show-icon
        style="margin-bottom: 20px"
      >
        <template #description>
          <div style="margin-top: 8px">
            <div><strong>班级：</strong><a-tag :color="getLevelColor(currentClass.level)">{{ currentClass.level }}级</a-tag> {{ currentClass.name }}</div>
            <div style="margin-top: 8px">
              <strong>任务完成进度：</strong>
              <a-progress 
                :percent="currentClass.myCompletionRate" 
                :status="currentClass.myCompletionRate === 100 ? 'success' : 'exception'"
                style="max-width: 300px; display: inline-block; margin-left: 10px"
              />
              <span style="margin-left: 10px">{{ currentClass.completedTasks }}/{{ currentClass.totalTasks }} 个任务</span>
            </div>
          </div>
        </template>
      </a-alert>

      <!-- 任务未完成提示 -->
      <a-alert
        v-if="currentClass.myCompletionRate < 100"
        message="无法换班"
        :description="`您当前的任务完成率为 ${currentClass.myCompletionRate}%，需要完成当前班级 100% 的任务（${currentClass.totalTasks}个任务）才能申请换班。请继续努力完成任务！`"
        type="error"
        show-icon
        style="margin-bottom: 20px"
      />

      <!-- 可换班提示 -->
      <a-alert
        v-else
        message="恭喜！您已满足换班条件"
        description="您已完成当前班级的全部任务，可以选择同级或高一级的班级发起换班申请。"
        type="success"
        show-icon
        style="margin-bottom: 20px"
      />

      <!-- 可选班级列表 -->
      <a-divider>可选班级</a-divider>

      <div v-if="currentClass.myCompletionRate < 100" style="text-align: center; padding: 40px; color: #999">
        <a-empty description="完成当前班级全部任务后才能查看可换班级" />
      </div>

      <div v-else>
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
            <a-card 
              hoverable 
              class="class-card"
              :class="{ 'current-class': cls.id === currentClass.id }"
            >
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
                v-if="cls.id === currentClass.id"
                block 
                disabled
                style="margin-top: 12px"
              >
                当前班级
              </a-button>
              <a-button 
                v-else-if="!canChangeToClass(cls.level)"
                block 
                disabled
                style="margin-top: 12px"
              >
                等级过高
              </a-button>
              <a-button 
                v-else
                type="primary" 
                block 
                style="margin-top: 12px"
                @click="applyChangeClass(cls)"
              >
                申请换班
              </a-button>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </a-card>

    <!-- 换班申请确认弹窗 -->
    <a-modal
      v-model:open="changeModalVisible"
      title="确认换班申请"
      @ok="confirmChange"
      @cancel="changeModalVisible = false"
    >
      <p>您确定要申请换班到 <strong>{{ selectedClass?.name }}</strong> 吗？</p>
      <a-alert
        message="换班说明"
        type="warning"
        show-icon
        style="margin-top: 12px"
      >
        <template #description>
          <ul style="margin: 8px 0; padding-left: 20px">
            <li>提交后需要等待新班级老师审核</li>
            <li>审核通过后将自动离开当前班级</li>
            <li>换班后任务进度将重新计算</li>
          </ul>
        </template>
      </a-alert>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons-vue'

const router = useRouter()

// 选中的等级
const selectedLevel = ref('B')

// 当前班级信息（实际应从后端获取）
const currentClass = ref({
  id: 8,
  level: 'B',
  name: 'B2班',
  teacher: '张老师',
  studentCount: 45,
  avgCompletionRate: 82,
  myCompletionRate: 100, // 改为 100 可测试换班功能
  totalTasks: 100,
  completedTasks: 100
})

// 所有班级数据（实际应从后端获取）
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
  { id: 19, level: 'D', name: 'D1班', teacher: '王老师', studentCount: 32, avgCompletionRate: 70, totalTasks: 60 },
  { id: 20, level: 'D', name: 'D2班', teacher: '李老师', studentCount: 35, avgCompletionRate: 68, totalTasks: 60 },
  { id: 21, level: 'D', name: 'D3班', teacher: '张老师', studentCount: 30, avgCompletionRate: 72, totalTasks: 60 },
  { id: 22, level: 'D', name: 'D4班', teacher: '刘老师', studentCount: 33, avgCompletionRate: 69, totalTasks: 60 },
])

// 等级排序（A最高，D最低）
const levelOrder = { A: 4, B: 3, C: 2, D: 1 }

// 根据选中等级过滤班级
const filteredClasses = computed(() => {
  return allClasses.value.filter(cls => cls.level === selectedLevel.value)
})

// 判断是否可以换到该等级的班级（可以换同级、高一级、低级，但不能超过高一级）
const canChangeToClass = (classLevel) => {
  const currentLevelValue = levelOrder[currentClass.value.level]
  const targetLevelValue = levelOrder[classLevel]
  
  // 可以换到同级、低级、或高一级
  return targetLevelValue <= currentLevelValue + 1
}

// 可换班级列表（同级或高一级）- 保留用于兼容
const availableClasses = computed(() => {
  if (currentClass.value.myCompletionRate < 100) {
    return []
  }

  const levelOrder = ['D', 'C', 'B', 'A']
  const currentLevelIndex = levelOrder.indexOf(currentClass.value.level)
  
  return allClasses.value.filter(cls => {
    const clsLevelIndex = levelOrder.indexOf(cls.level)
    // 同级或高一级
    return clsLevelIndex >= currentLevelIndex && clsLevelIndex <= currentLevelIndex + 1
  })
})

// 班级等级颜色
const getLevelColor = (level) => {
  const colors = { A: 'red', B: 'orange', C: 'blue', D: 'green' }
  return colors[level] || 'default'
}

const getLevelColorHex = (level) => {
  const colors = { A: '#f5222d', B: '#fa8c16', C: '#1890ff', D: '#52c41a' }
  return colors[level] || '#666'
}

// 换班申请相关
const changeModalVisible = ref(false)
const selectedClass = ref(null)

const applyChangeClass = (cls) => {
  selectedClass.value = cls
  changeModalVisible.value = true
}

const confirmChange = () => {
  // 实际应调用后端API提交换班申请
  message.success(`已提交换班申请到 ${selectedClass.value.name}，请等待老师审核`)
  changeModalVisible.value = false
  
  // 可以选择返回我的班级页面
  setTimeout(() => {
    router.push('/student/my-class')
  }, 1500)
}

// 返回我的班级
const goToMyClass = () => {
  router.push('/student/my-class')
}
</script>

<style scoped>
.change-class-container {
  padding: 20px;
}

.class-card {
  text-align: center;
  transition: all 0.3s;
  position: relative;
}

.class-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.class-card.current-class {
  border: 2px solid #1890ff;
  background-color: #f0f5ff;
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

.class-level {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.class-info > div {
  margin: 6px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
