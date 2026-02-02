<template>
  <AppHeaderDropdown
    right
    no-caret
  >
    <template slot="header">
      <span>
        <i class="fa fa-user fa-2x" />
      </span>
    </template>
    <template slot="dropdown">
      <a class="dropdown-item" href="/login">Đăng nhập</a>
      <a class="dropdown-item" href="/register">Đăng ký</a>
      <a class="dropdown-item" href="/staff-login">Nhân viên</a>
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
  }
}
</script>
