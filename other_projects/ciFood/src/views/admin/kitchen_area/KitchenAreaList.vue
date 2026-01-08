<template>
  <div class="container-fluid px-4 py-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex justify-end mb-4">
        <button @click="goToAdd" class="bg-success-500 hover:bg-success-600 text-white px-6 py-2 rounded-md min-w-[120px]">
          Thêm
        </button>
      </div>
      <h4 class="text-2xl font-bold text-center text-gray-800 mb-4">Danh Sách Khu Bếp</h4>
      <hr class="mb-6" />
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 border-b text-left">STT</th>
              <th class="px-4 py-2 border-b text-left">Tên</th>
              <th class="px-4 py-2 border-b text-center w-32">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-2 border-b">{{ item.stt }}</td>
              <td class="px-4 py-2 border-b">{{ item.name }}</td>
              <td class="px-4 py-2 border-b">
                <div class="flex justify-center gap-2">
                  <button @click="edit(item.id)" class="text-primary-500 hover:text-primary-700 p-2" title="Sửa">
                    <font-awesome-icon icon="edit" />
                  </button>
                  <button @click="deleted(item.id, item.name, item.stt)" class="text-danger-500 hover:text-danger-700 p-2" title="Xóa">
                    <font-awesome-icon icon="trash" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="loading" class="text-center py-4">
        <font-awesome-icon icon="spinner" spin class="text-4xl text-primary-500" />
      </div>
      <p v-else class="text-center text-gray-500 mt-4">--Hết--</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'

const router = useRouter()
const toast = useToast()
const items = ref([])
const listIdDeleted = ref([])
const loading = ref(false)

const search = () => {
  loading.value = true
  adminAPI.searchKitchenArea().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      items.value = res.data.data
    }
    loading.value = false
  }).catch(err => {
    loading.value = false
    let errorMess = commonFunc.handleStaffError(err)
    toast.error(errorMess)
  })
}

const deleted = (id, name, rowIndex) => {
  if (confirm(`Xóa [${name}]. Bạn có chắc không?`)) {
    adminAPI.deleteKitchenArea(id).then(res => {
      let indexTemp = commonFunc.updateIndex(rowIndex - 1, listIdDeleted.value)
      items.value.splice(indexTemp, 1)
      listIdDeleted.value.push(rowIndex - 1)
      toast.success('Xóa khu bếp thành công!!!')
    }).catch(err => {
      let errorMess = commonFunc.handleStaffError(err)
      toast.error(errorMess)
    })
  }
}

const edit = (id) => {
  router.push('/kitchen-area/edit/' + id)
}

const goToAdd = () => {
  router.push('/kitchen-area/add')
}

onMounted(() => {
  search()
})
</script>
