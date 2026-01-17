<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>

          <b-row>
            <b-col md='12'>
              <b-button variant="outline-primary" class="pull-right btn-width-200 ml-2 mt-1"
                        @click="goToAdd()">
                Thêm mới từ ĐH bán
              </b-button>
              <b-button variant="outline-success" class="pull-right btn-width-200 mt-1"
                        @click="goToAddRepo()">
                Thêm mới nhập kho
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-1 text-center text-header">Danh Sách Đơn Hàng Nhập</h4>
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

            <b-col md="6">
              <label>Tên Nhà Cung cấp</label>
              <multiselect
                v-model="supplierSelect"
                :options="supplierOptions"
                :loading="loadingOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn nhà cung cấp--"
                label="name"
                track-by="name">
              </multiselect>
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="2">
              <label>Tình trạng thanh toán</label>
              <b-form-select
                id="payment_status"
                :options="paymentStatusOptions"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.payment_status"></b-form-select>
            </b-col>

            <b-col md="2">
              <label>Tình trạng hàng</label>
              <b-form-select
                id="status"
                :options="statusOptions"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.status"></b-form-select>
            </b-col>

            <b-col md="2">
              <label>Số HĐ VAT vào</label>
              <input
              id="invoice_note"
              type="text"
              maxlength="20"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.invoice_note">
            </b-col>

            <b-col md="3">
              <label>Số ĐH nhập</label>
              <input
              id="order_buy_number"
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.order_buy_number">
            </b-col>

            <b-col md="3">
              <label>Các phiếu liên quan</label>
              <input
              id="related_number"
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="form-control"
              placeholder="Ví dụ: DH... hoặc NK... hoặc PT... hoặc PC..."
              v-model="inputs.related_number">
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
                    worksheet = "Danh sách đơn hàng nhập"
                    name    = "danh_sach_don_hang_nhap.xls">
                    <b>Xuất Excel</b>
                  </download-excel>
                </b-col>
          </b-row>

          <b-row>
            <b-col md="12" class="table-cus">
              <table class="table table-bordered table-striped fixed_header">
                    <thead>
                    <tr>
                      <th style="width:3%">STT</th>
                      <th style="width:7%">Số ĐH nhập</th>
                      <th style="width:7%">Các phiếu liên quan</th>
                      <th style="width:17%">Nhà cung cấp</th>
                      <th style="width:5%">Thời gian dự kiến GH</th>
                      <th style="width:5%">Tổng tiền (Gồm VAT)</th>
                      <th style="width:5%">Lấy VAT</th>
                      <th style="width:6%">Tình trạng hàng</th>
                      <th style="width:6%">Phương thức thanh toán</th>
                      <th style="width:5%">Số tiền còn phải TT</th>
                      <th style="width:5%">Số HD vat Vào</th>
                      <th style="width:5%">Trạng thái trả hàng</th>
                      <th style="width:7%">Ghi chú</th>
                      <th style="width:17%"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item) in items">
                      <td>{{item.stt}}</td>
                      <td>
                        <a :href="'/order-buy/detail/' + item.id" target="_blank" title="Chi tiết đơn hàng nhập">
                          {{item.order_buy_number}}
                        </a>
                      </td>
                      <td>
                        <a v-html="ballot" v-for="(ballot) in item.ballots" :key="ballot"></a>
                        <!-- <p v-for="(ballot) in item.ballots" :key="ballot">
                          <a v-html="ballot"></a>
                        </p> -->
                      </td>
                      <td>{{item.supplier_name}}</td>
                      <td>{{item.shipping_date}}</td>
                      <td>{{currencyFormat(item.total)}}</td>
                      <td>{{item.have_vat ? 'Có' : 'Không'}}</td>
                      <td>{{item.status_str}}</td>
                      <td>{{item.payment_method}}</td>
                      <td>
                        {{currencyFormat(item.amount_remaining)}}
                        <span v-show="item.amount_remaining != item.total" class="ml-2">
                          <i class="fa fa-info-circle" title="Chi tiết thanh toán" @click="showModalDetailPayment(item.id)"/>
                        </span>
                      </td>
                      <td>
                        {{item.invoice_note}}
                        <i class="fa fa-edit" @click="showModalUpdateInvoiceNote(item)" title="Cập nhật HĐ VAT vào"/>
                      </td>
                      <td>{{item.product_back_status_str}}</td>
                      <td>
                        {{item.note}}
                        <i class="fa fa-edit" @click="showModalUpdateNote(item)" title="Cập nhật ghi chú"/>
                      </td>
                      <td>
                        <div class="input-group">
                          <b-button v-if="item.status < 1" variant="outline-primary" class="mr-2 mt-1"
                                    @click="goToUpdate(item.id)">
                            Sửa
                          </b-button>
                          <b-button v-if="item.status < 1" variant="outline-danger" class="mr-2 mt-1"
                                    @click="deleteOrderBuy(item.id, item.supplier_name)">
                            Xóa
                          </b-button>
                          <b-button variant="outline-success" class="mr-2 mt-1" v-show="item.status > -1"
                                    @click="openModalCreateBallot(item)">
                            Tạo phiếu
                          </b-button>
                          <b-button v-show="item.status < 3 && !loadingDetail"
                                    variant="outline-primary" class="mr-2 mt-1"
                                    @click="handleProductExcel(item.id)">
                            In excel
                          </b-button>
                          <span class="loading-more" v-show="loadingDetail"><icon name="loading" width="60" /></span>
                        </div>
                      </td>
                    </tr>
                    </tbody>
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

    <!--Modal cập nhật ghi chú -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-change-note">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Cập nhật ghi chú</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="12">
          <label>Mã đơn hàng nhập: {{currentOrderBuy.order_buy_number}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label>Tên nhà cung cấp: {{currentOrderBuy.supplier_name}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label>Ghi chú: </label>
          <b-form-textarea
            id="note"
            style="width:100%;"
            rows="1"
            v-model="currentOrderBuy.note"
          ></b-form-textarea>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalChangeNote">
            Quay lại
          </b-button>

          <b-button variant="outline-primary" class="pull-right btn-width-120"
                    @click.prevent="confirmChangeNote">
            Xác nhận
          </b-button>
        </b-col>
      </b-row>

    </b-modal>

    <!--Modal cập nhật ghi chú hoá đơn -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-change-invoice-note">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Cập nhật ghi chú HĐ VAT vào</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="12">
          <label>Mã đơn hàng nhập: {{currentOrderBuy.order_buy_number}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label>Tên nhà cung cấp: {{currentOrderBuy.supplier_name}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label>Số HD vat Vào: </label>
          <b-form-textarea
            id="note"
            style="width:100%;"
            rows="1"
            v-model="currentOrderBuy.invoice_note"
          ></b-form-textarea>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalChangeInvoiceNote">
            Quay lại
          </b-button>

          <b-button variant="outline-primary" class="pull-right btn-width-120"
                    @click.prevent="confirmChangeInvoiceNote">
            Xác nhận
          </b-button>
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
          <label> Số đơn hàng: {{currentOrderBuy.order_buy_number}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Nhà cung cấp: {{currentOrderBuy.supplier_name}} </label>
        </b-col>
      </b-row>

      <hr>

      <b-row class="mt-1">
        <b-col md="4" class="mt-1" v-show="currentOrderBuy.status == 0 || currentOrderBuy.status == 2">
          <b-button variant="outline-primary" class="pull-left btn-width-200"
                    @click.prevent="goToRepoInput(currentOrderBuy.id)">
            Phiếu nhập kho
          </b-button>
        </b-col>
        <b-col md="4" class="mt-1" v-show="currentOrderBuy.status >= 0">
          <b-button variant="outline-primary" class="pull-left btn-width-200" @click="goToExpense(currentOrderBuy.id)">
              Phiếu Chi
            </b-button>
        </b-col>
        <b-col md="4" class="mt-1" v-show="currentOrderBuy.status > 0 && currentOrderBuy.status <= 7">
          <b-button variant="outline-primary" class="pull-left btn-width-200"
                    @click.prevent="goToProductBack(currentOrderBuy.id)">
            Phiếu trả hàng nhập
          </b-button>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col md="12" class="mt-1" v-show="currentOrderBuy.status > 0
            && currentOrderBuy.product_back_status > 0 && currentOrderBuy.status <= 7">
          <b-button variant="outline-primary" class="pull-left btn-width-200"
                    @click.prevent="goToIncomeBack(currentOrderBuy.id)">
            Phiếu thu do hủy đơn - Trả hàng
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

    <!-- Modal in excel -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-print-excel">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">In excel</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="12">
          <label>Nhà cung cấp: {{currentOrderBuy.supplier_name}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label>Ngày đặt hàng: {{currentOrderBuy.created_at}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label>Thời gian GH dự kiến: {{currentOrderBuy.shipping_date}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label>Xuất hóa đơn: {{currentOrderBuy.have_vat ? 'Có' : 'Không'}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label>Phương thức thanh toán: {{currentOrderBuy.payment_method}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label>Tổng tiền gồm VAT: {{currencyFormat(currentOrderBuy.total)}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label>Số ĐH bán: {{currentOrderBuy.order_sell_number}} </label>
        </b-col>
      </b-row>

      <hr>

      <b-row class="mt-2" v-show="currentOrderBuy.products && currentOrderBuy.products.length > 0" >
        <b-col md="12" class="table-cus">
          <table class="table table-bordered table-striped fixed_header">
            <thead>
            <tr>
              <th class="text-center font-weight-bold">STT</th>
              <th class="text-center font-weight-bold">Mã Hàng</th>
              <th class="text-center font-weight-bold">Tên Hàng</th>
              <th class="text-center font-weight-bold">Hãng</th>
              <th class="text-center font-weight-bold">DVT</th>
              <th class="text-center font-weight-bold">SL</th>
              <th class="text-center font-weight-bold">Đơn giá</th>
              <th class="text-center font-weight-bold">Thành tiền</th>
              <th class="text-center font-weight-bold">Ghi Chú</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in currentOrderBuy.products">
              <td>{{index + 1}}</td>
              <td>{{item.product_code}}</td>
              <td>{{item.product_name}}</td>
              <td>{{item.product_brand}}</td>
              <td>{{item.unit}}</td>
              <td class="text-right">{{currencyFormat(item.quantity)}}</td>
              <td class="text-right">{{currencyFormat(item.price_buy)}}</td>
              <td class="text-right">{{currencyFormat(item.amount)}}</td>
              <td class="text-right">{{item.note}}</td>
            </tr>
            </tbody>
          </table>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalPrintExcel">
            Quay lại
          </b-button>

          <download-excel
            class   = "btn btn-default text-header pull-right"
            :data   = "excel_one_items"
            worksheet = "Đơn hàng nhập"
            name    = "don_hang_nhap.xls">
            <b class="pull-right">In excel</b>
          </download-excel>
        </b-col>
      </b-row>
    </b-modal>

    <!--Modal chi tiết thanh toán-->
    <b-modal centered hide-footer hide-header size="xl" id="modal-list-expend">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Danh Sách Chi Tiền</h4>
        </b-col>
      </b-row>
      <hr>
      <span class="loading-more" v-show="loadingExpend"><icon name="loading" width="60" /></span>

      <b-row class="mt-2">
        <b-col>
          <b-table
            hover
            bordered
            stacked="md"
            :fields="expendFields"
            :items="expendItems">
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
import orderBuyApi from '@/api/orderBuy'
import supplierApi from '@/api/supplier'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'
import { useToast } from '@/composables/useToast'


export default {
  setup() {
    const { popToast } = useToast()
    return { popToast }
  },
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
        {"value": -1, "text": 'Lưu nháp'},
        {"value": 0, "text": 'Đã đặt chưa giao'},
        {"value": 1, "text": 'Đã nhập kho'},
        {"value": 2, "text": 'Đã nhập kho một phần'}
      ],
      paymentStatusOptions: [
        {"value": null, "text": 'Tất cả'},
        {"value": 1, "text": 'Chưa thanh toán'},
        {"value": 2, "text": 'Đã thanh toán'}
      ],
      statusInvoiceOptions: [
        {"value": 0, "text": 'Không xuất HD'},
        {"value": 1, "text": 'Chưa xuất HD'},
        {"value": 2, "text": 'Đã xuất HD'}
      ],
      supplierSelect: {},
      supplierOptions: [],
      inputs: {
        status: null,
        payment_status: null,
        supplier_id: null,
        order_buy_number: '',
        related_number: '',
        invoice_note: null,
        from_date: '2000-01-01',
        to_date: '2000-01-02'
      },
      loadingOptions: false,
      items: [],
      currentOrderBuy: {},
      loadingDetail: false,
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
      excel_items: [],
      excel_fields: {
        'STT': 'stt',
        'Số đơn hàng nhập': 'order_buy_number',
        'Các phiếu liên quan': 'ballots',
        'Nhà cung cấp' : 'supplier_name',
        'Thời gian dự kiến GH' : 'shipping_date',
        'Tổng tiền (Gồm vat)' : 'total',
        'Lấy VAT' : 'have_vat',
        'Tình trạng hàng' : 'status_str',
        'Phương thức thanh toán' : 'payment_method',
        'Tình trạng thanh toán' : 'payment_status',
        'Số HD vat Vào' : 'invoice_note',
        'Trạng thái trả hàng' : 'product_back_status_str',
        'Ghi chú' : 'note'
      },
      excel_one_items: [],
      isGetExcelItems: false,
      ballotType: null,
      creatingPHG: false,
      today_day: "",
      today_month: "",
      today_year: "",
      confirmingOrderBuy: false,
      cancelingOrderBuy: false,
      expendFields: [
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
          label: 'Nội dung chi'
        }
      ],
      expendItems: [],
      loadingExpend: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

    // Get today day, month, year
    let dateNow = new Date()
    this.today_day = dateNow.getDate()
    this.today_month = dateNow.getMonth() + 1
    this.today_year = dateNow.getFullYear()

    // Get default from date and to date
    this.prepareDateInput()

    // Get supplier list option
    this.getOptionSupplier()

    // Search
    this.prepareToSearch()
  },
  methods: {

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
        let currentYear = new Date().getFullYear()
        this.year_input = currentYear
        this.yearOptions = []
        for (let i = currentYear; i > currentYear - 10; i--) {
            this.yearOptions.push({value: i, text: i})
        }

        this.month_input = dateNow.getMonth() + 1
      },

      /**
     * Get Supplier options
     */
    getOptionSupplier() {
      this.loadingOptions = true
      supplierApi.getListSupplierOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.supplierOptions = res.data.data;

          let itemEmpty = {"id": null, "name": null, "address": null}
          this.supplierOptions.unshift(itemEmpty)

          this.loadingOptions = false
        }
      }).catch(err => {
        this.loadingOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

      /**
       * Go to add
       */
      goToAdd() {
        this.$router.push('/order-buy/index')
      },

    /**
     * Go to add
     */
    goToAddRepo() {
      this.$router.push('/order-buy/index-repo')
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
          this.$router.push('/order-buy/index-repo/' + id)
      },

    goToRepoInput(id) {
        this.$bvModal.hide('modal-create-ballot')
        window.open('/repository-from-order-buy/' + id, '_blank')
    },

      goToProductBack(id) {
          this.$bvModal.hide('modal-create-ballot')
        window.open('/order-buy-back/' + id, '_blank')
      },

      goToExpense(id) {
        this.$bvModal.hide('modal-create-ballot')
        window.open('/expend-from-order-buy/' + id, '_blank');
      },

      goToIncomeBack(id) {
        this.$bvModal.hide('modal-create-ballot')
        window.open('/income-from-product-back/' + id, '_blank');
      },

    showModalUpdateNote(orderBuy) {
      this.currentOrderBuy = orderBuy
      this.$bvModal.show('modal-change-note')
    },

    hideModalChangeNote() {
      this.currentOrderBuy = {}
      this.$bvModal.hide('modal-change-note')
    },

    confirmChangeNote() {
      let params = {
        "order_buy_id": this.currentOrderBuy.id,
        "note": this.currentOrderBuy.note
      }
      orderBuyApi.updateOrderBuyNote(params).then(res => {
        if (res != null && res.data != null) {
          for(let index in this.orderBuys) {
            if(this.orderBuys[index].id == this.currentOrderBuy.id) {
              this.orderBuys[index].note = this.currentOrderBuy.note
              break;
            }
          }

          this.$bvModal.hide('modal-change-note')
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    showModalUpdateInvoiceNote(orderBuy) {
      this.currentOrderBuy = orderBuy
      this.$bvModal.show('modal-change-invoice-note')
    },

    hideModalChangeInvoiceNote() {
      this.currentOrderBuy = {}
      this.$bvModal.hide('modal-change-invoice-note')
    },

    confirmChangeInvoiceNote() {
      let params = {
        "order_buy_id": this.currentOrderBuy.id,
        "invoice_note": this.currentOrderBuy.invoice_note
      }
      orderBuyApi.updateOrderBuyInvoiceNote(params).then(res => {
        if (res != null && res.data != null) {
          for(let index in this.orderBuys) {
            if(this.orderBuys[index].id == this.currentOrderBuy.id) {
              this.orderBuys[index].invoice_note = this.currentOrderBuy.invoice_note
              break;
            }
          }

          this.$bvModal.hide('modal-change-invoice-note')
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    handleProductExcel(orderBuyId) {
        // Get detail đơn hàng nhập
        if(orderBuyId){
          this.loadingDetail = true
          orderBuyApi.getOrderBuyDetail(orderBuyId).then(res => {
            if(res != null && res.data != null && res.data.data != null) {
              let orderBuy = res.data.data
              this.currentOrderBuy = res.data.data
              this.excel_one_items = [
                {
                  'index': 'Nhà cung cấp: ', 'product_code': orderBuy.supplier_name,
                  'product_name' : null, 'product_brand' : null, 'unit' : null,
                  'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
                },
                {
                  'index': 'Ngày đặt hàng: ', 'product_code': orderBuy.shipping_date,
                  'product_name' : null, 'product_brand' : null, 'unit' : null,
                  'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
                },
                {
                  'index': 'Thời gian GH dự kiến: ', 'product_code': orderBuy.shipping_date,
                  'product_name' : null, 'product_brand' : null, 'unit' : null,
                  'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
                },
                {
                  'index': 'Xuất hóa đơn: ', 'product_code': orderBuy.have_vat ? 'Có': 'Không',
                  'product_name' : null, 'product_brand' : null, 'unit' : null,
                  'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
                },
                {
                  'index': 'Phương thức thanh toán: ', 'product_code': orderBuy.payment_method,
                  'product_name' : null, 'product_brand' : null, 'unit' : null,
                  'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
                },
                {
                  'index': 'Tổng tiền gồm VAT: ', 'product_code': orderBuy.total,
                  'product_name' : null, 'product_brand' : null, 'unit' : null,
                  'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
                },
                {
                  'index': 'Số Đơn hàng bán: ', 'product_code': "",
                  'product_name' : null, 'product_brand' : null, 'unit' : null,
                  'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
                },
                {
                  'index': null, 'product_code': null,
                  'product_name' : null, 'product_brand' : null, 'unit' : null,
                  'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
                },
                {
                  'index': 'STT', 'product_code': 'Mã Hàng',
                  'product_name' : 'Tên Hàng', 'product_brand' : 'Hãng', 'unit' : 'ĐVT',
                  'quantity' : 'SL', 'price_buy' : 'Đơn giá', 'amount' : 'Thành tiền', 'note' : 'Ghi Chú'
                },
              ]

              if(orderBuy.products.length > 0) {
                let productsExcel = JSON.parse(JSON.stringify(orderBuy.products))

                for(let i in productsExcel) {
                  let item = {
                    'index': parseInt(productsExcel[i].index),
                    'product_code': productsExcel[i].product_code,
                    'product_name' : productsExcel[i].product_name,
                    'product_brand' : productsExcel[i].product_brand,
                    'unit' : productsExcel[i].unit,
                    'quantity' : productsExcel[i].quantity,
                    'price_buy' : productsExcel[i].price_buy,
                    'amount' : productsExcel[i].amount,
                    'note' : productsExcel[i].note
                  }
                  this.excel_one_items.push(item)
                }
              }
            }

            this.loadingDetail = false
            this.$bvModal.show('modal-print-excel')
          }).catch(err => {
            this.loadingDetail = false

            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
    },

    // goToBallotInputRepo(id) {
    //   this.$router.push('/repository-from-order-buy/' + id)
    // },

    // goToBallotExpend(id) {
    //   this.$router.push('/expend-from-order-buy/' + id)
    // },

    // goToBallotRevenue(id) {
    //   return false; // TODO chả hàng
    //   this.$router.push('/income-from-order-buy/' + id)
    // },

    goToBallotReturnImport(id) {
      this.$router.push('/order-sell-all/index/' + id)
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
          let ballots = []

          // Hanlde đơn hàng bán
          if(item.order_sell_numbers) {
            let list_order_sell = item.order_sell_numbers.split(",")

            let item_order_sell_checkeds = []
            for(let order_sell of list_order_sell) {
              let strs = order_sell.split("::")
              let order_sell_id = strs.length == 2 ? strs[0] : -1
              if(order_sell_id && !item_order_sell_checkeds.includes(order_sell_id)) {
                item_order_sell_checkeds.push(order_sell_id)

                let order_sell_number = strs.length == 2 ? strs[1] : ''
                let order_sell_item = "<a href='/order-sell-all/detail/" + order_sell_id + "' target='_blank' title='Chi tiết đơn hàng bán'>" + order_sell_number + "</a>"
                ballots.push(order_sell_item)
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
              }
            }
          }

          item.ballots = ballots
        }
      } else {
        // Handle data: gắn link cho từng đơn hàng bán
        for (let item of items) {
          let ballots = ""

          // Hanlde đơn hàng bán
          if(item.order_sell_numbers) {
            let list_order_sell = item.order_sell_numbers.split(",")

            let item_order_sell_checkeds = []
            for(let order_sell of list_order_sell) {
              let strs = order_sell.split("::")
              let order_sell_number = strs.length == 2 ? strs[1] : ''
              if(order_sell_number && !item_order_sell_checkeds.includes(order_sell_number)) {
                item_order_sell_checkeds.push(order_sell_number)

                ballots += order_sell_number + " | "
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
        "supplier_id": this.supplierSelect.id ? this.supplierSelect.id : null,
        "status": this.inputs.status,
        "payment_status": this.inputs.payment_status,
        "order_buy_number": this.inputs.order_buy_number.trim(),
        "related_number": this.inputs.related_number.trim(),
        "invoice_note": this.inputs.invoice_note,
        "from_date": fromDate,
        "to_date": toDate,
        "limit": this.pageLimit,
        "offset": this.offset
      }
      orderBuyApi.searchOrderBuy(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.order_buys
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
      orderBuyApi.searchOrderBuy(params, this.userRole).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          let order_buys = res.data.data.order_buys
          order_buys = this.handleBallot(order_buys, true)
          this.isGetExcelItems = true

          // Xử lý dữ liệu
          for(let item of order_buys) {
            if(item.have_vat) {
              item.have_vat = 'Có'
            } else {
              item.have_vat = 'Không'
            }

            if(item.amount_remaining > 0) {
              item.payment_status = 'Chưa TT'
            } else {
              item.payment_status = 'Đã TT'
            }

            this.excel_items.push(item)
          }

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

    openModalCreateBallot(order_sell) {
      this.currentOrderBuy = order_sell
      this.$bvModal.show('modal-create-ballot')
    },

    hideModalCreateBallot() {
      this.$bvModal.hide('modal-create-ballot')
    },

    hideModalPrintExcel() {
      this.$bvModal.hide('modal-print-excel')
    },

      /**
     * Delete
     */
    deleteOrderBuy(id, name) {
      if(id) {
        this.$bvModal.msgBoxConfirm('Xóa đơn hàng nhập từ nhà cung cấp [' + name + "]. Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if (res) {

            orderBuyApi.deleteOrderBuy(id, this.userRole).then(res => {
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

    getListExpend(id) {
      this.loadingExpend = true

      orderBuyApi.getListExpend(id).then(res => {
        if (res != null && res.data != null) {
          this.expendItems = res.data.data
        }
        this.loadingExpend = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loadingExpend = false
      })
    },

    showModalDetailPayment(id) {
      this.getListExpend(id)

      this.$bvModal.show('modal-list-expend')
    },

    hideModalDetailPayment() {
      this.$bvModal.hide('modal-list-expend')
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
</style>
