# English Study - 英语学习平台

基于 Vue 3 + Vite 构建的英语学习平台。

## ✨ 主要功能

- 📚 单词学习与训练
- 🎯 学习进度跟踪
- 📝 错题本管理
- 👥 班级管理
- 🔊 单词发音（英式/美式）

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

## 📁 项目结构

```
src/
├── pages/              # 页面组件
│   ├── admin/         # 管理员页面
│   ├── teacher/       # 教师页面
│   └── student/       # 学生页面
├── services/          # API 服务
│   ├── wordService.js      # 单词服务（模拟数据）
│   └── mockYoudao.js       # 模拟数据
├── router/            # 路由配置
└── components/        # 公共组件
```

## 🛠️ 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- Vite - 下一代前端构建工具
- Vue Router - 官方路由管理器
- Ant Design Vue - UI 组件库
- Axios - HTTP 客户端
- ECharts - 数据可视化

## 📝 开发说明

### 使用单词服务

```javascript
import { getStudentWordsWithDetails, searchWord } from '@/services/wordService'

// 获取学生单词列表
const words = await getStudentWordsWithDetails({ limit: 10 })

// 搜索单词
const result = await searchWord('hello')
if (result.success) {
  console.log(result.data)
  // 包含：音标、发音、释义、例句等
}
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 📄 许可证

MIT

## 🔗 相关链接

- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [Ant Design Vue](https://antdv.com/)

