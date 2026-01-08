<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Summary Cards -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-2xl font-semibold text-center mb-6">Báo Cáo Theo Ngày</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-gray-50 rounded-lg p-4 text-center">
          <div class="text-sm text-gray-600 mb-2">Số lượng hoá đơn</div>
          <h3 class="text-2xl font-bold">{{ formatters.currency(billNumber) }}</h3>
        </div>
        <div class="bg-gray-50 rounded-lg p-4 text-center">
          <div class="text-sm text-gray-600 mb-2">Tổng doanh thu</div>
          <h3 class="text-2xl font-bold">{{ formatters.currency(revenue) }}</h3>
        </div>
        <div class="bg-gray-50 rounded-lg p-4 text-center">
          <div class="text-sm text-gray-600 mb-2">Tổng chi phí</div>
          <h3 class="text-2xl font-bold">{{ formatters.currency(fee) }}</h3>
        </div>
        <div class="bg-gray-50 rounded-lg p-4 text-center">
          <div class="text-sm text-gray-600 mb-2">Tổng lợi nhuận</div>
          <h3 class="text-2xl font-bold">{{ formatters.currency(profit) }}</h3>
        </div>
        <div class="bg-gray-50 rounded-lg p-4 text-center">
          <div class="text-sm text-gray-600 mb-2">Tiền vốn đầu ngày</div>
          <h3 class="text-2xl font-bold">{{ formatters.currency(fund) }}</h3>
        </div>
      </div>
    </div>

    <!-- Bills Table -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Loading -->
      <div v-show="loading" class="text-center mb-4">
        <i class="fa fa-spinner fa-spin text-2xl text-blue-600"></i>
      </div>

      <div v-show="bills.length > 0">
        <!-- Header with Count and Export -->
        <div class="flex justify-between items-center mb-4">
          <span class="text-sm text-gray-600">Số kết quả: {{ bills.length }}</span>
          <download-excel
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-semibold cursor-pointer"
            :data="bills"
            :fields="excel_bill_fields"
            worksheet="Báo Cáo Theo Bill"
            name="bao_cao_theo_bill.xls"
          >
            Xuất Excel
          </download-excel>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">STT</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Ngày</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Số Bill</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Bàn</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tổng tiền món</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Phí dv, phụ thu</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Giảm Giá</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">% Thuế</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Số Tiền Thuế</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Thành Tiền</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tiền mặt</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Chuyển khoản</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tiền điện tử</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr class="bg-orange-50">
                <td colspan="4" class="px-4 py-3 text-center font-bold text-orange-600">Tổng</td>
                <td class="px-4 py-3 text-right font-bold text-orange-600">{{ formatters.currency(totalPrice) }}</td>
                <td class="px-4 py-3 text-right font-bold text-orange-600">{{ formatters.currency(totalServicePrice) }}</td>
                <td class="px-4 py-3 text-right font-bold text-orange-600">{{ formatters.currency(totalDiscount) }}</td>
                <td></td>
                <td class="px-4 py-3 text-right font-bold text-orange-600">{{ formatters.currency(totalVat) }}</td>
                <td class="px-4 py-3 text-right font-bold text-orange-600">{{ formatters.currency(totalAmount) }}</td>
                <td class="px-4 py-3 text-right font-bold text-orange-600">{{ formatters.currency(total_cash) }}</td>
                <td class="px-4 py-3 text-right font-bold text-orange-600">{{ formatters.currency(total_credit) }}</td>
                <td class="px-4 py-3 text-right font-bold text-orange-600">{{ formatters.currency(total_emoney) }}</td>
              </tr>
              <tr v-for="(bill, index) in bills" :key="index" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm">{{ index + 1 }}</td>
                <td class="px-4 py-3 text-sm">{{ bill.created_at }}</td>
                <td class="px-4 py-3 text-sm">{{ bill.bill_number }}</td>
                <td class="px-4 py-3 text-sm">{{ bill.table_name }}</td>
                <td class="px-4 py-3 text-sm text-right">{{ formatters.currency(bill.sub_total) }}</td>
                <td class="px-4 py-3 text-sm text-right">{{ formatters.currency(bill.service_price) }}</td>
                <td class="px-4 py-3 text-sm text-right">{{ formatters.currency(bill.discount_amount) }}</td>
                <td class="px-4 py-3 text-sm text-right">{{ bill.vat_percent }}</td>
                <td class="px-4 py-3 text-sm text-right">{{ formatters.currency(bill.vat_value) }}</td>
                <td class="px-4 py-3 text-sm text-right">{{ formatters.currency(bill.total) }}</td>
                <td class="px-4 py-3 text-sm text-right">{{ formatters.currency(bill.cash) }}</td>
                <td class="px-4 py-3 text-sm text-right">{{ formatters.currency(bill.credit) }}</td>
                <td class="px-4 py-3 text-sm text-right">{{ formatters.currency(bill.e_money) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-show="bills.length == 0 && !loading" class="text-center py-8 text-gray-500">
        Không tìm thấy kết quả nào
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import JsonExcel from 'vue-json-excel'

const { popToast } = useToast()
const formatters = useFormatters()

const revenue = ref(0)
const billNumber = ref(0)
const fee = ref(0)
const profit = ref(0)
const fund = ref(0)
const loading = ref(false)
const bills = ref([])
const totalPrice = ref(0)
const totalServicePrice = ref(0)
const totalDiscount = ref(0)
const totalVat = ref(0)
const totalAmount = ref(0)
const total_cash = ref(0)
const total_credit = ref(0)
const total_emoney = ref(0)

const excel_bill_fields = {
  "Ngày": "created_at",
  "Số Bill": "bill_number",
  "Bàn": "table_name",
  "Tổng tiền món": "sub_total",
  "Phí dv, phụ thu": "service_price",
  "Giảm Giá": "discount_amount",
  "% Thuế": "vat_percent",
  "Số Tiền Thuế": "vat_value",
  "Thành Tiền": "total",
  "Tiền mặt": "cash",
  "Chuyển khoản": "credit",
  "Tiền điện tử": "e_money"
}

const getReportToday = () => {
  adminAPI.getReportToday().then(res => {
    if (res && res.data && res.data.data) {
      revenue.value = res.data.data.reveneu
      billNumber.value = res.data.data.bill_number
      fee.value = res.data.data.fee
      profit.value = res.data.data.profit
      fund.value = res.data.data.fund
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const getTotalBill = () => {
  loading.value = true
  adminAPI.getBillForTodayReport().then(res => {
    if (res && res.data && res.data.data) {
      bills.value = res.data.data.data
      totalPrice.value = res.data.data.total_price
      totalServicePrice.value = res.data.data.total_service_price
      totalDiscount.value = res.data.data.total_discount
      totalVat.value = res.data.data.total_vat
      totalAmount.value = res.data.data.total_amount
      total_cash.value = res.data.data.total_cash
      total_credit.value = res.data.data.total_credit
      total_emoney.value = res.data.data.total_emoney
    }
    loading.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    loading.value = false
  })
}

onMounted(() => {
  getReportToday()
  getTotalBill()
})
</script>

<script>
// Component registration for vue-json-excel
import JsonExcel from 'vue-json-excel'
export default {
  components: {
    'downloadExcel': JsonExcel
  }
}
</script>
