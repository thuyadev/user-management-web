const EVENT_LABELS = {
  'user.created': 'User created',
  'user.updated': 'User updated',
  'user.deleted': 'User deleted',
  'user.login': 'User login',
  'user.register': 'User register',
  'category.created': 'Category created',
  'category.updated': 'Category updated',
  'category.deleted': 'Category deleted',
  'product.created': 'Product created',
  'product.updated': 'Product updated',
  'product.deleted': 'Product deleted',
}

export const formatEventLabel = (event) => {
  if (!event) return 'Unknown'
  return EVENT_LABELS[event] || event.replace(/\./g, ' · ')
}

export const formatDailyLabel = (dateValue) => {
  if (!dateValue) return ''
  const date = new Date(`${dateValue}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateValue
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export const mapEventStatsToChart = (stats = []) => {
  const items = Array.isArray(stats) ? stats : []

  return {
    labels: items.map((item) => formatEventLabel(item.event)),
    values: items.map((item) => Number(item.count) || 0),
  }
}

export const mapDailyStatsToChart = (stats = []) => {
  const items = Array.isArray(stats) ? stats : []

  return {
    labels: items.map((item) => formatDailyLabel(item.date)),
    values: items.map((item) => Number(item.count) || 0),
  }
}
