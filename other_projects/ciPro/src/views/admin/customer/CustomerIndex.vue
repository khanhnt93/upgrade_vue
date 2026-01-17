<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <button class="float-left px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 btn-width-120" @click="back">
          Quay lại
        </button>
        <button class="float-right px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 btn-width-120" @click="save" :disabled="saving">
          Lưu
        </button>
      </div>

      <div class="clear-both">
        <h4 class="mt-2 text-center text-header font-bold">{{prefix_title}} Khách Hàng</h4>
      </div>
      <hr class="my-4">

      <!-- Loading -->
      <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

      <div class="space-y-4">
        <!-- Customer Type -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div class="md:col-span-3">
            <label class="block">Loại khách hàng</label>
          </div>
          <div class="md:col-span-9">
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input type="radio" v-model="inputs.type" name="type" value="0" class="mr-2">
                <span>Cá nhân</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="inputs.type" name="type" value="1" class="mr-2">
                <span>Công ty</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Name -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3">
            <label class="block">Tên<span class="error-sybol"></span></label>
          </div>
          <div class="md:col-span-9">
            <input id="name" v-model="inputs.name" type="text" class="form-control w-full" autocomplete="new-password" maxlength="75">
            <div v-if="errorName" class="text-red-500 text-sm mt-1">Vui lòng nhập tên</div>
          </div>
        </div>

        <!-- Customer Code -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3">
            <label class="block">Mã khách hàng<span class="error-sybol"></span></label>
          </div>
          <div class="md:col-span-9">
            <input id="code" v-model="inputs.code" type="text" class="form-control w-full" @keyup="integerOnly($event.target)" autocomplete="new-password" maxlength="20" placeholder="Số điện thoại hoặc mã số thuế">
            <div v-if="errorCode" class="text-red-500 text-sm mt-1">Vui lòng nhập mã khách hàng</div>
          </div>
        </div>

        <!-- Phone Number -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3">
            <label class="block">Số Điện Thoại</label>
          </div>
          <div class="md:col-span-9">
            <input id="phone" v-model="inputs.phone_number" type="text" class="form-control w-full" @keyup="integerOnly($event.target)" autocomplete="new-password" maxlength="15" @change="checkPhoneNumberFormat($event.target.value)">
            <div v-if="errorPhone" class="text-red-500 text-sm mt-1">Số điện thoại không đúng</div>
          </div>
        </div>

        <!-- Email -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3">
            <label class="block">Email</label>
          </div>
          <div class="md:col-span-9">
            <input id="email" v-model="inputs.email" type="text" class="form-control w-full" autocomplete="new-password" maxlength="255">
            <div v-if="errorEmail" class="text-red-500 text-sm mt-1">Email không đúng định dạng</div>
          </div>
        </div>

        <!-- Tax Code -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3">
            <label class="block">Mã số thuế <span v-show="inputs.type == 1" class="error-sybol"></span></label>
          </div>
          <div class="md:col-span-9">
            <input id="tax_code" v-model="inputs.tax_code" type="text" class="form-control w-full" @keyup="integerOnly($event.target)" autocomplete="new-password" maxlength="20">
            <div v-if="errorTaxCode" class="text-red-500 text-sm mt-1">Vui lòng nhập mã số thuế</div>
          </div>
        </div>

        <!-- Company Type (only for company) -->
        <div v-show="inputs.type == 1" class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3">
            <label class="block">Phân loại</label>
          </div>
          <div class="md:col-span-9">
            <select v-model="inputs.company_type" class="form-control w-full">
              <option v-for="option in optionsCompanyType" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
        </div>

        <!-- Gender -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3">
            <label class="block">Giới Tính</label>
          </div>
          <div class="md:col-span-9">
            <select v-model="inputs.gender" class="form-control w-full">
              <option v-for="option in optionsGender" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
        </div>

        <!-- Birthday -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3">
            <label class="block">Ngày Tháng Năm Sinh</label>
          </div>
          <div class="md:col-span-9">
            <input id="birthday" v-model="inputs.birthday" type="text" placeholder="dd-mm-yyyy" autocomplete="new-password" class="form-control w-full" @change="checkBirthdayFormat($event.target)">
            <div v-if="!birthdayCheckFlag" class="text-red-500 text-sm mt-1">Ngày sinh không đúng</div>
          </div>
        </div>

        <!-- City -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3">
            <label class="block">Tỉnh/ Thành Phố</label>
          </div>
          <div class="md:col-span-9">
            <select id="city_id" v-model="inputs.city_id" class="form-control w-full" @change="changeCity($event.target)">
              <option v-for="option in optionsCity" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
        </div>

        <!-- District -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3">
            <label class="block">Quận/ Huyện</label>
          </div>
          <div class="md:col-span-9">
            <select id="district_id" v-model="inputs.district_id" class="form-control w-full" :disabled="!inputs.city_id">
              <option v-for="option in optionsDistrict" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
        </div>

        <!-- Address -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3">
            <label class="block">Địa chỉ</label>
          </div>
          <div class="md:col-span-9">
            <input id="address" v-model="inputs.address" type="text" class="form-control w-full" autocomplete="new-password" maxlength="255">
          </div>
        </div>

        <!-- Contact Person Name -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3">
            <label class="block">Tên người liên hệ</label>
          </div>
          <div class="md:col-span-9">
            <input id="contact_person" v-model="inputs.contact_person_name" type="text" maxlength="100" autocomplete="new-password" class="form-control w-full">
          </div>
        </div>

        <!-- Contact Person Phone -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3">
            <label class="block">Sđt người liên hệ</label>
          </div>
          <div class="md:col-span-9">
            <input id="contact_person_phone" v-model="inputs.contact_person_phone" type="text" maxlength="14" autocomplete="new-password" class="form-control w-full" @keyup="integerOnly($event.target)">
            <div v-if="errorContactPersonPhone" class="text-red-500 text-sm mt-1">Số điện thoại không đúng</div>
          </div>
        </div>

        <!-- Contact Person Email -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3">
            <label class="block">Email người liên hệ</label>
          </div>
          <div class="md:col-span-9">
            <input id="contact_person_email" v-model="inputs.contact_person_email" type="text" class="form-control w-full" autocomplete="new-password" maxlength="255">
          </div>
        </div>

        <!-- Staff in charge (admin only) -->
        <div v-show="userRole == 'admin'" class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3">
            <label class="block">Nhân viên phụ trách</label>
          </div>
          <div class="md:col-span-9">
            <select id="created_by" v-model="inputs.created_by" class="form-control w-full">
              <option v-for="option in optionsStaff" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import customerApi from '@/api/customer'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import commonFunc from '@/common/commonFunc'

const route = useRoute()
const router = useRouter()
const { popToast } = useToast()

const prefix_title = ref("Thêm Mới")
const inputs = ref({
  "type": 0,
  "name": null,
  "code": null,
  "phone_number": null,
  "email": null,
  "tax_code": null,
  "company_type": null,
  "gender": null,
  "birthday": null,
  "city_id": null,
  "district_id": null,
  "address": null,
  "contact_person_name": null,
  "contact_person_phone": null,
  "contact_person_email": null,
  "created_by": null
})
const optionsGender = ref([
  { value: '1', text: 'Nam' },
  { value: '2', text: 'Nữ' },
  { value: '3', text: 'Khác' }
])
const optionsCompanyType = ref([
  { value: null, text: '' },
  { value: 1, text: 'Thương mại' },
  { value: 2, text: 'Nhà máy' },
  { value: 3, text: 'Công trình' }
])
const optionsCity = ref([])
const optionsDistrict = ref([])
const optionsStaff = ref([])
const click = ref(false)
const phoneNumberCheckFlag = ref(true)
const birthdayCheckFlag = ref(true)
const saving = ref(false)
const loading = ref(false)
const userRole = ref("staff")

const errorName = computed(() => checkInfo(inputs.value.name))
const errorPhone = computed(() => checkPhoneNumber(inputs.value.phone_number))
const errorEmail = computed(() => checkEmail(inputs.value.email))
const errorContactPersonPhone = computed(() => checkPhoneNumber(inputs.value.contact_person_phone))
const errorCode = computed(() => checkInfo(inputs.value.code))
const errorTaxCode = computed(() => checkTaxCode(inputs.value.tax_code, inputs.value.type))

const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkPhoneNumber = (info) => {
  return (click.value && !checkPhoneNumberFormat(info))
}

const checkTaxCode = (tax_code, type) => {
  return (click.value && (type == 1 && (tax_code == null || tax_code.length <= 0)))
}

const checkEmail = (info) => {
  return (click.value && !checkEmailFormat(info))
}

const checkValidate = () => {
  return !(errorName.value || errorCode.value || errorTaxCode.value || errorPhone.value
    || errorEmail.value || errorContactPersonPhone.value
    || !birthdayCheckFlag.value || !phoneNumberCheckFlag.value)
}

const checkPhoneNumberFormat = (item) => {
  let valueInput = item
  if (valueInput != null && valueInput != "") {
    if (!commonFunc.phoneNumberCheck(valueInput)) {
      return false
    }
  }
  return true
}

const checkEmailFormat = (item) => {
  let valueInput = item
  if (valueInput != null && valueInput != "") {
    if (!commonFunc.emailCheck(valueInput)) {
      return false
    }
  }
  return true
}

const getOptionCity = () => {
  MasterApi.getCityOptions().then(res => {
    optionsCity.value = MasterMapper.mapCityModelToDto(res.data.data)
    changeCity()
  })
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

const getCustomerDetail = () => {
  let cusId = route.params.id
  if (cusId) {
    customerApi.getCustomerDetailByStore(cusId, userRole.value).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        inputs.value = res.data.data
        getOptionCity()
      }
    }).catch(err => {
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const save = () => {
  click.value = true

  let checkValidateResult = checkValidate()
  if (!checkValidateResult) {
    return
  }

  saving.value = true

  let customerId = route.params.id
  let params = JSON.parse(JSON.stringify(inputs.value))
  params.id = customerId
  params.phone = inputs.value.phone_number
  params.birthday = formatDate(inputs.value.birthday)

  if (customerId) {
    // Edit
    customerApi.updateCustomerByStore(params).then(res => {
      saving.value = false
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          popToast('success', 'Cập nhật khách hàng thành công!!! ')
        }
      }
    }).catch(err => {
      saving.value = false
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  } else {
    // Add
    customerApi.addCustomerByStore(params).then(res => {
      saving.value = false
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          if (userRole.value == "staff") {
            router.push("/customer-sale")
          } else {
            router.push("/customer")
          }
        }
      }
    }).catch(err => {
      saving.value = false
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const formatDate = (dateInput) => {
  let result = dateInput
  if (dateInput) {
    let temp = dateInput.split("-")
    if (temp.length == 1) {
      temp = dateInput.split("/")
    }
    result = temp[2] + "-" + temp[1] + "-" + temp[0]
  }
  return result
}

const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

const changeCity = () => {
  let cityId = inputs.value.city_id
  if (cityId != "" && cityId != undefined) {
    MasterApi.getDistrictOptions(cityId).then(res => {
      optionsDistrict.value = MasterMapper.mapCityModelToDto(res.data.data)
    })
  } else {
    inputs.value.district_id = null
  }
}

const checkBirthdayFormat = (item) => {
  let valueInput = item.value
  if (valueInput != null && valueInput != "") {
    if (commonFunc.dateFormatCheck(valueInput)) {
      birthdayCheckFlag.value = true
    } else {
      birthdayCheckFlag.value = false
    }
  } else {
    birthdayCheckFlag.value = true
  }
}

const back = () => {
  if (userRole.value == "admin") {
    router.push("/customer")
  } else {
    router.push("/customer-sale")
  }
}

onMounted(() => {
  // Check prefix
  if (route.params.id) {
    prefix_title.value = "Cập Nhật"
  } else {
    prefix_title.value = "Thêm Mới"
  }

  // UI by staff
  let url = location.href
  if (url.includes("customer-sale")) {
    userRole.value = "staff"
  } else {
    userRole.value = "admin"
  }

  getCustomerDetail()
  getOptionCity()
  getOptionStaff()
})
</script>
