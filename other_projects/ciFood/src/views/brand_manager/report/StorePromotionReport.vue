<template>
  <div class="w-full px-4 py-6">
    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">Báo Cáo Khuyến Mãi</h2>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Store Dropdown -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cửa hàng</label>
          <select
            v-model="inputs.store_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="onSearch">
            <option v-for="option in optionsStore" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <!-- Date Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">Từ</span>
            <input
              v-model="inputs.fromDate"
              type="text"
              maxlength="10"
              @keyup="inputDateOnly($event.target)"
              placeholder="dd/mm/yyyy"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <span class="text-sm text-gray-600">Đến</span>
            <input
              v-model="inputs.toDate"
              type="text"
              maxlength="10"
              @keyup="inputDateOnly($event.target)"
              placeholder="dd/mm/yyyy"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <!-- Order By Dropdown -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sắp xếp theo</label>
          <select
            v-model="inputs.orderBy"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in orderByOption" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <!-- Search Button -->
        <div class="flex items-end">
          <button
            @click="search"
            :disabled="onSearch"
            class="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Xem
          </button>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Loading State -->
      <div v-show="loading" class="flex justify-center items-center py-8">
        <font-awesome-icon icon="spinner" spin class="text-blue-500 text-4xl" />
      </div>

      <!-- Table Content -->
      <div v-show="!loading && orders.length > 0">
        <!-- Header with Count and Export -->
        <div class="flex justify-between items-center mb-4">
          <div class="text-gray-700">
            Số kết quả: <span class="font-semibold">{{ orders.length }}</span>
          </div>
          <button
            class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-gray-700 font-semibold"
            @click="exportToExcel(excel_bill_data, excel_bill_fields, 'bao_cao_khuyen_mai', 'Báo Cáo Khuyến Mãi')">
            <b>Xuất Excel</b>
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">STT</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Ngày</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Số Bill</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Bàn</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Tên khách hàng</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Số điện thoại</th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Tổng tiền món</th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Tổng giảm giá</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Loại</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Tên</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Code</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">% giảm giá</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Giảm giá tối đa</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Trên tổng giá</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Miễn phí món</th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Giá trị voucher</th>
              </tr>
            </thead>
            <tbody v-for="(promotions, index) in orders" :key="index">
              <tr v-for="(promotion, pIndex) in promotions.promotions" :key="pIndex">
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-3 py-2 text-center">
                  {{ index + 1 }}
                </td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-3 py-2">
                  {{ promotions.payment_at }}
                </td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-3 py-2">
                  {{ promotions.bill_number }}
                </td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-3 py-2">
                  {{ promotions.table_name }}
                </td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-3 py-2">
                  {{ promotions.customer_name }}
                </td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-3 py-2">
                  {{ promotions.customer_phone_number }}
                </td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-3 py-2 text-right">
                  {{ formatCurrency(promotions.sub_total) }}
                </td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-3 py-2 text-right">
                  {{ formatCurrency(promotions.discount_amount) }}
                </td>
                <td class="border border-gray-300 px-3 py-2">{{ promotion.type_name }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ promotion.promotion_name }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ promotion.code }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ promotion.discount_percent }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ promotion.max_discount }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ promotion.discount_on_amount }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ promotion.food_name }}</td>
                <td class="border border-gray-300 px-3 py-2 text-right">{{ formatCurrency(promotion.value_of_voucher) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-show="!loading && orders.length === 0 && !firstSearch" class="text-center py-8 text-gray-500">
        Không có dữ liệu
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import { useExcelExport } from '@/composables/useExcelExport'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'

// Composables
const { showToast } = useToast()
const { formatCurrency } = useFormatters()
const { exportToExcel } = useExcelExport()

// Reactive state
const optionsStore = ref([])
const orderByOption = ref([
  { value: 't.payment_at asc', text: '' },
  { value: 't.payment_at asc', text: 'Thời gian tăng dần' },
  { value: 't.payment_at desc', text: 'Thời gian giảm dần' }
])

const inputs = reactive({
  store_id: null,
  fromDate: null,
  toDate: null,
  orderBy: 't.payment_at asc'
})

const onSearch = ref(false)
const loading = ref(false)
const firstSearch = ref(true)
const orders = ref([])
const excel_bill_data = ref([])

const excel_bill_fields = {
  'Ngày': 'payment_at',
  'Số Bill': 'bill_number',
  'Bàn': 'table_name',
  'Tên khách hàng': 'customer_name',
  'Số điện thoại': 'customer_phone_number',
  'Tổng tiền dv': 'sub_total',
  'Tổng giảm giá': 'discount_amount',
  'Loại': 'type_name',
  'Tên': 'promotion_name',
  'Code': 'code',
  'Phần trăm giảm giá': 'discount_percent',
  'Giảm giá tối đa': 'max_discount',
  'Trên tổng giá': 'discount_on_amount',
  'Miễn phí món': 'food_name',
  'Giá trị voucher': 'value_of_voucher'
}

// Methods
const getOptionStore = async () => {
  try {
    const res = await adminAPI.getStoreOption()
    if (res && res.data && res.data.data) {
      optionsStore.value = res.data.data
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'error')
  }
}

const checkFromDateAndToDate = () => {
  if (!inputs.fromDate || commonFunc.dateFormatCheck(inputs.fromDate) === false) {
    showToast('Mục từ ngày không đúng', 'error')
    return false
  }
  if (!inputs.toDate || commonFunc.dateFormatCheck(inputs.toDate) === false) {
    showToast('Mục đến ngày không đúng', 'error')
    return false
  }

  const fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.fromDate))
  const toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.toDate))

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

const handleExcelData = () => {
  excel_bill_data.value = []
  for (const order of orders.value) {
    const promotions = order.promotions

    let index = 1
    for (const promotion of promotions) {
      let item = {
        payment_at: '',
        bill_number: '',
        table_name: '',
        customer_name: '',
        customer_phone_number: '',
        sub_total: '',
        discount_amount: ''
      }

      if (index === 1) {
        item = {
          payment_at: order.payment_at,
          bill_number: order.bill_number,
          table_name: order.table_name,
          customer_name: order.customer_name,
          customer_phone_number: order.customer_phone_number,
          sub_total: order.sub_total,
          discount_amount: order.discount_amount
        }
      }

      item.type_name = promotion.type_name
      item.promotion_name = promotion.promotion_name
      item.code = promotion.code
      item.discount_percent = promotion.discount_percent
      item.max_discount = promotion.max_discount
      item.discount_on_amount = promotion.discount_on_amount
      item.food_name = promotion.food_name
      item.value_of_voucher = promotion.value_of_voucher

      excel_bill_data.value.push(item)
      index += 1
    }
  }
}

const search = async () => {
  // Check store id
  if (!inputs.store_id) {
    showToast('Vui lòng chọn cửa hàng', 'error')
    return
  }

  // Check validate
  if (!checkFromDateAndToDate()) {
    orders.value = []
    return
  }

  onSearch.value = true
  loading.value = true

  const params = {
    store_id: inputs.store_id,
    fromDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.fromDate),
    toDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.toDate),
    orderBy: inputs.orderBy
  }

  try {
    const res = await adminAPI.getBrandPromotionReport(params)
    if (res && res.data && res.data.data) {
      orders.value = res.data.data
      handleExcelData()
    }
    firstSearch.value = false
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'error')
    firstSearch.value = false
  } finally {
    onSearch.value = false
    loading.value = false
  }
}

const inputDateOnly = (item) => {
  const valueInput = item.value
  const result = commonFunc.inputDateOnly(valueInput)
  item.value = result
}

// Lifecycle hooks
onMounted(() => {
  // Load store option
  getOptionStore()

  // Set default dates: last month to today
  const dateNow = new Date().toJSON().slice(0, 10)
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  lastMonth.setDate(lastMonth.getDate() + 1)
  const lastMonthStr = lastMonth.toJSON().slice(0, 10)

  inputs.toDate = commonFunc.formatDate(dateNow)
  inputs.fromDate = commonFunc.formatDate(lastMonthStr)
})
</script>

<style scoped>
/* Additional custom styles if needed */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}

table {
  white-space: nowrap;
}

td, th {
  min-width: 100px;
}

td:first-child, th:first-child {
  min-width: 50px;
}
</style>
