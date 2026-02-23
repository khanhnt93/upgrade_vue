<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="card-body p-4">
            <h4 class="text-center text-header">BÁO CÁO SỬA BILL CŨ</h4>
            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/3 px-2">
                <label> Từ ngày </label><span class="error-sybol"></span>
                <input
                  id="fromDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.fromDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)">
                <div v-if="errorFromDate" class="text-red-600 text-sm mt-1">
                  Mục từ ngày không đúng
                </div>
              </div>
              <div class="w-full md:w-1/3 px-2">
                <label> Đến ngày </label><span class="error-sybol"></span>
                <input
                  id="toDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.toDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)">
                <div v-if="errorToDate" class="text-red-600 text-sm mt-1">
                  Mục đến ngày không đúng
                </div>
              </div>

              <div class="w-full md:w-1/3 px-2">
                <label class="label-width text-white">
                 Xem
                </label>

                <button class="btn btn-outline-primary pull-right btn-width-120" :disabled="onSearch" @click.prevent="search">
                  Xem
                </button>
              </div>

            </div>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <div class="flex flex-wrap -mx-2" v-show="items.length > 0">
              <div class="w-full md:w-1/3 px-2">
                Số kết quả: {{items.length}}
              </div>
              <div class="w-full md:w-2/3 px-2 text-right">
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

            <div class="flex flex-wrap -mx-2 mt-2 mb-2" v-show="click == true">
              <div class="w-full px-2">
                <table class="table table-bordered table-striped" v-show="items.length > 0">
                  <thead>
                    <tr>
                      <th class="text-center">STT</th>
                      <th class="text-center">Số bill</th>
                      <th class="text-center">Thành tiền bill gốc</th>
                      <th class="text-center">Thành tiền bill sửa</th>
                      <th class="text-center">Ngày sửa</th>
                      <th class="text-center">Người sửa</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in items" :key="item.stt">
                      <td class="text-center">{{ item.stt }}</td>
                      <td class="text-center">{{ item.bill_number }}</td>
                      <td class="text-right">{{ currencyFormat(item.old_total) }}</td>
                      <td class="text-right">{{ currencyFormat(item.new_total) }}</td>
                      <td class="text-center">{{ item.created_at }}</td>
                      <td class="text-center">{{ item.staff_name }}</td>
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
import { useToast } from '@/composables/useToast'

export default {
  setup() {
    const { toast } = useToast()
    return { toast }
  },
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
        this.toast("Từ ngày không thể lớn hớn đến ngày", 'error')
        return false
      }

      fromDate.setDate(fromDate.getDate() + 62)

      if(fromDate < toDate) {
        this.toast("Thời gian không quá 62 ngày", 'error')
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
        this.toast(errorMess, 'error')

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

<style lang="css" scoped>
  .label-width {
    width: 100%;
  }
</style>
