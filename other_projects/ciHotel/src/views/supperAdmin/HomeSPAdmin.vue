<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='6'>
              <h6 class="mt-2">Super admin</h6>
            </b-col>

          </b-row>
          <hr/>
          <b-row>
            <b-col>
              <b-button variant="primary" class="pull-center px-4 default-btn-bg" @click="goToBrandList()">
                Quản lý thương hiệu
              </b-button>
            </b-col>
          </b-row>
          <br>
          <b-row>
            <b-col>
              <b-button variant="primary" class="pull-center px-4 default-btn-bg" @click="goToStoreList()">
                Quản lý cửa hàng
              </b-button>
            </b-col>
          </b-row>
          <br>
          <b-row>
            <b-col>
              <b-button variant="primary" class="pull-center px-4 default-btn-bg" @click="goToAdminStoreList()">
                Quản lý admin
              </b-button>
            </b-col>
          </b-row>
          <br>

        </b-card>
      </b-col>
    </b-row>
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
      this.$router.push('/hotel/list')
    },
    goToAdminStoreList () {
      this.$router.push('/admin-store/list')
    }
  }
}
</script>
