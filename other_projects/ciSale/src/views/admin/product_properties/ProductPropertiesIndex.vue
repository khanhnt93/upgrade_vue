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
                <button class="btn btn-outline-success pull-right btn-width-120" @click="save"
                          :disabled="saving">
                    Lưu
                </button>
              </div>
            </div>

              <div class="flex flex-wrap -mx-2">
                <div class="w-full px-2">
                  <h4 class="mt-2 text-center">{{prefix_text}}Thuộc Tính Sản Phẩm</h4>
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

              <div class="flex flex-wrap -mx-2" v-show="productProperties.properties.length > 0">
                <div class="w-full px-2">
                  <p v-for="(item) in productProperties.properties" :key="item.name">
                    + {{item.name}}:
                    <span v-for="(value, index) in item.value" :key="index" class="ml-2">
                      - {{value}}
                      <i class="fa fa-trash" title="Delete" @click="deleteItem(item.name, index)"/>
                    </span>
                  </p>
                </div>
              </div>

              <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Tên thuộc tính (ví dụ: Size)</label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-3/4 px-2 mt-2">
                  <input
                  id="code"
                  type="text"
                  maxlength="30"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="productPropertiesItem.name">
                  <div v-if="errorName" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập tên thuộc tính
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Giá trị thuộc tính (ví dụ: S)</label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-3/4 px-2 mt-2">
                  <input
                  id="name"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="productPropertiesItem.value">
                  <div v-if="errorValue" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập giá trị thuộc tính
                  </div>
                </div>
              </div>

            <div class="flex flex-wrap -mx-2 mt-2 text-center">
              <div class="w-full px-2">
                <button class="btn btn-outline-primary btn-width-120" @click="addPropertiesItem()">
                  Thêm
                </button>
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
    const toast = useToast()
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
      productProperties: {
        "product_group_id": null,
        "product_type_id": null,
        "properties": []
      },
      productPropertiesItem: {
        "name": null,
        "value": null
      },
      click: false,
      saving: false,
      loading: false,
      isUpdate: false,
    }
  },
  mounted() {
    // Check prefix
    if(this.route.params.id) {
      this.prefix_text = "Cập Nhật "
      this.isUpdate = true
    } else {
      this.prefix_text = "Thêm Mới "
    }

    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()

    this.getProductPropertiesDetail()
  },
  computed: {
    errorProductGroup: function () {
      return this.checkInfo(this.productProperties.product_group_id)
    },
    errorProductType: function () {
      return this.checkInfo(this.productProperties.product_type_id)
    },
    errorName: function () {
      return this.checkInfo(this.productPropertiesItem.name)
    },
    errorValue: function () {
      return this.checkInfo(this.productPropertiesItem.value)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorProductGroup || this.errorProductType)
    },
    checkValidateAddItem () {
      return !(this.errorName || this.errorValue)
    },

    /**
   * Make toast without title
   */
    popToast(variant, content) {
      this.toast(content, variant)
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
     *  Get tất cả các options liên quan
     */
    getOptionsRelated() {
      this.loadingGetOptions = true
      let params = {
        "product_groups": true,
        "product_types": true
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
        }
        this.loadingGetOptions = false
      }).catch(err => {
        this.loadingGetOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     *  Event change product group
     */
    changeProductGroup() {
      if(this.productGroupSelect && this.productGroupSelect.id) {
        this.productProperties.product_group_id = this.productGroupSelect.id

        // Reload list type by group
        this.productTypeOptions = []
        for (let i in this.productTypeOptionStore) {
          if(this.productGroupSelect.id == this.productTypeOptionStore[i].product_group_id) {
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
        this.productProperties.product_group_id = null
          this.resetListProductType()
      }
    },

    /**
     *  Event change product type
     */
    changeProductType() {
      if(this.productTypeSelect && this.productTypeSelect.id) {
        this.productProperties.product_type_id = this.productTypeSelect.id
      } else {
        this.productProperties.product_type_id = null
      }
    },

    /**
     * Get detail
     */
    getProductPropertiesDetail() {
      let productPropertiesId = this.route.params.id
      if(productPropertiesId){
        this.loading = true

        productApi.getProductPropertiesDetail(productPropertiesId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.productProperties = res.data.data

              this.changeProductGroup()
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

    getIndexPropertiesItemByName(name) {
      for(let i in this.productProperties.properties) {
        if(this.productProperties.properties[i].name == name) {
          return i
        }
      }
      return -1
    },

    addPropertiesItem() {
      this.click = true

      let result = this.checkValidateAddItem()
      if(result) {

        let index = this.getIndexPropertiesItemByName(this.productPropertiesItem.name)
        if (index != -1) {
          this.productProperties.properties[index].value.push(this.productPropertiesItem.value)
        } else {
          let newItem = {
            "name": this.productPropertiesItem.name,
            "value": [this.productPropertiesItem.value + ""]
          }
          this.productProperties.properties.push(newItem)
        }

        this.click = false
      }
    },

    deleteItem(itemName, indexValue) {
      let index = this.getIndexPropertiesItemByName(itemName)
      if (index != -1) {
        this.productProperties.properties[index].value.splice(indexValue, 1)

        // TODO: nếu ko tự đánh lại index thì viết hàm update index cho value item
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.router.push('/product-properties')
    },

    /**
     * Save
     */
    save () {
      this.click = true

      let result = this.checkValidate()
      if(result) {
        // Check properties length
        if(this.productProperties.properties.length == 0) {
          this.popToast('danger', "Chưa có thuộc tính nào được thêm vào")
          return
        }
        this.click = false
        this.saving = true

        let propertiesId = this.route.params.id
        if(propertiesId){
          // Edit
          this.productProperties.id = propertiesId
          productApi.updateProductProperties(this.productProperties).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                // show popup success
                this.popToast('success', 'Cập nhật thuộc tính sản phẩm thành công!!! ')
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
          productApi.addProductProperties(this.productProperties).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.router.push("/product-properties")
              }
            }
          }).catch(err => {
            this.saving = false

            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
      }
    }
  }
}
</script>
