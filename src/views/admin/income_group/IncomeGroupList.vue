<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div class="w-full md:col-span-12">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="w-full md:col-span-12">
              <button class="btn btn-outline-success pull-right btn-width-120" @click="goToAdd()">
                Thêm Nhóm
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="w-full md:col-span-12">
              <h4 class="mt-2 text-center">Danh Sách Nhóm Thu Nhập</h4>
            </div>
          </div>
          <hr>

          <div class="overflow-x-auto">
            <table class="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 px-4 py-2" v-for="field in fields" :key="field.key">{{ field.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
                  <td class="border border-gray-300 px-4 py-2">{{ item.stt }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ item.index }}</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="flex space-x-2">
                      <button class="btn btn-sm btn-primary" @click="edit(item.id)" title="Edit">
                        <i class="fa fa-edit" />
                      </button>
                      <button class="btn btn-sm btn-danger" @click="deleted(item.id, item.name)" title="Delete">
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
          <span class="loading-more">--Hết--</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import incomeGroupApi from '@/api/incomeGroup'
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
          key: 'index',
          label: 'Thứ tự xuất hiện'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      items: [],
      loading: false,
    }
  },
  mounted() {
    this.getIncomeGroupList()
  },
  methods: {

    /**
   * Make toast without title
   */
    popToast(variant, content) {
      console.log(`Toast: [${variant}] ${content}`)
    },

    /**
     * Load list
     */
    getIncomeGroupList () {
      this.loading = true

      incomeGroupApi.getAllIncomeGroup().then(res => {
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
     */
    deleted (id, name) {
      if(confirm('Xóa ' + name + ". Bạn có chắc không?")) {
        incomeGroupApi.deleteIncomeGroup(id).then(res => {
          // Reload data
          this.getIncomeGroupList()
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
      this.$router.push('/income-group/index/' + id)
    },

    /**
     * Go to add
     */
    goToAdd () {
      this.$router.push('/income-group/index/')
    }
  }
}
</script>
