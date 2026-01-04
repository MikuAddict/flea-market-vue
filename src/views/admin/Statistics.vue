<template>
  <Layout>
    <div class="admin-statistics unified-page-container fade-in">
      <!-- 页面标题和操作区域 -->
      <div class="page-header unified-flex unified-flex-between">
        <div>
          <h1 class="unified-title-xl">统计分析</h1>
          <p class="unified-text-secondary">月度数据分析与统计报表</p>
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
        
        <div class="unified-filter-container">
          <div class="unified-filter-form">
            <div class="unified-filter-item">
              <div class="unified-filter-label">统计类型</div>
              <el-select
                v-model="filters.type"
                placeholder="选择统计类型"
                @change="handleTypeChange"
                class="unified-filter-select"
              >
                <el-option label="分类已售量统计" value="category-sold" />
                <el-option label="分类交易排行" value="category-ranking" />
                <el-option label="分类在售量统计" value="category-on-sale" />
                <el-option label="活跃用户排行" value="active-user" />
              </el-select>
            </div>
            
            <div class="unified-filter-item">
              <div class="unified-filter-label">年份</div>
              <el-input-number
                v-model="filters.year"
                :min="2020"
                :max="2030"
                placeholder="选择年份"
                @change="handleTypeChange"
              />
            </div>
            
            <div class="unified-filter-item">
              <div class="unified-filter-label">月份</div>
              <el-input-number
                v-model="filters.month"
                :min="1"
                :max="12"
                placeholder="选择月份"
                @change="handleTypeChange"
              />
            </div>
          </div>
          
          <div class="unified-search-button-container">
            <el-button
              type="primary"
              class="unified-button unified-button-primary"
              @click="fetchStatisticsData"
            >
              <el-icon><Search /></el-icon>
              查询数据
            </el-button>
          </div>
        </div>
      </el-card>
      
      <!-- 数据展示 -->
      <el-card class="unified-card statistics-card fade-in">
        <template #header>
          <div class="card-header unified-flex unified-flex-between">
            <h3 class="unified-title-base">{{ getStatisticsTitle() }}</h3>
          </div>
        </template>
        
        <!-- 表格视图 -->
        <div>
          <!-- 分类已售量统计表格 -->
          <el-table 
            v-if="filters.type === 'category-sold'"
            v-loading="loading && filters.type === 'category-sold'" 
            :data="statisticsData.categorySoldInventory || []" 
            style="width: 100%"
            class="unified-table"
          >
            <el-table-column prop="categoryName" label="分类名称" min-width="150" align="center" />
            <el-table-column prop="itemCount" label="已售数量" width="120" align="center">
              <template #default="scope">
                <el-tag type="success" size="small">{{ scope.row.itemCount || 0 }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分类交易排行表格 -->
          <el-table 
            v-else-if="filters.type === 'category-ranking'"
            v-loading="loading && filters.type === 'category-ranking'" 
            :data="statisticsData.monthlyCategoryRanking || []" 
            style="width: 100%"
            class="unified-table"
          >
            <el-table-column label="排名" width="80" align="center">
              <template #default="scope">
                <el-tag :type="getRankType(scope.$index + 1)" size="small">
                  {{ scope.$index + 1 }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="categoryName" label="分类名称" min-width="150" align="center" />
            <el-table-column prop="tradeCount" label="交易次数" width="120" align="center">
              <template #default="scope">
                <el-tag type="primary" size="small">{{ scope.row.tradeCount || 0 }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="交易总额" width="120" align="center">
              <template #default="scope">
                ¥{{ formatPrice(scope.row.totalAmount || 0) }}
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分类在售量统计表格 -->
          <el-table 
            v-else-if="filters.type === 'category-on-sale'"
            v-loading="loading && filters.type === 'category-on-sale'" 
            :data="statisticsData.categoryOnSaleInventory || []" 
            style="width: 100%"
            class="unified-table"
          >
            <el-table-column prop="categoryName" label="分类名称" min-width="150" align="center" />
            <el-table-column prop="itemCount" label="在售数量" width="120" align="center">
              <template #default="scope">
                <el-tag type="warning" size="small">{{ scope.row.itemCount || 0 }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 活跃用户排行表格 -->
          <el-table 
            v-else-if="filters.type === 'active-user'"
            v-loading="loading && filters.type === 'active-user'" 
            :data="statisticsData.activeUserRanking || []" 
            style="width: 100%"
            class="unified-table"
          >
            <el-table-column label="排名" width="80" align="center">
              <template #default="scope">
                <el-tag :type="getRankType(scope.$index + 1)" size="small">
                  {{ scope.$index + 1 }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="用户信息" min-width="150" align="center">
              <template #default="scope">
                <div class="user-info unified-flex unified-flex-center">
                  <el-avatar :size="30" :src="scope.row.avatar">
                    {{ scope.row.userName?.charAt(0) }}
                  </el-avatar>
                  <span class="user-name">{{ scope.row.userName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="tradeCount" label="交易次数" width="100" align="center">
              <template #default="scope">
                <el-tag type="primary" size="small">{{ scope.row.tradeCount || 0 }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="交易总额" width="120" align="center">
              <template #default="scope">
                ¥{{ formatPrice(scope.row.totalAmount || 0) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
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
    const statisticsData = ref({})
    
    // 筛选条件
    const filters = reactive({
      type: 'category-sold',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
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
          case 'category-sold':
            response = await statisticsApi.getMonthlyCategorySoldInventory(filters.year, filters.month)
            if (response.status === 200) {
              statisticsData.value = response.data || {}
            }
            break
          case 'category-ranking':
            response = await statisticsApi.getMonthlyCategoryRanking(filters.year, filters.month)
            if (response.status === 200) {
              statisticsData.value = response.data || {}
            }
            break
          case 'category-on-sale':
            response = await statisticsApi.getMonthlyCategoryOnSaleInventory(filters.year, filters.month)
            if (response.status === 200) {
              statisticsData.value = response.data || {}
            }
            break
          case 'active-user':
            response = await statisticsApi.getMonthlyActiveUserRanking(filters.year, filters.month)
            if (response.status === 200) {
              statisticsData.value = response.data || {}
            }
            break
          default:
            ElMessage.error('未知的统计类型')
            loading.value = false
            return
        }
        
        // 更明确地检查响应数据
        console.log("完整响应检查:", response)
        if (response && response.status === 200) {
          console.log("数据获取成功")
        } else {
          console.log("响应数据结构不符合预期:", response)
          ElMessage.error('获取统计数据失败: 数据格式不正确')
          statisticsData.value = {} // 确保在失败时清空数据
        }
      } catch (error) {
        console.error('获取统计数据失败:', error)
        ElMessage.error('获取统计数据失败: ' + (error.message || '未知错误'))
        statisticsData.value = {} // 确保在异常时清空数据
      } finally {
        loading.value = false
      }
    }
    
    // 获取统计标题
    const getStatisticsTitle = () => {
      const titleMap = {
        'category-sold': `分类已售量统计 (${filters.year}年${filters.month}月)`,
        'category-ranking': `分类交易排行 (${filters.year}年${filters.month}月)`,
        'category-on-sale': `分类在售量统计 (${filters.year}年${filters.month}月)`,
        'active-user': `活跃用户排行 (${filters.year}年${filters.month}月)`
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
    
    onMounted(() => {
      fetchStatisticsData()
    })
    
    return {
      loading,
      statisticsData,
      filters,
      handleTypeChange,
      getStatisticsTitle,
      getRankType,
      viewProduct,
      viewUser,
      formatPrice,
      fetchStatisticsData
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

.unified-table {
  width: 100% !important;
}

.unified-table .el-table__body-wrapper {
  overflow-x: auto;
}

.unified-table th {
  white-space: nowrap;
  background-color: #f8f9fa;
  font-weight: 600;
  text-align: center !important;
  vertical-align: middle;
}

.unified-table td {
  padding: 12px 8px;
  min-height: 52px;
  vertical-align: middle;
  text-align: center;
}

.unified-table .cell {
  white-space: normal;
  word-break: break-word;
  line-height: 1.4;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}

.unified-table .el-table__fixed-right {
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-base);
  }
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}
</style>