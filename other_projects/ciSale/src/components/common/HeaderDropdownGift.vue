<template>
  <AppHeaderDropdown
    right
    no-caret
  >
    <template slot="header">
      <span class="white mr-3">
        <!--<i class="fa fa-gift fa-2x"/>-->
        <img src="/static/img/icons/sticker_4.png" class="iconsCustom"/>
      </span>
    </template>
    <template slot="dropdown">
      <b-dropdown-item @click.prevent="goToPoint"> Điểm
      </b-dropdown-item>
      <b-dropdown-item @click.prevent="goToPromo"> Khuyến Mãi
      </b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from '@coreui/vue'
export default {
  name: 'DefaultHeaderDropdownGift',
  components: {
    AppHeaderDropdown
  },
  data: function() {
    return{

    }
  },
  methods: {
    goToPoint() {
      this.$router.push("/point")
    },
    goToPromo() {
      this.$router.push("/promo")
    }
  }
}
</script>
