<template>
  <Layout>
    <div class="order-detail-container" v-if="!loading && order">
      <el-card class="order-card">
        <template #header>
          <div class="card-header">
            <span>订单详情</span>
            <el-tag :type="getOrderStatusType(order.status)" size="large">
              {{ formatOrderStatus(order.status) }}
            </el-tag>
          </div>
        </template>
        
        <div class="order-info">
          <el-descriptions title="订单信息" :column="2" border>
            <el-descriptions-item label="订单号">{{ order.id }}</el-descriptions-item>
            <el-descriptions-item label="订单状态">
              <el-tag :type="getOrderStatusType(order.status)" size="small">
                {{ formatOrderStatus(order.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ formatDate(order.createTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="完成时间" v-if="order.finishTime">
              {{ formatDate(order.finishTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="支付方式">
              {{ formatPaymentMethod(order.paymentMethod) }}
            </el-descriptions-item>
            <el-descriptions-item label="订单金额">¥{{ formatPrice(order.amount) }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <!-- 二手物品详细信息 -->
        <div class="product-detail-section">
          <h3>二手物品详情</h3>
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
              <el-card class="order-status-card">
                <template #header>
                  <span>订单状态</span>
                </template>
                <div class="status-info">
                  <div class="status-item">
                    <span class="label">当前状态:</span>
                    <el-tag :type="getOrderStatusType(order.status)" size="large">
                      {{ formatOrderStatus(order.status) }}
                    </el-tag>
                  </div>
                  <div class="status-item">
                    <span class="label">支付方式:</span>
                    <span>{{ formatPaymentMethod(order.paymentMethod) }}</span>
                  </div>
                  <div class="status-item">
                    <span class="label">订单金额:</span>
                    <span class="price">¥{{ formatPrice(order.amount) }}</span>
                  </div>
                  <div class="status-item">
                    <span class="label">创建时间:</span>
                    <span>{{ formatDate(order.createTime) }}</span>
                  </div>
                  <div v-if="order.finishTime" class="status-item">
                    <span class="label">完成时间:</span>
                    <span>{{ formatDate(order.finishTime) }}</span>
                  </div>
                </div>
                
                <!-- 订单操作按钮 -->
                <div class="order-actions" v-if="isBuyer || isSeller">
                  <el-button 
                    v-if="isBuyer && order.status === 2 && !order.buyerConfirmed" 
                    type="success" 
                    size="large" 
                    @click="confirmOrder(order.id)"
                  >
                    确认收货
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        

        
        <!-- 订单操作 -->
        <div class="order-actions">
          <el-button @click="$router.go(-1)">返回</el-button>
          
          <!-- 买家操作 -->
          <template v-if="isBuyer">
            <el-button
              v-if="order.status === 0"
              type="danger"
              @click="cancelOrder"
            >
              取消订单
            </el-button>
            <el-button
              v-if="order.status === 1 && !order.buyerConfirmed"
              type="success"
              @click="confirmOrder"
            >
              确认收货
            </el-button>
          </template>
        </div>
      </el-card>
    </div>
    
    <div v-else class="loading-container">
      <el-skeleton animated />
    </div>
    

  </Layout>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { Picture } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import ProductInfoCard from '@/components/ProductInfoCard.vue'
import { orderApi, productApi, userApi } from '@/api'
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
    

    const productDetail = ref(null)
    const productLoading = ref(false)
    
    // 计算属性
    const user = computed(() => store.state.user)
    const orderId = computed(() => route.params.id)
    const isBuyer = computed(() => user.value && order.value && order.value.buyer && user.value.id === order.value.buyer.id)
    const isSeller = computed(() => user.value && order.value && order.value.seller && user.value.id === order.value.seller.id)
    
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
        fetchOrderDetail(route.params.id)
      }
    }, { immediate: true })
    
    return {
      loading,
      order,
      productDetail,
      productLoading,
      isBuyer,
      isSeller,
      formatPrice,
      formatPaymentMethod,
      formatOrderStatus,
      formatUserStatus,
      formatDate,
      getOrderStatusType,
      getUserStatusType,
      cancelOrder,
      confirmOrder,
      handleImageError
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
  flex-direction: column;
}

.order-actions .el-button {
  width: 100%;
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
}
</style>
