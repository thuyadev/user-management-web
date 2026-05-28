<template>
  <MainLayout title="Products">
    <div class="products-page">
      <div class="page-toolbar">
        <a-space wrap>
          <a-input-search
            v-model:value="search"
            placeholder="Search by name"
            style="width: 240px"
            allow-clear
            @search="handleSearch"
          />
          <a-select
            v-model:value="categoryFilter"
            placeholder="Filter by category"
            style="width: 200px"
            allow-clear
            :options="categoryOptions"
            @change="handleFilterChange"
          />
        </a-space>
        <a-button v-if="canManage" type="primary" @click="openCreateModal">
          <template #icon><PlusOutlined /></template>
          Add Product
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="products"
        :loading="loading"
        row-key="id"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `${t} products`,
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'category'">
            {{ getCategoryName(record) }}
          </template>
          <template v-else-if="column.key === 'price'">
            {{ formatPrice(record.price) }}
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
        :title="isEditing ? 'Edit Product' : 'Create Product'"
        :confirm-loading="saving"
        ok-text="Save"
        @ok="handleSave"
      >
        <a-form layout="vertical" class="product-form">
          <a-form-item label="Name" required>
            <a-input v-model:value="formState.name" placeholder="Product name" />
          </a-form-item>
          <a-form-item label="Description">
            <a-textarea v-model:value="formState.description" :rows="3" placeholder="Description" />
          </a-form-item>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="Price" required>
                <a-input-number
                  v-model:value="formState.price"
                  :min="0.01"
                  :step="0.01"
                  style="width: 100%"
                  prefix="$"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Stock" required>
                <a-input-number v-model:value="formState.stock" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item label="Category" required>
            <a-select
              v-model:value="formState.category_id"
              placeholder="Select category"
              :options="categoryOptions"
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
import { useProducts } from './useProducts'

const {
  canManage,
  loading,
  saving,
  products,
  total,
  categoryFilter,
  categoryOptions,
  search,
  pagination,
  modalVisible,
  formState,
  isEditing,
  columns,
  handleTableChange,
  handleFilterChange,
  handleSearch,
  openCreateModal,
  openEditModal,
  handleSave,
  handleDelete,
  formatPrice,
  getCategoryName,
} = useProducts()
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

.product-form {
  margin-top: 16px;
}
</style>
