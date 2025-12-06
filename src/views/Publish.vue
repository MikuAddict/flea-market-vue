<template>
  <div class="publish">
    <div class="publish-header">
      <h1>发布商品</h1>
      <p>填写商品信息，快速上架您的闲置物品</p>
    </div>

    <div class="publish-form">
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="formRef" 
        label-width="100px"
        label-position="top"
      >
        <!-- 商品基本信息 -->
        <el-card class="form-section">
          <template #header>
            <div class="section-header">
              <el-icon><Goods /></el-icon>
              <span>商品基本信息</span>
            </div>
          </template>
          
          <el-form-item label="商品名称" prop="name">
            <el-input 
              v-model="form.name" 
              placeholder="请输入商品名称" 
              maxlength="50"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="商品描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              placeholder="请输入商品详细描述"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="商品分类" prop="categoryId">
            <el-select 
              v-model="form.categoryId" 
              placeholder="请选择商品分类"
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

          <el-form-item label="商品价格" prop="price">
            <el-input-number 
              v-model="form.price" 
              :min="0" 
              :precision="2"
              placeholder="请输入价格"
              style="width: 200px"
            />
            <span class="price-unit">元</span>
          </el-form-item>

          <el-form-item label="商品库存" prop="stock">
            <el-input-number 
              v-model="form.stock" 
              :min="1" 
              placeholder="请输入库存数量"
              style="width: 200px"
            />
            <span class="stock-unit">件</span>
          </el-form-item>
        </el-card>

        <!-- 商品图片 -->
        <el-card class="form-section">
          <template #header>
            <div class="section-header">
              <el-icon><Picture /></el-icon>
              <span>商品图片</span>
            </div>
          </template>
          
          <el-form-item label="商品主图" prop="image">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="handleUpload"
            >
              <img v-if="form.image" :src="form.image" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-tips">建议上传1:1比例的图片，大小不超过2MB</div>
          </el-form-item>
        </el-card>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            发布商品
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Goods, Picture, Plus } from '@element-plus/icons-vue'
import defaultApi from '../api/DefaultApi'
import ApiClient from '../ApiClient'

const router = useRouter()
const api = new DefaultApi(new ApiClient())

const formRef = ref()
const categories = ref([])
const loading = ref(false)

const form = ref({
  name: '',
  description: '',
  categoryId: '',
  price: 0,
  stock: 1,
  image: ''
})

const rules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '商品名称长度在2-50个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入商品描述', trigger: 'blur' },
    { min: 10, max: 500, message: '商品描述长度在10-500个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能为负数', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入商品库存', trigger: 'blur' },
    { type: 'number', min: 1, message: '库存至少为1', trigger: 'blur' }
  ]
}

onMounted(async () => {
  await loadCategories()
})

const loadCategories = async () => {
  try {
    const response = await api.listCategoryUsingGET()
    if (response.code === 200) {
      categories.value = response.data || []
    }
  } catch (error) {
    console.error('加载分类失败:', error)
    ElMessage.error('加载分类失败')
  }
}

const beforeAvatarUpload = (file) => {
  const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPGOrPNG) {
    ElMessage.error('图片格式必须是 JPG 或 PNG!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleUpload = async (options) => {
  try {
    // 这里应该调用文件上传API
    // 由于没有真实的上传接口，这里模拟上传成功
    const file = options.file
    const reader = new FileReader()
    
    reader.onload = (e) => {
      form.value.image = e.target.result
      ElMessage.success('图片上传成功')
    }
    reader.readAsDataURL(file)
    
  } catch (error) {
    ElMessage.error('图片上传失败')
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    
    loading.value = true
    
    const productData = {
      ...form.value,
      // 这里应该从用户信息中获取sellerId
      sellerId: getCurrentUserId()
    }

    const response = await api.addProductUsingPOST(productData)
    
    if (response.code === 200) {
      ElMessage.success('商品发布成功')
      router.push('/products')
    } else {
      ElMessage.error(response.message || '商品发布失败')
    }
  } catch (error) {
    console.error('发布失败:', error)
    ElMessage.error('商品发布失败')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  formRef.value.resetFields()
  form.value.image = ''
}

const getCurrentUserId = () => {
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    return JSON.parse(userInfo).id
  }
  return null
}
</script>

<style scoped>
.publish {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.publish-header {
  text-align: center;
  margin-bottom: 40px;
}

.publish-header h1 {
  color: #303133;
  margin-bottom: 8px;
}

.publish-header p {
  color: #909399;
}

.form-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #303133;
}

.section-header .el-icon {
  margin-right: 8px;
}

.price-unit,
.stock-unit {
  margin-left: 8px;
  color: #606266;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}

.upload-tips {
  margin-top: 8px;
  color: #909399;
  font-size: 12px;
}

.form-actions {
  text-align: center;
  margin-top: 40px;
}

.form-actions .el-button {
  min-width: 120px;
  margin: 0 12px;
}
</style>