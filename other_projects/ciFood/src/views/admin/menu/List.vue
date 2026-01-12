<template>
  <div class="container">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-between mb-4">
          <button
            class="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors min-w-[120px]"
            @click="openModalImportFile">
            Upload
          </button>
          <button
            class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors min-w-[120px]"
            @click="goToAdd">
            Thêm
          </button>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <h4 class="mt-2 text-center text-2xl font-semibold">Danh Sách Thực Đơn</h4>
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
          <div class="col-span-12 md:col-span-3" v-if="groupMenus.length > 0">
            <label class="block mb-2 font-medium">Nhóm</label>
            <select
              id="group"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="inputs.group">
              <option v-for="option in groupMenus" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
          <div class="col-span-12 md:col-span-3">
            <label class="block mb-2 font-medium">Trạng Thái</label>
            <select
              id="status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="inputs.status">
              <option v-for="option in options" :key="option.value" :value="option.value">{{ option.text }}</option>
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Tên</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Giá</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Nhóm</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Trạng Thái</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.stt}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.name}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{formatCurrency(item.price)}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.group}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.status}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm border">
                  <div class="flex space-x-2">
                    <button
                      class="p-2 text-yellow-600 hover:text-yellow-800"
                      @click="edit(item.action)"
                      title="Edit">
                      <i class="fa fa-edit" />
                    </button>
                    <button
                      class="p-2 text-red-600 hover:text-red-800"
                      @click="deleted(item.action, item.name, item.stt)"
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

    <!-- Modal import menu -->
    <TransitionRoot appear :show="isImportModalOpen" as="template">
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
          <div class="fixed inset-0 bg-black/25" />
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
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 text-center mb-4">
                  Upload menu từ file excel
                </DialogTitle>

                <div class="text-left mb-4">
                  <p>
                    Tải xuống file mẫu:
                    <a target="_blank" href="https://api.cifood.vn/files/upload_excel_template/cifood_upload_menu_template.xlsx" class="text-blue-600 hover:text-blue-800 underline">
                      Tải xuống
                    </a>
                  </p>
                </div>

                <hr class="my-4"/>

                <div class="mb-4">
                  <label class="block mb-2 font-medium">Chọn file excel bạn muốn upload</label>
                  <input
                    type="file"
                    id="file"
                    ref="fileInput"
                    @change="handleFileUpload"
                    accept=".xlsx"
                    class="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>

                <div v-if="uploadErrorList.length > 0" class="mt-4">
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 border">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Dòng</th>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Mô tả lỗi</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(error, index) in uploadErrorList" :key="index" class="hover:bg-gray-50">
                          <td class="px-4 py-2 text-sm text-gray-900 border">{{error.row}}</td>
                          <td class="px-4 py-2 text-sm text-gray-900 border">{{error.mess}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="mt-6 flex justify-end">
                  <!-- Loading -->
                  <div v-show="uploading" class="flex items-center mr-4">
                    <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>

                  <button
                    v-show="!uploading"
                    type="button"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    @click="importMenuFromExcelFile"
                    :disabled="!fileUpload || uploading"
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
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/menu'
import GMMapper from '@/mapper/group_menu'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'

const router = useRouter()
const { showToast } = useToast()
const { formatCurrency } = useFormatters()

const inputs = ref({
  name: null,
  price: null,
  group: null,
  status: null
})

const items = ref([])
const options = ref([
  {value: null, text: ''},
  {value: 'true', text: 'Còn món'},
  {value: 'false', text: 'Hết món'}
])

const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const hasNext = ref(true)
const onSearch = ref(false)
const loadByScroll = ref(false)
const listIdDeleted = ref([])
const loading = ref(false)
const groupMenus = ref([])
const totalRow = ref(0)

const fileUpload = ref(null)
const fileInput = ref(null)
const uploading = ref(false)
const uploadErrorList = ref([])
const isImportModalOpen = ref(false)

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
const search = async () => {
  if (loading.value) { return }

  onSearch.value = true
  loading.value = true

  // Define params
  const param = {
    name: inputs.value.name,
    price: inputs.value.price,
    group: inputs.value.group,
    status: inputs.value.status,
    limit: pageLimit.value,
    offset: offset.value
  }

  try {
    const res = await adminAPI.searchMenu(param)
    if (res != null && res.data != null && res.data.data != null) {
      const it = Mapper.mapMenuModelToDto(res.data.data.menus, offset.value)
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
 * Load list option group menu
 */
const getGroupMenuOptions = async () => {
  try {
    const res = await adminAPI.getListGroupMenuOption()
    if (res != null && res.data != null && res.data.data != null) {
      groupMenus.value = GMMapper.mapGroupMenuOptionModelToDto(res.data.data)
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

/**
 * Delete
 */
const deleted = async (id, name, rowIndex) => {
  if (id && name) {
    const confirmed = confirm('Xóa ' + name + ". Bạn có chắc không?")
    if (confirmed) {
      try {
        await adminAPI.deleteMenu(id)

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
 * Only input integer
 */
const integerOnly = (item) => {
  const valueInput = item.value
  const result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

/**
 * Go to page edit
 */
const edit = (id) => {
  router.push('/menu/edit/' + id)
}

/**
 * Go to page add
 */
const goToAdd = () => {
  router.push('/menu/add')
}

/**
 * Show modal import from file
 */
const openModalImportFile = () => {
  isImportModalOpen.value = true
  uploadErrorList.value = []
}

/**
 * Close import modal
 */
const closeImportModal = () => {
  isImportModalOpen.value = false
  uploadErrorList.value = []
}

/**
 * Handle file upload
 */
const handleFileUpload = () => {
  fileUpload.value = fileInput.value.files[0]
  console.log(fileUpload.value)
}

/**
 * Import file
 */
const importMenuFromExcelFile = async () => {
  uploading.value = true
  const form_data = new FormData()
  form_data.append("importFile", fileUpload.value)

  try {
    const res = await adminAPI.importMenuFromExcelFile(form_data)
    if (res != null && res.data != null) {
      if (res.data.data && res.data.data.length == 0) {
        showToast('Upload menu thành công!', 'success')
        closeImportModal()
      } else {
        uploadErrorList.value = res.data.data
      }
    }
    prepareToSearch()
    uploading.value = false
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
    uploading.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  window.addEventListener('resize', deleted)

  // Load option group menu
  getGroupMenuOptions()

  // Load list when load page
  search()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', deleted)
})
</script>
