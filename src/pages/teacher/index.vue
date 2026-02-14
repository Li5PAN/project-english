<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider :width="200" style="background: #fff">
      <div class="logo">
        <h3>教师端</h3>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        theme="light"
        :items="menuItems"
        @click="handleMenuClick"
      />
    </a-layout-sider>
    
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 24px; display: flex; justify-content: space-between; align-items: center;">
        <h2 style="margin: 0;">{{ pageTitle }}</h2>
        <div style="display: flex; align-items: center; gap: 16px;">
          <span>欢迎，{{ userInfo.name || userInfo.username }}</span>
          <a-button type="primary" danger @click="logout">退出登录</a-button>
        </div>
      </a-layout-header>
      
      <a-layout-content style="margin: 16px; padding: 24px; background: #fff; min-height: 280px;">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, onMounted, shallowRef, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HomeOutlined from '@ant-design/icons-vue/HomeOutlined'
import TeamOutlined from '@ant-design/icons-vue/TeamOutlined'
import UserAddOutlined from '@ant-design/icons-vue/UserAddOutlined'
import CarryOutOutlined from '@ant-design/icons-vue/CarryOutOutlined'
import FileTextOutlined from '@ant-design/icons-vue/FileTextOutlined'
import BarChartOutlined from '@ant-design/icons-vue/BarChartOutlined'

const router = useRouter()
const route = useRoute()

const selectedKeys = ref(['home'])
const userInfo = ref({})

// 菜单项配置函数
function getItem(label, key, icon, children) {
  return {
    key,
    icon: icon ? shallowRef(icon) : undefined,
    children,
    label,
  }
}

// 菜单配置
const menuItems = [
  getItem('首页', 'home', HomeOutlined),
  getItem('我的班级', 'my-classes', TeamOutlined),
  getItem('学生审核', 'student-review', UserAddOutlined),
  getItem('任务管理', 'task-management', CarryOutOutlined),
  getItem('错题管理', 'error-management', FileTextOutlined),
  getItem('班级数据', 'class-data', BarChartOutlined),
]

const menuTitles = {
  home: '首页',
  'my-classes': '我的班级',
  'student-review': '学生审核',
  'task-management': '任务管理',
  'error-management': '错题管理',
  'class-data': '班级数据'
}

const pageTitle = computed(() => {
  return menuTitles[selectedKeys.value[0]] || '教师工作台'
})

onMounted(() => {
  const info = localStorage.getItem('userInfo')
  if (info) {
    userInfo.value = JSON.parse(info)
  } else {
    router.push('/login')
  }
  
  // 根据当前路由设置选中的菜单
  const path = route.path
  if (path.includes('my-classes')) {
    selectedKeys.value = ['my-classes']
  } else if (path.includes('student-review')) {
    selectedKeys.value = ['student-review']
  } else if (path.includes('task-management')) {
    selectedKeys.value = ['task-management']
  } else if (path.includes('error-management')) {
    selectedKeys.value = ['error-management']
  } else if (path.includes('class-data')) {
    selectedKeys.value = ['class-data']
  } else {
    selectedKeys.value = ['home']
  }
})

const handleMenuClick = ({ key }) => {
  const routes = {
    home: '/teacher/home',
    'my-classes': '/teacher/my-classes',
    'student-review': '/teacher/student-review',
    'task-management': '/teacher/task-management',
    'error-management': '/teacher/error-management',
    'class-data': '/teacher/class-data'
  }
  
  if (routes[key]) {
    router.push(routes[key])
  }
}

const logout = () => {
  localStorage.removeItem('userInfo')
  // 使用 replace 替代 push，避免可以返回
  router.replace('/login').then(() => {
    // 确保跳转完成后刷新页面状态
    window.location.reload()
  })
}
</script>

<style scoped src="./index.css"></style>
