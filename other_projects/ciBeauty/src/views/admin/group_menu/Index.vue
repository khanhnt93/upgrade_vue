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
                  <h4 class="mt-2 text-center text-header">Danh mục</h4>
                </div>
              </div>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
                </div>
                <div class="col-span-9">
                  <input
                  id="name"
                  type="text"
                  maxlength="100"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="groupMenu.name">
                  <div class="invalid-feedback invalid-feedback"   :state="!errorName">
                    Đây là mục bắt buộc nhập
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Loại thẻ </label>
                </div>
                <div class="col-span-9">
                  <select class="form-control form-control"
                  type="text"
                  autocomplete="new-password"
                  v-model="groupMenu.type">
                    <option v-for="option in typeOptions" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Thứ tự xuất hiện </label><span class="error-sybol"></span>
                </div>
                <div class="col-span-9">
                  <input
                  id="index"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="groupMenu.index"
                  @keyup="intergerOnly($event.target)"
                  maxlength="3"
                  placeholder="1">
                  <div class="invalid-feedback invalid-feedback"   :state="!errorIndex">
                    Đây là mục bắt buộc nhập
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
import Mapper from '@/mapper/group_menu'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      typeOptions: [
        {value: 1, text: 'Nhóm dịch vụ thường'},
        {value: 2, text: 'Nhóm thẻ dịch vụ'}
      ],
      groupMenu: {
        "id": null,
        "name": null,
        "type": 1,
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
            this.groupMenu = res.data.data
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
              this.popToast('success', 'Cập nhật nhóm dịch vụ thành công!!!')
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
