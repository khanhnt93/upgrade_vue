<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h4 class="mt-2 text-center text-header">Chi Tiết Hóa Đơn</h4>
            </div>
          </div>
          <hr>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <div class="text-center w-100">
                <span class="loading-more" v-show="loadingGetDetail"><icon name="loading" width="60" /></span>
              </div>
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-3">
                  Ngày hóa đơn: {{selectedBill.invoice_date}}
                </div>
                <div class="col-span-3">
                  Khách hàng: {{selectedBill.customer_name}}
                </div>
                <div class="col-span-3">
                  Số hóa đơn: <b>{{selectedBill.invoice_number}}</b>
                </div>
              </div>
              <div class="grid grid-cols-12 gap-4 mb-5">
                <div class="col-span-3">
                  Tổng tiền trước thuế: {{currencyFormat(selectedBill.total_before_tax)}}
                </div>
                <div class="col-span-3">
                  Tổng tiền thuế: {{currencyFormat(selectedBill.total_tax)}}
                </div>
                <div class="col-span-3">
                  Tổng tiền sau thuế: <b>{{currencyFormat(selectedBill.total_after_tax)}}</b>
                </div>
              </div>
              <div class="d-flex flex-grow-1">
                <!-- Nửa trái: Mẫu in hóa đơn -->
                <div class="w-50 p-3 d-flex flex-column h-100 border-right">
                  <div class="receipt-container">
                    <div class="receipt-content">
                      <h4 style="font-size: 22px; text-align: center; margin-bottom: 0.3rem; margin-top: 0.3rem;">
                        <strong>BILL GỐC</strong>
                      </h4>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin: 0;">
                        <p>Số hóa đơn: {{ selectedBill.bill_number }}</p>
                        <p>Ngày: {{ selectedBill.invoice_date }}</p>
                      </div>
                      <p v-if="selectedBill.customer_id" style="margin: 0;">Khách hàng: {{ selectedBill.customer_id + " - " + selectedBill.customer_name }}</p>
                      

                      <!-- Danh sách dịch vụ -->
                      <div style="font-size: 13px; margin-bottom: 0.5rem;">
                        <div style="display: flex; padding-top:5px; justify-content: space-between; font-size: 0.875rem; border-bottom: 1px solid #4d4d4d; border-top: 1px solid #4d4d4d;">
                          <div>Dịch vụ/Giá</div>
                          <div>Số lượng</div>
                          <div>Thành tiền</div>
                        </div>
                        <div v-for="(item, i) in selectedBill.services" :key="i" style="border-bottom: 1px solid #4d4d4d;">
                          <!-- Tên dịch vụ -->
                          <div>
                            {{ item.name }}
                          </div>
                          <!-- Giá / SL / Thành tiền -->
                          <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                            <div>{{ currencyFormat(item.price) }}</div>
                            <div>{{ currencyFormat(item.quantity) }}</div>
                            <div>{{ currencyFormat(item.price * item.quantity) }}</div>
                          </div>
                        </div>
                      </div>
                      <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <strong>Tổng cộng: </strong>
                        <strong>{{ currencyFormat(selectedBill.sub_total) }}</strong>
                      </p>
                      <p v-if="selectedBill.prepay_amount || selectedBill.card_amount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <span>Đã thanh toán trước: </span>
                        <span>{{ currencyFormat(selectedBill.prepay_amount + selectedBill.card_amount) }}</span>
                      </p>
                      <p v-if="selectedBill.surcharge_amount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <span>Phụ thu: </span>
                        <span>{{ currencyFormat(selectedBill.surcharge_amount) }}</span>
                      </p>
                      <p v-if="selectedBill.discount_amount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <span>Giảm giá:</span>
                        <span>{{ currencyFormat(selectedBill.discount_amount) }}</span>
                      </p>
                      <p v-if="selectedBill.vat_value"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <span>VAT:</span>
                        <span>{{ currencyFormat(selectedBill.vat_value) }}</span>
                      </p>
                      <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <strong>Thanh toán:</strong>
                        <strong>{{ currencyFormat(selectedBill.total) }}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Nửa phải: Vùng chỉnh sửa trước khi gửi lên HĐĐT  -->
                <div class="w-50 p-3 d-flex flex-column h-100">
                  <div class="receipt-container">
                    <div class="receipt-content">
                      <h4 style="font-size: 22px; text-align: center; margin-bottom: 0.3rem; margin-top: 0.3rem;">
                        <strong>BILL HĐĐT</strong>
                      </h4>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin: 0;">
                        <p>Số hóa đơn: {{ selectedBill.bill_number }}</p>
                        <p>Ngày: {{ selectedBill.invoice_date }}</p>
                      </div>
                      <p v-if="selectedBill.customer_id" style="margin: 0;">Khách hàng: {{ selectedBill.customer_id + " - " + selectedBill.customer_name }}</p>

                      <!-- Danh sách dịch vụ -->
                      <!-- TODO: load tên dv theo tên viết tắt, cho phép chỉnh sửa, bỏ bớt item -->
                      <div style="font-size: 13px; margin-bottom: 0.5rem;">
                        <div style="display: flex; padding-top:5px; justify-content: space-between; font-size: 0.875rem; border-bottom: 1px solid #4d4d4d; border-top: 1px solid #4d4d4d;">
                          <div>Dịch vụ/Giá</div>
                          <div>Số lượng</div>
                          <div>Thành tiền</div>
                        </div>
                        <div v-for="(item, i) in selectedBill.invoice_items" :key="i" style="border-bottom: 1px solid #4d4d4d;">
                          <!-- Tên dịch vụ -->
                          <div>
                            {{ item.itemName }}
                          </div>
                          <!-- Giá / SL / Thành tiền -->
                          <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                            <div>{{ currencyFormat(item.unitPrice) }}</div>
                            <div>{{ currencyFormat(item.quantity) }}</div>
                            <div>{{ currencyFormat(item.itemTotalAmountWithoutTax) }}</div>
                          </div>
                        </div>
                      </div>
                      <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <strong>Tổng tiền trước thuế: </strong>
                        <span>{{ currencyFormat(selectedBill.total_before_tax) }}</span>
                      </p>
                      <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <span>Tổng tiền thuế ({{ selectedBill.tax_percent }}%): </span>
                        <span>{{ currencyFormat(selectedBill.total_tax) }}</span>
                      </p>
                      <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <strong>Tổng tiền sau thuế: </strong>
                        <span>{{ currencyFormat(selectedBill.total_after_tax) }}</span>
                      </p>
                    </div>
                  </div>
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
import eInvoiceApi from '@/api/eInvoice'
import commonFunc from '@/common/commonFunc'

export default {
  data () {
    return {
      loading: false,
      selectedBill: {
        invoice_sub_total: 0,
        invoice_vat_value: 0,
        invoice_vat_percent: 0,
        invoice_total: 0,
      },
      loadingGetDetail: false,

    }
  },
  mounted() {
    this.getInvoiceDetail()
  },
  methods: {

      // Get bill detail
    getInvoiceDetail() {
      let billId = this.$route.params.id
      if(billId){
        this.loadingGetDetail = true

        eInvoiceApi.getInvoiceDetail(billId).then(res => {
          if(res != null && res.data != null && res.data.data != null){
            this.selectedBill = res.data.data
          }
          this.loadingGetDetail = false
        }).catch(err => {
          this.loadingGetDetail = false
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    },

    /**
   * Currency format
   */
   currencyFormat(num) {
      let result = ""
      if(num == 0) {
        return "0"
      }
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },


  }
}
</script>
