<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>

          <b-row>
            <b-col md='12'>
              <b-button variant="outline-primary" class="pull-right btn-width-120" @click="showModalSettingQuotation()">
                Cài đặt
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-1 text-center text-header">Danh Sách Chăm Sóc Khách Hàng</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row class="form-row">
            <b-col md="2">
              <label> Thời gian </label>
              <b-form-select :options="timeOptions" v-model="time_option" ></b-form-select>
            </b-col>

            <b-col md="2">
              <label v-show="time_option != 5">
                {{time_option == 1 ? 'Từ ngày' : 'Năm' }}
              </label>
              <!--Thời gian theo ngày-->
              <datepicker v-show="time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd" input-class="datepicker-cus"></datepicker>
              <!--Thời gian năm-->
              <b-form-select v-show="time_option != 1 && time_option != 5" :options="yearOptions" v-model="year_input"></b-form-select>
            </b-col>

            <b-col md="2">
              <label v-show="time_option == 1 || time_option == 2 || time_option == 3">
                {{time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý' }}
              </label>

              <!--Thời gian theo ngày-->
              <datepicker v-show="time_option == 1" v-model="inputs.to_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd" input-class="datepicker-cus"></datepicker>

              <!--Thời gian tháng -->
              <b-form-select v-show="time_option == 2" :options="monthOptions" v-model="month_input"></b-form-select>

              <!--Thời gian quý -->
              <b-form-select v-show="time_option == 3" :options="quarterOptions" v-model="quarter_input"></b-form-select>
            </b-col>

            <b-col md="3">
              <label>Hãng sản phẩm</label>
              <multiselect
                v-model="inputs.brand"
                :options="brandOptions"
                :loading="loadingOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Tất cả--"
                label="name"
                track-by="name">
              </multiselect>
            </b-col>

            <b-col md="3">
              <label>Hạn báo giá</label>
              <b-form-select
                id="expire_status"
                :options="expireStatusOptions"
                v-model="inputs.expire_status"
                type="text"
                class="form-control"
              ></b-form-select>
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="3" v-if="userRole == 'admin'">
              <label>NV phụ trách</label>
              <b-form-select
                id="created_by"
                :options="optionsStaff"
                v-model="inputs.staff_in_charge"
                type="text"
                class="form-control"
              ></b-form-select>
            </b-col>

            <b-col v-bind:md="userRole == 'admin' ? 3: 4">
              <label>Trạng thái BG</label>
              <b-form-select
                id="status"
                :options="statusOptions"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.status"></b-form-select>
            </b-col>

            <b-col v-bind:md="userRole == 'admin' ? 3: 4">
              <label>Tình trạng chăm sóc</label>
              <b-form-select :options="careStatusOptions" v-model="inputs.care_status"></b-form-select>
            </b-col>

            <b-col v-bind:md="userRole == 'admin' ? 3: 4">
              <label>Tình trạng khách</label>
              <b-form-select :options="customerStatusOptions" v-model="inputs.customer_status"></b-form-select>
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
            <b-col md="8" class="text-right" v-if="userRole == 'admin' && excel_items.length > 0">
              <download-excel
                class   = "btn btn-default text-header"
                :data   = "excel_items"
                :fields = "excel_fields"
                worksheet = "Danh sách chăm sóc báo giá"
                name    = "danh_sach_cham_soc_bao_gia.xls">
                <b>Xuất Excel</b>
              </download-excel>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="12" class="table-cus">
              <table class="table table-bordered table-striped fixed_header">
                    <tr>
                      <th style="width:3%">STT</th>
                      <th style="width:7%">Số BG</th>
                      <th style="width:6%">Ngày BG</th>
                      <th style="width:6%">NV phụ trách</th>
                      <th style="width:11%">Tên K.H</th>
                      <th style="width:6%">Tình trạng K.H</th>
                      <th style="width:6%">Loại Cty</th>
                      <th style="width:6%">Tổng tiền SP</th>
                      <th style="width:7%">Người liên hệ</th>
                      <th style="width:7%">SĐT liên hệ</th>
                      <th style="width:7%">Trạng thái BG</th>
                      <th style="width:10%">KQ chăm sóc lần 1</th>
                      <th style="width:10%">KQ chăm sóc lần 2</th>
                      <th style="width:8%">Nhóm sản phẩm</th>
                    </tr>
                    <tr v-for="(item) in items" v-bind:class="item.row_class">
                      <td>{{item.stt}}</td>
                      <td>
                        <a :href="'/quotation-' + scope + '/detail/' + item.quotation_id" target="_blank" title="Chi tiết báo giá">
                          {{item.quotation_number}}
                        </a>
                      </td>
                      <td>{{item.created_at}}</td>
                      <td>{{item.staff_in_charge_name}}</td>
                      <td style="width: 100px !important;">{{item.customer_name}}</td>
                      <td>{{item.customer_status_str}}</td>
                      <td>{{item.customer_company_type_name}}</td>
                      <td class="text-right">{{currencyFormat(item.sub_total)}}</td>
                      <td>{{item.contact_person_name}}</td>
                      <td>{{item.contact_person_phone}}</td>
                      <td v-bind:class="item.item_class">
                        {{item.status_str}}
                        <i v-if="item.status == 0" class="fa fa-edit" @click="showModalUpdateQuotationStatus(item)"
                           title="Cập nhật trạng thái BG"/>
                        <br>
                        {{item.status == 2 ? item.updated_reason_falling_note_at + ': ' + item.reason_falling_note : ''}}
                      </td>
                      <td>
                        <i class="fa fa-edit" @click="showModalUpdateNote(item, 1)" title="Cập nhật kết quả chăm sóc báo giá lần 1"/>
                        {{item.note_1st ? item.updated_note_1st_at + ': ' + item.note_1st : item.note_1st}}
                      </td>
                      <td>
                        <i class="fa fa-edit" @click="showModalUpdateNote(item, 2)" title="Cập nhật kết quả chăm sóc báo giá lần 2"/>
                        {{item.note_2st ? item.updated_note_2st_at + ': ' + item.note_2st : item.note_2st}}
                      </td>
                      <td>
                        <i class="fa fa-edit" @click="showModalUpdateProductGroupNote(item)" title="Cập nhật ghi chú nhóm SP"/>
                        {{item.product_group_note}}
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

    <!--Modal cập nhật kết quả chăm sóc báo giá lần 1 -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-change-note">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Cập nhật kết quả chăm sóc báo giá lần {{currentQuotation.note_number}}</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="12">
          <label> Mã báo giá: {{currentQuotation.quotation_number}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Tên khách hàng: {{currentQuotation.customer_name}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Trạng thái báo giá: {{currentQuotation.status_str}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Kết quả chăm sóc báo giá lần {{currentQuotation.note_number}}: </label>
          <b-form-textarea
                    id="note_input_change"
                    rows="5"
                    v-model="note_input_change"
                  ></b-form-textarea>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalChangeNote">
            Quay lại
          </b-button>

          <b-button v-show="!onChangeNote" variant="outline-primary" class="pull-right btn-width-120"
                    :disabled="onChangeNote" @click.prevent="confirmChangeNote">
            Xác nhận
          </b-button>

          <span class="loading-more" v-show="onChangeNote"><icon name="loading" width="60" /></span>
        </b-col>
      </b-row>

    </b-modal>

    <!--Modal cập nhật kết quả chăm sóc báo giá lần 1 -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-change-product-group-note">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Cập nhật ghi chú nhóm sản phẩm</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="12">
          <label> Mã báo giá: {{currentQuotation.quotation_number}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Tên khách hàng: {{currentQuotation.customer_name}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Ghi chú nhóm sản phẩm: </label>
          <b-form-textarea
                    id="note_input_change"
                    rows="5"
                    v-model="product_group_note"
                  ></b-form-textarea>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalChangeProductGroupNote">
            Quay lại
          </b-button>

          <b-button v-show="!onChangeProductGroupNote" variant="outline-primary" class="pull-right btn-width-120"
                    :disabled="onChangeProductGroupNote" @click.prevent="confirmChangeProductGroupNote">
            Xác nhận
          </b-button>

          <span class="loading-more" v-show="onChangeProductGroupNote"><icon name="loading" width="60" /></span>
        </b-col>
      </b-row>

    </b-modal>

    <!--Modal tìm kiếm khách hàng -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-change-quotation-status">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-danger">Cập nhật trạng thái báo giá rớt</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="12">
          <label> Mã báo giá: {{currentQuotation.quotation_number}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Tên khách hàng: {{currentQuotation.customer_name}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Trạng thái hiện tại: {{currentQuotation.status_str}} </label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Cập nhật thành: Báo giá rớt</label>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Lý do rớt báo giá<span class="error-sybol"></span>: </label>
          <b-form-textarea
            id="reason_falling_note"
            rows="3"
            v-model="reason_falling_note"
          ></b-form-textarea>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalUpdateQuotationStatus">
            Quay lại
          </b-button>

          <b-button v-show="!onChangeStatus" variant="outline-primary" class="pull-right btn-width-120"
                    :disabled="onChangeStatus" @click.prevent="confirmChangeStatus">
            Xác nhận
          </b-button>

          <span class="loading-more" v-show="onChangeStatus"><icon name="loading" width="60" /></span>
        </b-col>
      </b-row>

    </b-modal>

    <!--Modal cài đặt báo giá -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-setting-quotation">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Cài Đặt Chăm Sóc Báo Giá</h4>
        </b-col>
      </b-row>
      <hr>

      <div class="form-group">
        <label>Số ngày sẽ xuất hiện cảnh báo nếu quá hạn báo giá lần 1<span class="error-sybol"></span></label>
        <div class="input-group">
          <input
            id="number_of_days_overdue_quote_care_1"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="number_of_days_overdue_quote_care_1"
            maxlength="5">
        </div>
      </div>

      <div class="form-group">
        <label>Số ngày sẽ xuất hiện cảnh báo nếu quá hạn từ báo giá lần 1 tới báo giá lần 2<span class="error-sybol"></span></label>
        <div class="input-group">
          <input
            id="number_of_days_overdue_quote_care_2"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="number_of_days_overdue_quote_care_2"
            maxlength="5">
        </div>
      </div>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalSettingQuotation">
            Quay lại
          </b-button>

          <b-button v-show="!onChangeSetting" variant="outline-primary" class="pull-right btn-width-120"
                    :disabled="onChangeSetting" @click.prevent="confirmChangeSettingQuotation">
            Lưu
          </b-button>

          <span class="loading-more" v-show="onChangeSetting"><icon name="loading" width="60" /></span>
        </b-col>
      </b-row>

    </b-modal>

  </div>
</template>
<script>
import quotationApi from '@/api/quotation'
import settingApi from '@/api/setting'
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
        {"value": null, "text": '-- Tất cả --'},
        {"value": 0, "text": 'Báo giá mới lập'},
        {"value": 1, "text": 'Báo giá đã thành công'},
        {"value": 2, "text": 'Báo giá đã rớt'}
      ],
      optionsStaff: [],
      customerStatusOptions: [
        {value: null, text: '-- Tất cả --'},
        {value: 1, text: 'Khách mới'},
        {value: 2, text: 'Khách cũ'}
      ],
      careStatusOptions: [
        {value: null, text: '-- Tất cả --'},
        {value: 0, text: 'Chưa chăm sóc'},
        {value: 1, text: 'Đã chăm sóc lần 1'},
        {value: 2, text: 'Đã chăm sóc lần 2'}
      ],
      expireStatusOptions: [
        {value: null, text: '-- Tất cả --'},
        {value: 0, text: 'Chưa quá hạn'},
        {value: 1, text: 'Đã quá hạn'}
      ],
      brandOptions: [],
      loadingOptions: false,
      inputs: {
        staff_in_charge: null,
        status: null,
        brand: {},
        customer_status: null,
        care_status: null,
        expire_status: null,
        from_date: '2000-01-01',
        to_date: '2000-01-02'
      },
      items: [],
      currentQuotation: {},
      statusChange: 2,
      reason_falling_note: null,
      onChangeStatus: false,
      note_input_change: null,
      product_group_note: null,
      onChangeNote: false,
      onChangeProductGroupNote: false,
      loadByScroll: false,
      onSearch: false,
      hasNext: true,
      loading: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      totalRow: 0,
      userRole: "admin",
      scope: "all",
      isUserRoot: false,
      excel_items: [],
      excel_fields: {
        'STT': 'stt',
        'Số BG' : 'quotation_number',
        'Ngày BG': 'created_at',
        'NV phụ trách': 'staff_in_charge_name',
        'Tên K.H': 'customer_name',
        'Tình trạng khách' : 'customer_status_str',
        'Loại Cty': 'customer_company_type_name',
        'Tổng tiền SP' : 'sub_total',
        'Người liên hệ' : 'contact_person_name',
        'SĐT liên hệ' : {
          field: "contact_person_phone",
          callback: (value) => {
              if(value) {
                  return "'" + value
              }
            return value
          }
        },
        'Trạng thái BG' : 'status_str',
        'Kết quả chăm sóc lần 1' : 'note_1st',
        'Kết quả chăm sóc lần 2' : 'note_2st',
        'Nhóm sản phẩm': 'product_group_note'
      },
      isGetExcelItems: false,
      number_of_days_overdue_quote_care_1: 3,
      number_of_days_overdue_quote_care_2: 6,
      onChangeSetting: false,
    }
  },
  mounted() {
    // UI by staff
    let url = location.href
    if(url.includes("quotation-care-staff")) {
      this.userRole = "staff"
      this.scope = "staff"
    } else {
        this.userRole = "admin"
        this.scope = "all"
    }

    // Check download excel
    if(this.$store.state.user && this.$store.state.user.isRoot) {
        this.isUserRoot = true
    } else {
        this.isUserRoot = false
    }

    // Get default from date and to date
    this.prepareDateInput()

    window.addEventListener('scroll', this.onScroll)

    // Get list option
    this.getOptionsRelated()

    // Search
    this.prepareToSearch()

    // Get quotation setting
    this.getQuotationSetting()
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
        let currentYear = new Date().getFullYear()
        this.year_input = currentYear
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
        this.loadingOptions = true
        let params = {
          brands: true
        }
        if(this.userRole != "staff") {
          params.staffs = true
        }

      quotationApi.getOptionRelatedQuotation(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {

          this.optionsStaff = [{value: null, text: ''}]
          let staffs = res.data.data.staffs
          if(staffs) {
            for (let i in staffs) {
              this.optionsStaff.push({value: staffs[i].id, text: staffs[i].name})
            }
          }

          this.brandOptions = res.data.data.brands
          let itemBrandEmpty = {"id": null, "name": '--Tất cả--'}
          this.brandOptions.unshift(itemBrandEmpty)

        }

        this.loadingOptions = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loadingOptions = false
      })
    },

    getQuotationSetting() {
      let params = {
        group: "quotation"
      }
      settingApi.getSettingByGroup(params).then(res => {
        if (res != null && res.data != null) {
          let settings = res.data.data

          for(let setting of settings) {
            if(setting.code == 'number_of_days_overdue_quote_care_1') {
              this.number_of_days_overdue_quote_care_1 = setting.value
            }
            if(setting.code == 'number_of_days_overdue_quote_care_2') {
              this.number_of_days_overdue_quote_care_2 = setting.value
            }
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

      showModalUpdateProductGroupNote(quotation) {
        this.currentQuotation = quotation
        this.product_group_note = quotation.product_group_note
        this.$bvModal.show('modal-change-product-group-note')
      },

      showModalUpdateNote(quotation, note_number) {
          this.currentQuotation = quotation
          this.currentQuotation.note_number = note_number
          if(note_number == 1) {
              this.note_input_change = this.currentQuotation.note_1st
          }
          if(note_number == 2) {
              if(!quotation.note_1st) {
                  this.popToast('danger', "Chỉ có thể nhập [Kết quả chăm sóc lần 2] khi đã nhập lần 1")
                  return
              }
              this.note_input_change = this.currentQuotation.note_2st
          }
          this.$bvModal.show('modal-change-note')
      },

    changeTimeOption() {
      let dateNow = new Date()

      if(this.time_option == 1) {
        this.time_text = 'ngày'
        this.time_format = 'yyyy-MM-dd'

        this.inputs.to_date = dateNow.toJSON().slice(0,10)
        this.inputs.from_date = new Date(dateNow.setDate(dateNow.getDate() - 30))
        return
      }
      if(this.time_option == 2) {
        this.time_text = 'tháng'
        this.time_format = 'yyyy-MM'

        this.inputs.to_date = dateNow.toJSON().slice(0,10)
        this.inputs.from_date = dateNow.toJSON().slice(0,8) + '01'

        return
      }
      if(this.time_option == 3) {
        this.time_text = 'quý'
        this.time_format = 'yyyy-MM'

        let timeByQuarter = commonFunc.getFromDateToDateByQuarter()
        this.inputs.to_date = timeByQuarter.toDate
        this.inputs.from_date = timeByQuarter.fromDate

        return
      }
      if(this.time_option == 4) {
        this.time_text = 'năm'
        this.time_format = 'yyyy'

        this.inputs.to_date = dateNow.toJSON().slice(0,10)
        this.inputs.from_date = dateNow.toJSON().slice(0,5) + '01-01'

        return
      }
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

      hideModalChangeNote() {
        this.$bvModal.hide('modal-change-note')
      },

      hideModalChangeProductGroupNote() {
        this.$bvModal.hide('modal-change-product-group-note')
      },

    confirmChangeNote() {
      // this.click = true
      if (this.onChangeNote) { return }

      if(!this.note_input_change || !this.note_input_change.trim()) {
          this.popToast('danger', "Vui lòng nhập [Kết quả chăm sóc báo giá]")
          return
      }

      this.onChangeNote = true
      let params = {
        "id": this.currentQuotation.id,
        "note_number": this.currentQuotation.note_number,
        "note_input_change": this.note_input_change
      }
      console.log("this.userRole: " + this.userRole)
      quotationApi.updateQuotationCustomerCare(params, this.userRole).then(res => {
        if (res != null && res.data != null) {
            this.$bvModal.hide('modal-change-note')
            // this.prepareToSearch()
            // Update note: nhóm sản phẩm
            for(let item of this.items) {
              if(item.id == this.currentQuotation.id) {
                if(this.currentQuotation.note_number == 1) {
                  item.note_1st = this.note_input_change
                } else {
                  item.note_2st = this.note_input_change
                }
                break
              }
            }
        }
        this.onChangeNote = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onChangeNote = false
      })
    },

    confirmChangeProductGroupNote() {
      // this.click = true
      if (this.onChangeProductGroupNote) { return }

      if(!this.product_group_note || !this.product_group_note.trim()) {
          this.popToast('danger', "Vui lòng nhập [Ghi chú nhóm sản phẩm]")
          return
      }

      this.onChangeProductGroupNote = true
      let params = {
        "id": this.currentQuotation.id,
        "product_group_note": this.product_group_note
      }
      console.log("this.userRole: " + this.userRole)
      quotationApi.updateProductGroupNote(params, this.userRole).then(res => {
        if (res != null && res.data != null) {
            this.$bvModal.hide('modal-change-product-group-note')
            // this.prepareToSearch()
            // Update note: nhóm sản phẩm
            for(let item of this.items) {
                if(item.id == this.currentQuotation.id) {
                    item.product_group_note = this.product_group_note
                    break
                }
            }
        }
        this.onChangeProductGroupNote = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onChangeProductGroupNote = false
      })
    },

    /**
     * Search
     */
    search () {
      // this.click = true
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
        "staff_in_charge": this.inputs.staff_in_charge,
        "status": this.inputs.status,
        "brand_id": this.inputs.brand && this.inputs.brand.id ? this.inputs.brand.id : null,
        "customer_status": this.inputs.customer_status,
        "care_status": this.inputs.care_status,
        "expire_status": this.inputs.expire_status,
        "from_date": fromDate,
        "to_date": toDate,
        "limit": this.pageLimit,
        "offset": this.offset
      }
      console.log("this.userRole: " + this.userRole)
      quotationApi.searchQuotationCustomerCare(params, this.userRole).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.quotations
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

    getExcelItem (params) {
      if(this.isGetExcelItems) {
        return;
      }
        console.log("this.userRole: " + this.userRole)
        if(this.userRole != 'admin') {
            return
        }
        this.excel_items = []

        params.limit = 999999

      quotationApi.searchQuotationCustomerCare(params, this.userRole).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.excel_items = res.data.data.quotations
          this.isGetExcelItems = true
        }else{
          this.excel_items = []
        }
      }).catch(err => {
      })
    },

      /**
   * Currency format
   */
    currencyFormat(num) {
      let result = ""
        if(num === 0) {
          return 0
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

    showModalUpdateQuotationStatus(quotation) {
        this.currentQuotation = quotation
        this.$bvModal.show('modal-change-quotation-status')
    },

    hideModalUpdateQuotationStatus() {
        this.$bvModal.hide('modal-change-quotation-status')
    },

    confirmChangeStatus() {
      // this.click = true
      if (this.onChangeStatus) { return }

      if(this.statusChange == this.currentQuotation.status) {
          return
      }

      if(!this.reason_falling_note) {
        this.popToast('danger', "Mục [Lý do rớt báo giá] là mục bắt buộc nhập")
        return
      }

      if(!this.currentQuotation.note_1st || !this.currentQuotation.note_2st) {
        this.popToast('danger', "Mục lòng nhập đủ kết quả chăm sóc lần 1 và lần 2")
        return
      }

      this.onChangeStatus = true
      let params = {
        "quotation_id": this.currentQuotation.quotation_id,
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

    showModalSettingQuotation() {
          this.$bvModal.show('modal-setting-quotation')
      },

      hideModalSettingQuotation() {
          this.$bvModal.hide('modal-setting-quotation')
      },

    confirmChangeSettingQuotation() {
      if (this.onChangeSetting) { return }

      if (!this.number_of_days_overdue_quote_care_1) {
        this.popToast('danger', "Vui lòng nhập giá trị [Số ngày sẽ xuất hiện cảnh báo nếu quá hạn báo giá lần 1]")
        return
      }
      if (!this.number_of_days_overdue_quote_care_2) {
        this.popToast('danger', "Vui lòng nhập giá trị [Số ngày sẽ xuất hiện cảnh báo nếu quá hạn từ báo giá lần 1 tới báo giá lần 2]")
        return
      }

      this.onChangeSetting = true
      let params = {
        is_multiple: true,
        items: [
          {
            code: "number_of_days_overdue_quote_care_1",
            value: this.number_of_days_overdue_quote_care_1,
            group: "quotation"
          },
          {
            code: "number_of_days_overdue_quote_care_2",
            value: this.number_of_days_overdue_quote_care_2,
            group: "quotation"
          }
        ]

      }
      settingApi.updateStoreSetting(params).then(res => {
        if (res != null && res.data != null) {
            this.hideModalSettingQuotation()
            this.prepareToSearch()
        }
        this.onChangeSetting = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onChangeSetting = false
      })
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
