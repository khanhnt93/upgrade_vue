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

              <b-row>
                <b-col md='12'>
                  <h4 class="mt-2 text-center text-header">Bàn Ăn</h4>
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
                  v-model="table.name">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorName">
                    Vui lòng nhập tên
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label> Loại </label><span class="error-sybol"></span>
                  </b-col>
                  <b-col md="9">
                    <b-form-select
                    :options="typeOptions"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="table.type">
                    </b-form-select>
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorType">
                      Vui lòng chọn loại bàn
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>

              <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label> Khu vực bàn </label>
                  </b-col>
                  <b-col md="9">
                    <b-form-select
                    :options="groupTableOptions"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="table.group_table_id">
                    </b-form-select>
                  </b-col>
                </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Thứ tự xuất hiện </label>
                </b-col>
                <b-col md="9">
                  <input
                  id="index_sort"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="table.index_sort"
                  @keyup="intergerOnly($event.target)"
                  maxlength="3">
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
import Mapper from '@/mapper/table'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      table: {
        "name": null,
        "type": null,
        "group_table_id": null,
        "index_sort": null,
      },
      typeOptions: [
        {value: null, text: ''},
        {value: 'take_away', text: 'Take Away'},
        {value: 'default', text: 'Thường'}
      ],
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

      // Get table detail
      this.getTableDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.table.name)
    },
    errorType: function () {
      return this.checkInfo(this.table.type)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorName || this.errorType)
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
                this.popToast('success', 'Cập nhật bàn ăn thành công!!! ')
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
            this.$bvModal.msgBoxOk(message, {
              title: "Cập Nhật Bàn",
              centered: true, 
              size: 'sm',
              headerClass: 'bg-danger',
            })
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
              this.$bvModal.msgBoxOk(message, {
                title: "Thêm Bàn",
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
