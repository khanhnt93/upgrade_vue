<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1">
      <div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="grid grid-cols-1 mb-4">
            <div>
              <button 
                class="px-4 py-2 border border-green-500 text-green-600 rounded hover:bg-green-50 float-right w-30"
                @click="goToAdd()">
                Thêm
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 mb-4">
            <div>
              <h4 class="mt-2 text-center text-xl font-semibold">Đơn vị</h4>
            </div>
          </div>
          <hr class="mb-4">

          <table class="w-full border-collapse border border-gray-300">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-300 px-4 py-2 text-left">STT</th>
                <th class="border border-gray-300 px-4 py-2 text-left">Tên</th>
                <th class="border border-gray-300 px-4 py-2 text-center w-32"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-2">{{ item.stt }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
                <td class="border border-gray-300 px-4 py-2">
                  <div class="flex gap-2 justify-center">
                    <button 
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      @click="edit(item.id)"
                      title="Edit">
                      <i class="fa fa-edit"></i>
                    </button>
                    <button 
                      class="p-2 text-red-600 hover:bg-red-50 rounded"
                      @click="deleted(item.id, item.name, item.stt)"
                      title="Delete">
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more">--Hết--</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/table'
import commonFunc from '@/common/commonFunc'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'


export default {
  setup() {
    const router = useRouter()
    const toast = useToast()
    
    return {
      router,
      toast
    }
  },
  data () {
    return {
      items: [],
      listIdDeleted: [],
      loading: false,
    }
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  mounted() {
    this.getUnitList()
  },
  methods: {

    /**
     * Load list
     */
    getUnitList () {
      this.loading = true

      adminAPI.getListUnit().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data
        }

        this.loading = false
      }).catch(err => {
        this.loading = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Delete
     * @param id
     * @param name
     * @param rowIndex
     */
    deleted (id, name, rowIndex) {
      if(confirm('Xóa ' + name + ". Bạn có chắc không?")) {
        adminAPI.deleteUnit(id).then(res => {
          // Remove item in list
          let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
          this.items.splice(indexTemp, 1)
          this.listIdDeleted.push(rowIndex - 1)
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
      }
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.router.push('/unit/index/' + id)
    },

    /**
     * Go to add
     */
    goToAdd () {
      this.router.push('/unit/index/')
    }
  }
}
</script>

