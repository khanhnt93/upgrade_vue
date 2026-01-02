<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>

          <b-row>
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right btn-width-120" @click="goToAdd()">
                Thêm
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-1 text-center text-header">Danh Sách Đơn Hàng Bán</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row class="form-row">

            <b-col md="2">
              <label>Thời gian</label>
              <b-form-select :options="timeOptions" v-model="time_option" ></b-form-select>
            </b-col>

            <b-col md="2">
              <label v-show="time_option != 5">
                {{time_option == 1 ? 'Từ ngày' : 'Năm' }}
              </label>
              <!--Thời gian theo ngày-->
              <datepicker v-show="time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
              <!--Thời gian năm-->
              <b-form-select v-show="time_option != 1 && time_option != 5" :options="yearOptions" v-model="year_input"></b-form-select>
            </b-col>

            <b-col md="2">
              <label v-show="time_option == 1 || time_option == 2 || time_option == 3">
                {{time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý' }}
              </label>

              <!--Thời gian theo ngày-->
              <datepicker v-show="time_option == 1" v-model="inputs.to_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>

              <!--Thời gian tháng -->
              <b-form-select v-show="time_option == 2" :options="monthOptions" v-model="month_input"></b-form-select>

              <!--Thời gian quý -->
              <b-form-select v-show="time_option == 3" :options="quarterOptions" v-model="quarter_input"></b-form-select>
            </b-col>

            <b-col md="2" v-if="userRole == 'admin'">
              <label>Nhân viên phụ trách</label>
              <multiselect
                v-model="inputs.staff_in_charge"
                :options="staffOptions"
                :loading="loadingOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Tất cả--"
                label="name"
                track-by="name">
              </multiselect>
            </b-col>

            <b-col v-bind:md="userRole == 'admin' ? 2 : 3 ">
              <label>Tình trạng đơn</label>
              <b-form-select
                id="status"
                :options="statusOptions"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.status"></b-form-select>
            </b-col>

            <b-col v-bind:md="userRole == 'admin' ? 2 : 3 ">
              <label>Tình trạng công nợ - GH</label>
              <b-form-select
                id="payment_status"
                :options="paymentStatusOptions"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.payment_status"></b-form-select>
            </b-col>
          </b-row>

          <b-row class="mt-2 form-row">
            <b-col md="2">
              <label>Số ĐH bán</label>
              <input
              id="order_sell_number"
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.order_sell_number">
            </b-col>
            <b-col md="2">
              <label>Các phiếu liên quan</label>
              <input
              id="related_number"
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="form-control"
              placeholder="BG..,DHN..,PT..,PC..,XK.."
              v-model="inputs.related_number">
            </b-col>

            <b-col md="2">
              <label>Trạng thái HĐ</label>
              <b-form-select
                id="invoice_status"
                :options="invoiceStatusOptions"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.invoice_status"></b-form-select>
            </b-col>
            <b-col md="2">
              <label>Số HĐ bán ra</label>
              <input
              id="invoice_note"
              type="text"
              maxlength="20"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.invoice_note">
            </b-col>
            <b-col md="4">
              <label>Khách hàng</label>
              <multiselect
                  v-model="inputs.customer"
                  :options="customerOptions"
                  :loading="loadingOptions"
                  :select-label="''"
                  :deselect-label="''"
                  placeholder="--Tất cả--"
                  label="name"
                  track-by="name">
                </multiselect>
            </b-col>

          </b-row>

          <b-row class="mt-2">
            <b-col md="12">
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch"
                        @click.prevent="prepareToSearch">
                Tìm Kiếm
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="4">
              Số kết quả: {{totalRow}}
            </b-col>
            <b-col md="8" class="text-right" v-if="excel_items.length > 0">
                  <download-excel
                    class   = "btn btn-default text-header"
                    :data   = "excel_items"
                    :fields = "excel_fields"
                    worksheet = "Danh sách đơn hàng"
                    name    = "danh_sach_don_hang.xls">
                    <b>Xuất Excel</b>
                  </download-excel>
                </b-col>
          </b-row>

          <b-row>
            <b-col md="12" class="table-cus">
              <table class="table table-bordered table-striped fixed_header">
                    <tr>
                      <th style="width:2%">STT</th>
                      <th style="width:4%">Số ĐH bán</th>
                      <th style="width:6%">Các phiếu liên quan</th>
                      <th style="width:5%">NV phụ trách</th>
                      <th style="width:5%">Tình trạng đơn</th>
                      <th style="width:13%">Tên K.H</th>
                      <th style="width:5%">Tổng giá trị ĐH (gồm VAT)</th>
                      <th style="width:5%">Xuất VAT</th>
                      <th style="width:8%">Hình thức thanh toán</th>
                      <th style="width:5%">Số tiền còn phải TT</th>
                      <th style="width:5%">Chi phí bán hàng</th>
                      <th style="width:7%">Tình trạng kho</th>
                      <th style="width:5%">Ghi chú KD</th>
                      <th style="width:5%">Trạng thái giao hàng</th>
                      <th style="width:5%">Trạng thái HĐ</th>
                      <th style="width:5%">Trạng thái trả hàng</th>
                      <th style="width:5%">Ghi chú kế toán</th>
                      <th style="width:5%"></th>
                    </tr>
                    <tr v-for="(item) in items" v-bind:class="item.row_class">
                      <td>{{item.stt}}</td>
                      <td>
                        <a class="fix-font-size" :href="'/order-sell-' + scope + '/detail/' + item.id" target="_blank" title="Chi tiết đơn hàng">
                          {{item.order_sell_number}}
                        </a>
                      </td>
                      <td>
                          <a v-for="(ballot) in item.ballots" :key="ballot" class="fix-font-size d-block" v-html="ballot"></a>
                      </td>
                      <td>{{item.staff_on_charge_name}}</td>
                      <td>{{item.status_str}}</td>
                      <td style="width: 100px !important;">{{item.customer_name}}</td>
                      <td>{{currencyFormat(item.total)}}</td>
                      <td>{{item.issue_invoice ? 'Có' : 'Không'}}</td>
                      <td>{{item.payment_method}}</td>
                      <td>
                        {{currencyFormat(item.total_remaining)}}
                        <span v-show="item.have_list_income" class="ml-2">
                          <i class="fa fa-info-circle" title="Danh sách thu tiền"
                             @click="showModalDetailPayment(item.id, 'total_remaining')"/>
                        </span>
                      </td>
                      <td>
                        {{currencyFormat(item.expend_order_sell)}}
                        <span v-show="item.expend_order_sell" class="ml-2">
                          <i class="fa fa-info-circle" title="Danh sách chi tiền" @click="showModalDetailPayment(item.id, 'expend_order_sell')"/>
                        </span>
                      </td>
                      <td>{{item.repo_status_str}}</td>
                      <td>
                        <p>{{item.description ? ' - ' + item.description : ''}}</p>
                        <p>{{item.shipping_note ? ' - ' + item.shipping_note : ''}}</p>
                      </td>
                      <td>{{item.shipping_status_str}}</td>
                      <td>
                        <i  v-if="userRole == 'admin'" class="fa fa-edit" @click="showModalChangeInvoiceStatus(item)"
                           title="Cập nhật trạng thái hoá đơn"/>
                        {{item.invoice_note}}
                      </td>
                      <td>{{item.product_back_status_str}}</td>
                      <td>
                        <i class="fa fa-edit" @click="showModalChangeAccountingNote(item)"
                           title="Cập nhật ghi chú kế toán" v-if="userRole == 'admin'"/>
                        {{item.accounting_note}}
                      </td>
                      <td>
                        <div class="input-group">
                          <b-button v-show="(userRole == 'staff' && item.status == -1)
                          || (userRole == 'admin' && item.status < 3 )"
                                    variant="outline-primary" class="mr-2 mt-1"
                                    @click="goToUpdate(item.id)">
                            Sửa
                          </b-button>
                          <b-button v-show="item.status == -1 && userRole == 'admin'"
                                    variant="outline-danger" class="mr-2 mt-1"
                                    @click="deleteOrderSell(item.id, item.customer_name)">
                            Xóa
                          </b-button>
                          <b-button v-if="userRole == 'admin' && item.can_delete"
                                    variant="outline-danger" class="mr-2 mt-1"
                                    @click="deleteOrderSellAfterCancel(item.id, item.customer_name)">
                            Xóa
                          </b-button>

                          <b-button v-show="item.status > -1 && item.status < 4 && userRole == 'admin'"
                                    variant="outline-danger" class="mr-2 mt-1"
                                    @click="showModalCancelOrderSell(item)">
                            Huỷ
                          </b-button>
                          <b-button v-show="item.status == 0 && userRole == 'admin'"
                                    variant="outline-success" class="mr-2 mt-1"
                                    @click="showModalConfirmOrderSell(item)" :disabled="confirmingOrderSell">
                            Xác nhận đơn
                          </b-button>
                          <b-button variant="outline-primary" class="mr-2 mt-1" v-show="item.status > 0"
                                    @click="openModalCreateBallot(item)">
                            Tạo phiếu
                          </b-button>
                        </div>
                      </td>
                    </tr>
                </table>
            </b-col>
          </b-row>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
        </b-card>
      </b-col>
    </b-row>

    <b-row hidden id="contentPrintPHG">
      <b-col>
        <img :src="'/static/img/project/print/quotation/header_' + this.$store.state.user.storeId + '.png'" style="width: 100%"/>
        <div style="width:100%; height:35px;" class="tr-bg">
          <div style="color: #006699; font-size: 20px; float: left; width: 70%; text-align: center; margin-top: 10px;">
            <b>PHIẾU GIAO HÀNG</b>
          </div>
          <div style="float: right;  font-size: 13px;width: 30%; margin-top: 10px; text-align: center">
            <i class="print-text-right">TP.HCM, Ngày {{today_day}} tháng {{today_month}} năm {{today_year}}</i>
          </div>
        </div>
        <div style="width:100%; font-size: 18px; text-align: right; margin-top: 5px; margin-bottom: 5px;">
          <div style="color: #006699; font-size: 18px; float: left; width: 70%; text-align: center;">

          </div>
          <div style="float: right; width: 30%; margin-top: 5px; margin-bottom: 5px; text-align: center">
            <span>Số: {{currentOrderSell.order_sell_number}}</span>
          </div>
        </div>

        <div class="custom-line-height">
          <table style="width:100%; font-size: 16px">
            <tr class="print-pl-2">
              <td style="width:25%" class="print-no-border print-pl-2 print-text-right">
                <u><b> Tên khách hàng: </b></u>
              </td>
              <td colspan="3" class="print-no-border print-text-left">
                <b><span>{{currentOrderSell.customer_name}}</span></b>
              </td>
            </tr>
            <tr>
              <td style="width:25%" class="print-no-border print-pl-2 print-text-right">Địa chỉ giao hàng: </td>
              <td colspan="3" class="print-no-border print-text-left">{{currentOrderSell.receiver_address}}</td>
            </tr>
            <tr>
              <td style="width:25%" class="print-no-border print-pl-2 print-text-right">Người nhận hàng: </td>
              <td style="width:25%" class="print-no-border print-text-left">{{currentOrderSell.receiver_name}}</td>
              <td style="width:25%" class="print-no-border print-pl-2 print-text-right">Điện thoại: </td>
              <td class="print-no-border print-text-left">{{currentOrderSell.receiver_phone}}</td>
            </tr>
            <tr>
              <td style="width:25%" class="print-no-border print-pl-2 print-text-right">Ghi chú về giao hàng: </td>
              <td colspan="3" class="print-no-border print-pl-2 print-text-left">{{currentOrderSell.shipping_note}}</td>
            </tr>
          </table>
        </div>
        <br>
        <div class="print-table-border">
          <table style="width:100%; font-size: 16px" class="custom-line-height">
            <tr class="print-text-center tr-bg" style="background-color: #eeece1">
              <th>STT</th>
              <th>MÃ SẢN PHẨM</th>
              <th>MÔ TẢ SẢN PHẨM</th>
              <th>HÃNG SX</th>
              <th>ĐVT</th>
              <th style="width:50px">SL</th>
              <th>GHI CHÚ</th>
            </tr>
            <tr v-for="(item, index) in currentOrderSell.products" :key="item.product_id">
              <td class="print-text-center">{{index + 1}}</td>
              <td>{{item.product_code ? item.product_code : item.product_code_input}}</td>
              <td>{{item.product_name ? item.product_name : item.product_name_input}}</td>
              <td class="print-text-center">{{item.brand_name ? item.brand_name : item.brand_name_input}}</td>
              <td class="print-text-center">{{item.target_unit_name ? item.target_unit_name : item.unit_name ? item.unit_name : item.unit_name_input}}</td>
              <td style="width:50px" class="print-text-center">{{currencyFormat(item.quantity)}}</td>
              <td>{{item.note}}</td>
            </tr>
            <tr>
              <td colspan="5" class="print-text-center"><b>TỔNG CỘNG</b></td>
              <td class="print-text-right"><b>{{currentOrderSell.total_quantity + ''}}</b></td>
              <td></td>
            </tr>
          </table>
          <div>
            <p style="font-size: 16px"><b>Chứng từ kèm theo:</b></p>
            <p style="font-size: 16px" class="print-pl-2">{{currentOrderSell.issue_invoice ? '&#8883; Hóa đơn GTGT' : ''}}</p>
          </div>
          <div>
            <p style="font-size: 16px"><b>Liên hệ với Nhân viên kinh doanh khi cần:</b></p>
            <p style="font-size: 16px" class="print-pl-2">&#8883; Tên: {{currentOrderSell.staff_in_charge_name}}</p>
            <p style="font-size: 16px" class="print-pl-2">&#8883; Điện thoại: {{currentOrderSell.staff_in_charge_phone}}</p>
            <p style="font-size: 16px" class="print-pl-2">&#8883; Email: {{currentOrderSell.staff_in_charge_email}}</p>
          </div>

          <br><br>
          <div>
            <table style="width:100%; font-size: 16px">
              <tr>
                <td class="print-no-border print-text-center"><b>NGƯỜI NHẬN HÀNG</b></td>
                <td class="print-no-border print-text-center"><b>NGƯỜI GIAO HÀNG</b></td>
                <td class="print-no-border print-text-center"><b>NGƯỜI LẬP PHIẾU</b></td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center" style="color: #C0C0C0">(Ký, họ tên)</td>
                <td class="print-no-border print-text-center" style="color: #C0C0C0">(Ký, họ tên)</td>
                <td class="print-no-border print-text-center" style="color: #C0C0C0">(Ký, họ tên)</td>
              </tr>
            </table>
          </div>
        </div>
      </b-col>

    </b-row>

    <!-- Modal cập nhật trạng thái hoá đơn -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-change-invoice-status">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Cập nhật trạng thái hoá đơn</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="12">
          <label> Số đơn hàng: {{currentOrderSell.order_sell_number}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Tên khách hàng: {{currentOrderSell.customer_name}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Trạng thái hiện tại: {{currentOrderSell.invoice_note}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Cập nhật thành: </label>
          <b-form-select
                id="status"
                :options="statusInvoiceOptions"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="statusInvoiceChange"></b-form-select>
        </b-col>
      </b-row>

      <b-row v-show="statusInvoiceChange == 2">
        <b-col md="12">
          <label> Ghi chú<span class="error-sybol"></span> </label>
          <b-form-textarea
                    id="invoiceNote"
                    rows="3"
                    v-model="invoice_note"
                    placeHolder="Số: 00000001 Ngày: 01/01/2000"
                  ></b-form-textarea>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalChangeInvoiceStatus">
            Quay lại
          </b-button>

          <b-button v-show="!onChangeStatus" variant="outline-primary" class="pull-right btn-width-120"
                    :disabled="onChangeStatus" @click.prevent="confirmChangeInvoiceStatus">
            Xác nhận
          </b-button>

          <span class="loading-more" v-show="onChangeStatus"><icon name="loading" width="60" /></span>
        </b-col>
      </b-row>

    </b-modal>

    <!-- Modal cập nhật ghi chú kế toán -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-change-accounting-note">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Cập nhật ghi chú kế toán</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="12">
          <label> Số đơn hàng: {{currentOrderSell.order_sell_number}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Tên khách hàng: {{currentOrderSell.customer_name}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Ghi chú kế toán: </label>
          <b-form-textarea
            id="accountingNote"
            rows="3"
            v-model="currentOrderSell.accounting_note"
          ></b-form-textarea>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalChangeAccountingNote">
            Quay lại
          </b-button>

          <b-button v-show="!onChangeStatus" variant="outline-primary" class="pull-right btn-width-120"
                    :disabled="onChangeStatus" @click.prevent="confirmChangeAccountingNote">
            Xác nhận
          </b-button>

          <span class="loading-more" v-show="onChangeStatus"><icon name="loading" width="60" /></span>
        </b-col>
      </b-row>

    </b-modal>

    <!-- Modal tạo phiếu -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-create-ballot">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Tạo phiếu</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="12">
          <label> Số đơn hàng: {{currentOrderSell.order_sell_number}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Tên khách hàng: {{currentOrderSell.customer_name}} </label>
        </b-col>
      </b-row>

      <hr>

      <b-row class="mt-1" v-show="userRole == 'admin'">
        <b-col md="4" class="mt-1" v-show="currentOrderSell.status > 0 && currentOrderSell.status < 6">
            <b-button variant="outline-primary" class="pull-left btn-width-200" @click.prevent="goToOrderBuy(currentOrderSell.id)">
              Đơn hàng nhập
            </b-button>
        </b-col>
        <b-col md="4" class="mt-1" v-show="currentOrderSell.status > 0 && currentOrderSell.status < 6">
            <b-button variant="outline-primary" class="pull-left btn-width-200" @click.prevent="goToRepoOutput(currentOrderSell.id)">
              Phiếu xuất kho
            </b-button>
        </b-col>
        <b-col md="4" class="mt-1" v-show="currentOrderSell.status > 0 && currentOrderSell.status < 6 && currentOrderSell.type == 1">
            <b-button variant="outline-primary" class="pull-left btn-width-200" @click.prevent="goToRepoOutputResource(currentOrderSell.id)">
              Phiếu xuất kho nguyên liệu
            </b-button>
        </b-col>
      </b-row>

      <b-row class="mt-1">
        <b-col md="4" class="mt-1" v-show="currentOrderSell.status > 0 && currentOrderSell.status < 7">
          <b-button v-show="!creatingPHG" variant="outline-primary" class="pull-left btn-width-200"
              @click="preparePrintPHG(currentOrderSell.id)">
            Phiếu giao hàng
          </b-button>
          <span class="loading-more" v-show="creatingPHG"><icon name="loading" width="60" /></span>
        </b-col>
        <b-col md="4" class="mt-1" v-show="currentOrderSell.status > 0 && currentOrderSell.status < 6 && userRole == 'admin'">
            <b-button variant="outline-primary" class="pull-left btn-width-200" @click.prevent="goToIncome(currentOrderSell.id)">
              Phiếu Thu
            </b-button>
        </b-col>
        <b-col md="4" class="mt-1" v-show="currentOrderSell.status > 0 && currentOrderSell.status < 7 && userRole == 'admin'">
          <b-button variant="outline-primary" class="pull-left btn-width-200" @click.prevent="goToOrderSellBack(currentOrderSell.id)">
            Phiếu trả hàng bán
          </b-button>
        </b-col>
      </b-row>

      <b-row class="mt-1" v-show="userRole == 'admin'">
        <b-col md="4" class="mt-1" v-show="currentOrderSell.status > 0">
          <b-button variant="outline-primary" class="pull-left btn-width-200" @click.prevent="goToExpendBack(currentOrderSell.id)">
            Phiếu chi trả lại tiền
          </b-button>
        </b-col>
        <b-col md="4" class="mt-1" v-show="currentOrderSell.status > 0">
          <b-button variant="outline-primary" class="pull-left btn-width-200" @click.prevent="goToExpendOrderSell(currentOrderSell.id)">
            Phiếu chi các phí của đơn hàng
          </b-button>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalCreateBallot">
            Quay lại
          </b-button>
        </b-col>
      </b-row>

    </b-modal>

    <!-- Modal xác nhận đơn hàng -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-confirm-order-sell">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Xác Nhận Đơn Hàng</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="12">
          <label> Số đơn hàng: {{currentOrderSell.order_sell_number}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Tên khách hàng: {{currentOrderSell.customer_name}} </label>
        </b-col>
      </b-row>

      <hr>
      <b-row v-if="currentProductManualInput.id">
        <b-col md="12">
          <p class="modal-title text-center text-danger">
            Có [{{product_manual_inputs.length}}] Sản phẩm chưa được khai báo trong hệ thống
          </p>
        </b-col>
      </b-row>

      <b-row v-if="currentProductManualInput.id">
        <b-col>

          <b-row class="form-row">
            <b-col md="4" class="mt-2">
              <label>Nhóm sản phẩm<span class="error-sybol"></span></label>
            </b-col>
            <b-col md="8" class="mt-2">
              <div class="input-group">
                <multiselect
                  v-model="productGroupSelect"
                  :options="productGroupOptions"
                  :select-label="''"
                  :deselect-label="''"
                  placeholder="--Chọn nhóm sản phẩm--"
                  label="name"
                  track-by="name"
                  @input="changeProductGroup">
                </multiselect>
              </div>
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="4" class="mt-2">
              <label>Loại sản phẩm<span class="error-sybol"></span></label>
            </b-col>
            <b-col md="8" class="mt-2">
              <div class="input-group">
                <multiselect
                  v-model="productTypeSelect"
                  :options="productTypeOptions"
                  :select-label="''"
                  :deselect-label="''"
                  placeholder="--Chọn loại sản phẩm--"
                  label="name"
                  track-by="name"
                  @input="changeProductType">
                </multiselect>
              </div>
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="4" class="mt-2">
              <label>Sản phẩm</label>
            </b-col>
            <b-col md="8" class="mt-2">
              <div class="input-group">
                <multiselect
                  v-model="productSelect"
                  :options="productOptions"
                  :select-label="''"
                  :deselect-label="''"
                  placeholder="-- Chọn sản phẩm --"
                  label="name_full"
                  track-by="name_full"
                  @input="changeProduct">
                </multiselect>
              </div>
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="4" class="mt-2">
              <label>Mã sản phẩm</label>
            </b-col>
            <b-col md="8" class="mt-2">
              <input
                  id="product_code_input"
                  type="text"
                  maxlength="255"
                  class="form-control"
                  autocomplete="new-password"
                  v-model="currentProductManualInput.product_code">
                <p class="text-secondary">{{currentProductManualInput.product_code_input}} (Mã SP đã nhập khi báo giá)</p>
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="4" class="mt-2">
              <label>Tên sản phẩm<span class="error-sybol"></span></label>
            </b-col>
            <b-col md="8" class="mt-2">
              <input
                  id="product_name_input"
                  type="text"
                  maxlength="255"
                  class="form-control"
                  autocomplete="new-password"
                  v-model="currentProductManualInput.product_name">
                <p class="text-secondary">
                  {{currentProductManualInput.product_name_input}} (Tên SP đã nhập khi báo giá)
                </p>
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="4" class="mt-2">
              <label>Hãng sản phẩm</label>
            </b-col>
            <b-col md="8" class="mt-2">
              <b-form-select
                  :options="productBrandOptions"
                  id="product_brand"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="currentProductManualInput.brand_id"
                  placeholder="Hãng SP"
                  @change="changeBrandInput"></b-form-select>
                <p class="text-secondary">{{currentProductManualInput.brand_name_input}} (Hãng SP đã nhập khi báo giá)</p>
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="4" class="mt-2">
              <label>Đơn vị<span class="error-sybol"></span></label>
            </b-col>
            <b-col md="8" class="mt-2">
              <b-form-select
                  :options="unitOptions"
                  id="unit"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="currentProductManualInput.unit_id"
                  @change="changeUnitInput"></b-form-select>
                <p class="text-secondary">{{currentProductManualInput.unit_name_input}} (Đơn vị đã nhập khi báo giá)</p>
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="4" class="mt-2">
              <label>Giá list</label>
            </b-col>
            <b-col md="8" class="mt-2">
              <input
                id="price_list"
                type="text"
                maxlength="14"
                autocomplete="new-password"
                class="form-control"
                v-model="currentProductManualInput.price_list">
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="4" class="mt-2">
              <label>Chiết khấu</label>
            </b-col>
            <b-col md="8" class="mt-2">
              <input
                id="discount"
                type="text"
                maxlength="14"
                autocomplete="new-password"
                class="form-control"
                v-model="currentProductManualInput.discount">
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="4" class="mt-2">
              <label>Giá bán</label>
            </b-col>
            <b-col md="8" class="mt-2">
              <input
                id="price_sell"
                type="text"
                maxlength="14"
                autocomplete="new-password"
                class="form-control"
                v-model="currentProductManualInput.price_sell">
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="12" class="mt-2 text-center">
              <b-button variant="outline-primary" class="text-center btn-width-160"
                        @click.prevent="insertProduct">
                Thêm sản phẩm
              </b-button>
            </b-col>
          </b-row>


        </b-col>
      </b-row>

      <hr v-if="currentProductManualInput.id">

      <b-row class="mt-1">
        <b-col md="12" class="mt-1 text-center">
          <b-button v-show="!confirmingOrderSell" variant="outline-success" style="height: 50px; width: 240px"
                          @click="confirmOrderSell" :disabled="confirmingOrderSell || product_manual_inputs.length > 0">
            <i class="fa fa-pencil-square-o" style="margin-right: 5px" />
            Xác Nhận Đơn Hàng
          </b-button>
          <span class="loading-more" v-show="confirmingOrderSell"><icon name="loading" width="60" /></span>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalConfirmOrderSell">
            Quay lại
          </b-button>
        </b-col>
      </b-row>

    </b-modal>

    <!-- Modal hủy đơn hàng -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-cancel-order-sell">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Hủy Đơn Hàng</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="12">
          <label> Số đơn hàng: {{currentOrderSell.order_sell_number}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Tên khách hàng: {{currentOrderSell.customer_name}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Tên khách hàng: {{currentOrderSell.customer_name}} </label>
        </b-col>
      </b-row>

      <b-row v-show="currentOrderSell.shipping_status == 0">
        <b-col md="12">
          <label> Lý do huỷ<span class="error-sybol"></span> </label>
          <b-form-textarea
            id="accountingNote"
            rows="2"
            v-model="currentOrderSell.accounting_note"
          ></b-form-textarea>
        </b-col>
      </b-row>

      <hr>

      <b-row class="mt-1">
        <b-col md="12" class="mt-1 text-center" v-if="currentOrderSell.shipping_status == 0">
          <b-button v-show="!cancelingOrderSell" variant="outline-danger" style="height: 50px; width: 240px"
                          @click="cancelOrderSell" :disabled="cancelingOrderSell">
            <i class="fa fa-pencil-square-o" style="margin-right: 5px" />
            Hủy Đơn Hàng
          </b-button>
          <span class="loading-more" v-show="cancelingOrderSell"><icon name="loading" width="60" /></span>
        </b-col>

        <b-col md="12" class="mt-1 text-center" v-if="currentOrderSell.shipping_status != 0">
          <span class="text-danger">Chỉ có thể hủy khi đơn hàng chưa giao!</span>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalCancelOrderSell">
            Quay lại
          </b-button>
        </b-col>
      </b-row>

    </b-modal>

    <!--Modal chi tiết thanh toán-->
    <b-modal centered hide-footer hide-header size="xl" id="modal-list-income">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">{{title_modal_income_expend_list}}</h4>
        </b-col>
      </b-row>
      <hr>
      <span class="loading-more" v-show="loadingIncome"><icon name="loading" width="60" /></span>

      <b-row class="mt-2">
        <b-col>
          <b-table
            hover
            bordered
            stacked="md"
            :fields="incomeFields"
            :items="incomeItems">
            <template v-slot:cell(amount)="data">
              {{ currencyFormat(data.item.amount) }}
            </template>
          </b-table>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-danger" class="pull-right btn-width-120"
                    @click.prevent="hideModalDetailPayment">
            Đóng
          </b-button>
        </b-col>
      </b-row>

    </b-modal>

  </div>
</template>
<script>
import orderSellApi from '@/api/orderSell'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'


export default {
  components: {
    Datepicker,
    Multiselect
  },
  data () {
    return {
      timeOptions: [
        {"value": 1, "text": 'Ngày'},
        {"value": 2, "text": 'Tháng'},
        {"value": 3, "text": 'Quý'},
        {"value": 4, "text": 'Năm'},
        {"value": 5, "text": 'Tất cả'}
      ],
      yearOptions: [],
      quarterOptions: [
          {"value": 1, "text": 'Quý 1'},
          {"value": 2, "text": 'Quý 2'},
          {"value": 3, "text": 'Quý 3'},
          {"value": 4, "text": 'Quý 4'}
      ],
      monthOptions: [
          {"value": 1, "text": 'Tháng 1'},
          {"value": 2, "text": 'Tháng 2'},
          {"value": 3, "text": 'Tháng 3'},
          {"value": 4, "text": 'Tháng 4'},
          {"value": 5, "text": 'Tháng 5'},
          {"value": 6, "text": 'Tháng 6'},
          {"value": 7, "text": 'Tháng 7'},
          {"value": 8, "text": 'Tháng 8'},
          {"value": 9, "text": 'Tháng 9'},
          {"value": 10, "text": 'Tháng 10'},
          {"value": 11, "text": 'Tháng 11'},
          {"value": 12, "text": 'Tháng 12'}
      ],
      time_option: 1,
      year_input: 2023,
      quarter_input: 1,
      month_input: 1,
      statusOptions: [
        {"value": null, "text": 'Tất cả'},
        {"value": -1, "text": 'Đơn lưu nháp'},
        {"value": 0, "text": 'Đơn chờ xác nhận'},
        {"value": 1, "text": 'Đơn đang thực hiện'},
        {"value": 6, "text": 'Đơn hoàn thành'},
        {"value": 7, "text": 'Đơn đã hủy'},
      ],
      paymentStatusOptions: [
        {"value": null, "text": 'Tất cả'},
        {"value": 1, "text": 'Đã giao hàng - chưa thanh toán'},
        {"value": 2, "text": 'Chưa giao hàng - đã thanh toán'},
        {"value": 3, "text": 'Chưa giao hàng - chưa thanh toán'}
      ],
      invoiceStatusOptions: [
        {"value": null, "text": 'Tất cả'},
        {"value": 0, "text": 'Không xuất HD'},
        {"value": 1, "text": 'Chưa xuất HD'},
        {"value": 2, "text": 'Đã xuất HD'}
      ],
      statusInvoiceOptions: [
        {"value": 0, "text": 'Không xuất HD'},
        {"value": 1, "text": 'Chưa xuất HD'},
        {"value": 2, "text": 'Đã xuất HD'}
      ],
      staffOptions: [],
      customerOptions: [],
      loadingOptions: false,
      inputs: {
        status: null,
        payment_status: null,
        staff_in_charge: null,
        related_number: null,
        order_sell_number: null,
        invoice_status: null,
        invoice_note: null,
        customer: null,
        from_date: '2000-01-01',
        to_date: '2000-01-02'
      },
      items: [],
      currentOrderSell: {},
      statusInvoiceChange: null,
      invoice_note: null,
      onChangeStatus: false,
      loadByScroll: false,
      onSearch: false,
      hasNext: true,
      loading: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      totalRow: 0,
      userRole: "admin",
      scope: "all",
      excel_items: [],
      excel_fields: {
        'STT': 'stt',
        'Số đơn hàng bán': 'order_sell_number',
        'Các phiếu liên quan': 'ballots',
        'Nhân viên phụ trách': 'staff_on_charge_name',
        'Tình trạng của đơn' : 'status_str',
        'Tên khách hàng' : 'customer_name',
        'Tổng giá trị của đơn đặt hàng (Gồm VAT)' : 'total',
        'Xuất VAT' : 'issue_invoice',
        'Hình thức thanh toán' : 'payment_method',
        'Số tiền còn phải thanh toán' : 'total_remaining',
        'Chi phí bán hàng' : 'expend_order_sell',
        'Tình trạng kho' : 'repo_status_str',
        // 'Thời gian dự kiến giao hàng' : 'shipping_date',
        'Ghi chú kinh doanh' : 'shipping_note',
        'Trạng thái giao hàng' : 'shipping_status_str',
        'Trạng thái hóa đơn' : 'invoice_note',
        'Trạng thái trả hàng' : 'product_back_status_str',
        'Ghi chú về kế toán' : 'accounting_note'
      },
      isGetExcelItems: false,
      // ballotType: null,
      creatingPHG: false,
      today_day: "",
      today_month: "",
      today_year: "",
      confirmingOrderSell: false,
      cancelingOrderSell: false,
      product_manual_inputs: [],
      currentProductManualInput: {},
      productGroupSelect: {},
      productGroupOptions:[],
      productTypeSelect:{},
      productTypeOptions:[],
      productTypeOptionStore: [],
      productSelect: {},
      productOptions: [],
      productOptionStore: [],
      unitOptions:[],
      productBrandOptions:[],
      insertingProduct: false,
      title_modal_income_expend_list: "Danh Sách Thu Tiền",
      incomeFields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'created_at',
          label: 'Ngày'
        },
        {
          key: 'fund_number',
          label: 'Số phiếu'
        },
        {
          key: 'amount',
          label: 'Số tiền'
        },
        {
          key: 'bank_account_info',
          label: 'Sổ thu chi'
        },
        {
          key: 'description',
          label: 'Nội dung'
        }
      ],
      incomeItems: [],
      loadingIncome: false,
    }
  },
  mounted() {
    // UI by staff
    let url = location.href
    if(url.includes("order-sell-staff")) {
      this.userRole = "staff"
      this.scope = "staff"
    } else {
        this.userRole = "admin"
    }

    // Get today day, month, year
    let dateNow = new Date()
    this.today_day = dateNow.getDate()
    this.today_month = dateNow.getMonth() + 1
    this.today_year = dateNow.getFullYear()

    // Get default from date and to date
    this.prepareDateInput()

    window.addEventListener('scroll', this.onScroll)

    this.getOptionsRelated()

    // // Get staff list option
    // this.getOptionStaff()
    //
    // this.getCustomerOption()

    // Search
    this.prepareToSearch()

    // Get danh sách các option liên quan product
    this.getOptionRelatedProduct()
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
     * Scroll event
     */
    onScroll (event) {
      if(this.onSearch) {
        return
      }
      event.preventDefault()
      var body = document.body
      var html = document.documentElement
      if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if(this.hasNext) {
          this.offset = this.offset + 10
          this.loadByScroll = true
          this.search()
        }
      }
    },

      prepareDateInput() {
        let dateNow = new Date()
        this.inputs.to_date = dateNow.toJSON().slice(0,10)
        this.inputs.from_date = new Date(dateNow.setDate(dateNow.getDate() - 7))
        this.year_input = dateNow.getFullYear()

          let currentYear = dateNow.getFullYear()
          this.yearOptions = []
          for (let i = currentYear; i > currentYear - 10; i--) {
              this.yearOptions.push({value: i, text: i})
          }

          this.month_input = dateNow.getMonth() + 1
      },

    /**
     *  Get customer options
     */
    getOptionsRelated() {
      console.log("this.userRole: " + this.userRole)
        this.loadingOptions = true
        let params = {}
        if(this.userRole == "staff") {
          params.customer_by_staff = true
        } else {
          params.customer_by_admin = true
          params.staffs = true
        }

      orderSellApi.getOptionForOrderSellList(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {

          this.customerOptions = res.data.data.customers
          let itemEmpty = {"id": null, "name": '-- Tất cả --'}
          this.customerOptions.unshift(itemEmpty)

          this.staffOptions = res.data.data.staffs
          let itemStaffEmpty = {"id": null, "name": '-- Tất cả --'}
          this.staffOptions.unshift(itemStaffEmpty)
        }

        this.loadingOptions = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loadingOptions = false
      })
    },

    //   /**
    //  * Get staff options
    //  */
    // getOptionStaff() {
    //     console.log("this.userRole: " + this.userRole)
    //     if(this.userRole == "staff") {
    //         return
    //     }
    //
    //   customerApi.getStaffOptions().then(res => {
    //     if(res != null && res.data != null && res.data.data != null) {
    //       this.optionsStaff = [{value: null, text: ''}]
    //
    //       var staffs = res.data.data
    //       if(staffs) {
    //         for (let i in staffs) {
    //           this.optionsStaff.push(staffs[i])
    //         }
    //       }
    //     }
    //   })
    // },

    /**
     * Get staff options
     */
    getOptionRelatedProduct() {
      orderSellApi.getOptionRelatedProduct().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          // Product group
          this.productGroupOptions = options.product_groups
          this.productGroupOptions.unshift({id: null, name: '-- Chọn nhóm SP --'})

          // Product type
          this.productTypeOptionStore = JSON.parse(JSON.stringify(options.product_types))
          this.productTypeOptions = JSON.parse(JSON.stringify(options.product_types))
          this.productTypeOptions.unshift({id: null, name: '-- Chọn loại SP --', product_group_id: null})

          // Product
          this.productOptionStore = JSON.parse(JSON.stringify(options.products))
          this.productOptions = JSON.parse(JSON.stringify(options.products))
          this.productOptions.unshift({id: null, name: '', name_full: '-- Chọn SP --'})

          // Đơn vị
          this.unitOptions = [{value: null, text: '-- Đơn vị --'}]
          let units = options.units
          if(units) {
            for (let i in units) {
              let item = {value: units[i].id, text: units[i].name}
              this.unitOptions.push(item)
            }
          }

          // Brands
          this.productBrandOptions = [{value: null, text: '-- Hãng sản phẩm --'}]
          let productBrands = options.brands
          if(productBrands) {
            for (let i in productBrands) {
              let item = {value: productBrands[i].id, text: productBrands[i].name}
              this.productBrandOptions.push(item)
            }
          }

        }
      })
    },

    //   /**
    //  *  Get customer options
    //  */
    // getCustomerOption() {
    //     console.log("this.userRole: " + this.userRole)
    //       this.loadingCustomer = true
    //
    //   customerApi.getAllCustomer(this.userRole).then(res => {
    //     if(res != null && res.data != null && res.data.data != null) {
    //       this.customerOptionStore = res.data.data;
    //
    //       let itemEmpty = {"id": null, "name": '-- Tất cả --'}
    //       this.customerOptionStore.unshift(itemEmpty)
    //
    //       // this.getCustomerItemById(this.inputs.customer_id)
    //     }
    //
    //     this.loadingCustomer = false
    //   })
    // },

    showModalChangeAccountingNote(order_sell) {
      this.currentOrderSell = order_sell
      this.$bvModal.show('modal-change-accounting-note')
    },

    hideModalChangeAccountingNote() {
      this.$bvModal.hide('modal-change-accounting-note')
    },

    confirmChangeAccountingNote() {
      // this.click = true
      if (this.onChangeStatus) { return }

      this.onChangeStatus = true
      let params = {
        "order_sell_id": this.currentOrderSell.id,
        "accounting_note": this.currentOrderSell.accounting_note
      }
      console.log("this.userRole: " + this.userRole)
      orderSellApi.updateAccountingNote(params, this.userRole).then(res => {
        if (res != null && res.data != null) {
          this.$bvModal.hide('modal-change-accounting-note')

          // Cập nhật ghi chú kế toán
          for(let item of this.items) {
            if(item.id == this.currentOrderSell.id) {
              item.accounting_note = this.currentOrderSell.accounting_note
              break
            }
          }
        }
        this.onChangeStatus = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onChangeStatus = false
      })
    },

    async checkProductManualInput(order_sell_id) {
        let result = []
        await orderSellApi.checkProductManualInput(order_sell_id).then(res => {
          if (res != null && res.data != null) {
            result = res.data.data
          }
        }).catch(err => {
          result = []
        })
        return result
    },

    async showModalConfirmOrderSell(order_sell) {
        this.confirmingOrderSell = true

      this.product_manual_inputs = []
      this.currentProductManualInput = {}
      this.currentOrderSell = order_sell

        await orderSellApi.checkProductManualInput(order_sell.id).then(res => {
          if (res != null && res.data != null) {
            this.product_manual_inputs = res.data.data
            if(this.product_manual_inputs.length > 0) {
              this.currentProductManualInput = this.product_manual_inputs[0]

              this.currentProductManualInput.product_code = this.currentProductManualInput.product_code_input
              this.currentProductManualInput.product_name = this.currentProductManualInput.product_name_input
              this.currentProductManualInput.brand_id = this.currentProductManualInput.brand_id_input
              this.currentProductManualInput.brand_name = this.currentProductManualInput.brand_name_input
              this.currentProductManualInput.unit_id = this.currentProductManualInput.unit_id_input
              this.currentProductManualInput.unit_name = this.currentProductManualInput.unit_name_input
            }
            this.confirmingOrderSell = false
            this.$bvModal.show('modal-confirm-order-sell')
          }
        }).catch(err => {
            this.confirmingOrderSell = false
            this.$bvModal.show('modal-confirm-order-sell')
        })
    },

    hideModalConfirmOrderSell() {
      this.$bvModal.hide('modal-confirm-order-sell')
    },

    confirmOrderSell() {
      // this.click = true
      if (this.confirmingOrderSell) { return }

      this.confirmingOrderSell = true
      let params = {
        "order_sell_id": this.currentOrderSell.id,
        "status_old": this.currentOrderSell.status,
        "status_new": 1,
        "accounting_note": this.currentOrderSell.accounting_note
      }
      console.log("this.userRole: " + this.userRole)
      orderSellApi.updateOrderSellStatus(params, this.userRole).then(res => {
        if (res != null && res.data != null) {
          this.$bvModal.hide('modal-confirm-order-sell')

            this.search()

          // // Cập nhật ghi chú kế toán
          // for(let item of this.items) {
          //   if(item.id == this.currentOrderSell.id) {
          //     item.status = 1
          //     item.status_str = 'Đơn đang thực hiện'
          //     break
          //   }
          // }
        }
        this.confirmingOrderSell = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.confirmingOrderSell = false
      })
    },

    showModalCancelOrderSell(order_sell) {
      this.currentOrderSell = order_sell
      this.$bvModal.show('modal-cancel-order-sell')
    },

    hideModalCancelOrderSell() {
      this.$bvModal.hide('modal-cancel-order-sell')
    },

    cancelOrderSell() {
      // this.click = true
      if (this.cancelingOrderSell) { return }

      if(!this.currentOrderSell.accounting_note) {
        this.popToast('danger', "[Lý do huỷ*] là mục bắt buộc nhập")
        return
      }

      this.cancelingOrderSell = true
      let params = {
        "order_sell_id": this.currentOrderSell.id,
        "status_old": this.currentOrderSell.status,
        "status_new": 7,
        "accounting_note": this.currentOrderSell.accounting_note
      }
      console.log("this.userRole: " + this.userRole)
      orderSellApi.updateOrderSellStatus(params, this.userRole).then(res => {
        if (res != null && res.data != null) {
          this.$bvModal.hide('modal-cancel-order-sell')

            this.search()

          // Cập nhật ghi chú kế toán
          // for(let item of this.items) {
          //   if(item.id == this.currentOrderSell.id) {
          //     item.status = 7
          //     item.status_str = 'Đơn đã hủy'
          //     item.accounting_note = this.currentOrderSell.accounting_note
          //     break
          //   }
          // }
        }
        this.cancelingOrderSell = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.cancelingOrderSell = false
      })
    },

    openModalCreateBallot(order_sell) {
      this.currentOrderSell = order_sell
      this.$bvModal.show('modal-create-ballot')
    },

    hideModalCreateBallot() {
      this.$bvModal.hide('modal-create-ballot')
    },

    showModalChangeInvoiceStatus(order_sell) {
      this.currentOrderSell = order_sell
      this.$bvModal.show('modal-change-invoice-status')
    },

    hideModalChangeInvoiceStatus() {
      this.$bvModal.hide('modal-change-invoice-status')
    },


    confirmChangeInvoiceStatus() {
      // this.click = true
      if (this.onChangeStatus) { return }

      if(this.statusInvoiceChange == this.currentOrderSell.invoice_status) {
        return
      }

      if(this.statusInvoiceChange == 2 && !this.invoice_note) {
        this.popToast('danger', "[Ghi chú*] Là mục bắt buộc nhập")
        return
      }

      this.onChangeStatus = true
      let params = {
        "order_sell_id": this.currentOrderSell.id,
        "status_old": this.currentOrderSell.invoice_status,
        "status_new": this.statusInvoiceChange,
        "invoice_note": this.invoice_note
      }
      console.log("this.userRole: " + this.userRole)
      orderSellApi.updateInvoiceStatus(params, this.userRole).then(res => {
        if (res != null && res.data != null) {
          this.$bvModal.hide('modal-change-invoice-status')

          // Cập nhật trạng thái hoá đơn
          for(let item of this.items) {
            if(item.id == this.currentOrderSell.id) {
              item.invoice_status = this.statusInvoiceChange
                if(this.statusInvoiceChange == 0) {
                    item.invoice_note = "Không xuất HD"
                }
                if(this.statusInvoiceChange == 1) {
                    item.invoice_note = "Chưa xuất HD"
                }
                if(this.statusInvoiceChange == 2) {
                    item.invoice_note = "Đã xuất HD: " + this.invoice_note
                }

              break
            }
          }
        }
        this.onChangeStatus = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onChangeStatus = false
      })
    },

      /**
       * Go to add
       */
      goToAdd() {
          console.log("this.userRole: " + this.userRole)
          if(this.userRole == "staff") {
              this.$router.push('/order-sell-staff/index')
          } else {
              this.$router.push('/order-sell-all/index')
          }
      },

      /**
       * Go to detail
       */
      goToDetail(id) {
        this.$router.push('/quotation-detail/' + id)
      },

        /**
       * Go to update
       */
      goToUpdate(id) {
          console.log("this.userRole: " + this.userRole)
          if(this.userRole == "admin") {
              this.$router.push('/order-sell-all/index/' + id)
          } else {
              this.$router.push('/order-sell-staff/index/' + id)
          }
      },

      showModalUpdateQuotationStatus(quotation) {
          this.currentQuotation = quotation
          this.$bvModal.show('modal-change-quotation-status')
      },

    goToOrderBuy(id) {
        this.$bvModal.hide('modal-create-ballot')
        window.open('/order-buy-from-order-sell/' + id, '_blank');
    },
    goToIncome(id) {
        this.$bvModal.hide('modal-create-ballot')
        window.open('/income-from-order-sell/' + id, '_blank');
    },
    goToExpendBack(id) {
        this.$bvModal.hide('modal-create-ballot')
        window.open('/expend-from-money-back/' + id, '_blank');
    },
    goToExpendOrderSell(id) {
        this.$bvModal.hide('modal-create-ballot')
        window.open('/expend-from-order-sell/' + id, '_blank');
    },
    goToOrderSellBack(id) {
        this.$bvModal.hide('modal-create-ballot')
        window.open('/order-sell-back/' + id, '_blank');
    },
    goToRepoInput(id) {
        this.$bvModal.hide('modal-create-ballot')
        window.open('/order-buy-from-order-sell/' + id, '_blank');
    },
    goToRepoOutput(id) {
        this.$bvModal.hide('modal-create-ballot')
        window.open('/repository-from-order-sell/' + id, '_blank');
    },
    goToRepoOutputResource(id) {
        this.$bvModal.hide('modal-create-ballot')
        window.open('/repository-from-order-sell/' + id + '?code=only_resource', '_blank');
    },

    async preparePrintPHG() {
      if(this.currentOrderSell && this.currentOrderSell.id) {
        this.$bvModal.hide('modal-create-ballot')

        this.creatingPHG = true
        await this.getOrderSellDetail(this.currentOrderSell.id)

        this.creatingPHG = false
        this.printPHG()
      }
    },

    /**
     * In phiếu PHG
     */
    printPHG() {
      var mywindow = window.open('', 'PRINT', 'height=900,width=1200');

      mywindow.document.write('<html><head><title> </title><style>');
      mywindow.document.write(' body {font-size: 14px;} ');
      mywindow.document.write(' .print-text-center {text-align: center;} ');
      mywindow.document.write(' .print-text-left {text-align: left;} ');
      mywindow.document.write(' .print-text-right {text-align: right;} ');
      mywindow.document.write(' .print-width-50-left {width: 48%; float: left;} ');
      mywindow.document.write(' .print-width-50-right {width: 48%; float: right;} ');
      mywindow.document.write(' .print-border {border: gray solid 0.5px;} ');
      mywindow.document.write(' .print-pl-2 {padding-left: 10px;} ');
      mywindow.document.write(' .print-table-border > table, th, td {border: gray solid 0.1px; border-collapse: collapse;} ');
      mywindow.document.write(' .print-border {border: gray solid 0.1px; border-collapse: collapse;} ');
      mywindow.document.write(' .print-no-border {border: none;} ');
      mywindow.document.write(' .tr-bg {background-color: #eeece1 !important; print-color-adjust: exact; -webkit-print-color-adjust: exact;} ');
      mywindow.document.write(' .custom-line-height tr { line-height: 25px; } ');

      mywindow.document.write('</style></head><body >');
      mywindow.document.write(document.getElementById('contentPrintPHG').innerHTML);
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

    async getOrderSellDetail(id) {
      console.log("user role: " + this.userRole)
      await orderSellApi.getOrderSellDetail(id, this.userRole).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.currentOrderSell =  res.data.data
        } else {
          this.currentOrderSell = {}
        }
      }).catch(err => {
        this.currentOrderSell =  {}
      })
    },

    /**
     * Prepare to search
     */
    prepareToSearch() {
      this.offset = 0
      this.items = []
      this.hasNext = true
      this.isGetExcelItems = false

      this.search()
    },

    confirmChangeStatus() {
      // this.click = true
      if (this.onChangeStatus) { return }

      if(this.statusChange == this.currentQuotation.status) {
          return
      }

      this.onChangeStatus = true
      let params = {
        "quotation_id": this.currentQuotation.id,
        "status_old": this.currentQuotation.status,
        "status_new": this.statusChange,
        "reason_falling_note": this.reason_falling_note
      }
      console.log("this.userRole: " + this.userRole)
      quotationApi.updateQuotationStatus(params, this.userRole).then(res => {
        if (res != null && res.data != null) {
            this.$bvModal.hide('modal-change-quotation-status')
            this.prepareToSearch()
        }
        this.onChangeStatus = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onChangeStatus = false
      })
    },

    handleBallot(items, is_excel_item) {
      if(!is_excel_item) {
        // Handle data: gắn link cho từng đơn hàng bán
        for (let item of items) {
          // Remove duplicate in repo_status_str
          if(item.order_buy_invoice_notes) {
            let invoice_notes = Array.from(new Set(item.order_buy_invoice_notes.split(','))).toString()
            if(invoice_notes) {
              item.repo_status_str = item.repo_status_str + ' | ' + invoice_notes
            }
          }

          let ballots = []

          // Hanlde báo giá
          if(item.quotation_numbers) {
            let list_quotation = item.quotation_numbers.split(",")

            let item_quotation_checkeds = []
            for(let quotation of list_quotation) {
              let strs = quotation.split("::")
              let quotation_id = strs.length == 2 ? strs[0] : -1
              if(quotation_id && !item_quotation_checkeds.includes(quotation_id)) {
                item_quotation_checkeds.push(quotation_id)

                let quotation_number = strs.length == 2 ? strs[1] : ''
                let quotation_item = "<a href='/quotation-all/detail/" + quotation_id + "' target='_blank' title='Chi tiết báo giá'>" + quotation_number + "</a>"
                ballots.push(quotation_item)
              }
            }
          }
          let have_ballot = false

          // Hanlde đơn hàng nhap
          if(item.order_buy_numbers) {
            let list_order_buy = item.order_buy_numbers.split(",")

            let item_order_buy_checkeds = []
            for(let order_buy of list_order_buy) {
              let strs = order_buy.split("::")
              let order_buy_id = strs.length == 2 ? strs[0] : -1
              if(order_buy_id && !item_order_buy_checkeds.includes(order_buy_id)) {
                item_order_buy_checkeds.push(order_buy_id)

                let order_buy_number = strs.length == 2 ? strs[1] : ''
                let order_buy_item = "<a href='/order-buy/detail/" + order_buy_id + "' target='_blank' title='Chi tiết đơn hàng nhập'>" + order_buy_number + "</a>"
                ballots.push(order_buy_item)
                have_ballot = true
              }
            }
          }

          // Hanlde liên quan kho
          if(item.repo_numbers) {
            let list_repo = item.repo_numbers.split(",")

            let item_repo_checkeds = []
            for(let repo of list_repo) {
              let strs = repo.split("::")
              let repo_id = strs.length == 2 ? strs[0] : -1
              if(repo_id && !item_repo_checkeds.includes(repo_id)) {
                item_repo_checkeds.push(repo_id)

                let repo_number = strs.length == 2 ? strs[1] : ''
                let repo_item = "<label title='Xuất/nhập kho'>" + repo_number + "</label>"
                ballots.push(repo_item)
                have_ballot = true
              }

            }
          }

          // Hanlde quỹ
          if(item.fund_numbers) {
            let list_fund = item.fund_numbers.split(",")

            let item_fund_checkeds = []
            for(let fund of list_fund) {
              let strs = fund.split("::")
              let fund_id = strs.length == 2 ? strs[0] : -1
              if(fund_id && !item_fund_checkeds.includes(fund_id)) {
                item_fund_checkeds.push(fund_id)

                let fund_number = strs.length == 2 ? strs[1] : ''
                let fund_item = "<a href='/fund-history-detail/" + fund_id + "' target='_blank' title='Chi tiết phiếu thu-chi'>" + fund_number + "</a>"

                ballots.push(fund_item)
                have_ballot = true
              }
            }
          }

          item.ballots = ballots

          // Check can delete
          let can_delete = false
          if(item.status == 7) {
            if(ballots.length == 0 || !have_ballot) {
              can_delete = true
            }
          }
          item.can_delete = can_delete
        }
      } else {
        // Handle data: gắn link cho từng đơn hàng bán
        for (let item of items) {
          // Remove duplicate in repo_status_str
          if(item.order_buy_invoice_notes) {
            let invoice_notes = Array.from(new Set(item.order_buy_invoice_notes.split(','))).toString()
            if(invoice_notes) {
              item.repo_status_str = item.repo_status_str + ' | ' + invoice_notes
            }
          }

          let ballots = ""

          if(item.quotation_numbers) {
            let list_quotation = item.quotation_numbers.split(",")

            let item_quotation_checkeds = []
            for(let quotation of list_quotation) {
              let strs = quotation.split("::")
              let quotation_number = strs.length == 2 ? strs[1] : ''
              if(quotation_number && !item_quotation_checkeds.includes(quotation_number)) {
                item_quotation_checkeds.push(quotation_number)
                ballots += quotation_number + " | "
              }
            }
          }

          // Hanlde đơn hàng bán
          if(item.order_buy_numbers) {
            let list_order_buy = item.order_buy_numbers.split(",")

            let item_order_buy_checkeds = []
            for(let order_buy of list_order_buy) {
              let strs = order_buy.split("::")
              let order_buy_number = strs.length == 2 ? strs[1] : ''

              if(order_buy_number && !item_order_buy_checkeds.includes(order_buy_number)) {
                item_order_buy_checkeds.push(order_buy_number)
                ballots += order_buy_number + " | "
              }

            }
          }

          // Hanlde liên quan kho
          if(item.repo_numbers) {
            let list_repo = item.repo_numbers.split(",")

            let item_repo_checkeds = []
            for(let repo of list_repo) {
              let strs = repo.split("::")
              let repo_number = strs.length == 2 ? strs[1] : ''
              if(repo_number && !item_repo_checkeds.includes(repo_number)) {
                item_repo_checkeds.push(repo_number)
                ballots += repo_number + " | "
              }
            }
          }

          // Hanlde quỹ
          if(item.fund_numbers) {
            let list_fund = item.fund_numbers.split(",")

            let item_fund_checkeds = []
            for(let fund of list_fund) {
              let strs = fund.split("::")
              let fund_number = strs.length == 2 ? strs[1] : ''
              if(fund_number && !item_fund_checkeds.includes(fund_number)) {
                item_fund_checkeds.push(fund_number)
                ballots += fund_number + " | "
              }
            }
          }

          item.ballots = ballots
        }
      }

      return items
    },

    /**
     * Search
     */
    search () {
      if (this.onSearch) { return }

      this.onSearch = true
        this.loading = true

        let fromDate = this.inputs.from_date
        let toDate = this.inputs.to_date

        // Handle fromDate, toDate
        if(this.time_option == 2) {
          fromDate = this.year_input + '-' + this.month_input + '-01'
          toDate = this.year_input + '-' + this.month_input + '-' + new Date(this.year_input, this.month_input, 0).getDate()
        }
        if(this.time_option == 3) {
            let quarter = commonFunc.getMonthByQuarter(this.quarter_input)
          fromDate = this.year_input + '-' + quarter + '-01'
          toDate = this.year_input + '-' + (quarter + 2) + '-' + new Date(this.year_input, (quarter + 2), 0).getDate()
        }
        if(this.time_option == 4) {
          fromDate = this.year_input + '-01-01'
          toDate = this.year_input + '-12-' + new Date(this.year_input, 12, 0).getDate()
        }
        if(this.time_option == 5) {
          toDate = new Date().toJSON().slice(0,10)
          fromDate = '2000-01-01'
        }

      let params = {
        "staff_in_charge": this.inputs.staff_in_charge ? this.inputs.staff_in_charge.id : null,
        "status": this.inputs.status,
        "payment_status": this.inputs.payment_status,
        "order_sell_number": this.inputs.order_sell_number,
        "related_number": this.inputs.related_number,
        "invoice_status": this.inputs.invoice_status,
        "invoice_note": this.inputs.invoice_note,
        "customer_id": this.inputs.customer ? this.inputs.customer.id : null,
        "from_date": fromDate,
        "to_date": toDate,
        "limit": this.pageLimit,
        "offset": this.offset
      }
      console.log("this.userRole: " + this.userRole)
      orderSellApi.searchOrderSell(params, this.userRole).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.order_sells
          this.totalRow = res.data.data.total_row

          // Handle data: gắn link cho từng đơn hàng bán
          it = this.handleBallot(it, false)

          // Update items
          if(this.loadByScroll) {
            let temp = this.items
            var newArray = temp.concat(it)
            this.items = newArray
          } else {
            this.items = it
          }
          this.loadByScroll = false

          // Check has next
          if(this.offset + this.pageLimit >= res.data.data.total_row) {
            this.hasNext = false
          }

          if(!this.isGetExcelItems) {
            this.getExcelItem(params)
          }
        } else {
          this.items = []
          this.excel_items = []
        }
        this.onSearch = false
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onSearch = false
        this.loading = false
      })
    },

    getExcelItem(params) {
      if(this.isGetExcelItems) {
        return;
      }

      this.excel_items = []

      // Define params
      params.limit = 999999

      console.log("this.userRole: " + this.userRole)

      // Search
      orderSellApi.searchOrderSell(params, this.userRole).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          let order_sells = res.data.data.order_sells
          order_sells = this.handleBallot(order_sells, true)
          this.excel_items = order_sells
          this.isGetExcelItems = true
        }
      }).catch(err => {})
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

    /**
     * Delete
     */
    deleteOrderSellAfterCancel(id, name) {
      console.log("this.userRole: " + this.userRole)
      if(this.userRole == 'staff') {
        this.popToast('danger', "Bạn không được quyền thực hiện chức năng này!")
        return
      }
      if(id) {
        this.$bvModal.msgBoxConfirm('Xóa đơn hàng của K.H [' + name + "]. Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if (res) {

            orderSellApi.deleteOrderSellAfterCancel(id, this.userRole).then(res => {
                if (res != null && res.data != null && res.data.status == 200) {
                    this.prepareToSearch()
                }

            }).catch(err => {
              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.popToast('danger', errorMess)
            })
          }
        })
      }
    },

      /**
     * Delete
     */
    deleteOrderSell(id, name) {
      console.log("this.userRole: " + this.userRole)
      if(this.userRole == 'staff') {
        this.popToast('danger', "Bạn không được quyền thực hiện chức năng này!")
        return
      }
      if(id) {
        this.$bvModal.msgBoxConfirm('Xóa đơn hàng của K.H [' + name + "]. Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if (res) {

            orderSellApi.deleteOrderSell(id, this.userRole).then(res => {
                if (res != null && res.data != null) {
                    this.prepareToSearch()
                }

            }).catch(err => {
              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.popToast('danger', errorMess)
            })
          }
        })
      }
    },

    resetListProductType() {
      this.productTypeOptions = JSON.parse(JSON.stringify(this.productTypeOptionStore))

      if(this.productTypeOptions.length > 0) {
        this.productTypeOptions.unshift({id: null, name: '-- Chọn loại SP --', product_group_id: null})
      }
      this.productTypeSelect = this.productTypeOptions[0]

      this.resetListProduct()
    },

    /**
     *  Event change product group
     */
    changeProductGroup() {
      if(this.productGroupSelect && this.productGroupSelect.id) {
        this.currentProductManualInput.product_group_id = this.productGroupSelect.id
        this.currentProductManualInput.product_group_name = this.productGroupSelect.name

        // Reload list type by group
        this.productTypeOptions = []
        for (let i in this.productTypeOptionStore) {
          if(this.currentProductManualInput.product_group_id == this.productTypeOptionStore[i].product_group_id) {
            // let item = {id: this.productTypeOptionStore[i].value, name: this.productTypeOptionStore[i].text}
            this.productTypeOptions.push(this.productTypeOptionStore[i])
          }
        }
        if(this.productTypeOptions.length > 0) {
          let itemEmpty = JSON.parse(JSON.stringify(this.productTypeOptions[0]))
          itemEmpty.id = null
          itemEmpty.name = ""
          this.productTypeOptions.unshift(itemEmpty)
        }
      } else {
        this.currentProductManualInput.product_group_id = null
          this.currentProductManualInput.product_group_name = null

        this.resetListProductType()
      }

      console.log("zzzzzzzzzz")
      console.log(JSON.stringify(this.productTypeOptions))

      // Reset child item
      this.productTypeSelect = {}
      this.currentProductManualInput.product_type_id = null
      this.currentProductManualInput.product_type_name = null

      this.productSelect = {}
      this.currentProductManualInput.product_id = null
      this.currentProductManualInput.product_code = this.currentProductManualInput.product_code_input
      this.currentProductManualInput.product_name = this.currentProductManualInput.product_name_input
      this.currentProductManualInput.price_list = null
      this.currentProductManualInput.discount = null
      this.currentProductManualInput.price_sell = null
    },

    resetListProduct() {
      this.productOptions = JSON.parse(JSON.stringify(this.productOptionStore))

      if(this.productOptions.length > 0) {
        let itemEmpty = JSON.parse(JSON.stringify(this.productOptions[0]))
        itemEmpty.id = null
        itemEmpty.name = ""
        itemEmpty.name_full = "-- Chọn sản phẩm --"
        this.productOptions.unshift(itemEmpty)
      }
      this.productSelect = this.productOptions[0]
    },

    /**
     *  Event change product type
     */
    changeProductType() {
      if(this.productTypeSelect && this.productTypeSelect.id) {
        this.currentProductManualInput.product_type_id = this.productTypeSelect.id
        if(this.productTypeSelect.product_group_id != this.productGroupSelect.id) {
          this.getProductGroupSelectById(this.productTypeSelect.product_group_id)
        }

        // Reload list product by type
        this.productOptions = []
        for (let i in this.productOptionStore) {
          if(this.currentProductManualInput.product_type_id == this.productOptionStore[i].product_type_id) {
            this.productOptions.push(this.productOptionStore[i])
          }
        }
        if(this.productOptions.length > 0) {
          let itemEmpty = JSON.parse(JSON.stringify(this.productOptions[0]))
          itemEmpty.id = null
          itemEmpty.name = ""
          itemEmpty.code = ""
          itemEmpty.name_full = "-- Chọn sản phẩm --"
          this.productOptions.unshift(itemEmpty)
        }
      } else {
        this.currentProductManualInput.product_type_id = null

        this.resetListProduct()
      }

      // Reset child item
      this.productSelect = {}
      this.currentProductManualInput.product_id = null
      this.currentProductManualInput.product_code = this.currentProductManualInput.product_code_input
      this.currentProductManualInput.product_name = this.currentProductManualInput.product_name_input
      this.currentProductManualInput.price_list = null
      this.currentProductManualInput.discount = null
      this.currentProductManualInput.price_sell = null
    },

    getProductGroupSelectById(id) {
      for(let productGroup of this.productGroupOptions) {
        if(productGroup.id == id) {
          this.productGroupSelect = productGroup
          return;
        }
      }
    },

    getProductTypeSelectById(id) {
      for(let productType of this.productTypeOptionStore) {
        if(productType.id == id) {
          this.productTypeSelect = productType
          return;
        }
      }
    },

    changeBrandInput() {
      if(this.currentProductManualInput.brand_id) {
        for(let brand of this.productBrandOptions) {
          if(brand.value == this.currentProductManualInput.brand_id) {
            this.currentProductManualInput.brand_name = brand.text
            return
          }
        }
      } else {
        this.currentProductManualInput.brand_name = null
      }
    },

    changeUnitInput() {
      if(this.currentProductManualInput.unit_id) {
        for(let unit of this.unitOptions) {
          if(unit.value == this.currentProductManualInput.unit_id) {
            this.currentProductManualInput.unit_name = unit.text
            return
          }
        }
      } else {
        this.currentProductManualInput.unit_name = null
      }
    },

    /**
     *  Event change product
     */
    changeProduct() {
      // Reset other info
      this.currentProductManualInput.price_list = null
      this.currentProductManualInput.discount = null

      if(this.productSelect && this.productSelect.id) {
        this.currentProductManualInput.product_id = this.productSelect.id
        this.currentProductManualInput.product_name = this.productSelect.name
        this.currentProductManualInput.product_code = this.productSelect.code
        this.currentProductManualInput.price_list = this.currencyFormat(this.productSelect.price_list)
        this.currentProductManualInput.discount = this.productSelect.discount
        this.currentProductManualInput.price_sell = this.currencyFormat(this.productSelect.price_sell)
        this.currentProductManualInput.brand_name = this.productSelect.brand_name
        this.currentProductManualInput.unit_name = this.productSelect.unit_name

        if(this.productSelect.product_group_id != this.productGroupSelect.id) {
          this.getProductGroupSelectById(this.productSelect.product_group_id)
        }
        if(this.productSelect.product_type_id != this.productTypeSelect.id) {
          this.getProductTypeSelectById(this.productSelect.product_type_id)
        }
      }
    },

    insertProduct() {
      // this.click = true
      if (this.insertingProduct) { return }

      // Validate
        if(!this.productGroupSelect.id) {
            this.popToast('danger', "Vui lòng chọn [Nhóm sản phẩm]")
            return
        }
        if(!this.productTypeSelect.id) {
            this.popToast('danger', "Vui lòng chọn [Loại sản phẩm]")
            return
        }
        // if(!this.productTypeSelect.id) {
        //     this.popToast('danger', "Vui lòng chọn [Loại sản phẩm]")
        //     return
        // }
        if(!this.currentProductManualInput.product_name) {
            this.popToast('danger', "Vui lòng nhập [Tên sản phẩm]")
            return
        }
        if(!this.currentProductManualInput.unit_id) {
            this.popToast('danger', "Vui lòng chọn [Đơn vị]")
            return
        }

      this.insertingProduct = true
      let params = {
        "id": this.currentProductManualInput.id,
        "product_group_id": this.productGroupSelect.id,
        "product_group_name": this.productGroupSelect.name,
        "product_type_id": this.productTypeSelect.id,
        "product_type_name": this.productTypeSelect.name,
        "product_id": this.productSelect && this.productSelect.id ? this.productSelect.id : null,
        "product_code": this.currentProductManualInput.product_code,
        "product_name": this.currentProductManualInput.product_name,
        "brand_id": this.currentProductManualInput.brand_id,
        "brand_name": this.currentProductManualInput.brand_name,
        "unit_id": this.currentProductManualInput.unit_id,
        "unit_name": this.currentProductManualInput.unit_name,
        "price_list": this.currentProductManualInput.price_list,
        "discount": this.currentProductManualInput.discount,
        "price_sell": this.currentProductManualInput.price_sell
      }

      orderSellApi.insertProductFromOrderSell(params).then(res => {
        if (res != null && res.data != null) {
          // Remove current item ra khỏi danh sách các sp nhập tay trước đó
          this.product_manual_inputs.splice(0, 1)
          if(this.product_manual_inputs.length > 0) {
            this.currentProductManualInput = this.product_manual_inputs[0]
          } else {
            this.currentProductManualInput = {}
          }

          this.changeProductGroup()
          this.productGroupSelect = {}
          this.popToast('success', "Thêm sản phẩm thành công!")
        }
        this.insertingProduct = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.insertingProduct = false
      })
    },

    getListIncome(id) {
      this.loadingIncome = true

      orderSellApi.getListIncome(id).then(res => {
        if (res != null && res.data != null) {
          this.incomeItems = res.data.data
        }
        this.loadingIncome = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loadingIncome = false
      })
    },

    getListExpend(id) {
      this.loadingIncome = true

      orderSellApi.getListExpend(id).then(res => {
        if (res != null && res.data != null) {
          this.incomeItems = res.data.data
        }
        this.loadingIncome = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loadingIncome = false
      })
    },

    showModalDetailPayment(id, type) {
      if (type == 'expend_order_sell') {
        this.title_modal_income_expend_list = "Danh Sách Chi Tiền"
        this.getListExpend(id)
      } else {
        this.title_modal_income_expend_list = "Danh Sách Thu Tiền"
        this.getListIncome(id)
      }

      this.$bvModal.show('modal-list-income')
    },

    hideModalDetailPayment() {
      this.$bvModal.hide('modal-list-income')
    },
  }
}
</script>

<style lang="scss" scoped>
  .total {
    color: #ed592a;
  }

  .bg-danger-cus {
    background-color: #fee2e1;
  }

  .bg-warning-cus {
    background-color: #FAEBD7;
  }

  .bg-success-cus {
    background-color: #C1FFC1;
  }
</style>
