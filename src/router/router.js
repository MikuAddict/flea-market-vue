import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/store'

// 路由组件
const Home = () => import('@/views/Home.vue')
const Login = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const ProductList = () => import('@/views/ProductList.vue')
const ProductDetail = () => import('@/views/ProductDetail.vue')
const UserProfile = () => import('@/views/UserProfile.vue')
const MyProducts = () => import('@/views/MyProducts.vue')
const PublishProduct = () => import('@/views/PublishProduct.vue')
const OrderList = () => import('@/views/OrderList.vue')
const OrderDetail = () => import('@/views/OrderDetail.vue')
const NewsList = () => import('@/views/NewsList.vue')
const NewsDetail = () => import('@/views/NewsDetail.vue')
const AdminDashboard = () => import('@/views/admin/Dashboard.vue')
const AdminUsers = () => import('@/views/admin/Users.vue')
const AdminCategories = () => import('@/views/admin/Categories.vue')
const AdminProducts = () => import('@/views/admin/Products.vue')
const AdminOrders = () => import('@/views/admin/Orders.vue')
const AdminNews = () => import('@/views/admin/News.vue')
const AdminStatistics = () => import('@/views/admin/Statistics.vue')
const AdminProductReview = () => import('@/views/admin/ProductReview.vue')
const NotFound = () => import('@/views/NotFound.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录', guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: '注册', guest: true }
  },
  {
    path: '/products',
    name: 'ProductList',
    component: ProductList,
    meta: { title: '二手物品列表' }
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: { title: '二手物品详情' }
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { title: '个人中心', requiresAuth: true }
  },
  {
    path: '/my-products',
    name: 'MyProducts',
    component: MyProducts,
    meta: { title: '我的二手物品', requiresAuth: true }
  },
  {
    path: '/publish-product',
    name: 'PublishProduct',
    component: PublishProduct,
    meta: { title: '发布二手物品', requiresAuth: true }
  },
  {
    path: '/edit-product/:id',
    name: 'EditProduct',
    component: PublishProduct,
    meta: { title: '编辑二手物品', requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'OrderList',
    component: OrderList,
    meta: { title: '我的订单', requiresAuth: true }
  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: { title: '订单详情', requiresAuth: true }
  },
  {
    path: '/news',
    name: 'NewsList',
    component: NewsList,
    meta: { title: '新闻公告' }
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: NewsDetail,
    meta: { title: '新闻详情' }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { title: '管理员控制台', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: { title: '用户管理', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/categories',
    name: 'AdminCategories',
    component: AdminCategories,
    meta: { title: '分类管理', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: AdminProducts,
    meta: { title: '二手物品管理', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: AdminOrders,
    meta: { title: '订单管理', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/news',
    name: 'AdminNews',
    component: AdminNews,
    meta: { title: '新闻管理', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/statistics',
    name: 'AdminStatistics',
    component: AdminStatistics,
    meta: { title: '统计分析', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/product-review',
    name: 'AdminProductReview',
    component: AdminProductReview,
    meta: { title: '商品审核', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 导航守卫
router.beforeEach(async (to, _, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 跳蚤市场` : '跳蚤市场'
  
  // 检查是否有token（包括localStorage中的）
  const token = store.state.token || localStorage.getItem('token')
  
  // 如果有token但用户信息为空，尝试恢复用户信息
  if (token && !store.state.user) {
    try {
      await store.dispatch('getCurrentUser')
    } catch (error) {
      console.error('恢复用户信息失败:', error)
      // 如果恢复失败，清除无效的token
      store.commit('CLEAR_USER')
    }
  }
  
  // 检查是否需要登录
  const isLoggedIn = store.getters.isLoggedIn
  
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // 检查是否需要管理员权限
  if (to.meta.requiresAdmin && store.state.user.userRole !== 'admin') {
    next({ name: 'Home' })
    return
  }
  
  // 如果已登录用户访问登录/注册页面，重定向到首页
  if (to.meta.guest && isLoggedIn) {
    next({ name: 'Home' })
    return
  }
  
  next()
})

export default router