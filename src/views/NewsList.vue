<template>
  <Layout>
    <div class="news-list-container">
      <el-card class="news-card">
        <template #header>
          <span>新闻公告</span>
        </template>
        
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="5" animated />
        </div>
        
        <div v-else-if="newsList.length === 0" class="empty-container">
          <el-empty description="暂无新闻" />
        </div>
        
        <div v-else class="news-timeline">
          <el-timeline>
            <el-timeline-item
              v-for="news in newsList"
              :key="news.id"
              :timestamp="formatDate(news.createTime)"
              placement="top"
              @click="navigateToDetail(news.id)"
            >
              <el-card shadow="hover" class="news-item">
                <div class="news-header">
                  <h3>{{ news.title }}</h3>
                </div>

                <div class="news-content">
                  <p>{{ news.content.substring(0, 200) }}...</p>
                </div>
                <div class="news-footer">
                  <span class="news-author">作者: {{ news.authorName }}</span>
                  <el-button type="text" @click.stop="navigateToDetail(news.id)">
                    阅读全文
                  </el-button>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        
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
.news-list-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.loading-container, .empty-container {
  padding: 40px 0;
}

.news-timeline {
  margin-bottom: 20px;
}

.news-item {
  cursor: pointer;
  transition: transform 0.3s;
  margin-bottom: 15px;
}

.news-item:hover {
  transform: translateY(-5px);
}

.news-header h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #303133;
}

.news-content {
  margin-bottom: 15px;
}

.news-content p {
  margin: 0;
  color: #606266;
  line-height: 1.6;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #909399;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>