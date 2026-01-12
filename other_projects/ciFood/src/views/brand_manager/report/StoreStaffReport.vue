<template>
  <div class="w-full px-4 py-6">
    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">Báo Cáo Theo Nhân Viên</h2>

      <!-- Filter Controls -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <!-- Store Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cửa hàng</label>
          <select
            v-model="inputs.store_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="loading">
            <option v-for="option in optionsStore" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <!-- Date Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">Từ</span>
            <input
              v-model="inputs.fromDate"
              type="text"
              maxlength="10"
              placeholder="dd/mm/yyyy"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup="inputDateOnly($event.target)"
              :disabled="loading" />
            <span class="text-sm text-gray-600">Đến</span>
            <input
              v-model="inputs.toDate"
              type="text"
              maxlength="10"
              placeholder="dd/mm/yyyy"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup="inputDateOnly($event.target)"
              :disabled="loading" />
          </div>
        </div>

        <!-- Order By -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sắp xếp theo</label>
          <select
            v-model="inputs.orderBy"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="loading">
            <option v-for="option in orderByOption" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <!-- Search Button -->
      <div class="flex justify-end">
        <button
          @click="search"
          :disabled="loading"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
          Xem
        </button>
      </div>
    </div>

    <!-- Results Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Loading State -->
      <div v-show="loading" class="flex justify-center items-center py-8">
        <i class="fa fa-spinner fa-spin text-blue-500 text-4xl"></i>
      </div>

      <!-- Table Content -->
      <div v-show="!loading && !firstSearch && items.length > 0">
        <!-- Header with Count and Export -->
        <div class="flex justify-between items-center mb-4">
          <div class="text-gray-700">
            Số kết quả: <span class="font-semibold">{{ items.length }}</span>
          </div>
          <button
            class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-gray-700 font-semibold"
            @click="exportToExcel(items, excel_bill_fields, 'bao_cao_theo_nhan_vien', 'Báo Cáo Theo Nhân Viên')">
            <b>Xuất Excel</b>
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="border border-gray-300 px-3 py-2 text-center text-sm font-semibold">STT</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Nhân viên</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Quyền</th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Số lần gọi món</th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Doanh số gọi món</th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Số lần tính tiền</th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Doanh số tính tiền</th>
              </tr>
            </thead>
            <tbody>
              <!-- Sum Row -->
              <tr class="bg-orange-50">
                <td class="border border-gray-300 px-3 py-2 text-center font-bold text-orange-600" colspan="3">
                  Tổng
                </td>
                <td class="border border-gray-300 px-3 py-2 text-right font-bold text-orange-600">
                  {{ formatCurrency(sum_quantity_order) }}
                </td>
                <td class="border border-gray-300 px-3 py-2 text-right font-bold text-orange-600">
                  {{ formatCurrency(sum_total_order) }}
                </td>
                <td class="border border-gray-300 px-3 py-2 text-right font-bold text-orange-600">
                  {{ formatCurrency(sum_quantity_payment) }}
                </td>
                <td class="border border-gray-300 px-3 py-2 text-right font-bold text-orange-600">
                  {{ formatCurrency(sum_total_payment) }}
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-3 py-2 text-center">{{ index + 1 }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ item.staff_name }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ item.role_name }}</td>
                <td class="border border-gray-300 px-3 py-2 text-right">{{ formatCurrency(item.quantity_order) }}</td>
                <td class="border border-gray-300 px-3 py-2 text-right">{{ formatCurrency(item.total_order) }}</td>
                <td class="border border-gray-300 px-3 py-2 text-right">{{ formatCurrency(item.quantity_payment) }}</td>
                <td class="border border-gray-300 px-3 py-2 text-right">{{ formatCurrency(item.total_payment) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
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
import { useFormatters } from '@/composables/useFormatters'
import { useToast } from '@/composables/useToast'
import { useExcelExport } from '@/composables/useExcelExport'

// Composables
const { formatCurrency } = useFormatters()
const { popToast } = useToast()
const { exportToExcel } = useExcelExport()

// Store Options
const optionsStore = ref([])

// Order By Options
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

// Filter Inputs
const inputs = ref({
  store_id: null,
  fromDate: null,
  toDate: null,
  orderBy: 'total_payment desc'
})

// State
const loading = ref(false)
const firstSearch = ref(true)
const items = ref([])

// Sum Values
const sum_quantity_order = ref(0)
const sum_total_order = ref(0)
const sum_quantity_payment = ref(0)
const sum_total_payment = ref(0)

// Excel Configuration
const excel_bill_fields = {
  'Nhân viên': 'staff_name',
  'Quyền': 'role_name',
  'Số lần gọi món': 'quantity_order',
  'Doanh số gọi món': 'total_order',
  'Số lần thanh toán': 'quantity_payment',
  'Doanh số thanh toán': 'total_payment'
}

/**
 * Input date only - format dd/mm/yyyy
 */
const inputDateOnly = (input) => {
  let value = input.value
  value = value.replace(/[^0-9/]/g, '')

  if (value.length === 2 && !value.includes('/')) {
    value = value + '/'
  } else if (value.length === 5 && value.split('/').length === 2) {
    value = value + '/'
  }

  input.value = value
}

/**
 * Get store options
 */
const getOptionStore = async () => {
  try {
    const res = await adminAPI.getStoreOption()
    if (res && res.data && res.data.data) {
      optionsStore.value = res.data.data
      if (optionsStore.value.length > 0) {
        inputs.value.store_id = optionsStore.value[0].value
      }
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  }
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

  const fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
  const toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate))

  if (fromDate > toDate) {
    popToast('danger', 'Từ ngày không thể lớn hơn đến ngày')
    return false
  }

  const checkDate = new Date(fromDate)
  checkDate.setDate(checkDate.getDate() + 62)

  if (checkDate < toDate) {
    popToast('danger', 'Thời gian không quá 62 ngày')
    return false
  }

  return true
}

/**
 * Map role name to Vietnamese
 */
const mapRoleName = (role, isRoot) => {
  if (isRoot && role === 'ADMIN') {
    return 'Quản lý/Chủ nhà hàng'
  }
  if (!isRoot && role === 'ADMIN') {
    return 'Quản lý/Chủ nhà hàng'
  }
  if (role === 'CASHIER') {
    return 'Thu ngân'
  }
  if (role === 'KITCHEN') {
    return 'Bếp'
  }
  if (role === 'STAFF') {
    return 'Phục vụ'
  }
  return role
}

/**
 * Search staff report
 */
const search = async () => {
  // Check store id
  if (!inputs.value.store_id) {
    popToast('danger', 'Vui lòng chọn cửa hàng')
    return
  }

  // Check validate
  if (!checkFromDateAndToDate()) {
    items.value = []
    return
  }

  loading.value = true

  const params = {
    store_id: inputs.value.store_id,
    fromDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate),
    toDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate),
    orderBy: inputs.value.orderBy
  }

  try {
    const res = await adminAPI.getBrandReportByStaff(params)
    if (res && res.data && res.data.data) {
      const datas = res.data.data

      // Reset sum values
      sum_quantity_order.value = 0
      sum_total_order.value = 0
      sum_quantity_payment.value = 0
      sum_total_payment.value = 0

      // Process data and calculate sums
      for (let index in datas) {
        // Map role names
        datas[index].role_name = mapRoleName(datas[index].role_name, datas[index].is_root)

        // Calculate sums
        sum_quantity_order.value += parseInt(datas[index].quantity_order) || 0
        sum_total_order.value += parseInt(datas[index].total_order) || 0
        sum_quantity_payment.value += parseInt(datas[index].quantity_payment) || 0
        sum_total_payment.value += parseInt(datas[index].total_payment) || 0
      }

      items.value = datas
    }

    firstSearch.value = false
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  getOptionStore()

  // Set default dates to today
  const dateNow = new Date().toJSON().slice(0, 10)
  inputs.value.toDate = commonFunc.formatDate(dateNow)
  inputs.value.fromDate = commonFunc.formatDate(dateNow)
})
</script>

<style scoped>
.text-header {
  color: #2c3e50;
}
</style>
