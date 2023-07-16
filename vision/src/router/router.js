import Vue from 'vue'
import VueRouter from 'vue-router'
import sellerTest from '../views/sellerTest.vue'
import trendTest from '../views/trendTest.vue'
import mapTest from '../views/mapTest.vue'
import rankTest from '../views/rankTest.vue'
import hotTest from '@/views/hotTest.vue'
import stockTest from '@/views/stockTest.vue'
import ScreenPage from '@/views/ScreenPage.vue'
Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/screen'
    },
    {
      path: '/screen',
      component: ScreenPage
    },
    {
      path: '/sellerTest',
      component: sellerTest
    },
    {
      path: '/trendTest',
      component: trendTest
    },
    {
      path: '/mapTest',
      component: mapTest
    },
    {
      path: '/rankTest',
      component: rankTest
    },
    {
      path: '/hotTest',
      component: hotTest
    },
    {
      path: '/stockTest',
      component: stockTest
    }
  ]
})
