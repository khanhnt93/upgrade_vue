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
                  <h4 class="mt-2 text-center text-header">Giường</h4>
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
                  v-model="table.name">
                  <div class="invalid-feedback invalid-feedback"   :state="!errorName">
                    Vui lòng nhập tên
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                  <div class="col-span-3 mt-2">
                    <label> Khu vực giường </label><span class="error-sybol"></span>
                  </div>
                  <div class="col-span-9">
                    <select class="form-control form-control"
                    type="text"
                    autocomplete="new-password"
                    v-model="table.group_table_id">
                      <option v-for="option in groupTableOptions" :key="option.value" :value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                    <div class="invalid-feedback invalid-feedback"   :state="!errorType">
                      Vui lòng chọn loại bàn
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
                  v-model="table.index_sort"
                  @keyup="intergerOnly($event.target)"
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
      table: {
        "name": null,
        "group_table_id": null,
        "index_sort": null,
      },
      groupTableOptions: [
        {value: null, text: ''},
      ],
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {
      // Get list options group table
      this.getListGroupTableOptions()

    this.getTableDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.table.name)
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
     * Get list group table options
     */
    getListGroupTableOptions() {
      adminAPI.getListGroupTableOptions().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data
            for (let i in options) {
                let item = {value: options[i].id, text: options[i].name}
                this.groupTableOptions.push(item)
            }
        }
      })
    },

    /**
     * Get detail
     */
    getTableDetail() {
      let tableId = this.$route.params.id
      if(tableId){
        this.loading = true

        adminAPI.getTableDetail(tableId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.table = res.data.data
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
      this.$router.push('/table/list')
    },

    /**
     * Save
     */
    save () {
      this.click = true
      this.saving = true
      let result = this.checkValidate()
      if(result) {  
        let tableId = this.$route.params.id
        if(tableId){
          // Edit
          let table = this.table
          table.id = tableId
          adminAPI.editTable(table).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              let message = ""
              if (res.data.status == 200) {
                // show popup success
                this.popToast('success', 'Cập nhật giường thành công!!! ')
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
            this.popToast('danger', message)
          })
        } else {
          // Add
          adminAPI.addTable(this.table).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              let message = ""
              if (res.data.status == 200) {
                this.$router.push("/table/list")
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
              this.popToast('danger', message)
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

  }
}
</script>
