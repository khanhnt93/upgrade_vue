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
                  <h4 class="mt-2 text-center text-header">{{prefix_text}}Dự Án Mẫu</h4>
                </b-col>
              </b-row>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label>Tên dự án</label><span class="error-sybol"></span>
                </b-col>
                <b-col md="9">
                  <input
                  id="content"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="project.name">
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Hãng sản phẩm </label>
                </b-col>
                <b-col md="9">
                  <b-form-select
                    :options="productBrandOptions"
                    id="brand_id"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="project.brand_id"></b-form-select>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Đơn vị </label>
                </b-col>
                <b-col md="9">
                  <b-form-select
                  :options="unitOptions"
                  id="unit_id"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="project.unit_id"></b-form-select>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label>Danh sách sản phẩm<span class="error-sybol"></span></label>
                </b-col>
                <b-col md="9" class="mt-2">
                  <b-row v-for="(product, index) in project.products" :key="product.product_name">
                    <b-col>
                      <p>- <b class="mr-2">{{product.product_name}}</b>
                        <i class="fa fa-trash" @click="deleteProduct(index)"></i>
                      </p>
                      <p>{{currencyFormat(product.product_quantity)}} x {{currencyFormat(product.product_price)}} = {{currencyFormat(product.product_amount)}}</p>
                    </b-col>
                  </b-row>

                  <b-row class="input-group mt-1">
                      <b-col md="10" class="mt-2">
                        <multiselect
                          v-model="productSelect"
                          :options="productOptions"
                          :loading="loadingProductOptions"
                          :select-label="''"
                          :deselect-label="''"
                          placeholder="--Chọn sản phẩm--"
                          label="name_full"
                          track-by="name_full">
                        </multiselect>
                      </b-col>
                  </b-row>

                  <b-row class="input-group mt-1">
                    <b-col>
                      <input
                          id="product_price"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="product.product_price"
                          placeholder="Giá bán"
                          @keyup="integerPointAndCommaOnly($event.target)"
                          @change="changePrice()">
                    </b-col>
                  </b-row>
                  <b-row class="input-group mt-1">
                    <b-col>
                      <input
                          id="product_quantity"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="product.product_quantity"
                          placeholder="Số lượng"
                          @keyup="integerPointAndCommaOnly($event.target)"
                          @change="changeQuantity()">
                    </b-col>
                  </b-row>
                  <b-row class="input-group mt-1 text-center">
                    <b-col>
                      <b-button variant="outline-primary" class="btn-width-220" @click="addProduct"
                                :disabled="!productSelect.id">
                          Thêm sản phẩm
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
import projectApi from '@/api/project'
import productApi from '@/api/product'
import unitApi from '@/api/unit'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'


export default {
  components: {
    Multiselect
  },
  data () {
    return {
      prefix_text: '',
      productBrandOptions: [],
      unitOptions:[],
      project: {
        "name": null,
        "brand_id": null,
        "unit_id": null,
        "products": [],
      },
      product: {
        id: null,
        product_price: null,
        product_quantity: null,
        product_amount: null
      },
      productSelect: {},
      productOptions: [],
      loadingProductOptions: false,
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    // Check prefix
    if(this.$route.params.id) {
      this.prefix_text = "Cập Nhật "
    } else {
      this.prefix_text = "Thêm Mới "
    }

    // Lấy danh sách sản phẩm
    this.getProductOptions()

    // Get product brand options
    this.getProductBrandOption()

    // Get unit options
    this.getUnitOption()

    // Get product group detail
    this.getProjectDetail()
  },
  methods: {

    /**
     *  Get customer options
     */
    getProductOptions() {
      this.loadingProductOptions = true

      projectApi.getProductOptions().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          // Products
          this.productOptions = res.data.data
          let itemEmpty = {"id": null, "name_full": '-- Chọn sản phẩm --', "price": 0}
          this.productOptions.unshift(itemEmpty)
          this.productSelect = this.productOptions[0]
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
     * Get detail
     */
    getProjectDetail() {
      let projectId = this.$route.params.id
      if(projectId){
        this.loading = true

        projectApi.getProjectDetail(projectId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.project = res.data.data
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

    addProduct() {
      if(!this.productSelect.id) {
        this.popToast('danger', 'Vui lòng chọn sản phẩm')
        return
      }
      if(!this.product.product_price) {
        this.popToast('danger', 'Vui lòng nhập giá sản phẩm')
        return
      }
      let product_price = (this.product.product_price + '').replaceAll(",", "")
      if(!this.product.product_quantity) {
        this.popToast('danger', 'Vui lòng nhập số lượng sản phẩm')
        return
      }
      let product_quantity = (this.product.product_quantity + '').replaceAll(",", "")

      let product = {
        product_id: this.productSelect.id,
        product_name: this.productSelect.name_full,
        product_price: product_price,
        product_quantity: product_quantity,
        product_amount: Math.round(parseInt(product_price) * parseFloat(product_quantity))
      }
      this.project.products.push(product)
      this.handleListProduct()

      this.resetProduct()
    },

      handleListProduct() {
        let length = this.project.products.length
        if (length <= 1) {
            return
        }
        if (length == 2) {
            if(this.project.products[0].product_id == this.project.products[1].product_id) {
                let quantity = parseFloat(this.project.products[0].product_quantity) + parseFloat(this.project.products[1].product_quantity)
                this.project.products[0].product_price = Math.round((
                    (parseFloat(this.project.products[0].product_quantity) * parseInt(this.project.products[0].product_price))
                    +
                    (parseFloat(this.project.products[1].product_quantity) * parseInt(this.project.products[1].product_price))
                ) / quantity)
                this.project.products[0].product_quantity = quantity
                this.project.products[0].product_amount = Math.round(this.project.products[0].product_price * this.project.products[0].product_quantity)

                this.project.products.splice(1, 1)

                return
            }
        }
        for (let i = 0; i < length - 1; i++) {
            if(this.project.products[i].product_id == this.project.products[length-1].product_id) {
              let quantity = parseFloat(this.project.products[i].product_quantity) + parseFloat(this.project.products[length-1].product_quantity)
                this.project.products[i].product_price = Math.round((
                    (parseFloat(this.project.products[i].product_quantity) * parseInt(this.project.products[i].product_price))
                    +
                    (parseFloat(this.project.products[length-1].product_quantity) * parseInt(this.project.products[length-1].product_price))
                ) / quantity)
                this.project.products[i].product_quantity = quantity
                this.project.products[i].product_amount = Math.round(this.project.products[i].product_price * this.project.products[i].product_quantity)


                this.project.products.splice(length-1, 1)

                return
            }
        }
      },

    resetProduct() {
      this.productSelect = JSON.parse(JSON.stringify(this.productOptions[0]))
      this.product = {
        product_id: null,
        product_name: null,
        product_price: null,
        product_quantity: null,
        product_amount: null
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push('/project')
    },

    /**
     * Save
     */
    save () {
      // Validate
      if(!this.project.name) {
        this.popToast('danger', "Tên dự án mẫu không được để trống")
        return
      }
      if(this.project.products.length == 0) {
        this.popToast('danger', "Mỗi dự án phải có ít nhất một sản phẩm")
        return
      }

      this.saving = true

      let projectId = this.$route.params.id
      if(projectId){
        // Edit
        this.project.id = projectId
        projectApi.updateProject(this.project).then(res => {
          this.saving = false
          if(res != null && res.data != null){
            if (res.data.status == 200) {
              // show popup success
              this.popToast('success', 'Cập nhật dự án mẫu thành công!!! ')
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
        projectApi.addProject(this.project).then(res => {

          if(res != null && res.data != null){
            if (res.data.status == 200) {
              this.$router.push("/project")
            }
          }

          this.saving = false
        }).catch(err => {
          this.saving = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    },

    // changeProduct() {
    //   if(this.productSelect && this.productSelect.price) {
    //     this.product.product_price = this.currencyFormat(this.productSelect.price)
    //   }
    // },

    changePrice() {
      let product_price = (this.product.product_price + '').replaceAll(",", "")
      this.product.product_price = this.currencyFormat(product_price)
    },

    changeQuantity() {
      let product_quantity = (this.product.product_quantity + '').replaceAll(",", "")
      this.product.product_quantity = this.currencyFormat(product_quantity)
    },

    deleteProduct(index) {
      this.project.products.splice(index, 1)
    },

    /**
     * Only input integer and point
     */
    integerPointAndCommaOnly(item) {
      let valueInput = item.value
        valueInput = valueInput.replaceAll(",", "")
      let result = commonFunc.integerPointAndCommaOnly(valueInput)

        result = this.currencyFormat(result)
      item.value = result
    },

      /**
   * Currency format
   */
    currencyFormat(num) {
      let result = ""
        if(num === 0) {
            return "0"
        }
        if(num) {
            num = (num + "").replaceAll(",", "")
        }

      if(num) {
        result = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },
  }
}
</script>
