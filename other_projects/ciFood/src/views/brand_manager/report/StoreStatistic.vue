<template>
  <div class="w-full px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h4 class="text-xl font-semibold text-center mb-6 text-header">Thống Kê Chuỗi Cửa Hàng</h4>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <!-- Store -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cửa hàng</label>
          <select
            id="storeId"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.storeId">
            <option v-for="option in storeOptions" :key="option.value" :value="option.value">
              {{ option.name }}
            </option>
          </select>
        </div>

        <!-- From Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Từ ngày <span class="text-red-500">*</span>
          </label>
          <input
            id="fromDate"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="errorFromDate ? 'border-red-500' : 'border-gray-300'"
            v-model="inputs.fromDate"
            maxlength="10"
            @keyup="inputDateOnly($event.target)">
          <p v-if="errorFromDate" class="text-red-500 text-sm mt-1">
            Mục từ ngày không đúng
          </p>
        </div>

        <!-- To Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Đến ngày <span class="text-red-500">*</span>
          </label>
          <input
            id="toDate"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="errorToDate ? 'border-red-500' : 'border-gray-300'"
            v-model="inputs.toDate"
            maxlength="10"
            @keyup="inputDateOnly($event.target)">
          <p v-if="errorToDate" class="text-red-500 text-sm mt-1">
            Mục đến ngày không đúng
          </p>
        </div>
      </div>

      <!-- Order By -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sắp xếp theo</label>
          <select
            id="orderBy"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.orderBy">
            <option v-for="option in orderByOption" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <!-- Search Button -->
      <div class="flex justify-end mb-4">
        <button
          class="px-6 py-2 bg-white border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="onSearch"
          @click="search">
          Xem
        </button>
      </div>

      <!-- Loading -->
      <div v-show="loading" class="flex justify-center items-center py-8">
        <i class="fa fa-spinner fa-spin text-blue-500 text-4xl"></i>
      </div>

      <div v-show="!loading && items.length > 0">
        <!-- Header with Count and Export -->
        <div class="flex justify-between items-center mb-4">
          <div class="text-gray-700">
            Số kết quả: <span class="font-semibold">{{ items.length }}</span>
          </div>
          <button
            class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-header font-semibold"
            @click="exportToExcel(items, excel_statistic_fields, 'thong_ke_chuoi_cua_hang', 'Thống kê')">
            Xuất Excel
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-blue-100">
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">STT</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tên</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Số lượng</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">% Số lượng</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Doanh thu</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">% Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.stt" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-2">{{ item.stt }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.quantity }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.percent_quantity }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ formatCurrency(item.amount) }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.percent_amount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Results -->
      <div v-show="!loading && !firstSearch && items.length === 0" class="text-center py-8 text-gray-500">
        Không có kết quả nào
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import { useExcelExport } from '@/composables/useExcelExport'

const { error: showToast } = useToast()
const { formatCurrency } = useFormatters()
const { exportToExcel } = useExcelExport()

const storeOptions = ref([
  { value: '', name: 'Tất cả' }
])

const orderByOption = [
  { value: 'quantityAsc', text: 'Số lượng tăng dần' },
  { value: 'quantityDesc', text: 'Số lượng giảm dần' },
  { value: 'amountAsc', text: 'Doanh thu tăng dần' },
  { value: 'amountDesc', text: 'Doanh thu giảm dần' }
]

const inputs = ref({
  storeId: '',
  fromDate: null,
  toDate: null,
  orderBy: 'quantityAsc'
})

const onSearch = ref(false)
const click = ref(false)
const items = ref([])
const loading = ref(false)
const firstSearch = ref(true)

const excel_statistic_fields = {
  'STT': 'stt',
  'Tên': 'name',
  'Số lượng': 'quantity',
  '% Số lượng': 'percent_quantity',
  'Doanh thu': 'amount',
  '% Doanh thu': 'percent_amount'
}

const checkDate = (dateInput) => {
  return (click.value && (!dateInput || commonFunc.dateFormatCheck(dateInput) === false))
}

const errorFromDate = computed(() => checkDate(inputs.value.fromDate))
const errorToDate = computed(() => checkDate(inputs.value.toDate))

const checkValidate = () => {
  return !(errorFromDate.value || errorToDate.value)
}

onMounted(() => {
  // Get default date
  const dateNow = new Date().toJSON().slice(0, 10)
  inputs.value.toDate = commonFunc.formatDate(dateNow)
  inputs.value.fromDate = commonFunc.formatDate(dateNow)

  // Get store options
  getStoreOptions()
})

/**
 * Get store options
 */
const getStoreOptions = () => {
  adminAPI.getStoreOption().then(res => {
    if (res && res.data && res.data.data) {
      storeOptions.value = [
        { value: '', name: 'Tất cả' },
        ...res.data.data.map(item => ({
          value: item.id,
          name: item.name
        }))
      ]
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'error')
  })
}

/**
 * Check valid from date and to date
 */
const checkFromDateAndToDate = () => {
  const fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
  const toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate))

  if (fromDate > toDate) {
    showToast('Từ ngày không thể lớn hơn đến ngày', 'error')
    return false
  }

  fromDate.setDate(fromDate.getDate() + 62)

  if (fromDate < toDate) {
    showToast('Thời gian không quá 62 ngày', 'error')
    return false
  }

  return true
}

/**
 * Search
 */
const search = () => {
  if (loading.value) return

  click.value = true

  // Check validate
  if (!checkValidate()) {
    items.value = []
    return
  }
  if (!checkFromDateAndToDate()) {
    items.value = []
    return
  }

  loading.value = true
  onSearch.value = true

  const params = {
    storeId: inputs.value.storeId,
    fromDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate),
    toDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate),
    orderBy: inputs.value.orderBy
  }

  // Search
  adminAPI.getBrandStatistic(params)
    .then(res => {
      if (res && res.data && res.data.data) {
        items.value = res.data.data
      }
      firstSearch.value = false
      onSearch.value = false
      loading.value = false
    })
    .catch(err => {
      const errorMess = commonFunc.handleStaffError(err)
      showToast(errorMess, 'error')
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
</script>

<style scoped>
.text-header {
  color: #2c3e50;
  font-weight: 600;
}
</style>
