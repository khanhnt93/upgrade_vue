<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <button class="btn btn-outline-success pull-right btn-width-120" @click="goToAdd()">
                Thêm
              </button>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <h4 class="mt-2 text-center">Danh Sách Loại Sản Phẩm</h4>
            </div>
          </div>
          <hr>

          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>STT</th>
                <th>Nhóm sản phẩm</th>
                <th>Mã</th>
                <th>Tên</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="item.id">
                <td>{{ item.stt }}</td>
                <td>{{ item.product_group_name }}</td>
                <td>{{ item.code }}</td>
                <td>{{ item.name }}</td>
                <td class="actions-cell">
                  <div class="flex justify-center gap-2">
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

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more">--Hết--</span>
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
    const toast = useToast()
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
          key: 'product_group_name',
          label: 'Nhóm sản phẩm'
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
    this.getProductTypeList()
  },
  methods: {

    /**
     * Load list
     */
    getProductTypeList () {
      this.loading = true

      productApi.getAllProductType().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data
        }

        this.loading = false
      }).catch(err => {
        this.loading = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast(errorMess, 'error')
      })
    },

    /**
     * Delete
     * @param id
     * @param name
     * @param rowIndex
     */
    deleted (id, name) {
      if(confirm('Xóa ' + name + ". Bạn có chắc không?")) {
        productApi.deleteProductType(id).then(res => {
          // Reload data
          this.getProductTypeList()

        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.toast(errorMess, 'error')
        })
      }
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.router.push('/product-type/index/' + id)
    },

    /**
     * Go to add
     */
    goToAdd () {
      this.router.push('/product-type/index/')
    }
  }
}
</script>
