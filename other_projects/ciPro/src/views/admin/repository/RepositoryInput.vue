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
            </b-row>

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-1 text-center text-header">{{title}}</h4>
              </b-col>
            </b-row>
            <hr/>

            <b-row class="form-row mt-2" v-if="!repository.is_correction">
              <b-col md="3" class="mt-2">
                <label>
                  <span>Từ đơn hàng nhập</span>
                </label>
              </b-col>
              <b-col md="9" class="mt-2">
                <div class="input-group">
                  <multiselect
                    v-model="orderBuySelect"
                    :options="orderBuyOptions"
                    :loading="loadingOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn từ đơn hàng nhập--"
                    label="name"
                    track-by="name"
                    @input="changeOrderBuy">
                  </multiselect>

                  <b-button variant="outline-primary" class="pull-right ml-2" title="Tìm kiếm"
                            @click="showModalSearchOrderBuy" >
                    <i class="fa fa-search"></i>
                  </b-button>
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-2" v-if="!repository.is_correction">
              <b-col md="12" class="bg-gray text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin nhà cung cấp</span>
                </h5>
              </b-col>
            </b-row>

            <b-row class="form-row" v-if="!repository.is_correction">
              <b-col md="3" class="mt-2">
                <label>
                  <span>Nhà cung cấp</span>
                </label>
              </b-col>
              <b-col md="9" class="mt-2">
                <div class="input-group">
                  <multiselect
                    v-model="supplierSelect"
                    :options="supplierOptions"
                    :loading="loadingOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn nhà cung cấp--"
                    label="name"
                    track-by="name"
                    @input="changeSupplier">
                  </multiselect>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row" v-if="!repository.is_correction">
              <b-col md="3" class="mt-2">
                <label>
                  <span>Tên nhà cung cấp</span>
                </label>
              </b-col>
              <b-col md="9" class="mt-2">
                <input
                  id="supplier_name"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="repository.supplier_name">
              </b-col>
            </b-row>

            <b-row class="form-row" v-if="!repository.is_correction">
              <b-col md="3" class="mt-2">
                <label>
                  <span>Địa chỉ</span>
                </label>
              </b-col>
              <b-col md="9" class="mt-2">
                <input
                  id="supplier_address"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="repository.supplier_address">
              </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col md="12" class="bg-info bg-gradient text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin sản phẩm</span>
                </h5>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Sản phẩm<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <div class="input-group">
                  <multiselect
                    v-model="productSelect"
                    :options="productOptions"
                    :loading="loadingOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn sản phẩm--"
                    label="name"
                    track-by="name"
                    @input="changeProduct">
                  </multiselect>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Đơn giá nhập<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <input
                  id="price"
                  type="text"
                  maxlength="14"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="currentProduct.price"
                @change="changePriceInput">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Số lượng<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <input
                  id="quantity"
                  type="text"
                  maxlength="14"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="currentProduct.quantity"
                  @keyup="integerPointAndCommaOnly($event.target)"
                  @change="changeQuantityInput">
              </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col md="12" class="text-center">
                <b-button variant="outline-primary" class="text-center btn-width-120" @click="confirmBuyProduct">
                  Thêm
                </b-button>
              </b-col>
            </b-row>

            <b-row v-show="repository.products.length > 0" class="mt-2">
              <b-col md="12">
                <h5>Danh sách sản phẩm nhập</h5>
              </b-col>
            </b-row>
            <b-row class="mt-2" v-show="repository.products.length > 0" >
              <b-col md="12" class="table-cus">
                <table class="table table-bordered table-striped fixed_header">
                  <colgroup>
                    <col style="width:5%">
                    <col style="width:17%">
                    <col style="width:18%">
                    <col style="width:10%">
                    <col style="width:15%">
                    <col style="width:15%">
                    <col style="width:15%">
                    <col style="width:5%">
                  </colgroup>
                  <tr>
                      <th class="text-center font-weight-bold">STT</th>
                      <th class="text-center font-weight-bold">Mã SP</th>
                      <th class="text-center font-weight-bold">Tên SP</th>
                      <th class="text-center font-weight-bold">Đơn vị</th>
                      <th class="text-center font-weight-bold">Số lượng</th>
                      <th class="text-center font-weight-bold">Giá nhập</th>
                      <th class="text-center font-weight-bold">Thành tiền</th>
                      <th></th>
                    </tr>
                  <tbody>
                  <tr v-for="(item, index) in repository.products">
                    <td>{{index + 1}}</td>
                    <td>{{item.product_code}}</td>
                    <td>{{item.product_name}}</td>
                    <td>{{item.unit_name}}</td>
                    <td class="text-right">
                      <input
                        :id="'quantity_' + index"
                        type="text"
                        maxlength="14"
                        autocomplete="new-password"
                        class="form-control"
                        :value="item.quantity"
                        @keyup="integerPointAndCommaOnly($event.target)"
                        @change="changeQuantity(index)">
                    </td>
                    <td class="text-right">
                      <input
                        :id="'price_' + index"
                        type="text"
                        maxlength="14"
                        autocomplete="new-password"
                        class="form-control"
                        :value="item.price"
                        @change="changePrice(index)">
                    </td>
                    <td class="text-right">{{currencyFormat(item.amount)}}</td>
                    <td>
                      <i class="fa fa-trash" @click="deleteProduct(index)" />
                    </td>
                  </tr>
                  </tbody>
                </table>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>Tổng tiền sản phẩm:  {{currencyFormat(repository.sub_total)}}</label>
              </b-col>
            </b-row>

            <b-row class="mt-4">
              <b-col md="12" class="text-center">
                <b-button v-show="!saving" variant="outline-success" style="height: 50px; width: 240px" @click="save"
                          :disabled="saving">
                  <i class="fa fa-pencil-square-o" style="margin-right: 5px" />
                  Xác nhận nhập kho
                </b-button>
                <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <!--Modal tìm kiếm đơn hàng bán -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-search-order-buy">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Tìm kiếm đơn hàng nhập</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="6">
          <label> Mã đơn hàng nhập </label>
          <input
            id="order_buy_number"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="orderBuySearch.order_buy_number"
            maxlength="15">
        </b-col>
        <b-col md="6">
          <label> Tên nhà cung cấp </label>
          <input
            id="supplier_name_search"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="orderBuySearch.supplier_name"
            maxlength="255">
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalSearchOrderBuy">
            Quay lại
          </b-button>

          <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearchOrderBuy"
                    @click.prevent="searchOrderBuy">
            Tìm Kiếm
          </b-button>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col>
          <b-table
            hover
            bordered
            stacked="md"
            :fields="orderBuySearchFields"
            :items="orderBuySearchItems">
            <template v-slot:cell(actions)="data">
              <b-button variant="outline-success" class="pull-right btn-width-120"
                        @click.prevent="chooseOrderBuy(data.item.id, data.item.supplier_id)">
                Chọn
              </b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col>
          <p class="text-center">---Hết---</p>
        </b-col>
      </b-row>

    </b-modal>

    <!-- Modal giữ hàng -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-repo-keep">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Bạn có muốn giữ hàng cho các đơn hàng bán dưới đây?</h4>
        </b-col>
      </b-row>
      <hr>
      <b-row>
            <b-col>
              <b-table
                hover
                bordered
                stacked="md"
                :fields="repo_product_fields"
                :items="repo_products">
              </b-table>
            </b-col>
          </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalRepoKeep">
            Bỏ qua
          </b-button>

          <b-button v-show="!saving" variant="outline-primary" class="pull-right btn-width-120"
                    :disabled="saving" @click.prevent="confirmRepoKeep">
            Giữ hàng
          </b-button>

          <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
        </b-col>
      </b-row>

    </b-modal>


  </div>
</template>


<script>
import repositoryApi from '@/api/repository'
import orderBuyApi from '@/api/orderBuy'
import fundApi from '@/api/fund'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'


export default {
  components: {
    Multiselect
  },
  data () {
    return {
      title: "Thêm Mới Phiếu Nhập Kho",
      repository: {
        is_correction: false,
        order_buy_id: null,
        supplier_id: null,
        supplier_name: null,
        supplier_address: null,
        products: [],
        sub_total: 0
      },
      currentProduct: {
        product_id: null,
        product_code: null,
        product_name: null,
        product_brand: null,
        unit_name: null,
        quantity: 0,
        price: 0,
      },
      loadingOptions: false,
      orderBuySelect: {},
      orderBuy: {},
      orderBuyOptions: [],
      supplierSelect: {},
      supplierOptions: [],
      productSelect: {},
      productOptions: [],
      saving: false,
      orderBuySearchItems: [],
      orderBuySearchFields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'created_at',
          label: 'Ngày lập'
        },
        {
          key: 'order_buy_number',
          label: 'Số ĐH'
        },
        {
          key: 'supplier_name',
          label: 'Tên nhà cung cấp'
        },
        {
          key: 'total',
          label: 'Thành tiền'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      onSearchOrderBuy: false,
      orderBuySearch: {
        order_buy_number: null,
        supplier_name: null
      },
      repo_products: [],
      repo_product_fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'order_sell_number',
          label: 'ĐH bán'
        },
        {
          key: 'product_name',
          label: 'Sản phẩm'
        },
        {
          key: 'quantity',
          label: 'Số lượng giữ'
        }
      ],
    }
  },
  mounted() {
    // Kiểm tra là nhập kho thường hay nhập hiệu chỉnh kho
    let url = location.href
    if(url.includes("repo-correction-input")) {
      this.repository.is_correction = true
      this.title = 'Thêm Mới Hiệu Chỉnh Thừa Hàng Hoá'
    }

    // Get options related repository
    this.getOptionRelatedRepository()
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

    back() {
      if(this.repository.is_correction) {
        this.$router.push("/repo-correction-history")
      } else {
        this.$router.push("/repo-history")
      }
    },

    /**
     * Get options related repository
     */
    getOptionRelatedRepository() {
      this.loadingOptions = true

      let params = {
        order_buys: true,
        suppliers: true,
        products: true
      }

      repositoryApi.getOptionsRelatedRepository(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          this.supplierOptions = options.suppliers
          this.productOptions = options.products

          this.orderBuyOptions = options.order_buys

          if(!this.repository.is_correction) {
            this.checkCreatedFromOrderBuy()
          }
        }
        this.loadingOptions = false
      }).catch(err => {
        this.loadingOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    checkCreatedFromOrderBuy() {
      // Check tạo phiếu xuất kho từ đơn hàng nhập
      let url = location.href
      if(url.includes("repository-from-order-buy")) {
        let orderBuyId = this.$route.params.id
        this.chooseOrderBuy(orderBuyId, null)
      }
    },

    /**
     *  Event change quotation
     */
    chooseOrderBuy(orderBuyId, supplierId) {
      if(orderBuyId) {
        for(let item of this.orderBuyOptions) {
          if(item.id == orderBuyId) {
            this.orderBuySelect = item
            this.changeOrderBuy()
            break
          }
        }
      }
      if(supplierId) {
        this.getSupplierById(supplierId)
      }
      this.hideModalSearchOrderBuy()
    },

    getSupplierById(supplierId) {
      for(let supplier of this.supplierOptions) {
        if(supplier.id == supplierId) {
          this.supplierSelect = supplier
          break
        }
      }
      return {}
    },

    showModalSearchOrderBuy() {
      this.$bvModal.show('modal-search-order-buy')
    },

    hideModalSearchOrderBuy() {
      this.$bvModal.hide('modal-search-order-buy')
    },

    getSupplierItemById() {
      if(this.repository.supplier_id && this.supplierOptions.length > 0) {
        for(let i in this.supplierOptions) {
          if(this.supplierOptions[i].id == this.repository.supplier_id) {
            this.supplierSelect = this.supplierOptions[i]
            break
          }
        }
        this.changeSupplier()
      }
    },

    refreshRepositoryInfo() {
      this.repository = {
        is_correction: false,
        order_buy_id: null,
        supplier_id: null,
        supplier_name: null,
        supplier_address: null,
        products: [],
        sub_total: 0
      }
    },

    changeOrderBuy() {
      // Get detail from DB
      if(this.orderBuySelect && this.orderBuySelect.id) {
        repositoryApi.getOrderBuyDetailForRepoInput(this.orderBuySelect.id).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.refreshRepositoryInfo()

            let orderBuy = res.data.data

            this.repository.order_buy_id = orderBuy.id

            this.repository.supplier_id = orderBuy.supplier_id
            this.getSupplierItemById()

            let products = orderBuy.products
            for(let i in products) {
              let product = {
                "product_id": products[i].product_id,
                "product_code": products[i].product_code,
                "product_name": products[i].product_name,
                "unit_name": products[i].unit,
                "quantity": this.currencyFormat(products[i].quantity),
                "price": this.currencyFormat(products[i].price_buy),
                "amount": products[i].amount
              }
              this.repository.products.push(product)
            }

            this.calProductSubTotal()
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
     *  Event change supplier
     */
    changeSupplier() {
      if(this.supplierSelect && this.supplierSelect.id) {
        this.repository.supplier_id = this.supplierSelect.id
        this.repository.supplier_name = this.supplierSelect.name
        this.repository.supplier_address = this.supplierSelect.address
      } else{
        this.repository.supplier_id = null
        this.repository.supplier_name = null
        this.repository.supplier_address = null
      }
    },

    changeProduct() {
      if(this.productSelect && this.productSelect.id) {
        this.currentProduct.product_id = this.productSelect.id
        this.currentProduct.product_name = this.productSelect.product_name
        this.currentProduct.product_code = this.productSelect.product_code
        this.currentProduct.brand_name = this.productSelect.brand_name
        this.currentProduct.unit_name = this.productSelect.unit_name
      } else {
        this.currentProduct.product_id = null
        this.currentProduct.product_name = null
        this.currentProduct.product_code = null
        this.currentProduct.brand_name = null
        this.currentProduct.unit_name = null
      }
    },

    showModalSearchProduct() {
      this.$bvModal.show('modal-search-product')
    },

    hideModalSearchProduct() {
      this.$bvModal.hide('modal-search-product')
    },

    confirmBuyProduct() {
      if(!this.currentProduct.product_id || !this.currentProduct.quantity || !this.currentProduct.price) {
        this.popToast('danger', "Vui lòng nhập đủ các thông tin bắt buộc")
        return
      }
      let quantity = (this.currentProduct.quantity + "").replaceAll(",", "")
      let price = (this.currentProduct.price + "").replaceAll(",", "")
      this.currentProduct.amount = Math.round(parseFloat(quantity) * parseInt(price))
      this.repository.products.push(this.currentProduct)

      this.calProductSubTotal()

        // Lam moi
      this.currentProduct = {
        product_id: null,
        product_code: null,
        product_name: null,
        product_brand: null,
        unit_name: null,
        quantity: 0,
        price: 0,
      }
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

    calProductSubTotal() {
      this.repository.sub_total = 0
      for (let item of this.repository.products) {
        this.repository.sub_total += item.amount
      }
    },

    deleteProduct(index) {
      this.repository.products.splice(index, 1)
      this.calProductSubTotal()
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

    searchOrderBuy() {
      if (this.onSearchOrderBuy) { return }

      this.onSearchOrderBuy = true

      let params = {
        "order_buy_number": this.orderBuySearch.order_buy_number,
        "supplier_name": this.orderBuySearch.supplier_name,
        "limit": 100,
        "offset": 0
      }

      fundApi.searchOrderBuy(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.orderBuySearchItems = res.data.data
        } else {
          this.orderBuySearchItems = []
        }
        this.onSearchOrderBuy = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onSearchOrderBuy = false
      })
    },

    save() {

      // Validate
      if(this.repository.products.length == 0) {
        this.popToast('danger', 'Vui lòng chọn sản phẩm muốn nhập kho!')
        return;
      } else {
        for(let item of this.repository.products) {
          item.price = (item.price + "").replaceAll(",", "")
          item.quantity = (item.quantity + "").replaceAll(",", "")
          item.amount = Math.round(parseInt(item.price) * parseFloat(item.quantity))
        }
      }

      // Add
      this.saving = true
      repositoryApi.addRepositoryInput(this.repository).then(res => {
        this.saving = false
        if(res != null && res.data != null){

          if (res.data.status == 200) {
            if(res.data.data && res.data.data.length > 0) {
              this.repo_products = res.data.data
              this.showModalRepoKeep()
            } else {
              this.back()
            }
          }
        }
      }).catch(err => {
        this.saving = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    changeQuantity(index) {
      let quantity = document.getElementById("quantity_" + index).value
      if(quantity) {
        quantity = (quantity + "").replaceAll(",", "")

        let price_buy = document.getElementById("price_" + index).value
        if(price_buy) {
          price_buy = (price_buy + "").replaceAll(",", "")
          let amount = Math.round(parseInt(price_buy) * parseFloat(quantity))
          amount = this.currencyFormat(amount)
          this.repository.products[index].amount = amount
          // document.getElementById("amount_" + index).value = amount
        } else {
          this.repository.products[index].amount = null
          // document.getElementById("amount_" + index).value = null
        }

        quantity = this.currencyFormat(quantity)
        document.getElementById("quantity_" + index).value = quantity
        this.repository.products[index].quantity = quantity
      } else {
        this.repository.products[index].amount = null
        // document.getElementById("amount_" + index).value = null
      }

    },

    changePrice(index) {
      let price_buy = document.getElementById("price_" + index).value
      if(price_buy) {
        price_buy = (price_buy + "").replaceAll(",", "")

        let quantity = document.getElementById("quantity_" + index).value
        if(quantity) {
          quantity = (quantity + "").replaceAll(",", "")
          let amount = Math.round(parseInt(price_buy) * parseFloat(quantity))
          amount = this.currencyFormat(amount)
          this.repository.products[index].amount = amount
          // document.getElementById("amount_" + index).value = amount
        } else {
          this.repository.products[index].amount = null
          // document.getElementById("amount_" + index).value = null
        }

        price_buy = this.currencyFormat(price_buy)
        document.getElementById("price_" + index).value = price_buy
        this.repository.products[index].price = price_buy
      } else {
        this.repository.products[index].amount = null
        // document.getElementById("amount_" + index).value = null
      }
    },

      changePriceInput() {
      let price = parseInt((this.currentProduct.price + "").replaceAll(",", ""))
      this.currentProduct.price = this.currencyFormat(price)
    },

      changeQuantityInput() {
      let quantity = parseInt((this.currentProduct.quantity + "").replaceAll(",", ""))
      this.currentProduct.quantity = this.currencyFormat(quantity)
    },

    showModalRepoKeep() {
      this.$bvModal.show('modal-repo-keep')
    },

    hideModalRepoKeep() {
      this.back()
      this.$bvModal.hide('modal-repo-keep')
    },

    confirmRepoKeep() {
      let params = {
        'order_buy_id': this.repository.order_buy_id,
        'products': this.repo_products
      }
      repositoryApi.keepProductOnRepo(params).then(res => {
          this.saving = false
          if(res != null && res.data != null){

            if (res.data.status == 200) {
                this.back()
            }
          }
        }).catch(err => {
          this.saving = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
    },

  }
}
</script>

<style lang="scss" scoped>
  @media print {
    .print-center {
      text-align: center;
    }
  }

  .title-partner {
    border-radius: 5px 5px;
    padding: 5px;

  }
</style>
