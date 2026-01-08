<template>
  <div class="container-fluid px-4 py-4">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Title -->
        <h4 class="text-xl font-semibold text-center mb-4">Lịch Sử Kho Hàng</h4>
        <hr class="mb-4">

        <!-- Search Filters -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div v-if="resourceOptions.length > 1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nguyên liệu</label>
            <select
              v-model="inputs.resource"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="resource in resourceOptions" :key="resource.value" :value="resource.value">{{ resource.text }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Loại</label>
            <select
              v-model="inputs.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option :value="null"></option>
              <option value="plus">Thêm vào</option>
              <option value="minus">Giảm đi</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <input
              v-model="inputs.fromDate"
              type="text"
              autocomplete="new-password"
              maxlength="10"
              @keyup="inputDateOnly($event.target)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorFromDate }">
            <p v-if="errorFromDate" class="text-red-500 text-sm mt-1">Mục từ ngày không đúng</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <input
              v-model="inputs.toDate"
              type="text"
              autocomplete="new-password"
              maxlength="10"
              @keyup="inputDateOnly($event.target)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorToDate }">
            <p v-if="errorToDate" class="text-red-500 text-sm mt-1">Mục đến ngày không đúng</p>
          </div>
        </div>

        <!-- Search Button -->
        <div class="flex justify-end mb-4">
          <button
            @click="prepareToSearch"
            :disabled="onSearch"
            class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Tìm Kiếm
          </button>
        </div>

        <!-- Total Row -->
        <div class="mb-4">
          <span>Số kết quả: {{ totalRow }}</span>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nguyên Liệu - Mặt hàng</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghi chú</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tạo bởi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.stt }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.resource_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span v-if="item.type == 'plus'" class="font-bold">+</span>
                  <span v-if="item.type == 'minus'" class="font-bold">-</span>{{ currencyFormat(item.quantity) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.reason }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.created_at }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.staff_name }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading & Has Next -->
        <div class="text-center mt-4">
          <span v-show="loading" class="inline-block">
            <i class="fa fa-spinner fa-spin fa-3x text-blue-500"></i>
          </span>
          <span v-if="!loading && hasNext === false" class="text-gray-500">--Hết--</span>
          <span v-if="!loading && hasNext === true && totalRow != 0" class="text-blue-500">
            <i class="fa fa-angle-double-down fa-2x"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import adminAPI from '@/api/admin'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const { popToast } = useToast()

// Data
const resourceOptions = ref([{ value: null, text: '' }])
const inputs = ref({
  resource: null,
  type: null,
  fromDate: null,
  toDate: null
})

const items = ref([])
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const hasNext = ref(true)
const onSearch = ref(false)
const loadByScroll = ref(false)
const loading = ref(false)
const totalRow = ref(0)
const click = ref(false)

// Computed
const errorFromDate = computed(() => {
  return checkDate(inputs.value.fromDate)
})

const errorToDate = computed(() => {
  return checkDate(inputs.value.toDate)
})

// Methods
const checkDate = (dateInput) => {
  return click.value && (dateInput == '' || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false)
}

const checkValidate = () => {
  return !(errorFromDate.value || errorToDate.value || !checkFromDateAndToDate())
}

const getDefaultDate = () => {
  const dateNow = new Date()
  inputs.value.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
  const fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
  inputs.value.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
}

const onScroll = (event) => {
  if (onSearch.value) {
    return
  }
  event.preventDefault()
  const body = document.body
  const html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if (hasNext.value) {
      offset.value = offset.value + pageLimit.value
      loadByScroll.value = true
      search()
    }
  }
}

const checkFromDateAndToDate = () => {
  const fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
  const toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate))

  if (fromDate > toDate) {
    popToast('danger', 'Từ ngày không thể lớn hớn đến ngày')
    return false
  }

  const fromDatePlusYear = new Date(fromDate)
  fromDatePlusYear.setFullYear(fromDatePlusYear.getFullYear() + 1)

  if (fromDatePlusYear < toDate) {
    popToast('danger', 'Thời gian không quá 1 năm')
    return false
  }

  return true
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  search()
}

const search = () => {
  if (loading.value) { return }

  onSearch.value = true
  loading.value = true

  const param = {
    resource_id: inputs.value.resource,
    type: inputs.value.type,
    fromDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate),
    toDate: commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate),
    limit: pageLimit.value,
    offset: offset.value
  }

  adminAPI.searchResourceHistory(param).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      const it = res.data.data.data
      totalRow.value = res.data.data.total_row

      if (loadByScroll.value) {
        items.value = items.value.concat(it)
      } else {
        items.value = it
      }
      loadByScroll.value = false

      if (offset.value + pageLimit.value >= res.data.data.total_row) {
        hasNext.value = false
      }
    } else {
      items.value = []
    }
    onSearch.value = false
    loading.value = false
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onSearch.value = false
    loading.value = false
  })
}

const getResourceOptions = () => {
  adminAPI.getListResourceOption().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      const resources = res.data.data
      for (let index in resources) {
        resourceOptions.value.push(resources[index])
      }
    }
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const currencyFormat = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const inputDateOnly = (item) => {
  const result = commonFunc.inputDateOnly(item.value)
  item.value = result
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', onScroll)
  getResourceOptions()
  getDefaultDate()
  search()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
