import request from './index'

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
  getNewsById(id) {
    return request({
      url: `/news/detail/${id}`,
      method: 'get'
    })
  },

  // 添加新闻（管理员）
  addNews(data) {
    return request({
      url: '/news/add',
      method: 'post',
      data
    })
  },

  // 更新新闻（管理员）
  updateNews(data) {
    return request({
      url: '/news/update',
      method: 'put',
      data
    })
  },

  // 删除新闻（管理员）
  deleteNews(id) {
    return request({
      url: `/news/delete/${id}`,
      method: 'delete'
    })
  }
}