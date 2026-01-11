<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <div class="bg-white shadow-sm rounded p-4">
          <div class="row mb-4">
            <div class="col-md-6">
              <h6 class="mt-2">Super admin</h6>
            </div>
          </div>
          <hr/>

          <div class="row mb-3">
            <div class="col">
              <button
                @click="goToBrandList"
                class="btn btn-primary px-4 w-100">
                Quản lý thương hiệu
              </button>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col">
              <button
                @click="goToStoreList"
                class="btn btn-primary px-4 w-100">
                Quản lý cửa hàng
              </button>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col">
              <button
                @click="goToAdminStoreList"
                class="btn btn-primary px-4 w-100">
                Quản lý admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'HomeSPAdmin',
  setup() {
    const router = useRouter()

    const goToBrandList = () => {
      router.push('/brand/list')
    }

    const goToStoreList = () => {
      router.push('/hotel/list')
    }

    const goToAdminStoreList = () => {
      router.push('/admin-store/list')
    }

    return {
      goToBrandList,
      goToStoreList,
      goToAdminStoreList
    }
  }
}
</script>
