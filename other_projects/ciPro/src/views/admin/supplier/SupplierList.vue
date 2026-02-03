<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-end mb-4">
          <button
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-32"
            @click="goToAdd()">
            Thêm
          </button>
        </div>

        <div class="mb-4">
          <h4 class="text-center text-xl font-semibold text-orange-600">Danh Sách Nhà Cung Cấp</h4>
        </div>
        <hr class="mb-4">

        <!-- Loading -->
        <div v-show="loading" class="text-center py-4">
          <icon name="loading" width="60" />
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 border">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">STT</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tên</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Số điện thoại</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Địa chỉ</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Mã số thuế</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Người liên hệ</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">SĐT người liên hệ</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase w-24"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap">{{ item.stt }}</td>
                <td class="px-4 py-3 whitespace-nowrap">{{ item.name }}</td>
                <td class="px-4 py-3 whitespace-nowrap">{{ item.phone_number }}</td>
                <td class="px-4 py-3">{{ item.address }}</td>
                <td class="px-4 py-3 whitespace-nowrap">{{ item.tax_code }}</td>
                <td class="px-4 py-3 whitespace-nowrap">{{ item.contact_person_name }}</td>
                <td class="px-4 py-3 whitespace-nowrap">{{ item.contact_person_phone }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex gap-2 justify-center">
                    <button
                      class="text-blue-600 hover:text-blue-800"
                      @click="edit(item.id)"
                      title="Edit">
                      <i class="fa fa-edit" />
                    </button>
                    <button
                      class="text-red-600 hover:text-red-800"
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

        <div class="text-center mt-4 text-gray-500">--Hết--</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import supplierAPI from '@/api/supplier'
import commonFunc from '@/common/commonFunc'

const router = useRouter()
const { popToast } = useToast()

const items = ref([])
const listIdDeleted = ref([])
const loading = ref(false)

/**
 * Load list
 */
const getSupplierList = () => {
  loading.value = true

  supplierAPI.getListSupplier().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      items.value = res.data.data
    }

    loading.value = false
  }).catch(err => {
    loading.value = false

    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

/**
 * Delete
 * @param id
 * @param name
 * @param rowIndex
 */
const deleted = (id, name, rowIndex) => {
  if (confirm('Xóa ' + name + ". Bạn có chắc không?")) {
    supplierAPI.deleteSupplier(id).then(res => {
      // Remove item in list
      let indexTemp = commonFunc.updateIndex(rowIndex - 1, listIdDeleted.value)
      items.value.splice(indexTemp, 1)
      listIdDeleted.value.push(rowIndex - 1)
      popToast('success', 'Xóa thành công!')
    }).catch(err => {
      // Handle error
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

/**
 * Go to edit
 * @param id
 */
const edit = (id) => {
  router.push('/supplier/index/' + id)
}

/**
 * Go to add
 */
const goToAdd = () => {
  router.push('/supplier/index/')
}

onMounted(() => {
  getSupplierList()
})
</script>

<style scoped>
.actions-cell {
  width: 100px;
}
</style>
