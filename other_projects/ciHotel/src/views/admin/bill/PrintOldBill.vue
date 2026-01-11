<template>
  <div class="container-fluid">
    <div class="hidden-print mb-4">
      <div class="flex justify-between items-center">
        <button
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          @click="goBack()"
        >
          Quay lại
        </button>
        <button
          v-show="!paymentInfoNull"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          @click="printContent"
        >
          In hóa đơn
        </button>
      </div>
      <hr class="my-4 border-gray-300">
    </div>

    <div id="printBillAble" v-show="!loading" class="grid grid-cols-1">
      <div v-for="(services, index) in listServices" :key="services.id">
        <div class="page">
          <div class="print-header">
            <div class="flex-1 flex items-center">
              <div>
                <p class="font-bold">{{ paymentInfo.hotel_name }}</p>
                <p>{{ paymentInfo.hotel_address }}<br>Email: {{ paymentInfo.hotel_email }} - ĐT: {{ paymentInfo.hotel_phone_number }}</p>
              </div>
            </div>

            <div class="logo-container flex justify-end">
              <img v-if="paymentInfo.hotel_image" :src="paymentInfo.hotel_image" alt="logo" class="h-24"/>
            </div>
          </div>

          <div class="print-bill-info">
            <div class="bill-title"><h3 class="text-xl font-bold">Hóa đơn</h3></div>
            <div>
              <table class="w-full">
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
            <div class="flex justify-between py-4 font-semibold">
              <div>Nội dung</div>
              <div>Chi tiết</div>
              <div>Tiền(VNĐ)</div>
            </div>

            <div class="content border-t border-b border-black">
              <div v-if="services.data" v-for="item in services.data" :key="item.type + item.index" class="flex flex-row pt-4">
                <!-- Tiền phòng -->
                <div v-if="item.type === 'payment'" class="flex-1 pt-2">
                  <span v-if="item.index === 0">Tiền phòng</span>
                </div>
                <div v-if="item.type === 'payment'" class="flex flex-col flex-[3]">
                  <div class="flex flex-row justify-between border-b border-gray-400 py-2">
                    Giá ngày ({{ item.data.start_time }} - {{ item.data.end_time }}
                    {{ item.data.unit_number > 1 ? '(' + item.data.unit_number + ')' : '' }}
                  </div>
                </div>
                <div v-if="item.type === 'payment'" class="border-b border-gray-400 currency-block">
                  {{ currencyFormat(item.data.amount) }}
                </div>

                <div v-if="item.type === 'payment_total'" class="flex-[4]"></div>
                <div v-if="item.type === 'payment_total'" class="flex-1 font-semibold">Tổng</div>
                <div v-if="item.type === 'payment_total'" class="flex-1 font-semibold text-right">
                  {{ currencyFormat(item.data) }}
                </div>

                <!-- Tiền dịch vụ, phụ thu -->
                <div v-if="item.type === 'service'" class="flex-1 pt-2" :class="{ 'border-t border-gray-400': item.index === 0 }">
                  <span v-if="item.index === 0">Dịch vụ, phụ thu</span>
                </div>
                <div v-if="item.type === 'service'" class="flex flex-col flex-[3]" :class="{ 'border-t border-gray-400': item.index === 0 }">
                  <div class="flex flex-row justify-between border-b border-gray-400 py-2">
                    {{ item.data.name }}
                  </div>
                </div>
                <div v-if="item.type === 'service'" class="border-b border-gray-400 currency-block" :class="{ 'border-t border-gray-400': item.index === 0 }">
                  {{ currencyFormat(item.data.price) }}
                </div>

                <div v-if="item.type === 'service_total' && item.data > 0" class="flex-[4]"></div>
                <div v-if="item.type === 'service_total' && item.data > 0" class="flex-1 font-semibold">Tổng</div>
                <div v-if="item.type === 'service_total' && item.data > 0" class="flex-1 font-semibold text-right">
                  {{ currencyFormat(item.data) }}
                </div>

                <!-- Khuyến mãi -->
                <div v-if="item.type === 'pmt'" class="flex-1 pt-2" :class="{ 'border-t border-gray-400': item.index === 0 }">
                  <span v-if="item.index === 0">Khuyến mãi</span>
                </div>
                <div v-if="item.type === 'pmt'" class="flex flex-col flex-[3]" :class="{ 'border-t border-gray-400': item.index === 0 }">
                  <div class="flex flex-row justify-between border-b border-gray-400 py-2">
                    {{ item.data.name }}
                  </div>
                </div>
                <div v-if="item.type === 'pmt'" class="border-b border-gray-400 currency-block" :class="{ 'border-t border-gray-400': item.index === 0 }">
                  {{ currencyFormat(item.data.amount) }}
                </div>

                <div v-if="item.type === 'pmt_total' && item.data > 0" class="flex-[4]"></div>
                <div v-if="item.type === 'pmt_total' && item.data > 0" class="flex-1 font-semibold">Tổng</div>
                <div v-if="item.type === 'pmt_total' && item.data > 0" class="flex-1 font-semibold text-right">
                  {{ currencyFormat(item.data) }}
                </div>

                <!-- VAT -->
                <div v-if="item.type === 'vat' && item.data.vat_value > 0" class="flex-1 pt-2 border-t border-gray-400">VAT</div>
                <div v-if="item.type === 'vat' && item.data.vat_value > 0" class="flex flex-col flex-[3] border-t border-gray-400">
                  <div class="flex flex-row justify-between py-2">
                    {{ item.data.vat_percent }}%
                  </div>
                </div>
                <div v-if="item.type === 'vat' && item.data.vat_value > 0" class="border-t border-gray-400 currency-block">
                  {{ currencyFormat(item.data.vat_value) }}
                </div>
              </div>

              <div v-if="services.isLast" class="flex flex-row pt-4">
                <div class="flex-1"></div>
                <div class="flex-1"></div>
                <div class="flex flex-col flex-[3]">
                  <div class="font-semibold flex flex-row justify-between py-2">
                    <div>Cần thanh toán</div>
                    <div>{{ currencyFormat(paymentInfo.total) }}</div>
                  </div>
                  <div class="font-semibold flex flex-row justify-between py-2 border-b border-gray-400">
                    <div>Số tiền khách đưa</div>
                    <div>{{ currencyFormat(paymentInfo.money_receive) }}</div>
                  </div>
                  <div class="font-semibold flex flex-row justify-between py-2">
                    <div>Số tiền trả khách</div>
                    <div>{{ currencyFormat(paymentInfo.money_refunds) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="services.isLast" class="print-signature">
              <div class="w-36 border-b border-gray-400 text-center pb-2 mr-2">
                Thu ngân ký
              </div>
              <div class="w-36 border-b border-gray-400 text-center pb-2">
                Khách ký
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
    </div>

    <span class="loading-more" v-show="loading">
      <icon name="loading" width="60"/>
    </span>
  </div>
</template>

<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import Cookies from 'js-cookie'
import moment from "moment"
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    return {
      authStore
    }
  },
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
      userName: '',
      maxItemOnPage: 11
    }
  },
  mounted() {
    this.userName = this.authStore.user?.userName || ''
    this.getPaymentInfoForEditBill()
    this.currentDate = moment().format('DD/MM/YYYY HH:mm')
  },
  computed: {},
  methods: {
    /**
     * Get payment info
     */
    getPaymentInfoForEditBill() {
      let paymentId = this.$route.params.id

      adminAPI.getPaymentInfoForEditBill(paymentId).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.paymentInfo = res.data.data

          let totalItems = []

          this.paymentInfo.payment_split_times.forEach((payment, index) => {
            totalItems.push({type: 'payment', data: payment, index: index})
          })
          totalItems.push({type: 'payment_total', data: this.paymentInfo.sub_total})

          this.paymentInfo.service.forEach((service, index) => {
            this.totalServicePrice += service.quantity * service.price
            totalItems.push({type: 'service', data: service, index: index})
          })
          totalItems.push({type: 'service_total', data: this.totalServicePrice})

          this.paymentInfo.pmts.forEach((pmt, index) => {
            totalItems.push({type: 'pmt', data: pmt, index: index})
          })
          totalItems.push({type: 'pmt_total', data: this.paymentInfo.discount_amount})
          if (this.paymentInfo.apply_vat) {
            totalItems.push({
              type: 'vat',
              data: {vat_percent: this.paymentInfo.vat_percent, vat_value: this.paymentInfo.vat_value}
            })
          }

          let count = 0
          let pageItems = []
          totalItems.forEach((item, index) => {
            pageItems.push(item)
            ++count

            let isFirst = this.listServices.length === 0
            let isLast = index === totalItems.length - 1
            if (count === this.maxItemOnPage) {
              this.listServices.push({id: Date.now(), isFirst: isFirst, isLast: isLast, data: pageItems})
              pageItems = []
              count = 0
            }
          })
          if (pageItems.length > 0) {
            this.listServices.push({id: Date.now(), isLast: true, data: pageItems})
          }

          this.totalPages = this.listServices.length
        }
        if (Cookies.get(this.paymentInfo.payment_id)) {
          this.paymentInfo.total = Cookies.get(this.paymentInfo.payment_id)
        }
        this.loading = false
      }).catch(err => {
        this.loading = true
        console.log(err)
        let errorMess = commonFunc.handleStaffError(err)
        this.$toast.error(errorMess)
      })
    },
    calculatePrice(pmt) {
      return pmt.amount
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
      let s = str + ""
      while (s.length < size) s = "0" + s
      return s
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
      window.print()
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

.currency-block {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100px;
}
</style>
