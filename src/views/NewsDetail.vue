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
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Layout from '@/components/Layout.vue'
import newsApi from '@/api/news'
import { formatDate } from '@/utils/format'
import { formatIdForApi } from '@/utils/numberPrecision'

export default {
  name: 'NewsDetail',
  components: {
    Layout
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    // 响应式数据
    const loading = ref(true)
    const news = ref(null)
    
    // 获取新闻详情
    const fetchNewsDetail = async (newsId) => {
      try {
        loading.value = true
        // 使用精度处理函数，确保大数字ID的准确性
        const formattedId = formatIdForApi(newsId)
        const response = await newsApi.getNewsDetail(formattedId)
        news.value = response.data.data
      } catch (error) {
        console.error('获取新闻详情失败:', error)
        ElMessage.error('新闻不存在或已被删除')
        router.push('/news')
      } finally {
        loading.value = false
      }
    }
    
    // 格式化内容，将换行符转换为HTML换行标签
    const formatContent = (content) => {
      if (!content) return ''
      return content.replace(/\n/g, '<br>')
    }
    
    // 监听路由参数变化
    watch(() => route.params.id, (newId) => {
      if (newId) {
        // 不使用parseInt，直接传递字符串，保持精度
        fetchNewsDetail(newId)
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
  padding: 20px;
}

.news-card {
  padding: 20px;
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
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.loading-container {
  padding: 20px;
}
</style>