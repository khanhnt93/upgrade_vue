import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

// Import Tailwind CSS
import './assets/scss/style.scss'

// Import Font Awesome CSS
import '@fortawesome/fontawesome-free/css/all.css'

// Import Toast Notification
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Import Google Charts
import VueGoogleCharts from 'vue-google-charts'

// Import Sidebar Menu
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

// Import composables
import { useFormatters } from '@/composables/useFormatters'
import { useToastNotification } from '@/composables/useToast'

// Import global components
import LoadingIcon from '@/components/common/LoadingIcon.vue'

// Create Vue app
const app = createApp(App)

// Register global components
app.component('icon', LoadingIcon)

// Create Pinia store
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Use plugins
app.use(pinia)
app.use(router)
app.use(VueGoogleCharts)
app.use(VueSidebarMenu)

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

// Global properties (replaces Vue 2 filters)
app.config.globalProperties.$formatters = useFormatters()

// Router guard
router.beforeEach((to, from, next) => {
  // Add your authentication logic here
  next()
})

// Mount app
app.mount('#app')
