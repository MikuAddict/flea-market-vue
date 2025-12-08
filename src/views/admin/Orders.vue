<template>
  <div class="admin-orders">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单管理</span>
        </div>
      </template>
      
      <!-- 搜索和筛选 -->
      <div class="filter-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索订单号或二手物品名称"
          style="width: 300px; margin-right: 10px"
          @keyup.enter="handleSearch"
        />
        <el-select v-model="filterStatus" placeholder="订单状态" clearable style="width: 120px; margin-right: 10px">
          <el-option label="待付款" value="pending" />
          <el-option label="已付款" value="paid" />
          <el-option label="已发货" value="shipped" />
          <el-option label="已完成" value="completed" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 240px; margin-right: 10px"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>

      <!-- 订单列表 -->
      <el-table :data="orderList" v-loading="loading" style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="订单号" width="120" />
        <el-table-column prop="productName" label="二手物品名称" />
        <el-table-column prop="buyerName" label="买家" width="120" />
        <el-table-column prop="sellerName" label="卖家" width="120" />
        <el-table-column prop="price" label="金额" width="100">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="totalAmount" label="总金额" width="100">
          <template #default="{ row }">
            ¥{{ row.totalAmount }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button 
              v-if="row.status === 'paid'" 
              size="small" 
              type="success"
              @click="handleShip(row)"
            >
              发货
            </el-button>
            <el-button 
              v-if="row.status === 'pending'" 
              size="small" 
              type="danger"
              @click="handleCancel(row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="订单详情" width="700px">
      <div v-if="currentOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ currentOrder.id }}</el-descriptions-item>
          <el-descriptions-item label="二手物品名称">{{ currentOrder.productName }}</el-descriptions-item>
          <el-descriptions-item label="买家">{{ currentOrder.buyerName }}</el-descriptions-item>
          <el-descriptions-item label="卖家">{{ currentOrder.sellerName }}</el-descriptions-item>
          <el-descriptions-item label="单价">¥{{ currentOrder.price }}</el-descriptions-item>
          <el-descriptions-item label="数量">{{ currentOrder.quantity }}</el-descriptions-item>
          <el-descriptions-item label="总金额">¥{{ currentOrder.totalAmount }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentOrder.status)">
              {{ getStatusText(currentOrder.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDate(currentOrder.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="付款时间" v-if="currentOrder.paidAt">
            {{ formatDate(currentOrder.paidAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="发货时间" v-if="currentOrder.shippedAt">
            {{ formatDate(currentOrder.shippedAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="完成时间" v-if="currentOrder.completedAt">
            {{ formatDate(currentOrder.completedAt) }}
          </el-descriptions-item>
        </el-descriptions>
        
        <el-divider />
        <h4>收货地址</h4>
        <p v-if="currentOrder.shippingAddress">
          {{ currentOrder.shippingAddress.recipient }} | 
          {{ currentOrder.shippingAddress.phone }}<br>
          {{ currentOrder.shippingAddress.address }}
        </p>
        <p v-else>未提供收货地址</p>
      </div>
    </el-dialog>

    <!-- 发货对话框 -->
    <el-dialog v-model="shipDialogVisible" title="发货信息" width="500px">
      <el-form :model="shipForm" label-width="80px">
        <el-form-item label="快递公司">
          <el-input v-model="shipForm.shippingCompany" placeholder="请输入快递公司名称" />
        </el-form-item>
        <el-form-item label="快递单号">
          <el-input v-model="shipForm.trackingNumber" placeholder="请输入快递单号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="shipDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleShipSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { orderApi } from '@/api'
import { formatDate } from '@/utils/format'

export default {
  name: 'AdminOrders',
  setup() {
    const loading = ref(false)
    const orderList = ref([])
    const searchKeyword = ref('')
    const filterStatus = ref('')
    const dateRange = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const detailDialogVisible = ref(false)
    const shipDialogVisible = ref(false)
    const currentOrder = ref(null)
    const shipForm = ref({
      orderId: '',
      shippingCompany: '',
      trackingNumber: ''
    })

    // 获取订单列表
    const fetchOrders = async () => {
      loading.value = true
      try {
        const params = {
          page: currentPage.value,
          pageSize: pageSize.value,
          keyword: searchKeyword.value,
          status: filterStatus.value,
          startDate: dateRange.value?.[0] ? formatDate(dateRange.value[0], 'YYYY-MM-DD') : '',
          endDate: dateRange.value?.[1] ? formatDate(dateRange.value[1], 'YYYY-MM-DD') : ''
        }
        const response = await orderApi.getOrders(params)
        orderList.value = response.data.orders
        total.value = response.data.total
      } catch (error) {
        console.error('获取订单列表失败:', error)
        ElMessage.error('获取订单列表失败')
      } finally {
        loading.value = false
      }
    }

    // 获取状态类型
    const getStatusType = (status) => {
      const types = {
        pending: 'warning',
        paid: 'primary',
        shipped: 'info',
        completed: 'success',
        cancelled: 'danger'
      }
      return types[status] || 'info'
    }

    // 获取状态文本
    const getStatusText = (status) => {
      const texts = {
        pending: '待付款',
        paid: '已付款',
        shipped: '已发货',
        completed: '已完成',
        cancelled: '已取消'
      }
      return texts[status] || '未知'
    }

    // 搜索
    const handleSearch = () => {
      currentPage.value = 1
      fetchOrders()
    }

    // 重置搜索
    const resetSearch = () => {
      searchKeyword.value = ''
      filterStatus.value = ''
      dateRange.value = []
      currentPage.value = 1
      fetchOrders()
    }

    // 分页处理
    const handleSizeChange = (size) => {
      pageSize.value = size
      fetchOrders()
    }

    const handleCurrentChange = (page) => {
      currentPage.value = page
      fetchOrders()
    }

    // 查看订单详情
    const handleView = (order) => {
      currentOrder.value = order
      detailDialogVisible.value = true
    }

    // 发货
    const handleShip = (order) => {
      shipForm.value = {
        orderId: order.id,
        shippingCompany: '',
        trackingNumber: ''
      }
      shipDialogVisible.value = true
    }

    // 提交发货信息
    const handleShipSubmit = async () => {
      try {
        await orderApi.shipOrder(shipForm.value.orderId, {
          shippingCompany: shipForm.value.shippingCompany,
          trackingNumber: shipForm.value.trackingNumber
        })
        ElMessage.success('发货成功')
        shipDialogVisible.value = false
        fetchOrders()
      } catch (error) {
        console.error('发货失败:', error)
        ElMessage.error('发货失败')
      }
    }

    // 取消订单
    const handleCancel = async (order) => {
      try {
        await ElMessageBox.confirm(
          `确定要取消订单 "${order.id}" 吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        await orderApi.cancelOrder(order.id)
        ElMessage.success('订单取消成功')
        fetchOrders()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('取消订单失败:', error)
          ElMessage.error('取消订单失败')
        }
      }
    }

    onMounted(() => {
      fetchOrders()
    })

    return {
      loading,
      orderList,
      searchKeyword,
      filterStatus,
      dateRange,
      currentPage,
      pageSize,
      total,
      detailDialogVisible,
      shipDialogVisible,
      currentOrder,
      shipForm,
      handleSearch,
      resetSearch,
      handleSizeChange,
      handleCurrentChange,
      handleView,
      handleShip,
      handleShipSubmit,
      handleCancel,
      getStatusType,
      getStatusText,
      formatDate
    }
  }
}
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.order-detail h4 {
  margin: 0 0 10px 0;
  color: #303133;
}

.order-detail p {
  margin: 0;
  color: #606266;
}
</style>