<template>
  <Layout>
    <div class="admin-product-review unified-page-container fade-in">
      <!-- 页面标题和操作区域 -->
      <div class="page-header unified-flex unified-flex-between">
        <div>
          <h1 class="unified-title-xl">商品审核</h1>
          <p class="unified-text-secondary">审核待审核的二手物品</p>
        </div>
      </div>
      
      <!-- 审核列表 -->
      <el-card class="unified-card review-list-card fade-in">
        <template #header>
          <div class="card-header unified-flex unified-flex-between">
            <h3 class="unified-title-base">待审核商品列表</h3>
            <div class="header-actions">
              <el-button type="primary" @click="fetchPendingProducts" :loading="loading">
                <el-icon><Refresh /></el-icon>
                刷新
              </el-button>
            </div>
          </div>
        </template>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="5" animated />
        </div>
        
        <!-- 空状态 -->
        <div v-else-if="pendingProducts.length === 0" class="empty-container">
          <el-empty description="暂无待审核商品" />
        </div>
        
        <!-- 审核列表 -->
        <div v-else class="review-list">
          <div 
            v-for="product in pendingProducts" 
            :key="product.id" 
            class="review-item fade-in"
          >
              <div class="product-info">
              <div class="product-image unified-cursor-pointer" @click="viewProduct(product)">
                <img 
                  v-if="getProductImage(product)" 
                  :src="getProductImage(product)" 
                  :alt="product.productName"
                />
                <div v-else class="no-image">
                  <el-icon><Picture /></el-icon>
                </div>
              </div>
              <div class="product-details">
                <h4 class="product-name unified-cursor-pointer" @click="viewProduct(product)">{{ product.productName }}</h4>
                <div class="product-meta">
                  <el-tag type="warning" size="small">待审核</el-tag>
                  <span class="product-price">¥{{ formatPrice(product.price) }}</span>
                  <span class="product-category">{{ product.categoryName }}</span>
                </div>
                <p class="product-description">{{ product.description}}</p>
                <div class="product-owner">
                  <div class="owner-info unified-flex unified-flex-center unified-cursor-pointer" @click="goToUserProfile(product.userId)">
                    <el-avatar :size="24" :src="getUserAvatar(product.userAvatar)" class="owner-avatar" />
                    <span class="owner-name">{{ product.userName}}</span>
                  </div>
                  <span class="publish-time">{{ formatDate(product.createTime) }}</span>
                </div>
              </div>
            </div>
            
            <div class="review-actions">
              <el-button 
                type="success" 
                size="small" 
                @click="approveProduct(product)"
                :loading="approvingId === product.id"
              >
                <el-icon><Check /></el-icon>
                通过
              </el-button>
              <el-button 
                type="danger" 
                size="small" 
                @click="rejectProduct(product)"
                :loading="rejectingId === product.id"
              >
                <el-icon><Close /></el-icon>
                拒绝
              </el-button>
            </div>
          </div>
        </div>
        
        <!-- 分页 -->
        <div v-if="total > 0" class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.current"
            v-model:page-size="pagination.size"
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </Layout>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Picture, 
  Refresh, 
  Check, 
  Close, 
  View,
  Goods,
  Document,
  User
} from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import { adminApi } from '@/api'
import { formatPrice, formatDate } from '@/utils/format'
import { refreshUserInfo } from '@/utils/userCache'

export default {
  name: 'AdminProductReview',
  components: {
    Layout
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    // 响应式数据
    const loading = ref(false)
    const pendingProducts = ref([])
    const total = ref(0)
    const approvingId = ref(null)
    const rejectingId = ref(null)
    
    // 分页信息
    const pagination = reactive({
      current: 1,
      size: 10
    })
    
    // 审核统计
    const reviewStats = ref([
      {
        title: '待审核商品',
        value: 0,
        icon: 'Document',
        type: 'warning'
      }
    ])
    
    // 计算属性
    const categories = computed(() => store.state.categories)
    
    // 获取商品图片
    const getProductImage = (product) => {
      // 处理图片URL，将完整后端地址转换为相对路径
      const processImageUrl = (url) => {
        if (!url) return null
        
        // 如果URL包含localhost:7023，转换为相对路径
        if (url.includes('localhost:7023')) {
          return url.replace('http://localhost:7023', '/api')
        }
        
        // 如果是相对路径且以images开头，添加/api前缀
        if (url.startsWith('images/') || url.includes('/images/')) {
          return `/api/${url.replace(/^\/?/, '')}`
        }
        
        // 如果已经是相对路径（以/api开头），直接返回
        if (url.startsWith('/api/')) {
          return url
        }
        
        // 其他情况返回原URL
        return url
      }
      
      // 优先使用主图
      if (product.mainImageUrl) {
        return processImageUrl(product.mainImageUrl)
      }
      // 如果imageUrls是字符串（逗号分隔），解析并取第一个
      if (product.imageUrls && typeof product.imageUrls === 'string') {
        const urls = product.imageUrls.split(',').filter(url => url.trim())
        return urls.length > 0 ? processImageUrl(urls[0]) : null
      }
      // 最后尝试imageUrl字段
      return processImageUrl(product.imageUrl) || null
    }
    
    // 获取待审核商品列表
    const fetchPendingProducts = async () => {
      loading.value = true
      try {
        // 获取状态为0（待审核）的商品
        const response = await adminApi.product.adminListProducts({
          current: pagination.current,
          size: pagination.size,
          status: 0 // 待审核状态
        })
        
        if (response.data && response.data.code === 200) {
          pendingProducts.value = response.data.data.records || []
          total.value = response.data.data.total || 0
          
          // 更新统计信息
          reviewStats.value[0].value = total.value
        }
      } catch (error) {
        console.error('获取待审核商品失败:', error)
        ElMessage.error('获取待审核商品失败')
        pendingProducts.value = []
        total.value = 0
      } finally {
        loading.value = false
      }
    }
    
    // 审核通过商品
    const approveProduct = async (product) => {
      try {
        await ElMessageBox.confirm(
          `确定要通过二手物品"${product.productName}"的审核吗？`,
          '审核确认',
          {
            confirmButtonText: '通过',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        approvingId.value = product.id
        
        // 审核商品，状态为1（已通过）
        await adminApi.product.reviewProduct(product.id, 1)
        
        ElMessage.success('商品审核通过成功')
        
        // 重新加载列表
        fetchPendingProducts()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('审核通过失败:', error)
          ElMessage.error('审核通过失败')
        }
      } finally {
        approvingId.value = null
      }
    }
    
    // 拒绝商品
    const rejectProduct = async (product) => {
      try {
        await ElMessageBox.confirm(
          `确定要拒绝二手物品"${product.productName}"的审核吗？`,
          '拒绝确认',
          {
            confirmButtonText: '拒绝',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        rejectingId.value = product.id
        
        // 审核商品，状态为2（已拒绝）
        await adminApi.product.reviewProduct(product.id, 2)
        
        ElMessage.success('商品拒绝成功')
        
        // 重新加载列表
        fetchPendingProducts()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('拒绝失败:', error)
          ElMessage.error('拒绝失败')
        }
      } finally {
        rejectingId.value = null
      }
    }
    
    // 查看商品详情
    const viewProduct = (product) => {
      router.push(`/products/${product.id}`)
    }
    
    // 跳转到用户个人资料
    const goToUserProfile = (userId) => {
      router.push(`/user/${userId}`)
    }
    
    // 获取用户头像
    const getUserAvatar = (avatarUrl) => {
      if (!avatarUrl) return null
      
      // 处理头像URL，将完整后端地址转换为相对路径
      if (avatarUrl.includes('localhost:7023')) {
        return avatarUrl.replace('http://localhost:7023', '/api')
      }
      
      // 如果是相对路径且以images开头，添加/api前缀
      if (avatarUrl.startsWith('images/') || avatarUrl.includes('/images/')) {
        return `/api/${avatarUrl.replace(/^\/?/, '')}`
      }
      
      // 如果已经是相对路径（以/api开头），直接返回
      if (avatarUrl.startsWith('/api/')) {
        return avatarUrl
      }
      
      // 其他情况返回原URL
      return avatarUrl
    }
    
    // 处理每页显示数量变化
    const handleSizeChange = (size) => {
      pagination.size = size
      pagination.current = 1
      fetchPendingProducts()
    }
    
    // 处理页码变化
    const handleCurrentChange = (current) => {
      pagination.current = current
      fetchPendingProducts()
    }
    
    onMounted(async () => {
      // 确保用户信息是最新的
      try {
        await refreshUserInfo()
      } catch (error) {
        console.error('刷新用户信息失败:', error)
      }
      
      // 获取待审核商品列表
      fetchPendingProducts()
    })
    
    return {
      loading,
      pendingProducts,
      total,
      approvingId,
      rejectingId,
      pagination,
      reviewStats,
      formatPrice,
      formatDate,
      getProductImage,
      fetchPendingProducts,
      approveProduct,
      rejectProduct,
      viewProduct,
      goToUserProfile,
      getUserAvatar,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.admin-product-review {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

/* 统计卡片样式 */
.stats-cards {
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  height: 100%;
}

.stat-item {
  height: 120px;
}

.stat-content {
  height: 100%;
  padding: var(--spacing-lg);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: var(--spacing-base);
}

.stat-item-warning .stat-icon {
  background-color: rgba(230, 162, 60, 0.1);
  color: var(--warning-color);
}

.stat-item-primary .stat-icon {
  background-color: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
}

.stat-item-success .stat-icon {
  background-color: rgba(103, 194, 58, 0.1);
  color: var(--success-color);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: var(--font-size-xxl);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-primary);
}

.stat-title {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin: 0;
}

/* 审核列表样式 */
.review-list-card {
  margin-bottom: var(--spacing-xl);
}

.card-header {
  margin-bottom: var(--spacing-base);
}

.header-actions {
  display: flex;
  gap: var(--spacing-base);
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.review-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-base);
  transition: all var(--transition-base);
}

.review-item:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-base);
}

.product-info {
  display: flex;
  gap: var(--spacing-base);
  flex: 1;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-base);
  overflow: hidden;
  flex-shrink: 0;
  transition: all var(--transition-base);
}

.product-image:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-base);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-lighter);
  color: var(--text-disabled);
  font-size: 24px;
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-primary);
  transition: all var(--transition-base);
}

.product-name:hover {
  color: var(--primary-color);
}

.product-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-base);
  margin-bottom: var(--spacing-xs);
  flex-wrap: wrap;
}

.product-price {
  font-weight: 600;
  color: var(--danger-color);
}

.product-category {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.product-description {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-owner {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.owner-info {
  gap: var(--spacing-xs);
  transition: all var(--transition-base);
}

.owner-info:hover {
  color: var(--primary-color);
}

.owner-avatar {
  flex-shrink: 0;
}

.owner-name {
  font-weight: 500;
}

.publish-time {
  color: var(--text-disabled);
}

.review-actions {
  display: flex;
  gap: var(--spacing-base);
  flex-shrink: 0;
}

/* 加载和空状态样式 */
.loading-container, .empty-container {
  padding: var(--spacing-xl) 0;
}

/* 分页样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .review-item {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-base);
  }
  
  .review-actions {
    justify-content: center;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}
</style>