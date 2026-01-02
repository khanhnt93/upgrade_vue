<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>

          <b-row>
            <b-col md='12'>
              <h4 class="text-center text-header">QUẢN LÝ HÓA ĐƠN</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row class="form-row">
            <b-col md="3">
              <label> Từ ngày </label>
              <input
                id="fromDate"
                type="text"
                maxlength="10"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.fromDate"
                @keyup="inputDateOnly($event.target)"
              >
            </b-col>
            <b-col md="3">
              <label> Đến ngày </label>
              <input
                id="toDate"
                type="text"
                maxlength="10"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.toDate"
                @keyup="inputDateOnly($event.target)"
              >
            </b-col>
            <b-col md="3">
              <label> Số hóa đơn </label>
              <input
                id="bill-number"
                type="text"
                maxlength="20"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.billNumber"
                @keyup="integerOnly($event.target)">
            </b-col>

            <b-col md="3">
              <label class="label-width text-white">
                 Tìm kiếm
              </label>
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch"
                        @click.prevent="search">
                Tìm Kiếm
              </b-button>
            </b-col>
          </b-row>

        </b-card>

        <b-card>
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <b-row>
            <b-col>
              Số kết quả: {{ bills.length }}
            </b-col>
          </b-row>

          <table class="table table-bordered table-striped fixed_header">
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
              <th></th>
            </tr>
            </thead>
            <tbody>
              <tr>
                <td class="total text-center font-weight-bold" colspan="4">Tổng</td>
                <td class="text-right total font-weight-bold">{{currencyFormat(totalPrice)}}</td>
                <td class="text-right total font-weight-bold">{{currencyFormat(totalServicePrice)}}</td>
                <td class="text-right total font-weight-bold">{{currencyFormat(totalDiscount)}}</td>
                <td></td>
                <td class="text-right total font-weight-bold">{{currencyFormat(totalVat)}}</td>
                <td class="text-right total font-weight-bold">{{currencyFormat(totalAmount)}}</td>
                <td class="text-right total font-weight-bold">{{currencyFormat(total_cash)}}</td>
                <td class="text-right total font-weight-bold">{{currencyFormat(total_credit)}}</td>
                <td class="text-right total font-weight-bold">{{currencyFormat(total_emoney)}}</td>
                <td></td>
              </tr>
              <tr v-for="(bill, index) in bills">
                <td>{{index + 1}}</td>
                <td>{{bill.created_at}}</td>
                <td>{{bill.bill_number}}</td>
                <td>{{bill.room_name}}</td>
                <td class="text-right">{{currencyFormat(bill.sub_total)}}</td>
                <td class="text-right">{{currencyFormat(bill.service_price)}}</td>
                <td class="text-right">{{currencyFormat(bill.discount_amount)}}</td>
                <td class="text-right">{{bill.vat_percent}}</td>
                <td class="text-right">{{currencyFormat(bill.vat_value)}}</td>
                <td class="text-right">{{currencyFormat(bill.total)}}</td>
                <td class="text-right">{{currencyFormat(bill.cash)}}</td>
                <td class="text-right">{{currencyFormat(bill.credit)}}</td>
                <td class="text-right">{{currencyFormat(bill.e_money)}}</td>
                <td class="justify-content-center"><b-list-group horizontal>
                  <b-list-group-item v-b-tooltip.hover title="Sửa" @click="edit(bill.id)">
                    <i class="fa fa-edit" />
                  </b-list-group-item>
                  <b-list-group-item v-b-tooltip.hover title="Xóa"
                                     @click="deleteBill(bill.id, bill.bill_number)">
                    <i class="fa fa-trash" />
                  </b-list-group-item>
                  <b-list-group-item v-b-tooltip.hover title="In"
                                     @click="printBill(bill.id)">
                    <i class="fa fa-print" />
                  </b-list-group-item>
                </b-list-group></td>
              </tr>


            </tbody>
          </table>

        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import moment from "moment";
import commonFunc from "../../../common/commonFunc";
import adminAPI from '@/api/admin'
import Cookies from "js-cookie";

export default {
  data() {
    return {
      inputs: {
        fromDate: null,
        toDate: null,
        billNumber: null
      },
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
      loading:false,
      onSearch:false
    }
  },
  mounted() {
    // Get default date
    let dateNow = new Date()
    this.inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
    this.inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0,10))

    this.search()
  },
  computed: {

  },
  methods: {
    /**
     * Only input integer
     */
    integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
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
     * Make toast without title
     */
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      })
    },

    /**
     * Currency format
     */
    currencyFormat(num) {
      let result = null
      if (num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
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
    search() {

      // Check validate
      if(!this.checkFromDateAndToDate()) {
        this.bills = []
        return
      }
      this.onSearch = true
      this.loading = true

      let params = {
        "from_date": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "to_date": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        "bill_number": this.inputs.billNumber,
      }

      // Search
      adminAPI.searchReportBill(params).then(res => {
        if(res && res.data && res.data.data) {
          this.bills = res.data.data.data
          this.totalPrice = res.data.data.total_price
          this.totalServicePrice = res.data.data.total_service_price
          this.totalDiscount = res.data.data.total_discount
          this.totalVat = res.data.data.total_vat
          this.totalAmount = res.data.data.total_amount
          this.totalQuantity = res.data.data.total_quantity
          this.total_cash = res.data.data.total_cash
          this.total_credit = res.data.data.total_credit
          this.total_emoney = res.data.data.total_emoney
        }

        this.onSearch = false
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
        this.onSearch = false
        this.loading = false
      })
    },
    edit(id) {
      this.$router.push(`/bill/edit/${id}`);
    },
    printBill(id){
      if (Cookies.get(id)) {
        console.log(Cookies.get(id))
        Cookies.remove(id)
      }
      Cookies.set("printFrom", "bill-list")
      this.$router.push(`/bill/print/${id}`)
    },
    deleteBill(id, bill_number) {
      this.$bvModal.msgBoxConfirm(`Xóa hóa đơn ${bill_number}. Bạn có chắc không?`, {
        title: false,
        buttonSize: 'lg',
        centered: true, size: 'lg',
        footerClass: 'p-2'
      }).then(res => {
          if (res) {
            adminAPI.deleteOldBill({id}).then(res => {
              if (res.data.status == 200) {
                this.popToast('success', 'Xóa thành công')
                this.search()
              }
            }).catch(err => {
              this.popToast('danger', err.message)
            })
          }
        })
      },

  }
}
</script>


<style lang="css" scoped>
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
