<template>
  <div class="dropdown">
    <button class="btn btn-link dropdown-toggle" type="button" @click="toggleDropdown">
      <img src="/static/img/icons/sticker_5.png" class="iconsCustom"/>
    </button>
    <div class="dropdown-menu dropdown-menu-right" :class="{ 'show': isOpen }">
      <button class="dropdown-item" @click.prevent="goToChangePass">Đổi Mật Khẩu</button>
      <button class="dropdown-item" @click.prevent="logOut">Thoát</button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { Constant } from '@/common/constant'

export default {
  name: 'HeaderDropdownStaffAcc',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      roleAdmin: Constant.ROLE_ADMIN,
      isOpen: false
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    logOut() {
      this.authStore.logout()
      this.$router.push('/staff-login')
    },
    goToChangePass() {
      this.$router.push('/staff-change-password')
      this.isOpen = false
    },
    goToStaffInfo() {
      this.$router.push('/staff-info')
      this.isOpen = false
    }
  }
}
</script>
