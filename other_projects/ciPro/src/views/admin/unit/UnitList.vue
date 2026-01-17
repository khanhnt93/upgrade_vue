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

        <div class="text-center mb-4">
          <h4 class="text-xl font-semibold text-gray-700">Danh Sách Đơn Vị</h4>
        </div>
        <hr class="mb-4">

        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="border border-gray-300 px-4 py-2">STT</th>
                <th class="border border-gray-300 px-4 py-2">Tên</th>
                <th class="border border-gray-300 px-4 py-2 w-24"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-2">{{ item.stt }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
                <td class="border border-gray-300 px-4 py-2">
                  <div class="flex gap-2 justify-center">
                    <button
                      @click="edit(item.id)"
                      class="text-blue-500 hover:text-blue-700"
                      title="Edit">
                      <i class="fa fa-edit" />
                    </button>
                    <button
                      @click="deleted(item.id, item.name, item.stt)"
                      class="text-red-500 hover:text-red-700"
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
        <div class="text-center mt-4">
          <span v-show="loading" class="inline-block"><icon name="loading" width="60" /></span>
          <span class="text-gray-500">--Hết--</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import unitAPI from '@/api/unit'
import commonFunc from '@/common/commonFunc'

const router = useRouter()
const { popToast } = useToast()

const items = ref([])
const listIdDeleted = ref([])
const loading = ref(false)

/**
 * Load list
 */
const getUnitList = () => {
  loading.value = true

  unitAPI.getListUnit().then(res => {
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
    unitAPI.deleteUnit(id).then(res => {
      // Remove item in list
      let indexTemp = commonFunc.updateIndex(rowIndex - 1, listIdDeleted.value)
      items.value.splice(indexTemp, 1)
      listIdDeleted.value.push(rowIndex - 1)
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
  router.push('/unit/index/' + id)
}

/**
 * Go to add
 */
const goToAdd = () => {
  router.push('/unit/index/')
}

onMounted(() => {
  getUnitList()
})
</script>
