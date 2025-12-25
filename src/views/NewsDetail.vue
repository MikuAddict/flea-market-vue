<template>
  <Layout>
    <div class="news-detail-container unified-page-container unified-max-width-900 unified-p-xl" v-if="!loading && news">
      <el-card class="unified-card">
        <div class="news-header unified-text-center unified-mb-lg unified-pb-sm unified-border-b">
          <h1 class="unified-title-xxl unified-mb-sm">{{ news.title }}</h1>
          <div class="news-meta unified-flex unified-justify-center unified-gap-lg unified-text-sm unified-text-secondary">
            <span class="news-author">作者: {{ news.author }}</span>
            <span class="news-date">{{ formatDate(news.createTime) }}</span>
          </div>
        </div>
        
        <div class="news-content unified-mb-xl">
          <div v-html="formatContent(news.content)" class="unified-line-height-1_8 unified-text-md"></div>
        </div>
        
        <div class="news-actions unified-text-center unified-pt-xl unified-border-t">
          <el-button @click="$router.go(-1)">返回</el-button>
          <el-button type="primary" @click="$router.push('/news')">新闻列表</el-button>
        </div>
      </el-card>
    </div>
    
    <div v-else class="loading-container unified-p-xl">
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
.news-header {
  border-bottom: 1px solid #ebeef5;
}

.news-content {
  /* 确保内容自动换行，避免横向滚动 */
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  
  /* 允许内容自然垂直滚动 */
  overflow-y: auto;
  max-height: none;
  
  /* 确保内联元素不会破坏布局 */
  max-width: 100%;
}

.news-content >>> div {
  /* 确保富文本内容也能正确换行 */
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  max-width: 100%;
}

.news-actions {
  border-top: 1px solid var(--border-light);
}
</style>