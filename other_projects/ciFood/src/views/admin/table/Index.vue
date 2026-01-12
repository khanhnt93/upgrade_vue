<template>
  <div class="container">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12">
            <button
              class="px-4 py-2 border border-gray-600 text-gray-600 rounded-md hover:bg-gray-50 transition-colors min-w-[120px]"
              @click="back">
              Quay lại
            </button>

            <button
              class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors min-w-[120px] float-right disabled:opacity-50 disabled:cursor-not-allowed"
              @click="save"
              :disabled="saving">
              Lưu
            </button>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <h4 class="mt-2 text-center text-2xl font-semibold">Bàn Ăn</h4>
          </div>
        </div>
        <hr class="my-4"/>

        <!-- Loading -->
        <div v-show="loading" class="flex justify-center items-center py-4">
          <svg class="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label class="font-medium">Tên <span class="text-red-500">*</span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              id="name"
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorName }"
              v-model="table.name">
            <div v-if="errorName" class="text-red-500 text-sm mt-1">
              Vui lòng nhập tên
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label class="font-medium">Loại <span class="text-red-500">*</span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <select
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorType }"
              v-model="table.type">
              <option v-for="option in typeOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
            <div v-if="errorType" class="text-red-500 text-sm mt-1">
              Vui lòng chọn loại bàn
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label class="font-medium">Khu vực bàn</label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <select
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="table.group_table_id">
              <option v-for="option in groupTableOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label class="font-medium">Thứ tự xuất hiện</label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              id="index_sort"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="table.index_sort"
              @keyup="integerOnly($event.target)"
              maxlength="3">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()

const table = ref({
  name: null,
  type: null,
  group_table_id: null,
  index_sort: null,
})

const typeOptions = ref([
  {value: null, text: ''},
  {value: 'take_away', text: 'Take Away'},
  {value: 'default', text: 'Thường'}
])

const groupTableOptions = ref([
  {value: null, text: ''},
])

const click = ref(false)
const saving = ref(false)
const loading = ref(false)

const errorName = computed(() => {
  return checkInfo(table.value.name)
})

const errorType = computed(() => {
  return checkInfo(table.value.type)
})

const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkValidate = () => {
  return !(errorName.value || errorType.value)
}

/**
 * Get detail
 */
const getTableDetail = async () => {
  const tableId = route.params.id
  if (tableId) {
    loading.value = true

    try {
      const res = await adminAPI.getTableDetail(tableId)
      if (res != null && res.data != null && res.data.data != null) {
        table.value = res.data.data
      }
      loading.value = false
    } catch (err) {
      loading.value = false
      const errorMess = commonFunc.handleStaffError(err)
      showToast(errorMess, 'danger')
    }
  }
}

/**
 * Get list group table options
 */
const getListGroupTableOptions = async () => {
  try {
    const res = await adminAPI.getListGroupTableOptions()
    if (res != null && res.data != null && res.data.data != null) {
      const options = res.data.data
      for (let i in options) {
        const item = {value: options[i].id, text: options[i].name}
        groupTableOptions.value.push(item)
      }
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

/**
 * Back to list
 */
const back = () => {
  router.push('/table/list')
}

/**
 * Save
 */
const save = async () => {
  click.value = true
  saving.value = true
  const result = checkValidate()

  if (result) {
    const tableId = route.params.id

    try {
      if (tableId) {
        // Edit
        const tableData = table.value
        tableData.id = tableId
        const res = await adminAPI.editTable(tableData)
        saving.value = false
        if (res != null && res.data != null) {
          if (res.data.status == 200) {
            showToast('Cập nhật bàn ăn thành công!!! ', 'success')
          }
        }
      } else {
        // Add
        const res = await adminAPI.addTable(table.value)
        saving.value = false
        if (res != null && res.data != null) {
          if (res.data.status == 200) {
            router.push("/table/list")
          }
        }
      }
    } catch (err) {
      saving.value = false
      let message = ""
      if (err.response?.data?.status == 422) {
        message = err.response.data.mess
      } else {
        message = "Lỗi hệ thống"
      }
      alert(message)
    }
  } else {
    saving.value = false
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

onMounted(() => {
  // Get list options group table
  getListGroupTableOptions()

  // Get table detail
  getTableDetail()
})
</script>
