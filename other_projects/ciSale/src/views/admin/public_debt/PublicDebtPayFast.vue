<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-2 text-center text-header">Thanh Toán Nhanh Nợ Công</h4>
              </b-col>
            </b-row>
            <hr/>

            <b-row>
              <b-col md="12" class="bg-gray text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin người trả</span>
                </h5>
              </b-col>
            </b-row>

            <b-row class="form-row mt-2">
              <b-col md="3">
                <label> Khách hàng </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <div class="input-group">
                  <multiselect
                    v-model="customerSelect"
                    :options="customerOptions"
                    :loading="loadingGetOptions"
                    placeholder="--Chọn khách hàng--"
                    label="name"
                    track-by="name"
                    @input="changeCustomer">
                  </multiselect>
                  <b-button variant="outline-primary" class="pull-right ml-2" @click="showModalSearchCustomer" >
                    <i class="fa fa-search"></i>
                  </b-button>
                </div>

              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <p>Tên khách hàng: <b>{{debt.customer_name}}</b></p>
                <p>Số điện thoại: {{debt.customer_phone_number}}</p>
                <p>Địa chỉ: {{debt.customer_address}}</p>
              </b-col>
            </b-row>

            <b-row class="mt-3">
              <b-col md="12" class="bg-info bg-gradient text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin khoản vay</span>
                </h5>
              </b-col>
            </b-row>
            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60"/></span>

            <b-row class="mt-2">
              <b-col>
                <table class="table table-bordered table-striped">
                  <thead>
                  <tr>
                    <th class="text-center">STT</th>
                    <th class="text-center">Ngày mượn</th>
                    <th class="text-center">Ngày hẹn trả</th>
                    <th class="text-center">Số tiền mượn</th>
                    <th class="text-center">Còn lại</th>
                    <th class="text-center">Lãi suất (%)</th>
                    <th class="text-center">Kỳ hạn lãi</th>
                    <th class="text-center">Thời gian vay</th>
                    <th class="text-center">Số tiền lãi</th>
                    <th class="text-center">Thành tiền</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item) in debtList">
                    <td>{{item.stt}}</td>
                    <td>{{item.created_at}}</td>
                    <td>{{item.appointment_date}}</td>
                    <td class="text-right">{{item.total | format_currency}}</td>
                    <td class="text-right">{{item.remaining | format_currency}}</td>
                    <td>{{item.interest_rate}}%</td>
                    <td>{{convertPeriodCodeToName(item.interest_period)}}</td>
                    <td>{{item.interest_period_real}}</td>
                    <td class="text-right">{{item.interest | format_currency}}</td>
                    <td class="text-right">{{item.amount | format_currency}}</td>
                  </tr>

                  <tr>
                    <td class="total text-center font-weight-bold text-header" :colspan="3">Tổng</td>
                    <td class="text-right font-weight-bold text-header">{{sumTotal | format_currency}}</td>
                    <td class="text-right font-weight-bold text-header">{{sumRemaining | format_currency}}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-right font-weight-bold text-header">{{sumInterest | format_currency}}</td>
                    <td class="text-right font-weight-bold text-header">{{sumAmount | format_currency}}</td>
                  </tr>

                  </tbody>
                </table>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <h5 class="text-header">Tổng tiền cần thanh toán: <b>{{sumAmount | format_currency}}đ</b></h5>
              </b-col>
            </b-row>

            <b-row class="mt-3">
              <b-col md="12" class="bg-success bg-gradient text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin thanh toán</span>
                </h5>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Số tiền miễn trừ</label>
              </b-col>
              <b-col md="9">
                <input
                  id="amount_minus"
                  type="text"
                  class="form-control"
                  v-model="debt.amount_minus"
                  autocomplete="new-password"
                  maxlength="14"
                  @keyup="integerOnly($event.target)"
                  @change="calculate()">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Số tiền thanh toán</label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <input
                  id="amount_pay"
                  type="text"
                  class="form-control"
                  v-model="debt.amount_pay"
                  autocomplete="new-password"
                  maxlength="100"
                  @keyup="integerOnly($event.target)"
                  @change="calculate()">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Tiền mặt </label>
              </b-col>
              <b-col md="9">
                <input
                  id="cash_input"
                  type="text"
                  class="form-control"
                  v-model="debt.cash"
                  autocomplete="new-password"
                  @keyup="integerOnly($event.target)"
                  @change="changeCash()"
                  maxlength="14">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Chuyển khoản </label>
              </b-col>
              <b-col md="9">
                <input
                  id="credit_input"
                  type="text"
                  class="form-control"
                  v-model="debt.credit"
                  autocomplete="new-password"
                  @keyup="integerOnly($event.target)"
                  @change="changeCredit()"
                  maxlength="14">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Tiền điện tử </label>
              </b-col>
              <b-col md="9">
                <input
                  id="e_money_input"
                  type="text"
                  class="form-control"
                  v-model="debt.e_money"
                  autocomplete="new-password"
                  @keyup="integerOnly($event.target)"
                  @change="changeEMoney()"
                  maxlength="14">
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <p>Số tiền còn lại: {{debt.remaining}}</p>
              </b-col>
            </b-row>

            <b-row class="form-row" v-show="debt.remaining > 0">
              <b-col md="3" class="mt-2">
                <label>Lãi suất</label>
              </b-col>
              <b-col md="9">
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

            <b-row class="form-row" v-show="debt.remaining > 0">
              <b-col md="3" class="mt-2">
                <label>Kỳ hạn tính lãi</label>
              </b-col>
              <b-col md="9">
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

            <b-row class="form-row" v-show="debt.remaining > 0">
              <b-col md="3" class="mt-2">
                <label>Ngày mượn</label>
              </b-col>
              <b-col md="9">
                <datepicker v-model="debt.created_at" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus" :typeable="true"  ></datepicker>
              </b-col>
            </b-row>

            <b-row class="form-row" v-show="debt.remaining > 0">
              <b-col md="3" class="mt-2">
                <label>Ngày hẹn trả</label>
              </b-col>
              <b-col md="9">
                <datepicker v-model="debt.appointment_date" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus" :typeable="true"  ></datepicker>
              </b-col>
            </b-row>

            <b-row class="form-row" v-show="debt.remaining > 0">
              <b-col md="3" class="mt-2">
                <label>Số ngày nhắc trước khi đến hạn</label>
              </b-col>
              <b-col md="9">
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

            <b-row class="mt-2">
              <b-col md="12" class="text-center">
                <b-button v-show="!saving" variant="outline-success" style="height: 50px; width: 240px" @click="confirmPayment" :disabled="saving">
                  <i class="fa fa-pencil-square-o" style="margin-right: 5px" />
                  Xác Nhận
                </b-button>
                <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <!--Modal tìm kiếm khách hàng -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-search-customer">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Tìm kiếm khách hàng</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="6">
          <label> Tên </label>
          <input
            id="nameCusSearch"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="customerSearch.name"
            maxlength="75">
        </b-col>
        <b-col md="6">
          <label> Số điện thoại </label>
          <input
            id="phoneNumberCus"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="customerSearch.phone"
            maxlength="11"
            @keyup="integerOnly($event.target)">
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120" @click.prevent="hideModalSearchCustomer">
            Quay lại
          </b-button>

          <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearchCustomer" @click.prevent="searchCustomer">
            Tìm Kiếm
          </b-button>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col>
          <b-table
            hover
            bordered
            stacked="md"
            :fields="customerSearchFields"
            :items="customerSearchItems">
            <template v-slot:cell(action)="data">
              <b-button variant="outline-success" class="pull-right btn-width-120"
                        @click.prevent="chooseCustomer(data.item.id, data.item.name, data.item.phone_number, data.item.address, data.item.tax_code)">
                Chọn
              </b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col>
          <span>--Hết--</span>
        </b-col>
      </b-row>

    </b-modal>

  </div>
</template>
<script>


import debitAPI from '@/api/debt'
import tradeApi from '@/api/trade'
import customerAPI from '@/api/customer'
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
      loadingGetOptions: false,
      customerSelect: {},
      customerOptions: [],
      listCustomers: [],
      periodOptions: [
        {value: 'day', text: 'Ngày'},
        {value: 'month', text: 'Tháng'},
        {value: 'year', text: 'Năm'}
      ],
      debt: {
        customer_id: null,
        customer_name: null,
        customer_phone_number: null,
        customer_address: null,
        amount_minus: 0,
        amount_pay: 0,
        cash: 0,
        credit: 0,
        e_money: 0,
        remaining: 0,
        created_at: null,
        appointment_date: null,
        forewarning: 30,
        interest_rate: 0,
        interest_period: "month"
      },
      currentCustomer: {
        name: null,
        phone: null,
        address: null
      },
      debtList: [],
      sumInterest: 0,
      sumRemaining: 0,
      sumTotal: 0,
      sumAmount: 0,
      saving: false,
      loading: false,
      loadingPayment: false,
      customerSearch: {
        "phone": null,
        "name": null
      },
      onSearchCustomer: false,
      customerSearchFields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'type',
          label: 'Loại'
        },
        {
          key: 'name',
          label: 'Tên'
        },
        {
          key: 'phone_number',
          label: 'Số điện thoại'
        },
        {
          key: 'gender',
          label: 'Giới tính'
        },
        {
          key: 'birthday',
          label: 'Ngày sinh'
        },
        {
          key: 'tax_code',
          label: 'Mã số thuế'
        },
        {
          key: 'city_name',
          label: 'Tỉnh/TP'
        },
        {
          key: 'district_name',
          label: 'Quận/Huyện'
        },
        {
          key: 'address',
          label: 'Địa chỉ'
        },
        {
          key: 'action',
          label: '',
          class: 'actions-cell'
        }
      ],
      customerSearchItems: [],
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

      // Get lại danh sách các khoản vay
      this.getListDebtByCustomer()
    },

    convertPeriodCodeToName(code) {
      if (code == 'day') {
        return "Ngày"
      }
      if (code == 'year') {
        return "Năm"
      }
      return "Tháng"
    },

    /**
     * Xác nhận thanh toán
     */
    confirmPayment() {
      if ((this.debt.amount_pay + '').replaceAll(",", "") <= 0) {
        this.popToast('danger', 'Số tiền trả phải lớn hơn 0')
        return;
      }

      try {
        if(parseInt((this.debt.amount_pay + '').replaceAll(",", "")) !=
          parseInt((this.debt.cash + '').replaceAll(",", ""))
          + parseInt((this.debt.credit + '').replaceAll(",", ""))
          + parseInt((this.debt.e_money + '').replaceAll(",", ""))) {
          this.popToast('danger', "Tổng loại tiền phải bằng số tiền thanh toán")
          return
        }
      } catch(err) {
        this.popToast('danger', 'Vui lòng nhập loại tiền')
      }
      this.saving = true
      this.debt.amount_pay = (this.debt.amount_pay + '').replaceAll(",", "")
      this.debt.amount_minus = (this.debt.amount_minus + '').replaceAll(",", "")
      this.debt.cash = (this.debt.cash + '').replaceAll(",", "")
      this.debt.credit = (this.debt.credit + '').replaceAll(",", "")
      this.debt.e_money = (this.debt.e_money + '').replaceAll(",", "")
      this.debt.total_amount = this.sumAmount
      debitAPI.payPublicDebtFast(this.debt).then(res => {
        if(res != null && res.data != null) {
          this.popToast('success', "Thanh toán thành công")

          // Show modal báo, reset data
          this.debtList = []
          this.sumAmount = 0
          this.sumInterest = 0
          this.sumRemaining = 0
          this.sumTotal = 0
          this.debt = {
            customer_id: null,
            customer_name: null,
            customer_phone_number: null,
            customer_address: null,
            amount_minus: 0,
            amount_pay: 0,
            cash: 0,
            credit: 0,
            e_money: 0,
            remaining: 0,
            created_at: null,
            appointment_date: null,
            forewarning: 30,
            interest_rate: 0,
            interest_period: "month"
          }
        }

        this.saving = false
      }).catch(err => {
        this.saving = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    calculate() {
      let amount_minus = (this.debt.amount_minus + "").replaceAll(",", "")
      let amount_pay = (this.debt.amount_pay + "").replaceAll(",", "")

      let remaining = this.sumAmount - amount_minus - amount_pay
      this.debt.remaining = this.currencyFormat(remaining)
      this.debt.cash = this.debt.amount_pay
      this.debt.credit = 0
      this.debt.e_money = 0
      this.debt.amount_pay = this.currencyFormat(amount_pay)
      this.debt.amount_minus = this.currencyFormat(amount_minus)
    },

    /**
     * Currency format
     */
    currencyFormat(num) {
      let result = ""
      if(num === 0) {
        return "0"
      }
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },

    changeCash() {
      if(this.debt.cash) {
        let cash = this.debt.cash.replaceAll(",", "")
        this.debt.cash = this.currencyFormat(cash)
      }
    },

    changeCredit() {
      if(this.debt.credit) {
        let credit = this.debt.credit.replaceAll(",", "")
        this.debt.credit = this.currencyFormat(credit)
      }
    },

    changeEMoney() {
      if(this.debt.e_money) {
        let e_money = this.debt.e_money.replaceAll(",", "")
        this.debt.e_money = this.currencyFormat(e_money)
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

    showModalSearchCustomer() {
      this.$bvModal.show('modal-search-customer')
    },

    hideModalSearchCustomer() {
      this.$bvModal.hide('modal-search-customer')
    },

    chooseCustomer(id, name, phone_number, address, tax_code) {
      this.debt.customer_id = id
      this.debt.customer_name = name
      this.debt.customer_phone_number = phone_number
      this.debt.customer_address = address

      this.getListDebtByCustomer()

      this.$bvModal.hide('modal-search-customer')
    },

    /**
     * Search
     */
    searchCustomer() {
      if (this.onSearchCustomer) { return }
      this.customerSearchItems = []

      this.onSearchCustomer = true

      let params = {
        "name": this.customerSearch.name,
        "phone": this.customerSearch.phone,
        "limit": 50,
        "offset": 0
      }

      customerAPI.getCustomerByStore(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.customerSearchItems = res.data.data.customers
        } else {
          this.customerSearchItems = []
        }
        this.onSearchCustomer = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onSearchCustomer = false
      })
    },

    /**
     * Get list debt by customer id
     */
    getListDebtByCustomer() {
      if (!this.debt.customer_id) { return }
      if(this.loading) { return }

      this.loading = true
      debitAPI.getPublicDebtByCustomer(this.debt.customer_id).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.debtList = res.data.data.debts
          this.sumTotal = res.data.data.sum_total
          this.sumRemaining = res.data.data.sum_remaining
          this.sumInterest = res.data.data.sum_interest
          this.sumAmount = res.data.data.sum_amount

          this.debt.amount_pay = this.currencyFormat(this.sumAmount)
          this.debt.cash = this.currencyFormat(this.sumAmount)
        } else {
          this.debtList = []
          this.sumTotal = 0
          this.sumRemaining = 0
          this.sumInterest = 0
          this.sumAmount = 0

          this.debt.amount_pay = 0
        }
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loading = false
      })
    },
  }
}
</script>

<style lang="scss" scoped>
table {
  margin: auto;
  border-collapse: collapse;
  overflow-x: auto;
  display: block;
  width: fit-content;
  max-width: 100%;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, .1);
}

td, th {
  border: solid rgb(200, 200, 200) 1px;
  padding: .5rem;
}

th {
  text-align: left;
  background-color: rgb(190, 220, 250);
  text-transform: uppercase;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: rgb(50, 50, 100) solid 2px;
  border-top: none;
}

td {
  white-space: nowrap;
  border-bottom: none;
  color: rgb(20, 20, 20);
}

td:first-of-type, th:first-of-type {
  border-left: none;
}

td:last-of-type, th:last-of-type {
  border-right: none;
}
</style>
