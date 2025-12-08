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
                <div class="card-header unified-flex unified-flex-between">
                  <h3 class="unified-title-base">交易趋势</h3>
                  <div class="date-range-selector">
                    <el-select v-model="trendPeriod" @change="updateTrendChart" size="small">
                      <el-option label="最近7天" value="7" />
                      <el-option label="最近30天" value="30" />
                      <el-option label="最近90天" value="90" />
                    </el-select>
                  </div>
                </div>
              </template>
              <div class="chart-container" ref="trendChart"></div>
            </el-card>
          </el-col>
          
          <!-- 分类占比图表 -->
          <el-col :xs="24" :lg="8">
            <el-card class="unified-card chart-card fade-in">
              <template #header>
                <h3 class="unified-title-base">分类占比</h3>
              </template>
              <div class="chart-container" ref="categoryChart"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <!-- 数据表格区域 -->
      <div class="tables-container">
        <el-row :gutter="24">
          <!-- 需求量大的二手物品分类 -->
          <el-col :xs="24" :lg="12">
            <el-card class="unified-card table-card fade-in">
              <template #header>
                <div class="card-header unified-flex unified-flex-between">
                  <h3 class="unified-title-base">需求量大的二手物品</h3>
                  <el-button type="text" @click="goToProducts" class="view-more-btn">
                    查看更多
                    <el-icon><ArrowRight /></el-icon>
                  </el-button>
                </div>
              </template>
              <el-table :data="hotProducts" style="width: 100%">
                <el-table-column prop="productName" label="名称" min-width="120" />
                <el-table-column prop="viewCount" label="售出量" width="100" />
              </el-table>
            </el-card>
          </el-col>
          
          <!-- 待审核用户 -->
          <el-col :xs="24" :lg="12">
            <el-card class="unified-card table-card fade-in">
              <template #header>
                <div class="card-header unified-flex unified-flex-between">
                  <h3 class="unified-title-base">待审核用户</h3>
                  <el-button type="text" @click="goToUsers" class="view-more-btn">
                    查看更多
                    <el-icon><ArrowRight /></el-icon>
                  </el-button>
                </div>
              </template>
              <el-table :data="latestUsers" style="width: 100%">
                <el-table-column prop="userName" label="用户名" min-width="100">
                  <template #default="scope">
                    <div class="user-info unified-flex unified-flex-center">
                      <span class="user-name">{{ scope.row.userName }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="registerTime" label="注册时间" width="150">
                  <template #default="scope">
                    {{ formatDate(scope.row.registerTime) }}
                  </template>
                </el-table-column>
                <el-table-column prop="userStatus" label="状态" width="80">
                  <template #default="scope">
                    <el-tag :type="getUserStatusType(scope.row.userStatus)" size="small">
                      {{ getUserStatusText(scope.row.userStatus) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template #default="scope">
                    <el-button type="text" @click="auditUser(scope.row)">审核</el-button>
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
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { 
  TrendCharts, 
  PieChart, 
  User, 
  Goods, 
  ShoppingCartFull, 
  CreditCard,
  ArrowUp,
  ArrowDown,
  Plus,
  Edit,
  Message,
  ArrowRight
} from '@element-plus/icons-vue'
import { formatPrice, formatDate } from '@/utils/format'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { adminApi } from '@/api'
import Layout from '@/components/Layout.vue'

export default {
  name: 'AdminDashboard',
  components: {
    Layout
  },
  setup() {
    const router = useRouter()
    
    // 图表引用
    const trendChart = ref(null)
    const categoryChart = ref(null)
    const trendPeriod = ref('30')
    
    // 统计数据
    const statsData = ref([
      {
        title: '总用户数',
        value: 1234,
        icon: 'User',
        type: 'primary',
        trend: 'up',
        trendIcon: 'ArrowUp',
        trendText: '12.5%'
      },
      {
        title: '二手物品数',
        value: 567,
        icon: 'Goods',
        type: 'success',
        trend: 'up',
        trendIcon: 'ArrowUp',
        trendText: '8.3%'
      },
      {
        title: '交易订单数',
        value: 890,
        icon: 'ShoppingCartFull',
        type: 'warning',
        trend: 'down',
        trendIcon: 'ArrowDown',
        trendText: '3.2%'
      },
      {
        title: '总收入',
        value: '¥12,345',
        icon: 'CreditCard',
        type: 'danger',
        trend: 'up',
        trendIcon: 'ArrowUp',
        trendText: '15.7%'
      }
    ])
    
    // 热门二手物品
    const hotProducts = ref([
      {
        id: 1,
        productName: '二手笔记本电脑',
        price: 2999,
        viewCount: 1250
      },
      {
        id: 2,
        productName: '二手智能手机',
        price: 1599,
        viewCount: 980
      },
      {
        id: 3,
        productName: '二手教材',
        price: 35,
        viewCount: 756
      },
      {
        id: 4,
        productName: '二手运动鞋',
        price: 299,
        viewCount: 634
      }
    ])
    
    // 最新用户
    const latestUsers = ref([
      {
        id: 1,
        userName: '张三',
        userAvatar: '',
        registerTime: '2023-12-08T10:30:00',
        userStatus: 0
      },
      {
        id: 2,
        userName: '李四',
        userAvatar: '',
        registerTime: '2023-12-07T15:45:00',
        userStatus: 1
      },
      {
        id: 3,
        userName: '王五',
        userAvatar: '',
        registerTime: '2023-12-06T09:20:00',
        userStatus: 1
      }
    ])
    
    // 快速操作
    const quickActions = ref([
      {
        title: '用户管理',
        icon: 'Plus',
        handler: () => router.push('/admin/users?action=add')
      },
      {
        title: '添加分类',
        icon: 'Plus',
        handler: () => router.push('/admin/categories?action=add')
      },
      {
        title: '发布公告',
        icon: 'Message',
        handler: () => router.push('/admin/news?action=add')
      },
      {
        title: '审核二手物品',
        icon: 'Edit',
        handler: () => router.push('/admin/products?filter=pending')
      }
    ])
    
    // 初始化图表
    const initCharts = () => {
      // 初始化趋势图表
      if (trendChart.value) {
        const trendChartInstance = echarts.init(trendChart.value)
        const trendOption = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['交易量', '交易额']
          },
          xAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: [
            {
              type: 'value',
              name: '交易量',
              position: 'left'
            },
            {
              type: 'value',
              name: '交易额(元)',
              position: 'right'
            }
          ],
          series: [
            {
              name: '交易量',
              type: 'bar',
              data: [20, 30, 40, 35, 50, 45, 60],
              itemStyle: {
                color: '#409EFF'
              }
            },
            {
              name: '交易额',
              type: 'line',
              data: [2000, 3000, 4000, 3500, 5000, 4500, 6000],
              itemStyle: {
                color: '#67C23A'
              }
            }
          ]
        }
        trendChartInstance.setOption(trendOption)
      }
      
      // 初始化分类图表
      if (categoryChart.value) {
        const categoryChartInstance = echarts.init(categoryChart.value)
        const categoryOption = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: '分类占比',
              type: 'pie',
              radius: '50%',
              data: [
                { value: 35, name: '电子产品' },
                { value: 25, name: '图书教材' },
                { value: 20, name: '服饰鞋包' },
                { value: 15, name: '生活用品' },
                { value: 5, name: '其他' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        categoryChartInstance.setOption(categoryOption)
      }
    }
    
    // 更新趋势图表
    const updateTrendChart = () => {
      // 这里可以根据选择的周期更新图表数据
      ElMessage.success(`已切换到最近${trendPeriod.value}天的数据`)
    }
    
    // 查看产品详情
    const viewProduct = (id) => {
      router.push(`/products/${id}`)
    }
    
    // 审核用户
    const auditUser = (user) => {
      router.push(`/admin/users?action=audit&id=${user.id}`)
    }
    
    // 获取用户状态文本
    const getUserStatusText = (status) => {
      const statusMap = {
        0: '待审核',
        1: '已通过',
        2: '已拒绝'
      }
      return statusMap[status] || '未知'
    }
    
    // 获取用户状态类型
    const getUserStatusType = (status) => {
      const typeMap = {
        0: 'warning',
        1: 'success',
        2: 'danger'
      }
      return typeMap[status] || 'info'
    }
    
    // 跳转到产品管理
    const goToProducts = () => {
      router.push('/admin/products')
    }
    
    // 跳转到用户管理
    const goToUsers = () => {
      router.push('/admin/users')
    }
    
    onMounted(() => {
      // 等待DOM渲染完成后初始化图表
      setTimeout(() => {
        initCharts()
      }, 100)
    })
    
    return {
      statsData,
      hotProducts,
      latestUsers,
      quickActions,
      trendPeriod,
      trendChart,
      categoryChart,
      updateTrendChart,
      viewProduct,
      auditUser,
      getUserStatusText,
      getUserStatusType,
      goToProducts,
      goToUsers,
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
  height: 400px;
}

.card-header {
  margin-bottom: var(--spacing-base);
}

.chart-container {
  height: 320px;
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