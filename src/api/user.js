import { request } from './index'

export default {
  // 用户注册
  register(data) {
    return request({
      url: '/user/register',
      method: 'post',
      data
    })
  },

  // 用户登录
  login(data) {
    return request({
      url: '/user/login',
      method: 'post',
      data
    })
  },

  // 用户登出
  logout() {
    return request({
      url: '/user/logout',
      method: 'post'
    })
  },

  // 获取当前登录用户
  getCurrentUser() {
    return request({
      url: '/user/get/login',
      method: 'get'
    })
  },

  // 更新个人信息
  updateProfile(data) {
    return request({
      url: '/user/update/my',
      method: 'post',
      data
    })
  },

  // 管理员创建用户
  addUser(data) {
    return request({
      url: '/user/add',
      method: 'post',
      data
    })
  },

  // 管理员删除用户
  deleteUser(id) {
    return request({
      url: '/user/delete',
      method: 'post',
      data: { id }
    })
  },

  // 管理员更新用户
  updateUser(data) {
    return request({
      url: '/user/update',
      method: 'post',
      data
    })
  },

  // 管理员根据ID获取用户
  getUserById(id) {
    return request({
      url: '/user/get',
      method: 'get',
      params: { id }
    })
  },

  // 根据ID获取用户视图
  getUserVoById(id) {
    return request({
      url: '/user/get/vo',
      method: 'get',
      params: { id }
    })
  },

  // 分页获取用户列表（管理员）
  getUserList(params) {
    return request({
      url: '/user/list/page',
      method: 'post',
      data: params
    })
  },

  // 分页获取用户视图列表
  getUserVoList(params) {
    return request({
      url: '/user/list/page/vo',
      method: 'get',
      params
    })
  },

  // 管理员审核用户
  auditUser(data) {
    return request({
      url: '/user/admin/audit',
      method: 'post',
      data
    })
  },

  // 获取待审核用户列表（管理员）
  getPendingUsers(params) {
    return request({
      url: '/user/admin/pending',
      method: 'get',
      params
    })
  },

  // 获取已拒绝用户数量（管理员）
  getRejectedUsersCount() {
    return request({
      url: '/user/admin/rejected/count',
      method: 'get'
    })
  },

  // 批量删除已拒绝用户（管理员）
  deleteRejectedUsers(data) {
    return request({
      url: '/user/admin/rejected/delete-all',
      method: 'post',
      data
    })
  }
}