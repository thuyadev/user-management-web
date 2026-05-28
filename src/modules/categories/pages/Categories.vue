<template>
  <MainLayout title="Categories">
    <div class="categories-page">
      <div class="page-toolbar">
        <a-input-search
          v-model:value="search"
          placeholder="Search by name"
          style="max-width: 320px"
          allow-clear
          @search="handleSearch"
        />
        <a-button v-if="canManage" type="primary" @click="openCreateModal">
          <template #icon><PlusOutlined /></template>
          Add Category
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="categories"
        :loading="loading"
        row-key="id"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `${t} categories`,
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'description'">
            {{ record.description || '—' }}
          </template>
          <template v-else-if="column.key === 'created_at'">
            {{ formatDate(record.created_at) }}
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="openEditModal(record)">
                Edit
              </a-button>
              <a-button type="link" size="small" danger @click="handleDelete(record)">
                Delete
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>

      <a-modal
        v-model:open="modalVisible"
        :title="isEditing ? 'Edit Category' : 'Create Category'"
        :confirm-loading="saving"
        ok-text="Save"
        @ok="handleSave"
      >
        <a-form layout="vertical" class="category-form">
          <a-form-item v-if="canManage && !isEditing" label="AI suggest (optional)">
            <a-space style="width: 100%">
              <a-input
                v-model:value="formState.keywords"
                placeholder="e.g. fitness equipment gym weights"
                style="flex: 1"
              />
              <a-button :loading="suggesting" @click="handleSuggestName">
                Suggest
              </a-button>
            </a-space>
          </a-form-item>
          <a-form-item label="Name" required>
            <a-input v-model:value="formState.name" placeholder="Category name" />
          </a-form-item>
          <a-form-item label="Description">
            <a-textarea
              v-model:value="formState.description"
              :rows="3"
              placeholder="Description"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </MainLayout>
</template>

<script setup>
import { PlusOutlined } from '@ant-design/icons-vue'
import MainLayout from '@/layout/MainLayout.vue'
import { useCategories } from './useCategories'

const {
  canManage,
  loading,
  saving,
  suggesting,
  categories,
  total,
  search,
  pagination,
  modalVisible,
  formState,
  isEditing,
  columns,
  handleTableChange,
  handleSearch,
  openCreateModal,
  openEditModal,
  handleSave,
  handleDelete,
  handleSuggestName,
  formatDate,
} = useCategories()
</script>

<style scoped>
.page-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
}

.category-form {
  margin-top: 16px;
}
</style>
