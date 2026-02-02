<template>
  <div class="app">
    <div v-if="this.$route.name != 'Login'">
      <header v-if="!userStore.user" class="header-custom app-header">
        <div class="header-container">
          <div class="nav-left">
            <button @click="activePushedMenu = !activePushedMenu" display="lg" type="button" class="navbar-toggler">
              <img src="/img/icons/sticker_1.png" class="iconsCustom"/>
            </button>

            <router-link class="nav-link home-icon" to="/">
              <img src="/img/icons/sticker_2.png" class="iconsCustom"/>
            </router-link>
          </div>
        </div>
      </header>

       <!-- đăng nhập xong sẽ dùng đoạn code bên dưới -->
      <header v-if="userStore.user"  class="header-custom app-header">
        <div class="header-container">
          <div class="nav-left">
            <button @click="activePushedMenu = !activePushedMenu" display="lg" type="button" class="navbar-toggler">
              <img src="/img/icons/sticker_1.png" class="iconsCustom"/>
            </button>
            <router-link class="nav-link home-icon" to="/overview">
              <img src="/img/icons/sticker_2.png" class="iconsCustom"/>
            </router-link>
          </div>

          <nav class="navbar-nav">
            <!-- hiện cho template staff -->
            <div class="profile-section" v-if="userStore.user?.userType == 'staff'">
              <span class="profile-text">
                {{ userStore.user?.userName }}
                <br>
                <span class="text-muted">
                  ({{ userStore.user?.role }})
                </span>
              </span>
              <HeaderDropdownStaffAcc />
            </div>
            <!-- end -->
          </nav>
        </div>
      </header>

      <div class="app-body" >
        <div>
          <div class="bg-pushed-menu" v-if="activePushedMenu" @click="activePushedMenu = false"></div>
          <div>

            <!-- Menu: User not login -->
            <sidebar-menu v-if="!userStore.user" width="300px" fixed v-show="activePushedMenu"
                          :menu="navCusNotLogin">
              <template #toggle-icon>
                <span class="my-toggle-icon-wrapper">
                  <i class="fa-solid fa-arrows-left-right" aria-hidden="true"></i>
                </span>
              </template>
              <template #dropdown-icon>
                 <span class="my-dropdown-icon-wrapper">
                    <i class="fa-solid fa-angle-left" aria-hidden="true"></i>
                 </span>
              </template>
            </sidebar-menu>

            <!-- Menu: staff -->
            <sidebar-menu v-if="userStore.user && !userStore.user.isSuper" class="debug-collapsed"
                          width="300px" fixed v-show="activePushedMenu" :menu="userStore.menu">
              <template #toggle-icon>
                <span class="my-toggle-icon-wrapper">
                  <i class="fa-solid fa-arrows-left-right" aria-hidden="true"></i>
                </span>
              </template>
              <template #dropdown-icon>
                <span class="my-dropdown-icon-wrapper">
                  <i class="fa-solid fa-angle-left" aria-hidden="true"></i>
                </span>
              </template>
            </sidebar-menu>

            <!-- Menu: super admin -->
            <sidebar-menu v-if="userStore.user && userStore.user.isSuper"
                          width="300px" fixed v-show="activePushedMenu" :menu="navSpAdmin">
              <template #toggle-icon>
                <span class="my-toggle-icon-wrapper">
                  <i class="fa-solid fa-arrows-left-right" aria-hidden="true"></i>
                </span>
              </template>
              <template #dropdown-icon>
                <span class="my-dropdown-icon-wrapper">
                  <i class="fa-solid fa-angle-left" aria-hidden="true"></i>
                </span>
              </template>
            </sidebar-menu>
          </div>

          <!-- Audio: Notification -->
          <audio id = "audioNotification" src="/sound/on_message.mp3" type="audio/mp3" muted="false"></audio>
          <button type="button" id="btnPlayNotify" v-on:click="playNotify" hidden>
            Play
          </button>
        </div>

        <main class="main">
          <router-view />
        </main>

      </div>
    </div>

    <div v-if="this.$route.name == 'Login'">
      <main class="main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user'
import navSpAdmin from '@/navSpAdmin'
import navBrandManager from '@/navBrandManager'
import navAdmin from '@/navAdmin'
import navCashier from '@/navCashier'
import navCusNotLogin from '@/navCusNotLogin'
import navCus from '@/navCus'
import navStaff from '@/navStaff'
import navKitchen from '@/navKitchen'
import HeaderDropdownStaffAcc from '@/components/common/HeaderDropdownStaffAcc.vue'
import {Constant} from '@/common/constant'
import { SidebarMenu } from 'vue-sidebar-menu'
import staffAPI from '@/api/staff'
import commonFunc from "@/common/commonFunc";


export default {
  name: 'App',
  components: {
    SidebarMenu,
    HeaderDropdownStaffAcc
  },
  setup() {
    const userStore = useUserStore()
    return {
      userStore
    }
  },
  data () {
    return {
      language: 'en',
      navCus: navCus.items,
      navCusNotLogin: navCusNotLogin.items,
      navSpAdmin: navSpAdmin.items,
      navAdmin: navAdmin.items,
      navBrandManager: navBrandManager.items,
      navCashier: navCashier.items,
      navStaff: navStaff.items,
      navKitchen: navKitchen.items,
      fullName: '',
      size: 40,
      roleCus: Constant.ROLE_CUS,
      roleBrandManager: Constant.ROLE_BRAND_MANGER,
      roleAdmin: Constant.ROLE_ADMIN,
      roleCashier: Constant.ROLE_CASHIER,
      roleStaff: Constant.ROLE_STAFF,
      roleKitchen: Constant.ROLE_KITCHEN,
      roleSpAdmin: Constant.ROLE_SP_ADMIN,
      notifyNumber: 0,
      activePushedMenu: false,
    }
  },
  watch: {
    '$route' (newVal, oldVal) {
      this.activePushedMenu = false
    }
  },
  mounted() {
    // Check login
    if(!this.userStore.user || !this.userStore.user.id) {
      this.$router.push('/staff-login')
    }

    // Get lại menu bar nếu có user
    this.getMenuBar()
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched.filter((route) => route.name || route.meta.label)
    }
  },
  methods: {
    /**
     * Go to notification
     */
    goToNotification() {
      this.$router.push("/notification")
    },

    /**
     * Play sound notify
     */
    playNotify() {
      var audio = document.getElementById("audioNotification")
      audio.muted = false;
      audio.play();
    },

    getMenuBar() {
      if(this.userStore && this.userStore.user && this.userStore.user.id) {
        staffAPI.getMenuBar(this.userStore.user.id).then(res => {
          if(res != null && res.data != null && res.data.data != null){
            this.userStore.updateMenu(res.data.data)
          } else {
             this.userStore.updateMenu(this.navAdmin);
          }
        }).catch(err => {
          // Handle error
          this.userStore.updateMenu(this.navAdmin);
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    }
  }
}
</script>

<style lang="scss">
// CoreUI Icons Set
  @use 'assets/scss/style';
  @use 'assets/scss/rsw';
  @use 'assets/scss/sidebar.scss';

  .debug-collapsed .vsm--menu-item--has-children > .vsm--dropdown-container {
  display: block !important;
  position: static !important;
  width: 220px !important;          /* or whatever fits */
  min-width: 180px !important;
  background: #fff;                  /* adjust to your theme */
  border: 1px solid #ddd;
  box-shadow: 2px 2px 10px rgba(0,0,0,0.15);
  margin-left: 65px;                 /* push it out from collapsed width */
  z-index: 100;
}

/* Make sure parent item is wide enough */
.debug-collapsed .vsm--menu-item {
  width: auto !important;
}

/* Optional: hide flyout arrow / hover behavior */
.debug-collapsed .vsm--arrow {
  display: none;
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
    align-content: center;
    .home-icon {
      padding: .5rem .5rem .5rem .2rem;
    }
  }
  .app-body .sidebar.active {
    margin-left: 0;
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
    padding: 4px 0px; /* Match production padding */
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
  /* Hide default sidebar arrow to show Font Awesome caret icons */
  // .v-sidebar-menu .vsm--arrow_default {
  //   display: none !important;
  // }
  .profile-section {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Sidebar custom styles to match production */
  .v-sidebar-menu {
    top: 55px!important;
    height: calc(100vh - 55px);
    background-color: #1e293b !important; /* Sidebar dark blue-gray (Slate-800) */
  }
  .v-sidebar-menu.vsm_expanded {
    width: 300px!important;
  }
  .v-sidebar-menu .vsm--link_level-1 {
    font-weight: 600;
  }

  /* Inactive link/icon color */
  /* FORCE positioning with high specificity to fix alignment issues */
  body .v-sidebar-menu .vsm--link,
  body .v-sidebar-menu .vsm--toggle-btn {
    position: relative !important;
    display: flex !important;
    align-items: center;
  }

  body .v-sidebar-menu .vsm--link {
    color: #cbd5e1 !important; /* Slate-300 */
    padding-right: 35px !important; /* Space for the arrow */
  }

  /* Active link color */
  body .v-sidebar-menu .vsm--link_active .vsm--title,
  body .v-sidebar-menu .vsm--link_active .vsm--icon {
    color: #d63384 !important; /* Pink active color */
  }
  
  /* Remove Lato font from sidebar text only (preserve Icon fonts) */
  .v-sidebar-menu .vsm--title {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    flex: 1; /* Allow title to take available space */
  }

  /* Hover effect for sidebar items */
  .v-sidebar-menu .vsm--link:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: #fff !important;
  }
  .v-sidebar-menu .vsm--link:hover .vsm--icon {
    color: #fff !important;
  }

  /* Dropdown icon rotation (Left to Down) */
  /* Dropdown icon rotation (Left to Down) */
  /* Target the custom wrapper */
  .my-dropdown-icon-wrapper {
    display: flex !important;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  
  /* When the item is open (expanded), rotate the wrapper */
  /* When the item is open (expanded), rotate the arrow. 
     We target .vsm--arrow.vsm--arrow_open directly because vsm--item_open is not present on the parent in this version. */
  .v-sidebar-menu .vsm--arrow.vsm--arrow_open {
    transform: translateY(-50%) rotate(-90deg) !important;
  }

  /* Reset wrapper rotation as we are rotating the parent arrow */
  .v-sidebar-menu .vsm--arrow.vsm--arrow_open .my-dropdown-icon-wrapper {
     transform: none !important;
  }

  /* Toggle icon wrapper - ensure it centers */
  .my-toggle-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: black;
    background-color: #f5f5f5;
  }

  /* Correctly handle vsm--arrow: visible container, hidden pseudo-content */
  .v-sidebar-menu .vsm--arrow {
     display: block !important;
     position: absolute !important;
     right: 15px !important;
     top: 50% !important;
     transform: translateY(-50%);
     width: 20px !important;
     height: 20px !important;
     transition: transform 0.3s;
  }

  /* Hide the default font-awesome pseudo element if present */
  .v-sidebar-menu .vsm--arrow:after, 
  .v-sidebar-menu .vsm--arrow::after {
     display: none !important;
     content: none !important;
  }

  /* Handle rotation state on the arrow container itself */
  /* Redundant rule removed, handled above */

  /* Hide the default font-awesome pseudo element on toggle button */
  .v-sidebar-menu .vsm--toggle-btn::after,
  .v-sidebar-menu .vsm--toggle-btn:after {
      display: none !important;
      content: none !important;
  }

  .bg-pushed-menu {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
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

  .app-body {
    margin-top: 55px; /* Push content down below fixed header */
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
