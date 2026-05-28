<template>
  <MainLayout title="Activity Logs">
    <div class="activity-logs-page">
      <div class="page-toolbar">
        <a-space wrap>
          <a-input-search
            v-model:value="search"
            placeholder="Search by name in log details"
            style="width: 280px"
            allow-clear
            @search="handleSearch"
          />
          <a-select
            v-model:value="userFilter"
            placeholder="Filter by user"
            style="width: 280px"
            allow-clear
            show-search
            option-filter-prop="label"
            :options="userOptions"
            @change="handleFilterChange"
          />
        </a-space>
      </div>

      <a-row :gutter="[16, 16]" class="charts-row">
        <a-col :xs="24" :lg="10">
          <a-card title="Activity by event type">
            <a-spin :spinning="chartLoading">
              <p class="chart-hint">Pie chart — event frequency from the last 30 days.</p>
              <div v-show="hasEventChartData" class="chart-panel">
                <canvas ref="pieCanvasRef" />
              </div>
              <a-empty v-if="!chartLoading && !hasEventChartData" description="No activity data yet" />
            </a-spin>
          </a-card>
        </a-col>
        <a-col :xs="24" :lg="14">
          <a-card title="Activity over last 7 days">
            <a-spin :spinning="chartLoading">
              <p class="chart-hint">Bar chart — daily activity including quiet days (count: 0).</p>
              <div v-show="hasDailyChartData" class="chart-panel">
                <canvas ref="barCanvasRef" />
              </div>
              <a-empty v-if="!chartLoading && !hasDailyChartData" description="No daily activity data yet" />
            </a-spin>
          </a-card>
        </a-col>
      </a-row>

      <a-card title="Recent activity" class="logs-table-card">
        <a-table
          :columns="columns"
          :data-source="logs"
          :loading="loading"
          row-key="id"
          :pagination="{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total,
            showSizeChanger: true,
            showTotal: (t) => `${t} log entries`,
          }"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'created_at'">
              {{ formatDate(record.created_at) }}
            </template>
            <template v-else-if="column.key === 'event'">
              <a-tag color="processing">{{ formatEventLabel(record.event) }}</a-tag>
            </template>
            <template v-else-if="column.key === 'data'">
              <span class="log-details">{{ formatDetails(record.data) }}</span>
            </template>
          </template>
        </a-table>
      </a-card>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/layout/MainLayout.vue'
import { useActivityLogs } from './useActivityLogs'

const {
  loading,
  chartLoading,
  logs,
  total,
  search,
  userFilter,
  userOptions,
  pagination,
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
} = useActivityLogs()
</script>

<style scoped>
.page-toolbar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.charts-row {
  margin-bottom: 20px;
}

.chart-hint {
  color: #888;
  font-size: 13px;
  margin-bottom: 12px;
}

.chart-panel {
  position: relative;
  height: 280px;
  width: 100%;
}

.logs-table-card {
  margin-top: 4px;
}

.log-details {
  color: #666;
  font-size: 13px;
}
</style>
