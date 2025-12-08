import { request } from './api-client'

export default {
  // 分页获取新闻列表
  getNewsList(params) {
    return request({
      url: '/news/list',
      method: 'get',
      params
    })
  },

  // 获取最新新闻
  getLatestNews() {
    return request({
      url: '/news/latest',
      method: 'get'
    })
  },

  // 获取新闻详情
  getNewsDetail(id) {
    return request({
      url: `/news/${id}`,
      method: 'get'
    })
  },

  // 添加新闻
  addNews(data) {
    return request({
      url: '/news/add',
      method: 'post',
      data
    })
  },

  // 更新新闻
  updateNews(data) {
    return request({
      url: `/news/${data.id}`,
      method: 'put',
      data
    })
  },

  // 删除新闻
  deleteNews(id) {
    return request({
      url: `/news/${id}`,
      method: 'delete'
    })
  }
}