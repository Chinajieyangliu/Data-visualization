<template>
  <div class="screen-container" :style="entiretyTheme">
    <header class="screen-header">
      <div>
        <img alt="" :src="headerSrc" />
      </div>
      <span class="logo">
        <img alt="" :src="logoSrc" />
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img class="qiehuan" :src="themeSrc" @click="handlechangeTheme" />
        <span class="datetime">2049-01-01 00:00:00</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[this.fullScreenStatus.trend ? 'fullscreen' : '']">
          <!-- 销量趋势图表 -->
          <trend ref="trend"></trend>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('trend')" :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[this.fullScreenStatus.seller ? 'fullscreen' : '']">
          <!-- 商家销售金额图表 -->
          <seller ref="seller"></seller>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('seller')" :class="['iconfont', fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="[this.fullScreenStatus.mapPlay ? 'fullscreen' : '']">
          <!-- 商家分布图表 -->
          <mapPlay ref="mapPlay"></mapPlay>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('mapPlay')" :class="['iconfont', fullScreenStatus.mapPlay ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[this.fullScreenStatus.rank ? 'fullscreen' : '']">
          <!-- 地区销量排行图表 -->
          <rank ref="rank"></rank>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('rank')" :class="['iconfont', fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[this.fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- 热销商品占比图表 -->
          <hot ref="hot"> </hot>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('hot')" :class="['iconfont', fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="right-bottom" :class="[this.fullScreenStatus.stock ? 'fullscreen' : '']">
          <stock ref="stock"></stock>
          <!-- 库存销量分析图表 -->
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('stock')" :class="['iconfont', fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import hot from '@/components/hot.vue'
import mapPlay from '@/components/map.vue'
import rank from '@/components/rank.vue'
import seller from '@/components/seller.vue'
import stock from '@/components/stock.vue'
import trend from '@/components/trend.vue'
// 导入vuex的mapstate方法
import { mapState } from 'vuex'
import { getThemeValue } from '../utils/theme_utils'

export default {
  data() {
    return {
      fullScreenStatus: {
        hot: false,
        mapPlay: false,
        rank: false,
        seller: false,
        stock: false,
        trend: false
      }
    }
  },
  created() {
    this.$scoket.regiestCallback('fullScreen', this.recvData)
    this.$scoket.regiestCallback('themeChange', this.themeChange)
  },
  destroyed() {
    this.$scoket.unregiestCallback('fullScreen')
    this.$scoket.unregiestCallback('themeChange')
  },
  computed: {
    logoSrc() {
      return '/static/img/' + getThemeValue(this.theme).logoSrc
    },
    headerSrc() {
      return '/static/img/' + getThemeValue(this.theme).headerBorderSrc
    },
    themeSrc() {
      return '/static/img/' + getThemeValue(this.theme).themeSrc
    },
    entiretyTheme() {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  },
  components: {
    hot,
    mapPlay,
    rank,
    seller,
    stock,
    trend
  },
  methods: {
    changeSize(chartName) {
      const targetValue = !this.fullScreenStatus[chartName]
      this.$scoket.send({
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName: chartName,
        value: targetValue
      })
    },
    recvData(data) {
      console.log(data)
      const chartName = data.chartName
      const targetValue = data.value
      this.fullScreenStatus[chartName] = targetValue
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
    },
    handlechangeTheme() {
      // 修改VueX中数据
      this.$scoket.send({
        action: 'themeChange',
        socketType: 'themeChange',
        chartName: '',
        value: ''
      })
    },
    themeChange() {
      this.$store.commit('changeTheme')
    }
  }
}
</script>
<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 128px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
.com-comtainer {
  position: relative;
}
</style>
