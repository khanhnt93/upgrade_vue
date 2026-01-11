<template>
  <div class="dropdown">
    <button class="dropdown-toggle" @click="toggleDropdown">
      <span>
        <i class="fa fa-user fa-2x" />
      </span>
    </button>
    <div v-if="isOpen" class="dropdown-menu dropdown-menu-right">
      <a class="dropdown-item" href="/login">Đăng nhập</a>
      <a class="dropdown-item" href="/register">Đăng ký</a>
      <a class="dropdown-item" href="/staff-login">Nhân viên</a>
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
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    }
  }
}  },
  data: function() {
    return{
    }
  },
  methods: {
  }
}
</script>
