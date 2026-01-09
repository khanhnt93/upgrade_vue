import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.css'

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.css'

// Import Vue Sidebar Menu CSS
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

// svg: loading
import * as svgicon from 'vue-svgicon'
import './icons.js'

// Init chart
import VueGoogleCharts from 'vue-google-charts'

// Create Vue app
const app = createApp(App)

// Create and configure Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Use plugins
app.use(router)
app.use(pinia)
app.use(svgicon, {
  tagName: 'icon'
})
app.use(VueGoogleCharts)

// Configure Toast
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 3,
  newestOnTop: true,
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
})

// Mount app
app.mount('#app')
