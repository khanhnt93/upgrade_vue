<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 gap-4">
      <div class="w-full">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="w-full md:col-span-12">
              <button class="btn btn-outline-success pull-right btn-width-120 px-4 py-2" @click="gotoAdd()">
                Thêm mới
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 mt-4">
            <div class="w-full">
              <h4 class="mt-1 text-center text-header">NHÓM QUYỀN</h4>
            </div>
          </div>
          <hr>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th v-for="field in fields" :key="field.key" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ field.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.stt }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.code }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <div class="flex gap-2">
                      <button class="px-3 py-2 hover:bg-gray-100 rounded" title="Edit" @click="edit(item.id)">
                        <i class="fa fa-edit" />
                      </button>
                      <button class="px-3 py-2 hover:bg-gray-100 rounded" title="Delete" @click="deleted(item.id, item.name)">
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
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import adminAPI from '@/api/admin'
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
      ],
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
   * Make toast without title
   */
  popToast(variant, content) {
    console.log(`[${variant}] ${content}`);
  },

    /**
     * Delete
     */
    deleted (id, name) {
      if(id && name) {
        if(confirm('Xóa [' + name + "]. Bạn có chắc không?")) {
          adminAPI.deleteRole(id).then(res => {
            this.items = res.data.data
          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
      }
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.$router.push('/role/index/' + id)
    },

    /**
     * Go to add
     */
    gotoAdd () {
      this.$router.push('/role/index/')
    },

    /**
     * Search
     */
    search () {
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
        this.popToast('danger', errorMess)

        this.loading = false
      })
    },
  }
}
</script>
