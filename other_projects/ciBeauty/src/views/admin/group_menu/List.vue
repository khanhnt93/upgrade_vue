<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <button class="btn btn-outline-success float-right px-4 btn-width-120" @click="goToAdd()">
                Thêm
              </button>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h4 class="mt-2 text-center text-header">Danh Mục </h4>
            </div>
          </div>
          <hr>

          <table class="table table-bordered table-hover table-responsive-stack">
            <thead>
              <tr>
                <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td v-for="field in fields" :key="field.key" :data-label="field.label">
                  <div v-if="field.key === 'stt'">
                    {{ index + 1 }}
                  </div>
                  <div v-else-if="field.key === 'actions'">
                    <div class="flex gap-2">
                      <button class="list-group-item" title="Edit" @click="edit(item.id)">
                        <i class="fa fa-edit" />
                      </button>
                      <button class="list-group-item" title="Delete" @click="deleted(item.id, item.name, item.stt)">
                        <i class="fa fa-trash" />
                      </button>
                    </div>
                  </div>
                  <div v-else>
                    {{ item[field.key] }}
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
// import Mapper from '@/mapper/group_menu'
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
          key: 'type_str',
          label: 'Loại'
        },
        {
          key: 'index',
          label: 'Thứ tự'
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
     * Make toast with title
     */
    makeToast(variant = null, title, content) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true,
        autoHideDelay: 3000
      })
    },

    /**
     *  Delete
     */
    deleted (id, name, rowIndex) {

      if (confirm('Xóa [' + name + "]. Bạn có chắc không?")) {
          adminAPI.deleteGroupMenu(id).then(res => {
            this.search()

            // Remove item in list
            // let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
            // this.items.splice(indexTemp, 1)
            // this.listIdDeleted.push(rowIndex - 1)

            this.popToast('success', 'Xóa nhóm dịch vụ thành công!!!')
          }).catch(err => {
            let message = ""
            if(err.response.data.status == 500) {
              message = "Lỗi hệ thống, chúng tôi rất tiếc về sự cố này, bạn thử lại sau vài phút nhé"
            } else {
              message = err.response.data.mess
            }
            this.makeToast('danger', 'Cập nhật nhóm menu thất bại!!!', message)
          })
      }
    },

    /**
     *  Go to edit
     */
    edit (id) {
      this.$router.push('/group-menu/edit/' + id)
    },

    /**
     *  Go to add
     */
    goToAdd () {
      this.$router.push('/group-menu/add')
    },

    /**
     *  Search
     */
    search() {
      this.loading = true

      // Search
      adminAPI.searchGroupMenu().then(res => {
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

  }
}
</script>

<style lang="scss">
.mess {
    background-color: white
}
</style>
