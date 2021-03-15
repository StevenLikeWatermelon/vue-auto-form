import Vue from 'vue'
import XlViews, { XlSelectTree } from 'xl-views'
import 'xl-views/dist/xl-views.css'

import App from './App.vue'
import locationMap from './components/mapForm.vue'
import store from './store'
import formCreate from 'xl-form-create'
formCreate.component('locationMap', locationMap)
formCreate.component('selectTree', XlSelectTree)

Vue.use(XlViews)
Vue.use(formCreate)
Vue.config.productionTip = false

window.app = new Vue({
  store,
  render () {
    return <App />
  }
}).$mount('#app')
