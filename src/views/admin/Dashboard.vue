<template>
  <Layout>
    <div class="admin-dashboard unified-page-container fade-in">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="unified-title-xl">管理仪表盘</h1>
      </div>
            
      <!-- 快速操作区域 -->
      <div class="actions-container">
        <el-card class="unified-card actions-card fade-in">
          <template #header>
            <h3 class="unified-title-base">快速操作</h3>
          </template>
          <div class="actions-grid unified-grid unified-grid-4">
            <div 
              class="action-item fade-in" 
              v-for="(action, index) in quickActions" 
              :key="action.title"
              @click="action.handler"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="action-icon unified-flex unified-flex-center">
                <el-icon :size="24"><component :is="action.icon" /></el-icon>
              </div>
              <p class="action-title">{{ action.title }}</p>
            </div>
          </div>
        </el-card>
      </div>
      <!-- 统计卡片区域 -->
      <div class="stats-container">
        <div class="unified-grid unified-grid-4">
          <div class="stat-card fade-in" v-for="(stat, index) in statsData" :key="stat.title" :style="{ animationDelay: `${index * 0.1}s` }">
            <el-card class="unified-card stat-item" :class="`stat-item-${stat.type}`">
              <div class="stat-content unified-flex unified-flex-col">
                <div class="stat-icon unified-flex unified-flex-center">
                  <el-icon :size="32"><component :is="stat.icon" /></el-icon>
                </div>
                <div class="stat-info">
                  <h3 class="stat-value">{{ stat.value }}</h3>
                  <p class="stat-title">{{ stat.title }}</p>
                </div>
                <div class="stat-trend unified-flex unified-flex-center" :class="`trend-${stat.trend}`">
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
      
      <!-- 图表和数据区域 -->
      <div class="charts-container">
        <el-row :gutter="24">
          <!-- 交易趋势图表 -->
          <el-col :xs="24" :lg="16">
            <el-card class="unified-card chart-card fade-in">
              <template #header>
                <h3 class="unified-title-base">近一个月的交易趋势</h3>
              </template>
              <div class="chart-container" ref="trendChart"></div>
            </el-card>
          </el-col>
          
          <!-- 交易额和交易量统计 -->
          <el-col :xs="24" :lg="8">
            <el-card class="unified-card chart-card fade-in">
              <template #header>
                <h3 class="unified-title-base">交易统计</h3>
              </template>
              <div class="trade-stats-container">
                <div class="trade-stat-item">
                  <div class="trade-stat-icon unified-flex unified-flex-center">
                    <el-icon :size="32"><ShoppingCartFull /></el-icon>
                  </div>
                  <div class="trade-stat-info">
                    <h3 class="trade-stat-value">{{ monthlyTradeCount }}</h3>
                    <p class="trade-stat-title">本月交易量</p>
                  </div>
                </div>
                <div class="trade-stat-item">
                  <div class="trade-stat-icon unified-flex unified-flex-center">
                    <el-icon :size="32"><CreditCard /></el-icon>
                  </div>
                  <div class="trade-stat-info">
                    <h3 class="trade-stat-value">¥{{ formatPrice(monthlyTradeAmount) }}</h3>
                    <p class="trade-stat-title">本月交易额</p>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <!-- 数据表格区域 -->
      <div class="tables-container">
        <el-row :gutter="24">
          <!-- 高需求量二手物品排行 -->
          <el-col :xs="24" :lg="12">
            <el-card class="unified-card table-card fade-in">
              <template #header>
                <div class="card-header unified-flex unified-flex-between">
                  <h3 class="unified-title-base">高需求量二手物品排行</h3>
                  <el-button type="text" @click="goToProducts" class="view-more-btn">
                    查看更多
                    <el-icon><ArrowRight /></el-icon>
                  </el-button>
                </div>
              </template>
              <el-table :data="hotProducts" style="width: 100%">
                <el-table-column prop="productName" label="名称" min-width="120" />
                <el-table-column prop="viewCount" label="售出量" width="100" />
                <el-table-column prop="salesAmount" label="售出金额" width="100">
                  <template #default="scope">
                    ¥{{ formatPrice(scope.row.salesAmount) }}
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
          
          <!-- 高闲置量二手物品排行 -->
          <el-col :xs="24" :lg="12">
            <el-card class="unified-card table-card fade-in">
              <template #header>
                <div class="card-header unified-flex unified-flex-between">
                  <h3 class="unified-title-base">高闲置量二手物品排行</h3>
                  <el-button type="text" @click="goToHighInventoryProducts" class="view-more-btn">
                    查看更多
                    <el-icon><ArrowRight /></el-icon>
                  </el-button>
                </div>
              </template>
              <el-table :data="highInventoryProducts" style="width: 100%" v-loading="highInventoryLoading">
                <el-table-column prop="productName" label="物品名称" min-width="120" />
                <el-table-column prop="categoryName" label="分类" width="100" />
                <el-table-column prop="inventoryCount" label="闲置数量" width="100">
                  <template #default="scope">
                    <el-tag type="warning" size="small">{{ scope.row.inventoryCount }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="价格" width="100">
                  <template #default="scope">
                    ¥{{ formatPrice(scope.row.price) }}
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </Layout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { formatPrice, formatDate } from '@/utils/format'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { statisticsApi, adminApi } from '@/api'
import Layout from '@/components/Layout.vue'
import { 
  User,
  Goods,
  ShoppingCartFull,
  CreditCard,
  ArrowUp,
  ArrowDown,
  Plus,
  Message,
  Edit,
  ArrowRight
} from '@element-plus/icons-vue'

export default {
  name: 'AdminDashboard',
  components: {
    Layout
  },
  setup() {
    const router = useRouter()
    
    // 图表引用
    const trendChart = ref(null)
    
    // 交易统计数据
    const monthlyTradeAmount = ref(0)
    const monthlyTradeCount = ref(0)
    
    // 统计数据
    const statsData = ref([
      {
        title: '总用户数',
        value: 0,
        icon: 'User',
        type: 'primary',
        trend: 'up',
        trendIcon: 'ArrowUp',
        trendText: '0%'
      },
      {
        title: '在售二手物品数',
        value: 0,
        icon: 'Goods',
        type: 'success',
        trend: 'up',
        trendIcon: 'ArrowUp',
        trendText: '0%'
      },
      {
        title: '交易订单数',
        value: 0,
        icon: 'ShoppingCartFull',
        type: 'warning',
        trend: 'down',
        trendIcon: 'ArrowDown',
        trendText: '0%'
      },
      {
        title: '总交易金额',
        value: '¥0.00',
        icon: 'CreditCard',
        type: 'danger',
        trend: 'up',
        trendIcon: 'ArrowUp',
        trendText: '0%'
      }
    ])
    
    // 热门二手物品（需求量大的二手物品）
    const hotProducts = ref([])
    
    // 高闲置量二手物品
    const highInventoryProducts = ref([])
    const highInventoryLoading = ref(false)
    
    // 快速操作
    const quickActions = ref([
      {
        title: '用户管理',
        icon: 'Plus',
        handler: () => router.push('/admin/users?action=add')
      },
      {
        title: '分类管理',
        icon: 'Plus',
        handler: () => router.push('/admin/categories?action=add')
      },
      {
        title: '发布公告',
        icon: 'Message',
        handler: () => router.push('/admin/news?action=add')
      },
      {
        title: '统计分析',
        icon: 'Edit',
        handler: () => router.push('/admin/statistics')
      }
    ])
    
    // 获取需求量大的二手物品分类
    const fetchHighDemandCategories = async () => {
      try {
        const response = await statisticsApi.getHighDemandCategories(5)
        if (response.data && response.data.code === 200) {
          // 将API返回的数据转换为表格需要的格式
          hotProducts.value = (response.data.data || []).map(item => ({
            id: item.categoryId,
            productName: item.categoryName,
            categoryName: item.categoryName,
            viewCount: item.productCount || 0,
            salesAmount: 0,
            imageUrl: item.imageUrl
          }))
        }
      } catch (error) {
        console.error('获取需求量大的二手物品分类失败:', error)
      }
    }
    
    // 获取总统计数据
    const fetchComprehensiveStatistics = async () => {
      try {
        // 获取当前月份的数据
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1
        const currentYear = currentDate.getFullYear()
        
        // 获取上个月的数据
        let prevMonth = currentMonth - 1
        let prevYear = currentYear
        if (prevMonth === 0) {
          prevMonth = 12
          prevYear = currentYear - 1
        }
        
        // 并发请求多个API获取统计数据
        const [currentMonthlyResponse, prevMonthlyResponse, orderStatsResponse] = await Promise.all([
          statisticsApi.getMonthlyStatistics(currentMonth, currentYear),
          statisticsApi.getMonthlyStatistics(prevMonth, prevYear),
          statisticsApi.getOrderStatistics()
        ])
        
        // 处理月度统计数据
        if (currentMonthlyResponse.data && currentMonthlyResponse.data.code === 200) {
          const currentStats = currentMonthlyResponse.data.data
          const prevStats = prevMonthlyResponse.data && prevMonthlyResponse.data.code === 200 ? prevMonthlyResponse.data.data : null
          
          // 处理订单统计数据
          let orderStats = {}
          if (orderStatsResponse.data && orderStatsResponse.data.code === 200) {
            orderStats = orderStatsResponse.data.data
          }
          
          // 计算趋势百分比
          const calculateTrend = (current, prev) => {
            if (!prev || prev === 0) return { trend: 'up', text: '0%' }
            const change = ((current - prev) / prev) * 100
            return {
              trend: change >= 0 ? 'up' : 'down',
              text: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
            }
          }
          
          // 获取上月的交易量和交易额
          const prevTradeCount = prevStats?.totalTradeCount || 0
          const prevTradeAmount = prevStats?.totalTradeAmount || 0
          
          // 获取当前的交易量和交易额
          const currentTradeCount = currentStats?.totalTradeCount || 0
          const currentTradeAmount = currentStats?.totalTradeAmount || 0
          
          // 更新交易统计数据
          monthlyTradeAmount.value = currentTradeAmount
          monthlyTradeCount.value = currentTradeCount
          
          // 获取订单统计数据
          const totalOrders = orderStats.totalOrders || 0
          
          // 获取总用户数和总商品数（使用较大的页码获取所有数据）
          try {
            // 调用API获取总用户数和总商品数
            const [userResponse, productResponse] = await Promise.all([
              adminApi.user.getUserVoList({ current: 1, size: 1 }),
              adminApi.product.adminListProducts({ current: 1, size: 1 })
            ])
            
            const totalUsers = userResponse.data?.data?.total || 0
            const totalProducts = productResponse.data?.data?.total || 0
            
            // 更新统计卡片数据
            statsData.value = [
              {
                title: '总用户数',
                value: totalUsers,
                icon: 'User',
                type: 'primary',
                trend: 'up',
                trendIcon: 'ArrowUp',
                trendText: '12.5%'
              },
              {
                title: '在售二手物品数',
                value: totalProducts,
                icon: 'Goods',
                type: 'success',
                trend: 'up',
                trendIcon: 'ArrowUp',
                trendText: '8.3%'
              },
              {
                title: '交易订单数',
                value: totalOrders,
                icon: 'ShoppingCartFull',
                type: 'warning',
                trend: calculateTrend(totalOrders, prevTradeCount).trend,
                trendIcon: calculateTrend(totalOrders, prevTradeCount).trend === 'up' ? 'ArrowUp' : 'ArrowDown',
                trendText: calculateTrend(totalOrders, prevTradeCount).text
              },
              {
                title: '总交易金额',
                value: `¥${currentTradeAmount ? currentTradeAmount.toFixed(2) : '0.00'}`,
                icon: 'CreditCard',
                type: 'danger',
                trend: calculateTrend(currentTradeAmount, prevTradeAmount).trend,
                trendIcon: calculateTrend(currentTradeAmount, prevTradeAmount).trend === 'up' ? 'ArrowUp' : 'ArrowDown',
                trendText: calculateTrend(currentTradeAmount, prevTradeAmount).text
              }
            ]
          } catch (error) {
            console.error('获取用户和商品总数失败:', error)
          }
        } else {
          // 如果API不可用，设置默认值
          monthlyTradeAmount.value = 0
          monthlyTradeCount.value = 0
        }
      } catch (error) {
        console.error('获取综合统计数据失败:', error)
        
        // 在API不可用时，使用默认值
        statsData.value = [
          {
            title: '总用户数',
            value: 0,
            icon: 'User',
            type: 'primary',
            trend: 'up',
            trendIcon: 'ArrowUp',
            trendText: '12.5%'
          },
          {
            title: '在售二手物品数',
            value: 0,
            icon: 'Goods',
            type: 'success',
            trend: 'up',
            trendIcon: 'ArrowUp',
            trendText: '8.3%'
          },
          {
            title: '交易订单数',
            value: 0,
            icon: 'ShoppingCartFull',
            type: 'warning',
            trend: 'down',
            trendIcon: 'ArrowDown',
            trendText: '3.2%'
          },
          {
            title: '总交易金额',
            value: '¥0',
            icon: 'CreditCard',
            type: 'danger',
            trend: 'up',
            trendIcon: 'ArrowUp',
            trendText: '15.7%'
          }
        ]
      }
    }
    
    // 获取高闲置量二手物品
    const fetchHighInventoryProducts = async () => {
      highInventoryLoading.value = true
      try {
        const response = await statisticsApi.getHighInventoryCategories(5)
        if (response.data && response.data.code === 200) {
          // 将API返回的数据转换为表格需要的格式
          highInventoryProducts.value = (response.data.data || []).map(item => ({
            id: item.categoryId,
            productName: item.categoryName,
            categoryName: item.categoryName,
            inventoryCount: item.productCount || 0,
            price: 0,
            imageUrl: item.imageUrl
          }))
        }
      } catch (error) {
        console.error('获取高闲置量二手物品失败:', error)
        // 清除模拟数据，默认显示空数组
        highInventoryProducts.value = []
      } finally {
        highInventoryLoading.value = false
      }
    }
    
    // 获取需求量大的二手物品
    const fetchHighDemandProducts = async () => {
      try {
        const response = await statisticsApi.getHighDemandCategories(5)
        if (response.data && response.data.code === 200) {
          // 将API返回的数据转换为表格需要的格式
          hotProducts.value = (response.data.data || []).map(item => ({
            id: item.categoryId,
            productName: item.categoryName,
            categoryName: item.categoryName,
            viewCount: item.productCount || 0,
            salesAmount: 0,
            imageUrl: item.imageUrl
          }))
        }
      } catch (error) {
        console.error('获取需求量大的二手物品分类失败:', error)
        // 清除模拟数据，默认显示空数组
        hotProducts.value = []
      }
    }
    
    // 初始化图表
    const initCharts = async () => {
      try {
        // 获取月度统计数据
        const currentDate = new Date()
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()
        
        // 获取近一个月的交易趋势数据
        const monthResponse = await statisticsApi.getMonthlyTopSellingCategories(month, year, 10)
        
        // 初始化趋势图表
        if (trendChart.value) {
          const trendChartInstance = echarts.init(trendChart.value)
          
          // 准备近一个月的交易趋势数据
          const categoryNames = (monthResponse.data?.data || []).map(item => item.categoryName)
          const tradeCounts = (monthResponse.data?.data || []).map(item => item.tradeCount || 0)
          const tradeAmounts = (monthResponse.data?.data || []).map(item => item.tradeAmount || 0)
          
          const trendOption = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              formatter: function(params) {
                let result = params[0].name + '<br/>'
                params.forEach(param => {
                  if (param.seriesName === '交易量') {
                    result += `${param.marker} ${param.seriesName}: ${param.value || 0} 笔<br/>`
                  } else {
                    result += `${param.marker} ${param.seriesName}: ¥${(param.value || 0).toFixed(2)}<br/>`
                  }
                })
                return result
              }
            },
            legend: {
              data: ['交易量', '交易额']
            },
            xAxis: {
              type: 'category',
              data: categoryNames.length > 0 ? categoryNames : ['暂无数据']
            },
            yAxis: {
              type: 'value',
              name: '交易统计',
              axisLabel: {
                formatter: function(value) {
                  return value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value
                }
              }
            },
            series: [
              {
                name: '交易量',
                type: 'bar',
                data: tradeCounts.length > 0 ? tradeCounts : [0],
                itemStyle: {
                  color: '#409EFF'
                },
                barWidth: '40%'
              },
              {
                name: '交易额',
                type: 'bar',
                data: tradeAmounts.length > 0 ? tradeAmounts : [0],
                itemStyle: {
                  color: '#67C23A'
                },
                barWidth: '40%'
              }
            ]
          }
          trendChartInstance.setOption(trendOption)
        }
      } catch (error) {
        console.error('初始化图表失败:', error)
      }
    }
    
    // 查看产品详情
    const viewProduct = (id) => {
      router.push(`/products/${id}`)
    }
    
    // 审核用户
    const auditUser = (user) => {
      router.push(`/admin/users?action=audit&id=${user.id}`)
    }
    
    // 跳转到产品页面
    const goToProducts = () => {
      router.push('/admin/statistics?type=high-demand')
    }
    
    // 跳转到高闲置量二手物品页面
    const goToHighInventoryProducts = () => {
      router.push('/admin/statistics?type=high-inventory')
    }
    
    onMounted(() => {
      // 获取仪表盘数据
      fetchComprehensiveStatistics()
      fetchHighDemandCategories()
      fetchHighInventoryProducts()
      
      // 等待DOM渲染完成后初始化图表
      setTimeout(() => {
        initCharts()
      }, 100)
    })
    
    return {
      statsData,
      hotProducts,
      highInventoryProducts,
      highInventoryLoading,
      quickActions,
      trendChart,
      monthlyTradeAmount,
      monthlyTradeCount,
      viewProduct,
      goToProducts,
      goToHighInventoryProducts,
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
  text-align: center;
}

/* 统计卡片样式 */
.stats-container {
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  height: 100%;
}

.stat-item {
  height: 160px;
  position: relative;
  overflow: hidden;
  transition: all var(--transition-base);
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.stat-item-primary {
  border-left: 4px solid var(--primary-color);
}

.stat-item-success {
  border-left: 4px solid var(--success-color);
}

.stat-item-warning {
  border-left: 4px solid var(--warning-color);
}

.stat-item-danger {
  border-left: 4px solid var(--danger-color);
}

.stat-content {
  height: 100%;
  position: relative;
}

.stat-icon {
  position: absolute;
  top: var(--spacing-base);
  right: var(--spacing-base);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
}

.stat-item-primary .stat-icon {
  color: var(--primary-color);
  background-color: rgba(64, 158, 255, 0.1);
}

.stat-item-success .stat-icon {
  color: var(--success-color);
  background-color: rgba(103, 194, 58, 0.1);
}

.stat-item-warning .stat-icon {
  color: var(--warning-color);
  background-color: rgba(230, 162, 60, 0.1);
}

.stat-item-danger .stat-icon {
  color: var(--danger-color);
  background-color: rgba(245, 108, 108, 0.1);
}

.stat-info {
  padding: var(--spacing-base);
  padding-right: 80px;
}

.stat-value {
  font-size: var(--font-size-xxl);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-primary);
}

.stat-title {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin: 0;
}

.stat-trend {
  position: absolute;
  bottom: var(--spacing-base);
  right: var(--spacing-base);
  font-size: var(--font-size-sm);
}

.trend-up {
  color: var(--success-color);
}

.trend-down {
  color: var(--danger-color);
}

/* 图表区域样式 */
.charts-container {
  margin-bottom: var(--spacing-xl);
}

.chart-card {
  height: 450px;
  overflow: hidden;
}

.card-header {
  margin-bottom: var(--spacing-base);
}

.chart-container {
  height: 320px;
  overflow: hidden;
  position: relative;
}

/* 交易统计样式 */
.trade-stats-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  height: 320px;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.trade-stat-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-lg);
  background-color: var(--bg-lighter);
  border-radius: var(--border-radius-base);
  transition: all var(--transition-base);
}

.trade-stat-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-base);
}

.trade-stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
  margin-right: var(--spacing-base);
}

.trade-stat-info {
  flex: 1;
}

.trade-stat-value {
  font-size: var(--font-size-xxl);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-primary);
}

.trade-stat-title {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin: 0;
}

/* 数据表格样式 */
.tables-container {
  margin-bottom: var(--spacing-xl);
}

.table-card {
  margin-bottom: var(--spacing-base);
}

.user-info {
  gap: var(--spacing-sm);
}

.user-name {
  font-weight: 500;
}

/* 快速操作样式 */
.actions-container {
  margin-bottom: var(--spacing-xl);
}

.actions-card {
  padding: var(--spacing-lg);
}

.action-item {
  padding: var(--spacing-lg);
  text-align: center;
  cursor: pointer;
  border-radius: var(--border-radius-base);
  transition: all var(--transition-base);
}

.action-item:hover {
  background-color: var(--bg-lighter);
  transform: translateY(-4px);
  box-shadow: var(--shadow-base);
}

.action-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto var(--spacing-base);
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
}

.action-title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .unified-grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .unified-grid-4 {
    grid-template-columns: 1fr;
  }
  
  .stat-item {
    height: 140px;
  }
  
  .chart-card {
    height: 350px;
  }
  
  .chart-container {
    height: 280px;
  }
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

.view-more-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: 500;
}
</style>