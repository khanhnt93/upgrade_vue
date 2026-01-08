<template>
  <div class="mx-auto px-4 py-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Action Buttons -->
      <div class="flex justify-end gap-2 mb-4">
        <button
          @click="openModalImportFile"
          class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
        >
          Upload
        </button>
        <button
          @click="goToAdd"
          class="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors"
        >
          Thêm
        </button>
      </div>

      <!-- Title -->
      <h4 class="text-2xl font-semibold text-center mb-4">Danh Sách Khách Hàng</h4>
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
          @click.prevent="prepareToSearch"
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
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Loại</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tên</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Số điện thoại</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Giới tính</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Ngày sinh</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tỉnh/Thành phố</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Quận/Huyện</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Địa chỉ</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Mã số thuế</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Điểm tích lũy</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Điểm khả dụng</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm">{{ item.stt }}</td>
              <td class="px-4 py-3 text-sm">{{ item.cus_type }}</td>
              <td class="px-4 py-3 text-sm">{{ item.name }}</td>
              <td class="px-4 py-3 text-sm">{{ item.phone_number }}</td>
              <td class="px-4 py-3 text-sm">{{ item.gender }}</td>
              <td class="px-4 py-3 text-sm">{{ item.birthday }}</td>
              <td class="px-4 py-3 text-sm">{{ item.city }}</td>
              <td class="px-4 py-3 text-sm">{{ item.district }}</td>
              <td class="px-4 py-3 text-sm">{{ item.address }}</td>
              <td class="px-4 py-3 text-sm">{{ item.mst }}</td>
              <td class="px-4 py-3 text-sm">{{ formatters.formatCurrency(item.point) }}</td>
              <td class="px-4 py-3 text-sm">{{ formatters.formatCurrency(item.remaining) }}</td>
              <td class="px-4 py-3 text-sm">
                <button
                  @click="edit(item.id)"
                  class="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <i class="fa fa-edit"></i>
                </button>
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

    <!-- Upload Modal -->
    <TransitionRoot appear :show="showImportModal" as="template">
      <Dialog as="div" @close="closeImportModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Upload khách hàng từ file excel
                </DialogTitle>

                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Chọn file excel bạn muốn upload
                  </label>
                  <input
                    type="file"
                    ref="fileInput"
                    @change="handleFileUpload"
                    accept=".xlsx"
                    class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div class="mt-6 flex justify-end gap-3">
                  <button
                    v-show="loading"
                    disabled
                    class="inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 cursor-not-allowed"
                  >
                    <i class="fa fa-spinner fa-spin mr-2"></i>
                    Đang tải...
                  </button>
                  <button
                    v-show="!uploading"
                    @click="importCustomerFromExcelFile"
                    :disabled="!fileUpload || uploading"
                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import customerApi from '@/api/customer'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'

const router = useRouter()
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
const fileUpload = ref(null)
const uploading = ref(false)
const showImportModal = ref(false)
const fileInput = ref(null)

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
  customerApi.getCustomerByStore(params).then(res => {
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

/**
 * Go to page edit
 */
const edit = (id) => {
  router.push('/customer/edit/' + id)
}

/**
 * Go to page add
 */
const goToAdd = () => {
  router.push('/customer/add')
}

/**
 * Show modal import from file
 */
const openModalImportFile = () => {
  showImportModal.value = true
}

/**
 * Close modal
 */
const closeImportModal = () => {
  showImportModal.value = false
}

/**
 * Import file
 */
const importCustomerFromExcelFile = () => {
  uploading.value = true
  const form_data = new FormData()
  form_data.append("importFile", fileUpload.value)
  customerApi.importCustomerFromExcelFile(form_data).then(res => {
    if (res != null && res.data != null) {
      // Load list when load page
      search()
      popToast('success', 'Upload khách hàng thành công!')
    }
    showImportModal.value = false
    uploading.value = false
  }).catch(err => {
    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)

    uploading.value = false
  })
}

/**
 * Handle file upload
 */
const handleFileUpload = () => {
  fileUpload.value = fileInput.value.files[0]
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
