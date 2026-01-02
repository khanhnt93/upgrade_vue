<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body>

            <b-row>
              <b-col cols="6">
                <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="back">
                  Quay lại
                </b-button>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-1 text-center text-header">Chi tiết ĐH Nhập</h4>
              </b-col>
            </b-row>
            <hr/>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>
                  <span>Số ĐH nhập: {{orderBuy.order_buy_number}}</span>
                </label>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>
                  <span>Ngày tạo: {{orderBuy.created_at}}</span>
                </label>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="12" class="bg-gray text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin nhà cung cấp</span>
                  <span class="pull-right" v-show="showPartnerInfo" @click="showPartnerInfo = !showPartnerInfo"><i class="fa fa-angle-double-up" /></span>
                  <span class="pull-right" v-show="!showPartnerInfo" @click="showPartnerInfo = !showPartnerInfo"><i class="fa fa-angle-double-down" /></span>
                </h5>
              </b-col>
            </b-row>

            <b-row v-show="showPartnerInfo">
              <b-col>

                <b-row>
                  <b-col md="12" class="mt-2">
                    <label>
                      Tên nhà cung cấp: {{orderBuy.supplier_name}}
                    </label>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="12" class="mt-2">
                    <label>Địa chỉ: {{orderBuy.supplier_address}}</label>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

            <b-row class="mt-3">
              <b-col md="12" class="bg-info bg-gradient text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin sản phẩm</span>
                  <span class="pull-right" v-show="showProductInfo" @click="showProductInfo = !showProductInfo"><i class="fa fa-angle-double-up" /></span>
                  <span class="pull-right" v-show="!showProductInfo" @click="showProductInfo = !showProductInfo"><i class="fa fa-angle-double-down" /></span>
                </h5>
              </b-col>
            </b-row>

            <b-row v-show="showProductInfo" class="mt-2">
              <b-col md="12">

                <b-row class="mt-2" v-show="orderBuy.products.length > 0" >
                  <b-col md="12" class="table-cus">
                    <table class="table table-bordered table-striped fixed_header">
                      <colgroup>
                        <col style="width:4%">
                        <col style="width:20%">
                        <col style="width:20%">
                        <col style="width:9%">
                        <col style="width:9%">
                        <col style="width:10%">
                        <col style="width:15%">
                        <col style="width:15%">
                        <col style="width:8%">
                      </colgroup>
                      <tr>
                          <th class="text-center font-weight-bold">STT</th>
                          <th class="text-center font-weight-bold">Mã sản phẩm(*)</th>
                          <th class="text-center font-weight-bold">Tên hàng sản phẩm(*)</th>
                          <th class="text-center font-weight-bold">Hãng</th>
                          <th class="text-center font-weight-bold">Đơn vị(*)</th>
                          <th class="text-center font-weight-bold">số lượng(*)</th>
                          <th class="text-center font-weight-bold">Giá nhập</th>
                          <th class="text-center font-weight-bold">Thành tiền</th>
                          <th class="text-center font-weight-bold">Ghi Chú</th>
                        </tr>
                      <tbody>
                      <tr v-for="(item, index) in orderBuy.products">
                        <td>{{index + 1}}</td>
                        <td>{{item.product_code}}</td>
                        <td>{{item.product_name}}</td>
                        <td>{{item.product_brand}}</td>
                        <td>{{item.unit}}</td>
                        <td class="text-right">{{currencyFormat(item.quantity)}}</td>
                        <td class="text-right">{{currencyFormat(item.price_buy)}}</td>
                        <td class="text-right">{{currencyFormat(item.amount)}}</td>
                        <td>{{item.note}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

            <b-row class="mt-3">
              <b-col md="12" class="bg-success bg-gradient text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin thanh toán và giao hàng</span>
                  <span class="pull-right" v-show="showPaymentInfo" @click="showPaymentInfo = !showPaymentInfo"><i class="fa fa-angle-double-up" /></span>
                  <span class="pull-right" v-show="!showPaymentInfo" @click="showPaymentInfo = !showPaymentInfo"><i class="fa fa-angle-double-down" /></span>
                </h5>
              </b-col>
            </b-row>

            <b-row class="mt-2" v-show="showPaymentInfo">
              <b-col>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="12" class="mt-2">
                        <label>Tổng thành tiền: {{orderBuy.sub_total}}</label>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="12" class="mt-2">
                        <label>Vat({{orderBuy.vat_percent}}): {{orderBuy.vat_value}}</label>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="12" class="mt-2">
                        <label>Tổng tiền thanh toán: {{orderBuy.total}}</label>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="12" class="mt-2">
                        <label>Phương thức thanh toán: {{orderBuy.payment_method}}</label>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="12" class="mt-2">
                        <label>Hình thức giao hàng: {{orderBuy.shipping_method}}</label>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="12" class="mt-2">
                        <label>Ngày dự kiến GH: {{orderBuy.shipping_date}}</label>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>Ghi chú: {{orderBuy.note}}</label>
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
      showPartnerInfo: true,
      showProductInfo: true,
      showPaymentInfo: true,
      orderBuy: {
        supplier_id: null,
        supplier_name: null,
        supplier_address: null,
        products: [],
        sub_total: 0,
        have_vat: false,
        vat_percent: 10,
        vat_value: 0,
        total: 0,
        payment_method: null,
        shipping_method: null,
        shipping_date: null,
        note: null
      },
      loading: false
    }
  },
  mounted() {
    // Get trade detail
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
     * Back to list
     */
    back() {
      this.$router.push("/order-buy")
    },

    /**
     * Currency format
     */
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

      /**
     *  Get detail
     */
    getOrderBuyDetail() {
      let orderBuyId = this.$route.params.id
      if(orderBuyId){
        this.loading = true
        orderBuyApi.getOrderBuyDetail(orderBuyId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.orderBuy = res.data.data

              // Format
              this.orderBuy.sub_total = this.currencyFormat((this.orderBuy.sub_total + '').replaceAll(",", ""))
              this.orderBuy.total = this.currencyFormat((this.orderBuy.total + '').replaceAll(",", ""))
              this.orderBuy.vat_value = this.currencyFormat((this.orderBuy.vat_value + '').replaceAll(",", ""))

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


  }
}
</script>

<style lang="scss" scoped>

  .title-partner {
    border-radius: 5px 5px;
    padding: 5px;

  }
</style>
