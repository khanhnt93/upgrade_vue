<template>
  <div class="w-full">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <h6 class="text-lg font-semibold">Super admin</h6>
      </div>
      <hr class="my-4" />
      
      <div class="space-y-4">
        <div>
          <button
            class="btn btn-lg btn-primary default-btn-bg"
            @click="goToBrandList()">
            Quản lý thương hiệu
          </button>
        </div>
        
        <div>
          <button
            class="btn btn-lg btn-primary default-btn-bg"
            @click="goToStoreList()">
            Quản lý cửa hàng
          </button>
        </div>
        
        <div>
          <button
            class="btn btn-lg btn-primary default-btn-bg"
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
