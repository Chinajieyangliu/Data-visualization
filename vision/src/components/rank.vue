<template>
  <div class="com-comtainer">
    <div class="com-chart" ref="rankDom"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      echartInstance: null,
      allData: null,
      startDataValue: 0,
      endDataValue: 8,
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
    clearInterval(this.timeId)
    window.removeEventListener('resize', this.screenAdapter)
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
      this.echartInstance = this.$echarts.init(this.$refs.rankDom, this.theme)
      const initOption = {
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar'
          }
        ]
      }
      this.echartInstance.setOption(initOption)

      this.echartInstance.on('mouseover', () => {
        clearInterval(this.timeId)
      })
      this.echartInstance.on('mouseout', () => {
        this.timeInterval()
      })
    },
    // 向服务器请求数据
    async getData() {
      const { data: ret } = await this.$http.get('rank')
      this.allData = ret
      // 将数据从大到小排序
      this.allData.sort((a, b) => {
        return b.value - a.value
      })
      this.updataChart()
      this.timeInterval()
    },
    // 将得到的数据渲染到页面
    updataChart() {
      // 这是数据颜色值
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      // 获取x轴的值
      const Xdata = this.allData.map((item) => {
        return item.name
      })
      // 获取y轴的值
      const Ydata = this.allData.map((item) => {
        return {
          value: item.value
        }
      })
      // 将获取数据渲染到浏览器页面
      const updateOption = {
        title: {
          text: '▎地区销售排行',
          left: 20,
          rignt: 20
        },
        grid: {
          top: '30%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          show: true
        },
        xAxis: {
          data: Xdata
        },
        dataZoom: {
          show: false,
          startValue: this.startDataValue,
          endValue: this.endDataValue
        },

        series: [
          {
            data: Ydata,
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null
                if (arg.value > 300) {
                  targetColorArr = colorArr[0]
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  ({
                    offset: 0,
                    color: targetColorArr[0]
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1]
                  })
                ])
              }
            }
          }
        ]
      }
      this.echartInstance.setOption(updateOption)
    },
    // 设置一个定时器，使得图表能搞随时间移动
    timeInterval() {
      this.timeId = setInterval(() => {
        this.startDataValue++
        this.endDataValue++
        if (this.endDataValue > this.allData.length - 1) {
          this.startDataValue = 0
          this.endDataValue = 8
        }
        this.updataChart()
      }, 2000)
    },
    screenAdapter() {
      const titleWidth = (this.$refs.rankDom.offsetWidth / 100) * 3.6
      const option = {
        title: {
          textStyle: {
            fontSize: titleWidth
          }
        },
        series: {
          barWidth: titleWidth * 1.2,
          itemStyle: {
            barBorderRadius: [titleWidth, titleWidth, 0, 0]
          }
        }
      }
      this.echartInstance.setOption(option)
      this.echartInstance.resize()
    }
  }
}
</script>

<style></style>
