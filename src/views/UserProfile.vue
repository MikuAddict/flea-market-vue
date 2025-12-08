<template>
  <Layout>
    <div class="unified-page-container fade-in">
      <div class="profile-header">
        <h1 class="unified-title-xl">个人中心</h1>
        <p class="unified-text-secondary">管理您的个人信息、二手物品、订单和评价</p>
      </div>

      <el-row :gutter="24">
        <!-- 左侧个人信息卡片 -->
        <el-col :xs="24" :md="8" :lg="7">
          <el-card class="unified-card profile-card fade-in">
            <template #header>
              <div class="unified-flex unified-flex-between">
                <h3 class="unified-title-base">个人信息</h3>
                <el-button 
                  type="text" 
                  @click="toggleEditMode"
                  class="edit-btn"
                >
                  <el-icon v-if="!editMode"><Edit /></el-icon>
                  <el-icon v-else><Close /></el-icon>
                  {{ editMode ? '取消' : '编辑' }}
                </el-button>
              </div>
            </template>
            
            <div class="profile-content">
              <div class="avatar-section unified-flex unified-flex-center">
                <div class="avatar-container">
                  <el-avatar :size="100" :src="user.userAvatar" class="user-avatar">
                    <span class="avatar-text">{{ user.userName?.charAt(0) }}</span>
                  </el-avatar>
                  <div class="avatar-overlay" v-if="editMode">
                    <el-upload
                      class="avatar-uploader"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload"
                    >
                      <div class="upload-icon">
                        <el-icon><Camera /></el-icon>
                        <p>更换头像</p>
                      </div>
                    </el-upload>
                  </div>
                </div>
              </div>
              
              <div v-if="!editMode" class="profile-info unified-flex unified-flex-col">
                <div class="user-details unified-flex unified-flex-center">
                  <div class="user-info unified-flex unified-flex-col">
                    <h2 class="user-name unified-title-base">{{ user.userName }}</h2>
                    <div class="unified-tag unified-tag-primary user-role">
                      {{ formatUserRole(user.userRole) }}
                    </div>
                  </div>
                </div>
                
                <div class="info-stats unified-flex unified-flex-between">
                  <div class="stat-item unified-flex unified-flex-col unified-flex-center">
                    <span class="stat-value">{{ user.point || 0 }}</span>
                    <span class="stat-label">积分</span>
                  </div>
                  <div class="stat-divider"></div>
                  <div class="stat-item unified-flex unified-flex-col unified-flex-center">
                    <span class="stat-value">{{ myProducts.length }}</span>
                    <span class="stat-label">物品</span>
                  </div>
                  <div class="stat-divider"></div>
                  <div class="stat-item unified-flex unified-flex-col unified-flex-center">
                    <span class="stat-value">{{ orders.length }}</span>
                    <span class="stat-label">订单</span>
                  </div>
                </div>
                
                <el-divider class="unified-divider" />
                
                <div class="info-details">
                  <div class="detail-item">
                    <span class="detail-label unified-text-secondary">账号</span>
                    <span class="detail-value">{{ user.userAccount }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label unified-text-secondary">手机号</span>
                    <span class="detail-value">{{ user.userPhone || '未设置' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label unified-text-secondary">注册时间</span>
                    <span class="detail-value">{{ formatDate(user.createTime) }}</span>
                  </div>
                </div>
              </div>
              
              <el-form 
                v-else 
                :model="profileForm" 
                :rules="profileRules" 
                ref="profileFormRef" 
                label-width="70px"
                class="edit-form"
              >
                <el-form-item label="昵称" prop="userName">
                  <el-input 
                    v-model="profileForm.userName" 
                    class="unified-input"
                    placeholder="请输入昵称"
                  />
                </el-form-item>
                <el-form-item label="手机号" prop="userPhone">
                  <el-input 
                    v-model="profileForm.userPhone" 
                    class="unified-input"
                    placeholder="请输入手机号"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button 
                    type="primary" 
                    class="unified-button unified-button-primary save-btn"
                    :loading="updating"
                    @click="updateProfile"
                  >
                    保存修改
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-col>
        
        <!-- 右侧内容区域 -->
        <el-col :xs="24" :md="16" :lg="17">
          <el-card class="unified-card content-card fade-in">
            <el-tabs v-model="activeTab" class="profile-tabs" @tab-click="handleTabClick">
              <!-- 我的二手物品 -->
              <el-tab-pane name="products">
                <template #label>
                  <div class="tab-label unified-flex unified-flex-center">
                    <el-icon><Box /></el-icon>
                    <span>我的二手物品</span>
                  </div>
                </template>
                
                <div class="tab-content">
                  <div class="content-header unified-flex unified-flex-between">
                    <h3 class="unified-title-base">我的二手物品</h3>
                    <el-button 
                      type="primary" 
                      class="unified-button unified-button-primary"
                      @click="$router.push('/publish-product')"
                    >
                      <el-icon><Plus /></el-icon>
                      发布二手物品
                    </el-button>
                  </div>
                  
                  <div v-if="myProducts.length === 0" class="empty-content unified-flex unified-flex-col unified-flex-center">
                    <el-icon size="60" color="var(--text-placeholder)"><Box /></el-icon>
                    <p class="empty-text">暂无发布的二手物品</p>
                    <el-button 
                      type="primary" 
                      class="unified-button unified-button-primary"
                      @click="$router.push('/publish-product')"
                    >
                      发布第一个二手物品
                    </el-button>
                  </div>
                  
                  <div v-else class="products-grid unified-grid unified-grid-3">
                    <div 
                      class="product-item fade-in"
                      v-for="(product, index) in myProducts" 
                      :key="product.id"
                      :style="{ animationDelay: `${index * 0.05}s` }"
                    >
                      <ProductCard :product="product" />
                    </div>
                  </div>
                  
                  <div class="view-more-container unified-flex unified-flex-center" v-if="myProducts.length > 0">
                    <el-button 
                      type="primary" 
                      class="unified-button unified-button-outline"
                      @click="$router.push('/my-products')"
                    >
                      查看全部
                    </el-button>
                  </div>
                </div>
              </el-tab-pane>
              
              <!-- 我的订单 -->
              <el-tab-pane name="orders">
                <template #label>
                  <div class="tab-label unified-flex unified-flex-center">
                    <el-icon><Document /></el-icon>
                    <span>我的订单</span>
                  </div>
                </template>
                
                <div class="tab-content">
                  <div class="content-header unified-flex unified-flex-between">
                    <h3 class="unified-title-base">我的订单</h3>
                    <el-select 
                      v-model="orderStatus" 
                      placeholder="订单状态" 
                      clearable 
                      @change="fetchOrders"
                      class="filter-select"
                    >
                      <el-option label="待支付" :value="0" />
                      <el-option label="已支付" :value="1" />
                      <el-option label="已完成" :value="2" />
                      <el-option label="已取消" :value="3" />
                    </el-select>
                  </div>
                  
                  <div v-if="orders.length === 0" class="empty-content unified-flex unified-flex-col unified-flex-center">
                    <el-icon size="60" color="var(--text-placeholder)"><Document /></el-icon>
                    <p class="empty-text">暂无订单</p>
                  </div>
                  
                  <div v-else class="orders-list">
                    <div 
                      class="order-item fade-in"
                      v-for="(order, index) in orders" 
                      :key="order.id"
                      :style="{ animationDelay: `${index * 0.05}s` }"
                    >
                      <el-card class="unified-card order-card">
                        <div class="order-header unified-flex unified-flex-between">
                          <div class="order-id">
                            <span class="unified-text-secondary">订单号：</span>
                            <span>{{ order.id }}</span>
                          </div>
                          <div class="unified-tag" :class="`unified-tag-${getOrderTagClass(order.status)}`">
                            {{ formatOrderStatus(order.status) }}
                          </div>
                        </div>
                        
                        <div class="order-product unified-flex unified-flex-between">
                          <div class="product-info">
                            <h4 class="product-name">{{ order.productName || '获取中...' }}</h4>
                            <p class="order-time">{{ formatDate(order.createTime) }}</p>
                          </div>
                          <div class="price-info">
                            <span class="price-symbol">¥</span>
                            <span class="price-value">{{ formatPrice(order.amount) }}</span>
                          </div>
                        </div>
                        
                        <div class="order-footer unified-flex unified-flex-between">
                          <div class="payment-method unified-text-secondary">
                            支付方式：{{ formatPaymentMethod(order.paymentMethod) }}
                          </div>
                          <div class="order-actions">
                            <el-button 
                              size="small" 
                              class="unified-button unified-button-outline"
                              @click="viewOrder(order.id)"
                            >
                              查看详情
                            </el-button>
                            <el-button 
                              v-if="order.status === 0"
                              size="small" 
                              type="danger"
                              class="unified-button"
                              @click="cancelOrder(order.id)"
                            >
                              取消订单
                            </el-button>
                          </div>
                        </div>
                      </el-card>
                    </div>
                  </div>
                  
                  <div class="view-more-container unified-flex unified-flex-center" v-if="orders.length > 0">
                    <el-button 
                      type="primary" 
                      class="unified-button unified-button-outline"
                      @click="$router.push('/orders')"
                    >
                      查看全部订单
                    </el-button>
                  </div>
                </div>
              </el-tab-pane>
              
              <!-- 我的评价 -->
              <el-tab-pane name="reviews">
                <template #label>
                  <div class="tab-label unified-flex unified-flex-center">
                    <el-icon><Star /></el-icon>
                    <span>我的评价</span>
                  </div>
                </template>
                
                <div class="tab-content">
                  <div class="content-header">
                    <h3 class="unified-title-base">我的评价</h3>
                  </div>
                  
                  <div v-if="myReviews.length === 0" class="empty-content unified-flex unified-flex-col unified-flex-center">
                    <el-icon size="60" color="var(--text-placeholder)"><Star /></el-icon>
                    <p class="empty-text">暂无评价</p>
                  </div>
                  
                  <div v-else class="reviews-list">
                    <div 
                      class="review-item fade-in"
                      v-for="(review, index) in myReviews" 
                      :key="review.id"
                      :style="{ animationDelay: `${index * 0.05}s` }"
                    >
                      <el-card class="unified-card review-card">
                        <div class="review-header unified-flex unified-flex-between">
                          <div class="rating">
                            <el-rate v-model="review.rating" disabled show-score />
                          </div>
                          <span class="review-time unified-text-secondary">{{ formatDate(review.createTime) }}</span>
                        </div>
                        
                        <div class="review-content">
                          <p class="review-text">{{ review.content }}</p>
                        </div>
                        
                        <div class="review-product unified-flex unified-flex-center">
                          <span class="unified-text-secondary">二手物品：</span>
                          <el-link 
                            type="primary" 
                            @click="goToProduct(review.productId)"
                            class="product-link"
                          >
                            {{ review.productName || '查看二手物品' }}
                          </el-link>
                        </div>
                      </el-card>
                    </div>
                  </div>
                  
                  <div class="view-more-container unified-flex unified-flex-center" v-if="myReviews.length > 0">
                    <el-button 
                      type="primary" 
                      class="unified-button unified-button-outline"
                    >
                      查看全部评价
                    </el-button>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </Layout>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Edit, 
  Close, 
  Camera, 
  Box, 
  Plus, 
  Document, 
  Star 
} from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import ProductCard from '@/components/ProductCard.vue'
import { userApi, productApi, orderApi, reviewApi } from '@/api'
import {
  formatPrice,
  formatOrderStatus,
  formatUserRole,
  formatUserStatus,
  formatDate,
  getOrderStatusType,
  getUserStatusType,
  formatPaymentMethod
} from '@/utils/format'

export default {
  name: 'UserProfile',
  components: {
    Layout,
    ProductCard
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    // 表单引用
    const profileFormRef = ref(null)
    
    // 响应式数据
    const editMode = ref(false)
    const updating = ref(false)
    const activeTab = ref('products')
    const orderStatus = ref(null)
    
    // 用户数据
    const user = computed(() => store.state.user || {})
    const myProducts = ref([])
    const orders = ref([])
    const myReviews = ref([])
    
    // 编辑表单
    const profileForm = reactive({
      userName: '',
      userPhone: ''
    })
    
    // 表单验证规则
    const profileRules = {
      userName: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 2, max: 20, message: '昵称长度在2到20个字符', trigger: 'blur' }
      ],
      userPhone: [
        { pattern: /^1[3456789]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
      ]
    }
    
    // 头像上传相关
    const uploadUrl = '/api/image/upload/avatar'
    const uploadHeaders = computed(() => {
      const token = store.state.token || localStorage.getItem('token')
      return token ? {
        Authorization: `Bearer ${token}`
      } : {}
    })
    
    // 初始化表单数据
    const initProfileForm = () => {
      profileForm.userName = user.value.userName || ''
      profileForm.userPhone = user.value.userPhone || ''
    }
    
    // 获取我的二手物品
    const fetchMyProducts = async () => {
      try {
        const response = await productApi.getMyProductList({
          current: 1,
          size: 5 // 只显示最近的5个
        })
        myProducts.value = response.data.data.records || []
      } catch (error) {
        console.error('获取我的二手物品失败:', error)
      }
    }
    
    // 获取我的订单
    const fetchOrders = async () => {
      try {
        let response
        
        if (orderStatus.value !== null) {
          // 获取特定状态的订单
          response = await orderApi.getBuyerOrderListByStatus(orderStatus.value, {
            current: 1,
            size: 10
          })
        } else {
          // 获取所有订单
          response = await orderApi.getBuyerOrderList({
            current: 1,
            size: 10
          })
        }
        
        orders.value = response.data.data.records || []
      } catch (error) {
        console.error('获取我的订单失败:', error)
      }
    }
    
    // 获取我的评价
    const fetchMyReviews = async () => {
      try {
        const response = await reviewApi.getMyReviewList({
          current: 1,
          size: 10
        })
        myReviews.value = response.data.data.records || []
      } catch (error) {
        console.error('获取我的评价失败:', error)
      }
    }
    

    
    // 切换编辑模式
    const toggleEditMode = () => {
      editMode.value = !editMode.value
      if (editMode.value) {
        initProfileForm()
      }
    }

    // 更新个人信息
    const updateProfile = async () => {
      if (!profileFormRef.value) return
      
      try {
        await profileFormRef.value.validate()
        updating.value = true
        
        const result = await store.dispatch('updateProfile', profileForm)
        
        if (result.success) {
          ElMessage.success('个人信息更新成功')
          editMode.value = false
        } else {
          ElMessage.error(result.message)
        }
      } catch (error) {
        console.error('更新个人信息失败:', error)
      } finally {
        updating.value = false
      }
    }
    
    // 处理标签页点击
    const handleTabClick = (tab) => {
      if (tab.paneName === 'orders') {
        fetchOrders()
      } else if (tab.paneName === 'reviews') {
        fetchMyReviews()
      }
    }
    
    // 获取订单标签类名
    const getOrderTagClass = (status) => {
      const classMap = {
        0: 'warning',  // 待支付
        1: 'primary',  // 已支付
        2: 'success',  // 已完成
        3: 'danger'    // 已取消
      }
      return classMap[status] || 'info'
    }
    
    // 头像上传成功
    const handleAvatarSuccess = (res) => {
      if (res.code === 200) {
        ElMessage.success('头像上传成功')
        // 更新本地用户头像
        store.state.user.userAvatar = res.data.originalUrl
      } else {
        ElMessage.error(res.message || '头像上传失败')
      }
    }
    
    // 头像上传前验证
    const beforeAvatarUpload = (file) => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isJPG) {
        ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        ElMessage.error('上传头像图片大小不能超过 2MB!')
      }
      
      return isJPG && isLt2M
    }
    
    // 查看订单详情
    const viewOrder = (orderId) => {
      router.push(`/orders/${orderId}`)
    }
    
    // 取消订单
    const cancelOrder = async (orderId) => {
      try {
        await orderApi.cancelOrder(orderId)
        ElMessage.success('订单已取消')
        fetchOrders()
      } catch (error) {
        console.error('取消订单失败:', error)
      }
    }
    
    // 跳转到二手物品详情
    const goToProduct = (productId) => {
      router.push(`/products/${productId}`)
    }
    
    // 监听编辑模式变化
    watch(editMode, (newVal) => {
      if (newVal) {
        initProfileForm()
      }
    })
    
    // 监听标签页切换
    watch(activeTab, (newVal) => {
      if (newVal === 'orders') {
        fetchOrders()
      } else if (newVal === 'reviews') {
        fetchMyReviews()
      }
    })
    
    onMounted(async () => {
      // 获取当前用户信息
      if (!user.value.id) {
        await store.dispatch('getCurrentUser')
      }
      
      // 初始化表单
      initProfileForm()
      
      // 获取初始数据
      fetchMyProducts()
      

    })
    
    return {
      user,
      myProducts,
      orders,
      myReviews,
      editMode,
      updating,
      activeTab,
      orderStatus,
      profileForm,
      profileRules,
      profileFormRef,
      uploadUrl,
      uploadHeaders,
      formatPrice,
      formatOrderStatus,
      formatUserRole,
      formatUserStatus,
      formatDate,
      getOrderStatusType,
      getUserStatusType,
      formatPaymentMethod,
      toggleEditMode,
      updateProfile,
      handleTabClick,
      getOrderTagClass,
      handleAvatarSuccess,
      beforeAvatarUpload,
      viewOrder,
      cancelOrder,
      goToProduct,
      fetchOrders
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

/* 个人信息卡片样式 */
.profile-card {
  margin-bottom: var(--spacing-xl);
  transition: all var(--transition-base);
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.edit-btn {
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
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

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.upload-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  cursor: pointer;
}

.upload-icon p {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-xs);
}

/* 个人信息详情样式 */
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

/* 编辑表单样式 */
.edit-form {
  text-align: left;
  padding-top: var(--spacing-base);
}

.save-btn {
  width: 100%;
  margin-top: var(--spacing-base);
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

/* 产品网格样式 */
.products-grid {
  margin-bottom: var(--spacing-lg);
}

.product-item {
  margin-bottom: var(--spacing-base);
}

/* 订单列表样式 */
.orders-list {
  margin-bottom: var(--spacing-lg);
}

.order-item {
  margin-bottom: var(--spacing-base);
}

.order-card {
  border-left: 4px solid var(--primary-color);
}

.order-header {
  margin-bottom: var(--spacing-base);
}

.order-id {
  font-weight: 500;
}

.order-product {
  margin-bottom: var(--spacing-base);
}

.product-info {
  flex: 1;
}

.product-name {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-primary);
}

.order-time {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.price-info {
  display: flex;
  align-items: baseline;
  color: var(--danger-color);
}

.price-symbol {
  font-size: var(--font-size-sm);
  margin-right: 2px;
}

.price-value {
  font-size: var(--font-size-xl);
  font-weight: 600;
}

.order-footer {
  padding-top: var(--spacing-base);
  border-top: 1px solid var(--border-light);
}

.order-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* 评价列表样式 */
.reviews-list {
  margin-bottom: var(--spacing-lg);
}

.review-item {
  margin-bottom: var(--spacing-base);
}

.review-header {
  margin-bottom: var(--spacing-base);
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

/* 查看更多按钮 */
.view-more-container {
  margin-top: var(--spacing-lg);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .unified-page-container {
    padding: var(--spacing-lg);
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .unified-page-container {
    padding: var(--spacing-base);
  }
  
  .profile-header {
    margin-bottom: var(--spacing-lg);
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  :deep(.el-tabs__item) {
    padding: 0 var(--spacing-base);
    font-size: var(--font-size-sm);
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  
  .order-product {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  
  .order-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}

@media (max-width: 576px) {
  .stat-value {
    font-size: var(--font-size-lg);
  }
  
  .price-value {
    font-size: var(--font-size-lg);
  }
}

/* Element Plus 组件覆盖样式 */
:deep(.el-rate__text) {
  font-size: var(--font-size-sm);
  color: var(--text-regular);
  margin-left: var(--spacing-xs);
}

.filter-select {
  width: 150px;
}
</style>