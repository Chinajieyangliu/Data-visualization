<template>
  <div class="com-comtainer">
    <div class="title">
      <span :style="titleStyle">{{ '▎' + title }}</span>
      <span class="iconfont title-icon" @click="showText = !showText" :style="titleStyle">&#xe6eb;</span>
      <div class="select-icon" v-show="showText">
        <div class="select-item" v-for="item in titleText" :key="item.key" @click="handleSelect(item.key)" :style="leftTitleStyle">{{ item.text }}</div>
      </div>
    </div>

    <div class="com-chart" ref="trendchart"></div>
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
      showText: false,
      SelectData: 'map',
      titleWidth: 0
    }
  },
  // 计算属性渲染可选框的值
  computed: {
    titleText() {
      if (!this.allData) {
        return
      } else {
        return this.allData.type.filter((item) => {
          return item.key != this.SelectData
        })
      }
    },
    title() {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.SelectData].title
      }
    },
    titleStyle() {
      return { fontSize: this.titleWidth + 'px', color: getThemeValue(this.theme).titleColor }
    },
    leftTitleStyle() {
      return { marginLeft: this.titleWidth / 1.6 + 'px', fontSize: this.titleWidth + 'px' }
    },
    ...mapState(['theme'])
  },
  created() {
    this.$scoket.regiestCallback('trendData', this.getData)
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
      this.updateChart()
    }
  },
  mounted() {
    this.initChart()
    this.$scoket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$scoket.unregiestCallback('trendData')
  },
  methods: {
    initChart() {
      this.echartInstance = this.$echarts.init(this.$refs.trendchart, this.theme)

      const initOption = {
        // 建立x轴
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        // 建立y轴
        yAxis: {
          type: 'value'
        },

        grid: {
          left: '3%',
          top: '35%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        }
      }
      this.echartInstance.setOption(initOption)
    },
    getData(ret) {
      // 把数据传到data中
      this.allData = ret
      console.log()
      this.updateChart(this.allData)
    },
    updateChart() {
      // 半透明的颜色值
      const colorArr1 = ['rgba(11, 168, 44, 0.5)', 'rgba(44, 110, 255, 0.5)', 'rgba(22, 242, 217, 0.5)', 'rgba(254, 33, 30, 0.5)', 'rgba(250, 105, 0, 0.5)']
      // 全透明的颜色值
      const colorArr2 = ['rgba(11, 168, 44, 0)', 'rgba(44, 110, 255, 0)', 'rgba(22, 242, 217, 0)', 'rgba(254, 33, 30, 0)', 'rgba(250, 105, 0, 0)']
      // 获得x轴的值
      const XData = this.allData.common.month
      //  获取y轴的值
      const valueArr = this.allData[this.SelectData].data
      // 获取每个月的名字与map的名字相对应
      const legendname = valueArr.map((item) => {
        return item.name
      })
      const Ydata = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: this.SelectData,

          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              },
              {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      const Option = {
        xAxis: {
          data: XData
        },
        series: Ydata,
        legend: {
          data: legendname
        }
      }
      this.echartInstance.setOption(Option)
    },
    screenAdapter() {
      this.titleWidth = (this.$refs.trendchart.offsetWidth / 100) * 3.6
      const screenAdapterOptipn = {
        legend: {
          itemWidth: this.titleWidth,
          itemHeigth: this.titleWidth,
          itemGap: this.titleWidth,
          textStyle: {
            fontSize: this.titleWidth / 2
          }
        }
      }
      this.echartInstance.setOption(screenAdapterOptipn)
      this.echartInstance.resize()
    },
    // 点击切换数据
    handleSelect(item) {
      this.SelectData = item
      this.updateChart()
      this.showText = false
    }
  }
}
</script>

<style lang="less" scoped>
.com-comtainer {
  .title {
    position: absolute;
    z-index: 1;
    left: 20px;
    top: 20px;
    color: #fff;
    .title-icon {
      margin-left: 10px;
      cursor: pointer;
    }
    .select-item {
      cursor: pointer;
    }
  }
}
</style>
