<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1">
      <div class="w-full">
        <div class="card">
          <div class="card-body">
            <div class="flex justify-end mb-4">
              <button class="btn btn-outline-success px-4 btn-width-120" @click="goToAdd()">
                Thêm
              </button>
            </div>

            <h4 class="mt-2 text-center text-header mb-4">Đơn vị</h4>
            <hr>

            <div class="overflow-x-auto">
              <table class="table table-hover">
                <thead class="bg-gray-50">
                  <tr>
                    <th v-for="field in fields" :key="field.key" 
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ field.label }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.stt }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <div class="flex space-x-2">
                        <button 
                          @click="edit(item.id)" 
                          class="text-blue-600 hover:text-blue-900"
                          title="Edit">
                          <i class="fa fa-edit" />
                        </button>
                        <button 
                          @click="deleted(item.id, item.name, item.stt)" 
                          class="text-red-600 hover:text-red-900"
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
            <div v-show="loading" class="text-center py-4">
              <i class="fa fa-spinner fa-spin fa-3x"></i>
            </div>
            <div class="text-center py-2 text-gray-500">--Hết--</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useToastNotification } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/table'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'name',
          label: 'Tên'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
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
   * Make toast without title
   */
    popToast(variant, content) {
      const { popToast } = useToastNotification()
      popToast(variant, content)
    },

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
        this.popToast('danger', errorMess)
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
          this.popToast('success', 'Xóa thành công')
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.$router.push('/unit/index/' + id)
    },

    /**
     * Go to add
     */
    goToAdd () {
      this.$router.push('/unit/index/')
    }
  }
}
</script>
