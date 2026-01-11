<template>
  <div class="app">
    <template v-if="route.name != 'Login'">
      <header class="fixed top-0 left-0 right-0 w-full h-[55px] bg-[#444444] z-[1001] p-0" v-if="authStore.user == null">
        <div class="flex items-center justify-between w-full px-4">
          <div class="flex items-center gap-1">
            <button @click="toggleSidebarVisibility" type="button" class="bg-transparent border-0 cursor-pointer p-2 flex items-center justify-center hover:bg-white/10 rounded">
              <img src="/img/icons/sticker_1.png" class="h-10"/>
            </button>

            <router-link class="flex items-center justify-center p-2 no-underline hover:bg-white/10 rounded" to="/">
              <span class="mr-2"></span>
              <img src="/img/icons/Sticker_2.png" class="h-10"/>
            </router-link>
          </div>
        </div>
      </header>

       <!-- đăng nhập xong sẽ dùng đoạn code bên dưới -->
      <header class="fixed top-0 left-0 right-0 w-full h-[55px] bg-[#444444] z-[1001] p-0" v-if="authStore.user">
        <div class="flex items-center justify-between w-full px-4">
          <div class="flex items-center gap-1">
            <button @click="toggleSidebarVisibility" type="button" class="bg-transparent border-0 cursor-pointer p-2 flex items-center justify-center hover:bg-white/10 rounded">
              <img src="/img/icons/sticker_1.png" class="h-10"/>
            </button>
            <router-link class="flex items-center justify-center p-2 no-underline hover:bg-white/10 rounded" to="/">
              <span class="mr-2"></span>
              <img src="/img/icons/Sticker_2.png" class="h-10"/>
            </router-link>
          </div>

        <div class="flex items-center gap-4">
          <!-- hiện cho template customer -->
           <HeaderDropdownGift v-if="authStore.user.userType == 'customer'"/>
          <div class="relative" v-if="authStore.user.userType == 'customer'">
            <a href="#" class="block" @click.prevent="goToNotification">
              <span class="text-white mr-3 relative">
                <img src="/img/icons/sticker_5.png" class="h-10"/>
                <span class="absolute top-2.5 right-1.5 rounded-full bg-white w-6 h-6 text-red-600 flex items-center justify-center text-xs font-semibold">{{ notifyNumber }}</span>
              </span>
            </a>
          </div>

           <HeaderDropdownCusAcc v-if="authStore.user.userType == 'customer'"/>
          <!-- end -->

          <!-- hiện cho template staff -->
          <template v-if="authStore.user.userType == 'staff'">
            <span class="text-white text-right">
              {{ authStore.user.userName }}
              <br>
              <span class="text-muted">
                ({{ authStore.user.role }})
              </span>
            </span>
            <HeaderDropdownStaffAcc />
          </template>
          <!-- end -->

        </div>
        </div>

        <!--TODO-->
        <!--<ListRoom ref="listRoom" hidden></ListRoom>-->
      </header>

      <div>
        <div class="fixed top-0 left-0 right-0 bottom-0 z-10 bg-black/50" v-if="sidebarVisible && !sidebarCollapsed" @click="toggleSidebarVisibility"></div>

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
        <!--<audio id = "audioNotification" src="/sound/on_message.mp3" type="audio/mp3" muted="false"></audio>-->
        <!--<button type="button" id="btnPlayNotify" @click="playNotify" hidden>-->
          <!--Play-->
        <!--</button>-->

        <main class="mt-10 transition-[margin-left] duration-300">
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

<script>
import navSpAdmin from '@/navSpAdmin'
import navBrandManager from '@/navBrandManager'
import navAdmin from '@/navAdmin'
import navCashier from '@/navCashier'
import navCusNotLogin from '@/navCusNotLogin'
import navCus from '@/navCus'
import navStaff from '@/navStaff'
import navKitchen from '@/navKitchen'
import HeaderDropdownCusAcc from '@/components/common/HeaderDropdownCusAcc'
import HeaderDropdownStaffAcc from '@/components/common/HeaderDropdownStaffAcc'
import HeaderDropdownGift from '@/components/common/HeaderDropdownGift'
import CustomSidebar from '@/components/common/CustomSidebar.vue'
import {Constant} from '@/common/constant'
import { RootAPI } from '@/api/index'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'App',
  components: {
    CustomSidebar,
    HeaderDropdownCusAcc,
    HeaderDropdownStaffAcc,
    HeaderDropdownGift
  },
  data () {
    return {
      language: 'en',
      navCus: navCus.items || [],
      navCusNotLogin: navCusNotLogin.items || [],
      navSpAdmin: navSpAdmin.items || [],
      navAdmin: navAdmin.items || [],
      navBrandManager: navBrandManager.items || [],
      navCashier: navCashier.items || [],
      navStaff: navStaff.items || [],
      navKitchen: navKitchen.items || [],
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
      sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
      sidebarVisible: localStorage.getItem('sidebarVisible') !== 'false'
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    },
    route() {
      return this.$route
    }
  },
  watch: {
    '$route.path'() {
      // Close sidebar on mobile when route changes
      if (window.innerWidth < 992 && this.sidebarVisible) {
        this.sidebarVisible = false
      }
    }
  },
  methods: {
    /**
     * Toggle sidebar visibility (show/hide)
     */
    toggleSidebarVisibility() {
      this.sidebarVisible = !this.sidebarVisible
      localStorage.setItem('sidebarVisible', this.sidebarVisible.toString())
    },

    /**
     * Toggle sidebar collapsed state (expand/collapse)
     */
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
      localStorage.setItem('sidebarCollapsed', this.sidebarCollapsed.toString())
    },

    /**
     * Go to notification
     */
    goToNotification() {
      window.location.href = "/notification"
    },

    /**
     * Play sound notify
     */
    playNotify() {
      const audio = document.getElementById("audioNotification")
      if (audio) {
        audio.muted = false
        audio.play()
      }
    }
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

  // Utility classes that complement Tailwind
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

  // Custom sidebar behavior with Tailwind-based main content
  .custom-sidebar:not(.collapsed) ~ .main {
    margin-left: 0;
  }
</style>
