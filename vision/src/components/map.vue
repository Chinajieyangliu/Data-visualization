<template>
  <div class="com-comtainer" @dblclick="rebackChinaMap">
    <div class="com-chart" ref="mapDom"></div>
  </div>
</template>

<script>
import { getProvinceMapInfo } from '@/utils/map_utils'
import axios from 'axios'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      echartInstance: null,
      allData: null,
      CacheData: {}
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
      this.updataChart()
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    // 开启系统的监听功能
    window.addEventListener('resize', this.screenAdapter)
    // 页面刷新是自动调用开启屏幕自适应功能
    this.screenAdapter()
  },
  methods: {
    // 初始化请求数据
    async initChart() {
      this.echartInstance = this.$echarts.init(this.$refs.mapDom, this.theme)
      const ret = await axios.get('http://localhost:8080/static/map/china.json')
      this.$echarts.registerMap('china', ret.data)
      const option = {
        title: {
          text: '▎商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          buttom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.echartInstance.setOption(option)
      // 通过点击视图操作触发点点击事件
      this.echartInstance.on('click', async (arg) => {
        const clickPath = getProvinceMapInfo(arg.name)
        if (!this.CacheData[clickPath.key]) {
          const ret = await this.$http.get('http://localhost:8080' + clickPath.path)
          this.CacheData[clickPath.key] = ret.data
          this.$echarts.registerMap(clickPath.key, ret.data)
        }

        const provinceOptions = {
          geo: {
            map: clickPath.key
          }
        }
        this.echartInstance.setOption(provinceOptions)
      })
    },
    // 获取VIP用户的数据
    async getData() {
      const { data: ret } = await this.$http.get('map')
      this.allData = ret
      this.updataChart()
    },
    // 将获取的数据渲染到页面上
    updataChart() {
      // 将用户进行筛选
      const userArr = this.allData.map((item) => {
        return item.name
      })
      const seriesArr = this.allData.map((item) => {
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'
        }
      })
      const dataOption = {
        legend: {
          data: userArr
        },
        series: seriesArr
      }
      this.echartInstance.setOption(dataOption)
    },
    // 增加一个监听器，用以监视视口的变化
    screenAdapter() {
      const titleSize = (this.$refs.mapDom.offsetWidth / 100) * 3.6
      const updateOption = {
        title: {
          textStyle: {
            fontSize: titleSize
          }
        },
        legend: {
          itemWidth: titleSize / 2,
          itemHeight: titleSize / 2,
          itemGap: titleSize / 2
        }
      }
      this.echartInstance.setOption(updateOption)
      this.echartInstance.resize()
    },
    rebackChinaMap() {
      const rebackOption = {
        geo: {
          map: 'china'
        }
      }
      this.echartInstance.setOption(rebackOption)
    }
  },

  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  }
}
</script>

<style></style>
