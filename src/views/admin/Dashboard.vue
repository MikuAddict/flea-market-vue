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
          <!-- 综合统计 -->
          <el-card class="stats-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span>综合统计</span>
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  @change="fetchComprehensiveStats"
                />
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :xs="12" :sm="6">
                <div class="stat-item">
                  <div class="stat-icon">
                    <el-icon size="30"><User /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ comprehensiveStats.totalUsers || 0 }}</div>
                    <div class="stat-label">总用户数</div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="6">
                <div class="stat-item">
                  <div class="stat-icon">
                    <el-icon size="30"><Goods /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ comprehensiveStats.totalProducts || 0 }}</div>
                    <div class="stat-label">总二手物品数</div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="6">
                <div class="stat-item">
                  <div class="stat-icon">
                    <el-icon size="30"><ShoppingCart /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ comprehensiveStats.totalOrders || 0 }}</div>
                    <div class="stat-label">总订单数</div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="6">
                <div class="stat-item">
                  <div class="stat-icon">
                    <el-icon size="30"><Money /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">¥{{ formatPrice(comprehensiveStats.totalRevenue || 0) }}</div>
                    <div class="stat-label">总收入</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-card>
          
          <!-- 用户增长和订单趋势 -->
          <el-row :gutter="20">
            <el-col :xs="24" :md="12">
              <el-card class="trend-card" shadow="never">
                <template #header>
                  <span>用户增长</span>
                </template>
                <div class="trend-data">
                  <div class="trend-item">
                    <div class="trend-label">本月新增</div>
                    <div class="trend-value">{{ comprehensiveStats.userGrowth?.thisMonth || 0 }}</div>
                  </div>
                  <div class="trend-item">
                    <div class="trend-label">上月新增</div>
                    <div class="trend-value">{{ comprehensiveStats.userGrowth?.lastMonth || 0 }}</div>
                  </div>
                  <div class="trend-item">
                    <div class="trend-label">增长率</div>
                    <div class="trend-value">{{ comprehensiveStats.userGrowth?.growthRate || 0 }}%</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-card class="trend-card" shadow="never">
                <template #header>
                  <span>订单趋势</span>
                </template>
                <div class="trend-data">
                  <div class="trend-item">
                    <div class="trend-label">本月订单</div>
                    <div class="trend-value">{{ comprehensiveStats.orderTrend?.thisMonth || 0 }}</div>
                  </div>
                  <div class="trend-item">
                    <div class="trend-label">上月订单</div>
                    <div class="trend-value">{{ comprehensiveStats.orderTrend?.lastMonth || 0 }}</div>
                  </div>
                  <div class="trend-item">
                    <div class="trend-label">增长率</div>
                    <div class="trend-value">{{ comprehensiveStats.orderTrend?.growthRate || 0 }}%</div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          
          <!-- 月度统计 -->
          <el-card class="monthly-stats-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span>月度统计</span>
                <el-date-picker
                  v-model="selectedMonth"
                  type="month"
                  placeholder="选择月份"
                  format="YYYY年MM月"
                  value-format="YYYY-MM"
                  @change="fetchMonthlyStats"
                />
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :xs="12" :sm="6">
                <div class="stat-item">
                  <div class="stat-info">
                    <div class="stat-value">{{ monthlyStats.newUsers || 0 }}</div>
                    <div class="stat-label">新用户</div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="6">
                <div class="stat-item">
                  <div class="stat-info">
                    <div class="stat-value">{{ monthlyStats.newProducts || 0 }}</div>
                    <div class="stat-label">新二手物品</div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="6">
                <div class="stat-item">
                  <div class="stat-info">
                    <div class="stat-value">{{ monthlyStats.completedOrders || 0 }}</div>
                    <div class="stat-label">完成订单</div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="6">
                <div class="stat-item">
                  <div class="stat-info">
                    <div class="stat-value">¥{{ formatPrice(monthlyStats.totalRevenue || 0) }}</div>
                    <div class="stat-label">月收入</div>
                  </div>
                </div>
              </el-col>
            </el-row>
            
            <div v-if="monthlyStats.popularCategories && monthlyStats.popularCategories.length > 0" class="popular-categories">
              <h4>热门分类</h4>
              <el-table :data="monthlyStats.popularCategories" style="width: 100%">
                <el-table-column prop="categoryName" label="分类名称" />
                <el-table-column prop="orderCount" label="订单数" />
              </el-table>
            </div>
          </el-card>
          
          <!-- 二手物品排行 -->
          <el-row :gutter="20">
            <el-col :xs="24" :md="12">
              <el-card class="ranking-card" shadow="never">
                <template #header>
                  <div class="card-header">
                    <span>交易二手物品排行</span>
                    <el-date-picker
                      v-model="productRankMonth"
                      type="month"
                      placeholder="选择月份"
                      format="YYYY年MM月"
                      value-format="YYYY-MM"
                      @change="fetchProductRanking"
                    />
                  </div>
                </template>
                <el-table :data="productRanking" style="width: 100%">
                  <el-table-column type="index" label="排名" width="60" />
                  <el-table-column prop="productName" label="二手物品名称" />
                  <el-table-column prop="transactionCount" label="交易次数" width="100" />
                  <el-table-column prop="totalAmount" label="总金额" width="100">
                    <template #default="scope">
                      ¥{{ formatPrice(scope.row.totalAmount) }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-col>
            
            <el-col :xs="24" :md="12">
              <el-card class="ranking-card" shadow="never">
                <template #header>
                  <span>活跃用户排行</span>
                </template>
                <el-table :data="userRanking" style="width: 100%">
                  <el-table-column type="index" label="排名" width="60" />
                  <el-table-column prop="userName" label="用户名" />
                  <el-table-column prop="activityScore" label="活跃度" width="100" />
                </el-table>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Goods, ShoppingCart, Document, Odometer, Money } from '@element-plus/icons-vue'
import api from '@/api'
import { formatPrice } from '@/utils/format'

export default {
  name: 'AdminDashboard',
  components: {
    User,
    Goods,
    ShoppingCart,
    Document,
    Odometer,
    Money
  },
  setup() {
    const router = useRouter()
    
    // 响应式数据
    const activeMenu = ref('dashboard')
    const dateRange = ref([])
    const selectedMonth = ref('')
    const productRankMonth = ref('')
    
    const comprehensiveStats = ref({})
    const monthlyStats = ref({})
    const productRanking = ref([])
    const userRanking = ref([])
    
    // 获取综合统计
    const fetchComprehensiveStats = async () => {
      try {
        const params = {}
        if (dateRange.value && dateRange.value.length === 2) {
          params.startDate = dateRange.value[0]
          params.endDate = dateRange.value[1]
        }
        
        const response = await api.statistics.getComprehensiveStatistics(params)
        comprehensiveStats.value = response.data.data || {}
      } catch (error) {
        console.error('获取综合统计失败:', error)
        ElMessage.error('获取统计数据失败')
      }
    }
    
    // 获取月度统计
    const fetchMonthlyStats = async () => {
      if (!selectedMonth.value) return
      
      try {
        const [year, month] = selectedMonth.value.split('-')
        const response = await api.statistics.getMonthlyStatistics({
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
      if (!productRankMonth.value) return
      
      try {
        const [year, month] = productRankMonth.value.split('-')
        const response = await api.statistics.getMonthlyProductRanking({
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
      try {
        const endDate = new Date()
        const startDate = new Date()
        startDate.setMonth(endDate.getMonth() - 3) // 默认获取最近三个月的数据
        
        const formatDate = (date) => {
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        }
        
        const response = await api.statistics.getActiveUserRanking({
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          limit: 10
        })
        userRanking.value = response.data.data || []
      } catch (error) {
        console.error('获取用户排行失败:', error)
        ElMessage.error('获取用户排行失败')
      }
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
      // 设置默认日期
      const now = new Date()
      selectedMonth.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      productRankMonth.value = selectedMonth.value
      
      // 获取初始数据
      fetchComprehensiveStats()
      fetchMonthlyStats()
      fetchProductRanking()
      fetchUserRanking()
    })
    
    return {
      activeMenu,
      dateRange,
      selectedMonth,
      productRankMonth,
      comprehensiveStats,
      monthlyStats,
      productRanking,
      userRanking,
      formatPrice,
      handleMenuSelect,
      fetchComprehensiveStats,
      fetchMonthlyStats,
      fetchProductRanking
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-card, .trend-card, .monthly-stats-card, .ranking-card {
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 15px;
}

.stat-icon {
  margin-right: 15px;
  color: #409EFF;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.trend-data {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.trend-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.trend-item:last-child {
  border-bottom: none;
}

.trend-label {
  color: #606266;
}

.trend-value {
  font-weight: 500;
  color: #303133;
}

.popular-categories {
  margin-top: 20px;
}

.popular-categories h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
}
</style>