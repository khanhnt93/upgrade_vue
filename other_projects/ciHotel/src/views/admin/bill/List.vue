<template>
  <div class="container-fluid mx-auto px-4 py-6">
    <!-- Search Card -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="mb-6">
        <h4 class="text-2xl font-bold text-center text-orange-500">QUẢN LÝ HÓA ĐƠN</h4>
      </div>
      <hr class="mb-6">

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
          <input
            id="fromDate"
            type="text"
            maxlength="10"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.fromDate"
            @keyup="inputDateOnly($event.target)">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
          <input
            id="toDate"
            type="text"
            maxlength="10"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.toDate"
            @keyup="inputDateOnly($event.target)">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Số hóa đơn</label>
          <input
            id="bill-number"
            type="text"
            maxlength="20"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.billNumber"
            @keyup="integerOnly($event.target)">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2 invisible">Tìm kiếm</label>
          <button
            @click.prevent="search"
            :disabled="onSearch"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Tìm Kiếm
          </button>
        </div>
      </div>
    </div>

    <!-- Results Card -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div v-show="loading" class="text-center py-4">
        <i class="fa fa-spinner fa-spin text-4xl text-blue-600"></i>
      </div>

      <div class="mb-4">
        <p class="text-gray-700">Số kết quả: <span class="font-semibold">{{ bills.length }}</span></p>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300">
          <thead class="bg-blue-100">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase border border-gray-300">STT</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase border border-gray-300">Ngày</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase border border-gray-300">Số Bill</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase border border-gray-300">Phòng</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase border border-gray-300">Tổng tiền phòng</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase border border-gray-300">Phí dv, phụ thu</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase border border-gray-300">Giảm Giá</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase border border-gray-300">% Thuế</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase border border-gray-300">Số Tiền Thuế</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase border border-gray-300">Thành Tiền</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase border border-gray-300">Tiền mặt</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase border border-gray-300">Chuyển khoản</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase border border-gray-300">Tiền điện tử</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border border-gray-300">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <!-- Total Row -->
            <tr class="bg-orange-50">
              <td class="px-4 py-3 text-center font-bold text-orange-600 border border-gray-300" colspan="4">Tổng</td>
              <td class="px-4 py-3 text-right font-bold text-orange-600 border border-gray-300">{{ formatCurrency(totalPrice) }}</td>
              <td class="px-4 py-3 text-right font-bold text-orange-600 border border-gray-300">{{ formatCurrency(totalServicePrice) }}</td>
              <td class="px-4 py-3 text-right font-bold text-orange-600 border border-gray-300">{{ formatCurrency(totalDiscount) }}</td>
              <td class="px-4 py-3 border border-gray-300"></td>
              <td class="px-4 py-3 text-right font-bold text-orange-600 border border-gray-300">{{ formatCurrency(totalVat) }}</td>
              <td class="px-4 py-3 text-right font-bold text-orange-600 border border-gray-300">{{ formatCurrency(totalAmount) }}</td>
              <td class="px-4 py-3 text-right font-bold text-orange-600 border border-gray-300">{{ formatCurrency(total_cash) }}</td>
              <td class="px-4 py-3 text-right font-bold text-orange-600 border border-gray-300">{{ formatCurrency(total_credit) }}</td>
              <td class="px-4 py-3 text-right font-bold text-orange-600 border border-gray-300">{{ formatCurrency(total_emoney) }}</td>
              <td class="px-4 py-3 border border-gray-300"></td>
            </tr>

            <!-- Data Rows -->
            <tr v-for="(bill, index) in bills" :key="bill.id" class="hover:bg-gray-50">
              <td class="px-4 py-2 whitespace-nowrap text-sm border border-gray-300">{{ index + 1 }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-sm border border-gray-300">{{ bill.created_at }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-sm border border-gray-300">{{ bill.bill_number }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-sm border border-gray-300">{{ bill.room_name }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-right border border-gray-300">{{ formatCurrency(bill.sub_total) }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-right border border-gray-300">{{ formatCurrency(bill.service_price) }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-right border border-gray-300">{{ formatCurrency(bill.discount_amount) }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-right border border-gray-300">{{ bill.vat_percent }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-right border border-gray-300">{{ formatCurrency(bill.vat_value) }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-right border border-gray-300">{{ formatCurrency(bill.total) }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-right border border-gray-300">{{ formatCurrency(bill.cash) }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-right border border-gray-300">{{ formatCurrency(bill.credit) }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-right border border-gray-300">{{ formatCurrency(bill.e_money) }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-sm border border-gray-300">
                <div class="flex justify-center gap-2">
                  <button
                    @click="edit(bill.id)"
                    title="Sửa"
                    class="text-blue-600 hover:text-blue-800">
                    <i class="fa fa-edit"></i>
                  </button>
                  <button
                    @click="deleteBill(bill.id, bill.bill_number)"
                    title="Xóa"
                    class="text-red-600 hover:text-red-800">
                    <i class="fa fa-trash"></i>
                  </button>
                  <button
                    @click="printBill(bill.id)"
                    title="In"
                    class="text-green-600 hover:text-green-800">
                    <i class="fa fa-print"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment"
import commonFunc from "@/common/commonFunc"
import adminAPI from '@/api/admin'
import Cookies from "js-cookie"
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import { useRouter } from 'vue-router'

export default {
  data() {
    return {
      inputs: {
        fromDate: null,
        toDate: null,
        billNumber: null
      },
      bills: [],
      totalPrice: 0,
      totalServicePrice: 0,
      totalDiscount: 0,
      totalVat: 0,
      totalAmount: 0,
      totalQuantity: 0,
      total_cash: 0,
      total_credit: 0,
      total_emoney: 0,
      loading: false,
      onSearch: false
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    }
  },
  mounted() {
    // Get default date
    let dateNow = new Date()
    this.inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
    this.inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0,10))

    this.search()
  },
  methods: {
    ...useFormatters(),

    /**
     * Only input integer
     */
    integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
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
     * Check valid from date and to date
     */
    checkFromDateAndToDate() {
      const { error } = useToast()

      if(this.inputs.fromDate == "" || this.inputs.fromDate == null || commonFunc.dateFormatCheck(this.inputs.fromDate) == false) {
        error("Mục từ ngày không đúng")
        return false
      }
      if(this.inputs.toDate == "" || this.inputs.toDate == null || commonFunc.dateFormatCheck(this.inputs.fromDate) == false) {
        error("Mục đến ngày không đúng")
        return false
      }
      let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
      let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate))

      if(fromDate > toDate) {
        error("Từ ngày không thể lớn hơn đến ngày")
        return false
      }

      fromDate.setDate(fromDate.getDate() + 62)

      if(fromDate < toDate) {
        error("Thời gian không quá 62 ngày")
        return false
      }

      return true
    },

    search() {
      const { error } = useToast()

      // Check validate
      if(!this.checkFromDateAndToDate()) {
        this.bills = []
        return
      }
      this.onSearch = true
      this.loading = true

      let params = {
        "from_date": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "to_date": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        "bill_number": this.inputs.billNumber,
      }

      // Search
      adminAPI.searchReportBill(params).then(res => {
        if(res && res.data && res.data.data) {
          this.bills = res.data.data.data
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

        this.onSearch = false
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        error(errorMess)
        this.onSearch = false
        this.loading = false
      })
    },

    edit(id) {
      const router = useRouter()
      router.push(`/bill/edit/${id}`)
    },

    printBill(id) {
      const router = useRouter()
      if (Cookies.get(id)) {
        console.log(Cookies.get(id))
        Cookies.remove(id)
      }
      Cookies.set("printFrom", "bill-list")
      router.push(`/bill/print/${id}`)
    },

    deleteBill(id, bill_number) {
      const { success, error } = useToast()

      if (confirm(`Xóa hóa đơn ${bill_number}. Bạn có chắc không?`)) {
        adminAPI.deleteOldBill({id}).then(res => {
          if (res.data.status == 200) {
            success('Xóa thành công')
            this.search()
          }
        }).catch(err => {
          error(err.message)
        })
      }
    }
  }
}
</script>

<style scoped>
  /* No custom styles needed - all using Tailwind */
</style>
