<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

            <b-row>
              <b-col cols="6">
                <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="back">
                  Quay lại
                </b-button>
              </b-col>
              <b-col cols="6">
                <b-button variant="outline-success" class="pull-right btn-width-120" @click="save" :disabled="saving">
                    Lưu
                </b-button>
                <!--<span v-show="saving" class="loading-more pull-right btn-width-120"><icon name="loading" width="60" /></span>-->
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-1 text-center text-header">NHÓM QUYỀN</h4>
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
                  v-model="role.code"
                  autocomplete="new-password"
                  maxlength="50">
                  <b-form-invalid-feedback class="invalid-feedback" :state="!errorCode">
                    Vui lòng nhập code
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Name </label><span class="error-sybol"></span>
                </b-col>
                <b-col md="9">
                  <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model="role.name"
                  autocomplete="new-password"
                  maxlength="100">
                  <b-form-invalid-feedback class="invalid-feedback" :state="!errorName">
                    Vui lòng nhập name
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row mt-5">
                <b-col>
                  <label> Phân quyền vào chức năng </label>
                  <br>
                  <label> (Bạn hãy chọn những chức năng mà nhóm quyền này được quyền truy cập) </label>
                </b-col>
              </b-row>

              <b-row>
                <b-col>
                  <div v-for="group in groupScreen" :key="group.group_name">
                    <p><b>{{ group.group_name }}</b></p>
                    <b-row>
                      <b-col md="4" v-for="screen in group.screen" :key="screen.screen_id">
                        <input :id="screen.screen_id" type="checkbox" v-model="role.screen" name="screens" :value="screen.screen_id">
                        <label :for="screen.screen_id">{{ screen.screen_name }}</label>
                      </b-col>
                    </b-row>
                  </div>
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
              this.$router.push("/role")
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
      this.$router.push("/role")
    }
  }
}
</script>
