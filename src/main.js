import Vue from 'vue'
import XlViews, { XlSelectTree } from 'xl-views'
import 'xl-views/dist/xl-views.css'

import App from './App.vue'
import locationMap from 'xl-views/lib/components/mapForm/mapForm.vue'
import store from './store'
import formCreate from 'xl-form-create'
// 部分组件为了提交考虑需要手动引入

// 地图组件引入时 。需要注意要在 index.html中提前 引入 srcipt 地图脚本

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
