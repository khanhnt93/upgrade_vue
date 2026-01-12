<template>
  <div id="topping-list">
    <div class="grid grid-cols-1 gap-4">
      <div class="bg-white rounded-lg shadow-md">
        <div class="border-b border-gray-200 px-6 py-4">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-800">Danh Sách Topping</h2>
            <button
              @click="goToAdd"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              Thêm
            </button>
          </div>
        </div>
        <div class="p-6">

          <!-- Loading -->
          <div v-if="loading" class="text-center mt-3">
            <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
          </div>

          <!-- Table -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full border border-gray-300 rounded-md shadow-sm">
              <thead class="bg-blue-100">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">STT</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Tên</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Giá</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Trạng Thái</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-blue-800">Thao tác</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ item.stt }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ item.name }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(item.price) }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ item.status }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-center text-sm">
                    <div class="flex justify-center gap-2">
                      <button
                        @click="edit(item.actions)"
                        class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Edit">
                        <i class="fa fa-edit"></i>
                      </button>
                      <button
                        @click="deleted(item.actions, item.name, item.stt)"
                        class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Delete">
                        <i class="fa fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="text-center text-gray-600 mt-4">--Hết--</div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/topping'
import commonFunc from '@/common/commonFunc'

const router = useRouter()
const { showToast } = useToast()
const { formatCurrency } = useFormatters()

const items = ref([])
const listIdDeleted = ref([])
const loading = ref(false)

onMounted(() => {
  // Load list when load page
  search()
})

/**
 *  Delete
 */
const deleted = (id, name, rowIndex) => {
  if (confirm(`Xóa ${name}. Bạn có chắc không?`)) {
    adminAPI.deleteTopping(id).then(res => {
      // Remove item in list
      let indexTemp = commonFunc.updateIndex(rowIndex - 1, listIdDeleted.value)
      items.value.splice(indexTemp, 1)
      listIdDeleted.value.push(rowIndex - 1)

      showToast('Xóa topping thành công!!!', 'success')
    }).catch(err => {
      let message = ''
      if (err.response.data.status == 500) {
        message = 'Lỗi hệ thống, chúng tôi rất tiếc về sự cố này, bạn thử lại sau vài phút nhé'
      } else {
        message = err.response.data.mess
      }
      showToast(message, 'error')
    })
  }
}

/**
 *  Go to edit
 */
const edit = (id) => {
  router.push('/topping/edit/' + id)
}

/**
 *  Go to add
 */
const goToAdd = () => {
  router.push('/topping/add')
}

/**
 *  Search
 */
const search = () => {
  loading.value = true

  // Search
  adminAPI.searchTopping().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      items.value = Mapper.mapToppingModelToDto(res.data.data)
    }
    loading.value = false
  }).catch(err => {
    loading.value = false

    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'error')
  })
}
</script>

<style lang="css" scoped>
table {
  margin: auto;
  border-collapse: collapse;
  width: 100%;
}
</style>
