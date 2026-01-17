<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <button class="float-right px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 btn-width-120" @click="gotoAdd()">
          Thêm
        </button>
      </div>

      <div class="clear-both">
        <h4 class="mt-1 text-center text-header font-bold">Danh Sách Nhân Viên</h4>
      </div>
      <hr class="my-4">

      <!-- Search Filters -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block mb-2">Tên</label>
          <input id="name" v-model="inputs.name" type="text" maxlength="100" autocomplete="new-password" class="form-control w-full">
        </div>
        <div>
          <label class="block mb-2">Số Điện Thoại</label>
          <input id="phone" v-model="inputs.phone" type="text" maxlength="20" autocomplete="new-password" class="form-control w-full" @keyup="integerOnly($event.target)">
        </div>
        <div>
          <label class="block mb-2">Quyền</label>
          <select id="permision" v-model="inputs.role" class="form-control w-full">
            <option v-for="option in roleOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
        </div>
        <div>
          <label class="block mb-2 text-white">Xem</label>
          <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 btn-width-120 w-full" :disabled="onSearch" @click.prevent="prepareToSearch">
            Tìm Kiếm
          </button>
        </div>
      </div>

      <div class="mb-4">Số kết quả: {{totalRow}}</div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 border">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">STT</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Tên</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Số Điện Thoại</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Quyền</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Ngày Tạo</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border actions-cell"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap border">{{ item.stt }}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{ item.phone_number }}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{ item.role_name }}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{ item.created_at }}</td>
              <td class="px-4 py-3 whitespace-nowrap border actions-cell">
                <div class="flex space-x-2">
                  <button @click="edit(item.id)" title="Edit" class="text-blue-600 hover:text-blue-900">
                    <i class="fa fa-edit" />
                  </button>
                  <button @click="deleted(item.id, item.name, item.stt)" title="Delete" class="text-red-600 hover:text-red-900">
                    <i class="fa fa-trash" />
                  </button>
                  <button v-if="isRoot" @click="showModalConfirmResetPass(item)" title="Reset password" class="text-green-600 hover:text-green-900">
                    <i class="fa fa-refresh" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading -->
      <span v-show="loading" class="loading-more"><icon name="loading" width="60" /></span>
      <span v-if="hasNext === false" class="loading-more">--Hết--</span>
      <span v-if="hasNext === true && totalRow != 0" class="loading-more"><i class="fa fa-angle-double-down has-next"></i></span>
    </div>

    <!-- Reset Password Modal -->
    <div v-if="showResetModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h5 class="text-center text-header font-bold mb-4">Reset password</h5>
        <hr class="my-4">
        <p class="mb-2">Nhân viên: <b>{{currentStaff.name}}</b></p>
        <p class="mb-4">Số điện thoại: <b>{{currentStaff.phone_number}}</b></p>
        <div v-if="!resetting" class="text-center mt-4 space-x-2">
          <button class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 btn-width-120" @click="hideModalConfirmResetPass()">
            Đóng
          </button>
          <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 btn-width-120" @click="resetPass()">
            Xác nhận
          </button>
        </div>
        <div v-if="resetting" class="text-center">
          <span class="loading-more"><icon name="loading" width="60" /></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import staffAPI from '@/api/staff'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'

const router = useRouter()
const authStore = useAuthStore()
const { popToast } = useToast()

const roleOptions = ref([])
const fields = ref([
  { key: 'stt', label: 'STT' },
  { key: 'name', label: 'Tên' },
  { key: 'phone_number', label: 'Số Điện Thoại' },
  { key: 'role_name', label: 'Quyền' },
  { key: 'created_at', label: 'Ngày Tạo' },
  { key: 'actions', label: '', class: 'actions-cell' }
])
const items = ref([])
const inputs = ref({ name: '', phone: '', role: '' })
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
const resetting = ref(false)
const showResetModal = ref(false)

const rows = computed(() => items.value.length)

const onScroll = (event) => {
  if (onSearch.value) return
  event.preventDefault()
  var body = document.body
  var html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if (hasNext.value) {
      offset.value = offset.value + 10
      loadByScroll.value = true
      search()
    }
  }
}

const getRoleOption = () => {
  adminAPI.getRoleOption().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      roleOptions.value = [{ value: null, text: '' }]
      var roles = res.data.data
      if (roles) {
        for (let i in roles) {
          roleOptions.value.push(roles[i])
        }
      }
    }
  })
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  search()
}

const deleted = (id, name, rowIndex) => {
  if (id && name) {
    if (confirm('Xóa ' + name + ". Bạn có chắc không?")) {
      adminAPI.deleteStaff(id).then(res => {
        let indexTemp = commonFunc.updateIndex(rowIndex - 1, listIdDeleted.value)
        items.value.splice(indexTemp, 1)
        listIdDeleted.value.push(rowIndex - 1)
        totalRow.value = totalRow.value - 1
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  }
}

const edit = (id) => {
  router.push('/staff/index/' + id)
}

const gotoAdd = () => {
  router.push('/staff/index/')
}

const search = () => {
  if (loading.value) return
  onSearch.value = true
  loading.value = true

  let req = {
    "name": inputs.value.name,
    "phone_number": inputs.value.phone,
    "role_id": inputs.value.role,
    "store_name": "store ".concat(authStore.user.storeId),
    "limit": pageLimit.value,
    "offset": offset.value
  }

  adminAPI.searchStaff(req, offset.value).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let it = res.data.data.staffs
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
    popToast('danger', errorMess)
    onSearch.value = false
    loading.value = false
  })
}

const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
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
  if (resetting.value) return
  resetting.value = true

  let params = {
    "id": currentStaff.value.id,
    "phone": currentStaff.value.phone_number
  }

  staffAPI.resetPass(params).then(res => {
    if (res != null && res.data != null && res.data.status == 200) {
      hideModalConfirmResetPass()
      let message = "Mật khẩu mới: " + currentStaff.value.phone_number
      alert('Reset Mật Khẩu Thành Công\n' + message)
    }
    resetting.value = false
  }).catch(err => {
    resetting.value = false
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

onMounted(() => {
  if (authStore.user && authStore.user.isRoot) {
    isRoot.value = true
  }
  getRoleOption()
  window.addEventListener('scroll', onScroll)
  search()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
