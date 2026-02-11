<template>
  <div class="container-fluid">

    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <h4 class="text-center text-header">Báo Cáo Hóa Đơn</h4>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full md:w-1/3 px-2">
              <label>
                Từ ngày:
              </label>
              <datepicker v-model="inputs.fromDate" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus" :typeable="true"  ></datepicker>
            </div>

            <div class="w-full md:w-1/3 px-2">
              <label>
                Đến ngày:
              </label>
              <datepicker v-model="inputs.toDate" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus" :typeable="true"  ></datepicker>
            </div>

            <div class="w-full md:w-1/3 px-2">
              <label>
                Loại hoá đơn:
              </label>
              <select
                id="type"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.type">
                <option v-for="option in typeOption" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <label class="label-width text-white">
                 Xem
              </label>
              <button class="btn btn-outline-primary pull-right btn-width-120" :disabled="onSearch" @click.prevent="search">
                Xem
              </button>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">


          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <div class="flex flex-wrap -mx-2" v-show="firstSearch == false && bills.length > 0">
            <div class="w-full px-2">
              <div class="flex flex-wrap -mx-2">
                <div class="w-full md:w-1/3 px-2">
                  Số kết quả: {{bills.length}}
                </div>
                <div class="w-full md:w-2/3 px-2 text-right">
                  <download-excel
                    class   = "btn btn-default text-header"
                    :data   = "bills"
                    :fields = "excel_bill_fields"
                    worksheet = "Báo Cáo Theo Bill"
                    name    = "bao_cao_theo_bill.xls">
                    <b>Xuất Excel</b>
                  </download-excel>
                </div>
              </div>
              <div class="flex flex-wrap -mx-2">
                <div class="w-full px-2">
                  <table class="table table-bordered table-striped fixed_header">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Ngày</th>
                        <th>Số Bill</th>
                        <th>Loại giao dịch</th>
                        <th>Tổng tiền SP</th>
                        <th>Chi phí thêm</th>
                        <th>Giảm Giá</th>
                        <th>Khuyến mãi</th>
                        <th>VAT</th>
                        <th>Thành tiền</th>
                        <th>Thanh toán</th>
                        <th>Tiền mặt</th>
                        <th>Chuyển khoản</th>
                        <th>Tiền điện tử</th>
                        <th>Lợi nhuận</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="total text-center font-weight-bold" colspan="4">Tổng</td>
                        <td class="text-right total font-weight-bold">{{currencyFormat(sum_sub_total)}}</td>
                        <td class="text-right total font-weight-bold">{{currencyFormat(sum_extra_fee)}}</td>
                        <td class="text-right total font-weight-bold">{{currencyFormat(sum_fixed_discount)}}</td>
                        <td class="text-right total font-weight-bold">{{currencyFormat(sum_discount_amount)}}</td>
                        <td class="text-right total font-weight-bold">{{currencyFormat(sum_vat_value)}}</td>
                        <td class="text-right total font-weight-bold">{{currencyFormat(sum_total)}}</td>
                        <td class="text-right total font-weight-bold">{{currencyFormat(sum_total_paid)}}</td>
                        <td class="text-right total font-weight-bold">{{currencyFormat(sum_cash)}}</td>
                        <td class="text-right total font-weight-bold">{{currencyFormat(sum_credit)}}</td>
                        <td class="text-right total font-weight-bold">{{currencyFormat(sum_emoney)}}</td>
                        <td class="text-right total font-weight-bold">{{currencyFormat(sum_profit)}}</td>
                      </tr>

                      <tr v-for="(bill) in bills">
                        <td>{{bill.stt}}</td>
                        <td>{{bill.created_at}}</td>
                        <td>{{bill.bill_number}}</td>
                        <td>{{bill.trade_type_str}}</td>
                        <td class="text-right">{{currencyFormat(bill.sub_total)}}</td>
                        <td class="text-right">{{currencyFormat(bill.extra_fee)}}</td>
                        <td class="text-right">{{currencyFormat(bill.fixed_discount)}}</td>
                        <td class="text-right">{{currencyFormat(bill.discount_amount)}}</td>
                        <td class="text-right">{{currencyFormat(bill.vat_value)}}</td>
                        <td class="text-right">{{currencyFormat(bill.total)}}</td>
                        <td class="text-right">{{currencyFormat(bill.total_paid)}}</td>
                        <td class="text-right">{{currencyFormat(bill.cash)}}</td>
                        <td class="text-right">{{currencyFormat(bill.credit)}}</td>
                        <td class="text-right">{{currencyFormat(bill.e_money)}}</td>
                        <td class="text-right">{{currencyFormat(bill.profit)}}</td>
                      </tr>
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2" v-show="firstSearch == false && bills.length == 0">
            <div class="w-full px-2 text-center">
              Không tìm thấy kết quả nào
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
import reportAPI from '@/api/report'
import commonFunc from '@/common/commonFunc'

// import JsonExcel from 'vue-json-excel' // TODO: Replace with xlsx library
import Datepicker from 'vue3-datepicker'
import { useToast } from '@/composables/useToast'

export default {
  setup() {
    const { toast } = useToast()
    return { toast }
  },
  components: {
    Datepicker
  },
  data () {
    return {
      typeOption: [
        {value: 0, text: 'Mua vào'},
        {value: 1, text: 'Bán ra'}
      ],
      inputs: {
        type: 1,
        fromDate: null,
        toDate: null
      },
      onSearch: false,
      bills: [],
      firstSearch: true,
      sum_sub_total: 0,
      sum_extra_fee: 0,
      sum_fixed_discount: 0,
      sum_discount_amount: 0,
      sum_vat_value: 0,
      sum_total: 0,
      sum_total_paid: 0,
      sum_cash: 0,
      sum_credit: 0,
      sum_emoney: 0,
      sum_profit: 0,
      excel_bill_fields: {
        'Ngày': 'created_at',
        'Số Bill': 'bill_number',
        'Loại giao dịch' : 'trade_type_str',
        'Tổng tiền SP' : 'sub_total',
        'Chi phí thêm' : 'extra_fee',
        'Giảm Giá' : 'fixed_discount',
        'Thành Tiền' : 'total',
        'Thanh toán' : 'total_paid',
        'Tiền mặt' : 'cash',
        'Chuyển khoản' : 'credit',
        'Tiền điện tử' : 'e_money',
          'Lợi nhuận': 'profit'
      },
      loading: false,
    }
  },
  mounted() {
    let dateNow = new Date().toJSON().slice(0,10)
    this.inputs.toDate = dateNow
    this.inputs.fromDate = dateNow

    this.search()
  },
  methods: {


    /**
     * Search
     */
    search() {
      this.onSearch = true
      this.loading = true

      let params = {
        "type": this.inputs.type,
        "fromDate": this.inputs.fromDate,
        "toDate": this.inputs.toDate
      }

      // Search
      reportAPI.getBillReport(params).then(res => {
        if(res && res.data && res.data.data) {
          this.bills = res.data.data

          // Calculate sum
          this.sum_sub_total = 0
          this.sum_extra_fee = 0
          this.sum_fixed_discount = 0
          this.sum_discount_amount = 0
          this.sum_vat_value = 0
          this.sum_total = 0
          this.sum_total_paid = 0
          this.sum_cash = 0
          this.sum_credit = 0
          this.sum_emoney = 0
          this.sum_profit = 0
          for (let i in this.bills) {
            this.sum_sub_total += this.bills[i].sub_total
            this.sum_extra_fee += this.bills[i].extra_fee
            this.sum_fixed_discount += this.bills[i].fixed_discount
            this.sum_discount_amount += this.bills[i].discount_amount
            this.sum_vat_value += this.bills[i].vat_value
            this.sum_total += this.bills[i].total
            this.sum_total_paid += this.bills[i].total_paid
            this.sum_cash += this.bills[i].cash
            this.sum_credit += this.bills[i].credit
            this.sum_emoney += this.bills[i].e_money
            this.sum_profit += this.bills[i].profit
          }
        }

        this.firstSearch = false
        this.onSearch = false
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast(errorMess, 'error')

        this.firstSearch = false
        this.onSearch = false
        this.loading = false
      })
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

    /**
     * Only input date
     */
     inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },

  }
}
</script>


<style lang="css" scoped>
  .total {
    color: #ed592a;
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
