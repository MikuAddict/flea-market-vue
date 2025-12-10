<template>
  <Layout>
    <div class="public-user-profile unified-page-container fade-in" v-if="!loading">
      <div class="profile-header unified-mb-xl unified-text-center">
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
          <el-card class="unified-card content-card unified-min-height-500 fade-in">
            <el-tabs v-model="activeTab" class="profile-tabs unified-tabs" @tab-click="handleTabClick">
              <!-- 在售的二手物品 -->
              <el-tab-pane name="products">
                <template #label>
                  <div class="tab-label unified-flex unified-flex-center unified-gap-xs">
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
                  <div class="tab-label unified-flex unified-flex-center unified-gap-xs">
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

    <div v-else class="loading-container unified-p-xl">
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
  font-weight: 500;
}
</style>