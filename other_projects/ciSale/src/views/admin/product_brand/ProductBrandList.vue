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
              <h4 class="mt-2 text-center text-header">Danh Sách Hãng Sản Phẩm</h4>
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
                      <th>Tên</th>
                      <th>Mô tả</th>
                      <th class="text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in items" :key="item.id">
                      <td>{{ item.stt }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.description }}</td>
                      <td class="text-center">
                        <div class="flex justify-center gap-2">
                          <button class="btn btn-sm btn-outline-primary" @click="edit(item.id)" title="Edit">
                            <i class="fa fa-edit" />
                          </button>
                          <button class="btn btn-sm btn-outline-danger" @click="deleted(item.id, item.name, item.stt)" title="Delete">
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
import ProductBrandAPI from '@/api/productBrand'
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
          key: 'name',
          label: 'Tên'
        },
        {
          key: 'description',
          label: 'Mô tả'
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
    this.getProductBrandList()
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
    getProductBrandList () {
      this.loading = true

      ProductBrandAPI.getListProductBrand().then(res => {
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
     */
    deleted (id, name, rowIndex) {
      if (confirm('Xóa ' + name + ". Bạn có chắc không?")) {
        ProductBrandAPI.deleteProductBrand(id).then(res => {
          if(res != null && res.data != null) {
            this.popToast('success', "Xoá hãng sản phẩm thành công!")
            this.getProductBrandList()
          }

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
      this.router.push('/product-brand/index/' + id)
    },

    /**
     * Go to add
     */
    goToAdd () {
      this.router.push('/product-brand/index/')
    }
  }
}
</script>
