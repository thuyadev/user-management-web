import { ref, watch, onBeforeUnmount, nextTick } from 'vue'
import Chart from 'chart.js/auto'

const PIE_COLORS = [
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
]

export const useLogCharts = (eventChartData, dailyChartData) => {
  const pieCanvasRef = ref(null)
  const barCanvasRef = ref(null)
  let pieChart = null
  let barChart = null

  const destroyPieChart = () => {
    pieChart?.destroy()
    pieChart = null
  }

  const destroyBarChart = () => {
    barChart?.destroy()
    barChart = null
  }

  const destroyCharts = () => {
    destroyPieChart()
    destroyBarChart()
  }

  const renderPieChart = async () => {
    await nextTick()
    await new Promise((resolve) => requestAnimationFrame(resolve))

    const { labels, values } = eventChartData.value
    if (!pieCanvasRef.value || !labels.length || !values.length) {
      destroyPieChart()
      return
    }

    if (pieChart) {
      pieChart.data.labels = labels
      pieChart.data.datasets[0].data = values
      pieChart.data.datasets[0].backgroundColor = PIE_COLORS.slice(0, labels.length)
      pieChart.update()
      pieChart.resize()
      return
    }

    pieChart = new Chart(pieCanvasRef.value, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: PIE_COLORS.slice(0, labels.length),
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
    })
  }

  const renderBarChart = async () => {
    await nextTick()
    await new Promise((resolve) => requestAnimationFrame(resolve))

    const { labels, values } = dailyChartData.value
    if (!barCanvasRef.value || !labels.length) {
      destroyBarChart()
      return
    }

    if (barChart) {
      barChart.data.labels = labels
      barChart.data.datasets[0].data = values
      barChart.update()
      barChart.resize()
      return
    }

    barChart = new Chart(barCanvasRef.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Activities',
            data: values,
            backgroundColor: '#1677ff',
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
    })
  }

  const renderCharts = async () => {
    await Promise.all([renderPieChart(), renderBarChart()])
  }

  watch(eventChartData, renderPieChart, { deep: true, flush: 'post' })
  watch(dailyChartData, renderBarChart, { deep: true, flush: 'post' })

  onBeforeUnmount(destroyCharts)

  return {
    pieCanvasRef,
    barCanvasRef,
    renderCharts,
  }
}
