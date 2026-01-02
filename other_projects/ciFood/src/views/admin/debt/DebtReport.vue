<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <h2 class="text-center text-header">Báo cáo tổng thể</h2>
          <b-row>
            <b-col md="4">
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
              <b-form-invalid-feedback class="invalid-feedback" :state="!errorFromDate">
                Mục từ ngày không đúng
              </b-form-invalid-feedback>
            </b-col>
            <b-col md="4">
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
              <b-form-invalid-feedback class="invalid-feedback" :state="!errorToDate">
                Mục đến ngày không đúng
              </b-form-invalid-feedback>
            </b-col>
            <b-col md="4">
              <label class="label-width text-white">
                 Xem
              </label>
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch" @click="search">
                Xem
              </b-button>
            </b-col>
          </b-row>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>


          <b-card-body class="p-4">
            <div>
              <b-card-group deck>
                <b-card
                  bg-variant="light"
                  header="Lợi nhuận bán hàng"
                  class="text-center"
                >
                  <b-card-text><h3>{{ profit | format_currency }}</h3></b-card-text>
                </b-card>

                <b-card
                  bg-variant="light"
                  header="Tổng ghi nợ"
                  class="text-center"
                >
                  <b-card-text><h3>{{ totalDebt | format_currency }}</h3></b-card-text>
                </b-card>

                <b-card
                  bg-variant="light"
                  header="Tổng nợ công"
                  class="text-center"
                >
                  <b-card-text><h3>{{ totalPublicDebt | format_currency }}</h3></b-card-text>
                </b-card>

                <b-card
                  bg-variant="light"
                  header="Lợi nhuận sơ bộ"
                  class="text-center"
                >
                  <b-card-text><h3>{{ totalProfit | format_currency }}</h3></b-card-text>
                </b-card>
              </b-card-group>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>


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

<style lang="scss" scoped>
  .label-width {
    width: 100%;
  }
</style>
