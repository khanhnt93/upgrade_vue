<template>
  <div class="container-fluid px-4 py-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Header with Add Button -->
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-2xl font-semibold text-center flex-1">Admin Store</h4>
          <button
            @click="gotoAdd"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Thêm
          </button>
        </div>

        <hr class="my-4 border-gray-200">

        <!-- Search Form -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên</label>
            <input
              v-model="inputs.name"
              type="text"
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Số Điện Thoại</label>
            <input
              v-model="inputs.phone_number"
              type="text"
              maxlength="20"
              @keyup="integerOnly($event.target)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quyền</label>
            <select
              v-model="inputs.role_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên Cửa Hàng</label>
            <input
              v-model="inputs.store_name"
              type="text"
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
            <select
              v-model="inputs.brand_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="option in optionsBrand" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>

        <!-- Search Button -->
        <div class="flex justify-end mb-4">
          <button
            @click="prepareToSearch"
            :disabled="onSearch"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Tìm Kiếm
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">STT</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">Tên</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">Số Điện Thoại</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">Thương hiệu</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">Cửa Hàng</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">Quyền</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">Ngày Tạo</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap text-sm border-r">{{ item.stt }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm border-r">{{ item.name }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm border-r">{{ item.phone_number }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm border-r">{{ item.brand_name }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm border-r">{{ item.store_name }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm border-r">{{ item.role_name }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm border-r">{{ item.created_at }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <div class="flex gap-2">
                    <button
                      @click="edit(item.id)"
                      title="Edit"
                      class="text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      <i class="fa fa-edit"></i>
                    </button>
                    <button
                      @click="deleted(item.id, item.name, item.stt)"
                      title="Delete"
                      class="text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      <i class="fa fa-trash"></i>
                    </button>
                    <button
                      @click="showModalConfirmResetPass(item)"
                      title="Reset password"
                      class="text-green-600 hover:text-green-800 focus:outline-none"
                    >
                      <i class="fa fa-refresh"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-4">
          <icon name="loading" width="60" />
        </div>
        <div v-if="hasNext === false" class="text-center py-4 text-gray-500">Hết</div>
      </div>
    </div>

    <!-- Modal xác nhận reset pass -->
    <div v-if="showResetPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h5 class="text-xl font-semibold text-center mb-4">Reset password</h5>
        <hr class="mb-4">

        <div class="mb-4">
          <p class="mb-2">Nhân viên: <strong>{{ currentStaff.name }}</strong></p>
          <p>Số điện thoại: <strong>{{ currentStaff.phone_number }}</strong></p>
        </div>

        <div v-if="!resetting" class="flex justify-center gap-4 mt-6">
          <button
            @click="hideModalConfirmResetPass"
            class="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Đóng
          </button>
          <button
            @click="resetPass"
            class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Xác nhận
          </button>
        </div>

        <div v-if="resetting" class="text-center py-4">
          <icon name="loading" width="60" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import superAdminAPI from '@/api/superAdmin'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { popToast } = useToast()

// Reactive state
const items = ref([])
const options = ref([
  { value: '', text: 'Tất cả' },
  { value: '1', text: 'Staff' },
  { value: '2', text: 'Admin' }
])
const optionsBrand = ref([])
const inputs = reactive({
  name: '',
  phone_number: '',
  role_id: '',
  store_name: '',
  brand_id: null
})

const loadByScroll = ref(false)
const onSearch = ref(false)
const hasNext = ref(true)
const loading = ref(false)
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const listIdDeleted = ref([])
const currentStaff = ref({})
const resetting = ref(false)
const showResetPasswordModal = ref(false)

// Methods
const onScroll = (event) => {
  if (onSearch.value) {
    return
  }
  event.preventDefault()
  const body = document.body
  const html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if (hasNext.value) {
      offset.value = offset.value + 10
      loadByScroll.value = true
      search()
    }
  }
}

const getOptionBrand = () => {
  superAdminAPI.getBrandOption().then(res => {
    optionsBrand.value = [{ value: null, text: '' }]
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
    superAdminAPI.deleteAdminStore(id).then(() => {
      const indexTemp = commonFunc.updateIndex(rowIndex - 1, listIdDeleted.value)
      items.value.splice(indexTemp, 1)
      listIdDeleted.value.push(rowIndex - 1)
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
    name: inputs.name,
    phone_number: inputs.phone_number,
    role_id: inputs.role_id,
    store_name: inputs.store_name,
    brand_id: inputs.brand_id,
    limit: pageLimit.value,
    offset: offset.value
  }

  superAdminAPI.searchAdminStore(req, offset.value).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      const it = res.data.data.staffs

      if (loadByScroll.value) {
        const temp = items.value
        items.value = temp.concat(it)
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
  showResetPasswordModal.value = true
}

const hideModalConfirmResetPass = () => {
  showResetPasswordModal.value = false
}

const resetPass = () => {
  if (resetting.value) { return }

  resetting.value = true

  const params = {
    id: currentStaff.value.id,
    phone: currentStaff.value.phone_number
  }

  superAdminAPI.resetPass(params).then(res => {
    if (res != null && res.data != null && res.data.status == 200) {
      hideModalConfirmResetPass()
      const message = 'Mật khẩu mới: ' + currentStaff.value.phone_number
      alert('Reset Mật Khẩu Thành Công\n\n' + message)
    }
    resetting.value = false
  }).catch(err => {
    resetting.value = false
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

// Lifecycle hooks
onMounted(() => {
  getOptionBrand()
  window.addEventListener('scroll', onScroll)
  search()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.loading-more {
  display: block;
  text-align: center;
  padding: 1rem;
}
</style>
