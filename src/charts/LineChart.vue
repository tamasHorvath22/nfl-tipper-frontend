<script>
import { HorizontalBar } from 'vue-chartjs'
// import Chart from 'chart.js'

export default {
  extends: HorizontalBar,
  props: {
    standings: Array
  },
  data () {
    return {
      chartLabels: [],
      chartData: []
    }
  },
  methods: {
    sortStandings () {
      this.standings.sort((a, b) => {
        return a.score > b.score ? -1 : 1
      })
      // console.log('chart component')
      // console.log(this.standings)
    },
    createChartData () {
      const scores = []
      const bgColors = []
      this.standings.forEach(user => {
        this.chartLabels.push(user.name)
        scores.push(user.score)
        bgColors.push(this.getRandomColor())
      })
      this.chartData.push({
        label: false,
        data: scores,
        backgroundColor: bgColors // ['yellow', 'blue'],
        // borderColor: 'rgba(1, 116, 188, 0.50)',
        // pointBackgroundColor: 'red'
      })
    },
    getRandomColor () {
      const r = Math.floor(Math.random() * 255)
      const g = Math.floor(Math.random() * 255)
      const b = Math.floor(Math.random() * 255)
      return `rgb(${r}, ${g}, ${b})`
    }
  },
  mounted () {
    this.sortStandings()
    this.createChartData()
    // console.log(this.chartData)
    const options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem) {
            // console.log(tooltipItem)
            return tooltipItem.yLabel
          }
        }
      },
      animation: {
        duration: 1,
        onComplete: function () {
          var chartInstance = this.chart
          let ctx = chartInstance.ctx
          // console.log(ctx)
          ctx.textAlign = 'center'
          ctx.fillStyle = 'rgba(0, 0, 0, 1)'
          ctx.textBaseline = 'bottom'

          this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i)
            meta.data.forEach(function (bar, index) {
              var data = dataset.data[index]
              // console.log(bar._model.x)
              // console.log(bar._model.y)
              ctx.fillText(data, bar._model.x, bar._model.y - 5)
            })
          })
        }
      }
      // animation: {
      //   onComplete: function () {
      //     var chartInstance = this.chart
      //     var ctx = chartInstance.ctx
      //     console.log(chartInstance)
      //     var height = chartInstance.controller.boxes[0].bottom
      //     ctx.textAlign = 'center'
      //     Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
      //       var meta = chartInstance.controller.getDatasetMeta(i)
      //       Chart.helpers.each(meta.data.forEach(function (bar, index) {
      //         ctx.fillText(dataset.data[index], bar._model.x, height - ((height - bar._model.y) / 2))
      //       }), this)
      //     }), this)
      //   }
      // }
    }
    this.renderChart({ labels: this.chartLabels, datasets: this.chartData }, options
      // {
      //   labels: [
      //     'January',
      //     'February',
      //     'March',
      //     'April',
      //     'May',
      //     'June',
      //     'July'
      //   ],
      //   datasets: [
      //     {
      //       label: 'Data 1',
      //       data: [2, 10, 5, 9, 0, 6, 20],
      //       backgroundColor: 'yellow',
      //       borderColor: 'rgba(1, 116, 188, 0.50)',
      //       pointBackgroundColor: 'red'
      //     }
      //   ]
      // }
    )
  }
}
</script>
