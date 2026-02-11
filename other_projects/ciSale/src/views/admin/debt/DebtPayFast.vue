<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="p-4">

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full px-2">
                <h4 class="mt-2 text-center text-header">Thanh Toán Nhanh Công Nợ</h4>
              </div>
            </div>
            <hr/>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2 bg-gray text-white title-partner">
                <h5>
                  <span class="float-left">Thông tin người trả</span>
                </h5>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row mt-2">
              <div class="w-full md:w-1/4 px-2">
                <label> Khách hàng </label><span class="error-sybol"></span>
              </div>
              <div class="w-full md:w-3/4 px-2">
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
                  <button class="btn btn-outline-primary float-right ml-2" @click="showModalSearchCustomer" >
                    <i class="fa fa-search"></i>
                  </button>
                </div>

              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <p>Tên khách hàng: <b>{{debt.customer_name}}</b></p>
                <p>Số điện thoại: {{debt.customer_phone_number}}</p>
                <p>Địa chỉ: {{debt.customer_address}}</p>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 mt-3">
              <div class="w-full px-2 bg-info bg-gradient text-white title-partner">
                <h5>
                  <span class="float-left">Thông tin khoản vay</span>
                </h5>
              </div>
            </div>
            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60"/></span>

            <div class="flex flex-wrap -mx-2 mt-2">
              <div class="w-full px-2">
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
                    <td class="text-right">{{formatCurrency(item.total)}}</td>
                    <td class="text-right">{{formatCurrency(item.remaining)}}</td>
                    <td>{{item.interest_rate}}%</td>
                    <td>{{convertPeriodCodeToName(item.interest_period)}}</td>
                    <td>{{item.interest_period_real}}</td>
                    <td class="text-right">{{formatCurrency(item.interest)}}</td>
                    <td class="text-right">{{formatCurrency(item.amount)}}</td>
                  </tr>

                  <tr>
                    <td class="total text-center font-weight-bold text-header" :colspan="3">Tổng</td>
                    <td class="text-right font-weight-bold text-header">{{formatCurrency(sumTotal)}}</td>
                    <td class="text-right font-weight-bold text-header">{{formatCurrency(sumRemaining)}}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-right font-weight-bold text-header">{{formatCurrency(sumInterest)}}</td>
                    <td class="text-right font-weight-bold text-header">{{formatCurrency(sumAmount)}}</td>
                  </tr>

                  </tbody>
                </table>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <h5 class="text-header">Tổng tiền cần thanh toán: <b>{{formatCurrency(sumAmount)}}đ</b></h5>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 mt-3">
              <div class="w-full px-2 bg-success bg-gradient text-white title-partner">
                <h5>
                  <span class="float-left">Thông tin thanh toán</span>
                </h5>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>Số tiền miễn trừ</label>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <input
                  id="amount_minus"
                  type="text"
                  class="form-control"
                  v-model="debt.amount_minus"
                  autocomplete="new-password"
                  maxlength="14"
                  @keyup="integerOnly($event.target)"
                  @change="calculate()">
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>Số tiền thanh toán</label><span class="error-sybol"></span>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <input
                  id="amount_pay"
                  type="text"
                  class="form-control"
                  v-model="debt.amount_pay"
                  autocomplete="new-password"
                  maxlength="100"
                  @keyup="integerOnly($event.target)"
                  @change="calculate()">
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label> Tiền mặt </label>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <input
                  id="cash_input"
                  type="text"
                  class="form-control"
                  v-model="debt.cash"
                  autocomplete="new-password"
                  @keyup="integerOnly($event.target)"
                  @change="changeCash()"
                  maxlength="14">
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label> Chuyển khoản </label>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <input
                  id="credit_input"
                  type="text"
                  class="form-control"
                  v-model="debt.credit"
                  autocomplete="new-password"
                  @keyup="integerOnly($event.target)"
                  @change="changeCredit()"
                  maxlength="14">
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label> Tiền điện tử </label>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <input
                  id="e_money_input"
                  type="text"
                  class="form-control"
                  v-model="debt.e_money"
                  autocomplete="new-password"
                  @keyup="integerOnly($event.target)"
                  @change="changeEMoney()"
                  maxlength="14">
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 mt-2">
              <div class="w-full md:w-1/4 px-2">
                <p>Số tiền còn lại</p>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <p><b class="text-header">{{currencyFormat(debt.remaining)}}đ</b></p>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row" v-show="parseInt(debt.remaining) > 0">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>Lãi suất</label>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <input
                  id="interest_rate"
                  type="text"
                  class="form-control"
                  v-model="debt.interest_rate"
                  autocomplete="new-password"
                  maxlength="5"
                  @keyup="integerAndPointOnly($event.target)">
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row" v-show="parseInt(debt.remaining) > 0">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>Kỳ hạn tính lãi</label>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <select
                  id="interest_period"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="debt.interest_period">
                  <option v-for="option in periodOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row" v-show="parseInt(debt.remaining) > 0">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>Ngày mượn</label>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <datepicker v-model="debt.created_at" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus" :typeable="true"  ></datepicker>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row" v-show="parseInt(debt.remaining) > 0">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>Ngày hẹn trả</label>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <datepicker v-model="debt.appointment_date" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus" :typeable="true"  ></datepicker>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row" v-show="parseInt(debt.remaining) > 0">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>Số ngày nhắc trước khi đến hạn</label>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <input
                  id="forewarning"
                  type="text"
                  class="form-control"
                  v-model="debt.forewarning"
                  autocomplete="new-password"
                  maxlength="10"
                  @keyup="integerOnly($event.target)">
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 mt-2">
              <div class="w-full px-2 text-center">
                <button v-show="!saving" class="btn btn-outline-success" style="height: 50px; width: 240px" @click="confirmPayment" :disabled="saving">
                  <i class="fa fa-pencil-square-o" style="margin-right: 5px" />
                  Xác Nhận
                </button>
                <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!--Modal tìm kiếm khách hàng -->
    <TransitionRoot appear :show="modalSearchCustomer" as="template">
      <Dialog as="div" @close="hideModalSearchCustomer" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h4" class="modal-title text-center text-success">
                  Tìm kiếm khách hàng
                </DialogTitle>
                <hr class="my-3">

                <div class="flex flex-wrap -mx-2">
                  <div class="w-full md:w-1/2 px-2">
                    <label> Tên </label>
                    <input
                      id="nameCusSearch"
                      type="text"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="customerSearch.name"
                      maxlength="75">
                  </div>
                  <div class="w-full md:w-1/2 px-2">
                    <label> Số điện thoại </label>
                    <input
                      id="phoneNumberCus"
                      type="text"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="customerSearch.phone"
                      maxlength="11"
                      @keyup="integerOnly($event.target)">
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 mt-2">
                  <div class="w-full px-2">
                    <button class="btn btn-outline-secondary pull-left btn-width-120" @click.prevent="hideModalSearchCustomer">
                      Quay lại
                    </button>

                    <button class="btn btn-outline-primary pull-right btn-width-120" :disabled="onSearchCustomer" @click.prevent="searchCustomer">
                      Tìm Kiếm
                    </button>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 mt-2">
                  <div class="w-full px-2">
                    <table class="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th class="text-center">STT</th>
                          <th class="text-center">Loại</th>
                          <th class="text-center">Tên</th>
                          <th class="text-center">Số điện thoại</th>
                          <th class="text-center">Giới tính</th>
                          <th class="text-center">Ngày sinh</th>
                          <th class="text-center">Mã số thuế</th>
                          <th class="text-center">Tỉnh/TP</th>
                          <th class="text-center">Quận/Huyện</th>
                          <th class="text-center">Địa chỉ</th>
                          <th class="text-center actions-cell"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in customerSearchItems" :key="index">
                          <td>{{item.stt}}</td>
                          <td>{{item.type}}</td>
                          <td>{{item.name}}</td>
                          <td>{{item.phone_number}}</td>
                          <td>{{item.gender}}</td>
                          <td>{{item.birthday}}</td>
                          <td>{{item.tax_code}}</td>
                          <td>{{item.city_name}}</td>
                          <td>{{item.district_name}}</td>
                          <td>{{item.address}}</td>
                          <td class="actions-cell">
                            <button class="btn btn-outline-success pull-right btn-width-120"
                                    @click.prevent="chooseCustomer(item.id, item.name, item.phone_number, item.address, item.tax_code)">
                              Chọn
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 mt-3">
                  <div class="w-full px-2">
                    <span>--Hết--</span>
                  </div>
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>

</template>
<script>

import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import debitAPI from '@/api/debt'
import tradeApi from '@/api/trade'
import customerAPI from '@/api/customer'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'


export default {
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
    Datepicker,
    Multiselect
  },
  setup() {
    const { toast } = useToast()
    const { formatCurrency, currencyFormat } = useFormatters()

    return {
      toast,
      formatCurrency,
      currencyFormat
    }
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
      modalSearchCustomer: false,
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
  },
  methods: {

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
        this.toast(errorMess, 'error')
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
        this.toast('Số tiền trả phải lớn hơn 0', 'error')
        return;
      }

      try {
        if(parseInt((this.debt.amount_pay + '').replaceAll(",", "")) !=
          parseInt((this.debt.cash + '').replaceAll(",", ""))
          + parseInt((this.debt.credit + '').replaceAll(",", ""))
          + parseInt((this.debt.e_money + '').replaceAll(",", ""))) {
          this.toast("Tổng loại tiền phải bằng số tiền thanh toán", 'error')
          return
        }
      } catch(err) {
        this.toast('Vui lòng nhập loại tiền', 'error')
      }
      this.saving = true
      this.debt.amount_pay = (this.debt.amount_pay + '').replaceAll(",", "")
      this.debt.amount_minus = (this.debt.amount_minus + '').replaceAll(",", "")
      this.debt.cash = (this.debt.cash + '').replaceAll(",", "")
      this.debt.credit = (this.debt.credit + '').replaceAll(",", "")
      this.debt.e_money = (this.debt.e_money + '').replaceAll(",", "")
      this.debt.total_amount = this.sumAmount
      debitAPI.payDebtFast(this.debt).then(res => {
        if(res != null && res.data != null) {
          this.toast("Thanh toán thành công", 'success')

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
        this.toast(errorMess, 'error')
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
      this.modalSearchCustomer = true
    },

    hideModalSearchCustomer() {
      this.modalSearchCustomer = false
    },

    chooseCustomer(id, name, phone_number, address, tax_code) {
      this.debt.customer_id = id
      this.debt.customer_name = name
      this.debt.customer_phone_number = phone_number
      this.debt.customer_address = address

      this.getListDebtByCustomer()

      this.modalSearchCustomer = false
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
        this.toast(errorMess, 'error')

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
      debitAPI.getDebtByCustomer(this.debt.customer_id).then(res => {
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
        this.toast(errorMess, 'error')

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
