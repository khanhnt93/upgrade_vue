<template>
  <div class="container-fluid px-4 py-4">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Header Row -->
        <div class="flex justify-end mb-4">
          <button
            @click="gotoAdd"
            class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200">
            Thêm
          </button>
        </div>

        <!-- Title -->
        <h4 class="text-xl font-semibold text-center mb-4">Admin Store</h4>
        <hr class="mb-4">

        <!-- Search Filters -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên</label>
            <input
              v-model="inputs.name"
              type="text"
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Số Điện Thoại</label>
            <input
              v-model="inputs.phone_number"
              type="text"
              maxlength="20"
              @keyup="integerOnly($event.target)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quyền</label>
            <select
              v-model="inputs.role_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="option in options" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên Cửa Hàng</label>
            <input
              v-model="inputs.store_name"
              type="text"
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
            <select
              v-model="inputs.brand_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="option in optionsBrand" :key="option.value" :value="option.value">{{ option.text }}</option>
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

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Điện Thoại</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thương hiệu</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cửa Hàng</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quyền</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Tạo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.stt }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.phone_number }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.brand_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.store_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.role_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.created_at }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex flex-col space-y-2">
                    <div class="flex space-x-2">
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
                    <button
                      @click="showModalConfirmResetPass(item)"
                      title="Reset password"
                      class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      <i class="fa fa-refresh" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading -->
        <div v-show="loading" class="text-center mt-4">
          <i class="fa fa-spinner fa-spin fa-3x text-blue-500"></i>
        </div>

        <!-- End marker -->
        <div class="text-center mt-4">
          <span v-if="hasNext === false" class="text-gray-500">Hết</span>
        </div>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <TransitionRoot appear :show="showResetModal" as="template">
      <Dialog as="div" @close="hideModalConfirmResetPass" class="relative z-50">
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
                  Reset password
                </DialogTitle>
                <hr class="mb-4">

                <div class="space-y-2 mb-4">
                  <p>Nhân viên: <b>{{ currentStaff.name }}</b></p>
                  <p>Số điện thoại: <b>{{ currentStaff.phone_number }}</b></p>
                </div>

                <div v-if="!reseting" class="flex justify-center space-x-2 mt-4">
                  <button
                    @click="hideModalConfirmResetPass"
                    class="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200">
                    Đóng
                  </button>
                  <button
                    @click="resetPass"
                    class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200">
                    Xác nhận
                  </button>
                </div>

                <div v-if="reseting" class="text-center">
                  <i class="fa fa-spinner fa-spin fa-3x text-blue-500"></i>
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
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import superAdminAPI from '@/api/superAdmin'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { popToast } = useToast()

// Data
const inputs = ref({
  name: '',
  phone_number: '',
  role_id: '',
  store_name: '',
  brand_id: null
})

const options = ref([
  { value: '', text: 'Tất cả' },
  { value: '1', text: 'Staff' },
  { value: '2', text: 'Admin' },
])

const optionsBrand = ref([])
const items = ref([])
const loadByScroll = ref(false)
const onSearch = ref(false)
const hasNext = ref(true)
const loading = ref(false)
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const listIdDeleted = ref([])
const currentStaff = ref({})
const reseting = ref(false)
const showResetModal = ref(false)

// Methods
const onScroll = (event) => {
  if (onSearch.value) {
    return
  }
  event.preventDefault()
  const body = document.body
  const html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if (hasNext.value) {
      offset.value = offset.value + 10
      loadByScroll.value = true
      search()
    }
  }
}

const getOptionBrand = () => {
  superAdminAPI.getBrandOption().then(res => {
    optionsBrand.value = [{ "value": null, "text": "" }]
    if (res && res.data && res.data.data) {
      const brands = res.data.data
      for (const index in brands) {
        const brand = {
          value: brands[index].value,
          text: brands[index].text
        }
        optionsBrand.value.push(brand)
      }
    }
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  search()
}

const deleted = (id, name, rowIndex) => {
  if (confirm(`Xóa [${name}]. Bạn có chắc không?`)) {
    superAdminAPI.deleteAdminStore(id).then(res => {
      const indexTemp = commonFunc.updateIndex(rowIndex - 1, listIdDeleted.value)
      items.value.splice(indexTemp, 1)
      listIdDeleted.value.push(rowIndex - 1)
      popToast('success', 'Xóa thành công')
    }).catch(err => {
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const edit = (id) => {
  router.push('/admin-store/index/' + id)
}

const gotoAdd = () => {
  router.push('/admin-store/index/')
}

const search = () => {
  if (loading.value) { return }

  onSearch.value = true
  loading.value = true

  const req = {
    "name": inputs.value.name,
    "phone_number": inputs.value.phone_number,
    "role_id": inputs.value.role_id,
    "store_name": inputs.value.store_name,
    "brand_id": inputs.value.brand_id,
    "limit": pageLimit.value,
    "offset": offset.value
  }

  superAdminAPI.searchAdminStore(req, offset.value).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      const it = res.data.data.staffs

      if (loadByScroll.value) {
        const temp = items.value
        const newArray = temp.concat(it)
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
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onSearch.value = false
    loading.value = false
  })
}

const integerOnly = (item) => {
  const valueInput = item.value
  const result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

const showModalConfirmResetPass = (staff) => {
  currentStaff.value = staff
  showResetModal.value = true
}

const hideModalConfirmResetPass = () => {
  showResetModal.value = false
}

const resetPass = () => {
  if (reseting.value) { return }

  reseting.value = true

  const params = {
    "id": currentStaff.value.id,
    "phone": currentStaff.value.phone_number
  }

  superAdminAPI.resetPass(params).then(res => {
    if (res != null && res.data != null && res.data.status == 200) {
      hideModalConfirmResetPass()
      const message = "Mật khẩu mới: " + currentStaff.value.phone_number
      popToast('success', 'Reset Mật Khẩu Thành Công - ' + message)
    }
    reseting.value = false
  }).catch(err => {
    reseting.value = false
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

// Lifecycle
onMounted(() => {
  getOptionBrand()
  window.addEventListener('scroll', onScroll)
  search()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
