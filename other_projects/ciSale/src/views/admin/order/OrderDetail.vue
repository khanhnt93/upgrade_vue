<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="p-4">

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <button class="btn btn-outline-secondary float-left btn-width-120" @click="back">
                  Quay lại
                </button>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full px-2">
                <h4 class="mt-1 text-center text-header">Chi Tiết Đặt Hàng</h4>
              </div>
            </div>
            <hr/>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2 bg-gray text-white title-partner">
                <h5>
                  <span class="float-left">Thông tin khách hàng</span>
                </h5>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <div class="flex flex-wrap -mx-2 form-row">
                  <div class="w-full px-2 mt-2">
                    <label>
                      <span>Tên khách hàng: {{trade.customer_name}}</span>
                    </label>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row">
                  <div class="w-full px-2 mt-2">
                    <label>
                      <span>SĐT khách hàng: {{trade.customer_phone}}</span>
                    </label>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row">
                  <div class="w-full px-2 mt-2">
                    <label>
                      <span>Địa chỉ khách hàng: {{trade.customer_address}}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 mt-3">
              <div class="w-full px-2 bg-info bg-gradient text-white title-partner">
                <h5>
                  <span class="float-left">Danh sách sản phẩm</span>
                </h5>

              </div>
            </div>
            <div class="flex flex-wrap -mx-2 mt-2" v-show="trade.products.length > 0">
                  <div class="w-full px-2">
                  <table class="table table-bordered table-striped fixed_header">
                    <thead>
                    <tr>
                      <th class="text-center font-weight-bold">STT</th>
                      <th class="text-center font-weight-bold">Sản phẩm</th>
                      <th class="text-center font-weight-bold">Thuộc tính</th>
                      <th class="text-center font-weight-bold">Đơn giá</th>
                      <th class="text-center font-weight-bold">Số lượng</th>
                      <th class="text-center font-weight-bold">Thành tiền</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in trade.products" :key="item.index">
                      <td>{{item.index}}</td>
                      <td>{{item.product_name}}</td>
                      <td>
                        <p v-for="(pro) in item.properties" :key="pro.name">
                          + {{pro.name}}: {{pro.value}}
                        </p>
                      </td>
                      <td class="text-right">{{currencyFormat(item.price_buy)}}</td>
                      <td class="text-right">{{currencyFormat(item.quantity)}}</td>
                      <td class="text-right">{{currencyFormat(item.amount_buy)}}</td>
                    </tr>
                    </tbody>
                  </table>
                  </div>
                </div>

            <div class="flex flex-wrap -mx-2 mt-3">
              <div class="w-full px-2 bg-success bg-gradient text-white title-partner">
                <h5>
                  <span class="float-left">Thông tin thanh toán</span>
                </h5>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 mt-2">
              <div class="w-full px-2">
                <div class="flex flex-wrap -mx-2 form-row">
                  <div class="w-full px-2 mt-2">
                    <label> Tổng tiền sản phẩm: {{currencyFormat(trade.sub_total)}}</label>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row">
                  <div class="w-full px-2 mt-2">
                    <label> Chi phí thêm: {{currencyFormat(trade.extra_fee)}}</label>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row">
                  <div class="w-full px-2 mt-2">
                    <label> Số tiền giảm: {{currencyFormat(trade.fixed_discount)}}  </label>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row">
                  <div class="w-full px-2 mt-2">
                    <label> Khuyến mãi: {{currencyFormat(trade.discount_amount)}}</label>
                    <div v-show="trade.promotions.length > 0">
                      <p class="ml-3">Danh sách khuyến mãi đang áp dụng</p>
                      <p class="ml-3" v-for="pmt in trade.promotions" :key="pmt.id">
                        {{" - " + pmt.quantity_apply + " x " + pmt.name}}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row">
                  <div class="w-full px-2 mt-2">
                    <label> Thuế VAT<span v-show="trade.vat_value > 0">({{trade.vat_percent}}%)</span>: {{currencyFormat(trade.vat_value)}} </label>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row">
                  <div class="w-full px-2 mt-2">
                    <label> Thành tiền: {{currencyFormat(trade.total)}}</label>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row">
                  <div class="w-full px-2 mt-2">
                    <label> Số tiền đã thanh toán: {{currencyFormat(trade.total_paid)}}</label>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row">
                  <div class="w-full px-2 mt-2">
                    <label> Ngày hẹn lấy hàng: {{trade.appointment_date}}</label>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row">
                  <div class="w-full px-2 mt-2">
                    <label> Loại tiền thanh toán </label>
                    <p class="ml-3">- Tiền mặt: {{currencyFormat(trade.cash)}}</p>
                    <p class="ml-3">- Chuyển khoản: {{currencyFormat(trade.credit)}}</p>
                    <p class="ml-3">- Tiền điện tử: {{currencyFormat(trade.e_money)}}</p>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row">
                  <div class="w-full px-2 mt-2">
                    <label> Ghi chú: {{trade.description}}</label>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>


  </div>
</template>


<script>
import orderApi from '@/api/order'
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
      trade: {
        "id": null,
        "order_number": null,
        "customer_id": null,
        "customer_name": null,
        "customer_phone": null,
        "customer_address": null,
        "customer_tax_code": null,
        "sub_total": 0,
        "extra_fee": null,
        "fixed_discount": null,
        "discount_amount": null,
        "total": 0,
        "total_paid": null,
        "appointment_date": null,
        "cash": null,
        "credit": null,
        "e_money": null,
        "description": null,
        "products": [],
        "promotions": [],
      },
      loading: false,
    }
  },
  mounted() {
    // Get trade detail
    this.getTradeDetail()
  },
  methods: {

    /**
     * Make toast without title
     */
    popToast(variant, content) {
      this.toast(content, variant)
    },

      /**
     *  Get detail
     */
    getTradeDetail() {
      let orderId = this.route.params.id
      if(orderId){
        this.loading = true

        orderApi.getDetailOrder(orderId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.trade = res.data.data
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
      this.router.push("/order-list")
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
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
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

  table {
   margin: auto;
    border-collapse: collapse;
    overflow-x: auto;
    display: block;
    width: fit-content;
    max-width: 100%;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, .1);
  }

  td, th {
    border: solid rgb(200, 200, 200) 1px;
    padding: .5rem;
  }

  th {
    text-align: left;
    background-color: rgb(190, 220, 250);
    text-transform: uppercase;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: rgb(50, 50, 100) solid 2px;
    border-top: none;
  }

  td {
    white-space: nowrap;
    border-bottom: none;
    color: rgb(20, 20, 20);
  }

  td:first-of-type, th:first-of-type {
    border-left: none;
  }

  td:last-of-type, th:last-of-type {
    border-right: none;
  }
</style>
