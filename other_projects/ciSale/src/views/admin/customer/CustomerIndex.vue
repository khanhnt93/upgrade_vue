<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="p-4">

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <button class="btn btn-outline-secondary float-left btn-width-120" @click="back">
                  <i class="fa fa-arrow-left mr-2"></i> Quay lại
                </button>

                <button class="btn btn-outline-success float-right btn-width-120" @click="save" :disabled="saving">
                  <i class="fa fa-save mr-2"></i> Lưu
                </button>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full px-2">
                <h4 class="mt-2 text-center text-header">Khách Hàng</h4>
              </div>
            </div>
            <hr/>
            <!-- Loading -->
            <span class="loading-more" v-show="loading"><i class="fa fa-spinner fa-spin fa-3x text-primary"></i></span>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Loại khách hàng </label>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <div class="input-group">
                    <input type="radio" v-model="inputs.type" name="type" value="0" class="mt-2"><label class="ml-4 mt-1">Cá nhân</label>
                    <input type="radio" v-model="inputs.type" name="type" value="1" class="ml-5 mt-2"><label class="ml-4 mt-1">Công ty</label>
                  </div>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
              </div>
              <div class="w-full md:w-3/4 px-2">
                  <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model="inputs.name"
                  autocomplete="new-password"
                  maxlength="75">
                <div :class="['invalid-feedback', { 'd-block': errorName }]">
                  Vui lòng nhập tên
                </div>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Số Điện Thoại </label><span class="error-sybol"></span>
              </div>
              <div class="w-full md:w-3/4 px-2">
                  <input
                  id="phone"
                  type="text"
                  class="form-control"
                  v-model="inputs.phone_number"
                  @keyup="integerOnly($event.target)"
                  autocomplete="new-password"
                  maxlength="20">
                <div :class="['invalid-feedback', { 'd-block': errorPhone }]">
                  Số điện thoại không đúng
                </div>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                  <label>Giới Tính</label><span class="error-sybol"></span>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <select class="form-control" v-model="inputs.gender">
                  <option v-for="option in optionsGender" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
                <div :class="['invalid-feedback', { 'd-block': errorGender }]">
                  Vui lòng chọn giới tính
                </div>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label>Ngày Tháng Năm Sinh</label><span class="error-sybol"></span>
              </div>
              <div class="w-full md:w-3/4 px-2">
                  <datepicker
                      v-model="inputs.birthday"
                      format="yyyy-MM-dd"
                      placeholder="yyyy-mm-dd"
                      input-class="form-control"
                      :typeable="true">
                  </datepicker>
                  <div :class="['invalid-feedback', { 'd-block': errorBirthday }]">
                    Vui lòng nhập ngày sinh
                  </div>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>Tỉnh/ Thành Phố</label><span class="error-sybol"></span>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <select
                    id="city_id"
                    v-model="inputs.city_id"
                    class="form-control"
                    @change="changeCity">
                  <option v-for="option in optionsCity" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
                <div class="invalid-feedback">
                  Vui lòng chọn thành phố
                </div>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>Quận/ Huyện</label><span class="error-sybol"></span>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <select
                    id="district_id"
                    v-model="inputs.district_id"
                    class="form-control"
                    :disabled="!inputs.city_id">
                  <option v-for="option in optionsDistrict" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
                <div class="invalid-feedback">
                  Vui lòng nhập quận
                </div>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label> Địa chỉ </label>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <input
                id="address"
                type="text"
                class="form-control"
                v-model="inputs.address"
                autocomplete="new-password"
                maxlength="255">
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label> Mã số thuế </label>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <input
                id="tax_code"
                type="text"
                class="form-control"
                v-model="inputs.tax_code"
                @keyup="integerOnly($event.target)"
                autocomplete="new-password"
                maxlength="20">
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useToast } from '@/composables/useToast'
import { useRoute, useRouter } from 'vue-router'
import customerApi from '@/api/customer'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import moment from 'moment'


export default {
  setup() {
    const { popToast } = useToast()
    const route = useRoute()
    const router = useRouter()
    return { popToast, route, router }
  },
  components: {
    Datepicker
  },
  data () {
    return {
      inputs: {
        "type": null,
        "name": null,
        "phone_number": null,
        "gender": null,
        "birthday": null,
        "city_id": null,
        "district_id": null,
        "address": null,
        "tax_code": null,
      },
      optionsGender: [
        {value: '1', text: 'Nam'},
        {value: '2', text: 'Nữ'},
        {value: '3', text: 'Khác'}
      ],
      optionsCity: [],
      optionsDistrict: [],
      click: false,
      phoneNumberCheckFlag: true,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    let customerId = this.route.params.id
    this.getCustomerDetail(customerId)

    this.getOptionCity()
  },
  computed: {
    errorName () {
      return this.checkInfo(this.inputs.name)
    },
    errorPhone () {
      return this.checkPhoneNumber(this.inputs.phone_number)
    },
    errorGender () {
      return this.checkInfo(this.inputs.gender)
    },
    errorBirthday () {
      return this.checkInfo(this.inputs.birthday)
    },
    errorCity () {
      return this.checkInfo(this.inputs.city_id)
    },
    errorDistrict () {
      return this.checkInfo(this.inputs.district_id)
    },
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkPhoneNumber (info) {
      return (this.click && (info == null || info.length <= 0 || !this.checkPhoneNumberFormat(info)))
    },
    checkValidate () {
      return !(this.errorName || this.errorPhone || this.errorGender || this.errorBirthday
        || this.errorCity || this.errorDistrict || !this.phoneNumberCheckFlag)
    },

    /**
     * Check phone number
     */
    checkPhoneNumberFormat(item) {
      let valueInput = item
      if (valueInput != null && valueInput != "") {
        if (!commonFunc.phoneNumberCheck(valueInput)) {
          return false
        }
      }
      return true
    },

    /**
     * Get city options
     */
    getOptionCity() {
      MasterApi.getCityOptions().then(res => {
        this.optionsCity = MasterMapper.mapCityModelToDto(res.data.data)
        this.changeCity()
      })
    },

    /**
     *  Get detail
     */
    getCustomerDetail(cusId) {
      if(cusId) {
        customerApi.getCustomerDetailByStore(cusId).then(res => {
          if(res != null && res.data != null && res.data.data != null){
            this.inputs = res.data.data
            if(this.inputs.birthday) {
               this.inputs.birthday = new Date(this.inputs.birthday)
            }
            this.getOptionCity()
          }
        }).catch(err => {
          // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
        })
      }
    },

    /**
     *  Save
     */
    save () {
      this.click = true

      let checkValidate = this.checkValidate()
      if(!checkValidate) {
        return
      }

      this.saving = true

      let customerId = this.route.params.id
      let params = JSON.parse(JSON.stringify(this.inputs))
      params.id = customerId
      params.phone = this.inputs.phone_number
      params.birthday = this.inputs.birthday ? moment(this.inputs.birthday).format('YYYY-MM-DD') : null
      if(customerId){
        // Edit

        customerApi.updateCustomerByStore(params).then(res => {
          this.saving = false
          if(res != null && res.data != null){
            if (res.data.status == 200) {
              // show popup success
              this.popToast('success', 'Cập nhật khách hàng thành công!!! ')
            }
          }
        }).catch(err => {
          this.saving = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('error', errorMess)
        })
      } else {
        // Add
        customerApi.addCustomerByStore(params).then(res => {
          this.saving = false
          if(res != null && res.data != null){

            if (res.data.status == 200) {
              this.router.push("/customer")
            }
          }
        }).catch(err => {
          this.saving =  false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('error', errorMess)
        })
      }

    },

    /**
     * Format date
     */
    formatBirthday() {
      let birthday = this.inputs.birthday
      let temp = birthday.split("-")
      if(temp.length == 1) {
        temp = birthday.split("/")
      }
      this.inputs.birthday = temp[2] + "-" + temp[1] + "-" + temp[0]
    },

    /**
     * Format date
     */
    formatDate(dateInput) {
      let result = dateInput
      if(dateInput) {
        let temp = dateInput.split("-")
        if(temp.length == 1) {
          temp = dateInput.split("/")
        }
        result = temp[2] + "-" + temp[1] + "-" + temp[0]
      }
      return result
    },

    /**
     * Only input integer
     */
     integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

    /**
     * Get district by city
     */
    changeCity() {
      let cityId = this.inputs.city_id
      if(cityId != "" && cityId != undefined) {
        MasterApi.getDistrictOptions(cityId).then(res => {
          this.optionsDistrict = MasterMapper.mapCityModelToDto(res.data.data)
        })
      } else {
        this.inputs.district_id = ""
      }

    },





    /**
     * Back to list
     */
    back() {
      // Go to list
      this.router.push("/customer")
    }
  }
}
</script>
