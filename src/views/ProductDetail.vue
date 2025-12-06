<template>
  <div class="product-detail" v-if="product">
    <div class="product-container">
      <!-- 商品图片 -->
      <div class="product-image-section">
        <div class="main-image">
          <img :src="product.image || '/placeholder-image.png'" :alt="product.name" />
        </div>
      </div>

      <!-- 商品信息 -->
      <div class="product-info-section">
        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-description">{{ product.description }}</p>
        
        <div class="price-section">
          <span class="price">¥{{ product.price }}</span>
          <span class="sales">已售 {{ product.sales || 0 }} 件</span>
        </div>

        <div class="seller-info">
          <div class="seller-avatar">
            <el-avatar :size="40" :src="product.sellerAvatar">{{ product.sellerName?.charAt(0) }}</el-avatar>
          </div>
          <div class="seller-details">
            <div class="seller-name">{{ product.sellerName }}</div>
            <div class="seller-rating">
              <el-rate v-model="sellerRating" disabled show-score text-color="#ff9900" />
            </div>
          </div>
        </div>

        <div class="action-section" v-if="product.status === 1">
          <el-button 
            type="primary" 
            size="large" 
            @click="handleBuy"
            :disabled="!userInfo"
          >
            立即购买
          </el-button>
          <el-button 
            size="large" 
            @click="handleAddToCart"
            :disabled="!userInfo"
          >
            加入购物车
          </el-button>
        </div>

        <div class="sold-out" v-else>
          <el-alert title="该商品已售出" type="warning" show-icon />
        </div>

        <!-- 商品详情 -->
        <div class="product-details">
          <h3>商品详情</h3>
          <div class="detail-item">
            <span class="label">商品分类：</span>
            <span class="value">{{ product.categoryName }}</span>
          </div>
          <div class="detail-item">
            <span class="label">发布时间：</span>
            <span class="value">{{ formatTime(product.createTime) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">商品状态：</span>
            <span class="value">{{ product.status === 1 ? '在售' : '已售出' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论区域 -->
    <div class="reviews-section">
      <h2>商品评价</h2>
      <div class="reviews-list">
        <div 
          v-for="review in reviews" 
          :key="review.id"
          class="review-item"
        >
          <div class="review-header">
            <el-avatar :size="32" :src="review.userAvatar">{{ review.userName?.charAt(0) }}</el-avatar>
            <div class="review-user">
              <div class="user-name">{{ review.userName }}</div>
              <div class="review-time">{{ formatTime(review.createTime) }}</div>
            </div>
            <div class="review-rating">
              <el-rate v-model="review.rating" disabled size="small" />
            </div>
          </div>
          <div class="review-content">
            {{ review.content }}
          </div>
        </div>
      </div>

      <div v-if="reviews.length === 0" class="no-reviews">
        <el-empty description="暂无评价" />
      </div>
    </div>

    <!-- 购买对话框 -->
    <el-dialog v-model="showBuyDialog" title="确认购买" width="500px">
      <div class="buy-dialog-content">
        <div class="product-summary">
          <img :src="product.image || '/placeholder-image.png'" :alt="product.name" />
          <div class="summary-info">
            <h4>{{ product.name }}</h4>
            <p class="price">¥{{ product.price }}</p>
          </div>
        </div>
        
        <el-form :model="buyForm" label-width="80px">
          <el-form-item label="购买数量">
            <el-input-number v-model="buyForm.quantity" :min="1" :max="product.stock || 1" />
          </el-form-item>
          <el-form-item label="收货地址">
            <el-input v-model="buyForm.address" placeholder="请输入收货地址" />
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="buyForm.contact" placeholder="请输入联系电话" />
          </el-form-item>
        </el-form>
        
        <div class="total-price">
          总价：<span class="price">¥{{ (product.price * buyForm.quantity).toFixed(2) }}</span>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showBuyDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmBuy">确认购买</el-button>
      </template>
    </el-dialog>
  </div>

  <div v-else class="loading">
    <el-skeleton :rows="5" animated />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import defaultApi from '../api/DefaultApi'
import ApiClient from '../ApiClient'

const route = useRoute()
const router = useRouter()
const api = new DefaultApi(new ApiClient())

const product = ref(null)
const reviews = ref([])
const sellerRating = ref(4.5)
const showBuyDialog = ref(false)

const buyForm = ref({
  quantity: 1,
  address: '',
  contact: ''
})

const userInfo = computed(() => {
  const saved = localStorage.getItem('userInfo')
  return saved ? JSON.parse(saved) : null
})

onMounted(async () => {
  const productId = route.params.id
  if (productId) {
    await loadProductDetail(productId)
    await loadReviews(productId)
  }
})

const loadProductDetail = async (productId) => {
  try {
    const response = await api.getProductByIdUsingGET(productId)
    if (response.code === 200) {
      product.value = response.data
    } else {
      ElMessage.error('加载商品详情失败')
    }
  } catch (error) {
    console.error('加载商品详情失败:', error)
    ElMessage.error('加载商品详情失败')
  }
}

const loadReviews = async (productId) => {
  try {
    const response = await api.listReviewUsingGET({
      productId: productId,
      current: 1,
      size: 10
    })
    if (response.code === 200) {
      reviews.value = response.data.records || []
    }
  } catch (error) {
    console.error('加载评价失败:', error)
  }
}

const handleBuy = () => {
  if (!userInfo.value) {
    ElMessage.warning('请先登录')
    return
  }
  showBuyDialog.value = true
}

const handleAddToCart = () => {
  if (!userInfo.value) {
    ElMessage.warning('请先登录')
    return
  }
  ElMessage.success('已加入购物车')
}

const confirmBuy = async () => {
  try {
    if (!buyForm.value.address || !buyForm.value.contact) {
      ElMessage.warning('请填写完整的收货信息')
      return
    }

    const orderData = {
      productId: product.value.id,
      quantity: buyForm.value.quantity,
      totalPrice: product.value.price * buyForm.value.quantity,
      address: buyForm.value.address,
      contact: buyForm.value.contact
    }

    const response = await api.createOrderUsingPOST(orderData)
    if (response.code === 200) {
      ElMessage.success('购买成功')
      showBuyDialog.value = false
      router.push('/orders')
    } else {
      ElMessage.error(response.message || '购买失败')
    }
  } catch (error) {
    console.error('购买失败:', error)
    ElMessage.error('购买失败')
  }
}

const formatTime = (timeString) => {
  if (!timeString) return ''
  return new Date(timeString).toLocaleString()
}
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.product-image-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.main-image {
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 4px;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info-section {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.product-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #303133;
}

.product-description {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 20px;
}

.price-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.price {
  font-size: 28px;
  font-weight: bold;
  color: #f56c6c;
  margin-right: 20px;
}

.sales {
  color: #909399;
  font-size: 14px;
}

.seller-info {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.seller-avatar {
  margin-right: 12px;
}

.seller-details {
  flex: 1;
}

.seller-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.action-section {
  margin-bottom: 30px;
}

.action-section .el-button {
  margin-right: 12px;
  min-width: 120px;
}

.product-details {
  border-top: 1px solid #e4e7ed;
  padding-top: 20px;
}

.product-details h3 {
  margin-bottom: 16px;
  color: #303133;
}

.detail-item {
  display: flex;
  margin-bottom: 8px;
}

.detail-item .label {
  width: 80px;
  color: #909399;
}

.detail-item .value {
  color: #606266;
}

.reviews-section {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.reviews-section h2 {
  margin-bottom: 20px;
  color: #303133;
}

.review-item {
  border-bottom: 1px solid #e4e7ed;
  padding: 16px 0;
}

.review-item:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.review-user {
  flex: 1;
  margin-left: 12px;
}

.user-name {
  font-weight: 600;
  margin-bottom: 2px;
}

.review-time {
  font-size: 12px;
  color: #909399;
}

.review-content {
  color: #606266;
  line-height: 1.5;
}

.buy-dialog-content {
  padding: 20px 0;
}

.product-summary {
  display: flex;
  margin-bottom: 20px;
}

.product-summary img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 16px;
}

.summary-info h4 {
  margin: 0 0 8px 0;
  color: #303133;
}

.total-price {
  text-align: right;
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
}

.loading {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>