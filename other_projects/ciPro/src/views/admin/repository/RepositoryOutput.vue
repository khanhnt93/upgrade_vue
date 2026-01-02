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
                  <span>Từ đơn hàng bán</span>
                </label>
              </b-col>
              <b-col md="9" class="mt-2">
                <div class="input-group">
                  <multiselect
                    v-model="orderSellSelect"
                    :options="orderSellOptions"
                    :loading="loadingOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn từ đơn hàng bán--"
                    label="name"
                    track-by="name"
                    @input="changeOrderSell">
                  </multiselect>

                  <b-button variant="outline-primary" class="pull-right ml-2" title="Tìm kiếm"
                            @click="showModalSearchOrderSell" >
                    <i class="fa fa-search"></i>
                  </b-button>
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-2" v-if="!repository.is_correction">
              <b-col md="12" class="bg-gray text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin khách hàng</span>
                </h5>
              </b-col>
            </b-row>

            <b-row class="form-row" v-if="!repository.is_correction">
              <b-col md="3" class="mt-2">
                <label>
                  <span>Khách hàng</span>
                </label>
              </b-col>
              <b-col md="9" class="mt-2">
                <div class="input-group">
                  <multiselect
                    v-model="customerSelect"
                    :options="customerOptions"
                    :loading="loadingOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn khách hàng--"
                    label="name"
                    track-by="name"
                    @input="changeCustomer">
                  </multiselect>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row" v-if="!repository.is_correction">
              <b-col md="3" class="mt-2">
                <label>
                  <span>Tên khách hàng<span class="error-sybol"></span></span>
                </label>
              </b-col>
              <b-col md="9" class="mt-2">
                <input
                  id="customer_name"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="repository.customer_name">
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
                  id="customer_address"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="repository.customer_address">
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
                <label>Đơn giá bán<span class="error-sybol"></span></label>
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
                  maxlength="100"
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
                <h5>Danh sách sản phẩm xuất</h5>
              </b-col>
            </b-row>
            <b-row class="mt-2" v-show="repository.products.length > 0" >
              <b-col md="12" class="table-cus">
                <table class="table table-bordered table-striped fixed_header">
                  <colgroup>
                      <col style="width:3%">
                      <col style="width:20%">
                      <col style="width:20%">
                      <col style="width:7%">
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
                      <th class="text-center font-weight-bold">Giá bán</th>
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
                        maxlength="11"
                        autocomplete="new-password"
                        class="form-control"
                        :value="item.price"
                        @change="changePrice(index)">
                    </td>
                    <td class="text-right">{{currencyFormat(item.amount)}}</td>
                    <td>
                      <i class="fa fa-trash" @click="deleteProduct(item.index)" />
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
                  Xác nhận xuất kho
                </b-button>
                <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <!--Modal tìm kiếm đơn hàng bán -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-search-order-sell">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Tìm kiếm đơn hàng bán</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="6">
          <label>Mã đơn hàng</label>
          <input
            id="order_sell_number"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="orderSellSearch.order_sell_number"
            maxlength="15">
        </b-col>
        <b-col md="6">
          <label>Tên khách hàng</label>
          <input
            id="customer_name_search"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="orderSellSearch.customer_name"
            maxlength="255">
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalSearchOrderSell">
            Quay lại
          </b-button>

          <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearchOrderSell"
                    @click.prevent="searchOrderSell">
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
            :fields="orderSellSearchFields"
            :items="orderSellSearchItems">
            <template v-slot:cell(actions)="data">
              <b-button variant="outline-success" class="pull-right btn-width-120"
                        @click.prevent="chooseOrderSell(data.item.id, data.item.customer_id)">
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

    <!-- Modal tạo phiếu -->
    <b-modal centered hide-footer hide-header size="sm" id="modal-create-ballot">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Tạo phiếu xuất kho thành công!</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="back">
            Quay lại
          </b-button>

          <b-button variant="outline-success" class="pull-right btn-width-120" @click="goToDeliverySlip" :disabled="saving">
            Tạo phiếu GH
          </b-button>
        </b-col>
      </b-row>

    </b-modal>


  </div>
</template>


<script>
import repositoryApi from '@/api/repository'
import orderSellApi from '@/api/orderSell'
import fundApi from '@/api/fund'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'


export default {
  components: {
    Multiselect
  },
  data () {
    return {
      title: "Thêm Mới Phiếu Xuất Kho",
      repository: {
        is_correction: false,
        order_sell_id: null,
        customer_id: null,
        customer_name: null,
        customer_address: null,
        products: [],
        sub_total: 0,
        code: null
      },
      currentProduct: {
        product_id: null,
        product_code: null,
        product_name: null,
        brand_name: null,
        unit_name: null,
        quantity: 0,
        price: 0
      },
      loadingOptions: false,
      orderSellSelect: {},
      orderSell: {},
      orderSellOptions: [],
      customerSelect: {},
      customerOptions: [],
      productSelect: {},
      productOptions: [],
      saving: false,
      orderSellSearchItems: [],
      orderSellSearchFields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'created_at',
          label: 'Ngày lập'
        },
        {
          key: 'order_sell_number',
          label: 'Số ĐH'
        },
        {
          key: 'customer_name',
          label: 'Tên khách hàng'
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
      onSearchOrderSell: false,
      orderSellSearch: {
        order_sell_number: null,
        customer_name: null
      },
      currentOrderSellId: -1,
    }
  },
  mounted() {
    // Kiểm tra là xuất kho thường hay xuất hiệu chỉnh kho
    let url = location.href
    if(url.includes("repo-correction-output")) {
      this.repository.is_correction = true
      this.title = 'Thêm Mới Hiệu Chỉnh Thiếu Hàng Hoá'
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

    goToDeliverySlip() {
      this.$router.push("/delivery-slip/" + this.currentOrderSellId)
    },

    /**
     * Get options related repository
     */
    getOptionRelatedRepository() {
      this.loadingOptions = true

      let params = {
        order_sells: true,
        customers: true,
        products: true
      }

      repositoryApi.getOptionsRelatedRepository(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          this.customerOptions = options.customers
          this.productOptions = options.products

          this.orderSellOptions = options.order_sells

          if(!this.repository.is_correction) {
            this.checkCreatedFromOrderSell()
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

    checkCreatedFromOrderSell() {
      // Check tạo phiếu xuất kho từ đơn hàng nhập
      let url = location.href
      if(url.includes("repository-from-order-sell")) {
        let orderSellId = this.$route.params.id
          // let code = this.$route.query.code
          let code = this.$router.currentRoute.query.code
          if(code) {
            this.repository.code = code
          }
        this.chooseOrderSell(orderSellId, null, code)
      }
    },

    /**
     *  Event change quotation
     */
    chooseOrderSell(orderSellId, customerId, code=null) {
      if(orderSellId) {
        for(let item of this.orderSellOptions) {
          if(item.id == orderSellId) {
            this.orderSellSelect = item
            this.changeOrderSell(code)
            break
          }
        }
      }
      if(customerId) {
        this.getCustomerById(customerId)
      }
      this.hideModalSearchOrderSell()
    },

    getCustomerById(customerId) {
      for(let customer of this.customerOptions) {
        if(customer.id == customerId) {
          this.customerSelect = customer
          break
        }
      }
      return {}
    },

    showModalSearchOrderSell() {
      this.$bvModal.show('modal-search-order-sell')
    },

    hideModalSearchOrderSell() {
      this.$bvModal.hide('modal-search-order-sell')
    },

    getCustomerItemById() {
      if(this.repository.customer_id && this.customerOptions.length > 0) {
        for(let i in this.customerOptions) {
          if(this.customerOptions[i].id == this.repository.customer_id) {
            this.customerSelect = this.customerOptions[i]
            break
          }
        }
        this.changeCustomer()
      }
    },

    refreshRepositoryInfo() {
      this.repository = {
        is_correction: false,
        order_sell_id: null,
        customer_id: null,
        customer_name: null,
        customer_address: null,
        products: [],
        sub_total: 0
      }
      let code = this.$router.currentRoute.query.code
      if(code) {
        this.repository.code = code
      }
    },

    changeOrderSell(code) {
      // Get detail from DB
      if(this.orderSellSelect && this.orderSellSelect.id) {
          let params = {
              id: this.orderSellSelect.id,
              code: code
          }
        repositoryApi.getOrderSellDetailForRepoOutput(params).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.refreshRepositoryInfo()

            let orderSell = res.data.data

            this.repository.order_sell_id = orderSell.id

            this.repository.customer_id = orderSell.customer_id
            this.getCustomerItemById()

            let products = orderSell.products
            for(let i in products) {
              let product = {
                "product_id": products[i].product_id,
                "product_code": products[i].product_code,
                "product_name": products[i].product_name,
                "unit_name": products[i].unit_name,
                "quantity": this.currencyFormat(products[i].quantity),
                "price": this.currencyFormat(products[i].price_sell),
                "amount": products[i].amount_sell
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
     *  Event change customer
     */
    changeCustomer() {
      if(this.customerSelect && this.customerSelect.id) {
        this.repository.customer_id = this.customerSelect.id
        this.repository.customer_name = this.customerSelect.name
        this.repository.customer_address = this.customerSelect.address
      } else{
        this.repository.customer_id = null
        this.repository.customer_name = null
        this.repository.customer_address = null
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
    },

    calProductSubTotal() {
      this.repository.sub_total = 0
      for (let item of this.repository.products) {
        this.repository.sub_total += parseInt(item.amount)
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

    searchOrderSell() {
      if (this.onSearchOrderSell) { return }

      this.onSearchOrderSell = true

      let params = {
        "order_sell_number": this.orderSellSearch.order_sell_number,
        "customer_name": this.orderSellSearch.customer_name,
        "limit": 100,
        "offset": 0
      }

      fundApi.searchOrderSell(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.orderSellSearchItems = res.data.data
        } else {
          this.orderSellSearchItems = []
        }
        this.onSearchOrderSell = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onSearchOrderSell = false
      })
    },

    save() {

      if(!this.repository.is_correction && !this.repository.customer_name) {
        this.popToast('danger', 'Vui lòng nhập [Tên khách hàng]!')
        return;
      }

      // Validate
      if(this.repository.products.length == 0) {
        this.popToast('danger', 'Vui lòng chọn sản phẩm muốn xuất kho!')
        return;
      } else {
          for(let item of this.repository.products) {
            item.price = (item.price + "").replaceAll(",", "")
            item.quantity = (item.quantity + "").replaceAll(",", "")
            item.amount = Math.round(parseFloat(item.quantity) * parseInt(item.price))

              // TODO: tạm thời bỏ qua vụ check này tại FE, chỉ check BE
              // if(!this.repository.order_sell_id && !this.repository.is_correction) {
              //     // Kiểm tra xem có sản phẩm nào xuất quá số lượng kho không
              //     if (parseFloat(item.quantity) > parseFloat(item.quantity_repo)) {
              //         this.popToast('danger', 'Số lượng sản phẩm xuất kho đang lớn hơn số lượng trong kho tại sản phẩm [' + item.product_name + ']')
              //         return
              //     }
              // }

          }
      }

      // Add
      this.saving = true
      repositoryApi.addRepositoryOutput(this.repository).then(res => {
        this.saving = false
        if(res != null && res.data != null){

          if (res.data.status == 200) {
            // if(this.repository.order_sell_id) {
            //   this.openModalCreateBallot(this.repository.order_sell_id)
            // }
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

    openModalCreateBallot(order_sell_id) {
      this.currentOrderSellId = order_sell_id
      this.$bvModal.show('modal-create-ballot')
    },

    hideModalCreateBallot() {
      this.$bvModal.hide('modal-create-ballot')
    },

    changeQuantity(index) {
      let quantity = document.getElementById("quantity_" + index).value
      if(quantity) {
        quantity = (quantity + "").replaceAll(",", "")

        let price_sell = document.getElementById("price_" + index).value
        if(price_sell) {
          price_sell = (price_sell + "").replaceAll(",", "")
          let amount = Math.round(parseInt(price_sell) * parseFloat(quantity))
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
      let price_sell = document.getElementById("price_" + index).value
      if(price_sell) {
        price_sell = (price_sell + "").replaceAll(",", "")

        let quantity = document.getElementById("quantity_" + index).value
        if(quantity) {
          quantity = (quantity + "").replaceAll(",", "")
          let amount = Math.round(parseInt(price_sell) * parseFloat(quantity))
          amount = this.currencyFormat(amount)
          this.repository.products[index].amount = amount
          // document.getElementById("amount_" + index).value = amount
        } else {
          this.repository.products[index].amount = null
          // document.getElementById("amount_" + index).value = null
        }

        price_sell = this.currencyFormat(price_sell)
        document.getElementById("price_" + index).value = price_sell
        this.repository.products[index].price = price_sell
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
