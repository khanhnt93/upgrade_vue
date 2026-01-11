<template>
  <div class="container-fluid">

    <div class="grid grid-cols-1 mb-4">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="mb-4">
          <h4 class="text-center text-xl font-semibold">BÁO CÁO BÁN HÀNG</h4>
        </div>

        <div class="grid grid-cols-12 gap-4 items-end">
          <div class="col-span-12 md:col-span-7">
            <label class="block mb-2">
              Thời gian:
            </label>
            <div class="flex items-center gap-2">
              <span class="pr-1">Từ</span>
              <input
                id="fromDate"
                type="text"
                autocomplete="new-password"
                class="flex-1 border border-gray-300 rounded px-3 py-2"
                v-model="inputs.fromDate"
                maxlength="10"
                @keyup="inputDateOnly($event.target)">
              <span class="pl-1 pr-1">Đến</span>
              <input
                id="toDate"
                type="text"
                autocomplete="new-password"
                class="flex-1 border border-gray-300 rounded px-3 py-2"
                v-model="inputs.toDate"
                maxlength="10"
                @keyup="inputDateOnly($event.target)">
            </div>
          </div>

          <div class="col-span-12 md:col-span-3">
            <label class="block mb-2">
              Sắp xếp theo:
            </label>
            <select
              id="status"
              type="text"
              autocomplete="new-password"
              class="w-full border border-gray-300 rounded px-3 py-2"
              v-model="inputs.orderBy">
              <option v-for="option in orderByOption" :key="option.value" :value="option.value">
                {{option.text}}
              </option>
            </select>
          </div>

          <div class="col-span-12 md:col-span-2">
            <label class="block mb-2 text-white">
              Xem
            </label>
            <button 
              class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" 
              :disabled="onSearch" 
              @click.prevent="search"
              style="min-width: 120px"
            >
              Xem
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1" v-show="inputs.reportBy == 'bill'">
      <div class="bg-white rounded-lg shadow-md p-6">
        <!-- Loading -->
        <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

        <div v-show="firstSearch == false && bills.length > 0">
          <div class="grid grid-cols-12 gap-4 mb-4">
            <div class="col-span-12 md:col-span-4">
              Số kết quả: {{bills.length}}
            </div>
            <div class="col-span-12 md:col-span-8 text-right">
              <download-excel
                class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 inline-block font-semibold"
                :data="bills"
                :fields="excel_bill_fields"
                worksheet="Báo Cáo Theo Bill"
                name="bao_cao_theo_bill.xls">
                Xuất Excel
              </download-excel>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full border-collapse">
              <thead>
                <tr>
                  <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-left uppercase">STT</th>
                  <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-left uppercase">Ngày</th>
                  <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-left uppercase">Số Bill</th>
                  <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-left uppercase">Phòng</th>
                  <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-left uppercase">Tổng</th>
                  <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-left uppercase">Phí dv, phụ thu</th>
                  <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-left uppercase">Giảm Giá</th>
                  <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-left uppercase">% Thuế</th>
                  <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-left uppercase">Số Tiền Thuế</th>
                  <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-left uppercase">Thành Tiền</th>
                  <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-left uppercase">Tiền mặt</th>
                  <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-left uppercase">Chuyển khoản</th>
                  <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-left uppercase">Tiền điện tử</th>
                </tr>
              </thead>
              <tbody>
                <tr class="font-bold" style="color: #ed592a;">
                  <td class="border border-gray-300 px-4 py-2 text-center" colspan="4">Tổng</td>
                  <td class="border border-gray-300 px-4 py-2 text-right">{{formatCurrency(totalPrice)}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right">{{formatCurrency(totalServicePrice)}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right">{{formatCurrency(totalDiscount)}}</td>
                  <td class="border border-gray-300 px-4 py-2"></td>
                  <td class="border border-gray-300 px-4 py-2 text-right">{{formatCurrency(totalVat)}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right">{{formatCurrency(totalAmount)}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right">{{formatCurrency(total_cash)}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right">{{formatCurrency(total_credit)}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right">{{formatCurrency(total_emoney)}}</td>
                </tr>

                <tr v-for="(bill, index) in bills" :key="index">
                  <td class="border border-gray-300 px-4 py-2">{{index + 1}}</td>
                  <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{bill.created_at}}</td>
                  <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{bill.bill_number}}</td>
                  <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{bill.room_name}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{formatCurrency(bill.sub_total)}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{formatCurrency(bill.service_price)}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{formatCurrency(bill.discount_amount)}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{bill.vat_percent}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{formatCurrency(bill.vat_value)}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{formatCurrency(bill.total)}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{formatCurrency(bill.cash)}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{formatCurrency(bill.credit)}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{formatCurrency(bill.e_money)}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-show="firstSearch == false && bills.length == 0" class="text-center">
          Không tìm thấy kết quả nào
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import adminAPI from '@/api/admin'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import JsonExcel from 'vue-json-excel'


export default {
  components: {
    'downloadExcel': JsonExcel
  },
  setup() {
    const toast = useToast()
    const { formatCurrency } = useFormatters()

    return {
      toast,
      formatCurrency
    }
  },
  data () {
    return {
      orderByOption: [
        {value: 'payment_at asc', text: ''},
        {value: 'payment_at asc', text: 'Thời gian tăng dần'},
        {value: 'payment_at desc', text: 'Thời gian giảm dần'}
      ],
      inputs: {
        reportBy: "bill",
        fromDate: null,
        toDate: null,
        orderBy: "payment_at asc",
      },
      onSearch: false,
      bills: [],
      foods: [],
      currentReportBy: "bill",
      firstSearch: true,
      widowHeight: 500,
      totalPrice: 0,
      totalServicePrice: 0,
      totalDiscount: 0,
      totalVat: 0,
      totalAmount: 0,
      totalQuantity: 0,
      total_cash: 0,
      total_credit: 0,
      total_emoney: 0,
      excel_bill_data: null,
      excel_bill_fields: {
        'Ngày': 'created_at',
        'Số Bill': 'bill_number',
        'Phòng' : 'room_name',
        'Tổng' : 'sub_total',
        'Phí dv, phụ thu' : 'service_price',
        'Giảm Giá' : 'discount_amount',
        '% Thuế' : 'vat_percent',
        'Số Tiền Thuế' : 'vat_value',
        'Thành Tiền' : 'total',
        'Nội dung dv, phụ thu' : 'service_name',
        'Nội dung Giảm Giá' : 'content_discount'
      },
      loading: false,
    }
  },
  computed: {
  },
  mounted() {
    let dateNow = new Date().toJSON().slice(0,10)
    this.inputs.toDate = commonFunc.formatDate(dateNow)
    this.inputs.fromDate = commonFunc.formatDate(dateNow)

    // Get window height
    this.widowHeight = window.innerHeight;

    this.search()
  },
  methods: {

    /**
     * Check valid from date and to date
     */
    checkFromDateAndToDate() {
      if(this.inputs.fromDate == "" || this.inputs.fromDate == null || commonFunc.dateFormatCheck(this.inputs.fromDate) == false) {
        this.toast.error("Mục từ ngày không đúng")
        return false
      }
      if(this.inputs.toDate == "" || this.inputs.toDate == null || commonFunc.dateFormatCheck(this.inputs.fromDate) == false) {
        this.toast.error("Mục đến ngày không đúng")
        return false
      }
      let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
      let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate))

      if(fromDate > toDate) {
        this.toast.error("Từ ngày không thể lớn hơn đến ngày")
        return false
      }

      fromDate.setDate(fromDate.getDate() + 62)

      if(fromDate < toDate) {
        this.toast.error("Thời gian không quá 62 ngày")
        return false
      }

      return true
    },

    /**
     * Search
     */
    search() {

      // Check validate
      if(!this.checkFromDateAndToDate()) {
        this.foods = []
        this.bills = []
        return
      }
      this.onSearch = true
      this.loading = true

      let params = {
        "reportBy": this.inputs.reportBy,
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        "orderBy": this.inputs.orderBy,
      }

      // Search
      adminAPI.searchBill(params).then(res => {
        if(res && res.data && res.data.data) {
          if(this.inputs.reportBy == "bill") {
            this.bills = res.data.data.data
            this.foods = []
          }
          if(this.inputs.reportBy == "food") {
            this.foods = res.data.data.data
            this.bills = []
          }
          this.totalPrice = res.data.data.total_price
          this.totalServicePrice = res.data.data.total_service_price
          this.totalDiscount = res.data.data.total_discount
          this.totalVat = res.data.data.total_vat
          this.totalAmount = res.data.data.total_amount
          this.totalQuantity = res.data.data.total_quantity
          this.total_cash = res.data.data.total_cash
          this.total_credit = res.data.data.total_credit
          this.total_emoney = res.data.data.total_emoney
        }

        this.firstSearch = false
        this.onSearch = false
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)

        this.firstSearch = false
        this.onSearch = false
        this.loading = false
      })
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
     * Event change report by
     */
    changeReportBy() {
      this.bills = []
      this.foods = []
      this.firstSearch = true
    }

  }
}
</script>


<style lang="css" scoped>
</style>
