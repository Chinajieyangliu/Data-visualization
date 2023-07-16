<template>
  <div class="com-comtainer">
    <div class="com-chart" ref="displaydom"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      echartInstance: '',
      allData: '',
      currentPage: 1,
      totalPage: 0,
      timeId: ''
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    // 调用屏幕适配方法，当初始化后调用使得开始就实现屏幕适配
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timeId)
    // 为了反之内存泄漏，关闭窗口后将监听事件销毁
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 获取呈现数据图节点，初始化echartInstance对象
    initChart() {
      this.echartInstance = this.$echarts.init(this.$refs.displaydom, this.theme)
      // 对图表初始化配置
      let initOption = {
        title: {
          text: '▎商家销售统计',
          textStyle: {
            fontSize: 66
          },
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '12%',
          right: '6%',
          bottom: '3%',
          containLable: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              width: 66,
              color: '#2D3443'
            }
          }
        },
        series: {
          type: 'bar',
          barWidth: 66,
          label: {
            show: true,
            position: 'right',
            textStyle: {
              color: 'white'
            }
          },
          itemStyle: {
            barBorderRadius: [0, 33, 33, 0],
            color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: '#5052EE'
              },
              {
                offset: 1,
                color: '#AB6EE5'
              }
            ])
          }
        }
      }
      this.echartInstance.setOption(initOption)

      // 在图表实例绑定点击事件
      this.echartInstance.on('mouseover', () => {
        clearInterval(this.timeId)
      })
      this.echartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取服务端数据
    async getData() {
      const { data: ret } = await this.$http.get('seller')
      this.allData = ret
      // 将数据从大到小排序
      this.allData.sort((a, b) => {
        return a.value - b.value
      })
      // 计算数据的总页数
      this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
      this.updateDateChart()
      this.startInterval()
    },
    // 将获取的数据实时绑定到页面
    updateDateChart() {
      // 先将获取的用户数据进行分组，将每一组的数据渲染到页面上
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const pageData = this.allData.slice(start, end)
      const XData = pageData.map((item) => {
        return item.name
      })
      const Ydata = pageData.map((item) => {
        return item.value
      })
      let opthion = {
        yAxis: {
          data: XData
        },
        series: {
          data: Ydata
        }
      }
      this.echartInstance.setOption(opthion)
    },
    // 绑定一个定时器
    startInterval() {
      // 判断是否存在未被销毁的定时器
      if (this.timeId) {
        clearInterval(this.timeId)
      }
      this.timeId = setInterval(() => {
        this.currentPage >= this.totalPage ? (this.currentPage = 1) : this.currentPage++
        this.updateDateChart()
      }, 3000)
    },
    // 当浏览器的大小发生变化时，进行监视，来完成屏幕的适配
    screenAdapter() {
      // 获取浏览器宽度
      const titleFontSize = (this.$refs.displaydom.offsetWidth / 100) * 3.6

      const screenAdapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: {
          barWidth: titleFontSize,

          itemStyle: {
            barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
          }
        }
      }
      this.echartInstance.setOption(screenAdapterOption)
      this.echartInstance.resize()
    }
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
      this.updateDateChart()
    }
  }
}
</script>

<style></style>
