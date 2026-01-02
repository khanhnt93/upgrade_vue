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
                <h4 class="mt-2 text-center text-header">{{prefix_title}}Công Nợ</h4>
              </b-col>
            </b-row>
            <hr/>
            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60"/></span>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Khách hàng </label>
              </b-col>
              <b-col md="9" class="mt-2">
                <multiselect
                  v-model="customerSelect"
                  :options="customerOptions"
                  :loading="loadingGetOptions"
                  placeholder="--Chọn khách hàng--"
                  label="name"
                  track-by="name"
                  @input="changeCustomer">
                </multiselect>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Tên khách hàng </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9" class="mt-2">
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
              <b-col md="9" class="mt-2">
                <input
                  id="customer_phone_number"
                  type="text"
                  class="form-control"
                  v-model="debt.customer_phone_number"
                  autocomplete="new-password"
                  @keyup="integerOnly($event.target)"
                  maxlength="11">
                <b-form-invalid-feedback class="invalid-feedback" :state="!errorPhone">
                  Vui lòng nhập số điện thoại
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Địa chỉ</label>
              </b-col>
              <b-col md="9" class="mt-2">
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
              <b-col md="9" class="mt-2">
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
                <label>Số tiền</label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9" class="mt-2">
                <input
                  id="amount"
                  type="text"
                  class="form-control"
                  v-model="debt.total"
                  autocomplete="new-password"
                  maxlength="14"
                  @keyup="integerOnly($event.target)"
                  @change="changeTotal()">
                <b-form-invalid-feedback class="invalid-feedback" :state="!errorTotal">
                  Vui lòng nhập số tiền
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Lãi suất</label>
              </b-col>
              <b-col md="9" class="mt-2">
                <input
                  id="interest_rate"
                  type="text"
                  class="form-control"
                  v-model="debt.interest_rate"
                  autocomplete="new-password"
                  maxlength="5"
                  @keyup="integerAndPointOnly($event.target)">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Kỳ hạn tính lãi</label>
              </b-col>
              <b-col md="9" class="mt-2">
                <b-form-select
                  :options="periodOptions"
                  id="interest_period"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="debt.interest_period">
                </b-form-select>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Ngày mượn</label>
              </b-col>
              <b-col md="9" class="mt-2">
                <datepicker v-model="debt.created_at" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus" :typeable="true"  ></datepicker>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Ngày hẹn trả</label>
              </b-col>
              <b-col md="9" class="mt-2">
                <datepicker v-model="debt.appointment_date" format="yyyy-MM-dd" :typeable="true"
                            placeholder="yyyy-mm-dd" input-class="datepicker-cus" ></datepicker>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Số ngày nhắc trước khi đến hạn</label>
              </b-col>
              <b-col md="9" class="mt-2">
                <input
                  id="forewarning"
                  type="text"
                  class="form-control"
                  v-model="debt.forewarning"
                  autocomplete="new-password"
                  maxlength="10"
                  @keyup="integerOnly($event.target)">
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>


import debitAPI from '@/api/debt'
import tradeApi from '@/api/trade'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'


export default {
  components: {
    Datepicker,
    Multiselect
  },
  data() {
    return {
      prefix_title: "",
      loadingGetOptions: false,
      customerSelect: {},
      customerOptions: [],
      periodOptions: [
        {value: 'day', text: 'Ngày'},
        {value: 'month', text: 'Tháng'},
        {value: 'year', text: 'Năm'}
      ],
      debt: {
        customer_name: null,
        customer_phone_number: null,
        customer_address: null,
        description: null,
        total: null,
        status: 0,
        customer_id: null,
        created_at: null,
        appointment_date: null,
        forewarning: 30,
        interest_rate: 0,
        interest_period: "month"
      },
      click: false,
      saving: false,
      loading: false,
      isEdit: false
    }
  },
  mounted() {
    let dateNow = new Date()
    let toDate = new Date(dateNow.setDate(dateNow.getDate() + 60))
      this.debt.created_at = new Date()
    this.debt.appointment_date = toDate.toJSON().slice(0,10)
      this.debt.forewarning = 30

    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()

    // // Get list customer option
    // this.getCustomerOption()

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
    // checkDate (dateInput) {
    //   return (this.click && (commonFunc.dateFormatCheck(dateInput) == false))
    // },
    checkValidate() {
      return !(this.errorName || this.errorPhone || this.errorTotal)
    },

    /**
     *  Get tất cả các options liên quan
     */
    getOptionsRelated() {
      this.loadingGetOptions = true
      let params = {
        "customers": true
      }
      tradeApi.getAllOptionsRelated(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          // customers
          if(params.customers) {
            this.customerOptions = options.customers
            this.customerOptions.unshift({"id": null, "name": ''})
          }
        }
        this.loadingGetOptions = false
      }).catch(err => {
        this.loadingGetOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     *  Event change customer
     */
    changeCustomer() {
      if(this.customerSelect && this.customerSelect.id) {
        this.debt.customer_id = this.customerSelect.id
        this.debt.customer_name = this.customerSelect.name
        this.debt.customer_phone_number = this.customerSelect.phone_number
        this.debt.customer_address = this.customerSelect.address
      } else {
        this.debt.customer_id = null
        this.debt.customer_name = null
        this.debt.customer_phone_number = null
        this.debt.customer_address = null
      }
    },

    // /**
    //  *  Get customer options
    //  */
    // getCustomerOption() {
    //   let params = {
    //     "name": '',
    //     "phone": '',
    //     "limit": 500,
    //     "offset": 0
    //   }
    //   customerAPI.getCustomerByStore(params).then(res => {
    //     if(res != null && res.data != null && res.data.data != null) {
    //       this.customerOptions = [{value: null, text: ''}]
    //
    //       this.listCustomers = res.data.data.customers
    //       if(this.listCustomers) {
    //         for (let i in this.listCustomers) {
    //             let item = {value: this.listCustomers[i].id, text: this.listCustomers[i].name + ' - ' + this.listCustomers[i].phone_number}
    //             this.customerOptions.push(item)
    //         }
    //       }
    //     }
    //   })
    // },

    /**
     *  Get detail
     */
    getDeptDetail() {
      let id = this.$route.params.id
      if (id) {
        this.prefix_title = "Cập Nhật "
        this.loading = true
        this.isEdit = true;
        debitAPI.getDeptDetail(id).then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            this.debt = res.data.data

              this.debt.total = this.currencyFormat(this.debt.total)
          }

          this.loading = false
        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      } else {
          this.prefix_title = "Tạo Mới "
      }
    },

    // /**
    //  * Event change customer
    //  */
    // changeCustomer() {
    //   if(this.debt.customer_id) {
    //     for (let i in this.listCustomers) {
    //         if(this.listCustomers[i].id == this.debt.customer_id) {
    //             this.debt.customer_name = this.listCustomers[i].name
    //             this.debt.customer_phone_number = this.listCustomers[i].phone_number
    //             this.debt.customer_address = this.listCustomers[i].address
    //         }
    //     }
    //   }
    // },

    /**
     *  Save
     */
    save() {
      this.click = true

      let checkValidate = this.checkValidate()
      if (!checkValidate) {
        return
      }

      this.debt.total = (this.debt.total + "").replaceAll(",", "")
      this.saving = true

      let id = this.$route.params.id
      if (id) {
        // Edit
        this.debt.id = id
        debitAPI.updateDept(this.debt).then(res => {
          this.saving = false
          if (res != null && res.data != null) {
            if (res.data.status == 200) {
              // show popup success
              this.popToast('success', 'Cập nhật thành công!!! ')
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
        debitAPI.addDept(this.debt).then(res => {
          this.saving = false
          if (res != null && res.data != null) {

            if (res.data.status == 200) {
              this.$router.push("/debt")
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

      changeTotal() {
        if(this.debt.total) {
            let total = this.debt.total.replaceAll(",", "")
            this.debt.total = this.currencyFormat(total)
        }
      },

      /**
   * Currency format
   */
    currencyFormat(num) {
      let result = ""
        if(num == 0) {
            return "0"
        }
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
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
     * Only input float
     */
    integerAndPointOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerAndPointOnly(valueInput)
      item.value = result
    },

    /**
     * Only input date
     */
    inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push("/debt")
    }
  }
}
</script>
