<template>
  <div class="com-comtainer">
    <div class="com-chart" ref="hotDom"></div>
    <span class="iconfont arr-left" @click="toleft" :style="changeStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toright" :style="changeStyle">&#xe6ed;</span>
    <span class="cut-title" :style="changeStyle">{{ cutname }}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '../utils/theme_utils'
export default {
  data() {
    return {
      echartInstance: null,
      allData: null,
      firstIndex: 0,
      titleWidth: 0
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
  },
  computed: {
    cutname() {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.firstIndex].name
      }
    },
    changeStyle() {
      return { fontSize: this.titleWidth + 'px', color: getThemeValue(this.theme).titleColor }
    },
    ...mapState(['theme'])
  },
  methods: {
    // 初始化
    initChart() {
      this.echartInstance = this.$echarts.init(this.$refs.hotDom, this.theme)
      const initOption = {
        title: {
          text: '▎热销商品的占比',
          left: 20,
          top: 20
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ],
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          formatter: (scg) => {
            //  第一次遍历，遍历出每一遍的总价
            const thirdCategory = scg.data.children
            // 每次遍历的总价
            let total = 0
            // 开始遍历
            thirdCategory.forEach((item) => {
              return (total += item.value)
            })
            // 求出每个热销商品所占的比例
            let str = ''
            thirdCategory.forEach((item) => {
              str += `${item.name} : ${parseInt((item.value / total) * 100) + '%'}${'  '}`
              return str
            })
            return str
          }
        }
      }
      this.echartInstance.setOption(initOption)
    },
    // 获取请求数据
    async getData() {
      const { data: ret } = await this.$http.get('hotproduct')
      this.allData = ret
      this.updataChart()
    },
    // 将数据渲染到页面上
    updataChart() {
      const pieData = this.allData[this.firstIndex].children.map((item) => {
        return {
          name: item.name,
          value: item.value,
          // 取出三级目录
          children: item.children
        }
      })

      const Xname = this.allData[this.firstIndex].children.map((item) => {
        return item.name
      })
      const updateOption = {
        series: [
          {
            data: pieData
          }
        ],
        legend: {
          name: Xname
        }
      }
      this.echartInstance.setOption(updateOption)
    },
    toleft() {
      this.firstIndex--
      if (this.firstIndex < 0) {
        this.firstIndex = this.allData.length - 1
      }

      this.updataChart()
    },
    toright() {
      this.firstIndex++
      if (this.firstIndex > this.allData.length - 1) {
        this.firstIndex = 0
      }

      this.updataChart()
    },
    // 监听窗口变化
    screenAdapter() {
      this.titleWidth = (this.$refs.hotDom.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleWidth
          }
        },
        legend: {
          itemWidth: this.titleWidth,
          itemHeight: this.titleWidth,
          itemGap: this.titleWidth,
          textStyle: {
            fontSize: this.titleWidth / 2
          }
        },
        series: {
          radius: this.titleWidth * 4.5,
          center: ['50%', '60%']
        }
      }
      this.echartInstance.setOption(adapterOption)
      this.echartInstance.resize()
    }
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
  }
}
</script>

<style land="less" scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cut-title {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: white;
}
</style>
