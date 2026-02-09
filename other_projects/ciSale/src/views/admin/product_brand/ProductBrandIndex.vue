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
                  <h4 class="mt-2 text-center text-header">{{prefix_text}}Hãng Sản Phẩm</h4>
                </div>
              </div>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="flex flex-wrap -mx-2 form-row">
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
                  v-model="brand.name">
                  <div v-if="errorName" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập tên
                  </div>
                </div>
              </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label> Mô tả </label>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <textarea
                  id="description"
                  style="width:100%;"
                  rows="3"
                  v-model="brand.description"
                  class="form-control"
                ></textarea>
              </div>
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
      brand: {
        "name": null,
        "description": null
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

    this.getProductBrandDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.brand.name)
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
      this.toast(content, variant)
    },

    /**
     * Get detail
     */
    getProductBrandDetail() {
      let brandId = this.route.params.id
      if(brandId){
        this.loading = true

        ProductBrandAPI.getProductBrandDetail(brandId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.brand = res.data.data
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
      this.router.push('/product-brand')
    },

    /**
     * Save
     */
    save () {
      this.click = true
      this.saving = true
      let result = this.checkValidate()
      if(result) {
        let brandId = this.route.params.id
        if(brandId){
          // Edit
          let brand = this.brand
          brand.id = brandId
          ProductBrandAPI.editProductBrand(brand).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                // show popup success
                this.popToast('success', 'Cập nhật hãng sản phẩm thành công!!! ')
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
          ProductBrandAPI.addProductBrand(this.brand).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.router.push("/product-brand")
              }
            }
          }).catch(err => {
            this.saving = false
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('error', errorMess)
          })
        }
      } else {
        this.saving = false
      }
    }
  }
}
</script>
