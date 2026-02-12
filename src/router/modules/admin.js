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
    },
    {
      path: 'class-management',
      name: 'ClassManagement',
      component: () => import('../../pages/admin/class-management.vue'),
      meta: {
        title: '班级管理',
        requiresAuth: true,
        role: 'admin'
      }
    },
    {
      path: 'user-management',
      name: 'UserManagement',
      component: () => import('../../pages/admin/user-management.vue'),
      meta: {
        title: '人员管理',
        requiresAuth: true,
        role: 'admin'
      }
    }
  ]
}
