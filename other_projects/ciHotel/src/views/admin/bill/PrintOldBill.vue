<template>
  <div class="container-fluid">
    <b-row class="hidden-print">
      <b-col>
        <b-row>
          <b-col cols="6">
            <b-button variant="secondary" class="pull-left px-4" @click="goBack()">
              Quay lại
            </b-button>
          </b-col>
          <b-col cols="6">
            <button v-show="!paymentInfoNull"
                    class="btn btn-primary pull-right px-4 default-btn-bg"
                    @click="printContent">
              In hóa đơn
            </button>
          </b-col>
        </b-row>
        <hr>
      </b-col>
    </b-row>

    <b-row id="printBillAble" v-show="!loading">
      <b-col>
        <div v-for="(services, index) in this.listServices" :key="services.id">
          <div class="page">
            <div class="print-header">
              <div style="flex: 1;align-items: center;display: flex; ">
                <div>
                  <p><b>{{ paymentInfo.hotel_name }}</b></p>
                  <p>{{ paymentInfo.hotel_address }}<br>Email: {{ paymentInfo.hotel_email }} - ĐT: {{ paymentInfo.hotel_phone_number }}</p>
                </div>
              </div>

              <div class="logo-container" style="display: flex; justify-content: flex-end">
                <img v-if="paymentInfo.hotel_image" v-bind:src="paymentInfo.hotel_image" alt="logo" height="100"/>
              </div>
            </div>
            <div class="print-bill-info">
              <div class="bill-title"><h3>Hóa đơn</h3></div>
              <div>
                <table style="width: 100%;">
                  <tr>
                    <td>Ngày đến:</td>
                    <td>{{ paymentInfo.actual_check_in }}</td>
                    <td>Ngày đi:</td>
                    <td>{{ paymentInfo.actual_check_out }}</td>
                    <td>Booking ID:</td>
                    <td>{{ pad(paymentInfo.booking_id, 8) }}</td>
                  </tr>
                  <tr>
                    <td>Tên khách hàng:</td>
                    <td>{{ paymentInfo.customer_name }}</td>
                    <td>Số điện thoại:</td>
                    <td>{{ paymentInfo.phone_number }}</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Số hoá đơn:</td>
                    <td>{{ paymentInfo.bill_number }}</td>
                    <td>Phòng:</td>
                    <td>{{ paymentInfo.room_name }}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </table>
              </div>
            </div>

            <div class="print-list">
              <div
                style="display: flex; justify-content: space-between; padding: 15px 0; font-weight: 600;">
                <div>Nội dung</div>
                <div>Chi tiết</div>
                <div>Tiền(VNĐ)</div>
              </div>

              <div class="content" style="border-bottom: solid 1px black; border-top: solid 1px black;">

                <div v-if="services.data" v-for="item in services.data"
                     style="display: flex; flex-direction: row; padding-top: 15px;">

                  <!--                    Tiền phòng-->
                  <!--<div v-if="item.type === 'payment'" style="flex: 1; font-weight: 600;">-->
                  <!--<span v-if="item.index === 0">{{ paymentInfo.room_name }}</span>-->
                  <!--</div>-->
                  <div v-if="item.type === 'payment'" style="flex: 1; padding-top: 10px">
                    <span v-if="item.index === 0">Tiền phòng</span></div>
                  <div v-if="item.type === 'payment'" style="display: flex; flex-direction: column; flex: 3;" >
                    <div
                      style="display: flex; flex-direction: row; justify-content: space-between; border-bottom: solid 1px gray; padding: 10px 0;">
                      Giá ngày ({{ item.data.start_time }} - {{ item.data.end_time }}
                      {{ item.data.unit_number > 1 ? '(' + item.data.unit_number + ')' : '' }}
                    </div>
                  </div>
                  <div v-if="item.type === 'payment'" class="border-gray-bottom currency-block" >{{currencyFormat(item.data.amount) }}
                  </div>
                  <div v-if="item.type === 'payment_total'" style="flex: 4"></div>
                  <div v-if="item.type === 'payment_total'" style="flex: 1; font-weight: 600">Tổng</div>
                  <div v-if="item.type === 'payment_total'" style="flex: 1; font-weight: 600; text-align: right">
                    {{ currencyFormat(item.data) }}
                  </div>

                  <!--                    Tiền dịch vụ, phụ thu-->
                  <!--<div v-if="item.type === 'service'" style="flex: 1; font-weight: 600;"></div>-->
                  <div v-if="item.type === 'service'" style="flex: 1; padding-top: 10px" v-bind:class="{ 'border-gray-top': item.index === 0 }"><span v-if="item.index === 0">Dịch vụ, phụ thu</span></div>
                  <div v-if="item.type === 'service'" style="display: flex; flex-direction: column; flex: 3;" v-bind:class="{ 'border-gray-top': item.index === 0 }">
                    <div
                      style="display: flex; flex-direction: row; justify-content: space-between; border-bottom: solid 1px gray; padding: 10px 0;">
                      {{ item.data.name }}
                    </div>
                  </div>
                  <div v-if="item.type === 'service'" class="border-gray-bottom currency-block" v-bind:class="{ 'border-gray-top': item.index === 0 }">{{
                      currencyFormat(item.data.price)
                    }}
                  </div>

                  <div v-if="item.type === 'service_total' && item.data > 0" style="flex: 4"></div>
                  <div v-if="item.type === 'service_total' && item.data > 0" style="flex: 1; font-weight: 600">Tổng</div>
                  <div v-if="item.type === 'service_total' && item.data > 0" style="flex: 1; font-weight: 600; text-align: right">
                    {{ currencyFormat(item.data) }}
                  </div>

                  <!--                    Khuyến mãi-->
                  <!--<div v-if="item.type === 'pmt'" style="flex: 1; font-weight: 600;"></div>-->
                  <div v-if="item.type === 'pmt'" style="flex: 1; padding-top: 10px" v-bind:class="{ 'border-gray-top': item.index === 0 }"><span v-if="item.index === 0">Khuyến mãi</span></div>
                  <div v-if="item.type === 'pmt'" style="display: flex; flex-direction: column; flex: 3;" v-bind:class="{ 'border-gray-top': item.index === 0 }">
                    <div
                      style="display: flex; flex-direction: row; justify-content: space-between; border-bottom: solid 1px gray; padding: 10px 0;">
                      {{ item.data.name }}
                    </div>
                  </div>
                  <div v-if="item.type === 'pmt'" class="border-gray-bottom currency-block" v-bind:class="{ 'border-gray-top': item.index === 0 }">{{
                      currencyFormat(item.data.amount)
                    }}
                  </div>

                  <div v-if="item.type === 'pmt_total' && item.data > 0" style="flex: 4"></div>
                  <div v-if="item.type === 'pmt_total' && item.data > 0" style="flex: 1; font-weight: 600">Tổng</div>
                  <div v-if="item.type === 'pmt_total' && item.data > 0" style="flex: 1; font-weight: 600; text-align: right">
                    {{ currencyFormat(item.data) }}
                  </div>


                  <!--                    VAT-->
                  <!--<div v-if="item.type === 'vat' && item.data.vat_value > 0" style="flex: 1; font-weight: 600;"></div>-->
                  <div v-if="item.type === 'vat' && item.data.vat_value > 0" style="flex: 1; padding-top: 10px" class="border-gray-top">VAT</div>
                  <div v-if="item.type === 'vat' && item.data.vat_value > 0" style="display: flex; flex-direction: column; flex: 3;" class="border-gray-top">
                    <div style="display: flex; flex-direction: row; justify-content: space-between; padding: 10px 0;">
                      {{ item.data.vat_percent }}%
                    </div>
                  </div>
                  <div v-if="item.type === 'vat' && item.data.vat_value > 0" class="border-gray-top currency-block">{{ currencyFormat(item.data.vat_value) }}</div>
                </div>


                <div v-if="services.isLast" style="display: flex; flex-direction: row; padding-top: 15px; ">
                  <div style="flex: 1;"></div>
                  <div style="flex: 1;"></div>
                  <div style="display: flex; flex-direction: column; flex: 3;">
                    <div
                      style="font-weight: 600; display: flex; flex-direction: row; justify-content: space-between; padding: 10px 0;">
                      <div>Cần thanh toán</div>
                      <div>{{ currencyFormat(paymentInfo.total) }}</div>
                    </div>
                    <div
                      style="font-weight: 600; display: flex; flex-direction: row; justify-content: space-between; padding: 10px 0; border-bottom: solid 1px gray;">
                      <div>Số tiền khách đưa</div>
                      <div>{{ currencyFormat(paymentInfo.money_receive) }}</div>
                    </div>
                    <div
                      style="font-weight: 600; display: flex; flex-direction: row; justify-content: space-between; padding: 10px 0;">
                      <div>Số tiền trả khách</div>
                      <div>{{ currencyFormat(paymentInfo.money_refunds) }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="services.isLast" class="print-signature">
                <div
                  style="width: 150px; border-bottom: solid 1px gray; text-align: center; padding: 0 0 10px 0; margin-right: 10px;">
                  Thu ngân ký
                </div>
                <div style="width: 150px; border-bottom: solid 1px gray; text-align: center; padding: 0 0 10px 0">Khách
                  ký
                </div>
              </div>
            </div>

            <div class="print-footer">
              <div>
                <div>Người in: {{ userName }} - Ngày in: {{ currentDate }}</div>
              </div>
              <div>Powered by ciHotel.vn {{index + 1}}/{{totalPages}}</div>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>

    <span class="loading-more" v-show="loading"
    ><icon name="loading" width="60"
    /></span>

  </div>
</template>
<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import Cookies from 'js-cookie'
import moment from "moment";

export default {
  data() {
    return {
      paymentInfo: null,
      isPayment: false,
      paymentInfoNull: false,
      totalServicePrice: 0,
      totalPromotionPrice: 0,
      totalVatPrice: 0,
      width: 80,
      font_size: 16,
      font_family: 'Times New Roman',
      billTitle: null,
      currentDate: '',
      listServices: [],
      totalPages: 0,
      loading: true,
      userName: this.$store.state.user.userName,
      maxItemOnPage: 11
    }
  },
  mounted() {
    this.getPaymentInfoForEditBill();
    this.currentDate = moment().format('DD/MM/YYYY HH:mm');
  },
  computed: {},
  methods: {

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
     * Get payment info
     */
    getPaymentInfoForEditBill() {
      let paymentId = this.$route.params.id

      adminAPI.getPaymentInfoForEditBill(paymentId).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.paymentInfo = res.data.data;

          let totalItems = []

          this.paymentInfo.payment_split_times.forEach((payment, index) => {
            totalItems.push({type: 'payment', data: payment, index: index});
          })
          totalItems.push({type: 'payment_total', data: this.paymentInfo.sub_total});

          this.paymentInfo.service.forEach((service, index) => {
            this.totalServicePrice += service.quantity * service.price;
            totalItems.push({type: 'service', data: service, index: index});
          })
          totalItems.push({type: 'service_total', data: this.totalServicePrice});

          this.paymentInfo.pmts.forEach((pmt, index) => {
            totalItems.push({type: 'pmt', data: pmt, index: index});
          })
          totalItems.push({type: 'pmt_total', data: this.paymentInfo.discount_amount});
          if (this.paymentInfo.apply_vat) {
            totalItems.push({
              type: 'vat',
              data: {vat_percent: this.paymentInfo.vat_percent, vat_value: this.paymentInfo.vat_value}
            })
          }

          let count = 0;
          let pageItems = [];
          totalItems.forEach((item, index) => {
            pageItems.push(item);
            ++count;

            let isFirst = this.listServices.length === 0;
            let isLast = index === totalItems.length - 1;
            if (count === this.maxItemOnPage) {
              this.listServices.push({id: Date.now(), isFirst: isFirst, isLast: isLast, data: pageItems});
              pageItems = [];
              count = 0;
            }
          });
          if (pageItems.length > 0) {
            this.listServices.push({id: Date.now(), isLast: true, data: pageItems});
          }

          this.totalPages = this.listServices.length;
        }
        if (Cookies.get(this.paymentInfo.payment_id)) {
          this.paymentInfo.total = Cookies.get(this.paymentInfo.payment_id)
        }
        this.loading = false;
      }).catch(err => {
        this.loading = true;
        console.log(err)
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },
    calculatePrice(pmt) {
      return pmt.amount;
    },
    /**
     * Currency format
     */
    currencyFormat(num) {
      let result = num
      if (num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },

    pad(str, size) {
      let s = str + "";
      while (s.length < size) s = "0" + s;
      return s;
    },

    /**
     * Go to table list
     */
    goBack() {
      let paymentId = this.$route.params.id
      let fromWhere = Cookies.get("printFrom")
      if (fromWhere == "edit-bill") {
        this.$router.push('/bill/edit/' + paymentId)
      } else {
        this.$router.push('/bill')
      }

    },

    /**
     * Print content
     */
    printContent() {
      window.print();
    }
  }
}
</script>

<style lang="css" scoped>

@media print {
  body {
    color: #000;
    background: #fff;
    text-rendering: optimizeLegibility;
  }

  .hidden-print,
  .hidden-print * {
    display: none !important;
  }

  /*.print-zone {*/
  /*font-weight: bold;*/
  /*}*/
}

@media print and (color) {
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

.page {
  max-width: 1024px;
  margin: 0 auto;
  padding: 20px 25px 0;
  size: A4;
  height: 1460px;
}

.print-header {
  position: relative;
  display: flex;
  border-bottom: solid 1px gray;
  padding-bottom: 15px;
}

.print-bill-info {
  display: flex;
  flex-direction: column;
  border-bottom: solid 1px gray;
  padding-bottom: 15px;
}

.print-list {
  height: 800px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-top: 15px;
}

.print-signature {
  display: flex;
  justify-content: flex-end;
  padding-top: 50px;
}

.print-footer {
  display: flex;
  margin-top: 220px;
  justify-content: space-between;
  border-top: solid 1px gray;
  padding-top: 10px;
}

.border-gray-bottom {
  border-bottom: solid 1px gray;
}

.border-gray-top {
  border-top: solid 1px gray;
}

.border-black-bottom{
  border-bottom: solid 1px black;
}

.payment-title span{
  display: none;
}

.pmt-title span{
  display:none;

}
.pmt-title span:first-child{
  display:block;
}

.currency-block {
  display: flex; justify-content: flex-end; align-items: center; width: 100px;
}

</style>
