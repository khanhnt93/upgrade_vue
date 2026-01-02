<template>
  <div class="container-fluid">

    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col>
              <h4 class="mt-2 text-center text-header">Lịch Sử Bán Hàng</h4>
            </b-col>
          </b-row>

          <b-row>

            <b-col md="6">
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
                  <!-- <input
                    id="date"
                    type="date"
                    :value="inputs.toDate"
                    class="form-control"
                    @change="inputs.toDate=$event.target.value"> -->
                </div>
            </b-col>

            <b-col md="3">
              <label>
                Trạng thái đơn:
              </label>
              <b-form-select
              :options="statusOption"
              id="status"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.status">
              </b-form-select>
            </b-col>

            <b-col md="3">
              <label class="label-width text-white">
                 Xem
              </label>
              <b-button variant="outline-primary" class="pull-right px-4 btn-width-120"
                :disabled="onSearch" @click.prevent="search">
                Xem
              </b-button>
            </b-col>
          </b-row>
          
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <b-row v-show="firstSearch == false && bills.length">
            <b-col>
              <b-row>
                <b-col md="4">
                  Số kết quả: {{bills.length}}
                </b-col>
                <!-- <b-col md="8" class="text-right">
                  <download-excel
                    class   = "btn btn-default text-header"
                    :data   = "bills"
                    :fields = "excel_bill_fields"
                    worksheet = "Báo Cáo Theo Bill"
                    name    = "bao_cao_theo_bill.xls">
                    <b>Xuất Excel</b>
                  </download-excel>
                </b-col> -->
              </b-row>
              <b-row>
                <b-col>
                  <table class="table table-bordered table-striped fixed_header">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Ngày</th>
                        <th>Số Bill</th>
                        <th>Tên K.H</th>
                        <th>Sdt K.H</th>
                        <th>Tổng tiền SP</th>
                        <th>Tổng tiền thanh toán</th>
                        <th>Trạng thái</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(bill, index) in bills">
                        <td>{{index + 1}}</td>
                        <td>{{bill.created_at}}</td>
                        <td>{{bill.bill_number}}</td>
                        <td>{{bill.customer_name}}</td>
                        <td>{{bill.customer_phone}}</td>
                        <td class="text-right">{{currencyFormat(bill.sub_total)}}</td>
                        <td class="text-right">{{currencyFormat(bill.total)}}</td>
                        <td>
                          <span class="text-danger" v-if="bill.trade_status == 0">Lưu nháp</span>
                          <span v-if="bill.trade_status == 1">Đã thanh toán</span>
                        </td>
                        <td class="text-right">
                          <div v-if="bill.trade_status == 0" class="button-group" style="white-space: nowrap;">
                            <button class="btn btn-sm btn-primary" @click="$router.push('/bill/edit/' + bill.id)">Sửa</button>
                            <button class="btn btn-sm btn-danger ml-2" @click.prevent="deleteBill(bill)">Xoá</button>
                          </div>
                          <b-button v-if="bill.trade_status == 1" variant="outline-success" 
                          class="pull-right btn-width-120 mt-2 mr-2" @click="$router.push('/bill/edit/' + bill.id)">
                            In hóa đơn
                          </b-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                </b-col>
              </b-row>
            </b-col>
          </b-row>

          <b-row v-show="firstSearch == false && bills.length == 0">
            <b-col class="text-center">
              Không tìm thấy kết quả nào
            </b-col>
          </b-row>
        </b-card>

      </b-col>
    </b-row>

    <!-- Modal xác nhận xoá -->
    <b-modal
      v-model="modalDeleteBill"
      id="modal-delete-bill"
      hide-footer
      hide-header
      centered
      size="md"
      modal-class="custom-modal-delete-bill"
    >
      <div class="text-center px-4 py-3">
        <!-- Custom title -->
        <h4 class="font-weight-bold mb-4" style="color: #3b82f6;">Xác nhận xoá bill</h4>

        <!-- Số hoá đơn -->
        <p class="mb-2" style="font-size: 1.25rem;">
          <strong>Số hoá đơn: {{ selectedBill.bill_number }}</strong>
        </p>

        <p class="mb-2" style="font-size: 1.25rem;">
          <strong>Trạng thái: Lưu nháp</strong>
        </p>

        <!-- Tên khách hàng -->
        <p class="mb-2" style="font-size: 1.25rem;">
          👤 <strong>Khách hàng: {{ selectedBill.customer_name || 'Chưa chọn khách hàng' }}</strong>
        </p>

        <!-- Số tiền thanh toán -->
        <p class="mb-4" style="font-size: 2rem; font-weight: bold; color: #10b981;">
          💰 {{ currencyFormat(selectedBill.total) }}
        </p>

        <!-- Buttons -->
        <div class="d-flex justify-content-center gap-3">
          <b-button variant="outline-secondary" class="rounded-pill px-4 py-2 shadow-sm"
            @click="modalDeleteBill = false">
            ❌ Hủy
          </b-button>

          <b-button variant="danger" class="rounded-pill px-4 py-2 shadow-sm"
            @click="confirmDeleteBill">
            ✅ Xác nhận xoá
          </b-button>
        </div>
      </div>
      
    </b-modal>

  </div>
</template>
<script>
import billApi from '@/api/bill'
import commonFunc from '@/common/commonFunc'
// import Vue from 'vue'
// import JsonExcel from 'vue-json-excel'

// Vue.component('downloadExcel', JsonExcel)


export default {
  components: {
  },
  data () {
    return {
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
      loading: false,
    }
  },
  mounted() {
    let dateNow = new Date().toJSON().slice(0,10)
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
      this.$bvToast.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      })
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
      }

      // Search
      billApi.searchBill(params).then(res => {
        if(res && res.data && res.data.data) {
          this.bills = res.data.data
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
