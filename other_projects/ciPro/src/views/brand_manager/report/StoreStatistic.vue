<template>
  <div class="container mx-auto px-4">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="bg-white rounded-lg shadow">
          <div class="p-4">
            <h4 class="text-center">Thống Kê</h4>
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
                <label class="block mb-2"> Từ ngày </label><span class="error-sybol"></span>
                <input
                  id="fromDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-500': errorFromDate }"
                  v-model="inputs.fromDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)">
                <div v-if="errorFromDate" class="text-red-500 text-sm mt-1">
                  Mục từ ngày không đúng
                </div>
              </div>

              <div class="w-full md:w-1/4 px-2">
                <label class="block mb-2"> Đến ngày </label><span class="error-sybol"></span>
                <input
                  id="toDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-500': errorToDate }"
                  v-model="inputs.toDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)">
                <div v-if="errorToDate" class="text-red-500 text-sm mt-1">
                  Mục đến ngày không đúng
                </div>
              </div>

              <div class="w-full md:w-1/4 px-2">
                <label class="block mb-2"> Sắp xếp theo </label>
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

            <div class="flex flex-wrap -mx-2" v-show="items.length > 0">
              <div class="w-full md:w-1/3 px-2">
                Số kết quả: {{ items.length }}
              </div>
              <div class="w-full md:w-2/3 px-2 text-right">
                <button
                  @click="exportToExcel"
                  class="btn btn-default text-header px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  <b>Xuất Excel</b>
                </button>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 mt-2 mb-2" v-show="click == true">
              <div class="w-full px-2">
                <div class="overflow-x-auto" v-show="items.length > 0">
                  <table class="min-w-full border border-gray-300">
                    <thead class="bg-gray-100">
                      <tr>
                        <th v-for="field in fields" :key="field.key" class="px-4 py-2 border border-gray-300 text-left">
                          {{ field.label }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in items" :key="item.stt" class="hover:bg-gray-50">
                        <td v-for="field in fields" :key="field.key" class="px-4 py-2 border border-gray-300">
                          {{ item[field.key] }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p v-show="firstSearch == false && items.length <= 0" class="text-center">
                  Không có kết quả nào
                </p>
              </div>
            </div>
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
import { useToast } from '@/composables/useToast'
import * as XLSX from 'xlsx'

const { popToast } = useToast()

const inputs = ref({
  store_id: null,
  fromDate: null,
  toDate: null,
  orderBy: 'quantityAsc'
})

const onSearch = ref(false)
const click = ref(false)
const optionsStore = ref([])
const loading = ref(false)
const firstSearch = ref(true)

const orderByOption = ref([
  { value: 'quantityAsc', text: '' },
  { value: 'quantityAsc', text: 'Số lượng tăng dần' },
  { value: 'quantityDesc', text: 'Số lượng giảm dần' },
  { value: 'amountAsc', text: 'Doanh thu tăng dần' },
  { value: 'amountDesc', text: 'Doanh thu giảm dần' }
])

const fields = ref([
  { key: 'stt', label: 'STT' },
  { key: 'name', label: 'Tên' },
  { key: 'quantity', label: 'Số lượng' },
  { key: 'percent_quantity', label: '% Số lượng' },
  { key: 'amount', label: 'Doanh thu' },
  { key: 'percent_amount', label: '% Doanh thu' }
])

const items = ref([])

const excel_statistic_fields = ref({
  'STT': 'stt',
  'Tên': 'name',
  'Số lượng': 'quantity',
  '% Số lượng': 'percent_quantity',
  'Doanh thu': 'amount',
  '% Doanh thu': 'percent_amount'
})

const errorFromDate = computed(() => {
  return checkDate(inputs.value.fromDate)
})

const errorToDate = computed(() => {
  return checkDate(inputs.value.toDate)
})

const checkDate = (dateInput) => {
  return (click.value && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
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
 * Only input date
 */
const inputDateOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.inputDateOnly(valueInput)
  item.value = result
}

/**
 * Check valid from date and to date
 */
const checkFromDateAndToDate = () => {
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
  if (loading.value) { return }
  click.value = true

  // Check validate
  if (!checkValidate()) {
    items.value = []
    return
  }

  // Check store id
  if (!inputs.value.store_id) {
    popToast('danger', "Vui lòng chọn cửa hàng")
    return
  }

  if (!checkFromDateAndToDate()) {
    items.value = []
    return
  }

  loading.value = true
  onSearch.value = true

  let params = {
    store_id: inputs.value.store_id,
    fromDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate),
    toDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate),
    orderBy: inputs.value.orderBy
  }

  // Search
  adminAPI.getBrandStatistic(params).then(res => {
    if (res && res.data && res.data.data) {
      items.value = res.data.data
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

const exportToExcel = () => {
  const exportData = items.value.map((item, index) => ({
    'STT': item.stt,
    'Tên': item.name,
    'Số lượng': item.quantity,
    '% Số lượng': item.percent_quantity,
    'Doanh thu': item.amount,
    '% Doanh thu': item.percent_amount
  }))
  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Thống kê')
  XLSX.writeFile(workbook, 'thong_ke_cua_hang.xlsx')
}

onMounted(() => {
  // Load store option
  getOptionStore()

  // Get default date
  let dateNow = new Date().toJSON().slice(0, 10)
  inputs.value.toDate = commonFunc.formatDate(dateNow)
  inputs.value.fromDate = commonFunc.formatDate(dateNow)
})
</script>
