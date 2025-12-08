<template>
  <Layout>
    <div class="unified-page-container fade-in">
      <!-- 轮播图 -->
      <div class="banner-section">
        <el-carousel height="400px" class="unified-carousel">
          <el-carousel-item v-for="(item, index) in banners" :key="index">
            <div class="banner-container">
              <img :src="item.image" :alt="item.title" class="banner-image" />
              <div class="banner-overlay"></div>
              <div class="banner-content unified-flex unified-flex-col unified-flex-center">
                <h2 class="banner-title unified-title-xl">{{ item.title }}</h2>
                <p class="banner-desc unified-text-secondary">{{ item.description }}</p>
                <div class="banner-actions">
                  <el-button type="primary" class="unified-button primary-btn" @click="goToProducts">
                    浏览二手物品
                  </el-button>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 主要内容区域 -->
      <div class="content-wrapper">
        <!-- 最新公告 -->
        <section class="section-container fade-in" v-if="latestNews">
          <div class="section-header unified-flex unified-flex-between">
            <h3 class="section-title unified-title-base">最新公告</h3>
            <el-button text type="primary" @click="$router.push('/news')" class="view-more-btn">
              查看更多
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
          <el-card class="unified-card news-card">
            <div class="news-content">
              <h4 class="news-title unified-title-base">{{ latestNews.title }}</h4>
              <p class="news-summary unified-text-secondary">{{ latestNews.content.substring(0, 120) }}...</p>
              <div class="unified-meta news-meta">
                <div class="unified-meta-item">
                  <el-icon><Calendar /></el-icon>
                  <span>{{ formatDate(latestNews.createTime, 'YYYY-MM-DD') }}</span>
                </div>
                <el-button type="primary" class="unified-button unified-button-outline" @click="$router.push(`/news/${latestNews.id}`)">
                  阅读全文
                </el-button>
              </div>
            </div>
          </el-card>
        </section>

        <!-- 二手物品分类 -->
        <section class="section-container fade-in" v-if="categories.length > 0">
          <div class="section-header">
            <h3 class="section-title unified-title-base">物品分类</h3>
          </div>
          <div class="category-grid unified-grid unified-grid-4">
            <div
              class="category-item fade-in"
              v-for="(category, index) in categories"
              :key="category.id"
              @click="goToCategory(category.id)"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <el-card class="unified-card category-card unified-flex unified-flex-col unified-flex-center">
                <div class="category-icon unified-flex unified-flex-center">
                  <el-icon :size="40"><component :is="getCategoryIcon(category.id)" /></el-icon>
                </div>
                <h4 class="category-name">{{ category.name }}</h4>
                <p class="category-count">{{ category.count || 0 }} 件物品</p>
              </el-card>
            </div>
          </div>
        </section>

        <!-- 最新二手物品 -->
        <section class="section-container fade-in" v-if="latestProducts.length > 0">
          <div class="section-header unified-flex unified-flex-between">
            <h3 class="section-title unified-title-base">最新二手物品</h3>
            <el-button text type="primary" @click="$router.push('/products')" class="view-more-btn">
              查看更多
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
          <div class="products-grid unified-grid unified-grid-4">
            <div 
              class="product-card-wrapper fade-in" 
              v-for="(product, index) in latestProducts" 
              :key="product.id"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <ProductCard :product="product" />
            </div>
          </div>
        </section>
      </div>
    </div>
  </Layout>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { 
  Goods, 
  ArrowRight, 
  Calendar
} from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import ProductCard from '@/components/ProductCard.vue'
import { formatDate } from '@/utils/format'

export default {
  name: 'Home',
  components: {
    Layout,
    ProductCard,
    Goods,
    ArrowRight,
    Calendar
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    // 轮播图数据
    const banners = ref([
      {
        title: '欢迎来到校园跳蚤市场',
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
    
    const goToProducts = () => {
      router.push('/products')
    }
    
    // 获取分类图标
    const getCategoryIcon = (categoryId) => {
      // 目前只使用Goods图标，后续可以扩展
      return Goods
    }
    
    return {
      banners,
      categories,
      latestProducts,
      latestNews,
      formatDate,
      goToCategory,
      goToProducts,
      getCategoryIcon
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

/* 轮播图样式 */
.banner-section {
  margin-bottom: var(--spacing-xxl);
  border-radius: var(--border-radius-base);
  overflow: hidden;
}

.unified-carousel {
  border-radius: var(--border-radius-base);
  box-shadow: var(--shadow-base);
}

.banner-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%);
}

.banner-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: white;
  text-align: center;
  padding: 0 20px;
}

.banner-title {
  color: white;
  margin-bottom: var(--spacing-base);
  font-weight: 600;
}

.banner-desc {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--spacing-xl);
  font-size: var(--font-size-lg);
}

.banner-actions .primary-btn {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  padding: var(--spacing-sm) var(--spacing-xl);
  font-weight: 500;
  border: none;
  box-shadow: var(--shadow-base);
}

/* 内容区域样式 */
.content-wrapper {
  background-color: var(--bg-white);
  border-radius: var(--border-radius-base);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-light);
}

/* 查看更多按钮 */
.view-more-btn {
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.view-more-btn:hover {
  transform: translateX(2px);
}

/* 新闻卡片样式 */
.news-card {
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-base);
  transition: all var(--transition-base);
}

.news-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.news-title {
  margin-bottom: var(--spacing-base);
  color: var(--text-primary);
}

.news-summary {
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
}

.news-meta {
  margin-top: var(--spacing-base);
}

/* 分类网格样式 */
.category-grid {
  gap: var(--spacing-lg);
}

.category-item {
  cursor: pointer;
  transition: all var(--transition-base);
}

.category-item:hover {
  transform: translateY(-4px);
}

.category-card {
  padding: var(--spacing-lg);
  height: 100%;
  border-radius: var(--border-radius-base);
  transition: all var(--transition-base);
  background: linear-gradient(to bottom, var(--bg-white), var(--bg-lighter));
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.category-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-base);
  background-color: rgba(64, 158, 255, 0.1);
  border-radius: 50%;
  color: var(--primary-color);
  transition: all var(--transition-base);
}

.category-item:hover .category-icon {
  background-color: var(--primary-color);
  color: white;
}

.category-name {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
}

.category-count {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* 产品网格样式 */
.products-grid {
  gap: var(--spacing-lg);
}

.product-card-wrapper {
  transition: all var(--transition-base);
}

.product-card-wrapper:hover {
  transform: translateY(-4px);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .unified-page-container {
    padding: var(--spacing-lg);
  }
  
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .unified-page-container {
    padding: var(--spacing-base);
  }
  
  .category-grid,
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .banner-content {
    padding: 0 var(--spacing-base);
  }
  
  .banner-title {
    font-size: var(--font-size-xl);
  }
  
  .banner-desc {
    font-size: var(--font-size-base);
  }
}

@media (max-width: 480px) {
  .category-grid,
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .content-wrapper {
    padding: var(--spacing-base);
  }
  
  .news-card {
    padding: var(--spacing-base);
  }
}

/* 动画延迟效果 */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

.fade-in-delay-1 {
  animation-delay: 0.1s;
}

.fade-in-delay-2 {
  animation-delay: 0.2s;
}

.fade-in-delay-3 {
  animation-delay: 0.3s;
}
</style>