<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <button class="btn btn-outline-success float-right btn-width-120" @click="goToAdd()">
                Thêm
              </button>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <h4 class="mt-2 text-center">Danh Sách Nhóm Sản Phẩm</h4>
            </div>
          </div>
          <hr>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <div class="table-responsive">
                <table class="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã</th>
                      <th>Tên</th>
                      <th class="text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in items" :key="item.id">
                      <td>{{ item.stt }}</td>
                      <td>{{ item.code }}</td>
                      <td>{{ item.name }}</td>
                      <td class="text-center">
                        <div class="flex justify-center gap-2">
                          <button class="btn btn-sm btn-outline-primary" @click="edit(item.id)" title="Edit">
                            <i class="fa fa-edit" />
                          </button>
                          <button class="btn btn-sm btn-outline-danger" @click="deleted(item.id, item.name)" title="Delete">
                            <i class="fa fa-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
              <span class="loading-more">--Hết--</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import productApi from '@/api/product'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'


export default {
  setup() {
    const { toast } = useToast()
    const router = useRouter()
    return { toast, router }
  },
  data () {
    return {
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'code',
          label: 'Mã'
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
  mounted() {
    this.getProductGroupList()
  },
  methods: {

    /**
   * Make toast without title
   */
    popToast(variant, content) {
      this.toast(content, variant)
    },

    /**
     * Load list
     */
    getProductGroupList () {
      this.loading = true

      productApi.getAllProductGroup().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data
        }

        this.loading = false
      }).catch(err => {
        this.loading = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('error', errorMess)
      })
    },

    /**
     * Delete
     * @param id
     * @param name
     * @param rowIndex
     */
    deleted (id, name) {
      if (confirm('Xóa ' + name + ". Bạn có chắc không?")) {
        productApi.deleteProductGroup(id).then(res => {
          // Reload data
          this.getProductGroupList()

        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('error', errorMess)
        })
      }
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.router.push('/product-group/index/' + id)
    },

    /**
     * Go to add
     */
    goToAdd () {
      this.router.push('/product-group/index/')
    }
  }
}
</script>
