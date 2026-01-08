<template>
  <div id="store-revenue">
    <div class="grid grid-cols-1 gap-4">
      <div class="bg-white rounded-lg shadow-md">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-xl font-semibold text-gray-800 text-center">Biểu Đồ Doanh Thu Chuỗi Cửa Hàng</h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <!-- Store -->
            <div class="grid grid-cols-12 gap-4 items-center">
              <label class="col-span-4 text-sm font-medium text-gray-700">Cửa hàng</label>
              <select
                :disabled="onSearch"
                class="col-span-8 md:col-span-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="inputs.storeId">
                <option v-for="option in storeOptions" :key="option.value" :value="option.value">{{ option.name }}</option>
              </select>
            </div>

            <!-- Chart By -->
            <div class="grid grid-cols-12 gap-4 items-center">
              <label class="col-span-4 text-sm font-medium text-gray-700">Xem theo</label>
              <select
                @change="changeChartBy()"
                :disabled="onSearch"
                class="col-span-8 md:col-span-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="inputs.chartBy">
                <option v-for="option in chartByOption" :key="option.value" :value="option.value">{{ option.text }}</option>
              </select>
            </div>

            <!-- From Date & To Date (Day/Week) -->
            <div v-if="inputs.chartBy != 'Month'" class="grid grid-cols-12 gap-4 items-center">
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

            <div v-if="inputs.chartBy != 'Month'" class="grid grid-cols-12 gap-4 items-center">
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
            <div v-if="inputs.chartBy == 'Month'" class="grid grid-cols-12 gap-4 items-center">
              <label class="col-span-4 text-sm font-medium text-gray-700">Từ tháng</label>
              <div class="col-span-8 md:col-span-4">
                <input
                  @keyup="inputDateOnly($event.target)"
                  type="text"
                  maxlength="7"
                  :disabled="onSearch"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="inputs.fromMonth"
                  placeholder="MM/YYYY">
                <div v-if="errorFromMonth" class="text-red-600 text-xs mt-1">Mục từ tháng không đúng</div>
              </div>
            </div>

            <div v-if="inputs.chartBy == 'Month'" class="grid grid-cols-12 gap-4 items-center">
              <label class="col-span-4 text-sm font-medium text-gray-700">Đến tháng</label>
              <div class="col-span-8 md:col-span-4">
                <input
                  @keyup="inputDateOnly($event.target)"
                  type="text"
                  maxlength="7"
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

          <!-- Chart -->
          <div class="mt-6" v-if="click && chartData.length > 0">
            <GChart
              type="ColumnChart"
              :data="chartData"
              :options="chartOptions"
            />
          </div>

          <p v-if="click && !firstSearch && chartData.length == 0" class="text-center text-gray-600 mt-6">
            Không có dữ liệu để hiển thị
          </p>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { GChart } from 'vue-google-charts'

const { showToast } = useToast()

const storeOptions = ref([
  { value: '', text: 'Tất cả' }
])

const chartByOption = ref([
  { value: 'Day', text: '' },
  { value: 'Day', text: 'Ngày' },
  { value: 'Week', text: 'Tuần' },
  { value: 'Month', text: 'Tháng' }
])

const inputs = ref({
  storeId: '',
  fromDate: null,
  toDate: null,
  fromMonth: null,
  toMonth: null,
  chartBy: 'Day'
})

const chartData = ref([])
const chartOptions = ref({
  chart: {
    title: 'Biểu đồ doanh thu chuỗi cửa hàng',
    subtitle: 'Biểu đồ doanh thu',
  }
})

const onSearch = ref(false)
const click = ref(false)
const loading = ref(false)
const firstSearch = ref(true)

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
        { value: '', text: 'Tất cả' },
        ...res.data.data.map(item => ({
          value: item.id,
          text: item.name
        }))
      ]
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'error')
  })
}

const checkDate = (dateInput) => {
  return (click.value && inputs.value.chartBy != 'Month' && (dateInput == '' || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
}

const checkMonth = (monthInput) => {
  return (click.value && inputs.value.chartBy == 'Month' && (monthInput == '' || monthInput == null || commonFunc.dateFormatCheck('01-' + monthInput) == false))
}

const checkValidate = () => {
  return !(errorFromDate.value || errorToDate.value)
}

/**
 * Event change chart by
 */
const changeChartBy = () => {
  let dateNow = new Date()

  if (inputs.value.chartBy == 'Day') {
    // Get default date
    inputs.value.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
    inputs.value.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
  }

  if (inputs.value.chartBy == 'Week') {
    // Get default week
    inputs.value.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
    let fromDate = new Date(dateNow.setMonth(dateNow.getMonth() - 2))
    inputs.value.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
  }

  if (inputs.value.chartBy == 'Month') {
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
  if (inputs.value.chartBy == 'Day' || inputs.value.chartBy == 'Week') {
    let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
    let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate))

    if (fromDate > toDate) {
      showToast('Từ ngày không thể lớn hớn đến ngày', 'error')
      return false
    }

    if (inputs.value.chartBy == 'Day') {
      fromDate.setMonth(fromDate.getMonth() + 1)

      if (fromDate < toDate) {
        showToast('Thời gian không được quá 1 tháng', 'error')
        return false
      }
    }

    if (inputs.value.chartBy == 'Week') {
      fromDate.setMonth(fromDate.getMonth() + 6)

      if (fromDate < toDate) {
        showToast('Thời gian không được quá 6 tháng', 'error')
        return false
      }
    }
  }

  if (inputs.value.chartBy == 'Month') {
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

  if (inputs.value.chartBy == 'Day') {
    let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
    fromDate = new Date(fromDate.getTime() - (fromDate.getTimezoneOffset() * 60000))
    let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate) + ' 23:00:00')
    toDate = new Date(toDate.getTime() - (toDate.getTimezoneOffset() * 60000))
    while (fromDate <= toDate) {
      let dateTemp = commonFunc.formatDate(fromDate.toJSON().slice(0, 10)).substring(0, 5)
      result.push(dateTemp)
      fromDate = new Date(fromDate.setDate(fromDate.getDate() + 1))
    }
  }

  if (inputs.value.chartBy == 'Week') {
    let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
    fromDate = new Date(fromDate.getTime() - (fromDate.getTimezoneOffset() * 60000))
    let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate) + ' 23:00:00')
    toDate = new Date(toDate.getTime() - (toDate.getTimezoneOffset() * 60000))
    let fromDateTemp = getMonday(fromDate)
    while (fromDateTemp <= toDate) {
      let dateTemp = commonFunc.formatDate(fromDateTemp.toJSON().slice(0, 10)).substring(0, 5)
      result.push(dateTemp)
      fromDateTemp = new Date(fromDateTemp.setDate(fromDateTemp.getDate() + 7))
    }
  }

  if (inputs.value.chartBy == 'Month') {
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
 * Convert db data to chart data
 */
const convertDbDataToChartData = (datas) => {
  let chartDayData = [
    ['Time', 'Doanh thu']
  ]
  let listDay = getListDateFromDateInput()
  for (let i in listDay) {
    let item = [listDay[i], 0]
    for (let j in datas) {
      if (listDay[i] == datas[j].time) {
        item[1] = datas[j].revenue
        break
      }
    }
    chartDayData.push(item)
  }
  chartData.value = chartDayData
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
    chartData.value = []
    return
  }
  if (!checkFromDateAndToDate()) {
    chartData.value = []
    return
  }

  loading.value = true
  onSearch.value = true

  let listDay = getListDateFromDateInput()
  let params = {
    storeId: inputs.value.storeId,
    fromDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate),
    toDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate),
    chartBy: inputs.value.chartBy,
    fromMonth: commonFunc.convertDDMMYYYYToYYYYMMDD('01-' + inputs.value.fromMonth),
    toMonth: commonFunc.convertDDMMYYYYToYYYYMMDD(getDayByMonthInput(inputs.value.toMonth) + '-' + inputs.value.toMonth),
    listDay: listDay
  }

  // Search
  adminAPI.getBrandRevenue(params).then(res => {
    if (res && res.data && res.data.data) {
      convertDbDataToChartData(res.data.data)
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
</script>

<style lang="css" scoped>
</style>
