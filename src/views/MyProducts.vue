<template>
  <Layout>
    <div class="unified-page-container fade-in">
      <!-- 标题区域 -->
      <section class="section-container">
        <div class="section-header">
          <h2 class="unified-title-xl">我的二手物品</h2>
          <el-button 
            type="primary" 
            class="unified-button unified-button-primary"
            @click="$router.push('/publish-product')"
          >
            <el-icon><Plus /></el-icon>
            发布二手物品
          </el-button>
        </div>
      </section>

      <!-- 二手物品列表 -->
      <section class="section-container">
        <div class="list-header">
          <h3 class="unified-title-base unified-text-primary">
            共找到 <span class="highlight">{{ total }}</span> 件二手物品
          </h3>
        </div>
        
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="6" animated />
        </div>
        
        <div v-else-if="products.length === 0" class="empty-container unified-flex unified-flex-center">
          <el-empty description="暂无二手物品">
            <template #image>
              <el-icon size="60" color="var(--text-placeholder)"><Box /></el-icon>
            </template>
            <el-button 
              type="primary" 
              class="unified-button unified-button-primary"
              @click="$router.push('/publish-product')"
            >
              发布第一件二手物品
            </el-button>
          </el-empty>
        </div>
        
        <div v-else class="products-grid unified-grid unified-grid-4">
          <div 
            class="product-item fade-in"
            v-for="(product, index) in products" 
            :key="product.id"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <ProductCard 
              :product="product" 
              :show-user="false" 
              :show-actions="true"
              @edit="editProduct"
              @delete="deleteProduct"
              @status-change="changeStatus"
            />
          </div>
        </div>
        
        <!-- 分页 -->
        <div v-if="total > 0" class="pagination-container unified-flex unified-flex-center">
          <el-pagination
            v-model:current-page="pagination.current"
            v-model:page-size="pagination.size"
            :page-sizes="[12, 24, 36, 48]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
          />
        </div>
      </section>
    </div>
  </Layout>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { Plus, Box } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import ProductCard from '@/components/ProductCard.vue'
import { productApi } from '@/api'
import { formatPrice, formatPaymentMethod, formatProductStatus, formatDate, getProductStatusType } from '@/utils/format'
import { useDataFetch } from '@/composables/useDataFetch'
import { useDeleteHandler, useStatusUpdateHandler } from '@/composables/useEventHandlers'

export default {
  name: 'MyProducts',
  components: {
    Layout,
    ProductCard,
    Plus,
    Box
  },
  setup() {
    const store = useStore()
    const route = useRoute()
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
    
    // 编辑二手物品
    const editProduct = (product) => {
      router.push({
        name: 'EditProduct',
        params: { id: product.id }
      })
    }
    
    // 删除二手物品
    const deleteProduct = (product) => {
      handleDelete(product.id, { product })
    }
    
    // 更改二手物品状态
    const changeStatus = ({ product, status }) => {
      handleStatusUpdate(product.id, status)
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
      formatPrice,
      formatPaymentMethod,
      formatProductStatus,
      formatDate,
      getProductStatusType,
      fetchProducts,
      editProduct,
      deleteProduct,
      changeStatus,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
/* 页面容器样式 */
.unified-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

/* 列表头部样式 */
.list-header {
  margin-bottom: var(--spacing-base);
}

.highlight {
  color: var(--primary-color);
  font-weight: 600;
  font-size: var(--font-size-xl);
}

/* 产品网格样式 */
.products-grid {
  margin-bottom: var(--spacing-xl);
}

.product-item {
  margin-bottom: var(--spacing-base);
}

/* 加载和空状态样式 */
.loading-container {
  padding: var(--spacing-xxl) 0;
}

.empty-container {
  min-height: 300px;
}

/* 分页样式 */
.pagination-container {
  margin-top: var(--spacing-xl);
}

/* Element Plus 组件覆盖样式 */
.el-pagination {
  --el-pagination-button-border-radius: var(--border-radius-round);
}

.el-skeleton {
  --el-skeleton-color: var(--bg-light);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .unified-page-container {
    padding: var(--spacing-lg);
  }
  
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .unified-page-container {
    padding: var(--spacing-base);
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .el-pagination {
    --el-pagination-font-size: 12px;
  }
}

/* 动画延迟效果 */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

.fade-in:nth-child(1) { animation-delay: 0.05s; }
.fade-in:nth-child(2) { animation-delay: 0.1s; }
.fade-in:nth-child(3) { animation-delay: 0.15s; }
.fade-in:nth-child(4) { animation-delay: 0.2s; }
</style>