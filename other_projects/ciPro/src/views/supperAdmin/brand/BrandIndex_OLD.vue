<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

            <b-row>
              <b-col cols="6">
                <b-button variant="secondary" class="pull-left px-4" @click="back">
                  Quay lại
                </b-button>
              </b-col>
              <b-col cols="6">
                <button class="btn btn-primary pull-right px-4 default-btn-bg" @click="save" :disabled="saving">
                    Lưu
                </button>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-2 text-center">Thương Hiệu</h4>
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
                  class="form-control"
                  autocomplete="new-password"
                  v-model="brand.name"
                  maxlength="100">
                  <b-form-invalid-feedback class="invalid-feedback" :state="!errorName">
                    Vui lòng nhập tên
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Mô tả </label>
                </b-col>
                <b-col md="9">
                  <b-form-textarea
                    id="description"
                    rows="5"
                    v-model="brand.description"
                  ></b-form-textarea>
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
import { useToast } from '@/composables/useToast'


export default {
  setup() {
    const { popToast } = useToast()
    return { popToast }
  },
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
