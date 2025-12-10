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
        
        <div v-else class="unified-list-container">
          <el-table :data="products" style="width: 100%">
            <el-table-column label="二手物品图片" width="100" align="center">
              <template #default="scope">
                <div class="unified-list-item unified-flex unified-flex-center">
                  <div class="unified-list-item-avatar">
                    <img v-if="getProductImage(scope.row)" :src="getProductImage(scope.row)" :alt="scope.row.productName" style="width: 100%; height: 100%; object-fit: cover;" />
                    <div v-else class="no-image unified-flex unified-flex-center">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column prop="productName" label="二手物品名称" min-width="200" align="center" />
            
            <el-table-column prop="price" label="价格" width="120" align="center">
              <template #default="scope">
                ¥{{ formatPrice(scope.row.price) }}
              </template>
            </el-table-column>
            
            <el-table-column label="分类" width="120" align="center">
              <template #default="scope">
                {{ getCategoryName(scope.row.categoryId) }}
              </template>
            </el-table-column>
            
            <el-table-column prop="status" label="状态" width="100" align="center">
              <template #default="scope">
                <el-tag :type="getProductStatusType(scope.row.status)" size="small">
                  {{ formatProductStatus(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            
            <el-table-column prop="paymentMethod" label="支付方式" width="120" align="center">
              <template #default="scope">
                {{ formatPaymentMethod(scope.row.paymentMethod) }}
              </template>
            </el-table-column>
            
            <el-table-column prop="createTime" label="发布时间" width="180" align="center">
              <template #default="scope">
                {{ formatDate(scope.row.createTime) }}
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="220" fixed="right" align="center">
              <template #default="scope">
                <div class="action-buttons unified-flex unified-flex-center">
                  <el-button
                    size="small"
                    type="primary"
                    plain
                    @click="viewProduct(scope.row.id)"
                    class="action-btn-edit"
                  >
                    查看
                  </el-button>
                  <el-button
                    size="small"
                    type="primary"
                    plain
                    @click="editProduct(scope.row)"
                    class="action-btn-edit"
                    :disabled="scope.row.status === 2"
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-if="scope.row.status === 1"
                    size="small"
                    type="warning"
                    plain
                    @click="changeStatus(scope.row.id, 0)"
                    class="action-btn-edit"
                  >
                    下架
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="deleteProduct(scope.row)"
                    class="action-btn-delete"
                    :disabled="scope.row.status === 2"
                  >
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <div v-if="total > 0" class="unified-pagination-container">
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
        </div>
      </el-card>
    </div>
  </Layout>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Picture, Search } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import { productApi } from '@/api'
import { formatPrice, formatPaymentMethod, formatProductStatus, formatDate, getProductStatusType } from '@/utils/format'
import { useDataFetch } from '@/composables/useDataFetch'
import { useDeleteHandler, useStatusUpdateHandler } from '@/composables/useEventHandlers'

export default {
  name: 'MyProducts',
  components: {
    Layout,
    Picture,
    Search
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    // 筛选条件
    const filters = reactive({
      status: null,
      categoryId: null
    })
    
    // 计算属性
    const categories = computed(() => store.state.categories)
    
    // 使用数据获取组合函数
    const {
      loading,
      data: products,
      total,
      pagination,
      fetchData: fetchProducts,
      handleCurrentChange,
      handleSizeChange
    } = useDataFetch({
      apiFunction: productApi.getMyProductList,
      defaultFilters: filters
    })
    
    // 使用删除处理组合函数
    const { handleDelete } = useDeleteHandler(productApi.deleteProduct, {
      successMessage: '二手物品删除成功',
      confirmMessage: (product) => `确定要删除二手物品"${product.productName}"吗？删除后不可恢复。`,
      successCallback: fetchProducts
    })
    
    // 使用状态更新组合函数
    const { handleStatusUpdate } = useStatusUpdateHandler(productApi.updateProductStatus, {
      successMessage: '二手物品状态更新成功',
      successCallback: fetchProducts
    })
    
    // 获取商品图片
    const getProductImage = (product) => {
      const processImageUrl = (url) => {
        if (!url) return null
        if (url.includes('localhost:7023')) {
          return url.replace('http://localhost:7023', '/api')
        }
        if (url.startsWith('images/') || url.includes('/images/')) {
          return `/api/${url.replace(/^\/?/, '')}`
        }
        if (url.startsWith('/api/')) {
          return url
        }
        return url
      }
      
      if (product.mainImageUrl) {
        return processImageUrl(product.mainImageUrl)
      }
      if (product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
        return processImageUrl(product.imageUrls[0])
      }
      if (product.imageUrls && typeof product.imageUrls === 'string') {
        const urls = product.imageUrls.split(',').filter(url => url.trim())
        return urls.length > 0 ? processImageUrl(urls[0]) : null
      }
      return processImageUrl(product.imageUrl) || null
    }

    // 获取分类名称
    const getCategoryName = (categoryId) => {
      const category = categories.value.find(c => c.id === categoryId)
      return category ? category.name : '未知分类'
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
    const changeStatus = (productId, status) => {
      handleStatusUpdate(productId, status)
    }
    
    // 删除二手物品
    const deleteProduct = (product) => {
      handleDelete(product.id, { product })
    }
    
    onMounted(async () => {
      if (categories.value.length === 0) {
        await store.dispatch('fetchCategories')
      }
      fetchProducts()
    })
    
    return {
      loading,
      products,
      total,
      pagination,
      filters,
      categories,
      getProductImage,
      getCategoryName,
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
  padding: var(--spacing-xl);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-base);
  background-color: var(--bg-light);
  border-radius: var(--border-radius-base);
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-base);
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
  background-color: var(--bg-light);
  color: var(--text-placeholder);
  font-size: 24px;
}

.loading-container, .empty-container {
  padding: var(--spacing-xl) 0;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-lg);
}

/* Element Plus 组件样式优化 */
.el-table {
  --el-table-border-color: var(--border-light);
  --el-table-header-bg-color: var(--bg-lighter);
}

.el-card {
  --el-card-border-radius: var(--border-radius-base);
}

.el-form-item {
  margin-bottom: var(--spacing-base);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .my-products-container {
    padding: var(--spacing-base);
  }
  
  .card-header {
    flex-direction: column;
    gap: var(--spacing-base);
    align-items: flex-start;
  }
}
</style>