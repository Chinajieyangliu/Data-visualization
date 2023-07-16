import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from '@/router/router'
import css from '@/assets/css/global.css'
import iconfont from '@/assets/font/iconfont.css'
import socketService from '@/utils/socket_service'
import store from './store'

//调用方法与后台服务器发生连接
socketService.Instance.connect()
// 请求基准路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
// 将socket中的instance对象挂载到vue的实例对象上
Vue.prototype.$scoket = socketService.instance
// 将axios挂载在vue原型对象上
// 其他组件想使用axios请求使用this.$http
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 将echarts对象挂在在vue的原型对象上
Vue.prototype.$echarts = window.echarts

new Vue({
  render: (h) => h(App),
  router,
  store
}).$mount('#app')
