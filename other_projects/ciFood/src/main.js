import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

// Import Font Awesome CSS first
import '@fortawesome/fontawesome-free/css/all.css'

// Import Tailwind CSS
import './assets/css/tailwind.css'

// Import Styles
import './assets/scss/style.scss'

// Import Toast Notifications
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

// Add all solid icons to the library
library.add(fas)

// Init chart
import VueGoogleCharts from 'vue-google-charts'

// Create app instance
const app = createApp(App)

// Create Pinia instance
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Configure Toast
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 3,
  newestOnTop: true,
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false
})

// Use plugins
app.use(pinia)
app.use(router)
app.use(VueGoogleCharts)

// Register Font Awesome component globally
app.component('font-awesome-icon', FontAwesomeIcon)

// Mount app
app.mount('#app')
