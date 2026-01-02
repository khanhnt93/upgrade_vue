<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-2 text-center text-header">Phiếu Trả Hàng Nhập</h4>
              </b-col>
            </b-row>
            <hr/>

            <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>Tên nhà cung cấp: {{order_buy_back.supplier_name}}</label>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>Số đơn hàng nhập: {{order_buy_back.order_buy_number}}</label>
              </b-col>
            </b-row>

            <b-row class="form-row mt-2" v-show="order_buy_back.products.length > 0" >
              <b-col md="12" class="mt-2">
                <label>Danh sách sản phẩm cần xuất kho lại</label>
              </b-col>
            </b-row>

            <b-row class="mt-2" v-show="order_buy_back.products.length > 0" >
              <b-col md="12" class="table-cus">
                <div style="width: 100%; overflow-x: scroll">
                  <table class="table table-bordered table-striped fixed_header">
                    <colgroup>
                      <col style="width:5%">
                      <col style="width:12%">
                      <col style="width:18%">
                      <col style="width:13%">
                      <col style="width:13%">
                      <col style="width:13%">
                      <col style="width:13%">
                      <col style="width:13%">
                    </colgroup>
                    <tr>
                        <th class="text-center font-weight-bold">STT</th>
                        <th class="text-center font-weight-bold">Mã SP</th>
                        <th class="text-center font-weight-bold">Tên SP</th>
                        <th class="text-center font-weight-bold">Đơn vị</th>
                        <th class="text-center font-weight-bold">Số lượng trả lại</th>
                        <th class="text-center font-weight-bold">Đơn giá nhập</th>
                        <th class="text-center font-weight-bold">Thành tiền</th>
                        <th class=""></th>
                      </tr>
                    <tbody>
                    <tr v-for="(item, index) in order_buy_back.products">
                      <td>{{index + 1}}</td>
                      <td>{{item.product_code}}</td>
                      <td>{{item.product_name}}</td>
                      <td>{{item.unit_name}}</td>
                      <td>
                        <input
                          :id="'quantity_' + index"
                          type="text"
                          maxlength="11"
                          autocomplete="new-password"
                          class="form-control"
                          :value="item.quantity"
                          @keyup="integerPointAndCommaOnly($event.target)"
                          @change="changeQuantity(index)">
                      </td>
                      <td class="text-right">
                        {{currencyFormat(item.price_buy)}}
                      </td>
                      <td class="text-right">
                        {{currencyFormat(item.amount_buy)}}
                      </td>
                      <td>
                        <i class="fa fa-trash ml-2" @click="deleteProduct(index)" />
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>

              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>Tổng tiền hàng: {{currencyFormat(order_buy_back.sub_total)}}</label>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>VAT: {{currencyFormat(order_buy_back.vat_value)}}</label>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>Tổng : {{currencyFormat(order_buy_back.total)}}</label>
              </b-col>
            </b-row>

            <b-row class="mt-2" v-if="product_back_flag == false">
              <b-col md="12" class="text-center">
                <b-button variant="outline-success" style="height: 50px; width: 240px"
                          @click="save" :disabled="saving" v-show="!saving">
                  <i class="fa fa-pencil-square-o" style="margin-right: 5px" />
                  Xác Nhận
                </b-button>
                <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

  </div>
</template>
<script>


import orderBuyApi from '@/api/orderBuy'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      order_buy_back: {
        order_buy_id: null,
        order_buy_number: null,
        supplier_id: null,
        supplier_name: null,
        products: [],
        sub_total: 0,
        have_vat: true,
        vat_percent: 10,
        vat_value: 0,
        total: 0
      },
      loading: false,
      saving: false,
      product_back_flag: false,
    }
  },
  mounted() {
    // Get OrderBuy detail
    this.getOrderBuyDetail()
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

    /**
     *  Get detail
     */
    getOrderBuyDetail() {
      let orderBuyId = this.$route.params.id
      if(orderBuyId){
        this.loading = true

        orderBuyApi.getOrderBuyDetail(orderBuyId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            let order_sell = res.data.data
            this.order_buy_back.order_buy_id = order_sell.id
            this.order_buy_back.order_buy_number = order_sell.order_buy_number
            this.order_buy_back.supplier_id = order_sell.supplier_id
            this.order_buy_back.supplier_name = order_sell.supplier_name
            this.order_buy_back.sub_total = order_sell.sub_total
            this.order_buy_back.have_vat = order_sell.have_vat
            this.order_buy_back.vat_percent = order_sell.vat_percent
            this.order_buy_back.vat_value = order_sell.vat_value
            this.order_buy_back.total = order_sell.total
            this.order_buy_back.products = order_sell.products

            this.calculateTotal()
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

    changeQuantity(index) {
      let quantity = document.getElementById("quantity_" + index).value
      if(quantity) {
        quantity = (quantity + "").replaceAll(",", "")
        this.order_buy_back.products[index].quantity = parseFloat(quantity)
        this.calculateTotal()
      }
    },

    deleteProduct(index) {
      this.order_buy_back.products.slice(index, 1)
      this.calculateTotal()
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

    calculateTotal() {
      this.order_buy_back.sub_total = 0

      for(let product of this.order_buy_back.products) {
        product.amount_buy = Math.round(parseFloat(product.quantity) * product.price_buy)
        this.order_buy_back.sub_total += product.amount_buy
      }
      if(this.order_buy_back.have_vat && this.order_buy_back.vat_percent) {
        this.order_buy_back.vat_value = this.order_buy_back.sub_total * this.order_buy_back.vat_percent / 100
      } else {
        this.order_buy_back.vat_value = 0
      }
      this.order_buy_back.total = this.order_buy_back.sub_total + this.order_buy_back.vat_value
    },

    save() {
      if(this.order_buy_back.products.length == 0) {
        this.popToast('danger', "Không có sản phẩm nào để trả hàng")
        return
      }
      this.saving = true

      orderBuyApi.confirmOrderBuyBack(this.order_buy_back).then(res => {
        if(res != null && res.data != null) {
          if (res.data.status == 200) {
              this.popToast('success', "Trả hàng thành công!")
              this.product_back_flag = true
              // window.open('/income-from-product-back/' + this.order_buy_back.order_buy_id, '_blank')
          }
        }

        this.saving = false

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
