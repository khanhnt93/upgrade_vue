<template>
  <div class="container mx-auto px-4">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="bg-white rounded-lg shadow">
          <div class="flex flex-wrap -mx-2 p-4">
            <div class="w-full px-2">
              <h4 class="text-center text-header font-bold">BÁO CÁO BÁN HÀNG</h4>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2 px-4">
            <div class="w-full md:w-1/4 px-2 mb-4">
              <label class="block mb-2"> Cửa hàng </label>
              <select
                id="status"
                autocomplete="new-password"
                class="form-control w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="inputs.store_id"
                :disabled="onSearch">
                <option v-for="option in optionsStore" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="w-full md:w-1/6 px-2 mb-4">
              <label class="block mb-2">
                Báo cáo theo:
              </label>
              <select
                id="reportBy"
                autocomplete="new-password"
                class="form-control w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="inputs.reportBy"
                @change="changeReportBy">
                <option v-for="option in reportByOption" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="w-full md:w-1/3 px-2 mb-4">
              <label class="block mb-2">
                Thời gian:
              </label>
              <div class="flex items-center space-x-2">
                <span class="text-sm">Từ</span>
                <input
                  id="fromDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="inputs.fromDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)">
                <span class="text-sm">Đến</span>
                <input
                  id="toDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="inputs.toDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)">
              </div>
            </div>

            <div class="w-full md:w-1/4 px-2 mb-4">
              <label class="block mb-2">
                Sắp xếp theo:
              </label>
              <select
                id="orderBy"
                autocomplete="new-password"
                class="form-control w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="inputs.orderBy">
                <option v-for="option in orderByOption" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2 px-4 pb-4">
            <div class="w-full px-2">
              <button
                class="float-right px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded btn-width-120 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="onSearch"
                @click.prevent="search">
                Xem
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap -mx-2 mt-4" v-show="inputs.reportBy == 'bill'">
      <div class="w-full px-2">
        <div class="bg-white rounded-lg shadow">
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <div v-show="firstSearch == false && bills.length > 0" class="p-4">
            <div class="flex flex-wrap -mx-2 mb-4">
              <div class="w-full md:w-1/3 px-2">
                Số kết quả: {{ bills.length }}
              </div>
              <div class="w-full md:w-2/3 px-2 text-right">
                <button
                  @click="exportBillsToExcel"
                  class="btn btn-default text-header px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  <b>Xuất Excel</b>
                </button>
              </div>
            </div>

            <div class="overflow-x-auto table-cus">
              <table class="min-w-full border border-gray-300">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-4 py-2 border border-gray-300 text-left">STT</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Ngày</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Số Bill</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Bàn</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Tổng</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Phí dịch vụ, phụ thu</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Giảm Giá</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">% Thuế</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Số Tiền Thuế</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Thành Tiền</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Nội dung dịch vụ, phụ thu</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Nội dung Giảm Giá</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Tiền mặt</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Chuyển khoản</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Tiền điện tử</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(bill, index) in bills" :key="index" class="hover:bg-gray-50">
                    <td class="px-4 py-2 border border-gray-300">{{ index + 1 }}</td>
                    <td class="px-4 py-2 border border-gray-300">{{ bill.created_at }}</td>
                    <td class="px-4 py-2 border border-gray-300">{{ bill.bill_number }}</td>
                    <td class="px-4 py-2 border border-gray-300">{{ bill.table_name }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right">{{ currencyFormat(bill.sub_total) }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right">{{ currencyFormat(bill.service_price) }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right">{{ currencyFormat(bill.discount_amount) }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right">{{ bill.vat_percent }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right">{{ currencyFormat(bill.vat_value) }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right">{{ currencyFormat(bill.total) }}</td>
                    <td class="px-4 py-2 border border-gray-300">{{ bill.service_name }}</td>
                    <td class="px-4 py-2 border border-gray-300">{{ bill.content_discount }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right">{{ currencyFormat(bill.cash) }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right">{{ currencyFormat(bill.credit) }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right">{{ currencyFormat(bill.e_money) }}</td>
                  </tr>

                  <tr class="bg-gray-100">
                    <td class="px-4 py-2 border border-gray-300 total text-center font-bold" colspan="4">Tổng</td>
                    <td class="px-4 py-2 border border-gray-300 text-right total font-bold">{{ currencyFormat(totalPrice) }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right total font-bold">{{ currencyFormat(totalServicePrice) }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right total font-bold">{{ currencyFormat(totalDiscount) }}</td>
                    <td class="px-4 py-2 border border-gray-300"></td>
                    <td class="px-4 py-2 border border-gray-300 text-right total font-bold">{{ currencyFormat(totalVat) }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right total font-bold">{{ currencyFormat(totalAmount) }}</td>
                    <td class="px-4 py-2 border border-gray-300"></td>
                    <td class="px-4 py-2 border border-gray-300"></td>
                    <td class="px-4 py-2 border border-gray-300 text-right total font-bold">{{ currencyFormat(total_cash) }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right total font-bold">{{ currencyFormat(total_credit) }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right total font-bold">{{ currencyFormat(total_emoney) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-show="firstSearch == false && bills.length == 0" class="p-4">
            <div class="text-center">
              Không tìm thấy kết quả nào
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap -mx-2 mt-4" v-show="inputs.reportBy == 'food'">
      <div class="w-full px-2">
        <div class="bg-white rounded-lg shadow">
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <div v-show="firstSearch == false && foods.length > 0" class="p-4">
            <div class="flex flex-wrap -mx-2 mb-4">
              <div class="w-full md:w-1/3 px-2">
                Số kết quả: {{ foods.length }}
              </div>
              <div class="w-full md:w-2/3 px-2 text-right">
                <button
                  @click="exportFoodsToExcel"
                  class="btn btn-default text-header px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  <b>Xuất Excel</b>
                </button>
              </div>
            </div>

            <div class="overflow-x-auto table-cus">
              <table class="min-w-full border border-gray-300">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-4 py-2 border border-gray-300 text-left">STT</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Ngày</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Số Bill</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Bàn</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Tên Món</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Đơn Giá</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Số Lượng</th>
                    <th class="px-4 py-2 border border-gray-300 text-left">Thành Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(food, index) in foods" :key="index" class="hover:bg-gray-50">
                    <td class="px-4 py-2 border border-gray-300">{{ index + 1 }}</td>
                    <td class="px-4 py-2 border border-gray-300">{{ food.created_at }}</td>
                    <td class="px-4 py-2 border border-gray-300">{{ food.bill_number }}</td>
                    <td class="px-4 py-2 border border-gray-300">{{ food.table_name }}</td>
                    <td class="px-4 py-2 border border-gray-300">{{ food.food_name }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right">{{ currencyFormat(food.price) }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right">{{ food.quantity }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right">{{ currencyFormat(food.amount) }}</td>
                  </tr>
                  <tr class="bg-gray-100">
                    <td class="px-4 py-2 border border-gray-300 font-bold total text-center" colspan="6">Tổng</td>
                    <td class="px-4 py-2 border border-gray-300 text-right font-bold total">{{ currencyFormat(totalQuantity) }}</td>
                    <td class="px-4 py-2 border border-gray-300 text-right font-bold total">{{ currencyFormat(totalAmount) }}</td>
                  </tr>
                  <tr class="bg-gray-100">
                    <td class="px-4 py-2 border border-gray-300 font-bold total text-center" colspan="6">Tổng phí dịch vụ, phụ thu</td>
                    <td class="px-4 py-2 border border-gray-300 text-right font-bold total" colspan="2">{{ currencyFormat(totalServicePrice) }}</td>
                  </tr>
                  <tr class="bg-gray-100">
                    <td class="px-4 py-2 border border-gray-300 font-bold total text-center" colspan="6">Tổng giảm giá</td>
                    <td class="px-4 py-2 border border-gray-300 text-right font-bold total" colspan="2">{{ currencyFormat(totalDiscount) }}</td>
                  </tr>
                  <tr class="bg-gray-100">
                    <td class="px-4 py-2 border border-gray-300 font-bold total text-center" colspan="6">Tổng thuế VAT:</td>
                    <td class="px-4 py-2 border border-gray-300 text-right font-bold total" colspan="2">{{ currencyFormat(totalVat) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-show="firstSearch == false && foods.length == 0" class="p-4">
            <div class="text-center">
              Không tìm thấy kết quả nào
            </div>
          </div>
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
import * as XLSX from 'xlsx'

const { popToast } = useToast()

const optionsStore = ref([])

const reportByOption = ref([
  { value: 'bill', text: '' },
  { value: 'bill', text: 'Bill' },
  { value: 'food', text: 'Món' }
])

const orderByOption = ref([
  { value: 'payment_at asc', text: '' },
  { value: 'payment_at asc', text: 'Thời gian tăng dần' },
  { value: 'payment_at desc', text: 'Thời gian giảm dần' }
])

const inputs = ref({
  store_id: null,
  reportBy: 'bill',
  fromDate: null,
  toDate: null,
  orderBy: 'payment_at asc'
})

const onSearch = ref(false)
const bills = ref([])
const foods = ref([])
const firstSearch = ref(true)
const loading = ref(false)

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
  'Tổng': 'sub_total',
  'Phí dịch vụ, phụ thu': 'service_price',
  'Giảm Giá': 'discount_amount',
  '% Thuế': 'vat_percent',
  'Số Tiền Thuế': 'vat_value',
  'Thành Tiền': 'total',
  'Nội dung dịch vụ, phụ thu': 'service_name',
  'Nội dung Giảm Giá': 'content_discount'
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

/**
 * Get store options
 */
const getOptionStore = () => {
  adminAPI.getStoreOption().then(res => {
    if (res && res.data && res.data.data) {
      optionsStore.value = res.data.data
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

/**
 * Check valid from date and to date
 */
const checkFromDateAndToDate = () => {
  if (inputs.value.fromDate == "" || inputs.value.fromDate == null || commonFunc.dateFormatCheck(inputs.value.fromDate) == false) {
    popToast('danger', "Mục từ ngày không đúng")
    return false
  }
  if (inputs.value.toDate == "" || inputs.value.toDate == null || commonFunc.dateFormatCheck(inputs.value.fromDate) == false) {
    popToast('danger', "Mục đến ngày không đúng")
    return false
  }
  let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
  let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate))

  if (fromDate > toDate) {
    popToast('danger', "Từ ngày không thể lớn hớn đến ngày")
    return false
  }

  fromDate.setDate(fromDate.getDate() + 62)

  if (fromDate < toDate) {
    popToast('danger', "Thời gian không quá 62 ngày")
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

  // Check store id
  if (!inputs.value.store_id) {
    popToast('danger', "Vui lòng chọn cửa hàng")
    return
  }

  onSearch.value = true
  loading.value = true

  let params = {
    store_id: inputs.value.store_id,
    reportBy: inputs.value.reportBy,
    fromDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate),
    toDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate),
    orderBy: inputs.value.orderBy
  }

  // Search
  adminAPI.searchBrandBill(params).then(res => {
    if (res && res.data && res.data.data) {
      if (inputs.value.reportBy == "bill") {
        bills.value = res.data.data.data
        foods.value = []
      }
      if (inputs.value.reportBy == "food") {
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
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)

    firstSearch.value = false
    onSearch.value = false
    loading.value = false
  })
}

/**
 * Currency format
 */
const currencyFormat = (num) => {
  let result = ""
  if (num === 0) {
    return 0
  }
  if (num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
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

const exportBillsToExcel = () => {
  const exportData = bills.value.map((item, index) => ({
    'Ngày': item.created_at,
    'Số Bill': item.bill_number,
    'Bàn': item.table_name,
    'Tổng': item.sub_total,
    'Phí dịch vụ, phụ thu': item.service_price,
    'Giảm Giá': item.discount_amount,
    '% Thuế': item.vat_percent,
    'Số Tiền Thuế': item.vat_value,
    'Thành Tiền': item.total,
    'Nội dung dịch vụ, phụ thu': item.service_name,
    'Nội dung Giảm Giá': item.content_discount
  }))
  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo Cáo Theo Bill')
  XLSX.writeFile(workbook, 'bao_cao_theo_bill.xlsx')
}

const exportFoodsToExcel = () => {
  const exportData = foods.value.map((item, index) => ({
    'Ngày': item.created_at,
    'Số Bill': item.bill_number,
    'Bàn': item.table_name,
    'Tên Món': item.food_name,
    'Đơn Giá': item.price,
    'Số Lượng': item.quantity,
    'Thành Tiền': item.amount
  }))
  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo Cáo Theo Món')
  XLSX.writeFile(workbook, 'bao_cao_theo_mon.xlsx')
}

onMounted(() => {
  // Load store option
  getOptionStore()

  let dateNow = new Date().toJSON().slice(0, 10)
  inputs.value.toDate = commonFunc.formatDate(dateNow)
  inputs.value.fromDate = commonFunc.formatDate(dateNow)
})
</script>

<style lang="css" scoped>
.total {
  color: #ed592a;
}
</style>
