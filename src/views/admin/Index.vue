<template>
  <Layout>
    <div class="admin-index unified-page-container fade-in">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="unified-title-xl">管理后台</h1>
        <p class="unified-text-secondary">选择要管理的功能模块</p>
      </div>
      
      <!-- 管理模块网格 -->
      <div class="modules-grid unified-grid unified-grid-3">
        <div 
          class="module-card fade-in" 
          v-for="(module, index) in adminModules" 
          :key="module.title"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="navigateToModule(module.route)"
        >
          <el-card class="unified-card module-item">
            <div class="module-content unified-flex unified-flex-col unified-flex-center">
              <div class="module-icon unified-flex unified-flex-center">
                <el-icon :size="48"><component :is="module.icon" /></el-icon>
              </div>
              <h3 class="module-title">{{ module.title }}</h3>
              <p class="module-desc">{{ module.description }}</p>
            </div>
          </el-card>
        </div>
      </div>
      
      <!-- 系统信息 -->
      <el-card class="unified-card system-info-card fade-in">
        <template #header>
          <h3 class="unified-title-base">系统信息</h3>
        </template>
        
        <div class="info-grid unified-grid unified-grid-2">
          <div class="info-item unified-flex unified-flex-center">
            <div class="info-icon unified-flex unified-flex-center">
              <el-icon><Monitor /></el-icon>
            </div>
            <div class="info-details">
              <h4 class="info-title">系统版本</h4>
              <p class="info-value">校园跳蚤市场 v1.0.0</p>
            </div>
          </div>
          
          <div class="info-item unified-flex unified-flex-center">
            <div class="info-icon unified-flex unified-flex-center">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="info-details">
              <h4 class="info-title">运行时间</h4>
              <p class="info-value">7天24小时不间断</p>
            </div>
          </div>
          
          <div class="info-item unified-flex unified-flex-center">
            <div class="info-icon unified-flex unified-flex-center">
              <el-icon><User /></el-icon>
            </div>
            <div class="info-details">
              <h4 class="info-title">活跃用户</h4>
              <p class="info-value">{{ totalUsers }}</p>
            </div>
          </div>
          
          <div class="info-item unified-flex unified-flex-center">
            <div class="info-icon unified-flex unified-flex-center">
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
        title: '订单管理',
        description: '管理系统中的所有订单',
        icon: 'Document',
        route: '/admin/orders'
      },
      {
        title: '新闻管理',
        description: '管理系统中的所有新闻公告',
        icon: 'Operation',
        route: '/admin/news'
      }
    ])
    
    // 获取系统统计信息
    const fetchSystemStats = async () => {
      try {
        // 获取用户总数
        const userResponse = await adminApi.user.getUserVoList({ current: 1, size: 1 })
        if (userResponse.data && userResponse.data.code === 200) {
          totalUsers.value = userResponse.data.data.total || 0
        }
        
        // 获取产品总数
        const productResponse = await adminApi.product.listProductByPage({ current: 1, size: 1 })
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
/* 页面头部样式 */
.page-header {
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

/* 管理模块网格样式 */
.modules-grid {
  margin-bottom: var(--spacing-xl);
}

.module-card {
  height: 100%;
  cursor: pointer;
  transition: all var(--transition-base);
}

.module-item {
  height: 200px;
  padding: var(--spacing-xl);
  transition: all var(--transition-base);
}

.module-card:hover .module-item {
  transform: translateY(-8px);
  box-shadow: var(--shadow-hover);
}

.module-content {
  height: 100%;
}

.module-icon {
  width: 80px;
  height: 80px;
  margin-bottom: var(--spacing-base);
  border-radius: 50%;
  background-color: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
  transition: all var(--transition-base);
}

.module-card:hover .module-icon {
  background-color: var(--primary-color);
  color: white;
  transform: scale(1.05);
}

.module-title {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.module-desc {
  margin: 0;
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

/* 系统信息样式 */
.system-info-card {
  margin-bottom: var(--spacing-xl);
}

.info-grid {
  gap: var(--spacing-lg);
}

.info-item {
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-base);
  background-color: var(--bg-lighter);
  transition: all var(--transition-base);
}

.info-item:hover {
  background-color: var(--bg-light);
  transform: translateY(-2px);
}

.info-icon {
  width: 60px;
  height: 60px;
  margin-right: var(--spacing-base);
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
}

.info-details {
  flex: 1;
  text-align: left;
}

.info-title {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-secondary);
}

.info-value {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modules-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    margin-bottom: var(--spacing-base);
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