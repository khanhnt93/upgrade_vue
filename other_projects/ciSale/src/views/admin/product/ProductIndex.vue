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

              <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full px-2">
                  <h4 class="mt-1 text-center text-header">{{prefix_text}}SẢN PHẨM</h4>
                </div>
              </div>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Nhóm sản phẩm </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-3/4 px-2 mt-2">
                  <multiselect
                    v-model="productGroupSelect"
                    :options="productGroupOptions"
                    :loading="loadingGetOptions"
                    placeholder="--Chọn nhóm sản phẩm--"
                    label="name"
                    track-by="name"
                    @input="changeProductGroup">
                  </multiselect>
                  <div v-if="errorProductGroup" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập nhóm sản phẩm
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Loại sản phẩm </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-3/4 px-2 mt-2">
                  <multiselect
                    v-model="productTypeSelect"
                    :options="productTypeOptions"
                    :loading="loadingGetOptions"
                    placeholder="--Chọn loại sản phẩm--"
                    label="name"
                    track-by="name"
                    @input="changeProductType">
                  </multiselect>
                  <div v-if="errorProductType" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập loại sản phẩm
                  </div>
                </div>
              </div>

            <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Hãng sản phẩm </label>
                </div>
                <div class="w-full md:w-3/4 px-2 mt-2">
                  <select
                    :options="productBrandOptions"
                    id="product_brand"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="product.product_brand_id"></select>
                </div>
              </div>

              <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Mã sản phẩm </label>
                </div>
                <div class="w-full md:w-3/4 px-2 mt-2">
                  <input
                  id="code"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="product.code"
                  maxlength="30">
                </div>
              </div>

              <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Tên sản phẩm </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-3/4 px-2 mt-2">
                  <input
                  id="name"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="product.name"
                  maxlength="255">
                  <div v-if="errorName" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập tên sản phẩm
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Đơn vị </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-3/4 px-2 mt-2">
                  <select
                  :options="unitOptions"
                  id="unit"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="product.unit_id"></select>
                  <div v-if="errorUnit" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập đơn vị
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Mô tả </label>
                </div>
                <div class="w-full md:w-3/4 px-2 mt-2">
                  <textarea
                    id="description"
                    style="width:100%;"
                    rows="3"
                    v-model="product.description"
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
import productApi from '@/api/product'
import tradeApi from '@/api/trade'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'
import { useToast } from '@/composables/useToast'
import { useRouter, useRoute } from 'vue-router'


export default {
  components: {
    Multiselect
  },
  setup() {
    const { toast } = useToast()
    const router = useRouter()
    const route = useRoute()
    return { toast, router, route }
  },
  data () {
    return {
      prefix_text: '',
      productGroupSelect: {},
      productGroupOptions:[],
      productTypeSelect:{},
      productTypeOptions:[],
      productTypeOptionStore: [],
      loadingGetOptions: false,
      unitOptions:[],
      productBrandOptions: [],
      product: {
        "code": null,
        "name": null,
        "product_type_id": null,
        "product_group_id": null,
        "product_brand_id": null,
        "unit_id": null,
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
      this.prefix_text = "CẬP NHẬT "
    } else {
      this.prefix_text = "THÊM MỚI "
    }

    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.product.name)
    },
    errorProductType: function () {
      return this.checkInfo(this.product.product_type_id)
    },
    errorProductGroup: function () {
      return this.checkInfo(this.product.product_group_id)
    },
    errorUnit: function () {
      return this.checkInfo(this.product.unit_id)
    },
  },
  methods: {

    /**
   * Make toast without title
   */
    popToast(variant, content) {
      this.toast(content, variant)
    },

    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorName || this.errorProductType || this.errorProductGroup || this.errorUnit)
    },

    resetListProductType() {
      this.productTypeSelect = {}
      this.productTypeOptions = JSON.parse(JSON.stringify(this.productTypeOptionStore))

      if(this.productTypeOptions.length > 0) {
        let itemEmpty = JSON.parse(JSON.stringify(this.productTypeOptions[0]))
        itemEmpty.id = null
        itemEmpty.name = ""
        this.productTypeOptions.unshift(itemEmpty)
      }
    },

      /**
     *  Get product brand options
     */
    getProductBrandOption(brands) {
      this.productBrandOptions = [{value: null, text: ''}]
      if(brands) {
        for (let i in brands) {
          this.productBrandOptions.push(brands[i])
        }
      }
    },

    /**
     *  Get tất cả các options liên quan
     */
    getOptionsRelated() {
      this.loadingGetOptions = true
      let params = {
        "product_groups": true,
        "product_types": true,
        "units": true,
        "product_brands": true
      }
      tradeApi.getAllOptionsRelated(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          // product_groups
          if (params.product_groups) {
            this.productGroupOptions = options.product_groups
            let itemEmpty = {"id": null, "name": ""}
            this.productGroupOptions.unshift(itemEmpty)
          }

          // product_types
          if (params.product_types) {
            this.productTypeOptionStore = options.product_types
            this.resetListProductType()
          }

          // units
          if (params.units) {
            this.unitOptions = options.units
            let itemEmpty = {"value": null, "text": ""}
            this.unitOptions.unshift(itemEmpty)
          }

          // product_brands
          if (params.product_brands) {
            this.getProductBrandOption(options.product_brands)
          }

          // Get product detail
          this.getProductDetail()
        }
        this.loadingGetOptions = false
      }).catch(err => {
        this.loadingGetOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('error', errorMess)
      })
    },

    /**
     *  Event change product group
     */
    changeProductGroup() {
      if(this.productGroupSelect && this.productGroupSelect.id) {
        this.product.product_group_id = this.productGroupSelect.id
        // Reload list type by group
        this.productTypeOptions = []
        for (let i in this.productTypeOptionStore) {
          if(this.product.product_group_id == this.productTypeOptionStore[i].product_group_id) {
            this.productTypeOptions.push(this.productTypeOptionStore[i])
          }
        }
        if(this.productTypeOptions.length > 0) {
          let itemEmpty = JSON.parse(JSON.stringify(this.productTypeOptions[0]))
          itemEmpty.id = null
          itemEmpty.name = ""
          this.productTypeOptions.unshift(itemEmpty)
        }
      } else {
        this.product.product_group_id = null
        this.resetListProductType()
      }
    },

    /**
     *  Event change product group
     */
    changeProductType() {
      if(this.productTypeSelect && this.productTypeSelect.id) {
        this.product.product_type_id = this.productTypeSelect.id
      } else {
        this.product.product_type_id = null
      }
    },

      getProductGroupSelectedById(id) {
        for(let item of this.productGroupOptions) {
            if(item.id == id) {
                this.productGroupSelect = item
                return
            }
        }
      },

      getProductTypeSelectedById(id) {
        for(let item of this.productTypeOptionStore) {
            if(item.id == id) {
                this.productTypeSelect = item
                return
            }
        }
      },

    /**
     *  Get detail
     */
    getProductDetail() {
      let productId = this.route.params.id
      if(productId){
        this.loading = true

        productApi.getProductDetail(productId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.product = res.data.data

          // Chọn nhóm sp
          this.getProductGroupSelectedById(this.product.product_group_id)

          // Chọn loại sp
          this.getProductTypeSelectedById(this.product.product_type_id)

            this.changeProductGroup()
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
     *  Save
     */
    save () {
      this.click = true

      let result = this.checkValidate()
      if(result) {
        this.saving = true

        let productId = this.route.params.id
        if(productId){
          // Edit
          this.product.id = productId
          productApi.updateProduct(this.product).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              let message = ""
              if (res.data.status == 200) {
                // show popup success
                this.popToast('success', 'Cập nhật sản phẩm thành công!!! ')
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
          productApi.addProduct(this.product).then(res => {
            this.saving = false
            if(res != null && res.data != null){

              let message = ""
              if (res.data.status == 200) {
                this.router.push("/product")
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

    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.router.push("/product")
    }
  }
}
</script>
