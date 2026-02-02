<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <h2 class="text-center text-header text-3xl font-bold">Báo cáo tổng thể</h2>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4">
              <label> Từ ngày </label><span class="error-sybol"></span>
              <input
                id="fromDate"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.fromDate"
                maxlength="10"
                @keyup="inputDateOnly($event.target)"
                :disabled="onSearch">
              <div class="invalid-feedback invalid-feedback" :state="!errorFromDate">
                Mục từ ngày không đúng
              </div>
            </div>
            <div class="col-span-4">
              <label> Đến ngày </label><span class="error-sybol"></span>
              <input
                id="toDate"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.toDate"
                maxlength="10"
                @keyup="inputDateOnly($event.target)"
                :disabled="onSearch">
              <div class="invalid-feedback invalid-feedback" :state="!errorToDate">
                Mục đến ngày không đúng
              </div>
            </div>
            <div class="col-span-4">
              <button class="btn btn-outline-primary mt-4 float-right px-4 btn-width-120" :disabled="onSearch"
                        @click.prevent="search">
                Xem
              </button>
            </div>
          </div>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>


          <div class="card-body p-4"  >
            <div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="bg-gray-50 border rounded shadow-sm">
                  <div class="px-4 py-3 border-b border-gray-200 font-bold bg-gray-100 rounded-t text-center">Lợi nhuận bán hàng</div>
                  <div class="p-4 text-center"><h3 class="text-2xl font-bold">{{ profit | format_currency }}</h3></div>
                </div>

                <div class="bg-gray-50 border rounded shadow-sm">
                  <div class="px-4 py-3 border-b border-gray-200 font-bold bg-gray-100 rounded-t text-center">Tổng ghi nợ</div>
                  <div class="p-4 text-center"><h3 class="text-2xl font-bold">{{ totalDebt | format_currency }}</h3></div>
                </div>

                <div class="bg-gray-50 border rounded shadow-sm">
                  <div class="px-4 py-3 border-b border-gray-200 font-bold bg-gray-100 rounded-t text-center">Tổng nợ công</div>
                  <div class="p-4 text-center"><h3 class="text-2xl font-bold">{{ totalPublicDebt | format_currency }}</h3></div>
                </div>

                <div class="bg-gray-50 border rounded shadow-sm">
                  <div class="px-4 py-3 border-b border-gray-200 font-bold bg-gray-100 rounded-t text-center">Lợi nhuận sơ bộ</div>
                  <div class="p-4 text-center"><h3 class="text-2xl font-bold">{{ totalProfit | format_currency }}</h3></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import adminAPI from "@/api/admin";
import commonFunc from "@/common/commonFunc";
import moment from 'moment';

export default {
  data() {
    return {
      totalProfit: 0,
      totalPublicDebt: 0,
      profit: 0,
      totalDebt: 0,
      loading: false,
      inputs: {
        fromDate: moment().startOf('month').format('DD-MM-YYYY'),
        toDate: moment().format('DD-MM-YYYY')
      },
      onSearch: false,
      click: false,
    };
  },
  computed: {
    errorFromDate: function () {
      return this.checkDate(this.inputs.fromDate)
    },
    errorToDate: function () {
      return this.checkDate(this.inputs.toDate)
    },
    // totalProfit: function () {
    //   return this.profit + this.totalDebt - this.totalPublicDebt
    // }
  },
  mounted() {
    this.getGeneralReport();
  },
  methods: {
    checkDate(dateInput) {
      return (this.click && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
    },
    checkValidate() {
      return !(this.errorFromDate || this.errorToDate)
    },
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: "my-toast",
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      });
    },
    getGeneralReport() {
        this.loading = true

      let listDay = this.getListDateFromDateInput()
      let params = {
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        "listDay": listDay,
        "dataBy": 'Day',
        "fromMonth": null,
        "toMonth": null
      }

      adminAPI
        .getGeneralReport(params)
        .then(res => {
          if (res && res.data && res.data.data) {
            this.profit = res.data.data.profit;
            this.totalDebt = res.data.data.totalDebt;
            this.totalPublicDebt = res.data.data.totalPublicDebt;
            this.totalProfit = res.data.data.totalProfit;
          }

          this.loading = false
        })
        .catch(err => {
            this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err);
          this.popToast("danger", errorMess);
        });

      // // Search total Profit
      // adminAPI.getProfitReport(params).then(res => {
      //   if (res && res.data && res.data.data) {
      //     this.profit = res.data.data.total_profit
      //   }
      // }).catch(err => {
      //   console.log(err)
      //   // Handle error
      //   let errorMess = commonFunc.handleStaffError(err)
      //   this.popToast('danger', errorMess)
      // })
    },
    checkFromDateAndToDate() {
      let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
      let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate))

      if (fromDate > toDate) {
        this.popToast('danger', "Từ ngày không thể lớn hớn đến ngày")
        return false
      }

      return true
    },
    getListDateFromDateInput() {
      let result = []

      let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
      let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate))
      while (fromDate <= toDate) {
        let dateTemp = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
        result.push(dateTemp)
        fromDate = new Date(fromDate.setDate(fromDate.getDate() + 1))
      }

      return result
    },
    search() {
      if (this.loading) {
        return
      }
      this.click = true

      // Check validate
      if (!this.checkValidate()) {
        this.chartData = []
        return
      }
      if (!this.checkFromDateAndToDate()) {
        this.chartData = []
        return
      }

      this.loading = true
      this.onSearch = true
      let listDay = this.getListDateFromDateInput()
      let params = {
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        "listDay": listDay,
        "dataBy": 'Day',
        "fromMonth": null,
        "toMonth": null
      }

      // Search
      adminAPI.getGeneralReport(params).then(res => {
        if (res && res.data && res.data.data) {
          this.profit = res.data.data.profit;
          this.totalDebt = res.data.data.totalDebt;
          this.totalPublicDebt = res.data.data.totalPublicDebt;
          this.totalProfit = res.data.data.totalProfit;
        }

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

      // // Search total Profit
      // adminAPI.getProfitReport(params).then(res => {
      //   if (res && res.data && res.data.data) {
      //     this.profit = res.data.data.total_profit
      //   }
      // }).catch(err => {
      //   console.log(err)
      //   // Handle error
      //   let errorMess = commonFunc.handleStaffError(err)
      //   this.popToast('danger', errorMess)
      // })
    },
    inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },
  }
};
</script>

<style lang="scss" scoped></style>
