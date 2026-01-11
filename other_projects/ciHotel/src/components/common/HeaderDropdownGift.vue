<template>
  <div class="dropdown">
    <button class="dropdown-toggle" @click="toggleDropdown">
      <span class="white mr-3">
        <!--<i class="fa fa-gift fa-2x"/>-->
        <img src="/img/icons/sticker_5.png" class="iconsCustom"/>
      </span>
    </button>
    <div v-if="isOpen" class="dropdown-menu dropdown-menu-right">
      <a class="dropdown-item" href="#" @click.prevent="goToPoint">Điểm</a>
      <a class="dropdown-item" href="#" @click.prevent="goToPromo">Khuyến Mãi</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DefaultHeaderDropdownGift',
  data: function() {
    return{
      isOpen: false
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
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
