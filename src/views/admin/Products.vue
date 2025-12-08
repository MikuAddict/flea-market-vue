<template>
  <div class="admin-products">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>二手物品管理</span>
        </div>
      </template>
      
      <!-- 搜索和筛选 -->
      <div class="filter-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索二手物品名称或描述"
          style="width: 300px; margin-right: 10px"
          @keyup.enter="handleSearch"
        />
        <el-select v-model="filterCategory" placeholder="二手物品分类" clearable style="width: 150px; margin-right: 10px">
          <el-option 
            v-for="category in categories" 
            :key="category.id" 
            :label="category.name" 
            :value="category.id" 
          />
        </el-select>
        <el-select v-model="filterStatus" placeholder="二手物品状态" clearable style="width: 120px; margin-right: 10px">
          <el-option label="上架" value="active" />
          <el-option label="下架" value="inactive" />
          <el-option label="已售出" value="sold" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>

      <!-- 二手物品列表 -->
      <el-table :data="productList" v-loading="loading" style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="二手物品名称" />
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ownerName" label="发布者" />
        <el-table-column prop="createdAt" label="发布时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button 
              size="small" 
              :type="row.status === 'active' ? 'warning' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '下架' : '上架' }}
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
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

    <!-- 二手物品详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="二手物品详情" width="600px">
      <div v-if="currentProduct" class="product-detail">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-image 
              :src="currentProduct.images?.[0] || '/placeholder.jpg'" 
              fit="cover"
              style="width: 100%; height: 200px; border-radius: 4px"
            />
          </el-col>
          <el-col :span="12">
            <h3>{{ currentProduct.name }}</h3>
            <p>价格: ¥{{ currentProduct.price }}</p>
            <p>分类: {{ currentProduct.categoryName }}</p>
            <p>状态: 
              <el-tag :type="getStatusType(currentProduct.status)">
                {{ getStatusText(currentProduct.status) }}
              </el-tag>
            </p>
            <p>发布者: {{ currentProduct.ownerName }}</p>
            <p>发布时间: {{ formatDate(currentProduct.createdAt) }}</p>
          </el-col>
        </el-row>
        <el-divider />
        <h4>二手物品描述</h4>
        <p>{{ currentProduct.description }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { productApi, categoryApi } from '@/api'
import { formatDate } from '@/utils/format'

export default {
  name: 'AdminProducts',
  setup() {
    const loading = ref(false)
    const productList = ref([])
    const categories = ref([])
    const searchKeyword = ref('')
    const filterCategory = ref('')
    const filterStatus = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const detailDialogVisible = ref(false)
    const currentProduct = ref(null)

    // 获取二手物品列表
    const fetchProducts = async () => {
      loading.value = true
      try {
        const params = {
          page: currentPage.value,
          pageSize: pageSize.value,
          keyword: searchKeyword.value,
          categoryId: filterCategory.value,
          status: filterStatus.value
        }
        const response = await productApi.getProducts(params)
        productList.value = response.data.products
        total.value = response.data.total
      } catch (error) {
        console.error('获取二手物品列表失败:', error)
        ElMessage.error('获取二手物品列表失败')
      } finally {
        loading.value = false
      }
    }

    // 获取分类列表
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategoryList()
        categories.value = response.data
      } catch (error) {
        console.error('获取分类列表失败:', error)
      }
    }

    // 获取状态类型
    const getStatusType = (status) => {
      const types = {
        active: 'success',
        inactive: 'warning',
        sold: 'danger'
      }
      return types[status] || 'info'
    }

    // 获取状态文本
    const getStatusText = (status) => {
      const texts = {
        active: '上架',
        inactive: '下架',
        sold: '已售出'
      }
      return texts[status] || '未知'
    }

    // 搜索
    const handleSearch = () => {
      currentPage.value = 1
      fetchProducts()
    }

    // 重置搜索
    const resetSearch = () => {
      searchKeyword.value = ''
      filterCategory.value = ''
      filterStatus.value = ''
      currentPage.value = 1
      fetchProducts()
    }

    // 分页处理
    const handleSizeChange = (size) => {
      pageSize.value = size
      fetchProducts()
    }

    const handleCurrentChange = (page) => {
      currentPage.value = page
      fetchProducts()
    }

    // 查看二手物品详情
    const handleView = (product) => {
      currentProduct.value = product
      detailDialogVisible.value = true
    }

    // 切换二手物品状态
    const handleToggleStatus = async (product) => {
      try {
        await ElMessageBox.confirm(
          `确定要${product.status === 'active' ? '下架' : '上架'}二手物品 "${product.name}" 吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        const newStatus = product.status === 'active' ? 'inactive' : 'active'
        await productApi.updateProductStatus(product.id, newStatus)
        ElMessage.success('二手物品状态更新成功')
        fetchProducts()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('更新二手物品状态失败:', error)
          ElMessage.error('更新二手物品状态失败')
        }
      }
    }

    // 删除二手物品
    const handleDelete = async (product) => {
      try {
        await ElMessageBox.confirm(
          `确定要删除二手物品 "${product.name}" 吗？此操作不可恢复。`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }
        )
        
        await productApi.deleteProduct(product.id)
        ElMessage.success('二手物品删除成功')
        fetchProducts()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除二手物品失败:', error)
          ElMessage.error('删除二手物品失败')
        }
      }
    }

    onMounted(() => {
      fetchProducts()
      fetchCategories()
    })

    return {
      loading,
      productList,
      categories,
      searchKeyword,
      filterCategory,
      filterStatus,
      currentPage,
      pageSize,
      total,
      detailDialogVisible,
      currentProduct,
      handleSearch,
      resetSearch,
      handleSizeChange,
      handleCurrentChange,
      handleView,
      handleToggleStatus,
      handleDelete,
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

.product-detail h3 {
  margin: 0 0 10px 0;
  color: #303133;
}

.product-detail p {
  margin: 5px 0;
  color: #606266;
}
</style>