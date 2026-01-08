<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-end mb-4">
          <button 
            class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors min-w-[120px]"
            @click="goToAdd">
            Thêm
          </button>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <h4 class="mt-2 text-center text-2xl font-semibold">Danh Sách Khuyến Mãi</h4>
          </div>
        </div>
        <hr class="my-4"/>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 md:col-span-3">
            <label class="block mb-2 font-medium">Tên</label>
            <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="inputs.name">
          </div>

          <div class="col-span-12 md:col-span-3">
            <label class="block mb-2 font-medium">Giá</label>
            <input
              id="price"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="inputs.price"
              maxlength="11"
              @keyup="integerOnly($event.target)">
          </div>

          <div class="col-span-12 md:col-span-3">
            <label class="block mb-2 font-medium">Loại</label>
            <select
              id="type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="inputs.type">
              <option v-for="option in typeOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>

          <div class="col-span-12 md:col-span-3">
            <label class="block mb-2 font-medium">Hiệu lực</label>
            <select
              id="expire"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="inputs.expire">
              <option v-for="option in expireOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
        </div>

        <div class="mt-4 mb-4 flex justify-end">
          <button 
            class="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="onSearch" 
            @click="prepareToSearch">
            Tìm Kiếm
          </button>
        </div>

        <div class="mb-4">
          <span class="font-medium">Số kết quả: {{totalRow}}</span>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 border">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">STT</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Mã</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Tên</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Giá(điểm)</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Loại</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">% giảm giá</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Giảm giá tối đa</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Trên tổng giá</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Giá trị voucher</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Item free</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Số lượng</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Còn lại</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Ngày hiệu lực</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Ngày Hết Hạn</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.stt}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.code}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.name}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.price}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.type_name}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.discount_percent}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.max_discount}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.discount_on_amount}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.value_of_voucher}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.item_free}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.quantity}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.remaining}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.expired_date_from}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.expired_date_to}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm border">
                  <div class="flex space-x-2">
                    <button 
                      class="p-2 text-yellow-600 hover:text-yellow-800"
                      @click="edit(item.id)"
                      title="Edit">
                      <i class="fa fa-edit" />
                    </button>
                    <button 
                      class="p-2 text-red-600 hover:text-red-800"
                      @click="deleted(item.id, item.name, item.stt, item.method)"
                      title="Delete">
                      <i class="fa fa-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading -->
        <div v-show="loading" class="flex justify-center items-center py-4">
          <svg class="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <div v-if="hasNext === false" class="text-center py-4">--Hết--</div>
        <div v-if="hasNext === true && totalRow != 0" class="text-center py-4">
          <i class="fa fa-angle-double-down text-2xl"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { Constant } from '@/common/constant'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { showToast } = useToast()

const inputs = ref({
  name: null,
  price: null,
  method: null,
  type: null,
  expire: null
})

const pageLimit = ref(Constant.PAGE_LIMIT)
const items = ref([])
const listIdDeleted = ref([])
const offset = ref(0)
const hasNext = ref(true)
const onSearch = ref(false)
const loadByScroll = ref(false)
const loading = ref(false)

const expireOptions = ref([
  {value: null, text: ''},
  {value: 'true', text: 'Còn'},
  {value: 'false', text: 'Hết'}
])

const typeOptions = ref([{value: null, text: ''}])
const methodOptions = ref([
  {value: null, text: ''},
  {value: 'trade_point', text: 'Đổi điểm'},
  {value: 'other', text: 'Khác'}
])

const totalRow = ref(0)

const rows = computed(() => items.value.length)

/**
 * Processing on scroll: use for paging
 */
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
      getPromoList()
    }
  }
}

/**
 * Delete
 */
const deleted = async (id, name, rowIndex, method) => {
  if (id && name) {
    const confirmed = confirm('Xóa ' + name + ". Bạn có chắc không?")
    if (confirmed) {
      try {
        const dataPost = {
          id: id,
          method: method
        }
        await adminAPI.deletePromo(dataPost)
        
        // Remove item in list
        const indexTemp = commonFunc.updateIndex(rowIndex - 1, listIdDeleted.value)
        items.value.splice(indexTemp, 1)
        listIdDeleted.value.push(rowIndex - 1)
        
        totalRow.value = totalRow.value - 1
      } catch (err) {
        const errorMess = commonFunc.handleStaffError(err)
        showToast(errorMess, 'danger')
      }
    }
  }
}

/**
 * Load list option promotion type
 */
const getPromotionTypeList = async () => {
  try {
    const res = await adminAPI.getListPromotionType()
    if (res != null && res.data != null && res.data.data != null) {
      typeOptions.value = typeOptions.value.concat(res.data.data)
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

/**
 * Go to edit
 */
const edit = (id) => {
  router.push('/promo/index/' + id)
}

/**
 * Go to add
 */
const goToAdd = () => {
  router.push('/promo/index/')
}

/**
 * Format method
 */
const formatMethod = (method) => {
  let result = "Khác"
  if (method == 'trade_point') {
    result = "Đổi điểm"
  }
  return result
}

/**
 * Prepare to search
 */
const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  getPromoList()
}

/**
 * Get list
 */
const getPromoList = async () => {
  if (loading.value) { return }

  onSearch.value = true
  loading.value = true
  
  // Define params
  const param = {
    name: inputs.value.name,
    price: inputs.value.price,
    method: inputs.value.method,
    type: inputs.value.type,
    expire: inputs.value.expire,
    limit: pageLimit.value,
    offset: offset.value
  }

  try {
    const res = await adminAPI.getPromoList(param)
    if (res != null && res.data != null && res.data.data != null) {
      const it = res.data.data.promotions
      totalRow.value = res.data.data.total_row

      // Update items
      if (loadByScroll.value) {
        const temp = items.value
        const newArray = temp.concat(it)
        items.value = newArray
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
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
    onSearch.value = false
    loading.value = false
  }
}

/**
 * Only input integer
 */
const integerOnly = (item) => {
  const valueInput = item.value
  const result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  window.addEventListener('resize', deleted)
  
  // Load list option promotion type
  getPromotionTypeList()
  
  // Get list promotion
  getPromoList()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', deleted)
})
</script>
