<template>
  <div ref="containerRef" class="chart-container">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps({
  labels: {
    type: Array,
    default: () => [],
  },
  values: {
    type: Array,
    default: () => [],
  },
  color: {
    type: String,
    default: '#1677ff',
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

  if (!canvasRef.value || !props.labels.length) {
    destroyChart()
    return
  }

  const chartConfig = {
    type: 'bar',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: 'Activities',
          data: props.values,
          backgroundColor: props.color,
          borderRadius: 6,
          maxBarThickness: 48,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
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
