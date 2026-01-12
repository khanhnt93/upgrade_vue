<template>
  <div class="container-fluid mx-auto px-4 py-6">
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h4 class="text-center text-xl font-bold text-blue-600 mb-6">Báo cáo lợi nhuận</h4>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-2">Cửa hàng</label>
          <select v-model="inputs.store_id" :disabled="onSearch" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option v-for="option in optionsStore" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Xem theo</label>
          <select v-model="inputs.dataBy" @change="changeDataBy" :disabled="onSearch" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option v-for="option in dataByOption" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
        </div>

        <div v-show="inputs.dataBy != 'Month'">
          <label class="block text-sm font-medium mb-2">Từ ngày</label>
          <input
            type="text"
            v-model="inputs.fromDate"
            maxlength="10"
            @keyup="inputDateOnly($event.target)"
            :disabled="onSearch"
            placeholder="DD-MM-YYYY"
            class="w-full px-3 py-2 border rounded-md"
            :class="errorFromDate ? 'border-red-500' : 'border-gray-300'"
          />
          <p v-if="errorFromDate" class="text-red-500 text-sm mt-1">Mục từ ngày không đúng</p>
        </div>

        <div v-show="inputs.dataBy != 'Month'">
          <label class="block text-sm font-medium mb-2">Đến ngày</label>
          <input
            type="text"
            v-model="inputs.toDate"
            maxlength="10"
            @keyup="inputDateOnly($event.target)"
            :disabled="onSearch"
            placeholder="DD-MM-YYYY"
            class="w-full px-3 py-2 border rounded-md"
            :class="errorToDate ? 'border-red-500' : 'border-gray-300'"
          />
          <p v-if="errorToDate" class="text-red-500 text-sm mt-1">Mục đến ngày không đúng</p>
        </div>

        <div v-show="inputs.dataBy == 'Month'">
          <label class="block text-sm font-medium mb-2">Từ tháng</label>
          <input
            type="text"
            v-model="inputs.fromMonth"
            maxlength="10"
            @keyup="inputDateOnly($event.target)"
            :disabled="onSearch"
            placeholder="MM-YYYY"
            class="w-full px-3 py-2 border rounded-md"
            :class="errorFromMonth ? 'border-red-500' : 'border-gray-300'"
          />
          <p v-if="errorFromMonth" class="text-red-500 text-sm mt-1">Mục từ tháng không đúng</p>
        </div>

        <div v-show="inputs.dataBy == 'Month'">
          <label class="block text-sm font-medium mb-2">Đến tháng</label>
          <input
            type="text"
            v-model="inputs.toMonth"
            maxlength="10"
            @keyup="inputDateOnly($event.target)"
            :disabled="onSearch"
            placeholder="MM-YYYY"
            class="w-full px-3 py-2 border rounded-md"
            :class="errorToMonth ? 'border-red-500' : 'border-gray-300'"
          />
          <p v-if="errorToMonth" class="text-red-500 text-sm mt-1">Mục đến tháng không đúng</p>
        </div>
      </div>

      <div class="flex justify-end mb-4">
        <button @click.prevent="search" :disabled="onSearch" class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 min-w-[120px]">
          Xem
        </button>
      </div>

      <div v-show="loading" class="text-center py-4">
        <i class="fas fa-spinner fa-spin fa-3x text-blue-600"></i>
      </div>

      <div v-show="click && datas && datas.length > 0" class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-300 px-4 py-2">STT</th>
              <th class="border border-gray-300 px-4 py-2">Ngày</th>
              <th class="border border-gray-300 px-4 py-2">Doanh thu bán hàng</th>
              <th class="border border-gray-300 px-4 py-2">Doanh thu khác</th>
              <th class="border border-gray-300 px-4 py-2">Chi phí</th>
              <th class="border border-gray-300 px-4 py-2">Lợi nhuận</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in datas" :key="index">
              <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ data.time }}</td>
              <td class="border border-gray-300 px-4 py-2 text-right">{{ formatCurrency(data.revenue) }}</td>
              <td class="border border-gray-300 px-4 py-2 text-right">{{ formatCurrency(data.revenueOther) }}</td>
              <td class="border border-gray-300 px-4 py-2 text-right">{{ formatCurrency(data.fee) }}</td>
              <td class="border border-gray-300 px-4 py-2 text-right">{{ formatCurrency(data.profit) }}</td>
            </tr>
            <tr class="bg-orange-100 font-bold">
              <td colspan="2" class="border border-gray-300 px-4 py-2 text-center text-orange-600">Tổng</td>
              <td class="border border-gray-300 px-4 py-2 text-right text-orange-600">{{ formatCurrency(totalRevenue) }}</td>
              <td class="border border-gray-300 px-4 py-2 text-right text-orange-600">{{ formatCurrency(totalRevenueOther) }}</td>
              <td class="border border-gray-300 px-4 py-2 text-right text-orange-600">{{ formatCurrency(totalFee) }}</td>
              <td class="border border-gray-300 px-4 py-2 text-right text-orange-600">{{ formatCurrency(totalProfit) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-show="click && firstSearch == false && (!datas || datas.length == 0)" class="text-center py-4">Không có dữ liệu để hiển thị</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'

const { popToast } = useToast()
const { formatCurrency } = useFormatters()

const inputs = ref({
  store_id: null,
  fromDate: null,
  toDate: null,
  fromMonth: null,
  toMonth: null,
  dataBy: "Day"
})

const dataByOption = ref([
  { value: 'Day', text: '' },
  { value: 'Day', text: 'Ngày' },
  { value: 'Week', text: 'Tuần' },
  { value: 'Month', text: 'Tháng' }
])

const datas = ref(null)
const totalRevenue = ref(0)
const totalRevenueOther = ref(0)
const totalFee = ref(0)
const totalProfit = ref(0)
const onSearch = ref(false)
const click = ref(false)
const loading = ref(false)
const firstSearch = ref(true)
const optionsStore = ref([])

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
  return (click.value && inputs.value.dataBy != "Month" && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
}

const checkMonth = (monthInput) => {
  return (click.value && inputs.value.dataBy == "Month" && (monthInput == "" || monthInput == null || commonFunc.dateFormatCheck("01-" + monthInput) == false))
}

const checkValidate = () => {
  return !(errorFromDate.value || errorToDate.value)
}

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

const changeDataBy = () => {
  let dateNow = new Date()

  if (inputs.value.dataBy == "Day") {
    inputs.value.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
    inputs.value.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
  }

  if (inputs.value.dataBy == "Week") {
    inputs.value.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
    let fromDate = new Date(dateNow.setMonth(dateNow.getMonth() - 2))
    inputs.value.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
  }

  if (inputs.value.dataBy == "Month") {
    inputs.value.toMonth = commonFunc.formatDate(dateNow.toJSON().slice(0, 10)).substring(3, 10)
    dateNow.setMonth(dateNow.getMonth() - 11)
    inputs.value.fromMonth = commonFunc.formatDate(dateNow.toJSON().slice(0, 10)).substring(3, 10)
  }
}

const checkFromDateAndToDate = () => {
  if (inputs.value.dataBy == "Day" || inputs.value.dataBy == "Week") {
    let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
    let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate))

    if (fromDate > toDate) {
      popToast('danger', "Từ ngày không thể lớn hơn đến ngày")
      return false
    }

    if (inputs.value.dataBy == "Day") {
      fromDate.setMonth(fromDate.getMonth() + 1)
      if (fromDate < toDate) {
        popToast('danger', "Thời gian không được quá 1 tháng")
        return false
      }
    }

    if (inputs.value.dataBy == "Week") {
      fromDate.setMonth(fromDate.getMonth() + 6)
      if (fromDate < toDate) {
        popToast('danger', "Thời gian không được quá 6 tháng")
        return false
      }
    }
  }

  if (inputs.value.dataBy == "Month") {
    let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + inputs.value.fromMonth))
    let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + inputs.value.toMonth))

    if (fromDate > toDate) {
      popToast('danger', "Từ tháng không thể lớn hơn đến tháng")
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

  if (inputs.value.dataBy == "Day") {
    let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
    let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate))
    while (fromDate <= toDate) {
      let dateTemp = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
      result.push(dateTemp)
      fromDate = new Date(fromDate.setDate(fromDate.getDate() + 1))
    }
  }

  if (inputs.value.dataBy == "Week") {
    let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
    let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate))
    let fromDateTemp = getMonday(fromDate)
    while (fromDateTemp <= toDate) {
      let dateTemp = commonFunc.formatDate(fromDateTemp.toJSON().slice(0, 10)).substring(0, 5)
      result.push(dateTemp)
      fromDateTemp = new Date(fromDateTemp.setDate(fromDateTemp.getDate() + 7))
    }
  }

  if (inputs.value.dataBy == "Month") {
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

const search = () => {
  if (loading.value) { return }
  click.value = true

  if (!checkValidate()) {
    datas.value = []
    return
  }

  if (!inputs.value.store_id) {
    popToast('danger', "Vui lòng chọn cửa hàng")
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
    "store_id": inputs.value.store_id,
    "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate),
    "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate),
    "dataBy": inputs.value.dataBy,
    "fromMonth": commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + inputs.value.fromMonth),
    "toMonth": commonFunc.convertDDMMYYYYToYYYYMMDD(getDayByMonthInput(inputs.value.toMonth) + "-" + inputs.value.toMonth),
    "listDay": listDay
  }

  adminAPI.getBrandProfitReport(params).then(res => {
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
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)

    firstSearch.value = false
    onSearch.value = false
    loading.value = false
  })
}

const inputDateOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.inputDateOnly(valueInput)
  item.value = result
}

onMounted(() => {
  getOptionStore()

  let dateNow = new Date()
  inputs.value.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
  let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
  inputs.value.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
})
</script>
