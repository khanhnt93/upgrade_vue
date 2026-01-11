<template>
  <div class="w-full px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h4 class="text-xl font-semibold text-center mb-6 text-header">Báo Cáo Sửa Bill Cũ</h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <!-- From Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Từ ngày <span class="text-red-500">*</span>
          </label>
          <input
            id="fromDate"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="errorFromDate ? 'border-red-500' : 'border-gray-300'"
            v-model="inputs.fromDate"
            maxlength="10"
            @keyup="inputDateOnly($event.target)">
          <p v-if="errorFromDate" class="text-red-500 text-sm mt-1">
            Mục từ ngày không đúng
          </p>
        </div>

        <!-- To Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Đến ngày <span class="text-red-500">*</span>
          </label>
          <input
            id="toDate"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="errorToDate ? 'border-red-500' : 'border-gray-300'"
            v-model="inputs.toDate"
            maxlength="10"
            @keyup="inputDateOnly($event.target)">
          <p v-if="errorToDate" class="text-red-500 text-sm mt-1">
            Mục đến ngày không đúng
          </p>
        </div>
      </div>

      <!-- Search Button -->
      <div class="flex justify-end mb-4">
        <button
          class="px-6 py-2 bg-white border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="onSearch"
          @click="search">
          Xem
        </button>
      </div>

      <!-- Loading -->
      <div v-show="loading" class="flex justify-center items-center py-8">
        <font-awesome-icon icon="spinner" spin class="text-blue-500 text-4xl" />
      </div>

      <div v-show="!loading && items.length > 0">
        <!-- Header with Count and Export -->
        <div class="flex justify-between items-center mb-4">
          <div class="text-gray-700">
            Số kết quả: <span class="font-semibold">{{ items.length }}</span>
          </div>
          <download-excel
            class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-header font-semibold"
            :data="items"
            :fields="excel_statistic_fields"
            worksheet="data"
            name="bao_cao_sua_bill_cu.xls">
            Xuất Excel
          </download-excel>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-blue-100">
                <th class="border border-gray-300 px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">STT</th>
                <th class="border border-gray-300 px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Số bill</th>
                <th class="border border-gray-300 px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Thành tiền bill gốc</th>
                <th class="border border-gray-300 px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Thành tiền bill sửa</th>
                <th class="border border-gray-300 px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Số tiền chênh lệch</th>
                <th class="border border-gray-300 px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Ngày sửa</th>
                <th class="border border-gray-300 px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Người sửa</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.bill_number" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-2 text-center">{{ item.stt }}</td>
                <td class="border border-gray-300 px-4 py-2 text-center">{{ item.bill_number }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right">{{ formatters.formatCurrency(item.old_total) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right">{{ formatters.formatCurrency(item.new_total) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right">{{ formatters.formatCurrency(item.difference_amount) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-center">{{ item.created_at }}</td>
                <td class="border border-gray-300 px-4 py-2 text-center">{{ item.staff_name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Results -->
      <div v-show="!loading && !firstSearch && items.length === 0" class="text-center py-8 text-gray-500">
        Không có kết quả nào
      </div>
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
const formatters = useFormatters()

const inputs = ref({
  fromDate: null,
  toDate: null
})

const onSearch = ref(false)
const click = ref(false)
const items = ref([])
const loading = ref(false)
const firstSearch = ref(true)

const excel_statistic_fields = {
  'STT': 'stt',
  'Số bill': 'bill_number',
  'Thành tiền bill gốc': 'old_total',
  'Thành tiền bill sửa': 'new_total',
  'Ngày sửa': 'created_at',
  'Người sửa': 'staff_name'
}

const checkDate = (dateInput) => {
  return (click.value && (!dateInput || commonFunc.dateFormatCheck(dateInput) === false))
}

const errorFromDate = computed(() => checkDate(inputs.value.fromDate))
const errorToDate = computed(() => checkDate(inputs.value.toDate))

const checkValidate = () => {
  return !(errorFromDate.value || errorToDate.value)
}

/**
 * Check valid from date and to date
 */
const checkFromDateAndToDate = () => {
  const fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
  const toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate))

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
 * Search
 */
const search = () => {
  if (loading.value) return

  click.value = true

  // Check validate
  if (!checkValidate()) {
    items.value = []
    return
  }
  if (!checkFromDateAndToDate()) {
    items.value = []
    return
  }

  loading.value = true
  onSearch.value = true

  const params = {
    fromDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate),
    toDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate)
  }

  // Search
  adminAPI.getEditOldBillReport(params)
    .then(res => {
      if (res && res.data && res.data.data) {
        items.value = res.data.data
      }
      firstSearch.value = false
      onSearch.value = false
      loading.value = false
    })
    .catch(err => {
      const errorMess = commonFunc.handleStaffError(err)
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
  const valueInput = item.value
  const result = commonFunc.inputDateOnly(valueInput)
  item.value = result
}

onMounted(() => {
  // Get default date
  const dateNow = new Date()
  inputs.value.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
  const fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
  inputs.value.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))

  // Load data
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
