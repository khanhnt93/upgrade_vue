<template>
  <div class="app">
    <template v-if="route.name !== 'Login'">
      <AppHeader v-if="!userStore.user" class="header-custom">
        <div class="header-container">
          <div class="nav-left">
            <button @click="toggleSidebarVisibility" type="button" class="navbar-toggler">
              <img src="/img/icons/sticker_1.png" class="iconsCustom"/>
            </button>

            <router-link class="nav-link home-icon" to="/">
              <span class="mr-2"></span>
              <img src="/img/icons/sticker_2.png" class="iconsCustom"/>
            </router-link>
          </div>
        </div>
      </AppHeader>

      <!-- đăng nhập xong sẽ dùng đoạn code bên dưới -->
      <AppHeader v-if="userStore.user" class="header-custom">
        <div class="header-container">
          <div class="nav-left">
            <button @click="toggleSidebarVisibility" type="button" class="navbar-toggler">
              <img src="/img/icons/sticker_1.png" class="iconsCustom"/>
            </button>
            <router-link class="nav-link home-icon" to="/overview">
              <span class="mr-2"></span>
              <img src="/img/icons/sticker_2.png" class="iconsCustom"/>
            </router-link>
          </div>

          <div class="navbar-nav">
            <template v-if="userStore.user">
              <span class="white text-right user-info">
                {{ userStore.user.userName }}
                <br>
                <span class="text-muted">
                  ({{ userStore.user.role }})
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
          v-if="!userStore.user"
          :collapsed="sidebarCollapsed"
          :visible="sidebarVisible"
          width="250px"
          :menu="navCusNotLogin"
          @toggle="toggleSidebar"
          @close="toggleSidebarVisibility" />

        <!-- Menu: staff -->
        <CustomSidebar
          v-if="userStore.user && !userStore.user.isSuper"
          :collapsed="sidebarCollapsed"
          :visible="sidebarVisible"
          width="280px"
          :menu="userStore.menu"
          @toggle="toggleSidebar"
          @close="toggleSidebarVisibility" />

        <!-- Menu: super admin -->
        <CustomSidebar
          v-if="userStore.user && userStore.user.isSuper"
          :collapsed="sidebarCollapsed"
          :visible="sidebarVisible"
          width="250px"
          :menu="navSpAdmin"
          @toggle="toggleSidebar"
          @close="toggleSidebarVisibility" />

        <main class="main">
          <router-view />
        </main>

        <!-- Audio: Notification -->
        <audio id="audioNotification" src="/sound/on_message.mp3" type="audio/mp3" muted="false"></audio>
        <button type="button" id="btnPlayNotify" v-on:click="playNotify" hidden>
          Play
        </button>
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
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import navSpAdminConfig from '@/navSpAdmin'
import navCusNotLoginConfig from '@/navCusNotLogin'
import AppHeader from '@/components/common/AppHeader.vue'
import HeaderDropdownStaffAcc from '@/components/common/HeaderDropdownStaffAcc.vue'
import CustomSidebar from '@/components/common/CustomSidebar.vue'
import staffAPI from '@/api/staff'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const navCusNotLogin = navCusNotLoginConfig.items
const navSpAdmin = navSpAdminConfig.items
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
  sidebarVisible.value = false
})

// Play sound notify
const playNotify = () => {
  const audio = document.getElementById('audioNotification')
  if (audio) {
    audio.muted = false
    audio.play()
  }
}

// Get menu bar if user exists
const getMenuBar = async () => {
  if (userStore.user && userStore.user.id) {
    try {
      const res = await staffAPI.getMenuBar(userStore.user.id)
      if (res?.data?.data) {
        userStore.updateMenu(res.data.data)
      }
    } catch (err) {
      console.error('Error loading menu:', err)
    }
  }
}

onMounted(() => {
  // Check login
  if (!userStore.user || !userStore.user.id) {
    router.push('/staff-login')
  }

  getMenuBar()
})
</script>

<style lang="scss">
// CoreUI Icons Set
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
    align-content: center;
    .home-icon {
      padding: .5rem .5rem .5rem .2rem;
    }
  }
  .header-custom {
    background-color: white !important;
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
  }
  .iconsCustom {
    width: 40px;
    height: 40px;
  }
  .navbar-toggler {
    padding: 4px 0px;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 55px;
  }
  .home-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    width: 56px;
    height: 55px;
  }

  .user-info {
    margin-right: 15px;
    text-align: right;
    line-height: 1.2;
    font-size: 14px;
  }

  .bg-pushed-menu {
    position: fixed;
    top: 55px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  /* Header positioning */
  .app-header {
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    height: 55px;
    z-index: 1030;
    background: #fff;
    border-bottom: 1px solid #c8ced3;
  }

  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 0 15px;
  }

  .nav-left {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .navbar-nav {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .app-body {
    margin-top: 55px;
  }

  /* Utility restoration */
  .btn-width-120 { width: 120px !important; }
  .btn-width-130 { width: 130px !important; }
  .btn-width-160 { width: 160px !important; }
  .btn-width-200 { width: 200px !important; }
  .width-30 { width: 30%; float: left; }
  .pre-line-content { white-space: pre-line; }
  .text-header { color: #FE4E7D !important; font-weight: bold; font-size: 24px; }
  .datepicker-cus {
    border: 1px solid #e4e7ea;
    border-radius: 0.25rem;
    width: 100% !important;
    height: 35px !important;
  }

</style>
