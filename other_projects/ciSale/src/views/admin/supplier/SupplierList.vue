<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="bg-white shadow rounded-lg p-4">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <button class="btn btn-outline-success pull-right btn-width-120" @click="goToAdd()">
                Thêm
              </button>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <h4 class="mt-2 text-center">Danh Sách Nhà Cung Cấp</h4>
            </div>
          </div>
          <hr>

          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Mã số thuế</th>
                  <th class="actions-cell"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.id">
                  <td>{{ item.stt }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.phone_number }}</td>
                  <td>{{ item.address }}</td>
                  <td>{{ item.tax_code }}</td>
                  <td class="actions-cell">
                    <div class="flex gap-2">
                      <button class="btn btn-sm btn-outline-primary" title="Edit" @click="edit(item.id)">
                        <i class="fa fa-edit" />
                      </button>
                      <button class="btn btn-sm btn-outline-danger" title="Delete" @click="deleted(item.id, item.name, item.stt)">
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
import supplierAPI from '@/api/supplier'
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
    this.getSupplierList()
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
     * Load list
     */
    getSupplierList () {
      this.loading = true

      supplierAPI.getListSupplier().then(res => {
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
      if (confirm('Xóa ' + name + ". Bạn có chắc không?")) {
        supplierAPI.deleteSupplier(id).then(res => {
          // Remove item in list
          let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
          this.items.splice(indexTemp, 1)
          this.listIdDeleted.push(rowIndex - 1)
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
      this.router.push('/supplier/index/' + id)
    },

    /**
     * Go to add
     */
    goToAdd () {
      this.router.push('/supplier/index/')
    }
  }
}
</script>
