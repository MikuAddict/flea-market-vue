<template>
  <Layout>
    <div class="admin-statistics unified-page-container fade-in">
      <!-- 页面标题和操作区域 -->
      <div class="page-header unified-flex unified-flex-between">
        <div>
          <h1 class="unified-title-xl">统计分析</h1>
          <p class="unified-text-secondary">系统数据分析与统计报表</p>
        </div>
        <div class="header-actions unified-flex">
        </div>
      </div>
      
      <!-- 统计类型选择 -->
      <el-card class="unified-card filter-card fade-in">
        <template #header>
          <div class="card-header unified-flex unified-flex-between">
            <h3 class="unified-title-base">数据筛选</h3>
          </div>
        </template>
        
        <el-form :model="filters" :inline="true" label-width="80px">
          <el-form-item label="统计类型">
            <el-select
              v-model="filters.type"
              placeholder="选择统计类型"
              class="unified-input filter-select"
              @change="handleTypeChange"
            >
              <el-option label="高闲置量二手物品" value="high-inventory" />
              <el-option label="高需求量二手物品" value="high-demand" />
              <el-option label="月度热门二手物品" value="monthly-top" />
              <el-option label="活跃用户排行" value="active-users" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="数量限制" v-if="filters.type !== 'active-users'">
            <el-input-number
              v-model="filters.limit"
              :min="1"
              :max="100"
              placeholder="显示数量"
              style="width: 150px"
              @change="handleTypeChange"
            />
          </el-form-item>
          
          <el-form-item label="月份" v-if="filters.type === 'monthly-top'">
            <el-date-picker
              v-model="filters.month"
              type="month"
              placeholder="选择月份"
              class="unified-input"
              format="YYYY年MM月"
              value-format="YYYY-MM"
              @change="handleTypeChange"
            />
          </el-form-item>
          
          <el-form-item label="日期范围" v-if="filters.type === 'active-users'">
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="unified-input"
              @change="handleTypeChange"
            />
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 数据展示 -->
      <el-card class="unified-card statistics-card fade-in">
        <template #header>
          <div class="card-header unified-flex unified-flex-between">
            <h3 class="unified-title-base">{{ getStatisticsTitle() }}</h3>
            <div class="view-options">
              <el-radio-group v-model="viewMode" size="small">
                <el-radio-button label="table">表格视图</el-radio-button>
                <el-radio-button label="chart">图表视图</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </template>
        
        <!-- 表格视图 -->
        <div v-if="viewMode === 'table'">
          <!-- 高闲置量二手物品表格 -->
          <el-table 
            v-if="filters.type === 'high-inventory'"
            v-loading="loading" 
            :data="statisticsData" 
            style="width: 100%"
          >
            <el-table-column prop="productName" label="分类名称" min-width="150" />
            <el-table-column prop="categoryName" label="分类" width="100" />
            <el-table-column prop="inventoryCount" label="闲置数量" width="120">
              <template #default="scope">
                <el-tag type="warning" size="small">{{ scope.row.inventoryCount || 0 }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="参考价格" width="120">
              <template #default="scope">
                ¥{{ formatPrice(scope.row.price || 0) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button size="small" type="text" @click="viewProduct(scope.row.id)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 高需求量二手物品表格 -->
          <el-table 
            v-else-if="filters.type === 'high-demand'"
            v-loading="loading" 
            :data="statisticsData" 
            style="width: 100%"
          >
            <el-table-column prop="productName" label="分类名称" min-width="150" />
            <el-table-column prop="categoryName" label="分类" width="100" />
            <el-table-column prop="demandCount" label="需求次数" width="120">
              <template #default="scope">
                <el-tag type="success" size="small">{{ scope.row.demandCount || 0 }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="averagePrice" label="平均价格" width="120">
              <template #default="scope">
                ¥{{ formatPrice(scope.row.averagePrice || 0) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button size="small" type="text" @click="viewProduct(scope.row.id)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 月度热门二手物品表格 -->
          <el-table 
            v-else-if="filters.type === 'monthly-top'"
            v-loading="loading" 
            :data="statisticsData" 
            style="width: 100%"
          >
            <el-table-column prop="productName" label="物品名称" min-width="150" />
            <el-table-column prop="categoryName" label="分类" width="100" />
            <el-table-column prop="salesCount" label="销售数量" width="120">
              <template #default="scope">
                <el-tag type="primary" size="small">{{ scope.row.tradeCount || 0 }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="销售总额" width="120">
              <template #default="scope">
                ¥{{ formatPrice(scope.row.tradeAmount || 0) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button size="small" type="text" @click="viewProduct(scope.row.productId)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 活跃用户排行表格 -->
          <el-table 
            v-else-if="filters.type === 'active-users'"
            v-loading="loading" 
            :data="statisticsData" 
            style="width: 100%"
          >
            <el-table-column label="排名" width="80">
              <template #default="scope">
                <el-tag :type="getRankType(scope.$index + 1)" size="small">
                  {{ scope.$index + 1 }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="用户信息" min-width="150">
              <template #default="scope">
                <div class="user-info unified-flex unified-flex-center">
                  <el-avatar :size="30" :src="scope.row.avatar">
                    {{ scope.row.userName?.charAt(0) }}
                  </el-avatar>
                  <span class="user-name">{{ scope.row.userName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="tradeCount" label="交易次数" width="100">
              <template #default="scope">
                <el-tag type="primary" size="small">{{ scope.row.tradeCount || 0 }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="tradeAmount" label="交易总额" width="120">
              <template #default="scope">
                ¥{{ formatPrice(scope.row.tradeAmount || 0) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button size="small" type="text" @click="viewUser(scope.row.userId)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 图表视图 -->
        <div v-else class="chart-container" ref="statisticsChart" v-loading="loading"></div>
      </el-card>
    </div>
  </Layout>
</template>

<script>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { formatPrice } from '@/utils/format'
import * as echarts from 'echarts'
import { statisticsApi } from '@/api'
import Layout from '@/components/Layout.vue'

export default {
  name: 'AdminStatistics',
  components: {
    Layout
  },
  setup() {
    const router = useRouter()
    
    // 响应式数据
    const loading = ref(false)
    const statisticsData = ref([])
    const viewMode = ref('table')
    const statisticsChart = ref(null)
    
    // 筛选条件
    const filters = reactive({
      type: 'high-inventory',
      limit: 20,
      month: null,
      dateRange: null
    })
    
    // 处理统计类型变化
    const handleTypeChange = () => {
      fetchStatisticsData()
    }
    
    // 获取统计数据
    const fetchStatisticsData = async () => {
      loading.value = true
      try {
        let response
        
        switch (filters.type) {
          case 'high-inventory':
            response = await statisticsApi.getHighInventoryCategories(filters.limit)
            if (response.data && response.data.code === 200) {
              statisticsData.value = (response.data.data || []).map(item => ({
                id: item.categoryId,
                productName: item.categoryName,
                categoryName: item.categoryName,
                inventoryCount: item.productCount || 0,
                price: item.tradeAmount || 0
              }))
            }
            break
          case 'high-demand':
            response = await statisticsApi.getHighDemandCategories(filters.limit)
            if (response.data && response.data.code === 200) {
              statisticsData.value = (response.data.data || []).map(item => ({
                id: item.categoryId,
                productName: item.categoryName,
                categoryName: item.categoryName,
                demandCount: item.productCount || 0,
                averagePrice: item.tradeAmount || 0
              }))
            }
            break
          case 'monthly-top':
            if (!filters.month) {
              ElMessage.warning('请选择月份')
              loading.value = false
              return
            }
            const [year, month] = filters.month.split('-')
            response = await statisticsApi.getMonthlyTopSellingProducts(
              parseInt(month), 
              parseInt(year), 
              filters.limit
            )
            break
          case 'active-users':
            if (!filters.dateRange || filters.dateRange.length !== 2) {
              ElMessage.warning('请选择日期范围')
              loading.value = false
              return
            }
            response = await statisticsApi.getActiveUsersRanking(
              filters.limit,
              filters.dateRange[0],
              filters.dateRange[1]
            )
            break
          default:
            ElMessage.error('未知的统计类型')
            loading.value = false
            return
        }
        
        if (response.data && response.data.code === 200) {
          statisticsData.value = response.data.data || []
          
          // 如果是图表视图，更新图表
          if (viewMode.value === 'chart') {
            nextTick(() => {
              updateChart()
            })
          }
        } else {
          ElMessage.error('获取统计数据失败')
        }
      } catch (error) {
        console.error('获取统计数据失败:', error)
        ElMessage.error('获取统计数据失败')
      } finally {
        loading.value = false
      }
    }
    
    // 更新图表
    const updateChart = () => {
      if (!statisticsChart.value) return
      
      const chartInstance = echarts.init(statisticsChart.value)
      let option = {}
      
      switch (filters.type) {
        case 'high-inventory':
          option = createProductChart('闲置量', 'warning')
          break
        case 'high-demand':
          option = createProductChart('需求量', 'success')
          break
        case 'monthly-top':
          option = createProductChart('销量', 'primary')
          break
        case 'active-users':
          option = createUserChart()
          break
      }
      
      chartInstance.setOption(option)
    }
    
    // 创建产品相关图表
    const createProductChart = (yAxisName, color) => {
      const data = statisticsData.value.slice(0, 10).map(item => ({
        name: item.productName,
        value: item.tradeCount || 0
      }))
      
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}'
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: data.map(item => item.name),
          inverse: true,
          axisLine: { show: false },
          axisTick: { show: false }
        },
        series: [
          {
            name: yAxisName,
            type: 'bar',
            data: data.map(item => item.value),
            itemStyle: {
              color: getColorByType(color)
            }
          }
        ]
      }
    }
    
    // 创建用户图表
    const createUserChart = () => {
      const data = statisticsData.value.slice(0, 10).map(item => ({
        name: item.userName,
        value: item.tradeCount || 0,
        amount: item.tradeAmount || 0
      }))
      
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['交易次数', '交易总额']
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.name)
        },
        yAxis: [
          {
            type: 'value',
            name: '交易次数'
          },
          {
            type: 'value',
            name: '交易总额(元)',
            position: 'right'
          }
        ],
        series: [
          {
            name: '交易次数',
            type: 'bar',
            data: data.map(item => item.value),
            itemStyle: {
              color: '#409EFF'
            }
          },
          {
            name: '交易总额',
            type: 'line',
            yAxisIndex: 1,
            data: data.map(item => item.amount),
            itemStyle: {
              color: '#67C23A'
            }
          }
        ]
      }
    }
    
    // 根据类型获取颜色
    const getColorByType = (type) => {
      const colorMap = {
        'warning': '#E6A23C',
        'success': '#67C23A',
        'primary': '#409EFF'
      }
      return colorMap[type] || '#409EFF'
    }
    
    // 获取统计标题
    const getStatisticsTitle = () => {
      const titleMap = {
        'high-inventory': '高闲置量二手物品排行',
        'high-demand': '高需求量二手物品排行',
        'monthly-top': '月度热门二手物品排行',
        'active-users': '活跃用户排行'
      }
      return titleMap[filters.type] || '统计分析'
    }
    
    // 获取排名类型
    const getRankType = (rank) => {
      if (rank === 1) return 'danger'
      if (rank === 2) return 'warning'
      if (rank === 3) return 'success'
      return 'info'
    }
    
    // 查看产品详情
    const viewProduct = (productId) => {
      router.push(`/products/${productId}`)
    }
    
    // 查看用户详情
    const viewUser = (userId) => {
      router.push(`/admin/users?id=${userId}`)
    }
    
    // 导出数据
    const exportData = () => {
      ElMessage.info('导出功能开发中')
    }
    
    // 监听视图模式变化
    const handleViewModeChange = () => {
      if (viewMode.value === 'chart') {
        nextTick(() => {
          updateChart()
        })
      }
    }
    
    onMounted(() => {
      fetchStatisticsData()
    })
    
    return {
      loading,
      statisticsData,
      filters,
      viewMode,
      statisticsChart,
      handleTypeChange,
      handleViewModeChange,
      getStatisticsTitle,
      getRankType,
      viewProduct,
      viewUser,
      exportData,
      formatPrice
    }
  },
  watch: {
    viewMode() {
      this.handleViewModeChange()
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

/* 筛选区域样式 */
.filter-card {
  margin-bottom: var(--spacing-xl);
}

.card-header {
  margin-bottom: var(--spacing-base);
}

.filter-select {
  width: 200px;
}

/* 数据展示样式 */
.statistics-card {
  margin-bottom: var(--spacing-xl);
}

.user-info {
  gap: var(--spacing-sm);
}

.user-name {
  font-weight: 500;
}

.chart-container {
  width: 100%;
  height: 500px;
  margin-top: var(--spacing-base);
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-base);
  }
  
  .chart-container {
    height: 350px;
    overflow: hidden;
  }
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}
</style>