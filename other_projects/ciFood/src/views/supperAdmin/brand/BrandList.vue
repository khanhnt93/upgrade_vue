<template>
  <div class="container-fluid px-4 py-4">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Header Row -->
        <div class="flex justify-end mb-4">
          <button
            @click="gotoAdd"
            class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200">
            Thêm
          </button>
        </div>

        <!-- Title -->
        <h4 class="text-xl font-semibold text-center mb-4">Thương Hiệu</h4>
        <hr class="mb-4">

        <!-- Search Filter -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tên</label>
          <input
            v-model="inputs.name"
            type="text"
            maxlength="100"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <!-- Search Button -->
        <div class="flex justify-end mb-4">
          <button
            @click="prepareToSearch"
            :disabled="onSearch"
            class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Tìm Kiếm
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Tạo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.stt }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.description }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.created_at }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex space-x-2">
                    <button
                      @click="edit(item.id)"
                      title="Edit"
                      class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      <i class="fa fa-edit" />
                    </button>
                    <button
                      @click="deleted(item.id, item.name, item.stt)"
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

        <!-- Loading -->
        <div v-show="loading" class="text-center mt-4">
          <i class="fa fa-spinner fa-spin fa-3x text-blue-500"></i>
        </div>

        <!-- End marker -->
        <div class="text-center mt-4">
          <span v-if="hasNext === false" class="text-gray-500">Hết</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import superAdminAPI from '@/api/superAdmin'
import commonFunc from '@/common/commonFunc'
import { Constant } from '@/common/constant'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { popToast } = useToast()

// Data
const inputs = ref({
  name: ''
})

const items = ref([])
const loadByScroll = ref(false)
const onSearch = ref(false)
const hasNext = ref(true)
const loading = ref(false)
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const listIdDeleted = ref([])

// Methods
const onScroll = (event) => {
  if (onSearch.value) {
    return
  }
  event.preventDefault()
  const body = document.body
  const html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if (hasNext.value) {
      offset.value = offset.value + 10
      loadByScroll.value = true
      search()
    }
  }
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  search()
}

const deleted = (id, name, rowIndex) => {
  if (confirm(`Xóa ${name}. Bạn có chắc không?`)) {
    superAdminAPI.deleteBrand(id).then(res => {
      const indexTemp = commonFunc.updateIndex(rowIndex - 1, listIdDeleted.value)
      items.value.splice(indexTemp, 1)
      listIdDeleted.value.push(rowIndex - 1)
      popToast('success', 'Xóa thành công')
    }).catch(err => {
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const edit = (id) => {
  router.push('/brand/index/' + id)
}

const gotoAdd = () => {
  router.push('/brand/index/')
}

const search = () => {
  if (loading.value) { return }

  onSearch.value = true
  loading.value = true

  const dataPost = {
    "name": inputs.value.name,
    "limit": pageLimit.value,
    "offset": offset.value
  }

  superAdminAPI.getBrandList(dataPost).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      const it = res.data.data.data

      if (loadByScroll.value) {
        const temp = items.value
        const newArray = temp.concat(it)
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
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onSearch.value = false
    loading.value = false
  })
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', onScroll)
  search()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
