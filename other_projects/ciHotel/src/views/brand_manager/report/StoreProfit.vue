<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <div class="bg-white shadow-sm rounded p-4">
          <h4 class="text-center mb-4 text-orange-500">Báo cáo lợi nhuận</h4>

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
                v-model="inputs.dataBy"
                @change="changeDataBy"
                :disabled="onSearch"
                class="form-control">
                <option
                  v-for="option in dataByOption"
                  :key="option.value"
                  :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="col-md-3" v-show="inputs.dataBy != 'Month'">
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

            <div class="col-md-3" v-show="inputs.dataBy != 'Month'">
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

            <div class="col-md-3" v-show="inputs.dataBy == 'Month'">
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

            <div class="col-md-3" v-show="inputs.dataBy == 'Month'">
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

          <div v-show="click && datas && datas.length > 0" class="row mt-4">
            <div class="col">
              <table class="table table-bordered table-striped table-hover">
                <thead class="bg-blue-100">
                  <tr>
                    <th>STT</th>
                    <th>Ngày</th>
                    <th class="text-right">Doanh thu bán hàng</th>
                    <th class="text-right">Doanh thu khác</th>
                    <th class="text-right">Chi phí</th>
                    <th class="text-right">Lợi nhuận</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(data, index) in datas" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ data.time }}</td>
                    <td class="text-right">{{ formatCurrency(data.revenue) }}</td>
                    <td class="text-right">{{ formatCurrency(data.revenueOther) }}</td>
                    <td class="text-right">{{ formatCurrency(data.fee) }}</td>
                    <td class="text-right">{{ formatCurrency(data.profit) }}</td>
                  </tr>
                  <tr class="font-weight-bold" style="color: #ed592a;">
                    <td class="text-center" colspan="2">Tổng</td>
                    <td class="text-right">{{ formatCurrency(totalRevenue) }}</td>
                    <td class="text-right">{{ formatCurrency(totalRevenueOther) }}</td>
                    <td class="text-right">{{ formatCurrency(totalFee) }}</td>
                    <td class="text-right">{{ formatCurrency(totalProfit) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p v-show="click && firstSearch == false && (!datas || datas.length == 0)" class="text-center py-4">
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
import { useFormatters } from '@/composables/useFormatters'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'

export default {
  name: 'StoreProfit',
  setup() {
    const { showToast } = useToast()
    const { formatCurrency } = useFormatters()

    const inputs = reactive({
      store_id: null,
      fromDate: null,
      toDate: null,
      fromMonth: null,
      toMonth: null,
      dataBy: 'Day'
    })

    const dataByOption = ref([
      { value: 'Day', text: '' },
      { value: 'Day', text: 'Ngày' },
      { value: 'Week', text: 'Tuần' },
      { value: 'Month', text: 'Tháng' }
    ])

    const optionsStore = ref([])
    const datas = ref([])
    const totalRevenue = ref(0)
    const totalRevenueOther = ref(0)
    const totalFee = ref(0)
    const totalProfit = ref(0)
    const onSearch = ref(false)
    const click = ref(false)
    const loading = ref(false)
    const firstSearch = ref(true)

    const errorFromDate = computed(() => {
      return click.value && inputs.dataBy != "Month" &&
        (inputs.fromDate == "" || inputs.fromDate == null || commonFunc.dateFormatCheck(inputs.fromDate) == false)
    })

    const errorToDate = computed(() => {
      return click.value && inputs.dataBy != "Month" &&
        (inputs.toDate == "" || inputs.toDate == null || commonFunc.dateFormatCheck(inputs.toDate) == false)
    })

    const errorFromMonth = computed(() => {
      return click.value && inputs.dataBy == "Month" &&
        (inputs.fromMonth == "" || inputs.fromMonth == null || commonFunc.dateFormatCheck("01-" + inputs.fromMonth) == false)
    })

    const errorToMonth = computed(() => {
      return click.value && inputs.dataBy == "Month" &&
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

    const changeDataBy = () => {
      let dateNow = new Date()

      if (inputs.dataBy == "Day") {
        inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
        let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
        inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
      }

      if (inputs.dataBy == "Week") {
        inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
        let fromDate = new Date(dateNow.setMonth(dateNow.getMonth() - 2))
        inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
      }

      if (inputs.dataBy == "Month") {
        inputs.toMonth = commonFunc.formatDate(dateNow.toJSON().slice(0, 10)).substring(3, 10)
        dateNow.setMonth(dateNow.getMonth() - 11)
        inputs.fromMonth = commonFunc.formatDate(dateNow.toJSON().slice(0, 10)).substring(3, 10)
      }
    }

    const checkFromDateAndToDate = () => {
      if (inputs.dataBy == "Day" || inputs.dataBy == "Week") {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.fromDate))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.toDate))

        if (fromDate > toDate) {
          showToast('danger', "Từ ngày không thể lớn hớn đến ngày")
          return false
        }

        if (inputs.dataBy == "Day") {
          fromDate.setMonth(fromDate.getMonth() + 1)
          if (fromDate < toDate) {
            showToast('danger', "Thời gian không được quá 1 tháng")
            return false
          }
        }

        if (inputs.dataBy == "Week") {
          fromDate.setMonth(fromDate.getMonth() + 6)
          if (fromDate < toDate) {
            showToast('danger', "Thời gian không được quá 6 tháng")
            return false
          }
        }
      }

      if (inputs.dataBy == "Month") {
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

      if (inputs.dataBy == "Day") {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.fromDate))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.toDate))
        while (fromDate <= toDate) {
          let dateTemp = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
          result.push(dateTemp)
          fromDate = new Date(fromDate.setDate(fromDate.getDate() + 1))
        }
      }

      if (inputs.dataBy == "Week") {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.fromDate))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.toDate))
        let fromDateTemp = getMonday(fromDate)
        while (fromDateTemp <= toDate) {
          let dateTemp = commonFunc.formatDate(fromDateTemp.toJSON().slice(0, 10)).substring(0, 5)
          result.push(dateTemp)
          fromDateTemp = new Date(fromDateTemp.setDate(fromDateTemp.getDate() + 7))
        }
      }

      if (inputs.dataBy == "Month") {
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

    const search = async () => {
      if (loading.value) { return }
      click.value = true

      if (!checkValidate()) {
        return
      }

      if (!inputs.store_id) {
        showToast('danger', "Vui lòng chọn cửa hàng")
        return
      }

      if (!checkFromDateAndToDate()) {
        return
      }

      loading.value = true
      onSearch.value = true

      let listDay = getListDateFromDateInput()
      let params = {
        "store_id": inputs.store_id,
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.toDate),
        "dataBy": inputs.dataBy,
        "fromMonth": commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + inputs.fromMonth),
        "toMonth": commonFunc.convertDDMMYYYYToYYYYMMDD(getDayByMonthInput(inputs.toMonth) + "-" + inputs.toMonth),
        "listDay": listDay
      }

      try {
        const res = await adminAPI.getBrandProfitReport(params)
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
      } catch (err) {
        console.log(err)
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
      dataByOption,
      optionsStore,
      datas,
      totalRevenue,
      totalRevenueOther,
      totalFee,
      totalProfit,
      onSearch,
      click,
      loading,
      firstSearch,
      errorFromDate,
      errorToDate,
      errorFromMonth,
      errorToMonth,
      changeDataBy,
      search,
      inputDateOnly,
      formatCurrency
    }
  }
}
</script>

<style scoped>
table {
  margin: auto;
  border-collapse: collapse;
  overflow-x: auto;
  display: block;
  width: fit-content;
  max-width: 100%;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, .1);
}

td, th {
  border: solid rgb(200, 200, 200) 1px;
  padding: .5rem;
}

th {
  text-align: left;
  background-color: rgb(190, 220, 250);
  text-transform: uppercase;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: rgb(50, 50, 100) solid 2px;
  border-top: none;
}

td {
  white-space: nowrap;
  border-bottom: none;
  color: rgb(20, 20, 20);
}

td:first-of-type, th:first-of-type {
  border-left: none;
}

td:last-of-type, th:last-of-type {
  border-right: none;
}
</style>
