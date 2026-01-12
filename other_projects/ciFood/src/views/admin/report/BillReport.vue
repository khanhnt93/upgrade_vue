<template>
  <div id="bill-report">
    <div class="grid grid-cols-1 gap-4">
      <div class="bg-white rounded-lg shadow-md">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-xl font-semibold text-gray-800 text-center">Báo Cáo Bán Hàng</h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <!-- Report By -->
            <div class="grid grid-cols-12 gap-4 items-center">
              <label class="col-span-3 text-sm font-medium text-gray-700">Báo cáo theo:</label>
              <select
                @change="changeReportBy()"
                class="col-span-9 md:col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="inputs.reportBy">
                <option v-for="option in reportByOption" :key="option.value" :value="option.value">{{ option.name }}</option>
              </select>
            </div>

            <!-- From Date & To Date -->
            <div class="grid grid-cols-12 gap-4 items-center">
              <label class="col-span-3 text-sm font-medium text-gray-700">Thời gian:</label>
              <div class="col-span-9 md:col-span-4 flex items-center gap-2">
                <span class="text-sm text-gray-600">Từ</span>
                <input
                  @keyup="inputDateOnly($event.target)"
                  type="text"
                  maxlength="10"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="inputs.fromDate"
                  placeholder="DD/MM/YYYY">
                <span class="text-sm text-gray-600">Đến</span>
                <input
                  @keyup="inputDateOnly($event.target)"
                  type="text"
                  maxlength="10"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="inputs.toDate"
                  placeholder="DD/MM/YYYY">
              </div>
            </div>

            <!-- Order By -->
            <div class="grid grid-cols-12 gap-4 items-center">
              <label class="col-span-3 text-sm font-medium text-gray-700">Sắp xếp theo:</label>
              <select
                class="col-span-9 md:col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="inputs.orderBy">
                <option v-for="option in orderByOption" :key="option.value" :value="option.value">{{ option.name }}</option>
              </select>
            </div>

            <!-- Search Button -->
            <div class="grid grid-cols-12 gap-4 items-center">
              <div class="col-span-3"></div>
              <button
                class="col-span-9 md:col-span-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                @click="search()">
                Tìm kiếm
              </button>
            </div>
          </div>

          <!-- Excel Export Buttons -->
          <div class="mt-6">
            <button
              v-if="!firstSearch && !loading && inputs.reportBy == 'bill'"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="exportToExcel(bills, excel_bill_fields, 'bill_report.xls')">
              Xuất Excel
            </button>
            <button
              v-if="!firstSearch && !loading && inputs.reportBy == 'food'"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="exportToExcel(foods, excel_food_fields, 'food_report.xls')">
              Xuất Excel
            </button>
            <div v-if="loading" class="text-center mt-3">
              <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
            </div>
          </div>

          <!-- Bill Report Table -->
          <div class="mt-6 overflow-x-auto" v-if="inputs.reportBy == 'bill'" v-show="!firstSearch && !loading && bills.length > 0">
            <table class="min-w-full border border-gray-300 rounded-md shadow-sm">
              <thead class="bg-blue-100">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">STT</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Ngày</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Số Bill</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Bàn</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Tổng Tiền Món</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Phí dv, phụ thu</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Giảm Giá</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">% Thuế</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Số Tiền Thuế</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Thành Tiền</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Tiền mặt</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Chuyển khoản</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Tiền điện tử</th>
                </tr>
                <tr class="bg-orange-100 font-semibold text-orange-600">
                  <td class="px-4 py-2 border-t border-gray-300"></td>
                  <td class="px-4 py-2 border-t border-gray-300"></td>
                  <td class="px-4 py-2 border-t border-gray-300"></td>
                  <td class="px-4 py-2 border-t border-gray-300">Tổng</td>
                  <td class="px-4 py-2 border-t border-gray-300">{{ formatCurrency(totalPrice) }}</td>
                  <td class="px-4 py-2 border-t border-gray-300">{{ formatCurrency(totalServicePrice) }}</td>
                  <td class="px-4 py-2 border-t border-gray-300">{{ formatCurrency(totalDiscount) }}</td>
                  <td class="px-4 py-2 border-t border-gray-300"></td>
                  <td class="px-4 py-2 border-t border-gray-300">{{ formatCurrency(totalVat) }}</td>
                  <td class="px-4 py-2 border-t border-gray-300">{{ formatCurrency(totalAmount) }}</td>
                  <td class="px-4 py-2 border-t border-gray-300">{{ formatCurrency(total_cash) }}</td>
                  <td class="px-4 py-2 border-t border-gray-300">{{ formatCurrency(total_credit) }}</td>
                  <td class="px-4 py-2 border-t border-gray-300">{{ formatCurrency(total_emoney) }}</td>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(bill, index) in bills" :key="index" class="hover:bg-gray-50">
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ bill.created_at }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ bill.bill_number }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ bill.table_name }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(bill.sub_total) }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(bill.service_price) }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(bill.discount_amount) }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ bill.vat_percent }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(bill.vat_value) }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(bill.total) }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(bill.cash) }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(bill.credit) }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(bill.e_money) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Food Report Table -->
          <div class="mt-6 overflow-x-auto" v-if="inputs.reportBy == 'food'" v-show="!firstSearch && !loading && foods.length > 0">
            <table class="min-w-full border border-gray-300 rounded-md shadow-sm">
              <thead class="bg-blue-100">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">STT</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Ngày</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Số Bill</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Bàn</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Tên Món</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Đơn Giá</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Số Lượng</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Thành Tiền</th>
                </tr>
                <tr class="bg-orange-100 font-semibold text-orange-600">
                  <td class="px-4 py-2 border-t border-gray-300"></td>
                  <td class="px-4 py-2 border-t border-gray-300"></td>
                  <td class="px-4 py-2 border-t border-gray-300"></td>
                  <td class="px-4 py-2 border-t border-gray-300">Tổng</td>
                  <td class="px-4 py-2 border-t border-gray-300"></td>
                  <td class="px-4 py-2 border-t border-gray-300"></td>
                  <td class="px-4 py-2 border-t border-gray-300">{{ totalQuantity }}</td>
                  <td class="px-4 py-2 border-t border-gray-300">{{ formatCurrency(totalPrice) }}</td>
                </tr>
                <tr class="bg-orange-100 font-semibold text-orange-600">
                  <td colspan="7" class="px-4 py-2 border-t border-gray-300">Tổng phí dịch vụ, phụ thu</td>
                  <td class="px-4 py-2 border-t border-gray-300">{{ formatCurrency(totalServicePrice) }}</td>
                </tr>
                <tr class="bg-orange-100 font-semibold text-orange-600">
                  <td colspan="7" class="px-4 py-2 border-t border-gray-300">Tổng giảm giá</td>
                  <td class="px-4 py-2 border-t border-gray-300">{{ formatCurrency(totalDiscount) }}</td>
                </tr>
                <tr class="bg-orange-100 font-semibold text-orange-600">
                  <td colspan="7" class="px-4 py-2 border-t border-gray-300">Tổng thuế</td>
                  <td class="px-4 py-2 border-t border-gray-300">{{ formatCurrency(totalVat) }}</td>
                </tr>
                <tr class="bg-orange-100 font-semibold text-orange-600">
                  <td colspan="7" class="px-4 py-2 border-t border-gray-300">Tổng thanh toán</td>
                  <td class="px-4 py-2 border-t border-gray-300">{{ formatCurrency(totalAmount) }}</td>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(food, index) in foods" :key="index" class="hover:bg-gray-50">
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ food.created_at }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ food.bill_number }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ food.table_name }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ food.food_name }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(food.price) }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ food.quantity }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(food.amount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import { useExcelExport } from '@/composables/useExcelExport'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'

const { showToast } = useToast()
const { formatCurrency } = useFormatters()
const { exportToExcel } = useExcelExport()

const reportByOption = ref([
  { value: 'bill', name: 'Bill' },
  { value: 'food', name: 'Món' }
])

const orderByOption = ref([
  { value: 'payment_at asc', name: 'Ngày tăng dần' },
  { value: 'payment_at desc', name: 'Ngày giảm dần' }
])

const inputs = ref({
  reportBy: 'bill',
  fromDate: '',
  toDate: '',
  orderBy: 'payment_at asc'
})

const bills = ref([])
const foods = ref([])
const firstSearch = ref(true)
const onSearch = ref(false)
const currentReportBy = ref('')
const widowHeight = ref(0)

const totalPrice = ref(0)
const totalServicePrice = ref(0)
const totalDiscount = ref(0)
const totalVat = ref(0)
const totalAmount = ref(0)
const totalQuantity = ref(0)
const total_cash = ref(0)
const total_credit = ref(0)
const total_emoney = ref(0)

const excel_bill_fields = ref({
  'Ngày': 'created_at',
  'Số Bill': 'bill_number',
  'Bàn': 'table_name',
  'Tổng tiền món': 'sub_total',
  'Phí dv, phụ thu': 'service_price',
  'Giảm Giá': 'discount_amount',
  '% Thuế': 'vat_percent',
  'Số Tiền Thuế': 'vat_value',
  'Thành Tiền': 'total',
  'Tiền mặt': 'cash',
  'Chuyển khoản': 'credit',
  'Tiền điện tử': 'e_money'
})

const excel_food_fields = ref({
  'Ngày': 'created_at',
  'Số Bill': 'bill_number',
  'Bàn': 'table_name',
  'Tên Món': 'food_name',
  'Đơn Giá': 'price',
  'Số Lượng': 'quantity',
  'Thành Tiền': 'amount'
})

const loading = ref(false)

onMounted(() => {
  let dateNow = new Date().toJSON().slice(0, 10)
  inputs.value.toDate = commonFunc.formatDate(dateNow)
  inputs.value.fromDate = commonFunc.formatDate(dateNow)

  // Get window height
  widowHeight.value = window.innerHeight
})

/**
 * Check valid from date and to date
 */
const checkFromDateAndToDate = () => {
  if (inputs.value.fromDate == '' || inputs.value.fromDate == null || commonFunc.dateFormatCheck(inputs.value.fromDate) == false) {
    showToast('Mục từ ngày không đúng', 'error')
    return false
  }
  if (inputs.value.toDate == '' || inputs.value.toDate == null || commonFunc.dateFormatCheck(inputs.value.fromDate) == false) {
    showToast('Mục đến ngày không đúng', 'error')
    return false
  }
  let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
  let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate))

  if (fromDate > toDate) {
    showToast('Từ ngày không thể lớn hớn đến ngày', 'error')
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
  // Check validate
  if (!checkFromDateAndToDate()) {
    foods.value = []
    bills.value = []
    return
  }
  onSearch.value = true
  loading.value = true

  let params = {
    reportBy: inputs.value.reportBy,
    fromDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate),
    toDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate),
    orderBy: inputs.value.orderBy
  }

  // Search
  adminAPI.searchBill(params).then(res => {
    if (res && res.data && res.data.data) {
      if (inputs.value.reportBy == 'bill') {
        bills.value = res.data.data.data
        foods.value = []
      }
      if (inputs.value.reportBy == 'food') {
        foods.value = res.data.data.data
        bills.value = []
      }
      totalPrice.value = res.data.data.total_price
      totalServicePrice.value = res.data.data.total_service_price
      totalDiscount.value = res.data.data.total_discount
      totalVat.value = res.data.data.total_vat
      totalAmount.value = res.data.data.total_amount
      totalQuantity.value = res.data.data.total_quantity
      total_cash.value = res.data.data.total_cash
      total_credit.value = res.data.data.total_credit
      total_emoney.value = res.data.data.total_emoney
    }

    firstSearch.value = false
    onSearch.value = false
    loading.value = false
  }).catch(err => {
    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
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
  let valueInput = item.value
  let result = commonFunc.inputDateOnly(valueInput)
  item.value = result
}

/**
 * Event change report by
 */
const changeReportBy = () => {
  bills.value = []
  foods.value = []
  firstSearch.value = true
}
</script>

<style lang="css" scoped>
table {
  margin: auto;
  border-collapse: collapse;
  overflow-x: auto;
  display: block;
  width: fit-content;
  max-width: 100%;
}
</style>
