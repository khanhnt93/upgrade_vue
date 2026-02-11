<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="bg-white shadow rounded-lg p-4">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <button class="btn btn-outline-success pull-right btn-width-120" @click="gotoAdd()">
                Thêm mới
              </button>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <h4 class="mt-1 text-center text-header">NHÓM QUYỀN</h4>
            </div>
          </div>
          <hr>

          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã nhóm quyền</th>
                  <th>Tên nhóm quyền</th>
                  <th class="actions-cell"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.id">
                  <td>{{ item.stt }}</td>
                  <td>{{ item.code }}</td>
                  <td>{{ item.name }}</td>
                  <td class="actions-cell">
                    <div class="flex gap-2">
                      <button class="btn btn-sm btn-outline-primary" title="Edit" @click="edit(item.id)">
                        <i class="fa fa-edit" />
                      </button>
                      <button class="btn btn-sm btn-outline-danger" title="Delete" @click="deleted(item.id, item.name)">
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
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'


export default {
  setup() {
    const { toast } = useToast()
    const router = useRouter()

    return {
      toast,
      router
    }
  },
  data () {
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
   * Make toast without title
   */
  popToast(variant, content) {
    this.toast(content, {
      toastClass: 'my-toast',
      noCloseButton: true,
      variant: variant === 'danger' ? 'error' : variant,
      autoHideDelay: 3000
    })
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
      this.router.push('/role/index/' + id)
    },

    /**
     * Go to add
     */
    gotoAdd () {
      this.router.push('/role/index/')
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

