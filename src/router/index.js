import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
// 系统管理
  {
    path: '/system',
    component: Layout,
    name: 'system',
    redirect: '/system/area-code',
    meta: {
      title: 'systemManage',
      icon: 'nested',
      id: '1'
    },
    alwaysShow: true,
    children: [
      {
        path: 'area-code',
        component: () => import('@/views/system/areaCode'),
        name: 'areaCodeManage',
        meta: { title: 'areaCodeManage', id: '1-1' }
      },
      {
        path: '/system/currency',
        component: () => import('@/views/system/currency/index'),
        name: 'currency',
        redirect: '/system/currency/push-draw',
        meta: { title: 'currencyManage', id: '1-2' },
        alwaysShow: true,
        children: [
          {
            path: 'push-draw',
            component: () => import('@/views/system/currency/pushDraw'),
            name: 'pushDraw',
            meta: { title: 'pushDrawManage', id: '1-2-1' }
          },
          {
            path: 'rate',
            component: () => import('@/views/system/rate'),
            name: 'rate',
            meta: { title: 'rateManage', id: '1-2-2' }
          },
          {
            path: 'deal',
            component: () => import('@/views/system/currency/deal'),
            name: 'dealManage',
            meta: { title: 'dealManage', id: '1-2-3' }
          }
        ]
      }
    ]
  },
  // 客户管理
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/info',
    name: 'customerManage',
    meta: {
      title: 'customerManage',
      icon: 'excel',
      id: '2'
    },
    alwaysShow: true,
    children: [
      {
        path: '/customer/templates',
        component: () => import('@/views/customer/templates/index'),
        name: 'templates',
        redirect: '/customer/templates/coin',
        meta: { title: 'templatesSet', id: '2-1' },
        alwaysShow: true,
        children: [
          {
            path: 'coin',
            component: () => import('@/views/customer/templates/coin'),
            name: 'coinTemplate',
            meta: { title: 'coinTemplate', id: '2-1-1' }
          },
          {
            path: 'coin-detail',
            component: () => import('@/views/customer/templates/coinDetail'),
            name: 'coinTemplateDetail',
            hidden: true,
            meta: { title: 'coinTemplateDetail', id: '2-1-1' }
          },
          {
            path: 'otc',
            component: () => import('@/views/customer/templates/otc'),
            name: 'otcTemplate',
            meta: { title: 'otcTemplate', id: '2-1-3' }
          },
          {
            path: 'otc-detail',
            component: () => import('@/views/customer/templates/otcDetail'),
            name: 'otcTemplateDetail',
            hidden: true,
            meta: { title: 'otcTemplateDetail', id: '2-1-3' }
          },
          {
            path: 'market-coin',
            component: () => import('@/views/customer/templates/marketCoin'),
            name: 'marketCoinTemplate',
            meta: { title: 'marketCoinTemplate', id: '2-1-5' }
          },
          {
            path: 'market-coin-detail',
            component: () => import('@/views/customer/templates/marketCoinDetail'),
            name: 'marketCoinTemplateDetail',
            hidden: true,
            meta: { title: 'marketCoinTemplateDetail', id: '2-1-5' }
          }
        ]
      },
      {
        path: '/customer/params',
        component: () => import('@/views/customer/params/index'),
        name: 'params',
        redirect: '/customer/params/customer-level',
        meta: { title: 'paramsSet', id: '2-2' },
        alwaysShow: true,
        children: [
          {
            path: 'customer-level',
            component: () => import('@/views/customer/params/customerLevel'),
            name: 'customerLevel',
            meta: { title: 'customerLevel', id: '2-2-1' }
          },
          {
            path: 'merchant-level',
            component: () => import('@/views/customer/params/merchantLevel'),
            name: 'merchantLevel',
            meta: { title: 'merchantLevel', id: '2-2-2' }
          },
          {
            path: 'agent-level',
            component: () => import('@/views/customer/params/agentLevel'),
            name: 'agentLevel',
            meta: { title: 'agentLevel', id: '2-2-3' }
          }
        ]
      },
      {
        path: 'info',
        component: () => import('@/views/customer/info'),
        name: 'info',
        meta: { title: 'customerInfoManage', id: '2-3' }
      },
      {
        path: '/customer/merchant-deposit',
        component: () => import('@/views/customer/merchantDeposit/index'),
        name: 'merchantDeposit',
        redirect: '/customer/merchant-deposit/merchant-deposit-detail',
        meta: { title: 'merchantDepositManage', id: '2-4' },
        alwaysShow: true,
        children: [
          {
            path: 'merchant-deposit-detail',
            component: () => import('@/views/customer/merchantDeposit/merchantDeposit'),
            name: 'merchantDepositManageDetail',
            meta: { title: 'merchantDepositManageDetail', id: '2-4-1' }
          },
          {
            path: 'merchant-deposit-done',
            component: () => import('@/views/customer/merchantDeposit/merchantDepositDone'),
            name: 'merchantDepositManageDone',
            meta: { title: 'merchantDepositManageDone', id: '2-4-2' }
          }
        ]
      },
      {
        path: 'recharge-address',
        component: () => import('@/views/customer/rechargeAddress'),
        name: 'rechargeAddress',
        meta: { title: 'rechargeAddress', id: '2-5' }
      }
    ]
  },
  // 事务管理
  {
    path: '/audit',
    component: Layout,
    redirect: '/audit/customer',
    name: 'audit',
    meta: {
      title: 'auditManage',
      icon: 'documentation',
      id: '3'
    },
    alwaysShow: true,
    children: [
      {
        path: 'customer',
        component: () => import('@/views/audit/customer'),
        name: 'customerAuth',
        meta: { title: 'customerAuth', id: '3-1' }
      },
      {
        path: 'withdraw',
        component: () => import('@/views/audit/withdraw'),
        name: 'withdraw',
        meta: { title: 'withdrawAudit', id: '3-2' }
      },
      {
        path: 'recharge-record',
        component: () => import('@/views/audit/rechargeRecord'),
        name: 'rechargeRecord',
        meta: { title: 'rechargeRecord', id: '3-3' }
      }
    ]
  },
  // 客户服务
  {
    path: '/customer-service',
    component: Layout,
    redirect: '/customer-service/appeal',
    name: 'customer-service',
    meta: {
      title: 'customerService',
      icon: 'example',
      id: '4'
    },
    alwaysShow: true,
    children: [
      {
        path: 'appeal',
        component: () => import('@/views/customer-service/appeal'),
        name: 'appealProcess',
        meta: { title: 'appealProcess', id: '4-1' }
      },
      {
        path: 'feedback',
        component: () => import('@/views/customer-service/feedback'),
        name: 'customerFeedback',
        meta: { title: 'customerFeedback', id: '4-2' }
      },
      {
        path: 'contract-us',
        component: () => import('@/views/customer-service/contractUs'),
        name: 'contractUs',
        meta: { title: 'contractUs', id: '4-3' }
      }
    ]
  },
  // 推送管理
  {
    path: '/push',
    component: Layout,
    redirect: '/push/record',
    name: 'pushManage',
    meta: {
      title: 'pushManage',
      icon: 'lock',
      id: '5'
    },
    alwaysShow: true,
    children: [
      {
        path: 'record',
        component: () => import('@/views/push/record'),
        name: 'pushRecord',
        meta: { title: 'pushRecord', id: '5-1' }
      },
      {
        path: 'record-detail',
        component: () => import('@/views/push/recordDetail'),
        hidden: true,
        name: 'pushRecordDetail',
        meta: { title: 'pushRecordDetail', id: '5-1' }
      },
      {
        path: 'sm-template',
        component: () => import('@/views/push/smTemplate'),
        name: 'smTemplateManage',
        meta: { title: 'smTemplateManage', id: '5-3' }
      },
      {
        path: 'email-template',
        component: () => import('@/views/push/emailTemplate'),
        name: 'emailTemplateManage',
        meta: { title: 'emailTemplateManage', id: '5-4' }
      }
    ]
  },
  // 综合查询
  {
    path: '/query',
    component: Layout,
    redirect: '/query/assets/customer',
    name: 'query',
    meta: {
      title: 'comprehensiveQuery',
      icon: 'list',
      id: '6'
    },
    alwaysShow: true,
    children: [
      {
        path: '/query/assets',
        component: () => import('@/views/query/assets/index'),
        name: 'assets',
        redirect: '/query/assets/customer',
        meta: { title: 'assetsChange', id: '6-1' },
        alwaysShow: true,
        children: [
          {
            path: 'customer',
            component: () => import('@/views/query/assets/customer'),
            name: 'customerAssetChange',
            meta: { title: 'customerAssetChange', id: '6-1-1' }
          },
          {
            path: 'customer-balance',
            component: () => import('@/views/query/assets/customerBalance'),
            name: 'customerBalance',
            meta: { title: 'customerBalance', id: '6-1-2' }
          },
          {
            path: 'merchant-deposit',
            component: () => import('@/views/query/assets/merchantDeposit'),
            name: 'merchantDepositDetail',
            meta: { title: 'merchantDepositDetail', id: '6-1-3' }
          },
          {
            path: 'agent-commission',
            component: () => import('@/views/query/assets/agentCommission'),
            name: 'agentCommissionDetail',
            meta: { title: 'agentCommissionDetail', id: '6-1-4' }
          }
        ]
      },
      {
        path: '/query/order', // 客户订单
        component: () => import('@/views/query/order/index'),
        name: 'queryOrder',
        redirect: '/query/order/otc-deal',
        meta: { title: 'queryOrder', id: '6-2' },
        alwaysShow: true,
        children: [
          {
            path: 'otc-deal',
            component: () => import('@/views/query/order/otcDeal'),
            name: 'otcDeal',
            meta: { title: 'otcDeal', id: '6-2-1' }
          },
          {
            path: 'coin2coin-deal',
            component: () => import('@/views/query/order/coin2coinDeal'),
            name: 'coin2coinDeal',
            meta: { title: 'coin2coinDeal', id: '6-2-2' }
          }
        ]
      },
      {
        path: '/query/params', // 参数变动
        component: () => import('@/views/query/params/index'),
        name: 'paramsChange',
        redirect: '/query/params/customer',
        meta: { title: 'paramsChange', id: '6-3' },
        alwaysShow: true,
        children: [
          {
            path: 'customer',
            component: () => import('@/views/query/params/customer'),
            name: 'customerParam',
            meta: { title: 'customerParam', id: '6-3-1' }
          },
          {
            path: 'merchant',
            component: () => import('@/views/query/params/merchant'),
            name: 'merchantParam',
            meta: { title: 'merchantParam', id: '6-3-2' }
          },
          {
            path: 'agent',
            component: () => import('@/views/query/params/agent'),
            name: 'agentParam',
            meta: { title: 'agentParam', id: '6-3-3' }
          }
        ]
      }
    ]
  },
  // 广告宣传
  {
    path: '/ad',
    component: Layout,
    redirect: '/ad/app/banner',
    name: 'ad',
    meta: {
      title: 'ad',
      icon: 'nested',
      id: '7'
    },
    alwaysShow: true,
    children: [
      {
        path: '/ad/app',
        component: () => import('@/views/ad/app/index'),
        name: 'app',
        redirect: '/ad/app/banner',
        meta: { title: 'app', id: '7-1' },
        alwaysShow: true,
        children: [
          {
            path: 'banner',
            component: () => import('@/views/ad/app/banner'),
            name: 'banner',
            meta: { title: 'banner', id: '7-1-1' }
          }
        ]
      },
      {
        path: '/ad/common',
        component: () => import('@/views/ad/common/index'),
        name: 'common',
        redirect: '/ad/common/recommend',
        meta: { title: 'common', id: '7-2' },
        alwaysShow: true,
        children: [
          {
            path: 'recommend',
            component: () => import('@/views/ad/common/recommend'),
            name: 'recommend',
            meta: { title: 'recommend', id: '7-2-1' }
          }
        ]
      }
    ]
  },
  // 新闻公告
  {
    path: '/news',
    component: Layout,
    redirect: '/news/pc',
    name: 'news',
    meta: {
      title: 'news',
      icon: 'clipboard',
      id: '8'
    },
    alwaysShow: true,
    children: [
      {
        path: 'pc',
        component: () => import('@/views/news/pcClient'),
        name: 'newsPC',
        meta: { title: 'pcClient', id: '8-1' }
      },
      {
        path: 'news-list',
        component: () => import('@/views/news/newsList'),
        hidden: true,
        name: 'newsList',
        meta: { title: 'newsList', noCache: true, id: '8-1' }
      },
      {
        path: 'news-detail',
        component: () => import('@/views/news/newsDetail'),
        hidden: true,
        name: 'newsDetail',
        meta: { title: 'newsDetail', id: '8-1' }
      }
    ]
  },
  // 帮助中心
  {
    path: '/help',
    component: Layout,
    redirect: '/help/common',
    name: 'helpCenter',
    alwaysShow: true,
    meta: {
      title: 'helpCenter',
      icon: 'documentation',
      id: '9'
    },
    children: [
      {
        path: 'common',
        component: () => import('@/views/help/commonClient'),
        name: 'helpCommon',
        meta: { title: 'commonClient', id: '9-1' }
      },
      {
        path: 'help-list',
        component: () => import('@/views/help/helpList'),
        hidden: true,
        name: 'helpList',
        meta: { title: 'helpList', noCache: true, id: '9-1' }
      },
      {
        path: 'help-detail',
        component: () => import('@/views/help/helpDetail'),
        hidden: true,
        name: 'helpDetail',
        meta: { title: 'helpDetail', id: '9-1' }
      }
    ]
  },
  // 权限管理
  {
    path: '/authority',
    component: Layout,
    redirect: '/authority/role',
    name: 'authorityManagement',
    alwaysShow: true,
    meta: {
      title: 'authorityManagement',
      icon: 'documentation',
      id: '10'
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/authority/role'),
        name: 'roleSetting',
        meta: { title: 'roleSetting', id: '10-1' }
      },
      {
        path: 'user',
        component: () => import('@/views/authority/user'),
        name: 'userManagement',
        meta: { title: 'userManagement', id: '10-2' }
      }
    ]
  }
]

export const asyncRouterMap11 = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [{
      path: 'page',
      component: () => import('@/views/permission/page'),
      name: 'pagePermission',
      meta: {
        title: 'pagePermission',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    }, {
      path: 'directive',
      component: () => import('@/views/permission/directive'),
      name: 'directivePermission',
      meta: {
        title: 'directivePermission'
        // if do not set roles, means: this page does not require permission
      }
    }]
  },

  {
    path: '/icon',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/svg-icons/index'),
      name: 'icons',
      meta: { title: 'icons', icon: 'icon', noCache: true }
    }]
  },

  {
    path: '/components',
    component: Layout,
    redirect: 'noredirect',
    name: 'component-demo',
    meta: {
      title: 'components',
      icon: 'component'
    },
    children: [
      { path: 'tinymce', component: () => import('@/views/components-demo/tinymce'), name: 'tinymce-demo', meta: { title: 'tinymce' }},
      { path: 'markdown', component: () => import('@/views/components-demo/markdown'), name: 'markdown-demo', meta: { title: 'markdown' }},
      { path: 'json-editor', component: () => import('@/views/components-demo/jsonEditor'), name: 'jsonEditor-demo', meta: { title: 'jsonEditor' }},
      { path: 'splitpane', component: () => import('@/views/components-demo/splitpane'), name: 'splitpane-demo', meta: { title: 'splitPane' }},
      { path: 'avatar-upload', component: () => import('@/views/components-demo/avatarUpload'), name: 'avatarUpload-demo', meta: { title: 'avatarUpload' }},
      { path: 'dropzone', component: () => import('@/views/components-demo/dropzone'), name: 'dropzone-demo', meta: { title: 'dropzone' }},
      { path: 'sticky', component: () => import('@/views/components-demo/sticky'), name: 'sticky-demo', meta: { title: 'sticky' }},
      { path: 'count-to', component: () => import('@/views/components-demo/countTo'), name: 'countTo-demo', meta: { title: 'countTo' }},
      { path: 'mixin', component: () => import('@/views/components-demo/mixin'), name: 'componentMixin-demo', meta: { title: 'componentMixin' }},
      { path: 'back-to-top', component: () => import('@/views/components-demo/backToTop'), name: 'backToTop-demo', meta: { title: 'backToTop' }},
      { path: 'drag-dialog', component: () => import('@/views/components-demo/dragDialog'), name: 'dragDialog-demo', meta: { title: 'dragDialog' }},
      { path: 'dnd-list', component: () => import('@/views/components-demo/dndList'), name: 'dndList-demo', meta: { title: 'dndList' }},
      { path: 'drag-kanban', component: () => import('@/views/components-demo/dragKanban'), name: 'dragKanban-demo', meta: { title: 'dragKanban' }}
    ]
  },

  {
    path: '/charts',
    component: Layout,
    redirect: 'noredirect',
    name: 'charts',
    meta: {
      title: 'charts',
      icon: 'chart'
    },
    children: [
      { path: 'keyboard', component: () => import('@/views/charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
      { path: 'line', component: () => import('@/views/charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
      { path: 'mixchart', component: () => import('@/views/charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
    ]
  },

  {
    path: '/tab',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/tab/index'),
      name: 'tab',
      meta: { title: 'tab', icon: 'tab' }
    }]
  },

  {
    path: '/table',
    component: Layout,
    redirect: '/table/complex-table',
    name: 'table',
    meta: {
      title: 'Table',
      icon: 'table'
    },
    children: [
      { path: 'dynamic-table', component: () => import('@/views/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: 'dynamicTable' }},
      { path: 'drag-table', component: () => import('@/views/table/dragTable'), name: 'dragTable', meta: { title: 'dragTable' }},
      { path: 'inline-edit-table', component: () => import('@/views/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'inlineEditTable' }},
      { path: 'tree-table', component: () => import('@/views/table/treeTable/treeTable'), name: 'treeTableDemo', meta: { title: 'treeTable' }},
      { path: 'custom-tree-table', component: () => import('@/views/table/treeTable/customTreeTable'), name: 'customTreeTableDemo', meta: { title: 'customTreeTable' }},
      { path: 'complex-table', component: () => import('@/views/table/complexTable'), name: 'complexTable', meta: { title: 'complexTable' }}
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'example',
    meta: {
      title: 'example',
      icon: 'example'
    },
    children: [
      { path: 'create', component: () => import('@/views/example/create'), name: 'createArticle', meta: { title: 'createArticle', icon: 'edit' }},
      { path: 'edit/:id(\\d+)', component: () => import('@/views/example/edit'), name: 'editArticle', meta: { title: 'editArticle', noCache: true }, hidden: true },
      { path: 'list', component: () => import('@/views/example/list'), name: 'articleList', meta: { title: 'articleList', icon: 'list' }}
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/bar/profile',
    name: 'nested',
    meta: {
      title: 'nested',
      icon: 'nested'
    },
    children: [
      {
        path: '/nested/bar',
        component: () => import('@/views/nested/bar/index'),
        name: 'bar',
        meta: { title: 'bar' },
        children: [
          {
            path: 'profile',
            component: () => import('@/views/nested/bar/profile'),
            name: 'bar-profile',
            meta: { title: 'barProfile' }
          },
          {
            path: 'posts',
            component: () => import('@/views/nested/bar/posts'),
            name: 'bar-posts',
            meta: { title: 'barPosts' }
          }
        ]
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'errorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      { path: '401', component: () => import('@/views/errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
      { path: '404', component: () => import('@/views/errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'log', component: () => import('@/views/errorLog/index'), name: 'errorLog', meta: { title: 'errorLog', icon: 'bug' }}]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'excel',
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [
      { path: 'export-excel', component: () => import('@/views/excel/exportExcel'), name: 'exportExcel', meta: { title: 'exportExcel' }},
      { path: 'export-selected-excel', component: () => import('@/views/excel/selectExcel'), name: 'selectExcel', meta: { title: 'selectExcel' }},
      { path: 'upload-excel', component: () => import('@/views/excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'uploadExcel' }}
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    meta: { title: 'zip', icon: 'zip' },
    children: [{ path: 'download', component: () => import('@/views/zip/index'), name: 'exportZip', meta: { title: 'exportZip' }}]
  },

  {
    path: '/theme',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'index', component: () => import('@/views/theme/index'), name: 'theme', meta: { title: 'theme', icon: 'theme' }}]
  },

  {
    path: '/clipboard',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'index', component: () => import('@/views/clipboard/index'), name: 'clipboardDemo', meta: { title: 'clipboardDemo', icon: 'clipboard' }}]
  },

  {
    path: '/i18n',
    component: Layout,
    children: [{ path: 'index', component: () => import('@/views/i18n-demo/index'), name: 'i18n', meta: { title: 'i18n', icon: 'international' }}]
  },

  { path: '*', redirect: '/404', hidden: true }
]
