<template>
  <div class="container-fluid px-4 py-4">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Header Row -->
        <div class="flex justify-end mb-4">
          <button
            @click="goToAdd"
            class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200">
            Thêm
          </button>
        </div>

        <!-- Title -->
        <h4 class="text-xl font-semibold text-center mb-4">Danh Sách Nguyên Liệu - Mặt Hàng</h4>
        <hr class="mb-4">

        <!-- Search Filters -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên</label>
            <input
              v-model="inputs.name"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div v-if="units.length > 1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
            <select
              v-model="inputs.unit"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="unit in units" :key="unit.value" :value="unit.value">{{ unit.text }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Trạng Thái</label>
            <select
              v-model="inputs.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option :value="null"></option>
              <option value="still">Còn hàng</option>
              <option value="runningOut">Sắp hết</option>
              <option value="over">Đã hết</option>
            </select>
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng tối thiểu</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn vị</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="item in items" 
                :key="item.id"
                :class="{
                  'bg-yellow-50': item.quantity <= item.min_quantity && item.quantity > 0,
                  'bg-red-50': item.quantity <= 0
                }">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.stt }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ currencyFormat(item.quantity) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ currencyFormat(item.min_quantity) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.unit_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex space-x-2">
                    <button
                      @click="addQuantity(item.id, item.quantity, item.unit_name)"
                      title="Plus quantity"
                      class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      <i class="fa fa-plus" />
                    </button>
                    <button
                      @click="minusQuantity(item.id, item.quantity, item.unit_name)"
                      title="Minus quantity"
                      class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      <i class="fa fa-minus" />
                    </button>
                    <button
                      @click="updateQuantity(item.id, item.quantity, item.unit_name)"
                      title="Update quantity"
                      class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      <i class="fa fa-balance-scale" />
                    </button>
                    <button
                      @click="edit(item.id)"
                      title="Edit"
                      class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      <i class="fa fa-edit" />
                    </button>
                    <button
                      @click="deleted(item.id, item.name, item.stt)"
                      title="Delete"
                      class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      <i class="fa fa-trash" />
                    </button>
                  </div>
                </td>
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

    <!-- Modal Add Quantity -->
    <TransitionRoot appear :show="showAddModal" as="template">
      <Dialog as="div" @close="showAddModal = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 text-center mb-4">
                  Thêm số lượng
                </DialogTitle>

                <div v-show="saving" class="text-center mb-4">
                  <i class="fa fa-spinner fa-spin fa-3x text-blue-500"></i>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng hiện tại</label>
                    <div class="flex items-center">
                      <input
                        v-model="quantityChange.currentQuantity"
                        type="text"
                        disabled
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                      <label class="pl-2">{{ quantityChange.unit_name }}</label>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng thêm vào<span class="text-red-500">*</span>
                    </label>
                    <div class="flex items-center">
                      <input
                        v-model="quantityChange.quantityBonus"
                        type="text"
                        autocomplete="new-password"
                        maxlength="11"
                        @keyup="integerAndPointOnly($event.target)"
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :class="{ 'border-red-500': errorQuantityBonus }">
                      <label class="pl-2">{{ quantityChange.unit_name }}</label>
                    </div>
                    <p v-if="errorQuantityBonus" class="text-red-500 text-sm mt-1">Vui lòng nhập số lượng thêm vào</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Nguyên nhân thêm<span class="text-red-500">*</span>
                    </label>
                    <textarea
                      v-model="quantityChange.reasonBonus"
                      rows="3"
                      maxlength="255"
                      placeholder="Nhập hàng"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :class="{ 'border-red-500': errorReasonBonus }"></textarea>
                    <p v-if="errorReasonBonus" class="text-red-500 text-sm mt-1">Vui lòng nhập nguyên nhân thêm</p>
                  </div>
                </div>

                <div class="mt-6 text-center">
                  <button
                    @click="confirmBonusQuantity"
                    class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200">
                    Xác nhận
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal Minus Quantity -->
    <TransitionRoot appear :show="showMinusModal" as="template">
      <Dialog as="div" @close="showMinusModal = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 text-center mb-4">
                  Giảm số lượng
                </DialogTitle>

                <div v-show="saving" class="text-center mb-4">
                  <i class="fa fa-spinner fa-spin fa-3x text-blue-500"></i>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng hiện tại</label>
                    <div class="flex items-center">
                      <input
                        v-model="quantityChange.currentQuantity"
                        type="text"
                        disabled
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                      <label class="pl-2">{{ quantityChange.unit_name }}</label>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng giảm đi<span class="text-red-500">*</span>
                    </label>
                    <div class="flex items-center">
                      <input
                        v-model="quantityChange.quantityBonus"
                        type="text"
                        autocomplete="new-password"
                        maxlength="11"
                        @keyup="integerAndPointOnly($event.target)"
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :class="{ 'border-red-500': errorQuantityBonus }">
                      <label class="pl-2">{{ quantityChange.unit_name }}</label>
                    </div>
                    <p v-if="errorQuantityBonus" class="text-red-500 text-sm mt-1">Vui lòng nhập số lượng giảm đi</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Nguyên nhân giảm<span class="text-red-500">*</span>
                    </label>
                    <textarea
                      v-model="quantityChange.reasonBonus"
                      rows="3"
                      maxlength="255"
                      placeholder="Hư hỏng"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :class="{ 'border-red-500': errorReasonBonus }"></textarea>
                    <p v-if="errorReasonBonus" class="text-red-500 text-sm mt-1">Vui lòng nhập nguyên nhân giảm</p>
                  </div>
                </div>

                <div class="mt-6 text-center">
                  <button
                    @click="confirmBonusQuantity"
                    class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200">
                    Xác nhận
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal Update Quantity -->
    <TransitionRoot appear :show="showUpdateModal" as="template">
      <Dialog as="div" @close="showUpdateModal = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 text-center mb-4">
                  Cập nhật số lượng
                </DialogTitle>

                <div v-show="saving" class="text-center mb-4">
                  <i class="fa fa-spinner fa-spin fa-3x text-blue-500"></i>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng cũ</label>
                    <div class="flex items-center">
                      <input
                        v-model="quantityChange.currentQuantity"
                        type="text"
                        disabled
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                      <label class="pl-2">{{ quantityChange.unit_name }}</label>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng mới<span class="text-red-500">*</span>
                    </label>
                    <div class="flex items-center">
                      <input
                        v-model="quantityChange.quantityBonus"
                        type="text"
                        autocomplete="new-password"
                        maxlength="11"
                        @keyup="integerAndPointOnly($event.target)"
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :class="{ 'border-red-500': errorQuantityBonus }">
                      <label class="pl-2">{{ quantityChange.unit_name }}</label>
                    </div>
                    <p v-if="errorQuantityBonus" class="text-red-500 text-sm mt-1">Vui lòng nhập số lượng mới</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Nguyên nhân thay đổi<span class="text-red-500">*</span>
                    </label>
                    <textarea
                      v-model="quantityChange.reasonBonus"
                      rows="3"
                      maxlength="255"
                      placeholder="Kiểm kê hàng ngày"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :class="{ 'border-red-500': errorReasonBonus }"></textarea>
                    <p v-if="errorReasonBonus" class="text-red-500 text-sm mt-1">Vui lòng nhập nguyên nhân thay đổi</p>
                  </div>
                </div>

                <div class="mt-6 text-center">
                  <button
                    @click="confirmUpdateQuantity"
                    class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200">
                    Xác nhận
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import adminAPI from '@/api/admin'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { popToast } = useToast()

// Data
const inputs = ref({
  name: null,
  unit: null,
  status: null
})

const items = ref([])
const units = ref([{ value: null, text: '' }])
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
const showAddModal = ref(false)
const showMinusModal = ref(false)
const showUpdateModal = ref(false)

// Computed
const errorQuantityBonus = computed(() => {
  return checkInfo(quantityChange.value.quantityBonus)
})

const errorReasonBonus = computed(() => {
  return checkInfo(quantityChange.value.reasonBonus)
})

// Methods
const checkInfo = (info) => {
  return click.value && (info == null || info.length <= 0)
}

const checkValidate = () => {
  return !(errorQuantityBonus.value || errorReasonBonus.value)
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

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  search()
}

const checkRowVariant = () => {
  for (let index in items.value) {
    if (items.value[index].quantity > items.value[index].min_quantity) {
      delete items.value[index]._rowVariant
    } else {
      if (items.value[index].quantity <= items.value[index].min_quantity && items.value[index].quantity > 0) {
        items.value[index]._rowVariant = 'warning'
      } else {
        if (items.value[index].quantity <= 0) {
          items.value[index]._rowVariant = 'danger'
        }
      }
    }
  }
}

const search = () => {
  if (loading.value) { return }

  onSearch.value = true
  loading.value = true

  const param = {
    name: inputs.value.name,
    unit: inputs.value.unit,
    status: inputs.value.status,
    limit: pageLimit.value,
    offset: offset.value
  }

  adminAPI.searchResource(param).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      const it = res.data.data.resource
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
    checkRowVariant()
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onSearch.value = false
    loading.value = false
  })
}

const getUnitOptions = () => {
  adminAPI.getListUnitOption().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      const unitsList = res.data.data
      for (let index in unitsList) {
        units.value.push(unitsList[index])
      }
    }
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const deleted = (id, name, rowIndex) => {
  if (id && name) {
    if (confirm(`Xóa ${name}. Bạn có chắc không?`)) {
      adminAPI.deleteResource(id).then(() => {
        const indexTemp = commonFunc.updateIndex(rowIndex - 1, listIdDeleted.value)
        items.value.splice(indexTemp, 1)
        listIdDeleted.value.push(rowIndex - 1)
        totalRow.value = totalRow.value - 1
      }).catch(err => {
        const errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  }
}

const addQuantity = (id, quantity, unit_name) => {
  quantityChange.value.id = id
  quantityChange.value.currentQuantity = quantity
  quantityChange.value.unit_name = unit_name
  quantityChange.value.type = 'plus'
  quantityChange.value.reasonBonus = 'Nhập hàng'
  quantityChange.value.quantityBonus = null
  click.value = false
  showAddModal.value = true
}

const minusQuantity = (id, quantity, unit_name) => {
  quantityChange.value.id = id
  quantityChange.value.currentQuantity = quantity
  quantityChange.value.unit_name = unit_name
  quantityChange.value.type = 'minus'
  quantityChange.value.reasonBonus = 'Hư hỏng'
  quantityChange.value.quantityBonus = null
  click.value = false
  showMinusModal.value = true
}

const updateQuantity = (id, quantity, unit_name) => {
  quantityChange.value.id = id
  quantityChange.value.currentQuantity = quantity
  quantityChange.value.unit_name = unit_name
  quantityChange.value.reasonBonus = 'Kiểm kê hàng'
  quantityChange.value.quantityBonus = null
  click.value = false
  showUpdateModal.value = true
}

const confirmBonusQuantity = () => {
  click.value = true

  if (!checkValidate()) {
    return
  }

  saving.value = true

  adminAPI.bonusQuantityResource(quantityChange.value).then(res => {
    if (res != null && res.data != null) {
      if (res.data.status == 200) {
        for (let index in items.value) {
          if (items.value[index].id == quantityChange.value.id) {
            if (quantityChange.value.type == 'plus') {
              items.value[index].quantity = Math.round((parseFloat(items.value[index].quantity) + parseFloat(quantityChange.value.quantityBonus)) * 1000) / 1000
            } else {
              items.value[index].quantity = Math.round((parseFloat(items.value[index].quantity) - parseFloat(quantityChange.value.quantityBonus)) * 1000) / 1000
            }
            checkRowVariant()
          }
        }

        popToast('success', 'Cập nhật số lượng thành công ')

        quantityChange.value.id = null
        quantityChange.value.currentQuantity = null
        quantityChange.value.quantityBonus = null
        quantityChange.value.reasonBonus = null
        quantityChange.value.type = null
        click.value = false

        showAddModal.value = false
        showMinusModal.value = false
      }
    }
    saving.value = false
  }).catch(err => {
    saving.value = false
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const confirmUpdateQuantity = () => {
  click.value = true

  if (!checkValidate()) {
    return
  }

  saving.value = true

  let quantityChangeValue = parseFloat(quantityChange.value.currentQuantity) - parseFloat(quantityChange.value.quantityBonus)
  if (quantityChangeValue > 0) {
    quantityChange.value.type = 'minus'
  } else {
    quantityChange.value.type = 'plus'
  }
  quantityChange.value.quantityBonus = quantityChangeValue.toString().replace('-', '')

  adminAPI.bonusQuantityResource(quantityChange.value).then(res => {
    if (res != null && res.data != null) {
      if (res.data.status == 200) {
        for (let index in items.value) {
          if (items.value[index].id == quantityChange.value.id) {
            if (quantityChange.value.type == 'plus') {
              items.value[index].quantity = Math.round((parseFloat(items.value[index].quantity) + parseFloat(quantityChange.value.quantityBonus)) * 1000) / 1000
            } else {
              items.value[index].quantity = Math.round((parseFloat(items.value[index].quantity) - parseFloat(quantityChange.value.quantityBonus)) * 1000) / 1000
            }
            checkRowVariant()
          }
        }

        popToast('success', 'Cập nhật số lượng thành công ')

        quantityChange.value.id = null
        quantityChange.value.currentQuantity = null
        quantityChange.value.quantityBonus = null
        quantityChange.value.reasonBonus = null
        quantityChange.value.type = null
        click.value = false

        showUpdateModal.value = false
      }
    }
    saving.value = false
  }).catch(err => {
    saving.value = false
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const currencyFormat = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const integerAndPointOnly = (item) => {
  const result = commonFunc.integerAndPointOnly(item.value)
  item.value = result
}

const edit = (id) => {
  router.push('/resource/index/' + id)
}

const goToAdd = () => {
  router.push('/resource/index')
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', onScroll)
  getUnitOptions()
  search()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
