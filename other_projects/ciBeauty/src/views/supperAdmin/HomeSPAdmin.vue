<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-6">
              <h6 class="mt-2">Super admin</h6>
            </div>

          </div>
          <hr/>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <button class="btn pull-center px-4 default-btn-bg" @click="goToBrandList()">
                Quản lý thương hiệu
              </button>
            </div>
          </div>
          <br>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <button class="btn pull-center px-4 default-btn-bg" @click="goToStoreList()">
                Quản lý cửa hàng
              </button>
            </div>
          </div>
          <br>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <button class="btn pull-center px-4 default-btn-bg" @click="goToAdminStoreList()">
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
export default {
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    goToBrandList () {
      this.$router.push('/brand/list')
    },
    goToStoreList () {
      this.$router.push('/store/list')
    },
    goToAdminStoreList () {
      this.$router.push('/admin-store/list')
    }
  }
}
</script>
