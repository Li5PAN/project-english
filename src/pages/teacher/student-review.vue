<template>
  <div class="student-review-container">
    <a-tabs v-model:activeKey="activeTab" type="card" size="large">
      <!-- 入班申请 -->
      <a-tab-pane key="join" tab="入班申请">
        <a-table 
          :columns="joinColumns" 
          :data-source="joinApplications" 
          :pagination="{ pageSize: 10 }"
          :row-key="record => record.id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'className'">
              <a-tag :color="getLevelColor(record.classLevel)">
                {{ record.classLevel }}级
              </a-tag>
              <span>{{ record.className }}</span>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-button type="primary" size="small" @click="handleApprove(record, 'join')">
                  通过
                </a-button>
                <a-button danger size="small" @click="handleReject(record, 'join')">
                  拒绝
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-tab-pane>

      <!-- 换班申请 -->
      <a-tab-pane key="transfer" tab="换班申请">
        <a-table 
          :columns="transferColumns" 
          :data-source="transferApplications" 
          :pagination="{ pageSize: 10 }"
          :row-key="record => record.id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'fromClass'">
              <a-tag :color="getLevelColor(record.fromClassLevel)">
                {{ record.fromClassLevel }}级
              </a-tag>
              <span>{{ record.fromClassName }}</span>
            </template>
            <template v-else-if="column.key === 'toClass'">
              <a-tag :color="getLevelColor(record.toClassLevel)">
                {{ record.toClassLevel }}级
              </a-tag>
              <span>{{ record.toClassName }}</span>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-button type="primary" size="small" @click="handleApprove(record, 'transfer')">
                  通过
                </a-button>
                <a-button danger size="small" @click="handleReject(record, 'transfer')">
                  拒绝
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-tab-pane>

      <!-- 退班申请 -->
      <a-tab-pane key="quit" tab="退班申请">
        <a-table 
          :columns="quitColumns" 
          :data-source="quitApplications" 
          :pagination="{ pageSize: 10 }"
          :row-key="record => record.id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'className'">
              <a-tag :color="getLevelColor(record.classLevel)">
                {{ record.classLevel }}级
              </a-tag>
              <span>{{ record.className }}</span>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-button type="primary" size="small" @click="handleApprove(record, 'quit')">
                  通过
                </a-button>
                <a-button danger size="small" @click="handleReject(record, 'quit')">
                  拒绝
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'

// 当前激活的标签页
const activeTab = ref('join')

// 入班申请列表列定义
const joinColumns = [
  {
    title: '姓名',
    dataIndex: 'studentName',
    key: 'studentName',
    width: 120
  },
  {
    title: '申请进入班级',
    key: 'className',
    width: 200
  },
  {
    title: '发起申请时间',
    dataIndex: 'applyTime',
    key: 'applyTime',
    width: 180
  },
  {
    title: '申请理由',
    dataIndex: 'reason',
    key: 'reason',
    ellipsis: true
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right'
  }
]

// 换班申请列表列定义
const transferColumns = [
  {
    title: '姓名',
    dataIndex: 'studentName',
    key: 'studentName',
    width: 120
  },
  {
    title: '原班级',
    key: 'fromClass',
    width: 180
  },
  {
    title: '申请转入班级',
    key: 'toClass',
    width: 180
  },
  {
    title: '发起申请时间',
    dataIndex: 'applyTime',
    key: 'applyTime',
    width: 180
  },
  {
    title: '转换理由',
    dataIndex: 'reason',
    key: 'reason',
    ellipsis: true
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right'
  }
]

// 退班申请列表列定义
const quitColumns = [
  {
    title: '姓名',
    dataIndex: 'studentName',
    key: 'studentName',
    width: 120
  },
  {
    title: '退出班级',
    key: 'className',
    width: 200
  },
  {
    title: '发起申请时间',
    dataIndex: 'applyTime',
    key: 'applyTime',
    width: 180
  },
  {
    title: '申请理由',
    dataIndex: 'reason',
    key: 'reason',
    ellipsis: true
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right'
  }
]

// 入班申请数据
const joinApplications = ref([])

// 换班申请数据
const transferApplications = ref([])

// 退班申请数据
const quitApplications = ref([])

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

// 处理通过申请
const handleApprove = (record, type) => {
  const typeMap = {
    join: '入班',
    transfer: '换班',
    quit: '退班'
  }
  
  message.success(`已通过 ${record.studentName} 的${typeMap[type]}申请`)
  
  // 从列表中移除该申请
  if (type === 'join') {
    joinApplications.value = joinApplications.value.filter(item => item.id !== record.id)
  } else if (type === 'transfer') {
    transferApplications.value = transferApplications.value.filter(item => item.id !== record.id)
  } else if (type === 'quit') {
    quitApplications.value = quitApplications.value.filter(item => item.id !== record.id)
  }
}

// 处理拒绝申请
const handleReject = (record, type) => {
  const typeMap = {
    join: '入班',
    transfer: '换班',
    quit: '退班'
  }
  
  message.warning(`已拒绝 ${record.studentName} 的${typeMap[type]}申请`)
  
  // 从列表中移除该申请
  if (type === 'join') {
    joinApplications.value = joinApplications.value.filter(item => item.id !== record.id)
  } else if (type === 'transfer') {
    transferApplications.value = transferApplications.value.filter(item => item.id !== record.id)
  } else if (type === 'quit') {
    quitApplications.value = quitApplications.value.filter(item => item.id !== record.id)
  }
}

// 加载数据
const loadData = () => {
  // 模拟入班申请数据
  joinApplications.value = [
    {
      id: 1,
      studentName: '张三',
      className: '高级英语班',
      classLevel: 'A',
      applyTime: '2024-02-08 10:30',
      reason: '希望提升英语水平，加入高级班学习更多高级语法和词汇'
    },
    {
      id: 2,
      studentName: '李四',
      className: '中级英语班',
      classLevel: 'B',
      applyTime: '2024-02-08 11:20',
      reason: '想要系统学习英语，中级班的课程安排比较适合我'
    },
    {
      id: 3,
      studentName: '王五',
      className: '初级英语班',
      classLevel: 'C',
      applyTime: '2024-02-08 14:15',
      reason: '英语基础较弱，希望从初级班开始打好基础'
    }
  ]

  // 模拟换班申请数据
  transferApplications.value = [
    {
      id: 1,
      studentName: '赵六',
      fromClassName: '初级英语班',
      fromClassLevel: 'C',
      toClassName: '中级英语班',
      toClassLevel: 'B',
      applyTime: '2024-02-07 09:45',
      reason: '初级班的内容已经掌握得比较好，希望转入中级班继续学习'
    },
    {
      id: 2,
      studentName: '孙七',
      fromClassName: '中级英语班',
      fromClassLevel: 'B',
      toClassName: '高级英语班',
      toClassLevel: 'A',
      applyTime: '2024-02-07 16:30',
      reason: '中级班的学习进度较快，想挑战更高难度的课程'
    }
  ]

  // 模拟退班申请数据
  quitApplications.value = [
    {
      id: 1,
      studentName: '周八',
      className: '基础英语班',
      classLevel: 'D',
      applyTime: '2024-02-06 13:20',
      reason: '个人时间安排有冲突，暂时无法继续学习'
    },
    {
      id: 2,
      studentName: '吴九',
      className: '高级英语班',
      classLevel: 'A',
      applyTime: '2024-02-06 15:50',
      reason: '课程难度较大，学习压力过大，希望退班调整'
    }
  ]
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.student-review-container {
  padding: 0;
}

:deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab) {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
}

:deep(.ant-table) {
  margin-top: 16px;
}

:deep(.ant-tag) {
  margin-right: 8px;
}
</style>
