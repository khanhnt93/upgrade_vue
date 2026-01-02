<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <h2 class="text-center text-header">Báo Cáo Theo Ngày</h2>
          <b-card-body class="p-4">
            <b-row class="pb-2">
              <b-col md="3">
                <label> Chọn chi nhánh </label>
              </b-col>
              <b-col md="3">
                <b-form-select
                  :options="optionsStore"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="store_id"
                  :disabled="loading"
                  v-on:change="confirmChooseStore()">
                </b-form-select>
              </b-col>
            </b-row>
            <div>
              <b-card-group deck>
                <b-card
                  bg-variant="light"
                  header="Số lượng hoá đơn"
                  class="text-center"
                >
                  <b-card-text><h3>{{ billNumber | format_currency }}</h3></b-card-text>
                </b-card>

                <b-card
                  bg-variant="light"
                  header="Tổng doanh thu"
                  class="text-center"
                >
                  <b-card-text><h3>{{ revenue | format_currency }}</h3></b-card-text>
                </b-card>

                <b-card
                  bg-variant="light"
                  header="Tổng chi phí"
                  class="text-center"
                >
                  <b-card-text><h3>{{ fee | format_currency }}</h3></b-card-text>
                </b-card>

                <b-card
                  bg-variant="light"
                  header="Tổng lợi nhuận"
                  class="text-center"
                >
                  <b-card-text><h3>{{ profit | format_currency }}</h3></b-card-text>
                </b-card>

                <b-card
                  bg-variant="light"
                  header="Tiền vốn đầu ngày"
                  class="text-center"
                >
                  <b-card-text><h3>{{ fund | format_currency }}</h3></b-card-text>
                </b-card>
              </b-card-group>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-10">
      <b-col>
        <b-card>
          <span class="loading-more" v-show="loading"
            ><icon name="loading" width="60"
          /></span>

          <b-row v-show="bills.length > 0">
            <b-col>
              <b-row>
                <b-col md="4"> Số kết quả: {{ bills.length }} </b-col>
                <b-col md="8" class="text-right">
                  <download-excel
                    class="btn btn-default text-header"
                    :data="bills"
                    :fields="excel_bill_fields"
                    worksheet="Báo Cáo Theo Bill"
                    name="bao_cao_theo_bill.xls"
                  >
                    <b>Xuất Excel</b>
                  </download-excel>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <table
                    class="table table-bordered table-striped fixed_header"
                  >
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Ngày</th>
                        <th>Số Bill</th>
                        <th>Bàn</th>
                        <th>Tổng tiền món</th>
                        <th>Phí dv, phụ thu</th>
                        <th>Giảm Giá</th>
                        <th>% Thuế</th>
                        <th>Số Tiền Thuế</th>
                        <th>Thành Tiền</th>
                        <th>Tiền mặt</th>
                        <th>Chuyển khoản</th>
                        <th>Tiền điện tử</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="total text-center font-weight-bold" colspan="4">
                          Tổng
                        </td>
                        <td class="text-right total font-weight-bold">
                          {{ totalPrice | format_currency }}
                        </td>
                        <td class="text-right total font-weight-bold">
                          {{ totalServicePrice | format_currency }}
                        </td>
                        <td class="text-right total font-weight-bold">
                          {{ totalDiscount | format_currency }}
                        </td>
                        <td></td>
                        <td class="text-right total font-weight-bold">
                          {{ totalVat | format_currency }}
                        </td>
                        <td class="text-right total font-weight-bold">
                          {{ totalAmount | format_currency }}
                        </td>
                        <td class="text-right total font-weight-bold">
                          {{ total_cash | format_currency }}
                        </td>
                        <td class="text-right total font-weight-bold">
                          {{ total_credit | format_currency }}
                        </td>
                        <td class="text-right total font-weight-bold">
                          {{ total_emoney | format_currency }}
                        </td>
                      </tr>

                      <tr v-for="(bill, index) in bills" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ bill.created_at }}</td>
                        <td>{{ bill.bill_number }}</td>
                        <td>{{ bill.table_name }}</td>
                        <td class="text-right">
                          {{ bill.sub_total | format_currency }}
                        </td>
                        <td class="text-right">
                          {{ bill.service_price | format_currency }}
                        </td>
                        <td class="text-right">
                          {{ bill.discount_amount | format_currency }}
                        </td>
                        <td class="text-right">{{ bill.vat_percent }}</td>
                        <td class="text-right">
                          {{ bill.vat_value | format_currency }}
                        </td>
                        <td class="text-right">
                          {{ bill.total | format_currency }}
                        </td>
                        <td class="text-right">
                          {{ bill.cash | format_currency }}
                        </td>
                        <td class="text-right">
                          {{ bill.credit | format_currency }}
                        </td>
                        <td class="text-right">
                          {{ bill.e_money | format_currency }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </b-col>
              </b-row>
            </b-col>
          </b-row>

          <b-row v-show="bills.length == 0">
            <b-col class="text-center">
              Không tìm thấy kết quả nào
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- Modal choose resource -->
    <b-modal centered hide-footer hide-header id="modal-choose-store">
      <b-row>
        <b-col class="text-center text-header">
          <h5>Vui lòng chọn chi nhánh</h5>
        </b-col>
      </b-row>
      <br>
      <b-row>
        <b-col md="12">
          <label> Cửa hàng </label>
          <b-form-select
            :options="optionsStore"
            id="status"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="store_id"
            :disabled="onSearch">
          </b-form-select>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12" class="text-center mt-3">
          <button class="btn btn-primary px-4 default-btn-bg" @click="confirmChooseStore">
            Xác nhận
          </button>
        </b-col>
      </b-row>

    </b-modal>
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
      store_id: null,
      revenue: 0,
      billNumber: 0,
      fee: 0,
      profit: 0,
      fund: 0,
      cash: 0,
      credit: 0,
      eMoney: 0,
      loading: false,
      bills: [],
      totalPrice: 0,
      totalServicePrice: 0,
      totalDiscount: 0,
      totalVat: 0,
      totalAmount: 0,
      totalQuantity: 0,
      total_cash: 0,
      total_credit: 0,
      total_emoney: 0,
      excel_bill_data: null,
      excel_bill_fields: {
        "Ngày": "created_at",
        "Số Bill": "bill_number",
        "Bàn": "table_name",
        "Tổng tiền món": "sub_total",
        "Phí dv, phụ thu": "service_price",
        "Giảm Giá": "discount_amount",
        "% Thuế": "vat_percent",
        "Số Tiền Thuế": "vat_value",
        "Thành Tiền": "total",
        "Tiền mặt": "cash",
        "Chuyển khoản": "credit",
        "Tiền điện tử": "e_money"
      }
    };
  },
  mounted() {
    // Load store option
    this.getOptionStore()
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

      /**
     * Get store options
     */
    getOptionStore() {
      adminAPI.getStoreOption().then(res => {
        if(res && res.data && res.data.data) {
          this.optionsStore = res.data.data

          // Show modal chọn store
          this.$bvModal.show('modal-choose-store')
        }
      }).catch(err => {
        // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
      })
    },

      /**
     * Xác nhận chọn store
     */
    confirmChooseStore() {
      // Show modal chọn store
      this.$bvModal.hide('modal-choose-store')

      this.getReportToday();
      this.getTotalBill();
    },

    getReportToday() {
      console.log("getReportToday");
      adminAPI
        .getBrandReportToday(this.store_id)
        .then(res => {
          if (res && res.data && res.data.data) {
            this.revenue = res.data.data.reveneu;
            this.billNumber = res.data.data.bill_number;
            this.fee = res.data.data.fee;
            this.profit = res.data.data.profit;
            this.fund = res.data.data.fund;
          }
        })
        .catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err);
          this.popToast("danger", errorMess);
        });
    },
    getTotalBill() {
      console.log("getTotalBill");
      this.loading = true;
      // Search
      adminAPI
        .getBrandBillForTodayReport(this.store_id)
        .then(res => {
          if (res && res.data && res.data.data) {
            this.bills = res.data.data.data;
            this.totalPrice = res.data.data.total_price;
            this.totalServicePrice = res.data.data.total_service_price;
            this.totalDiscount = res.data.data.total_discount;
            this.totalVat = res.data.data.total_vat;
            this.totalAmount = res.data.data.total_amount;
            this.totalQuantity = res.data.data.total_quantity;
            this.total_cash = res.data.data.total_cash;
            this.total_credit = res.data.data.total_credit;
            this.total_emoney = res.data.data.total_emoney;
          }
          this.loading = false;
        })
        .catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err);
          this.popToast("danger", errorMess);
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
  .total {
    color: #ed592a;
  }
</style>
