<template>
  <div class="container-fluid">

    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <h4 class="mt-2 text-center text-header">Báo Cáo Theo Nhân Viên</h4>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-5">
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

            <div class="col-span-3">
              <label>
                Sắp xếp theo:
              </label>
              <select class="form-control form-control"
              id="status"
              type="text"
              autocomplete="new-password"
              v-model="inputs.orderBy">
                <option v-for="option in orderByOption" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="col-span-2">
              <label class="label-width text-white">
                 Xem
              </label>
              <button class="btn btn-outline-primary float-right px-4 btn-width-120" :disabled="onSearch" @click.prevent="search">
                Xem
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">

        <div class="bg-white rounded-lg shadow-md p-4">
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <div class="grid grid-cols-12 gap-4" v-show="firstSearch == false && items.length> 0">
            <div class="col-span-full">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-4">
                  Số kết quả: {{items.length}}
                </div>
                <div class="col-span-8 text-right">
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
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-full">
                  <table class="table table-bordered table-striped fixed_header">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Nhân viên</th>
                        <th>Quyền</th>
                        <th>Số lần làm dv</th>
                        <th>Doanh số làm dv</th>
                        <th>Số lần sale dv</th>
                        <th>Doanh số sale dv</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="3" class="text-center text-header font-weight-bold">Tổng</td>
                        <td class="text-right text-header font-weight-bold">{{currencyFormat(sum_quantity_order)}}</td>
                        <td class="text-right text-header font-weight-bold">{{currencyFormat(sum_total_order)}}</td>
                        <td class="text-right text-header font-weight-bold">{{currencyFormat(sum_quantity_payment)}}</td>
                        <td class="text-right text-header font-weight-bold">{{currencyFormat(sum_total_payment)}}</td>
                      </tr>

                      <tr v-for="(item, index) in items">
                        <td>{{index + 1}}</td>
                        <td>{{item.staff_name}}</td>
                        <td>{{item.role_name}}</td>
                        <td class="text-right">{{currencyFormat(item.quantity_do_service)}}</td>
                        <td class="text-right">{{currencyFormat(item.total_do_service)}}</td>
                        <td class="text-right">{{currencyFormat(item.quantity_sale_service)}}</td>
                        <td class="text-right">{{currencyFormat(item.total_sale_service)}}</td>
                      </tr>
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4" v-show="firstSearch == false && items.length == 0">
            <div class="col-span-full text-center">
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



export default {
  components: {
  },
  data () {
    return {
      orderByOption: [
        {value: 'total_do_service asc', text: 'Doanh số làm dv tăng dần'},
        {value: 'total_do_service desc', text: 'Doanh số làm dv giảm dần'},
        {value: 'quantity_do_service asc', text: 'Số lần làm dv tăng dần'},
        {value: 'quantity_do_service desc', text: 'Số lần làm dv giảm dần'},
        {value: 'total_sale_service asc', text: 'Doanh số sale dv tăng dần'},
        {value: 'total_sale_service desc', text: 'Doanh số sale dv giảm dần'},
        {value: 'quantity_sale_service asc', text: 'Số lần sale dv tăng dần'},
        {value: 'quantity_sale_service desc', text: 'Số lần sale dv giảm dần'},
      ],
      inputs: {
        fromDate: null,
        toDate: null,
        orderBy: 'total_do_service asc',
      },
      onSearch: false,
      items: [],
      firstSearch: true,
      excel_bill_data: null,
      excel_bill_fields: {
        'Nhân viên': 'staff_name',
        'Quyền': 'role_name',
        'Số lần làm dv' : 'quantity_do_service',
        'Doanh số làm dv' : 'total_do_service',
        'Số lần sale dịch vụ' : 'quantity_sale_service',
        'Doanh số sale dịch vụ' : 'total_sale_service',
      },
      loading: false,
      sum_quantity_order: 0,
      sum_total_order: 0,
      sum_quantity_payment: 0,
      sum_total_payment: 0,
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
      adminAPI.getReportByStaff(params).then(res => {
        if(res && res.data && res.data.data) {
          let datas = res.data.data
          // Handle data
          this.sum_quantity_order = 0
          this.sum_total_order = 0
          this.sum_quantity_payment = 0
          this.sum_total_payment = 0

          for (let index in datas) {
            this.sum_quantity_order += parseInt(datas[index].quantity_do_service)
            this.sum_total_order += parseInt(datas[index].total_do_service)
            this.sum_quantity_payment += parseInt(datas[index].quantity_sale_service)
            this.sum_total_payment += parseInt(datas[index].total_sale_service)
          }
          this.items = datas
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
  .label-width {
    width: 100%;
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
