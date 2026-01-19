<template>
  <div class="dropdown relative" ref="dropdownRef">
    <button 
      class="btn btn-link dropdown-toggle p-2 hover:bg-gray-100 rounded transition-colors" 
      type="button" 
      @click="toggleDropdown"
      aria-label="User menu"
    >
      <img src="/static/img/icons/sticker_5.png" class="iconsCustom"/>
    </button>
    <Transition name="dropdown">
      <div 
        v-if="isOpen" 
        class="dropdown-menu dropdown-menu-right absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
      >
        <button 
          class="dropdown-item w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700"
          @click="goToChangePass"
        >
          <i class="fas fa-key mr-2"></i>
          Đổi Mật Khẩu
        </button>
        <div class="border-t border-gray-200 my-1"></div>
        <button 
          class="dropdown-item w-full text-left px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
          @click="logOut"
        >
          <i class="fas fa-sign-out-alt mr-2"></i>
          Thoát
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

const logOut = () => {
  isOpen.value = false
  authStore.logout()
  router.push('/staff-login')
}

const goToChangePass = () => {
  isOpen.value = false
  router.push('/staff-change-password')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-item {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.dropdown-item:focus {
  outline: none;
}
</style>
