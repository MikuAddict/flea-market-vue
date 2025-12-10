<template>
  <Layout>
    <div class="unified-page-container fade-in">
      
      <!-- 主要内容区域 -->
      <div class="content-wrapper">
        <!-- 最新公告 -->
        <section class="unified-mb-xl fade-in" v-if="latestNews">
          <div class="unified-flex unified-flex-between unified-mb-lg">
            <h3 class="unified-title-base">最新公告</h3>
            <el-button text type="primary" @click="$router.push('/news')" class="view-more-btn">
              查看更多
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
          <el-card class="unified-card news-card">
            <div class="news-content">
              <h4 class="news-title unified-title-base">{{ latestNews.title }}</h4>
              <p class="news-summary unified-text-secondary">{{ latestNews.content.substring(0, 120) }}...</p>
              <div class="unified-flex unified-flex-between unified-mt-base">
                <div class="unified-flex unified-flex-center unified-gap-sm">
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
        <section class="unified-mb-xl fade-in" v-if="categories.length > 0">
          <h3 class="unified-title-base unified-mb-lg">物品分类</h3>
          <div class="unified-grid unified-grid-4">
            <div
              class="category-item fade-in"
              v-for="(category, index) in categories"
              :key="category.id"
              @click="goToCategory(category.id)"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <el-card class="unified-card category-card unified-flex unified-flex-col unified-flex-center">
                <div class="unified-flex unified-flex-center category-icon">
                  <el-icon :size="40"><component :is="getCategoryIcon(category.id)" /></el-icon>
                </div>
                <h4 class="category-name">{{ category.name }}</h4>
                <p class="category-count">{{ category.productCount}} 件物品</p>
              </el-card>
            </div>
          </div>
        </section>

        <!-- 最新二手物品 -->
        <section class="unified-mb-xl fade-in" v-if="latestProducts.length > 0">
          <div class="unified-flex unified-flex-between unified-mb-lg">
            <h3 class="unified-title-base">最新二手物品</h3>
            <el-button text type="primary" @click="$router.push('/products')" class="view-more-btn">
              查看更多
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
          <div class="unified-grid unified-grid-4">
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
  line-height: var(--leading-relaxed);
}

.news-meta {
  margin-top: var(--spacing-base);
}

/* 分类卡片样式 */
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
  font-weight: var(--font-semibold);
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
  display: flex;
  justify-content: center;
}

.category-count {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  display: flex;
  justify-content: center;
}

/* 产品卡片样式 */
.product-card-wrapper {
  transition: all var(--transition-base);
}

.product-card-wrapper:hover {
  transform: translateY(-4px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-wrapper {
    padding: var(--spacing-base);
  }
  
  .news-card {
    padding: var(--spacing-base);
  }
}

/* 动画延迟效果 */
.fade-in {
  animation: fadeIn var(--transition-slow) ease-out forwards;
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