import AdminPage from '@/view/admin/layout'
import ClientPage from '@/view/client/layout'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
  // 登录
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/view/login')
  },
  // 前台
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: ClientPage,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true
        },
        component: () => import('@/view/client/home/index.vue')
      },
    ]
  },
  
  {
    path: '/c',
    name: 'client',
    component: ClientPage,
    meta:{
      hideInMenu: true,
      icon:'ios-cog'
    },
    children:[
      { path:'my', name:'my', meta: { icon: 'md-bookmarks',title: '我的资料',access: ['client:my'] }, component: () => import('@/view/client/my/index') },
      { path:'credits', name:'credits', meta: { icon: 'md-bookmarks',title: '我的学分',access: ['client:credits'] }, component: () => import('@/view/client/credits/index') },
      { path:'activities', name:'activities', meta: { icon: 'md-bookmarks',title: '我的活动',access: ['client:activities'] }, component: () => import('@/view/client/activity/index') },
      { path:'auth',  name:'auth', meta: { icon: 'md-bookmarks',title: '学生认证',access: ['client:auth'] }, component: () => import('@/view/client/auth/index') },
      { path:'detail/:id',  name:'detail', meta: { icon: 'md-bookmarks',title: '活动详情',access: ['client:detail'] }, component: () => import('@/view/client/activity/detail.vue') }
    ]
  },
  // 后台
  {
    path: '/admin',
    redirect: '/admin/activity',
    name: 'act',
    component: AdminPage,
    meta: {
      title: '活动管理',
      icon:'ios-cog',
      access: ['activity']
    },
    children:[
      { 
        path: 'activity',
        name: 'activity_manage',
        meta:{
          icon: 'ios-contacts-outline', 
          title: '活动管理',
          access: ['activity:list']
        }, 
        component: () => import('@/view/admin/activity/acti/manage.vue') 
      },
      { 
        path: 'signup',
        name: 'activity_signup',
        meta:{
          icon: 'ios-contacts-outline', 
          title: '报名管理',
          access: ['activity:signup']
        }, 
        component: () => import('@/view/admin/activity/signup/index.vue') 
      },
      { 
        path: 'checkin',
        name: 'activity_checkin', 
        meta:{
          icon: 'ios-contacts-outline', 
          title: '签到管理',
          access: ['activity:checkin']
        }, 
        component: () => import('@/view/admin/activity/checkin/index.vue') 
      },
      { 
        path: 'score/:id',
        name: 'activity_score', 
        meta:{
          icon: 'ios-contacts-outline', 
          title: '学分管理',
          access: ['activity:score']
        }, 
        component: () => import('@/view/admin/activity/score/index.vue') 
      },
      { 
        path: 'cancel',
        name: 'activity_cancel', 
        meta:{
          icon: 'ios-contacts-outline', 
          title: '回收站',
          access: ['activity:list']
        }, 
        component: () => import('@/view/admin/activity/acti/cancel.vue') 
      }
    ]
  },
  {
    path: '/admin/student',
    name: 'stu',
    component: AdminPage,
    meta: {
      title: '学生信息管理',
      icon:'ios-cog',
      access: ['student']
    },
    children:[
      { 
        path: '/',
        name: 'student_manage', 
        meta:{
          icon: 'ios-contacts-outline', 
          title: '学生管理',
          access: ['student:manage']
        }, 
        component: () => import('@/view/admin/student/index.vue') 
      },
      { 
        path: 'group',
        name: 'student_group', 
        meta:{
          icon: 'ios-contacts-outline', 
          title: '分组管理',
          access: ['student:group']
        }, 
        component: () => import('@/view/admin/student/group.vue') 
      },
      { 
        path: 'auth',
        name: 'student_auth', 
        meta:{
          icon: 'ios-contacts-outline', 
          title: '学生认证',
          access: ['student:auth']
        }, 
        component: () => import('@/view/admin/student/auth.vue') 
      }
    ]
  },
  {
    path: '/admin/apartment',
    name: 'apar',
    component: AdminPage,
    meta: {
      title: '部门管理',
      icon:'ios-cog',
      access: ['apartment']
    },
    children:[
      { 
        path: 'index',
        name: 'apartment_index', 
        meta:{
          icon: 'ios-contacts-outline', 
          title: '部门主页',
          access: ['apartment:index']
        }, 
        component: () => import('@/view/admin/apartment/index.vue') 
      },
      { 
        path: '/',
        name: 'apartment_manage', 
        meta:{
          icon: 'ios-contacts-outline', 
          title: '部门管理',
          access: ['apartment:manage']
        }, 
        component: () => import('@/view/admin/apartment/manage.vue') 
      },
      { 
        path: 'member',
        name: 'apartment_member', 
        meta:{
          icon: 'ios-contacts-outline', 
          title: '成员管理',
          access: ['apartment:member']
        }, 
        component: () => import('@/view/admin/apartment/member.vue') 
      },
      { 
        path: 'group',
        name: 'apartment_group', 
        meta:{
          icon: 'ios-contacts-outline', 
          title: '分组管理',
          access: ['apartment:group']
        }, 
        component: () => import('@/view/admin/apartment/group.vue') 
      }
      
    ]
  },
  {
    path: '/system',
    name: 'doc',
    component: AdminPage,
    meta: {
      title: '系统设置',
      icon:'ios-cog',
      access: ['system']
    },
    children:[
      { path: 'user',meta:{icon: 'md-people', title: '用户管理',access: ['system:user:list']}, name: 'system_user', component: () => import('@/view/admin/system/user') },
      { path: 'person-stalker',meta:{icon: 'md-body',title: '角色管理',}, name: 'system_role', component: () => import('@/view/system/role') },
      { path: 'resource',meta:{icon: 'ios-lock',title: '资源管理',access: ['system:resource:list']}, name: 'system_resource', component: () => import('@/view/admin/system/resource') },
      { path: 'log',meta:{icon: 'ios-aperture',title: '系统日志',access: ['system:log:list']}, name: 'system_log', component: () => import('@/view/system/log') },
      { path: 'dictionary',meta:{icon: 'md-bookmarks',title: '字典定义',access: ['system:dictionary:list']}, name: 'system_dictionary', component: () => import('@/view/admin/system/dictionary') },      
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/common/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/common/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/common/error-page/404.vue')
  }
]
