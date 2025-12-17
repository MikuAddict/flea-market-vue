<template>
  <Layout>
    <!-- 商品已售出时显示订单详情 -->
    <div class="order-detail-container" v-if="!loading && product && product.status === 2">
      <el-card class="unified-card order-card">
        <template #header>
          <div class="unified-flex unified-flex-between unified-w-full">
            <span>商品已售出 - 订单详情</span>
          </div>
        </template>
        
        <!-- 二手物品详细信息 -->
        <div class="product-detail-section">
          <el-row :gutter="20">
            <el-col :xs="24" :lg="14">
              <ProductInfoCard
                :product="product"
                :show-actions="false"
                :show-login-notice="false"
                :seller-avatar-size="40"
                @seller-click="(userId) => $router.push(`/user/${userId}`)"
                @image-error="handleImageError"
              >
              </ProductInfoCard>
            </el-col>
            
            <el-col :xs="24" :lg="10">
              <!-- 订单状态信息 -->
              <el-card class="unified-card order-status-card">
                <template #header>
                  <span>商品状态</span>
                </template>
                <div class="unified-flex unified-flex-col unified-gap-base status-info">
                  <div class="unified-flex unified-flex-between status-item">
                    <span class="label">当前状态:</span>
                    <el-tag type="success" size="large">
                      已售出
                    </el-tag>
                  </div>
                  <div class="unified-flex unified-flex-between status-item">
                    <span class="label">支付方式:</span>
                    <span>{{ formatPaymentMethod(product.paymentMethod) }}</span>
                  </div>
                  <div class="unified-flex unified-flex-between status-item">
                    <span class="label">商品价格:</span>
                    <span class="price">¥{{ formatPrice(product.price) }}</span>
                  </div>
                  <div class="status-item">
                    <span class="label">创建时间:</span>
                    <span>{{ formatDate(product.createTime) }}</span>
                  </div>
                </div>
                
                <!-- 查看订单按钮 -->
                <div class="order-actions" v-if="isLoggedIn && isOrderOwner">
                  <el-button
                    class="unified-button unified-button-primary"
                    size="large"
                    @click="viewOrderDetail"
                  >
                    查看我的订单
                  </el-button>
                </div>
                
                <!-- 非订单所有者提示 -->
                <div v-if="isLoggedIn && !isOrderOwner" class="order-notice">
                  <el-alert
                    title="该商品已被其他用户购买"
                    type="info"
                    :closable="false"
                    show-icon
                  >
                    <p>您可以浏览其他类似商品</p>
                  </el-alert>
                </div>
              </el-card>
              
              <!-- 二手物品留言 -->
              <el-card class="unified-card review-card" v-if="product.id">
                <template #header>
                  <div class="unified-flex unified-flex-between unified-w-full">
                    <span>二手物品留言</span>
                  </div>
                </template>
                <div v-if="comments.length === 0" class="unified-empty">
                  <el-icon size="60" color="var(--text-placeholder)"><ChatDotRound /></el-icon>
                  <p>暂无留言</p>
                </div>
                <div v-else>
                  <div class="review-list-container">
                    <div class="review-list">
                      <div v-for="comment in comments" :key="comment.id" class="unified-review-item">
                        <div class="unified-review-header">
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
                        <div class="unified-review-content">{{ comment.content }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    
    <!-- 商品未售出时显示正常商品详情 -->
    <div class="product-detail-container" v-else-if="!loading">
      <el-row :gutter="20">
        <!-- 左侧二手物品信息 -->
        <el-col :xs="24" :lg="14">
          <ProductInfoCard
            :product="product"
            :show-login-notice="!isLoggedIn"
            :default-action="isLoggedIn && product.user?.id && userId && !compareBigIntIds(product.user.id, userId) && product.status === 1"
            :default-action-text="getActionText()"
            @action-click="createOrder"
            @seller-click="goToUserProfile"
            @image-error="handleImageError"
          >
          </ProductInfoCard>
        </el-col>

        <el-col :xs="24" :lg="10">
          <!-- 二手物品留言 -->
          <el-card class="unified-card review-card" v-if="product.id">
            <template #header>
              <div class="unified-flex unified-flex-between unified-w-full">
                <span>二手物品留言</span>
              </div>
            </template>
            <div v-if="comments.length === 0" class="unified-empty">
              <el-icon size="60" color="var(--text-placeholder)"><ChatDotRound /></el-icon>
              <p>暂无留言</p>
            </div>
            <div v-else>
              <div class="review-list-container">
                <div class="review-list">
                  <div v-for="comment in comments" :key="comment.id" class="unified-review-item">
                    <div class="unified-review-header">
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
                    <div class="unified-review-content">{{ comment.content }}</div>
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
                    class="unified-button unified-button-primary unified-w-auto"
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
import ProductInfoCard from '@/components/ProductInfoCard.vue'
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
import { compareBigIntIds } from '@/utils/bigIntHandler'
import { useSingleDataFetch } from '@/composables/useDataFetch'

export default {
  name: 'ProductDetail',
  components: {
    Layout,
    ProductInfoCard,
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
    const comments = ref([]) // 添加留言数据
    const commentForm = ref({ content: '' }) // 留言表单
    const commentFormRef = ref(null) // 留言表单引用
    const commentSubmitting = ref(false) // 留言提交状态
    
    // 订单相关数据
    const orderInfo = ref(null)
    const isOrderOwner = ref(false)
    
    // 计算属性
    const isLoggedIn = computed(() => store.getters.isLoggedIn)
    const userId = computed(() => store.state.user?.id)
    const productId = computed(() => route.params.id)
    
    // 卖家统计数据
    const sellerStats = ref({
      published: 0,
      sold: 0,
      reviews: 0
    })
    
    // 相关二手物品数据
    const relatedProducts = ref([])
    
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
        
        // 如果商品已售出，获取订单信息
        if (product.value.status === 2) {
          await fetchOrderInfo()
        }
        
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
    
    // 获取订单信息
    const fetchOrderInfo = async () => {
      try {
        // 通过获取买家订单列表来查找对应商品的订单
        if (isLoggedIn.value) {
          const response = await orderApi.getBuyerOrderList({
            current: 1,
            size: 100 // 获取足够多的订单来查找
          })
          
          if (response.data.code === 200 && response.data.data?.records) {
            // 查找包含当前商品ID的订单
            const foundOrder = response.data.data.records.find(order => 
              order.productId && compareBigIntIds(order.productId, productId.value)
            )
            
            if (foundOrder) {
              orderInfo.value = foundOrder
              isOrderOwner.value = true
            } else {
              orderInfo.value = null
              isOrderOwner.value = false
            }
          }
        }
      } catch (error) {
        console.error('获取订单信息失败:', error)
        orderInfo.value = null
        isOrderOwner.value = false
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
      } catch (error) {
        console.error('获取卖家统计失败:', error)
      }
    }
    
    // 获取相关二手物品
    const fetchRelatedProducts = async (categoryId) => {
      try {
        const response = await productApi.getProductList({
          current: 1,
          size: 5,
          categoryId: categoryId,
          status: 1
        })
        
        // 过滤掉当前商品
        if (response.data.code === 200 && response.data.data?.records) {
          relatedProducts.value = response.data.data.records.filter(
            p => !compareBigIntIds(p.id, productId.value)
          )
        }
      } catch (error) {
        console.error('获取相关二手物品失败:', error)
        relatedProducts.value = []
      }
    }
    
    // 创建订单
    const createOrder = async () => {
      try {
        // 确保productId是字符串类型，避免精度丢失
        const productIdStr = typeof productId.value === 'string' ? productId.value : String(productId.value)
        const response = await orderApi.createOrder(productIdStr)
        
        if (response.data.code === 200) {
          ElMessage.success('订单创建成功')
          router.push(`/orders/${response.data.data}`)
        } else {
          ElMessage.error(response.data.message || '订单创建失败')
        }
      } catch (error) {
        console.error('创建订单失败:', error)
        ElMessage.error('创建订单失败: ' + (error.message || '系统异常，请稍后重试'))
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
    
    // 查看订单详情
    const viewOrderDetail = () => {
      if (orderInfo.value && orderInfo.value.id) {
        router.push(`/orders/${orderInfo.value.id}`)
      } else {
        ElMessage.error('订单信息不存在')
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
      comments, // 添加comments
      commentForm, // 添加commentForm
      commentFormRef, // 添加commentFormRef
      commentSubmitting, // 添加commentSubmitting
      sellerStats, // 添加sellerStats
      relatedProducts, // 添加relatedProducts
      isLoggedIn,
      userId,
      isOrderOwner,
      formatPrice,
      formatPaymentMethod,
      formatProductStatus,
      formatUserStatus,
      formatDate,
      getProductStatusType,
      getUserStatusType,
      compareBigIntIds, // 添加compareBigIntIds
      createOrder,
      contactSeller,
      viewSellerProducts,
      goToUserProfile, // 添加 goToUserProfile
      showAllReviews,
      submitComment, // 添加submitComment
      viewOrderDetail, // 添加viewOrderDetail
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

.review-card {
  margin-bottom: var(--spacing-lg);
}

.review-card :deep(.el-card__body) {
  flex: none;
  display: block;
}

.product-gallery {
  margin-bottom: var(--spacing-lg);
}

.main-image {
  text-align: center;
  background-color: var(--bg-light);
  border-radius: var(--border-radius-base);
  overflow: hidden;
  margin-bottom: var(--spacing-base);
}

.main-image img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

/* 缩略图列表样式 */
.thumbnail-list {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
  padding: var(--spacing-sm) 0;
}

.thumbnail-item {
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-base);
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all var(--transition-base);
  flex-shrink: 0;
}

.thumbnail-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.thumbnail-item.active {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.2);
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-basic-info {
  padding: 0 var(--spacing-sm);
}

.product-name {
  margin: 0 0 var(--spacing-base) 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.product-price {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-base);
}

.price-label {
  font-size: var(--font-size-base);
  color: var(--text-regular);
  margin-right: var(--spacing-sm);
}

.price-value {
  font-size: 28px;
  font-weight: var(--font-bold);
  color: var(--danger-color);
}

.product-meta {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.product-description {
  margin-bottom: var(--spacing-lg);
}

.product-description h4 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-base);
}

.product-description p {
  margin: 0;
  color: var(--text-regular);
  line-height: var(--leading-relaxed);
}

.product-actions {
  display: flex;
  gap: var(--spacing-base);
  margin-bottom: var(--spacing-lg);
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
  margin-right: var(--spacing-sm);
}

.seller-name {
  font-size: var(--font-size-sm);
  color: var(--text-regular);
  margin-right: var(--spacing-sm);
}

.seller-phone-inline {
  font-size: var(--font-size-sm);
  color: var(--text-placeholder);
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  color: var(--primary-color);
}

.review-user.clickable:hover {
  text-decoration: underline;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.seller-profile {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.seller-details {
  margin-left: var(--spacing-base);
  flex: 1;
}

.seller-details h3 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-lg);
}

.seller-phone {
  display: flex;
  align-items: center;
  margin-top: var(--spacing-sm);
  color: var(--text-regular);
}

.seller-phone .el-icon {
  margin-right: var(--spacing-xs);
}

.seller-stats {
  margin-bottom: var(--spacing-lg);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-placeholder);
  margin-top: var(--spacing-xs);
}

.seller-actions {
  margin-top: var(--spacing-sm);
}

.review-summary {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-base);
}

.rating-text {
  margin-left: var(--spacing-sm);
  color: var(--text-regular);
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
  border-bottom: 1px solid var(--border-light);
  padding-bottom: var(--spacing-base);
  margin-bottom: var(--spacing-base);
}

.review-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.review-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.review-info {
  flex: 1;
  margin-left: var(--spacing-sm);
}

.review-user {
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xs);
}

.review-time {
  font-size: var(--font-size-sm);
  color: var(--text-placeholder);
}

.review-content {
  color: var(--text-regular);
  font-size: var(--font-size-sm);
  line-height: var(--leading-normal);
}

.related-products-card {
  margin-top: var(--spacing-xl);
}

.empty-reviews {
  padding: var(--spacing-xl) 0;
  text-align: center;
}

.loading-container {
  padding: var(--spacing-xl);
}

/* 留言表单样式 */
.add-comment-form {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-light);
}

.login-prompt {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-light);
}
</style>