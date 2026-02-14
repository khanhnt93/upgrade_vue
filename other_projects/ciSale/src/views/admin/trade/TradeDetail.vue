<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="p-4">

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <button class="btn btn-outline-secondary pull-left btn-width-120" @click="back">
                  Quay lại
                </button>
                <button class="btn btn-outline-primary pull-right btn-width-120" @click="printInvoice">
                  In hóa đơn
                </button>
              </div>
            </div>

            <div class="form-row">
              <div md='12'>
                <h4 class="mt-1 text-center text-header">Chi Tiết Đơn Hàng</h4>
              </div>
            </div>
            <hr/>

            <!-- Loading -->
            <!-- Loading -->
            <div class="text-center" v-show="loading">
              <i class="fas fa-spinner fa-spin fa-3x text-primary"></i>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2 bg-gray text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin
                    <span v-show="trade.from_type == 1">nhà cung cấp</span>
                    <span v-show="trade.from_type == 0">khách hàng</span>
                  </span>
                </h5>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <div class="form-row">
                  <div class="w-full px-2 mt-2">
                    <label>
                      <span v-show="trade.from_type == 1">Tên nhà cung cấp: {{trade.supplier_name}}</span>
                      <span v-show="trade.from_type == 0">Tên khách hàng: {{trade.customer_name}}</span>
                    </label>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full px-2 mt-2">
                    <label>
                      <span v-show="trade.from_type == 1">ĐT nhà cung cấp: {{trade.supplier_phone}}</span>
                      <span v-show="trade.from_type == 0">ĐT khách hàng: {{trade.customer_phone}}</span>
                    </label>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full px-2 mt-2" >
                    <label>
                      <span v-show="trade.from_type == 1">Địa chỉ nhà cung cấp: {{trade.supplier_address}}</span>
                      <span v-show="trade.from_type == 0">Địa chỉ khách hàng: {{trade.customer_address}}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>


            <div class="mt-3">
              <div class="w-full px-2 bg-info bg-gradient text-white title-partner" >
                <h5>
                  <span class="pull-left">Danh sách sản phẩm</span>
                </h5>

              </div>
            </div>
            <div class="mt-2" v-show="trade.products.length > 0">
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

            <div class="mt-3">
              <div class="w-full px-2 bg-success bg-gradient text-white title-partner" >
                <h5>
                  <span class="pull-left">Thông tin thanh toán</span>
                </h5>
              </div>
            </div>

            <div class="mt-2">
              <div class="w-full px-2">
                <div class="form-row">
                  <div class="w-full px-2 mt-2" >
                    <label> Tổng tiền sản phẩm: {{currencyFormat(trade.sub_total)}}</label>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full px-2 mt-2" >
                    <label> Chi phí thêm: {{currencyFormat(trade.extra_fee)}}</label>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full px-2 mt-2" >
                    <label> Số tiền giảm: {{currencyFormat(trade.fixed_discount)}}  </label>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full px-2 mt-2" >
                    <label> Khuyến mãi: {{currencyFormat(trade.discount_amount)}}</label>
                    <div v-show="trade.promotions.length > 0">
                      <p class="ml-3">Danh sách khuyến mãi đang áp dụng</p>
                      <p class="ml-3" v-for="pmt in trade.promotions" :key="pmt.id">
                        {{" - " + pmt.quantity_apply + " x " + pmt.name}}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full px-2 mt-2" >
                    <label> Thuế VAT<span v-show="trade.vat_value > 0">({{trade.vat_percent}}%)</span>: {{currencyFormat(trade.vat_value)}} </label>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full px-2 mt-2" >
                    <label> Thành tiền: {{currencyFormat(trade.total)}}</label>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full px-2 mt-2" >
                    <label> Số tiền thanh toán: {{currencyFormat(trade.total_paid)}}</label>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full px-2 mt-2" >
                    <label> Loại tiền thanh toán </label>
                    <p class="ml-3">- Tiền mặt: {{currencyFormat(trade.cash)}}</p>
                    <p class="ml-3">- Chuyển khoản: {{currencyFormat(trade.credit)}}</p>
                    <p class="ml-3">- Tiền điện tử: {{currencyFormat(trade.e_money)}}</p>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full px-2 mt-2" >
                    <label> Ghi chú: {{trade.description}}</label>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!--    Print-->
    <div hidden id="invoiceBuy">
      <div class="w-full px-2">

        <div>
          <div class="print-text-left print-width-50-left">
            <h4>TÊN CỤC THUẾ................</h4>
          </div>
          <div class="print-text-right print-width-50-right">
            <h4>Mẫu số: 02GTTT3/001</h4>
          </div>
        </div>

        <h2 class="print-text-center">HOÁ ĐƠN MUA HÀNG</h2>
        <p class="print-text-center">Ngày {{today_day}} tháng {{today_month}} năm {{today_year}}</p>
        <p class="print-text-center">Số hoá đơn: {{trade.bill_number}}</p>
        <br>
        <div class="print-border print-pl-2">
          <table style="width:100%">

            <tbody>
            <tr><td class="print-no-border">Đơn vị bán hàng: <b>
              <span v-show="trade.from_type == 1">{{trade.supplier_name}}</span>
              <span v-show="trade.from_type == 0">{{trade.customer_name}}</span>
            </b></td></tr>
            <tr><td class="print-no-border">Mã số thuế:
              <span v-show="trade.from_type == 1">{{trade.supplier_tax_code}}</span>
              <span v-show="trade.from_type == 0">{{trade.customer_tax_code}}</span>
            </td></tr>
            <tr><td class="print-no-border">Địa chỉ:
              <span v-show="trade.from_type == 1">{{trade.supplier_address}}</span>
              <span v-show="trade.from_type == 0">{{trade.customer_address}}</span>
            </td></tr>
            <tr><td class="print-no-border">Điện thoại:
              <span v-show="trade.from_type == 1">{{trade.supplier_phone}}</span>
              <span v-show="trade.from_type == 0">{{trade.customer_phone}}</span>
            </td></tr>

            </tbody>
          </table>

          <table style="width:100%">

            <tbody>
            <tr><td class="print-no-border">Họ tên người mua hàng: <b>{{store_name}}</b></td></tr>
            <tr><td class="print-no-border">Mã số thuế: {{store_tax_code}}</td></tr>
            <tr><td class="print-no-border">Địa chỉ: {{store_address}}</td></tr>
            <tr><td class="print-no-border">Điện thoại: {{store_phone_number}}</td></tr>

            </tbody>
          </table>
          <hr>
        </div>

        <br>
        <div id="print-table-border">
          <table style="width:100%">

            <tbody>
            <tr class="print-text-center">
              <th>STT</th>
              <th>Tên hàng hóa, dịch vụ</th>
              <th>Đơn vị tính</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
            <tr v-for="(item, index) in trade.products" :key="item.product_id">
              <td class="print-text-center">{{index + 1}}</td>
              <td>{{item.product_name}}</td>
              <td>{{item.id}}</td>
              <td class="print-text-right">{{currencyFormat(item.price_buy)}}</td>
              <td class="print-text-right">{{currencyFormat(item.quantity)}}</td>
              <td class="print-text-right">{{currencyFormat(item.amount_buy)}}</td>
            </tr>
            <tr>
              <td colspan="5">Tổng tiền sản phẩm</td>
              <td class="print-text-right">{{currencyFormat(trade.sub_total)}}</td>
            </tr>
            <tr v-show="trade.extra_fee && parseInt(trade.extra_fee) > 0">
              <td colspan="5">Chi phí khác</td>
              <td class="print-text-right">+{{currencyFormat(trade.extra_fee)}}</td>
            </tr>
            <tr v-show="trade.fixed_discount && parseInt(trade.fixed_discount) > 0">
              <td colspan="5">Giảm giá</td>
              <td class="print-text-right">-{{currencyFormat(trade.fixed_discount)}}</td>
            </tr>
            <tr v-show="trade.discount_amount && parseInt(trade.discount_amount) > 0">
              <td colspan="5">Khuyến mãi</td>
              <td class="print-text-right">-{{currencyFormat(trade.discount_amount)}}</td>
            </tr>

            <tr v-show="trade.vat_value && parseInt(trade.vat_value) > 0">
              <td colspan="5">VAT ({{trade.vat_percent}}%)</td>
              <td class="print-text-right">+{{currencyFormat(trade.vat_value)}}</td>
            </tr>
            <tr>
              <td colspan="5">Thành tiền</td>
              <td class="print-text-right"><b>{{currencyFormat(trade.total)}}</b></td>
            </tr>
            <tr>
              <td colspan="6">Số tiền viết bằng chữ: {{convertNumberToText(trade.total)}}</td>
            </tr>

            </tbody>

          </table>
          <br>
          <div>
            <table style="width:100%">

              <tbody>
              <tr>
                <td colspan="3" class="print-text-center print-no-border">Người mua hàng</td>
                <td colspan="3" class="print-text-center print-no-border">Người bán hàng</td>
              </tr>
              <tr>
                <td colspan="3" class="print-text-center print-no-border">(Ký, ghi rõ họ tên)</td>
                <td colspan="3" class="print-text-center print-no-border">(Ký, đóng dấu, ghi rõ họ tên)</td>
              </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <div hidden id="invoiceSell">
      <div class="w-full px-2">

        <div>
          <div class="print-text-left print-width-50-left">
            <h4>TÊN CỤC THUẾ................</h4>
          </div>
          <div class="print-text-right print-width-50-right">
            <h4>Mẫu số: 02GTTT3/001</h4>
          </div>
        </div>

        <h2 class="print-text-center">HOÁ ĐƠN BÁN HÀNG</h2>
<!--        <p class="print-text-center">Ngày {{today_day}} tháng {{today_month}} năm {{today_year}}</p>-->
        <p class="print-text-center">Ngày: {{trade.updated_at}}</p>
        <p class="print-text-center">Số hoá đơn: {{trade.bill_number}}</p>
        <br>
        <div class="print-border print-pl-2">
          <table style="width:100%">

            <tbody>
            <tr><td class="print-no-border">Đơn vị bán hàng: <b>{{store_name}}</b></td></tr>
            <tr><td class="print-no-border">Mã số thuế: {{store_tax_code}}</td></tr>
            <tr><td class="print-no-border">Địa chỉ: {{store_address}}</td></tr>
            <tr><td class="print-no-border">Điện thoại: {{store_phone_number}}</td></tr>

            </tbody>
          </table>
          <hr>
          <table style="width:100%">

            <tbody>
            <tr><td class="print-no-border">Họ tên người mua hàng: <b>
              <span>{{trade.customer_name}}</span>
            </b></td></tr>
            <tr><td class="print-no-border">Mã số thuế: </td></tr>
            <tr><td class="print-no-border">Địa chỉ:
              <span>{{trade.customer_address}}</span>
            </td></tr>
            <tr><td class="print-no-border">Điện thoại:
              <span>{{trade.customer_phone}}</span>
            </td></tr>

            </tbody>
          </table>
        </div>
        <br>
        <div id="print-table-border">
          <table style="width:100%">

            <tbody>
            <tr class="print-text-center">
              <th>STT</th>
              <th>Tên hàng hóa, dịch vụ</th>
              <th>Đơn vị tính</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
            <tr v-for="(item, index) in trade.products" :key="item.product_id">
              <td class="print-text-center">{{index + 1}}</td>
              <td>{{item.product_name}}</td>
              <td>{{item.id}}</td>
              <td class="print-text-right">{{currencyFormat(item.price_sell)}}</td>
              <td class="print-text-right">{{currencyFormat(item.quantity)}}</td>
              <td class="print-text-right">{{currencyFormat(item.amount_sell)}}</td>
            </tr>
            <tr>
              <td colspan="5">Tổng tiền sản phẩm</td>
              <td class="print-text-right">{{currencyFormat(trade.sub_total)}}</td>
            </tr>
            <tr v-show="trade.extra_fee && parseInt(trade.extra_fee) > 0">
              <td colspan="5">Chi phí khác</td>
              <td class="print-text-right">+{{currencyFormat(trade.extra_fee)}}</td>
            </tr>
            <tr v-show="trade.fixed_discount && parseInt(trade.fixed_discount) > 0">
              <td colspan="5">Giảm giá</td>
              <td class="print-text-right">-{{currencyFormat(trade.fixed_discount)}}</td>
            </tr>
            <tr v-show="trade.discount_amount && parseInt(trade.discount_amount) > 0">
              <td colspan="5">Khuyến mãi</td>
              <td class="print-text-right">-{{currencyFormat(trade.discount_amount)}}</td>
            </tr>
            <tr v-show="trade.vat_value && parseInt(trade.vat_value) > 0">
              <td colspan="5">VAT ({{trade.vat_percent}}%)</td>
              <td class="print-text-right">+{{currencyFormat(trade.vat_value)}}</td>
            </tr>
            <tr>
              <td colspan="5">Thành tiền</td>
              <td class="print-text-right"><b>{{currencyFormat(trade.total)}}</b></td>
            </tr>
            <tr>
              <td colspan="6">Số tiền viết bằng chữ: {{convertNumberToText(trade.total)}}</td>
            </tr>

            </tbody>

          </table>
          <br>
          <div>
            <table style="width:100%">

              <tbody>
              <tr>
                <td colspan="3" class="print-text-center print-no-border">Người mua hàng</td>
                <td colspan="3" class="print-text-center print-no-border">Người bán hàng</td>
              </tr>
              <tr>
                <td colspan="3" class="print-text-center print-no-border">(Ký, ghi rõ họ tên)</td>
                <td colspan="3" class="print-text-center print-no-border">(Ký, đóng dấu, ghi rõ họ tên)</td>
              </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <!--Mẫu in hoá đơn 2-->
    <div hidden id="compactInvoice">
      <div class="w-full px-2">
        <div>
          <h2 class="print-text-center">{{store_name}}</h2>
          <p class="print-text-center">{{store_address}}</p>
          <p class="print-text-center">{{store_phone_number}}</p>
        </div>

        <h4 class="print-text-center">HOÁ ĐƠN BÁN HÀNG{{suffix_print_title}}</h4>
        <p class="print-text-center">Số HĐ: {{trade.bill_number}}</p>
        <br>
        <p>Ngày: {{trade.updated_at}}</p>
        <p>Khách hàng: {{trade.customer_name}}</p>

        <div>
          <div>
            <div style="margin-top:10px;display:flex;width:100%;border-top:1px solid #555555;border-bottom:1px solid #555555">
              <div style="width:33%;text-align:center;font-size:13;">
                  Số lượng
                </div>
                <div style="width:33%;text-align:center;font-size:13;">
                  Đơn giá
                </div>
                <div style="width:33%;text-align:center;font-size:13;">
                  Thành tiền
                </div>
            </div>
            <div style="border-top:1px dotted #555555;width:100%;display:flex;flex-direction:row;flex-wrap:wrap"
              v-for="(item, index) in trade.products" :key="item.product_id">
               <div style="font-size:13;">
                {{index + 1}}. {{item.product_name}}
               </div>
                <div style="display:flex;width:100%">
                 <div style="width:33.3%;text-align:center;font-size:13;" >
                    {{currencyFormat(item.quantity)}}
                </div>
                 <div style="width:33.3%;text-align:end;font-size:13;" >
                    {{currencyFormat(item.price_sell)}}
                 </div>
                 <div style="width:33.3%;text-align:end;font-size:13;" >
                    {{currencyFormat(item.amount_sell)}}
                 </div>
               </div>
            </div>
            <div style="display:flex;width:100%;border-top:1px solid #555555">
                <div style="width:66%;font-size:13;">
                  Tổng tiền sản phẩm
                </div>
                <div style="width:33%;text-align:right;font-size:13;">
                  {{currencyFormat(trade.sub_total)}}
                </div>
            </div>
            <div style="display:flex;width:100%;border-top:1px solid #555555"
              v-show="trade.extra_fee && parseInt(trade.extra_fee) > 0">
                <div style="width:66%;font-size:13;">
                  Chi phí khác
                </div>
                <div style="width:33%;text-align:right;font-size:13;">
                  +{{currencyFormat(trade.extra_fee)}}
                </div>
            </div>
            <div style="display:flex;width:100%;border-top:1px solid #555555"
                 v-show="trade.fixed_discount && parseInt(trade.fixed_discount) > 0">
                <div style="width:66%;font-size:13;">
                  Giảm giá
                </div>
                <div style="width:33%;text-align:right;font-size:13;">
                  -{{currencyFormat(trade.fixed_discount)}}
                </div>
            </div>
            <div style="display:flex;width:100%;border-top:1px solid #555555"
              v-show="trade.discount_amount && parseInt(trade.discount_amount) > 0">
                <div style="width:66%;font-size:13;">
                  Khuyến mãi
                </div>
                <div style="width:33%;text-align:right;font-size:13;">
                  -{{currencyFormat(trade.discount_amount)}}
                </div>
            </div>
            <div style="display:flex;width:100%;border-top:1px solid #555555"
              v-show="trade.vat_value && parseInt(trade.vat_value) > 0">
                <div style="width:66%;font-size:13;">
                  VAT ({{trade.vat_percent}}%)
                </div>
                <div style="width:33%;text-align:right;font-size:13;">
                  +{{currencyFormat(trade.vat_value)}}
                </div>
            </div>
            <div style="display:flex;width:100%;border-top:1px solid #555555">
                <div style="width:66%;font-size:13;">
                  Thành tiền
                </div>
                <div style="width:33%;text-align:right;font-size:13;">
                  <b>{{currencyFormat(trade.total)}}</b>
                </div>
            </div>
            <br>
            <div>
              <p class="text-center">Cảm ơn quý khách và hẹn gặp lại!</p>
            </div>
          </div>
        </div>

      </div>
    </div>


  </div>
</template>


<script>
import tradeApi from '@/api/trade'
import superAdminAPI from '@/api/superAdmin'
import commonFunc from '@/common/commonFunc'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useRoute, useRouter } from 'vue-router'

export default {
  setup() {
    const authStore = useAuthStore()
    const { toast } = useToast()
    const route = useRoute()
    const router = useRouter()

    return {
      authStore,
      toast,
      route,
      router
    }
  },
  data () {
    return {
      trade: {
        "id": null,
        "trade_type": 0,
        "bill_number": null,
        "from_type": 1,
        "customer_id": null,
        "customer_name": null,
        "customer_phone": null,
        "customer_address": null,
        "customer_tax_code": null,
        "supplier_id": null,
        "supplier_name": null,
        "supplier_phone": null,
        "supplier_address": null,
        "supplier_tax_code": null,
        "sub_total": 0,
        "extra_fee": null,
        "fixed_discount": null,
        "discount_amount": null,
        "total": 0,
        "total_paid": null,
        "cash": null,
        "credit": null,
        "e_money": null,
        "description": null,
        "products": [],
        "promotions": [],
      },
      loading: false,
      store_name: "",
      store_tax_code: "",
      store_address: "",
      store_phone_number: "",
      today_day: "",
      today_month: "",
      today_year: "",
      suffix_print_title: ""
    }
  },
  mounted() {
    // Get today day, month, year
    let dateNow = new Date()
    this.today_day = dateNow.getDate()
    this.today_month = dateNow.getMonth() + 1
    this.today_year = dateNow.getFullYear()

    // Get trade detail
    this.getTradeDetail()

    // Get store info
    this.getStoreDetail()
  },
  methods: {

    /**
     * Make toast without title
     */
    popToast(variant, content) {
      this.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant === 'danger' ? 'error' : variant,
        autoHideDelay: 3000
      })
    },

      /**
     *  Get detail
     */
    getTradeDetail() {
      let tradeId = this.route.params.id
      if(tradeId){
        this.loading = true

        tradeApi.getTradeDetail(tradeId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.trade = res.data.data
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
     * Get detail
     */
    getStoreDetail() {
      let storeId = this.authStore.user.storeId
      if(storeId){
        superAdminAPI.getStoreDetail(storeId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            let store = res.data.data
              this.store_name = store.name
              this.store_phone_number = store.phone_number
              this.store_tax_code = ""

              var address = ""
              if(store.address) {
                  address += store.address
              }
              if(store.district_name) {
                  address += store.district_name
              }
              if(store.city_name) {
                  address += ", " + store.city_name
              }
              this.store_address = address
          }
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      } else {
        this.authStore.removeToken()
        this.$router.push('/staff-login')
      }
    },

    /**
     * In hoá đơn
     */
    printInvoice() {
      var mywindow = window.open('', 'PRINT', 'height=600,width=800');

      mywindow.document.write('<html><head><title> </title><style>');
      mywindow.document.write(' .print-text-center {text-align: center;} ');
      mywindow.document.write(' .print-text-left {text-align: left;} ');
      mywindow.document.write(' .print-text-right {text-align: right;} ');
      mywindow.document.write(' .print-width-50-left {width: 48%; float: left;} ');
      mywindow.document.write(' .print-width-50-right {width: 48%; float: right;} ');
      if(this.trade.trade_type == 0) {
        mywindow.document.write(' .print-border {border: black solid 1px;} ');
        mywindow.document.write(' .print-pl-2 {padding-left: 10px;} ');
        mywindow.document.write(' #print-table-border > table, th, td {border: black solid 1px; border-collapse: collapse;} ');
        mywindow.document.write(' .print-border {border: black solid 1px; border-collapse: collapse;} ');
        mywindow.document.write(' .print-no-border {border: none;} ');
        mywindow.document.write('</style></head><body >');
        mywindow.document.write(document.getElementById('invoiceBuy').innerHTML);
      } else {
        if(this.invoiceTemplate == 'template_1') {
          mywindow.document.write(' .print-border {border: black solid 1px;} ');
          mywindow.document.write(' .print-pl-2 {padding-left: 10px;} ');
          mywindow.document.write(' #print-table-border > table, th, td {border: black solid 1px; border-collapse: collapse;} ');
          mywindow.document.write(' .print-border {border: black solid 1px; border-collapse: collapse;} ');
          mywindow.document.write(' .print-no-border {border: none;} ');
          mywindow.document.write('</style></head><body >');
          mywindow.document.write(document.getElementById('invoiceSell').innerHTML);
        } else {
          mywindow.document.write('</style></head><body >');
          mywindow.document.write(document.getElementById('compactInvoice').innerHTML);
        }
      }

      mywindow.document.write('</body></html>');

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      mywindow.print();
      mywindow.close();

      return true;
    },

    convertNumberToText(number) {
      let input = (number + '').replaceAll("," ,"")
      return commonFunc.convert_number_to_text(input)
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.router.push("/trade-sell-his")
    },

    /**
   * Currency format
   */
    currencyFormat(num) {
      let result = ""
        if(num == 0) {
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
    margin: 0 auto;
    border-collapse: collapse;
    overflow-x: auto;
    display: block;
    width: fit-content !important;
    min-width: 0 !important;
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
