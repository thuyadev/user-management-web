export const PERMISSIONS = {
  USERS_MANAGE: 'users.manage',
  CATEGORIES_VIEW: 'categories.view',
  CATEGORIES_MANAGE: 'categories.manage',
  PRODUCTS_VIEW: 'products.view',
  PRODUCTS_MANAGE: 'products.manage',
  LOGS_VIEW: 'logs.view',
}

export const hasPermission = (permissions, permission) => {
  if (!Array.isArray(permissions)) return false
  return permissions.includes(permission)
}

export const isAdmin = (role) => role === 'admin'
