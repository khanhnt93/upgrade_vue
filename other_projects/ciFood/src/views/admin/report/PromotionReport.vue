<template>
  <div class="w-full px-4">
    <!-- Filters Card -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h4 class="text-xl font-semibold text-center mb-6 text-header">Báo Cáo Khuyến Mãi</h4>

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

      <div v-show="!loading">
        <!-- Header with Count and Export -->
        <div class="flex justify-between items-center mb-4">
          <div class="text-gray-700">
            Số kết quả: <span class="font-semibold">{{ orders.length }}</span>
          </div>
          <download-excel
            class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-header font-semibold"
            :data="excel_bill_data"
            :fields="excel_bill_fields"
            worksheet="Báo Cáo Khuyến Mãi"
            name="bao_cao_khuyen_mai.xls">
            Xuất Excel
          </download-excel>
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
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tên khách hàng</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Số điện thoại</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tổng tiền món</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tổng giảm giá</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Loại</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tên</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Code</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">% giảm giá</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Giảm giá tối đa</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Trên tổng giá</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Miễn phí món</th>
                <th class="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Giá trị voucher</th>
              </tr>
            </thead>
            <tbody v-for="(promotions, index) in orders" :key="index">
              <tr v-for="(promotion, pIndex) in promotions.promotions" :key="pIndex" class="hover:bg-gray-50">
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ index + 1 }}</td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotions.payment_at }}</td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotions.bill_number }}</td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotions.table_name }}</td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotions.customer_name }}</td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotions.customer_phone_number }}</td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatters.formatCurrency(promotions.sub_total) }}</td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatters.formatCurrency(promotions.discount_amount) }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotion.type_name }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotion.promotion_name }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotion.code }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotion.discount_percent }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotion.max_discount }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotion.discount_on_amount }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotion.food_name }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatters.formatCurrency(promotion.value_of_voucher) }}</td>
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

const { popToast } = useToast()
const formatters = useFormatters()

const orderByOption = [
  { value: 't.payment_at asc', text: '' },
  { value: 't.payment_at asc', text: 'Thời gian tăng dần' },
  { value: 't.payment_at desc', text: 'Thời gian giảm dần' }
]

const inputs = ref({
  fromDate: null,
  toDate: null,
  orderBy: 't.payment_at asc'
})

const onSearch = ref(false)
const orders = ref([])
const loading = ref(false)

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
 * Handle Excel Data
 */
const handleExcelData = () => {
  excel_bill_data.value = []
  for (let order of orders.value) {
    let promotions = order.promotions

    let index = 1
    for (let promotion of promotions) {
      let item = {
        'payment_at': '',
        'bill_number': '',
        'table_name': '',
        'customer_name': '',
        'customer_phone_number': '',
        'sub_total': '',
        'discount_amount': ''
      }
      if (index === 1) {
        item = {
          'payment_at': order.payment_at,
          'bill_number': order.bill_number,
          'table_name': order.table_name,
          'customer_name': order.customer_name,
          'customer_phone_number': order.customer_phone_number,
          'sub_total': order.sub_total,
          'discount_amount': order.discount_amount
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

/**
 * Search
 */
const search = () => {
  // Check validate
  if (!checkFromDateAndToDate()) {
    orders.value = []
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
  adminAPI.getPromotionReport(params)
    .then(res => {
      if (res && res.data && res.data.data) {
        orders.value = res.data.data
        handleExcelData()
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

<script>
import JsonExcel from 'vue-json-excel'

export default {
  components: {
    downloadExcel: JsonExcel
  }
}
</script>

<style scoped>
.text-header {
  color: #2c3e50;
  font-weight: 600;
}
</style>
