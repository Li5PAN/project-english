<template>
  <div class="user-management-container">
    <!-- 顶部筛选 -->
    <a-card style="margin-bottom: 16px;">
      <a-space :size="16">
        <span>身份筛选：</span>
        <a-select 
          v-model:value="roleFilter" 
          placeholder="请选择身份" 
          style="width: 200px"
          @change="handleFilterChange"
        >
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="teacher">老师</a-select-option>
          <a-select-option value="student">学生</a-select-option>
        </a-select>
      </a-space>
    </a-card>

    <!-- 人员表格 -->
    <a-card>
      <a-table 
        :columns="columns" 
        :data-source="filteredUserList" 
        :pagination="{ pageSize: 10 }"
        :row-key="record => record.id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'role'">
            <a-tag :color="getRoleColor(record.role)">
              {{ getRoleLabel(record.role) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showDetail(record)">
                详情
              </a-button>
              <a-button type="link" danger size="small" @click="handleDelete(record)">
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
      
      <!-- 空状态 -->
      <a-empty v-if="filteredUserList.length === 0" description="暂无人员数据" />
    </a-card>

    <!-- 详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="人员详情"
      :footer="null"
      width="600px"
    >
      <div v-if="selectedUser" class="user-detail">
        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="姓名">
            {{ selectedUser.name }}
          </a-descriptions-item>
          <a-descriptions-item label="账号">
            {{ selectedUser.username }}
          </a-descriptions-item>
          <a-descriptions-item label="身份">
            <a-tag :color="getRoleColor(selectedUser.role)">
              {{ getRoleLabel(selectedUser.role) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="当前班级">
            <span v-if="selectedUser.className">
              <a-tag :color="getLevelColor(selectedUser.classLevel)" size="small">
                {{ selectedUser.classLevel }}级
              </a-tag>
              {{ selectedUser.className }}
            </span>
            <span v-else style="color: #999;">暂无班级</span>
          </a-descriptions-item>
          <a-descriptions-item label="注册时间" v-if="selectedUser.registerTime">
            {{ selectedUser.registerTime }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'

// 身份筛选
const roleFilter = ref('')

// 人员列表
const userList = ref([])

// 详情弹窗
const detailModalVisible = ref(false)
const selectedUser = ref(null)

// 表格列定义
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 120
  },
  {
    title: '账号',
    dataIndex: 'username',
    key: 'username',
    width: 150
  },
  {
    title: '身份',
    dataIndex: 'role',
    key: 'role',
    width: 100
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right'
  }
]

// 筛选后的人员列表
const filteredUserList = computed(() => {
  if (!roleFilter.value) {
    return userList.value
  }
  return userList.value.filter(item => item.role === roleFilter.value)
})

// 获取身份颜色
const getRoleColor = (role) => {
  const colorMap = {
    teacher: 'green',
    student: 'blue',
    admin: 'orange'
  }
  return colorMap[role] || 'default'
}

// 获取身份标签
const getRoleLabel = (role) => {
  const labelMap = {
    teacher: '老师',
    student: '学生',
    admin: '管理员'
  }
  return labelMap[role] || '未知'
}

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

// 处理筛选变化
const handleFilterChange = () => {
  // 筛选逻辑已通过 computed 实现
}

// 显示详情
const showDetail = (record) => {
  selectedUser.value = record
  detailModalVisible.value = true
}

// 处理删除
const handleDelete = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定删除用户 "${record.name}" (${record.username}) 吗？此操作不可恢复。`,
    okText: '确认',
    cancelText: '取消',
    onOk() {
      userList.value = userList.value.filter(item => item.id !== record.id)
      message.success('删除成功')
    }
  })
}

// 加载数据
const loadData = () => {
  // 模拟人员数据
  userList.value = [
    // 老师
    {
      id: 1,
      name: '张老师',
      username: 'teacher_zhang',
      role: 'teacher',
      className: null,
      classLevel: null,
      registerTime: '2024-01-10 09:00'
    },
    {
      id: 2,
      name: '李老师',
      username: 'teacher_li',
      role: 'teacher',
      className: null,
      classLevel: null,
      registerTime: '2024-01-12 10:30'
    },
    {
      id: 3,
      name: '王老师',
      username: 'teacher_wang',
      role: 'teacher',
      className: null,
      classLevel: null,
      registerTime: '2024-01-15 14:20'
    },
    {
      id: 4,
      name: '赵老师',
      username: 'teacher_zhao',
      role: 'teacher',
      className: null,
      classLevel: null,
      registerTime: '2024-01-18 11:00'
    },
    // 学生
    {
      id: 101,
      name: '张三',
      username: 'student_zhangsan',
      role: 'student',
      className: '高级英语班',
      classLevel: 'A',
      registerTime: '2024-01-20 09:30'
    },
    {
      id: 102,
      name: '李四',
      username: 'student_lisi',
      role: 'student',
      className: '中级英语班',
      classLevel: 'B',
      registerTime: '2024-01-21 10:15'
    },
    {
      id: 103,
      name: '王五',
      username: 'student_wangwu',
      role: 'student',
      className: '初级英语班',
      classLevel: 'C',
      registerTime: '2024-01-22 14:30'
    },
    {
      id: 104,
      name: '赵六',
      username: 'student_zhaoliu',
      role: 'student',
      className: '基础英语班',
      classLevel: 'D',
      registerTime: '2024-01-23 11:20'
    },
    {
      id: 105,
      name: '孙七',
      username: 'student_sunqi',
      role: 'student',
      className: '高级英语班',
      classLevel: 'A',
      registerTime: '2024-01-24 15:45'
    },
    {
      id: 106,
      name: '周八',
      username: 'student_zhouba',
      role: 'student',
      className: null,
      classLevel: null,
      registerTime: '2024-01-25 09:00'
    },
    {
      id: 107,
      name: '吴九',
      username: 'student_wujiu',
      role: 'student',
      className: '中级英语班',
      classLevel: 'B',
      registerTime: '2024-01-26 10:30'
    },
    {
      id: 108,
      name: '郑十',
      username: 'student_zhengshi',
      role: 'student',
      className: '初级英语班',
      classLevel: 'C',
      registerTime: '2024-01-27 14:00'
    }
  ]
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.user-management-container {
  padding: 0;
}

.user-detail {
  padding: 16px 0;
}

:deep(.ant-table) {
  margin-top: 16px;
}

:deep(.ant-tag) {
  margin-right: 8px;
}
</style>
