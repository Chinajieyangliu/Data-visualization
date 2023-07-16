<template>
  <div class="com-comtainer">
    <div class="com-chart" ref="stockDom"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      echartInstance: null,
      allData: null,
      startNumber: 0,
      timeId: null
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timeId)
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme() {
      // 将原先的风格销毁
      this.echartInstance.dispose()
      // 调用初始化工具
      this.initChart()
      // 调用视口大小调整
      this.screenAdapter()
      // 重新将新风格渲染数据
      this.updataChart()
    }
  },
  methods: {
    // 初始化
    initChart() {
      this.echartInstance = this.$echarts.init(this.$refs.stockDom, this.theme)
      const initOption = {
        title: {
          text: '▎库存和销售分析',
          top: 20,
          left: 20
        }
      }
      this.echartInstance.setOption(initOption)
      this.echartInstance.on('mouseover', () => {
        clearInterval(this.timeId)
      }),
        this.echartInstance.on('mouseout', () => {
          this.startInterval()
        })
    },
    // 获取请求数据
    async getData() {
      const { data: ret } = await this.$http.get('stock')
      this.allData = ret
      this.updataChart()
      this.startInterval()
    },
    // 将数据渲染到页面上
    updataChart() {
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      // 对收集的十条数据进行分组
      // 对选中数据进行动态管理
      const start = this.startNumber * 5
      const end = (this.startNumber + 1) * 5
      const newStr = this.allData.slice(start, end)
      const seriesData = newStr.map((item, index) => {
        return {
          type: 'pie',
          center: centerArr[index],
          hoverAnimation: false,
          labelLine: false,
          label: {
            position: 'center',
            color: colorArr[index][0]
          },
          data: [
            {
              name: item.name + `\n\n` + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              }
            },
            {
              value: item.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ]
        }
      })
      const updateOption = {
        series: seriesData
      }
      this.echartInstance.setOption(updateOption)
    },
    // 监听窗口变化
    screenAdapter() {
      const titleWidth = (this.$refs.stockDom.offsetWidth / 100) * 3.6
      const outerRadius = titleWidth * 2.2
      const interRadius = titleWidth * 2.8

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleWidth
          }
        },
        series: [
          {
            type: 'pie',
            radius: [outerRadius, interRadius],
            label: {
              fontSize: titleWidth / 1.5
            }
          },
          {
            type: 'pie',
            radius: [outerRadius, interRadius],
            label: {
              fontSize: titleWidth / 1.5
            }
          },
          {
            type: 'pie',
            radius: [outerRadius, interRadius],
            label: {
              fontSize: titleWidth / 1.5
            }
          },
          {
            type: 'pie',
            radius: [outerRadius, interRadius],
            label: {
              fontSize: titleWidth / 1.5
            }
          },
          {
            type: 'pie',
            radius: [outerRadius, interRadius],
            label: {
              fontSize: titleWidth / 1.5
            }
          }
        ]
      }
      this.echartInstance.setOption(adapterOption)
      this.echartInstance.resize()
    },
    startInterval() {
      if (this.timeId) {
        clearInterval(this.timeId)
      }
      this.timeId = setInterval(() => {
        this.startNumber++
        if (this.startNumber > 1) {
          this.startNumber = 0
        }
        this.updataChart()
      }, 5000)
    }
  }
}
</script>

<style></style>
