<template>
  <Layout>
    <div class="publish-container">
      <el-card class="publish-card">
        <template #header>
          <div class="card-header">
            <span>{{ isEdit ? '编辑二手物品' : '发布二手物品' }}</span>
          </div>
        </template>
        
        <el-form
          :model="productForm"
          :rules="productRules"
          ref="productFormRef"
          label-width="100px"
          @submit.prevent="handleSubmit"
        >
          <el-form-item label="二手物品名称" prop="productName">
            <el-input
              v-model="productForm.productName"
              placeholder="请输入二手物品名称"
            />
          </el-form-item>
          
          <el-form-item label="二手物品分类" prop="categoryId">
            <el-select
              v-model="productForm.categoryId"
              placeholder="请选择二手物品分类"
              style="width: 100%"
            >
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="价格" prop="price">
            <el-input-number
              v-model="productForm.price"
              :precision="2"
              :min="0"
              :step="0.01"
              placeholder="请输入价格"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="支付方式" prop="paymentMethod">
            <el-select
              v-model="productForm.paymentMethod"
              placeholder="请选择支付方式"
              style="width: 100%"
            >
              <el-option label="现金支付" :value="0" />
              <el-option label="微信支付" :value="1" />
              <el-option label="积分兑换" :value="2" />
              <el-option label="二手物品交换" :value="3" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="二手物品描述" prop="description">
            <el-input
              v-model="productForm.description"
              type="textarea"
              :rows="6"
              placeholder="请详细描述您的二手物品信息"
            />
          </el-form-item>
          
          <el-form-item label="二手物品图片" prop="imageUrls">
            <div class="multi-image-uploader">
              <!-- 已上传图片列表 -->
              <div class="uploaded-images">
                <div 
                  v-for="(image, index) in tempImages" 
                  :key="index"
                  class="image-item"
                  :class="{ 'main-image': index === 0 }"
                >
                  <img :src="image.url" :alt="`图片${index + 1}`" />
                  <div class="image-actions">
                    <el-button 
                      v-if="index > 0"
                      size="small" 
                      type="primary" 
                      circle
                      @click.stop="setAsMainImage(index)"
                      title="设为主图"
                    >
                      <el-icon><Star /></el-icon>
                    </el-button>
                    <el-button 
                      size="small" 
                      type="danger" 
                      circle
                      @click.stop="removeImage(index)"
                      title="删除图片"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                  <div v-if="index === 0" class="main-image-badge">主图</div>
                </div>
              </div>
              
              <!-- 上传按钮 -->
              <el-upload
                v-if="tempImages.length < 5"
                class="image-uploader"
                action=""
                :show-file-list="false"
                :auto-upload="false"
                :on-change="handleImageChange"
                :multiple="true"
                :before-upload="beforeImageUpload"
              >
                <div class="upload-area">
                  <el-icon class="image-uploader-icon"><Plus /></el-icon>
                </div>
              </el-upload>
            </div>
            <div class="upload-info">
              <p>• 支持jpg、png格式，大小不超过2MB</p>
              <p>• 最多可上传5张图片，第一张将自动设为主图</p>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" :loading="submitting" @click="handleSubmit">
              {{ isEdit ? '保存修改' : '发布二手物品' }}
            </el-button>
            <el-button @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </Layout>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Star, Delete } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import { request } from '@/api/api-client'
import { productApi } from '@/api'

export default {
  name: 'PublishProduct',
  components: {
    Layout,
    Plus
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    
    // 表单引用
    const productFormRef = ref(null)
    
    // 响应式数据
    const submitting = ref(false)
    const isEdit = ref(false)
    
    // 临时图片存储（本地文件对象）
    const tempImages = ref([])
    
    // 表单数据
    const productForm = reactive({
      productName: '',
      categoryId: null,
      price: 0,
      paymentMethod: 0,
      description: '',
      imageUrls: [] // 仅显示用，实际存储在tempImages中
    })
    
    // 表单验证规则
    const productRules = {
      productName: [
        { required: true, message: '请输入二手物品名称', trigger: 'blur' },
        { min: 2, max: 50, message: '二手物品名称长度在2到50个字符', trigger: 'blur' }
      ],
      categoryId: [
        { required: true, message: '请选择二手物品分类', trigger: 'change' }
      ],
      price: [
        { required: true, message: '请输入二手物品价格', trigger: 'blur' },
        { type: 'number', min: 0, message: '价格不能为负数', trigger: 'blur' }
      ],
      paymentMethod: [
        { required: true, message: '请选择支付方式', trigger: 'change' }
      ],
      description: [
        { max: 500, message: '描述不能超过500个字符', trigger: 'blur' }
      ]
    }
    
        // 计算属性
    const categories = computed(() => store.state.categories)
    const uploadUrl = '/image/product'
    const uploadHeaders = computed(() => {
      const token = store.state.token || localStorage.getItem('token')
      return token ? {
        Authorization: `Bearer ${token}`
      } : {}
    })
    
    // 获取二手物品详情（编辑模式）
    const fetchProductDetail = async (productId) => {
      try {
        const response = await productApi.getProductById(productId)
        const product = response.data.data
        
        // 填充表单
        Object.keys(productForm).forEach(key => {
          if (product[key] !== undefined) {
            if (key === 'imageUrls' && product[key]) {
              // 处理图片URL，将逗号分隔的字符串转换为数组
              const imageUrls = product[key].split(',').filter(url => url.trim())
              
              // 填充临时图片数据（编辑模式下已有正式URL）
              tempImages.value = imageUrls.map(url => ({
                url,
                file: null, // 编辑模式下没有文件对象
                isExisting: true // 标记为已存在的图片
              }))
              
              productForm[key] = imageUrls
            } else {
              productForm[key] = product[key]
            }
          }
        })
      } catch (error) {
        console.error('获取二手物品详情失败:', error)
        ElMessage.error('获取二手物品信息失败')
        router.push('/my-products')
      }
    }
    
    // 提交表单
    const handleSubmit = async () => {
      if (!productFormRef.value) return
      
      try {
        await productFormRef.value.validate()
        
        // 检查图片
        if (tempImages.value.length === 0) {
          ElMessage.warning('请至少上传一张图片')
          return
        }
        
        submitting.value = true
        
        // 上传图片
        const imageUrls = []
        
        for (const image of tempImages.value) {
          if (image.isExisting) {
            // 已存在的图片（编辑模式）
            imageUrls.push(image.url)
          } else {
            // 新上传的图片
            try {
              const formData = new FormData()
              formData.append('files', image.file)
              
              const uploadResponse = await request({
                url: '/image/product',
                method: 'post',
                data: formData,
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${store.state.token || localStorage.getItem('token')}`
                }
              })
              
              if (uploadResponse.data.code === 200) {
                // 根据OpenAPI文档，返回的是BaseResponseObject，需要根据实际响应结构调整
                const responseData = uploadResponse.data.data
                
                // 尝试不同的响应格式处理
                if (responseData.originalUrl) {
                  imageUrls.push(responseData.originalUrl)
                } else if (responseData.url) {
                  imageUrls.push(responseData.url)
                } else if (Array.isArray(responseData) && responseData.length > 0) {
                  // 如果是数组格式，取第一个
                  const firstImage = responseData[0]
                  imageUrls.push(firstImage.originalUrl || firstImage.url || responseData)
                } else {
                  // 直接使用返回的数据
                  imageUrls.push(responseData)
                }
              } else {
                throw new Error(uploadResponse.data.message || '图片上传失败')
              }
            } catch (uploadError) {
              console.error('图片上传失败:', uploadError)
              ElMessage.error(`上传图片失败: ${uploadError.message}`)
              throw uploadError
            }
          }
        }
        
        // 准备提交数据
        const submitData = {
          ...productForm,
          // 保持图片数组格式，后端期望JSON数组
          imageUrls: imageUrls,
          // 设置主图为第一张图片
          mainImageUrl: imageUrls[0]
        }
        
        let response
        
        if (isEdit.value) {
          // 编辑二手物品
          response = await productApi.updateProduct({
            ...submitData,
            id: route.params.id
          })
        } else {
          // 发布新二手物品
          response = await productApi.addProduct(submitData)
        }
        
        if (response.data.code === 200) {
          ElMessage.success(isEdit.value ? '二手物品修改成功' : '二手物品发布成功')
          clearTempImages() // 成功后清理临时图片
          router.push('/my-products')
        }
      } catch (error) {
        console.error('发布二手物品失败:', error)
        ElMessage.error(error.response?.data?.message || '操作失败，请稍后再试')
      } finally {
        submitting.value = false
      }
    }
    
    // 取消操作
    const handleCancel = () => {
      clearTempImages() // 取消时清理临时图片
      router.push('/my-products')
    }
    
    // 清理临时图片
    const clearTempImages = () => {
      tempImages.value = []
      productForm.imageUrls = []
    }
    
    // 图片选择（本地临时存储）
    const handleImageChange = (file) => {
      // 验证文件
      if (!beforeImageUpload(file.raw)) {
        return false
      }
      
      // 创建本地预览URL
      const url = URL.createObjectURL(file.raw)
      
      // 添加到临时图片数组
      tempImages.value.push({
        url,
        file: file.raw,
        isExisting: false
      })
      
      return false // 阻止自动上传
    }
    
    // 删除图片
    const removeImage = (index) => {
      // 释放URL对象
      if (!tempImages.value[index].isExisting) {
        URL.revokeObjectURL(tempImages.value[index].url)
      }
      
      tempImages.value.splice(index, 1)
      ElMessage.success('图片已删除')
    }
    
    // 设置主图
    const setAsMainImage = (index) => {
      if (index > 0 && index < tempImages.value.length) {
        const mainImage = tempImages.value[index]
        tempImages.value.splice(index, 1)
        tempImages.value.unshift(mainImage)
        ElMessage.success('已设为主图')
      }
    }
    
    // 图片上传前验证
    const beforeImageUpload = (file) => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isJPG) {
        ElMessage.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        ElMessage.error('上传图片大小不能超过 2MB!')
      }
      
      return isJPG && isLt2M
    }
    
    onMounted(async () => {
      // 检查是否是编辑模式
      if (route.name === 'EditProduct' && route.params.id) {
        isEdit.value = true
        
        // 获取二手物品详情
        await fetchProductDetail(route.params.id)
      }
      
      // 获取分类数据
      if (categories.value.length === 0) {
        await store.dispatch('fetchCategories')
      }
    })
    
    return {
      productForm,
      productRules,
      productFormRef,
      submitting,
      isEdit,
      tempImages,
      categories,
      uploadUrl,
      uploadHeaders,
      handleSubmit,
      handleCancel,
      handleImageChange,
      removeImage,
      setAsMainImage,
      beforeImageUpload,
      clearTempImages
    }
  }
}
</script>

<style scoped>
.publish-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 多图上传样式 */
.multi-image-uploader {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.uploaded-images {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.image-item {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.image-item.main-image {
  border: 2px solid #409eff;
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.2);
}

.image-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
  padding: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-item:hover .image-actions {
  opacity: 1;
}

.image-actions .el-button {
  width: 24px;
  height: 24px;
  padding: 0;
}

.main-image-badge {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(64, 158, 255, 0.9);
  color: white;
  font-size: 12px;
  text-align: center;
  padding: 2px 4px;
}

/* Element Plus Upload组件样式覆盖 */
.image-uploader :deep(.el-upload) {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  width: 120px;
  height: 120px;
  transition: all 0.3s ease;
  background-color: #fafafa;
  position: relative;
  overflow: hidden;
}

.image-uploader :deep(.el-upload:hover) {
  border-color: #409eff;
  background-color: #f0f7ff;
}

.upload-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.image-uploader-icon {
  font-size: 32px;
  color: #8c939d;
  pointer-events: none; /* 防止图标阻挡点击事件 */
}

/* 响应式布局适配 */
@media (max-width: 768px) {
  .image-uploader :deep(.el-upload) {
    width: 100px;
    height: 100px;
  }
  
  .image-uploader-icon {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .image-uploader :deep(.el-upload) {
    width: 80px;
    height: 80px;
  }
  
  .image-uploader-icon {
    font-size: 24px;
  }
}

.upload-info {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.upload-info p {
  margin: 2px 0;
}
</style>