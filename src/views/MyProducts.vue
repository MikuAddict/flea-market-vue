<template>
  <Layout>
    <div class="my-products-container">
      <el-card class="products-card">
        <template #header>
          <div class="card-header">
            <span>我的二手物品</span>
            <el-button type="primary" @click="$router.push('/publish-product')">
              发布新二手物品
            </el-button>
          </div>
        </template>
        
        <!-- 筛选和搜索 -->
        <div class="filter-section">
          <el-form :model="filters" inline>
            <el-form-item label="状态">
              <el-select v-model="filters.status" placeholder="全部状态" clearable @change="fetchProducts">
                <el-option label="上架" :value="1" />
                <el-option label="下架" :value="0" />
                <el-option label="已售出" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="分类">
              <el-select v-model="filters.categoryId" placeholder="全部分类" clearable @change="fetchProducts">
                <el-option
                  v-for="category in categories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        
        <!-- 二手物品列表 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="3" animated />
        </div>
        
        <div v-else-if="products.length === 0" class="empty-container">
          <el-empty description="暂无二手物品">
            <el-button type="primary" @click="$router.push('/publish-product')">
              发布第一个二手物品
            </el-button>
          </el-empty>
        </div>
        
        <el-table v-else :data="products" style="width: 100%">
          <el-table-column label="二手物品图片" width="100">
            <template #default="scope">
              <div class="product-image">
                <img v-if="scope.row.imageUrl" :src="scope.row.imageUrl" :alt="scope.row.productName" />
                <div v-else class="no-image">
                  <el-icon><Picture /></el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="productName" label="二手物品名称" min-width="200" />
          
          <el-table-column prop="price" label="价格" width="120">
            <template #default="scope">
              ¥{{ formatPrice(scope.row.price) }}
            </template>
          </el-table-column>
          
          <el-table-column prop="category.name" label="分类" width="120" />
          
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getProductStatusType(scope.row.status)" size="small">
                {{ formatProductStatus(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="paymentMethod" label="支付方式" width="120">
            <template #default="scope">
              {{ formatPaymentMethod(scope.row.paymentMethod) }}
            </template>
          </el-table-column>
          
          <el-table-column prop="createTime" label="发布时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.createTime) }}
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="220" fixed="right">
            <template #default="scope">
              <el-button
                size="small"
                @click="viewProduct(scope.row.id)"
              >
                查看
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="editProduct(scope.row)"
                :disabled="scope.row.status === 2"
              >
                编辑
              </el-button>
              <el-button
                v-if="scope.row.status === 1"
                size="small"
                type="warning"
                @click="changeStatus(scope.row.id, 0)"
              >
                下架
              </el-button>
              <el-button
                v-else-if="scope.row.status === 0"
                size="small"
                type="success"
                @click="changeStatus(scope.row.id, 1)"
              >
                上架
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="deleteProduct(scope.row)"
                :disabled="scope.row.status === 2"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div v-if="total > 0" class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.current"
            v-model:page-size="pagination.size"
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </Layout>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import api from '@/api'
import { productApi } from '@/api'
import {
  formatPrice,
  formatPaymentMethod,
  formatProductStatus,
  formatDate,
  getProductStatusType
} from '@/utils/format'

export default {
  name: 'MyProducts',
  components: {
    Layout,
    Picture
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    // 响应式数据
    const loading = ref(false)
    const products = ref([])
    const total = ref(0)
    
    // 分页信息
    const pagination = reactive({
      current: 1,
      size: 10
    })
    
    // 筛选条件
    const filters = reactive({
      status: null,
      categoryId: null
    })
    
    // 计算属性
    const categories = computed(() => store.state.categories)
    
    // 获取二手物品列表
    const fetchProducts = async () => {
      loading.value = true
      try {
        const response = await productApi.getMyProductList({
          current: pagination.current,
          size: pagination.size,
          ...filters
        })
        
        products.value = response.data.data.records || []
        total.value = response.data.data.total || 0
      } catch (error) {
        console.error('获取二手物品列表失败:', error)
        products.value = []
        total.value = 0
      } finally {
        loading.value = false
      }
    }
    
    // 查看二手物品详情
    const viewProduct = (productId) => {
      router.push(`/products/${productId}`)
    }
    
    // 编辑二手物品
    const editProduct = (product) => {
      router.push({
        name: 'EditProduct',
        params: { id: product.id }
      })
    }
    
    // 更改二手物品状态
    const changeStatus = async (productId, status) => {
      try {
        await api.product.updateProductStatus(productId, status)
        ElMessage.success('二手物品状态更新成功')
        fetchProducts()
      } catch (error) {
        console.error('更新二手物品状态失败:', error)
        ElMessage.error('更新二手物品状态失败')
      }
    }
    
    // 删除二手物品
    const deleteProduct = async (product) => {
      try {
        await ElMessageBox.confirm(
          `确定要删除二手物品"${product.productName}"吗？删除后不可恢复。`,
          '删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        await api.product.deleteProduct(product.id)
        ElMessage.success('二手物品删除成功')
        fetchProducts()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除二手物品失败:', error)
          ElMessage.error('删除二手物品失败')
        }
      }
    }
    
    // 处理每页显示数量变化
    const handleSizeChange = (size) => {
      pagination.size = size
      pagination.current = 1
      fetchProducts()
    }
    
    // 处理页码变化
    const handleCurrentChange = (current) => {
      pagination.current = current
      fetchProducts()
    }
    
    onMounted(async () => {
      // 获取分类数据
      if (categories.value.length === 0) {
        await store.dispatch('fetchCategories')
      }
      
      // 获取二手物品列表
      fetchProducts()
    })
    
    return {
      loading,
      products,
      total,
      pagination,
      filters,
      categories,
      formatPrice,
      formatPaymentMethod,
      formatProductStatus,
      formatDate,
      getProductStatusType,
      fetchProducts,
      viewProduct,
      editProduct,
      changeStatus,
      deleteProduct,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.my-products-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  color: #c0c4cc;
  font-size: 24px;
}

.loading-container, .empty-container {
  padding: 40px 0;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>