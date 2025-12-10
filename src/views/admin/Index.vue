<template>
  <Layout>
    <div class="admin-index unified-page-container fade-in">
      <!-- 页面标题 -->
      <div class="page-header unified-mb-xl unified-text-center">
        <h1 class="unified-title-xl">管理后台</h1>
        <p class="unified-text-secondary">选择要管理的功能模块</p>
      </div>
      
      <!-- 管理模块网格 -->
      <div class="modules-grid unified-grid unified-grid-3 unified-gap-lg unified-mb-xl">
        <div 
          class="module-card fade-in unified-module-card" 
          v-for="(module, index) in adminModules" 
          :key="module.title"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="navigateToModule(module.route)"
        >
          <el-card class="unified-card module-item unified-module-item">
            <div class="module-content">
              <div class="module-icon">
                <el-icon :size="48"><component :is="module.icon" /></el-icon>
              </div>
              <h3 class="module-title">{{ module.title }}</h3>
              <p class="module-desc">{{ module.description }}</p>
            </div>
          </el-card>
        </div>
      </div>
      
      <!-- 系统信息 -->
      <el-card class="unified-card system-info-card fade-in unified-mb-xl">
        <template #header>
          <h3 class="unified-title-base">系统信息</h3>
        </template>
        
        <div class="info-grid unified-grid unified-grid-2 unified-gap-lg">
          <div class="info-item unified-info-item">
            <div class="info-icon">
              <el-icon><Monitor /></el-icon>
            </div>
            <div class="info-details">
              <h4 class="info-title">系统版本</h4>
              <p class="info-value">校园跳蚤市场 v1.0.0</p>
            </div>
          </div>
          
          <div class="info-item unified-info-item">
            <div class="info-icon">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="info-details">
              <h4 class="info-title">运行时间</h4>
              <p class="info-value">7天24小时不间断</p>
            </div>
          </div>
          
          <div class="info-item unified-info-item">
            <div class="info-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="info-details">
              <h4 class="info-title">活跃用户</h4>
              <p class="info-value">{{ totalUsers }}</p>
            </div>
          </div>
          
          <div class="info-item unified-info-item">
            <div class="info-icon">
              <el-icon><Goods /></el-icon>
            </div>
            <div class="info-details">
              <h4 class="info-title">商品数量</h4>
              <p class="info-value">{{ totalProducts }}</p>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </Layout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Monitor,
  Clock,
  User,
  Goods,
  DataAnalysis,
  UserFilled,
  Document,
  ShoppingCartFull,
  PriceTag,
  Operation
} from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import { adminApi } from '@/api'

export default {
  name: 'AdminIndex',
  components: {
    Layout
  },
  setup() {
    const router = useRouter()
    
    // 系统统计数据
    const totalUsers = ref(0)
    const totalProducts = ref(0)
    
    // 管理模块数据
    const adminModules = ref([
      {
        title: '数据统计',
        description: '查看系统各项数据统计',
        icon: 'DataAnalysis',
        route: '/admin/dashboard'
      },
      {
        title: '用户管理',
        description: '管理系统中的所有用户',
        icon: 'UserFilled',
        route: '/admin/users'
      },
      {
        title: '二手物品管理',
        description: '管理系统中的所有二手物品',
        icon: 'ShoppingCartFull',
        route: '/admin/products'
      },
      {
        title: '分类管理',
        description: '管理系统中的所有商品分类',
        icon: 'PriceTag',
        route: '/admin/categories'
      },
      {
        title: '商品审核',
        description: '审核待审核的二手物品',
        icon: 'Document',
        route: '/admin/product-review'
      },
      {
        title: '发布公告',
        description: '管理系统中的所有新闻公告',
        icon: 'Operation',
        route: '/admin/news'
      },
      {
        title: '订单管理',
        description: '管理系统中的所有订单',
        icon: 'Document',
        route: '/admin/orders'
      }
    ])
    
    // 获取系统统计信息
    const fetchSystemStats = async () => {
      try {
        // 获取已审核用户总数（状态为1）
        const userResponse = await adminApi.user.getUserVoList({ current: 1, size: 1, userStatus: 1 })
        if (userResponse.data && userResponse.data.code === 200) {
          totalUsers.value = userResponse.data.data.total || 0
        }
        
        // 获取已通过审核的在售物品总数（状态为1）
        const productResponse = await adminApi.product.listProductByPage({ current: 1, size: 1, status: 1 })
        if (productResponse.data && productResponse.data.code === 200) {
          totalProducts.value = productResponse.data.data.total || 0
        }
      } catch (error) {
        console.error('获取系统统计信息失败:', error)
      }
    }
    
    // 导航到指定模块
    const navigateToModule = (route) => {
      router.push(route)
    }
    
    onMounted(() => {
      fetchSystemStats()
    })
    
    return {
      totalUsers,
      totalProducts,
      adminModules,
      navigateToModule
    }
  }
}
</script>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .modules-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .modules-grid {
    grid-template-columns: 1fr;
  }
  
  .module-item {
    height: 180px;
    padding: var(--spacing-lg);
  }
  
  .module-icon {
    width: 60px;
    height: 60px;
    margin-bottom: var(--spacing-base);
  }
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}
</style>