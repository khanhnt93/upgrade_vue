<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 gap-4">
      <div class="w-full">
        <div class="bg-white rounded-lg shadow">
          <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
                <div class="w-full md:col-span-12">
                  <h4 class="mt-2 text-center">Admin store</h4>
                </div>
              </div>
              <hr/>
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
                <div class="w-full md:col-span-3 mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:col-span-9">
                  <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model="adminStore.name"
                  maxlength="100">
                  <div v-if="errorName" class="invalid-feedback" style="display: block;">
                    Vui lòng nhập tên
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
                <div class="w-full md:col-span-3 mt-2">
                  <label> Số Điện Thoại </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:col-span-9">
                  <input
                  id="phone"
                  type="text"
                  class="form-control"
                  v-model="adminStore.phone_number"
                  autocomplete="new-password"
                  maxlength="20">
                  <div v-if="errorPhone" class="invalid-feedback" style="display: block;">
                    Vui lòng nhập số điện thoại
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
                <div class="w-full md:col-span-3 mt-2">
                  <label> Tổ chức </label>
                </div>
                <div class="w-full md:col-span-9">
                  <select class="form-control" v-model="adminStore.store_id">
                    <option v-for="option in optionsStore" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
                <div class="w-full md:col-span-3 mt-2">
                  <label> Mật Khẩu </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:col-span-9">
                  <input
                  id="pasword"
                  type="password"
                  class="form-control"
                  v-model="adminStore.password"
                  autocomplete="new-password"
                  maxlength="100">
                  <div v-if="errorPassword" class="invalid-feedback" style="display: block;">
                    Vui lòng nhập mật khẩu
                  </div>
                  <div v-if="errorLengthPassword" class="invalid-feedback" style="display: block;">
                    Mật khẩu phải ít nhất 6 kí tự
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 mt-3">
                <div class="w-full">
                  <button class="btn btn-secondary pull-left px-4" @click="back">
                    Quay lại
                  </button>
                </div>
                <div class="w-full">
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
import commonFunc from '@/common/commonFunc'
import { useToast } from 'vue-toastification'


export default {
  data () {
    return {
      options: [
        {value: 1, text: 'Staff'},
        {value: 2, text: 'Admin'}
      ],
      optionsStore: [],
      adminStore: {
        name: '',
        phone_number: '',
        password: '',
        store_id: null
      },
      saving: false,
    }
  },
  mounted() {
    this.toast = useToast()
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
    errorPassword: function () {
      if(!this.$route.params.id) {
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
      return !(this.errorName || this.errorPhone || this.errorPassword || this.errorLengthPassword)
    },

     /**
   * Make toast without title
   */
  popToast(variant, content) {
    switch(variant) {
      case 'success': this.toast.success(content); break;
      case 'danger': this.toast.error(content); break;
      case 'warning': this.toast.warning(content); break;
      default: this.toast.info(content);
    }
  },

    /**
     *  Get store options
     */
    getStoreListDB () {
      superAdminAPI.getStoreListDB().then(res => {
        console.log(res)
          if(res != null && res.data != null && res.data.data != null) {
            this.optionsStore = res.data.data
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
      let AdminStoreId = this.$route.params.id
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
        let adminStoreId = this.$route.params.id
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
                alert("Cập nhật thành công")
                this.$router.push("/admin-store/list")
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
            alert(message)
          })
        } else {
          // Add
          superAdminAPI.addAdminStore(this.adminStore).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              let message = ""
              if (res.data.status == 200) {
                // show popup success
                alert("Thêm thành công")
                this.$router.push("/admin-store/list")
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
              alert(message)
          })
        }
      } else {
        this.saving = false
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push("/admin-store/list")
    }
  }
}
</script>
