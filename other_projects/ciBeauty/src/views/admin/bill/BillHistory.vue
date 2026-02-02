<template>
  <div class="container-fluid">

    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <h4 class="mt-2 text-center text-header">Lịch Sử Bán Hàng</h4>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">

            <div class="col-span-6">
              <label>
                Thời gian:
              </label>
              <div class="input-group">
                  <span class="input-group-addon pr-1">Từ ngày</span>
                  <input
                    id="fromDate"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="inputs.fromDate"
                    maxlength="10"
                    @keyup="inputDateOnly($event.target)"
                    :disabled="onSearch">
                  <!-- <input
                    id="date"
                    type="date"
                    v-model="inputs.fromDate"
                    class="form-control"
                    @change="inputs.fromDate=$event.target.value"> -->
                  <span class="input-group-addon pl-1 pr-1">Đến ngày</span>
                  <input
                    id="toDate"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="inputs.toDate"
                    maxlength="10"
                    @keyup="inputDateOnly($event.target)"
                    :disabled="onSearch">
                </div>
            </div>

            <div class="col-span-3">
              <label>
                Trạng thái đơn:
              </label>
              <select class="form-control"
                id="status"
                v-model="inputs.status">
                <option v-for="option in statusOption" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="col-span-3">
              <label class="label-width text-white">
                 Xem
              </label>
              <button class="btn btn-outline-primary float-right px-4 btn-width-120"
                :disabled="onSearch" @click.prevent="search">
                Xem
              </button>
            </div>
          </div>
          
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <div class="grid grid-cols-12 gap-4" v-show="firstSearch == false && bills.length">
            <div class="col-span-full">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-4">
                  Số kết quả: {{bills.length}}
                </div>
              </div>
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-full">
                  <table class="table table-bordered table-striped fixed_header">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Ngày</th>
                        <th>Số Bill</th>
                        <th>Tên K.H</th>
                        <th>Sdt K.H</th>
                        <th>Tổng tiền dịch vụ</th>
                        <th>Tổng tiền thanh toán</th>
                        <th>Trạng thái</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(bill, index) in bills" :key="index">
                        <td>{{index + 1}}</td>
                        <td>{{bill.created_at}}</td>
                        <td>{{bill.bill_number}}</td>
                        <td>{{bill.customer_name}}</td>
                        <td>{{bill.customer_phone}}</td>
                        <td class="text-right">{{currencyFormat(bill.sub_total)}}</td>
                        <td class="text-right">{{currencyFormat(bill.total)}}</td>
                        <td>
                          <span class="text-danger" v-if="!bill.is_payment">Lưu nháp</span>
                          <span v-if="bill.is_payment">Đã thanh toán</span>
                        </td>
                        <td class="text-right">
                          <div v-if="!bill.is_payment" class="button-group" style="white-space: nowrap;">
                            <button class="btn btn-sm btn-primary" @click="$router.push('/bill/edit/' + bill.id)">Sửa</button>
                            <button class="btn btn-sm btn-danger ml-2" @click.prevent="deleteBill(bill)">Xoá</button>
                          </div>

                          <div v-if="bill.is_payment" class="button-group" style="white-space: nowrap;">
                            <button class="btn btn-sm btn-success" @click="$router.push('/bill/edit/' + bill.id)">In HĐ</button>
                            <button v-if="isRoot" class="btn btn-sm btn-danger ml-2" @click.prevent="deleteBill(bill)">Xoá</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4" v-show="firstSearch == false && bills.length == 0">
            <div class="col-span-full text-center">
              Không tìm thấy kết quả nào
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal xác nhận xoá -->
    <div v-if="modalDeleteBill" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div class="text-center px-4 py-6">
          <!-- Custom title -->
          <h4 class="font-weight-bold mb-4 text-xl" style="color: #3b82f6;">Xác nhận xoá bill</h4>

          <!-- Số hoá đơn -->
          <p class="mb-2 text-lg">
            <strong>Số hoá đơn: {{ selectedBill.bill_number }}</strong>
          </p>

          <p class="mb-2 text-lg">
            <strong>Trạng thái: Lưu nháp</strong>
          </p>

          <!-- Tên khách hàng -->
          <p class="mb-2 text-lg">
            👤 <strong>Khách hàng: {{ selectedBill.customer_name || 'Chưa chọn khách hàng' }}</strong>
          </p>

          <!-- Số tiền thanh toán -->
          <p class="mb-4 text-2xl font-bold" style="color: #10b981;">
            💰 {{ currencyFormat(selectedBill.total) }}
          </p>

          <!-- Buttons -->
          <div class="d-flex justify-content-center gap-3">
            <button class="btn btn-outline-secondary rounded-pill px-4 py-2 shadow-sm"
              @click="modalDeleteBill = false">
              ❌ Hủy
            </button>

            <button class="btn btn-danger rounded-pill px-4 py-2 shadow-sm"
              @click="confirmDeleteBill">
              ✅ Xác nhận xoá
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import billApi from '@/api/bill'
import commonFunc from '@/common/commonFunc'



export default {
  components: {
  },
  data () {
    return {
      isRoot: false,
      statusOption: [
        {value: 1, text: '-- Tất cả --'},
        {value: 2, text: 'Chưa thanh toán'},
        {value: 3, text: 'Đã thanh toán'}
      ],
      inputs: {
        fromDate: null,
        toDate: null,
        status: 1,
      },
      onSearch: false,
      bills: [],
      selectedBill: {},
      modalDeleteBill: false,
      firstSearch: true,
      widowHeight: 500,
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
      // excel_bill_data: null,
      // excel_bill_fields: {
      //   'Ngày': 'created_at',
      //   'Số Bill': 'bill_number',
      //   'Bàn' : 'table_name',
      //   'Tổng tiền dv' : 'sub_total',
      //   'Phí dịch vụ, phụ thu' : 'service_price',
      //   'Giảm Giá' : 'discount_amount',
      //   '% Thuế' : 'vat_percent',
      //   'Số Tiền Thuế' : 'vat_value',
      //   'Thành Tiền' : 'total',
      //   "Tiền mặt": "cash",
      //   "Chuyển khoản": "credit",
      //   "Tiền điện tử": "e_money"
      // },
      // excel_service_fields: {
      //   'Ngày': 'created_at',
      //   'Số Bill': 'bill_number',
      //   'Bàn' : 'table_name',
      //   'Tên Dv' : 'service_name',
      //   'Đơn Giá' : 'price',
      //   'Số Lượng' : 'quantity',
      //   'Thành Tiền' : 'amount',
      // },
      loading: false,
    }
  },
  mounted() {
    if(this.$store && this.$store.state && this.$store.state.user && this.$store.state.user.isRoot) {
      this.isRoot = true
    }

    let dateNow = new Date().toJSON().slice(0,10)
    // Fix: Format date correctly for init
    this.inputs.toDate = commonFunc.formatDate(dateNow)
    this.inputs.fromDate = commonFunc.formatDate(dateNow)

    // Get window height
    this.widowHeight = window.innerHeight;

    this.search()
  },
  methods: {
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
     * Check valid from date and to date
     */
    checkFromDateAndToDate() {
      if(this.inputs.fromDate == "" || this.inputs.fromDate == null || commonFunc.dateFormatCheck(this.inputs.fromDate) == false) {
        this.popToast('danger', "Mục từ ngày không đúng")
        return false
      }
      if(this.inputs.toDate == "" || this.inputs.toDate == null || commonFunc.dateFormatCheck(this.inputs.fromDate) == false) {
        this.popToast('danger', "Mục đến ngày không đúng")
        return false
      }
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

      // Check validate
      if(!this.checkFromDateAndToDate()) {
        this.bills = []
        return
      }
      this.onSearch = true
      this.loading = true

      let params = {
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        "status": this.inputs.status
      }

      // Search
      billApi.searchBill(params).then(res => {
        if(res && res.data && res.data.data) {
          this.bills = res.data.data

          // this.totalPrice = res.data.data.total_price
          // this.totalServicePrice = res.data.data.total_service_price
          // this.total_prepay_amount = res.data.data.total_prepay_amount
          // this.totalDiscount = res.data.data.total_discount
          // this.totalVat = res.data.data.total_vat
          // this.totalAmount = res.data.data.total_amount
          // this.totalQuantity = res.data.data.total_quantity
          // this.total_cash = res.data.data.total_cash
          // this.total_credit = res.data.data.total_credit
          // this.total_emoney = res.data.data.total_emoney
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

    deleteBill(bill) {
      this.selectedBill = bill
      this.modalDeleteBill = true
    },

    confirmDeleteBill() {
      billApi.deleteBill(this.selectedBill.id).then(res => {
        if(res && res.data && res.data.status == 200) {
          this.modalDeleteBill = false
          this.search()
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
   * Currency format
   */
    currencyFormat(num) {
      let result = null
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },

    /**
     * Only input date
     */
     inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },

  }
}
</script>


<style lang="css" scoped>
  .label-width {
    width: 100%;
  }
  .total {
    color: #ed592a;
  }
</style>
