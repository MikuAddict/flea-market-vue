<template>
  <Layout>
    <div class="order-list-container">
      <el-card class="order-card">
        <template #header>
          <div class="card-header">
            <span>我的订单</span>
          </div>
        </template>
        
        <!-- 订单状态筛选 -->
        <div class="filter-section">
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="全部" name="all" />
            <el-tab-pane label="待支付" name="0" />
            <el-tab-pane label="已支付" name="1" />
            <el-tab-pane label="已完成" name="2" />
            <el-tab-pane label="已取消" name="3" />
          </el-tabs>
        </div>
        
        <!-- 订单列表 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="3" animated />
        </div>
        
        <div v-else-if="orders.length === 0" class="empty-container">
          <el-empty description="暂无订单" />
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
                  <h4>{{ order.product?.productName || '商品已删除' }}</h4>
                  <p v-if="order.product">
                    分类: {{ order.product.category?.name }}
                  </p>
                  <p>支付方式: {{ formatPaymentMethod(order.paymentMethod) }}</p>
                </div>
              </div>
              
              <div class="order-amount">
                <div class="amount-label">订单金额</div>
                <div class="amount-value">¥{{ formatPrice(order.amount) }}</div>
              </div>
            </div>
            
            <div class="order-footer">
              <div class="order-seller">
                卖家: {{ order.seller?.userName || '未知' }}
              </div>
              <div class="order-actions">
                <el-button
                  size="small"
                  @click="viewOrder(order.id)"
                >
                  查看详情
                </el-button>
                
                <!-- 待支付状态的操作 -->
                <template v-if="order.status === 0">
                  <el-button
                    size="small"
                    type="primary"
                    @click="payOrder(order)"
                  >
                    支付
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="cancelOrder(order.id)"
                  >
                    取消
                  </el-button>
                </template>
                
                <!-- 已支付状态的操作 -->
                <template v-if="order.status === 1">
                  <el-button
                    size="small"
                    type="success"
                    @click="confirmOrder(order.id)"
                  >
                    确认收货
                  </el-button>
                </template>
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import api from '@/api'
import {
  formatPrice,
  formatPaymentMethod,
  formatOrderStatus,
  formatDate,
  getOrderStatusType
} from '@/utils/format'

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
    
    // 获取订单列表
    const fetchOrders = async () => {
      loading.value = true
      try {
        let response
        
        if (activeTab.value === 'all') {
          response = await api.order.getBuyerOrderList({
            current: pagination.current,
            size: pagination.size
          })
        } else {
          response = await api.order.getBuyerOrderListByStatus(parseInt(activeTab.value), {
            current: pagination.current,
            size: pagination.size
          })
        }
        
        orders.value = response.data.data.records || []
        total.value = response.data.data.total || 0
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
    
    // 支付订单
    const payOrder = async (order) => {
      try {
        let result
        
        switch (order.paymentMethod) {
          case 0: // 现金支付
            ElMessageBox.prompt('请输入支付凭证图片URL', '上传支付凭证', {
              confirmButtonText: '提交',
              cancelButtonText: '取消'
            }).then(async ({ value }) => {
              try {
                await api.order.submitPaymentProof({
                  orderId: order.id,
                  paymentProof: value
                })
                ElMessage.success('支付凭证已提交，请等待卖家确认')
                fetchOrders()
              } catch (error) {
                console.error('提交支付凭证失败:', error)
                ElMessage.error('提交支付凭证失败')
              }
            }).catch(() => {})
            return
            
          case 1: // 微信支付
            result = await api.order.wechatPay(order.id)
            break
            
          case 2: // 积分兑换
            result = await api.order.pointsPay(order.id)
            break
            
          case 3: // 物品交换
            result = await api.order.applyExchange(order.id)
            break
            
          default:
            ElMessage.error('未知的支付方式')
            return
        }
        
        if (result.data.code === 0) {
          ElMessage.success('支付成功')
          fetchOrders()
        }
      } catch (error) {
        console.error('支付失败:', error)
        ElMessage.error('支付失败')
      }
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
        
        await api.order.cancelOrder(orderId)
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
          '确认已收到商品吗？确认后订单将完成。',
          '确认收货',
          {
            confirmButtonText: '确认收货',
            cancelButtonText: '取消',
            type: 'info'
          }
        )
        
        await api.order.confirmOrder(orderId)
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
      payOrder,
      cancelOrder,
      confirmOrder,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.order-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  margin-bottom: 20px;
}

.loading-container, .empty-container {
  padding: 40px 0;
}

.order-list {
  margin-bottom: 20px;
}

.order-item {
  margin-bottom: 20px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.order-id {
  font-weight: 500;
}

.order-time {
  color: #909399;
  font-size: 14px;
}

.order-content {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
}

.product-info {
  display: flex;
  gap: 15px;
  flex: 1;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  color: #c0c4cc;
  font-size: 24px;
}

.product-details h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.product-details p {
  margin: 0 0 5px 0;
  color: #606266;
  font-size: 14px;
}

.order-amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  min-width: 120px;
}

.amount-label {
  font-size: 14px;
  color: #606266;
}

.amount-value {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
  margin-top: 5px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.order-seller {
  color: #606266;
  font-size: 14px;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>