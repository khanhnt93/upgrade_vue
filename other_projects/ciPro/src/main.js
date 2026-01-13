import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

// Import Tailwind CSS
import './assets/css/tailwind.css'

// Import existing SCSS styles
import './assets/scss/style.scss'

// Import vue-toastification
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Import Font Awesome Free
import '@fortawesome/fontawesome-free/css/all.css'

// Import VueGoogleCharts
import VueGoogleCharts from 'vue-google-charts'

// Create Vue app
const app = createApp(App)

// Create and configure Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Configure vue-toastification
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

// Register plugins and components
app.use(router)
app.use(pinia)
app.use(VueGoogleCharts)

// Mount app
app.mount('#app')
