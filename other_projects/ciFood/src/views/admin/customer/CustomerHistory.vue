<template>
  <div class="mx-auto px-4 py-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Title -->
      <h4 class="text-2xl font-semibold text-center mb-4">Lịch Sử Khách Hàng</h4>
      <hr class="mb-6">

      <!-- Search Filters -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-2">Tên</label>
          <input
            id="name"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.name"
            maxlength="75"
          >
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Số điện thoại</label>
          <input
            id="phone"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.phone"
            maxlength="11"
            @keyup="integerOnly($event.target)"
          >
        </div>
      </div>

      <!-- Search Button -->
      <div class="flex justify-end mb-4">
        <button
          @click="prepareToSearch"
          :disabled="onSearch"
          class="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Tìm Kiếm
        </button>
      </div>

      <!-- Result Count -->
      <div class="mb-4">
        <span class="text-sm text-gray-600">Số kết quả: {{ totalRow }}</span>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">STT</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tên K.H</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Số điện thoại</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Giờ vào</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Giờ ra</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tổng tiền món</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Chi tiết</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm">{{ item.stt }}</td>
              <td class="px-4 py-3 text-sm">{{ item.customer_name }}</td>
              <td class="px-4 py-3 text-sm">{{ item.phone_number }}</td>
              <td class="px-4 py-3 text-sm">{{ item.order_at }}</td>
              <td class="px-4 py-3 text-sm">{{ item.payment_at }}</td>
              <td class="px-4 py-3 text-sm">{{ formatters.formatCurrency(item.sub_total) }}</td>
              <td class="px-4 py-3 text-sm">
                <p v-for="(food, index) in item.foods" :key="food.name + index" class="mb-1">
                  {{ food.quantity + " x " + food.name }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading Indicators -->
      <div class="text-center mt-4">
        <span v-show="loading" class="inline-block">
          <i class="fa fa-spinner fa-spin text-2xl text-blue-600"></i>
        </span>
        <span v-if="hasNext === false" class="text-gray-500">--Hết--</span>
        <span v-if="hasNext === true && totalRow != 0" class="text-blue-600 cursor-pointer">
          <i class="fa fa-angle-double-down text-2xl"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import customerApi from '@/api/customer'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'

const { popToast } = useToast()
const formatters = useFormatters()

const inputs = ref({
  name: null,
  phone: null
})

const items = ref([])
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const hasNext = ref(true)
const onSearch = ref(false)
const loadByScroll = ref(false)
const loading = ref(false)
const totalRow = ref(0)

/**
 * Processing on scroll: use for paging
 */
const onScroll = (event) => {
  if (onSearch.value) {
    return
  }
  event.preventDefault()
  var body = document.body
  var html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if (hasNext.value) {
      offset.value = offset.value + pageLimit.value
      loadByScroll.value = true
      search()
    }
  }
}

/**
 * Prepare to search
 */
const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  search()
}

/**
 * Search
 */
const search = () => {
  if (loading.value) { return }

  onSearch.value = true
  loading.value = true

  // Define params
  let params = {
    "name": inputs.value.name,
    "phone": inputs.value.phone,
    "limit": pageLimit.value,
    "offset": offset.value
  }

  // Search
  customerApi.getCustomerHistory(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let it = res.data.data.customers
      totalRow.value = res.data.data.total_row

      // Update items
      if (loadByScroll.value) {
        items.value = items.value.concat(it)
      } else {
        items.value = it
      }
      loadByScroll.value = false

      // Check has next
      if (offset.value + pageLimit.value >= res.data.data.total_row) {
        hasNext.value = false
      }
    } else {
      items.value = []
    }
    onSearch.value = false
    loading.value = false
  }).catch(err => {
    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)

    onSearch.value = false
    loading.value = false
  })
}

/**
 * Only input integer
 */
const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  // Load list when load page
  search()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
