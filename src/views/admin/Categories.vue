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
        <div v-if="viewMode === 'list'">
          <el-table
            v-loading="loading"
            :data="categoryList"
            style="width: 100%"
            row-key="id"
          >
            <el-table-column prop="id" label="ID" width="300" />
            
            <el-table-column prop="name" label="分类名称" min-width="200" />
            
            <el-table-column prop="productCount" label="产品数量" width="300">
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
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                  
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="handleDeleteCategory(scope.row)"
                    class="action-btn-delete"
                  >
                    <el-icon><Delete /></el-icon>
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
            :data="categoryTree"
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
    const viewMode = ref('list')
    const categoryFormSubmitting = ref(false)
    
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
    
    // 分类统计数据
    const categoryStats = computed(() => [
      {
        title: '总分类数',
        value: categoryList.value.length,
        icon: 'Goods',
        type: 'primary'
      },
      {
        title: '顶级分类',
        value: categoryList.value.filter(c => !c.parentId).length,
        icon: 'FolderOpened',
        type: 'success'
      },
      {
        title: '二级分类',
        value: categoryList.value.filter(c => c.parentId).length,
        icon: 'Folder',
        type: 'warning'
      },
      {
        title: '三级分类',
        value: categoryList.value.filter(c => c.parentId && c.level === 2).length,
        icon: 'FolderAdd',
        type: 'danger'
      }
    ])
    
    // 分类树形数据（根据OpenAPI规范，当前不包含父子级关系，所以简化处理）
    const categoryTree = computed(() => {
      // 当前API不返回父子级关系，所以直接返回一级列表
      return categoryList.value.map(category => ({
        ...category,
        children: [] // 空子节点
      }))
    })
    
    // 分类选项（用于父级分类选择）
    const categoryOptions = computed(() => {
      // 当前API不返回父子级关系，所以简化处理
      return [
        { id: null, name: '顶级分类' },
        ...categoryList.value
      ]
    })
    
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
          // 根据OpenAPI规范，返回的是分类数组，没有父子级关系
          const categories = response.data.data || []
          categoryList.value = categories
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
    
    // 显示添加子分类对话框
    const showAddSubCategoryDialog = (parent) => {
      dialogMode.value = 'add'
      resetCategoryForm()
      categoryForm.parentId = parent.id
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
          // 根据OpenAPI规范，CategoryAddRequest只包含name字段
          await adminApi.category.addCategory({
            name: categoryForm.name
          })
          ElMessage.success('分类添加成功')
        } else {
          // 根据OpenAPI规范，更新分类直接传递Category对象
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
        case 'move':
          // 这里可以实现移动分类的功能
          ElMessage.info('移动分类功能开发中')
          break
          
        case 'delete':
          try {
            await ElMessageBox.confirm(`确定要删除分类 "${category.name}" 吗？删除后，该分类下的所有产品将重新分类，此操作不可恢复。`, '警告', {
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
    
    // 删除分类（用于树形视图）
    const handleDeleteCategory = async (category) => {
      try {
        await ElMessageBox.confirm(`确定要删除分类 "${category.name}" 吗？删除后，该分类下的所有产品将重新分类，此操作不可恢复。`, '警告', {
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
    }
    
    onMounted(() => {
      fetchCategories()
    })
    
    return {
      loading,
      categoryList,
      categoryTree,
      categoryOptions,
      defaultProps,
      categoryDialogVisible,
      dialogMode,
      viewMode,
      categoryForm,
      categoryFormRef,
      categoryFormRules,
      categoryFormSubmitting,
      categoryStats,
      fetchCategories,
      showAddCategoryDialog,
      showAddSubCategoryDialog,
      showEditCategoryDialog,
      resetCategoryForm,
      submitCategoryForm,
      handleCategoryAction,
      handleDeleteCategory
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

/* 统计卡片样式 */
.stats-cards {
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  height: 100%;
}

.stat-item {
  height: 120px;
  padding: var(--spacing-lg);
}

.stat-content {
  height: 100%;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: var(--spacing-base);
}

.stat-item-primary .stat-icon {
  background-color: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
}

.stat-item-success .stat-icon {
  background-color: rgba(103, 194, 58, 0.1);
  color: var(--success-color);
}

.stat-item-warning .stat-icon {
  background-color: rgba(230, 162, 60, 0.1);
  color: var(--warning-color);
}

.stat-item-danger .stat-icon {
  background-color: rgba(245, 108, 108, 0.1);
  color: var(--danger-color);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
}

.stat-title {
  color: var(--text-secondary);
  margin: 0;
}

/* 分类列表样式 */
.categories-card {
  margin-bottom: var(--spacing-xl);
}

.card-header {
  margin-bottom: var(--spacing-base);
}

.action-buttons {
  gap: var(--spacing-xs);
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
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-base);
  }
  
  .view-options .el-radio-group {
    flex-direction: column;
  }
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}
</style>