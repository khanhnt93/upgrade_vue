<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="card-body p-4"  >

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-6">
                <button class="btn btn-outline-secondary pull-left px-4 btn-width-120" @click="back">
                  Quay lại
                </button>
              </div>
              <div class="col-span-6">
                <button class="btn btn-outline-success float-right px-4 btn-width-120" @click="save" :disabled="saving">
                    Lưu
                </button>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 row form-row">
              <div class="col-span-12">
                <h4 class="mt-2 text-center text-header">Nhóm quyền</h4>
              </div>
            </div>
            <hr/>
            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Code </label><span class="error-sybol"></span>
                </div>
                <div class="col-span-9">
                  <input
                  id="code"
                  type="text"
                  class="form-control"
                  v-model="role.code"
                  autocomplete="new-password"
                  maxlength="50">
                  <div class="invalid-feedback invalid-feedback" :state="!errorCode">
                    Vui lòng nhập code
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Name </label><span class="error-sybol"></span>
                </div>
                <div class="col-span-9">
                  <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model="role.name"
                  autocomplete="new-password"
                  maxlength="100">
                  <div class="invalid-feedback invalid-feedback" :state="!errorName">
                    Vui lòng nhập name
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row mt-5">
                <div class="col-span-full">
                  <label> Phân quyền vào chức năng </label>
                  <br>
                  <label> (Bạn hãy chọn những chức năng mà nhóm quyền này được quyền truy cập) </label>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-full">
                  <div v-for="group in groupScreen" :key="group.group_name">
                    <p><b>{{ group.group_name }}</b></p>
                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-4" v-for="screen in group.screen" :key="screen.screen_id">
                        <input :id="screen.screen_id" type="checkbox" v-model="role.screen" name="screens" :value="screen.screen_id">
                        <label :for="screen.screen_id">{{ screen.screen_name }}</label>
                      </div>
                    </div>
                  </div>
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
      role: {
        "code": null,
        "name": null,
        "screen": []
      },
      click: false,
      saving: false,
      loading: false,
      groupScreen: [],

    }
  },
  mounted() {
    // Get master screen
    this.getMasterScreen()

    // Get role detail
    this.getRoleDetail()
  },
  computed: {
    errorCode: function () {
      return this.checkInfo(this.role.code)
    },
    errorName: function () {
      return this.checkInfo(this.role.name)
    },
  },
  methods: {

    /**
   * Make toast without title
   */
    popToast(variant, content) {
      if (variant === 'danger') {
        this.$toast.error(content);
      } else if (variant === 'success') {
        this.$toast.success(content);
      } else if (variant === 'warning') {
        this.$toast.warning(content);
      } else {
        this.$toast.info(content);
      }
    },

    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorCode || this.errorName)
    },

    /**
     *  Get master screen
     */
    getMasterScreen() {
      adminAPI.getMasterScreen().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.groupScreen = res.data.data
        }
      })
    },

    /**
     *  Get detail
     */
    getRoleDetail() {
      let roleId = this.$route.params.id
      if(roleId){
        this.loading = true

        adminAPI.getRoleDetail(roleId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.role = res.data.data
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

      let roleId = this.$route.params.id
      if(roleId){
        // Edit
        this.role.id = roleId
        adminAPI.editRole(this.role).then(res => {
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
        adminAPI.addRole(this.role).then(res => {
          this.saving = false
          if(res != null && res.data != null){

            if (res.data.status == 200) {
              this.$router.push("/role/list")
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
      this.$router.push("/role/list")
    }
  }
}
</script>
