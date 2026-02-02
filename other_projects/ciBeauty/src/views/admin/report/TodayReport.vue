<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <h2 class="text-center text-header text-3xl font-bold">Báo cáo theo ngày</h2>
          <div class="card-body p-4"  >
            <div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="bg-gray-50 border rounded shadow-sm">
                  <div class="px-4 py-3 border-b border-gray-200 font-bold bg-gray-100 rounded-t text-center">Số lượng hoá đơn</div>
                  <div class="p-4 text-center"><h3 class="text-2xl font-bold">{{ billNumber | format_currency }}</h3></div>
                </div>

                <div class="bg-gray-50 border rounded shadow-sm">
                  <div class="px-4 py-3 border-b border-gray-200 font-bold bg-gray-100 rounded-t text-center">Tổng doanh thu</div>
                  <div class="p-4 text-center"><h3 class="text-2xl font-bold">{{ revenue | format_currency }}</h3></div>
                </div>

                <div class="bg-gray-50 border rounded shadow-sm">
                  <div class="px-4 py-3 border-b border-gray-200 font-bold bg-gray-100 rounded-t text-center">Tổng chi phí</div>
                  <div class="p-4 text-center"><h3 class="text-2xl font-bold">{{ fee | format_currency }}</h3></div>
                </div>

                <div class="bg-gray-50 border rounded shadow-sm">
                  <div class="px-4 py-3 border-b border-gray-200 font-bold bg-gray-100 rounded-t text-center">Tổng lợi nhuận</div>
                  <div class="p-4 text-center"><h3 class="text-2xl font-bold">{{ profit | format_currency }}</h3></div>
                </div>

                <div class="bg-gray-50 border rounded shadow-sm">
                  <div class="px-4 py-3 border-b border-gray-200 font-bold bg-gray-100 rounded-t text-center">Tiền vốn đầu ngày</div>
                  <div class="p-4 text-center"><h3 class="text-2xl font-bold">{{ fund | format_currency }}</h3></div>
                </div>
              </div>
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

          <div class="grid grid-cols-12 gap-4" v-show="bills.length> 0">
            <div class="col-span-full">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-4"> Số kết quả: {{ bills.length }} </div>
                <div class="col-span-8 text-right">
                  <download-excel
                    class="btn btn-default text-header"
                    :data="bills"
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
                        <th>Ngày</th>
                        <th>Số Bill</th>
                        <th>Bàn</th>
                        <th>Tổng tiền dv</th>
                        <th>Thanh toán trước</th>
                        <th>Phí dịch vụ, phụ thu</th>
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
                          {{ total_prepay_amount | format_currency }}
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
                          {{ bill.prepay_amount | format_currency }}
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
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4" v-show="bills.length == 0">
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
      total_prepay_amount: 0,
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
        "Tổng tiền dv": "sub_total",
        "Phí dịch vụ, phụ thu": "service_price",
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
      if (variant === "danger") {
        this.$toast.error(content);
      } else if (variant === "success") {
        this.$toast.success(content);
      } else if (variant === "warning") {
        this.$toast.warning(content);
      } else {
        this.$toast.info(content);
      }
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
            this.total_prepay_amount = res.data.data.total_prepay_amount;
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
