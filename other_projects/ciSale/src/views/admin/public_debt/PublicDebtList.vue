<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <button class="btn btn-outline-success float-right btn-width-120" @click="goToAdd">
                Thêm
              </button>
            </div>
          </div>
          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <h4 class="mt-2 text-center text-header">Danh Sách Nợ Công</h4>
              <p class="text-center">(Nợ phải trả)</p>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full md:w-1/4 px-2">
              <label> Khách hàng </label>
              <multiselect
                v-model="customerSelect"
                :options="customerOptions"
                :loading="loadingGetOptions"
                placeholder="--Chọn khách hàng--"
                label="name"
                track-by="name"
                @input="changeCustomer">
              </multiselect>
            </div>
            <div class="w-full md:w-1/4 px-2">
              <label> Tên </label>
              <input
                id="name"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.customer_name"
                maxlength="75"
                :disabled="customerSelect.id">
            </div>
            <div class="w-full md:w-1/4 px-2">
              <label> Số điện thoại </label>
              <input
                id="price"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.customer_phone_number"
                maxlength="11"
                :disabled="customerSelect.id">
            </div>
            <div class="w-full md:w-1/4 px-2">
              <label>
                Trạng thái
              </label>
              <select
                id="status"
                class="form-control"
                v-model="inputs.status">
                <option v-for="option in status" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2 mt-2 mb-2">
            <div class="w-full px-2">
              <button class="btn btn-outline-primary float-right btn-width-120" :disabled="onSearch" @click="prepareToSearch">
                Tìm Kiếm
              </button>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <div class="btn-width-120 float-left">Số kết quả:
                <span class="text-header"><b>{{totalRow}}</b></span>
              </div>

              <button
                class="btn btn-default text-header btn-width-120 float-right"
                @click="exportToExcel"
                title="Xuất Excel">
                <b>Xuất Excel</b>
              </button>
            </div>
          </div>

          <hr>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <table class="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th class="text-center">STT</th>
                    <th class="text-center">Tên K.H</th>
                    <th class="text-center">Số điện thoại</th>
                    <th class="text-center">Địa chỉ</th>
                    <th class="text-center">Trạng thái</th>
                    <th class="text-center">Ngày mượn</th>
                    <th class="text-center">Ngày hẹn trả</th>
                    <th class="text-center">Tổng tiền</th>
                    <th class="text-center">Còn lại</th>
                    <th class="text-center">Lãi suất (%)</th>
                    <th class="text-center">Kỳ hạn lãi</th>
                    <th class="text-center">Thời gian tính lãi</th>
                    <th class="text-center">Số tiền lãi</th>
                    <th class="text-center">Tổng tiền</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="total text-center font-weight-bold text-header" :colspan="7">Tổng</td>
                    <td class="text-right total font-weight-bold text-header">{{formatCurrency(sum_total)}}đ</td>
                    <td class="text-right total font-weight-bold text-header">{{formatCurrency(sum_remaining)}}đ</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-right total font-weight-bold text-header">{{formatCurrency(sum_interest)}}</td>
                    <td class="text-right total font-weight-bold text-header">{{formatCurrency(sum_amount)}}</td>
                    <td></td>
                  </tr>
                  <tr v-for="(item) in items">
                    <td>{{item.stt}}</td>
                    <td>{{item.customer_name}}</td>
                    <td>{{item.customer_phone_number}}</td>
                    <td>{{item.customer_address}}</td>
                    <td>{{item.status_str}}</td>
                    <td>{{item.created_at}}</td>
                    <td>{{item.appointment_date}}</td>
                    <td class="text-right">{{formatCurrency(item.total)}}</td>
                    <td class="text-right">{{formatCurrency(item.remaining)}}</td>
                    <td>{{item.interest_rate}}%</td>
                    <td>{{convertPeriodCodeToName(item.interest_period)}}</td>
                    <td>{{item.interest_period_real}}</td>
                    <td class="text-right">{{formatCurrency(item.interest)}}</td>
                    <td class="text-right">{{formatCurrency(item.amount)}}</td>

                    <td>
                      <div class="flex gap-2" v-if="item.status === 0">
                        <button class="btn btn-sm btn-outline-primary" title="Thanh toán" @click="openPayModal(item)">
                          <i class="fa fa-check-square-o text-danger" />
                        </button>
                        <button class="btn btn-sm btn-outline-warning" title="Sửa" @click="edit(item.id)">
                          <i class="fa fa-edit" />
                        </button>
                        <button class="btn btn-sm btn-outline-danger" title="Xoá nợ" @click="deleted(item.id, item.customer_name)">
                          <i class="fa fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

          <!-- Loading -->
          <span class="loading-more" v-show="loading">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
          </span>
          <span class="loading-more">--Hết--</span>
        </div>
      </div>
    </div>


    <!--<b-modal centered hide-footer hide-header id="modal-pay">-->
      <!--<div class="flex flex-wrap -mx-2">-->
        <!--<div class="w-full px-2">-->
          <!--<h5 class="text-center">Thanh toán</h5>-->
          <!--<hr>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="flex flex-wrap -mx-2">-->
          <!--<div class="w-full px-2">-->
            <!--<label>-->
              <!--Số tiền còn lại-->
            <!--</label>-->
            <!--<input-->
              <!--id="remaining"-->
              <!--autocomplete="new-password"-->
              <!--class="form-control"-->
              <!--disabled-->
              <!--v-model="payData.remaining"-->
              <!--maxlength="14">-->
          <!--</div>-->
      <!--</div>-->

        <!--<div class="flex flex-wrap -mx-2">-->
          <!--<div class="w-full px-2">-->
            <!--<label>-->
              <!--Số tiền trả-->
            <!--</label>-->
            <!--<input-->
              <!--id="amount"-->
              <!--autocomplete="new-password"-->
              <!--class="form-control"-->
              <!--v-model="payData.amount"-->
              <!--@change="changeAmount()"-->
              <!--@keyup="integerOnly($event.target)"-->
              <!--maxlength="14">-->
          <!--</div>-->
      <!--</div>-->

      <!--<b-row class="form-row">-->
        <!--<b-col md="3" class="mt-2">-->
          <!--<label> Tiền mặt </label>-->
        <!--</div>-->
        <!--<b-col md="9">-->
          <!--<input-->
          <!--id="cash_input"-->
          <!--type="text"-->
          <!--class="form-control"-->
          <!--v-model="payData.cash"-->
          <!--autocomplete="new-password"-->
          <!--@keyup="integerOnly($event.target)"-->
          <!--@change="changeCash()"-->
          <!--maxlength="14">-->
        <!--</div>-->
      <!--</div>-->

      <!--<b-row class="form-row">-->
        <!--<b-col md="3" class="mt-2">-->
          <!--<label> Chuyển khoản </label>-->
        <!--</div>-->
        <!--<b-col md="9">-->
          <!--<input-->
          <!--id="credit_input"-->
          <!--type="text"-->
          <!--class="form-control"-->
          <!--v-model="payData.credit"-->
          <!--autocomplete="new-password"-->
          <!--@change="changeCredit()"-->
          <!--@keyup="integerOnly($event.target)"-->
          <!--maxlength="14">-->
        <!--</div>-->
      <!--</div>-->

      <!--<b-row class="form-row">-->
        <!--<b-col md="3" class="mt-2">-->
          <!--<label> Tiền điện tử </label>-->
        <!--</div>-->
        <!--<b-col md="9">-->
          <!--<input-->
          <!--id="e_money_input"-->
          <!--type="text"-->
          <!--class="form-control"-->
          <!--v-model="payData.e_money"-->
          <!--autocomplete="new-password"-->
          <!--@change="changeEMoney()"-->
          <!--@keyup="integerOnly($event.target)"-->
          <!--maxlength="14">-->
        <!--</div>-->
      <!--</div>-->

      <!--<div class="flex flex-wrap -mx-2">-->
        <!--<b-col class="text-right mt-3">-->
          <!--<button class="btn btn-primary px-4 default-btn-bg" @click="pay()">-->
            <!--Thanh toán-->
          <!--</button>-->
        <!--</div>-->
      <!--</div>-->
    <!--</b-modal>-->

    <div v-if="showPayModal" class="modal-backdrop">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <h5 class="text-center">Thanh toán</h5>
                <hr>
              </div>
            </div>
            <div class="flex flex-wrap -mx-2">
                <div class="w-full px-2">
                  <label>
                    Số tiền còn lại: <b>{{formatCurrency(payData.remaining)}}đ</b>
                  </label>
                </div>
            </div>
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <label>
                  Lãi suất: {{payData.interest_rate}}%
                </label>
              </div>
            </div>
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <label>
                  Kỳ hạn: {{payData.interest_period}}
                </label>
              </div>
            </div>
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <label>
                  Thời gian tính lãi: {{payData.interest_period_real}}
                </label>
              </div>
            </div>
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <label>
                  Số tiền lãi: <b>{{formatCurrency(payData.interest)}}đ</b>
                </label>
              </div>
            </div>
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <label>
                  Tổng tiền phải trả:
                  <b class="text-header">{{formatCurrency(payData.total_amount)}}đ</b>
                </label>
              </div>
            </div>
            <div class="flex flex-wrap -mx-2">
                <div class="w-full px-2">
                  <label>
                    Số tiền trả
                  </label>
                  <input
                    id="amount"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="payData.amount"
                    @keyup="integerOnly($event.target)"
                    @change="changeAmount()"
                    maxlength="14">
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
                v-model="payData.cash"
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
                v-model="payData.credit"
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
                v-model="payData.e_money"
                autocomplete="new-password"
                @keyup="integerOnly($event.target)"
                @change="changeEMoney()"
                maxlength="14">
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2 text-right mt-3">
                <button class="btn btn-secondary px-4 mr-2" @click="closePayModal()">
                  Đóng
                </button>
                <button class="btn btn-primary px-4 default-btn-bg" @click="pay()">
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import debitAPI from '@/api/debt'
import tradeApi from '@/api/trade'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import { useFormatters } from '@/composables/useFormatters'


export default {
  components: {
    Multiselect
  },
  setup() {
    const { toast } = useToast()
    const router = useRouter()
    const { formatCurrency } = useFormatters()
    return { toast, router, formatCurrency }
  },
  data () {
    return {
      loadingGetOptions: false,
      customerSelect: {},
      customerOptions: [],
      perPage: '10',
      currentPage: '1',
      totalRow: 0,
      status: [
        {value: '', text: ''},
        {value: '0', text: 'Đang nợ'},
        {value: '1', text: 'Đã thanh toán'}
      ],
      inputs: {
        customer_id: null,
        customer_name: null,
        customer_phone_number: null,
        status: 0,
      },
      items: [],
      sum_total: 0,
      sum_remaining: 0,
      sum_interest: 0,
      sum_amount: 0,
      excel_fields: {
        'Tên KH': 'customer_name',
        'Số Điện thoại' : 'customer_phone_number',
        'Địa chỉ' : 'customer_address',
        'Trạng thái': 'status_str',
        'Ngày hẹn trả': 'appointment_date',
        'Số tiền gốc': 'total',
        'Còn lại': 'remaining',
        'Lãi suất': 'interest_rate',
        'Kỳ hạn': 'interest_period',
        'Thời gian tính lãi': 'interest_period_real',
        'Số tiền lãi': 'interest',
        'Tổng tiền': 'amount',
        'Mô tả': 'description',
      },
      payData: {
        id: null,
        customer_id: null,
        customer_name: null,
        customer_phone_number: null,
        customer_address: null,
        amount: 0,
        remaining: 0,
        interest_rate: 0,
        interest_period: 'month',
        interest_period_real: null,
        interest: 0,
        total_amount: 0,
        cash: 0,
        credit: 0,
        e_money: 0
      },
      loading: false,
      onSearch: false,
      showPayModal: false
    }
  },
  computed: {
  },
  mounted() {

    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()

    // Load list when load page
    this.prepareToSearch()
  },
  methods: {
    /**
     * Prepare to search
     */
    prepareToSearch() {
      this.items = []

      this.search()
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
        this.toast(errorMess, 'error')
      })
    },

    /**
     *  Event change customer
     */
    changeCustomer() {
      if(this.customerSelect && this.customerSelect.id) {
        this.inputs.customer_id = this.customerSelect.id
        this.inputs.customer_name = this.customerSelect.name
        this.inputs.customer_phone_number = this.customerSelect.phone_number
      } else {
        this.inputs.customer_name = null
        this.inputs.customer_phone_number = null
      }
    },

    /**
     *  Delete
     */
    deleted (id, name) {
      if (confirm('Xoá nợ [' + name + "]. Bạn có chắc không?")) {
        debitAPI.reliefPublicDebt(id).then(res => {
            if(res != null && res.data != null) {
              this.prepareToSearch()
              this.toast('Xóa nợ thành công!!!', 'success')
            }

          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.toast(errorMess, 'error')
          })
      }
    },

    /**
     *  Go to edit
     */
    edit (id) {
      this.router.push('/public-debt/edit/' + id)
    },

    openPayModal(pay) {
      this.payData.id = pay.id;
      this.payData.customer_id = pay.customer_id;
      this.payData.customer_name = pay.customer_name;
      this.payData.customer_phone_number = pay.customer_phone_number;
      this.payData.customer_address = pay.customer_address;
      let payMoney = JSON.parse(JSON.stringify(this.currencyFormat(pay.remaining)))
      this.payData.remaining = payMoney
      this.payData.interest_rate = pay.interest_rate
      this.payData.interest_period = pay.interest_period
      this.payData.interest_period_real = pay.interest_period_real
      this.payData.interest = pay.interest
      this.payData.total_amount = pay.amount
      this.payData.amount = JSON.parse(JSON.stringify(this.currencyFormat(pay.amount)))
      this.payData.cash = JSON.parse(JSON.stringify(this.currencyFormat(pay.amount)))

      this.showPayModal = true
    },

    closePayModal() {
      this.showPayModal = false
    },

    /**
     * Thanh toán
     */
    pay() {
      if (this.payData.amount <= 0) {
        this.toast('Số tiền trả phải lớn hơn 0', 'error')
        return;
      }

      try {
        if(parseInt((this.payData.amount + '').replaceAll(",", ""))
            != parseInt((this.payData.cash + '').replaceAll(",", ""))
            + parseInt((this.payData.credit + '').replaceAll(",", ""))
            + parseInt((this.payData.e_money + '').replaceAll(",", ""))) {
          this.toast("Tổng loại tiền phải bằng số tiền thanh toán", 'error')
          return
        }
      } catch(err) {
        this.toast('Vui lòng nhập loại tiền', 'error')
      }

      this.payData.remaining = (this.payData.remaining + '').replaceAll(",", "")
      this.payData.amount = (this.payData.amount + '').replaceAll(",", "")
        this.payData.remaining = (this.payData.remaining + '').replaceAll(",", "")
        this.payData.cash = (this.payData.cash + '').replaceAll(",", "")
        this.payData.credit = (this.payData.credit + '').replaceAll(",", "")
        this.payData.e_money = (this.payData.e_money + '').replaceAll(",", "")

      debitAPI.payPublicDebt(this.payData).then(res => {
        if(res != null && res.data != null) {
          this.prepareToSearch()
        }
        this.payData.id = null
        this.payData.customer_id = null
        this.payData.customer_name = null
        this.payData.customer_phone_number = null
        this.payData.customer_address = null
        this.payData.amount = 0
        this.payData.remaining = 0
        this.payData.credit = 0
        this.payData.cash = 0
        this.payData.e_money = 0
        this.showPayModal = false
        this.toast('Đã thanh toán thành công!!', 'success')
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast(errorMess, 'error')
      })
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
     *  Go to add
     */
    goToAdd () {
      this.router.push('/public-debt/add')
    },

    /**
     *  Search
     */
    search() {
        if(this.onSearch) {
            return
        }
      this.loading = true
      this.onSearch = true

      // Search
      debitAPI.searchPublicDebit(this.inputs).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data.public_debt;
          this.sum_total = res.data.data.sum_total;
          this.sum_remaining = res.data.data.sum_remaining;
          this.sum_interest = res.data.data.sum_interest;
          this.sum_amount = res.data.data.sum_amount;
          this.totalRow = this.items.length;
        }
        this.loading = false
        this.onSearch = false
      }).catch(err => {
        this.loading = false
        this.onSearch = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast(errorMess, 'error')
      })
    },

      /**
     *  Tính toán tổng tiền
     */
      calcTotal() {
          this.totalMoney = 0
          this.totalMoneyRemaining = 0
          if(this.items.length > 0) {
              for(let i in this.items) {
                  this.totalMoney += this.items[i].total
                  this.totalMoneyRemaining += this.items[i].remaining
              }
          }
      },

      changeAmount() {
         if(this.payData.amount) {
             let amount = this.payData.amount.replaceAll(",", "")
             this.payData.amount = this.currencyFormat(amount)

             this.payData.cash = this.currencyFormat(amount)
         }
      },

      changeCash() {
         if(this.payData.cash) {
             let cash = this.payData.cash.replaceAll(",", "")
             this.payData.cash = this.currencyFormat(cash)
         }
      },

      changeCredit() {
         if(this.payData.credit) {
             let credit = this.payData.credit.replaceAll(",", "")
             this.payData.credit = this.currencyFormat(credit)
         }
      },

      changeEMoney() {
         if(this.payData.e_money) {
             let e_money = this.payData.e_money.replaceAll(",", "")
             this.payData.e_money = this.currencyFormat(e_money)
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

    exportToExcel() {
      this.toast('Chức năng xuất Excel sẽ được cập nhật sau', 'info')
    },

  }
}
</script>

<style lang="scss" scoped>
    .label-width {
      width: 100%;
    }


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
