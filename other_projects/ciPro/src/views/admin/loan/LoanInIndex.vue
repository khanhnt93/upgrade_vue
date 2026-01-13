<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-2 text-center text-header">{{title_prefix}} Khoản Đi Vay</h4>
              </b-col>
            </b-row>
            <hr/>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Khách hàng<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9">
                <div class="input-group">
                  <input type="radio" v-model="inputs.customer_type" name="customer_type"
                         :value="0" class="mt-2" id="customer_type_0">
                  <label class="ml-4 mt-1" for="customer_type_0">Cũ</label>
                  <input type="radio" v-model="inputs.customer_type" name="customer_type"
                         :value="1" class="ml-5 mt-2" id="customer_type_1">
                  <label class="ml-4 mt-1" for="customer_type_1">Mới</label>
                </div>
                <div class="input-group">
                  <!--Khách hàng-->
                  <multiselect
                    v-show="inputs.customer_type==0"
                    v-model="customerSelect"
                    :options="customerOptions"
                    :loading="loadingOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn khách hàng--"
                    label="text"
                    track-by="text">
                  </multiselect>
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorCustomerOld">
                    Vui lòng chọn khách hàng
                  </b-form-invalid-feedback>
                </div>
                <!--Khách hàng mới-->
                  <input
                    v-show="inputs.customer_type==1"
                    v-model="inputs.customer_name"
                    id="customer_name"
                    type="text"
                    maxlength="255"
                    autocomplete="new-password"
                    placeholder="Tên khách hàng"
                    class="form-control mt-2">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorCustomerName">
                    Vui lòng nhập tên khách hàng
                  </b-form-invalid-feedback>
                  <input
                    v-show="inputs.customer_type==1"
                    v-model="inputs.customer_phone"
                    id="customer_phone"
                    type="text"
                    maxlength="12"
                    autocomplete="new-password"
                    placeholder="Số điện thoại khách hàng"
                    class="form-control mt-2">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorCustomerPhone">
                    Vui lòng nhập số điện thoại khách hàng
                  </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Ngày mượn<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <datepicker v-model="inputs.borrowed_date" format="yyyy-MM-dd"
                  placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorBorrowedDate">
                  Vui lòng chọn ngày mượn
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Ngày hẹn trả<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <datepicker v-model="inputs.due_date" format="yyyy-MM-dd"
                            placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorDueDate">
                  Vui lòng chọn ngày hẹn trả
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Số tiền<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <input
                  id="amount"
                  type="text"
                  class="form-control"
                  v-model="inputs.amount"
                  autocomplete="new-password"
                  @keyup="integerPointAndCommaOnly($event.target)"
                  @change="changeAmount()"
                  maxlength="14">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorAmount">
                  Vui lòng nhập số tiền
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Sổ khoản chi<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <div class="input-group">
                  <input type="radio" v-model="inputs.money_type" name="money_type" :value="1" class="mt-2"
                         id="money_type_1">
                  <label class="ml-4 mt-1" for="money_type_1">Chuyển khoản</label>
                  <input type="radio" v-model="inputs.money_type" name="money_type" :value="0" class="ml-5 mt-2"
                         id="money_type_0">
                  <label class="ml-4 mt-1" for="money_type_0">Tiền mặt</label>
                </div>
                <div class="input-group">
                  <b-form-select
                    v-show="inputs.money_type==1"
                    :options="bankAccountOptions"
                    v-model="inputs.bank_account_id"
                    :disabled="inputs.money_type==0"
                    placeholder="--Chọn sổ khoản chi--"
                  >
                  </b-form-select>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Lãi suất (%)<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <input
                  id="interest_rate"
                  type="text"
                  class="form-control"
                  v-model="inputs.interest_rate"
                  autocomplete="new-password"
                  @keyup="integerPointAndCommaOnly($event.target)"
                  maxlength="5">
              </b-col>
            </b-row>

            <b-row class="form-row" v-show="inputs.interest_rate">
              <b-col md="3" class="mt-2">
                <label>Kỳ hạn lãi<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <b-form-select
                  :options="periodOptions"
                  id="interest_period"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.interest_period">
                </b-form-select>
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorInterestPeriod">
                  Vui lòng chọn kỳ hạn lãi
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col md="12" class="text-center">
                <b-button variant="outline-primary" class="pull-right btn-width-200" @click="save(true)">
                  Lưu nháp
                </b-button>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="12" class="text-center">
                <b-button variant="outline-secondary" class="pull-left btn-width-120 mt-2" @click="back">
                  Huỷ
                </b-button>

                <b-button  v-show="!saving" variant="outline-success" class="pull-right btn-width-120 mt-2"
                           @click="save(false)" :disabled="saving">
                  Xác nhận
                </b-button>
                <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

  </div>
</template>
<script>


import loanApi from '@/api/loan'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'
import Datepicker from 'vue3-datepicker'
import { useToast } from '@/composables/useToast'


export default {
  setup() {
    const { popToast } = useToast()
    return { popToast }
  },
  components: {
    Datepicker,
    Multiselect
  },
  data () {
    return {
      title_prefix: 'Thêm Mới',
      inputs: {
        "id": null,
        "customer_type": 0,
        "customer_id": null,
        "customer_name": null,
        "customer_phone": null,
        "borrowed_date": null,
        "due_date": null,
        "amount": 0,
        "money_type": 1,
        "bank_account_id": null,
        "interest_rate": 0,
        "interest_period": 'month'
      },
      periodOptions: [
        {value: 'day', text: 'Ngày'},
        {value: 'month', text: 'Tháng'},
        {value: 'year', text: 'Năm'}
      ],
      bankAccountOptions: [],
      loadingOptions: false,
      customerSelect: {},
      customerOptions: [],
      saving: false,
      click: false
    }
  },
  computed: {
    errorCustomerOld: function () {
      return this.checkCustomerOld(this.inputs.customer_type, this.customerSelect.value)
    },
    errorCustomerName: function () {
      return this.checkCustomerName(this.inputs.customer_type, this.inputs.customer_name)
    },
    errorCustomerPhone: function () {
      return this.checkCustomerPhone(this.inputs.customer_type, this.inputs.customer_phone)
    },
    errorBorrowedDate: function () {
      return this.checkInfo(this.inputs.borrowed_date)
    },
    errorDueDate: function () {
      return this.checkInfo(this.inputs.due_date)
    },
    errorAmount: function () {
      return this.checkInfo(this.inputs.amount)
    },
    errorInterestPeriod: function () {
      return this.checkInterestPeriod(this.inputs.interest_rate, this.inputs.interest_period)
    },

  },
  mounted() {
    let dateNow = new Date()
    this.inputs.borrowed_date = dateNow.toJSON().slice(0,10)
    let dueDate = new Date(dateNow.setMonth(dateNow.getMonth() + 3))
    this.inputs.due_date = dueDate.toJSON().slice(0,10)

    // Get options related fund
    this.getOptionRelated()

    this.getLoanDetail()
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkCustomerOld (customer_type, customer_id) {
      return (this.click && (customer_type == 0 && !customer_id))
    },
    checkCustomerName (customer_type, name) {
      return (this.click && (customer_type == 1 && !name))
    },
    checkCustomerPhone (customer_type, phone) {
      return (this.click && (customer_type == 1 && !phone))
    },
    checkInterestPeriod (interest_rate, interest_period) {
      return (this.click && (interest_rate && !interest_period))
    },
    checkValidate () {
      return !(this.errorCustomerOld || this.errorCustomerName || this.errorCustomerPhone
        || this.errorBorrowedDate || this.errorDueDate || this.errorAmount || this.errorInterestPeriod)
    },




    /**
     *  Get detail
     */
    getLoanDetail() {
      let loanId = this.$route.params.id
      if(loanId) {
        this.title_prefix = 'Cập Nhật'
        loanApi.getLoanDetail(loanId).then(res => {
          if(res != null && res.data != null && res.data.data != null){
            this.inputs = res.data.data
            this.inputs.customer_type = 0
            if(this.inputs.customer_id) {
              this.getCustomerById(this.inputs.customer_id)
            }
            this.inputs.amount = this.currencyFormat(this.inputs.amount)
          }
        }).catch(err => {
          // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
        })
      } else {
        this.title_prefix = 'Thêm Mới'
      }
    },

    getCustomerById(customerId) {
        for(let customer of this.customerOptions) {
            if(customer.value == customerId) {
                this.customerSelect = customer
                break
            }
        }
        return {}
      },

    /**
     * Get options related fund
     */
    getOptionRelated() {
      this.loadingOptions = true

      let params = {
        loan_type: 0,
        customers: true,
        bank_accounts: true
      }

      loanApi.getOptionsRelated(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          this.customerOptions = options.customers
          if(this.inputs.customer_id) {
            this.getCustomerById(this.inputs.customer_id)
          }

          this.bankAccountOptions = options.bank_accounts
        }
        this.loadingOptions = false
      }).catch(err => {
        this.loadingOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     *  Save
     */
    save (is_draft) {
      this.click = true

      let checkValidate = this.checkValidate()
      if(!checkValidate) {
        return
      }

      if(this.inputs.customer_type == 0) {
        this.inputs.customer_id = this.customerSelect.value
        let name_phone = this.customerSelect.text
        let name_phones = name_phone.split(" - ")
        this.inputs.customer_name = name_phones[0]
        this.inputs.customer_phone = name_phones[1]
      }
      if(this.inputs.interest_rate == 0) {
        this.inputs.interest_period = null
      }

      this.inputs.amount = (this.inputs.amount + "").replaceAll(",", "")
      if(parseInt(this.inputs.amount) <= 0) {
        this.popToast('danger', 'Vui lòng nhập số tiền')
        return
      }

      this.inputs.is_draft = false
      if(is_draft) {
        this.inputs.is_draft = true
      } else {
        if(this.inputs.money_type == 1 && !this.inputs.bank_account_id) {
          this.popToast('danger', 'Vui lòng chọn sổ khoản chi')
          return
        }
      }

      // Add
      this.saving = true
      if(this.inputs.id) {
        loanApi.updateLoanIn(this.inputs).then(res => {
          this.saving = false
          if(res != null && res.data != null){

            if (res.data.status == 200) {
              this.$router.push("/loan-in")
            }
          }
        }).catch(err => {
          this.saving = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      } else {
        loanApi.addLoanIn(this.inputs).then(res => {
          this.saving = false
          if(res != null && res.data != null){

            if (res.data.status == 200) {
              this.$router.push("/loan-in")
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

    changeAmount() {
        let amount = (this.inputs.amount + "").replaceAll(",", "")
        this.inputs.amount = this.currencyFormat(amount)
      },

    /**
     * Only input integer
     */
    integerPointAndCommaOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerPointAndCommaOnly(valueInput)
      item.value = result
    },

    /**
     * Back to list
     */
    back() {
      this.$router.push("/loan-in")
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

  }
}
</script>
