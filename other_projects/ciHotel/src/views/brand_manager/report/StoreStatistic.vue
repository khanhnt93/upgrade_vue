<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <div class="bg-white shadow-sm rounded p-4">
          <h4 class="text-center mb-4">Thống Kê</h4>

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

            <div class="col-md-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="inputs.fromDate"
                maxlength="10"
                @keyup="inputDateOnly($event.target)"
                :class="['form-control', {'border-red-500': errorFromDate}]" />
              <div v-if="errorFromDate" class="text-red-500 text-sm mt-1">
                Mục từ ngày không đúng
              </div>
            </div>

            <div class="col-md-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="inputs.toDate"
                maxlength="10"
                @keyup="inputDateOnly($event.target)"
                :class="['form-control', {'border-red-500': errorToDate}]" />
              <div v-if="errorToDate" class="text-red-500 text-sm mt-1">
                Mục đến ngày không đúng
              </div>
            </div>

            <div class="col-md-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo</label>
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

          <div class="row mt-3 mb-3">
            <div class="col-md-12 text-right">
              <button
                @click.prevent="search"
                :disabled="onSearch"
                class="btn btn-primary px-4"
                style="min-width: 120px;">
                Xem
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-show="loading" class="text-center py-4">
            <icon name="loading" width="60" />
          </div>

          <div v-show="items && items.length > 0" class="row mb-3">
            <div class="col-md-4">
              Số kết quả: {{ items.length }}
            </div>
            <div class="col-md-8 text-right">
              <download-excel
                class="btn btn-default font-weight-bold"
                :data="items"
                :fields="excel_statistic_fields"
                worksheet="Thống kê"
                name="filename.xls">
                <b>Xuất Excel</b>
              </download-excel>
            </div>
          </div>

          <div class="row mt-3 mb-3" v-show="click == true">
            <div class="col-md-12">
              <table class="table table-bordered table-striped table-hover" v-show="items && items.length > 0">
                <thead class="bg-blue-100">
                  <tr>
                    <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in items" :key="index">
                    <td>{{ item.stt }}</td>
                    <td>{{ item.name }}</td>
                    <td class="text-right">{{ item.quantity }}</td>
                    <td class="text-right">{{ item.percent_quantity }}</td>
                    <td class="text-right">{{ item.amount }}</td>
                    <td class="text-right">{{ item.percent_amount }}</td>
                  </tr>
                </tbody>
              </table>

              <p v-show="firstSearch == false && (!items || items.length <= 0)" class="text-center py-4">
                Không có kết quả nào
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import JsonExcel from 'vue-json-excel'

export default {
  name: 'StoreStatistic',
  components: {
    'downloadExcel': JsonExcel
  },
  setup() {
    const { showToast } = useToast()

    const inputs = reactive({
      store_id: null,
      fromDate: null,
      toDate: null,
      orderBy: 'quantityAsc'
    })

    const onSearch = ref(false)
    const click = ref(false)
    const optionsStore = ref([])
    const orderByOption = ref([
      { value: 'quantityAsc', text: '' },
      { value: 'quantityAsc', text: 'Số lượng tăng dần' },
      { value: 'quantityDesc', text: 'Số lượng giảm dần' },
      { value: 'amountAsc', text: 'Doanh thu tăng dần' },
      { value: 'amountDesc', text: 'Doanh thu giảm dần' }
    ])

    const fields = ref([
      { key: 'stt', label: 'STT' },
      { key: 'name', label: 'Tên' },
      { key: 'quantity', label: 'Số lượng' },
      { key: 'percent_quantity', label: '% Số lượng' },
      { key: 'amount', label: 'Doanh thu' },
      { key: 'percent_amount', label: '% Doanh thu' }
    ])

    const items = ref([])
    const loading = ref(false)
    const firstSearch = ref(true)

    const excel_statistic_fields = {
      'STT': 'stt',
      'Tên': 'name',
      'Số lượng': 'quantity',
      '% Số lượng': 'percent_quantity',
      'Doanh thu': 'amount',
      '% Doanh thu': 'percent_amount'
    }

    const errorFromDate = computed(() => {
      return click.value && (inputs.fromDate == "" || inputs.fromDate == null ||
        commonFunc.dateFormatCheck(inputs.fromDate) == false)
    })

    const errorToDate = computed(() => {
      return click.value && (inputs.toDate == "" || inputs.toDate == null ||
        commonFunc.dateFormatCheck(inputs.toDate) == false)
    })

    const checkValidate = () => {
      return !(errorFromDate.value || errorToDate.value)
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

    const inputDateOnly = (item) => {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    }

    const checkFromDateAndToDate = () => {
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
      if (loading.value) { return }
      click.value = true

      if (!checkValidate()) {
        items.value = []
        return
      }

      if (!inputs.store_id) {
        showToast('danger', "Vui lòng chọn cửa hàng")
        return
      }

      if (!checkFromDateAndToDate()) {
        items.value = []
        return
      }

      loading.value = true
      onSearch.value = true

      let params = {
        "store_id": inputs.store_id,
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(inputs.toDate),
        "orderBy": inputs.orderBy
      }

      try {
        const res = await adminAPI.getBrandStatistic(params)
        if (res && res.data && res.data.data) {
          items.value = res.data.data
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

    onMounted(() => {
      getOptionStore()

      let dateNow = new Date().toJSON().slice(0, 10)
      inputs.toDate = commonFunc.formatDate(dateNow)
      inputs.fromDate = commonFunc.formatDate(dateNow)
    })

    return {
      inputs,
      onSearch,
      click,
      optionsStore,
      orderByOption,
      fields,
      items,
      loading,
      firstSearch,
      excel_statistic_fields,
      errorFromDate,
      errorToDate,
      search,
      inputDateOnly
    }
  }
}
</script>
