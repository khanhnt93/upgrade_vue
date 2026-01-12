<template>
  <div class="container-fluid mx-auto px-4">
    <!-- Filters Card -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h4 class="text-center text-2xl font-bold text-orange-600 mb-6">BÁO CÁO THEO NHÂN VIÊN</h4>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <!-- Date Range -->
        <div class="md:col-span-7">
          <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian:</label>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">Từ</span>
            <input
              type="text"
              v-model="inputs.fromDate"
              maxlength="10"
              @keyup="inputDateOnly($event.target)"
              class="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <span class="text-sm text-gray-600">Đến</span>
            <input
              type="text"
              v-model="inputs.toDate"
              maxlength="10"
              @keyup="inputDateOnly($event.target)"
              class="flex-1 border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <!-- Order By -->
        <div class="md:col-span-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo:</label>
          <select
            v-model="inputs.orderBy"
            class="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="total asc">Doanh số tăng dần</option>
            <option value="total desc">Doanh số giảm dần</option>
            <option value="quantity asc">Số lần thực hiện tăng dần</option>
            <option value="quantity desc">Số lần thực hiện giảm dần</option>
          </select>
        </div>

        <!-- Search Button -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-transparent mb-1">Xem</label>
          <button
            @click.prevent="search"
            :disabled="onSearch"
            class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[120px]"
          >
            Xem
          </button>
        </div>
      </div>
    </div>

    <!-- Results Card -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Loading -->
      <span class="flex justify-center items-center py-8" v-show="loading">
        <icon name="loading" width="60" />
      </span>

      <!-- Results -->
      <div v-show="firstSearch == false && items.length > 0">
        <div class="flex flex-col md:flex-row justify-between items-center mb-4">
          <div class="mb-2 md:mb-0">Số kết quả: {{ items.length }}</div>
          <button
            @click="handleExportExcel"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-orange-600 font-bold rounded border border-gray-300"
          >
            <b>Xuất Excel</b>
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr class="bg-blue-100">
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">STT</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Nhân viên</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Quyền</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Số lần thực hiện</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Doanh số</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ index + 1 }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ item.staff_name }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ item.role_name }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatCurrency(item.quantity) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatCurrency(item.total) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-show="firstSearch == false && items.length == 0" class="text-center py-8 text-gray-500">
        Không tìm thấy kết quả nào
      </div>
    </div>
  </div>
</template>

<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useExcelExport } from '@/composables/useExcelExport'
import { useToast } from '@/composables/useToast';
import { useFormatters } from '@/composables/useFormatters';

export default {
  setup() {
    const { toast } = useToast();
    const { formatCurrency } = useFormatters();
    const { exportToExcel } = useExcelExport();

    return {
      toast,
      formatCurrency,
      exportToExcel
    };
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

    this.search()
  },
  methods: {
    checkFromDateAndToDate() {
      if(this.inputs.fromDate == "" || this.inputs.fromDate == null || commonFunc.dateFormatCheck(this.inputs.fromDate) == false) {
        this.toast.error("Mục từ ngày không đúng")
        return false
      }
      if(this.inputs.toDate == "" || this.inputs.toDate == null || commonFunc.dateFormatCheck(this.inputs.fromDate) == false) {
        this.toast.error("Mục đến ngày không đúng")
        return false
      }
      let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
      let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate))

      if(fromDate > toDate) {
        this.toast.error("Từ ngày không thể lớn hớn đến ngày")
        return false
      }

      fromDate.setDate(fromDate.getDate() + 62)

      if(fromDate < toDate) {
        this.toast.error("Thời gian không quá 62 ngày")
        return false
      }

      return true
    },

    search() {
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

      adminAPI.getReportByStaff(params).then(res => {
        if(res && res.data && res.data.data) {
          let datas = res.data.data
          // Handle data - map role names
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
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)

        this.firstSearch = false
        this.onSearch = false
        this.loading = false
      })
    },

    inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },

    handleExportExcel() {
      this.exportToExcel(
        this.items,
        this.excel_bill_fields,
        'Báo Cáo Theo Nhân Viên',
        'bao_cao_theo_nhan_vien.xls'
      )
    }
  }
}
</script>

<style scoped>
/* Scoped styles if needed */
</style>
