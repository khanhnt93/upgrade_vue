<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton class="inline-flex items-center">
      <img src="/static/img/icons/sticker_5.png" class="iconsCustom"/>
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
              @click.prevent="goToChangePass"
              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm cursor-pointer']"
            >
              Đổi Mật Khẩu
            </a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              @click.prevent="logOut"
              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm cursor-pointer']"
            >
              Thoát
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Constant } from '@/common/constant'

export default {
  name: 'DefaultHeaderDropdownAccnt',
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
  },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    return { authStore, router }
  },
  data: function() {
    return{
      roleAdmin: Constant.ROLE_ADMIN,
    }
  },
  methods: {
    logOut() {
      this.authStore.removeToken()
      this.router.push('/staff-login')
    },
    goToChangePass () {
      this.router.push('/staff-change-password')
    },
    goToStaffInfo () {
      this.router.push('/staff-info')
    }
  }
}
</script>
