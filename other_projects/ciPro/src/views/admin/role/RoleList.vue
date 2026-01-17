<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <button
          class="float-right px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 btn-width-120"
          @click="gotoAdd()">
          Thêm mới
        </button>
      </div>

      <div class="clear-both">
        <h4 class="mt-1 text-center text-header font-bold">Danh Sách Nhóm Quyền</h4>
      </div>
      <hr class="my-4">

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 border">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">STT</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Mã nhóm quyền</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Tên nhóm quyền</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border actions-cell"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap border">{{ item.stt }}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{ item.code }}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap border actions-cell">
                <div class="flex space-x-2">
                  <button
                    @click="edit(item.id)"
                    title="Edit"
                    class="text-blue-600 hover:text-blue-900">
                    <i class="fa fa-edit" />
                  </button>
                  <button
                    @click="deleted(item.id, item.name)"
                    title="Delete"
                    class="text-red-600 hover:text-red-900">
                    <i class="fa fa-trash" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading -->
      <span v-show="loading" class="loading-more"><icon name="loading" width="60" /></span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'

// Router
const router = useRouter()

// Toast
const { popToast } = useToast()

// Data
const fields = ref([
  {
    key: 'stt',
    label: 'STT'
  },
  {
    key: 'code',
    label: 'Mã nhóm quyền'
  },
  {
    key: 'name',
    label: 'Tên nhóm quyền'
  },
  {
    key: 'actions',
    label: '',
    class: 'actions-cell'
  }
])

const items = ref([])
const loading = ref(false)

// Computed
const rows = computed(() => {
  return items.value.length
})

// Methods
const deleted = (id, name) => {
  if (id && name) {
    if (confirm('Xóa [' + name + "]. Bạn có chắc không?")) {
      adminAPI.deleteRole(id).then(res => {
        items.value = res.data.data
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  }
}

const edit = (id) => {
  router.push('/role/index/' + id)
}

const gotoAdd = () => {
  router.push('/role/index/')
}

const search = () => {
  if (loading.value) { return }

  loading.value = true

  adminAPI.getListRole().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      items.value = res.data.data
    } else {
      items.value = []
    }
    loading.value = false
  }).catch(err => {
    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)

    loading.value = false
  })
}

// Lifecycle
onMounted(() => {
  search()
})
</script>
