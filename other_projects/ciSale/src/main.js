import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// Import VueBoostrap
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)


// Import Global Filters
import '@/filters'

// svg: loading
import * as svgicon from 'vue-svgicon'
import './icons.js'

Vue.use(svgicon, {
  tagName: 'icon'
})

// Some middleware to help us ensure the user is authenticated.
router.beforeEach((to, from, next) => {
    next()
});

// Init chart
import VueGoogleCharts from 'vue-google-charts'
Vue.use(VueGoogleCharts)


new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
