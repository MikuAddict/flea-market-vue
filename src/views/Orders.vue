<template>
  <div class="orders">
    <div class="orders-header">
      <h1>我的订单</h1>
    </div>

    <div class="orders-content">
      <!-- 订单筛选 -->
      <div class="filter-section">
        <el-radio-group v-model="filterStatus" @change="loadOrders">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="1">待付款</el-radio-button>
          <el-radio-button label="2">待发货</el-radio-button>
          <el-radio-button label="3">待收货</el-radio-button>
          <el-radio-button label="4">已完成</el-radio-button>
          <el-radio-button label="5">已取消</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 订单列表 -->
      <div class="orders-list">
        <div 
          v-for="order in orders" 
          :key="order.id"
          class="order-card"
        >
          <div class="order-header">
            <div class="order-info">
              <span class="order-no">订单号：{{ order.orderNo }}</span>
              <span class="order-time">{{ formatTime(order.createTime) }}</span>
            </div>
            <div class="order-status">
              <el-tag :type="getStatusType(order.status)">
                {{ getStatusText(order.status) }}
              </el-tag>
            </div>
          </div>

          <div class="order-items">
            <div 
              v-for="item in order.items" 
              :key="item.id"
              class="order-item"
            >
              <div class="item-image">
                <img :src="item.productImage || '/placeholder-image.png'" :alt="item.productName" />
              </div>
              <div class="item-info">
                <h4 class="item-name">{{ item.productName }}</h4>
                <p class="item-spec">{{ item.specification }}</p>
              </div>
              <div class="item-price">
                <span class="price">¥{{ item.price }}</span>
                <span class="quantity">x{{ item.quantity }}</span>
              </div>
            </div>
          </div>

          <div class="order-footer">
            <div class="order-total">
              合计：<span class="total-price">¥{{ order.totalPrice }}</span>
            </div>
            <div class="order-actions">
              <template v-if="order.status === 1">
                <el-button type="primary" size="small" @click="handlePay(order)">立即付款</el-button>
                <el-button size="small" @click="handleCancel(order.id)">取消订单</el-button>
              </template>
              <template v-else-if="order.status === 3">
                <el-button type="success" size="small" @click="handleConfirm(order.id)">确认收货</el-button>
              </template>
              <el-button link type="primary" @click="viewOrderDetail(order.id)">查看详情</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-section" v-if="total > 0">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <div v-if="orders.length === 0" class="empty-state">
        <el-empty description="暂无订单" />
      </div>
    </div>

    <!-- 付款对话框 -->
    <el-dialog v-model="showPayDialog" title="订单付款" width="400px">
      <div class="pay-dialog-content">
        <div class="pay-info">
          <p>订单号：{{ currentOrder?.orderNo }}</p>
          <p class="pay-amount">应付金额：<span>¥{{ currentOrder?.totalPrice }}</span></p>
        </div>
        
        <div class="pay-methods">
          <h4>选择支付方式</h4>
          <el-radio-group v-model="payMethod">
            <el-radio label="alipay">支付宝</el-radio>
            <el-radio label="wechat">微信支付</el-radio>
          </el-radio-group>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showPayDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmPay">确认支付</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import defaultApi from '../api/DefaultApi'
import ApiClient from '../ApiClient'

const api = new DefaultApi(new ApiClient())

const filterStatus = ref('')
const orders = ref([])
const total = ref(0)
const showPayDialog = ref(false)
const currentOrder = ref(null)
const payMethod = ref('alipay')

const pagination = ref({
  current: 1,
  size: 10
})

// 用户信息计算属性
// const userInfo = computed(() => {
//   const saved = localStorage.getItem('userInfo')
//   return saved ? JSON.parse(saved) : null
// })

onMounted(async () => {
  await loadOrders()
})

const loadOrders = async () => {
  try {
    const params = {
      ...pagination.value,
      status: filterStatus.value || undefined
    }

    const response = await api.listOrderUsingGET(params)
    if (response.code === 200) {
      orders.value = response.data.records || []
      total.value = response.data.total || 0
    } else {
      ElMessage.error('加载订单失败')
    }
  } catch (error) {
    console.error('加载订单失败:', error)
    ElMessage.error('加载订单失败')
  }
}

const getStatusText = (status) => {
  const statusMap = {
    1: '待付款',
    2: '待发货',
    3: '待收货',
    4: '已完成',
    5: '已取消'
  }
  return statusMap[status] || '未知状态'
}

const getStatusType = (status) => {
  const typeMap = {
    1: 'warning',
    2: 'info',
    3: 'primary',
    4: 'success',
    5: 'danger'
  }
  return typeMap[status] || 'info'
}

const handlePay = (order) => {
  currentOrder.value = order
  showPayDialog.value = true
}

const handleCancel = async (orderId) => {
  try {
    await ElMessageBox.confirm('确定要取消这个订单吗？', '提示', {
      type: 'warning'
    })

    const response = await api.cancelOrderUsingPOST({ id: orderId })
    if (response.code === 200) {
      ElMessage.success('订单取消成功')
      await loadOrders()
    } else {
      ElMessage.error(response.message || '取消订单失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消订单失败:', error)
      ElMessage.error('取消订单失败')
    }
  }
}

const handleConfirm = async (orderId) => {
  try {
    await ElMessageBox.confirm('确认收到商品了吗？', '提示', {
      type: 'warning'
    })

    const response = await api.confirmOrderUsingPOST({ id: orderId })
    if (response.code === 200) {
      ElMessage.success('确认收货成功')
      await loadOrders()
    } else {
      ElMessage.error(response.message || '确认收货失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('确认收货失败:', error)
      ElMessage.error('确认收货失败')
    }
  }
}

const confirmPay = async () => {
  try {
    // 模拟支付过程
    ElMessage.info('正在处理支付...')
    
    // 这里应该调用支付API
    // 模拟支付成功
    setTimeout(async () => {
      const response = await api.payOrderUsingPOST({ id: currentOrder.value.id })
      if (response.code === 200) {
        ElMessage.success('支付成功')
        showPayDialog.value = false
        await loadOrders()
      } else {
        ElMessage.error(response.message || '支付失败')
      }
    }, 2000)
    
  } catch (error) {
    console.error('支付失败:', error)
    ElMessage.error('支付失败')
  }
}

const viewOrderDetail = (orderId) => {
  // 这里可以跳转到订单详情页面
  ElMessage.info('查看订单详情：' + orderId)
}

const handleSizeChange = (size) => {
  pagination.value.size = size
  pagination.value.current = 1
  loadOrders()
}

const handleCurrentChange = (current) => {
  pagination.value.current = current
  loadOrders()
}

const formatTime = (timeString) => {
  if (!timeString) return ''
  return new Date(timeString).toLocaleString()
}
</script>

<style scoped>
.orders {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.orders-header {
  margin-bottom: 30px;
}

.orders-header h1 {
  color: #303133;
  margin: 0;
}

.filter-section {
  margin-bottom: 24px;
}

.orders-list {
  margin-bottom: 30px;
}

.order-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.order-info {
  display: flex;
  flex-direction: column;
}

.order-no {
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.order-time {
  font-size: 12px;
  color: #909399;
}

.order-items {
  margin-bottom: 16px;
}

.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.order-item:last-child {
  margin-bottom: 0;
}

.item-image {
  width: 60px;
  height: 60px;
  margin-right: 12px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.item-info {
  flex: 1;
}

.item-name {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 14px;
}

.item-spec {
  margin: 0;
  color: #909399;
  font-size: 12px;
}

.item-price {
  text-align: right;
}

.price {
  font-weight: 600;
  color: #f56c6c;
  display: block;
  margin-bottom: 4px;
}

.quantity {
  color: #909399;
  font-size: 12px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}

.total-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.order-actions {
  display: flex;
  gap: 8px;
}

.pagination-section {
  display: flex;
  justify-content: center;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}

.pay-dialog-content {
  padding: 20px 0;
}

.pay-info {
  margin-bottom: 20px;
}

.pay-amount {
  font-size: 18px;
  font-weight: bold;
}

.pay-amount span {
  color: #f56c6c;
}

.pay-methods h4 {
  margin-bottom: 12px;
  color: #303133;
}
</style>