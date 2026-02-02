<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="card-body p-4"  >
            <h4 class="text-center text-header">Báo Cáo Sửa Bill Cũ</h4>
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-6">
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
              <div class="col-span-6">
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
                  worksheet = "data"
                  name    = "bao_cao_sua_bill_cu.xls">
                  <b>Xuất Excel</b>
                </download-excel>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 mt-2 mb-2" v-show="click == true">
              <div class="col-span-12">
                <table class="table table-bordered table-hover table-responsive-stack" v-show="items.length > 0">
                  <thead>
                    <tr>
                      <th v-for="field in fields" :key="field.key" :class="field.thClass">{{ field.label }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in items" :key="index">
                      <td v-for="field in fields" :key="field.key" :data-label="field.label" :class="field.tdClass">
                        <div v-if="field.key === 'old_total'">
                          {{ currencyFormat(item.old_total) }}
                        </div>
                        <div v-else-if="field.key === 'new_total'">
                          {{ currencyFormat(item.new_total) }}
                        </div>
                        <div v-else-if="field.key === 'difference_amount'">
                          {{ currencyFormat(item.difference_amount) }}
                        </div>
                        <div v-else>
                          {{ item[field.key] }}
                        </div>
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
        "fromDate": null,
        "toDate": null
      },
      onSearch: false,
      click: false,
      fields: [
        {
          key: 'stt',
          label: 'STT',
          tdClass: 'text-center',
          thClass: 'text-center'
        },
        {
          key: 'bill_number',
          label: 'Số bill',
          tdClass: 'text-center',
          thClass: 'text-center'
        },
        {
          key: 'old_total',
          label: 'Thành tiền bill gốc',
          tdClass: 'text-right',
          thClass: 'text-center'
        },
        {
          key: 'new_total',
          label: 'Thành tiền bill sửa',
          tdClass: 'text-right',
          thClass: 'text-center'
        },
        {
          key: 'difference_amount',
          label: 'Số tiền chênh lệch',
          tdClass: 'text-right',
          thClass: 'text-center'
        },
        {
          key: 'created_at',
          label: 'Ngày sửa',
          tdClass: 'text-center',
          thClass: 'text-center'
        },
        {
          key: 'staff_name',
          label: 'Người sửa',
          tdClass: 'text-center',
          thClass: 'text-center'
        },
      ],
      items: [],
      loading: false,
      excel_statistic_fields: {
        'STT': 'stt',
        'Số bill': 'bill_number',
        'Thành tiền bill gốc' : 'old_total',
        'Thành tiền bill sửa' : 'new_total',
        'Ngày sửa' : 'created_at',
        'Người sửa' : 'staff_name'
      },
      firstSearch: true,
    }
  },
  mounted() {
    // Get default date
    let dateNow = new Date()
    this.inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
    this.inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0,10))

    // Load data
    this.search()

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
      if(!this.checkFromDateAndToDate()) {
        this.items = []
        return
      }
      this.loading = true
      this.onSearch = true

      let params = {
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate)
      }

      // Search
      adminAPI.getEditOldBillReport(params).then(res => {
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

    /**
   * Currency format
   */
    currencyFormat(num) {
      let result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      return result
    },
  }
}
</script>
