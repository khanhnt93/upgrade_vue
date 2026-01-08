<template>
  <div class="container-fluid px-4 py-4">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h6 class="text-lg font-semibold">Super admin</h6>
        </div>
        
        <hr class="mb-6">

        <!-- Navigation Buttons -->
        <div class="space-y-4">
          <button
            @click="goToBrandList"
            class="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 text-center">
            Quản lý thương hiệu
          </button>

          <button
            @click="goToStoreList"
            class="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 text-center">
            Quản lý cửa hàng
          </button>

          <button
            @click="goToAdminStoreList"
            class="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 text-center">
            Quản lý admin
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Methods
const goToBrandList = () => {
  router.push('/brand/list')
}

const goToStoreList = () => {
  router.push('/store/list')
}

const goToAdminStoreList = () => {
  router.push('/admin-store/list')
}
</script>
