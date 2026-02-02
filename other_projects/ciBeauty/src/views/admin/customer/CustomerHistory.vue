<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h4 class="mt-2 text-center text-header">Lịch sử khách hàng</h4>
            </div>
          </div>
          <hr>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-2">
              <label>Thời gian</label>
              <select class="form-control" v-model="time_option">
                <option v-for="option in timeOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="col-span-2">
              <label v-show="time_option != 5">
                {{time_option == 1 ? 'Từ ngày' : 'Năm' }}
              </label>
              <!--Thời gian theo ngày-->
              <datepicker v-show="time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
              <!--Thời gian năm-->
              <select class="form-control" v-show="time_option != 1 && time_option != 5" v-model="year_input">
                <option v-for="option in yearOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="col-span-2">
              <label v-show="time_option == 1 || time_option == 2 || time_option == 3">
                {{time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý' }}
              </label>

              <!--Thời gian theo ngày-->
              <datepicker v-show="time_option == 1" v-model="inputs.to_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>

              <!--Thời gian tháng -->
              <select class="form-control" v-show="time_option == 2" v-model="month_input">
                <option v-for="option in monthOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>

              <!--Thời gian quý -->
              <select class="form-control" v-show="time_option == 3" v-model="quarter_input">
                <option v-for="option in quarterOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="col-span-2">
              <label>Nhóm DV</label>
              <multiselect
                :multiple="true"
                v-model="groupServiceSelect"
                :options="groupServiceOptions"
                :loading="loadingOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn nhóm dv--"
                label="name"
                track-by="name">
              </multiselect>
            </div>
            <div class="col-span-2">
              <label>Dịch vụ</label>
              <multiselect
                :multiple="true"
                v-model="serviceSelect"
                :options="serviceOptions"
                :loading="loadingOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn dv--"
                label="name"
                track-by="name">
              </multiselect>
            </div>

            <div class="col-span-2">
              <label>Khách hàng</label>
              <multiselect
                :multiple="true"
                v-model="customerSelect"
                :options="customerOptions"
                :loading="loadingOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn KH--"
                label="name_full"
                track-by="name_full">
              </multiselect>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4 mt-2 mb-2">
            <div class="col-span-12">
              <button class="btn btn-outline-primary float-right px-4 btn-width-120" :disabled="onSearch"
              @click.prevent="prepareToSearch">
                Tìm Kiếm
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              Số kết quả: {{totalRow}}
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <table class="table table-bordered table-striped fixed_header">
                <thead>
                  <tr>
                    <th class="text-center">STT</th>
                    <th class="text-center">Tên k.H</th>
                    <th class="text-center">Số điện thoại</th>
                    <th class="text-center">Giờ vào</th>
                    <th class="text-center">Giờ ra</th>
                    <th class="text-center">Dịch vụ</th>
                    <th class="text-center">Tổng tiền dv</th>
                    <th class="text-center">Thanh toán trước</th>
                    <th class="text-center">Phụ thu</th>
                    <th class="text-center">Khuyến mãi</th>
                    <th class="text-center">VAT</th>
                    <th class="text-center">Thanh toán</th>
                    <th class="text-center">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in items">
                    <td>{{index + 1}}</td>
                    <td><a :href="'/customer/history-detail/'+item.customer_id" target="_blank">{{item.customer_name}}</a></td>
                    <td>{{item.phone_number}}</td>
                    <td>{{item.order_at}}</td>
                    <td>{{item.payment_at}}</td>
                    <td>
                      <p v-for="(service, index) in item.services" :key="service.name + index">{{service.quantity + " x " + service.name}}</p>
                    </td>
                    <td class="text-right">{{currencyFormat(item.sub_total)}}</td>
                    <td class="text-right">{{currencyFormat(item.prepay_amount)}}</td>
                    <td class="text-right">{{currencyFormat(item.surcharge_amount)}}</td>
                    <td class="text-right">{{currencyFormat(item.discount_amount)}}</td>
                    <td class="text-right">{{currencyFormat(item.vat_value)}}</td>
                    <td class="text-right">{{currencyFormat(item.total)}}</td>
                    <td>
                      <span class="pre-line-content">{{ item.note }}</span>
                      <i class="fa fa-edit" @click="showModalEditNote(item.id, item.note)"/>
                    </td>
                    
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
        </div>

      </div>
    </div>

    <!-- Modal plus/minus money-->
    <!-- Modal plus/minus money-->
    <div v-if="showUpdateNoteModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div class="flex items-center justify-between p-4 border-b">
          <h5 class="text-xl font-bold">Cập nhật ghi chú</h5>
          <button @click="showUpdateNoteModal = false" class="text-gray-500 hover:text-gray-700">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <label>Nội dung ghi chú</label><span class="error-sybol"></span>
                <textarea class="form-control"
                  rows="5"
                  v-model="note">
                </textarea>
           </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4 text-left mt-3">
              <button class="btn btn-outline-danger pull-left btn-width-120" @click="cancelUpdateNote()">
                Hủy
              </button>
            </div>
            <div class="col-span-8 text-right mt-3">
              <button class="btn btn-outline-success float-right btn-width-120" @click="confirmUpdateNote" :disabled="saving">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import customerApi from '@/api/customer'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

export default {
  components: {
    VueDatePicker,
    Multiselect
  },
  data () {
    return {
      inputs: {
        from_date: '',
        to_date: '',
        group_ids: null,
        service_ids: null,
        customer_ids: null
      },
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'customer_name',
          label: 'Tên k.H'
        },
        {
          key: 'phone_number',
          label: 'Số điện thoại'
        },
        {
          key: 'order_at',
          label: 'Giờ vào'
        },
        {
          key: 'payment_at',
          label: 'Giờ ra'
        },
        {
          key: 'services',
          label: 'Dịch vụ'
        },
        {
          key: 'sub_total',
          label: 'Tổng tiền dv'
        },
        {
          key: 'prepay_amount',
          label: 'Thanh toán trước'
        },
        {
          key: 'surcharge_amount',
          label: 'Phụ thu'
        },
        {
          key: 'discount_amount',
          label: 'Khuyến mãi'
        },
        {
          key: 'vat_value',
          label: 'VAT'
        },
        {
          key: 'total',
          label: 'Thanh toán'
        },
        {
          key: 'note',
          label: 'Ghi chú'
        }
      ],
      items: [],
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      hasNext: true,
      onSearch: false,
      loadByScroll: false,
      listIdDeleted: [],
      loading: false,
      totalRow: 0,
      currentPaymentId: -1,
      note: null,
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
      groupServiceOptions: [],
      groupServiceSelect: [],
      serviceOptions: [],
      serviceOptionStore: [],
      serviceSelect: [],
      customerOptions: [],
      customerSelect: [],
      loadingOptions: false,
      showUpdateNoteModal: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

    window.addEventListener('resize', this.delete)

    // Get default from date and to date
    this.prepareDateInput()

    // Get options related
    this.getOptionRelatedCusHis()

    // Load list when load page
    this.search()
  },
  methods: {

    /**
   * Make toast without title
   */
    popToast(variant, content) {
      if (variant === 'danger') {
        this.$toast.error(content);
      } else if (variant === 'success') {
        this.$toast.success(content);
      } else if (variant === 'warning') {
        this.$toast.warning(content);
      } else {
        this.$toast.info(content);
      }
    },

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
      if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if(this.hasNext) {
          this.offset = this.offset + this.pageLimit
          this.loadByScroll = true
          this.search ()
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
     *  Get options related
     */
    getOptionRelatedCusHis() {
      this.loadingOptions = true
      customerApi.getOptionRelatedCusHis().then(res => {
        if(res != null && res.data != null && res.data.data != null){
          const data = res.data.data
          this.groupServiceOptions = data.groups
          this.serviceOptions = data.services
          this.serviceOptionStore = JSON.parse(JSON.stringify(data.services))
          this.customerOptions = data.customers
        }
        this.loadingOptions = false
      }).catch(err => {
        this.loadingOptions = false

        // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
      })
    },

    /**
     * Prepare to search
     */
    prepareToSearch() {
      this.offset = 0
      this.items = []
      this.hasNext = true

      this.search()
    },

    /**
     *  Search
     */
    search() {
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
      let group_ids = ""
      for (let group of this.groupServiceSelect) {
        group_ids += group.id + ","
      }
      if (group_ids.endsWith(",")) {
        group_ids = group_ids.slice(0, -1);
      }
      let service_ids = ""
      for (let service of this.serviceSelect) {
        service_ids += service.id + ","
      }
      if (service_ids.endsWith(",")) {
        service_ids = service_ids.slice(0, -1);
      }
      let customer_ids = ""
      for (let customer of this.customerSelect) {
        customer_ids += customer.id + ","
      }
      if (customer_ids.endsWith(",")) {
        customer_ids = customer_ids.slice(0, -1);
      }

      let params = {
        "group_ids": group_ids,
        "service_ids": service_ids,
        "customer_ids": customer_ids,
        "from_date": fromDate,
        "to_date": toDate,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      // Search
      customerApi.getCustomerHistory(params).then(res => {
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
        }else{
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

      showModalEditNote(paymentId, note) {
        this.currentPaymentId = paymentId
        this.note = note
        // this.$bvModal.show('modal-update-note')
        this.showUpdateNoteModal = true;
      },

    cancelUpdateNote() {
      // this.$bvModal.hide('modal-update-note')
      this.showUpdateNoteModal = false
    },

      /**
     * Confirm update note
     */
    confirmUpdateNote() {
        let data = {
            "note": this.note,
            "id": this.currentPaymentId
        }
      customerApi.confirmUpdateNote(data).then(res => {
        if (res != null && res.data != null) {
            // this.$bvModal.hide('modal-update-note')
            this.showUpdateNoteModal = false
          this.popToast('success', "Cập nhật ghi chú thành công!")

          this.search()
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
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
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },

    /**
     * Go to page edit
     */
    edit (id) {
      this.$router.push('/customer/edit/' + id)
    },
  }
}
</script>
