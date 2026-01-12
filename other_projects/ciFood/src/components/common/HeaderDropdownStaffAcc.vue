<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton class="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none">
        <img src="/static/img/icons/sticker_5.png" class="h-8 w-8 rounded-full" alt="User" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems class="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <div class="px-1 py-1">
          <MenuItem v-slot="{ active }">
            <button
              @click="goToChangePass"
              :class="[
                active ? 'bg-primary-500 text-white' : 'text-gray-900',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm'
              ]"
            >
              <i class="fa fa-key mr-2 h-4 w-4"></i>
              Đổi Mật Khẩu
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              @click="logOut"
              :class="[
                active ? 'bg-danger-500 text-white' : 'text-gray-900',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm'
              ]"
            >
              <i class="fa fa-sign-out-alt mr-2 h-4 w-4"></i>
              Thoát
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

function logOut() {
  authStore.removeToken()
  router.push('/staff-login')
}

function goToChangePass() {
  router.push('/staff-change-password')
}

function goToStaffInfo() {
  router.push('/staff-info')
}
</script>

<style scoped>
/* Component styles */
</style>
