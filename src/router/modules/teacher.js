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
    }
  ]
}
