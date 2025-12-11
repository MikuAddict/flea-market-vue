<template>
  <Layout>
    <div class="unified-page-container fade-in">
      <!-- 搜索和筛选区域 -->
      <section class="unified-mb-xl">
        <div class="unified-flex unified-flex-between unified-mb-lg">
          <h2 class="unified-title-xl">二手物品列表</h2>
          <el-button 
            v-if="isLoggedIn" 
            type="primary" 
            class="unified-button unified-button-primary"
            @click="$router.push('/publish-product')"
          >
            <el-icon><Plus /></el-icon>
            发布二手物品
          </el-button>
        </div>
        
        <el-card class="unified-card filter-card">
          <template #header>
            <div class="unified-flex unified-flex-between unified-w-full">
              <h3 class="unified-title-base">搜索与筛选</h3>
            </div>
          </template>
          
          <div class="unified-filter-container">
            <div class="unified-filter-form">
              <div class="unified-filter-item">
                <div class="unified-filter-label">关键词</div>
                <el-input
                  v-model="filters.keyword"
                  placeholder="搜索二手物品"
                  clearable
                  class="unified-filter-input"
                  @keyup.enter="handleSearch"
                />
              </div>
              
              <div class="unified-filter-item">
                <div class="unified-filter-label">分类</div>
                <el-select
                  v-model="filters.categoryId"
                  placeholder="选择分类"
                  clearable
                  class="unified-filter-select"
                >
                  <el-option
                    v-for="category in categories"
                    :key="category.id"
                    :label="category.name"
                    :value="category.id"
                  />
                </el-select>
              </div>
              
              <div class="unified-filter-item">
                <div class="unified-filter-label">支付方式</div>
                <el-select
                  v-model="filters.paymentMethod"
                  placeholder="支付方式"
                  clearable
                  class="unified-filter-select"
                >
                  <el-option label="现金支付" :value="0" />
                  <el-option label="微信支付" :value="1" />
                  <el-option label="积分兑换" :value="2" />
                  <el-option label="二手交换" :value="3" />
                </el-select>
              </div>
              
              <div class="unified-filter-item">
                <div class="unified-filter-label">排序方式</div>
                <div class="unified-flex unified-flex-center unified-gap-sm">
                  <el-select v-model="filters.sortField" class="unified-filter-select">
                    <el-option label="默认" value="createTime" />
                    <el-option label="价格" value="price" />
                    <el-option label="名称" value="productName" />
                  </el-select>
                  <el-select v-model="filters.sortOrder" class="unified-filter-select">
                    <el-option label="降序" value="desc" />
                    <el-option label="升序" value="asc" />
                  </el-select>
                </div>
              </div>
              
              <div class="unified-filter-item">
                <div class="unified-filter-label">价格区间</div>
                <div class="unified-flex unified-flex-center unified-gap-sm">
                  <el-input-number
                    v-model="filters.minPrice"
                    placeholder="最低价"
                    :min="0"
                    :precision="2"
                    controls-position="right"
                  />
                  <span class="unified-text-secondary">-</span>
                  <el-input-number
                    v-model="filters.maxPrice"
                    placeholder="最高价"
                    :min="0"
                    :precision="2"
                    controls-position="right"
                  />
                </div>
              </div>
            </div>
            
            <div class="unified-search-button-container">
              <el-button
                type="primary"
                class="unified-button unified-button-primary"
                @click="handleSearch"
              >
                <el-icon><Search /></el-icon>
                搜索
              </el-button>
              <el-button
                class="unified-button unified-button-outline"
                @click="resetFilters"
              >
                <el-icon><RefreshLeft /></el-icon>
                重置
              </el-button>
            </div>
          </div>
        </el-card>
      </section>

      <!-- 二手物品列表 -->
      <section class="unified-mb-xl">
        <div class="list-header unified-mb-base">
          <h3 class="unified-title-base unified-text-primary">
            共找到 <span class="highlight">{{ total }}</span> 件二手物品
          </h3>
        </div>
        
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="6" animated />
        </div>
        
        <div v-else-if="productList.length === 0" class="unified-empty unified-flex unified-flex-center">
          <el-empty description="暂无二手物品">
            <template #image>
              <el-icon size="60" color="var(--text-placeholder)"><Box /></el-icon>
            </template>
            <el-button 
              v-if="isLoggedIn"
              type="primary" 
              class="unified-button unified-button-primary"
              @click="$router.push('/publish-product')"
            >
              发布第一件二手物品
            </el-button>
          </el-empty>
        </div>
        
        <div v-else class="unified-grid unified-grid-4">
          <div 
            class="fade-in"
            v-for="(product, index) in productList" 
            :key="product.id"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <ProductCard :product="product" :showUser="true" />
          </div>
        </div>
        
        <!-- 分页 -->
        <div v-if="total > 0" class="unified-flex unified-flex-center unified-mt-xl">
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { Plus, Search, RefreshLeft, Box } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import ProductCard from '@/components/ProductCard.vue'
import { productApi } from '@/api'
import { useDataFetchWithIdPrecision } from '@/composables/useDataFetch'

export default {
  name: 'ProductList',
  components: {
    Layout,
    ProductCard
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    // 筛选条件
    const filters = reactive({
      keyword: '',
      categoryId: null,
      paymentMethod: null,
      minPrice: null,
      maxPrice: null,
      sortField: 'createTime',
      sortOrder: 'desc'
    })
    
    // 计算属性
    const categories = computed(() => store.state.categories)
    const isLoggedIn = computed(() => store.getters.isLoggedIn)
    
    // 使用数据获取组合函数
    const {
      loading,
      data: productList,
      total,
      pagination,
      fetchData,
      handleCurrentChange,
      handleSizeChange,
      filters: dataFilters  // 重命名以避免与组件中的 filters 冲突
    } = useDataFetchWithIdPrecision({
      apiFunction: productApi.advancedSearchProducts,
      defaultFilters: filters,
      idFields: ['id']
    })
    
    // 搜索二手物品
    const searchProducts = () => {
      // 更新 useDataFetch 中的过滤器
      Object.assign(dataFilters, filters)
      
      const query = {
        ...filters,
        current: pagination.current,
        size: pagination.size
      }
      
      // 移除空值参数
      Object.keys(query).forEach(key => {
        if (query[key] === null || query[key] === '' || query[key] === undefined) {
          delete query[key]
        }
      })
      
      console.log('[ProductList] 搜索参数:', query);
      
      router.replace({ query })
      fetchData()
    }
    
    // 监听路由查询参数变化
    watch(() => route.query, (newQuery) => {
      Object.keys(filters).forEach(key => {
        if (newQuery[key] !== undefined) {
          filters[key] = newQuery[key]
        }
      })
      
      if (newQuery.current) pagination.current = Number(newQuery.current)
      if (newQuery.size) pagination.size = Number(newQuery.size)
      
      // 更新 useDataFetch 中的过滤器
      Object.assign(dataFilters, filters)
      fetchData()
    }, { immediate: true })
    
    // 处理搜索
    const handleSearch = () => {
      pagination.current = 1
      // 更新 useDataFetch 中的过滤器
      Object.assign(dataFilters, filters)
      fetchData()
    }
    
    // 重置筛选条件
    const resetFilters = () => {
      Object.keys(filters).forEach(key => {
        if (key === 'sortField') {
          filters[key] = 'createTime'
        } else if (key === 'sortOrder') {
          filters[key] = 'desc'
        } else {
          filters[key] = null
        }
      })
      pagination.current = 1
      // 更新 useDataFetch 中的过滤器
      Object.assign(dataFilters, filters)
      fetchData()
    }
    
    onMounted(async () => {
      // 只在没有分类数据时才获取分类
      if (categories.value.length === 0) {
        await store.dispatch('fetchCategories')
      }
      
      // 路由守卫已经处理了用户信息的获取
    })
    
    return {
      productList,
      total,
      loading,
      pagination,
      filters,
      categories,
      isLoggedIn,
      handleSearch,
      resetFilters,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
/* 筛选区域样式 */
.filter-card {
  margin-bottom: var(--spacing-lg);
  border-radius: var(--border-radius-base);
}

/* 列表头部样式 */
.list-header {
  margin-bottom: var(--spacing-base);
}

.highlight {
  color: var(--primary-color);
  font-weight: var(--font-semibold);
  font-size: var(--font-size-xl);
}

/* 加载和空状态样式 */
.loading-container {
  padding: var(--spacing-xxl) 0;
}

.empty-container {
  min-height: 300px;
}

/* Element Plus 组件覆盖样式 */
.el-collapse {
  border: none;
}

.el-collapse-item__header {
  font-size: var(--font-size-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  border: none;
  padding: 0;
  padding-bottom: var(--spacing-base);
}

.el-collapse-item__content {
  padding: 0 var(--spacing-base) var(--spacing-base);
}

.el-form-item__label {
  font-weight: var(--font-medium);
  color: var(--text-regular);
}

.el-pagination {
  --el-pagination-button-border-radius: var(--border-radius-round);
}

.el-skeleton {
  --el-skeleton-color: var(--bg-light);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-form .el-row .el-col {
    margin-bottom: var(--spacing-base);
  }
}

@media (max-width: 576px) {
  .el-pagination {
    --el-pagination-font-size: 12px;
  }
}

/* 动画延迟效果 */
.fade-in {
  animation: fadeIn var(--transition-base) ease-out forwards;
  opacity: 0;
}

.fade-in:nth-child(1) { animation-delay: 0.05s; }
.fade-in:nth-child(2) { animation-delay: 0.1s; }
.fade-in:nth-child(3) { animation-delay: 0.15s; }
.fade-in:nth-child(4) { animation-delay: 0.2s; }
</style>