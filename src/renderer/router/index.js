import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-page',
      component: require('@/pages/MainPage').default
    },
    {
      path: '/loading',
      name: 'loading-page',
      component: require('@/pages/LoadingPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
