<template>
  <Layout>
    <div class="order-list-container">
      <el-card class="unified-card order-card">
        <template #header>
          <div class="unified-flex unified-flex-between unified-w-full">
            <span>我的订单</span>
          </div>
        </template>
        
        <!-- 订单状态筛选 -->
        <div class="unified-filter-container">
          <div class="unified-filter-form">
            <div class="unified-filter-item">
              <div class="unified-filter-label">订单状态</div>
              <el-tabs v-model="activeTab" @tab-click="handleTabClick">
                <el-tab-pane label="全部" name="all" />
                <el-tab-pane label="待支付" name="0" />
                <el-tab-pane label="已支付" name="1" />
                <el-tab-pane label="已完成" name="2" />
                <el-tab-pane label="已取消" name="3" />
              </el-tabs>
            </div>
          </div>
        </div>
        
        <!-- 订单列表 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="3" animated />
        </div>
        
        <div v-else-if="orders.length === 0" class="unified-empty">
          <el-empty description="暂无订单" />
        </div>
        
                   <div v-else>
                    <el-card
                      v-for="order in orders"
                      :key="order.id"
                      class="unified-order-item"
                      shadow="hover"
                    >
                      <div class="unified-order-header">
                        <div class="unified-order-info">
                          <span class="order-id">订单号: {{ order.id }}</span>
                          <el-tag :type="getOrderStatusType(order.status)" size="small">
                            {{ formatOrderStatus(order.status) }}
                          </el-tag>
                        </div>
                        <span class="unified-order-time">{{ formatDate(order.createTime) }}</span>
                      </div>
                      
                      <div class="unified-order-content">
                        <div class="unified-product-info">
                          <div class="unified-product-image">
                            <img
                              v-if="order.product && order.product.imageUrl"
                              :src="order.product.imageUrl"
                              :alt="order.product.productName"
                            />
                            <div v-else class="unified-no-image">
                              <el-icon><Picture /></el-icon>
                            </div>
                          </div>
                          <div class="unified-product-details">
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
                        
                        <div class="unified-order-amount">
                          <div class="unified-amount-label">订单金额</div>
                          <div class="unified-amount-value">¥{{ formatPrice(order.amount || order.product?.price) }}</div>
                        </div>
                      </div>
                      
                      <div class="unified-order-footer">
                        <div class="unified-order-seller" v-if="order.seller">
                          卖家: 
                          <el-avatar 
                            :size="20" 
                            :src="order.seller.userAvatar" 
                            class="unified-mr-xs unified-cursor-pointer"
                            @click="goToUserProfile(order.seller.id)"
                          >
                            {{ order.seller.userName?.charAt(0) }}
                          </el-avatar>
                          <span class="unified-cursor-pointer" @click="goToUserProfile(order.seller.id)">
                            {{ order.seller.userName || '未知' }}
                          </span>
                        </div>
                        <div class="unified-order-seller" v-else>
                          卖家: 未知
                        </div>
                        <div class="unified-order-actions">
                          <el-button
                            size="small"
                            class="unified-button unified-button-outline"
                            @click="viewOrder(order.id)"
                          >
                            查看详情
                          </el-button>
                          
                          <!-- 取消订单（状态为0：待支付 或 状态1：已支付） -->
                          <el-button
                            v-if="order.status === 0 || order.status === 1"
                            size="small"
                            class="unified-button action-btn-delete"
                            @click="cancelOrder(order.id)"
                          >
                            取消订单
                          </el-button>
                          
                          <!-- 确认收货（状态为1：已支付，且买家未确认） -->
                          <el-button
                            v-if="order.status === 1 && !order.buyerConfirmed"
                            size="small"
                            class="unified-button unified-button-primary"
                            @click="confirmOrder(order.id)"
                          >
                            确认收货
                          </el-button>
                        </div>
                      </div>
                    </el-card>
                  </div>
        
        <!-- 分页 -->
        <div v-if="total > 0" class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.current"
            v-model:page-size="pagination.size"
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </Layout>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Picture } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import { orderApi, productApi, userApi } from '@/api'
import {
  formatPrice,
  formatPaymentMethod,
  formatOrderStatus,
  formatDate,
  getOrderStatusType
} from '@/utils/format'
import { useDataFetchWithIdPrecision } from '@/composables/useDataFetch'
import { useDeleteHandler } from '@/composables/useEventHandlers'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'OrderList',
  components: {
    Layout,
    Picture
  },
  setup() {
    const router = useRouter()
    
    // 响应式数据
    const loading = ref(false)
    const orders = ref([])
    const total = ref(0)
    const activeTab = ref('all')
    
    // 分页信息
    const pagination = reactive({
      current: 1,
      size: 10
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
    
    // 获取订单列表
    const fetchOrders = async () => {
      loading.value = true
      try {
        let response
        
        if (activeTab.value === 'all') {
          response = await orderApi.getBuyerOrderList({
            current: pagination.current,
            size: pagination.size
          })
        } else {
          response = await orderApi.getBuyerOrderList({
            current: pagination.current,
            size: pagination.size,
            status: parseInt(activeTab.value)
          })
        }
        
        // 获取订单列表数据
        const orderRecords = response.data.data.records || []
        total.value = response.data.data.total || 0
        
        // 为每个订单获取详细的商品信息和卖家信息
        const enrichedOrders = []
        for (const order of orderRecords) {
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
        console.error('获取订单列表失败:', error)
        orders.value = []
        total.value = 0
      } finally {
        loading.value = false
      }
    }
    
    // 标签页切换
    const handleTabClick = () => {
      pagination.current = 1
      fetchOrders()
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
    
    // 处理每页显示数量变化
    const handleSizeChange = (size) => {
      pagination.size = size
      pagination.current = 1
      fetchOrders()
    }
    
    // 处理页码变化
    const handleCurrentChange = (current) => {
      pagination.current = current
      fetchOrders()
    }
    
    // 跳转到用户个人资料页面
    const goToUserProfile = (userId) => {
      router.push(`/user/${userId}`)
    }
    
    onMounted(() => {
      fetchOrders()
    })
    
    return {
      loading,
      orders,
      total,
      activeTab,
      pagination,
      formatPrice,
      formatPaymentMethod,
      formatOrderStatus,
      formatDate,
      getOrderStatusType,
      handleTabClick,
      viewOrder,
      cancelOrder,
      confirmOrder,
      handleSizeChange,
      handleCurrentChange,
      goToUserProfile
    }
  }
}
</script>

<style scoped>
.order-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  margin-bottom: var(--spacing-xl);
}

.loading-container, .empty-container {
  padding: var(--spacing-xxl) 0;
}

/* 订单卡片样式已提取到公共样式文件 */

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
}
</style>