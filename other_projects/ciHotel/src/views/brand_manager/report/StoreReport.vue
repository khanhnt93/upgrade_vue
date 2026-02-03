<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <div class="bg-white shadow-sm rounded p-4 mb-4">
          <h4 class="text-center mb-4 font-weight-bold text-orange-500">BÁO CÁO BÁN HÀNG</h4>

          <div class="row mb-3">
            <div class="col-md-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Cửa hàng</label>
              <select
                v-model="inputs.store_id"
                :disabled="onSearch"
                class="form-control">
                <option
                  v-for="option in optionsStore"
                  :key="option.value"
                  :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="col-md-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Báo cáo theo:</label>
              <select
                v-model="inputs.reportBy"
                @change="changeReportBy"
                class="form-control">
                <option
                  v-for="option in reportByOption"
                  :key="option.value"
                  :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="col-md-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian:</label>
              <div class="input-group">
                <span class="input-group-addon pr-2">Từ</span>
                <input
                  type="text"
                  v-model="inputs.fromDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)"
                  class="form-control" />
                <span class="input-group-addon px-2">Đến</span>
                <input
                  type="text"
                  v-model="inputs.toDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)"
                  class="form-control" />
              </div>
            </div>

            <div class="col-md-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo:</label>
              <select
                v-model="inputs.orderBy"
                class="form-control">
                <option
                  v-for="option in orderByOption"
                  :key="option.value"
                  :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col">
              <button
                @click.prevent="search"
                :disabled="onSearch"
                class="btn btn-primary px-4 float-right"
                style="min-width: 120px;">
                Xem
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row" v-show="inputs.reportBy == 'bill'">
      <div class="col">
        <div class="bg-white shadow-sm rounded p-4">
          <!-- Loading -->
          <div v-show="loading" class="text-center py-4">
            <icon name="loading" width="60" />
          </div>

          <div v-show="firstSearch == false && bills && bills.length > 0">
            <div class="row mb-3">
              <div class="col-md-4">
                Số kết quả: {{ bills.length }}
              </div>
              <div class="col-md-8 text-right">
                <button
                  @click="handleExportBillExcel"
                  class="btn btn-default font-weight-bold">
                  <b>Xuất Excel</b>
                </button>
              </div>
            </div>

            <div class="row">
              <div class="col">
                <table class="table table-bordered table-striped table-hover">
                  <thead class="bg-blue-100">
                    <tr>
                      <th>STT</th>
                      <th>Ngày</th>
                      <th>Số Bill</th>
                      <th>Bàn</th>
                      <th class="text-right">Tổng</th>
                      <th class="text-right">Phí dịch vụ, phụ thu</th>
                      <th class="text-right">Giảm Giá</th>
                      <th class="text-right">% Thuế</th>
                      <th class="text-right">Số Tiền Thuế</th>
                      <th class="text-right">Thành Tiền</th>
                      <th>Nội dung dịch vụ, phụ thu</th>
                      <th>Nội dung Giảm Giá</th>
                      <th class="text-right">Tiền mặt</th>
                      <th class="text-right">Chuyển khoản</th>
                      <th class="text-right">Tiền điện tử</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(bill, index) in bills" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ bill.created_at }}</td>
                      <td>{{ bill.bill_number }}</td>
                      <td>{{ bill.table_name }}</td>
                      <td class="text-right">{{ formatCurrency(bill.sub_total) }}</td>
                      <td class="text-right">{{ formatCurrency(bill.service_price) }}</td>
                      <td class="text-right">{{ formatCurrency(bill.discount_amount) }}</td>
                      <td class="text-right">{{ bill.vat_percent }}</td>
                      <td class="text-right">{{ formatCurrency(bill.vat_value) }}</td>
                      <td class="text-right">{{ formatCurrency(bill.total) }}</td>
                      <td>{{ bill.service_name }}</td>
                      <td>{{ bill.content_discount }}</td>
                      <td class="text-right">{{ formatCurrency(bill.cash) }}</td>
                      <td class="text-right">{{ formatCurrency(bill.credit) }}</td>
                      <td class="text-right">{{ formatCurrency(bill.e_money) }}</td>
                    </tr>

                    <tr class="font-weight-bold" style="color: #ed592a;">
                      <td class="text-center" colspan="4">Tổng</td>
                      <td class="text-right">{{ formatCurrency(totalPrice) }}</td>
                      <td class="text-right">{{ formatCurrency(totalServicePrice) }}</td>
                      <td class="text-right">{{ formatCurrency(totalDiscount) }}</td>
                      <td></td>
                      <td class="text-right">{{ formatCurrency(totalVat) }}</td>
                      <td class="text-right">{{ formatCurrency(totalAmount) }}</td>
                      <td></td>
                      <td></td>
                      <td class="text-right">{{ formatCurrency(total_cash) }}</td>
                      <td class="text-right">{{ formatCurrency(total_credit) }}</td>
                      <td class="text-right">{{ formatCurrency(total_emoney) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div v-show="firstSearch == false && (!bills || bills.length == 0)" class="text-center py-4">
            Không tìm thấy kết quả nào
          </div>
        </div>
      </div>
    </div>

    <div class="row" v-show="inputs.reportBy == 'food'">
      <div class="col">
        <div class="bg-white shadow-sm rounded p-4">
          <!-- Loading -->
          <div v-show="loading" class="text-center py-4">
            <icon name="loading" width="60" />
          </div>

          <div v-show="firstSearch == false && foods && foods.length > 0">
            <div class="row mb-3">
              <div class="col-md-4">
                Số kết quả: {{ foods.length }}
              </div>
              <div class="col-md-8 text-right">
                <button
                  @click="handleExportFoodExcel"
                  class="btn btn-default font-weight-bold">
                  <b>Xuất Excel</b>
                </button>
              </div>
            </div>

            <div class="row">
              <div class="col">
                <table class="table table-bordered table-striped table-hover">
                  <thead class="bg-blue-100">
                    <tr>
                      <th>STT</th>
                      <th>Ngày</th>
                      <th>Số Bill</th>
                      <th>Bàn</th>
                      <th>Tên Món</th>
                      <th class="text-right">Đơn Giá</th>
                      <th class="text-right">Số Lượng</th>
                      <th class="text-right">Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(food, index) in foods" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ food.created_at }}</td>
                      <td>{{ food.bill_number }}</td>
                      <td>{{ food.table_name }}</td>
                      <td>{{ food.food_name }}</td>
                      <td class="text-right">{{ formatCurrency(food.price) }}</td>
                      <td class="text-right">{{ food.quantity }}</td>
                      <td class="text-right">{{ formatCurrency(food.amount) }}</td>
                    </tr>
                    <tr class="font-weight-bold" style="color: #ed592a;">
                      <td class="text-center" colspan="6">Tổng</td>
                      <td class="text-right">{{ formatCurrency(totalQuantity) }}</td>
                      <td class="text-right">{{ formatCurrency(totalAmount) }}</td>
                    </tr>
                    <tr class="font-weight-bold" style="color: #ed592a;">
                      <td class="text-center" colspan="6">Tổng phí dịch vụ, phụ thu</td>
                      <td class="text-right" colspan="2">{{ formatCurrency(totalServicePrice) }}</td>
                    </tr>
                    <tr class="font-weight-bold" style="color: #ed592a;">
                      <td class="text-center" colspan="6">Tổng giảm giá</td>
                      <td class="text-right" colspan="2">{{ formatCurrency(totalDiscount) }}</td>
                    </tr>
                    <tr class="font-weight-bold" style="color: #ed592a;">
                      <td class="text-center" colspan="6">Tổng thuế VAT</td>
                      <td class="text-right" colspan="2">{{ formatCurrency(totalVat) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div v-show="firstSearch == false && (!foods || foods.length == 0)" class="text-center py-4">
            Không tìm thấy kết quả nào
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useExcelExport } from '@/composables/useExcelExport'

export default {
  name: 'StoreReport',
  setup() {
    const { showToast } = useToast()
    const { formatCurrency } = useFormatters()
    const { exportToExcel } = useExcelExport()

    const inputs = reactive({
      store_id: null,
      reportBy: 'bill',
      fromDate: null,
      toDate: null,
      orderBy: 'payment_at asc'
    })

    const optionsStore = ref([])
    const reportByOption = ref([
      { value: 'bill', text: '' },
      { value: 'bill', text: 'Bill' },
      { value: 'food', text: 'Món' }
    ])
    const orderByOption = ref([
      { value: 'payment_at asc', text: '' },
      { value: 'payment_at asc', text: 'Thời gian tăng dần' },
      { value: 'payment_at desc', text: 'Thời gian giảm dần' }
    ])

    const onSearch = ref(false)
    const bills = ref([])
    const foods = ref([])
    const firstSearch = ref(true)
    const loading = ref(false)

    const totalPrice = ref(0)
    const totalServicePrice = ref(0)
    const totalDiscount = ref(0)
    const totalVat = ref(0)
    const totalAmount = ref(0)
    const totalQuantity = ref(0)
    const total_cash = ref(0)
    const total_credit = ref(0)
    const total_emoney = ref(0)

    const excel_bill_fields = {
      'Ngày': 'created_at',
      'Số Bill': 'bill_number',
      'Bàn': 'table_name',
      'Tổng': 'sub_total',
      'Phí dịch vụ, phụ thu': 'service_price',
      'Giảm Giá': 'discount_amount',
      '% Thuế': 'vat_percent',
      'Số Tiền Thuế': 'vat_value',
      'Thành Tiền': 'total',
      'Nội dung dịch vụ, phụ thu': 'service_name',
      'Nội dung Giảm Giá': 'content_discount'
    }

    const excel_food_fields = {
      'Ngày': 'created_at',
      'Số Bill': 'bill_number',
      'Bàn': 'table_name',
      'Tên Món': 'food_name',
      'Đơn Giá': 'price',
      'Số Lượng': 'quantity',
      'Thành Tiền': 'amount'
    }

    const getOptionStore = async () => {
      try {
        const res = await adminAPI.getStoreOption()
        if (res && res.data && res.data.data) {
          optionsStore.value = res.data.data
        }
      } catch (err) {
        const errorMess = commonFunc.handleStaffError(err)
        showToast('danger', errorMess)
      }
    }

    const checkFromDateAndToDate = () => {
      if (inputs.fromDate == "" || inputs.fromDate == null || commonFunc.dateFormatCheck(inputs.fromDate) == false) {
        showToast('danger', "Mục từ ngày không đúng")
        return false
      }
      if (inputs.toDate == "" || inputs.toDate == null || commonFunc.dateFormatCheck(inputs.toDate) == false) {
        showToast('danger', "Mục đến ngày không đúng")
        return false
      }

      let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.fromDate))
      let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.toDate))

      if (fromDate > toDate) {
        showToast('danger', "Từ ngày không thể lớn hớn đến ngày")
        return false
      }

      fromDate.setDate(fromDate.getDate() + 62)
      if (fromDate < toDate) {
        showToast('danger', "Thời gian không quá 62 ngày")
        return false
      }

      return true
    }

    const search = async () => {
      if (!checkFromDateAndToDate()) {
        foods.value = []
        bills.value = []
        return
      }

      if (!inputs.store_id) {
        showToast('danger', "Vui lòng chọn cửa hàng")
        return
      }

      onSearch.value = true
      loading.value = true

      let params = {
        "store_id": inputs.store_id,
        "reportBy": inputs.reportBy,
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.toDate),
        "orderBy": inputs.orderBy
      }

      try {
        const res = await adminAPI.searchBrandBill(params)
        if (res && res.data && res.data.data) {
          if (inputs.reportBy == "bill") {
            bills.value = res.data.data.data
            foods.value = []
          }
          if (inputs.reportBy == "food") {
            foods.value = res.data.data.data
            bills.value = []
          }
          totalPrice.value = res.data.data.total_price
          totalServicePrice.value = res.data.data.total_service_price
          totalDiscount.value = res.data.data.total_discount
          totalVat.value = res.data.data.total_vat
          totalAmount.value = res.data.data.total_amount
          totalQuantity.value = res.data.data.total_quantity
          total_cash.value = res.data.data.total_cash
          total_credit.value = res.data.data.total_credit
          total_emoney.value = res.data.data.total_emoney
        }

        firstSearch.value = false
        onSearch.value = false
        loading.value = false
      } catch (err) {
        const errorMess = commonFunc.handleStaffError(err)
        showToast('danger', errorMess)
        firstSearch.value = false
        onSearch.value = false
        loading.value = false
      }
    }

    const inputDateOnly = (item) => {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    }

    const changeReportBy = () => {
      bills.value = []
      foods.value = []
      firstSearch.value = true
    }

    onMounted(() => {
      getOptionStore()

      let dateNow = new Date().toJSON().slice(0, 10)
      inputs.toDate = commonFunc.formatDate(dateNow)
      inputs.fromDate = commonFunc.formatDate(dateNow)
    })

    return {
      inputs,
      optionsStore,
      reportByOption,
      orderByOption,
      onSearch,
      bills,
      foods,
      firstSearch,
      loading,
      totalPrice,
      totalServicePrice,
      totalDiscount,
      totalVat,
      totalAmount,
      totalQuantity,
      total_cash,
      total_credit,
      total_emoney,
      excel_bill_fields,
      excel_food_fields,
      search,
      inputDateOnly,
      changeReportBy,
      formatCurrency,
      handleExportBillExcel: () => {
        exportToExcel(
          bills.value,
          excel_bill_fields.value,
          'Báo Cáo Theo Bill',
          'bao_cao_bill.xls'
        )
      },
      handleExportFoodExcel: () => {
        exportToExcel(
          foods.value,
          excel_food_fields.value,
          'Báo Cáo Theo Món',
          'bao_cao_mon.xls'
        )
      }
    }
  }
}
</script>

<style scoped>
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
