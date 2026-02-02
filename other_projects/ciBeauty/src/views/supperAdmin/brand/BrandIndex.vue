<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="card-body p-4"  >

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-6">
                <button class="btn btn-secondary pull-left px-4" @click="back">
                  Quay lại
                </button>
              </div>
              <div class="col-span-6">
                <button class="btn float-right px-4 default-btn-bg" @click="save" :disabled="saving">
                    Lưu
                </button>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 form-row">
              <div class="col-span-12">
                <h4 class="mt-2 text-center">Thương Hiệu</h4>
              </div>
            </div>
            <hr/>
            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="grid grid-cols-12 gap-4 form-row">
                <div class="col-span-3 mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
                </div>
                <div class="col-span-9">
                  <input
                  id="name"
                  type="text"
                  class="form-control"
                  autocomplete="new-password"
                  v-model="brand.name"
                  maxlength="100">
                  <div class="invalid-feedback invalid-feedback" :state="!errorName">
                    Vui lòng nhập tên
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 form-row">
                <div class="col-span-3 mt-2">
                  <label> Mô tả </label>
                </div>
                <div class="col-span-9">
                  <textarea class="form-control"
                    id="description"
                    rows="5"
                    v-model="brand.description"
                  ></textarea>
                </div>
              </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>


import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      brand: {
        "name": null,
        "description": null
      },
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    this.getBrandDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.brand.name)
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
      return !(this.errorName)
    },

    /**
     *  Get detail
     */
    getBrandDetail() {
      let brandId = this.$route.params.id
      if(brandId){
        this.loading = true

        adminAPI.getBrandDetail(brandId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.brand = res.data.data
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

      let brandId = this.$route.params.id
      if(brandId){
        // Edit
        this.brand.id = brandId
        adminAPI.updateBrand(this.brand).then(res => {
          this.saving = false
          if(res != null && res.data != null){
            if (res.data.status == 200) {
              // show popup success
              this.popToast('success', 'Cập nhật thương hiệu thành công!!! ')
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
        adminAPI.addBrand(this.brand).then(res => {
          this.saving = false
          if(res != null && res.data != null){

            if (res.data.status == 200) {
              this.$router.push("/brand/list")
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
      this.$router.push("/brand/list")
    }
  }
}
</script>
