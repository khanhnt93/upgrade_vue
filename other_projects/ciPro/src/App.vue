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
              <img src="/static/img/project/home/logo_login.png" class="iconsLogo"/>
            </b-link>
          </div>

          <b-navbar-nav>
            <!-- hiện cho template staff -->
            <template>
              <div class="white text-right">
                <b-button variant="outline-danger" class="pull-right btn-width-120" @click="goToLogin">
                  Đăng nhập
                </b-button>
              </div>
            </template>
            <!-- end -->

          </b-navbar-nav>
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
              <img src="/static/img/project/home/logo_login.png" class="iconsLogo"/>
            </b-link>
          </div>

          <b-navbar-nav>
            <!-- hiện cho template staff -->
            <template>
              <span class="white text-right"  v-if="this.$store.state.user.userType == 'staff'">
                <b style="color: #0d0e10">{{ this.$store.state.user.userName }}</b>
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
              <span slot="toggle-icon">
                <i class="fa fa-arrows-h" aria-hidden="true"></i>
              </span>
            </sidebar-menu>

            <!-- Menu: staff -->
            <sidebar-menu v-if="this.$store.state.user && !this.$store.state.user.isSuper"
                          width="280px" fixed v-show="activePushedMenu" :menu="this.$store.state.menu">
              <span slot="toggle-icon"><i class="fa fa-arrows-h" aria-hidden="true"></i></span>
              <span slot="dropdown-icon">
                <i class="fa fa-caret-down" aria-hidden="true"></i>
              </span>
            </sidebar-menu>

            <!-- Menu: super admin -->
            <sidebar-menu v-if="this.$store.state.user && this.$store.state.user.isSuper"
                          width="250px" fixed v-show="activePushedMenu" :menu="navSpAdmin">
              <span slot="toggle-icon">
                <i class="fa fa-arrows-h" aria-hidden="true"></i>
              </span>
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
import HeaderDropdownStaffAcc from '@/components/common/HeaderDropdownStaffAcc'
import {Constant} from '@/common/constant'
import { SidebarMenu } from 'vue-sidebar-menu'
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)


export default {
  name: 'App',
  components: {
    SidebarMenu,
    AppHeader,
    HeaderDropdownStaffAcc
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
      activePushedMenu: false
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
  methods: {
      goToLogin() {
          this.$router.push("/staff-login")
      },
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

  body {
    font-family: Arial, sans-serif !important; /* Đặt font mặc định là Arial */
    font-size: 12px !important; /* Đặt kích thước font mặc định (có thể điều chỉnh) */
  }

  header {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
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
