# Vue 2 to Vue 3 Migration Guide with Tailwind CSS

## Table of Contents
1. [How to Use This Guide with GitHub Copilot](#how-to-use-this-guide-with-github-copilot)
2. [Prerequisites](#prerequisites)
3. [Core Dependencies Update](#core-dependencies-update)
4. [Breaking Changes & Migration Steps](#breaking-changes--migration-steps)
5. [Vue Bootstrap to Tailwind CSS Migration](#vue-bootstrap-to-tailwind-css-migration)
6. [Library Compatibility](#library-compatibility)
7. [Code Patterns to Update](#code-patterns-to-update)
8. [Testing Strategy](#testing-strategy)

---

## How to Use This Guide with GitHub Copilot

### Method 1: Using Chat Context (Recommended)
1. **Open GitHub Copilot Chat** in VS Code (`Ctrl+Shift+I` or `Cmd+Shift+I`)
2. **Attach this file as context**:
   - Click the paperclip icon (📎) in the chat input
   - Select "Add File to Chat"
   - Choose this `VUE2_TO_VUE3_MIGRATION_GUIDE.md` file
3. **Ask specific questions** like:
   - "Based on the migration guide, update this component to Vue 3"
   - "Migrate this Vue Bootstrap button to Tailwind CSS according to the guide"
   - "Check if this library is compatible with Vue 3 per the guide"

### Method 2: Using Workspace Instructions
1. **Create a `.github` folder** in your project root (if not exists)
2. **Create `.github/copilot-instructions.md`** file
3. **Add reference** to this guide:
   ```markdown
   When working with Vue files in this project, follow the migration guide in VUE2_TO_VUE3_MIGRATION_GUIDE.md
   ```
4. GitHub Copilot will automatically consider these instructions when providing suggestions

### Method 3: Inline Comments
Add comments in your code files:
```javascript
// TODO: Migrate to Vue 3 - See VUE2_TO_VUE3_MIGRATION_GUIDE.md section on [specific topic]
```

### Method 4: VS Code Settings
Add to your `.vscode/settings.json`:
```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "Follow the Vue 2 to Vue 3 migration guidelines in VUE2_TO_VUE3_MIGRATION_GUIDE.md"
    }
  ]
}
```

---

## Prerequisites

### Current Project Stack
- Vue 2.x
- Vue Router 3.x
- Vuex 3.x
- Vue Bootstrap
- Webpack 4.x

### Target Stack
- Vue 3.x
- Vue Router 4.x
- Pinia (Vuex 4.x or Pinia recommended)
- Tailwind CSS 3.x
- Vite (optional, but recommended over Webpack)

### Required Knowledge
- Understanding of Composition API (Vue 3's new approach)
- Basic Tailwind CSS concepts
- Module bundler configuration

---

## Core Dependencies Update

### Step 1: Update package.json

#### Remove (Vue 2 packages):
```json
{
  "vue": "^2.x.x",
  "vue-template-compiler": "^2.x.x",
  "vue-router": "^3.x.x",
  "vuex": "^3.x.x",
  "bootstrap-vue": "^2.x.x",
  "bootstrap": "^4.x.x"
}
```

#### Add (Vue 3 packages):
```json
{
  "vue": "^3.4.0",
  "vue-router": "^4.2.0",
  "pinia": "^2.1.0",
  "@vitejs/plugin-vue": "^5.0.0",
  "vite": "^5.0.0"
}
```

#### Add Tailwind CSS:
```json
{
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0"
}
```

### Step 2: Install Dependencies
```bash
npm install vue@next vue-router@4 pinia
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npm install -D vite @vitejs/plugin-vue
npm uninstall bootstrap-vue bootstrap vue-template-compiler
```

### Step 3: Verify Installation

After installing dependencies, verify the installation is successful:

```bash
# Clean install to ensure no conflicts
npm install

# Check for any dependency issues
npm audit

# Verify the dev server starts (may show errors initially - this is expected)
npm run dev
```

**Expected outcomes:**
- ✅ `npm install` completes without errors
- ⚠️ `npm run dev` may show compilation errors (normal at this stage)
- ❌ If `npm install` fails, check for peer dependency conflicts

**Common issues at this stage:**

1. **Peer dependency warnings**: Usually safe to ignore initially
2. **Build errors**: Expected until you update main.js and component files
3. **Module not found errors**: Double-check all Vue 3 packages are installed

**Troubleshooting:**

```bash
# If errors persist, try clearing cache
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Verify Vue version
npm list vue
# Should show: vue@3.x.x

# Verify Vue Router version
npm list vue-router
# Should show: vue-router@4.x.x
```

**Note**: Don't proceed to code migration until `npm install` completes successfully. The dev server (`npm run dev`) will work properly only after updating main.js and core files in the next sections.

---

## Breaking Changes & Migration Steps

### 1. **Global API Changes**

#### Vue 2 Pattern:
```javascript
// main.js
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

#### Vue 3 Pattern:
```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store' // or import pinia

const app = createApp(App)

app.use(router)
app.use(store)
app.mount('#app')
```

### 2. **Component Definition Changes**

#### Vue 2 - Options API:
```vue
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  name: 'MyComponent',
  data() {
    return {
      message: 'Hello'
    }
  },
  methods: {
    updateMessage() {
      this.message = 'Updated'
    }
  },
  mounted() {
    console.log('Mounted')
  }
}
</script>
```

#### Vue 3 - Composition API (Recommended):
```vue
<template>
  <div>{{ message }}</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const message = ref('Hello')

const updateMessage = () => {
  message.value = 'Updated'
}

onMounted(() => {
  console.log('Mounted')
})
</script>
```

**Note**: Vue 3 still supports Options API, but Composition API is recommended for new code.

### 3. **V-Model Changes**

#### Vue 2:
```vue
<!-- Parent -->
<ChildComponent v-model="value" />

<!-- Child -->
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

#### Vue 3:
```vue
<!-- Parent -->
<ChildComponent v-model="value" />

<!-- Child -->
<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const updateValue = (newValue) => {
  emit('update:modelValue', newValue)
}
</script>
```

### 4. **Filters Removed**

#### Vue 2:
```vue
<template>
  <div>{{ price | currency }}</div>
</template>

<script>
export default {
  filters: {
    currency(value) {
      return '$' + value.toFixed(2)
    }
  }
}
</script>
```

#### Vue 3 (Use methods or computed):
```vue
<template>
  <div>{{ formatCurrency(price) }}</div>
</template>

<script setup>
const formatCurrency = (value) => {
  return '$' + value.toFixed(2)
}
</script>
```

**TODO Pattern**: When encountering filters, add:
```javascript
// TODO: MIGRATE - Convert filter to method or composable
// Original filter: {{ value | filterName }}
// See VUE2_TO_VUE3_MIGRATION_GUIDE.md section on Filters
```

### 5. **Event Bus Removed**

#### Vue 2 (Event Bus):
```javascript
// event-bus.js
import Vue from 'vue'
export const EventBus = new Vue()

// Usage
EventBus.$emit('event-name', data)
EventBus.$on('event-name', callback)
```

#### Vue 3 (Use mitt or Pinia):
```javascript
// Use mitt library
import mitt from 'mitt'
export const emitter = mitt()

// Usage
emitter.emit('event-name', data)
emitter.on('event-name', callback)
```

**Or use Pinia for state management**:
```javascript
// stores/events.js
import { defineStore } from 'pinia'

export const useEventStore = defineStore('events', {
  state: () => ({
    currentEvent: null
  }),
  actions: {
    triggerEvent(data) {
      this.currentEvent = data
    }
  }
})
```

### 6. **Vue Router Changes**

#### Vue 2 Router:
```javascript
// router/index.js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    }
  ]
})
```

#### Vue 3 Router:
```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: Home
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

#### Navigation Guards Update:
```javascript
// Vue 2
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    next('/login')
  } else {
    next()
  }
})

// Vue 3 (same, but can return value)
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth) {
    return '/login'
  }
  // Implicit return undefined = proceed
})
```

### 7. **Vuex to Pinia Migration**

#### Vue 2 Vuex Store:
```javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    }
  },
  actions: {
    login({ commit }, credentials) {
      // API call
      commit('SET_USER', user)
    }
  },
  getters: {
    isLoggedIn: state => !!state.user
  }
})
```

#### Vue 3 Pinia Store (Recommended):
```javascript
// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  getters: {
    isLoggedIn: (state) => !!state.user
  },
  actions: {
    async login(credentials) {
      // API call
      this.user = user
    }
  }
})

// Usage in component
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
userStore.login(credentials)
```

#### If keeping Vuex 4:
```javascript
// store/index.js
import { createStore } from 'vuex'

export const store = createStore({
  state: {
    user: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    }
  },
  actions: {
    login({ commit }, credentials) {
      commit('SET_USER', user)
    }
  }
})
```

---

## Vue Bootstrap to Tailwind CSS Migration

### Migration Status (Updated: December 25, 2025)

**✅ COMPLETED MIGRATIONS:**

1. **src/views/admin/over_view/OverView.vue** - Dashboard with charts
   - Migrated: `b-row`, `b-col`, `b-card` → Tailwind grid system
   - Converted to Composition API (`<script setup>`)
   - Status: ✅ Complete

2. **src/views/supperAdmin/storeAdmin/List.vue** - Store admin list
   - Migrated: `b-table`, `b-modal`, `b-list-group`, `b-form-select`
   - Replaced: `$bvModal`, `$bvToast` → Native confirm/alert + vue-toastification
   - Status: ✅ Complete

3. **src/views/supperAdmin/store/List.vue** - Store list
   - Migrated: `b-table`, `b-list-group`
   - Fixed: Invalid closing tags
   - Status: ✅ Complete

4. **src/views/admin/statistic/Statistic.vue** - Statistics page
   - Migrated: `b-row`, `b-col`, `b-form-select`
   - Preserved: GChart components
   - Status: ✅ Complete

5. **src/views/admin/income/IncomeList.vue** - Income list
   - Migrated: `b-table`, `b-modal`, `b-list-group`, `b-form-select`, `b-button`
   - Added: Modal state management with `showApproveModal`
   - Status: ✅ Complete

6. **src/views/supperAdmin/storeAdmin/Index.vue** - Store admin form
   - Migrated: `b-row`, `b-col`, `b-card`, `b-button`, `b-form-select`, `b-form-invalid-feedback`
   - Replaced: `$bvModal.msgBoxOk` → Native `alert()`
   - Status: ✅ Complete

**🔧 TOAST NOTIFICATION SYSTEM:**

Installed and configured `vue-toastification@next` for Vue 3:
```bash
npm install vue-toastification@next
```

Configured in `src/main.js`:
```javascript
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

app.use(Toast, {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  icon: true
})
```

**Migration Pattern for Toast:**
```javascript
// Old Bootstrap Vue pattern
popToast(variant, content) {
  this.$bvToast.toast(content, {
    variant: variant,
    autoHideDelay: 3000
  })
}

// New vue-toastification pattern (Composition API)
import { useToast } from 'vue-toastification'
const toast = useToast()

function popToast(variant, content) {
  switch(variant) {
    case 'success': toast.success(content); break;
    case 'danger': toast.error(content); break;
    case 'warning': toast.warning(content); break;
    default: toast.info(content);
  }
}

// Or Options API
export default {
  methods: {
    popToast(variant, content) {
      switch(variant) {
        case 'success': this.$toast.success(content); break;
        case 'danger': this.$toast.error(content); break;
        case 'warning': this.$toast.warning(content); break;
        default: this.$toast.info(content);
      }
    }
  }
}
```

**📋 REMAINING COMPONENTS TO MIGRATE:**

**Admin Module:**
- `src/views/admin/income/IncomeIndex.vue` - Income form
- `src/views/admin/income/IncomeDetail.vue` - Income details
- `src/views/admin/expend/ExpendList.vue` - Expense list
- `src/views/admin/expend/ExpendIndex.vue` - Expense form
- `src/views/admin/income_group/IncomeGroupList.vue`
- `src/views/admin/income_group/IncomeGroupIndex.vue`
- `src/views/admin/expend_group/ExpendGroupList.vue`
- `src/views/admin/expend_group/ExpendGroupIndex.vue`
- `src/views/admin/ie_book/IEBookList.vue`
- `src/views/admin/ie_book/IEBookIndex.vue`
- `src/views/admin/fund/FundReport.vue`
- `src/views/admin/role/RoleList.vue`
- `src/views/admin/role/RoleIndex.vue`
- `src/views/admin/staff/List.vue`
- `src/views/admin/staff/Index.vue`

**Super Admin Module:**
- `src/views/supperAdmin/HomeSPAdmin.vue`
- `src/views/supperAdmin/store/Index.vue`

**Common:**
- `src/views/common/contact.vue`

---

## Vue Bootstrap to Tailwind CSS Migration

### Setup Tailwind CSS

#### 1. Initialize Tailwind:
```bash
npx tailwindcss init -p
```

#### 2. Configure tailwind.config.js:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### 3. Create CSS file (src/assets/css/tailwind.css):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom component classes */
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
  
  .btn-secondary {
    @apply bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded;
  }
  
  .input-field {
    @apply border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}
```

#### 4. Import in main.js:
```javascript
import './assets/css/tailwind.css'
```

### Component Migration Map

#### Buttons

**Vue Bootstrap:**
```vue
<b-button variant="primary" size="lg" @click="handleClick">
  Click Me
</b-button>
```

**Tailwind CSS:**
```vue
<button 
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg"
  @click="handleClick"
>
  Click Me
</button>

<!-- Or using custom class -->
<button class="btn-primary" @click="handleClick">
  Click Me
</button>
```

#### Form Inputs

**Vue Bootstrap:**
```vue
<b-form-group label="Email" label-for="email-input">
  <b-form-input
    id="email-input"
    v-model="email"
    type="email"
    required
  />
</b-form-group>
```

**Tailwind CSS:**
```vue
<div class="mb-4">
  <label for="email-input" class="block text-gray-700 text-sm font-bold mb-2">
    Email
  </label>
  <input
    id="email-input"
    v-model="email"
    type="email"
    required
    class="input-field w-full"
  />
</div>
```

#### Cards

**Vue Bootstrap:**
```vue
<b-card title="Card Title" sub-title="Subtitle">
  <b-card-text>Card content</b-card-text>
  <b-button variant="primary">Action</b-button>
</b-card>
```

**Tailwind CSS:**
```vue
<div class="bg-white shadow-md rounded-lg overflow-hidden">
  <div class="px-6 py-4">
    <h2 class="font-bold text-xl mb-2">Card Title</h2>
    <p class="text-gray-600 text-sm mb-4">Subtitle</p>
    <p class="text-gray-700">Card content</p>
  </div>
  <div class="px-6 py-4">
    <button class="btn-primary">Action</button>
  </div>
</div>
```

#### Tables

**Vue Bootstrap:**
```vue
<b-table striped hover :items="items" :fields="fields" />
```

**Tailwind CSS:**
```vue
<div class="overflow-x-auto">
  <table class="min-w-full bg-white border border-gray-300">
    <thead class="bg-gray-100">
      <tr>
        <th class="px-6 py-3 border-b text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
          Name
        </th>
        <th class="px-6 py-3 border-b text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
          Email
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
        <td class="px-6 py-4 border-b">{{ item.name }}</td>
        <td class="px-6 py-4 border-b">{{ item.email }}</td>
      </tr>
    </tbody>
  </table>
</div>
```

#### Modals

**Vue Bootstrap:**
```vue
<b-modal id="my-modal" title="Modal Title" @ok="handleOk">
  Modal content
</b-modal>
```

**Tailwind CSS (with Composition API):**
```vue
<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="flex items-center justify-between p-4 border-b">
        <h3 class="text-xl font-semibold">Modal Title</h3>
        <button @click="close" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="p-4">
        Modal content
      </div>
      <div class="flex justify-end gap-2 p-4 border-t">
        <button @click="close" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
          Cancel
        </button>
        <button @click="handleOk" class="btn-primary">
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const emit = defineEmits(['ok'])

const close = () => {
  isOpen.value = false
}

const handleOk = () => {
  emit('ok')
  close()
}

defineExpose({ isOpen })
</script>
```

#### Navbar

**Vue Bootstrap:**
```vue
<b-navbar toggleable="lg" type="dark" variant="dark">
  <b-navbar-brand href="#">Brand</b-navbar-brand>
  <b-navbar-toggle target="nav-collapse" />
  <b-collapse id="nav-collapse" is-nav>
    <b-navbar-nav>
      <b-nav-item href="#">Home</b-nav-item>
      <b-nav-item href="#">About</b-nav-item>
    </b-navbar-nav>
  </b-collapse>
</b-navbar>
```

**Tailwind CSS:**
```vue
<nav class="bg-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <a href="#" class="text-white font-bold text-xl">Brand</a>
        <div class="hidden md:block ml-10">
          <div class="flex space-x-4">
            <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
              Home
            </a>
            <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
              About
            </a>
          </div>
        </div>
      </div>
      <button @click="toggleMenu" class="md:hidden">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </div>
</nav>
```

#### Alert/Toast

**Vue Bootstrap:**
```vue
<b-alert variant="success" show dismissible>
  Success message!
</b-alert>
```

**Tailwind CSS:**
```vue
<div v-if="showAlert" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
  <span class="block sm:inline">Success message!</span>
  <button @click="showAlert = false" class="absolute top-0 bottom-0 right-0 px-4 py-3">
    <svg class="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
    </svg>
  </button>
</div>
```

### Recommended Tailwind Libraries for Vue 3

Consider using these for pre-built components:
- **Headless UI** (Official Tailwind): `npm install @headlessui/vue`
- **DaisyUI**: Component library built on Tailwind
- **Flowbite Vue**: `npm install flowbite-vue`

---

## Library Compatibility

### Compatible Libraries (Can Upgrade)

| Library | Vue 2 Version | Vue 3 Version | Notes |
|---------|---------------|---------------|-------|
| Vue Router | 3.x | 4.x | API changes required |
| Vuex | 3.x | 4.x | Or migrate to Pinia |
| Axios | Any | Any | Fully compatible |
| Chart.js | 2.x/3.x | 3.x/4.x | Use vue-chartjs 5.x for Vue 3 |
| Vuelidate | 0.7.x | 2.x | Complete rewrite |
| Vue-i18n | 8.x | 9.x | API changes |
| Moment.js | Any | Any | Consider Day.js instead |

### Incompatible/Deprecated Libraries

**When encountering these, add TODO comments:**

```vue
<script>
// TODO: LIBRARY INCOMPATIBLE WITH VUE 3
// Library: vue-good-table
// Current usage: Data table display
// Recommended replacement: TanStack Table (Vue Query)
// See VUE2_TO_VUE3_MIGRATION_GUIDE.md section on Library Compatibility
import VueGoodTable from 'vue-good-table'

export default {
  components: {
    VueGoodTable
  }
}
</script>
```

### Common Incompatible Libraries & Alternatives

| Vue 2 Library | Status | Vue 3 Alternative |
|---------------|--------|-------------------|
| bootstrap-vue | ❌ No Vue 3 support | Tailwind CSS + HeadlessUI |
| vue-good-table | ❌ Abandoned | TanStack Table |
| vue-js-modal | ❌ Not updated | Custom modal with Tailwind |
| vue-multiselect | ⚠️ Limited support | vue-multiselect@next or @vueform/multiselect |
| vue-awesome-swiper | ❌ Not updated | Swiper (official) |
| portal-vue | ❌ Built into Vue 3 | Use `<Teleport>` |
| vue-notification | ⚠️ Check compatibility | vue-toastification |
| vue-select | ✅ v4 supports Vue 3 | Upgrade to v4 |

### Checking Library Compatibility

Before upgrading, run:
```bash
npx vue-next-migration-checker
```

Or check manually:
1. Visit npm package page
2. Check if there's a Vue 3 compatible version
3. Look for `vue@^3.0.0` in peerDependencies
4. Check GitHub issues for Vue 3 support

---

## Code Patterns to Update

### 1. **$attrs and $listeners**

#### Vue 2:
```vue
<template>
  <div>
    <ChildComponent v-bind="$attrs" v-on="$listeners" />
  </div>
</template>
```

#### Vue 3:
```vue
<template>
  <div>
    <!-- $listeners merged into $attrs -->
    <ChildComponent v-bind="$attrs" />
  </div>
</template>
```

### 2. **Slots**

#### Vue 2:
```vue
<template>
  <div>
    <slot name="header"></slot>
    <slot></slot>
  </div>
</template>

<!-- Usage -->
<MyComponent>
  <template v-slot:header>Header</template>
  <template v-slot:default>Content</template>
</MyComponent>
```

#### Vue 3 (Same, but simpler syntax):
```vue
<!-- Usage with # shorthand -->
<MyComponent>
  <template #header>Header</template>
  <template #default>Content</template>
</MyComponent>
```

### 3. **Async Components**

#### Vue 2:
```javascript
const AsyncComponent = () => import('./AsyncComponent.vue')
```

#### Vue 3:
```javascript
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
)
```

### 4. **Functional Components**

#### Vue 2:
```vue
<template functional>
  <div>{{ props.message }}</div>
</template>

<script>
export default {
  functional: true,
  props: ['message']
}
</script>
```

#### Vue 3:
```vue
<!-- Just use regular component, they're performant now -->
<template>
  <div>{{ message }}</div>
</template>

<script setup>
defineProps(['message'])
</script>
```

### 5. **$children (Removed)**

#### Vue 2:
```javascript
this.$children.forEach(child => {
  child.someMethod()
})
```

#### Vue 3:
```javascript
// Use refs or provide/inject
import { ref, provide } from 'vue'

const childRefs = ref([])

// Provide methods that children can inject
provide('parentMethod', someMethod)
```

**Add TODO comment:**
```javascript
// TODO: MIGRATION REQUIRED - $children removed in Vue 3
// Replace with template refs or provide/inject pattern
// See VUE2_TO_VUE3_MIGRATION_GUIDE.md section on $children
```

### 6. **Scoped Slots**

#### Vue 2:
```vue
<template>
  <MyComponent>
    <template slot-scope="{ item }">
      {{ item.name }}
    </template>
  </MyComponent>
</template>
```

#### Vue 3:
```vue
<template>
  <MyComponent v-slot="{ item }">
    {{ item.name }}
  </MyComponent>
</template>
```

### 7. **Custom Directives**

#### Vue 2:
```javascript
Vue.directive('focus', {
  inserted(el) {
    el.focus()
  }
})
```

#### Vue 3:
```javascript
// Lifecycle names changed
app.directive('focus', {
  mounted(el) {  // was 'inserted'
    el.focus()
  }
})
```

Directive lifecycle mapping:
- `bind` → `beforeMount`
- `inserted` → `mounted`
- `update` → removed (use `updated`)
- `componentUpdated` → `updated`
- `unbind` → `unmounted`

---

## Step-by-Step Component Migration Workflow

This section provides a systematic approach to migrate all components in the FEM_WEB_BK project from Vue 2 to Vue 3.

### Phase 1: Create Component Inventory

#### Step 1.1: Generate Component List

Create a migration tracking file to list all components:

```bash
# Find all Vue files in the project
find src -name "*.vue" -type f > component-inventory.txt

# Or on Windows PowerShell
Get-ChildItem -Path src -Filter *.vue -Recurse | Select-Object FullName > component-inventory.txt
```

#### Step 1.2: Create Migration Tracker

Create `MIGRATION_TRACKER.md` in your project root:

```markdown
# Vue 3 Migration Progress Tracker

**Started**: [Date]
**Target Completion**: [Date]
**Current Phase**: Phase 1 - Core Setup

## Migration Status Legend
- 🔴 Not Started
- 🟡 In Progress
- 🟢 Completed & Tested
- ⚠️ Blocked/Issues

---

## Phase 1: Core Files (MUST DO FIRST)

| File | Status | Notes | Date |
|------|--------|-------|------|
| src/main.js | 🔴 | Update to createApp | |
| src/router/index.js | 🔴 | Update to Vue Router 4 | |
| src/store/index.js | 🔴 | Migrate to Pinia | |
| src/App.vue | 🔴 | Root component | |
| vite.config.js | 🔴 | Replace Webpack | |
| index.html | 🔴 | Move to root | |

## Phase 2: Common Components

| File | Status | Notes | Date |
|------|--------|-------|------|
| src/components/common/HeaderDropdownLogin.vue | 🔴 | Check for filters, v-model | |
| src/components/common/HeaderDropdownStaffAcc.vue | 🔴 | Check for filters, v-model | |

## Phase 3: Admin Views - Income Module

| File | Status | Notes | Date |
|------|--------|-------|------|
| src/views/admin/income/IncomeIndex.vue | 🔴 | Parent component | |
| src/views/admin/income/IncomeList.vue | 🔴 | Check Bootstrap components | |
| src/views/admin/income/IncomeDetail.vue | 🔴 | Check forms | |

## Phase 4: Admin Views - Expend Module

| File | Status | Notes | Date |
|------|--------|-------|------|
| src/views/admin/expend/ExpendIndex.vue | 🔴 | Parent component | |
| src/views/admin/expend/ExpendList.vue | 🔴 | Check Bootstrap components | |

## Phase 5: Admin Views - Income Group Module

| File | Status | Notes | Date |
|------|--------|-------|------|
| src/views/admin/income_group/IncomeGroupIndex.vue | 🔴 | Parent component | |
| src/views/admin/income_group/IncomeGroupList.vue | 🔴 | Check Bootstrap components | |

## Phase 6: Admin Views - Expend Group Module

| File | Status | Notes | Date |
|------|--------|-------|------|
| src/views/admin/expend_group/ExpendGroupIndex.vue | 🔴 | Parent component | |
| src/views/admin/expend_group/ExpendGroupList.vue | 🔴 | Check Bootstrap components | |

## Phase 7: Admin Views - Staff Module

| File | Status | Notes | Date |
|------|--------|-------|------|
| src/views/admin/staff/Index.vue | 🔴 | Parent component | |
| src/views/admin/staff/List.vue | 🔴 | Check Bootstrap components | |

## Phase 8: Admin Views - Other Modules

| File | Status | Notes | Date |
|------|--------|-------|------|
| src/views/admin/ie_book/IEBookIndex.vue | 🔴 | IE Book module | |
| src/views/admin/ie_book/IEBookList.vue | 🔴 | Check Bootstrap components | |
| src/views/admin/fund/FundReport.vue | 🔴 | Report component | |
| src/views/admin/over_view/OverView.vue | 🔴 | Dashboard component | |
| src/views/admin/role/RoleIndex.vue | 🔴 | Role management | |
| src/views/admin/role/RoleList.vue | 🔴 | Check Bootstrap components | |
| src/views/admin/statistic/Statistic.vue | 🔴 | Statistics/Charts | |

## Phase 9: Staff Views

| File | Status | Notes | Date |
|------|--------|-------|------|
| src/views/staff/StaffLogin.vue | 🔴 | Login form | |
| src/views/staff/StaffChangePass.vue | 🔴 | Password form | |

## Phase 10: Super Admin Views

| File | Status | Notes | Date |
|------|--------|-------|------|
| src/views/supperAdmin/HomeSPAdmin.vue | 🔴 | Admin home | |
| src/views/supperAdmin/store/Index.vue | 🔴 | Store management | |
| src/views/supperAdmin/store/List.vue | 🔴 | Store list | |
| src/views/supperAdmin/storeAdmin/Index.vue | 🔴 | Store admin | |
| src/views/supperAdmin/storeAdmin/List.vue | 🔴 | Store admin list | |

## Phase 11: Common Views

| File | Status | Notes | Date |
|------|--------|-------|------|
| src/views/common/contact.vue | 🔴 | Contact form | |

## Phase 12: Utility Files

| File | Status | Notes | Date |
|------|--------|-------|------|
| src/filters/index.js | 🔴 | Convert to composables | |
| src/common/commonFunc.js | 🔴 | Check compatibility | |
| src/mapper/master.js | 🔴 | Check compatibility | |

---

## Issues Encountered

| Issue | File | Solution | Status |
|-------|------|----------|--------|
| | | | |

---

## Verification Checklist

- [ ] All components compile without errors
- [ ] No console errors in browser
- [ ] All routes are accessible
- [ ] Forms submit correctly
- [ ] Authentication works
- [ ] All CRUD operations work
- [ ] Charts/visualizations render
- [ ] Responsive design maintained
```

### Phase 2: Prepare Your Environment

#### Step 2.1: Create a Migration Branch

```bash
# Create and switch to migration branch
git checkout -b vue3-migration

# Create a backup branch
git branch vue2-backup
```

#### Step 2.2: Install Vue 3 Dependencies

Follow the steps in the "Core Dependencies Update" section above, then verify:

```bash
npm install
npm run dev
```

**Expected**: Build errors at this stage are normal.

### Phase 3: Migrate Core Files (CRITICAL - DO THIS FIRST)

#### Step 3.1: Update main.js

**Current main.js** (Vue 2):
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

**Updated main.js** (Vue 3):
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/tailwind.css' // Add Tailwind

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.mount('#app')
```

**Verify:**
```bash
npm run dev
```

#### Step 3.2: Update router/index.js

**Before:**
```javascript
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // your routes
  ]
})
```

**After:**
```javascript
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // your existing routes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

**Verify:**
```bash
npm run dev
# Check console for router errors
```

#### Step 3.3: Migrate Store to Pinia

**Create stores/index.js:**
```javascript
import { createPinia } from 'pinia'
export default createPinia()
```

**For each Vuex module, create a Pinia store.**

Example - If you have `store/state.js`, `store/mutations.js`, `store/actions.js`:

**Create stores/auth.js:**
```javascript
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),
  
  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  },
  
  actions: {
    setUser(user) {
      this.user = user
      this.isAuthenticated = !!user
    },
    
    setToken(token) {
      this.token = token
    },
    
    async login(credentials) {
      // Your login logic
      const response = await loginAPI(credentials)
      this.setUser(response.user)
      this.setToken(response.token)
    },
    
    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
    }
  }
})
```

**Verify:**
```bash
npm run dev
# Should start without store errors
```

#### Step 3.4: Update App.vue

Check `src/App.vue` for:
- Global event bus usage → Convert to Pinia or mitt
- Filters → Convert to methods
- Bootstrap Vue components → Convert to Tailwind

**Verify:**
```bash
npm run dev
# App should render without errors
```

### Phase 4: Migrate Components Systematically

#### Step 4.1: Start with Leaf Components (No Dependencies)

Migrate components that don't import other custom components first:

**Example Migration Checklist for Each Component:**

```bash
# 1. Open the component
# 2. Check for these patterns:
```

**Migration Checklist for Each Component:**

- [ ] **Imports**: Remove Vue 2 specific imports
- [ ] **Script Setup**: Convert to `<script setup>` (optional but recommended)
- [ ] **V-Model**: Update prop from `value` to `modelValue`
- [ ] **Emits**: Update from `$emit('input')` to `$emit('update:modelValue')`
- [ ] **Filters**: Convert `{{ value | filter }}` to methods
- [ ] **$children**: Replace with refs or provide/inject
- [ ] **$listeners**: Remove (merged into $attrs)
- [ ] **Bootstrap Vue**: Convert to Tailwind CSS
- [ ] **Event Bus**: Convert to Pinia or mitt
- [ ] **Async Components**: Wrap with `defineAsyncComponent`
- [ ] **Functional Components**: Remove `functional: true`

#### Step 4.2: Component Migration Template

**Before (Vue 2 - Options API):**
```vue
<template>
  <div class="income-list">
    <b-table :items="items" :fields="fields" />
    <b-button @click="handleAdd">Add</b-button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'IncomeList',
  data() {
    return {
      items: [],
      fields: ['name', 'amount', 'date']
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(['fetchIncome']),
    handleAdd() {
      this.$emit('add')
    }
  },
  mounted() {
    this.fetchIncome()
  },
  filters: {
    currency(value) {
      return '$' + value.toFixed(2)
    }
  }
}
</script>
```

**After (Vue 3 - Composition API with Tailwind):**
```vue
<template>
  <div class="income-list">
    <!-- Tailwind Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th v-for="field in fields" :key="field" 
                class="px-6 py-3 border-b text-left text-xs font-medium text-gray-700 uppercase">
              {{ field }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 border-b">{{ item.name }}</td>
            <td class="px-6 py-4 border-b">{{ formatCurrency(item.amount) }}</td>
            <td class="px-6 py-4 border-b">{{ item.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <button 
      @click="handleAdd"
      class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Add
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useIncomeStore } from '@/stores/income'

// Define emits
const emit = defineEmits(['add'])

// Use stores
const authStore = useAuthStore()
const incomeStore = useIncomeStore()

// Component state
const items = ref([])
const fields = ref(['name', 'amount', 'date'])

// Methods (filters converted)
const formatCurrency = (value) => {
  return '$' + value.toFixed(2)
}

const handleAdd = () => {
  emit('add')
}

// Lifecycle
onMounted(async () => {
  items.value = await incomeStore.fetchIncome()
})
</script>

<style scoped>
/* Add any component-specific styles */
.income-list {
  padding: 1rem;
}
</style>
```

#### Step 4.3: Migrate Components in Order

**Recommended Order:**

1. **Common/Utility Components** (2-3 components)
   ```bash
   # Start here:
   src/components/common/HeaderDropdownLogin.vue
   src/components/common/HeaderDropdownStaffAcc.vue
   ```
   
   **After each component:**
   ```bash
   npm run dev
   # Test the component in browser
   git add .
   git commit -m "feat: migrate HeaderDropdownLogin to Vue 3"
   ```

2. **Staff Views** (Login/Auth - 2 components)
   ```bash
   src/views/staff/StaffLogin.vue
   src/views/staff/StaffChangePass.vue
   ```

3. **Income Module** (3 components)
   ```bash
   src/views/admin/income/IncomeList.vue    # Child first
   src/views/admin/income/IncomeDetail.vue  # Child
   src/views/admin/income/IncomeIndex.vue   # Parent last
   ```

4. **Expend Module** (2 components)
   ```bash
   src/views/admin/expend/ExpendList.vue
   src/views/admin/expend/ExpendIndex.vue
   ```

5. **Income Group Module** (2 components)
   ```bash
   src/views/admin/income_group/IncomeGroupList.vue
   src/views/admin/income_group/IncomeGroupIndex.vue
   ```

6. **Expend Group Module** (2 components)
   ```bash
   src/views/admin/expend_group/ExpendGroupList.vue
   src/views/admin/expend_group/ExpendGroupIndex.vue
   ```

7. **Staff Module** (2 components)
   ```bash
   src/views/admin/staff/List.vue
   src/views/admin/staff/Index.vue
   ```

8. **Other Admin Modules** (7 components)
   ```bash
   src/views/admin/ie_book/IEBookList.vue
   src/views/admin/ie_book/IEBookIndex.vue
   src/views/admin/fund/FundReport.vue
   src/views/admin/over_view/OverView.vue
   src/views/admin/role/RoleList.vue
   src/views/admin/role/RoleIndex.vue
   src/views/admin/statistic/Statistic.vue
   ```

9. **Super Admin Views** (5 components)
   ```bash
   src/views/supperAdmin/store/List.vue
   src/views/supperAdmin/store/Index.vue
   src/views/supperAdmin/storeAdmin/List.vue
   src/views/supperAdmin/storeAdmin/Index.vue
   src/views/supperAdmin/HomeSPAdmin.vue
   ```

10. **Common Views** (1 component)
    ```bash
    src/views/common/contact.vue
    ```

### Phase 5: Verification After Each Component

**For EVERY component you migrate, do this:**

```bash
# 1. Save the file

# 2. Check for compilation errors
npm run dev

# 3. Open browser to http://localhost:8080
# 4. Navigate to the component's route
# 5. Test all functionality:
#    - Forms submit
#    - Buttons work
#    - Data loads
#    - Modals open/close
#    - Validation works

# 6. Check browser console for errors (F12)

# 7. If working, commit:
git add .
git commit -m "feat: migrate [ComponentName] to Vue 3"

# 8. Update MIGRATION_TRACKER.md
# Change status from 🔴 to 🟢 and add date
```

### Phase 6: Handle Global Filters

If you have `src/filters/index.js`, convert to composables:

**Create `src/composables/useFormatters.js`:**
```javascript
export function useFormatters() {
  const formatCurrency = (value) => {
    if (!value) return '$0.00'
    return '$' + parseFloat(value).toFixed(2)
  }
  
  const formatDate = (value) => {
    if (!value) return ''
    return new Date(value).toLocaleDateString()
  }
  
  const formatNumber = (value) => {
    if (!value) return '0'
    return parseFloat(value).toLocaleString()
  }
  
  return {
    formatCurrency,
    formatDate,
    formatNumber
  }
}
```

**Use in components:**
```vue
<template>
  <div>{{ formatCurrency(amount) }}</div>
</template>

<script setup>
import { useFormatters } from '@/composables/useFormatters'

const { formatCurrency } = useFormatters()
const amount = ref(1234.56)
</script>
```

### Phase 7: Update API Files

Check all files in `src/api/` - they should work without changes, but verify:

```javascript
// src/api/income.js - Should work as-is
import axios from 'axios'

export const getIncomeList = () => {
  return axios.get('/api/income')
}

// Usage in Vue 3 component is slightly different:
// Vue 2: this.$axios or imported
// Vue 3: Just import and use
```

### Phase 8: Final Verification

#### Step 8.1: Complete Testing Checklist

```bash
# Start the dev server
npm run dev
```

**Test every route:**
- [ ] Login page loads and works
- [ ] Dashboard loads after login
- [ ] Income list displays data
- [ ] Income create form works
- [ ] Income edit form works
- [ ] Income delete works
- [ ] Expend module works
- [ ] Income group module works
- [ ] Expend group module works
- [ ] Staff management works
- [ ] IE Book module works
- [ ] Fund report works
- [ ] Overview/Dashboard works
- [ ] Role management works
- [ ] Statistics display
- [ ] Super admin functions work
- [ ] Logout works

#### Step 8.2: Check for Remaining Vue 2 Patterns

```bash
# Search for Vue 2 patterns
grep -r "new Vue" src/
grep -r "\$children" src/
grep -r "\$listeners" src/
grep -r "filters:" src/
grep -r "EventBus" src/
grep -r "this.\$" src/ | grep -v "this.\$emit\|this.\$route\|this.\$router"

# Search for Bootstrap Vue
grep -r "<b-" src/
grep -r "bootstrap-vue" .
```

#### Step 8.3: Build for Production

```bash
# Build the app
npm run build

# Preview the production build
npm run preview

# Test the production build thoroughly
```

#### Step 8.4: Final Commit

```bash
git add .
git commit -m "feat: complete Vue 3 migration"
git push origin vue3-migration
```

### Phase 9: Deployment Preparation

1. **Update CI/CD configs** if you have them
2. **Update README.md** with new commands:
   ```markdown
   ## Development
   npm install
   npm run dev
   
   ## Build
   npm run build
   
   ## Preview Production
   npm run preview
   ```

3. **Test in staging environment**
4. **Create a rollback plan**:
   ```bash
   # If migration fails, rollback:
   git checkout main
   git branch -D vue3-migration
   git checkout vue2-backup
   ```

### Troubleshooting Common Issues

#### Issue 1: Component Not Rendering
```bash
# Check browser console (F12)
# Common causes:
# - Missing imports
# - Incorrect Pinia usage
# - v-model not updated
```

#### Issue 2: Store Not Working
```javascript
// Make sure you're using Pinia correctly
// In component:
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

// NOT: const authStore = new useAuthStore() ❌
```

#### Issue 3: Router Not Working
```javascript
// In Vue 3, use composables:
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// NOT: this.$router ❌ (only in Options API)
```

---

## Testing Strategy

### 1. **Unit Tests Update**

#### Vue 2 (Vue Test Utils 1.x):
```javascript
import { shallowMount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders', () => {
    const wrapper = shallowMount(MyComponent)
    expect(wrapper.text()).toContain('Hello')
  })
})
```

#### Vue 3 (Vue Test Utils 2.x):
```javascript
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.text()).toContain('Hello')
  })
})
```

Update test utils:
```bash
npm install -D @vue/test-utils@next
```

### 2. **Migration Checklist**

Create a checklist file to track progress:

```markdown
## Migration Progress

### Core Updates
- [ ] Update package.json dependencies
- [ ] Install Vue 3, Router 4, Pinia
- [ ] **Verify: Run `npm install` successfully**
- [ ] Install Tailwind CSS
- [ ] **Verify: Check installed versions with `npm list vue vue-router`**
- [ ] Update main.js to use createApp
- [ ] Update router to use createRouter
- [ ] Migrate Vuex to Pinia (or Vuex 4)
- [ ] **Verify: Run `npm run dev` - app should start (may have errors)**

### Component Migration
- [ ] Update all v-model usages
- [ ] Convert filters to methods
- [ ] Replace event bus with mitt or Pinia
- [ ] Update all Bootstrap components to Tailwind
- [ ] Update custom directives
- [ ] Replace $children usage

### File-by-File Progress
- [ ] src/App.vue
- [ ] src/main.js
- [ ] src/router/index.js
- [ ] src/store/index.js
- [ ] src/views/admin/expend/ExpendIndex.vue
- [ ] src/views/admin/expend/ExpendList.vue
- [ ] ... (list all files)

### Testing
- [ ] Update test configuration
- [ ] Update unit tests
- [ ] Manual testing of all routes
- [ ] Browser compatibility testing
```

### 3. **Incremental Migration Approach**

**Step 1**: Set up parallel branches
```bash
git checkout -b vue3-migration
```

**Step 2**: Start with core files
1. Update build config (Vite)
2. Update main.js
3. Update router
4. Update store
5. **Verify after each step:**
   ```bash
   npm install
   npm run dev
   ```
6. **Commit working changes:**
   ```bash
   git add .
   git commit -m "chore: migrate [component/feature] to Vue 3"
   ```

**Step 3**: Migrate components one by one
- Start with leaf components (no children)
- Work up to parent components
- Test each component after migration

**Step 4**: Add TODO comments for deferred items
```javascript
// TODO: VUE3-MIGRATION - Priority: HIGH
// Issue: Component uses incompatible library
// Action needed: Replace with alternative
// See: VUE2_TO_VUE3_MIGRATION_GUIDE.md#library-compatibility
```

---

## Vite Configuration (Recommended)

Replace Webpack with Vite for better performance:

### vite.config.js
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
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
```

### Update index.html
Move from `public/index.html` to root `index.html`:
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

### Update package.json scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Verify Vite Setup

After configuring Vite, test the setup:

```bash
# Install any missing dependencies
npm install

# Start the dev server
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:8080/
➜  Network: use --host to expose
```

**If successful:**
- ✅ Browser opens automatically to http://localhost:8080/
- ✅ Hot Module Replacement (HMR) is working
- ✅ Changes to files trigger instant updates

**If errors occur:**
```bash
# Check Vite version
npm list vite

# Ensure @vitejs/plugin-vue is installed
npm list @vitejs/plugin-vue

# Clear Vite cache if needed
rm -rf node_modules/.vite
npm run dev
```

---

## Common Errors & Solutions

### Error 1: "Cannot find module 'vue'"
**Solution**: Ensure Vue 3 is installed
```bash
npm install vue@next
```

### Error 2: "Cannot read property '$children' of undefined"
**Solution**: $children is removed, use refs
```javascript
// Before
this.$children[0].someMethod()

// After
<template>
  <ChildComponent ref="childRef" />
</template>

<script setup>
import { ref } from 'vue'
const childRef = ref(null)
// Access: childRef.value.someMethod()
</script>
```

### Error 3: "Filters are not supported"
**Solution**: Convert to methods or composables (see section above)

### Error 4: "Bootstrap components not rendering"
**Solution**: Bootstrap Vue is not compatible, migrate to Tailwind CSS

---

## Resources

- [Official Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue Router 4 Migration](https://router.vuejs.org/guide/migration/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [HeadlessUI Vue](https://headlessui.com/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [vue-toastification Documentation](https://vue-toastification.maronato.dev/)
- **[Toast Notification Guide](./TOAST_NOTIFICATION_GUIDE.md)** - Complete guide for toast notifications
- **[Bootstrap Vue to Tailwind Migration](./BOOTSTRAP_VUE_TO_TAILWIND_MIGRATION.md)** - Detailed component migration patterns

---

## GitHub Copilot Chat Prompts

Use these prompts in Copilot Chat after attaching this guide:

1. **"Migrate this component to Vue 3 following the guide"**
2. **"Convert this Bootstrap component to Tailwind CSS per the guide"**
3. **"Check if this library is Vue 3 compatible according to the guide"**
4. **"Add appropriate TODO comment for this incompatible code"**
5. **"Update this Vuex store to Pinia following the guide pattern"**
6. **"Convert this filter to a method as per the guide"**

---

## VS Code Extensions to Install

```bash
# Vue 3 support
code --install-extension Vue.volar

# Disable Vetur (for Vue 2)
code --disable-extension octref.vetur

# Tailwind CSS IntelliSense
code --install-extension bradlc.vscode-tailwindcss

# PostCSS support
code --install-extension csstools.postcss
```

---

## Final Notes

- **Always test after each migration step**
- **Keep Vue 2 branch as backup**
- **Update documentation as you migrate**
- **Use TypeScript for better type safety (optional but recommended)**
- **Consider migrating to Composition API gradually**

This guide should be updated as you discover project-specific issues during migration.

---

**Last Updated**: December 23, 2025
**Project**: FEM_WEB_BK Vue 2 → Vue 3 Migration
