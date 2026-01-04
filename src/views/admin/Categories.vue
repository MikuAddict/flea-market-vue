<template>
  <Layout>
    <div class="admin-categories unified-page-container fade-in">
      <!-- 页面标题和操作区域 -->
      <div class="page-header unified-flex unified-flex-between">
        <div>
          <h1 class="unified-title-xl">分类管理</h1>
          <p class="unified-text-secondary">管理系统中的所有产品分类</p>
        </div>
        <el-button 
          type="primary" 
          class="unified-button unified-button-primary"
          @click="showAddCategoryDialog"
        >
          <el-icon><Plus /></el-icon>
          添加分类
        </el-button>
      </div>
      
      <!-- 分类列表 -->
      <el-card class="unified-card categories-card fade-in">
        <template #header>
          <div class="card-header unified-flex unified-flex-between">
            <h3 class="unified-title-base">分类列表</h3>
          </div>
        </template>
        
        <!-- 列表视图 -->
        <div v-if="viewMode === 'list'" class="unified-list-container">
          <el-table
            v-loading="loading"
            :data="categoryList"
            style="width: 100%"
            row-key="id"
          >
            <el-table-column prop="name" label="分类名称" min-width="200" align="center" />
            
            <el-table-column prop="productCount" label="在售数量" width="300" align="center">
              <template #default="scope">
                {{ scope.row.productCount || 0 }}
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="180" align="center">
              <template #default="scope">
                <div class="action-buttons unified-flex unified-flex-center">
                  <el-button
                    size="small"
                    type="primary"
                    plain
                    @click="showEditCategoryDialog(scope.row)"
                    class="action-btn-edit"
                  >
                    编辑
                  </el-button>
                  
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="handleDeleteCategory(scope.row)"
                    class="action-btn-delete"
                  >
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 树形视图 -->
        <div v-else>
          <el-tree
            :props="defaultProps"
            :expand-on-click-node="false"
            :default-expand-all="true"
            node-key="id"
            class="category-tree"
          >
            <template #default="{ node, data }">
              <div class="tree-node unified-flex unified-flex-between">
                <div class="node-info unified-flex unified-flex-center">
                  <span class="node-name">{{ node.label }}</span>
                  <el-tag size="small" class="product-count-tag">
                    {{ data.productCount || 0 }} 个产品
                  </el-tag>
                </div>
                <div class="node-actions">
                  <el-button
                    size="small"
                    type="text"
                    @click="showEditCategoryDialog(data)"
                  >
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  
                  <el-button
                    size="small"
                    type="text"
                    @click="showAddSubCategoryDialog(data)"
                  >
                    <el-icon><Plus /></el-icon>
                  </el-button>
                  
                  <el-button
                    size="small"
                    type="text"
                    @click="handleDeleteCategory(data)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </template>
          </el-tree>
        </div>
      </el-card>
      
      <!-- 添加/编辑分类对话框 -->
      <el-dialog
        v-model="categoryDialogVisible"
        :title="dialogMode === 'add' ? '添加分类' : '编辑分类'"
        width="500px"
      >
        <el-form :model="categoryForm" :rules="categoryFormRules" ref="categoryFormRef" label-width="100px">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
          </el-form-item>
        </el-form>
        
        <template #footer>
          <div class="dialog-footer unified-flex unified-flex-end">
            <el-button @click="categoryDialogVisible = false">取消</el-button>
            <el-button 
              type="primary" 
              :loading="categoryFormSubmitting"
              @click="submitCategoryForm"
            >
              确定
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, 
  Edit, 
  Delete, 
  ArrowDown
} from '@element-plus/icons-vue'
import { adminApi } from '@/api'
import Layout from '@/components/Layout.vue'

export default {
  name: 'AdminCategories',
  components: {
    Layout
  },
  setup() {
    // 表单引用
    const categoryFormRef = ref(null)
    
    // 响应式数据
    const loading = ref(false)
    const categoryList = ref([])
    const categoryDialogVisible = ref(false)
    const dialogMode = ref('add')
    const categoryFormSubmitting = ref(false)
    const viewMode = ref('list') // 视图模式：list-列表视图，tree-树形视图
    
    // 分类表单
    const categoryForm = reactive({
      id: '',
      name: '',
      parentId: '',
      sort: 0
    })
    
    // 分类表单验证规则
    const categoryFormRules = {
      name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { min: 2, max: 20, message: '分类名称长度在2到20个字符', trigger: 'blur' }
      ],
      sort: [
        { required: true, message: '请输入排序值', trigger: 'blur' },
        { type: 'number', message: '排序值必须是数字', trigger: 'blur' }
      ]
    }
    
    // 树形组件默认属性
    const defaultProps = {
      children: 'children',
      label: 'name'
    }
    
    // 获取分类列表
    const fetchCategories = async () => {
      loading.value = true
      try {
        const response = await adminApi.category.getCategoryList()
        if (response.data && response.data.code === 200) {
          const categories = response.data.data || []
          
          const processedCategories = categories.map(category => ({
            ...category,
            id: typeof category.id === 'number' && category.id > Number.MAX_SAFE_INTEGER 
                 ? category.id.toString() 
                 : category.id
          }))
          
          categoryList.value = processedCategories
        } else {
          ElMessage.error('获取分类列表失败')
        }
      } catch (error) {
        console.error('获取分类列表失败:', error)
        ElMessage.error('获取分类列表失败')
      } finally {
        loading.value = false
      }
    }
    
    // 显示添加分类对话框
    const showAddCategoryDialog = () => {
      dialogMode.value = 'add'
      resetCategoryForm()
      categoryDialogVisible.value = true
    }
    
    // 显示编辑分类对话框
    const showEditCategoryDialog = (category) => {
      dialogMode.value = 'edit'
      Object.assign(categoryForm, {
        id: category.id,
        name: category.name,
        parentId: category.parentId || '',
        sort: category.sort || 0
      })
      categoryDialogVisible.value = true
    }
    
    // 重置分类表单
    const resetCategoryForm = () => {
      Object.assign(categoryForm, {
        id: '',
        name: '',
        parentId: '',
        sort: 0
      })
      if (categoryFormRef.value) {
        categoryFormRef.value.resetFields()
      }
    }
    
    // 提交分类表单
    const submitCategoryForm = async () => {
      if (!categoryFormRef.value) return
      
      try {
        await categoryFormRef.value.validate()
        categoryFormSubmitting.value = true
        
        if (dialogMode.value === 'add') {
          await adminApi.category.addCategory({
            name: categoryForm.name
          })
          ElMessage.success('分类添加成功')
        } else {
          await adminApi.category.updateCategory({
            id: categoryForm.id,
            name: categoryForm.name
          })
          ElMessage.success('分类更新成功')
        }
        
        categoryDialogVisible.value = false
        fetchCategories()
      } catch (error) {
        console.error('分类操作失败:', error)
        ElMessage.error('操作失败')
      } finally {
        categoryFormSubmitting.value = false
      }
    }
    
    // 处理分类操作
    const handleCategoryAction = async (command, category) => {
      switch (command) {
        case 'delete':
          try {
            await ElMessageBox.confirm(`确定要删除分类 "${category.name}"`, '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            })
            
            await adminApi.category.deleteCategory(category.id)
            ElMessage.success('分类删除成功')
            fetchCategories()
          } catch (error) {
            if (error !== 'cancel') {
              ElMessage.error('分类删除失败')
            }
          }
          break
      }
    }

    // 处理删除分类
    const handleDeleteCategory = async (category) => {
      try {
        await ElMessageBox.confirm(`确定要删除分类 "${category.name}" 吗？删除后无法恢复。`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await adminApi.category.deleteCategory(category.id)
        ElMessage.success('分类删除成功')
        fetchCategories()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('分类删除失败:', error)
          ElMessage.error('分类删除失败')
        }
      }
    }
    
    onMounted(() => {
      fetchCategories()
    })
    
    return {
      loading,
      categoryList,
      defaultProps,
      categoryDialogVisible,
      dialogMode,
      categoryForm,
      categoryFormRef,
      categoryFormRules,
      categoryFormSubmitting,
      viewMode,
      fetchCategories,
      showAddCategoryDialog,
      showEditCategoryDialog,
      resetCategoryForm,
      submitCategoryForm,
      handleCategoryAction,
      handleDeleteCategory,
    }
  }
}
</script>

<style scoped>
/* 页面头部样式 */
.page-header {
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  margin-bottom: var(--spacing-xs);
}

/* 分类列表样式 */
.categories-card {
  margin-bottom: var(--spacing-xl);
}

.card-header {
  margin-bottom: var(--spacing-base);
}

/* 树形视图样式 */
.category-tree {
  margin-top: var(--spacing-base);
}

.tree-node {
  width: 100%;
  padding: var(--spacing-xs) 0;
}

.node-info {
  flex: 1;
}

.node-name {
  font-weight: 500;
  color: var(--text-primary);
}

.product-count-tag {
  margin-left: var(--spacing-sm);
  background-color: var(--primary-color);
  color: white;
}

.node-actions {
  opacity: 0;
  transition: opacity var(--transition-base);
}

.tree-node:hover .node-actions {
  opacity: 1;
}

.node-actions {
  display: flex;
  gap: var(--spacing-xs);
}

/* 对话框样式 */
.dialog-footer {
  gap: var(--spacing-sm);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-base);
  }
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}
</style>