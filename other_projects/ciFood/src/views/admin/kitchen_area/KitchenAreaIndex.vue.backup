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
                <h4 class="mt-2 text-center text-header">Khu Vực Chế Biến</h4>
              </b-col>
            </b-row>
            <hr/>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
                </b-col>
                <b-col md="9">
                  <input
                  id="name"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.name"
                  maxlength="255">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorName">
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
import Mapper from '@/mapper/promotion'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      inputs: {
        "id": null,
        "name": null
      },
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {

    this.getKitchenAreaDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.inputs.name)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorName)
    },

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

    /**
     * Make toast with title
     */
    makeToast(variant = null, title="Success!!!", content="Thao tác thành công!!!") {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true,
        autoHideDelay: 3000
      })
    },

    /**
     * Get kitchen area detail
     */
    getKitchenAreaDetail () {
      let id = this.$route.params.id
      if(id){
        this.loading = true

        adminAPI.getKitchenAreaDetail(id).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.inputs = res.data.data
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
     * Save promotion
     */
    save () {
      this.click = true
      this.saving = true

      // Check validate
      if(!this.checkValidate()) {
        this.saving = false
        return
      }

      let id = this.$route.params.id
      if(id){
        // Edit
        this.inputs.id = id
        adminAPI.editKitchenArea(this.inputs).then(res => {
          this.saving = false
          if(res != null && res.data != null){
            if (res.data.status == 200) {
              // show popup success
              this.popToast('success', 'Cập nhật khu vực chế biến thành công!!! ')
            }
          }
        }).catch(err => {
          this.saving = false
          // Show notify edit fail
          let message = ""
          if(err.response.data.status == 422) {
            message = err.response.data.mess
          } else {
            message = "Lỗi hệ thống"
          }
          this.makeToast('danger', "Cập nhật thất bại!!!", message)
        })
      } else {
        // Add
        adminAPI.addKitchenArea(this.inputs).then(res => {
          this.saving = false
          if(res != null && res.data != null){
            if (res.data.status == 200) {
              this.$router.push("/kitchen-area")
            }
          }
        }).catch(err => {
          this.saving = false
          let message = ""
            if(err.response.data.status == 422) {
              message = err.response.data.mess
            } else {
              message = "Lỗi hệ thống"
            }
            this.makeToast('danger', "Tạo mới thất bại!!!", message)
        })
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push("/kitchen-area")
    },
  }
}
</script>
