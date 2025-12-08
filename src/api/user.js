import { request } from './api-client'

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
  updateMyUser(data) {
    return request({
      url: '/user/profile',
      method: 'put',
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

  // 管理员更新用户信息
  updateUser(data) {
    return request({
      url: `/user/${data.id}`,
      method: 'put',
      data
    })
  },

  // 管理员删除用户
  deleteUser(id) {
    return request({
      url: `/user/${id}`,
      method: 'delete'
    })
  },

  // 管理员更新用户状态
  updateUserStatus(id, status) {
    return request({
      url: `/user/${id}/status`,
      method: 'put',
      params: { status }
    })
  },

  // 根据ID获取用户
  getUserById(id) {
    return request({
      url: '/user/get',
      method: 'get',
      params: { id }
    })
  },

  // 根据ID获取用户视图
  getUserVOById(id) {
    return request({
      url: '/user/get/vo',
      method: 'get',
      params: { id }
    })
  },

  // 分页获取用户视图列表
  getUserVoList(params) {
    return request({
      url: '/user/list/page/vo',
      method: 'get',
      params
    })
  }
}