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
        <h4 class="text-xl font-semibold text-center mb-4">Danh Sách Kênh Bán Hàng</h4>
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.stt }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.code }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex space-x-2">
                    <button
                      @click="edit(item.id)"
                      title="Edit"
                      class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      <i class="fa fa-edit" />
                    </button>
                    <button
                      @click="deleted(item.id, item.name)"
                      title="Delete"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { popToast } = useToast()

// Data
const items = ref([])
const loading = ref(false)

// Methods
const deleted = (id, name) => {
  if (confirm(`Xóa [${name}]. Bạn có chắc không?`)) {
    adminAPI.deleteSaleChannel(id).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        items.value = res.data.data
      }
      popToast('success', 'Xóa topping thành công!!!')
    }).catch(err => {
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const edit = (id) => {
  router.push('/sale-channel/edit/' + id)
}

const goToAdd = () => {
  router.push('/sale-channel/add')
}

const search = () => {
  loading.value = true

  adminAPI.getListSaleChannel().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      items.value = res.data.data
    }
    loading.value = false
  }).catch(err => {
    loading.value = false
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

// Lifecycle
onMounted(() => {
  search()
})
</script>
