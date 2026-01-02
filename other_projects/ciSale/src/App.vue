<template>
  <div class="app">
    <template v-if="this.$route.name != 'Login'">
      <AppHeader fixed v-if="this.$store.state.user == null" class="header-custom">
        <div class="container-fluid">
          <div class="nav-left">
            <button @click="activePushedMenu = !activePushedMenu" display="lg" type="button" class="navbar-toggler">
                <!--<span class="navbar-toggler-icon"></span>-->
              <img src="/static/img/icons/sticker_1.png" class="iconsCustom"/>
            </button>

            <b-link class="nav-link home-icon" to="/">
                <span class="mr-2"></span>
              <img src="/static/img/icons/sticker_2.png" class="iconsCustom"/>
            </b-link>
          </div>
        </div>
      </AppHeader>

       <!-- đăng nhập xong sẽ dùng đoạn code bên dưới -->
      <AppHeader fixed v-if="this.$store.state.user"  class="header-custom">
        <div class="header-container">
          <div class="nav-left">
            <button @click="activePushedMenu = !activePushedMenu" display="lg" type="button" class="navbar-toggler" >

              <!--<span class="navbar-toggler-icon"></span>-->
              <img src="/static/img/icons/sticker_1.png" class="iconsCustom"/>
            </button>
            <b-link class="nav-link home-icon" to="/">
              <span class="mr-2"></span>
              <img src="/static/img/icons/sticker_2.png" class="iconsCustom"/>
            </b-link>
          </div>

        <b-navbar-nav>
          <!-- hiện cho template customer -->
           <HeaderDropdownGift v-if="this.$store.state.user.userType == 'customer'"/>
          <li class="nav-item b-nav-dropdown dropdown">
            <a href="" class="nav-link dropdown-toggle dropdown-toggle-no-caret">
              <span class="white mr-3" v-if="this.$store.state.user.userType == 'customer'">
                <img @click.prevent="goToNotification" src="/static/img/icons/sticker_3.png" class="iconsCustom"/>
                <span class="badge">{{ notifyNumber }}</span>
              </span>
            </a>
          </li>

           <HeaderDropdownCusAcc v-if="this.$store.state.user.userType == 'customer'"/>
          <!-- end -->

          <!-- hiện cho template staff -->
          <template>
            <span class="white text-right"  v-if="this.$store.state.user.userType == 'staff'">
              {{ this.$store.state.user.userName }}
              <br>
              <span class="text-muted">
                ({{ this.$store.state.user.role }})
              </span>
            </span>
            <HeaderDropdownStaffAcc  v-if="this.$store.state.user.userType == 'staff'"/>
          </template>
          <!-- end -->

        </b-navbar-nav>
        </div>

        <!--TODO-->
        <!--<ListRoom ref="listRoom" hidden></ListRoom>-->
      </AppHeader>

      <div class="app-body" >
        <template>
          <div class="bg-pushed-menu" v-if="activePushedMenu" @click="activePushedMenu = false"></div>
          <template>

            <!-- Menu: User not login -->
            <sidebar-menu v-if="!this.$store.state.user" width="250px" fixed v-show="activePushedMenu"
                          :menu="navCusNotLogin">
              <span slot="toggle-icon"><i class="fa fa-arrows-h" aria-hidden="true"></i></span>
            </sidebar-menu>

            <!-- Menu: staff -->
            <sidebar-menu v-if="this.$store.state.user && !this.$store.state.user.isSuper"
                          width="280px" fixed v-show="activePushedMenu" :menu="this.$store.state.menu">
              <span slot="toggle-icon"><i class="fa fa-arrows-h" aria-hidden="true"></i></span>
              <span slot="dropdown-icon"><i class="fa fa-caret-down" aria-hidden="true"></i></span>
            </sidebar-menu>

            <!-- Menu: super admin -->
            <sidebar-menu v-if="this.$store.state.user && this.$store.state.user.isSuper"
                          width="250px" fixed v-show="activePushedMenu" :menu="navSpAdmin">
              <span slot="toggle-icon"><i class="fa fa-arrows-h" aria-hidden="true"></i></span>
            </sidebar-menu>
          </template>

        </template>

        <main class="main">
          <router-view />
        </main>

      </div>
    </template>

    <template v-if="this.$route.name == 'Login'">
      <main class="main">
        <router-view />
      </main>
    </template>
  </div>
</template>

<script>
import navSpAdmin from '@/navSpAdmin'
import navCusNotLogin from '@/navCusNotLogin'
import { Header as AppHeader} from '@coreui/vue'
import HeaderDropdownCusAcc from '@/components/common/HeaderDropdownCusAcc'
import HeaderDropdownStaffAcc from '@/components/common/HeaderDropdownStaffAcc'
import HeaderDropdownGift from '@/components/common/HeaderDropdownGift'
import {Constant} from '@/common/constant'
import { RootAPI } from '@/api/index'
import { SidebarMenu } from 'vue-sidebar-menu'


export default {
  name: 'App',
  components: {
    SidebarMenu,
    AppHeader,
    HeaderDropdownCusAcc,
    HeaderDropdownStaffAcc,
    HeaderDropdownGift
  },
  data () {
    return {
      language: 'en',
      navCusNotLogin: navCusNotLogin.items,
      navSpAdmin: navSpAdmin.items,
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

  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched.filter((route) => route.name || route.meta.label)
    }
  },
  created () {
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
    }
  }
}
</script>


<style lang="scss">
// CoreUI Icons Set
  /* Import Font Awesome Icons Set */
  $fa-font-path: '~font-awesome/fonts/';
  @import '~font-awesome/scss/font-awesome';
  @import '~bootstrap-vue/dist/bootstrap-vue';
  @import 'assets/scss/style';
  @import 'assets/scss/rsw';
  @import 'assets/scss/sidebar.scss';

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
    background-color: #444444 !important;
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
    padding: 0!important;
    height: 55px;
  }
  .v-sidebar-menu {
    top: 55px!important;
    height: calc(100vh - 55px);
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
