<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

            <b-row>
              <b-col cols="12">
                <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="back">
                  Quay lại
                </b-button>

                <b-button variant="outline-success" class="pull-right btn-width-120" @click="save" :disabled="saving">
                  Lưu
                </b-button>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-2 text-center text-header">Kênh Bán Hàng</h4>
              </b-col>
            </b-row>
            <hr/>
            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Code </label><span class="error-sybol"></span>
                </b-col>
                <b-col md="9">
                  <input
                  id="code"
                  type="text"
                  class="form-control"
                  v-model="saleChannel.code"
                  autocomplete="new-password"
                  maxlength="50">
                  <b-form-invalid-feedback class="invalid-feedback" :state="!errorCode">
                    Vui lòng nhập code
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
                </b-col>
                <b-col md="9">
                  <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model="saleChannel.name"
                  autocomplete="new-password"
                  maxlength="100">
                  <b-form-invalid-feedback class="invalid-feedback" :state="!errorName">
                    Vui lòng nhập tên
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>


import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      saleChannel: {
        "code": null,
        "name": null
      },
      click: false,
      saving: false,
      loading: false
    }
  },
  mounted() {
    // Get sale channel detail
    this.getSaleChannelDetail()
  },
  computed: {
    errorCode: function () {
      return this.checkInfo(this.saleChannel.code)
    },
    errorName: function () {
      return this.checkInfo(this.saleChannel.name)
    },
  },
  methods: {

    /**
   * Make toast without title
   */
  popToast(variant, content) {
    this.$bvToast.toast(content, {
      toastClass: 'my-toast',
      noCloseButton: true,
      variant: variant,
      autoHideDelay: 3000
    })
  },

    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorCode || this.errorName)
    },

    /**
     *  Get detail
     */
    getSaleChannelDetail() {
      let id = this.$route.params.id
      if(id){
        this.loading = true

        adminAPI.getSaleChannelDetail(id).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.saleChannel = res.data.data
          }

          this.loading = false
        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    },

    /**
     *  Save
     */
    save () {
      this.click = true

      let checkValidate = this.checkValidate()
      if(!checkValidate) {
        return
      }

      this.saving = true

      let id = this.$route.params.id
      if(id){
        // Edit
        this.saleChannel.id = id
        adminAPI.editSaleChannel(this.saleChannel).then(res => {
          this.saving = false
          if(res != null && res.data != null){
            if (res.data.status == 200) {
              // show popup success
              this.popToast('success', 'Cập nhật nhóm quyền thành công!!! ')
            }
          }
        }).catch(err => {
          this.saving = false
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      } else {
        // Add
        adminAPI.addSaleChannel(this.saleChannel).then(res => {
          this.saving = false
          if(res != null && res.data != null){

            if (res.data.status == 200) {
              this.$router.push("/sale-channel/list")
            }
          }
        }).catch(err => {
          this.saving = false
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push("/sale-channel/list")
    }
  }
}
</script>
