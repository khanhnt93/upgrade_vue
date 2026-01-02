<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

              <b-row>
              <b-col cols="6">
                <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="back">
                  Quay lại
                </b-button>
              </b-col>
              <b-col cols="6">
                <b-button variant="outline-success" class="pull-right btn-width-120" @click="save" :disabled="saving">
                    Lưu
                </b-button>
              </b-col>
            </b-row>

              <b-row>
                <b-col md='12'>
                  <h4 class="mt-2 text-center text-header">{{prefix_text}}Thuộc Tính Sản Phẩm</h4>
                </b-col>
              </b-row>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Nhóm sản phẩm </label><span class="error-sybol"></span>
                </b-col>
                <b-col md="9">
                  <b-form-select
                  :options="productGroupOptions"
                  id="productGroup"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="productProperties.product_group_id"
                  @change="changeProductGroup"
                  :disabled="isUpdate"></b-form-select>
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorProductGroup">
                    Vui lòng nhập nhóm sản phẩm
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Loại sản phẩm </label><span class="error-sybol"></span>
                </b-col>
                <b-col md="9">
                  <b-form-select
                    :options="productTypeOptions"
                    id="productType"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="productProperties.product_type_id"
                    :disabled="isUpdate || !productProperties.product_group_id"></b-form-select>
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorProductType">
                    Vui lòng nhập loại sản phẩm
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row v-show="productProperties.properties.length > 0">
                <b-col>
                  <p v-for="(item) in productProperties.properties">
                    + {{item.name}}:
                    <span v-for="(value, index) in item.value" class="ml-2">
                      - {{value}}
                      <i class="fa fa-trash" title="Delete" @click="deleteItem(item.name, index)"/>
                    </span>
                  </p>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Tên thuộc tính (ví dụ: Size)</label><span class="error-sybol"></span>
                </b-col>
                <b-col md="9">
                  <input
                  id="code"
                  type="text"
                  maxlength="30"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="productPropertiesItem.name">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorName">
                    Vui lòng nhập tên thuộc tính
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Giá trị thuộc tính (ví dụ: S)</label><span class="error-sybol"></span>
                </b-col>
                <b-col md="9">
                  <input
                  id="name"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="productPropertiesItem.value">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorValue">
                    Vui lòng nhập giá trị thuộc tính
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

            <b-row class="mt-2 text-center">
              <b-col>
                <b-button variant="outline-primary" class="btn-width-120" @click="addPropertiesItem()">
                  Thêm
                </b-button>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import productApi from '@/api/product'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      prefix_text: '',
      productTypeOptions:[],
      productGroupOptions:[],
      productTypeOptionStore:[],
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
    if(this.$route.params.id) {
      this.prefix_text = "Cập Nhật "
      this.isUpdate = true
    } else {
      this.prefix_text = "Thêm Mới "
    }

    // Get product group option
    this.getProductGroupOption()
    this.getProductTypeOption()

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
      this.$bvToast.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      })
    },

    /**
     *  Get product group options
     */
    getProductGroupOption() {

      productApi.getProductGroupOption().then(res => {
        console.log("xx")
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
     *  Get product type options
     */
    getProductTypeOption() {
      productApi.getProductTypeOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.productTypeOptionStore = res.data.data
        }
      })
    },

    changeProductGroup() {
      this.productTypeOptions = [{value: null, text: ''}]

      for (let i in this.productTypeOptionStore) {
        if(this.productProperties.product_group_id == this.productTypeOptionStore[i].product_group_id) {
          let item = {value: this.productTypeOptionStore[i].value, text: this.productTypeOptionStore[i].text}
          this.productTypeOptions.push(item)
        }
      }
    },

    /**
     * Get detail
     */
    getProductPropertiesDetail() {
      let productPropertiesId = this.$route.params.id
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
      this.$router.push('/product-properties')
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

        let propertiesId = this.$route.params.id
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
                this.$router.push("/product-properties")
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
