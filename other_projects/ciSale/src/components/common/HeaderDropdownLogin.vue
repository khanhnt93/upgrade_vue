<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton class="inline-flex items-center">
      <span>
        <i class="fa fa-user fa-2x" />
      </span>
    </MenuButton>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <a
              href="/login"
              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
            >
              Đăng nhập
            </a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              href="/register"
              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
            >
              Đăng ký
            </a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              href="/staff-login"
              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
            >
              Nhân viên
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>


<script>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'


export default {
  name: 'DefaultHeaderDropdownAccnt',
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
  },
  data: function() {
    return{
    }
  },
  methods: {
  }
}
</script>
