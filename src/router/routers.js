import Main from '@/view/main'

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
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/view/login')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
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
        component: () => import('@/view/home/index')
      }
    ]
  },
  {
    path: '/app/activity',
    name: 'act',
    component: Main,
    meta: {
      title: '活动管理',
      icon:'ios-cog'
    },
    children:[
      { 
        path: 'manage',
        meta:{
          icon: 'ios-contacts-outline', 
          title: '活动管理',
          access: ['activity:list']
        }, 
        name: 'activity_manage', component: () => import('@/view/app/activity/activity/manage.vue') 
      },
      { 
        path: 'signup',
        meta:{
          icon: 'ios-contacts-outline', 
          title: '报名管理',
          access: ['activity:signup']
        }, 
        name: 'activity_signup', component: () => import('@/view/app/activity/signup/index.vue') 
      },
      { 
        path: 'checkin',
        meta:{
          icon: 'ios-contacts-outline', 
          title: '签到管理',
          access: ['activity:checkin']
        }, 
        name: 'activity_checkin', component: () => import('@/view/app/activity/checkin/index.vue') 
      },
      { 
        path: 'score',
        meta:{
          icon: 'ios-contacts-outline', 
          title: '学分管理',
          access: ['activity:score']
        }, 
        name: 'activity_score', component: () => import('@/view/app/activity/score/index.vue') 
      },
      { 
        path: 'cancel',
        meta:{
          icon: 'ios-contacts-outline', 
          title: '回收站',
          access: ['activity:list']
        }, 
        name: 'activity_cancel', component: () => import('@/view/app/activity/activity/cancel.vue') 
      }
    ]
  },
  {
    path: '/app/student',
    name: 'stu',
    component: Main,
    meta: {
      title: '学生信息管理',
      icon:'ios-cog'
    },
    children:[
      { 
        path: 'manage',
        meta:{
          icon: 'ios-contacts-outline', 
          title: '学生管理',
          access: ['student:manage']
        }, 
        name: 'student_manage', component: () => import('@/view/app/student/index.vue') 
      },
      { 
        path: 'group',
        meta:{
          icon: 'ios-contacts-outline', 
          title: '分组管理',
          access: ['student:group']
        }, 
        name: 'student_group', component: () => import('@/view/app/student/group.vue') 
      },
      { 
        path: 'auth',
        meta:{
          icon: 'ios-contacts-outline', 
          title: '学生认证',
          access: ['student:auth']
        }, 
        name: 'student_auth', component: () => import('@/view/app/student/auth.vue') 
      }
    ]
  },
  {
    path: '/app/apartment',
    name: 'apar',
    component: Main,
    meta: {
      title: '部门管理',
      icon:'ios-cog'
    },
    children:[
      { 
        path: '/index',
        meta:{
          icon: 'ios-contacts-outline', 
          title: '部门主页',
          access: ['apartment:index']
        }, 
        name: 'apartment_index', component: () => import('@/view/app/apartment/index.vue') 
      },
      { 
        path: '/manage',
        meta:{
          icon: 'ios-contacts-outline', 
          title: '部门管理',
          access: ['apartment:manage']
        }, 
        name: 'apartment_manage', component: () => import('@/view/app/apartment/manage.vue') 
      },
      { 
        path: 'member',
        meta:{
          icon: 'ios-contacts-outline', 
          title: '成员管理',
          access: ['apartment:member']
        }, 
        name: 'apartment_member', component: () => import('@/view/app/apartment/member.vue') 
      },
      { 
        path: 'group',
        meta:{
          icon: 'ios-contacts-outline', 
          title: '分组管理',
          access: ['apartment:group']
        }, 
        name: 'apartment_group', component: () => import('@/view/app/apartment/group.vue') 
      }
      
    ]
  },
  {
    path: '/system',
    name: 'doc',
    component: Main,
    meta: {
      title: '系统设置',
      icon:'ios-cog'
    },
    children:[
      { path: 'user',meta:{icon: 'md-people', title: '用户管理',access: ['system:user:list']}, name: 'system_user', component: () => import('@/view/system/user') },
      { path: 'person-stalker',meta:{icon: 'md-body',title: '角色管理',}, name: 'system_role', component: () => import('@/view/system/role') },
      { path: 'resource',meta:{icon: 'ios-lock',title: '资源管理',access: ['system:resource:list']}, name: 'system_resource', component: () => import('@/view/system/resource') },
      { path: 'log',meta:{icon: 'ios-aperture',title: '系统日志',access: ['system:log:list']}, name: 'system_log', component: () => import('@/view/system/log') },
      { path: 'dictionary',meta:{icon: 'md-bookmarks',title: '字典定义',access: ['system:dictionary:list']}, name: 'system_dictionary', component: () => import('@/view/system/dictionary') },      
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
