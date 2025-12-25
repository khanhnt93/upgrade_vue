<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 gap-4">
      <div class="w-full">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="w-full">
              <h6 class="mt-2">Super admin</h6>
            </div>

          </div>
          <hr/>
          <br>
          <div class="grid grid-cols-1 gap-4">
            <div class="w-full">
              <button class="btn btn-primary pull-center px-4 py-2 default-btn-bg" @click="goToStoreList()">
                Quản lý tổ chức
              </button>
            </div>
          </div>
          <br>
          <div class="grid grid-cols-1 gap-4">
            <div class="w-full">
              <button class="btn btn-primary pull-center px-4 py-2 default-btn-bg" @click="goToAdminStoreList()">
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
  methods: {
    goToStoreList () {
      this.$router.push('/store/list')
    },
    goToAdminStoreList () {
      this.$router.push('/admin-store/list')
    }
  }
}
</script>
