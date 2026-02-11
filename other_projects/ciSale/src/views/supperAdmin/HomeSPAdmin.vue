<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full md:w-1/2 px-2">
              <h6 class="mt-2">Super admin</h6>
            </div>

          </div>
          <hr/>
          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <button class="btn btn-primary pull-center px-4 default-btn-bg" @click="goToBrandList()">
                Quản lý thương hiệu
              </button>
            </div>
          </div>
          <br>
          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <button class="btn btn-primary pull-center px-4 default-btn-bg" @click="goToStoreList()">
                Quản lý cửa hàng
              </button>
            </div>
          </div>
          <br>
          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <button class="btn btn-primary pull-center px-4 default-btn-bg" @click="goToAdminStoreList()">
                Quản lý admin
              </button>
            </div>
          </div>
          <br>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    return { router }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    goToBrandList () {
      this.router.push('/brand/list')
    },
    goToStoreList () {
      this.router.push('/store/list')
    },
    goToAdminStoreList () {
      this.router.push('/admin-store/list')
    }
  }
}
</script>
