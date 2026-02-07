<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider :width="200" style="background: #fff">
      <div class="logo">
        <h3>管理员端</h3>
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
        <h2 style="margin: 0;">管理员控制台</h2>
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
import { ref, onMounted, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import HomeOutlined from '@ant-design/icons-vue/HomeOutlined'

const router = useRouter()

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

// 菜单配置 - 使用计算属性确保响应式
const menuItems = [
  getItem('首页', 'home', HomeOutlined),
]

onMounted(() => {
  const info = localStorage.getItem('userInfo')
  if (info) {
    userInfo.value = JSON.parse(info)
  } else {
    router.push('/login')
  }
})

const handleMenuClick = ({ key }) => {
  if (key === 'home') {
    router.push('/admin/home')
  }
}

const logout = () => {
  localStorage.removeItem('userInfo')
  router.push('/login')
}
</script>

<style scoped>
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #faad14;
}

.logo h3 {
  color: #fff;
  margin: 0;
  font-size: 18px;
}
</style>
