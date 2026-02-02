import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import JsonExcel from 'vue-json-excel3'

// Import Tailwind CSS
import './assets/css/tailwind.css'

// Import Toast Notifications
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.css'

// Import vue-sidebar-menu
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

// Import Google Charts
import VueGoogleCharts from 'vue-google-charts'

const app = createApp(App)

// Setup Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Setup Router
app.use(router)

// Setup Toast
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

// Setup Google Charts
app.use(VueGoogleCharts)

// Register vue-json-excel globally for report components
app.component('downloadExcel', JsonExcel)

// Navigation guard
router.beforeEach((to, from) => {
    // Your existing navigation logic
    // Note: No need to call next() in Vue Router 4
    // Just return true to proceed, or a route path to redirect
    return true
})

try {
    app.mount('#app')
    console.log('App mounted successfully!')
} catch (error) {
    console.error('Error mounting app:', error)
}
