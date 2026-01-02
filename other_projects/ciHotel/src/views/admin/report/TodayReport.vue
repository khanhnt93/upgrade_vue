<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <h2 class="text-center text-header">BÁO CÁO THEO NGÀY</h2>
          <b-card-body class="p-4">
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
                        <th>Phòng</th>
                        <th>Tổng tiền phòng</th>
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
                        <td
                          class="total text-center font-weight-bold"
                          colspan="4"
                        >
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
                        <td>{{ bill.room_name }}</td>
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
  </div>
</template>

<script>
import adminAPI from "@/api/admin";
import commonFunc from "@/common/commonFunc";
import moment from 'moment';

export default {
  data() {
    return {
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
        "Phòng": "room_name",
        "Tổng tiền phòng": "sub_total",
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
    this.getReportToday();
    this.getTotalBill();
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
    getReportToday() {
      console.log("getReportToday");
      adminAPI
        .getReportToday()
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
        .getBillForTodayReport()
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
