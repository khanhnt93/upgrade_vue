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
      <b-dropdown-item href="/login">Đăng nhập</b-dropdown-item>
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
