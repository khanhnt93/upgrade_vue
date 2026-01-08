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
        <h4 class="text-xl font-semibold text-center mb-4">Danh Sách Công Nợ</h4>

        <!-- Search Filters -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên</label>
            <input
              v-model="inputs.customer_name"
              type="text"
              autocomplete="new-password"
              maxlength="75"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              v-model="inputs.customer_phone_number"
              type="text"
              autocomplete="new-password"
              maxlength="11"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              v-model="inputs.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value=""></option>
              <option value="1">Đã trả nợ</option>
              <option value="2">Đã xoá nợ</option>
              <option value="0">Đang nợ</option>
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

        <hr class="mb-4">

        <!-- Loading -->
        <div v-show="loading" class="text-center mb-4">
          <i class="fa fa-spinner fa-spin fa-3x text-blue-500"></i>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên KH</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Điện thoại</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Còn lại</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.customer_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.customer_phone_number }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.customer_address }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(item.total) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(item.remaining) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.status === 1 ? 'Đã trả nợ' : (item.status === 2 ? 'Đã xoá nợ' : 'Đang nợ') }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.description }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div v-show="item.status === 0" class="flex space-x-2">
                    <button
                      @click="openPayModal(item)"
                      title="Thanh toán"
                      class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      <i class="fa fa-check-square-o" />
                    </button>
                    <button
                      @click="edit(item.id)"
                      title="Sửa"
                      class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      <i class="fa fa-edit" />
                    </button>
                    <button
                      @click="deleted(item.id, item.customer_name)"
                      title="Xoá nợ"
                      class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      <i class="fa fa-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- End marker -->
        <div class="text-center mt-4">
          <span class="text-gray-500">--Hết--</span>
        </div>
      </div>
    </div>

    <!-- Pay Modal -->
    <TransitionRoot appear :show="showPayModal" as="template">
      <Dialog as="div" @close="showPayModal = false" class="relative z-50">
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
                  Thanh toán
                </DialogTitle>
                <hr class="mb-4">

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Số tiền còn lại</label>
                    <input
                      v-model="payData.remaining"
                      type="number"
                      disabled
                      class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Số tiền trả</label>
                    <input
                      v-model="payData.amount"
                      type="number"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  </div>
                </div>

                <div class="mt-6 text-right">
                  <button
                    @click="pay"
                    class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200">
                    Thanh toán
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'

const router = useRouter()
const { popToast } = useToast()
const { formatCurrency } = useFormatters()

// Data
const totalRow = ref(0)
const inputs = ref({
  customer_name: null,
  customer_phone_number: null,
  status: null
})

const items = ref([])
const payData = ref({
  id: null,
  amount: 0,
  remaining: 0
})

const loading = ref(false)
const onSearch = ref(false)
const showPayModal = ref(false)

// Methods
const prepareToSearch = () => {
  items.value = []
  search()
}

const deleted = (id, name) => {
  if (confirm(`Xóa nợ [${name}]. Bạn có chắc không?`)) {
    adminAPI.reliefPublicDebt(id).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        items.value = res.data.data
      }
      getAll()
      popToast('success', 'Xóa nợ thành công!!!')
    }).catch(err => {
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const edit = (id) => {
  router.push('/public-debt/edit/' + id)
}

const openPayModal = (pay) => {
  payData.value.id = pay.id
  payData.value.remaining = pay.remaining
  payData.value.amount = pay.remaining
  showPayModal.value = true
}

const pay = () => {
  if (payData.value.amount <= 0) {
    popToast('danger', 'Số tiền trả phải lớn hơn 0')
    return
  }

  adminAPI.payPublicDebt(payData.value).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      items.value = res.data.data
    }
    payData.value.id = null
    payData.value.amount = 0
    payData.value.remaining = 0
    showPayModal.value = false
    popToast('success', 'Đã thanh toán thành công!!')
    getAll()
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const goToAdd = () => {
  router.push('/public-debt/add')
}

const getAll = () => {
  loading.value = true

  adminAPI.getListPublicDebt().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      items.value = res.data.data
      totalRow.value = items.value.length
    }
    loading.value = false
  }).catch(err => {
    loading.value = false
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const search = () => {
  if (onSearch.value) {
    return
  }
  loading.value = true
  onSearch.value = true

  adminAPI.searchPublicDebit(inputs.value).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      items.value = res.data.data
      totalRow.value = items.value.length
    }
    loading.value = false
    onSearch.value = false
  }).catch(err => {
    loading.value = false
    onSearch.value = false
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

// Lifecycle
onMounted(() => {
  getAll()
})
</script>
