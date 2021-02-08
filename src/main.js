import Vue from 'vue'
import XlViews from 'xl-views'
import 'xl-views/dist/xl-views.css'

import App from './App.vue'
import locationMap from './components/mapForm.vue'
import store from './store'
import formCreate from './dist/form-xl.umd.js'
formCreate.component('location-map', locationMap)

Vue.use(XlViews)
Vue.use(formCreate)
Vue.config.productionTip = false

window.app = new Vue({
  store,
  render () {
    return <App />
  }
}).$mount('#app')
