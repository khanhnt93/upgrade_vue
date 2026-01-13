<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">
            <h4 class="text-center">Thống Kê</h4>
            <b-row>
              <b-col md="3">
                <label> Cửa hàng </label>
                <b-form-select
                  :options="optionsStore"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.store_id"
                  :disabled="onSearch">
                </b-form-select>
              </b-col>

              <b-col md="3">
                <label> Từ ngày </label><span class="error-sybol"></span>
                <input
                  id="fromDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.fromDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorFromDate">
                  Mục từ ngày không đúng
                </b-form-invalid-feedback>
              </b-col>
              <b-col md="3">
                <label> Đến ngày </label><span class="error-sybol"></span>
                <input
                  id="toDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.toDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorToDate">
                  Mục đến ngày không đúng
                </b-form-invalid-feedback>
              </b-col>
              <b-col md="3">
                <label> Sắp xếp theo </label>
                <b-form-select
                  :options="orderByOption"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.orderBy">
                </b-form-select>
              </b-col>
            </b-row>

            <b-row class="mt-2 mb-2">
              <b-col md="12">
                <b-button variant="primary" class="pull-right px-4 default-btn-bg btn-width-120" :disabled="onSearch" @click.prevent="search">
                  Xem
                </b-button>
              </b-col>
            </b-row>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <b-row v-show="items.length > 0">
              <b-col md="4">
                Số kết quả: {{items.length}}
              </b-col>
              <b-col md="8" class="text-right">
                <download-excel
                  class   = "btn btn-default text-header"
                  :data   = "items"
                  :fields = "excel_statistic_fields"
                  worksheet = "Thống kê"
                  name    = "filename.xls">
                  <b>Xuất Excel</b>
                </download-excel>
              </b-col>
            </b-row>

            <b-row class="mt-2 mb-2" v-show="click == true">
              <b-col md="12">
                <b-table
                  hover
                  bordered
                  stacked="md"
                  :fields="fields"
                  :items="items"
                  v-show="items.length > 0">
                </b-table>

                <p v-show="firstSearch == false && items.length <= 0" class="text-center">Không có kết quả nào</p>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>


  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'


export default {
  setup() {
    const { popToast } = useToast()
    return { popToast }
  },
  data () {
    return {
      inputs: {
        "store_id": null,
        "fromDate": null,
        "toDate": null,
        "orderBy": "quantityAsc"
      },
      onSearch: false,
      click: false,
      optionsStore: [],
      orderByOption: [
        {value: 'quantityAsc', text: ''},
        {value: 'quantityAsc', text: 'Số lượng tăng dần'},
        {value: 'quantityDesc', text: 'Số lượng giảm dần'},
        {value: 'amountAsc', text: 'Doanh thu tăng dần'},
        {value: 'amountDesc', text: 'Doanh thu giảm dần'}
      ],
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'name',
          label: 'Tên'
        },
        {
          key: 'quantity',
          label: 'Số lượng'
        },
        {
          key: 'percent_quantity',
          label: '% Số lượng'
        },
        {
          key: 'amount',
          label: 'Doanh thu'
        },
        {
          key: 'percent_amount',
          label: '% Doanh thu'
        },
      ],
      items: [],
      loading: false,
      excel_statistic_fields: {
        'STT': 'stt',
        'Tên': 'name',
        'Số lượng' : 'quantity',
        '% Số lượng' : 'percent_quantity',
        'Doanh thu' : 'amount',
        '% Doanh thu' : 'percent_amount'
      },
      firstSearch: true,
    }
  },
  mounted() {
    // Load store option
    this.getOptionStore()

    // Get default date
    let dateNow = new Date().toJSON().slice(0,10)
    this.inputs.toDate = commonFunc.formatDate(dateNow)
    this.inputs.fromDate = commonFunc.formatDate(dateNow)

  },
  computed: {
    errorFromDate: function () {
      return this.checkDate(this.inputs.fromDate)
    },
    errorToDate: function () {
      return this.checkDate(this.inputs.toDate)
    },
  },
  methods: {
    checkDate (dateInput) {
      return (this.click && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
    },
    checkValidate () {
      return !(this.errorFromDate || this.errorToDate)
    },

    /**
     * Get store options
     */
    getOptionStore() {
      adminAPI.getStoreOption().then(res => {
        if(res && res.data && res.data.data) {
          this.optionsStore = res.data.data
        }
      }).catch(err => {
        // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
      })
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
     * Only input integer
     */
     intergerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

    /**
     * Check valid from date and to date
     */
    checkFromDateAndToDate() {

      let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
      let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate))

      if(fromDate > toDate) {
        this.popToast('danger', "Từ ngày không thể lớn hớn đến ngày")
        return false
      }

      fromDate.setDate(fromDate.getDate() + 62)

      if(fromDate < toDate) {
        this.popToast('danger', "Thời gian không quá 62 ngày")
        return false
      }

      return true
    },

    /**
     * Search
     */
    search() {
      if (this.loading) { return }
      this.click = true

      // Check validate
      if(!this.checkValidate()) {
        this.items = []
        return
      }

      // Check store id
      if(!this.inputs.store_id) {
        this.popToast('danger', "Vui lòng chọn cửa hàng")
        return
      }
      if(!this.checkFromDateAndToDate()) {
        this.items = []
        return
      }
      this.loading = true
      this.onSearch = true

      let params = {
        "store_id": this.inputs.store_id,
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        "orderBy": this.inputs.orderBy,
      }

      // Search
      adminAPI.getBrandStatistic(params).then(res => {
        if(res && res.data && res.data.data) {
          this.items = res.data.data
        }

        this.firstSearch = false
        this.onSearch = false
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.firstSearch = false
        this.onSearch = false
        this.loading = false
      })
    },
  }
}
</script>
