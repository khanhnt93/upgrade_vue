<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <h4 class="text-center text-2xl font-semibold">Lịch sử kho hàng</h4>
      </div>
      <hr class="mb-6">

      <!-- Filters -->
      <div class="flex flex-wrap -mx-2 mb-4">
        <div class="w-full md:w-1/4 px-2 mb-4" v-if="resourceOptions.length > 0">
          <label class="block mb-2 font-medium">Nguyên liệu</label>
          <select
            id="status"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.resource">
            <option v-for="option in resourceOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
        <div class="w-full md:w-1/4 px-2 mb-4">
          <label class="block mb-2 font-medium">Loại</label>
          <select
            id="status"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.type">
            <option v-for="option in typeOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
        <div class="w-full md:w-1/4 px-2 mb-4">
          <label class="block mb-2 font-medium">Từ ngày</label>
          <input
            id="fromDate"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.fromDate"
            maxlength="10"
            @keyup="inputDateOnly($event.target)">
          <div v-if="errorFromDate" class="text-red-500 text-sm mt-1">
            Mục từ ngày không đúng
          </div>
        </div>
        <div class="w-full md:w-1/4 px-2 mb-4">
          <label class="block mb-2 font-medium">Đến ngày</label>
          <input
            id="toDate"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.toDate"
            maxlength="10"
            @keyup="inputDateOnly($event.target)">
          <div v-if="errorToDate" class="text-red-500 text-sm mt-1">
            Mục đến ngày không đúng
          </div>
        </div>
      </div>

      <div class="flex justify-end mb-4">
        <button
          @click.prevent="prepareToSearch"
          :disabled="onSearch"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-32 disabled:opacity-50 disabled:cursor-not-allowed">
          Tìm Kiếm
        </button>
      </div>

      <div class="mb-4">
        <span class="font-medium">Số kết quả: {{ totalRow }}</span>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                STT
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                Nguyên Liệu - Mặt hàng
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                Nội dung
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                Ghi chú
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                Thời gian
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tạo bởi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in items" :key="item.stt" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm border-r">{{ item.stt }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm border-r">{{ item.resource_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm border-r">
                <b v-if="item.type == 'plus'">+</b><b v-if="item.type == 'minus'">-</b>{{ currencyFormat(item.quantity) }}
              </td>
              <td class="px-6 py-4 text-sm border-r">{{ item.reason }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm border-r">{{ item.created_at }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.staff_name }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading -->
      <div v-show="loading" class="text-center my-8">
        <icon name="loading" width="60" />
      </div>
      <div v-if="hasNext === false" class="text-center my-4 text-gray-500">--Hết--</div>
      <div v-if="hasNext === true && totalRow != 0" class="text-center my-4">
        <i class="fa fa-angle-double-down text-2xl text-blue-500"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'

const { showToast } = useToast()

const resourceOptions = ref([{ value: null, text: '' }])
const typeOptions = ref([
  { value: null, text: '' },
  { value: 'plus', text: 'Thêm vào' },
  { value: 'minus', text: 'Giảm đi' },
])

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

// Computed properties
const errorFromDate = computed(() => {
  return checkDate(inputs.value.fromDate)
})

const errorToDate = computed(() => {
  return checkDate(inputs.value.toDate)
})

// Methods
const checkDate = (dateInput) => {
  return (click.value && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
}

const checkValidate = () => {
  return !(errorFromDate.value || errorToDate.value || !checkFromDateAndToDate())
}

const getDefaultDate = () => {
  let dateNow = new Date()
  inputs.value.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
  let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
  inputs.value.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
}

const onScroll = (event) => {
  if (onSearch.value) {
    return
  }
  event.preventDefault()
  var body = document.body
  var html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if (hasNext.value) {
      offset.value = offset.value + pageLimit.value
      loadByScroll.value = true
      search()
    }
  }
}

const checkFromDateAndToDate = () => {
  let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate))
  let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate))

  if (fromDate > toDate) {
    showToast('danger', "Từ ngày không thể lớn hớn đến ngày")
    return false
  }

  fromDate.setFullYear(fromDate.getFullYear() + 1)

  if (fromDate < toDate) {
    showToast('danger', "Thời gian không quá 1 năm")
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

  let param = {
    "resource_id": inputs.value.resource,
    "type": inputs.value.type,
    "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.fromDate),
    "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.value.toDate),
    "limit": pageLimit.value,
    "offset": offset.value
  }

  adminAPI.searchResourceHistory(param).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let it = res.data.data.data
      totalRow.value = res.data.data.total_row

      if (loadByScroll.value) {
        let temp = items.value
        var newArray = temp.concat(it)
        items.value = newArray
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
    let errorMess = commonFunc.handleStaffError(err)
    showToast('danger', errorMess)

    onSearch.value = false
    loading.value = false
  })
}

const getResourceOptions = () => {
  adminAPI.getListResourceOption().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let resources = res.data.data
      for (let index in resources) {
        resourceOptions.value.push(resources[index])
      }
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    showToast('danger', errorMess)
  })
}

const currencyFormat = (num) => {
  let result = ""
  if (num === 0) {
    return "0"
  }
  if (num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

const inputDateOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.inputDateOnly(valueInput)
  item.value = result
}

// Lifecycle hooks
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

<style scoped>
.has-next {
  cursor: pointer;
}
</style>
