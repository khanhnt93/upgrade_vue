<template>
  <AppHeaderDropdown
    right
    no-caret
  >
    <template slot="header">
      <span>
        <!--<i class="fa fa-user fa-2x" />-->
        <img src="/static/img/icons/sticker_5.png" class="iconsCustom"/>
      </span>
    </template>
    <template slot="dropdown">
      <b-dropdown-item @click.prevent="goToCusInfo">Thông tin cá nhân
      </b-dropdown-item>
      <b-dropdown-item @click.prevent="goToChangePass">Đổi Mật Khẩu
      </b-dropdown-item>
      <b-dropdown-item @click.prevent="logOut">Thoát</b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from '@coreui/vue'


export default {
  name: 'DefaultHeaderDropdownAccnt',
  components: {
    AppHeaderDropdown
  },
  data: function() {
    return{

    }
  },
  methods: {
    logOut () {
      this.$store.commit('removeToken')
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
