<template>
  <MainLayout title="Dashboard">
    <div class="dashboard">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :lg="8">
          <a-card class="stat-card welcome-card">
            <div class="welcome-content">
              <h2>Welcome, {{ userName }}!</h2>
              <p>You are signed in as <a-tag :color="roleColor">{{ authStore.role }}</a-tag></p>
              <p class="email">{{ authStore.user?.email }}</p>
            </div>
          </a-card>
        </a-col>

        <a-col v-if="canViewUsers" :xs="24" :sm="12" :lg="8">
          <a-card class="stat-card" :loading="loading">
            <a-statistic title="Total Users" :value="userCount">
              <template #prefix><TeamOutlined /></template>
            </a-statistic>
            <a-button type="link" class="card-link" @click="router.push('/users')">
              Manage users →
            </a-button>
          </a-card>
        </a-col>

        <a-col v-if="canViewCategories" :xs="24" :sm="12" :lg="8">
          <a-card class="stat-card" :loading="loading">
            <a-statistic title="Total Categories" :value="categoryCount">
              <template #prefix><FolderOutlined /></template>
            </a-statistic>
            <a-button type="link" class="card-link" @click="router.push('/categories')">
              View categories →
            </a-button>
          </a-card>
        </a-col>

        <a-col v-if="canViewProducts" :xs="24" :sm="12" :lg="8">
          <a-card class="stat-card" :loading="loading">
            <a-statistic title="Total Products" :value="productCount">
              <template #prefix><ShoppingOutlined /></template>
            </a-statistic>
            <a-button type="link" class="card-link" @click="router.push('/products')">
              View products →
            </a-button>
          </a-card>
        </a-col>

        <a-col v-if="canViewLogs" :xs="24" :sm="12" :lg="8">
          <a-card class="stat-card" :loading="loading">
            <a-statistic title="Activity Logs" :value="activityCount">
              <template #prefix><HistoryOutlined /></template>
            </a-statistic>
            <a-button type="link" class="card-link" @click="router.push('/activity-logs')">
              View activity →
            </a-button>
          </a-card>
        </a-col>
      </a-row>

      <a-card title="Your Permissions" class="permissions-card" :loading="loading">
        <a-space wrap>
          <a-tag v-for="perm in authStore.permissions" :key="perm" color="processing">
            {{ perm }}
          </a-tag>
          <span v-if="!authStore.permissions.length" class="empty-text">No permissions loaded</span>
        </a-space>
      </a-card>

      <a-row :gutter="[16, 16]" class="quick-actions">
        <a-col :xs="24" :md="12">
          <a-card title="Quick Actions">
            <a-space direction="vertical" style="width: 100%">
              <a-button v-if="canViewUsers" block @click="router.push('/users')">
                <TeamOutlined /> User Management
              </a-button>
              <a-button v-if="canViewCategories" block @click="router.push('/categories')">
                <FolderOutlined /> Category Management
              </a-button>
              <a-button v-if="canViewProducts" block @click="router.push('/products')">
                <ShoppingOutlined /> Product Catalog
              </a-button>
              <a-button v-if="canViewLogs" block @click="router.push('/activity-logs')">
                <HistoryOutlined /> Activity Logs
              </a-button>
            </a-space>
          </a-card>
        </a-col>
        <a-col :xs="24" :md="12">
          <a-card title="API Info">
            <a-descriptions :column="1" size="small">
              <a-descriptions-item label="API Base">
                {{ apiBaseUrl }}
              </a-descriptions-item>
              <a-descriptions-item label="Token Expires">
                {{ formattedExpiry }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { TeamOutlined, ShoppingOutlined, FolderOutlined, HistoryOutlined } from '@ant-design/icons-vue'
import MainLayout from '@/layout/MainLayout.vue'
import { useAuthStore } from '@/modules/auth/store'
import { PERMISSIONS } from '@/utils/permissions'
import { listUsers } from '@/modules/users/service'
import { listCategories } from '@/modules/categories/service'
import { listProducts } from '@/modules/products/service'
import { listLogs } from '@/modules/logs/service'
import { getPaginationTotal } from '@/utils/apiResponse'
import { BASE_URL } from '@/api/client'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const userCount = ref(0)
const categoryCount = ref(0)
const productCount = ref(0)
const activityCount = ref(0)

const userName = computed(() => authStore.user?.name || 'User')
const roleColor = computed(() => (authStore.role === 'admin' ? 'blue' : 'default'))
const canViewUsers = computed(() => authStore.hasPermission(PERMISSIONS.USERS_MANAGE))
const canViewCategories = computed(() => authStore.hasPermission(PERMISSIONS.CATEGORIES_VIEW))
const canViewProducts = computed(() => authStore.hasPermission(PERMISSIONS.PRODUCTS_VIEW))
const canViewLogs = computed(() => authStore.hasPermission(PERMISSIONS.LOGS_VIEW))
const apiBaseUrl = BASE_URL
const formattedExpiry = computed(() => {
  if (!authStore.expiresAt) return '—'
  return new Date(authStore.expiresAt).toLocaleString()
})

onMounted(async () => {
  loading.value = true
  try {
    const tasks = []

    if (canViewUsers.value) {
      tasks.push(
        listUsers({ page: 1, per_page: 1 }).then((res) => {
          if (res.success) userCount.value = getPaginationTotal(res)
        })
      )
    }

    if (canViewCategories.value) {
      tasks.push(
        listCategories({ page: 1, per_page: 1 }).then((res) => {
          if (res.success) categoryCount.value = getPaginationTotal(res)
        })
      )
    }

    if (canViewProducts.value) {
      tasks.push(
        listProducts({ page: 1, per_page: 1 }).then((res) => {
          if (res.success) productCount.value = getPaginationTotal(res)
        })
      )
    }

    if (canViewLogs.value) {
      tasks.push(
        listLogs({ page: 1, per_page: 1 }).then((res) => {
          if (res.success) activityCount.value = getPaginationTotal(res)
        })
      )
    }

    await Promise.all(tasks)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-card {
  height: 100%;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea22, #764ba222);
}

.welcome-content h2 {
  font-size: 20px;
  margin-bottom: 8px;
}

.welcome-content .email {
  color: #888;
  font-size: 13px;
  margin-top: 8px;
}

.card-link {
  padding-left: 0;
  margin-top: 8px;
}

.permissions-card {
  margin-top: 4px;
}

.empty-text {
  color: #999;
}

.quick-actions {
  margin-top: 4px;
}
</style>
