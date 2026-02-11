<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton class="inline-flex items-center">
      <span class="white mr-3">
        <img src="/static/img/icons/sticker_4.png" class="iconsCustom"/>
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
              @click.prevent="goToPoint"
              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm cursor-pointer']"
            >
              Điểm
            </a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              @click.prevent="goToPromo"
              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm cursor-pointer']"
            >
              Khuyến Mãi
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script>
import { useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

export default {
  name: 'DefaultHeaderDropdownGift',
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
  },
  setup() {
    const router = useRouter()
    return { router }
  },
  data: function() {
    return{

    }
  },
  methods: {
    goToPoint() {
      this.router.push("/point")
    },
    goToPromo() {
      this.router.push("/promo")
    }
  }
}
</script>
