<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <button class="btn btn-outline-success float-right px-4 btn-width-120" @click="gotoAdd()">
                Thêm
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h4 class="mt-2 text-center text-header">Nhóm quyền</h4>
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
                  <div v-if="field.key === 'actions'">
                    <div class="flex gap-2">
                      <button class="list-group-item" title="Edit" @click="edit(item.id)">
                        <i class="fa fa-edit" />
                      </button>
                      <button class="list-group-item" title="Delete" @click="deleted(item.id, item.name)">
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
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import {Constant} from '@/common/constant'
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
     * Delete
     */
    deleted (id, name) {
      if(id && name) {
        if (confirm('Xóa [' + name + "]. Bạn có chắc không?")) {
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

