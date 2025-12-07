<template>
  <Layout>
    <div class="publish-container">
      <el-card class="publish-card">
        <template #header>
          <div class="card-header">
            <span>{{ isEdit ? '编辑商品' : '发布商品' }}</span>
          </div>
        </template>
        
        <el-form
          :model="productForm"
          :rules="productRules"
          ref="productFormRef"
          label-width="100px"
          @submit.prevent="handleSubmit"
        >
          <el-form-item label="商品名称" prop="productName">
            <el-input
              v-model="productForm.productName"
              placeholder="请输入商品名称"
            />
          </el-form-item>
          
          <el-form-item label="商品分类" prop="categoryId">
            <el-select
              v-model="productForm.categoryId"
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
          
          <el-form-item label="商品描述" prop="description">
            <el-input
              v-model="productForm.description"
              type="textarea"
              :rows="6"
              placeholder="请详细描述您的商品信息"
            />
          </el-form-item>
          
          <el-form-item label="商品图片" prop="imageUrl">
            <el-upload
              class="image-uploader"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="handleImageSuccess"
              :before-upload="beforeImageUpload"
            >
              <img v-if="productForm.imageUrl" :src="productForm.imageUrl" class="uploaded-image" />
              <el-icon v-else class="image-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-tip">
              支持jpg、png格式，大小不超过2MB
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" :loading="submitting" @click="handleSubmit">
              {{ isEdit ? '保存修改' : '发布商品' }}
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
import { Plus } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import api from '@/api'

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
    
    // 表单数据
    const productForm = reactive({
      productName: '',
      categoryId: null,
      price: 0,
      paymentMethod: 0,
      description: '',
      imageUrl: ''
    })
    
    // 表单验证规则
    const productRules = {
      productName: [
        { required: true, message: '请输入商品名称', trigger: 'blur' },
        { min: 2, max: 50, message: '商品名称长度在2到50个字符', trigger: 'blur' }
      ],
      categoryId: [
        { required: true, message: '请选择商品分类', trigger: 'change' }
      ],
      price: [
        { required: true, message: '请输入商品价格', trigger: 'blur' },
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
    const uploadUrl = '/api/upload' // 这里需要根据实际API调整
    const uploadHeaders = computed(() => ({
      Authorization: `Bearer ${store.state.token}`
    }))
    
    // 获取商品详情（编辑模式）
    const fetchProductDetail = async (productId) => {
      try {
        const response = await api.product.getProductById(productId)
        const product = response.data.data
        
        // 填充表单
        Object.keys(productForm).forEach(key => {
          if (product[key] !== undefined) {
            productForm[key] = product[key]
          }
        })
      } catch (error) {
        console.error('获取商品详情失败:', error)
        ElMessage.error('获取商品信息失败')
        router.push('/my-products')
      }
    }
    
    // 提交表单
    const handleSubmit = async () => {
      if (!productFormRef.value) return
      
      try {
        await productFormRef.value.validate()
        submitting.value = true
        
        let response
        
        if (isEdit.value) {
          // 编辑商品
          response = await api.product.updateProduct({
            ...productForm,
            id: route.params.id
          })
        } else {
          // 发布新商品
          response = await api.product.addProduct(productForm)
        }
        
        if (response.data.code === 200) {
          ElMessage.success(isEdit.value ? '商品修改成功' : '商品发布成功')
          router.push('/my-products')
        }
      } catch (error) {
        console.error('发布商品失败:', error)
        ElMessage.error(error.response?.data?.message || '操作失败，请稍后再试')
      } finally {
        submitting.value = false
      }
    }
    
    // 取消操作
    const handleCancel = () => {
      router.push('/my-products')
    }
    
    // 图片上传成功
    const handleImageSuccess = (res) => {
      if (res.code === 200) {
        productForm.imageUrl = res.data
        ElMessage.success('图片上传成功')
      } else {
        ElMessage.error(res.message || '图片上传失败')
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
        
        // 获取商品详情
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
      categories,
      uploadUrl,
      uploadHeaders,
      handleSubmit,
      handleCancel,
      handleImageSuccess,
      beforeImageUpload
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

.image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-uploader:hover {
  border-color: #409eff;
}

.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.uploaded-image {
  width: 178px;
  height: 178px;
  object-fit: cover;
  display: block;
}

.upload-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
}
</style>