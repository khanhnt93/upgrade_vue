<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="p-4">
              <div class="form-row">
                <div md='12'>
                  <h4 class="mt-2 text-center">Admin store</h4>
                </div>
              </div>
              <hr/>
              <div class="form-row">
                <div md="3" class="mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-9 px-2">
                  <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model="adminStore.name"
                  maxlength="100">
                  <div :class="{'invalid-feedback d-block': errorName}">
                    Vui lòng nhập tên
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div md="3" class="mt-2">
                  <label> Số Điện Thoại </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-9 px-2">
                  <input
                  id="phone"
                  type="text"
                  class="form-control"
                  v-model="adminStore.phone_number"
                  autocomplete="new-password"
                  maxlength="20">
                  <div :class="{'invalid-feedback d-block': errorPhone}">
                    Vui lòng nhập số điện thoại
                  </div>
                </div>
              </div>

              <!--<div class="form-row">-->
                <!--<div md="3" class="mt-2">-->
                  <!--<label> Quyền </label><span class="error-sybol"></span>-->
                <!--</div>-->
                <!--<div class="w-full md:w-9 px-2">-->
                  <!--<select class="form-control"-->
                  <!--:options="options"-->
                  <!--id="city_id"-->
                  <!--type="text"-->
                  <!--class="form-control"-->
                  <!--v-model="adminStore.role_id"-->
                  <!--v-on:change="changeRole()"></select>-->

                  <!--<b-form-invalid-feedback  class="invalid-feedback" :state="!errorRole">-->
                    <!--Vui lòng chọn quyền-->
                  <!--</b-form-invalid-feedback>-->
                <!--</div>-->
              <!--</div>-->

              <div class="form-row">
                <div md="3" class="mt-2">
                  <label> Thương hiệu </label>
                </div>
                <div class="w-full md:w-9 px-2">
                  <select
                  :options="optionsBrand"
                  id="brand_id"
                  type="text"
                  class="form-control"
                  v-model="adminStore.brand_id"
                  v-on:change="changeBrand()"></select>
                  <!--<b-form-invalid-feedback  class="invalid-feedback" :state="!errorBrand">-->
                    <!--Vui lòng chọn thương hiệu-->
                  <!--</b-form-invalid-feedback>-->
                </div>
              </div>

              <div class="form-row">
                <div md="3" class="mt-2">
                  <label> Cửa Hàng </label>
                </div>
                <div class="w-full md:w-9 px-2">
                  <select class="form-control" :options="optionsStore" v-model="adminStore.store_id" v-on:change="changeStore()">
                  </select>
                  <!--<b-form-invalid-feedback  class="invalid-feedback" :state="!errorStore">-->
                    <!--Vui lòng chọn cửa hàng-->
                  <!--</b-form-invalid-feedback>-->
                </div>
              </div>
              <div class="form-row">
                <div md="3" class="mt-2">
                  <label> Mật Khẩu </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-9 px-2">
                  <input
                  id="pasword"
                  type="password"
                  class="form-control"
                  v-model="adminStore.password"
                  autocomplete="new-password"
                  maxlength="100">
                  <div :class="{'invalid-feedback d-block': errorPassword}">
                    Vui lòng nhập mật khẩu
                  </div>
                  <div :class="{'invalid-feedback d-block': errorLengthPassword}">
                    Mật khẩu phải ít nhất 6 kí tự
                  </div>
                </div>
              </div>

              <div class="mt-3">
                <div cols="6">
                  <button class="btn btn-secondary pull-left px-4" @click="back">
                    Quay lại
                  </button>
                </div>
                <div cols="6">
                  <button class="btn btn-primary pull-left px-4 default-btn-bg" :disabled="saving" @click="save">
                      Lưu
                  </button>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import superAdminAPI from '@/api/superAdmin'
import Mapper from '@/mapper/staff'
import MapperStore from '@/mapper/store'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      options: [
        {value: 1, text: 'Staff'},
        {value: 2, text: 'Admin'},
        {value: 6, text: 'Brand Manager'}
      ],
      optionsStore: [],
      optionsBrand: [],
      adminStore: {
        name: '',
        phone_number: '',
        password: '',
        store_id: null,
        brand_id: null
      },
      saving: false,
    }
  },
  mounted() {
    // Get brand options
    this.getOptionBrand()

    this.getStoreListDB()
    this.getAdminStoreDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.adminStore.name)
    },
    errorPhone: function () {
      return this.checkInfo(this.adminStore.phone_number)
    },
    // errorRole: function () {
    //   return this.checkInfo(this.adminStore.role_id)
    // },
    // errorBrand: function () {
    //   if(this.adminStore.role_id && this.adminStore.role_id == 6) {
    //     return this.checkInfo(this.adminStore.brand_id)
    //   }
    //   return false
    // },
    // errorStore: function () {
    //   if(this.adminStore.role_id && this.adminStore.role_id != 6) {
    //     return this.checkInfo(this.adminStore.store_id)
    //   }
    //   return false
    // },
    errorPassword: function () {
      if(!this.route.params.id) {
        return this.checkInfo(this.adminStore.password)
      }
      return false
    },
    errorLengthPassword () {
      if(this.errorPassword || !this.adminStore.password)
        return false
      if(this.click)
        return (this.adminStore.password.length < 6)
      return false
    },
  },
  methods: {
    checkInfo (info) {
      return (this.saving && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorName || this.errorPhone || this.errorRole || this.errorBrand || this.errorStore
          || this.errorPassword || this.errorLengthPassword)
    },

     /**
   * Make toast without title
   */
  popToast(variant, content) {
      this.toast(content, variant === 'danger' ? 'error' : variant)
    this.toast(content, variant === 'danger' ? 'error' : variant)
  },

    /**
     *  Get store options
     */
    getStoreListDB () {
      superAdminAPI.getStoreListDB().then(res => {
        console.log(res)
          if(res != null && res.data != null && res.data.data != null) {
            this.optionsStore = MapperStore.mapStoreModelListToDto(res.data.data)
          }
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
    },

    /**
     * Get detail
     */
    getAdminStoreDetail() {
      let AdminStoreId = this.route.params.id
      if(AdminStoreId){
        superAdminAPI.getAdminStoreDetail(AdminStoreId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.adminStore = res.data.data
          }
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    },

    /**
     * Save
     */
    save () {
      this.saving = true
      let result = this.checkValidate()
      if(result) {
        let adminStoreId = this.route.params.id
        if(adminStoreId){
          // Edit
          let adminStore = this.adminStore
          adminStore.id = adminStoreId
          superAdminAPI.editAdminStore(adminStore).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              let message = ""
              if (res.data.status == 200) {
                // show popup success
                this.$bvModal.msgBoxOk("Cập nhật thành công", {
                  title: "Cập Nhật Admin",
                  centered: true,
                  size: 'sm',
                  headerClass: 'bg-success',
                }).then(res => {
                  this.router.push("/admin-store/list")
                })
              }
            }
          }).catch(err => {
            this.saving = false
            console.log(err)
            // Show notify edit fail: TODO
            let message = ""
            if(err.response.data.status == 422) {
              message = err.response.data.mess
            } else {
              message = "Lỗi hệ thống"
            }
            this.$bvModal.msgBoxOk(message, {
              title: "Cập Nhật Admin",
              centered: true,
              size: 'sm',
              headerClass: 'bg-danger',
            })
          })
        } else {
          // Add
          superAdminAPI.addAdminStore(this.adminStore).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              let message = ""
              if (res.data.status == 200) {
                // show popup success
                this.$bvModal.msgBoxOk("Thêm thành công", {
                  title: "Thêm Admin",
                  centered: true,
                  size: 'sm',
                  headerClass: 'bg-success',
                }).then(res => {
                  this.router.push("/admin-store/list")
                })
              }
            }
          }).catch(err => {
            this.saving = false
            console.log(err)
            let message = ""
              if(err.response.data.status == 422) {
                message = err.response.data.mess
              } else {
                message = "Lỗi hệ thống"
              }
              this.$bvModal.msgBoxOk(message, {
                title: "Thêm Admin",
                centered: true,
                size: 'sm',
                headerClass: 'bg-danger',
              })
          })
        }
      } else {
        this.saving = false
      }
    },

    /**
     * Get brand options
     */
    getOptionBrand() {
      superAdminAPI.getBrandOption().then(res => {
        this.optionsBrand = [{"value": null, "text": ""}]
        if(res && res.data && res.data.data) {
          let brands = res.data.data
          for (var index in brands) {
            let brand = {
              value: brands[index].value,
              text: brands[index].text
            }
            this.optionsBrand.push(brand)
          }
        }

      }).catch(err => {
        // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
      })
    },

    /**
     * Event change brand
     */
    changeBrand() {
      let brandId = this.adminStore.brand_id
      if (brandId) {
        this.adminStore.store_id = null
      }
    },

    /**
     * Event change store
     */
    changeStore() {
      let storeId = this.adminStore.store_id
      if (storeId) {
        this.adminStore.brand_id = null
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.router.push("/admin-store/list")
    }
  }
}
</script>
