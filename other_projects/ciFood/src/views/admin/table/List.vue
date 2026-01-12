<template>
  <div class="container">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-end mb-4">
          <button
            class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors min-w-[120px]"
            @click="goToAdd">
            Thêm
          </button>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <h4 class="mt-2 text-center text-2xl font-semibold">Danh Sách Bàn Ăn</h4>
          </div>
        </div>
        <hr class="my-4"/>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 border">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">STT</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Tên</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Loại</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Khu vực</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.stt}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.name}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{convertTypeCodeToName(item.type)}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{item.group_table_name}}</td>
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

        <div class="text-center py-4">--Hết--</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { showToast } = useToast()

const items = ref([])
const listIdDeleted = ref([])
const loading = ref(false)

const rows = computed(() => items.value.length)

/**
 * Load list
 */
const getTableList = async () => {
  loading.value = true

  try {
    const res = await adminAPI.getTableList()
    if (res != null && res.data != null && res.data.data != null) {
      items.value = res.data.data
    }
    loading.value = false
  } catch (err) {
    loading.value = false
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

/**
 * Delete
 */
const deleted = async (id, name, rowIndex) => {
  const confirmed = confirm('Xóa ' + name + ". Bạn có chắc không?")
  if (confirmed) {
    try {
      await adminAPI.deleteTable(id)
      // Remove item in list
      const indexTemp = commonFunc.updateIndex(rowIndex - 1, listIdDeleted.value)
      items.value.splice(indexTemp, 1)
      listIdDeleted.value.push(rowIndex - 1)
    } catch (err) {
      const errorMess = commonFunc.handleStaffError(err)
      showToast(errorMess, 'danger')
    }
  }
}

/**
 * Go to edit
 */
const edit = (id) => {
  router.push('/table/index/' + id)
}

/**
 * Go to add
 */
const goToAdd = () => {
  router.push('/table/index/')
}

/**
 * Convert code to name
 */
const convertTypeCodeToName = (code) => {
  if (code == 'default') {
    return "Thường"
  }
  return "Take away"
}

onMounted(() => {
  getTableList()
})
</script>
