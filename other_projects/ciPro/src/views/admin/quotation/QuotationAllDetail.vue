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
                <b-button variant="outline-primary" class="pull-right btn-width-120" 
                  @click="openModalChooseFilePrint">
                  In báo giá
                </b-button>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-1 text-center text-header">Chi Tiết Báo Giá</h4>
              </b-col>
            </b-row>
            <hr/>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <b-row>
              <b-col>
                <p>Mã báo giá: {{trade.quotation_number}}</p>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <p>Ngày lập: {{trade.created_at}}</p>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="12" class="bg-gray text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin khách hàng</span>
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
                      <span>SĐT khách hàng: {{trade.customer_phone}}</span>
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
                      <span>Loại công ty: {{convertCompanyTypeIdToName(trade.customer_company_type_id)}}</span>
                    </label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>
                      <span>Tên người liên hệ: {{trade.contact_person_name}}</span>
                    </label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>
                      <span>Sđt người liên hệ: {{trade.contact_person_phone}}</span>
                    </label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>
                      <span>Tình trạng khách hàng: {{convertCustomerStatusIdToName(trade.customer_status)}}</span>
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
            <b-row>
              <b-col>
                <p>
                  Tổng doanh số theo hãng:
                  <span v-for="(brand) in brands_amount">
                    {{" - " + brand.name + ": " + currencyFormat(brand.amount) }}
                  </span>
                </p>

              </b-col>
            </b-row>
            <b-row class="mt-2" v-show="trade.products.length > 0" >
                  <b-col md="12" class="table-cus">
                  <table class="table table-bordered table-striped fixed_header">
                    <colgroup>
                      <col style="width:2%">
                      <col style="width:12%">
                      <col style="width:12%">
                      <col style="width:5%">
                      <col style="width:7%">
                      <col style="width:5%">
                      <col style="width:7%">
                      <col style="width:5%">
                      <col style="width:5%">
                      <col style="width:5%">
                      <col style="width:7%">
                      <col style="width:5%">
                      <col style="width:8%">
                      <col style="width:7%">
                      <col style="width:4%">
                    </colgroup>
                      <tr>
                        <th class="text-center font-weight-bold">STT</th>
                        <th class="text-center font-weight-bold">Mã SP</th>
                        <th class="text-center font-weight-bold">Sản phẩm</th>
                        <th class="text-center font-weight-bold">Hãng SP</th>
                        <th class="text-center font-weight-bold">Giá List</th>
                        <th class="text-center font-weight-bold">CK từ NCC</th>
                        <th class="text-center font-weight-bold">Giá gốc</th>
                        <th class="text-center font-weight-bold">% lợi nhuận theo giá list</th>
                        <th class="text-center font-weight-bold">% lợi nhuận theo giá gốc</th>
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
                        <td class="text-right">{{item.discount_original_price}}%</td>
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
                          {{item.product_name ? item.product_name : item.product_name_input}}
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
                          <span v-show="item.product_type == 1">{{item.discount_original_price}}%</span>
                        </td>
                        <td class="text-right">
                          <span v-show="item.product_type == 1">{{currencyFormat(item.profit_on_item)}}</span>
                        </td>
                        <td class="text-right">
                          <span v-show="item.product_type == 0">{{currencyFormat(item.project_price)}}</span>
                          <span v-show="item.product_type == 1">{{currencyFormat(item.price_sell)}}</span>
                        </td>
                        <td class="text-right">
                          <span v-show="item.product_type == 0">{{currencyFormat(item.project_quantity)}}</span>
                          <span v-show="item.product_type == 1">{{currencyFormat(item.quantity)}}</span>
                        </td>
                        <td class="text-right">
                          {{currencyFormat(item.product_type == 0 ? item.project_amount : item.amount_sell)}}
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
                    <label> Tổng tiền sản phẩm: {{currencyFormat(trade.sub_total)}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label>
                      Chi phí thêm: {{currencyFormat(trade.extra_fee)}}
                      <span v-if="trade.extra_fee">{{' (' + trade.note_extra_fee + ')'}}</span>
                    </label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label> Số tiền giảm: {{currencyFormat(trade.fixed_discount)}}  </label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label> Thuế VAT({{trade.vat_percent}}%): {{currencyFormat(trade.vat_value)}} </label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label> Thành tiền: {{currencyFormat(trade.total)}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label> Lợi nhuận: {{currencyFormat(trade.profit)}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label> Tài khoản nhận thanh toán: {{trade.bank_account_str}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label> Hình thức thanh toán: {{trade.payment_method}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label> Thỏa thuận vận chuyển: {{trade.shipping_agreement}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label> Phí giao hàng: {{currencyFormat(trade.shipping_fee)}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label> Hiệu lực báo giá: {{trade.quotation_expiry_date}} ngày</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label> Nhân viên phụ trách: {{trade.staff_in_charge_name}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label> Thời gian giao hàng: {{trade.shipping_date}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label> Bảo hành: {{trade.guarantee}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label> Giấy tờ kèm theo: {{trade.attach_doc}}</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" class="mt-2">
                    <label> Ghi chú: {{trade.description}}</label>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>


    <!--    Print-->
    <b-row hidden id="provisionalInvoice">
      <b-col>
        <img :src="'/static/img/project/print/quotation/header_' + this.$store.state.user.storeId + '.png'" style="width: 100%"/>

        <div v-if="this.$store.state.user.storeId != 19" style="width:100%; height:35px; font-size: 12px;" class="tr-bg">
          <div style="color: #006699; font-size: 18px; float: left; width: 70%; text-align: center; margin-top: 10px;">
            <b>BẢNG BÁO GIÁ</b>
          </div>
          <div style="float: right; width: 30%; margin-top: 10px; text-align: center">
            <i class="print-text-right">TP.HCM, Ngày {{today_day}} tháng {{today_month}} năm {{today_year}}</i>
          </div>
        </div>

        <!--Cty 19 mong muốn mẫu báo giá khác-->
        <div v-if="this.$store.state.user.storeId == 19" style="width:100%; height:35px; font-size: 12px;">
          <div style="font-size: 18px; text-align: center; margin-top: 10px;">
            <b>THƯ BÁO GIÁ</b>
          </div>
          <div style="font-size: 12px; text-align: center; margin-top: 10px;">
            <span><b>Số báo giá: {{trade.quotation_number}}</b></span>
          </div>
          <div style="float: right; width: 100%; margin-top: 10px; text-align: right">
            <i class="print-text-right">TP.HCM, Ngày {{today_day}} tháng {{today_month}} năm {{today_year}}</i>
          </div>
        </div>

        <div v-if="this.$store.state.user.storeId != 19" style="width:100%; font-size: 12px; text-align: right; margin-top: 5px; margin-bottom: 5px;">
          <div style="color: #006699; font-size: 18px; float: left; width: 70%; text-align: center;">
          </div>
          <div style="float: right; width: 30%; margin-top: 5px; margin-bottom: 5px; text-align: center">
            <span>Số báo giá: {{trade.quotation_number}}</span>
          </div>
        </div>

        <div class="print-table-border custom-line-height">
          <table style="width:100%; font-size: 10px">
            <tr class="print-pl-2">
              <td colspan="2" class="print-pl-2"> Kính gửi: <b><span>{{trade.customer_name}}</span></b></td>
            </tr>
            <tr>
              <td class="print-no-border print-pl-2">Anh/chị: <span>{{trade.contact_person_name}}</span></td>
              <td class="print-no-border">Kinh doanh: <span>{{trade.staff_in_charge_name}}</span></td>
            </tr>
            <tr>
              <td class="print-no-border print-pl-2">Điện thoại: <span>{{trade.contact_person_phone}}</span></td>
              <td class="print-no-border">Điện thoại: <span>{{trade.staff_in_charge_phone}}</span></td>
            </tr>
            <tr>
              <td class="print-no-border print-pl-2">Email: <span>{{trade.contact_person_email}}</span></td>
              <td class="print-no-border">Email: <span>{{trade.staff_in_charge_email}}</span></td>
            </tr>
          </table>
        </div>
        <div style="width:100%; font-size: 12px; text-align: right; margin-top: 5px; margin-bottom: 5px;">
          <div style="width: 100%; margin-top: 5px; margin-bottom: 5px; text-align: left">
            <span><i><b>{{store_name}}</b> chân thành cảm ơn Quý Khách Hàng đã quan tâm đến dịch vụ/sản phẩm của công ty chúng tôi. Chúng tôi trân trọng gửi tới Quý Khách:</i></span>
          </div>
        </div>
        <div class="print-table-border">
          <table style="width:100%; font-size: 10px" class="custom-line-height">
            <tr class="print-text-center tr-bg" style="background-color: #eeece1">
              <th>STT</th>
              <th>MÃ SẢN PHẨM</th>
              <th>MÔ TẢ SẢN PHẨM</th>
              <th>HÃNG SX</th>
              <th>ĐVT</th>
              <th>SL</th>
              <th>ĐƠN GIÁ</th>
              <th>THÀNH TIỀN (VNĐ)</th>
              <th>GHI CHÚ</th>
            </tr>
            <tr v-if="trade.type == 0" v-for="(item, index) in trade.products" :key="item.product_id">
              <td class="print-text-center">{{index + 1}}</td>
              <td>{{item.product_code ? item.product_code : item.product_code_input}}</td>
              <td>
                {{item.product_name ? item.product_name : item.product_name_input}}
                <span v-for="(des) in item.description" :key="des">
                  <br><i class="print-pl-2">{{des}}</i>
                </span>
              </td>
              <td class="print-text-center">{{item.brand_name ? item.brand_name : item.brand_name_input}}</td>
              <td class="print-text-center">{{item.unit_name ? item.unit_name : item.unit_name_input}}</td>
              <td  class="print-text-center">{{currencyFormat(item.quantity)}}</td>
              <td class="print-text-right">{{currencyFormat(item.price_sell)}}</td>
              <td class="print-text-right">{{currencyFormat(item.amount_sell)}}</td>
              <td>{{item.note}}</td>
            </tr>
            <tr v-if="trade.type == 1" v-for="(item) in projectProducts" :key="item.project_index" :class="item.product_type == 0 ? 'project_bg' : ''">
              <td class="print-text-center">{{item.project_index}}</td>
              <td>
              	<span v-show="item.product_type == 1">{{item.product_code ? item.product_code : item.product_code_input}}</span>
          	  </td>
              <td>
                <span v-show="item.product_type == 1">{{item.product_name ? item.product_name : item.product_name_input}}</span>
                <b v-show="item.product_type == 0">{{item.product_name}}</b>
              </td>
              <td class="print-text-center">
                <span v-show="item.product_type == 1">
                  {{item.brand_name ? item.brand_name : item.brand_name_input}}
                </span>
                <span v-show="item.product_type == 0">
                  {{item.project_brand_name}}
                </span>
              </td>
              <td class="print-text-center">
                <span v-show="item.product_type == 1">
                  {{item.unit_name ? item.unit_name : item.unit_name_input}}
                </span>
                <span v-show="item.product_type == 0">
                  {{item.project_unit_name}}
                </span>
              </td>
              <td  class="print-text-center">
                {{currencyFormat(item.product_type == 1 ? item.quantity : item.project_quantity)}}
              </td>
              <td class="print-text-right">
                <span v-show="trade.show_price_project == 'false' && item.product_type == 1">-</span>
                <span v-show="trade.show_price_project == 'false' && item.product_type == 0">{{currencyFormat(item.project_price)}}</span>
                <span v-show="trade.show_price_project == 'true'">
                  {{currencyFormat(item.product_type == 1 ? item.price_sell : item.project_price)}}
                </span>
              </td>
              <td class="print-text-right">
                <span v-show="trade.show_price_project == 'false' && item.product_type == 1">-</span>
                <span v-show="trade.show_price_project == 'false' && item.product_type == 0">{{currencyFormat(item.project_amount)}}</span>
                <span v-show="trade.show_price_project == 'true'">
                  {{currencyFormat(item.product_type == 1 ? item.amount_sell : item.project_amount)}}
                </span>
              </td>
              <td>{{item.product_type == 1 ? item.note : ''}}</td>
            </tr>
            <tr>
              <td colspan="7" class="print-text-right">CỘNG TIỀN HÀNG:</td>
              <td class="print-text-right"><b>{{currencyFormat(trade.sub_total)}}</b></td>
              <td></td>
            </tr>
            <tr v-show="trade.extra_fee && parseInt(trade.extra_fee) > 0">
              <td colspan="7" class="print-text-right">
                CHI PHÍ KHÁC
                <span v-show="trade.note_extra_fee"> ({{trade.note_extra_fee}})</span>
              </td>
              <td class="print-text-right">{{currencyFormat(trade.extra_fee)}}</td>
              <td></td>
            </tr>
            <tr v-show="trade.fixed_discount && parseInt(trade.fixed_discount) > 0">
              <td colspan="7" class="print-text-right">GIẢM GIÁ</td>
              <td class="print-text-right">{{currencyFormat(trade.fixed_discount)}}</td>
              <td></td>
            </tr>
            <tr v-show="trade.have_vat && parseInt(trade.vat_value) > 0">
              <td colspan="7" class="print-text-right">Thuế GTGT (VAT {{trade.vat_percent}}%)</td>
              <td class="print-text-right">{{currencyFormat(trade.vat_value)}}</td>
              <td></td>
            </tr>
            <tr>
              <td colspan="7" class="print-text-right"><b>TỔNG TIỀN THANH TOÁN:</b></td>
              <td class="print-text-right"><b>{{currencyFormat(trade.total)}}</b></td>
              <td></td>
            </tr>
          </table>
          <div>
            <p style="font-size: 10px"><b> Số tiền viết bằng chữ:</b> {{convertNumberToText(trade.total)}}</p>
          </div>
          <div>
            <p style="color: red; font-size: 10px">
              <b v-if="this.$store.state.user.storeId != 19 && trade.type == 0">* Quý khách hàng vui lòng kiểm tra mã sản phẩm & thông số sản phẩm, hàng mua xin miễn đổi trả</b>
              <b v-if="this.$store.state.user.storeId == 19 || trade.type == 1">* Quý khách hàng vui lòng xem thêm các Điều khoản - Chính sách báo giá phía dưới dây:</b>
            </p>
          </div>

          <div>
            <table style="width:100%; font-size: 10px">
              <tr>
                <td class="print-no-border">
                  {{this.$store.state.user.storeId == 19 ? 'Thời gian giao hàng:' : 'Bảo hành:'}}
                </td>
                <td class="print-no-border">
                  <span v-if="this.$store.state.user.storeId == 19">
                    {{trade.shipping_date}}
                  </span>
                  <span v-if="this.$store.state.user.storeId != 19">
                    {{trade.guarantee}}
                  </span>
                </td>
                <td class="print-no-border" colspan="2">
                  Thông tin tài khoản ngân hàng thụ hưởng:
                </td>
              </tr>
              <tr>
                <td class="print-no-border">Hiệu lực báo giá:</td>
                <td class="print-no-border">{{trade.quotation_expiry_date}} ngày <span style="color: #C0C0C0">(kể từ ngày báo giá)</span></td>
                <td class="print-no-border">Tên tài khoản:</td>
                <td class="print-no-border">{{trade.account_name}}</td>
              </tr>
              <tr>
                <td class="print-no-border">Giao hàng:</td>
                <td class="print-no-border">
                  <span>{{!trade.shipping_agreement ? 'Nội thành HCM' : trade.shipping_agreement}}. </span>
                  <span v-show="trade.shipping_fee && parseInt(trade.shipping_fee) > 0">
                    {{'Chi Phí giao hàng là: ' + currencyFormat(trade.shipping_fee) + ' đồng'}}
                  </span>
                </td>
                <td class="print-no-border">Số tài khoản: </td>
                <td class="print-no-border">
                  <span>{{trade.account_number}}</span>
                </td>
              </tr>
              <tr>
                <td class="print-no-border">Hình thức Thanh toán: </td>
                <td class="print-no-border">
                  <span>{{trade.payment_method ? trade.payment_method : trade.payment_method_input }}</span>
                </td>
                <td class="print-no-border">Ngân hàng: </td>
                <td class="print-no-border">
                  <span>{{trade.bank_name}}</span>
                </td>
              </tr>
              <tr>
                <td class="print-no-border"></td>
                <td class="print-no-border"></td>
                <td class="print-no-border">Nội dung chuyển khoản: </td>
                <td class="print-no-border">
                  <span>{{'Tên công ty - ' + trade.quotation_number}}</span>
                </td>
              </tr>
              <tr v-show="trade.description">
                <td class="print-no-border"><b>Ghi chú thêm:</b></td>
                <td class="print-no-border" colspan="3">{{trade.description}}</td>
              </tr>
              <tr v-show="trade.type == 1">
                <td class="print-no-border" colspan="4"><b style="color: red">* Cam kết:</b> Khách hàng được hỗ trợ tư vấn kỹ thuật trong suốt thời gian sử dụng tủ điện. Bàn giao bản vẽ sơ đồ nguyên lý đấu nối, mạch điều khiển, Giấy test chất lượng xuất xưởng, Phiếu bảo hành cho khách hàng.</td>
              </tr>
              <tr>
                <td class="print-no-border" colspan="4">Mọi thắc mắc vui lòng liên hệ nhân viên lập báo giá phía trên</td>
              </tr>
            </table>
          </div>
          <br><br>
          <div>
            <table style="width:100%; font-size: 10px">
              <tr>
                <td class="print-no-border print-text-center"><b>XÁC NHẬN ĐẶT HÀNG</b></td>
                <td class="print-no-border print-text-center"><b>NGƯỜI BÁO GIÁ</b></td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center" style="color: #C0C0C0">(Đại diện khách hàng)</td>
                <td class="print-no-border print-text-center" style="color: #C0C0C0">(Đại diện thiết bị Bến Thành)</td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"></td>
                <td class="print-no-border print-text-center"><b>{{trade.staff_in_charge_name}}</b></td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"></td>
                <td class="print-no-border print-text-center">{{trade.staff_in_charge_position}}</td>
              </tr>
            </table>
          </div>

        </div>

        <!--<img @error="imageUrlNotExist" v-show="trade.type == 1 && showImage" :src="'/static/img/project/print/quotation/bottom_1_' + this.$store.state.user.storeId + '.png'" style="width: 100%"/>-->
        <!--<img @error="imageUrlNotExist" v-show="trade.type == 1 && showImage" :src="'/static/img/project/print/quotation/bottom_2_' + this.$store.state.user.storeId + '.png'" style="width: 100%"/>-->
        <!--<img @error="imageUrlNotExist" v-show="trade.type == 1 && showImage" :src="'/static/img/project/print/quotation/bottom_3_' + this.$store.state.user.storeId + '.png'" style="width: 100%"/>-->
        <!--<img @error="imageUrlNotExist" v-show="trade.type == 1 && showImage" :src="'/static/img/project/print/quotation/bottom_4_' + this.$store.state.user.storeId + '.png'" style="width: 100%"/>-->
        <!--<img @error="imageUrlNotExist" v-show="trade.type == 1 && showImage" :src="'/static/img/project/print/quotation/bottom_5_' + this.$store.state.user.storeId + '.png'" style="width: 100%"/>-->

      </b-col>

    </b-row>

    <!-- Modal chọn kiểu file in -->
    <b-modal centered hide-footer hide-header size="sm" id="modal-choose-print-file-type">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Chọn File In Báo Giá</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col cols="12">
          <b-button v-show="!exportingExcel" variant="outline-primary"
                    class="pull-left btn-width-120" @click="exportExcel('excel')">
            Xuất Excel
          </b-button>

          <b-button v-show="!exportingExcel" variant="outline-success"
                    class="pull-right btn-width-120" @click="exportExcel('pdf')">
            Xuất PDF
          </b-button>
          <span class="loading-more" v-show="exportingExcel"><icon name="loading" width="60" /></span>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12" class="text-center mt-3">
          <b-button variant="outline-secondary" class="btn-width-120" @click="hideModalChooseFilePrint">
            Quay lại
          </b-button>
        </b-col>
      </b-row>

    </b-modal>


  </div>
</template>


<script>
import quotationApi from '@/api/quotation'
import superAdminAPI from '@/api/superAdmin'
import { RootAPI } from '@/api/index'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      trade: {
        "id": null,
        "quotation_number": null,
        "created_at": null,
        "status": -1,
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
        "quotation_expiry_date": 3,
        "staff_in_charge": null,
        "staff_in_charge_name": null,
        "staff_in_charge_phone": null,
        "staff_in_charge_email": null,
        "staff_in_charge_position": null,
        "description": null,
        "products": [],
        "promotions": [],
        "shipping_date": null,
        "guarantee": null,
        "attach_doc": null
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
      store_name: "",
      store_tax_code: "",
      store_address: "",
      store_phone_number: "",
      today_day: "",
      today_month: "",
      today_year: "",
      userRole: "admin",
      brands_amount: [],
      projectProducts: [],
      exportingExcel: false,
    }
  },
  mounted() {
    // UI by staff
    let url = location.href
    if(url.includes("quotation-staff") || url.includes("quotation-project-staff")) {
      this.userRole = "staff"
    }

    // Get today day, month, year
    let dateNow = new Date()
    this.today_day = dateNow.getDate()
    this.today_month = dateNow.getMonth() + 1
    this.today_year = dateNow.getFullYear()

    // Get quotation detail
    this.getQuotationDetail()

    // Get store info
    this.getStoreDetail()
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
                  'price' : productsExcel[i].price_sell,
                  'amount' : productsExcel[i].amount_sell,
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
            project.project_unit_name = p.project_unit_name
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
    getQuotationDetail() {
      let quotationId = this.$route.params.id
      if(quotationId){
        this.loading = true

        quotationApi.getQuotationDetail(quotationId, this.userRole).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.trade = res.data.data
            this.trade.show_price_project = this.trade.show_price_project + ''

            // Kiểm tra là loại báo giá nào, nếu là báo giá dự án thì handle lại ds sp:
              if(this.trade.type == 1) {
                this.handleListProduct()
              }

            this.handleProductExcel()

            // Tính toán amount theo brand
            this.calculateProductAmountByBrand()
          }

          this.loading = false

        }).catch(err => {
            console.log("--------")
            console.log(err)
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    },

    calculateProductAmountByBrand() {
      this.brands_amount = []
      let brands = []
      for (let product of this.trade.products) {
        let brand_name = product.brand_name
        if(!brand_name) {
          brand_name = product.brand_name_input
        }
        if(!brand_name) {
          break
        }
        let price = (product.price + "").replaceAll(",", "")
        let quantity = (product.quantity + "").replaceAll(",", "")
        let amount = Math.round(parseInt(price) * parseFloat(quantity))
        if(brands.includes(brand_name)) {
          for(let brand of this.brands_amount) {
            if(brand.name == brand_name) {
              brand.amount += amount
            }
          }
        } else {
          let item = {"name": brand_name, "amount": amount}
          this.brands_amount.push(item)
          brands.push(brand_name)
        }
      }
    },

    /**
     * Get detail
     */
    getStoreDetail() {
      let storeId = this.$store.state.user.storeId
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
        this.$store.commit('removeToken')
        this.$router.push('/staff-login')
      }
    },

    // handlePrintProvisionalInvoice() {
    //   this.openModalChooseFilePrint()
    //   // if(this.trade.type == 0) {
    //   //   this.openModalChooseFilePrint()
    //   // } else {
    //   //   this.printInvoice()
    //   // }
    // },

    openModalChooseFilePrint() {
      this.$bvModal.show('modal-choose-print-file-type')
    },

    hideModalChooseFilePrint() {
      this.$bvModal.hide('modal-choose-print-file-type')
    },

    /**
     * Xuất file excel
     */
    exportExcel(type='excel') {
      this.exportingExcel = true
      quotationApi.exportExcel({'id': this.trade.id, 'type': type}).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            let data = res.data.data
            commonFunc.downloadFile(RootAPI.replace('api/', '') + data.file_path, data.file_name)
          }

          this.exportingExcel = false

        }).catch(err => {
          this.exportingExcel = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
    },

    /**
     * In hoá đơn
     */
    printInvoice() {
      var mywindow = window.open('', 'PRINT', 'height=900,width=1200');

      mywindow.document.write('<html><head><title> </title><style>');
      mywindow.document.write(' body {font-size: 14px;} ');
      mywindow.document.write(' .print-text-center {text-align: center;} ');
      mywindow.document.write(' .print-text-left {text-align: left;} ');
      mywindow.document.write(' .print-text-right {text-align: right;} ');
      mywindow.document.write(' .print-width-50-left {width: 48%; float: left;} ');
      mywindow.document.write(' .print-width-50-right {width: 48%; float: right;} ');
      mywindow.document.write(' .print-border {border: gray solid 0.03em;} ');
      mywindow.document.write(' .print-pl-2 {padding-left: 10px;} ');
      mywindow.document.write(' .print-table-border > table, th, td {border: gray solid 0.03em; border-collapse: collapse;} ');
      mywindow.document.write(' .print-border {border: gray solid 0.03em; border-collapse: collapse;} ');
      mywindow.document.write(' .print-no-border {border: none;} ');
      mywindow.document.write(' .tr-bg {background-color: #eeece1 !important; print-color-adjust: exact; -webkit-print-color-adjust: exact;} ');
      mywindow.document.write(' .custom-line-height tr { line-height: 25px; } ');
      mywindow.document.write(' .project_name {background-color: #0C5395 !important; color: white; font-weight: bold; print-color-adjust: exact; -webkit-print-color-adjust: exact;} ');

      mywindow.document.write('</style></head><body >');
      mywindow.document.write(document.getElementById('provisionalInvoice').innerHTML);
      mywindow.document.write('</body></html>');

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      setTimeout(function() {
        mywindow.print();
        mywindow.close();
      }, 1000);

      // mywindow.print();
      // mywindow.close();

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
      if(this.userRole == "admin") {
          this.$router.push("/quotation-all")
      } else {
          this.$router.push("/quotation-staff")
      }
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

    convertCompanyTypeIdToName(id) {
      if(id == 0) {
        return "Khách lẻ"
      }
      if(id == 1) {
        return "Thương mại"
      }
      if(id == 2) {
        return "Nhà máy"
      }
      if(id == 3) {
        return "Công trình"
      }
      return ""
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

    // imageUrlNotExist() {
    //     this.showImage = false
    // },
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
