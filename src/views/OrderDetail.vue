<template>
  <Layout>
    <div class="order-detail-container" v-if="!loading && order">
      <el-card class="unified-card order-card">
        <template #header>
          <div class="unified-flex unified-flex-between unified-w-full">
            <span>订单详情</span>
          </div>
        </template>
        
        <!-- 二手物品详细信息 -->
        <div class="product-detail-section">
          <el-row :gutter="20">
            <el-col :xs="24" :lg="14">
              <div v-if="productDetail">
                <ProductInfoCard
                  :product="productDetail"
                  :show-actions="false"
                  :show-login-notice="false"
                  :seller-avatar-size="40"
                  @seller-click="(userId) => $router.push(`/user/${userId}`)"
                  @image-error="handleImageError"
                >
                </ProductInfoCard>
              </div>
              <div v-else-if="productLoading" class="loading-container">
                <el-skeleton :rows="5" animated />
              </div>
              <el-empty v-else description="二手物品信息不存在或已被删除" />
            </el-col>
            
            <el-col :xs="24" :lg="10">
              <!-- 订单状态信息 -->
              <el-card class="unified-card order-status-card">
                <template #header>
                  <span>订单状态</span>
                </template>
                <div class="unified-flex unified-flex-col unified-gap-base status-info">
                  <div class="unified-flex unified-flex-between status-item">
                    <span class="label">当前状态:</span>
                    <el-tag :type="getOrderStatusType(order.status)" size="large">
                      {{ formatOrderStatus(order.status) }}
                    </el-tag>
                  </div>
                  <div class="unified-flex unified-flex-between status-item">
                    <span class="label">支付方式:</span>
                    <span>{{ formatPaymentMethod(order.paymentMethod) }}</span>
                  </div>
                  <div class="unified-flex unified-flex-between status-item">
                    <span class="label">订单金额:</span>
                    <span class="price">¥{{ formatPrice(order.amount) }}</span>
                  </div>
                  <div class="status-item">
                    <span class="label">创建时间:</span>
                    <span>{{ formatDate(order.createTime) }}</span>
                  </div>
                  <div v-if="order.finishTime" class="status-item">
                     <span class="label">{{ order.status === 3 ? '取消时间' : '完成时间' }}:</span>
                    <span>{{ formatDate(order.finishTime) }}</span>
                  </div>
                </div>
                
                <!-- 订单操作按钮 -->
                <div class="order-actions" v-if="isBuyer">
                  <el-button
                    v-if="order.status === 0"
                    type="primary"
                    size="large"
                    @click="payOrder"
                  >
                    立即支付
                  </el-button>
                  <el-button
                    v-if="(order.status === 1 || order.status === 0)"
                    type="danger"
                    size="large"
                    @click="cancelOrder"
                  >
                    取消订单
                  </el-button>
                  <el-button
                    v-if="order.status === 1"
                    type="success"
                    size="large"
                    @click="confirmOrder"
                  >
                    确认收货
                  </el-button>
                  <el-button
                    v-if="order.status === 2 && !hasReviewed"
                    type="primary"
                    size="large"
                    @click="showReviewDialog = true"
                    :loading="checkingReview"
                  >
                    发布评论
                  </el-button>
                </div>
              </el-card>
              
              <!-- 买家评论展示 -->
              <el-card class="unified-card review-card" v-if="orderReview && order.status === 2">
                <template #header>
                  <div class="unified-flex unified-flex-between unified-w-full">
                    <span>买家评论</span>
                  </div>
                </template>
                <div class="unified-review-item" v-if="orderReview">
                  <!-- 买家信息 -->
                  <div class="unified-review-header unified-flex unified-flex-center unified-flex-between">
                    <div class="buyer-details unified-flex unified-flex-center">
                      <el-avatar 
                        :size="40" 
                        :src="orderReview.userAvatar" 
                        class="buyer-avatar"
                      >
                        {{ orderReview.userName?.charAt(0) }}
                      </el-avatar>
                      <div class="buyer-text">
                        <div class="buyer-name">{{ orderReview.userName }}</div>
                      </div>
                    </div>
                    <span class="review-time unified-text-secondary">{{ formatDate(orderReview.createTime) }}</span>
                  </div>
                  
                  <!-- 评分展示 -->
                  <div class="unified-review-rating" v-if="orderReview.rating">
                    <el-rate
                      v-model="orderReview.rating"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template=""
                    />
                  </div>
                  
                  <div class="unified-review-content">
                    <p class="unified-review-text">{{ orderReview.content }}</p>
                  </div>
                </div>
                <div v-else class="unified-empty unified-flex unified-flex-col unified-flex-center">
                  <el-icon size="60" color="var(--text-placeholder)"><Star /></el-icon>
                  <p class="unified-empty-text">暂无评论</p>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-card>
      
      <!-- 发布评论对话框 -->
      <el-dialog
        v-model="showReviewDialog"
        title="发布评论"
        width="500px"
        :before-close="handleReviewDialogClose"
      >
        <el-form
          ref="reviewFormRef"
          :model="reviewForm"
          :rules="reviewRules"
          label-width="80px"
        >
          <el-form-item label="评分" prop="rating">
            <el-rate v-model="reviewForm.rating" />
          </el-form-item>
          <el-form-item label="评论内容" prop="content">
            <el-input
              v-model="reviewForm.content"
              type="textarea"
              :rows="4"
              placeholder="请输入您的评论内容"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleReviewDialogClose">取消</el-button>
            <el-button type="primary" @click="submitReview">提交</el-button>
          </span>
        </template>
      </el-dialog>

    </div>
    
    <div v-else class="loading-container">
      <el-skeleton animated />
    </div>
  </Layout>
</template>

<script>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { Picture, Star } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import ProductInfoCard from '@/components/ProductInfoCard.vue'
import { orderApi, productApi, userApi, reviewApi } from '@/api'
import {
  formatPrice,
  formatPaymentMethod,
  formatOrderStatus,
  formatUserStatus,
  formatDate,
  getOrderStatusType,
  getUserStatusType
} from '@/utils/format'
import { useSingleDataFetch } from '@/composables/useDataFetch'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'OrderDetail',
  components: {
    Layout,
    Picture,
    Star,
    ProductInfoCard
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    // 使用单条数据获取组合函数
    const {
      loading,
      data: order,
      fetchData: fetchOrderDetail
    } = useSingleDataFetch({
      apiFunction: orderApi.getOrderById,
      params: route.params.id,
      errorMessage: '订单不存在或已被删除'
    })
    
    // 评论相关
    const showReviewDialog = ref(false)
    const reviewFormRef = ref(null)
    const hasReviewed = ref(false)
    const checkingReview = ref(false)
    const orderReview = ref(null)
    
    const reviewForm = reactive({
      rating: 5,
      content: ''
    })
    
    const reviewRules = {
      rating: [
        { required: true, message: '请选择评分', trigger: 'change' }
      ],
      content: [
        { required: true, message: '请输入评论内容', trigger: 'blur' },
        { min: 5, max: 200, message: '评论内容长度应在5到200个字符之间', trigger: 'blur' }
      ]
    }

    const productDetail = ref(null)
    const productLoading = ref(false)
    
    // 计算属性
    const user = computed(() => store.state.user)
    const orderId = computed(() => route.params.id)
    const isBuyer = computed(() => {
      return user.value && order.value && user.value.id === order.value.buyerId
    })
    
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
    
    // 获取二手物品详情
    const fetchProductDetail = async (productId) => {
      if (!productId) return
      
      productLoading.value = true
      try {
        const response = await productApi.getProductById(productId)
        if (response.data.code === 200) {
          productDetail.value = response.data.data
          
          // 处理商品图片URL
          if (productDetail.value) {
            // 优先使用mainImageUrl，如果没有则使用imageUrl
            const imageUrl = productDetail.value.mainImageUrl || productDetail.value.imageUrl
            if (imageUrl) {
              productDetail.value.imageUrl = processImageUrl(imageUrl)
            }
          }
          
          // 如果商品信息中没有完整的用户信息，则根据用户ID获取用户视图
          if (productDetail.value.userId && !productDetail.value.user) {
            try {
              const userResponse = await userApi.getUserVOById(productDetail.value.userId)
              if (userResponse.data.code === 200) {
                productDetail.value.user = userResponse.data.data
                
                // 处理卖家头像URL
                if (productDetail.value.user && productDetail.value.user.userAvatar) {
                  productDetail.value.user.userAvatar = processImageUrl(productDetail.value.user.userAvatar)
                }
              }
            } catch (userError) {
              console.error('获取卖家信息失败:', userError)
            }
          }
        }
      } catch (error) {
        console.error('获取二手物品详情失败:', error)
        productDetail.value = null
      } finally {
        productLoading.value = false
      }
    }
    
    // 监听订单数据变化，获取二手物品详情
    watch(() => order.value, (newOrder) => {
      if (newOrder && newOrder.productId) {
        fetchProductDetail(newOrder.productId)
      } else {
        productDetail.value = null
      }
    })
    
    // 组件挂载时获取二手物品详情
    onMounted(() => {
      if (order.value && order.value.productId) {
        fetchProductDetail(order.value.productId)
      }
    })
    
    // 支付订单
    const payOrder = async () => {
      try {
        await ElMessageBox.confirm(
          '确定要支付这个订单吗？',
          '支付确认',
          {
            confirmButtonText: '确定支付',
            cancelButtonText: '取消',
            type: 'info'
          }
        )
        
        await orderApi.payOrder(orderId.value)
        ElMessage.success('订单支付成功')
        await fetchOrderDetail()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('支付订单失败:', error)
          ElMessage.error('支付订单失败')
        }
      }
    }
    
    // 取消订单
    const cancelOrder = async () => {
      try {
        await ElMessageBox.confirm(
          '确定要取消这个订单吗？',
          '取消确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        await orderApi.cancelOrder(orderId.value)
        ElMessage.success('订单已取消')
        await fetchOrderDetail()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('取消订单失败:', error)
          ElMessage.error('取消订单失败')
        }
      }
    }
    
    // 确认收货
    const confirmOrder = async () => {
      try {
        await ElMessageBox.confirm(
          '确认已收到二手物品吗？确认后订单将完成。',
          '确认收货',
          {
            confirmButtonText: '确认收货',
            cancelButtonText: '取消',
            type: 'info'
          }
        )
        
        await orderApi.confirmOrder(orderId.value)
        ElMessage.success('订单已完成')
        await fetchOrderDetail()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('确认收货失败:', error)
          ElMessage.error('确认收货失败')
        }
      }
    }
    
    // 检查是否已评论并获取评论数据
    const checkIfReviewed = async () => {
      if (!order.value || !order.value.id) return
      
      checkingReview.value = true
      try {
        const response = await reviewApi.getReviewByOrderId(order.value.id)
        if (response.data.code === 200 && response.data.data) {
          hasReviewed.value = true
          orderReview.value = response.data.data
          
          // 处理用户头像URL
          if (orderReview.value.userAvatar) {
            orderReview.value.userAvatar = processImageUrl(orderReview.value.userAvatar)
          }
        } else {
          hasReviewed.value = false
          orderReview.value = null
        }
      } catch (error) {
        console.error('检查评论状态失败:', error)
        hasReviewed.value = false
        orderReview.value = null
      } finally {
        checkingReview.value = false
      }
    }
    
    // 监听订单数据变化，检查是否已评论
    watch(() => order.value, (newOrder) => {
      if (newOrder && newOrder.status === 2) {
        // 初始化评论状态为true，避免闪烁
        hasReviewed.value = true
        checkIfReviewed()
      } else {
        hasReviewed.value = false
      }
    })
    
    // 关闭评论对话框
    const handleReviewDialogClose = () => {
      showReviewDialog.value = false
      reviewForm.rating = 5
      reviewForm.content = ''
      if (reviewFormRef.value) {
        reviewFormRef.value.resetFields()
      }
    }
    
    // 提交评论
    const submitReview = async () => {
      if (!reviewFormRef.value) return
      
      try {
        await reviewFormRef.value.validate()
        
        const reviewData = {
          orderId: order.value.id,
          productId: order.value.productId,
          rating: reviewForm.rating,
          content: reviewForm.content
        }
        
        const response = await reviewApi.addReview(reviewData)
        if (response.data.code === 200) {
          ElMessage.success('评论发布成功')
          handleReviewDialogClose()
          hasReviewed.value = true
          
          // 获取新发布的评论数据
          const reviewResponse = await reviewApi.getReviewByOrderId(order.value.id)
          if (reviewResponse.data.code === 200 && reviewResponse.data.data) {
            orderReview.value = reviewResponse.data.data
            
            // 处理用户头像URL
            if (orderReview.value.userAvatar) {
              orderReview.value.userAvatar = processImageUrl(orderReview.value.userAvatar)
            }
          }
          
          // 刷新订单详情以更新按钮状态
          await fetchOrderDetail()
        } else {
          throw new Error(response.data.message || '评论发布失败')
        }
      } catch (error) {
        console.error('发布评论失败:', error)
        ElMessage.error(error.message || '评论发布失败')
      }
    }
    
    // 图片加载错误处理
    const handleImageError = (event) => {
      event.target.style.display = 'none'
      if (event.target.nextElementSibling) {
        event.target.nextElementSibling.style.display = 'flex'
      }
    }
    
    // 监听路由参数变化
    watch(() => route.params.id, () => {
      if (route.params.id) {
        // 重置评论状态
        hasReviewed.value = false
        fetchOrderDetail(route.params.id)
      }
    }, { immediate: true })
    
    return {
      loading,
      order,
      productDetail,
      productLoading,
      isBuyer,
      formatPrice,
      formatPaymentMethod,
      formatOrderStatus,
      formatUserStatus,
      formatDate,
      getOrderStatusType,
      getUserStatusType,
      payOrder,
      cancelOrder,
      confirmOrder,
      handleImageError,
      showReviewDialog,
      reviewFormRef,
      reviewForm,
      reviewRules,
      hasReviewed,
      checkingReview,
      orderReview, // 添加评论数据
      handleReviewDialogClose,
      submitReview
    }
  }
}
</script>

<style scoped>
.order-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info, .product-detail-section {
  margin-top: var(--spacing-xl);
}

.order-info h3, .product-detail-section h3 {
  margin-bottom: var(--spacing-xl);
  font-size: var(--font-size-xl);
  color: var(--text-primary);
}

/* 二手物品详情样式 */
.product-gallery {
  margin-bottom: var(--spacing-xl);
}

.main-image {
  width: 100%;
  height: 400px;
  border-radius: var(--border-radius-base);
  overflow: hidden;
  background-color: var(--bg-light);
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-placeholder);
}

.image-placeholder .el-icon {
  margin-bottom: var(--spacing-sm);
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

.product-basic-info {
  padding: var(--spacing-base);
}

.product-name {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-xxl);
  color: var(--text-primary);
  line-height: 1.3;
}

.product-price {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.price-label {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin-right: var(--spacing-sm);
}

.price-value {
  font-size: var(--font-size-xxl);
  color: var(--color-primary);
  font-weight: bold;
}

.product-meta {
  display: flex;
  gap: var(--spacing-base);
  margin-bottom: var(--spacing-lg);
}

.product-description {
  margin-bottom: var(--spacing-xl);
}

.product-description h4 {
  margin: 0 0 var(--spacing-base) 0;
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}

.product-description p {
  margin: 0;
  color: var(--text-regular);
  line-height: 1.6;
  white-space: pre-wrap;
}

/* 卖家信息样式 */
.seller-info {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.seller-info h4 {
  margin: 0 0 var(--spacing-base) 0;
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}

.seller-details {
  display: flex;
  align-items: center;
  gap: var(--spacing-base);
}

.seller-text {
  flex: 1;
}

.seller-name {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
}

.seller-contact {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* 订单状态卡片样式 */
.status-info {
  margin-bottom: var(--spacing-xl);
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-base);
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--border-color-light);
}

.status-item:last-child {
  border-bottom: none;
}

.status-item .label {
  color: var(--text-secondary);
  font-size: var(--font-size-base);
}

.status-item .price {
  font-weight: bold;
  color: var(--color-primary);
}

/* 订单操作按钮样式 */
.order-actions {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-base);
  flex-wrap: wrap;
}

.order-actions .el-button {
  width: auto;
  flex: 1;
  min-width: 120px;
}

.extra-payment-action {
  margin-top: var(--spacing-base);
  padding-top: var(--spacing-base);
  border-top: 1px solid var(--border-color-light);
}

.extra-payment-action .el-button {
  width: 100%;
}

.payment-proof img {
  max-width: 200px;
  max-height: 200px;
  border-radius: var(--border-radius-small);
}

.loading-container {
  padding: var(--spacing-xxl) 0;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  color: #409eff;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .order-detail-container {
    padding: var(--spacing-base);
  }
  
  .main-image {
    height: 300px;
  }
  
  .product-name {
    font-size: var(--font-size-xl);
  }
  
  .price-value {
    font-size: var(--font-size-xl);
  }
  
  .product-meta {
    flex-wrap: wrap;
  }
  
  .seller-details {
    flex-direction: column;
    text-align: center;
  }
  
  .status-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  
  .order-actions {
    flex-direction: column;
  }
  
  .order-actions .el-button {
    width: 100%;
  }
}

/* 评论展示样式 */
.review-card {
  margin-top: 11px;
  border-left: 4px solid var(--primary-color);
}

.unified-review-header {
  margin-bottom: var(--spacing-base);
  padding-bottom: var(--spacing-base);
  border-bottom: 1px solid var(--border-color-light);
}

.buyer-details {
  gap: var(--spacing-base);
}

.buyer-avatar {
  flex-shrink: 0;
}

.buyer-text {
  flex: 1;
}

.buyer-name {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.review-time {
  font-size: var(--font-size-sm);
}

.unified-review-rating {
  margin-bottom: var(--spacing-base);
}

.unified-review-rating :deep(.el-rate) {
  display: flex;
  align-items: center;
}

.unified-review-rating :deep(.el-rate__icon) {
  font-size: var(--font-size-md);
  margin-right: var(--spacing-xs);
}

.unified-review-rating :deep(.el-rate__text) {
  margin-left: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--text-regular);
}

.unified-review-content {
  margin-top: var(--spacing-base);
}

.unified-review-text {
  margin: 0;
  color: var(--text-regular);
  line-height: 1.6;
  white-space: pre-wrap;
}

.unified-empty {
  padding: var(--spacing-xl) 0;
  text-align: center;
}

.unified-empty-text {
  margin-top: var(--spacing-base);
  color: var(--text-placeholder);
}

@media (max-width: 768px) {
  .unified-review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-base);
  }
  
  .buyer-details {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-xs);
  }
}
</style>