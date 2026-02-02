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

              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12">
                  <h4 class="mt-2 text-center text-header">Khu Vực Giường</h4>
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
                  v-model="group_table.name">
                  <div class="invalid-feedback invalid-feedback"   :state="!errorName">
                    Vui lòng nhập tên
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Thứ tự xuất hiện </label>
                </div>
                <div class="col-span-9">
                  <input
                  id="index_sort"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="group_table.index_sort"
                  @keyup="integerOnly($event.target)"
                  maxlength="3">
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
import Mapper from '@/mapper/table'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      group_table: {
        "name": null,
        "index_sort": null,
      },
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {
      // Get group table detail
    this.getGroupTableDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.group_table.name)
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
     * Get detail
     */
    getGroupTableDetail() {
      let id = this.$route.params.id
      if(id){
        this.loading = true

        adminAPI.getGroupTableDetail(id).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.group_table = res.data.data
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
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push('/group-table/list')
    },

    /**
     * Save
     */
    save () {
      this.click = true
      this.saving = true
      let result = this.checkValidate()
      if(result) {  
        let id = this.$route.params.id
        if(id){
          // Edit
          let group_table = this.group_table
          group_table.id = id
          adminAPI.editGroupTable(group_table).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              let message = ""
              if (res.data.status == 200) {
                // show popup success
                this.popToast('success', 'Cập nhật khu vực bàn ăn thành công!!! ')
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
          adminAPI.addGroupTable(this.group_table).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              let message = ""
              if (res.data.status == 200) {
                this.$router.push("/group-table/list")
              }
            }
          }).catch(err => {
            this.saving = false

            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
      } else {
        this.saving = false
      }
    },

    /**
     * Only input integer
     */
     integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

  }
}
</script>
