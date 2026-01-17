<template>
  <div class="container mx-auto px-4">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="bg-white rounded-lg shadow">
          <div class="p-4">
            <h4 class="text-center text-header font-bold">BIỂU ĐỒ DOANH THU</h4>
            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/4 px-2">
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

              <div class="w-full md:w-1/4 px-2">
                <label class="block mb-2"> Xem theo </label>
                <select
                  id="chartBy"
                  autocomplete="new-password"
                  class="form-control w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="inputs.chartBy"
                  @change="changeChartBy"
                  :disabled="onSearch">
                  <option v-for="option in chartByOption" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>

              <div class="w-full md:w-1/4 px-2" v-show="inputs.chartBy != 'Month'">
                <label class="block mb-2"> Từ ngày </label><span class="error-sybol"></span>
                <input
                  id="fromDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-500': errorFromDate }"
                  v-model="inputs.fromDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)"
                  :disabled="onSearch">
                <div v-if="errorFromDate" class="text-red-500 text-sm mt-1">
                  Mục từ ngày không đúng
                </div>
              </div>

              <div class="w-full md:w-1/4 px-2" v-show="inputs.chartBy != 'Month'">
                <label class="block mb-2"> Đến ngày </label><span class="error-sybol"></span>
                <input
                  id="toDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-500': errorToDate }"
                  v-model="inputs.toDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)"
                  :disabled="onSearch">
                <div v-if="errorToDate" class="text-red-500 text-sm mt-1">
                  Mục đến ngày không đúng
                </div>
              </div>

              <div class="w-full md:w-1/4 px-2" v-show="inputs.chartBy == 'Month'">
                <label class="block mb-2"> Từ tháng </label><span class="error-sybol"></span>
                <input
                  id="fromMonth"
                  type="text"
                  autocomplete="new-password"
                  class="form-control w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-500': errorFromMonth }"
                  v-model="inputs.fromMonth"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)"
                  :disabled="onSearch">
                <div v-if="errorFromMonth" class="text-red-500 text-sm mt-1">
                  Mục từ tháng không đúng
                </div>
              </div>

              <div class="w-full md:w-1/4 px-2" v-show="inputs.chartBy == 'Month'">
                <label class="block mb-2"> Đến tháng </label><span class="error-sybol"></span>
                <input
                  id="toMonth"
                  type="text"
                  autocomplete="new-password"
                  class="form-control w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-500': errorToMonth }"
                  v-model="inputs.toMonth"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)"
                  :disabled="onSearch">
                <div v-if="errorToMonth" class="text-red-500 text-sm mt-1">
                  Mục đến tháng không đúng
                </div>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 mt-4 mb-2">
              <div class="w-full px-2">
                <button
                  class="float-right px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded btn-width-120 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="onSearch"
                  @click.prevent="search">
                  Xem
                </button>
              </div>
            </div>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <GChart
              type="ColumnChart"
              :data="chartData"
              :options="chartOptions"
              v-show="click && chartData.length > 0"
            />
            <p v-show="click && firstSearch == false && chartData.length == 0" class="text-center">
              Không có dữ liệu để hiển thị
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { GChart } from 'vue-google-charts'
import { useToast } from '@/composables/useToast'

const { popToast } = useToast()

const inputs = ref({
  store_id: null,
  fromDate: null,
  toDate: null,
  fromMonth: null,
  toMonth: null,
  chartBy: 'Day'
})

const optionsStore = ref([])
const onSearch = ref(false)
const click = ref(false)
const loading = ref(false)
const firstSearch = ref(true)

const chartByOption = ref([
  { value: 'Day', text: '' },
  { value: 'Day', text: 'Ngày' },
  { value: 'Week', text: 'Tuần' },
  { value: 'Month', text: 'Tháng' }
])

const chartData = ref([])
const chartOptions = ref({
  chart: {
    title: 'Biểu đồ doanh thu và lợi nhuận',
    subtitle: 'Biểu đồ doanh thu và lợi nhuận'
  }
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

const checkDate = (dateInput) => {
  return (click.value && inputs.value.chartBy != "Month" && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
}

const checkMonth = (monthInput) => {
  return (click.value && inputs.value.chartBy == "Month" && (monthInput == "" || monthInput == null || commonFunc.dateFormatCheck("01-" + monthInput) == false))
}

const checkValidate = () => {
  return !(errorFromDate.value || errorToDate.value)
}

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
 * Event change chart by
 */
const changeChartBy = () => {
  let dateNow = new Date()

  if (inputs.value.chartBy == "Day") {
    inputs.value.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
    inputs.value.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
  }

  if (inputs.value.chartBy == "Week") {
    inputs.value.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
    let fromDate = new Date(dateNow.setMonth(dateNow.getMonth() - 2))
    inputs.value.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
  }

  if (inputs.value.chartBy == "Month") {
    inputs.value.toMonth = commonFunc.formatDate(dateNow.toJSON().slice(0, 10)).substring(3, 10)
    dateNow.setMonth(dateNow.getMonth() - 11)
    inputs.value.fromMonth = commonFunc.formatDate(dateNow.toJSON().slice(0, 10)).substring(3, 10)
  }
}

/**
 * Check valid from date and to date
 */
const checkFromDateAndToDate = () => {
  if (inputs.value.chartBy == "Day" || inputs.value.chartBy == "Week") {
    let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
    let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate))

    if (fromDate > toDate) {
      popToast('danger', "Từ ngày không thể lớn hớn đến ngày")
      return false
    }

    if (inputs.value.chartBy == "Day") {
      fromDate.setMonth(fromDate.getMonth() + 1)

      if (fromDate < toDate) {
        popToast('danger', "Thời gian không được quá 1 tháng")
        return false
      }
    }

    if (inputs.value.chartBy == "Week") {
      fromDate.setMonth(fromDate.getMonth() + 6)

      if (fromDate < toDate) {
        popToast('danger', "Thời gian không được quá 6 tháng")
        return false
      }
    }
  }

  if (inputs.value.chartBy == "Month") {
    let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + inputs.value.fromMonth))
    let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + inputs.value.toMonth))

    if (fromDate > toDate) {
      popToast('danger', "Từ tháng không thể lớn hớn đến tháng")
      return false
    }

    fromDate.setMonth(fromDate.getMonth() + 12)

    if (fromDate < toDate) {
      popToast('danger', "Thời gian không được quá 12 tháng")
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
    diff = d.getDate() - day + (day == 0 ? -6 : 1)
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
    let toMonths = monthInput.split("-")
    let daysOfMonth = getDaysInMonth(toMonths[0], toMonths[1])
    return daysOfMonth
  }
}

/**
 * Get list date from date input
 */
const getListDateFromDateInput = () => {
  let result = []

  if (inputs.value.chartBy == "Day") {
    let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
    let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate))
    while (fromDate <= toDate) {
      let dateTemp = commonFunc.formatDate(fromDate.toJSON().slice(0, 10)).substring(0, 5)
      result.push(dateTemp)
      fromDate = new Date(fromDate.setDate(fromDate.getDate() + 1))
    }
  }

  if (inputs.value.chartBy == "Week") {
    let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
    let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate))
    let fromDateTemp = getMonday(fromDate)
    while (fromDateTemp <= toDate) {
      let dateTemp = commonFunc.formatDate(fromDateTemp.toJSON().slice(0, 10)).substring(0, 5)
      result.push(dateTemp)
      fromDateTemp = new Date(fromDateTemp.setDate(fromDateTemp.getDate() + 7))
    }
  }

  if (inputs.value.chartBy == "Month") {
    let daysOfMonth = getDayByMonthInput(inputs.value.toMonth)
    let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + inputs.value.fromMonth))
    let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(daysOfMonth + "-" + inputs.value.toMonth))
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
    ["Time", "Doanh thu"]
  ]
  let listDay = getListDateFromDateInput()
  for (let i in listDay) {
    let item = [listDay[i], 0]
    for (let j in datas) {
      if (listDay[i] == datas[j].time) {
        item[1] = datas[j].profit
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
  if (loading.value) { return }
  click.value = true

  // Check validate
  if (!checkValidate()) {
    chartData.value = []
    return
  }

  // Check store id
  if (!inputs.value.store_id) {
    popToast('danger', "Vui lòng chọn cửa hàng")
    return
  }

  if (!checkFromDateAndToDate()) {
    chartData.value = []
    return
  }

  loading.value = true
  onSearch.value = true

  let params = {
    store_id: inputs.value.store_id,
    fromDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate),
    toDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate),
    chartBy: inputs.value.chartBy,
    fromMonth: commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + inputs.value.fromMonth),
    toMonth: commonFunc.convertDDMMYYYYToYYYYMMDD(getDayByMonthInput(inputs.value.toMonth) + "-" + inputs.value.toMonth)
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
    let errorMess = commonFunc.handleStaffError(err)
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
  let valueInput = item.value
  let result = commonFunc.inputDateOnly(valueInput)
  item.value = result
}

onMounted(() => {
  // Load store option
  getOptionStore()

  // Get default date
  let dateNow = new Date()
  inputs.value.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
  let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
  inputs.value.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
})
</script>
