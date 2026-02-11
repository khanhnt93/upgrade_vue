<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="card-body p-4">

              <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/2 px-2">
                <button class="btn btn-outline-secondary float-left btn-width-120" @click="back">
                  Quay lại
                </button>
              </div>
              <div class="w-full md:w-1/2 px-2">
                <button class="btn btn-outline-success float-right btn-width-120" @click="save" :disabled="saving">
                    Lưu
                </button>
              </div>
            </div>

              <div class="flex flex-wrap -mx-2">
                <div class="w-full px-2">
                  <h4 class="mt-2 text-center">{{prefix_text}}Nhóm Sản Phẩm</h4>
                </div>
              </div>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Mã nhóm sản phẩm </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-3/4 px-2">
                  <input
                  id="code"
                  type="text"
                  maxlength="30"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="productGroup.code">
                  <div v-if="errorCode" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập mã nhóm sản phẩm
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Tên nhóm sản phẩm </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-3/4 px-2">
                  <input
                  id="name"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="productGroup.name">
                  <div v-if="errorName" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập tên nhóm sản phẩm
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
    const { toast } = useToast()
    const router = useRouter()
    const route = useRoute()
    return { toast, router, route }
  },
  data () {
    return {
      prefix_text: '',
      productGroup: {
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

    // Get product group detail
    this.getProductGroupDetail()
  },
  computed: {
    errorCode: function () {
      return this.checkInfo(this.productGroup.code)
    },
    errorName: function () {
      return this.checkInfo(this.productGroup.name)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorCode || this.errorName)
    },

    /**
   * Make toast without title
   */
    popToast(variant, content) {
      this.toast(content, variant)
    },

    /**
     * Get detail
     */
    getProductGroupDetail() {
      let productGroupId = this.route.params.id
      if(productGroupId){
        this.loading = true

        productApi.getProductGroupDetail(productGroupId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.productGroup = res.data.data
          }

          this.loading = false
        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('error', errorMess)
        })
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.router.push('/product-group')
    },

    /**
     * Save
     */
    save () {
      this.click = true

      let result = this.checkValidate()
      if(result) {
        this.saving = true

        let productGroupId = this.route.params.id
        if(productGroupId){
          // Edit
          this.productGroup.id = productGroupId
          productApi.updateProductGroup(this.productGroup).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                // show popup success
                this.popToast('success', 'Cập nhật nhóm sản phẩm thành công!!! ')
              }
            }
          }).catch(err => {
            this.saving = false

            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('error', errorMess)
          })
        } else {
          // Add
          productApi.addProductGroup(this.productGroup).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.router.push("/product-group")
              }
            }
          }).catch(err => {
            this.saving = false

            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('error', errorMess)
          })
        }
      }
    }
  }
}
</script>
