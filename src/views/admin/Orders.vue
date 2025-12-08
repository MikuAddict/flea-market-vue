<template>
  <Layout>
    <div class="admin-orders unified-page-container fade-in">
      <!-- 页面标题和操作区域 -->
      <div class="page-header unified-flex unified-flex-between">
        <div>
          <h1 class="unified-title-xl">订单管理</h1>
          <p class="unified-text-secondary">管理系统中的所有订单</p>
        </div>
        <div class="header-actions unified-flex">
          <el-button 
            type="primary" 
            class="unified-button unified-button-primary"
            @click="exportOrders"
          >
            <el-icon><Download /></el-icon>
            导出订单
          </el-button>
        </div>
      </div>
      
      <!-- 订单统计卡片 -->
      <div class="stats-cards unified-grid unified-grid-4">
        <div class="stat-card fade-in" v-for="(stat, index) in orderStats" :key="stat.title" :style="{ animationDelay: `${index * 0.1}s` }">
          <el-card class="unified-card stat-item" :class="`stat-item-${stat.type}`">
            <div class="stat-content unified-flex unified-flex-center">
              <div class="stat-icon unified-flex unified-flex-center">
                <el-icon :size="24"><component :is="stat.icon" /></el-icon>
              </div>
              <div class="stat-info">
                <h3 class="stat-value">{{ stat.value }}</h3>
                <p class="stat-title">{{ stat.title }}</p>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      
      <!-- 筛选和搜索区域 -->
      <el-card class="unified-card filter-card fade-in">
        <template #header>
          <div class="card-header unified-flex unified-flex-between">
            <h3 class="unified-title-base">筛选与搜索</h3>
            <el-button 
              type="text" 
              @click="resetFilters"
              class="reset-btn"
            >
              重置
            </el-button>
          </div>
        </template>
        
        <el-form :model="filters" :inline="true" label-width="80px">
          <el-form-item label="订单号">
            <el-input
              v-model="filters.orderId"
              placeholder="搜索订单号"
              clearable
              class="unified-input"
              @keyup.enter="fetchOrders"
            />
          </el-form-item>
          
          <el-form-item label="产品名称">
            <el-input
              v-model="filters.productName"
              placeholder="搜索产品名称"
              clearable
              class="unified-input"
              @keyup.enter="fetchOrders"
            />
          </el-form-item>
          
          <el-form-item label="买家名称">
            <el-input
              v-model="filters.buyerName"
              placeholder="搜索买家名称"
              clearable
              class="unified-input"
              @keyup.enter="fetchOrders"
            />
          </el-form-item>
          
          <el-form-item label="订单状态">
            <el-select
              v-model="filters.status"
              placeholder="选择状态"
              clearable
              class="unified-input filter-select"
            >
              <el-option label="待付款" :value="0" />
              <el-option label="已付款" :value="1" />
              <el-option label="已完成" :value="2" />
              <el-option label="已取消" :value="3" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="下单时间">
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="unified-input"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              class="unified-button unified-button-primary"
              @click="fetchOrders"
            >
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 订单列表 -->
      <el-card class="unified-card orders-card fade-in">
        <template #header>
          <div class="card-header unified-flex unified-flex-between">
            <h3 class="unified-title-base">订单列表</h3>
            <div class="batch-actions unified-flex unified-flex-center">
              <el-button
                v-if="selectedOrders.length > 0"
                type="primary"
                size="small"
                class="unified-button"
                @click="batchCancelOrders"
              >
                批量取消
              </el-button>
            </div>
          </div>
        </template>
        
        <el-table
          v-loading="loading"
          :data="orderList"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" />
          
          <el-table-column prop="id" label="订单号" width="100" />
          
          <el-table-column label="产品信息" min-width="200">
            <template #default="scope">
              <div class="product-info unified-flex">
                <el-image
                  :src="scope.row.productImage"
                  class="product-image"
                  fit="cover"
                >
                  <template #error>
                    <div class="image-placeholder">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
                <div class="product-details">
                  <h4 class="product-name">{{ scope.row.productName }}</h4>
                  <p class="product-desc">{{ scope.row.productDescription?.substring(0, 30) }}...</p>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="amount" label="订单金额" width="120">
            <template #default="scope">
              <div class="price-info">
                <span class="price-symbol">¥</span>
                <span class="price-value">{{ formatPrice(scope.row.amount) }}</span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="buyerName" label="买家信息" width="150">
            <template #default="scope">
              <div class="buyer-info">
                <div class="buyer-name">{{ scope.row.buyerName }}</div>
                <div class="buyer-phone">{{ scope.row.buyerPhone }}</div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="sellerName" label="卖家信息" width="150">
            <template #default="scope">
              <div class="seller-info">
                <div class="seller-name">{{ scope.row.sellerName }}</div>
                <div class="seller-phone">{{ scope.row.sellerPhone }}</div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="status" label="订单状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)" size="small">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="createTime" label="下单时间" width="160">
            <template #default="scope">
              {{ formatDate(scope.row.createTime) }}
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <div class="action-buttons unified-flex">
                <el-button
                  size="small"
                  type="text"
                  @click="viewOrder(scope.row)"
                >
                  查看
                </el-button>
                
                <el-dropdown @command="(command) => handleOrderAction(command, scope.row)">
                  <el-button size="small" type="text">
                    更多
                    <el-icon><ArrowDown /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="refund" v-if="scope.row.status === 2">
                        申请退款
                      </el-dropdown-item>
                      <el-dropdown-item command="cancel" v-if="scope.row.status < 2">
                        取消订单
                      </el-dropdown-item>
                      <el-dropdown-item command="complete" v-if="scope.row.status === 1">
                        完成订单
                      </el-dropdown-item>
                      <el-dropdown-item divided command="delete">删除订单</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination-container unified-flex unified-flex-center">
          <el-pagination
            v-model:current-page="pagination.current"
            v-model:page-size="pagination.size"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
          />
        </div>
      </el-card>
    </div>
  </Layout>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Download, 
  Search, 
  Edit, 
  Delete, 
  ArrowDown,
  Picture,
  ShoppingCart,
  Money,
  User,
  Clock,
  Check,
  Close
} from '@element-plus/icons-vue'
import { formatPrice, formatDate } from '@/utils/format'
import { orderApi } from '@/api'
import Layout from '@/components/Layout.vue'

export default {
  name: 'AdminOrders',
  components: {
    Layout
  },
  setup() {
    const router = useRouter()
    
    // 响应式数据
    const loading = ref(false)
    const orderList = ref([])
    const selectedOrders = ref([])
    
    // 分页信息
    const pagination = reactive({
      current: 1,
      size: 10,
      total: 0
    })
    
    // 筛选条件
    const filters = reactive({
      orderId: '',
      productName: '',
      buyerName: '',
      status: '',
      dateRange: null
    })
    
    // 订单统计数据
    const orderStats = computed(() => [
      {
        title: '总订单数',
        value: orderList.value.length,
        icon: 'ShoppingCart',
        type: 'primary'
      },
      {
        title: '待付款',
        value: orderList.value.filter(order => order.status === 0).length,
        icon: 'Clock',
        type: 'warning'
      },
      {
        title: '已付款',
        value: orderList.value.filter(order => order.status === 1).length,
        icon: 'Money',
        type: 'success'
      },
      {
        title: '已完成',
        value: orderList.value.filter(order => order.status === 2).length,
        icon: 'Check',
        type: 'danger'
      }
    ])
    
    // 获取订单列表
    const fetchOrders = async () => {
      loading.value = true
      try {
        const params = {
          current: pagination.current,
          size: pagination.size,
          orderId: filters.orderId,
          productName: filters.productName,
          buyerName: filters.buyerName,
          status: filters.status
        }
        
        // 处理日期范围
        if (filters.dateRange && filters.dateRange.length === 2) {
          params.startDate = filters.dateRange[0]
          params.endDate = filters.dateRange[1]
        }
        
        // 调用API获取订单列表
        // const response = await orderApi.getOrderList(params)
        
        // 模拟数据
        const response = {
          data: {
            code: 200,
            data: {
              records: [
                {
                  id: 'ORD001',
                  productName: '二手笔记本电脑',
                  productDescription: '高性能笔记本电脑，轻薄便携',
                  productImage: 'https://picsum.photos/seed/laptop/100/100.jpg',
                  amount: 2999,
                  buyerName: '张三',
                  buyerPhone: '13800138000',
                  sellerName: '李四',
                  sellerPhone: '13800138001',
                  status: 1,
                  createTime: '2023-12-08T10:30:00'
                },
                {
                  id: 'ORD002',
                  productName: '二手智能手机',
                  productDescription: '苹果手机，九成新',
                  productImage: 'https://picsum.photos/seed/phone/100/100.jpg',
                  amount: 1599,
                  buyerName: '王五',
                  buyerPhone: '13800138002',
                  sellerName: '赵六',
                  sellerPhone: '13800138003',
                  status: 2,
                  createTime: '2023-12-07T15:45:00'
                },
                {
                  id: 'ORD003',
                  productName: '二手教材',
                  productDescription: '高等数学教材',
                  productImage: 'https://picsum.photos/seed/book/100/100.jpg',
                  amount: 35,
                  buyerName: '孙七',
                  buyerPhone: '13800138004',
                  sellerName: '周八',
                  sellerPhone: '13800138005',
                  status: 0,
                  createTime: '2023-12-06T09:20:00'
                }
              ],
              total: 3
            }
          }
        }
        
        if (response.data && response.data.code === 200) {
          orderList.value = response.data.data.records || []
          pagination.total = response.data.data.total || 0
        } else {
          ElMessage.error('获取订单列表失败')
        }
      } catch (error) {
        console.error('获取订单列表失败:', error)
        ElMessage.error('获取订单列表失败')
      } finally {
        loading.value = false
      }
    }
    
    // 重置筛选条件
    const resetFilters = () => {
      Object.keys(filters).forEach(key => {
        if (key === 'dateRange') {
          filters[key] = null
        } else {
          filters[key] = ''
        }
      })
      pagination.current = 1
      fetchOrders()
    }
    
    // 处理表格选择变化
    const handleSelectionChange = (selection) => {
      selectedOrders.value = selection
    }
    
    // 处理分页大小变化
    const handleSizeChange = (size) => {
      pagination.size = size
      pagination.current = 1
      fetchOrders()
    }
    
    // 处理当前页变化
    const handleCurrentChange = (current) => {
      pagination.current = current
      fetchOrders()
    }
    
    // 查看订单详情
    const viewOrder = (order) => {
      router.push(`/orders/${order.id}`)
    }
    
    // 处理订单操作
    const handleOrderAction = async (command, order) => {
      switch (command) {
        case 'refund':
          try {
            await ElMessageBox.confirm(`确定要为订单 "${order.id}" 申请退款吗？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            
            // 调用退款API
            // await orderApi.refundOrder(order.id)
            ElMessage.success('退款申请已提交')
          } catch (error) {
            if (error !== 'cancel') {
              ElMessage.error('退款申请失败')
            }
          }
          break
          
        case 'cancel':
          try {
            await ElMessageBox.confirm(`确定要取消订单 "${order.id}" 吗？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            
            // 调用取消订单API
            // await orderApi.cancelOrder(order.id)
            ElMessage.success('订单已取消')
            fetchOrders()
          } catch (error) {
            if (error !== 'cancel') {
              ElMessage.error('订单取消失败')
            }
          }
          break
          
        case 'complete':
          try {
            await ElMessageBox.confirm(`确定要完成订单 "${order.id}" 吗？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            
            // 调用完成订单API
            // await orderApi.completeOrder(order.id)
            ElMessage.success('订单已完成')
            fetchOrders()
          } catch (error) {
            if (error !== 'cancel') {
              ElMessage.error('订单操作失败')
            }
          }
          break
          
        case 'delete':
          try {
            await ElMessageBox.confirm(`确定要删除订单 "${order.id}" 吗？此操作不可恢复。`, '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            })
            
            // 调用删除订单API
            // await orderApi.deleteOrder(order.id)
            ElMessage.success('订单删除成功')
            fetchOrders()
          } catch (error) {
            if (error !== 'cancel') {
              ElMessage.error('订单删除失败')
            }
          }
          break
      }
    }
    
    // 批量取消订单
    const batchCancelOrders = async () => {
      try {
        await ElMessageBox.confirm(`确定要取消选中的 ${selectedOrders.value.length} 个订单吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // 调用批量取消订单API
        // const promises = selectedOrders.value.map(order => orderApi.cancelOrder(order.id))
        // await Promise.all(promises)
        
        ElMessage.success('批量取消成功')
        fetchOrders()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('批量取消失败')
        }
      }
    }
    
    // 导出订单
    const exportOrders = async () => {
      try {
        // 调用导出订单API
        // await orderApi.exportOrders(filters)
        ElMessage.success('订单导出成功')
      } catch (error) {
        ElMessage.error('订单导出失败')
      }
    }
    
    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        0: '待付款',
        1: '已付款',
        2: '已完成',
        3: '已取消'
      }
      return statusMap[status] || '未知'
    }
    
    // 获取状态类型
    const getStatusType = (status) => {
      const typeMap = {
        0: 'warning',
        1: 'primary',
        2: 'success',
        3: 'danger'
      }
      return typeMap[status] || 'info'
    }
    
    onMounted(() => {
      fetchOrders()
    })
    
    return {
      loading,
      orderList,
      selectedOrders,
      pagination,
      filters,
      orderStats,
      fetchOrders,
      resetFilters,
      handleSelectionChange,
      handleSizeChange,
      handleCurrentChange,
      viewOrder,
      handleOrderAction,
      batchCancelOrders,
      exportOrders,
      getStatusText,
      getStatusType,
      formatPrice,
      formatDate
    }
  }
}
</script>

<style scoped>
/* 页面头部样式 */
.page-header {
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  margin-bottom: var(--spacing-xs);
}

/* 统计卡片样式 */
.stats-cards {
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  height: 100%;
}

.stat-item {
  height: 120px;
  padding: var(--spacing-lg);
}

.stat-content {
  height: 100%;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: var(--spacing-base);
}

.stat-item-primary .stat-icon {
  background-color: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
}

.stat-item-success .stat-icon {
  background-color: rgba(103, 194, 58, 0.1);
  color: var(--success-color);
}

.stat-item-warning .stat-icon {
  background-color: rgba(230, 162, 60, 0.1);
  color: var(--warning-color);
}

.stat-item-danger .stat-icon {
  background-color: rgba(245, 108, 108, 0.1);
  color: var(--danger-color);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
}

.stat-title {
  color: var(--text-secondary);
  margin: 0;
}

/* 筛选区域样式 */
.filter-card {
  margin-bottom: var(--spacing-xl);
}

.card-header {
  margin-bottom: var(--spacing-base);
}

.reset-btn {
  color: var(--text-secondary);
}

.filter-select {
  width: 150px;
}

/* 订单列表样式 */
.orders-card {
  margin-bottom: var(--spacing-xl);
}

.product-info {
  gap: var(--spacing-base);
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-base);
  overflow: hidden;
  box-shadow: var(--shadow-light);
}

.product-details {
  flex: 1;
}

.product-name {
  margin: 0 0 var(--spacing-xs) 0;
  font-weight: 500;
  color: var(--text-primary);
  font-size: var(--font-size-base);
}

.product-desc {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.4;
}

.price-info {
  display: flex;
  align-items: baseline;
  color: var(--danger-color);
  font-weight: 500;
}

.price-symbol {
  font-size: var(--font-size-sm);
}

.price-value {
  font-size: var(--font-size-lg);
}

.buyer-info, .seller-info {
  font-size: var(--font-size-sm);
}

.buyer-name, .seller-name {
  font-weight: 500;
  color: var(--text-primary);
}

.buyer-phone, .seller-phone {
  color: var(--text-secondary);
}

.action-buttons {
  gap: var(--spacing-xs);
}

.pagination-container {
  margin-top: var(--spacing-xl);
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: var(--bg-lighter);
  color: var(--text-placeholder);
  font-size: var(--font-size-lg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-base);
  }
  
  .product-info {
    flex-direction: column;
  }
  
  .product-image {
    width: 100%;
    height: 120px;
  }
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}
</style>