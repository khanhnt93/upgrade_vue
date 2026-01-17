<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-end mb-4">
          <button
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-32"
            @click="goToAdd">
            Thêm
          </button>
        </div>

        <div class="text-center mb-4">
          <h4 class="text-xl font-semibold text-gray-700">Danh Sách Khuyến Mãi</h4>
        </div>
        <hr class="mb-4">

        <!-- Search Form -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label class="block mb-2">Tên</label>
            <input
              type="text"
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              v-model="inputs.name">
          </div>

          <div>
            <label class="block mb-2">Giá</label>
            <input
              type="text"
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              v-model="inputs.price"
              maxlength="11"
              @keyup="integerOnly($event.target)">
          </div>

          <div>
            <label class="block mb-2">Loại</label>
            <select
              v-model="inputs.type"
              class="w-full border rounded px-3 py-2">
              <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
            </select>
          </div>

          <div>
            <label class="block mb-2">Hiệu lực</label>
            <select
              v-model="inputs.expire"
              class="w-full border rounded px-3 py-2">
              <option v-for="opt in expireOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end mb-4">
          <button
            class="border border-blue-500 text-blue-500 hover:bg-blue-50 px-4 py-2 rounded w-32"
            :disabled="onSearch"
            @click="prepareToSearch">
            Tìm Kiếm
          </button>
        </div>

        <div class="mb-3">
          Số kết quả: {{ totalRow }}
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="border border-gray-300 px-4 py-2">STT</th>
                <th class="border border-gray-300 px-4 py-2">Mã</th>
                <th class="border border-gray-300 px-4 py-2">Tên</th>
                <th class="border border-gray-300 px-4 py-2">Giá(điểm)</th>
                <th class="border border-gray-300 px-4 py-2">Loại</th>
                <th class="border border-gray-300 px-4 py-2">% giảm giá</th>
                <th class="border border-gray-300 px-4 py-2">Giảm giá tối đa</th>
                <th class="border border-gray-300 px-4 py-2">Trên tổng giá</th>
                <th class="border border-gray-300 px-4 py-2">Giá trị voucher</th>
                <th class="border border-gray-300 px-4 py-2">Item free</th>
                <th class="border border-gray-300 px-4 py-2">Số lượng</th>
                <th class="border border-gray-300 px-4 py-2">Còn lại</th>
                <th class="border border-gray-300 px-4 py-2">Ngày hiệu lực</th>
                <th class="border border-gray-300 px-4 py-2">Ngày Hết Hạn</th>
                <th class="border border-gray-300 px-4 py-2 w-24"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-2">{{ item.stt }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.code }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.price }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.type }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.discount_percent }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.max_discount }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.discount_on_amount }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.value_of_voucher }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.item_free }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.quantity }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.remaining }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.expired_date_from }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.expired_date_to }}</td>
                <td class="border border-gray-300 px-4 py-2">
                  <div class="flex gap-2 justify-center">
                    <button
                      @click="edit(item.id)"
                      class="text-blue-500 hover:text-blue-700"
                      title="Edit">
                      <i class="fa fa-edit" />
                    </button>
                    <button
                      @click="deleted(item.id, item.name, item.stt, item.method)"
                      class="text-red-500 hover:text-red-700"
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
        <div class="text-center mt-4">
          <span v-show="loading" class="inline-block"><icon name="loading" width="60" /></span>
          <span v-if="hasNext === false" class="text-gray-500">--Hết--</span>
          <span v-if="hasNext === true && totalRow != 0" class="text-gray-500 cursor-pointer">
            <i class="fa fa-angle-double-down text-2xl"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import promotionAPI from '@/api/promotion'
import commonFunc from '@/common/commonFunc'
import { Constant } from '@/common/constant'

const router = useRouter()
const { popToast } = useToast()

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
const totalRow = ref(0)

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

/**
 *  Processing on scroll: use for paging
 */
const onScroll = (event) => {
  if(onSearch.value) {
    return
  }
  event.preventDefault()
  var body = document.body
  var html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if(hasNext.value) {
      offset.value = offset.value + pageLimit.value
      loadByScroll.value = true
      getPromoList()
    }
  }
}

/**
 * Delete
 */
const deleted = (id, name, rowIndex, method) => {
  if(id && name) {
    if (confirm('Xóa ' + name + ". Bạn có chắc không?")) {
      let dataPost = {
        "id": id,
        "method": method
      }
      promotionAPI.deletePromo(dataPost).then(res => {
        // Remove item in list
        let indexTemp = commonFunc.updateIndex(rowIndex - 1, listIdDeleted.value)
        items.value.splice(indexTemp, 1)
        listIdDeleted.value.push(rowIndex - 1)

        totalRow.value = totalRow.value - 1
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  }
}

/**
 * Load list option promotion type
 */
const getPromotionTypeList = () => {
  promotionAPI.getListPromotionType().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      typeOptions.value = typeOptions.value.concat(res.data.data)
    }
  }).catch(err => {
    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

/**
 * Go to edit
 * @param id
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
  if(method == 'trade_point') {
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
const getPromoList = () => {
  if (loading.value) { return }

  onSearch.value = true
  loading.value = true
  // Define params
  let param = {
    "name": inputs.value.name,
    "price": inputs.value.price,
    "method": inputs.value.method,
    "type": inputs.value.type,
    "expire": inputs.value.expire,
    "limit": pageLimit.value,
    "offset": offset.value
  }

  promotionAPI.getPromoList(param).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      let it = res.data.data.promotions
      totalRow.value = res.data.data.total_row

      // Update items
      if(loadByScroll.value) {
        let temp = items.value
        var newArray = temp.concat(it)
        items.value = newArray
      } else {
        items.value = it
      }
      loadByScroll.value = false

      // Check has next
      if(offset.value + pageLimit.value >= res.data.data.total_row) {
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

  // Load list option promotion type
  getPromotionTypeList()

  // Get list promotion
  getPromoList()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
