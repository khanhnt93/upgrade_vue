<template>
  <div class="w-full px-4">
    <!-- Filters Card -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h4 class="text-xl font-semibold text-center mb-6 text-header">Báo Cáo Xóa Bill</h4>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Date Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Thời gian:</label>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">Từ</span>
            <input
              id="fromDate"
              type="text"
              autocomplete="new-password"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="inputs.fromDate"
              maxlength="10"
              @keyup="inputDateOnly($event.target)">
            <span class="text-sm text-gray-600">Đến</span>
            <input
              id="toDate"
              type="text"
              autocomplete="new-password"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="inputs.toDate"
              maxlength="10"
              @keyup="inputDateOnly($event.target)">
          </div>
        </div>

        <!-- Sort By -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sắp xếp theo:</label>
          <select
            id="status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.orderBy">
            <option v-for="option in orderByOption" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <!-- Search Button -->
        <div>
          <label class="block text-sm font-medium text-transparent mb-2">Xem</label>
          <button
            class="w-full px-4 py-2 bg-white border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="onSearch"
            @click="search">
            Xem
          </button>
        </div>
      </div>
    </div>

    <!-- Results Card -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Loading -->
      <div v-show="loading" class="flex justify-center items-center py-8">
        <i class="fa fa-spinner fa-spin text-blue-500 text-4xl"></i>
      </div>

      <div v-show="!loading">
        <!-- Header with Count and Export -->
        <div class="flex justify-between items-center mb-4">
          <div class="text-gray-700">
            Số kết quả: <span class="font-semibold">{{ bills.length }}</span>
          </div>
          <button
            class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-header font-semibold"
            @click="exportToExcel(bills, excel_bill_fields, 'bao_cao_xoa_bill.xls')">
            Xuất Excel
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-blue-100">
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">STT</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ngày</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Số Bill</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Bàn</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tổng tiền món</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Phí dv, phụ thu</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Giảm Giá</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Thuế</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Thành Tiền</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tiền mặt</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Chuyển khoản</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tiền điện tử</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Người xóa</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Thời gian xóa</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bill, index) in bills" :key="bill.bill_number" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ index + 1 }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ bill.created_at }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ bill.bill_number }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ bill.table_name }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatters.formatCurrency(bill.sub_total) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatters.formatCurrency(bill.service_amount) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatters.formatCurrency(bill.discount_amount) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatters.formatCurrency(bill.vat_value) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatters.formatCurrency(bill.total) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatters.formatCurrency(bill.cash) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatters.formatCurrency(bill.credit) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatters.formatCurrency(bill.e_money) }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ bill.delete_by }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ bill.delete_at }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ bill.note }}</td>
              </tr>
              <tr v-if="bills.length === 0">
                <td colspan="15" class="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import { useExcelExport } from '@/composables/useExcelExport'

const { popToast } = useToast()
const formatters = useFormatters()
const { exportToExcel } = useExcelExport()

const orderByOption = [
  { value: 'b.created_at asc', text: '' },
  { value: 'b.created_at asc', text: 'Thời gian tăng dần' },
  { value: 'b.created_at desc', text: 'Thời gian giảm dần' }
]

const inputs = ref({
  fromDate: null,
  toDate: null,
  orderBy: 'b.created_at asc'
})

const onSearch = ref(false)
const bills = ref([])
const loading = ref(false)

const excel_bill_fields = {
  'Ngày': 'created_at',
  'Số Bill': 'bill_number',
  'Bàn': 'table_name',
  'Tổng tiền món': 'sub_total',
  'Phí dv, phụ thu': 'service_amount',
  'Giảm Giá': 'discount_amount',
  'Số Tiền Thuế': 'vat_value',
  'Thành Tiền': 'total',
  'Người xóa': 'delete_by',
  'Thời gian xóa': 'delete_at',
  'Ghi chú': 'note'
}

/**
 * Check valid from date and to date
 */
const checkFromDateAndToDate = () => {
  if (!inputs.value.fromDate || commonFunc.dateFormatCheck(inputs.value.fromDate) === false) {
    popToast('danger', 'Mục từ ngày không đúng')
    return false
  }
  if (!inputs.value.toDate || commonFunc.dateFormatCheck(inputs.value.toDate) === false) {
    popToast('danger', 'Mục đến ngày không đúng')
    return false
  }

  let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
  let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate))

  if (fromDate > toDate) {
    popToast('danger', 'Từ ngày không thể lớn hơn đến ngày')
    return false
  }

  fromDate.setDate(fromDate.getDate() + 62)

  if (fromDate < toDate) {
    popToast('danger', 'Thời gian không quá 62 ngày')
    return false
  }

  return true
}

/**
 * Search
 */
const search = () => {
  // Check validate
  if (!checkFromDateAndToDate()) {
    bills.value = []
    return
  }

  onSearch.value = true
  loading.value = true

  const params = {
    fromDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate),
    toDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate),
    orderBy: inputs.value.orderBy
  }

  // Search
  adminAPI.searchDeleteBill(params)
    .then(res => {
      if (res && res.data && res.data.data) {
        bills.value = res.data.data
      }
      onSearch.value = false
      loading.value = false
    })
    .catch(err => {
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
      onSearch.value = false
      loading.value = false
    })
}

/**
 * Only input date
 */
const inputDateOnly = (item) => {
  const valueInput = item.value
  const result = commonFunc.inputDateOnly(valueInput)
  item.value = result
}

onMounted(() => {
  const dateNow = new Date().toJSON().slice(0, 10)
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  lastMonth.setDate(lastMonth.getDate() + 1)
  const lastMonthStr = lastMonth.toJSON().slice(0, 10)

  inputs.value.toDate = commonFunc.formatDate(dateNow)
  inputs.value.fromDate = commonFunc.formatDate(lastMonthStr)

  // Search
  search()
})
</script>

<style scoped>
.text-header {
  color: #2c3e50;
  font-weight: 600;
}
</style>
