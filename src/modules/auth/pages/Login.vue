<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <AppstoreOutlined class="brand-icon" />
        <h1 class="login-title">User Management</h1>
        <p class="login-subtitle">Sign in to manage users and products</p>
      </div>

      <a-form
        :model="formState"
        :rules="rules"
        layout="vertical"
        @finish="handleLogin"
      >
        <a-form-item name="email" label="Email">
          <a-input
            v-model:value="formState.email"
            placeholder="Enter your email"
            size="large"
          />
        </a-form-item>

        <a-form-item name="password" label="Password">
          <a-input-password
            v-model:value="formState.password"
            placeholder="Enter your password"
            size="large"
          />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            block
            size="large"
          >
            Sign In
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { AppstoreOutlined } from '@ant-design/icons-vue'
import { useLogin } from './useLogin'

const { loading, formState, rules, handleLogin } = useLogin()
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 16px;
  padding: 40px 36px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.brand-icon {
  font-size: 40px;
  color: #1677ff;
  margin-bottom: 12px;
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.login-subtitle {
  color: #888;
  font-size: 14px;
}
</style>
