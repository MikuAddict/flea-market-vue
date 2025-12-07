<template>
  <Layout>
    <div class="profile-container">
      <el-row :gutter="20">
        <!-- 左侧个人信息卡片 -->
        <el-col :xs="24" :md="8">
          <el-card class="profile-card">
            <template #header>
              <div class="card-header">
                <span>个人信息</span>
                <el-button type="text" @click="editMode = !editMode">
                  {{ editMode ? '取消' : '编辑' }}
                </el-button>
              </div>
            </template>
            <div class="profile-content">
              <div class="avatar-section">
                <el-avatar :size="100" :src="user.userAvatar">
                  {{ user.userName?.charAt(0) }}
                </el-avatar>
                <div class="avatar-actions" v-if="editMode">
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :headers="uploadHeaders"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <el-button size="small" type="primary">更换头像</el-button>
                  </el-upload>
                </div>
              </div>
              
              <el-form v-if="editMode" :model="profileForm" :rules="profileRules" ref="profileFormRef" label-width="80px">
                <el-form-item label="昵称" prop="userName">
                  <el-input v-model="profileForm.userName" />
                </el-form-item>
                <el-form-item label="手机号" prop="userPhone">
                  <el-input v-model="profileForm.userPhone" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="updating" @click="updateProfile">
                    保存修改
                  </el-button>
                </el-form-item>
              </el-form>
              
              <div v-else class="profile-info">
                <div class="info-item">
                  <div class="info-label">昵称</div>
                  <div class="info-value">{{ user.userName }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">账号</div>
                  <div class="info-value">{{ user.userAccount }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">手机号</div>
                  <div class="info-value">{{ user.userPhone}}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">积分</div>
                  <div class="info-value">{{ user.point}}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">角色</div>
                  <div class="info-value">{{ formatUserRole(user.userRole) }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">注册时间</div>
                  <div class="info-value">{{ formatDate(user.createTime) }}</div>
                </div>
              </div>
            </div>
          </el-card>
          

        </el-col>
        
        <!-- 右侧内容区域 -->
        <el-col :xs="24" :md="16">
          <el-tabs v-model="activeTab" class="profile-tabs">
            <!-- 我的商品 -->
            <el-tab-pane label="我的商品" name="products">
              <div class="tab-content">
                <div class="tab-header">
                  <h3>我的商品</h3>
                  <el-button type="primary" @click="$router.push('/publish-product')">
                    发布商品
                  </el-button>
                </div>
                <div v-if="myProducts.length === 0" class="empty-content">
                  <el-empty description="暂无发布的商品" />
                  <el-button type="primary" @click="$router.push('/publish-product')">
                    发布第一个商品
                  </el-button>
                </div>
                <div v-else class="product-grid">
                  <ProductCard
                    v-for="product in myProducts"
                    :key="product.id"
                    :product="product"
                  />
                </div>
              </div>
            </el-tab-pane>
            
            <!-- 我的订单 -->
            <el-tab-pane label="我的订单" name="orders">
              <div class="tab-content">
                <div class="tab-header">
                  <h3>我的订单</h3>
                  <el-select v-model="orderStatus" placeholder="订单状态" clearable @change="fetchOrders">
                    <el-option label="待支付" :value="0" />
                    <el-option label="已支付" :value="1" />
                    <el-option label="已完成" :value="2" />
                    <el-option label="已取消" :value="3" />
                  </el-select>
                </div>
                <div v-if="orders.length === 0" class="empty-content">
                  <el-empty description="暂无订单" />
                </div>
                <el-timeline v-else>
                  <el-timeline-item
                    v-for="order in orders"
                    :key="order.id"
                    :timestamp="formatDate(order.createTime)"
                    placement="top"
                  >
                    <el-card>
                      <div class="order-item">
                        <div class="order-info">
                          <span class="order-id">订单号: {{ order.id }}</span>
                          <el-tag :type="getOrderStatusType(order.status)" size="small">
                            {{ formatOrderStatus(order.status) }}
                          </el-tag>
                        </div>
                        <div class="order-product">
                          <span>商品: {{ order.productName || '获取中...' }}</span>
                          <span class="order-amount">¥{{ formatPrice(order.amount) }}</span>
                        </div>
                        <div class="order-actions">
                          <el-button size="small" @click="viewOrder(order.id)">查看详情</el-button>
                          <template v-if="order.status === 0">
                            <el-button size="small" type="danger" @click="cancelOrder(order.id)">
                              取消订单
                            </el-button>
                          </template>
                        </div>
                      </div>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-tab-pane>
            
            <!-- 我的评价 -->
            <el-tab-pane label="我的评价" name="reviews">
              <div class="tab-content">
                <div class="tab-header">
                  <h3>我的评价</h3>
                </div>
                <div v-if="myReviews.length === 0" class="empty-content">
                  <el-empty description="暂无评价" />
                </div>
                <div v-else>
                  <el-card v-for="review in myReviews" :key="review.id" class="review-card">
                    <div class="review-header">
                      <el-rate v-model="review.rating" disabled show-score />
                      <span class="review-time">{{ formatDate(review.createTime) }}</span>
                    </div>
                    <div class="review-content">{{ review.content }}</div>
                    <div class="review-product">
                      商品: <el-link type="primary" @click="goToProduct(review.productId)">
                        {{ review.productName || '查看商品' }}
                      </el-link>
                    </div>
                  </el-card>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
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
  getUserStatusType
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
    const uploadHeaders = computed(() => ({
      Authorization: `Bearer ${store.state.token}`
    }))
    
    // 初始化表单数据
    const initProfileForm = () => {
      profileForm.userName = user.value.userName || ''
      profileForm.userPhone = user.value.userPhone || ''
    }
    
    // 获取我的商品
    const fetchMyProducts = async () => {
      try {
        const response = await productApi.getMyProductList({
          current: 1,
          size: 5 // 只显示最近的5个
        })
        myProducts.value = response.data.data.records || []
      } catch (error) {
        console.error('获取我的商品失败:', error)
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
    
    // 跳转到商品详情
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
      updateProfile,
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
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.profile-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-content {
  text-align: center;
}

.avatar-section {
  position: relative;
  margin-bottom: 20px;
}

.avatar-actions {
  margin-top: 15px;
}

.profile-info {
  text-align: left;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
}

.info-label {
  width: 80px;
  color: #909399;
  font-size: 14px;
}

.info-value {
  flex: 1;
  color: #303133;
  font-size: 14px;
}



.profile-tabs {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.tab-content {
  padding: 20px;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tab-header h3 {
  margin: 0;
  font-size: 18px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.empty-content {
  text-align: center;
  padding: 40px 0;
}

.order-item {
  margin-bottom: 10px;
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.order-id {
  font-weight: 500;
}

.order-product {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.order-amount {
  font-weight: bold;
  color: #f56c6c;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.review-card {
  margin-bottom: 15px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.review-time {
  color: #909399;
  font-size: 14px;
}

.review-content {
  margin-bottom: 10px;
  line-height: 1.6;
}

.review-product {
  font-size: 14px;
  color: #909399;
}
</style>