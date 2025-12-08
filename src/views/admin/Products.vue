<template>
  <Layout>
    <div class="admin-products unified-page-container fade-in">
      <!-- 页面标题和操作区域 -->
      <div class="page-header unified-flex unified-flex-between">
        <div>
          <h1 class="unified-title-xl">二手物品管理</h1>
          <p class="unified-text-secondary">管理系统中的所有二手物品</p>
        </div>
      </div>
      
      <!-- 产品统计卡片 -->
      <div class="stats-cards unified-grid unified-grid-4">
        <div class="stat-card fade-in" v-for="(stat, index) in productStats" :key="stat.title" :style="{ animationDelay: `${index * 0.1}s` }">
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
          <el-form-item label="关键词">
            <el-input
              v-model="filters.keyword"
              placeholder="搜索产品名称或描述"
              clearable
              class="unified-input"
              @keyup.enter="fetchProducts"
            />
          </el-form-item>
          
          <el-form-item label="分类">
            <el-select
              v-model="filters.categoryId"
              placeholder="选择分类"
              clearable
              class="unified-input filter-select"
            >
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="状态">
            <el-select
              v-model="filters.status"
              placeholder="选择状态"
              clearable
              class="unified-input filter-select"
            >
              <el-option label="待审核" :value="0" />
              <el-option label="已通过" :value="1" />
              <el-option label="已拒绝" :value="2" />
              <el-option label="已下架" :value="3" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="发布者">
            <el-input
              v-model="filters.userName"
              placeholder="输入用户名"
              clearable
              class="unified-input"
            />
          </el-form-item>
          
          <el-form-item label="价格区间">
            <div class="price-range unified-flex">
              <el-input-number
                v-model="filters.minPrice"
                placeholder="最低价"
                :min="0"
                class="unified-input price-input"
              />
              <span class="price-separator">-</span>
              <el-input-number
                v-model="filters.maxPrice"
                placeholder="最高价"
                :min="0"
                class="unified-input price-input"
              />
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              class="unified-button unified-button-primary"
              @click="fetchProducts"
            >
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 产品列表 -->
      <el-card class="unified-card products-card fade-in">
        <template #header>
          <div class="card-header unified-flex unified-flex-between">
            <h3 class="unified-title-base">产品列表</h3>
            <div class="batch-actions unified-flex unified-flex-center">
              <el-button
                v-if="selectedProducts.length > 0"
                type="primary"
                size="small"
                class="unified-button"
                @click="batchApproveProducts"
              >
                批量审核通过
              </el-button>
              <el-button
                v-if="selectedProducts.length > 0"
                type="danger"
                size="small"
                class="unified-button"
                @click="batchDeleteProducts"
              >
                批量删除
              </el-button>
            </div>
          </div>
        </template>
        
        <el-table
          v-loading="loading"
          :data="productList"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" />
          
          <el-table-column label="产品信息" min-width="200">
            <template #default="scope">
              <div class="product-info unified-flex">
                <el-image
                  :src="scope.row.imageUrl"
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
                  <p class="product-desc">{{ scope.row.description?.substring(0, 50) }}...</p>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="price" label="价格" width="100">
            <template #default="scope">
              <div class="price-info">
                <span class="price-symbol">¥</span>
                <span class="price-value">{{ formatPrice(scope.row.price) }}</span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="category" label="分类" width="120">
            <template #default="scope">
              {{ getCategoryName(scope.row.categoryId) }}
            </template>
          </el-table-column>
          
          <el-table-column prop="userName" label="发布者" width="120">
            <template #default="scope">
              <div class="user-info unified-flex unified-flex-center">
                <el-avatar :size="24" :src="scope.row.userAvatar">
                  {{ scope.row.userName?.charAt(0) }}
                </el-avatar>
                <span class="user-name">{{ scope.row.userName }}</span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)" size="small">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="createTime" label="发布时间" width="160">
            <template #default="scope">
              {{ formatDate(scope.row.createTime) }}
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <div class="action-buttons unified-flex">
                <el-button
                  size="small"
                  type="text"
                  @click="viewProduct(scope.row)"
                >
                  查看
                </el-button>
                
                <el-button
                  v-if="scope.row.status === 0"
                  size="small"
                  type="primary"
                  @click="auditProduct(scope.row)"
                >
                  审核
                </el-button>
                
                <el-dropdown @command="(command) => handleProductAction(command, scope.row)">
                  <el-button size="small" type="text">
                    更多
                    <el-icon><ArrowDown /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="edit">编辑</el-dropdown-item>
                      <el-dropdown-item command="off-shelf" v-if="scope.row.status === 1">
                        下架
                      </el-dropdown-item>
                      <el-dropdown-item command="on-shelf" v-if="scope.row.status === 3">
                        上架
                      </el-dropdown-item>
                      <el-dropdown-item divided command="delete">删除</el-dropdown-item>
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
      
      <!-- 产品审核对话框 -->
      <el-dialog
        v-model="auditDialogVisible"
        title="产品审核"
        width="700px"
      >
        <div class="audit-product-info unified-flex">
          <el-image
            :src="auditForm.imageUrl"
            class="audit-product-image"
            fit="cover"
          >
            <template #error>
              <div class="image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          
          <div class="audit-product-details">
            <h3>{{ auditForm.productName }}</h3>
            <div class="product-meta">
              <p><span class="meta-label">发布者：</span>{{ auditForm.userName }}</p>
              <p><span class="meta-label">价格：</span>¥{{ formatPrice(auditForm.price) }}</p>
              <p><span class="meta-label">发布时间：</span>{{ formatDate(auditForm.createTime) }}</p>
            </div>
            <div class="product-description">
              <h4>产品描述</h4>
              <p>{{ auditForm.description }}</p>
            </div>
          </div>
        </div>
        
        <el-divider class="unified-divider" />
        
        <el-form :model="auditForm" label-width="100px">
          <el-form-item label="审核结果">
            <el-radio-group v-model="auditForm.auditStatus">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="审核备注" v-if="auditForm.auditStatus === 2">
            <el-input
              v-model="auditForm.auditRemark"
              type="textarea"
              :rows="3"
              placeholder="请输入拒绝原因"
            />
          </el-form-item>
        </el-form>
        
        <template #footer>
          <div class="dialog-footer unified-flex unified-flex-end">
            <el-button @click="auditDialogVisible = false">取消</el-button>
            <el-button 
              type="primary" 
              :loading="auditSubmitting"
              @click="submitAuditForm"
            >
              提交审核
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, 
  Search, 
  Edit, 
  Delete, 
  ArrowDown,
  Picture
} from '@element-plus/icons-vue'
import { formatPrice, formatDate } from '@/utils/format'
import { adminApi, categoryApi } from '@/api'
import Layout from '@/components/Layout.vue'

export default {
  name: 'AdminProducts',
  components: {
    Layout
  },
  setup() {
    const router = useRouter()
    
    // 响应式数据
    const loading = ref(false)
    const productList = ref([])
    const selectedProducts = ref([])
    const categories = ref([])
    const auditDialogVisible = ref(false)
    const auditSubmitting = ref(false)
    
    // 分页信息
    const pagination = reactive({
      current: 1,
      size: 10,
      total: 0
    })
    
    // 筛选条件
    const filters = reactive({
      keyword: '',
      categoryId: '',
      status: '',
      userName: '',
      minPrice: null,
      maxPrice: null
    })
    
    // 产品统计数据
    const productStats = computed(() => [
      {
        title: '总二手物品数',
        value: productList.value.length,
        icon: 'Goods',
        type: 'primary'
      },
      {
        title: '待审核',
        value: productList.value.filter(product => product.status === 0).length,
        icon: 'Clock',
        type: 'warning'
      },
      {
        title: '已上架',
        value: productList.value.filter(product => product.status === 1).length,
        icon: 'Check',
        type: 'success'
      },
      {
        title: '已下架',
        value: productList.value.filter(product => product.status === 3).length,
        icon: 'Close',
        type: 'danger'
      }
    ])
    
    // 审核表单
    const auditForm = reactive({
      id: '',
      productName: '',
      description: '',
      price: 0,
      imageUrl: '',
      userName: '',
      createTime: '',
      auditStatus: 1,
      auditRemark: ''
    })
    
    // 获取产品列表
    const fetchProducts = async () => {
      loading.value = true
      try {
        const params = {
          current: pagination.current,
          size: pagination.size,
          productName: filters.keyword,
          categoryId: filters.categoryId,
          status: filters.status,
          userName: filters.userName,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice
        }
        
        const response = await adminApi.product.adminListProducts(params)
        if (response.data && response.data.code === 200) {
          productList.value = response.data.data.records || []
          pagination.total = response.data.data.total || 0
        } else {
          ElMessage.error('获取产品列表失败')
        }
      } catch (error) {
        console.error('获取产品列表失败:', error)
        ElMessage.error('获取产品列表失败')
      } finally {
        loading.value = false
      }
    }
    
    // 获取分类列表
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategoryList()
        if (response.data && response.data.code === 200) {
          categories.value = response.data.data || []
        }
      } catch (error) {
        console.error('获取分类列表失败:', error)
      }
    }
    
    // 重置筛选条件
    const resetFilters = () => {
      Object.keys(filters).forEach(key => {
        if (key === 'minPrice' || key === 'maxPrice') {
          filters[key] = null
        } else {
          filters[key] = ''
        }
      })
      pagination.current = 1
      fetchProducts()
    }
    
    // 处理表格选择变化
    const handleSelectionChange = (selection) => {
      selectedProducts.value = selection
    }
    
    // 处理分页大小变化
    const handleSizeChange = (size) => {
      pagination.size = size
      pagination.current = 1
      fetchProducts()
    }
    
    // 处理当前页变化
    const handleCurrentChange = (current) => {
      pagination.current = current
      fetchProducts()
    }
    
    // 跳转到添加产品页面
    const goToAddProduct = () => {
      router.push('/publish-product')
    }
    
    // 查看产品详情
    const viewProduct = (product) => {
      router.push(`/products/${product.id}`)
    }
    
    // 审核产品
    const auditProduct = (product) => {
      Object.assign(auditForm, {
        id: product.id,
        productName: product.productName,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        userName: product.userName,
        createTime: product.createTime,
        auditStatus: 1,
        auditRemark: ''
      })
      auditDialogVisible.value = true
    }
    
    // 处理产品操作
    const handleProductAction = async (command, product) => {
      switch (command) {
        case 'edit':
          router.push(`/publish-product?id=${product.id}`)
          break
          
        case 'off-shelf':
          try {
            await ElMessageBox.confirm(`确定要下架产品 "${product.productName}" 吗？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            
            // 更新产品状态功能在API中未定义，需要实现
            ElMessage.warning('下架产品功能暂未实现')
            return
            ElMessage.success('产品下架成功')
            fetchProducts()
          } catch (error) {
            if (error !== 'cancel') {
              ElMessage.error('产品下架失败')
            }
          }
          break
          
        case 'on-shelf':
          try {
            await ElMessageBox.confirm(`确定要上架产品 "${product.productName}" 吗？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            
            // 更新产品状态功能在API中未定义，需要实现
            ElMessage.warning('上架产品功能暂未实现')
            return
            ElMessage.success('产品上架成功')
            fetchProducts()
          } catch (error) {
            if (error !== 'cancel') {
              ElMessage.error('产品上架失败')
            }
          }
          break
          
        case 'delete':
          try {
            await ElMessageBox.confirm(`确定要删除产品 "${product.productName}" 吗？此操作不可恢复。`, '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            })
            
            // 删除产品功能在API中未定义，需要实现
            ElMessage.warning('删除产品功能暂未实现')
            return
            ElMessage.success('产品删除成功')
            fetchProducts()
          } catch (error) {
            if (error !== 'cancel') {
              ElMessage.error('产品删除失败')
            }
          }
          break
      }
    }
    
    // 批量审核通过产品
    const batchApproveProducts = async () => {
      try {
        await ElMessageBox.confirm(`确定要审核通过选中的 ${selectedProducts.value.length} 个产品吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // 批量审核功能在API中未定义，需要实现
        ElMessage.warning('批量审核功能暂未实现')
        return
        
        await Promise.all(promises)
        ElMessage.success('批量审核成功')
        fetchProducts()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('批量审核失败')
        }
      }
    }
    
    // 批量删除产品
    const batchDeleteProducts = async () => {
      try {
        await ElMessageBox.confirm(`确定要删除选中的 ${selectedProducts.value.length} 个产品吗？此操作不可恢复。`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        })
        
        // 批量删除功能在API中未定义，需要实现
        ElMessage.warning('批量删除功能暂未实现')
        return
        
        await Promise.all(promises)
        ElMessage.success('批量删除成功')
        fetchProducts()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('批量删除失败')
        }
      }
    }
    
    // 提交审核表单
    const submitAuditForm = async () => {
      try {
        auditSubmitting.value = true
        await adminApi.product.reviewProduct(auditForm.id, auditForm.auditStatus)
        
        const result = auditForm.auditStatus === 1 ? '通过' : '拒绝'
        ElMessage.success(`产品审核${result}成功`)
        auditDialogVisible.value = false
        fetchProducts()
      } catch (error) {
        console.error('产品审核失败:', error)
        ElMessage.error('产品审核失败')
      } finally {
        auditSubmitting.value = false
      }
    }
    
    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        0: '待审核',
        1: '已上架',
        2: '已拒绝',
        3: '已下架'
      }
      return statusMap[status] || '未知'
    }
    
    // 获取状态类型
    const getStatusType = (status) => {
      const typeMap = {
        0: 'warning',
        1: 'success',
        2: 'danger',
        3: 'info'
      }
      return typeMap[status] || 'info'
    }
    
    // 获取分类名称
    const getCategoryName = (categoryId) => {
      const category = categories.value.find(c => c.id === categoryId)
      return category ? category.name : '未知分类'
    }
    
    onMounted(() => {
      fetchCategories()
      fetchProducts()
    })
    
    return {
      loading,
      productList,
      selectedProducts,
      categories,
      pagination,
      filters,
      productStats,
      auditDialogVisible,
      auditForm,
      auditSubmitting,
      fetchProducts,
      resetFilters,
      handleSelectionChange,
      handleSizeChange,
      handleCurrentChange,
      goToAddProduct,
      viewProduct,
      auditProduct,
      handleProductAction,
      batchApproveProducts,
      batchDeleteProducts,
      submitAuditForm,
      getStatusText,
      getStatusType,
      getCategoryName,
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

.price-range {
  align-items: center;
  gap: var(--spacing-sm);
}

.price-separator {
  color: var(--text-secondary);
}

.price-input {
  width: 120px;
}

/* 产品列表样式 */
.products-card {
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

.user-info {
  gap: var(--spacing-xs);
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-primary);
}

.action-buttons {
  gap: var(--spacing-xs);
}

.pagination-container {
  margin-top: var(--spacing-xl);
}

/* 审核对话框样式 */
.audit-product-info {
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-base);
}

.audit-product-image {
  width: 180px;
  height: 180px;
  border-radius: var(--border-radius-base);
  overflow: hidden;
  box-shadow: var(--shadow-light);
}

.audit-product-details {
  flex: 1;
}

.audit-product-details h3 {
  margin: 0 0 var(--spacing-base) 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.product-meta {
  margin-bottom: var(--spacing-base);
}

.product-meta p {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  display: flex;
}

.meta-label {
  font-weight: 500;
  color: var(--text-regular);
  margin-right: var(--spacing-xs);
  min-width: 60px;
}

.product-description h4 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
}

.product-description p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: var(--font-size-sm);
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

/* 对话框样式 */
.dialog-footer {
  gap: var(--spacing-sm);
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
  
  .audit-product-info {
    flex-direction: column;
  }
  
  .audit-product-image {
    width: 100%;
    height: 200px;
  }
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}
</style>