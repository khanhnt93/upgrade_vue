<template>
  <div class="dropdown">
    <button
      class="btn btn-link dropdown-toggle"
      type="button"
      @click="isOpen = !isOpen"
    >
      <img src="/img/icons/sticker_5.png" class="iconsCustom"/>
    </button>
    <div class="dropdown-menu" :class="{ show: isOpen }" style="right: 0; left: auto;">
      <a class="dropdown-item" href="#" @click.prevent="goToChangePass">Đổi Mật Khẩu</a>
      <a class="dropdown-item" href="#" @click.prevent="logOut">Thoát</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Constant } from '@/common/constant'

const router = useRouter()
const authStore = useAuthStore()
const isOpen = ref(false)

const roleAdmin = Constant.ROLE_ADMIN

const logOut = () => {
  authStore.logout()
  router.push('/login')
}

const goToChangePass = () => {
  isOpen.value = false
  router.push('/staff-change-password')
}

const goToStaffInfo = () => {
  isOpen.value = false
  router.push('/staff-info')
}
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  left: auto;
  z-index: 1050;
  display: none;
  min-width: 160px;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1.5rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  text-decoration: none;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #16181b;
}

.btn-link {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.dropdown-toggle::after {
  display: none;
}
</style>
