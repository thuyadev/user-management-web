<template>
  <div ref="containerRef" class="chart-container">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'

Chart.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  labels: {
    type: Array,
    default: () => [],
  },
  values: {
    type: Array,
    default: () => [],
  },
  colors: {
    type: Array,
    default: () => [
      '#1677ff',
      '#52c41a',
      '#faad14',
      '#722ed1',
      '#eb2f96',
      '#13c2c2',
      '#fa541c',
      '#2f54eb',
      '#a0d911',
      '#f5222d',
    ],
  },
})

const canvasRef = ref(null)
const containerRef = ref(null)
let chartInstance = null
let resizeObserver = null

const destroyChart = () => {
  chartInstance?.destroy()
  chartInstance = null
}

const renderChart = async () => {
  await nextTick()
  await new Promise((resolve) => requestAnimationFrame(resolve))

  if (!canvasRef.value || !props.labels.length || !props.values.length) {
    destroyChart()
    return
  }

  const chartConfig = {
    type: 'pie',
    data: {
      labels: props.labels,
      datasets: [
        {
          data: props.values,
          backgroundColor: props.colors.slice(0, props.labels.length),
          borderWidth: 1,
          borderColor: '#fff',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  }

  if (chartInstance) {
    chartInstance.data = chartConfig.data
    chartInstance.update()
    chartInstance.resize()
    return
  }

  chartInstance = new Chart(canvasRef.value, chartConfig)
}

watch(
  () => [props.labels, props.values],
  () => {
    renderChart()
  },
  { deep: true, flush: 'post' }
)

onMounted(() => {
  renderChart()

  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      chartInstance?.resize()
    })
    resizeObserver.observe(containerRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  destroyChart()
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 280px;
  width: 100%;
}
</style>
