<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">
            <h4 class="text-center text-header">Báo Cáo Khách Hàng</h4>

            <b-row class="form-row">

              <b-col md="2">
                <label>Thời gian</label>
                <b-form-select :options="timeOptions" v-model="time_option" ></b-form-select>
              </b-col>

              <b-col md="2">
                <label v-show="time_option != 5"> {{time_option == 1 ? 'Từ ngày' : 'Năm' }} </label>
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

            <b-row class="form-row">
              <b-col md="4">
                <label>Nhân viên</label>
                <multiselect
                  v-model="inputs.staff_in_charge"
                  :options="optionsStaff"
                  :loading="loadingOptions"
                  :select-label="''"
                  :deselect-label="''"
                  placeholder="--Tất cả--"
                  label="text"
                  track-by="text">
                </multiselect>
              </b-col>

              <b-col md="2">
                <label>Tình trạng khách</label>
                <b-form-select
                id="status"
                :options="statusOptions"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.status_id"></b-form-select>
              </b-col>

              <b-col md="2">
                <label>Số lượng đơn đã bán</label>
                <b-form-select
                id="number"
                :options="numberOptions"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.number_id"></b-form-select>
              </b-col>

              <b-col md="2">
                <label>Sắp xếp theo cột</label>
                <b-form-select
                id="orderBy"
                :options="orderByOptions"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.order_by"></b-form-select>
              </b-col>

              <b-col md="2">
                <label>Thứ tự</label>
                <b-form-select
                id="index"
                :options="indexOptions"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.index"></b-form-select>
              </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col md="12">
                <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="loading"
                          @click.prevent="prepareToSearch">
                  Tìm Kiếm
                </b-button>
              </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col>
                <p>Tổng số khách hàng đã bán hàng: {{currencyFormat(sum_ordered)}}</p>
                <p>Tổng số khách hàng chưa bán hàng: {{currencyFormat(sum_not_order)}}</p>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="4">
                Số kết quả: {{currencyFormat(totalRow)}}
              </b-col>
              <b-col md="8" class="text-right" v-if="excel_items.length > 0">
                    <download-excel
                      class   = "btn btn-default text-header"
                      :data   = "excel_items"
                      :fields = "excel_fields"
                      worksheet = "Báo cáo khách hàng"
                      name    = "bao_cao_khach_hang.xls">
                      <b>Xuất Excel</b>
                    </download-excel>
                  </b-col>
            </b-row>

            <b-row>
              <b-col class="table-cus">
                <table class="table table-bordered table-striped fixed_header">
                  <tr>
                    <th style="width:3%">STT</th>
                    <th style="width:20%">Tên khách hàng</th>
                    <th style="width:6%">Ngày phát sinh ĐH cuối</th>
                    <th style="width:11%">Số lượng ĐH bán</th>
                    <th style="width:11%">Tổng doanh số đã bán</th>
                    <th style="width:11%">Số lượng BG</th>
                    <th style="width:11%">Tổng doanh số BG</th>
                    <th style="width:11%">Tình trạng khách</th>
                    <th style="width:5%">Lịch sử mua hàng</th>
                    <th style="width:5%">Lịch sử BG</th>
                    <th style="width:5%">Chi tiết công nợ</th>
                  </tr>
                  <tr v-for="(item, index) in items" :key="index">
                    <td>{{index + 1}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.last_finished_date}}</td>
                    <td>{{currencyFormat(item.count_order_sell)}}</td>
                    <td>{{currencyFormat(item.sum_order_sell)}}</td>
                    <td>{{currencyFormat(item.count_quotation)}}</td>
                    <td>{{currencyFormat(item.sum_quotation)}}</td>
                    <td>{{item.customer_status}}</td>
                    <td>
                      <b-button v-show="item.count_order_sell > 0" variant="outline-primary" class="mr-2 mt-1"
                        @click="openModalOrderSellHis(item)">
                        Xem
                      </b-button>
                    </td>
                    <td>
                      <b-button v-show="item.count_quotation > 0" variant="outline-primary" class="mr-2 mt-1"
                        @click="openModalQuotationHis(item)">
                        Xem
                      </b-button>
                    </td>
                    <td>
                      <b-button variant="outline-primary" class="mr-2 mt-1"
                        @click="openModalDebtHis(item)">
                        Xem
                      </b-button>
                    </td>
                  </tr>
              </table>
              </b-col>
            </b-row>

            <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <!-- Modal tìm kiếm lịch sử mua hàng -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-search-order-sell-his" @hide="order_sells = []">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Lịch Sử Mua Hàng</h4>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col>
          <p>Khách hàng: {{currentCustomer.name}}</p>
        </b-col>
      </b-row>

      <b-row class="form-row">

        <b-col md="4">
          <label>Thời gian</label>
          <b-form-select :options="timeOptions" v-model="search_time_option" ></b-form-select>
        </b-col>

        <b-col md="4">
          <label v-show="search_time_option != 5"> {{search_time_option == 1 ? 'Từ ngày' : 'Năm' }} </label>
          <!--Thời gian theo ngày-->
          <datepicker v-show="search_time_option == 1" v-model="search_inputs.from_date" format="yyyy-MM-dd"
                      placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
          <!--Thời gian năm-->
          <b-form-select v-show="search_time_option != 1 && search_time_option != 5" :options="yearOptions" v-model="search_year_input"></b-form-select>
        </b-col>

        <b-col md="4">
          <label v-show="search_time_option == 1 || search_time_option == 2 || search_time_option == 3">
            {{search_time_option == 1 ? 'Đến ngày' : search_time_option == 2 ? 'Tháng' : 'Quý' }}
          </label>

          <!--Thời gian theo ngày-->
          <datepicker v-show="search_time_option == 1" v-model="search_inputs.to_date" format="yyyy-MM-dd"
                      placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>

          <!--Thời gian tháng -->
          <b-form-select v-show="search_time_option == 2" :options="monthOptions" v-model="search_month_input"></b-form-select>

          <!--Thời gian quý -->
          <b-form-select v-show="search_time_option == 3" :options="quarterOptions" v-model="search_quarter_input"></b-form-select>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalOrderSellHis">
            Quay lại
          </b-button>

          <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch"
                    @click.prevent="searchOrderSell">
            Tìm Kiếm
          </b-button>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col class="table-cus">
          <table class="table table-bordered table-striped fixed_header">
              <tr>
                <th style="width:4%">STT</th>
                <th style="width:12%">Số ĐH bán</th>
                <th style="width:12%">Tình trạng đơn</th>
                <th style="width:12%">Tổng giá trị ĐH</th>
                <th style="width:12%">Số tiền còn phải TT</th>
                <th style="width:12%">Trạng thái GH</th>
                <th style="width:12%">Ngày tạo đơn</th>
                <th style="width:12%">Ngày cập nhật lần cuối</th>
                <th style="width:12%">NV phụ trách</th>
              </tr>
              <tr v-for="(item, index) in order_sells" :key="index">
                <td>{{index + 1}}</td>
                <td>{{item.order_sell_number}}</td>
                <td>{{item.status_str}}</td>
                <td>{{currencyFormat(item.total)}}</td>
                <td>{{currencyFormat(item.total_remaining)}}</td>
                <td>{{item.shipping_status_str}}</td>
                <td>{{item.created_at}}</td>
                <td>{{item.updated_at}}</td>
                <td>{{item.staff_name}}</td>
              </tr>
          </table>
          <span class="loading-more" v-show="onSearch"><icon name="loading" width="60" /></span>
          <p class="text-center">--Hết--</p>
        </b-col>
      </b-row>



    </b-modal>

    <!-- Modal tìm kiếm lịch sử báo giá -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-search-quotation-his" @hide="quotations = []">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Lịch Sử Báo Giá</h4>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col>
          <p>Khách hàng: {{currentCustomer.name}}</p>
        </b-col>
      </b-row>

      <b-row class="form-row">

        <b-col md="4">
          <label>Thời gian</label>
          <b-form-select :options="timeOptions" v-model="search_time_option" ></b-form-select>
        </b-col>

        <b-col md="4">
          <label v-show="search_time_option != 5"> {{search_time_option == 1 ? 'Từ ngày' : 'Năm' }} </label>
          <!--Thời gian theo ngày-->
          <datepicker v-show="search_time_option == 1" v-model="search_inputs.from_date" format="yyyy-MM-dd"
                      placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
          <!--Thời gian năm-->
          <b-form-select v-show="search_time_option != 1 && search_time_option != 5" :options="yearOptions" v-model="search_year_input"></b-form-select>
        </b-col>

        <b-col md="4">
          <label v-show="search_time_option == 1 || search_time_option == 2 || search_time_option == 3">
            {{search_time_option == 1 ? 'Đến ngày' : search_time_option == 2 ? 'Tháng' : 'Quý' }}
          </label>

          <!--Thời gian theo ngày-->
          <datepicker v-show="search_time_option == 1" v-model="search_inputs.to_date" format="yyyy-MM-dd"
                      placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>

          <!--Thời gian tháng -->
          <b-form-select v-show="search_time_option == 2" :options="monthOptions" v-model="search_month_input"></b-form-select>

          <!--Thời gian quý -->
          <b-form-select v-show="search_time_option == 3" :options="quarterOptions" v-model="search_quarter_input"></b-form-select>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalQuotationHis">
            Quay lại
          </b-button>

          <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch"
                    @click.prevent="searchQuotation">
            Tìm Kiếm
          </b-button>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col class="table-cus">
          <table class="table table-bordered table-striped fixed_header">
              <tr>
                <th style="width:4%">STT</th>
                <th style="width:14%">Số báo giá</th>
                <th style="width:12%">Tổng giá trị BG</th>
                <th style="width:14%">Trạng thái BG</th>
                <th style="width:14%">Lý do rớt</th>
                <th style="width:14%">Ngày báo giá</th>
                <th style="width:14%">Ngày cập nhật lần cuối</th>
                <th style="width:14%">NV phụ trách</th>
              </tr>
              <tr v-for="(item, index) in quotations" :key="index">
                <td>{{index + 1}}</td>
                <td>{{item.quotation_number}}</td>
                <td>{{currencyFormat(item.total)}}</td>
                <td>{{item.status_str}}</td>
                <td>{{item.reason_falling_note}}</td>
                <td>{{item.created_at}}</td>
                <td>{{item.updated_at}}</td>
                <td>{{item.staff_name}}</td>
              </tr>
          </table>
          <span class="loading-more" v-show="onSearch"><icon name="loading" width="60" /></span>
          <p class="text-center">--Hết--</p>
        </b-col>
      </b-row>

    </b-modal>

    <!-- Modal tìm kiếm lịch sử báo giá -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-search-debt-his" @hide="debts = []">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Chi Tiết Công Nợ</h4>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col>
          <p>Khách hàng: {{currentCustomer.name}}</p>
        </b-col>
      </b-row>

      <b-row class="form-row">

        <b-col md="4">
          <label>Thời gian</label>
          <b-form-select :options="timeOptions" v-model="search_time_option" ></b-form-select>
        </b-col>

        <b-col md="4">
          <label v-show="search_time_option != 5"> {{search_time_option == 1 ? 'Từ ngày' : 'Năm' }} </label>
          <!--Thời gian theo ngày-->
          <datepicker v-show="search_time_option == 1" v-model="search_inputs.from_date" format="yyyy-MM-dd"
                      placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
          <!--Thời gian năm-->
          <b-form-select v-show="search_time_option != 1 && search_time_option != 5" :options="yearOptions" v-model="search_year_input"></b-form-select>
        </b-col>

        <b-col md="4">
          <label v-show="search_time_option == 1 || search_time_option == 2 || search_time_option == 3">
            {{search_time_option == 1 ? 'Đến ngày' : search_time_option == 2 ? 'Tháng' : 'Quý' }}
          </label>

          <!--Thời gian theo ngày-->
          <datepicker v-show="search_time_option == 1" v-model="search_inputs.to_date" format="yyyy-MM-dd"
                      placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>

          <!--Thời gian tháng -->
          <b-form-select v-show="search_time_option == 2" :options="monthOptions" v-model="search_month_input"></b-form-select>

          <!--Thời gian quý -->
          <b-form-select v-show="search_time_option == 3" :options="quarterOptions" v-model="search_quarter_input"></b-form-select>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalDebtHis">
            Quay lại
          </b-button>

          <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch"
                    @click.prevent="searchDebt">
            Tìm Kiếm
          </b-button>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col class="table-cus">
          <table class="table table-bordered table-striped fixed_header">
              <tr>
                <th style="width:5%">STT</th>
                <th style="width:14%">Số ĐH bán</th>
                <th style="width:14%">Tình trạng đơn</th>
                <th style="width:13%">Tổng giá trị ĐH</th>
                <th style="width:13%">Số tiền đã TT</th>
                <th style="width:13%">Số tiền còn phải TT</th>
                <th style="width:14%">Trạng thái GH</th>
                <th style="width:14%">NV phụ trách</th>
              </tr>
              <tr v-for="(item, index) in debts" :key="index">
                <td>{{index + 1}}</td>
                <td>{{item.order_sell_number}}</td>
                <td>{{item.status_str}}</td>
                <td>{{currencyFormat(item.total)}}</td>
                <td>{{currencyFormat(item.total - item.total_remaining)}}</td>
                <td>{{currencyFormat(item.total_remaining)}}</td>
                <td>{{item.shipping_status_str}}</td>
                <td>{{item.staff_name}}</td>
              </tr>
          </table>
          <span class="loading-more" v-show="onSearch"><icon name="loading" width="60" /></span>
          <p class="text-center">--Hết--</p>
        </b-col>
      </b-row>

    </b-modal>


  </div>
</template>


<script>
import reportApi from '@/api/report'
import commonFunc from '@/common/commonFunc'
import {Constant} from '@/common/constant'
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
      time_option: 2,
      year_input: 2024,
      quarter_input: 1,
      month_input: 1,
      inputs: {
        customer: null,
        staff_in_charge: null,
        status_id: null,
        number_id: null,
        from_date: '2000-01-01',
        to_date: '2000-01-02',
        order_by: ' count_order_sell ',
        index: ' desc '
      },
      loadingOptions: false,
      customerOptions: [],
      optionsStaff: [],
      statusOptions: [
        {value: null, text: '-- Tất cả --'},
        {value: 1, text: 'Cũ'},
        {value: 2, text: 'Mới'},
      ],
      numberOptions: [
        {value: null, text: '-- Tất cả --'},
        {value: 1, text: 'Khách hàng đã bán trên 3 đơn'},
        {value: 2, text: 'Khách hàng đã bán từ 1-3 đơn'},
        {value: 3, text: 'Khách hàng chưa bán hàng'}
      ],
      orderByOptions: [
        {value: ' count_order_sell ', text: 'Số lượng đơn hàng bán'},
        {value: ' sum_order_sell ', text: 'Tổng doanh số đã bán'},
        {value: ' count_quotation ', text: 'Số lượng báo giá'},
        {value: ' sum_quotation ', text: 'Tổng doanh số báo giá'},
        {value: ' last_finished_date ', text: 'Ngày phát sinh đơn hàng cuối'}
      ],
      indexOptions: [
        {value: ' desc ', text: 'Cao -> thấp'},
        {value: ' asc ', text: 'Thấp -> Cao'},
      ],
      items: [],
      sum_ordered: 0,
      sum_not_order: 0,
      hasNext: true,
      loading: false,
      totalRow: 0,
      loadByScroll: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      excel_items: [],
      excel_fields: {
        'Tên K.H': 'name',
        'Ngày phát sinh ĐH cuối': 'last_finished_date',
        'Số lượng ĐH bán' : 'count_order_sell',
        'Tổng doanh số đã bán' : 'sum_order_sell',
        'Số lượng BG' : 'count_quotation',
        'Tổng doanh số BG' : 'sum_quotation',
        'Tình trạng khách' : 'customer_status'
      },
      isGetExcelItems: false,

      // Item của modal search
      onSearch: false,
      currentCustomer: {},
      search_time_option: 5,
      search_year_input: 2024,
      search_quarter_input: 1,
      search_month_input: 1,
      search_inputs: {
        customer_id: null,
        from_date: '2000-01-01',
        to_date: '2000-01-02'
      },
      order_sells: [],
      quotations: [],
      debts: []
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

    // Get default from date and to date
    this.prepareDateInput()

    // Get danh sách nhân viên
    this.getOptionRelated()

    // Tìm kiếm
    this.prepareToSearch()
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
      if(this.loading) {
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
      let to_date = dateNow.toJSON().slice(0,10)
      let from_date = new Date(dateNow.setDate(dateNow.getDate() - 7))
      this.inputs.to_date = to_date
      this.inputs.from_date = from_date
      this.year_input = dateNow.getFullYear()

      this.search_year_input = dateNow.getFullYear()
      this.search_inputs.to_date = to_date
      this.search_inputs.from_date = from_date

      let currentYear = dateNow.getFullYear()
      this.yearOptions = []
      for (let i = currentYear; i > currentYear - 10; i--) {
          this.yearOptions.push({value: i, text: i})
      }

      this.month_input = dateNow.getMonth() + 1
      this.search_month_input = dateNow.getMonth() + 1
    },

    /**
     * Get options related repository
     */
    getOptionRelated() {
      this.loadingOptions = true

      let params = {
        'staffs': true,
        'customers': true
      }

      reportApi.getOptionsRelatedReport(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          this.optionsStaff = options.staffs
          this.optionsStaff.unshift({value: null, text: "-- Tất cả --"})

          this.customerOptions = options.customers
          this.customerOptions.unshift({value: null, text: "-- Tất cả --"})
        }
        this.loadingOptions = false
      }).catch(err => {
        this.loadingOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    openModalOrderSellHis(customer) {
      this.currentCustomer = customer
      this.search_time_option = JSON.parse(JSON.stringify(this.time_option))
      this.search_year_input = JSON.parse(JSON.stringify(this.year_input))
      this.search_month_input = JSON.parse(JSON.stringify(this.month_input))
      this.search_quarter_input = JSON.parse(JSON.stringify(this.quarter_input))
      this.search_inputs.from_date = JSON.parse(JSON.stringify(this.inputs.from_date))
      this.search_inputs.to_date = JSON.parse(JSON.stringify(this.inputs.to_date))

      this.$bvModal.show('modal-search-order-sell-his')

      this.searchOrderSell()
    },
    hideModalOrderSellHis() {
      this.$bvModal.hide('modal-search-order-sell-his')
    },
    openModalQuotationHis(customer) {
      this.currentCustomer = customer
      this.search_time_option = JSON.parse(JSON.stringify(this.search_time_option))
      this.search_year_input = JSON.parse(JSON.stringify(this.year_input))
      this.search_month_input = JSON.parse(JSON.stringify(this.month_input))
      this.search_quarter_input = JSON.parse(JSON.stringify(this.quarter_input))
      this.search_inputs.from_date = JSON.parse(JSON.stringify(this.inputs.from_date))
      this.search_inputs.to_date = JSON.parse(JSON.stringify(this.inputs.to_date))

      this.$bvModal.show('modal-search-quotation-his')

      this.searchQuotation()
    },
    hideModalQuotationHis() {
      this.$bvModal.hide('modal-search-quotation-his')
    },
    openModalDebtHis(customer) {
      this.currentCustomer = customer
      this.$bvModal.show('modal-search-debt-his')

      this.searchDebt()
    },
    hideModalDebtHis() {
      this.$bvModal.hide('modal-search-debt-his')
    },

    getExcelItem(params) {
      if(this.isGetExcelItems) {
        return;
      }

      this.excel_items = []

      // Define params
      params.limit = 999999

      // Search
      reportApi.getCustomerReport(params).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.excel_items = res.data.data.reports
          this.isGetExcelItems = true
        }
      }).catch(err => {})
    },

    /**
     * Prepare to search
     */
    prepareToSearch() {
      this.offset = 0
      this.items = []
      this.hasNext = true
      this.isGetExcelItems = false
      this.sum_ordered = 0
      this.sum_not_order = 0
      this.totalRow = 0

      this.search()
    },

    search() {
      if(this.loading) {
        return
      }

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
        staff_in_charge: this.inputs.staff_in_charge && this.inputs.staff_in_charge.value ? this.inputs.staff_in_charge.value : null,
        customer_id: this.inputs.customer && this.inputs.customer.id ? this.inputs.customer.id : null,
        status_id: this.inputs.status_id,
        number_id: this.inputs.number_id,
        from_date: fromDate,
        to_date: toDate,
        order_by: this.inputs.order_by,
        index: this.inputs.index,
        limit: this.pageLimit,
        offset: this.offset
      }

      reportApi.getCustomerReport(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.reports
          this.totalRow = res.data.data.total_row
          this.sum_not_order = res.data.data.sum_not_order
          this.sum_ordered = res.data.data.sum_ordered

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
        this.loading = false
      }).catch(err => {
        this.loading = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    searchOrderSell() {
      if(this.onSearch) {
        return
      }

      this.onSearch = true

      let fromDate = this.search_inputs.from_date
      let toDate = this.search_inputs.to_date

      // Handle fromDate, toDate
      if(this.search_time_option == 2) {
        fromDate = this.search_year_input + '-' + this.search_month_input + '-01'
        toDate = this.search_year_input + '-' + this.search_month_input + '-' + new Date(this.search_year_input, this.search_month_input, 0).getDate()
      }
      if(this.search_time_option == 3) {
          let quarter = commonFunc.getMonthByQuarter(this.search_quarter_input)
        fromDate = this.search_year_input + '-' + quarter + '-01'
        toDate = this.search_year_input + '-' + (quarter + 2) + '-' + new Date(this.search_year_input, (quarter + 2), 0).getDate()
      }
      if(this.search_time_option == 4) {
        fromDate = this.search_year_input + '-01-01'
        toDate = this.search_year_input + '-12-' + new Date(this.search_year_input, 12, 0).getDate()
      }
      if(this.search_time_option == 5) {
        toDate = new Date().toJSON().slice(0,10)
        fromDate = '2000-01-01'
      }

      let params = {
        customer_id: this.currentCustomer.id,
        from_date: fromDate,
        to_date: toDate
      }

      reportApi.getOrderSellByCustomer(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.order_sells = res.data.data
        }

        this.onSearch = false
      }).catch(err => {
        this.onSearch = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    searchQuotation() {
      if(this.onSearch) {
        return
      }

      this.onSearch = true

      let fromDate = this.search_inputs.from_date
      let toDate = this.search_inputs.to_date

      // Handle fromDate, toDate
      if(this.search_time_option == 2) {
        fromDate = this.search_year_input + '-' + this.search_month_input + '-01'
        toDate = this.search_year_input + '-' + this.search_month_input + '-' + new Date(this.search_year_input, this.search_month_input, 0).getDate()
      }
      if(this.search_time_option == 3) {
          let quarter = commonFunc.getMonthByQuarter(this.search_quarter_input)
        fromDate = this.search_year_input + '-' + quarter + '-01'
        toDate = this.search_year_input + '-' + (quarter + 2) + '-' + new Date(this.search_year_input, (quarter + 2), 0).getDate()
      }
      if(this.search_time_option == 4) {
        fromDate = this.search_year_input + '-01-01'
        toDate = this.search_year_input + '-12-' + new Date(this.search_year_input, 12, 0).getDate()
      }
      if(this.search_time_option == 5) {
        toDate = new Date().toJSON().slice(0,10)
        fromDate = '2000-01-01'
      }

      let params = {
        customer_id: this.currentCustomer.id,
        from_date: fromDate,
        to_date: toDate
      }

      reportApi.getQuotationByCustomer(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.quotations = res.data.data
        }

        this.onSearch = false
      }).catch(err => {
        this.onSearch = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    searchDebt() {
      if(this.onSearch) {
        return
      }

      this.onSearch = true

      let fromDate = this.search_inputs.from_date
      let toDate = this.search_inputs.to_date

      // Handle fromDate, toDate
      if(this.search_time_option == 2) {
        fromDate = this.search_year_input + '-' + this.search_month_input + '-01'
        toDate = this.search_year_input + '-' + this.search_month_input + '-' + new Date(this.search_year_input, this.search_month_input, 0).getDate()
      }
      if(this.search_time_option == 3) {
          let quarter = commonFunc.getMonthByQuarter(this.search_quarter_input)
        fromDate = this.search_year_input + '-' + quarter + '-01'
        toDate = this.search_year_input + '-' + (quarter + 2) + '-' + new Date(this.search_year_input, (quarter + 2), 0).getDate()
      }
      if(this.search_time_option == 4) {
        fromDate = this.search_year_input + '-01-01'
        toDate = this.search_year_input + '-12-' + new Date(this.search_year_input, 12, 0).getDate()
      }
      if(this.search_time_option == 5) {
        toDate = new Date().toJSON().slice(0,10)
        fromDate = '2000-01-01'
      }

      let params = {
        customer_id: this.currentCustomer.id,
        from_date: fromDate,
        to_date: toDate
      }

      reportApi.getDebtByCustomer(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.debts = res.data.data
        }

        this.onSearch = false
      }).catch(err => {
        this.onSearch = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
   * Currency format
   */
    currencyFormat(num) {
      let result = 0
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
