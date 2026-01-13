<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col>
                <b-button variant="outline-success" class="pull-right btn-width-120" @click="goToAdd">
                  Thêm
                </b-button>

                <b-button variant="outline-primary" class="pull-right btn-width-120 mr-2" @click="openModalImportFile">
                  Upload
                </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center text-header">Danh Sách Khách Hàng</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row>
            <b-col v-bind:md="userRole == 'admin' ? 3: 4">
              <label> Loại khách hàng </label>
              <b-form-select
                id="city_id"
                :options="optionsType"
                v-model="inputs.type"
                type="text"
                class="form-control"
              ></b-form-select>
            </b-col>

            <b-col v-bind:md="userRole == 'admin' ? 3: 4">
              <label> Tỉnh/Thành Phố </label>
              <b-form-select
                id="city_id"
                :options="optionsCity"
                v-model="inputs.city_id"
                type="text"
                class="form-control"
              ></b-form-select>
            </b-col>

            <b-col  v-bind:md="userRole == 'admin' ? 3: 4">
              <label> Số điện thoại/Mã số thuế </label>
              <input
              id="price"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.phone"
              maxlength="20"
              placeholder="Mã K.H, SĐT, SĐT người liên hệ"
              @keyup="integerOnly($event.target)">
            </b-col>

            <b-col md="3">
              <label> Tên </label>
              <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.name"
              maxlength="75">
            </b-col>
          </b-row>

          <b-row>
            <b-col v-bind:md="userRole == 'admin' ? 3: 4" v-if="userRole == 'admin'">
              <label> Nhân viên phụ trách </label>
              <b-form-select
                id="created_by"
                :options="optionsStaff"
                v-model="inputs.staff_in_charge"
                type="text"
                class="form-control"
              ></b-form-select>
            </b-col>

            <b-col md="3">
              <label>Thời gian</label>
              <b-form-select :options="timeOptions" v-model="time_option" ></b-form-select>
            </b-col>

            <b-col md="3">
              <label v-show="time_option != 5">
                {{time_option == 1 ? 'Từ ngày' : 'Năm' }}
              </label>
              <!--Thời gian theo ngày-->
              <datepicker v-show="time_option == 1" v-model="inputs.created_from" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
              <!--Thời gian năm-->
              <b-form-select v-show="time_option != 1 && time_option != 5" :options="yearOptions" v-model="year_input"></b-form-select>
            </b-col>

            <b-col md="3">
              <label v-show="time_option == 1 || time_option == 2 || time_option == 3">
                {{time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý' }}
              </label>

              <!--Thời gian theo ngày-->
              <datepicker v-show="time_option == 1" v-model="inputs.created_to" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>

              <!--Thời gian tháng -->
              <b-form-select v-show="time_option == 2" :options="monthOptions" v-model="month_input"></b-form-select>

              <!--Thời gian quý -->
              <b-form-select v-show="time_option == 3" :options="quarterOptions" v-model="quarter_input"></b-form-select>
            </b-col>
          </b-row>

          <b-row class="mt-2 mb-2">
            <b-col md="12">
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch"
                        @click.prevent="prepareToSearch">
                Tìm Kiếm
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="4">
              Số kết quả: <b>{{totalRow}}</b>
            </b-col>
            <b-col md="8" class="text-right" v-if="isUserRoot && excel_items.length > 0">
              <download-excel
                class   = "btn btn-default text-header"
                :data   = "excel_items"
                :fields = "excel_fields"
                worksheet = "data"
                name    = "danh_sach_khach_hang.xls">
                <b>Xuất Excel</b>
              </download-excel>
            </b-col>
          </b-row>

          <b-row>
            <b-col md=12 class="table-cus">

              <table class="table table-bordered table-striped fixed_header">
                <!-- <colgroup>
                      <col style="width:2%">
                      <col style="width:4%">
                      <col style="width:12%">
                      <col style="width:5%">
                      <col style="width:5%">
                      <col style="width:5%">
                      <col style="width:5%">
                      <col style="width:5%">
                      <col style="width:5%">
                      <col style="width:25%">
                      <col style="width:5%">
                      <col style="width:5%">
                      <col style="width:5%">
                      <col style="width:5%">
                      <col style="width:5%">
                    </colgroup> -->
                    <thead>
                    <tr>
                      <th style="width:2%" class="text-center font-weight-bold">STT</th>
                      <th style="width:4%" class="text-center font-weight-bold">Loại</th>
                      <th style="width:12%" class="text-center font-weight-bold">Tên</th>
                      <th style="width:5%" class="text-center font-weight-bold">Mã K.H</th>
                      <th style="width:5%" class="text-center font-weight-bold">SĐT</th>
                      <th style="width:5%" class="text-center font-weight-bold">Email</th>
                      <th style="width:5%" class="text-center font-weight-bold">Mã số thuế</th>
                      <th style="width:5%" class="text-center font-weight-bold">Tỉnh/TP</th>
                      <th style="width:5%" class="text-center font-weight-bold">Quận/Huyện</th>
                      <th style="width:25%" class="text-center font-weight-bold">Địa chỉ</th>
                      <th style="width:5%" class="text-center font-weight-bold">Tên người liên hệ</th>
                      <th style="width:5%" class="text-center font-weight-bold">Sđt người liên hệ</th>
                      <th style="width:5%" class="text-center font-weight-bold">NV phụ trách</th>
                      <th style="width:5%" class="text-center font-weight-bold">Ngày thêm</th>
                      <th style="width:5%" class="text-center font-weight-bold"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item) in items" v-bind:class="item.row_class">
                      <td>{{item.stt}}</td>
                      <td>{{item.type}}</td>
                      <td>{{item.name}}</td>
                      <td>{{item.code}}</td>
                      <td>{{item.phone_number}}</td>
                      <td>{{item.email}}</td>
                      <td>{{item.tax_code}}</td>
                      <td>{{item.city_name}}</td>
                      <td>{{item.district_name}}</td>
                      <td>{{item.address}}</td>
                      <td>{{item.contact_person_name}}</td>
                      <td>{{item.contact_person_phone}}</td>
                      <td>{{item.staff_name}}</td>
                      <td>{{item.created_at}}</td>
                      <td>
                        <b-list-group horizontal>
                          <b-list-group-item v-b-tooltip.hover title="Cập nhật" @click="edit(item.id)">
                            <i class="fa fa-edit" />
                          </b-list-group-item>
                          <b-list-group-item v-if="isShowDelete"
                                  v-b-tooltip.hover title="Xóa"
                                  @click="deleted(item.id, item.name)">
                            <i class="fa fa-trash" />
                          </b-list-group-item>
                        </b-list-group>
                      </td>
                    </tr>
                    </tbody>
                </table>

              <!-- <b-table
                hover
                bordered
                stacked="md"
                :fields="fields"
                :items="items">
                  <template v-slot:cell(gender)="data">{{ handleGender(data.item.gender) }}</template>
                  <template v-slot:cell(action)="dataId">
                    <b-list-group horizontal>
                      <b-list-group-item v-b-tooltip.hover title="Cập nhật" @click="edit(dataId.item.id)">
                        <i class="fa fa-edit" />
                      </b-list-group-item>
                      <b-list-group-item v-if="isShowDelete"
                              v-b-tooltip.hover title="Xóa"
                              @click="deleted(dataId.item.id, dataId.item.name)">
                        <i class="fa fa-trash" />
                      </b-list-group-item>
                    </b-list-group>
                  </template>
                </b-table> -->
            </b-col>
          </b-row>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
        </b-card>

      </b-col>
    </b-row>

    <b-modal centered hide-footer hide-header id="modal-import-customer" @hide="uploadErrorList = []">
      <b-row>
        <b-col class="text-center">
          <form method="post" id="formImport" enctype="multipart/form-data">

              <b-row>
                <b-col>
                  <h4 class="modal-title">Upload khách hàng từ file excel</h4>
                </b-col>
              </b-row>
              <b-row class="text-left">
                <b-col>
                  <p>
                    Tải xuống file mẫu:
                    <a target="_blank" href="https://api.cipro.vn/files/upload_excel_template/ciPro_upload_customer_template.xlsx">Tải xuống</a>
                  </p>
                </b-col>
              </b-row>
              <hr>


              <div class="modal-body">
                  <div class="custom-file">
                    <label>Chọn file excel bạn muốn upload
                      <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" accept=".xlsx"/>
                    </label>
                  </div>
              </div>

          </form>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="text-right mt-3">
          <!-- Loading -->
          <span class="loading-more" v-show="uploading"><icon name="loading" width="60" /></span>
          <button class="btn btn-primary px-4 default-btn-bg" v-show="!uploading" @click="importCustomerFromExcelFile()" :disabled="!fileUpload || uploading">
            Upload
          </button>
        </b-col>
      </b-row>

      <b-row v-show="uploadErrorList.length > 0" class="mt-2">
        <b-col>
          <b-table
          hover
          bordered
          stacked="md"
          :fields="uploadErrorField"
          :items="uploadErrorList">
          </b-table>
        </b-col>
      </b-row>
    </b-modal>

  </div>
</template>


<script>
import customerApi from '@/api/customer'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import Datepicker from 'vue3-datepicker'


export default {
  components: {
    Datepicker
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
      time_option: 5,
      year_input: 2023,
      quarter_input: 1,
      month_input: 1,
      inputs: {
        name: null,
        phone: null,
        staff_in_charge: null,
        city_id: null,
        type: null,
        created_from: '2024-01-01',
        created_to: '2024-01-01'
      },
      optionsStaff: [],
      optionsCity: [],
      optionsType: [
        {value: null, text: ""},
        {value: 0, text: "Cá nhân"},
        {value: 1, text: 'Cty - Thương mại'},
        {value: 2, text: 'Cty - Nhà máy'},
        {value: 3, text: 'Cty - Công Trình'}
      ],
      items: [],
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      hasNext: true,
      onSearch: false,
      loadByScroll: false,
      loading: false,
      totalRow: 0,
      fileUpload: null,
      fileName: "Chọn file excel bạn muốn upload",
      uploading: false,
      userRole: "staff",
      isShowDelete: false,
      uploadErrorList: [],
      uploadErrorField: [
          {
          key: 'row',
          label: 'Dòng'
        },
        {
          key: 'mess',
          label: 'Mô tả lỗi'
        },
      ],
      isUserRoot: false,
      excel_items: [],
      excel_fields: {
        'Loại khách hàng': 'type',
        'Tên*': 'name',
        'Mã khách hàng*': {
          field: "code",
          callback: (value) => {
              if(value && value.substring(0,1) == 0) {
                  return "'" + value
              }
            return value
          }
        },
        'Số Điện Thoại' : {
          field: "phone_number",
          callback: (value) => {
              if(value) {
                  return "'" + value
              }
            return value
          }
        },
        'Email' : 'email',
        'Mã số thuế' : 'tax_code',
        'Loại CTY': 'company_type_str',
        'Giới Tính': 'gender_str',
        'Ngày Tháng Năm Sinh': 'birthday',
        'Tỉnh/ Thành Phố' : 'city_name',
        'Quận/ Huyện' : 'district_name',
        'Địa chỉ' : 'address',
        'Tên người liên hệ' : 'contact_person_name',
        'Sđt người liên hệ' : {
          field: 'contact_person_phone',
          callback: (value) => {
              if(value && value.substring(0,1) == 0) {
                  return "'" + value
              }
            return value
          }
        },
        'Email người liên hệ': 'contact_person_email',
        'Nhân viên phụ trách' : 'staff_name',
      },
      isGetExcelItems: false,
    }
  },
  mounted() {
      // Check delete
      if(this.authStore.user && this.authStore.user.isRoot) {
          this.isShowDelete = true
          this.isUserRoot = true
      } else {
          this.isShowDelete = false
          this.isUserRoot = false
      }

    // UI by staff
    let url = location.href
    if(url.includes("customer-sale")) {
      this.userRole = "staff"
    } else {
        this.userRole = "admin"
    }

    this.prepareDateInput()

    window.addEventListener('scroll', this.onScroll)

    window.addEventListener('resize', this.delete)

    // Get staff list option
    this.getOptionStaff()

    this.getOptionCity()

    // Load list when load page
    this.search()
  },
  methods: {



    /**
     *  Processing on scroll: use for paging
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
          this.offset = this.offset + this.pageLimit
          this.loadByScroll = true
          this.search ()
        }
      }
    },

    prepareDateInput() {
        let dateNow = new Date()
        this.inputs.created_to = dateNow.toJSON().slice(0,10)
        this.inputs.created_from = new Date(dateNow.setDate(dateNow.getDate() - 7)).toJSON().slice(0,10)
        let currentYear = new Date().getFullYear()
        this.year_input = currentYear
          this.yearOptions = []
          for (let i = currentYear; i > currentYear - 10; i--) {
              this.yearOptions.push({value: i, text: i})
          }

          this.month_input = dateNow.getMonth() + 1
      },

    /**
     * Get staff options
     */
    getOptionStaff() {
      console.log("this.userRole: " + this.userRole)
      if(this.userRole == "staff") {
        return
      }

      customerApi.getStaffOptions().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.optionsStaff = [{value: null, text: ''}]

          var staffs = res.data.data
          if(staffs) {
            for (let i in staffs) {
              this.optionsStaff.push(staffs[i])
            }
          }
        }
      })
    },

    /**
     * Get city options
     */
    getOptionCity() {
      MasterApi.getCityOptions().then(res => {
        this.optionsCity = MasterMapper.mapCityModelToDto(res.data.data)
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
     *  Search
     */
    search() {
      if (this.loading) { return }

      this.onSearch = true
      this.loading = true

      let fromDate = this.inputs.created_from
        let toDate = this.inputs.created_to

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

      // Define params
      let params = {
        "name": this.inputs.name,
        "phone": this.inputs.phone,
        "staff_in_charge": this.inputs.staff_in_charge,
        "city_id": this.inputs.city_id,
        "type": this.inputs.type,
        "created_from": fromDate,
        "created_to": toDate,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      console.log("this.userRole: " + this.userRole)

      // Search
      customerApi.getCustomerByStore(params, this.userRole).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          let it = res.data.data.customers
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
        }else{
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
      customerApi.getCustomerByStore(params, this.userRole).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.excel_items = res.data.data.customers
          this.isGetExcelItems = true
        }
      }).catch(err => {
      })
    },

    /**
     * Only input integer
     */
     integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
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

    /**
     * Handle gender
     */
    handleGender(num) {
      if(num == 1) {
        return 'Nam'
      }
      if(num == 2) {
        return 'Nữ'
      }
      return 'Khác'
    },

    /**
     * Go to page edit
     */
    edit (id) {
        if(this.userRole == "admin") {
            this.$router.push('/customer/edit/' + id)
        } else {
            this.$router.push('/customer-sale/edit/' + id)
        }
    },

    /**
     * Go to page add
     */
    goToAdd () {
        if(this.userRole == "staff") {
            this.$router.push('/customer-sale/add')
        } else {
            this.$router.push('/customer/add')
        }
    },

    /**
     * Show modal import from file
     */
    openModalImportFile () {
      this.$bvModal.show('modal-import-customer')
    },

    /**
     * Import file
     */
    importCustomerFromExcelFile() {
      this.uploading = true
      const form_data = new FormData();
      form_data.append("importFile", this.fileUpload)
      customerApi.importCustomerFromExcelFile(form_data).then(res => {
        if(res != null && res.data != null){
            if(res.data.data == null) {
              // Load list when load page

              this.$bvModal.hide('modal-import-customer')
            } else {
              this.uploadErrorList = res.data.data
            }

        }
        this.prepareToSearch()
        this.uploading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.uploading = false
      })

    },

    /**
     *
     */
    handleFileUpload() {
      this.fileUpload = this.$refs.file.files[0];
      console.log(this.fileUpload)
      document.getElementById("custom-file-label").innerHTML = this.fileUpload.name
    },

    deleted (id, name) {
      if(id && name) {
        this.$bvModal.msgBoxConfirm('Xóa ' + name + ". Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if(res){
            customerApi.deleteCustomer(id).then(res => {
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
