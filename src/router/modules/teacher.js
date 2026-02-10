// 教师端路由配置
export default {
  path: '/teacher',
  name: 'Teacher',
  component: () => import('../../pages/teacher/index.vue'),
  redirect: '/teacher/home',
  meta: {
    title: '教师端',
    requiresAuth: true,
    role: 'teacher'
  },
  children: [
    {
      path: 'home',
      name: 'TeacherHome',
      component: () => import('../../pages/teacher/home.vue'),
      meta: {
        title: '首页',
        requiresAuth: true,
        role: 'teacher'
      }
    },
    {
      path: 'my-classes',
      name: 'MyClasses',
      component: () => import('../../pages/teacher/my-classes.vue'),
      meta: {
        title: '我的班级',
        requiresAuth: true,
        role: 'teacher'
      }
    },
    {
      path: 'student-review',
      name: 'StudentReview',
      component: () => import('../../pages/teacher/student-review.vue'),
      meta: {
        title: '学生审核',
        requiresAuth: true,
        role: 'teacher'
      }
    },
    {
      path: 'task-management',
      name: 'TaskManagement',
      component: () => import('../../pages/teacher/task-management.vue'),
      meta: {
        title: '任务管理',
        requiresAuth: true,
        role: 'teacher'
      }
    },
    {
      path: 'error-management',
      name: 'ErrorManagement',
      component: () => import('../../pages/teacher/error-management.vue'),
      meta: {
        title: '错题管理',
        requiresAuth: true,
        role: 'teacher'
      }
    },
    {
      path: 'class-data',
      name: 'ClassData',
      component: () => import('../../pages/teacher/class-data.vue'),
      meta: {
        title: '班级数据',
        requiresAuth: true,
        role: 'teacher'
      }
    }
  ]
}
