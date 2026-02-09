<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="bg-white shadow rounded-lg p-4">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full md:w-1/2 px-2">
              <button class="btn btn-outline-secondary pull-left btn-width-120" @click="back">
                Quay lại
              </button>
            </div>
            <div class="w-full md:w-1/2 px-2">
              <button class="btn btn-outline-success pull-right btn-width-120" @click="save" :disabled="saving">
                Lưu
              </button>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <h4 class="mt-2 text-center">Nhà Cung Cấp</h4>
            </div>
          </div>
          <hr/>
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <div class="flex flex-wrap -mx-2 mb-4">
            <div class="w-full md:w-1/4 px-2 mt-2">
              <label> Tên </label><span class="error-sybol"></span>
            </div>
            <div class="w-full md:w-3/4 px-2">
              <input
                id="name"
                type="text"
                maxlength="100"
                autocomplete="new-password"
                class="form-control"
                v-model="supplier.name">
              <div class="invalid-feedback { 'd-block': errorName }" >
                Vui lòng nhập tên
              </div>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2 mb-4">
            <div class="w-full md:w-1/4 px-2 mt-2">
              <label> Số điện thoại </label>
            </div>
            <div class="w-full md:w-3/4 px-2">
              <input
                id="phone_number"
                type="text"
                maxlength="30"
                autocomplete="new-password"
                class="form-control"
                v-model="supplier.phone_number">
            </div>
          </div>

          <div class="flex flex-wrap -mx-2 mb-4">
            <div class="w-full md:w-1/4 px-2 mt-2">
              <label> Địa chỉ </label>
            </div>
            <div class="w-full md:w-3/4 px-2">
              <input
                id="address"
                type="text"
                maxlength="255"
                autocomplete="new-password"
                class="form-control"
                v-model="supplier.address">
            </div>
          </div>

          <div class="flex flex-wrap -mx-2 mb-4">
            <div class="w-full md:w-1/4 px-2 mt-2">
              <label> Mã số thuế </label>
            </div>
            <div class="w-full md:w-3/4 px-2">
              <input
                id="tax_code"
                type="text"
                maxlength="20"
                autocomplete="new-password"
                class="form-control"
                v-model="supplier.tax_code">
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import supplierAPI from '@/api/supplier'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useRouter, useRoute } from 'vue-router'


export default {
  setup() {
    const { toast } = useToast()
    const router = useRouter()
    const route = useRoute()

    return {
      toast,
      router,
      route
    }
  },
  data () {
    return {
      supplier: {
        "name": null,
        "phone_number": null,
        "address": null,
        "tax_code": null
      },
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    this.getSupplierDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.supplier.name)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorName)
    },

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
     * Get detail
     */
    getSupplierDetail() {
      let supplierId = this.route.params.id
      if(supplierId){
        this.loading = true

        supplierAPI.getSupplierDetail(supplierId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.supplier = res.data.data
          }

          this.loading = false
        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.router.push('/supplier')
    },

    /**
     * Save
     */
    save () {
      this.click = true
      this.saving = true
      let result = this.checkValidate()
      if(result) {
        let supplierId = this.route.params.id
        if(supplierId){
          // Edit
          let supplier = this.supplier
          supplier.id = supplierId
          supplierAPI.editSupplier(supplier).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                // show popup success
                this.popToast('success', 'Cập nhật đơn vị thành công!!! ')
              }
            }
          }).catch(err => {
            this.saving = false
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        } else {
          // Add
          supplierAPI.addSupplier(this.supplier).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.router.push("/supplier")
              }
            }
          }).catch(err => {
            this.saving = false
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
      } else {
        this.saving = false
      }
    }
  }
}
</script>
