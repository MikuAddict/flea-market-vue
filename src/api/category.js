import { request } from './api-client'

export default {
  // 获取所有二手物品分类
  getCategoryList() {
    return request({
      url: '/category/list',
      method: 'get'
    })
  },

  // 添加二手物品分类（管理员）
  addCategory(data) {
    return request({
      url: '/category/add',
      method: 'post',
      data
    })
  },

  // 更新二手物品分类（管理员）
  updateCategory(data) {
    return request({
      url: '/category/update',
      method: 'put',
      data
    })
  },

  // 删除二手物品分类（管理员）
  deleteCategory(id) {
    return request({
      url: `/category/delete/${id}`,
      method: 'delete'
    })
  }
}