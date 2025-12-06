<template>
  <div class="home">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索商品..."
          size="large"
          class="search-input"
        >
          <template #append>
            <el-button @click="handleSearch" :icon="Search">搜索</el-button>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 分类区域 -->
    <div class="category-section">
      <h2>商品分类</h2>
      <div class="category-list">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          @click="handleCategoryClick(category.id)"
        >
          <div class="category-icon">
            <el-icon><Goods /></el-icon>
          </div>
          <span>{{ category.name }}</span>
        </div>
      </div>
    </div>

    <!-- 热门商品 -->
    <div class="hot-products-section">
      <h2>热门商品</h2>
      <div class="products-grid">
        <div 
          v-for="product in hotProducts" 
          :key="product.id"
          class="product-card"
          @click="$router.push(`/product/${product.id}`)"
        >
          <div class="product-image">
            <img :src="product.image || '/placeholder-image.png'" :alt="product.name" />
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-price">¥{{ product.price }}</p>
            <p class="product-seller">{{ product.sellerName }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 最新动态 -->
    <div class="news-section">
      <h2>最新动态</h2>
      <div class="news-list">
        <div 
          v-for="news in newsList" 
          :key="news.id"
          class="news-item"
        >
          <h3>{{ news.title }}</h3>
          <p>{{ news.content }}</p>
          <span class="news-time">{{ formatTime(news.createTime) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Goods } from '@element-plus/icons-vue'
import defaultApi from '../api/DefaultApi'

const router = useRouter()

const searchKeyword = ref('')
const categories = ref([])
const hotProducts = ref([])
const newsList = ref([])

onMounted(async () => {
  await loadCategories()
  await loadHotProducts()
  await loadNews()
})

const loadCategories = async () => {
  try {
    const response = await defaultApi.getCategories()
    if (response.code === 200) {
      categories.value = response.data || []
    }
  } catch (error) {
    console.error('加载分类失败:', error)
    ElMessage.error('加载分类失败')
  }
}

const loadHotProducts = async () => {
  try {
    const response = await defaultApi.getHotProducts()
    if (response.code === 200) {
      hotProducts.value = response.data || []
    }
  } catch (error) {
    console.error('加载热门商品失败:', error)
    ElMessage.error('加载热门商品失败')
  }
}

const loadNews = async () => {
  try {
    const response = await defaultApi.getNews()
    if (response.code === 200) {
      newsList.value = response.data || []
    }
  } catch (error) {
    console.error('加载新闻失败:', error)
    ElMessage.error('加载新闻失败')
  }
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/products?keyword=${encodeURIComponent(searchKeyword.value)}`)
  }
}

const handleCategoryClick = (categoryId) => {
  router.push(`/products?categoryId=${categoryId}`)
}

const formatTime = (timeString) => {
  if (!timeString) return ''
  return new Date(timeString).toLocaleDateString()
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 0;
  margin-bottom: 40px;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-input {
  width: 100%;
}

.category-section {
  margin-bottom: 40px;
}

.category-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover {
  background: #e4e7ed;
  transform: translateY(-2px);
}

.category-icon {
  font-size: 24px;
  color: #409eff;
  margin-bottom: 10px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 12px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #303133;
}

.product-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
  margin-bottom: 8px;
}

.product-seller {
  font-size: 12px;
  color: #909399;
}

.news-section {
  margin-top: 40px;
}

.news-list {
  margin-top: 20px;
}

.news-item {
  background: white;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.news-item h3 {
  margin: 0 0 8px 0;
  color: #303133;
}

.news-item p {
  margin: 0 0 8px 0;
  color: #606266;
  line-height: 1.5;
}

.news-time {
  font-size: 12px;
  color: #909399;
}
</style>