<template>
  <Layout>
    <div class="news-list-container unified-page-container unified-max-width-1000 unified-p-xl">
      <el-card class="unified-card">
        <template #header>
          <span class="unified-title-lg">新闻公告</span>
        </template>
        
        <div v-if="loading" class="loading-container unified-p-xl">
          <el-skeleton :rows="5" animated />
        </div>
        
        <div v-else-if="newsList.length === 0" class="empty-container unified-p-xl">
          <el-empty description="暂无新闻" />
        </div>
        
        <div v-else class="news-timeline unified-mb-lg">
          <el-timeline>
            <el-timeline-item
              v-for="news in newsList"
              :key="news.id"
              :timestamp="formatDate(news.createTime)"
              placement="top"
              @click="navigateToDetail(news.id)"
            >
              <el-card shadow="hover" class="news-item unified-card unified-hover-lift unified-cursor-pointer">
                <div class="news-header">
                  <h3 class="unified-title-md unified-mb-sm">{{ news.title }}</h3>
                </div>

                <div class="news-content unified-mb-sm">
                  <p class="unified-text-regular unified-line-height-1_6">{{ news.content.substring(0, 200) }}...</p>
                </div>
                <div class="news-footer unified-flex unified-flex-between unified-flex-center">
                  <span class="news-author unified-text-sm unified-text-secondary">作者: {{ news.authorName }}</span>
                  <el-button type="text" @click.stop="navigateToDetail(news.id)">
                    阅读全文
                  </el-button>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        
        <!-- 分页 -->
        <div v-if="total > 0" class="pagination-container unified-flex unified-justify-center unified-mt-lg">
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
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Layout from '@/components/Layout.vue'
import newsApi from '@/api/news'
import { formatDate } from '@/utils/format'
import { useDataFetchWithIdPrecision } from '@/composables/useDataFetch'
import { useNavigation } from '@/composables/useEventHandlers'

export default {
  name: 'NewsList',
  components: {
    Layout
  },
  setup() {
    // 使用通用数据获取组合函数
    const {
      loading,
      data: newsList,
      total,
      pagination,
      fetchData: fetchNewsList,
      handleCurrentChange,
      handleSizeChange
    } = useDataFetchWithIdPrecision({
      apiFunction: newsApi.getNewsList,
      idFields: ['id']
    })
    
    // 使用导航组合函数
    const { navigateToDetail } = useNavigation({
      basePath: '/news/'
    })
    
    // 重置获取新闻列表，使其在挂载时自动获取
    onMounted(() => {
      fetchNewsList()
    })
    
    return {
      loading,
      newsList,
      total,
      pagination,
      formatDate,
      navigateToDetail,
      fetchNewsList,
      handleCurrentChange,
      handleSizeChange
    }
  }
}
</script>

<style scoped>
.news-item {
  margin-bottom: 15px;
}
</style>