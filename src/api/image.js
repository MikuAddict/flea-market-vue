import { request } from './api-client'

export default {
  // 上传用户头像
  uploadAvatar(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: '/image/avatar',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 上传二手物品图片
  uploadProductImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: '/image/product',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 上传新闻配图
  uploadNewsImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: '/image/news',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 通用图片上传
  uploadImage(file, type) {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: '/image',
      method: 'post',
      params: { type },
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 批量上传图片
  uploadImages(files, type) {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    return request({
      url: '/image/batch',
      method: 'post',
      params: { type },
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 删除图片
  deleteImage(imageUrl) {
    return request({
      url: '/image',
      method: 'delete',
      params: { imageUrl }
    })
  },

  // 批量删除图片
  deleteImages(imageUrls) {
    return request({
      url: '/image/batch',
      method: 'delete',
      params: { imageUrls }
    })
  }
}