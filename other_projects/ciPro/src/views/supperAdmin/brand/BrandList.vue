<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded float-right" @click="gotoAdd()">
          Thêm
        </button>
      </div>

      <div class="clear-both">
        <h4 class="text-center text-xl font-semibold mb-4">Thương Hiệu</h4>
      </div>
      <hr class="mb-4">

      <div class="mb-4">
        <label>Tên</label>
        <input
          type="text"
          class="form-control border rounded px-3 py-2 w-full"
          v-model="inputs.name"
          maxlength="100">
      </div>

      <div class="mb-4">
        <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded float-right" :disabled="onSearch" @click="prepareToSearch">
          Tìm Kiếm
        </button>
      </div>

      <div class="overflow-x-auto clear-both">
        <table class="min-w-full divide-y divide-gray-200 border">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">STT</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tên</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Mô tả</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Ngày Tạo</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in items" :key="index">
              <td class="px-4 py-3">{{ item.stt }}</td>
              <td class="px-4 py-3">{{ item.name }}</td>
              <td class="px-4 py-3">{{ item.description }}</td>
              <td class="px-4 py-3">{{ item.created_at }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button @click="edit(item.id)" class="text-blue-500 hover:text-blue-700" title="Edit">
                    <i class="fa fa-edit" />
                  </button>
                  <button @click="deleted(item.id, item.name, item.stt)" class="text-red-500 hover:text-red-700" title="Delete">
                    <i class="fa fa-trash" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading -->
      <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
      <span class="loading-more" v-if="hasNext === false">Hết</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import superAdminAPI from '@/api/superAdmin'
import commonFunc from '@/common/commonFunc'
import {Constant} from '@/common/constant'

const router = useRouter()
const { popToast } = useToast()

const items = ref([])
const inputs = ref({
  name: ''
})
const loadByScroll = ref(false)
const onSearch = ref(false)
const hasNext = ref(true)
const loading = ref(false)
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const listIdDeleted = ref([])

/**
 * Scroll event
 */
const onScroll = (event) => {
  if(onSearch.value) {
    return
  }
  event.preventDefault()
  const body = document.body
  const html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if(hasNext.value) {
      offset.value = offset.value + 10
      loadByScroll.value = true
      search()
    }
  }
}

/**
 * Prepare to search
 */
const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  search()
}

/**
 * Delete
 */
const deleted = (id, name, rowIndex) => {
  if (confirm(`Xóa ${name}. Bạn có chắc không?`)) {
    superAdminAPI.deleteBrand(id).then(res => {
      const indexTemp = commonFunc.updateIndex(rowIndex - 1, listIdDeleted.value)
      items.value.splice(indexTemp, 1)
      listIdDeleted.value.push(rowIndex - 1)
    }).catch(err => {
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

/**
 * Go to edit
 */
const edit = (id) => {
  router.push('/brand/index/' + id)
}

/**
 * Go to add
 */
const gotoAdd = () => {
  router.push('/brand/index/')
}

/**
 * Search
 */
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

      // Update items
      if(loadByScroll.value) {
        items.value = items.value.concat(it)
      } else {
        items.value = it
      }
      loadByScroll.value = false

      // Check has next
      if(offset.value + pageLimit.value >= res.data.data.total_row) {
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

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  search()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
