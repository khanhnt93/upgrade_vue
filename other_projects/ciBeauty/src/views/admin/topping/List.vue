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

            <h4 class="mt-2 text-center text-header mb-4">Topping</h4>
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
                    <td class="px-6 py-4 whitespace-nowrap text-sm">{{ formatCurrency(item.price) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.status }}</td>
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
import { useFormatters } from '@/composables/useFormatters'
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/topping'
import commonFunc from '@/common/commonFunc'

export default {
  data () {
    return {
      perPage: '10',
      currentPage: '1',
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
          key: 'price',
          label: 'Giá'
        },
        {
          key: 'status',
          label: 'Trạng Thái'
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
  },
  mounted() {
    // Load list when load page
    this.search()
  },
  methods: {

    /**
   * Make toast without title
   */
    popToast(variant, content) {
      if (variant === 'danger') {
        this.$toast.error(content);
      } else if (variant === 'success') {
        this.$toast.success(content);
      } else if (variant === 'warning') {
        this.$toast.warning(content);
      } else {
        this.$toast.info(content);
      }
    },
    /**
     *  Delete
     */
    deleted (id, name, rowIndex) {
      if(confirm('Xóa ' + name + ". Bạn có chắc không?")) {
        adminAPI.deleteTopping(id).then(res => {
          // Remove item in list
          let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
          this.items.splice(indexTemp, 1)
          this.listIdDeleted.push(rowIndex - 1)
          this.popToast('success', 'Xóa topping thành công!!!')
        }).catch(err => {
          let message = ""
          if(err.response.data.status == 500) {
            message = "Lỗi hệ thống, chúng tôi rất tiếc về sự cố này, bạn thử lại sau vài phút nhé"
          } else {
            message = err.response.data.mess
          }
          this.popToast('danger', message)
        })
      }
    },

    /**
     *  Go to edit
     */
    edit (id) {
      this.$router.push('/topping/edit/' + id)
    },

    /**
     *  Go to add
     */
    goToAdd () {
      this.$router.push('/topping/add')
    },

    /**
     *  Search
     */
    search() {
      this.loading = true

      // Search
      adminAPI.searchTopping().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = Mapper.mapToppingModelToDto(res.data.data)
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
   * Currency format
   */
    formatCurrency(num) {
      const { formatCurrency } = useFormatters()
      return formatCurrency(num)
    },

  }
}
</script>

<style lang="scss">
.mess {
    background-color: white
}
</style>
