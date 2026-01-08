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
      <!--<b-dropdown-item @click.prevent="goToStaffInfo">Thông tin cá nhân</b-dropdown-item>-->
      <b-dropdown-item @click.prevent="goToChangePass">Đổi Mật Khẩu</b-dropdown-item>
      <b-dropdown-item @click.prevent="logOut">Thoát</b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from '@coreui/vue'
import {Constant} from '@/common/constant'


export default {
  name: 'DefaultHeaderDropdownAccnt',
  components: {
    AppHeaderDropdown
  },
  data: function() {
    return{
      roleAdmin: Constant.ROLE_ADMIN,
    }
  },
  methods: {
    logOut () {
      this.$store.commit('removeToken')
      this.$router.push('/staff-login')
    },
    goToChangePass () {
      this.$router.push('/staff-change-password')
    },
    goToStaffInfo () {
      this.$router.push('/staff-info')
    }
  }
}
</script>
