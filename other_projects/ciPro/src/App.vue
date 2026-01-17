<template>
  <div class="app">
    <template v-if="route.name != 'Login'">
      <header class="header-custom app-header navbar" v-if="authStore.user == null">
        <div class="header-container">

          <div class="nav-left">
            <button @click="toggleSidebarVisibility" type="button" class="navbar-toggler">
              <img src="/static/img/icons/sticker_1.png" class="iconsCustom"/>
            </button>

            <router-link class="nav-link home-icon" to="/">
                <span class="mr-2"></span>
              <img src="/static/img/project/home/logo_login.png" class="iconsLogo"/>
            </router-link>
          </div>

          <div class="ml-auto flex items-center">
            <!-- hiện cho template staff -->
            <div>
              <button class="btn px-4 py-2 border-2 border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors btn-width-120" @click="goToLogin">
                Đăng nhập
              </button>
            </div>
            <!-- end -->
          </div>
        </div>
      </header>

       <!-- đăng nhập xong sẽ dùng đoạn code bên dưới -->
      <header class="app-header navbar" v-if="authStore.user" >
        <div class="header-container">
          <div class="nav-left">
            <button @click="toggleSidebarVisibility" type="button" class="navbar-toggler">
              <img src="/static/img/icons/sticker_1.png" class="iconsCustom"/>
            </button>
            <router-link class="nav-link home-icon" to="/">
              <span class="mr-2"></span>
              <img src="/static/img/project/home/logo_login.png" class="iconsLogo"/>
            </router-link>
          </div>

          <div class="ml-auto flex items-center">
            <!-- hiện cho template staff -->
            <template>
              <span class="text-right"  v-if="authStore.user.userType == 'staff'">
                <b style="color: #0d0e10">{{ authStore.user.userName }}</b>
                <br>
                <span class="text-gray-500">
                  ({{ authStore.user.role }})
                </span>
              </span>
              <HeaderDropdownStaffAcc  v-if="authStore.user.userType == 'staff'"/>
            </template>
            <!-- end -->

          </div>
        </div>

        <!--TODO-->
        <!--<ListRoom ref="listRoom" hidden></ListRoom>-->
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
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import navSpAdminData from '@/navSpAdmin'
import navCusNotLoginData from '@/navCusNotLogin'
import HeaderDropdownStaffAcc from '@/components/common/HeaderDropdownStaffAcc.vue'
import CustomSidebar from '@/components/common/CustomSidebar.vue'
import {Constant} from '@/common/constant'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const navCusNotLogin = ref(navCusNotLoginData.items || [])
const navSpAdmin = ref(navSpAdminData.items || [])
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
  // Close sidebar on mobile when route changes
  if (window.innerWidth < 992 && sidebarVisible.value) {
    sidebarVisible.value = false
  }
})

const goToLogin = () => {
  router.push("/staff-login")
}

/**
 * Go to notification
 */
const goToNotification = () => {
  router.push("/notification")
}

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

  body {
    font-family: Arial, sans-serif !important; /* Đặt font mặc định là Arial */
    font-size: 12px !important; /* Đặt kích thước font mặc định (có thể điều chỉnh) */
  }

  .custom-select {
    font-size: 12px !important;
  }

  button {
    font-size: 12px !important;
  }

  .btn {
    font-size: 12px !important;
  }

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
    background-color: white !important;
    border-bottom: 1px solid #e4e7ea;
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
  .iconsLogo {
    width: auto;
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
  .vsm--title {
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
  .btn-width-250 {
    width: 250px !important;
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
    width: 100% !important;
    height: 40px !important;
  }
  .custom-select {
    height: 40px !important;
    position: relative !important;
  }
  .form-control {
    height: 40px !important;
  }

  .table-cus table {
    margin: auto;
    border-collapse: collapse;
    overflow-x: auto;
    display: block;
    width: fit-content;
    max-width: 100%;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, .1);
    border-radius: 10px;
  }

  .table-cus td, th {
    border: solid rgb(200, 200, 200) 1px;
    padding: .5rem;
  }

  .table-cus th {
    text-align: center;
    background-color: rgb(190, 220, 250);
    text-transform: uppercase;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: rgb(50, 50, 100) solid 2px;
    border-top: none;
  }

  /*.table-fix-header th {*/
    /*position: sticky;*/
    /* top: 0;  Cố định ở vị trí 0 khi cuộn */
    /*z-index: 9999;  Đảm bảo header không bị che khuất */
  /*}*/

  .table-cus td {
    /*white-space: nowrap;*/
    border-bottom: none;
    color: rgb(20, 20, 20);
  }

  .table-cus td:first-of-type, th:first-of-type {
    border-left: none;
  }

  .table-cus td:last-of-type, th:last-of-type {
    border-right: none;
  }

  .sub-table-cus table
  {
     table-layout:fixed;
     width:100%;
      border-radius: 10px !important;
  }

  .sub-table-cus td, th {
    border: solid rgb(200, 200, 200) 1px;
    padding: .5rem;
  }

  .sub-table-cus th {
    text-align: center;
    background-color: rgb(190, 220, 250) !important;
    text-transform: uppercase;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: rgb(50, 50, 100) solid 2px;
    border-top: none;
  }

  .sub-table-cus td {
    /*white-space: nowrap;*/
    border-bottom: none;
    color: rgb(20, 20, 20);
  }

  .sub-table-cus td:first-of-type, th:first-of-type {
    border-left: none;
  }

  .sub-table-cus td:last-of-type, th:last-of-type {
    border-right: none;
  }

  .a-like-button {
    background: none!important;
    border: none;
    padding: 0!important;
    /*optional*/
    font-family: arial, sans-serif;
    /*input has OS specific font-family*/
    color: #069;
    text-decoration: underline;
    cursor: pointer;
  }

  .fix-font-size {
    font-size: 12px !important;
  }

</style>
