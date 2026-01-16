<template>
  <div class="app">
    <template v-if="route.name !== 'Login'">
      <AppHeader v-if="!authStore.user" class="header-custom">
        <div class="header-container">
          <div class="nav-left">
            <button @click="toggleSidebarVisibility" type="button" class="navbar-toggler">
              <img src="/static/img/icons/sticker_1.png" class="iconsCustom"/>
            </button>

            <router-link class="nav-link home-icon" to="/">
              <span class="mr-2"></span>
              <img src="/static/img/icons/sticker_2.png" class="iconsCustom"/>
            </router-link>
          </div>
        </div>
      </AppHeader>

      <!-- đăng nhập xong sẽ dùng đoạn code bên dưới -->
      <AppHeader v-if="authStore.user" class="header-custom">
        <div class="header-container">
          <div class="nav-left">
            <button @click="toggleSidebarVisibility" type="button" class="navbar-toggler">
              <img src="/static/img/icons/sticker_1.png" class="iconsCustom"/>
            </button>
            <router-link class="nav-link home-icon" to="/">
              <span class="mr-2"></span>
              <img src="/static/img/icons/sticker_2.png" class="iconsCustom"/>
            </router-link>
          </div>

          <div class="navbar-nav">
            <template v-if="authStore.user">
              <span class="white text-right user-info">
                {{ authStore.user.name }}
                <br>
                <span class="text-muted">
                  ({{ authStore.user.role_name }})
                </span>
              </span>
              <HeaderDropdownStaffAcc />
            </template>
          </div>
        </div>
      </AppHeader>

      <div class="app-body">
        <div class="bg-pushed-menu" v-if="sidebarVisible && !sidebarCollapsed" @click="toggleSidebarVisibility"></div>

        <!-- Menu: User not login -->
        <CustomSidebar 
          v-if="!authStore.user" 
          :collapsed="sidebarCollapsed"
          :visible="sidebarVisible"
          width="250px"
          :menu="navCusNotLogin"
          @toggle="toggleSidebar"
          @close="toggleSidebarVisibility" />

        <!-- Menu: staff -->
        <CustomSidebar 
          v-if="authStore.user && !authStore.user.is_super"
          :collapsed="sidebarCollapsed"
          :visible="sidebarVisible"
          width="280px" 
          :menu="authStore.menu"
          @toggle="toggleSidebar"
          @close="toggleSidebarVisibility" />

        <!-- Menu: super admin -->
        <CustomSidebar 
          v-if="authStore.user && authStore.user.is_super"
          :collapsed="sidebarCollapsed"
          :visible="sidebarVisible"
          width="250px" 
          :menu="navSpAdmin"
          @toggle="toggleSidebar"
          @close="toggleSidebarVisibility" />

        <main class="main">
          <router-view />
        </main>

      </div>
    </template>

    <template v-if="route.name === 'Login'">
      <main class="main">
        <router-view />
      </main>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import navSpAdminConfig from '@/navSpAdmin'
import navCusNotLoginConfig from '@/navCusNotLogin'
import AppHeader from '@/components/common/AppHeader.vue'
import HeaderDropdownStaffAcc from '@/components/common/HeaderDropdownStaffAcc.vue'
import CustomSidebar from '@/components/common/CustomSidebar.vue'
import staffAPI from '@/api/staff'

const route = useRoute()
const authStore = useAuthStore()

const navCusNotLogin = navCusNotLoginConfig.items
const navSpAdmin = navSpAdminConfig.items
const activePushedMenu = ref(false)
const sidebarCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')

// Always start with sidebar closed after refresh
const sidebarVisible = ref(false)

// Toggle sidebar visibility (show/hide) - don't persist to localStorage
const toggleSidebarVisibility = () => {
  sidebarVisible.value = !sidebarVisible.value
}

// Toggle sidebar collapsed state (expand/collapse)
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString())
}

// Watch route changes
watch(() => route.path, () => {
  activePushedMenu.value = false
})

// Get menu bar if user exists
const getMenuBar = async () => {
  if (authStore.user && authStore.user.id) {
    try {
      const res = await staffAPI.getMenuBar(authStore.user.id)
      if (res?.data?.data) {
        authStore.updateMenu(res.data.data)
      }
    } catch (err) {
      console.error('Error loading menu:', err)
    }
  }
}

onMounted(() => {
  getMenuBar()
})
</script>


<style lang="scss">
// Import Tailwind CSS
@use '@/assets/css/tailwind.css';

// Import Font Awesome
@use '@fortawesome/fontawesome-free/scss/fontawesome' as *;
@use '@fortawesome/fontawesome-free/scss/solid' as *;
@use '@fortawesome/fontawesome-free/scss/regular' as *;
@use '@fortawesome/fontawesome-free/scss/brands' as *;
@use '@fortawesome/fontawesome-free/scss/v4-shims' as *;

// Import custom styles (without CoreUI)
@use '@/assets/scss/style' as *;
@use '@/assets/scss/rsw' as *;

  .center-xy {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .shadow {
    box-shadow: 0 2px 10px #dedede;
    border-radius: 10px;
  }
  .fa-stack[data-count]:after{
    position:absolute;
    right:0%;
    top:1%;
    content: attr(data-count);
    font-size:50%;
    padding:.6em;
    border-radius:999px;
    line-height:.75em;
    color: white;
    background:rgba(255,88,88,.85);
    text-align:center;
    min-width:2em;
    font-weight:bold;
  }
  .nav-left {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    
    .navbar-toggler {
      background: none;
      border: none;
      cursor: pointer;
      padding: .5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background-color: rgba(255,255,255,0.1);
        border-radius: 4px;
      }
    }
    
    .home-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: .5rem;
      text-decoration: none;
      &:hover {
        background-color: rgba(255,255,255,0.1);
        border-radius: 4px;
      }
    }
  }
  
  .navbar-nav {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .user-info {
    font-size: 0.9rem;
    line-height: 1.2;
  }

  .main {
    margin-top: 40px;
    transition: margin-left 0.3s ease;
  }
  
  .custom-sidebar:not(.collapsed) ~ .main {
    margin-left: 0;
  }
  
  .app-body .sidebar.active {
    margin-left: 0;
  }
  .header-custom {
    background-color: #444444 !important;
    width: 100%;
    display: flex;
    align-items: center;
    ul.navbar-nav {
      li.nav-item {
        min-width: unset;
        a {
          display: block;
          span {
            display: block;
          }
        }
      }
    }
    .badge {
      top: 10px!important;
      left: unset!important;
      right: 5px;
      border-radius: 50%;
      background: white;
      width: 25px;
      height: 25px;
      color: red;
      display: flex!important;
      align-items: center;
      justify-content: center;
      font-size: 0.8em;
    }
  }
  .iconsCustom {
    width: 40px;
    height: 40px;
  }
  .inline-center {
    display: flex;
    align-items: center;
  }
  .default-btn-bg {
    background-color: #444444 !important;
  }
  .bg-pushed-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .sidebar-minimizer {
    display: none!important;
  }
  .card {
    border: none!important;
    box-shadow: 0 2px 10px #DEDEDE;
    border-radius: 10px!important;
  }
  .is-fixed-page {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  button {
    &:focus {outline:0;}
  }
  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 55px;
    padding: 0 15px;
  }
  .text-header {
    color: #ed592a !important;
  }

  .app-header {
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    padding: 0 !important;
    height: 55px;
    z-index: 1001;
  }

  .ow-table {
    .actions-cell {
      > div {
        width: 100%!important;
      }
    }
  }

  .has-next {
    color: #444444;
    font-size: 3em;
  }
  .btn-width-120 {
    width: 120px !important;
  }
  .btn-width-200 {
    width: 200px !important;
  }
  .btn-width-300 {
    width: 300px !important;
  }
  .width-30 {
    width: 30%;
    float: left;
  }
  .label-width {
    width: 100%;
  }
  .datepicker-cus {
    border: 1px solid #e4e7ea;
    border-radius: 0.25rem;
    width: 120px !important;
    height: 35px !important;
    padding-left: 5px;
  }
</style>
