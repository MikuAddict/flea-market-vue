import { request } from './index'

export default {
  // 上传用户头像
  uploadAvatar(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: '/image/upload/avatar',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 上传商品图片
  uploadProductImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: '/image/upload/product',
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
      url: '/image/upload/news',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 上传横幅图片
  uploadBannerImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: '/image/upload/banner',
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
    formData.append('type', type)
    return request({
      url: '/image/upload',
      method: 'post',
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
    formData.append('type', type)
    return request({
      url: '/image/upload/batch',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 删除图片
  deleteImage(imageUrl) {
    return request({
      url: '/image/delete',
      method: 'delete',
      data: { imageUrl }
    })
  },

  // 批量删除图片
  deleteImages(imageUrls) {
    return request({
      url: '/image/delete/batch',
      method: 'delete',
      data: { imageUrls }
    })
  }
}