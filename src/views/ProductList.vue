<template>
  <Layout>
    <div class="product-list-container">
      <!-- 搜索和筛选区域 -->
      <el-card class="filter-card" shadow="never">
        <el-form :model="filters" :inline="true" label-width="80px">
          <el-form-item label="关键词">
            <el-input
              v-model="filters.keyword"
              placeholder="搜索商品"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="分类">
            <el-select
              v-model="filters.categoryId"
              placeholder="选择分类"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式">
            <el-select
              v-model="filters.paymentMethod"
              placeholder="支付方式"
              clearable
              style="width: 150px"
            >
              <el-option label="现金支付" :value="0" />
              <el-option label="微信支付" :value="1" />
              <el-option label="积分兑换" :value="2" />
              <el-option label="二手交换" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="价格区间">
            <el-input-number
              v-model="filters.minPrice"
              placeholder="最低价"
              :min="0"
              :precision="2"
              style="width: 120px"
            />
            <span class="price-separator">-</span>
            <el-input-number
              v-model="filters.maxPrice"
              placeholder="最高价"
              :min="0"
              :precision="2"
              style="width: 120px"
            />
          </el-form-item>
          <el-form-item label="排序">
            <el-select v-model="filters.sortField" style="width: 120px">
              <el-option label="默认" value="createTime" />
              <el-option label="价格" value="price" />
              <el-option label="名称" value="productName" />
            </el-select>
            <el-select v-model="filters.sortOrder" style="width: 100px">
              <el-option label="降序" value="desc" />
              <el-option label="升序" value="asc" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetFilters">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 商品列表 -->
      <el-card class="product-card" shadow="never">
        <div class="product-header">
          <h3>商品列表</h3>
          <div class="product-actions">
            <el-link v-if="isLoggedIn" type="primary" @click="$router.push('/publish-product')">
              发布商品
            </el-link>
          </div>
        </div>
        
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="6" animated />
        </div>
        
        <div v-else-if="productList.length === 0" class="empty-container">
          <el-empty description="暂无商品" />
        </div>
        
        <el-row v-else :gutter="20" class="product-grid">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="product in productList" :key="product.id">
            <ProductCard :product="product" :showUser="true" />
          </el-col>
        </el-row>
        
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import Layout from '@/components/Layout.vue'
import ProductCard from '@/components/ProductCard.vue'
import api from '@/api'
import { productApi } from '@/api'

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
    
    // 商品列表数据
    const productList = ref([])
    const total = ref(0)
    const loading = ref(false)
    
    // 分页信息
    const pagination = reactive({
      current: 1,
      size: 12
    })
    
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
    
    // 监听路由查询参数变化
    watch(() => route.query, (newQuery) => {
      // 从URL查询参数中获取筛选条件
      Object.keys(filters).forEach(key => {
        if (newQuery[key] !== undefined) {
          filters[key] = newQuery[key]
        }
      })
      
      // 处理分页参数
      if (newQuery.current) pagination.current = Number(newQuery.current)
      if (newQuery.size) pagination.size = Number(newQuery.size)
      
      // 搜索商品
      searchProducts()
    }, { immediate: true })
    
    // 获取商品列表
    const fetchProducts = async () => {
      loading.value = true
      try {
        let response
        
        // 如果有关键词或筛选条件，使用高级搜索
        if (filters.keyword || filters.categoryId !== null || 
            filters.paymentMethod !== null || filters.minPrice !== null || 
            filters.maxPrice !== null) {
          const searchParams = {
            ...filters,
            current: pagination.current,
            size: pagination.size
          }
          response = await productApi.advancedSearchProducts(searchParams)
        } else {
          // 否则使用普通分页查询
          const params = {
            current: pagination.current,
            size: pagination.size
          }
          response = await productApi.getProductList(params)
        }
        
        productList.value = response.data.data.records || []
        total.value = response.data.data.total || 0
      } catch (error) {
        console.error('获取商品列表失败:', error)
        productList.value = []
        total.value = 0
      } finally {
        loading.value = false
      }
    }
    
    // 搜索商品
    const searchProducts = () => {
      // 更新URL查询参数
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
      
      router.replace({ query })
      
      // 获取商品列表
      fetchProducts()
    }
    
    // 处理搜索
    const handleSearch = () => {
      pagination.current = 1 // 重置页码
      searchProducts()
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
      searchProducts()
    }
    
    // 处理每页显示数量变化
    const handleSizeChange = (size) => {
      pagination.size = size
      pagination.current = 1
      searchProducts()
    }
    
    // 处理页码变化
    const handleCurrentChange = (current) => {
      pagination.current = current
      searchProducts()
    }
    
    onMounted(async () => {
      // 获取分类数据
      if (categories.value.length === 0) {
        await store.dispatch('fetchCategories')
      }
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
.product-list-container {
  max-width: 1200px;
  margin: 0 auto;
}

.filter-card {
  margin-bottom: 20px;
}

.price-separator {
  margin: 0 10px;
  color: #606266;
}

.product-card {
  min-height: 500px;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.product-header h3 {
  margin: 0;
}

.product-actions {
  display: flex;
  gap: 10px;
}

.product-grid {
  margin-bottom: 20px;
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