<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton class="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none">
        <font-awesome-icon icon="user" class="text-2xl" />
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
      <MenuItems class="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <div class="px-1 py-1">
          <MenuItem v-slot="{ active }">
            <router-link
              to="/login"
              :class="[
                active ? 'bg-primary-500 text-white' : 'text-gray-900',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm'
              ]"
            >
              <font-awesome-icon icon="sign-in-alt" class="mr-2 h-4 w-4" />
              Đăng nhập
            </router-link>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <router-link
              to="/register"
              :class="[
                active ? 'bg-primary-500 text-white' : 'text-gray-900',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm'
              ]"
            >
              <font-awesome-icon icon="user-plus" class="mr-2 h-4 w-4" />
              Đăng ký
            </router-link>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <router-link
              to="/staff-login"
              :class="[
                active ? 'bg-primary-500 text-white' : 'text-gray-900',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm'
              ]"
            >
              <font-awesome-icon icon="user-tie" class="mr-2 h-4 w-4" />
              Nhân viên
            </router-link>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
</script>

<style scoped>
/* Component styles */
</style>
