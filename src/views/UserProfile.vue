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
          <UserBasicInfoCard 
            :user="user" 
            :edit-mode="editMode"
            :avatar-file="avatarFile"
            :products-count="myProducts.length"
            :orders-count="orders.length"
            :show-uploaded-tip="true"
            date-format="YYYY-MM-DD"
          >
            <template #actions>
              <el-button 
                type="text" 
                @click="toggleEditMode"
                class="edit-btn"
              >
                <el-icon v-if="!editMode"><Edit /></el-icon>
                <el-icon v-else><Close /></el-icon>
                {{ editMode ? '取消' : '编辑' }}
              </el-button>
            </template>
            
            <template #avatar-overlay v-if="editMode">
              <div class="avatar-overlay">
                <el-upload
                  class="avatar-uploader"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="handleAvatarChange"
                  :before-upload="beforeAvatarUpload"
                  accept="image/jpeg, image/png"
                >
                  <div class="upload-icon">
                    <el-icon><Camera /></el-icon>
                    <p>更换头像</p>
                  </div>
                </el-upload>
              </div>
            </template>
            
            <template #edit-form="{ user }" v-if="editMode">
              <el-form 
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
            </template>
          </UserBasicInfoCard>
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
                
                <UserProductsTab 
                  :products="myProducts" 
                  title="我的二手物品"
                  empty-text="暂无发布的二手物品"
                  :show-view-more="true"
                  @view-more="$router.push('/my-products')"
                >
                  <template #header-actions>
                    <el-button 
                      type="primary" 
                      class="unified-button unified-button-primary"
                      @click="$router.push('/publish-product')"
                    >
                      <el-icon><Plus /></el-icon>
                      发布二手物品
                    </el-button>
                  </template>
                  
                  <template #empty-actions>
                    <el-button 
                      type="primary" 
                      class="unified-button unified-button-primary"
                      @click="$router.push('/publish-product')"
                    >
                      发布第一个二手物品
                    </el-button>
                  </template>
                </UserProductsTab>
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
                  
                  <div v-else class="order-list">
                    <el-card
                      v-for="order in orders"
                      :key="order.id"
                      class="order-item"
                      shadow="hover"
                    >
                      <div class="order-header">
                        <div class="order-info">
                          <span class="order-id">订单号: {{ order.id }}</span>
                          <el-tag :type="getOrderStatusType(order.status)" size="small">
                            {{ formatOrderStatus(order.status) }}
                          </el-tag>
                        </div>
                        <span class="order-time">{{ formatDate(order.createTime) }}</span>
                      </div>
                      
                      <div class="order-content">
                        <div class="product-info">
                          <div class="product-image">
                            <img
                              v-if="order.product && order.product.imageUrl"
                              :src="order.product.imageUrl"
                              :alt="order.product.productName"
                            />
                            <div v-else class="no-image">
                              <el-icon><Picture /></el-icon>
                            </div>
                          </div>
                          <div class="product-details">
                            <h4>{{ order.product?.productName || '二手物品已删除' }}</h4>
                            <p v-if="order.product?.category?.name">
                              分类: {{ order.product.category.name }}
                            </p>
                            <p v-else-if="order.product?.categoryName">
                              分类: {{ order.product.categoryName }}
                            </p>
                            <p>支付方式: {{ formatPaymentMethod(order.paymentMethod || order.product?.paymentMethod) }}</p>
                          </div>
                        </div>
                        
                        <div class="order-amount">
                          <div class="amount-label">订单金额</div>
                          <div class="amount-value">¥{{ formatPrice(order.amount || order.product?.price) }}</div>
                        </div>
                      </div>
                      
                      <div class="order-footer">
                        <div class="order-seller" v-if="order.seller">
                          卖家: 
                          <el-avatar 
                            :size="20" 
                            :src="order.seller.userAvatar" 
                            style="margin-right: 5px; vertical-align: middle; cursor: pointer;"
                            @click="goToUserProfile(order.seller.id)"
                          >
                            {{ order.seller.userName?.charAt(0) }}
                          </el-avatar>
                          <span class="clickable" @click="goToUserProfile(order.seller.id)">
                            {{ order.seller.userName || '未知' }}
                          </span>
                        </div>
                        <div class="order-seller" v-else>
                          卖家: 未知
                        </div>
                        <div class="order-actions">
                          <el-button
                            size="small"
                            @click="viewOrder(order.id)"
                          >
                            查看详情
                          </el-button>
                          
                          <!-- 取消订单（状态为0：待支付） -->
                          <el-button
                            v-if="order.status === 0"
                            size="small"
                            type="danger"
                            @click="cancelOrder(order.id)"
                          >
                            取消订单
                          </el-button>
                          
                          <!-- 确认收货（状态为1：已支付，且买家未确认） -->
                          <el-button
                            v-if="order.status === 1 && !order.buyerConfirmed"
                            size="small"
                            type="success"
                            @click="confirmOrder(order.id)"
                          >
                            确认收货
                          </el-button>
                        </div>
                      </div>
                    </el-card>
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
                
                <UserReviewsTab
                  :reviews="myReviews"
                  title="我的评价"
                  empty-text="暂无评价"
                  :show-view-more="true"
                  @go-to-product="goToProduct"
                  @go-to-user="goToUserProfile"
                />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Edit, 
  Close, 
  Camera, 
  Box, 
  Plus, 
  Document, 
  Star,
  Picture
} from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import UserBasicInfoCard from '@/components/UserBasicInfoCard.vue'
import UserProductsTab from '@/components/UserProductsTab.vue'
import UserReviewsTab from '@/components/UserReviewsTab.vue'
import { userApi, productApi, orderApi, reviewApi } from '@/api'
import { useFormHandler } from '@/composables/useEventHandlers'
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
    UserBasicInfoCard,
    UserProductsTab,
    UserReviewsTab
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
    const avatarUrl = ref('') // 用于暂存新上传的头像URL
    const avatarFile = ref(null) // 用于暂存新上传的头像文件对象
    
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
    const uploadUrl = '/api/image/avatar'
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
    
    // 获取我的订单
    const fetchOrders = async () => {
      try {
        // 获取所有订单
        const response = await orderApi.getBuyerOrderList({
          current: 1,
          size: 10
        })
        
        let ordersData = response.data.data.records || []
        
        // 如果有特定状态筛选，则按状态过滤
        if (orderStatus.value !== null) {
          ordersData = ordersData.filter(order => order.status === orderStatus.value)
        }
        
        // 为每个订单获取详细的商品信息和卖家信息
        const enrichedOrders = []
        for (const order of ordersData) {
          // 获取商品详情
          if (order.productId) {
            try {
              const productResponse = await productApi.getProductById(order.productId)
              order.product = productResponse.data.data
              
              // 处理商品图片 - 只使用mainImageUrl
              if (order.product && order.product.mainImageUrl) {
                order.product.imageUrl = processImageUrl(order.product.mainImageUrl)
              } else if (order.product && order.product.imageUrl) {
                // 如果没有mainImageUrl，则使用imageUrl
                order.product.imageUrl = processImageUrl(order.product.imageUrl)
              }
            } catch (error) {
              console.error('获取商品详情失败:', error)
              order.product = null
            }
          }
          
          // 获取卖家信息
          if (order.sellerId) {
            try {
              const sellerResponse = await userApi.getUserVOById(order.sellerId)
              order.seller = sellerResponse.data.data
              
              // 处理卖家头像
              if (order.seller && order.seller.userAvatar) {
                order.seller.userAvatar = processImageUrl(order.seller.userAvatar)
              }
            } catch (error) {
              console.error('获取卖家信息失败:', error)
              order.seller = null
            }
          }
          
          enrichedOrders.push(order)
        }
        
        orders.value = enrichedOrders
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
          
          myReviews.value = enrichedReviews
        }
      } catch (error) {
        console.error('获取我的评价失败:', error)
      }
    }
    

    
    // 切换编辑模式
    const toggleEditMode = () => {
      editMode.value = !editMode.value
      if (editMode.value) {
        initProfileForm()
        // 进入编辑模式时清空暂存的头像URL和文件
        avatarUrl.value = ''
        avatarFile.value = null
      } else {
        // 退出编辑模式时也清空暂存的头像URL和文件
        avatarUrl.value = ''
        avatarFile.value = null
      }
    }

    // 更新个人信息
    const updateProfile = async () => {
      if (!profileFormRef.value) return
      
      try {
        await profileFormRef.value.validate()
        updating.value = true
        
        let avatarUrlToUpdate = null
        
        // 如果有新选择的头像文件，则先上传头像
        if (avatarFile.value) {
          const formData = new FormData()
          formData.append('file', avatarFile.value)
          
          try {
            const uploadResponse = await fetch('/api/image/avatar', {
              method: 'POST',
              body: formData,
              headers: {
                'Authorization': `Bearer ${store.state.token}`
              }
            })
            
            const uploadResult = await uploadResponse.json()
            
            if (uploadResult.code === 200) {
              avatarUrlToUpdate = uploadResult.data.originalUrl
            } else {
              throw new Error(uploadResult.message || '头像上传失败')
            }
          } catch (uploadError) {
            ElMessage.error('头像上传失败: ' + uploadError.message)
            return
          }
        }
        
        // 准备要提交的用户数据
        const profileData = { ...profileForm }
        
        // 如果有新上传的头像URL，则添加到提交数据中
        if (avatarUrlToUpdate) {
          profileData.userAvatar = avatarUrlToUpdate
        }
        
        const result = await store.dispatch('updateProfile', profileData)
        
        if (result.success) {
          ElMessage.success('个人信息更新成功')
          // 清空暂存的头像URL和文件
          avatarUrl.value = ''
          avatarFile.value = null
          editMode.value = false
        } else {
          ElMessage.error(result.message)
        }
      } catch (error) {
        console.error('更新个人信息失败:', error)
        ElMessage.error('更新个人信息失败: ' + error.message)
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
    
    // 处理头像文件选择
    const handleAvatarChange = (file) => {
      // 暂存文件对象
      avatarFile.value = file.raw
      
      // 生成本地预览URL
      const reader = new FileReader()
      reader.onload = (e) => {
        avatarUrl.value = e.target.result
      }
      reader.readAsDataURL(avatarFile.value)
    }
    
    // 头像上传成功
    const handleAvatarSuccess = (res) => {
      if (res.code === 200) {
        ElMessage.success('头像上传成功')
        // 暂存头像URL，不立即更新用户信息
        avatarUrl.value = res.data.originalUrl
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
      
      // 阻止自动上传
      return false
    }
    
    // 查看订单详情
    const viewOrder = (orderId) => {
      router.push(`/orders/${orderId}`)
    }
    
    // 取消订单
    const cancelOrder = async (orderId) => {
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
        
        await orderApi.cancelOrder(orderId)
        ElMessage.success('订单已取消')
        fetchOrders()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('取消订单失败:', error)
          ElMessage.error('取消订单失败')
        }
      }
    }
    
    // 确认收货
    const confirmOrder = async (orderId) => {
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
        
        await orderApi.confirmOrder(orderId)
        ElMessage.success('订单已完成')
        fetchOrders()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('确认收货失败:', error)
          ElMessage.error('确认收货失败')
        }
      }
    }
    
    // 跳转到二手物品详情
    const goToProduct = (productId) => {
      router.push(`/products/${productId}`)
    }
    
    // 跳转到用户资料页面
    const goToUserProfile = (userId) => {
      router.push(`/user/${userId}`)
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
      avatarUrl,
      avatarFile,
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
      handleAvatarChange,
      handleTabClick,
      getOrderTagClass,
      beforeAvatarUpload,
      viewOrder,
      cancelOrder,
      goToProduct,
      goToUserProfile,
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

/* 新增的已上传头像提示样式 */
.avatar-uploaded-tip {
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
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

/* 订单卡片样式已提取到公共样式文件 */

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