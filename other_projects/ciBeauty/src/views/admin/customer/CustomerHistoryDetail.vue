<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h4 class="mt-2 text-center text-header">Chi Tiết Lịch Sử Khách Hàng</h4>
            </div>
          </div>
          <hr>
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h5>Tên khách hàng: <b class="text-header">{{customer.name}}</b></h5>
            </div>
            <!-- <div class="col-span-6">
              <p>Loại khách hàng: {{customer.type}}</p>
            </div> -->
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-6">
              <p>Số điện thoại: {{customer.phone_number}}</p>
            </div>
            <div class="col-span-6">
              <p>Giới tính: {{customer.gender}}</p>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-6">
              <p>Email: {{customer.email}}</p>
            </div>
            <div class="col-span-6">
              <p>Ngày sinh: {{customer.birthday}}</p>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-6">
              <p>Địa chỉ: {{customer.address}}</p>
            </div>
            <div class="col-span-6">
              <p>Mã số thuế: {{customer.mst}}</p>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-6">
              <p>Quốc tịch: {{customer.national_code}}</p>
            </div>
            <div class="col-span-6">
              <p>Ngành nghề: {{customer.industry}}</p>
            </div>
          </div>

          <hr>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h5>Tổng điểm tích lũy: <b class="text-header">{{currencyFormat(customer.point)}}</b></h5>
              <p>(Tương ứng số tiền đã chi tiêu: {{currencyFormat(customer.point*1000)}}đ)</p>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
            <div>
              <ul class="nav nav-tabs mb-3">
                <li class="nav-item">
                  <a class="nav-link cursor-pointer" :class="{ active: activeTab === 'history' }" @click="activeTab = 'history'">Lịch sử sử dụng DV</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link cursor-pointer" :class="{ active: activeTab === 'card' }" @click="activeTab = 'card'">Thẻ dv</a>
                </li>
              </ul>
              <div v-show="activeTab === 'history'">
                  <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-full">
                      Số lần đến: {{services.length}}
                    </div>
                  </div>

                  <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12">
                      <table class="table table-bordered table-hover table-responsive-stack">
                        <thead>
                          <tr>
                            <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in services" :key="index">
                            <td v-for="field in fields" :key="field.key" :data-label="field.label">
                              <div v-if="field.key === 'sub_total'">
                                {{ currencyFormat(item.sub_total) }}
                              </div>
                              <div v-else-if="field.key === 'services'">
                                <p v-for="(service, idx) in item.services" :key="service.name + idx">{{ service.quantity + " x " + service.name }}</p>
                              </div>
                              <div v-else-if="field.key === 'note'">
                                <span class="pre-line-content">{{ item.note }}</span>
                                <i class="fa fa-edit cursor-pointer" @click="showModalEditNote(item)"/>
                              </div>
                              <div v-else>
                                {{ item[field.key] }}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
              </div>

              <div v-show="activeTab === 'card'">
                  <div class="bg-white rounded-lg shadow-md p-4 mb-3"  v-for="card in cards"
                    :key="card.id"
                    
                    :style="{ backgroundColor: getCardColor(card) }"
                    text-variant="dark"
                  >
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <h5 class="text-header">{{ card.card_name }}</h5>
                    </div>

                    <div class="small">
                      <div v-if="card.card_type == 2">
                        <span><b>Lần còn lại:</b> <span class="text-header">{{ card.time_remaining }}</span>/{{ card.number_of_use }}</span>
                      </div>
                      <div v-if="card.card_type == 3">
                        <span><b>Số tiền còn lại:</b> <span class="text-header">{{ formatCurrency(card.amount_remaining) }}</span>/{{ formatCurrency(card.card_amount_limit) }}</span>
                      </div>
                      <div><b>Ngày tạo:</b> {{ formatDate(card.created_at) }}</div>
                      <div><b>Hết hạn:</b> {{ formatDate(card.expired_at) }}</div>
                      <div><b>Hóa đơn mua:</b> {{ card.bill_number }}</div>
                    </div>
                  </div>

              </div>

            </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- Modal plus/minus money-->
    <!-- Modal plus/minus money-->
    <div v-if="showUpdateNoteModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div class="flex items-center justify-between p-4 border-b">
          <h5 class="text-xl font-bold">Cập nhật ghi chú</h5>
          <button @click="cancelUpdateNote" class="text-gray-500 hover:text-gray-700">
            <span class="text-2xl">&times;</span>
          </button>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <label>Nội dung ghi chú</label><span class="error-sybol"></span>
                <textarea class="form-control"
                  rows="5"
                  v-model="currentPayment.note">
                </textarea>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4 text-left mt-3">
              <button class="btn btn-outline-danger pull-left btn-width-120" @click="cancelUpdateNote()">
                Hủy
              </button>
            </div>
            <div class="col-span-8 text-right mt-3">
              <button class="btn btn-outline-success float-right btn-width-120" @click="confirmUpdateNote">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import customerApi from '@/api/customer'
import commonFunc from '@/common/commonFunc'

export default {
  data () {
    return {
      customer: {},
      services: [],
      cards: [],
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'bill_number',
          label: 'Số HĐ'
        },
        {
          key: 'sub_total',
          label: 'Tổng tiền dv'
        },
        {
          key: 'services',
          label: 'Dịch vụ'
        },
        {
          key: 'order_at',
          label: 'Giờ vào'
        },
        {
          key: 'payment_at',
          label: 'Giờ ra'
        },
        {
          key: 'note',
          label: 'Ghi chú'
        }
      ],
      loading: false,
      loading: false,
      currentPayment: {},
      showUpdateNoteModal: false,
      activeTab: 'history'
    }
  },
  mounted() {
    this.getCustomerHistoryDetail()
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
     *  Get detail
     */
    getCustomerHistoryDetail() {
      let cusId = this.$route.params.id
      if(cusId) {
        this.loading = true
        customerApi.getCustomerHistoryDetail(cusId).then(res => {
          if(res != null && res.data != null && res.data.data != null){
            this.customer = res.data.data.customer_info
            this.services = res.data.data.services
            this.cards = res.data.data.cards

              // Get list owner services
              // TODO: kiểm tra chỗ này xem bỏ dc ko
              // this.getCustomerServiceOwner(cusId)
          }
          this.loading = false
        }).catch(err => {
          this.loading = false

          // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
        })
      }
    },

    //   /**
    //  *  Get danh sách dịch vụ đang sở hữu
    //  */
    // getCustomerServiceOwner(cusId) {
    //     let params = {"store_id": this.$store.state.user.storeId, "customer_id": cusId}
    //   customerApi.getCustomerServiceOwner(params).then(res => {
    //       if(res != null && res.data != null && res.data.data != null){
    //         this.services_owner = res.data.data.services
    //       }
    //     }).catch(err => {
    //       // Handle error
    //         let errorMess = commonFunc.handleStaffError(err)
    //         this.popToast('danger', errorMess)
    //     })
    // },

    /**
   * Currency format
   */
    currencyFormat(num) {
      if(!num) {
        return 0
      }
      let result = ""
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },

    showModalEditNote(paymentInfo) {
      this.currentPayment = JSON.parse(JSON.stringify(paymentInfo))
      this.showUpdateNoteModal = true;
    },

    cancelUpdateNote() {
      this.showUpdateNoteModal = false;
    },

    confirmUpdateNote() {
      let data = {
          "note": this.currentPayment.note,
          "id": this.currentPayment.id
      }
      customerApi.confirmUpdateNote(data).then(res => {
        if (res != null && res.data != null) {
            this.showUpdateNoteModal = false;
          this.popToast('success', "Cập nhật ghi chú thành công!")

          this.getCustomerHistoryDetail()
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    getCardColor(card) {
      if(!card.time_remaining && !card.amount_remaining) {
        return '#f8f9fa'
      } else {
        if (card.card_type == 2) return '#fff3cd';
        if (card.card_type == 3) return '#d4edda';
        return '#f8f9fa';
      }
      return '#f8f9fa'
    },

    formatCurrency(value) {
      if (!value) return '0 đ';
      return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('vi-VN');
    },


  }
}
</script>