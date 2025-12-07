<template>
  <Layout>
    <div class="product-detail-container" v-if="!loading">
      <el-row :gutter="20">
        <!-- 左侧商品信息 -->
        <el-col :xs="24" :lg="14">
          <el-card class="product-info-card">
            <div class="product-gallery">
              <div class="main-image">
                <img
                  v-if="product.imageUrl"
                  :src="product.imageUrl"
                  :alt="product.productName"
                  @error="handleImageError"
                />
                <el-image v-else style="width: 100%; height: 400px">
                  <template #error>
                    <div class="image-placeholder">
                      <el-icon size="50"><Picture /></el-icon>
                      <p>暂无图片</p>
                    </div>
                  </template>
                </el-image>
              </div>
            </div>
            <div class="product-basic-info">
              <h2 class="product-name">{{ product.productName }}</h2>
              <div class="product-price">
                <span class="price-label">价格</span>
                <span class="price-value">¥{{ formatPrice(product.price) }}</span>
              </div>
              <div class="product-meta">
                <el-tag :type="getProductStatusType(product.status)" size="large">
                  {{ formatProductStatus(product.status) }}
                </el-tag>
                <el-tag type="info" size="large">
                  {{ formatPaymentMethod(product.paymentMethod) }}
                </el-tag>
                <el-tag v-if="product.category" type="success" size="large">
                  {{ product.category.name }}
                </el-tag>
              </div>
              <div class="product-description">
                <h4>商品描述</h4>
                <p>{{ product.description || '暂无描述' }}</p>
              </div>
              <div class="product-actions" v-if="isLoggedIn && product.user?.id !== userId">
                <el-button
                  type="primary"
                  size="large"
                  :disabled="product.status !== 1"
                  @click="createOrder"
                >
                  {{ getActionText() }}
                </el-button>
                <el-button size="large" @click="contactSeller">
                  <el-icon><ChatDotRound /></el-icon>
                  联系卖家
                </el-button>
              </div>
              <div class="product-notice" v-else-if="!isLoggedIn">
                <el-alert title="请先登录" type="info" show-icon :closable="false">
                  <el-button type="text" @click="$router.push('/login')">立即登录</el-button>
                  <el-button type="text" @click="$router.push('/register')">注册账号</el-button>
                </el-alert>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧卖家信息 -->
        <el-col :xs="24" :lg="10">
          <el-card class="seller-info-card" v-if="product.user">
            <template #header>
              <div class="card-header">
                <span>卖家信息</span>
              </div>
            </template>
            <div class="seller-profile">
              <el-avatar :size="80" :src="product.user.userAvatar">
                {{ product.user.userName?.charAt(0) }}
              </el-avatar>
              <div class="seller-details">
                <h3>{{ product.user.userName }}</h3>
                <el-tag :type="getUserStatusType(product.user.userStatus)" size="small">
                  {{ formatUserStatus(product.user.userStatus) }}
                </el-tag>
                <div class="seller-phone" v-if="product.user.userPhone">
                  <el-icon><Phone /></el-icon>
                  {{ product.user.userPhone }}
                </div>
              </div>
            </div>
            <div class="seller-stats">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div class="stat-item">
                    <div class="stat-value">{{ product.user.point || 0 }}</div>
                    <div class="stat-label">积分</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="stat-item">
                    <div class="stat-value">{{ sellerStats.published || 0 }}</div>
                    <div class="stat-label">发布</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="stat-item">
                    <div class="stat-value">{{ sellerStats.completed || 0 }}</div>
                    <div class="stat-label">成交</div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="seller-actions">
              <el-button plain style="width: 100%" @click="viewSellerProducts">
                查看Ta的商品
              </el-button>
            </div>
          </el-card>

          <!-- 商品评价 -->
          <el-card class="review-card" v-if="product.id">
            <template #header>
              <div class="card-header">
                <span>商品评价</span>
                <el-link type="primary" @click="showAllReviews" v-if="reviewCount > 0">
                  查看全部({{ reviewCount }})
                </el-link>
              </div>
            </template>
            <div v-if="reviews.length === 0" class="empty-reviews">
              <el-empty description="暂无评价" />
            </div>
            <div v-else>
              <div class="review-summary">
                <el-rate v-model="averageRating" disabled text-color="#ff9900" />
                <span class="rating-text">{{ averageRating }}分 ({{ reviewCount }}人评价)</span>
              </div>
              <div class="review-list">
                <div v-for="review in reviews" :key="review.id" class="review-item">
                  <div class="review-header">
                    <el-avatar :size="30">{{ review.userId }}</el-avatar>
                    <div class="review-info">
                      <div class="review-user">用户{{ review.userId }}</div>
                      <el-rate v-model="review.rating" disabled size="small" />
                    </div>
                    <div class="review-time">{{ formatDate(review.createTime, 'YYYY-MM-DD') }}</div>
                  </div>
                  <div class="review-content">{{ review.content }}</div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 相关商品推荐 -->
      <el-card class="related-products-card" v-if="relatedProducts.length > 0">
        <template #header>
          <span>相关推荐</span>
        </template>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in relatedProducts" :key="item.id">
            <ProductCard :product="item" />
          </el-col>
        </el-row>
      </el-card>
    </div>

    <div v-else class="loading-container">
      <el-skeleton animated />
    </div>
  </Layout>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Picture, ChatDotRound, Phone } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import ProductCard from '@/components/ProductCard.vue'
import api from '@/api'
import { productApi, orderApi, reviewApi, statisticsApi } from '@/api'
import {
  formatPrice,
  formatPaymentMethod,
  formatProductStatus,
  formatUserStatus,
  formatDate,
  getProductStatusType,
  getUserStatusType
} from '@/utils/format'

export default {
  name: 'ProductDetail',
  components: {
    Layout,
    ProductCard,
    Picture,
    ChatDotRound,
    Phone
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    // 商品数据
    const product = ref({})
    const loading = ref(true)
    const averageRating = ref(0)
    const reviewCount = ref(0)
    const reviews = ref([])
    const relatedProducts = ref([])
    const sellerStats = ref({ published: 0, completed: 0 })
    
    // 计算属性
    const isLoggedIn = computed(() => store.getters.isLoggedIn)
    const userId = computed(() => store.state.user?.id)
    const productId = computed(() => parseInt(route.params.id))
    
    // 获取商品详情
    const fetchProductDetail = async () => {
      try {
        loading.value = true
        const response = await productApi.getProductById(productId.value)
        product.value = response.data.data
        
        // 获取商品评价统计
        const statsResponse = await reviewApi.getReviewStatistics(productId.value)
        const stats = statsResponse.data.data
        averageRating.value = stats.averageRating || 0
        reviewCount.value = stats.totalReviews || 0
        
        // 获取评价列表（最多显示3条）
        if (reviewCount.value > 0) {
          const reviewsResponse = await reviewApi.getReviewListByProduct(productId.value, {
            current: 1,
            size: 3
          })
          reviews.value = reviewsResponse.data.data.records || []
        }
        
        // 获取卖家统计信息
        if (product.value.user) {
          await fetchSellerStats(product.value.user.id)
        }
        
        // 获取相关商品（同分类）
        if (product.value.categoryId) {
          await fetchRelatedProducts(product.value.categoryId)
        }
      } catch (error) {
        console.error('获取商品详情失败:', error)
        ElMessage.error('商品不存在或已被删除')
        router.push('/products')
      } finally {
        loading.value = false
      }
    }
    
    // 获取卖家统计信息
    const fetchSellerStats = async (sellerId) => {
      try {
        // 获取卖家发布的商品
        const productsResponse = await productApi.getProductListByUser(sellerId, {
          current: 1,
          size: 1
        })
        sellerStats.value.published = productsResponse.data.data.total || 0
        
        // 获取卖家订单统计
        const statsResponse = await statisticsApi.getUserStatistics(sellerId)
        if (statsResponse.data.code === 200) {
          const stats = statsResponse.data.data
          sellerStats.value.completed = stats.totalSales || 0
        }
      } catch (error) {
        console.error('获取卖家统计失败:', error)
      }
    }
    
    // 获取相关商品
    const fetchRelatedProducts = async (categoryId) => {
      try {
        const response = await productApi.getProductListByCategory(categoryId, {
          current: 1,
          size: 4
        })
        const products = response.data.data.records || []
        
        // 排除当前商品
        relatedProducts.value = products.filter(item => item.id !== productId.value)
      } catch (error) {
        console.error('获取相关商品失败:', error)
      }
    }
    
    // 创建订单
    const createOrder = async () => {
      try {
        const response = await orderApi.createOrder({
          productId: productId.value
        })
        
        if (response.data.code === 200) {
          ElMessage.success('订单创建成功')
          router.push(`/orders/${response.data.data}`)
        }
      } catch (error) {
        console.error('创建订单失败:', error)
      }
    }
    
    // 联系卖家
    const contactSeller = () => {
      ElMessage.info('联系功能正在开发中')
    }
    
    // 查看卖家商品
    const viewSellerProducts = () => {
      router.push({
        name: 'ProductList',
        query: { userId: product.value.user.id }
      })
    }
    
    // 查看所有评价
    const showAllReviews = () => {
      // 这里可以跳转到评价页面或打开对话框
      ElMessage.info('查看所有评价功能正在开发中')
    }
    
    // 获取操作按钮文本
    const getActionText = () => {
      if (product.value.status !== 1) {
        return '商品不可购买'
      }
      
      switch (product.value.paymentMethod) {
        case 0:
          return '立即购买'
        case 1:
          return '立即购买'
        case 2:
          return '积分兑换'
        case 3:
          return '申请交换'
        default:
          return '立即购买'
      }
    }
    
    // 处理图片加载错误
    const handleImageError = () => {
      console.log('图片加载失败')
    }
    
    // 监听路由参数变化
    watch(() => route.params.id, () => {
      if (route.params.id) {
        fetchProductDetail()
      }
    }, { immediate: true })
    
    return {
      product,
      loading,
      averageRating,
      reviewCount,
      reviews,
      relatedProducts,
      sellerStats,
      isLoggedIn,
      userId,
      formatPrice,
      formatPaymentMethod,
      formatProductStatus,
      formatUserStatus,
      formatDate,
      getProductStatusType,
      getUserStatusType,
      createOrder,
      contactSeller,
      viewSellerProducts,
      showAllReviews,
      getActionText,
      handleImageError
    }
  }
}
</script>

<style scoped>
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
}

.product-info-card {
  margin-bottom: 20px;
}

.product-gallery {
  margin-bottom: 20px;
}

.main-image {
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
}

.main-image img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: #909399;
}

.product-basic-info {
  padding: 0 10px;
}

.product-name {
  margin: 0 0 15px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.product-price {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.price-label {
  font-size: 16px;
  color: #606266;
  margin-right: 10px;
}

.price-value {
  font-size: 28px;
  font-weight: bold;
  color: #f56c6c;
}

.product-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.product-description {
  margin-bottom: 20px;
}

.product-description h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.product-description p {
  margin: 0;
  color: #606266;
  line-height: 1.6;
}

.product-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.product-notice {
  margin-bottom: 20px;
}

.seller-info-card, .review-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.seller-profile {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.seller-details {
  margin-left: 15px;
  flex: 1;
}

.seller-details h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
}

.seller-phone {
  display: flex;
  align-items: center;
  margin-top: 8px;
  color: #606266;
}

.seller-phone .el-icon {
  margin-right: 5px;
}

.seller-stats {
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.seller-actions {
  margin-top: 10px;
}

.review-summary {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.rating-text {
  margin-left: 10px;
  color: #606266;
}

.review-list {
  margin-top: 15px;
}

.review-item {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.review-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.review-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.review-info {
  flex: 1;
  margin-left: 10px;
}

.review-user {
  font-size: 14px;
  margin-bottom: 3px;
}

.review-time {
  font-size: 12px;
  color: #909399;
}

.review-content {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.related-products-card {
  margin-top: 20px;
}

.empty-reviews {
  padding: 20px 0;
}

.loading-container {
  padding: 20px;
}
</style>