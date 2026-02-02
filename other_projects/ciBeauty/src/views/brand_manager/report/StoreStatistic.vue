<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="card-body p-4"  >
            <h4 class="text-center text-header">Thống Kê</h4>
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-3">
                <label> Cửa hàng </label>
                <select class="form-control form-control"
                  :options="optionsStore"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  
                  v-model="inputs.store_id"
                  :disabled="onSearch">
                </select>
              </div>

              <div class="col-span-3">
                <label> Từ ngày </label><span class="error-sybol"></span>
                <input
                  id="fromDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.fromDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)">
                <div class="invalid-feedback invalid-feedback"   :state="!errorFromDate">
                  Mục từ ngày không đúng
                </div>
              </div>
              <div class="col-span-3">
                <label> Đến ngày </label><span class="error-sybol"></span>
                <input
                  id="toDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.toDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)">
                <div class="invalid-feedback invalid-feedback"   :state="!errorToDate">
                  Mục đến ngày không đúng
                </div>
              </div>
              <div class="col-span-3">
                <label> Sắp xếp theo </label>
                <select class="form-control form-control"
                  :options="orderByOption"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  
                  v-model="inputs.orderBy">
                </select>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 mt-2 mb-2">
              <div class="col-span-12">
                <button class="btn btn-outline-primary float-right px-4 btn-width-120" :disabled="onSearch" @click.prevent="search">
                  Xem
                </button>
              </div>
            </div>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <div class="grid grid-cols-12 gap-4" v-show="items.length> 0">
              <div class="col-span-4">
                Số kết quả: {{items.length}}
              </div>
              <div class="col-span-8 text-right">
                <download-excel
                  class   = "btn btn-default text-header"
                  :data   = "items"
                  :fields = "excel_statistic_fields"
                  worksheet = "Thống kê"
                  name    = "filename.xls">
                  <b>Xuất Excel</b>
                </download-excel>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 mt-2 mb-2" v-show="click == true">
              <div class="col-span-12">
                <table class="table table-bordered table-hover table-responsive-stack" v-show="items.length > 0">
                  <thead>
                    <tr>
                      <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in items" :key="index">
                      <td v-for="field in fields" :key="field.key" :data-label="field.label">
                        {{ item[field.key] }}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p v-show="firstSearch == false && items.length <= 0" class="text-center">Không có kết quả nào</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>


  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'



export default {
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
