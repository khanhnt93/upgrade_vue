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
          <h4 class="text-xl font-semibold text-orange-600">Danh Sách Dự Án Mẫu</h4>
        </div>
        <hr class="mb-4">

        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="border border-gray-300 px-4 py-2">STT</th>
                <th class="border border-gray-300 px-4 py-2">Tên dự án</th>
                <th class="border border-gray-300 px-4 py-2">Hãng</th>
                <th class="border border-gray-300 px-4 py-2">Đơn vị</th>
                <th class="border border-gray-300 px-4 py-2">Sản phẩm</th>
                <th class="border border-gray-300 px-4 py-2 w-24"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.brand_name }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.unit_name }}</td>
                <td class="border border-gray-300 px-4 py-2">
                  <div v-for="(product) in item.products" :key="product.product_name">
                    <p>- {{ product.product_name }}</p>
                    <p>{{ currencyFormat(product.product_quantity) }} x {{ currencyFormat(product.product_price) }} = {{ currencyFormat(product.product_amount) }}</p>
                  </div>
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  <div class="flex gap-2 justify-center">
                    <button
                      @click="edit(item.id)"
                      class="text-blue-500 hover:text-blue-700"
                      title="Edit">
                      <i class="fa fa-edit" />
                    </button>
                    <button
                      @click="deleted(item.id, item.name)"
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
import projectApi from '@/api/project'
import commonFunc from '@/common/commonFunc'

const router = useRouter()
const { popToast } = useToast()

const items = ref([])
const loading = ref(false)

/**
 * Load list
 */
const getProjectList = () => {
  loading.value = true

  projectApi.getProjectList().then(res => {
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
 */
const deleted = (id, name) => {
  if (confirm('Xóa ' + name + ". Bạn có chắc không?")) {
    projectApi.deleteProject(id).then(res => {
      // Reload data
      getProjectList()

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
  router.push('/project/index/' + id)
}

/**
 * Go to add
 */
const goToAdd = () => {
  router.push('/project/index/')
}

/**
 * Currency format
 */
const currencyFormat = (num) => {
  let result = ""
  if(num === 0) {
      return "0"
  }
  if(num) {
      num = (num + "").replaceAll(",", "")
  }

  if(num) {
    result = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

onMounted(() => {
  getProjectList()
})
</script>
