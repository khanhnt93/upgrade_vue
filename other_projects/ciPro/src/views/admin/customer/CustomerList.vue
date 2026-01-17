<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <button class="float-right px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 btn-width-120" @click="goToAdd">
          Thêm
        </button>
        <button class="float-right px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 btn-width-120 mr-2" @click="openModalImportFile">
          Upload
        </button>
      </div>

      <div class="clear-both">
        <h4 class="mt-2 text-center text-header font-bold">Danh Sách Khách Hàng</h4>
      </div>
      <hr class="my-4">

      <!-- Search Filters -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block mb-2">Loại khách hàng</label>
          <select id="city_id" v-model="inputs.type" class="form-control w-full">
            <option v-for="option in optionsType" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
        </div>
        <div>
          <label class="block mb-2">Tỉnh/Thành Phố</label>
          <select id="city_id" v-model="inputs.city_id" class="form-control w-full">
            <option v-for="option in optionsCity" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
        </div>
        <div>
          <label class="block mb-2">Số điện thoại/Mã số thuế</label>
          <input id="price" v-model="inputs.phone" type="text" autocomplete="new-password" class="form-control w-full" maxlength="20" placeholder="Mã K.H, SĐT, SĐT người liên hệ" @keyup="integerOnly($event.target)">
        </div>
        <div>
          <label class="block mb-2">Tên</label>
          <input id="name" v-model="inputs.name" type="text" autocomplete="new-password" class="form-control w-full" maxlength="75">
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div v-if="userRole == 'admin'">
          <label class="block mb-2">Nhân viên phụ trách</label>
          <select id="created_by" v-model="inputs.staff_in_charge" class="form-control w-full">
            <option v-for="option in optionsStaff" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
        </div>
        <div>
          <label class="block mb-2">Thời gian</label>
          <select v-model="time_option" class="form-control w-full">
            <option v-for="option in timeOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
        </div>
        <div>
          <label v-show="time_option != 5" class="block mb-2">
            {{time_option == 1 ? 'Từ ngày' : 'Năm' }}
          </label>
          <!-- Date -->
          <datepicker v-show="time_option == 1" v-model="inputs.created_from" format="yyyy-MM-dd" placeholder="yyyy-MM-dd" input-class="datepicker-cus"></datepicker>
          <!-- Year -->
          <select v-show="time_option != 1 && time_option != 5" v-model="year_input" class="form-control w-full">
            <option v-for="option in yearOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
        </div>
        <div>
          <label v-show="time_option == 1 || time_option == 2 || time_option == 3" class="block mb-2">
            {{time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý' }}
          </label>
          <!-- Date -->
          <datepicker v-show="time_option == 1" v-model="inputs.created_to" format="yyyy-MM-dd" placeholder="yyyy-MM-dd" input-class="datepicker-cus"></datepicker>
          <!-- Month -->
          <select v-show="time_option == 2" v-model="month_input" class="form-control w-full">
            <option v-for="option in monthOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
          <!-- Quarter -->
          <select v-show="time_option == 3" v-model="quarter_input" class="form-control w-full">
            <option v-for="option in quarterOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
        </div>
      </div>

      <div class="mb-4">
        <button class="float-right px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 btn-width-120" :disabled="onSearch" @click.prevent="prepareToSearch">
          Tìm Kiếm
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 clear-both">
        <div>
          Số kết quả: <b>{{totalRow}}</b>
        </div>
        <div class="text-right" v-if="isUserRoot && excel_items.length > 0">
          <download-excel
            class="btn btn-default text-header"
            :data="excel_items"
            :fields="excel_fields"
            worksheet="data"
            name="danh_sach_khach_hang.xls">
            <b>Xuất Excel</b>
          </download-excel>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 border">
          <thead class="bg-gray-50">
            <tr>
              <th style="width:2%" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">STT</th>
              <th style="width:4%" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Loại</th>
              <th style="width:12%" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Tên</th>
              <th style="width:5%" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Mã K.H</th>
              <th style="width:5%" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">SĐT</th>
              <th style="width:5%" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Email</th>
              <th style="width:5%" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Mã số thuế</th>
              <th style="width:5%" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Tỉnh/TP</th>
              <th style="width:5%" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Quận/Huyện</th>
              <th style="width:25%" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Địa chỉ</th>
              <th style="width:5%" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Tên người liên hệ</th>
              <th style="width:5%" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Sđt người liên hệ</th>
              <th style="width:5%" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">NV phụ trách</th>
              <th style="width:5%" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Ngày thêm</th>
              <th style="width:5%" class="px-4 py-3 border"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in items" :key="item.id" :class="item.row_class" class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap border">{{item.stt}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.type}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.name}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.code}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.phone_number}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.email}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.tax_code}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.city_name}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.district_name}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.address}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.contact_person_name}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.contact_person_phone}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.staff_name}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.created_at}}</td>
              <td class="px-4 py-3 border">
                <div class="flex space-x-2">
                  <button @click="edit(item.id)" title="Cập nhật" class="text-blue-600 hover:text-blue-900">
                    <i class="fa fa-edit" />
                  </button>
                  <button v-if="isShowDelete" @click="deleted(item.id, item.name)" title="Xóa" class="text-red-600 hover:text-red-900">
                    <i class="fa fa-trash" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading -->
      <span v-show="loading" class="loading-more"><icon name="loading" width="60" /></span>
      <span v-if="hasNext === false" class="loading-more">--Hết--</span>
      <span v-if="hasNext === true && totalRow != 0" class="loading-more"><i class="fa fa-angle-double-down has-next"></i></span>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h4 class="text-center font-bold mb-4">Upload khách hàng từ file excel</h4>
        <p class="text-left mb-4">
          Tải xuống file mẫu:
          <a target="_blank" href="https://api.cipro.vn/files/upload_excel_template/ciPro_upload_customer_template.xlsx" class="text-blue-500 hover:underline">Tải xuống</a>
        </p>
        <hr class="my-4">

        <div class="mb-4">
          <label class="block mb-2">Chọn file excel bạn muốn upload</label>
          <input type="file" id="file" ref="file" @change="handleFileUpload()" accept=".xlsx" class="form-control w-full"/>
        </div>

        <div class="text-right mt-4">
          <span v-show="uploading" class="loading-more"><icon name="loading" width="60" /></span>
          <button v-show="!uploading" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" @click="importCustomerFromExcelFile()" :disabled="!fileUpload || uploading">
            Upload
          </button>
        </div>

        <div v-show="uploadErrorList.length > 0" class="mt-4 overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 border">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Dòng</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Mô tả lỗi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(error, index) in uploadErrorList" :key="index">
                <td class="px-4 py-3 border">{{error.row}}</td>
                <td class="px-4 py-3 border">{{error.mess}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-center mt-4">
          <button class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" @click="closeUploadModal()">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import customerApi from '@/api/customer'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import Datepicker from 'vue3-datepicker'

const router = useRouter()
const authStore = useAuthStore()
const { popToast } = useToast()

const timeOptions = ref([
  { "value": 1, "text": 'Ngày' },
  { "value": 2, "text": 'Tháng' },
  { "value": 3, "text": 'Quý' },
  { "value": 4, "text": 'Năm' },
  { "value": 5, "text": 'Tất cả' }
])
const yearOptions = ref([])
const quarterOptions = ref([
  { "value": 1, "text": 'Quý 1' },
  { "value": 2, "text": 'Quý 2' },
  { "value": 3, "text": 'Quý 3' },
  { "value": 4, "text": 'Quý 4' }
])
const monthOptions = ref([
  { "value": 1, "text": 'Tháng 1' },
  { "value": 2, "text": 'Tháng 2' },
  { "value": 3, "text": 'Tháng 3' },
  { "value": 4, "text": 'Tháng 4' },
  { "value": 5, "text": 'Tháng 5' },
  { "value": 6, "text": 'Tháng 6' },
  { "value": 7, "text": 'Tháng 7' },
  { "value": 8, "text": 'Tháng 8' },
  { "value": 9, "text": 'Tháng 9' },
  { "value": 10, "text": 'Tháng 10' },
  { "value": 11, "text": 'Tháng 11' },
  { "value": 12, "text": 'Tháng 12' }
])
const time_option = ref(5)
const year_input = ref(2023)
const quarter_input = ref(1)
const month_input = ref(1)
const inputs = ref({
  name: null,
  phone: null,
  staff_in_charge: null,
  city_id: null,
  type: null,
  created_from: '2024-01-01',
  created_to: '2024-01-01'
})
const optionsStaff = ref([])
const optionsCity = ref([])
const optionsType = ref([
  { value: null, text: "" },
  { value: 0, text: "Cá nhân" },
  { value: 1, text: 'Cty - Thương mại' },
  { value: 2, text: 'Cty - Nhà máy' },
  { value: 3, text: 'Cty - Công Trình' }
])
const items = ref([])
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const hasNext = ref(true)
const onSearch = ref(false)
const loadByScroll = ref(false)
const loading = ref(false)
const totalRow = ref(0)
const fileUpload = ref(null)
const file = ref(null)
const uploading = ref(false)
const userRole = ref("staff")
const isShowDelete = ref(false)
const uploadErrorList = ref([])
const isUserRoot = ref(false)
const excel_items = ref([])
const excel_fields = ref({
  'Loại khách hàng': 'type',
  'Tên*': 'name',
  'Mã khách hàng*': {
    field: "code",
    callback: (value) => {
      if (value && value.substring(0, 1) == 0) {
        return "'" + value
      }
      return value
    }
  },
  'Số Điện Thoại': {
    field: "phone_number",
    callback: (value) => {
      if (value) {
        return "'" + value
      }
      return value
    }
  },
  'Email': 'email',
  'Mã số thuế': 'tax_code',
  'Loại CTY': 'company_type_str',
  'Giới Tính': 'gender_str',
  'Ngày Tháng Năm Sinh': 'birthday',
  'Tỉnh/ Thành Phố': 'city_name',
  'Quận/ Huyện': 'district_name',
  'Địa chỉ': 'address',
  'Tên người liên hệ': 'contact_person_name',
  'Sđt người liên hệ': {
    field: 'contact_person_phone',
    callback: (value) => {
      if (value && value.substring(0, 1) == 0) {
        return "'" + value
      }
      return value
    }
  },
  'Email người liên hệ': 'contact_person_email',
  'Nhân viên phụ trách': 'staff_name',
})
const isGetExcelItems = ref(false)
const showUploadModal = ref(false)

const onScroll = (event) => {
  if (onSearch.value) {
    return
  }
  event.preventDefault()
  var body = document.body
  var html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if (hasNext.value) {
      offset.value = offset.value + pageLimit.value
      loadByScroll.value = true
      search()
    }
  }
}

const prepareDateInput = () => {
  let dateNow = new Date()
  inputs.value.created_to = dateNow.toJSON().slice(0, 10)
  inputs.value.created_from = new Date(dateNow.setDate(dateNow.getDate() - 7)).toJSON().slice(0, 10)
  let currentYear = new Date().getFullYear()
  year_input.value = currentYear
  yearOptions.value = []
  for (let i = currentYear; i > currentYear - 10; i--) {
    yearOptions.value.push({ value: i, text: i })
  }
  month_input.value = dateNow.getMonth() + 1
}

const getOptionStaff = () => {
  if (userRole.value == "staff") {
    return
  }

  customerApi.getStaffOptions().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      optionsStaff.value = [{ value: null, text: '' }]
      var staffs = res.data.data
      if (staffs) {
        for (let i in staffs) {
          optionsStaff.value.push(staffs[i])
        }
      }
    }
  })
}

const getOptionCity = () => {
  MasterApi.getCityOptions().then(res => {
    optionsCity.value = MasterMapper.mapCityModelToDto(res.data.data)
  })
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  isGetExcelItems.value = false
  search()
}

const search = () => {
  if (loading.value) { return }

  onSearch.value = true
  loading.value = true

  let fromDate = inputs.value.created_from
  let toDate = inputs.value.created_to

  // Handle fromDate, toDate
  if (time_option.value == 2) {
    fromDate = year_input.value + '-' + month_input.value + '-01'
    toDate = year_input.value + '-' + month_input.value + '-' + new Date(year_input.value, month_input.value, 0).getDate()
  }
  if (time_option.value == 3) {
    let quarter = commonFunc.getMonthByQuarter(quarter_input.value)
    fromDate = year_input.value + '-' + quarter + '-01'
    toDate = year_input.value + '-' + (quarter + 2) + '-' + new Date(year_input.value, (quarter + 2), 0).getDate()
  }
  if (time_option.value == 4) {
    fromDate = year_input.value + '-01-01'
    toDate = year_input.value + '-12-' + new Date(year_input.value, 12, 0).getDate()
  }
  if (time_option.value == 5) {
    toDate = new Date().toJSON().slice(0, 10)
    fromDate = '2000-01-01'
  }

  let params = {
    "name": inputs.value.name,
    "phone": inputs.value.phone,
    "staff_in_charge": inputs.value.staff_in_charge,
    "city_id": inputs.value.city_id,
    "type": inputs.value.type,
    "created_from": fromDate,
    "created_to": toDate,
    "limit": pageLimit.value,
    "offset": offset.value
  }

  customerApi.getCustomerByStore(params, userRole.value).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let it = res.data.data.customers
      totalRow.value = res.data.data.total_row

      if (loadByScroll.value) {
        let temp = items.value
        var newArray = temp.concat(it)
        items.value = newArray
      } else {
        items.value = it
      }
      loadByScroll.value = false

      if (offset.value + pageLimit.value >= res.data.data.total_row) {
        hasNext.value = false
      }

      if (!isGetExcelItems.value) {
        getExcelItem(params)
      }
    } else {
      items.value = []
      excel_items.value = []
    }
    onSearch.value = false
    loading.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onSearch.value = false
    loading.value = false
  })
}

const getExcelItem = (params) => {
  if (isGetExcelItems.value) {
    return
  }

  excel_items.value = []
  params.limit = 999999

  customerApi.getCustomerByStore(params, userRole.value).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      excel_items.value = res.data.data.customers
      isGetExcelItems.value = true
    }
  }).catch(err => {
  })
}

const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

const edit = (id) => {
  if (userRole.value == "admin") {
    router.push('/customer/edit/' + id)
  } else {
    router.push('/customer-sale/edit/' + id)
  }
}

const goToAdd = () => {
  if (userRole.value == "staff") {
    router.push('/customer-sale/add')
  } else {
    router.push('/customer/add')
  }
}

const openModalImportFile = () => {
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
  uploadErrorList.value = []
}

const importCustomerFromExcelFile = () => {
  uploading.value = true
  const form_data = new FormData()
  form_data.append("importFile", fileUpload.value)
  customerApi.importCustomerFromExcelFile(form_data).then(res => {
    if (res != null && res.data != null) {
      if (res.data.data == null) {
        closeUploadModal()
      } else {
        uploadErrorList.value = res.data.data
      }
    }
    prepareToSearch()
    uploading.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    uploading.value = false
  })
}

const handleFileUpload = () => {
  fileUpload.value = file.value.files[0]
}

const deleted = (id, name) => {
  if (id && name) {
    if (confirm('Xóa ' + name + ". Bạn có chắc không?")) {
      customerApi.deleteCustomer(id).then(res => {
        prepareToSearch()
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  }
}

onMounted(() => {
  // Check delete
  if (authStore.user && authStore.user.isRoot) {
    isShowDelete.value = true
    isUserRoot.value = true
  } else {
    isShowDelete.value = false
    isUserRoot.value = false
  }

  // UI by staff
  let url = location.href
  if (url.includes("customer-sale")) {
    userRole.value = "staff"
  } else {
    userRole.value = "admin"
  }

  prepareDateInput()
  window.addEventListener('scroll', onScroll)
  getOptionStaff()
  getOptionCity()
  search()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
