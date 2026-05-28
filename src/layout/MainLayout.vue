<template>
  <div class="main-layout">
    <div class="layout-container">
      <aside class="layout-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-header">
          <div class="sidebar-logo" @click="router.push('/dashboard')">
            <AppstoreOutlined class="logo-icon" />
            <span v-if="!sidebarCollapsed" class="sidebar-logo-text">UserMgmt</span>
          </div>
          <a-button type="text" class="sidebar-toggle" @click="toggleSidebar">
            <template #icon>
              <MenuFoldOutlined v-if="!sidebarCollapsed" />
              <MenuUnfoldOutlined v-else />
            </template>
          </a-button>
        </div>
        <nav class="sidebar-nav">
          <a-menu
            v-model:selectedKeys="selectedKeys"
            mode="vertical"
            :items="menuItems"
            class="sidebar-menu"
            :inline-collapsed="sidebarCollapsed"
            @click="handleMenuClick"
          />
        </nav>
      </aside>

      <div class="main-content-wrapper">
        <header class="content-header">
          <div class="header-left">
            <a-button type="text" class="mobile-menu-button" @click="toggleSidebar">
              <template #icon><MenuUnfoldOutlined /></template>
            </a-button>
            <h1 class="header-title">{{ title }}</h1>
          </div>
          <div class="header-right">
            <a-tag v-if="authStore.role" :color="authStore.role === 'admin' ? 'blue' : 'default'">
              {{ authStore.role }}
            </a-tag>
            <a-dropdown :trigger="['click']" placement="bottomRight">
              <div class="user-profile">
                <a-avatar :size="36" class="user-avatar">
                  <template #icon><UserOutlined /></template>
                </a-avatar>
                <div v-if="!isMobile" class="user-info">
                  <span class="user-name">{{ userName }}</span>
                  <span class="user-email">{{ authStore.user?.email }}</span>
                </div>
                <DownOutlined class="dropdown-icon" />
              </div>
              <template #overlay>
                <a-menu @click="handleUserMenuClick">
                  <a-menu-item key="logout">
                    <LogoutOutlined />
                    <span>Logout</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </header>

        <main class="layout-content">
          <div class="content-body">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, h, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  UserOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  TeamOutlined,
  ShoppingOutlined,
  FolderOutlined,
  HistoryOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'
import { useAuthStore } from '@/modules/auth/store'
import { PERMISSIONS } from '@/utils/permissions'

defineProps({
  title: {
    type: String,
    default: 'Dashboard',
  },
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const sidebarCollapsed = ref(false)
const isMobile = ref(false)

const resolveSelectedMenuKey = (path) => {
  if (path.startsWith('/users')) return '/users'
  if (path.startsWith('/categories')) return '/categories'
  if (path.startsWith('/products')) return '/products'
  if (path.startsWith('/activity-logs')) return '/activity-logs'
  if (path.startsWith('/dashboard')) return '/dashboard'
  return '/dashboard'
}

const selectedKeys = ref([resolveSelectedMenuKey(route.path)])

const userName = computed(() => authStore.user?.name || authStore.user?.email || 'User')

const menuItems = computed(() => {
  const items = [
    {
      key: '/dashboard',
      icon: () => h(DashboardOutlined),
      label: 'Dashboard',
    },
  ]

  if (authStore.hasPermission(PERMISSIONS.USERS_MANAGE)) {
    items.push({
      key: '/users',
      icon: () => h(TeamOutlined),
      label: 'Users',
    })
  }

  if (authStore.hasPermission(PERMISSIONS.CATEGORIES_VIEW)) {
    items.push({
      key: '/categories',
      icon: () => h(FolderOutlined),
      label: 'Categories',
    })
  }

  if (authStore.hasPermission(PERMISSIONS.PRODUCTS_VIEW)) {
    items.push({
      key: '/products',
      icon: () => h(ShoppingOutlined),
      label: 'Products',
    })
  }

  if (authStore.hasPermission(PERMISSIONS.LOGS_VIEW)) {
    items.push({
      key: '/activity-logs',
      icon: () => h(HistoryOutlined),
      label: 'Activity Logs',
    })
  }

  return items
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const updateResponsiveState = () => {
  isMobile.value = window.innerWidth <= 992
  if (!isMobile.value) {
    sidebarCollapsed.value = false
  }
}

const handleMenuClick = ({ key }) => {
  selectedKeys.value = [key]
  if (route.path !== key) {
    router.push(key)
  }
  if (isMobile.value) {
    sidebarCollapsed.value = false
  }
}

const handleUserMenuClick = ({ key }) => {
  if (key === 'logout') {
    authStore.logout()
    router.push('/login')
    message.success('Logged out successfully')
  }
}

watch(
  () => route.path,
  (newPath) => {
    selectedKeys.value = [resolveSelectedMenuKey(newPath)]
    if (isMobile.value) {
      sidebarCollapsed.value = false
    }
  }
)

onMounted(() => {
  updateResponsiveState()
  window.addEventListener('resize', updateResponsiveState)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateResponsiveState)
})
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.layout-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  background: #f0f2f5;
  padding: 16px;
  gap: 16px;
}

.layout-sidebar {
  width: 240px;
  background: #ffffff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.3s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.layout-sidebar.collapsed {
  width: 72px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.logo-icon {
  font-size: 24px;
  color: #1677ff;
}

.sidebar-logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.sidebar-toggle {
  display: none;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 0;
}

.sidebar-menu {
  background: transparent;
  border: none;
}

.main-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-menu-button {
  display: none;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.user-profile:hover {
  background-color: #f5f5f5;
}

.user-avatar {
  background-color: #1677ff;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
}

.user-email {
  font-size: 12px;
  color: #888;
  line-height: 1.2;
}

.dropdown-icon {
  font-size: 10px;
  color: #888;
}

.layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.content-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  min-height: 0;
}

@media (max-width: 992px) {
  .mobile-menu-button,
  .sidebar-toggle {
    display: flex;
  }

  .layout-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    height: 100vh;
    border-radius: 0;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .layout-sidebar.collapsed {
    transform: translateX(0);
    width: 240px;
  }
}
</style>
