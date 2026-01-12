<template>
  <div class="w-full px-4">
    <!-- Filters Card -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h4 class="text-xl font-semibold text-center mb-6 text-header">Báo Cáo Sửa Giá Theo Cửa Hàng</h4>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Store Dropdown -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cửa hàng</label>
          <select
            id="store"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.store_id"
            :disabled="onSearch">
            <option v-for="option in optionsStore" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

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
            id="orderBy"
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
            @click="exportToExcel(items, excel_bill_fields, 'bao_cao_sua_gia_cua_hang', 'Báo Cáo Sửa Giá')">
            Xuất Excel
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-blue-100">
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">STT</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Thời gian</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Bàn</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nhân viên</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Số bill</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Số tiền thay đổi</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="item.bill_number" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ index + 1 }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ item.payment_at }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ item.table_name }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ item.staff_name }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ item.bill_number }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatCurrency(item.total_edit_price) }}</td>
                <td class="border border-gray-300 px-4 py-2">
                  <p v-for="(food, fIndex) in item.foods" :key="fIndex" v-show="food.edit_price != 0" class="mb-1">
                    <span v-if="food.edit_price < 0" class="text-red-600 font-semibold">Giảm: </span>
                    <span v-if="food.edit_price > 0" class="text-green-600 font-semibold">Tăng: </span>
                    {{ formatCurrency(food.edit_price) }} từ [Số lượng]:{{ food.quantity }} [Tên món]:{{ food.name }}
                  </p>
                </td>
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
const { formatCurrency } = useFormatters()
const { exportToExcel } = useExcelExport()

const orderByOption = [
  { value: 'payment_at asc', text: 'Thời gian tăng dần' },
  { value: 'payment_at desc', text: 'Thời gian giảm dần' }
]

const optionsStore = ref([{ value: null, text: '' }])

const inputs = ref({
  store_id: null,
  fromDate: null,
  toDate: null,
  orderBy: 'payment_at asc'
})

const onSearch = ref(false)
const items = ref([])
const firstSearch = ref(true)
const loading = ref(false)

const excel_bill_fields = {
  'Thời gian': 'payment_at',
  'Bàn': 'table_name',
  'Nhân viên': 'staff_name',
  'Số bill': 'bill_number',
  'Số tiền thay đổi': 'total_edit_price'
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
    store_id: inputs.value.store_id,
    fromDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate),
    toDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate),
    orderBy: inputs.value.orderBy
  }

  // Search
  adminAPI.getBrandReportEditPrice(params)
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

/**
 * Get store options
 */
const getStoreOption = () => {
  adminAPI.getStoreByBrandOption().then(res => {
    optionsStore.value = [{ value: null, text: '' }]
    if (res && res.data && res.data.data) {
      const stores = res.data.data
      for (const index in stores) {
        const store = {
          value: stores[index].value,
          text: stores[index].text
        }
        optionsStore.value.push(store)
      }
    }
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

onMounted(() => {
  const dateNow = new Date().toJSON().slice(0, 10)
  inputs.value.toDate = commonFunc.formatDate(dateNow)
  inputs.value.fromDate = commonFunc.formatDate(dateNow)

  // Get store options
  getStoreOption()
})
</script>

<style scoped>
.text-header {
  color: #2c3e50;
  font-weight: 600;
}
</style>
