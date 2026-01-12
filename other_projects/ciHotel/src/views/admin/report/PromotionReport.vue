<template>
  <div class="container mx-auto px-4">
    <!-- Filters Card -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h4 class="text-center text-2xl font-bold text-orange-600 mb-6">BÁO CÁO KHUYẾN MÃI</h4>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <!-- Date Range -->
        <div class="md:col-span-4">
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
        <div class="md:col-span-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo:</label>
          <select
            v-model="inputs.orderBy"
            class="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="t.payment_at asc">Thời gian tăng dần</option>
            <option value="t.payment_at desc">Thời gian giảm dần</option>
          </select>
        </div>

        <!-- Search Button -->
        <div class="md:col-span-4">
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
      <div>
        <div class="flex flex-col md:flex-row justify-between items-center mb-4">
          <div class="mb-2 md:mb-0">Số kết quả: {{ orders.length }}</div>
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
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Ngày</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Số Bill</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Phòng</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Tên khách hàng</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Số điện thoại</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Tổng tiền phòng</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Tổng giảm giá</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Loại</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Tên</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Code</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">% giảm giá</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Giảm giá tối đa</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Trên tổng giá</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Giá trị voucher</th>
              </tr>
            </thead>
            <tbody v-for="(promotions, index) in orders" :key="index">
              <tr v-for="(promotion, pIndex) in promotions.promotions" :key="pIndex">
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ index + 1 }}</td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotions.payment_at }}</td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotions.bill_number }}</td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotions.room_name }}</td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotions.customer_name }}</td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotions.customer_phone_number }}</td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatCurrency(promotions.sub_total) }}</td>
                <td v-if="promotion.is_first" :rowspan="promotions.number_of_promotion" class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatCurrency(promotions.discount_amount) }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotion.type_name }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotion.promotion_name }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotion.code }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotion.discount_percent }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotion.max_discount }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ promotion.discount_on_amount }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">{{ formatCurrency(promotion.value_of_voucher) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
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
      orderByOption: [
        {value: 't.payment_at asc', text: ''},
        {value: 't.payment_at asc', text: 'Thời gian tăng dần'},
        {value: 't.payment_at desc', text: 'Thời gian giảm dần'}
      ],
      inputs: {
        fromDate: null,
        toDate: null,
        orderBy: "t.payment_at asc",
      },
      onSearch: false,
      orders: [],
      currentReportBy: "bill",
      excel_bill_data: [],
      excel_bill_fields: {
        'Ngày': 'payment_at',
        'Số Bill': 'bill_number',
        'Phòng' : 'room_name',
        'Tên khách hàng' : 'customer_name',
        'Số điện thoại' : 'customer_phone_number',
        'Tổng tiền dv' : 'sub_total',
        'Tổng giảm giá' : 'discount_amount',
        'Loại' : 'type_name',
        'Tên' : 'promotion_name',
        'Code' : 'code',
        'Phần trăm giảm giá' : 'discount_percent',
        'Giảm giá tối đa' : 'max_discount',
        'Trên tổng giá' : 'discount_on_amount',
        'Miễn phí dv' : 'service_name',
        'Giá trị voucher' : 'value_of_voucher'
      },
      loading: false,
    }
  },
  computed: {
  },
  mounted() {
    let dateNow = new Date().toJSON().slice(0,10)
    let lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    lastMonth.setDate(lastMonth.getDate() + 1)
    lastMonth = lastMonth.toJSON().slice(0,10)
    this.inputs.toDate = commonFunc.formatDate(dateNow)
    this.inputs.fromDate = commonFunc.formatDate(lastMonth)

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
        this.orders = []
        return
      }
      this.onSearch = true
      this.loading = true

      let params = {
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        "orderBy": this.inputs.orderBy,
      }

      adminAPI.getPromotionReport(params).then(res => {
        if(res && res.data && res.data.data) {
          this.orders = res.data.data
          this.handleExcelData()
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

    handleExcelData() {
      this.excel_bill_data = []
      for(let order of this.orders) {
        let promotions = order.promotions

        let index = 1
        for(let promotion of promotions) {
          let item = {
            'payment_at': '',
            'bill_number': '',
            'room_name' : '',
            'customer_name' : '',
            'customer_phone_number' : '',
            'sub_total' : '',
            'discount_amount' : ''
          }
          if(index === 1) {
            item = {
              'payment_at': order.payment_at,
              'bill_number': order.bill_number,
              'room_name' : order.room_name,
              'customer_name' : order.customer_name,
              'customer_phone_number' : order.customer_phone_number,
              'sub_total' : order.sub_total,
              'discount_amount' : order.discount_amount
            }
          }
          item.type_name = promotion.type_name
          item.promotion_name = promotion.promotion_name
          item.code = promotion.code
          item.discount_percent = promotion.discount_percent
          item.max_discount = promotion.max_discount
          item.discount_on_amount = promotion.discount_on_amount
          item.service_name = promotion.service_name
          item.value_of_voucher = promotion.value_of_voucher

          this.excel_bill_data.push(item)
          index += 1
        }
      }
    },

    inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },

    handleExportExcel() {
      this.exportToExcel(
        this.excel_bill_data,
        this.excel_bill_fields,
        'Báo Cáo Khuyến Mãi',
        'bao_cao_khuyen_mai.xls'
      )
    }
  }
}
</script>

<style scoped>
/* Scoped styles if needed */
</style>
