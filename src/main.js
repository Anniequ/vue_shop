import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/iconfont.js'  //引入ali icon
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'

//
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'  //配置请求的根路径
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios  //每一个组件都可以通过this访问到$http，发ajax

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
