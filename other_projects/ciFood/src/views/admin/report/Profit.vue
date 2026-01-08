<template>
  <div id="profit-report">
    <div class="grid grid-cols-1 gap-4">
      <div class="bg-white rounded-lg shadow-md">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-xl font-semibold text-gray-800 text-center">Báo Cáo Lợi Nhuận</h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <!-- Data By -->
            <div class="grid grid-cols-12 gap-4 items-center">
              <label class="col-span-4 text-sm font-medium text-gray-700">Xem theo</label>
              <select
                @change="changeDataBy()"
                :disabled="onSearch"
                class="col-span-8 md:col-span-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="inputs.dataBy">
                <option v-for="option in dataByOption" :key="option.value" :value="option.value">{{ option.text }}</option>
              </select>
            </div>

            <!-- From Date & To Date (Day/Week) -->
            <div v-if="inputs.dataBy != 'Month'" class="grid grid-cols-12 gap-4 items-center">
              <label class="col-span-4 text-sm font-medium text-gray-700">Từ ngày</label>
              <div class="col-span-8 md:col-span-4">
                <input
                  @keyup="inputDateOnly($event.target)"
                  type="text"
                  maxlength="10"
                  :disabled="onSearch"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="inputs.fromDate"
                  placeholder="DD/MM/YYYY">
                <div v-if="errorFromDate" class="text-red-600 text-xs mt-1">Mục từ ngày không đúng</div>
              </div>
            </div>

            <div v-if="inputs.dataBy != 'Month'" class="grid grid-cols-12 gap-4 items-center">
              <label class="col-span-4 text-sm font-medium text-gray-700">Đến ngày</label>
              <div class="col-span-8 md:col-span-4">
                <input
                  @keyup="inputDateOnly($event.target)"
                  type="text"
                  maxlength="10"
                  :disabled="onSearch"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="inputs.toDate"
                  placeholder="DD/MM/YYYY">
                <div v-if="errorToDate" class="text-red-600 text-xs mt-1">Mục đến ngày không đúng</div>
              </div>
            </div>

            <!-- From Month & To Month (Month) -->
            <div v-if="inputs.dataBy == 'Month'" class="grid grid-cols-12 gap-4 items-center">
              <label class="col-span-4 text-sm font-medium text-gray-700">Từ tháng</label>
              <div class="col-span-8 md:col-span-4">
                <input
                  @keyup="inputDateOnly($event.target)"
                  type="text"
                  maxlength="10"
                  :disabled="onSearch"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="inputs.fromMonth"
                  placeholder="MM/YYYY">
                <div v-if="errorFromMonth" class="text-red-600 text-xs mt-1">Mục từ tháng không đúng</div>
              </div>
            </div>

            <div v-if="inputs.dataBy == 'Month'" class="grid grid-cols-12 gap-4 items-center">
              <label class="col-span-4 text-sm font-medium text-gray-700">Đến tháng</label>
              <div class="col-span-8 md:col-span-4">
                <input
                  @keyup="inputDateOnly($event.target)"
                  type="text"
                  maxlength="10"
                  :disabled="onSearch"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="inputs.toMonth"
                  placeholder="MM/YYYY">
                <div v-if="errorToMonth" class="text-red-600 text-xs mt-1">Mục đến tháng không đúng</div>
              </div>
            </div>

            <!-- Search Button -->
            <div class="grid grid-cols-12 gap-4 items-center">
              <div class="col-span-4"></div>
              <button
                :disabled="onSearch"
                class="col-span-8 md:col-span-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
                @click="search()">
                Xem
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="text-center mt-3">
            <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
          </div>

          <!-- Report Table -->
          <div v-if="click && datas.length > 0" class="mt-6">
            <div class="flex justify-between items-center mb-4">
              <div class="text-sm text-gray-600">Số kết quả: {{ datas.length }}</div>
              <download-excel
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :data="datas"
                :fields="excel_bill_fields"
                worksheet="Báo Cáo Lợi Nhuận"
                name="bao_cao_loi_nhuan.xls">
                <b>Xuất Excel</b>
              </download-excel>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full border border-gray-300 rounded-md shadow-sm">
                <thead class="bg-blue-100">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">STT</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Ngày</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Doanh thu bán hàng</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Doanh thu khác</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Chi phí</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Lợi nhuận</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr class="bg-orange-100 font-semibold text-orange-600">
                    <td class="px-4 py-2 text-center border-t border-gray-300" colspan="2">Tổng</td>
                    <td class="px-4 py-2 text-right border-t border-gray-300">{{ formatCurrency(totalRevenue) }}</td>
                    <td class="px-4 py-2 text-right border-t border-gray-300">{{ formatCurrency(totalRevenueOther) }}</td>
                    <td class="px-4 py-2 text-right border-t border-gray-300">{{ formatCurrency(totalFee) }}</td>
                    <td class="px-4 py-2 text-right border-t border-gray-300">{{ formatCurrency(totalProfit) }}</td>
                  </tr>
                  <tr v-for="(data, index) in datas" :key="index" class="hover:bg-gray-50">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ data.time }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{{ formatCurrency(data.revenue) }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{{ formatCurrency(data.revenueOther) }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{{ formatCurrency(data.fee) }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{{ formatCurrency(data.profit) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JsonExcel from 'vue-json-excel'
export default {
  components: {
    'downloadExcel': JsonExcel,
  }
}
</script>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'

const { showToast } = useToast()
const { formatCurrency } = useFormatters()

const dataByOption = ref([
  { value: 'Day', text: '' },
  { value: 'Day', text: 'Ngày' },
  { value: 'Week', text: 'Tuần' },
  { value: 'Month', text: 'Tháng' }
])

const inputs = ref({
  fromDate: null,
  toDate: null,
  fromMonth: null,
  toMonth: null,
  dataBy: 'Day'
})

const datas = ref([])
const totalRevenue = ref(0)
const totalRevenueOther = ref(0)
const totalFee = ref(0)
const totalProfit = ref(0)
const onSearch = ref(false)
const click = ref(false)
const loading = ref(false)
const firstSearch = ref(true)

const excel_bill_fields = ref({
  'Ngày': 'time',
  'Doanh thu bán hàng': 'revenue',
  'Doanh thu khác': 'revenueOther',
  'Chi phí': 'fee',
  'Lợi nhuận': 'profit'
})

const errorFromDate = computed(() => {
  return checkDate(inputs.value.fromDate)
})

const errorToDate = computed(() => {
  return checkDate(inputs.value.toDate)
})

const errorFromMonth = computed(() => {
  return checkMonth(inputs.value.fromMonth)
})

const errorToMonth = computed(() => {
  return checkMonth(inputs.value.toMonth)
})

onMounted(() => {
  // Get default date
  let dateNow = new Date()
  inputs.value.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
  let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
  inputs.value.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
})

const checkDate = (dateInput) => {
  return (click.value && inputs.value.dataBy != 'Month' && (dateInput == '' || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
}

const checkMonth = (monthInput) => {
  return (click.value && inputs.value.dataBy == 'Month' && (monthInput == '' || monthInput == null || commonFunc.dateFormatCheck('01-' + monthInput) == false))
}

const checkValidate = () => {
  return !(errorFromDate.value || errorToDate.value)
}

/**
 * Event change data by
 */
const changeDataBy = () => {
  let dateNow = new Date()

  if (inputs.value.dataBy == 'Day') {
    // Get default date
    inputs.value.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
    inputs.value.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
  }

  if (inputs.value.dataBy == 'Week') {
    // Get default week
    inputs.value.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
    let fromDate = new Date(dateNow.setMonth(dateNow.getMonth() - 2))
    inputs.value.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
  }

  if (inputs.value.dataBy == 'Month') {
    // Get default month
    inputs.value.toMonth = commonFunc.formatDate(dateNow.toJSON().slice(0, 10)).substring(3, 10)
    dateNow.setMonth(dateNow.getMonth() - 11)
    inputs.value.fromMonth = commonFunc.formatDate(dateNow.toJSON().slice(0, 10)).substring(3, 10)
  }
}

/**
 * Check valid from date and to date
 */
const checkFromDateAndToDate = () => {
  if (inputs.value.dataBy == 'Day' || inputs.value.dataBy == 'Week') {
    let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
    let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate))

    if (fromDate > toDate) {
      showToast('Từ ngày không thể lớn hớn đến ngày', 'error')
      return false
    }

    if (inputs.value.dataBy == 'Day') {
      fromDate.setMonth(fromDate.getMonth() + 1)

      if (fromDate < toDate) {
        showToast('Thời gian không được quá 1 tháng', 'error')
        return false
      }
    }

    if (inputs.value.dataBy == 'Week') {
      fromDate.setMonth(fromDate.getMonth() + 6)

      if (fromDate < toDate) {
        showToast('Thời gian không được quá 6 tháng', 'error')
        return false
      }
    }
  }

  if (inputs.value.dataBy == 'Month') {
    let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD('01-' + inputs.value.fromMonth))
    let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD('01-' + inputs.value.toMonth))

    if (fromDate > toDate) {
      showToast('Từ tháng không thể lớn hớn đến tháng', 'error')
      return false
    }

    fromDate.setMonth(fromDate.getMonth() + 12)

    if (fromDate < toDate) {
      showToast('Thời gian không được quá 12 tháng', 'error')
      return false
    }
  }

  return true
}

/**
 * Get monday
 */
const getMonday = (d) => {
  d = new Date(d)
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1) // adjust when day is sunday
  return new Date(d.setDate(diff))
}

/**
 * Get number of days in month
 */
const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate()
}

/**
 * Get days by month input
 */
const getDayByMonthInput = (monthInput) => {
  if (monthInput) {
    let toMonths = monthInput.split('-')
    let daysOfMonth = getDaysInMonth(toMonths[0], toMonths[1])
    return daysOfMonth
  }
}

/**
 * Get list date from date input
 */
const getListDateFromDateInput = () => {
  let result = []

  if (inputs.value.dataBy == 'Day') {
    let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
    fromDate = new Date(fromDate.getTime() - (fromDate.getTimezoneOffset() * 60000))
    let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate) + ' 23:00:00')
    toDate = new Date(toDate.getTime() - (toDate.getTimezoneOffset() * 60000))
    while (fromDate <= toDate) {
      let dateTemp = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
      result.push(dateTemp)
      fromDate = new Date(fromDate.setDate(fromDate.getDate() + 1))
    }
  }

  if (inputs.value.dataBy == 'Week') {
    let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
    fromDate = new Date(fromDate.getTime() - (fromDate.getTimezoneOffset() * 60000))
    let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate) + ' 23:00:00')
    toDate = new Date(toDate.getTime() - (toDate.getTimezoneOffset() * 60000))
    let fromDateTemp = getMonday(fromDate)
    while (fromDateTemp <= toDate) {
      let dateTemp = commonFunc.formatDate(fromDateTemp.toJSON().slice(0, 10))
      result.push(dateTemp)
      fromDateTemp = new Date(fromDateTemp.setDate(fromDateTemp.getDate() + 7))
    }
  }

  if (inputs.value.dataBy == 'Month') {
    let daysOfMonth = getDayByMonthInput(inputs.value.toMonth)
    let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD('01-' + inputs.value.fromMonth))
    let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(daysOfMonth + '-' + inputs.value.toMonth))
    while (fromDate <= toDate) {
      let dateTemp = commonFunc.formatDate(fromDate.toJSON().slice(0, 10)).substring(3, 10)
      result.push(dateTemp)
      fromDate = new Date(fromDate.setMonth(fromDate.getMonth() + 1))
    }
  }

  return result
}

/**
 * Search
 */
const search = () => {
  if (loading.value) {
    return
  }
  click.value = true

  // Check validate
  if (!checkValidate()) {
    datas.value = []
    return
  }
  if (!checkFromDateAndToDate()) {
    datas.value = []
    return
  }

  loading.value = true
  onSearch.value = true

  let listDay = getListDateFromDateInput()
  let params = {
    fromDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate),
    toDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate),
    dataBy: inputs.value.dataBy,
    fromMonth: commonFunc.convertDDMMYYYYToYYYYMMDD('01-' + inputs.value.fromMonth),
    toMonth: commonFunc.convertDDMMYYYYToYYYYMMDD(getDayByMonthInput(inputs.value.toMonth) + '-' + inputs.value.toMonth),
    listDay: listDay
  }

  // Search
  adminAPI.getProfitReport(params).then(res => {
    if (res && res.data && res.data.data) {
      datas.value = res.data.data.data
      totalRevenue.value = res.data.data.total_revenue
      totalRevenueOther.value = res.data.data.total_revenue_other
      totalFee.value = res.data.data.total_fee
      totalProfit.value = res.data.data.total_profit
    }

    firstSearch.value = false
    onSearch.value = false
    loading.value = false
  }).catch(err => {
    console.log(err)
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
