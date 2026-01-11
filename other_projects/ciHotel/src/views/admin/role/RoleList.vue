<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-12 flex justify-end">
            <button
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors min-w-[120px]"
              @click="gotoAdd()">
              Thêm mới
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-12">
            <h4 class="mt-1 text-center text-xl font-semibold">NHÓM QUYỀN</h4>
          </div>
        </div>
        <hr class="mb-4">

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="border border-gray-300 px-4 py-2 text-left">STT</th>
                <th class="border border-gray-300 px-4 py-2 text-left">Mã nhóm quyền</th>
                <th class="border border-gray-300 px-4 py-2 text-left">Tên nhóm quyền</th>
                <th class="border border-gray-300 px-4 py-2 text-center w-32"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.code }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
                <td class="border border-gray-300 px-4 py-2">
                  <div class="flex justify-center gap-2">
                    <button
                      @click="edit(item.id)"
                      class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      title="Edit">
                      <i class="fa fa-edit" />
                    </button>
                    <button
                      @click="deleted(item.id, item.name)"
                      class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      title="Delete">
                      <i class="fa fa-trash" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="items.length === 0">
                <td colspan="4" class="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading -->
        <div v-show="loading" class="text-center mt-4">
          <icon name="loading" width="60" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'

export default {
  setup() {
    const router = useRouter()
    const toast = useToast()

    return {
      router,
      toast
    }
  },
  data() {
    return {
      items: [],
      loading: false,
    }
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    /**
     * Delete
     */
    deleted(id, name) {
      if (id && name) {
        if (confirm('Xóa [' + name + "]. Bạn có chắc không?")) {
          adminAPI.deleteRole(id).then(res => {
            this.items = res.data.data
            this.toast.success('Xóa nhóm quyền thành công!')
          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.toast.error(errorMess)
          })
        }
      }
    },

    /**
     * Go to edit
     * @param id
     */
    edit(id) {
      this.router.push('/role/index/' + id)
    },

    /**
     * Go to add
     */
    gotoAdd() {
      this.router.push('/role/index/')
    },

    /**
     * Search
     */
    search() {
      if (this.loading) { return }

      this.loading = true

      adminAPI.getListRole().then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data
        } else {
          this.items = []
        }
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)

        this.loading = false
      })
    },
  }
}
</script>
