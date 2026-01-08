<template>
  <div class="app">
    <template v-if="$route.name != 'Login'">
      <!-- Header: User not logged in -->
      <header v-if="!authStore.user" class="header-custom fixed top-0 left-0 right-0 z-50 bg-gray-800">
        <div class="header-container flex items-center justify-between w-full px-4">
          <div class="nav-left flex items-center">
            <button @click="toggleSidebarVisibility" type="button" class="navbar-toggler p-2">
              <img src="/static/img/icons/sticker_1.png" class="iconsCustom w-10 h-10"/>
            </button>

            <router-link class="nav-link home-icon px-2" to="/">
              <img src="/static/img/icons/sticker_2.png" class="iconsCustom w-10 h-10"/>
            </router-link>
          </div>
        </div>
      </header>

      <!-- Header: User logged in -->
      <header v-if="authStore.user" class="header-custom fixed top-0 left-0 right-0 z-50 bg-gray-800">
        <div class="header-container flex items-center justify-between w-full px-4">
          <div class="nav-left flex items-center">
            <button @click="toggleSidebarVisibility" type="button" class="navbar-toggler p-2">
              <img src="/static/img/icons/sticker_1.png" class="iconsCustom w-10 h-10"/>
            </button>
            <router-link class="nav-link home-icon px-2" to="/">
              <img src="/static/img/icons/sticker_2.png" class="iconsCustom w-10 h-10"/>
            </router-link>
          </div>

          <div class="flex items-center">
            <!-- Show for staff template -->
            <template v-if="authStore.user.userType == 'staff'">
              <span class="text-white text-right mr-4">
                {{ authStore.user.userName }}
                <br>
                <span class="text-gray-400">
                  ({{ authStore.user.role }})
                </span>
              </span>
              <HeaderDropdownStaffAcc />
            </template>
          </div>
        </div>
      </header>

      <div class="app-body pt-14">
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
          v-if="authStore.user && !authStore.user.isSuper"
          :collapsed="sidebarCollapsed"
          :visible="sidebarVisible"
          width="280px"
          :menu="authStore.menu"
          @toggle="toggleSidebar"
          @close="toggleSidebarVisibility" />

        <!-- Menu: super admin -->
        <CustomSidebar
          v-if="authStore.user && authStore.user.isSuper"
          :collapsed="sidebarCollapsed"
          :visible="sidebarVisible"
          width="250px"
          :menu="navSpAdmin"
          @toggle="toggleSidebar"
          @close="toggleSidebarVisibility" />

        <!-- Audio: Notification -->
        <audio id="audioNotification" src="/static/sound/on_message.mp3" type="audio/mp3"></audio>
        <button type="button" id="btnPlayNotify" @click="playNotify" hidden>
          Play
        </button>

        <main class="main">
          <router-view />
        </main>
      </div>
    </template>

    <template v-if="$route.name == 'Login'">
      <main class="main">
        <router-view />
      </main>
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import navSpAdminData from '@/navSpAdmin'
import navCusNotLoginData from '@/navCusNotLogin'
import HeaderDropdownStaffAcc from '@/components/common/HeaderDropdownStaffAcc.vue'
import CustomSidebar from '@/components/common/CustomSidebar.vue'

const route = useRoute()
const authStore = useAuthStore()
const navCusNotLogin = ref(navCusNotLoginData.items || [])
const navSpAdmin = ref(navSpAdminData.items || [])
const sidebarCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')
const sidebarVisible = ref(localStorage.getItem('sidebarVisible') !== 'false')

// Toggle sidebar visibility (show/hide)
const toggleSidebarVisibility = () => {
  sidebarVisible.value = !sidebarVisible.value
  localStorage.setItem('sidebarVisible', sidebarVisible.value.toString())
}

// Toggle sidebar collapsed state (expand/collapse)
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString())
}

// Watch route changes
watch(() => route.path, () => {
  // Close sidebar on mobile when route changes
  if (window.innerWidth < 992 && sidebarVisible.value) {
    sidebarVisible.value = false
  }
})

/**
 * Play sound notify
 */
const playNotify = () => {
  const audio = document.getElementById("audioNotification")
  if (audio) {
    audio.muted = false
    audio.play()
  }
}
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

  /* Import Font Awesome Icons Set */
  @use 'assets/scss/style';
  @use 'assets/scss/rsw';

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
    height: 55px;

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
  .btn-width-130 {
    width: 130px !important;
  }
  .btn-width-160 {
    width: 160px !important;
  }
  .btn-width-200 {
    width: 200px !important;
  }
  .width-30 {
    width: 30%;
    float: left;
  }
</style>
