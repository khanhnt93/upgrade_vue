<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="card-body p-4">

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
                  <h4 class="mt-2 text-center">{{prefix_text}}Loại Sản Phẩm</h4>
                </div>
              </div>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Nhóm sản phẩm </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-3/4 px-2">
                  <select
                  id="productGroup"
                  class="form-control"
                  v-model="productType.product_group_id">
                    <option v-for="option in productGroupOptions" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                  <div v-if="errorProductGroup" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập nhóm sản phẩm
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Mã loại sản phẩm </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-3/4 px-2">
                  <input
                  id="code"
                  type="text"
                  maxlength="30"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="productType.code">
                  <div v-if="errorCode" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập mã loại sản phẩm
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Tên loại sản phẩm </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-3/4 px-2">
                  <input
                  id="name"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="productType.name">
                  <div v-if="errorName" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập tên loại sản phẩm
                  </div>
                </div>
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
import { useRouter, useRoute } from 'vue-router'

export default {
  setup() {
    const toast = useToast()
    const router = useRouter()
    const route = useRoute()
    return { toast, router, route }
  },
  data () {
    return {
      prefix_text: '',
      productGroupOptions:[],
      productType: {
        "product_group_id": null,
        "code": null,
        "name": null,
      },
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    // Check prefix
    if(this.route.params.id) {
      this.prefix_text = "Cập Nhật "
    } else {
      this.prefix_text = "Thêm Mới "
    }

    // Get product group option
    this.getProductGroupOption()

    this.getProductTypeDetail()
  },
  computed: {
    errorProductGroup: function () {
      return this.checkInfo(this.productType.product_group_id)
    },
    errorCode: function () {
      return this.checkInfo(this.productType.code)
    },
    errorName: function () {
      return this.checkInfo(this.productType.name)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorProductGroup || this.errorCode || this.errorName)
    },

    /**
     *  Get product group options
     */
    getProductGroupOption() {

      productApi.getProductGroupOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.productGroupOptions = [{value: null, text: ''}]

          var productGroups = res.data.data
          if(productGroups) {
            for (let i in productGroups) {
              this.productGroupOptions.push(productGroups[i])
            }
          }
        }
      })
    },

    /**
     * Get detail
     */
    getProductTypeDetail() {
      let productTypeId = this.route.params.id
      if(productTypeId){
        this.loading = true

        productApi.getProductTypeDetail(productTypeId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.productType = res.data.data
          }

          this.loading = false
        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.toast(errorMess, 'error')
        })
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.router.push('/product-type')
    },

    /**
     * Save
     */
    save () {
      this.click = true

      let result = this.checkValidate()
      if(result) {
        this.saving = true

        let productTypeId = this.route.params.id
        if(productTypeId){
          // Edit
          this.productType.id = productTypeId
          productApi.updateProductType(this.productType).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                // show popup success
                this.toast('Cập nhật loại sản phẩm thành công!!! ', 'success')
              }
            }
          }).catch(err => {
            this.saving = false

            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.toast(errorMess, 'error')
          })
        } else {
          // Add
          productApi.addProductType(this.productType).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.router.push("/product-type")
              }
            }
          }).catch(err => {
            this.saving = false

            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.toast(errorMess, 'error')
          })
        }
      }
    }
  }
}
</script>
