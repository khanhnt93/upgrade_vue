<template>
  <div class="app">
    <template v-if="route.name != 'Login'">
      <header v-if="!authStore.user" class="app-header bg-white shadow-sm">
        <div class="container-fluid">
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
      </header>

      <!-- đăng nhập xong sẽ dùng đoạn code bên dưới -->
      <header v-if="authStore.user" class="app-header bg-white shadow-sm">
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

          <nav class="navbar-nav">
            <!-- hiện cho template customer -->
            <HeaderDropdownGift v-if="authStore.user?.userType == 'customer'"/>
            <li class="nav-item dropdown" v-if="authStore.user?.userType == 'customer'">
              <a href="" class="nav-link dropdown-toggle dropdown-toggle-no-caret">
                <span class="white mr-3">
                  <img @click.prevent="goToNotification" src="/static/img/icons/sticker_3.png" class="iconsCustom"/>
                  <span class="badge">{{ notifyNumber }}</span>
                </span>
              </a>
            </li>
            <HeaderDropdownCusAcc v-if="authStore.user?.userType == 'customer'"/>
            <!-- end -->

            <!-- hiện cho template staff -->
            <div v-if="authStore.user?.userType == 'staff'" class="staff-info-wrapper">
              <span class="text-right">
                {{ authStore.user.userName }}
                <br>
                <span class="text-muted">
                  ({{ authStore.user.role }})
                </span>
              </span>
              <HeaderDropdownStaffAcc />
            </div>
            <!-- end -->
          </nav>
        </div>
      </header>

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

        <main class="main">
          <router-view />
        </main>

      </div>
    </template>

    <template v-if="route.name == 'Login'">
      <main class="main">
        <router-view />
      </main>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastNotification } from '@/composables/useToast'
import navSpAdminData from '@/navSpAdmin'
import navCusNotLoginData from '@/navCusNotLogin'
import HeaderDropdownCusAcc from '@/components/common/HeaderDropdownCusAcc.vue'
import HeaderDropdownStaffAcc from '@/components/common/HeaderDropdownStaffAcc.vue'
import HeaderDropdownGift from '@/components/common/HeaderDropdownGift.vue'
import CustomSidebar from '@/components/common/CustomSidebar.vue'
import { Constant } from '@/common/constant'
import staffAPI from '@/api/staff'
import commonFunc from "@/common/commonFunc"

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { popToast } = useToastNotification()

const navCusNotLogin = ref(navCusNotLoginData.items || [])
const navSpAdmin = ref(navSpAdminData.items || [])
const notifyNumber = ref(0)
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

// Go to notification
const goToNotification = () => {
  router.push("/notification")
}

// Play sound notify
const playNotify = () => {
  const audio = document.getElementById("audioNotification")
  if (audio) {
    audio.muted = false
    audio.play()
  }
}

// Get menu bar
const getMenuBar = () => {
  if (authStore && authStore.user && authStore.user.id) {
    staffAPI.getMenuBar(authStore.user.id).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        authStore.updateMenu(res.data.data)
      }
    }).catch(err => {
      // Handle error
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

// Watch route changes
watch(() => route.path, () => {
  // Close sidebar on mobile when route changes
  if (window.innerWidth < 992 && sidebarVisible.value) {
    sidebarVisible.value = false
  }
})

onMounted(() => {
  // Check login
  if (!authStore.user || !authStore.user.id) {
    router.push('/staff-login')
  }

  // Get lại menu bar nếu có user
  getMenuBar()
})
</script>

<style lang="scss">
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
    gap: 0.5rem;

    .home-icon {
      padding: .5rem .5rem .5rem .2rem;
      display: flex;
      align-items: center;
    }
  }
  .bg-pushed-menu {
    position: fixed;
    top: 55px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .app-header {
    background-color: white !important;

    .navbar-nav {
      display: flex;
      align-items: center;
      gap: 1rem;
      list-style: none;
      margin: 0;
      padding: 0;

      > * {
        display: flex;
        align-items: center;
        position: relative;
      }

      li.nav-item {
        min-width: unset;
        position: relative;

        a {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: inherit;

          span {
            display: flex;
            align-items: center;
            position: relative;
          }
        }
      }

      .text-right {
        font-size: 0.875rem;
        line-height: 1.2;
        margin-right: 0.5rem;
        text-align: right;

        .text-muted {
          font-size: 0.75rem;
          color: #6c757d;
        }
      }

      .staff-info-wrapper {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        position: relative;
      }
    }

    .badge {
      position: absolute;
      top: -5px;
      right: -5px;
      border-radius: 50%;
      background: red;
      width: 20px;
      height: 20px;
      color: white;
      display: flex !important;
      align-items: center;
      justify-content: center;
      font-size: 0.7em;
      font-weight: bold;
    }
  }
  .iconsCustom {
    width: 40px;
    height: 40px;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }
  .inline-center {
    display: flex;
    align-items: center;
  }
  .default-btn-bg {
    background-color: #444444 !important;
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

  // HeadlessUI Menu dropdown styles
  .relative.inline-block {
    display: inline-flex;
    align-items: center;
    position: relative;
  }

  .absolute.right-0 {
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 0.5rem;
    z-index: 1050;
  }
  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 55px;
    padding: 0 15px;
  }

  .navbar-toggler {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
      opacity: 0.8;
    }
  }
  .text-header {
    color: #ed592a !important;
  }

  .app-header {
    position: fixed !important;
    padding: 0!important;
    height: 55px;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1020;

    // Ensure dropdowns appear above other content
    .navbar-nav {
      position: relative;
      z-index: 1030;
    }
  }

  .app-body {
    margin-top: 55px;
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

  .btn-width-80 {
    width: 80px !important;
  }
  .btn-width-120 {
    width: 120px !important;
  }
  .btn-width-130 {
    width: 130px !important;
  }
  .btn-width-140 {
    width: 140px !important;
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
