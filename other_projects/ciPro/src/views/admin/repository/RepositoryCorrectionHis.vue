<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col>
              <b-button variant="outline-success" class="pull-right btn-width-160 ml-2 mt-1" @click="goToAddOutput">
                Thiếu hàng hoá
              </b-button>
              <b-button variant="outline-primary" class="pull-right btn-width-160 mt-1" @click="goToAddInput">
                Thừa hàng hoá
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-1 text-center text-header">Lịch Sử Hiệu Chỉnh Kho</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row class="form-row">

            <b-col md="2">
              <label> Thời gian </label>
              <b-form-select :options="timeOptions" v-model="time_option" ></b-form-select>
            </b-col>

            <b-col md="2">
              <label> {{time_option == 1 ? 'Từ ngày' : 'Năm' }} </label>
              <!--Thời gian theo ngày-->
              <datepicker v-show="time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
              <!--Thời gian năm-->
              <b-form-select v-show="time_option != 1" :options="yearOptions" v-model="year_input"></b-form-select>
            </b-col>

            <b-col md="2">
              <label v-show="time_option != 4"> {{time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý' }} </label>

              <!--Thời gian theo ngày-->
              <datepicker v-show="time_option == 1" v-model="inputs.to_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>

              <!--Thời gian tháng -->
              <b-form-select v-show="time_option == 2" :options="monthOptions" v-model="month_input"></b-form-select>

              <!--Thời gian quý -->
              <b-form-select v-show="time_option == 3" :options="quarterOptions" v-model="quarter_input"></b-form-select>
            </b-col>

            <b-col md="3">
              <label>Loại hoạt động </label>
              <b-form-select
                id="type"
                :options="typeOptions"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.type_id"></b-form-select>
            </b-col>

            <b-col md="3">
              <label>Số phiếu</label>
              <input
                id="name"
                type="text"
                maxlength="100"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.repository_number">
            </b-col>

          </b-row>

          <b-row class="form-row">
            <b-col md="2">
              <label>Nhóm SP</label>
              <multiselect
                v-model="productGroupSelect"
                :options="productGroupOptions"
                :loading="loadingOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn nhóm sản phẩm--"
                label="name"
                track-by="name"
                @input="changeProductGroup">
              </multiselect>
            </b-col>
            <b-col md="2">
              <label>Loại SP</label>
              <multiselect
                v-model="productTypeSelect"
                :options="productTypeOptions"
                :loading="loadingOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn loại sản phẩm--"
                label="name"
                track-by="name">
              </multiselect>
            </b-col>
            <b-col md="2">
              <label>Hãng SP</label>
              <b-form-select
                :options="productBrandOptions"
                id="product_brand"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.product_brand_id"
                placeholder="Hãng SP"></b-form-select>
            </b-col>
            <b-col md="3">
              <label>Mã SP</label>
              <input
                id="codeProductCus"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.product_code"
                maxlength="255">
            </b-col>
            <b-col md="3">
              <label>Tên SP</label>
              <input
                id="nameProductCus"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.product_name"
                maxlength="255">
            </b-col>
          </b-row>

          <b-row>
            <b-col md="12" class="mt-1">
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch"
                        @click.prevent="prepareToSearch">
                Tìm Kiếm
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="12">
              <div class="btn-width-120 pull-left">Số kết quả: <span class="text-header"><b>{{totalRow}}</b></span></div>
              <download-excel
                class   = "btn btn-default text-header btn-width-120 pull-right"
                :data   = "excel_items"
                :fields = "excel_fields"
                worksheet = "Lịch sử kho"
                name    = "Lịch sử kho">
                <b>Xuất Excel</b>
              </download-excel>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="12" class="table-cus">
              <table class="table table-bordered table-striped fixed_header">
                <tr>
                  <th style="width:3%">STT</th>
                  <th style="width:8%">Ngày</th>
                  <th style="width:8%">Loại hoạt động</th>
                  <th style="width:10%">Số phiếu</th>
                  <th style="width:9%">Mã hàng</th>
                  <th style="width:13%">Tên hàng</th>
                  <th style="width:10%">Hãng</th>
                  <th style="width:9%">Số lượng</th>
                  <th style="width:9%">Đơn giá</th>
                  <th style="width:9%">Thành tiền</th>
                  <th style="width:9%">Người thao tác</th>
                  <th style="width:3%"></th>
                </tr>
                <tr v-for="(item) in items">
                  <td>{{item.stt}}</td>
                  <td>{{item.created_at}}</td>
                  <td>{{item.type_str}}</td>
                  <td>
                    <span>{{item.repository_number}}</span>
                    <b-button v-show="!creatingPHG" v-if="item.type == 1 && item.order_sell_id"
                              variant="outline-success" class="pull-right btn-width-160 ml-2"
                              @click="preparePrintPHG(item)">
                      In phiếu xuất kho
                    </b-button>
                    <span class="loading-more" v-show="creatingPHG"><icon name="loading" width="60" /></span>
                  </td>
                  <td>{{item.product_code}}</td>
                  <td>{{item.product_name}}</td>
                  <td>{{item.brand_name}}</td>
                  <td>{{currencyFormat(item.quantity)}}</td>
                  <td>{{currencyFormat(item.price)}}</td>
                  <td>{{currencyFormat(item.amount)}}</td>
                  <td>{{item.created_by_name}}</td>
                  <td>
                    <i v-if="isUserRoot" class="fa fa-trash" title="Xoá"
                       @click="deleted(item.id, item.repository_number)"/>
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
        <div style="width:100%; height:35px; font-size: 12px;" class="tr-bg">
          <div style="color: #006699; font-size: 18px; float: left; width: 70%; text-align: center; margin-top: 10px;">
            <b>PHIẾU GIAO HÀNG</b>
          </div>
          <div style="float: right; width: 30%; margin-top: 10px; text-align: center">
            <i class="print-text-right">TP.HCM, Ngày {{today_day}} tháng {{today_month}} năm {{today_year}}</i>
          </div>
        </div>
        <div style="width:100%; font-size: 12px; text-align: right; margin-top: 5px; margin-bottom: 5px;">
          <div style="color: #006699; font-size: 18px; float: left; width: 70%; text-align: center;">

          </div>
          <div style="float: right; width: 30%; margin-top: 5px; margin-bottom: 5px; text-align: center">
            <span>Số: {{currentRepository.order_sell_number}}</span>
          </div>
        </div>

        <div class="custom-line-height">
          <table style="width:100%; font-size: 10px">
            <tr class="print-pl-2">
              <td style="width:15%" class="print-no-border print-pl-2 print-text-right">
                <u><b> Tên khách hàng: </b></u>
              </td>
              <td colspan="3" class="print-no-border print-text-left">
                <b><span>{{currentRepository.customer_name}}</span></b>
              </td>
            </tr>
            <tr>
              <td style="width:15%" class="print-no-border print-pl-2 print-text-right">Địa chỉ giao hàng: </td>
              <td colspan="3" class="print-no-border print-text-left">{{currentRepository.receiver_address}}</td>
            </tr>
            <tr>
              <td style="width:15%" class="print-no-border print-pl-2 print-text-right">Người nhận hàng: </td>
              <td style="width:35%" class="print-no-border print-text-left">{{currentRepository.receiver_name}}</td>
              <td style="width:15%" class="print-no-border print-pl-2 print-text-right">Điện thoại: </td>
              <td class="print-no-border print-text-left">{{currentRepository.receiver_phone}}</td>
            </tr>
            <tr>
              <td style="width:15%" class="print-no-border print-pl-2 print-text-right">Ghi chú về giao hàng: </td>
              <td colspan="3" class="print-no-border print-pl-2 print-text-left">{{currentRepository.shipping_note}}</td>
            </tr>
          </table>
        </div>
        <br>
        <div class="print-table-border">
          <table style="width:100%; font-size: 10px" class="custom-line-height">
            <tr class="print-text-center tr-bg" style="background-color: #eeece1">
              <th>STT</th>
              <th>MÃ SẢN PHẨM</th>
              <th>MÔ TẢ SẢN PHẨM</th>
              <th>HÃNG SX</th>
              <th>ĐVT</th>
              <th style="width:50px">SL</th>
              <th>GHI CHÚ</th>
            </tr>
            <tr v-for="(item, index) in currentRepository.products" :key="item.product_id">
              <td class="print-text-center">{{index + 1}}</td>
              <td>{{item.product_code}}</td>
              <td>{{item.product_name}}</td>
              <td class="print-text-center">{{item.brand_name}}</td>
              <td class="print-text-center">{{item.unit_name}}</td>
              <td style="width:50px" class="print-text-center">{{currencyFormat(item.quantity)}}</td>
              <td>{{item.note}}</td>
            </tr>
            <tr>
              <td colspan="5" class="print-text-center"><b>TỔNG CỘNG</b></td>
              <td class="print-text-right"><b>{{currentRepository.total_quantity + ''}}</b></td>
              <td></td>
            </tr>
          </table>
          <div>
            <p style="font-size: 10px"><b>Chứng từ kèm theo:</b></p>
            <p style="font-size: 10px" class="print-pl-2">{{currentRepository.issue_invoice ? '&#8883; Hóa đơn GTGT' : ''}}</p>
          </div>
          <div>
            <p style="font-size: 10px"><b>Liên hệ với Nhân viên kinh doanh khi cần:</b></p>
            <p style="font-size: 10px" class="print-pl-2">&#8883; Tên: {{currentRepository.staff_in_charge_name}}</p>
            <p style="font-size: 10px" class="print-pl-2">&#8883; Điện thoại: {{currentRepository.staff_in_charge_phone}}</p>
            <p style="font-size: 10px" class="print-pl-2">&#8883; Email: {{currentRepository.staff_in_charge_email}}</p>
          </div>

          <br><br>
          <div>
            <table style="width:100%; font-size: 10px">
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

  </div>
</template>
<script>


import repositoryApi from '@/api/repository'
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
        {"value": 4, "text": 'Năm'}
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
      typeOptions: [
        {"value": null, "text": ''},
        {"value": 0, "text": 'Nhập vào'},
        {"value": 1, "text": 'Bán ra'}
      ],
      productBrandOptions:[],
      productGroupOptions:[],
      productGroupSelect: {},
      productTypeSelect:{},
      productTypeOptions:[],
      loadingOptions: false,
      inputs: {
        is_correction: true,
        from_date: '2000-01-01',
        to_date: '2000-01-02',
        type_id: null,
        repository_number: null,
        product_group_id: null,
        product_type_id: null,
        product_brand_id: null,
        product_code: null,
        product_name: null
      },
      items: [],
      excel_items: [],
      excel_fields: {
        'Ngày tạo': 'created_at',
        'Loại hoạt động' : 'type_str',
        'Nhóm SP' : 'product_group_name',
        'Loại SP': 'product_type_name',
        'Mã hàng' : 'product_code',
        'Tên hàng' : 'product_name',
        'Số lượng': 'quantity',
        'Đơn giá': 'price',
        'Thành tiền': 'amount',
        'Người tạo': 'created_by_name',
      },
      isGetExcelItems: false,
      loadByScroll: false,
      onSearch: false,
      hasNext: true,
      loading: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      totalRow: 0,
      currentRepository: {},
      creatingPHG: false,
      today_day: "",
      today_month: "",
      today_year: "",
      isUserRoot: false
    }
  },
  mounted() {
    // Check delete
    if(this.$store.state.user && this.$store.state.user.isRoot) {
        this.isUserRoot = true
    }

    // // Kiểm tra là lịch sử kho hay lịch sử hiệu chỉnh kho kho
    // let url = location.href
    //   console.log("url:" + url)
    // if(url.includes("repo-correction-history")) {
    //   this.inputs.is_correction = true
    //   this.title = 'Lịch Sử Hiệu Chỉnh Kho'
    //   this.btn_input_text = "Thiếu hàng hoá"
    //   this.btn_output_text = "Thừa hàng hoá"
    // } else {
    //   this.inputs.is_correction = false
    //   this.title = 'Lịch Sử Xuất-Nhập Kho'
    //   this.btn_input_text = "Thêm phiếu nhập"
    //   this.btn_output_text = "Thêm phiếu xuất"
    // }

    window.addEventListener('scroll', this.onScroll)

    // Get today day, month, year
    let dateNow = new Date()
    this.today_day = dateNow.getDate()
    this.today_month = dateNow.getMonth() + 1
    this.today_year = dateNow.getFullYear()

    // Get default from date and to date
    this.prepareDateInput()

    // Get options related repository
    this.getOptionRelatedRepository()

    // Search
    this.search()
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

    /**
     * Get options related repository
     */
    getOptionRelatedRepository() {
      this.loadingOptions = true

      let params = {
        product_groups: true,
        product_types: true,
        product_brands: true
      }

      repositoryApi.getOptionsRelatedRepository(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          this.productGroupOptions = options.product_groups
          this.productGroupOptions.unshift({"id": null, "name": "--Tất cả--"})
          this.productTypeOptionStore = JSON.parse(JSON.stringify(options.product_types))
          this.productTypeOptions = options.product_types
          this.productTypeOptions.unshift({"id": null, "name": "--Tất cả--", "product_group_id": null})

          this.productBrandOptions = [{text: "", value: null}]
          let product_brands = options.product_brands
          for(let product_brand of product_brands) {
            this.productBrandOptions.push(product_brand)
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

    changeProductGroup() {
      if(this.productGroupSelect && this.productGroupSelect.id) {
        this.productTypeOptions = [{"id": null, "name": "--Tất cả--", "product_group_id": null}]
        for (let i in this.productTypeOptionStore) {
          if(this.productGroupSelect.id == this.productTypeOptionStore[i].product_group_id) {
            this.productTypeOptions.push(this.productTypeOptionStore[i])
          }
        }
      } else {
        this.productTypeOptions = JSON.parse(JSON.stringify(this.productTypeOptionStore))
          let itemTypeEmpty = {"id": null, "name": "--Tất cả--", "product_group_id": null}
        this.productTypeOptions.unshift(itemTypeEmpty)
      }
      this.productTypeSelect = this.productTypeOptions[0]
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

    async preparePrintPHG(repoHis) {
      if(repoHis && repoHis.id) {
        this.creatingPHG = true
        await this.getRepositoryDetailForPrint(repoHis.id)

        this.creatingPHG = false
        this.printPHG()
      }
    },

    async getRepositoryDetailForPrint(id) {
      await repositoryApi.getRepositoryDetailForPrint(id).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.currentRepository =  res.data.data
        } else {
          this.currentRepository = {}
        }
      }).catch(err => {
        this.currentRepository =  {}
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

    /**
     * Search
     */
    search () {
      if (this.loading) { return }

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
        "is_correction": this.inputs.is_correction,
        "type_id": this.inputs.type_id,
        "from_date": fromDate,
        "to_date": toDate,
        "repository_number": this.inputs.repository_number,
        "product_group_id": this.productGroupSelect.id ? this.productGroupSelect.id: null,
        "product_type_id": this.productTypeSelect.id ? this.productTypeSelect.id: null,
        "product_brand_id": this.inputs.product_brand_id,
        "product_code": this.inputs.product_code,
        "product_name": this.inputs.product_name,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      repositoryApi.getRepositoryHis(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.repository_historys
          this.totalRow = res.data.data.total_row

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

      // Search
      repositoryApi.getRepositoryHis(params).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.excel_items = res.data.data.repository_historys
          this.isGetExcelItems = true
        }
      }).catch(err => {})
    },

    /**
     * Only input date
     */
    inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
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

    goToAddOutput() {
      this.$router.push("/repo-correction-output")
    },
    goToAddInput() {
      this.$router.push("/repo-correction-input")
    },

    deleted (id, name) {
      if(id && name) {
        this.$bvModal.msgBoxConfirm('Xóa phiếu [' + name + "]. Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if(res){
            repositoryApi.deleteRepoHis(id).then(res => {
              this.popToast('success', 'Xoá phiếu [' + name + '] thành công!')
              // Reload data
              this.prepareToSearch()
            }).catch(err => {
              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.popToast('danger', errorMess)
            })
          }
        })
      }
    },

  }
}
</script>

<style lang="scss" scoped>
  .label-width {
    width: 100%;
  }
</style>
