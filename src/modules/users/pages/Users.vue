<template>
  <MainLayout title="Users">
    <div class="users-page">
      <div class="page-toolbar">
        <a-input-search
          v-model:value="search"
          placeholder="Search by name"
          style="max-width: 320px"
          allow-clear
          @search="handleSearch"
        />
        <a-button type="primary" @click="openCreateModal">
          <template #icon><PlusOutlined /></template>
          Add User
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="users"
        :loading="loading"
        row-key="id"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `${t} users`,
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'role'">
            <a-tag :color="record.role === 'admin' ? 'blue' : 'default'">
              {{ record.role }}
            </a-tag>
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
        :title="isEditing ? 'Edit User' : 'Create User'"
        :confirm-loading="saving"
        ok-text="Save"
        @ok="handleSave"
      >
        <a-form layout="vertical" class="user-form">
          <a-form-item label="Name" required>
            <a-input v-model:value="formState.name" placeholder="Full name" />
          </a-form-item>
          <a-form-item label="Email" required>
            <a-input v-model:value="formState.email" placeholder="email@example.com" />
          </a-form-item>
          <a-form-item :label="isEditing ? 'Password (leave blank to keep)' : 'Password'" :required="!isEditing">
            <a-input-password v-model:value="formState.password" placeholder="Min 6 characters" />
          </a-form-item>
          <a-form-item label="Role" required>
            <a-select v-model:value="formState.role">
              <a-select-option value="user">User</a-select-option>
              <a-select-option value="admin">Admin</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </MainLayout>
</template>

<script setup>
import { PlusOutlined } from '@ant-design/icons-vue'
import MainLayout from '@/layout/MainLayout.vue'
import { useUsers } from './useUsers'

const {
  loading,
  saving,
  users,
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
  formatDate,
} = useUsers()
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

.user-form {
  margin-top: 16px;
}
</style>
