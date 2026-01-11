<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>

          <b-row>
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right btn-width-120 ml-2 mt-1" @click="goToAdd()">
                Thêm BG
              </b-button>

              <b-button variant="outline-success" class="pull-right btn-width-220 ml-2 mt-1" @click="goToAddProject()">
                Thêm BG dự án
              </b-button>

              <b-button variant="outline-primary" class="pull-right btn-width-120 mt-1" @click="showModalSettingQuotation()">
                Cài đặt
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-1 text-center text-header">Danh Sách Báo Giá</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row class="form-row">

            <b-col v-bind:md="userRole == 'admin' ? 2 : 3 ">
              <label> Thời gian </label>
              <b-form-select :options="timeOptions" v-model="time_option"></b-form-select>
            </b-col>

            <b-col v-bind:md="userRole == 'admin' ? 2 : 3 ">
              <label v-show="time_option != 5"> {{time_option == 1 ? 'Từ ngày' : 'Năm' }} </label>
              <!--Thời gian theo ngày-->
              <datepicker v-show="time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
              <!--Thời gian năm-->
              <b-form-select v-show="time_option != 1 && time_option != 5" :options="yearOptions" v-model="year_input"></b-form-select>
            </b-col>

            <b-col v-bind:md="userRole == 'admin' ? 2 : 3 ">
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

            <b-col md="3">
              <label>Trạng thái báo giá</label>
              <b-form-select
                id="status"
                :options="statusOptions"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.status"></b-form-select>
            </b-col>

            <b-col md="3" v-if="userRole == 'admin'">
              <label>Nhân viên phụ trách</label>
              <multiselect
                v-model="inputs.staff_in_charge"
                :options="optionsStaff"
                :loading="loadingOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Tất cả--"
                label="name"
                track-by="name">
              </multiselect>
              </b-col>
          </b-row>

          <b-row class="form-row mt-2">
            <b-col md="2">
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

            <b-col md="2">
              <label>Số báo giá</label>
              <input
              id="quotation_number"
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.quotation_number">
            </b-col>

            <b-col md="2">
              <label>Loại CTY</label>
              <b-form-select
                id="customer_company_type_id"
                :options="optionsCompanyType"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.customer_company_type_id"></b-form-select>
            </b-col>

            <b-col md="6">
              <label>Khách hàng</label>
              <multiselect
                v-model="inputs.customer"
                :options="customerOptionStore"
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
                    worksheet = "Danh sách báo giá"
                    name    = "danh_sach_bao_gia.xls">
                    <b>Xuất Excel</b>
                  </download-excel>
                </b-col>
          </b-row>

          <b-row>
            <b-col md="12" class="table-cus table-fix-header">
              <table class="table table-bordered table-striped fixed_header">
                    <tr>
                      <th style="width:3%">STT</th>
                      <th style="width:8%">Số báo giá</th>
                      <th style="width:5%">NV phụ trách</th>
                      <th style="width:22%">Tên K.H</th>
                      <th style="width:8%">Người liên hệ</th>
                      <th style="width:8%">SĐT liên hệ</th>
                      <th style="width:8%">Tổng tiền SP</th>
                      <th style="width:8%">Thành tiền</th>
                      <th style="width:8%">Lợi nhuận</th>
                      <th style="width:8%">Ngày BG</th>
                      <th style="width:6%">Trạng thái BG</th>
                      <th style="width:8%"></th>
                    </tr>
                    <tr v-for="(item) in items" v-bind:class="item.row_class">
                      <td>{{item.stt}}</td>
                      <td>
                        <a v-if="item.type == 0" :href="'/quotation-' + scope + '/detail/' + item.id" target="_blank" title="Chi tiết báo giá">
                          {{item.quotation_number}}
                        </a>
                        <a v-if="item.type == 1" :href="'/quotation-project-' + scope + '/detail/' + item.id" target="_blank" title="Chi tiết báo giá">
                          {{item.quotation_number}}
                        </a>
                        <b-button variant="outline-success" @click="showModalCopyQuotation(item)" title="Copy báo giá">
                          <i class="fa fa-copy ml-1"/>
                        </b-button>
                      </td>
                      <td>{{item.staff_on_charge_name}}</td>
                      <td style="width: 100px !important;">{{item.customer_name}}</td>
                      <td>{{item.contact_person_name}}</td>
                      <td>{{item.contact_person_phone}}</td>
                      <td class="text-right">{{currencyFormat(item.sub_total)}}</td>
                      <td class="text-right">{{currencyFormat(item.total)}}</td>
                      <td class="text-right">{{currencyFormat(item.profit)}}</td>
                      <td>{{item.created_at}}</td>
                      <td v-bind:class="item.item_class">
                        {{item.status_str}}
                        <i v-if="item.status == 0" class="fa fa-edit" @click="showModalUpdateQuotationStatus(item)"
                           title="Cập nhật trạng thái BG"/>
                      </td>
                      <td>
                        <div class="input-group">
                          <b-button v-show="item.status == -1" variant="outline-primary" class="mr-2 mt-1"
                                    @click="goToUpdate(item.id, item.type)">
                            Sửa
                          </b-button>
                          <b-button v-show="item.status == -1 && userRole == 'admin'" variant="outline-danger" class="mr-2 mt-1"
                                    @click="deleteQuotation(item.id, item.customer_name)">
                            Xóa
                          </b-button>
                          <b-button v-show="item.status == 0" variant="outline-primary" class="mr-2"
                                    @click="goToOrderSell(item.id, item.count_order_sell)">
                            Tạo đơn hàng
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

    <!--Modal tìm kiếm khách hàng -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-change-quotation-status">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Cập nhật trạng thái báo giá</h4>
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
          <label> Cập nhật thành: Báo giá lưu nháp</label>
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

    <!-- Modal copy báo giá -->
    <b-modal centered hide-footer hide-header size="lg" id="modal-copy-quotation">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center">Đang copy báo giá:
            <b class="text-success">{{copyQuotation.quotation_number}}</b>
          </h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="12">
          <span class="loading-more" v-show="loadingCopy"><icon name="loading" width="60" /></span>
        </b-col>
      </b-row>

    </b-modal>

    <!--Modal cài đặt báo giá -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-setting-quotation">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Cài Đặt Báo Giá</h4>
        </b-col>
      </b-row>
      <hr>

      <div class="form-group">
        <label>Số ngày sẽ xuất hiện cảnh báo nếu quá hạn báo giá<span class="error-sybol"></span></label>
        <div class="input-group">
          <input
            id="number_of_days_overdue_quote"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="number_of_days_overdue_quote"
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
      year_input: 2024,
      quarter_input: 1,
      month_input: 1,
      statusOptions: [
        {"value": null, "text": '-- Tất cả --'},
        {"value": -1, "text": 'Báo giá lưu nháp'},
        {"value": 0, "text": 'Báo giá mới lập'},
        {"value": 1, "text": 'Báo giá đã thành công'},
        {"value": 2, "text": 'Báo giá đã rớt'}
      ],
      optionsCompanyType: [
        {value: null, text: ''},
        {value: 0, text: 'Khách lẻ'},
        {value: 1, text: 'Thương mại'},
        {value: 2, text: 'Nhà máy'},
        {value: 3, text: 'Công Trình'}
      ],
      optionsStaff: [],
      customerOptionStore: [],
      brandOptions: [],
      loadingOptions: false,
      inputs: {
        status: null,
        staff_in_charge: null,
        quotation_number: null,
        brand: null,
        customer: null,
        from_date: '2000-01-01',
        to_date: '2000-01-02'
      },
      items: [],
      excel_items: [],
      currentQuotation: {},
      copyQuotation: {},
      statusChange: -1,
      reason_falling_note: null,
      onChangeStatus: false,
      loadByScroll: false,
      onSearch: false,
      hasNext: true,
      loading: false,
      loadingCopy: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      totalRow: 0,
      columnNumber: 5,
      userRole: "admin",
      scope: "all",
      excel_fields: {
        'Mã báo giá': 'quotation_number',
        'Nhân viên phụ trách': 'staff_on_charge_name',
        'Tổng tiền sản phẩm' : 'sub_total',
        'Tổng tiền SP' : 'sub_total',
        'Thành tiền' : 'total',
        'Giảm Giá' : 'fixed_discount',
        'Thành Tiền' : 'total',
        'Lợi nhuận' : 'profit',
        'Ngày báo giá' : 'created_at',
        'Trạng thái báo giá' : 'status_str'
      },
      isGetExcelItems: false,
      number_of_days_overdue_quote: 3,
      onChangeSetting: false,

    }
  },
  mounted() {
    // UI by staff
    let url = location.href
    if(url.includes("quotation-staff")) {
      this.columnNumber = 4
      this.userRole = "staff"
      this.scope = "staff"
    } else {
        this.columnNumber = 5
        this.userRole = "admin"
    }

    // Get default from date and to date
    this.prepareDateInput()

    window.addEventListener('scroll', this.onScroll)

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
        console.log("this.userRole: " + this.userRole)
        this.loadingOptions = true
        let params = {
          brands: true
        }
        if(this.userRole == "staff") {
          params.customer_by_staff = true
        } else {
          params.customer_by_admin = true
          params.staffs = true
        }

      quotationApi.getOptionRelatedQuotationList(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {

          this.customerOptionStore = res.data.data.customers
          let itemEmpty = {"id": null, "name": '-- Tất cả --'}
          this.customerOptionStore.unshift(itemEmpty)

          this.brandOptions = res.data.data.brands
          let itemBrandEmpty = {"id": null, "name": '-- Tất cả --'}
          this.brandOptions.unshift(itemBrandEmpty)

          this.optionsStaff = res.data.data.staffs
          let itemStaffEmpty = {"id": null, "name": '-- Tất cả --'}
          this.optionsStaff.unshift(itemStaffEmpty)
        }

        this.loadingOptions = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loadingOptions = false
      })
    },

      /**
       * Go to add
       */
      goToAdd() {
          console.log("this.userRole: " + this.userRole)
          if(this.userRole == "staff") {
              this.$router.push('/quotation-staff/index')
          } else {
              this.$router.push('/quotation-all/index')
          }
      },

    goToAddProject() {
        console.log("this.userRole: " + this.userRole)
        if(this.userRole == "staff") {
            this.$router.push('/quotation-project-staff/index')
        } else {
            this.$router.push('/quotation-project-all/index')
        }
    },

        /**
       * Go to update
       */
      goToUpdate(id, type) {
          console.log("this.userRole: " + this.userRole)
          if(this.userRole == "admin") {
              if(type == 0) {
                this.$router.push('/quotation-all/index/' + id)
              } else {
                this.$router.push('/quotation-project-all/index/' + id)
              }
          } else {
              if(type == 0) {
                this.$router.push('/quotation-staff/index/' + id)
              } else {
                this.$router.push('/quotation-project-staff/index/' + id)
              }
          }
      },

      /**
       * Go to update
       */
      goToOrderSell(id, count_order_sell) {
        if(id) {
          if(count_order_sell) {
            this.$bvModal.msgBoxConfirm('Báo giá này đã lập đơn hàng bán, bạn có muốn tạo thêm đơn hàng bán từ báo giá này không? ', {
              title: false,
              buttonSize: 'sm',
              centered: true, size: 'sm',
              footerClass: 'p-2'
            }).then(res => {
              if(res){
                console.log("this.userRole: " + this.userRole)
                if(this.userRole == "staff") {
                    this.$router.push('/order-sell-by-quotation-staff/' + id)
                } else {
                    this.$router.push('/order-sell-by-quotation/' + id)
                }
              }
            })
          } else {
            console.log("this.userRole: " + this.userRole)
            if(this.userRole == "staff") {
                this.$router.push('/order-sell-by-quotation-staff/' + id)
            } else {
                this.$router.push('/order-sell-by-quotation/' + id)
            }
          }

        }
      },

      showModalCopyQuotation(quotation) {
          this.copyQuotation = quotation
          this.$bvModal.show('modal-copy-quotation')

          this.loadingCopy = true
          quotationApi.copyQuotation(quotation.id).then(res => {
            if (res != null && res.data != null && res.data.data != null) {
                this.$bvModal.hide('modal-copy-quotation')
                console.log("this.userRole: " + this.userRole)
                if(this.userRole == "admin") {
                    this.$router.push('/quotation-all/index/' + res.data.data)
                } else {
                    this.$router.push('/quotation-staff/index/' + res.data.data)
                }
            } else {
                this.popToast('danger', "Có lỗi xảy ra trong quá trình copy")
            }
            this.loadingCopy = false
          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)

            this.onChangeStatus = false
          })
      },

      showModalUpdateQuotationStatus(quotation) {
          this.currentQuotation = quotation
          this.$bvModal.show('modal-change-quotation-status')
      },

      hideModalUpdateQuotationStatus() {
          this.$bvModal.hide('modal-change-quotation-status')
      },

    showModalSettingQuotation() {
          this.$bvModal.show('modal-setting-quotation')
      },

      hideModalSettingQuotation() {
          this.$bvModal.hide('modal-setting-quotation')
      },

    confirmChangeSettingQuotation() {
      if (this.onChangeSetting) { return }

      if (!this.number_of_days_overdue_quote) {
        this.popToast('danger', "Vui lòng nhập giá trị [Số ngày sẽ xuất hiện cảnh báo nếu quá hạn báo giá]")
        return
      }

      this.onChangeSetting = true
      let params = {
        code: "number_of_days_overdue_quote",
        value: this.number_of_days_overdue_quote,
        group: "quotation"
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

    getQuotationSetting() {
      let params = {
        group: "quotation"
      }
      settingApi.getSettingByGroup(params).then(res => {
        if (res != null && res.data != null) {
          let settings = res.data.data

          for(let setting of settings) {
            if(setting.code == 'number_of_days_overdue_quote') {
              this.number_of_days_overdue_quote = setting.value
              break
            }
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
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
        "status": this.inputs.status,
        "staff_in_charge": this.inputs.staff_in_charge && this.inputs.staff_in_charge.id ? this.inputs.staff_in_charge.id : null,
        "brand_id": this.inputs.brand && this.inputs.brand.id ? this.inputs.brand.id : null,
        "customer_id": this.inputs.customer ? this.inputs.customer.id : null,
        "customer_company_type_id": this.inputs.customer_company_type_id,
        "quotation_number": this.inputs.quotation_number,
        "from_date": fromDate,
        "to_date": toDate,
        "limit": this.pageLimit,
        "offset": this.offset
      }
      console.log("this.userRole: " + this.userRole)
      quotationApi.searchQuotationAll(params, this.userRole).then(res => {
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

    getExcelItem(params) {
      if(this.isGetExcelItems) {
        return;
      }

      this.excel_items = []

      // Define params
      params.limit = 999999

      console.log("this.userRole: " + this.userRole)

      // Search
      quotationApi.searchQuotationAll(params, this.userRole).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.excel_items = res.data.data.quotations
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
    deleteQuotation(id, name) {
      console.log("this.userRole: " + this.userRole)
      if(this.userRole == 'staff') {
        this.popToast('danger', "Bạn không được quyền thực hiện chức năng này!")
        return
      }
      if(id) {
        this.$bvModal.msgBoxConfirm('Xóa báo giá cho K.H [' + name + "]. Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if (res) {

            quotationApi.deleteQuotation(id, this.userRole).then(res => {
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
