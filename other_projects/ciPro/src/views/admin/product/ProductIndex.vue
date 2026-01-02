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

              <b-row class="form-row">
                <b-col md='12'>
                  <h4 class="mt-1 text-center text-header">{{prefix_text}} Sản Phẩm</h4>
                </b-col>
              </b-row>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Nhóm sản phẩm<span class="error-sybol"></span></label>
                </b-col>
                <b-col md="9">
                  <b-form-select
                  :options="productGroupOptions"
                  id="productGroup"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="product.product_group_id"
                  @change="changeProductGroup"></b-form-select>
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorProductGroup">
                    Vui lòng nhập nhóm sản phẩm
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Loại sản phẩm<span class="error-sybol"></span></label>
                </b-col>
                <b-col md="9">
                  <b-form-select
                    :options="productTypeOptions"
                    id="productType"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="product.product_type_id"></b-form-select>
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorProductType">
                    Vui lòng nhập loại sản phẩm
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Hãng sản phẩm </label>
              </b-col>
              <b-col md="9">
                <b-form-select
                  :options="productBrandOptions"
                  id="product_brand"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="product.product_brand_id"></b-form-select>
              </b-col>
            </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Mã sản phẩm </label>
                </b-col>
                <b-col md="9">
                  <input
                  id="code"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="product.code"
                  maxlength="255">
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Tên sản phẩm<span class="error-sybol"></span></label>
                </b-col>
                <b-col md="9">
                  <input
                  id="name"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="product.name"
                  maxlength="255">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorName">
                    Vui lòng nhập tên sản phẩm
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Đơn vị<span class="error-sybol"></span></label>
                </b-col>
                <b-col md="9">
                  <b-form-select
                  :options="unitOptions"
                  id="unit"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="product.unit_id"></b-form-select>
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorUnit">
                    Vui lòng nhập đơn vị
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Giá list </label>
                </b-col>
                <b-col md="9">
                  <input
                    id="price_list"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="product.price_list"
                    maxlength="14"
                    @keyup="integerAndPointOnly($event.target)">
                </b-col>
              </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Chiết khấu </label>
              </b-col>
              <b-col md="9">
                <input
                  id="discount"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="product.discount"
                  maxlength="14"
                  @keyup="integerAndPointOnly($event.target)">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Giá bán </label>
              </b-col>
              <b-col md="9">
                <input
                  id="price_sell"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="product.price_sell"
                  maxlength="14"
                  @keyup="integerAndPointOnly($event.target)">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Mô tả </label>
              </b-col>
              <b-col md="9">
                <b-form-textarea
                  id="description"
                  style="width:100%;"
                  rows="3"
                  v-model="product.description"
                ></b-form-textarea>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Nguyên liệu </label>
              </b-col>
              <b-col md="9">
                <b-row v-if="product.resources.length > 0" v-for="(resource, index) in product.resources" :key="index">
                  <b-col md="12">
                    <p>- <b class="mr-2">{{resource.product_name}}</b>
                        <i class="fa fa-trash" @click="deleteResource(index)"></i>
                    </p>
                    <p> Số lượng: {{currencyFormat(resource.quantity)}}</p>
                  </b-col>
                </b-row>

                <b-row class="mt-3">
                  <b-col md="12">
                    <b-row>
                      <b-col md="12">
                        <multiselect
                          v-model="resource.product"
                          :options="productOptions"
                          :loading="loadingProductOptions"
                          :select-label="''"
                          :deselect-label="''"
                          placeholder="-- Chọn nguyên liệu --"
                          label="name_full"
                          track-by="name_full">
                        </multiselect>
                      </b-col>
                    </b-row>
                    <b-row class="mt-1">
                      <b-col md="12">
                        <input
                        id="quantity"
                        type="text"
                        autocomplete="new-password"
                        class="form-control"
                        v-model="resource.quantity"
                        maxlength="11"
                        placeholder="Nhập số lượng"
                        @keyup="integerAndPointOnly($event.target)">
                      </b-col>
                    </b-row>
<!--                    <b-row class="mt-1">-->
<!--                      <b-col md="12">-->
<!--                        <input-->
<!--                        id="price"-->
<!--                        type="text"-->
<!--                        autocomplete="new-password"-->
<!--                        class="form-control"-->
<!--                        v-model="resource.price"-->
<!--                        maxlength="14"-->
<!--                        placeholder="Nhập giá bán"-->
<!--                        @keyup="integerAndPointOnly($event.target)">-->
<!--                      </b-col>-->
<!--                    </b-row>-->

                  </b-col>
                </b-row>

                <b-row class="mt-2">
                  <b-col md="12" class="text-center">
                    <b-button variant="outline-primary" class="btn-width-220" @click="addResources">
                      Thêm nguyên liệu
                    </b-button>
                  </b-col>
                </b-row>

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
import quotationApi from '@/api/quotation'
import unitApi from '@/api/unit'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'


export default {
  components: {
    Multiselect
  },
  data () {
    return {
      prefix_text: 'Thêm Mới',
      productTypeOptions:[],
      productGroupOptions:[],
      productBrandOptions: [],
      productTypeOptionStore:[],
      unitOptions:[],
      productOptions: [],
      loadingProductOptions: false,
      product: {
        "code": null,
        "name": null,
        "product_type_id": null,
        "product_group_id": null,
        "product_brand_id": null,
        "unit_id": null,
        "price_list": null,
        "discount": null,
        "price_sell": null,
        "description": null,
        "resources": []
      },
      resource: {
        "product": {},
        "quantity": null
      },
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    // Check prefix
    if(this.$route.params.id) {
      this.prefix_text = "Cập Nhật"
    } else {
      this.prefix_text = "Thêm Mới"
    }

    // Lấy danh sách sản phẩm
    this.getProductOptions()

    // Get product group options
    this.getProductGroupOption()

    // Get product brand options
    this.getProductBrandOption()

    // Get unit options
    this.getUnitOption()


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
      this.$bvToast.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      })
    },

    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorName || this.errorProductType || this.errorProductGroup || this.errorUnit)
    },

    /**
     *  Get customer options
     */
    getProductOptions() {
      this.loadingProductOptions = true

      quotationApi.getProductOptions().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          // Products
          this.productOptions = res.data.data
          let itemEmpty = {"id": null, "name_full": '-- Chọn sản phẩm --'}
          this.productOptions.unshift(itemEmpty)
        }

        this.loadingProductOptions = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loadingProductOptions = false
      })
    },

    /**
     *  Get product type options
     */
    getProductTypeOption() {
      productApi.getProductTypeOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.productTypeOptionStore = res.data.data

            // Get product detail
            this.getProductDetail()
        }
      })
    },

    /**
     *  Get product brand options
     */
    getProductBrandOption() {
      productApi.getProductBrandOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.productBrandOptions = [{value: null, text: ''}]

          var productBrands = res.data.data
          if(productBrands) {
            for (let i in productBrands) {
              this.productBrandOptions.push(productBrands[i])
            }
          }
        }
      })
    },

    changeProductGroup() {
        this.productTypeOptions = [{value: null, text: ''}]

        for (let i in this.productTypeOptionStore) {
            if(this.product.product_group_id == this.productTypeOptionStore[i].product_group_id) {
                let item = {value: this.productTypeOptionStore[i].value, text: this.productTypeOptionStore[i].text}
                this.productTypeOptions.push(item)
            }
        }
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

          // Get product type options
          this.getProductTypeOption()
        }
      })
    },

    /**
     *  Get unit options
     */
    getUnitOption() {
      unitApi.getListUnitOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.unitOptions = [{value: null, text: ''}]

          var units = res.data.data
          if(units) {
            for (let i in units) {
              this.unitOptions.push(units[i])
            }
          }
        }
      })
    },

    /**
     *  Get detail
     */
    getProductDetail() {
      let productId = this.$route.params.id
      if(productId){
        this.loading = true

        productApi.getProductDetail(productId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.product = res.data.data

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

    /**
     *  Save
     */
    save () {
      this.click = true

      let result = this.checkValidate()
      if(result) {
        this.saving = true

        let productId = this.$route.params.id
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
            this.popToast('danger', errorMess)
          })
        } else {
          // Add
          productApi.addProduct(this.product).then(res => {
            this.saving = false
            if(res != null && res.data != null){

              let message = ""
              if (res.data.status == 200) {
                this.$router.push("/product")
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

    },

    deleteResource(index) {
      this.product.resources.splice(index, 1)
    },

    addResources() {
      if(!this.resource.product && !this.resource.product.id) {
        this.popToast('danger', 'Vui lòng chọn sản phẩm')
        return
      }
      if(!this.resource.quantity) {
        this.popToast('danger', 'Vui lòng nhập số lượng')
        return
      }
      this.resource.quantity = this.resource.quantity.replace(",", "")
      // if(!this.resource.price) {
      //   this.popToast('danger', 'Vui lòng nhập đơn giá')
      //   return
      // }
      // this.resource.price = this.resource.price.replace(",", "").replace(".", "")

      // Kiểm tra có trùng sản phẩm ko
      let is_exist = false
      for(let resource in this.product.resources) {
        if (this.resource.product.id == resource.product_id) {
          // let quantity = this.resource.quantity + resource.quantity
          // resource.price = Math.round((parseInt(resource.price) * parseFloat(resource.quantity)) + (parseFloat(this.resource.quantity) * parseInt(this.resource.price)) / quantity)
          resource.quantity = parseFloat(this.resource.quantity)
          is_exist = true
          break
        }
      }

      if(is_exist == false) {
        let resource_new = {
          product_id: this.resource.product.id,
          product_name: this.resource.product.name_full,
          quantity: this.resource.quantity
        }
        this.product.resources.push(resource_new)
      }

      this.resource = {
        "product": {},
        "quantity": null,
        "price": null
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push("/product")
    },

    /**
     * Only input integer
     */
    integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

    /**
     * Only input float
     */
    integerAndPointOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerAndPointOnly(valueInput)
      item.value = result
    },

    currencyFormat(num) {
      let result = ""
      if(num == 0) {
        return "0"
      }
      num = (num + "").replaceAll(",", "")
      if(num) {
        result = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },
  }
}
</script>
