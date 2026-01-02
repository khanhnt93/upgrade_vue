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
                  <h4 class="mt-2 text-center text-header">Danh Mục</h4>
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
                  maxlength="100"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="groupMenu.name">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorName">
                    Đây là mục bắt buộc nhập
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Thứ tự xuất hiện </label><span class="error-sybol"></span>
                </b-col>
                <b-col md="9">
                  <input
                  id="index"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="groupMenu.index"
                  @keyup="intergerOnly($event.target)"
                  maxlength="3"
                  placeholder="1">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorIndex">
                    Đây là mục bắt buộc nhập
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
import Mapper from '@/mapper/group_menu'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      groupMenu: {
        "id": null,
        "name": null,
        "index": null
      },
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    this.getGroupMenuDetail()
  },
  computed: {
    errorName () {
      return this.checkInfo(this.groupMenu.name)
    },
    errorIndex () {
      return this.checkInfo(this.groupMenu.index)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorName || this.errorIndex)
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
  makeToast(variant = null, title, content) {
    this.$bvToast.toast(content, {
      title: title,
      variant: variant,
      solid: true,
      autoHideDelay: 3000
    })
  },

    /**
     * Get group menu detail
     */
    getGroupMenuDetail() {
      let groupMenuId = this.$route.params.id
      if(groupMenuId){
        this.loading = true

        adminAPI.getGroupMenuDetail(groupMenuId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.groupMenu = Mapper.mapGroupMenuDetailModelToDto(res.data.data)
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
     * Save
     */
    save() {
      this.saving = true
      this.click = true
      let result = this.checkValidate()
      if(result) {
        let groupMenuId = this.$route.params.id
        if (groupMenuId) {
          // Edit
          adminAPI.updateGroupMenu(this.groupMenu).then(res => {
            this.saving = false
            if (res != null && res.data != null) {
              this.popToast('success', 'Cập nhật nhóm menu thành công!!!')
            } else {
              this.makeToast('danger', 'Cập nhật nhóm menu thất bại!!!', 'Có lỗi xảy ra, bạn thử lại sau nhé')
            }
          }).catch(err => {
            this.saving = false
            let message = ""
            if(err.response.data.status == 500) {
              message = "Lỗi hệ thống, chúng tôi rất tiếc về sự cố này, bạn thử lại sau vài phút nhé"
            } else {
              message = err.response.data.mess
            }
            this.makeToast('danger', 'Cập nhật nhóm menu thất bại!!!', message)
          })
        } else {
          // Add
          adminAPI.addGroupMenu(this.groupMenu).then(res => {
            this.saving = false
            if (res != null && res.data != null) {
              // Go to list
              this.$router.push('/group-menu/list')
            } else {
              this.makeToast('danger', 'Thêm nhóm menu thất bại!!!', 'Có lỗi xảy ra, bạn thử lại nhé')
            }
          }).catch(err => {
            this.saving = false
            let message = ""
            if(err.response.data.status == 500) {
              message = "Lỗi hệ thống, chúng tôi rất tiếc về sự cố này, bạn thử lại sau vài phút nhé"
            } else {
              message = err.response.data.mess
            }
            this.makeToast('danger', 'Thêm nhóm menu thất bại!!!', message)
          })
        }
      } else {
        this.saving = false
      }
    },

    /**
     * Only input integer
     */
     intergerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push('/group-menu/list')
    }
  }
}
</script>
