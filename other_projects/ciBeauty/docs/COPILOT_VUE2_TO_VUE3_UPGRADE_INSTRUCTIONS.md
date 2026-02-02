# GitHub Copilot Instructions: Vue 2 to Vue 3 Upgrade Guide

> **How to Use This File**: Copy this file to the root or `.github/` directory of your Vue 2 project. GitHub Copilot will automatically read and follow these instructions when you ask it to help upgrade your project to Vue 3.

---

## 📋 Overview

This document provides comprehensive instructions for upgrading a Vue 2 project to Vue 3. Follow these patterns and guidelines to ensure a successful migration.

**Migration Approach**: Incremental migration with backward compatibility where possible, using Vue 3's Options API to maintain Vue 2 code patterns.

---

## 🎯 Migration Phases

### Phase 1: Dependencies & Build Tool
### Phase 2: Core Vue 3 API Changes
### Phase 3: Router Migration (v3 → v4)
### Phase 4: State Management (Vuex → Pinia)
### Phase 5: Component Updates
### Phase 6: UI Framework Migration (if applicable)

---

## 📦 Phase 1: Dependencies & Build Tool

### 1.1 Update package.json Dependencies

**Remove Vue 2 packages:**
```json
{
  "devDependencies": {
    "vue-template-compiler": "REMOVE",
    "babel-preset-es2015": "REMOVE"
  }
}
```

**Add Vue 3 core packages:**
```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "pinia-plugin-persistedstate": "^3.2.0"
  }
}
```

### 1.2 Migrate from Webpack to Vite

**Create vite.config.js:**
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080, // Your preferred port
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // Fix Sass deprecation warnings
      }
    }
  }
})
```

**Install Vite dependencies:**
```bash
npm install -D vite @vitejs/plugin-vue
```

**Update package.json scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 1.3 Update index.html

Move `index.html` to project root and update:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### 1.4 Environment Variables

**Create environment files:**
- `.env.development`
- `.env.production`

**Update variable names:**
```bash
# Old (Webpack)
VUE_APP_API_URL=http://localhost:3000

# New (Vite)
VITE_API_URL=http://localhost:3000
```

**Update code references:**
```javascript
// Old
process.env.VUE_APP_API_URL

// New
import.meta.env.VITE_API_URL
```

---

## 🔧 Phase 2: Core Vue 3 API Changes

### 2.1 Update main.js

**Before (Vue 2):**
```javascript
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

**After (Vue 3):**
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(pinia)
app.mount('#app')
```

### 2.2 Remove Vue 2 Filters

Vue 3 removed global filters. Replace with methods or composables.

**Before (Vue 2):**
```javascript
// main.js
Vue.filter('currency', function(value) {
  if (!value) return ''
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

// Component
<template>
  <div>{{ amount | currency }}</div>
</template>
```

**After (Vue 3) - Option 1: Methods:**
```javascript
// Component
<template>
  <div>{{ formatCurrency(amount) }}</div>
</template>

<script>
export default {
  methods: {
    formatCurrency(value) {
      if (!value) return ''
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
```

**After (Vue 3) - Option 2: Composable (Recommended):**
```javascript
// src/composables/useFormatters.js
export function useFormatters() {
  const formatCurrency = (value) => {
    if (!value && value !== 0) return ''
    return new Intl.NumberFormat('en-US').format(value)
  }
  
  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US')
  }
  
  return { formatCurrency, formatDate }
}

// Component usage
<template>
  <div>{{ formatCurrency(amount) }}</div>
</template>

<script>
import { useFormatters } from '@/composables/useFormatters'

export default {
  setup() {
    const { formatCurrency } = useFormatters()
    return { formatCurrency }
  }
}
</script>
```

### 2.3 Update Lifecycle Hooks

No changes needed if using Options API, but be aware:
- `beforeDestroy` → `beforeUnmount`
- `destroyed` → `unmounted`

**Recommendation**: Update for consistency
```javascript
// Old
beforeDestroy() {
  // cleanup
}

// New
beforeUnmount() {
  // cleanup
}
```

---

## 🛣️ Phase 3: Vue Router Migration (v3 → v4)

### 3.1 Update router/index.js

**Before (Vue Router 3):**
```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
```

**After (Vue Router 4):**
```javascript
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
```

### 3.2 Navigation Guards Updates

**Signature changes:**
```javascript
// Old
router.beforeEach((to, from, next) => {
  // Must call next()
  if (isAuthenticated) {
    next()
  } else {
    next('/login')
  }
})

// New - Can return value instead of calling next()
router.beforeEach((to, from) => {
  if (!isAuthenticated) {
    return '/login' // or { name: 'Login' }
  }
  // returning undefined/true allows navigation
})
```

---

## 🏪 Phase 4: State Management (Vuex → Pinia)

### 4.1 Install Pinia

```bash
npm install pinia pinia-plugin-persistedstate
```

### 4.2 Create Pinia Store

**Create src/stores/auth.js:**
```javascript
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: Cookies.get('APP_USER') ? JSON.parse(Cookies.get('APP_USER')) : null,
    token: Cookies.get('TOKEN') || null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    userId: (state) => state.user?.id || null,
  },
  
  actions: {
    updateUser(user) {
      this.user = user
      Cookies.set('APP_USER', JSON.stringify(user), { expires: 365 })
    },
    
    updateToken(token) {
      this.token = token
      Cookies.set('TOKEN', token, { expires: 365 })
    },
    
    logout() {
      this.user = null
      this.token = null
      Cookies.remove('APP_USER')
      Cookies.remove('TOKEN')
    }
  },
  
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth',
        storage: localStorage,
        paths: ['user', 'token']
      }
    ]
  }
})
```

### 4.3 Register Pinia in main.js

```javascript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
```

### 4.4 Update Components to Use Pinia

**Before (Vuex):**
```javascript
export default {
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  methods: {
    login(userData) {
      this.$store.commit('SET_USER', userData)
      // or
      this.$store.dispatch('updateUser', userData)
    }
  }
}
```

**After (Pinia with Options API):**
```javascript
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  
  computed: {
    user() {
      return this.authStore.user
    }
  },
  
  methods: {
    login(userData) {
      this.authStore.updateUser(userData)
    }
  }
}
```

### 4.5 Common Vuex to Pinia Migration Patterns

**Pattern 1: Access State**
```javascript
// Old
this.$store.state.user
this.$store.state.user.id

// New
this.authStore.user
this.authStore.user.id
```

**Pattern 2: Call Actions**
```javascript
// Old
this.$store.commit('SET_USER', userData)
this.$store.dispatch('updateUser', userData)

// New
this.authStore.updateUser(userData)
```

**Pattern 3: Use Getters**
```javascript
// Old
this.$store.getters.isAuthenticated

// New
this.authStore.isAuthenticated
```

---

## 🎨 Phase 5: Component Updates

### 5.1 Options API (Recommended for Migration)

Keep using Options API for easier migration. No changes needed for most components.

```vue
<script>
export default {
  name: 'MyComponent',
  data() {
    return {
      message: 'Hello'
    }
  },
  methods: {
    handleClick() {
      console.log(this.message)
    }
  }
}
</script>
```

### 5.2 Add Composition API Gradually (Optional)

For new components or refactoring, use Composition API:

```vue
<script setup>
import { ref, computed } from 'vue'

const message = ref('Hello')
const upperMessage = computed(() => message.value.toUpperCase())

function handleClick() {
  console.log(message.value)
}
</script>
```

### 5.3 Update Event Emitters

**Before:**
```vue
<template>
  <button @click="$emit('submit', data)">Submit</button>
</template>

<script>
export default {
  methods: {
    handleSubmit() {
      this.$emit('submit', this.data)
    }
  }
}
</script>
```

**After (Options API - no change needed):**
```vue
<template>
  <button @click="$emit('submit', data)">Submit</button>
</template>

<script>
export default {
  emits: ['submit'], // Recommended to declare emits
  methods: {
    handleSubmit() {
      this.$emit('submit', this.data)
    }
  }
}
</script>
```

### 5.4 Update v-model

**Vue 3 changes:**
- `v-model` now uses `modelValue` prop instead of `value`
- Custom v-model event is `update:modelValue` instead of `input`

**Before (Vue 2):**
```vue
<script>
export default {
  props: ['value'],
  methods: {
    updateValue(newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>
```

**After (Vue 3):**
```vue
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  methods: {
    updateValue(newValue) {
      this.$emit('update:modelValue', newValue)
    }
  }
}
</script>
```

---

## 🔔 Phase 6: Toast Notifications (if using Bootstrap Vue)

### 6.1 Install vue-toastification

```bash
npm install vue-toastification@next --save
```

### 6.2 Configure in main.js

```javascript
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

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
```

### 6.3 Create Composable

**Create src/composables/useToast.js:**
```javascript
import { useToast as useToastification } from 'vue-toastification'

export function useToast() {
  const toast = useToastification()
  
  const popToast = (variant, content) => {
    switch(variant) {
      case 'success': 
        toast.success(content)
        break
      case 'danger':
      case 'error':
        toast.error(content)
        break
      case 'warning':
        toast.warning(content)
        break
      case 'info':
      default:
        toast.info(content)
    }
  }
  
  return { popToast, toast }
}
```

### 6.4 Update Components

**Before (Bootstrap Vue):**
```javascript
export default {
  methods: {
    showToast() {
      this.$bvToast.toast('Success message', {
        variant: 'success',
        autoHideDelay: 3000
      })
    }
  }
}
```

**After (vue-toastification - Options API):**
```javascript
import { useToast } from 'vue-toastification'

export default {
  setup() {
    const toast = useToast()
    return { toast }
  },
  
  methods: {
    popToast(variant, content) {
      switch(variant) {
        case 'success': this.toast.success(content); break
        case 'danger': this.toast.error(content); break
        case 'warning': this.toast.warning(content); break
        default: this.toast.info(content)
      }
    },
    
    showToast() {
      this.popToast('success', 'Success message')
    }
  }
}
```

---

## 🎯 Common Migration Patterns

### Pattern 1: Component Registration

**Before (Vue 2):**
```javascript
import MyComponent from './MyComponent.vue'

Vue.component('my-component', MyComponent)
```

**After (Vue 3):**
```javascript
import MyComponent from './MyComponent.vue'

app.component('my-component', MyComponent)
```

### Pattern 2: Global Properties

**Before (Vue 2):**
```javascript
Vue.prototype.$api = api
Vue.prototype.$utils = utils

// Usage
this.$api.get()
```

**After (Vue 3):**
```javascript
app.config.globalProperties.$api = api
app.config.globalProperties.$utils = utils

// Usage (same)
this.$api.get()
```

### Pattern 3: Async Component Loading

**Before (Vue 2):**
```javascript
const AsyncComponent = () => import('./AsyncComponent.vue')
```

**After (Vue 3):**
```javascript
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
)
```

### Pattern 4: Multiple Root Elements

Vue 3 supports multiple root elements (fragments):

```vue
<!-- Vue 3 - Valid -->
<template>
  <div>Element 1</div>
  <div>Element 2</div>
  <div>Element 3</div>
</template>
```

### Pattern 5: Teleport (Portal in Vue 2)

**Before (Vue 2 with portal-vue):**
```vue
<portal to="modal">
  <div>Modal content</div>
</portal>
```

**After (Vue 3):**
```vue
<teleport to="#modal">
  <div>Modal content</div>
</teleport>
```

---

## ⚠️ Breaking Changes to Watch

### 1. Removed APIs

**Completely removed in Vue 3:**
- `Vue.config.productionTip`
- `Vue.observable()` → use `reactive()` instead
- `$on`, `$off`, `$once` → use mitt or native EventTarget
- `$children` → use refs or provide/inject
- `$listeners` → merged into `$attrs`
- `keyCode` modifiers → use key names
- `.native` modifier → no longer needed
- Filters (`|` pipe syntax)

### 2. Updated APIs

**Changed behavior:**
- `v-model` → uses `modelValue` and `update:modelValue`
- `v-bind` order → later bindings override earlier ones
- `$attrs` → includes `class` and `style` now
- Transition classes → `v-enter` becomes `v-enter-from`

### 3. Functional Components

**Simplified in Vue 3:**
```javascript
// Vue 2
export default {
  functional: true,
  render(h, context) {
    return h('div', context.props.message)
  }
}

// Vue 3
export default function(props, { slots, attrs }) {
  return h('div', props.message)
}
```

---

## 📋 Migration Checklist

Use this checklist when migrating:

### Core Setup
- [ ] Update package.json dependencies
- [ ] Migrate from Webpack to Vite
- [ ] Create vite.config.js
- [ ] Move index.html to root
- [ ] Update environment variables (VUE_APP_* → VITE_*)
- [ ] Update main.js to use createApp()

### Router
- [ ] Update to Vue Router 4
- [ ] Change `new VueRouter` → `createRouter`
- [ ] Change `mode: 'history'` → `createWebHistory()`
- [ ] Update navigation guards (optional next() parameter)

### State Management
- [ ] Install Pinia and persistence plugin
- [ ] Create Pinia stores
- [ ] Register Pinia in main.js
- [ ] Update all components using `this.$store`
  - [ ] Replace state access: `this.$store.state.x` → `this.store.x`
  - [ ] Replace commits: `this.$store.commit()` → `this.store.action()`
  - [ ] Replace dispatches: `this.$store.dispatch()` → `this.store.action()`

### Components
- [ ] Remove global filters, create methods/composables
- [ ] Update lifecycle hooks (beforeDestroy → beforeUnmount)
- [ ] Declare emits in components
- [ ] Update v-model props (value → modelValue)
- [ ] Remove `.native` modifiers
- [ ] Update keyCode modifiers to key names

### Toast/Notifications (if applicable)
- [ ] Install vue-toastification
- [ ] Configure in main.js
- [ ] Create useToast composable
- [ ] Replace all `$bvToast` calls

### Testing
- [ ] Run `npm run dev` and check for errors
- [ ] Test all routes
- [ ] Test authentication flow
- [ ] Test form submissions
- [ ] Test API calls
- [ ] Run `npm run build` for production

### Cleanup
- [ ] Remove old Vuex store files
- [ ] Remove Webpack config files
- [ ] Remove babel.config.js if not needed
- [ ] Remove unused dependencies
- [ ] Update .gitignore for Vite

---

## 🚀 Step-by-Step Migration Process

### Day 1: Setup & Dependencies
1. Backup your project (create a branch)
2. Update package.json dependencies
3. Install Vite and configure
4. Update index.html
5. Update environment variables
6. Test: `npm run dev`

### Day 2: Core Vue & Router
1. Update main.js
2. Migrate Vue Router
3. Test routing and navigation
4. Fix any console errors

### Day 3: State Management
1. Install Pinia
2. Create auth store
3. Update 3-5 components to use Pinia
4. Test authentication flow

### Day 4-5: Component Updates
1. Search for all `this.$store` references
2. Update components one by one
3. Remove filters, create composables
4. Test each component after update

### Day 6: Toast & Notifications
1. Install vue-toastification
2. Create composable
3. Replace all toast calls
4. Test notifications

### Day 7: Testing & Cleanup
1. Full application testing
2. Production build test
3. Remove old files
4. Update documentation

---

## 💡 Tips for GitHub Copilot

When working with GitHub Copilot on this migration:

1. **Be Specific**: Ask "Update this component from Vuex to Pinia using Options API"
2. **One Step at a Time**: Don't try to migrate everything at once
3. **Use Context**: Keep relevant files open so Copilot understands the project structure
4. **Review Changes**: Always review Copilot's suggestions before accepting
5. **Test Frequently**: Test after each migration step

**Example Prompts:**
- "Migrate this component from Vue 2 to Vue 3, keeping Options API"
- "Replace this.$store.state.user with Pinia useAuthStore"
- "Update this filter to a composable function"
- "Convert this $bvToast call to vue-toastification"

---

## 📚 Additional Resources

- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue Router 4 Migration](https://router.vuejs.org/guide/migration/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [vue-toastification](https://github.com/Maronato/vue-toastification)

---

## 🎉 Success Criteria

Your migration is complete when:

✅ Application runs with `npm run dev`  
✅ All routes work correctly  
✅ Authentication flow works  
✅ State management works (Pinia)  
✅ Forms submit successfully  
✅ Notifications display correctly  
✅ Production build succeeds (`npm run build`)  
✅ No Vue 2 packages in package.json  
✅ No console errors or warnings  

---

**Last Updated**: December 27, 2025  
**Based on Project**: FEM_WEB_BK - Expense Management System  
**Vue Version**: 2.x → 3.4.0
