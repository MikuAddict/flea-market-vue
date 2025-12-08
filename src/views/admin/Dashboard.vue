<template>
  <div class="admin-dashboard">
    <el-row :gutter="20">
      <!-- 左侧导航菜单 -->
      <el-col :xs="24" :md="6">
        <el-card class="nav-card">
          <el-menu
            :default-active="activeMenu"
            mode="vertical"
            @select="handleMenuSelect"
          >
            <el-menu-item index="dashboard">
              <el-icon><Odometer /></el-icon>
              <span>数据统计</span>
            </el-menu-item>
            <el-menu-item index="users">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="products">
              <el-icon><Goods /></el-icon>
              <span>二手物品管理</span>
            </el-menu-item>
            <el-menu-item index="orders">
              <el-icon><ShoppingCart /></el-icon>
              <span>订单管理</span>
            </el-menu-item>
            <el-menu-item index="news">
              <el-icon><Document /></el-icon>
              <span>新闻管理</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      
      <!-- 右侧内容区域 -->
      <el-col :xs="24" :md="18">
        <div v-if="activeMenu === 'dashboard'" class="stats-container">
          <!-- 时间选择器 -->
          <el-card class="time-selector-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span>统计时间范围</span>
                <div class="time-controls">
                  <el-date-picker
                    v-model="selectedMonth"
                    type="month"
                    placeholder="选择月份"
                    format="YYYY年MM月"
                    value-format="YYYY-MM"
                    @change="fetchAllData"
                  />
                  <el-button type="primary" @click="setCurrentMonth">
                    当月数据
                  </el-button>
                </div>
              </div>
            </template>
          </el-card>
          
          <!-- 四个主要数据模块 -->
          <el-row :gutter="20">
            <!-- 1. 当月交易成功物品排行榜 -->
            <el-col :xs="24" :lg="12">
              <el-card class="stat-card" shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>当月交易成功物品排行榜</span>
                    <el-tag type="success">TOP 10</el-tag>
                  </div>
                </template>
                <div class="chart-container">
                  <v-chart :option="productRankingChartOption" autoresize />
                </div>
                <el-table :data="productRanking" size="small" class="ranking-table">
                  <el-table-column type="index" label="排名" width="60" align="center" />
                  <el-table-column prop="productName" label="物品名称" show-overflow-tooltip />
                  <el-table-column prop="transactionCount" label="交易次数" width="90" align="center" />
                  <el-table-column prop="totalAmount" label="总金额" width="100" align="center">
                    <template #default="scope">
                      ¥{{ formatPrice(scope.row.totalAmount) }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-col>
            
            <!-- 2. 活跃用户排行榜 -->
            <el-col :xs="24" :lg="12">
              <el-card class="stat-card" shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>活跃用户排行榜</span>
                    <el-tag type="warning">活跃度</el-tag>
                  </div>
                </template>
                <div class="chart-container">
                  <v-chart :option="userRankingChartOption" autoresize />
                </div>
                <el-table :data="userRanking" size="small" class="ranking-table">
                  <el-table-column type="index" label="排名" width="60" align="center" />
                  <el-table-column prop="userName" label="用户名" show-overflow-tooltip />
                  <el-table-column prop="activityScore" label="活跃度" width="90" align="center" />
                  <el-table-column prop="transactionCount" label="交易次数" width="90" align="center" />
                </el-table>
              </el-card>
            </el-col>
            
            <!-- 3. 需求量大的二手物品排行 -->
            <el-col :xs="24" :lg="12">
              <el-card class="stat-card" shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>需求量大的二手物品排行</span>
                    <el-tag type="danger">高需求</el-tag>
                  </div>
                </template>
                <div class="chart-container">
                  <v-chart :option="demandChartOption" autoresize />
                </div>
                <el-table :data="highDemandProducts" size="small" class="ranking-table">
                  <el-table-column type="index" label="排名" width="60" align="center" />
                  <el-table-column prop="productName" label="物品名称" show-overflow-tooltip />
                  <el-table-column prop="viewCount" label="浏览量" width="90" align="center" />
                  <el-table-column prop="inquiryCount" label="咨询次数" width="90" align="center" />
                  <el-table-column prop="demandScore" label="需求指数" width="90" align="center" />
                </el-table>
              </el-card>
            </el-col>
            
            <!-- 4. 闲置量大的二手物品排行 -->
            <el-col :xs="24" :lg="12">
              <el-card class="stat-card" shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>闲置量大的二手物品排行</span>
                    <el-tag type="info">高库存</el-tag>
                  </div>
                </template>
                <div class="chart-container">
                  <v-chart :option="inventoryChartOption" autoresize />
                </div>
                <el-table :data="highInventoryProducts" size="small" class="ranking-table">
                  <el-table-column type="index" label="排名" width="60" align="center" />
                  <el-table-column prop="productName" label="物品名称" show-overflow-tooltip />
                  <el-table-column prop="inventoryCount" label="库存量" width="90" align="center" />
                  <el-table-column prop="daysOnMarket" label="上架天数" width="90" align="center" />
                  <el-table-column prop="inventoryScore" label="闲置指数" width="90" align="center" />
                </el-table>
              </el-card>
            </el-col>
          </el-row>
          
          <!-- 月度统计概览 -->
          <el-card class="overview-card" shadow="never">
            <template #header>
              <span>月度统计概览 - {{ selectedMonthDisplay }}</span>
            </template>
            <el-row :gutter="20">
              <el-col :xs="12" :sm="6" :md="3">
                <div class="overview-item">
                  <div class="overview-icon user-icon">
                    <el-icon><User /></el-icon>
                  </div>
                  <div class="overview-content">
                    <div class="overview-value">{{ monthlyStats.newUsers || 0 }}</div>
                    <div class="overview-label">新用户</div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="6" :md="3">
                <div class="overview-item">
                  <div class="overview-icon product-icon">
                    <el-icon><Goods /></el-icon>
                  </div>
                  <div class="overview-content">
                    <div class="overview-value">{{ monthlyStats.newProducts || 0 }}</div>
                    <div class="overview-label">新物品</div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="6" :md="3">
                <div class="overview-item">
                  <div class="overview-icon order-icon">
                    <el-icon><ShoppingCart /></el-icon>
                  </div>
                  <div class="overview-content">
                    <div class="overview-value">{{ monthlyStats.completedOrders || 0 }}</div>
                    <div class="overview-label">完成订单</div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="6" :md="3">
                <div class="overview-item">
                  <div class="overview-icon revenue-icon">
                    <el-icon><Money /></el-icon>
                  </div>
                  <div class="overview-content">
                    <div class="overview-value">¥{{ formatPrice(monthlyStats.totalRevenue || 0) }}</div>
                    <div class="overview-label">总金额</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Goods, ShoppingCart, Document, Odometer, Money } from '@element-plus/icons-vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import statisticsApi from '@/api/statistics'
import { formatPrice } from '@/utils/format'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
])

export default {
  name: 'AdminDashboard',
  components: {
    User,
    Goods,
    ShoppingCart,
    Document,
    Odometer,
    Money,
    VChart
  },
  setup() {
    const router = useRouter()
    
    // 响应式数据
    const activeMenu = ref('dashboard')
    const selectedMonth = ref('')
    
    const monthlyStats = ref({})
    const productRanking = ref([])
    const userRanking = ref([])
    const highDemandProducts = ref([])
    const highInventoryProducts = ref([])

    // 计算属性
    const selectedMonthDisplay = computed(() => {
      if (!selectedMonth.value) return ''
      const [year, month] = selectedMonth.value.split('-')
      return `${year}年${month}月`
    })

    // 图表配置
    const productRankingChartOption = computed(() => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: productRanking.value.map(item => 
          item.productName.length > 8 ? item.productName.substring(0, 8) + '...' : item.productName
        ),
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '交易次数'
      },
      series: [{
        data: productRanking.value.map(item => item.transactionCount),
        type: 'bar',
        itemStyle: {
          color: '#67C23A'
        }
      }]
    }))

    const userRankingChartOption = computed(() => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: userRanking.value.map(item => 
          item.userName.length > 6 ? item.userName.substring(0, 6) + '...' : item.userName
        ),
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '活跃度'
      },
      series: [{
        data: userRanking.value.map(item => item.activityScore),
        type: 'bar',
        itemStyle: {
          color: '#E6A23C'
        }
      }]
    }))

    const demandChartOption = computed(() => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: highDemandProducts.value.map(item => 
          item.productName.length > 8 ? item.productName.substring(0, 8) + '...' : item.productName
        ),
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '需求指数'
      },
      series: [{
        data: highDemandProducts.value.map(item => item.demandScore),
        type: 'line',
        itemStyle: {
          color: '#F56C6C'
        },
        lineStyle: {
          color: '#F56C6C'
        }
      }]
    }))

    const inventoryChartOption = computed(() => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: highInventoryProducts.value.map(item => 
          item.productName.length > 8 ? item.productName.substring(0, 8) + '...' : item.productName
        ),
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '闲置指数'
      },
      series: [{
        data: highInventoryProducts.value.map(item => item.inventoryScore),
        type: 'bar',
        itemStyle: {
          color: '#909399'
        }
      }]
    }))

    // 获取月度统计
    const fetchMonthlyStats = async () => {
      if (!selectedMonth.value) return
      
      try {
        const [year, month] = selectedMonth.value.split('-')
        const response = await statisticsApi.getMonthlyStatistics({
          year: parseInt(year),
          month: parseInt(month)
        })
        monthlyStats.value = response.data.data || {}
      } catch (error) {
        console.error('获取月度统计失败:', error)
        ElMessage.error('获取月度统计失败')
      }
    }
    
    // 获取二手物品排行
    const fetchProductRanking = async () => {
      if (!selectedMonth.value) return
      
      try {
        const [year, month] = selectedMonth.value.split('-')
        const response = await statisticsApi.getMonthlyProductRanking({
          year: parseInt(year),
          month: parseInt(month),
          limit: 10
        })
        productRanking.value = response.data.data || []
      } catch (error) {
        console.error('获取二手物品排行失败:', error)
        ElMessage.error('获取二手物品排行失败')
      }
    }
    
    // 获取用户排行
    const fetchUserRanking = async () => {
      if (!selectedMonth.value) return
      
      try {
        const [year, month] = selectedMonth.value.split('-')
        const startDate = `${year}-${month}-01`
        const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0]
        
        const response = await statisticsApi.getActiveUserRanking({
          startDate,
          endDate,
          limit: 10
        })
        userRanking.value = response.data.data || []
      } catch (error) {
        console.error('获取用户排行失败:', error)
        ElMessage.error('获取用户排行失败')
      }
    }

    // 获取高需求物品排行
    const fetchHighDemandProducts = async () => {
      if (!selectedMonth.value) return
      
      try {
        const [year, month] = selectedMonth.value.split('-')
        const response = await statisticsApi.getHighDemandProducts({
          year: parseInt(year),
          month: parseInt(month),
          limit: 10
        })
        highDemandProducts.value = response.data.data || []
      } catch (error) {
        console.error('获取高需求物品排行失败:', error)
        ElMessage.error('获取高需求物品排行失败')
      }
    }

    // 获取高库存物品排行
    const fetchHighInventoryProducts = async () => {
      if (!selectedMonth.value) return
      
      try {
        const [year, month] = selectedMonth.value.split('-')
        const response = await statisticsApi.getHighInventoryProducts({
          year: parseInt(year),
          month: parseInt(month),
          limit: 10
        })
        highInventoryProducts.value = response.data.data || []
      } catch (error) {
        console.error('获取高库存物品排行失败:', error)
        ElMessage.error('获取高库存物品排行失败')
      }
    }

    // 获取所有数据
    const fetchAllData = async () => {
      await Promise.all([
        fetchMonthlyStats(),
        fetchProductRanking(),
        fetchUserRanking(),
        fetchHighDemandProducts(),
        fetchHighInventoryProducts()
      ])
    }

    // 设置当前月份
    const setCurrentMonth = () => {
      const now = new Date()
      selectedMonth.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      fetchAllData()
    }
    
    // 菜单选择处理
    const handleMenuSelect = (index) => {
      if (index === 'dashboard') {
        activeMenu.value = index
      } else {
        router.push(`/admin/${index}`)
      }
    }
    
    onMounted(() => {
      setCurrentMonth()
    })
    
    return {
      activeMenu,
      selectedMonth,
      selectedMonthDisplay,
      monthlyStats,
      productRanking,
      userRanking,
      highDemandProducts,
      highInventoryProducts,
      productRankingChartOption,
      userRankingChartOption,
      demandChartOption,
      inventoryChartOption,
      formatPrice,
      handleMenuSelect,
      fetchAllData,
      setCurrentMonth
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.nav-card {
  margin-bottom: 20px;
  height: fit-content;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 时间选择器样式 */
.time-selector-card {
  margin-bottom: 0;
}

.time-selector-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}

.time-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* 统计卡片样式 */
.stat-card {
  margin-bottom: 20px;
  transition: all 0.3s ease;
  border: 1px solid #ebeef5;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stat-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  margin-bottom: 0;
}

.stat-card .card-header span {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* 图表容器样式 */
.chart-container {
  height: 200px;
  margin-bottom: 16px;
}

/* 排行表格样式 */
.ranking-table {
  margin-top: 16px;
}

.ranking-table :deep(.el-table__header) th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

.ranking-table :deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

/* 概览卡片样式 */
.overview-card {
  margin-top: 20px;
}

.overview-card .el-card__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.overview-item {
  display: flex;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.overview-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.overview-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
}

.user-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.product-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.order-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.revenue-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.overview-content {
  flex: 1;
}

.overview-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  line-height: 1;
  margin-bottom: 4px;
}

.overview-label {
  font-size: 14px;
  color: #909399;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 10px;
  }
  
  .stat-card {
    margin-bottom: 15px;
  }
  
  .chart-container {
    height: 150px;
  }
  
  .overview-item {
    padding: 15px;
    margin-bottom: 10px;
  }
  
  .overview-value {
    font-size: 20px;
  }
  
  .overview-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}

@media (max-width: 576px) {
  .time-controls {
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
  
  .time-controls .el-date-picker {
    width: 100%;
  }
  
  .time-controls .el-button {
    width: 100%;
  }
}
</style>