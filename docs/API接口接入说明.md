# API 接口接入说明

## 一、接口配置

### 1.1 环境配置

后端接口地址配置在 `.env.development` 文件中：

```env
VITE_PROXY_DOMAIN_REAL = "http://106.52.154.12:58080"
```

### 1.2 请求封装

所有 API 请求通过 `src/utils/request.js` 统一封装，基于 axios 实现：

- 自动添加 Authorization 请求头（从 localStorage 读取 token）
- 统一处理响应错误（401 自动跳转登录、其他错误显示提示）
- 统一超时时间：15 秒

## 二、登录接口实现

### 2.1 接口流程

```
1. 用户输入账号、密码
2. 提交表单 → 调用 /login 接口
3. 登录成功 → 保存 token 和用户信息
4. 根据用户角色跳转到对应页面
```

### 2.2 登录接口

**接口地址：** `POST /login`

**请求参数：**
```json
{
  "username": "string",  // 用户名
  "password": "string"   // 密码
}
```

**响应格式示例：**
```json
{
  "code": 200,
  "msg": "操作成功",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "data": {
    "userId": 1,
    "username": "student",
    "nickName": "学生",
    "role": "student"
  }
}
```

**前端实现：**
```javascript
import { login } from '@/api/auth'

const handleLogin = async () => {
  const res = await login({
    username: loginForm.value.username,
    password: loginForm.value.password
  })
  
  // 保存 token
  if (res.token) {
    localStorage.setItem('token', res.token)
  }
  
  // 保存用户信息
  const userInfo = res.data || res.user || res
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
  
  // 根据角色跳转
  const role = userInfo.role || userInfo.roles?.[0]
  if (role === 'student') {
    router.push('/student')
  } else if (role === 'teacher') {
    router.push('/teacher')
  } else if (role === 'admin') {
    router.push('/admin')
  }
}
```

### 2.3 角色映射

根据后端返回的角色字段，前端进行路由跳转：

| 后端角色值 | 前端路由 | 说明 |
|-----------|---------|------|
| `student` / `STUDENT` / `0` | `/student` | 学生端 |
| `teacher` / `TEACHER` / `1` | `/teacher` | 教师端 |
| `admin` / `ADMIN` / `2` | `/admin` | 管理员端 |

**注意：** 请根据后端实际返回的角色字段名称和值进行调整。

### 2.4 退出登录接口

**接口地址：** `POST /logout`

**请求头：**
```
Authorization: Bearer {token}
```

**响应格式：**
```json
{
  "code": 200,
  "msg": "退出成功"
}
```

**前端实现：**
```javascript
import { logout } from '@/api/auth'

const handleLogout = async () => {
  await logout()
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  router.push('/login')
}
```

## 三、错误处理

### 3.1 HTTP 状态码处理

| 状态码 | 说明 | 处理方式 |
|--------|------|----------|
| 401 | 未授权 | 清除本地存储，跳转登录页 |
| 403 | 拒绝访问 | 提示"拒绝访问" |
| 404 | 资源不存在 | 提示"请求的资源不存在" |
| 500 | 服务器错误 | 提示"服务器内部错误" |
| 502 | 网关错误 | 提示"网关错误" |
| 503 | 服务不可用 | 提示"服务不可用" |
| 504 | 网关超时 | 提示"网关超时" |

### 3.2 业务错误处理

后端返回的业务错误通过 `code` 字段判断：

```javascript
if (res.code === 200) {
  // 成功
} else {
  // 失败，显示 res.msg 或 res.message
  message.error(res.msg || res.message || '操作失败')
}
```

### 3.3 响应数据格式适配

由于不同后端可能返回不同的数据格式，前端代码中做了兼容处理：

```javascript
// 适配不同的响应格式
const userInfo = res.data || res.user || res
const role = userInfo.role || userInfo.roles?.[0] || userInfo.userType
```

**常见的响应格式：**

格式1：
```json
{
  "code": 200,
  "data": { "userId": 1, "role": "student" }
}
```

格式2：
```json
{
  "code": 200,
  "user": { "userId": 1, "role": "student" }
}
```

格式3：
```json
{
  "code": 200,
  "userId": 1,
  "role": "student"
}
```

## 四、本地存储

### 4.1 Token 存储

```javascript
// 保存
localStorage.setItem('token', token)

// 读取
const token = localStorage.getItem('token')

// 删除
localStorage.removeItem('token')
```

### 4.2 用户信息存储

```javascript
// 保存
localStorage.setItem('userInfo', JSON.stringify(userInfo))

// 读取
const userInfo = JSON.parse(localStorage.getItem('userInfo'))

// 删除
localStorage.removeItem('userInfo')
```

## 五、使用示例

### 5.1 在组件中调用 API

```vue
<script setup>
import { ref } from 'vue'
import { login } from '@/api/auth'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loginForm = ref({
  username: '',
  password: ''
})
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  
  try {
    const res = await login(loginForm.value)
    
    // 保存 token
    if (res.token) {
      localStorage.setItem('token', res.token)
    }
    
    // 保存用户信息
    const userInfo = res.data || res.user || res
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    
    message.success('登录成功')
    
    // 根据角色跳转
    const role = userInfo.role || userInfo.roles?.[0]
    if (role === 'student') {
      router.push('/student')
    } else if (role === 'teacher') {
      router.push('/teacher')
    } else if (role === 'admin') {
      router.push('/admin')
    }
  } catch (error) {
    console.error('登录失败:', error)
    message.error(error.response?.data?.msg || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>
```

### 5.2 创建新的 API 模块

参考 `src/api/auth.js` 的结构，创建其他业务模块的 API：

```javascript
// src/api/student.js
import request from '@/utils/request'

export function getMyTasks() {
  return request({
    url: '/student/tasks',
    method: 'get'
  })
}

export function getMyErrors() {
  return request({
    url: '/student/errors',
    method: 'get'
  })
}

export function submitTask(data) {
  return request({
    url: '/student/task/submit',
    method: 'post',
    data
  })
}
```

## 六、注意事项

1. **自动携带 token**：所有需要认证的接口都会自动携带 token，无需手动添加
2. **自动跳转登录**：token 过期（401）会自动跳转到登录页
3. **自动错误提示**：接口调用失败会自动显示错误提示
4. **响应格式适配**：代码中已做多种响应格式的兼容处理
5. **角色值适配**：支持多种角色值格式（字符串、数字、大小写）
6. **开发调试**：开发环境下可以在浏览器控制台查看请求详情

## 七、调试技巧

### 7.1 查看请求详情

打开浏览器开发者工具 → Network 标签页，可以看到所有请求的详细信息。

### 7.2 查看响应数据

在浏览器控制台中查看实际的响应数据格式：

```javascript
// 在 handleLogin 函数中添加
console.log('登录响应:', res)
console.log('用户信息:', userInfo)
console.log('角色:', role)
```

### 7.3 跨域问题

如果遇到跨域问题，需要在 `vite.config.js` 中配置代理：

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://106.52.154.12:58080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### 7.4 模拟后端响应

在开发阶段，如果需要模拟后端响应，可以修改 `request.js`：

```javascript
// 在请求拦截器中添加
if (import.meta.env.DEV && config.url === '/login') {
  return Promise.resolve({
    data: {
      code: 200,
      token: 'mock-token-123456',
      data: {
        userId: 1,
        username: 'student',
        role: 'student'
      }
    }
  })
}
```

## 八、后续接口接入

后续接入其他接口时，按照以下步骤：

1. 在 `src/api/` 目录下创建对应的 API 文件（如 `student.js`、`teacher.js`）
2. 使用 `request` 方法封装接口调用
3. 在组件中导入并使用
4. 根据实际响应格式调整数据处理逻辑

**示例：**

```javascript
// src/api/student.js
import request from '@/utils/request'

export function getWordList(params) {
  return request({
    url: '/student/words',
    method: 'get',
    params
  })
}
```

```vue
// 在组件中使用
<script setup>
import { getWordList } from '@/api/student'

const fetchWords = async () => {
  const res = await getWordList({ page: 1, size: 10 })
  console.log('单词列表:', res.data)
}
</script>
```
