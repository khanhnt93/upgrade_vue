<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <h2 class="text-center text-header">Báo Cáo Hoa Hồng</h2>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-3">
              <label> Chi nhánh </label>
              <select class="form-control form-control"
                :options="optionsStore"
                id="status"
                type="text"
                autocomplete="new-password"
                
                v-model="inputs.store_id"
                :disabled="loading"
              @change="changeStore">
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
              <div class="invalid-feedback invalid-feedback" :state="!errorFromDate">
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
              <div class="invalid-feedback invalid-feedback" :state="!errorToDate">
                Mục đến ngày không đúng
              </div>
            </div>
            <div class="col-span-3">
              <label> Nhân viên </label>
              <select class="form-control form-control"
                :options="staffOption"
                id="status"
                type="text"
                autocomplete="new-password"
                
                v-model="inputs.staff"
                :disabled="!inputs.store_id"
              ></select>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 mt-2">
              <button class="btn btn-outline-primary float-right px-4 btn-width-120" @click.prevent="search">
                Xem
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4 mt-10">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <span class="loading-more" v-show="loading"
          ><icon name="loading" width="60"
          /></span>

          <div class="grid grid-cols-12 gap-4" v-show="commissions.length> 0">
            <div class="col-span-full">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-4"> Số kết quả: {{ total_row }}</div>
                <div class="col-span-8 text-right">
                  <download-excel
                    class="btn btn-default text-header"
                    :data="commissions"
                    :fields="excel_bill_fields"
                    worksheet="Báo Cáo Theo Bill"
                    name="bao_cao_theo_bill.xls"
                  >
                    <b>Xuất Excel</b>
                  </download-excel>
                </div>
              </div>
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-full">
                  <table
                    class="table table-bordered table-striped fixed_header"
                  >
                    <thead>
                    <tr>
                      <th>STT</th>
                      <th>Nhân viên</th>
                      <th>Ngày</th>
                      <th>Số Bill</th>
                      <th>Tên dịch vụ</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th>Tiền dịch vụ</th>
                      <th>Khuyến mãi</th>
                      <th>Thành tiền</th>
                      <th>% Hoa hồng</th>
                      <th>Số tiền hoa hồng</th>
                    </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="total text-center font-weight-bold" colspan="5">
                          <span class="text-header"><b>Tổng</b></span>
                        </td>
                        <td class="text-right font-weight-bold text-header">{{ total_service_price | format_currency }}</td>
                        <td class="text-center font-weight-bold text-header">{{ total_service_quantity }}</td>
                        <td class="text-right font-weight-bold text-header">{{ total_service_amount | format_currency }}</td>
                        <td class="text-right font-weight-bold text-header">{{ total_service_promotion | format_currency }}</td>
                        <td class="text-right font-weight-bold text-header">{{ total_service_amount_net | format_currency }}</td>
                        <td class="text-right"></td>
                        <td class="text-right font-weight-bold text-header">{{ total_commission_amount | format_currency }}</td>
                      </tr>
                      <tr v-for="(commission, index) in commissions" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ commission.staff_name}}</td>
                        <td>{{ commission.created_at }}</td>
                        <td>{{ commission.bill_number }}</td>
                        <td>{{ commission.service_name }}</td>
                        <td class="text-right">
                          {{ commission.service_price | format_currency }}
                        </td>
                        <td  class="text-center">
                          {{ commission.service_quanity }}
                        </td>
                        <td class="text-right">
                          {{ commission.service_amount | format_currency }}
                        </td>
                        <td class="text-right">
                          {{ commission.pmt_amount | format_currency }}
                        </td>
                        <td class="text-right">
                          {{ commission.service_amount_net | format_currency }}
                        </td>
                        <td class="text-right">
                          {{ commission.commission_percent}}%
                        </td>
                        <td class="text-right">
                          {{ commission.commission_amount | format_currency }}
                        </td>

                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4" v-show="commissions.length == 0">
            <div class="col-span-full text-center">
              Không tìm thấy kết quả nào
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
        optionsStore: [],
      inputs: {
        "store_id": null,
        "fromDate": null,
        "toDate": null,
        "staff": null
      },
      staffOption: [
        {value: null, text: ''}
      ],
      loading: false,
      commissions: [],
      total_row: 0,
      total_service_price: 0,
      total_service_quantity: 0,
      total_service_amount: 0,
      total_service_promotion: 0,
      total_service_amount_net: 0,
      total_commission_amount: 0,
      excel_bill_data: null,
      excel_bill_fields: {
        "Tên nhân viên": "staff_name",
        "Số Bill": "bill_number",
        "Dịch vụ": "service_name",
        "Đơn giá": "service_price",
        "Số lượng": "service_quanity",
        "Tiền dịch vụ": "service_amount",
        "Khuyến mãi": "pmt_amount",
        "Thành tiền": "service_amount_net",
        "% Hoa hồng": "commission_percent",
        "Số tiền hoa hồng": "commission_amount",
        "Ngày": "created_at",
      }
    };
  },
  mounted() {
    let dateNow = new Date().toJSON().slice(0,10);
    this.inputs.toDate = commonFunc.formatDate(dateNow)
    this.inputs.fromDate = commonFunc.formatDate(dateNow)

    // Load store option
    this.getOptionStore()

      // this.getStaffOption();

    // this.getCommissionReport();
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
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: "my-toast",
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      });
    },
    checkDate (dateInput) {
      return (this.click && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
    },
    inputDateOnly(item) {
      item.value = commonFunc.inputDateOnly(item.value)
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
       * Event change store
       */
      changeStore() {
          if(this.inputs.store_id) {
              this.getStaffOption()
          }
      },

    search() {

        if (this.loading) { return }

      // Check validate
      // if(!this.checkDate()) {
      //   return
      // }

      // Check store id
      if(!this.inputs.store_id) {
        this.popToast('danger', "Vui lòng chọn cửa hàng")
        return
      }

      // Check store id
      if(!this.inputs.staff) {
        this.popToast('danger', "Vui lòng chọn nhân viên")
        return
      }

      this.loading = true

      let params = {
        "store_id": this.inputs.store_id,
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        "staffId": this.inputs.staff,
      }
      adminAPI
        .getBrandCommissionReport(params)
        .then(res => {
          if (res && res.data && res.data.data) {
            this.commissions = res.data.data.commissions;
            this.total_service_price = res.data.data.total_service_price
            this.total_service_quantity = res.data.data.total_service_quantity
            this.total_service_amount = res.data.data.total_service_amount
            this.total_service_promotion = res.data.data.total_service_promotion
            this.total_service_amount_net = res.data.data.total_service_amount_net
            this.total_commission_amount = res.data.data.total_commission_amount
              this.total_row = res.data.data.total_row
          }

          this.loading = false
        })
        .catch(err => {
            this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err);
          this.popToast("danger", errorMess);
        });
    },
    /**
     * Get staff option
     */
    getStaffOption() {
      adminAPI.getStaffOptionByBrand(this.inputs.store_id).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
            this.staffOption = [{value: null, text: ''}]
          let staffs = res.data.data
          for (let index in staffs) {
            this.staffOption.push(staffs[index])
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },
  }
};
</script>

<style lang="scss" scoped>
  .label-width {
    width: 100%;
  }

  table {
   margin: auto;
    border-collapse: collapse;
    overflow-x: auto;
    display: block;
    width: fit-content;
    max-width: 100%;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, .1);
  }

  td, th {
    border: solid rgb(200, 200, 200) 1px;
    padding: .5rem;
  }

  th {
    text-align: left;
    background-color: rgb(190, 220, 250);
    text-transform: uppercase;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: rgb(50, 50, 100) solid 2px;
    border-top: none;
  }

  td {
    white-space: nowrap;
    border-bottom: none;
    color: rgb(20, 20, 20);
  }

  td:first-of-type, th:first-of-type {
    border-left: none;
  }

  td:last-of-type, th:last-of-type {
    border-right: none;
  }
</style>
