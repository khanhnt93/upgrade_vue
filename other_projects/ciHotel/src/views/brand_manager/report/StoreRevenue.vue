<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <div class="bg-white shadow-sm rounded p-4">
          <h4 class="text-center mb-4 font-weight-bold">BIỂU ĐỒ DOANH THU</h4>

          <div class="row mb-3">
            <div class="col-md-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Cửa hàng</label>
              <select
                v-model="inputs.store_id"
                :disabled="onSearch"
                class="form-control">
                <option
                  v-for="option in optionsStore"
                  :key="option.value"
                  :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="col-md-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Xem theo</label>
              <select
                v-model="inputs.chartBy"
                @change="changeChartBy"
                :disabled="onSearch"
                class="form-control">
                <option
                  v-for="option in chartByOption"
                  :key="option.value"
                  :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="col-md-3" v-show="inputs.chartBy != 'Month'">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="inputs.fromDate"
                maxlength="10"
                @keyup="inputDateOnly($event.target)"
                :disabled="onSearch"
                :class="['form-control', {'border-red-500': errorFromDate}]" />
              <div v-if="errorFromDate" class="text-red-500 text-sm mt-1">
                Mục từ ngày không đúng
              </div>
            </div>

            <div class="col-md-3" v-show="inputs.chartBy != 'Month'">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="inputs.toDate"
                maxlength="10"
                @keyup="inputDateOnly($event.target)"
                :disabled="onSearch"
                :class="['form-control', {'border-red-500': errorToDate}]" />
              <div v-if="errorToDate" class="text-red-500 text-sm mt-1">
                Mục đến ngày không đúng
              </div>
            </div>

            <div class="col-md-3" v-show="inputs.chartBy == 'Month'">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Từ tháng <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="inputs.fromMonth"
                maxlength="10"
                @keyup="inputDateOnly($event.target)"
                :disabled="onSearch"
                :class="['form-control', {'border-red-500': errorFromMonth}]" />
              <div v-if="errorFromMonth" class="text-red-500 text-sm mt-1">
                Mục từ tháng không đúng
              </div>
            </div>

            <div class="col-md-3" v-show="inputs.chartBy == 'Month'">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Đến tháng <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="inputs.toMonth"
                maxlength="10"
                @keyup="inputDateOnly($event.target)"
                :disabled="onSearch"
                :class="['form-control', {'border-red-500': errorToMonth}]" />
              <div v-if="errorToMonth" class="text-red-500 text-sm mt-1">
                Mục đến tháng không đúng
              </div>
            </div>
          </div>

          <div class="row mt-3 mb-3">
            <div class="col-md-12 text-right">
              <button
                @click.prevent="search"
                :disabled="onSearch"
                class="btn btn-primary px-4"
                style="min-width: 120px;">
                Xem
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-show="loading" class="text-center py-4">
            <icon name="loading" width="60" />
          </div>

          <GChart
            type="ColumnChart"
            :data="chartData"
            :options="chartOptions"
            v-show="click && chartData && chartData.length > 0" />

          <p v-show="click && firstSearch == false && (!chartData || chartData.length == 0)" class="text-center py-4">
            Không có dữ liệu để hiển thị
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { GChart } from 'vue-google-charts'

export default {
  name: 'StoreRevenue',
  components: {
    GChart
  },
  setup() {
    const { showToast } = useToast()

    const inputs = reactive({
      store_id: null,
      fromDate: null,
      toDate: null,
      fromMonth: null,
      toMonth: null,
      chartBy: 'Day'
    })

    const chartByOption = ref([
      { value: 'Day', text: '' },
      { value: 'Day', text: 'Ngày' },
      { value: 'Week', text: 'Tuần' },
      { value: 'Month', text: 'Tháng' }
    ])

    const optionsStore = ref([])
    const chartData = ref([])
    const chartOptions = ref({
      chart: {
        title: 'Biểu đồ doanh thu và lợi nhuận',
        subtitle: 'Biểu đồ doanh thu và lợi nhuận'
      }
    })
    const onSearch = ref(false)
    const click = ref(false)
    const loading = ref(false)
    const firstSearch = ref(true)

    const errorFromDate = computed(() => {
      return click.value && inputs.chartBy != "Month" &&
        (inputs.fromDate == "" || inputs.fromDate == null || commonFunc.dateFormatCheck(inputs.fromDate) == false)
    })

    const errorToDate = computed(() => {
      return click.value && inputs.chartBy != "Month" &&
        (inputs.toDate == "" || inputs.toDate == null || commonFunc.dateFormatCheck(inputs.toDate) == false)
    })

    const errorFromMonth = computed(() => {
      return click.value && inputs.chartBy == "Month" &&
        (inputs.fromMonth == "" || inputs.fromMonth == null || commonFunc.dateFormatCheck("01-" + inputs.fromMonth) == false)
    })

    const errorToMonth = computed(() => {
      return click.value && inputs.chartBy == "Month" &&
        (inputs.toMonth == "" || inputs.toMonth == null || commonFunc.dateFormatCheck("01-" + inputs.toMonth) == false)
    })

    const checkValidate = () => {
      return !(errorFromDate.value || errorToDate.value)
    }

    const getOptionStore = async () => {
      try {
        const res = await adminAPI.getStoreOption()
        if (res && res.data && res.data.data) {
          optionsStore.value = res.data.data
        }
      } catch (err) {
        const errorMess = commonFunc.handleStaffError(err)
        showToast('danger', errorMess)
      }
    }

    const changeChartBy = () => {
      let dateNow = new Date()

      if (inputs.chartBy == "Day") {
        inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
        let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
        inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
      }

      if (inputs.chartBy == "Week") {
        inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
        let fromDate = new Date(dateNow.setMonth(dateNow.getMonth() - 2))
        inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
      }

      if (inputs.chartBy == "Month") {
        inputs.toMonth = commonFunc.formatDate(dateNow.toJSON().slice(0, 10)).substring(3, 10)
        dateNow.setMonth(dateNow.getMonth() - 11)
        inputs.fromMonth = commonFunc.formatDate(dateNow.toJSON().slice(0, 10)).substring(3, 10)
      }
    }

    const checkFromDateAndToDate = () => {
      if (inputs.chartBy == "Day" || inputs.chartBy == "Week") {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.fromDate))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.toDate))

        if (fromDate > toDate) {
          showToast('danger', "Từ ngày không thể lớn hớn đến ngày")
          return false
        }

        if (inputs.chartBy == "Day") {
          fromDate.setMonth(fromDate.getMonth() + 1)
          if (fromDate < toDate) {
            showToast('danger', "Thời gian không được quá 1 tháng")
            return false
          }
        }

        if (inputs.chartBy == "Week") {
          fromDate.setMonth(fromDate.getMonth() + 6)
          if (fromDate < toDate) {
            showToast('danger', "Thời gian không được quá 6 tháng")
            return false
          }
        }
      }

      if (inputs.chartBy == "Month") {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + inputs.fromMonth))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + inputs.toMonth))

        if (fromDate > toDate) {
          showToast('danger', "Từ tháng không thể lớn hớn đến tháng")
          return false
        }

        fromDate.setMonth(fromDate.getMonth() + 12)
        if (fromDate < toDate) {
          showToast('danger', "Thời gian không được quá 12 tháng")
          return false
        }
      }

      return true
    }

    const getMonday = (d) => {
      d = new Date(d)
      var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1)
      return new Date(d.setDate(diff))
    }

    const getDaysInMonth = (month, year) => {
      return new Date(year, month, 0).getDate()
    }

    const getDayByMonthInput = (monthInput) => {
      if (monthInput) {
        let toMonths = monthInput.split("-")
        let daysOfMonth = getDaysInMonth(toMonths[0], toMonths[1])
        return daysOfMonth
      }
    }

    const getListDateFromDateInput = () => {
      let result = []

      if (inputs.chartBy == "Day") {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.fromDate))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.toDate))
        while (fromDate <= toDate) {
          let dateTemp = commonFunc.formatDate(fromDate.toJSON().slice(0, 10)).substring(0, 5)
          result.push(dateTemp)
          fromDate = new Date(fromDate.setDate(fromDate.getDate() + 1))
        }
      }

      if (inputs.chartBy == "Week") {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.fromDate))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.toDate))
        let fromDateTemp = getMonday(fromDate)
        while (fromDateTemp <= toDate) {
          let dateTemp = commonFunc.formatDate(fromDateTemp.toJSON().slice(0, 10)).substring(0, 5)
          result.push(dateTemp)
          fromDateTemp = new Date(fromDateTemp.setDate(fromDateTemp.getDate() + 7))
        }
      }

      if (inputs.chartBy == "Month") {
        let daysOfMonth = getDayByMonthInput(inputs.toMonth)
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + inputs.fromMonth))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(daysOfMonth + "-" + inputs.toMonth))
        while (fromDate <= toDate) {
          let dateTemp = commonFunc.formatDate(fromDate.toJSON().slice(0, 10)).substring(3, 10)
          result.push(dateTemp)
          fromDate = new Date(fromDate.setMonth(fromDate.getMonth() + 1))
        }
      }

      return result
    }

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

    const search = async () => {
      if (loading.value) { return }
      click.value = true

      if (!checkValidate()) {
        chartData.value = []
        return
      }

      if (!inputs.store_id) {
        showToast('danger', "Vui lòng chọn cửa hàng")
        return
      }

      if (!checkFromDateAndToDate()) {
        chartData.value = []
        return
      }

      loading.value = true
      onSearch.value = true

      let params = {
        "store_id": inputs.store_id,
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.toDate),
        "chartBy": inputs.chartBy,
        "fromMonth": commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + inputs.fromMonth),
        "toMonth": commonFunc.convertDDMMYYYYToYYYYMMDD(getDayByMonthInput(inputs.toMonth) + "-" + inputs.toMonth)
      }

      try {
        const res = await adminAPI.getBrandRevenue(params)
        if (res && res.data && res.data.data) {
          convertDbDataToChartData(res.data.data)
        }
        firstSearch.value = false
        onSearch.value = false
        loading.value = false
      } catch (err) {
        const errorMess = commonFunc.handleStaffError(err)
        showToast('danger', errorMess)
        firstSearch.value = false
        onSearch.value = false
        loading.value = false
      }
    }

    const inputDateOnly = (item) => {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    }

    onMounted(() => {
      getOptionStore()

      let dateNow = new Date()
      inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
      let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
      inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
    })

    return {
      inputs,
      chartByOption,
      optionsStore,
      chartData,
      chartOptions,
      onSearch,
      click,
      loading,
      firstSearch,
      errorFromDate,
      errorToDate,
      errorFromMonth,
      errorToMonth,
      changeChartBy,
      search,
      inputDateOnly
    }
  }
}
</script>
