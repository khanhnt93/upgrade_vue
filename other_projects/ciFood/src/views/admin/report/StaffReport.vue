<template>
  <div class="w-full px-4">
    <!-- Filters Card -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h4 class="text-xl font-semibold text-center mb-6 text-header">Báo Cáo Theo Nhân Viên</h4>

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
        <font-awesome-icon icon="spinner" spin class="text-blue-500 text-4xl" />
      </div>

      <div v-show="!loading && !firstSearch && items.length > 0">
        <!-- Header with Count and Export -->
        <div class="flex justify-between items-center mb-4">
          <div class="text-gray-700">
            Số kết quả: <span class="font-semibold">{{ items.length }}</span>
          </div>
          <button
            class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-header font-semibold"
            @click="exportToExcel(items, excel_bill_fields, 'bao_cao_theo_nhan_vien', 'Báo Cáo Theo Nhân Viên')">
            Xuất Excel
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-blue-100">
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">STT</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nhân viên</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quyền</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Số lần gọi món</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Doanh số gọi món</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Số lần tính tiền</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Doanh số tính tiền</th>
              </tr>
            </thead>
            <tbody>
              <!-- Total Row -->
              <tr class="bg-orange-100 font-semibold">
                <td colspan="3" class="border border-gray-300 px-4 py-2 text-center text-header">Tổng</td>
                <td class="border border-gray-300 px-4 py-2 text-right text-header">{{ formatters.formatCurrency(sum_quantity_order) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right text-header">{{ formatters.formatCurrency(sum_total_order) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right text-header">{{ formatters.formatCurrency(sum_quantity_payment) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right text-header">{{ formatters.formatCurrency(sum_total_payment) }}</td>
              </tr>

              <!-- Data Rows -->
              <tr v-for="(item, index) in items" :key="item.staff_name" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ index + 1 }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ item.staff_name }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ item.role_name }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatters.formatCurrency(item.quantity_order) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatters.formatCurrency(item.total_order) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatters.formatCurrency(item.quantity_payment) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatters.formatCurrency(item.total_payment) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Results -->
      <div v-show="!loading && !firstSearch && items.length === 0" class="text-center py-8 text-gray-500">
        Không tìm thấy kết quả nào
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
  { value: 'total_payment asc', text: 'Doanh số tính tiền tăng dần' },
  { value: 'total_payment desc', text: 'Doanh số tính tiền giảm dần' },
  { value: 'quantity_payment asc', text: 'Số lần thực hiện tính tiền tăng dần' },
  { value: 'quantity_payment desc', text: 'Số lần thực hiện tính tiền giảm dần' },
  { value: 'total_order asc', text: 'Doanh số gọi món tăng dần' },
  { value: 'total_order desc', text: 'Doanh số gọi món giảm dần' },
  { value: 'quantity_order asc', text: 'Số lần thực hiện gọi món tăng dần' },
  { value: 'quantity_order desc', text: 'Số lần thực hiện gọi món giảm dần' }
]

const inputs = ref({
  fromDate: null,
  toDate: null,
  orderBy: 'total_payment asc'
})

const onSearch = ref(false)
const items = ref([])
const firstSearch = ref(true)
const loading = ref(false)

const sum_quantity_order = ref(0)
const sum_total_order = ref(0)
const sum_quantity_payment = ref(0)
const sum_total_payment = ref(0)

const excel_bill_fields = {
  'Nhân viên': 'staff_name',
  'Quyền': 'role_name',
  'Số lần gọi món': 'quantity_order',
  'Doanh số gọi món': 'total_order',
  'Số lần thanh toán': 'quantity_payment',
  'Doanh số thanh toán': 'total_payment'
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
    items.value = []
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
  adminAPI.getReportByStaff(params)
    .then(res => {
      if (res && res.data && res.data.data) {
        let datas = res.data.data
        // Handle data
        sum_quantity_order.value = 0
        sum_total_order.value = 0
        sum_quantity_payment.value = 0
        sum_total_payment.value = 0

        for (let index in datas) {
          if (datas[index].is_root && datas[index].role_name == 'ADMIN') {
            datas[index].role_name = 'Chủ nhà hàng'
          }
          if (!datas[index].is_root && datas[index].role_name == 'ADMIN') {
            datas[index].role_name = 'Quản lý'
          }
          if (!datas[index].is_root && datas[index].role_name == 'CASHIER') {
            datas[index].role_name = 'Thu ngân'
          }
          if (!datas[index].is_root && datas[index].role_name == 'KITCHEN') {
            datas[index].role_name = 'Bếp'
          }
          if (!datas[index].is_root && datas[index].role_name == 'STAFF') {
            datas[index].role_name = 'Phục vụ'
          }

          sum_quantity_order.value += parseInt(datas[index].quantity_order)
          sum_total_order.value += parseInt(datas[index].total_order)
          sum_quantity_payment.value += parseInt(datas[index].quantity_payment)
          sum_total_payment.value += parseInt(datas[index].total_payment)
        }
        items.value = datas
      }

      firstSearch.value = false
      onSearch.value = false
      loading.value = false
    })
    .catch(err => {
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
      firstSearch.value = false
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
  inputs.value.toDate = commonFunc.formatDate(dateNow)
  inputs.value.fromDate = commonFunc.formatDate(dateNow)

  // Get data
  search()
})
</script>

<style scoped>
.text-header {
  color: #ed592a;
  font-weight: 600;
}
</style>
