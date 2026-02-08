// 学生端路由配置
export default {
  path: '/student',
  name: 'Student',
  component: () => import('../../pages/student/index.vue'),
  redirect: '/student/home',
  meta: {
    title: '学生端',
    requiresAuth: true,
    role: 'student'
  },
  children: [
    {
      path: 'home',
      name: 'StudentHome',
      component: () => import('../../pages/student/home.vue'),
      meta: {
        title: '首页',
        requiresAuth: true,
        role: 'student'
      }
    },
    {
      path: 'word-learn',
      name: 'WordLearn',
      component: () => import('../../pages/student/word-learn.vue'),
      meta: {
        title: '单词学习',
        requiresAuth: true,
        role: 'student'
      }
    },
    {
      path: 'my-errors',
      name: 'MyErrors',
      component: () => import('../../pages/student/my-errors.vue'),
      meta: {
        title: '我的错题',
        requiresAuth: true,
        role: 'student'
      }
    },
    {
      path: 'my-class',
      name: 'MyClass',
      component: () => import('../../pages/student/my-class.vue'),
      meta: {
        title: '我的班级',
        requiresAuth: true,
        role: 'student'
      }
    },
    {
      path: 'my-tasks',
      name: 'MyTasks',
      component: () => import('../../pages/student/my-tasks.vue'),
      meta: {
        title: '我的任务',
        requiresAuth: true,
        role: 'student'
      }
    },
    {
      path: 'my-progress',
      name: 'MyProgress',
      component: () => import('../../pages/student/my-progress.vue'),
      meta: {
        title: '我的学情',
        requiresAuth: true,
        role: 'student'
      }
    }
  ]
}
