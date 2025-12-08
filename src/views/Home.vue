<template>
  <Layout>
    <div class="home-container">
      <!-- 轮播图 -->
      <el-carousel height="400px" class="banner">
        <el-carousel-item v-for="(item, index) in banners" :key="index">
          <img :src="item.image" :alt="item.title" class="banner-image" />
          <div class="banner-text">
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
          </div>
        </el-carousel-item>
      </el-carousel>

      <!-- 最新公告 -->
      <div class="card-container" v-if="latestNews">
        <div class="section-header">
          <h3>最新公告</h3>
          <el-link type="primary" @click="$router.push('/news')">查看更多</el-link>
        </div>
        <el-card class="news-card" shadow="hover">
          <div class="news-content">
            <h4>{{ latestNews.title }}</h4>
            <p class="news-summary">{{ latestNews.content.substring(0, 100) }}...</p>
            <div class="news-meta">
              <span>{{ formatDate(latestNews.createTime, 'YYYY-MM-DD') }}</span>
              <el-button size="small" type="text" @click="$router.push(`/news/${latestNews.id}`)">
                阅读全文
              </el-button>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 二手物品分类 -->
      <div class="card-container" v-if="categories.length > 0">
        <div class="section-header">
          <h3>二手物品分类</h3>
        </div>
        <div class="category-grid">
          <div
            class="category-item"
            v-for="category in categories"
            :key="category.id"
            @click="goToCategory(category.id)"
          >
            <el-card shadow="hover" class="category-card">
              <div class="category-icon">
                <el-icon size="30"><Goods /></el-icon>
              </div>
              <span class="category-name">{{ category.name }}</span>
            </el-card>
          </div>
        </div>
      </div>

      <!-- 最新二手物品 -->
      <div class="card-container" v-if="latestProducts.length > 0">
        <div class="section-header">
          <h3>最新二手物品</h3>
          <el-link type="primary" @click="$router.push('/products')">查看更多</el-link>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="product in latestProducts" :key="product.id">
            <ProductCard :product="product" />
          </el-col>
        </el-row>
      </div>
    </div>
  </Layout>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Goods } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import ProductCard from '@/components/ProductCard.vue'
import { formatDate } from '@/utils/format'

export default {
  name: 'Home',
  components: {
    Layout,
    ProductCard,
    Goods
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    // 轮播图数据
    const banners = ref([
      {
        title: '欢迎来到跳蚤市场',
        description: '一个让闲置物品重新焕发价值的平台',
        image: 'https://picsum.photos/seed/flea1/1200/400.jpg'
      },
      {
        title: '二手物品交易',
        description: '环保节约，资源共享',
        image: 'https://picsum.photos/seed/flea2/1200/400.jpg'
      },
      {
        title: '让闲置流动起来',
        description: '变废为宝，循环利用',
        image: 'https://picsum.photos/seed/flea3/1200/400.jpg'
      }
    ])
    
    const categories = computed(() => store.state.categories)
    const latestProducts = computed(() => store.state.latestProducts)
    const latestNews = computed(() => store.state.latestNews)
    
    onMounted(async () => {
      // 获取初始数据
      await Promise.all([
        store.dispatch('fetchCategories'),
        store.dispatch('fetchLatestProducts'),
        store.dispatch('fetchLatestNews')
      ])
    })
    
    const goToCategory = (categoryId) => {
      router.push({
        name: 'ProductList',
        query: { categoryId }
      })
    }
    
    return {
      banners,
      categories,
      latestProducts,
      latestNews,
      formatDate,
      goToCategory
    }
  }
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.banner {
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  width: 80%;
}

.banner-text h2 {
  font-size: 36px;
  margin-bottom: 10px;
}

.banner-text p {
  font-size: 18px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 20px;
}

.news-card {
  margin-bottom: 20px;
}

.news-content h4 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.news-summary {
  color: #666;
  margin-bottom: 10px;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 14px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.category-item {
  cursor: pointer;
}

.category-card {
  padding: 20px;
  text-align: center;
  transition: transform 0.3s;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-icon {
  color: #409EFF;
  margin-bottom: 10px;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
}
</style>