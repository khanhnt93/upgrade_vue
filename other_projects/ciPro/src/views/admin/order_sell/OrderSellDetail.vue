<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

            <b-row>
              <b-col cols="12">
                <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="back">
                  Quay lại
                </b-button>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-1 text-center text-header">Chi Tiết Đơn Hàng Bán</h4>
              </b-col>
            </b-row>
            <hr/>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <b-row class="form-row">
              <b-col md="6" class="mt-2">
                <label>
                  <span>Số ĐH bán: {{trade.order_sell_number}}</span>
                </label>
              </b-col>
              <b-col md="6" class="mt-2">
                <label>
                  <span>Xuất hóa đơn: {{trade.issue_invoice ? 'Có' : 'Không'}}</span>
                </label>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="6" class="mt-2">
                <label>
                  <span>Từ báo giá: {{trade.quotation_number}}</span>
                </label>
              </b-col>
              <b-col md="6" class="mt-2">
                <label>
                  <span>Ngày lập: {{trade.created_at}}</span>
                </label>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="12" class="bg-gray text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin người mua</span>
                </h5>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>
                      <span>Tên khách hàng: {{trade.customer_name}}</span>
                    </label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>
                      <span>Mã số thuế: {{trade.customer_tax_code}}</span>
                    </label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>
                      <span>Địa chỉ khách hàng: {{trade.customer_address}}</span>
                    </label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>
                      <span>Email nhận hoá đơn: {{trade.customer_email}}</span>
                    </label>
                  </b-col>
                </b-row>

              </b-col>
            </b-row>


            <b-row class="mt-3">
              <b-col md="12" class="bg-info bg-gradient text-white title-partner">
                <h5>
                  <span class="pull-left">Danh sách sản phẩm</span>
                </h5>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12" class="text-right">
                    <download-excel
                      class   = "btn btn-default text-header"
                      :data   = "products_excel"
                      :fields = "excel_fields"
                      worksheet = "Danh sách sản phẩm báo giá"
                      name    = "danh_sach_san_pham_bao_gia.xls">
                      <b>Xuất Excel</b>
                    </download-excel>
                  </b-col>
            </b-row>
            <b-row class="mt-2" v-show="trade.products.length > 0" >
                  <b-col md="12" class="table-cus">
                  <table class="table table-bordered table-striped fixed_header">
                    <colgroup>
                      <col style="width:3%">
                      <col style="width:13%">
                      <col style="width:14%">
                      <col style="width:5%">
                      <col style="width:8%">
                      <col style="width:5%">
                      <col style="width:8%">
                      <col style="width:5%">
                      <col style="width:5%">
                      <col style="width:8%">
                      <col style="width:5%">
                      <col style="width:9%">
                      <col style="width:8%">
                      <col style="width:4%">
                    </colgroup>
                    <tr>
                        <th class="text-center font-weight-bold">STT</th>
                        <th class="text-center font-weight-bold">Mã sản phẩm</th>
                        <th class="text-center font-weight-bold">Tên sản phẩm</th>
                        <th class="text-center font-weight-bold">Hãng SP</th>
                        <th class="text-center font-weight-bold">Giá List</th>
                        <th class="text-center font-weight-bold">CK từ NCC</th>
                        <th class="text-center font-weight-bold">Giá gốc</th>
                        <th class="text-center font-weight-bold">% lợi nhuận mong muốn</th>
                        <th class="text-center font-weight-bold">Lợi nhuận/sản phẩm</th>
                        <th class="text-center font-weight-bold">Giá bán</th>
                        <th class="text-center font-weight-bold">Số lượng</th>
                        <th class="text-center font-weight-bold">Thành tiền</th>
                        <th class="text-center font-weight-bold">Lợi nhuận tổng</th>
                        <th class="text-center font-weight-bold">Ghi chú</th>
                      </tr>
                    <tbody v-if="trade.type == 0 && trade.products.length > 0">
                      <tr v-for="(item, index) in trade.products">
                        <td>{{index + 1}}</td>
                        <td>{{item.product_code ? item.product_code : item.product_code_input}}</td>
                        <td>{{item.product_name ? item.product_name : item.product_name_input}}</td>
                        <td>{{item.brand_name ? item.brand_name : item.brand_name_input}}</td>
                        <td class="text-right">{{currencyFormat(item.price_list)}}</td>
                        <td class="text-right">{{item.discount}}%</td>
                        <td class="text-right">{{currencyFormat(item.price)}}</td>
                        <td class="text-right">{{item.discount_sale}}%</td>
                        <td class="text-right">{{currencyFormat(item.profit_on_item)}}</td>
                        <td class="text-right">{{currencyFormat(item.price_sell)}}</td>
                        <td class="text-right">{{currencyFormat(item.quantity)}}</td>
                        <td class="text-right">{{currencyFormat(item.amount_sell)}}</td>
                        <td class="text-right">{{currencyFormat(item.profit)}}</td>
                        <td class="text-right">{{item.note}}</td>
                      </tr>
                    </tbody>
                    <tbody v-if="trade.type == 1 && projectProducts.length > 0">
                      <tr v-for="(item) in projectProducts" :class="item.product_type == 0 ? 'project_bg' : ''">
                        <td class="fitwidth-50">
                          {{item.project_index}}
                        </td>
                        <td class="fitwidth-250">
                          <span v-show="item.product_type == 1">{{item.product_code ? item.product_code : item.product_code_input}}</span>
                        </td>
                        <td class="fitwidth-250">
                          <span v-show="item.product_type == 1">
                            {{item.product_name ? item.product_name : item.product_name_input}}
                          </span>
                          <span v-show="item.product_type == 0">
                            <b>{{item.product_name}}</b>
                          </span>
                        </td>
                        <td class="fitwidth-50">
                          <span v-show="item.product_type == 1">
                            {{item.brand_name ? item.brand_name : item.brand_name_input}}
                          </span>
                          <span v-show="item.product_type == 0">
                            {{item.project_brand_name}}
                          </span>
                        </td>
                        <td class="text-right">
                          <span v-show="item.product_type == 1">{{currencyFormat(item.price_list)}}</span>
                        </td>
                        <td class="text-right">
                          <span v-show="item.product_type == 1">{{item.discount}}%</span>
                        </td>
                        <td class="text-right">
                          <span v-show="item.product_type == 1">{{currencyFormat(item.price)}}</span>
                        </td>
                        <td class="text-right">
                          <span v-show="item.product_type == 1">{{item.discount_sale}}%</span>
                        </td>
                        <td class="text-right">
                          <span v-show="item.product_type == 1">{{currencyFormat(item.profit_on_item)}}</span>
                        </td>
                        <td class="text-right">
                          <span v-show="item.product_type == 0">{{currencyFormat(item.project_price)}}</span>
                          <span v-show="item.product_type == 1">{{currencyFormat(item.price_sell)}}</span>
                        </td>
                        <td class="text-right">
                          <span v-show="item.product_type == 0">
                            <b>{{currencyFormat(item.project_quantity)}}</b>
                          </span>
                          <span v-show="item.product_type == 1">{{currencyFormat(item.quantity)}}</span>
                        </td>
                        <td class="text-right">
                          <span v-show="item.product_type == 0">
                            <b>{{currencyFormat(item.project_amount)}}</b>
                          </span>
                          <span v-show="item.product_type == 1">
                            <b>{{currencyFormat(item.amount_sell)}}</b>
                          </span>
                        </td>
                        <td class="text-right">
                          <span v-show="item.product_type == 1">{{currencyFormat(item.profit)}}</span>
                        </td>
                        <td>
                          <span v-show="item.product_type == 1">{{item.note}}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  </b-col>
                </b-row>

            <b-row class="mt-3">
              <b-col md="12" class="bg-success bg-gradient text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin thanh toán</span>
                </h5>
              </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col>
                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>Tổng tiền sản phẩm: {{currencyFormat(trade.sub_total)}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>Chi phí thêm: {{currencyFormat(trade.extra_fee)}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>Số tiền giảm: {{currencyFormat(trade.fixed_discount)}}  </label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>Thuế VAT({{trade.vat_percent}}%): {{currencyFormat(trade.vat_value)}} </label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>Thành tiền: {{currencyFormat(trade.total)}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>Lợi nhuận: {{currencyFormat(trade.profit)}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>Tài khoản nhận thanh toán: {{trade.bank_account_str}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>Hình thức thanh toán: {{trade.payment_method}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>Thỏa thuận vận chuyển: {{trade.shipping_agreement}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>Phí giao hàng: {{currencyFormat(trade.shipping_fee)}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>Nhân viên phụ trách: {{trade.staff_in_charge_name}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>Ghi chú: {{trade.description}}</label>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

            <b-row class="mt-3">
              <b-col md="12" class="bg-warning text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin giao hàng</span>
                </h5>
              </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col>
                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>Tên người nhận hàng: {{trade.receiver_name}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>SĐT nhận hàng: {{trade.receiver_phone}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>Địa chỉ nhận hàng: {{trade.receiver_address}}  </label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>Ngày giao hàng dự kiến: {{trade.shipping_date ? trade.shipping_date.substring(0, 10) : ''}} </label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>Ghi chú khi giao hàng: {{trade.shipping_note}}</label>
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
import orderSellApi from '@/api/orderSell'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      trade: {
        "id": null,
        "quotation_number": null,
        "status": -1,
        "type": 0,
        "customer_id": null,
        "customer_name": null,
        "customer_phone": null,
        "customer_address": null,
        "customer_tax_code": null,
        "customer_company_type_id": null,
        "contact_person_name": null,
        "contact_person_phone": null,
        "sub_total": 0,
        "extra_fee": null,
        "fixed_discount": null,
        "have_vat": false,
        "vat_percent": 10,
        "vat_value": 0,
        "total": 0,
        "profit": 0,
        "bank_account_id": null,
        "bank_account_str": null,
        "account_name": null,
        "account_number": null,
        "bank_name": null,
        "payment_method": null,
        "payment_method_input": null,
        "shipping_agreement": null,
        "shipping_fee": 0,
        "staff_in_charge": null,
        "staff_in_charge_name": null,
        "staff_in_charge_phone": null,
        "staff_in_charge_email": null,
        "staff_in_charge_position": null,
        "description": null,
        "products": [],
        "promotions": []
      },
      currentProduct: {
        "index": -1,
        "product_group_id": null,
        "product_group_name": null,
        "product_type_id": null,
        "product_type_name": null,
        "product_id": null,
        "product_code": null,
        "product_code_input": null,
        "product_name": null,
        "product_name_input": null,
        "unit_id": null,
        "unit_name": null,
        "unit_id_input": null,
        "unit_name_input": null,
        "brand_id": null,
        "brand_name": null,
        "brand_id_input": null,
        "brand_name_input": null,
        "price_list": null,
        "discount": null,
        "price": null,
        "discount_sale": null,
        "profit_on_item": null,
        "amount": null,
        "price_sell": null,
        "amount_sell": null,
        "profit": null,
        "quantity_repo": null,
        "quantity": null,
        "is_available_in_repo": true,
        "properties": [],
        "note": null
      },
      products_excel: [],
      excel_fields: {
        'STT': 'index',
        'Mã sản phẩm': 'product_code',
        'Tên Sản phẩm' : 'product_name',
        'HÃNG SX' : 'brand_name',
        'ĐVT' : 'unit_name',
        'SL' : 'quantity',
        'ĐƠN GIÁ' : 'price',
        'THÀNH TIỀN (VNĐ)' : 'amount',
        'GHI CHÚ' : 'note'
      },
      loading: false,
      userRole: "admin",
      projectProducts: [],
    }
  },
  mounted() {
    // UI by staff
    let url = location.href
    if(url.includes("order-sell-staff")) {
      this.userRole = "staff"
    }

    // Get OrderSell detail
    this.getOrderSellDetail()
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

      handleProductExcel() {
        this.products_excel = []
        if(this.trade.products.length > 0) {
            let productsExcel = JSON.parse(JSON.stringify(this.trade.products))

            for(let i in productsExcel) {
                let item = {
                  'index': productsExcel[i].index,
                  'product_code': productsExcel[i].product_code ? productsExcel[i].product_code : productsExcel[i].product_code_input,
                  'product_name' : productsExcel[i].product_name ? productsExcel[i].product_name : productsExcel[i].product_name_input,
                  'brand_name' : productsExcel[i].brand_name ? productsExcel[i].brand_name : productsExcel[i].brand_name_input,
                  'unit_name' : productsExcel[i].unit_name ? productsExcel[i].unit_name : productsExcel[i].unit_name_input,
                  'quantity' : productsExcel[i].quantity,
                  'price' : productsExcel[i].price,
                  'amount' : productsExcel[i].amount,
                  'note' : productsExcel[i].note
                }
                this.products_excel.push(item)
            }
        }
      },

    getParentIndexByName(list_projects_products, project_name) {
      let pro_ind = 0
      for(let item of list_projects_products) {
        if(item.product_name == project_name) {
          return pro_ind
        }
        pro_ind += 1
      }
      return 0
    },

    handleListProduct() {
      if(this.trade.products.length > 0) {

        // Tạo danh sách dự án
        let list_projects = []
        let list_name_project_checked = []
        for(let p of this.trade.products) {
          if(!list_name_project_checked.includes(p.project_name)) {
            list_name_project_checked.push(p.project_name)
            let project = JSON.parse(JSON.stringify(this.currentProduct))
            // project.project_index = index
            project.product_name = p.project_name
            project.project_brand_name = p.project_brand_name
            project.project_quantity = parseFloat(p.project_quantity)
            project.project_amount = 0
            list_projects.push(project)
          }
        }

        // Gom sản phẩm theo dự án
        let list_projects_products = []
        let project_index = 1
        for(let project of list_projects) {
          project.project_index = project_index
          project.product_type = 0 // Dự án
          list_projects_products.push(project)

          let product_index = 1
          for(let product of this.trade.products) {
            let project_item = JSON.parse(JSON.stringify(product))
            if(product.project_name == project.product_name) {
              project_item.project_index = project.project_index + "." + product_index
              project_item.product_type = 1 // Sản phẩm
              list_projects_products.push(project_item)

              let parent_index = this.getParentIndexByName(list_projects_products, product.project_name)
              let amount_sell = (product.amount_sell + '').replaceAll(",", "")
              list_projects_products[parent_index].project_amount += parseInt(amount_sell)
              product_index += 1
            }
          }

          project_index += 1
        }

        // Tính đơn giá dự án
        for(let project of list_projects_products) {
          if(project.product_type == 0) {
            project.project_price = Math.round(project.project_amount / project.project_quantity)
          }
        }

        this.projectProducts = list_projects_products
      }
    },

      /**
     *  Get detail
     */
    getOrderSellDetail() {
      let orderSellId = this.$route.params.id
      if(orderSellId){
        this.loading = true

        orderSellApi.getOrderSellDetail(orderSellId, this.userRole).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.trade = res.data.data

            // Kiểm tra là loại báo giá nào, nếu là báo giá dự án thì handle lại ds sp:
            if(this.trade.type == 1) {
              this.handleListProduct()
            }

              this.handleProductExcel()
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

    convertNumberToText(number) {
      let input = (number + '').replaceAll("," ,"")
      return commonFunc.convert_number_to_text(input)
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      if(this.userRole == "admin") {
          this.$router.push("/order-sell-all")
      } else {
          this.$router.push("/order-sell-staff")
      }
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

    convertCustomerStatusIdToName(id) {
      if(id == 1) {
        return "Khách mới"
      }
      if(id == 2) {
        return "Khách cũ"
      }
      return ""
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

  .project_name {
    color: #0C5395 !important;
    font-weight: bold;
  }

  .project_bg {
    background-color: #6A9AB0 !important;
  }
</style>
