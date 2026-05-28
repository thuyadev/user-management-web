import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import { listLogs, getEventStats, getDailyStats } from '../service'
import { listUsers } from '@/modules/users/service'
import {
  formatEventLabel,
  mapEventStatsToChart,
  mapDailyStatsToChart,
} from '@/utils/logAnalytics'
import { useLogCharts } from './useLogCharts'

const EVENT_STATS_DAYS = 30
const DAILY_STATS_DAYS = 7

export const useActivityLogs = () => {
  const loading = ref(false)
  const chartLoading = ref(false)
  const logs = ref([])
  const eventStats = ref([])
  const dailyStats = ref([])
  const total = ref(0)
  const search = ref('')
  const userFilter = ref(undefined)
  const userOptions = ref([])
  const pagination = reactive({
    current: 1,
    pageSize: 20,
  })

  const eventChartData = computed(() => mapEventStatsToChart(eventStats.value))
  const timelineChartData = computed(() => mapDailyStatsToChart(dailyStats.value))
  const hasEventChartData = computed(() => eventStats.value.length > 0)
  const hasDailyChartData = computed(() => dailyStats.value.length > 0)

  const { pieCanvasRef, barCanvasRef, renderCharts } = useLogCharts(
    eventChartData,
    timelineChartData
  )

  const columns = [
    { title: 'Time', dataIndex: 'created_at', key: 'created_at', width: 180 },
    { title: 'User ID', dataIndex: 'user_id', key: 'user_id', width: 90 },
    { title: 'Event', dataIndex: 'event', key: 'event', width: 180 },
    { title: 'Details', dataIndex: 'data', key: 'data' },
  ]

  const buildListParams = (page, perPage) => {
    const params = { page, per_page: perPage }

    if (userFilter.value) {
      params.user_id = userFilter.value
    }

    if (search.value?.trim()) {
      params.search = search.value.trim()
    }

    return params
  }

  const buildStatsParams = (days) => {
    const params = { days }

    if (userFilter.value) {
      params.user_id = userFilter.value
    }

    return params
  }

  const fetchChartData = async () => {
    chartLoading.value = true
    try {
      const [eventResponse, dailyResponse] = await Promise.all([
        getEventStats(buildStatsParams(EVENT_STATS_DAYS)),
        getDailyStats(buildStatsParams(DAILY_STATS_DAYS)),
      ])

      if (!eventResponse.success) {
        message.error(eventResponse.message)
        eventStats.value = []
      } else {
        eventStats.value = eventResponse.data
      }

      if (!dailyResponse.success) {
        message.error(dailyResponse.message)
        dailyStats.value = []
      } else {
        dailyStats.value = dailyResponse.data
      }
    } finally {
      chartLoading.value = false
    }

    await nextTick()
    await renderCharts()
  }

  const fetchLogs = async () => {
    loading.value = true
    try {
      const response = await listLogs(
        buildListParams(pagination.current, pagination.pageSize)
      )

      if (!response.success) {
        message.error(response.message)
        return
      }

      logs.value = response.data || []
      total.value = response.meta?.total || 0
    } finally {
      loading.value = false
    }
  }

  const fetchUsers = async () => {
    const response = await listUsers({ page: 1, per_page: 100 })
    if (response.success) {
      userOptions.value = (response.data || []).map((user) => ({
        label: `${user.name} (${user.email})`,
        value: user.id,
      }))
    }
  }

  const refreshAll = async () => {
    await Promise.all([fetchLogs(), fetchChartData()])
  }

  const handleTableChange = (pag) => {
    pagination.current = pag.current
    pagination.pageSize = pag.pageSize
    fetchLogs()
  }

  const handleSearch = () => {
    pagination.current = 1
    fetchLogs()
  }

  const handleFilterChange = () => {
    pagination.current = 1
    refreshAll()
  }

  const formatDate = (value) => {
    if (!value) return '-'
    return new Date(value).toLocaleString()
  }

  const formatDetails = (data) => {
    if (!data || typeof data !== 'object') return '—'
    const entries = Object.entries(data)
    if (!entries.length) return '—'
    return entries.map(([key, value]) => `${key}: ${value}`).join(', ')
  }

  onMounted(async () => {
    await fetchUsers()
    await refreshAll()
  })

  return {
    loading,
    chartLoading,
    logs,
    total,
    search,
    userFilter,
    userOptions,
    pagination,
    eventChartData,
    timelineChartData,
    hasEventChartData,
    hasDailyChartData,
    pieCanvasRef,
    barCanvasRef,
    columns,
    handleTableChange,
    handleSearch,
    handleFilterChange,
    formatDate,
    formatEventLabel,
    formatDetails,
  }
}
