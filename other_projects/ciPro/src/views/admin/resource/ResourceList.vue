<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-end mb-4">
        <button
          @click="goToAdd()"
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-32">
          Thêm
        </button>
      </div>

      <div class="mb-4">
        <h4 class="text-center text-2xl font-semibold">Nguyên liệu - Mặt hàng</h4>
      </div>
      <hr class="mb-6">

      <!-- Filters -->
      <div class="flex flex-wrap -mx-2 mb-4">
        <div class="w-full md:w-1/3 px-2 mb-4">
          <label class="block mb-2 font-medium">Tên</label>
          <input
            id="name"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.name">
        </div>
        <div class="w-full md:w-1/3 px-2 mb-4" v-if="units.length > 0">
          <label class="block mb-2 font-medium">Đơn vị</label>
          <select
            id="status"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.unit">
            <option v-for="unit in units" :key="unit.value" :value="unit.value">
              {{ unit.text }}
            </option>
          </select>
        </div>
        <div class="w-full md:w-1/3 px-2 mb-4">
          <label class="block mb-2 font-medium">Trạng Thái</label>
          <select
            id="status"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.status">
            <option v-for="status in statusOptions" :key="status.value" :value="status.value">
              {{ status.text }}
            </option>
          </select>
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
                Tên
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                Số lượng
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                Số lượng tối thiểu
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                Đơn vị
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="item in items"
              :key="item.stt"
              :class="{
                'bg-yellow-50 hover:bg-yellow-100': getRowVariant(item) === 'warning',
                'bg-red-50 hover:bg-red-100': getRowVariant(item) === 'danger',
                'hover:bg-gray-50': !getRowVariant(item)
              }">
              <td class="px-6 py-4 whitespace-nowrap text-sm border-r">{{ item.stt }}</td>
              <td class="px-6 py-4 text-sm border-r">{{ item.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm border-r">{{ currencyFormat(item.quantity) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm border-r">{{ currencyFormat(item.min_quantity) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm border-r">{{ item.unit_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex space-x-1">
                  <button
                    @click="addQuantity(item.id, item.quantity, item.unit_name)"
                    title="Plus quantity"
                    class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded">
                    <i class="fa fa-plus" />
                  </button>
                  <button
                    @click="minusQuantity(item.id, item.quantity, item.unit_name)"
                    title="Minus quantity"
                    class="px-3 py-1 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded">
                    <i class="fa fa-minus" />
                  </button>
                  <button
                    @click="updateQuantity(item.id, item.quantity, item.unit_name)"
                    title="Update quantity"
                    class="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded">
                    <i class="fa fa-balance-scale" />
                  </button>
                  <button
                    @click="edit(item.id)"
                    title="Edit"
                    class="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-600 rounded">
                    <i class="fa fa-edit" />
                  </button>
                  <button
                    @click="deleted(item.id, item.name, item.stt)"
                    title="Delete"
                    class="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded">
                    <i class="fa fa-trash" />
                  </button>
                </div>
              </td>
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

    <!-- Modal add quantity resource -->
    <div v-if="showModalAdd" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="text-center mb-4">
          <h5 class="text-xl font-semibold">Thêm số lượng</h5>
        </div>

        <!-- Loading -->
        <div v-show="saving" class="text-center my-8">
          <icon name="loading" width="60" />
        </div>

        <div class="space-y-4">
          <div>
            <label class="block mb-2 font-medium">Số lượng hiện tại</label>
            <div class="flex items-center">
              <input
                id="currentQuantity"
                v-model="quantityChange.currentQuantity"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                disabled>
              <label class="ml-2">{{ quantityChange.unit_name }}</label>
            </div>
          </div>

          <div>
            <label class="block mb-2 font-medium">Số lượng thêm vào<span class="text-red-500">*</span></label>
            <div class="flex items-center">
              <input
                id="quantityBonus"
                v-model="quantityChange.quantityBonus"
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxlength="11"
                @keyup="integerAndPointOnly($event.target)">
              <label class="ml-2">{{ quantityChange.unit_name }}</label>
            </div>
            <div v-if="errorQuantityBonus" class="text-red-500 text-sm mt-1">
              Vui lòng nhập số lượng thêm vào
            </div>
          </div>

          <div>
            <label class="block mb-2 font-medium">Nguyên nhân thêm<span class="text-red-500">*</span></label>
            <textarea
              id="reasonBonus"
              v-model="quantityChange.reasonBonus"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập hàng"
              maxlength="255"
              rows="3">
            </textarea>
            <div v-if="errorReasonBonus" class="text-red-500 text-sm mt-1">
              Vui lòng nhập nguyên nhân thêm
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-6 space-x-4">
          <button
            @click="confirmBonusQuantity"
            class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-32">
            Xác nhận
          </button>
          <button
            @click="showModalAdd = false"
            class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-32">
            Đóng
          </button>
        </div>
      </div>
    </div>

    <!-- Modal minus quantity resource -->
    <div v-if="showModalMinus" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="text-center mb-4">
          <h5 class="text-xl font-semibold">Giảm số lượng</h5>
        </div>

        <!-- Loading -->
        <div v-show="saving" class="text-center my-8">
          <icon name="loading" width="60" />
        </div>

        <div class="space-y-4">
          <div>
            <label class="block mb-2 font-medium">Số lượng hiện tại</label>
            <div class="flex items-center">
              <input
                v-model="quantityChange.currentQuantity"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                disabled>
              <label class="ml-2">{{ quantityChange.unit_name }}</label>
            </div>
          </div>

          <div>
            <label class="block mb-2 font-medium">Số lượng giảm đi<span class="text-red-500">*</span></label>
            <div class="flex items-center">
              <input
                v-model="quantityChange.quantityBonus"
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxlength="11"
                @keyup="integerAndPointOnly($event.target)">
              <label class="ml-2">{{ quantityChange.unit_name }}</label>
            </div>
            <div v-if="errorQuantityBonus" class="text-red-500 text-sm mt-1">
              Vui lòng nhập số lượng giảm đi
            </div>
          </div>

          <div>
            <label class="block mb-2 font-medium">Nguyên nhân giảm<span class="text-red-500">*</span></label>
            <textarea
              id="reasonBonus"
              v-model="quantityChange.reasonBonus"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hư hỏng"
              maxlength="255"
              rows="3">
            </textarea>
            <div v-if="errorReasonBonus" class="text-red-500 text-sm mt-1">
              Vui lòng nhập nguyên nhân giảm
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-6 space-x-4">
          <button
            @click="confirmBonusQuantity"
            class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-32">
            Xác nhận
          </button>
          <button
            @click="showModalMinus = false"
            class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-32">
            Đóng
          </button>
        </div>
      </div>
    </div>

    <!-- Modal update quantity resource -->
    <div v-if="showModalUpdate" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="text-center mb-4">
          <h5 class="text-xl font-semibold">Cập nhật số lượng</h5>
        </div>

        <!-- Loading -->
        <div v-show="saving" class="text-center my-8">
          <icon name="loading" width="60" />
        </div>

        <div class="space-y-4">
          <div>
            <label class="block mb-2 font-medium">Số lượng cũ</label>
            <div class="flex items-center">
              <input
                v-model="quantityChange.currentQuantity"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                disabled>
              <label class="ml-2">{{ quantityChange.unit_name }}</label>
            </div>
          </div>

          <div>
            <label class="block mb-2 font-medium">Số lượng mới<span class="text-red-500">*</span></label>
            <div class="flex items-center">
              <input
                v-model="quantityChange.quantityBonus"
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxlength="11"
                @keyup="integerAndPointOnly($event.target)">
              <label class="ml-2">{{ quantityChange.unit_name }}</label>
            </div>
            <div v-if="errorQuantityBonus" class="text-red-500 text-sm mt-1">
              Vui lòng nhập số lượng mới
            </div>
          </div>

          <div>
            <label class="block mb-2 font-medium">Nguyên nhân thay đổi<span class="text-red-500">*</span></label>
            <textarea
              id="reasonBonus"
              v-model="quantityChange.reasonBonus"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Kiểm kê hàng ngày"
              maxlength="255"
              rows="3">
            </textarea>
            <div v-if="errorReasonBonus" class="text-red-500 text-sm mt-1">
              Vui lòng nhập nguyên nhân thay đổi
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-6 space-x-4">
          <button
            @click="confirmUpdateQuantity"
            class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-32">
            Xác nhận
          </button>
          <button
            @click="showModalUpdate = false"
            class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-32">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import unitAPI from '@/api/unit'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'

const router = useRouter()
const { showToast } = useToast()

const inputs = ref({
  name: null,
  unit: null,
  status: null
})

const items = ref([])
const units = ref([{ value: null, text: '' }])
const statusOptions = ref([
  { value: null, text: '' },
  { value: 'still', text: 'Còn hàng' },
  { value: 'runningOut', text: 'Sắp hết' },
  { value: 'over', text: 'Đã hết' }
])

const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const hasNext = ref(true)
const onSearch = ref(false)
const loadByScroll = ref(false)
const listIdDeleted = ref([])
const loading = ref(false)
const totalRow = ref(0)
const click = ref(false)

const quantityChange = ref({
  id: null,
  currentQuantity: null,
  quantityBonus: null,
  reasonBonus: null,
  unit_name: null,
  type: null
})

const saving = ref(false)
const showModalAdd = ref(false)
const showModalMinus = ref(false)
const showModalUpdate = ref(false)

// Computed properties
const errorQuantityBonus = computed(() => {
  return checkInfo(quantityChange.value.quantityBonus)
})

const errorReasonBonus = computed(() => {
  return checkInfo(quantityChange.value.reasonBonus)
})

// Methods
const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkValidate = () => {
  return !(errorQuantityBonus.value || errorReasonBonus.value)
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

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true

  search()
}

const getRowVariant = (item) => {
  if (item.quantity > item.min_quantity) {
    return null
  } else {
    if (item.quantity <= item.min_quantity && item.quantity > 0) {
      return 'warning'
    } else {
      if (item.quantity <= 0) {
        return 'danger'
      }
    }
  }
  return null
}

const search = () => {
  if (loading.value) { return }

  onSearch.value = true
  loading.value = true

  let param = {
    "name": inputs.value.name,
    "unit": inputs.value.unit,
    "status": inputs.value.status,
    "limit": pageLimit.value,
    "offset": offset.value
  }

  adminAPI.searchResource(param).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let it = res.data.data.resource
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

const getUnitOptions = () => {
  unitAPI.getListUnitOption().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let unitsData = res.data.data
      for (let index in unitsData) {
        units.value.push(unitsData[index])
      }
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    showToast('danger', errorMess)
  })
}

const deleted = (id, name, rowIndex) => {
  if (id && name) {
    if (confirm('Xóa ' + name + ". Bạn có chắc không?")) {
      adminAPI.deleteResource(id).then(res => {
        let indexTemp = commonFunc.updateIndex(rowIndex - 1, listIdDeleted.value)
        items.value.splice(indexTemp, 1)
        listIdDeleted.value.push(rowIndex - 1)

        totalRow.value = totalRow.value - 1
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        showToast('danger', errorMess)
      })
    }
  }
}

const addQuantity = (id, quantity, unit_name) => {
  quantityChange.value.id = id
  quantityChange.value.currentQuantity = quantity
  quantityChange.value.unit_name = unit_name
  quantityChange.value.type = "plus"
  quantityChange.value.reasonBonus = "Nhập hàng"
  quantityChange.value.quantityBonus = null
  click.value = false

  showModalAdd.value = true
}

const minusQuantity = (id, quantity, unit_name) => {
  quantityChange.value.id = id
  quantityChange.value.currentQuantity = quantity
  quantityChange.value.unit_name = unit_name
  quantityChange.value.type = "minus"
  quantityChange.value.reasonBonus = "Hư hỏng"
  quantityChange.value.quantityBonus = null
  click.value = false

  showModalMinus.value = true
}

const updateQuantity = (id, quantity, unit_name) => {
  quantityChange.value.id = id
  quantityChange.value.currentQuantity = quantity
  quantityChange.value.unit_name = unit_name
  quantityChange.value.reasonBonus = "Kiểm kê hàng"
  quantityChange.value.quantityBonus = null
  click.value = false

  showModalUpdate.value = true
}

const confirmBonusQuantity = () => {
  click.value = true

  let checkValidateResult = checkValidate()
  if (!checkValidateResult) {
    return
  }

  saving.value = true

  adminAPI.bonusQuantityResource(quantityChange.value).then(res => {
    if (res != null && res.data != null) {
      if (res.data.status == 200) {
        for (let index in items.value) {
          if (items.value[index].id == quantityChange.value.id) {
            if (quantityChange.value.type == "plus") {
              items.value[index].quantity = Math.round((parseFloat(items.value[index].quantity) + parseFloat(quantityChange.value.quantityBonus)) * 1000) / 1000
            } else {
              items.value[index].quantity = Math.round((parseFloat(items.value[index].quantity) - parseFloat(quantityChange.value.quantityBonus)) * 1000) / 1000
            }
          }
        }

        showToast('success', 'Cập nhật số lượng thành công ')

        quantityChange.value.id = null
        quantityChange.value.currentQuantity = null
        quantityChange.value.quantityBonus = null
        quantityChange.value.reasonBonus = null
        quantityChange.value.type = null
        click.value = false

        showModalAdd.value = false
        showModalMinus.value = false
      }
    }
    saving.value = false
  }).catch(err => {
    saving.value = false
    let errorMess = commonFunc.handleStaffError(err)
    showToast('danger', errorMess)
  })
}

const confirmUpdateQuantity = () => {
  click.value = true

  let checkValidateResult = checkValidate()
  if (!checkValidateResult) {
    return
  }

  saving.value = true

  let quantityChangeValue = parseFloat(quantityChange.value.currentQuantity) - parseFloat(quantityChange.value.quantityBonus)
  if (quantityChangeValue > 0) {
    quantityChange.value.type = "minus"
  } else {
    quantityChange.value.type = "plus"
  }
  quantityChange.value.quantityBonus = quantityChangeValue.toString().replace("-", "")

  adminAPI.bonusQuantityResource(quantityChange.value).then(res => {
    if (res != null && res.data != null) {
      if (res.data.status == 200) {
        for (let index in items.value) {
          if (items.value[index].id == quantityChange.value.id) {
            if (quantityChange.value.type == "plus") {
              items.value[index].quantity = Math.round((parseFloat(items.value[index].quantity) + parseFloat(quantityChange.value.quantityBonus)) * 1000) / 1000
            } else {
              items.value[index].quantity = Math.round((parseFloat(items.value[index].quantity) - parseFloat(quantityChange.value.quantityBonus)) * 1000) / 1000
            }
          }
        }

        showToast('success', 'Cập nhật số lượng thành công ')

        quantityChange.value.id = null
        quantityChange.value.currentQuantity = null
        quantityChange.value.quantityBonus = null
        quantityChange.value.reasonBonus = null
        quantityChange.value.type = null
        click.value = false

        showModalUpdate.value = false
      }
    }
    saving.value = false
  }).catch(err => {
    saving.value = false
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

const integerAndPointOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.integerAndPointOnly(valueInput)
  item.value = result
}

const edit = (id) => {
  router.push('/resource/index/' + id)
}

const goToAdd = () => {
  router.push('/resource/index')
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', onScroll)
  getUnitOptions()
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
