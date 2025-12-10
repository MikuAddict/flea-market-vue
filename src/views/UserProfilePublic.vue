<template>
  <Layout>
    <div class="public-user-profile unified-page-container fade-in" v-if="!loading">
      <div class="profile-header">
        <h1 class="unified-title-xl">用户资料</h1>
      </div>

      <el-row :gutter="24">
        <!-- 左侧用户信息卡片 -->
        <el-col :xs="24" :md="8" :lg="7">
          <UserBasicInfoCard 
            :user="user" 
            :products-count="userProducts.length"
            account-id-label="用户ID"
            date-format="YYYY-MM-DD"
          />
        </el-col>
        
        <!-- 右侧内容区域 -->
        <el-col :xs="24" :md="16" :lg="17">
          <el-card class="unified-card content-card fade-in">
            <el-tabs v-model="activeTab" class="profile-tabs" @tab-click="handleTabClick">
              <!-- 在售的二手物品 -->
              <el-tab-pane name="products">
                <template #label>
                  <div class="tab-label unified-flex unified-flex-center">
                    <el-icon><Box /></el-icon>
                    <span>在售的二手物品</span>
                  </div>
                </template>
                
                <UserProductsTab 
                  :products="userProducts" 
                  title="在售的二手物品"
                  empty-text="暂无在售的二手物品"
                  :show-view-more="false"
                />
              </el-tab-pane>
              
              <!-- 收到的评论 -->
              <el-tab-pane name="reviews">
                <template #label>
                  <div class="tab-label unified-flex unified-flex-center">
                    <el-icon><Star /></el-icon>
                    <span>收到的评论</span>
                  </div>
                </template>
                
                <UserReviewsTab
                  :reviews="userReviews"
                  title="收到的评论"
                  empty-text="暂无评论"
                  :show-product-link="true"
                  :show-view-more="false"
                  @go-to-product="goToProduct"
                  @go-to-user="goToUserProfile"
                />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div v-else class="loading-container">
      <el-skeleton animated />
    </div>
  </Layout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Box, Star } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import UserBasicInfoCard from '@/components/UserBasicInfoCard.vue'
import UserProductsTab from '@/components/UserProductsTab.vue'
import UserReviewsTab from '@/components/UserReviewsTab.vue'
import { userApi, productApi, reviewApi } from '@/api'
import {
  formatUserRole,
  formatDate
} from '@/utils/format'

export default {
  name: 'UserProfilePublic',
  components: {
    Layout,
    UserBasicInfoCard,
    UserProductsTab,
    UserReviewsTab,
    Box,
    Star
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    // 响应式数据
    const loading = ref(true)
    const activeTab = ref('products')
    const user = ref({})
    const userProducts = ref([])
    const userReviews = ref([])
    
    // 获取用户信息
    const fetchUserInfo = async () => {
      try {
        const userId = route.params.id
        const response = await userApi.getUserVOById(userId)
        
        if (response.data.code === 200) {
          user.value = response.data.data
        } else {
          ElMessage.error('用户不存在')
          router.push('/products')
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        ElMessage.error('获取用户信息失败')
        router.push('/products')
      }
    }
    
    // 获取用户发布的二手物品
    const fetchUserProducts = async () => {
      try {
        const userId = route.params.id
        const response = await productApi.getProductListByUser(userId, {
          current: 1,
          size: 20,
          status: 1 // 只获取已上架的商品
        })
        
        if (response.data.code === 200) {
          userProducts.value = response.data.data.records || []
        }
      } catch (error) {
        console.error('获取用户二手物品失败:', error)
      }
    }
    
    // 获取用户收到的评论
    const fetchUserReviews = async () => {
      try {
        const userId = route.params.id
        const response = await reviewApi.getReviewListByUser(userId, {
          current: 1,
          size: 20
        })
        
        if (response.data.code === 200) {
          const reviews = response.data.data.records || []
          
          // 为每个评论补充用户和产品信息
          const enrichedReviews = await Promise.all(
            reviews.map(async (review) => {
              const enrichedReview = { ...review }
              
              // 如果评论数据中不包含用户信息，则根据userId获取用户信息
              if (!review.userName || !review.userAvatar) {
                try {
                  const userResponse = await userApi.getUserVOById(review.userId)
                  if (userResponse.data.code === 200) {
                    enrichedReview.userName = userResponse.data.data.userName
                    enrichedReview.userAvatar = userResponse.data.data.userAvatar
                  }
                } catch (userError) {
                  console.error('获取用户信息失败:', userError)
                }
              }
              
              // 如果评论数据中不包含产品信息，则根据productId获取产品信息
              if (!review.productName || !review.productImage) {
                try {
                  const productResponse = await productApi.getProductById(review.productId)
                  if (productResponse.data.code === 200) {
                    enrichedReview.productName = productResponse.data.data.productName
                    enrichedReview.productImage = productResponse.data.data.imageUrl || productResponse.data.data.mainImageUrl
                    enrichedReview.productPrice = productResponse.data.data.price
                  }
                } catch (productError) {
                  console.error('获取产品信息失败:', productError)
                }
              }
              
              return enrichedReview
            })
          )
          
          userReviews.value = enrichedReviews
        }
      } catch (error) {
        console.error('获取用户评论失败:', error)
      }
    }
    
    // 处理标签页点击
    const handleTabClick = (tab) => {
      if (tab.paneName === 'products') {
        fetchUserProducts()
      } else if (tab.paneName === 'reviews') {
        fetchUserReviews()
      }
    }
    
    // 跳转到二手物品详情
    const goToProduct = (productId) => {
      router.push(`/products/${productId}`)
    }
    
    onMounted(async () => {
      await fetchUserInfo()
      await fetchUserProducts()
      loading.value = false
    })
    
    return {
      loading,
      activeTab,
      user,
      userProducts,
      userReviews,
      formatUserRole,
      formatDate,
      handleTabClick,
      goToProduct
    }
  }
}
</script>

<style scoped>
/* 页面头部样式 */
.profile-header {
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

/* 用户信息卡片样式 */
.profile-card {
  margin-bottom: var(--spacing-xl);
  transition: all var(--transition-base);
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

/* 头像部分样式 */
.avatar-section {
  margin-bottom: var(--spacing-lg);
}

.avatar-container {
  position: relative;
}

.user-avatar {
  border: 3px solid var(--border-lighter);
  box-shadow: var(--shadow-light);
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
}

.avatar-text {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: white;
}

/* 用户信息详情样式 */
.profile-info {
  text-align: center;
}

.user-details {
  margin-bottom: var(--spacing-lg);
}

.user-info {
  align-items: center;
}

.user-name {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
}

.user-role {
  margin-top: var(--spacing-xs);
}

/* 统计信息样式 */
.info-stats {
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-base) 0;
}

.stat-item {
  flex: 1;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background-color: var(--border-light);
}

/* 详细信息样式 */
.info-details {
  text-align: left;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-base);
}

.detail-label {
  font-weight: 500;
}

.detail-value {
  color: var(--text-primary);
}

/* 内容区域样式 */
.content-card {
  min-height: 500px;
}

/* 标签页样式 */
.profile-tabs {
  background-color: transparent;
  box-shadow: none;
  border: none;
}

:deep(.el-tabs__header) {
  margin-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-lighter);
}

:deep(.el-tabs__nav-wrap) {
  padding: 0;
}

:deep(.el-tabs__item) {
  padding: 0 var(--spacing-lg);
  height: 50px;
  line-height: 50px;
  font-weight: 500;
  color: var(--text-regular);
}

:deep(.el-tabs__item.is-active) {
  color: var(--primary-color);
}

:deep(.el-tabs__active-bar) {
  background-color: var(--primary-color);
}

.tab-label {
  gap: var(--spacing-xs);
  font-weight: 500;
}

.tab-content {
  padding: 0;
}

.content-header {
  margin-bottom: var(--spacing-lg);
}

/* 空状态样式 */
.empty-content {
  padding: var(--spacing-xxl) 0;
}

.empty-text {
  margin: var(--spacing-base) 0;
  color: var(--text-secondary);
}

/* 商品网格样式 */
.products-grid {
  margin-bottom: var(--spacing-lg);
}

.product-item {
  margin-bottom: var(--spacing-base);
}

/* 评论列表样式 */
.reviews-list {
  margin-bottom: var(--spacing-lg);
}

.review-item {
  margin-bottom: var(--spacing-base);
}

.review-card {
  border-left: 4px solid var(--primary-color);
}

.review-header {
  margin-bottom: var(--spacing-base);
}

.rating :deep(.el-rate__icon) {
  font-size: var(--font-size-md);
}

.review-content {
  margin-bottom: var(--spacing-base);
}

.review-text {
  margin: 0;
  line-height: 1.6;
  color: var(--text-primary);
}

.review-product {
  font-size: var(--font-size-sm);
}

.product-link {
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .info-stats {
    flex-direction: column;
    gap: var(--spacing-base);
  }
  
  .stat-divider {
    width: 100%;
    height: 1px;
  }
}
</style>