import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { useFormatters } from './composables/useFormatters'

console.log('🚀 Starting Vue application...')

// Import Font Awesome CSS first
import '@fortawesome/fontawesome-free/css/all.css'

// Import Tailwind CSS
import './assets/css/tailwind.css'

// Import SCSS styles
import './assets/scss/style.scss'

// Create Pinia store
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

console.log('✅ Pinia store created')

// Create Vue app
const app = createApp(App)

console.log('✅ Vue app instance created')

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('❌ Global error:', err)
  console.error('Component:', instance)
  console.error('Error info:', info)
}

// Global warning handler
app.config.warnHandler = (msg, instance, trace) => {
  console.warn('⚠️ Warning:', msg)
  console.warn('Trace:', trace)
}

// Use plugins
app.use(router)
app.use(pinia)
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

console.log('✅ Plugins registered (Router, Pinia, Toast)')

// Add global formatters
const { formatCurrency, formatNumber, formatDate, capitalize } = useFormatters()
app.config.globalProperties.$formatCurrency = formatCurrency
app.config.globalProperties.$formatNumber = formatNumber
app.config.globalProperties.$formatDate = formatDate
app.config.globalProperties.$capitalize = capitalize

console.log('✅ Global formatters registered')

// Mount app
app.mount('#app')

console.log('✅ App mounted to #app')
