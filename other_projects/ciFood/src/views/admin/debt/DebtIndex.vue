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
                <h4 class="mt-2 text-center text-header">Ghi Nợ</h4>
              </b-col>
            </b-row>
            <hr/>
            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60"/></span>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Tên khách hàng </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <input
                  id="customer_name"
                  type="text"
                  class="form-control"
                  v-model="debt.customer_name"
                  autocomplete="new-password"
                  maxlength="50">
                <b-form-invalid-feedback class="invalid-feedback" :state="!errorName">
                  Vui lòng nhập tên khách hàng
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Số điện thoại </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <input
                  id="customer_phone_number"
                  type="text"
                  class="form-control"
                  v-model="debt.customer_phone_number"
                  autocomplete="new-password"
                  @keyup="integerOnly($event.target)"
                  maxlength="100">
                <b-form-invalid-feedback class="invalid-feedback" :state="!errorPhone">
                  Vui lòng nhập số điện thoại
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Địa chỉ</label>
              </b-col>
              <b-col md="9">
                <input
                  id="customer_address"
                  type="text"
                  class="form-control"
                  v-model="debt.customer_address"
                  autocomplete="new-password"
                  maxlength="100">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Mô tả</label>
              </b-col>
              <b-col md="9">
                <input
                  id="description"
                  type="text"
                  class="form-control"
                  v-model="debt.description"
                  autocomplete="new-password"
                  maxlength="100">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Số bill</label>
              </b-col>
              <b-col md="9">
                <input
                  id="bill_number"
                  type="text"
                  class="form-control"
                  v-model="debt.bill_number"
                  autocomplete="new-password"
                  maxlength="100">
                <b-form-invalid-feedback class="invalid-feedback" :state="!errorBillNumber">
                  Số bill không đúng!
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Số tiền</label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <input
                  id="amount"
                  type="text"
                  class="form-control"
                  v-model="debt.total"
                  autocomplete="new-password"
                  maxlength="100"
                  @keyup="integerOnly($event.target)"
                  :disabled="isEdit">
                <b-form-invalid-feedback class="invalid-feedback" :state="!errorTotal">
                  Vui lòng nhập số tiền
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
import commonFunc from '@/common/commonFunc'


export default {
  data() {
    return {
      debt: {
        customer_name: null,
        customer_phone_number: null,
        customer_address: null,
        description: null,
        bill_number: null,
        total: null,
        order_id: null,
        customer_id: null
      },
      billNumberNotExists: false,
      click: false,
      saving: false,
      loading: false,
      isEdit: false
    }
  },
  mounted() {
    // Get sale channel detail
    this.getDeptDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.debt.customer_name)
    },
    errorPhone: function () {
      return this.checkInfo(this.debt.customer_phone_number)
    },
    errorTotal: function () {
      return this.checkInfo(this.debt.total)
    },
    errorBillNumber: function () {
      return this.billNumberNotExists;
    }
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

    checkInfo(info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate() {
      return !(this.errorName || this.errorPhone || this.errorTotal)
    },

    /**
     *  Get detail
     */
    getDeptDetail() {
      let id = this.$route.params.id
      if (id) {
        this.loading = true
        this.isEdit = true;
        adminAPI.getDeptDetail(id).then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            this.debt = res.data.data
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
    save() {
      this.click = true

      let checkValidate = this.checkValidate()
      if (!checkValidate) {
        return
      }

      this.saving = true

      let id = this.$route.params.id
      if (id) {
        // Edit
        this.debt.id = id
        adminAPI.updateDept(this.debt).then(res => {
          this.saving = false
          if (res != null && res.data != null) {
            if (res.data.status == 200) {
              // show popup success
              this.popToast('success', 'Cập nhật thành công!!! ')
            }
          }
        }).catch(err => {
          this.saving = false
          if (err.response.data.status == 422) {
            this.billNumberNotExists = true
          } else {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          }
        })
      } else {
        // Add
        adminAPI.addDept(this.debt).then(res => {
          this.saving = false
          if (res != null && res.data != null) {

            if (res.data.status == 200) {
              this.$router.push("/debt/list")
            }
          }
        }).catch(err => {
          this.saving = false
          if (err.response.data.status == 422) {
            this.billNumberNotExists = true
          } else {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          }
        })
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

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push("/debt/list")
    }
  }
}
</script>
