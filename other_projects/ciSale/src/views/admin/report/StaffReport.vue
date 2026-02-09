<template>
  <div class="container-fluid">

    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <h4 class="text-center text-header">BÁO CÁO THEO NHÂN VIÊN</h4>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">

            <div class="w-full md:w-7/12 px-2">
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

            <div class="w-full md:w-1/4 px-2">
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
                  <download-excel
                    class   = "btn btn-default text-header"
                    :data   = "items"
                    :fields = "excel_bill_fields"
                    worksheet = "Báo Cáo Theo Nhân Viên"
                    name    = "bao_cao_theo_nhan_vien.xls">
                    <b>Xuất Excel</b>
                  </download-excel>
                </div>
              </div>
              <div class="flex flex-wrap -mx-2">
                <div class="w-full px-2">
                  <table class="table table-bordered table-striped fixed_header">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Nhân viên</th>
                        <th>Quyền</th>
                        <th>Số lần thực hiện</th>
                        <th>Doanh số</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items">
                        <td>{{index + 1}}</td>
                        <td>{{item.staff_name}}</td>
                        <td>{{item.role_name}}</td>
                        <td class="text-right">{{currencyFormat(item.quantity)}}</td>
                        <td class="text-right">{{currencyFormat(item.total)}}</td>
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
    return { toast }
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
        {value: 'total asc', text: 'Doanh số tăng dần'},
        {value: 'total desc', text: 'Doanh số giảm dần'},
        {value: 'quantity asc', text: 'Số lần thực hiện tăng dần'},
        {value: 'quantity desc', text: 'Số lần thực hiện giảm dần'}
      ],
      inputs: {
        reportBy: "payment",
        fromDate: null,
        toDate: null,
        orderBy: 'total asc',
      },
      onSearch: false,
      items: [],
      firstSearch: true,
      excel_bill_data: null,
      excel_bill_fields: {
        'Nhân viên': 'staff_name',
        'Quyền': 'role_name',
        'Số lượng' : 'quantity',
        'Doanh số' : 'total'
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
        "reportBy": this.inputs.reportBy,
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        "orderBy": this.inputs.orderBy,
      }

      // Search
      adminAPI.getReportByStaff(params).then(res => {
        if(res && res.data && res.data.data) {
          let datas = res.data.data
          // Handle data
          for (let index in datas) {
            if(datas[index].is_root && datas[index].role_name == 'ADMIN') {
              datas[index].role_name = 'Chủ nhà hàng'
            }
            if(!datas[index].is_root && datas[index].role_name == 'ADMIN') {
              datas[index].role_name = 'Quản lý'
            }
            if(!datas[index].is_root && datas[index].role_name == 'CASHIER') {
              datas[index].role_name = 'Thu ngân'
            }
            if(!datas[index].is_root && datas[index].role_name == 'KITCHEN') {
              datas[index].role_name = 'Bếp'
            }
            if(!datas[index].is_root && datas[index].role_name == 'STAFF') {
              datas[index].role_name = 'Phục vụ'
            }
          }
          this.items = datas


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
      let result = ""
      if(num === 0) {
          return "0"
      }
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
