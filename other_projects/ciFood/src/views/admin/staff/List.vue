<template>
  <div class="container">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-end mb-4">
          <button
            class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors min-w-[120px]"
            @click="gotoAdd">
            Thêm
          </button>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <h4 class="mt-2 text-center text-2xl font-semibold">Danh Sách Nhân Viên</h4>
          </div>
        </div>
        <hr class="my-4"/>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-4">
            <label class="block mb-2 font-medium">Tên</label>
            <input
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="inputs.name">
          </div>
          <div class="col-span-12 md:col-span-4">
            <label class="block mb-2 font-medium">Số Điện Thoại</label>
            <input
              type="text"
              maxlength="20"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="inputs.phone"
              @keyup="integerOnly($event.target)">
          </div>
          <div class="col-span-12 md:col-span-4">
            <label class="block mb-2 font-medium">Quyền</label>
            <select
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="inputs.role">
              <option v-for="option in roleOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
        </div>

        <div class="mb-4 flex justify-end">
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Số Điện Thoại</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Quyền</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Ngày Tạo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.stt}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.name}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.phone}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.permission}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.createDate}}</td>
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
                      @click="deleted(item.id, item.name, item.stt)"
                      title="Delete">
                      <i class="fa fa-trash" />
                    </button>
                    <button
                      v-if="isRoot"
                      class="p-2 text-blue-600 hover:text-blue-800"
                      @click="showModalConfirmResetPass(item)"
                      title="Reset password">
                      <i class="fa fa-refresh" />
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

    <!-- Reset Password Modal -->
    <TransitionRoot appear :show="isResetModalOpen" as="template">
      <Dialog as="div" @close="hideModalConfirmResetPass" class="relative z-10">
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
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 text-center">
                  Reset password
                </DialogTitle>
                <hr class="my-4"/>

                <div class="mt-2">
                  <p class="text-sm text-gray-900">
                    Nhân viên: <b>{{currentStaff.name}}</b>
                  </p>
                  <p class="text-sm text-gray-900">
                    Số điện thoại: <b>{{currentStaff.phone}}</b>
                  </p>
                </div>

                <div v-if="!reseting" class="mt-6 flex justify-center space-x-2">
                  <button
                    type="button"
                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors min-w-[120px]"
                    @click="hideModalConfirmResetPass">
                    Đóng
                  </button>
                  <button
                    type="button"
                    class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors min-w-[120px]"
                    @click="resetPass">
                    Xác nhận
                  </button>
                </div>

                <div v-if="reseting" class="flex justify-center items-center py-4">
                  <svg class="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
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
import { useAuthStore } from '@/store/auth'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import adminAPI from '@/api/admin'
import staffAPI from '@/api/staff'
import Mapper from '@/mapper/staff'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

const roleOptions = ref([])
const items = ref([])
const inputs = ref({
  name: '',
  phone: '',
  role: ''
})

const loadByScroll = ref(false)
const onSearch = ref(false)
const hasNext = ref(true)
const loading = ref(false)
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const listIdDeleted = ref([])
const totalRow = ref(0)
const currentStaff = ref({})
const isRoot = ref(false)
const reseting = ref(false)
const isResetModalOpen = ref(false)

const rows = computed(() => items.value.length)

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

const getRoleOption = async () => {
  try {
    const res = await adminAPI.getRoleOption()
    if (res != null && res.data != null && res.data.data != null) {
      roleOptions.value = [{value: null, text: ''}]

      const roles = res.data.data
      if (roles) {
        for (let i in roles) {
          roleOptions.value.push(roles[i])
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  search()
}

const deleted = async (id, name, rowIndex) => {
  if (id && name) {
    const confirmed = confirm('Xóa ' + name + ". Bạn có chắc không?")
    if (confirmed) {
      try {
        await adminAPI.deleteStaff(id)

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

const edit = (id) => {
  router.push('/staff/index/' + id)
}

const gotoAdd = () => {
  router.push('/staff/index/')
}

const search = async () => {
  if (loading.value) { return }

  onSearch.value = true
  loading.value = true

  const req = {
    "name": inputs.value.name,
    "phone_number": inputs.value.phone,
    "role_id": inputs.value.role,
    "store_name": "store ".concat(authStore.user.storeId),
    "limit": pageLimit.value,
    "offset": offset.value
  }

  try {
    const res = await adminAPI.searchStaff(req, offset.value)
    if (res != null && res.data != null && res.data.data != null) {
      const it = Mapper.mapStaffModelSearchToDto(res.data.data.staffs, offset.value)
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

const showModalConfirmResetPass = (staff) => {
  currentStaff.value = staff
  isResetModalOpen.value = true
}

const hideModalConfirmResetPass = () => {
  isResetModalOpen.value = false
}

const resetPass = async () => {
  if (reseting.value) { return }

  reseting.value = true

  const params = {
    "id": currentStaff.value.id,
    "phone": currentStaff.value.phone
  }

  try {
    const res = await staffAPI.resetPass(params)
    if (res != null && res.data != null && res.data.status === 200) {
      hideModalConfirmResetPass()

      const message = "Mật khẩu mới: " + currentStaff.value.phone
      alert("Reset Mật Khẩu Thành Công\n\n" + message)
    }
    reseting.value = false
  } catch (err) {
    reseting.value = false
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

const integerOnly = (item) => {
  const valueInput = item.value
  const result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

onMounted(() => {
  if (authStore.user && authStore.user.isRoot) {
    isRoot.value = true
  }

  getRoleOption()
  window.addEventListener('scroll', onScroll)
  window.addEventListener('resize', deleted)
  search()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', deleted)
})
</script>
