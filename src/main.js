import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import store from './store'
import formCreate from '@form-create/element-ui'

Vue.use(ElementUI)
Vue.use(formCreate)
Vue.config.productionTip = false

window.app = new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
