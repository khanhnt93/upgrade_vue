<template>
  <div class="container-fluid">

    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <h4 class="mt-2 text-center">Báo Cáo Sửa Giá</h4>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">

            <div class="w-full md:w-5/12 px-2">
              <label>
                Thời gian:
              </label>
              <div class="input-group">
                  <span class="input-group-addon pr-1">Từ</span>
                  <input
                  id="fromDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.fromDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)">
                  <span class="input-group-addon pl-1 pr-1">Đến</span>
                  <input
                  id="toDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.toDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)">
                </div>
            </div>

            <div class="w-full md:w-5/12 px-2">
              <label>
                Sắp xếp theo:
              </label>
              <select
              id="status"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.orderBy">
                <option v-for="option in orderByOption" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="w-full md:w-2/12 px-2">
              <label class="label-width text-white">
                 Xem
              </label>
              <button class="btn btn-outline-primary pull-right btn-width-120" :disabled="onSearch" @click.prevent="search">
                Xem
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">

        <div class="card">
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <div class="flex flex-wrap -mx-2" v-show="firstSearch == false && items.length > 0">
            <div class="w-full px-2">
              <div class="flex flex-wrap -mx-2">
                <div class="w-full md:w-1/3 px-2">
                  Số kết quả: {{items.length}}
                </div>
                <div class="w-full md:w-2/3 px-2 text-right">
                  <button class="btn btn-default text-header" @click="exportToExcel(items, excel_edit_price_fields, 'bao_cao_sua_gia.xls')">
                    <b>Xuất Excel</b>
                  </button>
                </div>
              </div>
              <div class="flex flex-wrap -mx-2">
                <div class="w-full px-2">
                  <table class="table table-bordered table-striped fixed_header">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Thời gian</th>
                        <th>Bàn</th>
                        <th>Nhân viên</th>
                        <th>Số bill</th>
                        <th>Số tiền thay đổi</th>
                        <th>Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items">
                        <td>{{index + 1}}</td>
                        <td>{{item.payment_at}}</td>
                        <td>{{item.table_name}}</td>
                        <td>{{item.staff_name}}</td>
                        <td>{{item.bill_number}}</td>
                        <td class="text-right">{{currencyFormat(item.total_edit_price)}}</td>
                        <td>
                          <p v-for="food in item.foods" v-if="food.edit_price != 0">
                            <span v-if="food.edit_price < 0">Giảm: </span><span v-if="food.edit_price > 0">Tăng: </span>{{currencyFormat(food.edit_price)}} từ [Số lượng]:{{food.quantity}} [Tên món]:{{food.name}}
                          </p>

                        </td>
                      </tr>
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2" v-show="firstSearch == false && items.length == 0">
            <div class="w-full px-2 text-center">
              Không tìm thấy kết quả nào
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
<script>
import adminAPI from '@/api/admin'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

export default {
  setup() {
    const { toast } = useToast()
    const { exportToExcel } = useExcelExport()
    return { toast, exportToExcel }
  },
  components: {
  },
  data () {
    return {
      reportByOption: [
        {value: 'payment', text: 'Thực hiện tính tiền'},
        {value: 'order', text: 'Thực hiện gọi món'}
      ],
      orderByOption: [
        {value: 'payment_at asc', text: 'Thời gian tăng dần'},
        {value: 'payment_at desc', text: 'Thời gian giảm dần'}
      ],
      inputs: {
        fromDate: null,
        toDate: null,
        orderBy: 'payment_at asc',
      },
      onSearch: false,
      items: [],
      firstSearch: true,
      excel_bill_data: null,
      excel_bill_fields: {
        'Thời gian': 'payment_at',
        'Bàn': 'table_name',
        'Nhân viên' : 'staff_name',
        'Số bill': 'bill_number',
        'Số tiền thay đổi' : 'total_edit_price'
      },
      loading: false,
    }
  },
  computed: {
  },
  mounted() {
    let dateNow = new Date().toJSON().slice(0,10)
    this.inputs.toDate = commonFunc.formatDate(dateNow)
    this.inputs.fromDate = commonFunc.formatDate(dateNow)

    // Get data
    this.search()
  },
  methods: {


    /**
     * Check valid from date and to date
     */
    checkFromDateAndToDate() {
      if(this.inputs.fromDate == "" || this.inputs.fromDate == null || commonFunc.dateFormatCheck(this.inputs.fromDate) == false) {
        this.toast("Mục từ ngày không đúng", 'error')
        return false
      }
      if(this.inputs.toDate == "" || this.inputs.toDate == null || commonFunc.dateFormatCheck(this.inputs.fromDate) == false) {
        this.toast("Mục đến ngày không đúng", 'error')
        return false
      }
      let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
      let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate))

      if(fromDate > toDate) {
        this.toast("Từ ngày không thể lớn hớn đến ngày", 'error')
        return false
      }

      fromDate.setDate(fromDate.getDate() + 62)

      if(fromDate < toDate) {
        this.toast("Thời gian không quá 62 ngày", 'error')
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
        this.items = []
        return
      }
      this.onSearch = true
      this.loading = true

      let params = {
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        "orderBy": this.inputs.orderBy,
      }

      // Search
      adminAPI.getReportEditPrice(params).then(res => {
        if(res && res.data && res.data.data) {
          this.items = res.data.data
        }

        this.firstSearch = false
        this.onSearch = false
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast(errorMess, 'error')

        this.firstSearch = false
        this.onSearch = false
        this.loading = false
      })
    },

    /**
   * Currency format
   */
    currencyFormat(num) {
      let result = num
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
