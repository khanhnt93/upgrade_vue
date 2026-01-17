<template>
  <div class="container-fluid px-4 py-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-end mb-4">
          <button
            @click="goToAdd()"
            class="px-4 py-2 bg-white text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors min-w-[120px]"
          >
            Thêm
          </button>
        </div>

        <h4 class="text-2xl font-semibold text-center mb-4">Danh Sách Loại Sản Phẩm</h4>
        <hr class="mb-6">

        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                  STT
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                  Nhóm sản phẩm
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                  Mã
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                  Tên
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">

                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">
                  {{ item.stt }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">
                  {{ item.product_group_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">
                  {{ item.code }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">
                  {{ item.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium border">
                  <div class="flex space-x-2">
                    <button
                      @click="edit(item.id)"
                      class="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <i class="fa fa-edit" />
                    </button>
                    <button
                      @click="deleted(item.id, item.name)"
                      class="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <i class="fa fa-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading -->
        <div v-show="loading" class="text-center py-4">
          <icon name="loading" width="60" />
        </div>
        <div class="text-center py-4 text-gray-500">--Hết--</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import productApi from '@/api/product'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { popToast } = useToast()

// Data
const items = ref([])
const loading = ref(false)

// Methods
const getProductTypeList = () => {
  loading.value = true

  productApi.getAllProductType().then(res => {
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

const deleted = (id, name) => {
  if (confirm(`Xóa ${name}. Bạn có chắc không?`)) {
    productApi.deleteProductType(id).then(res => {
      if(res != null && res.data != null) {
        popToast('success', "Xoá loại sản phẩm thành công!")
        getProductTypeList()
      }
    }).catch(err => {
      // Handle error
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const edit = (id) => {
  router.push('/product-type/index/' + id)
}

const goToAdd = () => {
  router.push('/product-type/index/')
}

// Lifecycle
onMounted(() => {
  getProductTypeList()
})
</script>
