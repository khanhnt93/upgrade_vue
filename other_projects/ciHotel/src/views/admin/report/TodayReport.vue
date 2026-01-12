<template>
  <div class="container mx-auto px-4">
    <!-- Summary Cards Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-center text-2xl font-bold text-orange-600 mb-6">BÁO CÁO THEO NGÀY</h2>

      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Số lượng hoá đơn -->
        <div class="bg-gray-50 rounded-lg shadow p-4 text-center">
          <div class="text-sm font-medium text-gray-600 mb-2">Số lượng hoá đơn</div>
          <h3 class="text-xl font-bold text-gray-800">{{ formatCurrency(billNumber) }}</h3>
        </div>

        <!-- Tổng doanh thu -->
        <div class="bg-gray-50 rounded-lg shadow p-4 text-center">
          <div class="text-sm font-medium text-gray-600 mb-2">Tổng doanh thu</div>
          <h3 class="text-xl font-bold text-gray-800">{{ formatCurrency(revenue) }}</h3>
        </div>

        <!-- Tổng chi phí -->
        <div class="bg-gray-50 rounded-lg shadow p-4 text-center">
          <div class="text-sm font-medium text-gray-600 mb-2">Tổng chi phí</div>
          <h3 class="text-xl font-bold text-gray-800">{{ formatCurrency(fee) }}</h3>
        </div>

        <!-- Tổng lợi nhuận -->
        <div class="bg-gray-50 rounded-lg shadow p-4 text-center">
          <div class="text-sm font-medium text-gray-600 mb-2">Tổng lợi nhuận</div>
          <h3 class="text-xl font-bold text-gray-800">{{ formatCurrency(profit) }}</h3>
        </div>

        <!-- Tiền vốn đầu ngày -->
        <div class="bg-gray-50 rounded-lg shadow p-4 text-center">
          <div class="text-sm font-medium text-gray-600 mb-2">Tiền vốn đầu ngày</div>
          <h3 class="text-xl font-bold text-gray-800">{{ formatCurrency(fund) }}</h3>
        </div>
      </div>
    </div>

    <!-- Bills Table Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mt-6">
      <!-- Loading State -->
      <span class="flex justify-center items-center py-8" v-show="loading">
        <icon name="loading" width="60" />
      </span>

      <!-- Results with Excel Export -->
      <div v-show="bills.length > 0">
        <div class="flex flex-col md:flex-row justify-between items-center mb-4">
          <div class="mb-2 md:mb-0">Số kết quả: {{ bills.length }}</div>
          <button
            @click="handleExportExcel"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-orange-600 font-bold rounded border border-gray-300"
          >
            <b>Xuất Excel</b>
          </button>
        </div>

        <!-- Bills Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr class="bg-blue-100">
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">STT</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Ngày</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Số Bill</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Phòng</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Tổng tiền phòng</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Phí dv, phụ thu</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Giảm Giá</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">% Thuế</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Số Tiền Thuế</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Thành Tiền</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Tiền mặt</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Chuyển khoản</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Tiền điện tử</th>
              </tr>
            </thead>
            <tbody>
              <!-- Total Row -->
              <tr style="color: #ed592a;">
                <td class="border border-gray-300 px-4 py-2 text-center font-bold" colspan="4">
                  Tổng
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right font-bold whitespace-nowrap">
                  {{ formatCurrency(totalPrice) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right font-bold whitespace-nowrap">
                  {{ formatCurrency(totalServicePrice) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right font-bold whitespace-nowrap">
                  {{ formatCurrency(totalDiscount) }}
                </td>
                <td class="border border-gray-300 px-4 py-2"></td>
                <td class="border border-gray-300 px-4 py-2 text-right font-bold whitespace-nowrap">
                  {{ formatCurrency(totalVat) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right font-bold whitespace-nowrap">
                  {{ formatCurrency(totalAmount) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right font-bold whitespace-nowrap">
                  {{ formatCurrency(total_cash) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right font-bold whitespace-nowrap">
                  {{ formatCurrency(total_credit) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right font-bold whitespace-nowrap">
                  {{ formatCurrency(total_emoney) }}
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-for="(bill, index) in bills" :key="index">
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ index + 1 }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ bill.created_at }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ bill.bill_number }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ bill.room_name }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">
                  {{ formatCurrency(bill.sub_total) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">
                  {{ formatCurrency(bill.service_price) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">
                  {{ formatCurrency(bill.discount_amount) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ bill.vat_percent }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">
                  {{ formatCurrency(bill.vat_value) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">
                  {{ formatCurrency(bill.total) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">
                  {{ formatCurrency(bill.cash) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">
                  {{ formatCurrency(bill.credit) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">
                  {{ formatCurrency(bill.e_money) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-show="bills.length == 0" class="text-center py-8 text-gray-500">
        Không tìm thấy kết quả nào
      </div>
    </div>
  </div>
</template>

<script>
import adminAPI from "@/api/admin";
import commonFunc from "@/common/commonFunc";
import moment from 'moment';
import { useToast } from '@/composables/useToast';
import { useFormatters } from '@/composables/useFormatters';
import { useExcelExport } from '@/composables/useExcelExport';

export default {
  setup() {
    const { toast } = useToast();
    const { formatCurrency } = useFormatters();
    const { exportToExcel } = useExcelExport();

    return {
      toast,
      formatCurrency,
      exportToExcel
    };
  },
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
          let errorMess = commonFunc.handleStaffError(err);
          this.toast.error(errorMess);
        });
    },
    getTotalBill() {
      console.log("getTotalBill");
      this.loading = true;
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
          let errorMess = commonFunc.handleStaffError(err);
          this.toast.error(errorMess);
          this.loading = false;
        });
    },
    handleExportExcel() {
      this.exportToExcel(
        this.bills,
        this.excel_bill_fields,
        'Báo Cáo Theo Bill',
        'bao_cao_theo_bill.xls'
      );
    }
  }
};
</script>

<style lang="scss" scoped>
/* Scoped styles if needed */
</style>
