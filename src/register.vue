<template>
  <div class="register-container">
    <div class="register-box">
      <h2>用户注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>账号</label>
          <input 
            v-model="registerForm.username" 
            type="text" 
            placeholder="请输入账号"
            required
          />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input 
            v-model="registerForm.password" 
            type="password" 
            placeholder="请输入密码"
            required
          />
        </div>
        <div class="form-group">
          <label>昵称</label>
          <input 
            v-model="registerForm.nickname" 
            type="text" 
            placeholder="请输入昵称"
            required
          />
        </div>
        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
        <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>
        <button type="submit" class="btn-register">注册</button>
        <button type="button" class="btn-back" @click="goToLogin">返回登录</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const registerForm = ref({
  username: '',
  password: '',
  nickname: ''
})

const errorMsg = ref('')
const successMsg = ref('')

const handleRegister = () => {
  errorMsg.value = ''
  successMsg.value = ''
  
  const { username, password, nickname } = registerForm.value
  
  if (!username || !password || !nickname) {
    errorMsg.value = '请填写完整信息'
    return
  }
  
  if (username.length < 3) {
    errorMsg.value = '账号长度至少3个字符'
    return
  }
  
  if (password.length < 6) {
    errorMsg.value = '密码长度至少6个字符'
    return
  }
  
  // 模拟注册成功
  successMsg.value = '注册成功！2秒后跳转到登录页...'
  
  // 保存注册信息到 localStorage（实际项目中应该发送到后端）
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
  registeredUsers.push({
    username,
    password,
    nickname,
    role: 'student' // 默认注册为学生角色
  })
  localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
  
  // 2秒后跳转到登录页
  setTimeout(() => {
    router.push('/login')
  }, 2000)
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

.error-msg {
  color: #f56c6c;
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
}

.success-msg {
  color: #67c23a;
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-register {
  background: #667eea;
  color: white;
  margin-bottom: 10px;
}

.btn-register:hover {
  background: #5568d3;
}

.btn-back {
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
}

.btn-back:hover {
  background: #f5f7ff;
}
</style>
