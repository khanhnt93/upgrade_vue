<template>
  <div class="dropdown">
    <button class="dropdown-toggle" @click="toggleDropdown">
      <span>
        <!--<i class="fa fa-user fa-2x" />-->
        <img src="/img/icons/sticker_5.png" class="iconsCustom"/>
      </span>
    </button>
    <div v-if="isOpen" class="dropdown-menu dropdown-menu-right">
      <a class="dropdown-item" href="#" @click.prevent="goToCusInfo">Thông tin cá nhân</a>
      <a class="dropdown-item" href="#" @click.prevent="goToChangePass">Đổi Mật Khẩu</a>
      <a class="dropdown-item" href="#" @click.prevent="logOut">Thoát</a>
    </div>
  </div>
</template>

<script>


export default {
  name: 'DefaultHeaderDropdownAccnt',
  data() {
    return {
      isOpen: false
    }
  },
  data: function() {
    return{

    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    logOut () {
      authStore.removeToken()
      this.$router.push("/")
    },
    goToChangePass () {
      this.$router.push("/cus-change-password")
    },
    goToCusInfo() {
      this.$router.push("/user-info")
    }
  }
}
</script>
