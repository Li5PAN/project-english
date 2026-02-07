// 管理员端路由配置
export default {
  path: '/admin',
  name: 'Admin',
  component: () => import('../../pages/admin/index.vue'),
  redirect: '/admin/home',
  meta: {
    title: '管理员端',
    requiresAuth: true,
    role: 'admin'
  },
  children: [
    {
      path: 'home',
      name: 'AdminHome',
      component: () => import('../../pages/admin/home.vue'),
      meta: {
        title: '首页',
        requiresAuth: true,
        role: 'admin'
      }
    }
  ]
}
