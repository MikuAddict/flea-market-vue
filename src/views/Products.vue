<template>
  <div class="products">
    <div class="products-header">
      <h1>商品列表</h1>
      <div class="filter-section">
        <el-input
          v-model="searchParams.keyword"
          placeholder="搜索商品..."
          style="width: 300px; margin-right: 20px;"
          @keyup.enter="loadProducts"
        >
          <template #append>
            <el-button @click="loadProducts" :icon="Search">搜索</el-button>
          </template>
        </el-input>
        
        <el-select v-model="searchParams.categoryId" placeholder="选择分类" @change="loadProducts" style="width: 200px; margin-right: 20px;">
          <el-option label="全部" value=""></el-option>
          <el-option 
            v-for="category in categories" 
            :key="category.id" 
            :label="category.name" 
            :value="category.id"
          ></el-option>
        </el-select>
        
        <el-select v-model="searchParams.sortField" placeholder="排序方式" @change="loadProducts" style="width: 200px;">
          <el-option label="最新发布" value="createTime"></el-option>
          <el-option label="价格最低" value="price"></el-option>
          <el-option label="价格最高" value="price_desc"></el-option>
          <el-option label="销量最高" value="sales"></el-option>
        </el-select>
      </div>
    </div>

    <div class="products-grid">
      <div 
        v-for="product in products" 
        :key="product.id"
        class="product-card"
        @click="$router.push(`/product/${product.id}`)"
      >
        <div class="product-image">
          <img :src="product.image || '/placeholder-image.png'" :alt="product.name" />
          <div v-if="product.status === 2" class="sold-badge">已售出</div>
        </div>
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-description">{{ product.description }}</p>
          <div class="product-meta">
            <span class="product-price">¥{{ product.price }}</span>
            <span class="product-sales">销量: {{ product.sales || 0 }}</span>
          </div>
          <div class="product-footer">
            <span class="seller-name">{{ product.sellerName }}</span>
            <span class="create-time">{{ formatTime(product.createTime) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-section" v-if="total > 0">
      <el-pagination
        v-model:current-page="searchParams.current"
        v-model:page-size="searchParams.size"
        :page-sizes="[12, 24, 36, 48]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <div v-if="products.length === 0" class="empty-state">
      <el-empty description="暂无商品数据" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import defaultApi from '../api/DefaultApi'
import ApiClient from '../ApiClient'

const route = useRoute()
const api = new DefaultApi(new ApiClient())

const products = ref([])
const categories = ref([])
const total = ref(0)

const searchParams = ref({
  current: 1,
  size: 12,
  keyword: '',
  categoryId: '',
  sortField: 'createTime'
})

onMounted(async () => {
  await loadCategories()
  
  // 从路由参数获取搜索条件
  if (route.query.keyword) {
    searchParams.value.keyword = route.query.keyword
  }
  if (route.query.categoryId) {
    searchParams.value.categoryId = route.query.categoryId
  }
  
  await loadProducts()
})

const loadCategories = async () => {
  try {
    const response = await api.listCategoryUsingGET()
    if (response.code === 200) {
      categories.value = response.data || []
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

const loadProducts = async () => {
  try {
    const params = { ...searchParams.value }
    
    // 处理排序参数
    if (params.sortField === 'price_desc') {
      params.sortField = 'price'
      params.sortOrder = 'desc'
    } else if (params.sortField === 'price') {
      params.sortOrder = 'asc'
    } else {
      params.sortOrder = 'desc'
    }

    const response = await api.listProductUsingGET(params)
    if (response.code === 200) {
      products.value = response.data.records || []
      total.value = response.data.total || 0
    } else {
      ElMessage.error('加载商品失败')
    }
  } catch (error) {
    console.error('加载商品失败:', error)
    ElMessage.error('加载商品失败')
  }
}

const handleSizeChange = (size) => {
  searchParams.value.size = size
  searchParams.value.current = 1
  loadProducts()
}

const handleCurrentChange = (current) => {
  searchParams.value.current = current
  loadProducts()
}

const formatTime = (timeString) => {
  if (!timeString) return ''
  return new Date(timeString).toLocaleDateString()
}

// 监听路由参数变化
watch(() => route.query, (newQuery) => {
  if (newQuery.keyword !== searchParams.value.keyword) {
    searchParams.value.keyword = newQuery.keyword || ''
    searchParams.value.current = 1
    loadProducts()
  }
  if (newQuery.categoryId !== searchParams.value.categoryId) {
    searchParams.value.categoryId = newQuery.categoryId || ''
    searchParams.value.current = 1
    loadProducts()
  }
})
</script>

<style scoped>
.products {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.products-header {
  margin-bottom: 30px;
}

.products-header h1 {
  margin-bottom: 20px;
  color: #303133;
}

.filter-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sold-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.product-info {
  padding: 16px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-description {
  color: #606266;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 12px;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.product-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.product-sales {
  font-size: 12px;
  color: #909399;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #909399;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}
</style>