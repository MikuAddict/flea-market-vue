<template>
  <Layout>
    <div class="product-detail-container" v-if="!loading">
      <el-row :gutter="20">
        <!-- 左侧二手物品信息 -->
        <el-col :xs="24" :lg="14">
          <el-card class="product-info-card">
          <div class="product-gallery">
            <!-- 主图 -->
            <div class="main-image">
              <img
                v-if="currentImage"
                :src="currentImage"
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
            
            <!-- 缩略图列表 -->
            <div v-if="productImages.length > 1" class="thumbnail-list">
              <div 
                v-for="(image, index) in productImages" 
                :key="index"
                class="thumbnail-item"
                :class="{ active: currentImageIndex === index }"
                @click="currentImageIndex = index"
              >
                <img :src="image" :alt="`图片${index + 1}`" />
              </div>
            </div>
          </div>
            <div class="product-basic-info">
              <h2 class="product-name">{{ product.productName }}</h2>
              <div class="product-price">
                <span class="price-label">价格</span>
                <span class="price-value">¥{{ formatPrice(product.price) }}</span>
              </div>
              <div class="product-meta">
                <el-tag type="info" size="large">
                  {{ formatPaymentMethod(product.paymentMethod) }}
                </el-tag>
                <el-tag v-if="product.category" type="success" size="large">
                  {{ product.category.name }}
                </el-tag>
              </div>
              <div class="product-description">
                <h4>二手物品描述</h4>
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
              </div>
              <div class="product-notice" v-else-if="!isLoggedIn">
                <el-alert title="请先登录" type="info" show-icon :closable="false">
                </el-alert>
              </div>
              
              <!-- 卖家信息显示在购买按钮旁边或单独显示 -->
              <div class="seller-contact-inline" v-if="product.user">
                <div class="seller-contact-item">
                  <el-avatar 
                    :size="24" 
                    :src="product.user.userAvatar" 
                    class="seller-mini-avatar clickable"
                    @click="goToUserProfile(product.user.id)"
                  >
                    {{ product.user.userName?.charAt(0) }}
                  </el-avatar>
                  <span class="seller-name clickable" @click="goToUserProfile(product.user.id)">
                    {{ product.user.userName }}
                  </span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :lg="10">
          <!-- 二手物品留言 -->
          <el-card class="review-card" v-if="product.id">
            <template #header>
              <div class="card-header">
                <span>二手物品留言</span>
              </div>
            </template>
            <div v-if="comments.length === 0" class="empty-reviews">
              <el-empty description="暂无留言" />
            </div>
            <div v-else>
              <div class="review-list-container">
                <div class="review-list">
                  <div v-for="comment in comments" :key="comment.id" class="review-item">
                    <div class="review-header">
                      <el-avatar 
                        :size="30" 
                        :src="comment.userAvatar" 
                        class="clickable"
                        @click="goToUserProfile(comment.userId)"
                      >
                        {{ comment.userName?.charAt(0) }}
                      </el-avatar>
                      <div class="review-info">
                        <div class="review-user clickable" @click="goToUserProfile(comment.userId)">
                          {{ comment.userName }}
                        </div>
                      </div>
                      <div class="review-time">{{ formatDate(comment.createTime, 'YYYY-MM-DD') }}</div>
                    </div>
                    <div class="review-content">{{ comment.content }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 添加留言表单 -->
            <div class="add-comment-form" v-if="isLoggedIn">
              <el-form :model="commentForm" ref="commentFormRef" @submit.prevent="submitComment">
                <el-form-item prop="content" :rules="[{ required: true, message: '请输入留言内容', trigger: 'blur' }]">
                  <el-input
                    type="textarea"
                    v-model="commentForm.content"
                    placeholder="请输入您的留言..."
                    :rows="3"
                    maxlength="500"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button 
                    type="primary" 
                    @click="submitComment" 
                    :loading="commentSubmitting"
                    size="small"
                  >
                    发表留言
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="login-prompt" v-else>
              <el-alert
                title="请登录后发表留言"
                type="info"
                show-icon
                :closable="false"
              >
                <el-button type="text" @click="$router.push('/login')">立即登录</el-button>
                <el-button type="text" @click="$router.push('/register')">注册账号</el-button>
              </el-alert>
            </div>
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
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { Picture, ChatDotRound, Phone } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Layout from '@/components/Layout.vue'
import ProductCard from '@/components/ProductCard.vue'
import { productApi, orderApi, reviewApi, statisticsApi, commentApi, userApi } from '@/api'
import {
  formatPrice,
  formatPaymentMethod,
  formatProductStatus,
  formatUserStatus,
  formatDate,
  getProductStatusType,
  getUserStatusType
} from '@/utils/format'
import { useSingleDataFetch } from '@/composables/useDataFetch'

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
    
    // 二手物品数据
    const product = ref({})
    const loading = ref(true)
    const averageRating = ref(0)
    const reviewCount = ref(0)
    const reviews = ref([])
    const relatedProducts = ref([])
    const sellerStats = ref({ published: 0, completed: 0 })
    const currentImageIndex = ref(0)
    const comments = ref([]) // 添加留言数据
    const commentForm = ref({ content: '' }) // 留言表单
    const commentFormRef = ref(null) // 留言表单引用
    const commentSubmitting = ref(false) // 留言提交状态
    
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
    
    // 计算属性：处理图片数组
    const productImages = computed(() => {
      if (product.value.imageUrls && typeof product.value.imageUrls === 'string') {
        // 将逗号分隔的字符串转换为数组
        return product.value.imageUrls.split(',').filter(url => url.trim()).map(processImageUrl)
      } else if (Array.isArray(product.value.imageUrls)) {
        return product.value.imageUrls.map(processImageUrl)
      } else {
        // 如果没有多图，使用单图
        const mainImage = product.value.mainImageUrl || product.value.imageUrl
        return mainImage ? [processImageUrl(mainImage)] : []
      }
    })
    
    // 当前显示的图片
    const currentImage = computed(() => {
      if (productImages.value.length > 0) {
        return productImages.value[currentImageIndex.value]
      }
      return null
    })
    
    // 计算属性
    const isLoggedIn = computed(() => store.getters.isLoggedIn)
    const userId = computed(() => store.state.user?.id)
    const productId = computed(() => route.params.id)
    
    // 获取二手物品详情
    const fetchProductDetail = async () => {
      try {
        loading.value = true
        // 确保使用字符串ID保持精度
        const idStr = typeof productId.value === 'string' ? productId.value : String(productId.value)
        const response = await productApi.getProductById(idStr)
        product.value = response.data.data
        
        // 如果商品信息中没有完整的用户信息，则根据用户ID获取用户视图
        if (product.value.userId && !product.value.user) {
          try {
            const userResponse = await userApi.getUserVOById(product.value.userId)
            if (userResponse.data.code === 200) {
              product.value.user = userResponse.data.data
            }
          } catch (userError) {
            console.error('获取卖家信息失败:', userError)
          }
        }
        
        // 获取二手物品留言
        const commentsResponse = await commentApi.getCommentTree(productId.value)
        comments.value = commentsResponse.data.data || []
        
        // 获取卖家统计信息
        if (product.value.user) {
          await fetchSellerStats(product.value.user.id)
        }
        
        // 获取相关二手物品（同分类）
        if (product.value.categoryId) {
          await fetchRelatedProducts(product.value.categoryId)
        }
      } catch (error) {
        console.error('获取二手物品详情失败:', error)
        ElMessage.error('二手物品不存在或已被删除')
        router.push('/products')
      } finally {
        loading.value = false
      }
    }
    
    // 获取卖家统计信息
    const fetchSellerStats = async (sellerId) => {
      try {
        // 获取卖家发布的二手物品
        const productsResponse = await productApi.getProductListByUser(sellerId, {
          current: 1,
          size: 1
        })
        sellerStats.value.published = productsResponse.data.data.total || 0
        
        // 获取卖家订单统计
        const statsResponse = await statisticsApi.getUserTradeStatistics(sellerId)
        if (statsResponse.data.code === 200) {
          const stats = statsResponse.data.data
          sellerStats.value.completed = stats.totalSales || 0
        }
      } catch (error) {
        console.error('获取卖家统计失败:', error)
      }
    }
    
    // 获取相关二手物品
    const fetchRelatedProducts = async (categoryId) => {
      try {
        const response = await productApi.advancedSearchProducts({
          categoryId: categoryId,
          current: 1,
          size: 4
        })
        const products = response.data.data.records || []
        
        // 排除当前二手物品
        relatedProducts.value = products.filter(item => item.id !== productId.value)
      } catch (error) {
        console.error('获取相关二手物品失败:', error)
      }
    }
    
    // 创建订单
    const createOrder = async () => {
      try {
        const response = await orderApi.createOrder(productId.value)
        
        if (response.data.code === 200) {
          ElMessage.success('订单创建成功')
          router.push(`/orders/${response.data.data}`)
        } else {
          ElMessage.error(response.data.message || '订单创建失败')
        }
      } catch (error) {
        console.error('创建订单失败:', error)
        ElMessage.error('创建订单失败')
      }
    }
    
    // 联系卖家
    const contactSeller = () => {
      ElMessage.info('联系功能正在开发中')
    }
    
    // 查看卖家二手物品
    const viewSellerProducts = () => {
      router.push({
        name: 'ProductList',
        query: { userId: product.value.user.id }
      })
    }
    
    // 跳转到用户个人资料页面
    const goToUserProfile = (userId) => {
      router.push(`/user/${userId}`)
    }
    
    // 查看所有评价
    const showAllReviews = () => {
      // 这里可以跳转到评价页面或打开对话框
      ElMessage.info('查看所有留言功能正在开发中')
    }
    
    // 获取操作按钮文本
    const getActionText = () => {
      if (product.value.status !== 1) {
        return '二手物品不可购买'
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
    
    // 提交留言
    const submitComment = async () => {
      if (!commentFormRef.value) return
      
      try {
        await commentFormRef.value.validate()
        commentSubmitting.value = true
        
        const commentData = {
          productId: productId.value,
          content: commentForm.value.content,
          // parentId 为 null 表示一级留言，非 null 表示回复的留言
          parentId: null,
          // replyUserId 为 null 表示不是回复具体用户
          replyUserId: null
        }
        
        const response = await commentApi.addComment(commentData)
        
        if (response.data.code === 200) {
          ElMessage.success('留言发表成功')
          commentForm.value.content = '' // 清空表单
          
          // 重新获取留言列表
          const commentsResponse = await commentApi.getCommentTree(productId.value)
          comments.value = commentsResponse.data.data || []
        } else {
          ElMessage.error(response.data.message || '留言发表失败')
        }
      } catch (error) {
        console.error('留言发表失败:', error)
        ElMessage.error('留言发表失败')
      } finally {
        commentSubmitting.value = false
      }
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
      comments, // 添加comments
      commentForm, // 添加commentForm
      commentFormRef, // 添加commentFormRef
      commentSubmitting, // 添加commentSubmitting
      relatedProducts,
      sellerStats,
      productImages,
      currentImage,
      currentImageIndex,
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
      goToUserProfile, // 添加 goToUserProfile
      showAllReviews,
      submitComment, // 添加submitComment
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

.product-info-card,
.review-card {
  height: auto;
  display: block;
}

.seller-info-card, .review-card {
  margin-bottom: 20px;
  flex: none;
  display: block;
}

.seller-info-card :deep(.el-card__body),
.review-card :deep(.el-card__body) {
  flex: none;
  display: block;
}

.review-card :deep(.el-card__body) > div {
  flex: none;
  display: block;
}

.review-card :deep(.el-card__body) > div > div {
  flex: none;
  display: block;
}

.product-gallery {
  margin-bottom: 20px;
}

.main-image {
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
}

.main-image img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

/* 缩略图列表样式 */
.thumbnail-list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 8px 0;
}

.thumbnail-item {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.thumbnail-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.thumbnail-item.active {
  border-color: #409eff;
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.2);
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  align-items: center;
}

/* 卖家联系方式样式（内联版） */
.seller-contact-inline {
  display: flex;
  align-items: center;
}

.seller-contact-item {
  display: flex;
  align-items: center;
}

.seller-mini-avatar {
  margin-right: 8px;
}

.seller-name {
  font-size: 14px;
  color: #606266;
  margin-right: 8px;
}

.seller-phone-inline {
  font-size: 14px;
  color: #909399;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  color: #409eff;
}

.review-user.clickable:hover {
  text-decoration: underline;
}

.seller-info-card, .review-card {
  margin-bottom: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.seller-info-card :deep(.el-card__body),
.review-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
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

.review-list-container {
  flex: none;
  overflow-y: auto;
  max-height: 400px;
}

.review-list {
  max-height: none;
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
  margin-top: var(--spacing-xl);
}

.empty-reviews {
  padding: var(--spacing-xl) 0;
}

.loading-container {
  padding: var(--spacing-xl);
}

/* 留言表单样式 */
.add-comment-form {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.login-prompt {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style>