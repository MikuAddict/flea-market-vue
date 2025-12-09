<template>
  <Layout>
    <div class="news-detail-container" v-if="!loading && news">
      <el-card class="news-card">
        <div class="news-header">
          <h1>{{ news.title }}</h1>
          <div class="news-meta">
            <span class="news-author">作者: {{ news.author }}</span>
            <span class="news-date">{{ formatDate(news.createTime) }}</span>
          </div>
        </div>
        
        <div class="news-content">
          <div v-html="formatContent(news.content)"></div>
        </div>
        
        <div class="news-actions">
          <el-button @click="$router.go(-1)">返回</el-button>
          <el-button type="primary" @click="$router.push('/news')">新闻列表</el-button>
        </div>
      </el-card>
    </div>
    
    <div v-else class="loading-container">
      <el-skeleton animated />
    </div>
  </Layout>
</template>

<script>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import Layout from '@/components/Layout.vue'
import newsApi from '@/api/news'
import { formatDate } from '@/utils/format'
import { useSingleDataFetch } from '@/composables/useDataFetch'
import { useNavigation } from '@/composables/useEventHandlers'

export default {
  name: 'NewsDetail',
  components: {
    Layout
  },
  setup() {
    const route = useRoute()
    
    // 使用单条数据获取组合函数
    const {
      loading,
      data: news,
      fetchData: fetchNewsDetail
    } = useSingleDataFetch({
      apiFunction: newsApi.getNewsDetail,
      errorMessage: '新闻不存在或已被删除'
    })
    
    // 使用导航组合函数
    const { navigateTo } = useNavigation({
      basePath: '/'
    })
    
    // 格式化内容，将换行符转换为HTML换行标签
    const formatContent = (content) => {
      if (!content) return ''
      return content.replace(/\n/g, '<br>')
    }
    
    // 监听路由参数变化
    watch(() => route.params.id, (newId) => {
      if (newId) {
        // 直接传递字符串，保持精度
        fetchNewsDetail(newId).catch(() => {
          // 错误处理已在组合函数中处理
          navigateTo('/news')
        })
      }
    }, { immediate: true })
    
    return {
      loading,
      news,
      formatDate,
      formatContent
    }
  }
}
</script>

<style scoped>
.news-detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.news-header {
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.news-header h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
  color: #303133;
}

.news-meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  color: #909399;
  font-size: 14px;
}

.news-content {
  margin-bottom: 30px;
  line-height: 1.8;
  font-size: 16px;
  color: #606266;
}

.news-actions {
  text-align: center;
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--border-light);
}

.loading-container {
  padding: var(--spacing-xl);
}
</style>