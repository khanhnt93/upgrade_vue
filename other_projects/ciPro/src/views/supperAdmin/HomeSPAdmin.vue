<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <h6 class="text-lg font-semibold">Super admin</h6>
      </div>
      <hr class="my-4" />
      
      <div class="space-y-4">
        <div>
          <button
            class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 default-btn-bg"
            @click="goToBrandList()">
            Quản lý thương hiệu
          </button>
        </div>
        
        <div>
          <button
            class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 default-btn-bg"
            @click="goToStoreList()">
            Quản lý cửa hàng
          </button>
        </div>
        
        <div>
          <button
            class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 default-btn-bg"
            @click="goToAdminStoreList()">
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
