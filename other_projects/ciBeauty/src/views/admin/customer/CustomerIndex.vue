<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="card-body p-4"  >

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12">
                <button class="btn btn-outline-secondary pull-left px-4 btn-width-120" @click="back">
                  Quay lại
                </button>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 row form-row">
              <div class="col-span-12">
                <h4 class="mt-2 text-center text-header">Khách hàng</h4>
              </div>
            </div>
            <hr/>
            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <!-- <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-1">
                  <label> Loại khách hàng </label>
                </div>
                <div class="col-span-9">
                  <div class="input-group">
                    <input type="radio" v-model="inputs.type" name="type" value="personal" class="mt-1"><label class="ml-4 mt-1">Cá nhân</label>
                    <input type="radio" v-model="inputs.type" name="type" value="company" class="ml-5 mt-2"><label class="ml-4 mt-1">Công ty</label>
                  </div>
                </div>
              </div> -->

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-1">
                  <label>Tên <span class="error-sybol"></span></label>
                </div>
                <div class="col-span-9 mt-1">
                  <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model="inputs.name"
                  autocomplete="new-password"
                  maxlength="75">
                  <div class="invalid-feedback invalid-feedback" :state="!errorName">
                    Vui lòng nhập tên
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-1">
                  <label>Số Điện Thoại <span class="error-sybol"></span></label>
                </div>
                <div class="col-span-9 mt-1">
                  <input
                  id="phone"
                  type="text"
                  class="form-control"
                  v-model="inputs.phone_number"
                  autocomplete="new-password"
                  maxlength="20"
                  v-on:change="checkPhoneNumberFormat($event.target.value)">
                  <div class="invalid-feedback invalid-feedback" :state="!errorPhone">
                    Số điện thoại không đúng
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-1">
                  <label>Email</label>
                </div>
                <div class="col-span-9 mt-1">
                  <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model="inputs.email"
                  autocomplete="new-password"
                  v-on:change="checkEmailFormat($event.target)"
                  maxlength="225">
                  <div class="invalid-feedback invalid-feedback" :state="emailCheckFlag">
                    Email không hợp lệ
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-1">
                  <label>Giới Tính</label>
                </div>
                <div class="col-span-9 mt-1">
                  <select class="form-control" v-model="inputs.gender">
                    <option v-for="option in optionsGender" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                  <!--<div class="invalid-feedback invalid-feedback"   :state="!errorGender">-->
                    <!--Vui lòng chọn giới tính-->
                  <!--</div>-->
                </div>
              </div>

            <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-1">
                  <label>Ngày Tháng Năm Sinh</label>
                </div>
                <div class="col-span-9 mt-1">
                  <input
                      id="birthday"
                      v-model="inputs.birthday"
                      type="text"
                      placeholder="dd-mm-yyyy"
                      autocomplete="new-password"
                      class="form-control"
                      v-on:change="checkBirthdayFormat($event.target)">
                    <!--<div class="invalid-feedback invalid-feedback"   :state="!errorBirthday">-->
                      <!--Vui lòng nhập ngày sinh-->
                    <!--</div>-->
                    <div class="invalid-feedback invalid-feedback" :state="birthdayCheckFlag">
                      Ngày sinh không đúng
                    </div>
                </div>
              </div>

            <!-- <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-1">
                  <label>Tỉnh/ Thành Phố</label>
                </div>
                <div class="col-span-9">
                  <select class="form-control form-control"
           id="city_id"
           v-model="inputs.city_id"
           type="text"
           
           v-on:change="changeCity($event.target)"
          >
                    <option v-for="option in optionsCity" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                </div>
              </div>

            <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-1">
                  <label>Quận/ Huyện</label>
                </div>
                <div class="col-span-9">
                  <select class="form-control form-control"
           id="district_id"
           v-model="inputs.district_id"
           type="text"
           
           :disabled="!inputs.city_id"
          >
                    <option v-for="option in optionsDistrict" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                </div>
              </div> -->

            <div class="grid grid-cols-12 gap-4 row form-row">
              <div class="col-span-3 mt-1">
                <label>Quốc tịch</label>
              </div>
              <div class="col-span-9 mt-1">
                <input
                id="national_code"
                type="text"
                class="form-control"
                v-model="inputs.national_code"
                autocomplete="new-password"
                maxlength="255">
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 row form-row">
              <div class="col-span-3 mt-1">
                <label>Địa chỉ</label>
              </div>
              <div class="col-span-9 mt-1">
                <input
                id="address"
                type="text"
                class="form-control"
                v-model="inputs.address"
                autocomplete="new-password"
                maxlength="255">
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 row form-row">
              <div class="col-span-3 mt-1">
                <label>Nghề nghiệp</label>
              </div>
              <div class="col-span-9 mt-1">
                <input
                id="industry"
                type="text"
                class="form-control"
                v-model="inputs.industry"
                autocomplete="new-password"
                maxlength="255">
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 row form-row">
              <div class="col-span-3 mt-1">
                <label>Mã số thuế</label>
              </div>
              <div class="col-span-9 mt-1">
                <input
                id="mst"
                type="text"
                class="form-control"
                v-model="inputs.mst"
                @keyup="integerOnly($event.target)"
                autocomplete="new-password"
                maxlength="20">
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12 text-center mt-2">
                <button class="btn btn-outline-success px-4 btn-width-120" @click="save" :disabled="saving">
                  Lưu
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>


import customerApi from '@/api/customer'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      inputs: {
        "type": 'personal',
        "name": null,
        "phone_number": null,
        "email": null,
        "gender": null,
        "birthday": null,
        "city_id": null,
        "district_id": null,
        "address": null,
        "national_code": null,
        "industry": null,
        "mst": null,
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
      birthdayCheckFlag: true,
      emailCheckFlag: true,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    this.getCustomerDetail()

    // this.getOptionCity()
  },
  computed: {
    errorName () {
      return this.checkInfo(this.inputs.name)
    },
    errorPhone () {
      return this.checkPhoneNumber(this.inputs.phone_number)
    },
    // errorGender () {
    //   return this.checkInfo(this.inputs.gender)
    // },
    // errorBirthday () {
    //   return this.checkInfo(this.inputs.birthday)
    // },
    // errorCity () {
    //   return this.checkInfo(this.inputs.city_id)
    // },
    // errorDistrict () {
    //   return this.checkInfo(this.inputs.district_id)
    // },
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkPhoneNumber (info) {
      return (this.click && (info == null || info.length <= 0 || !this.checkPhoneNumberFormat(info)))
    },
    checkValidate () {
      return !(this.errorName || this.errorPhone || !this.phoneNumberCheckFlag || !this.emailCheckFlag)
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
     * Check phone number
     */
    checkEmailFormat(item) {
      let valueInput = item.value
      if (valueInput) {
        if (commonFunc.emailCheck(valueInput)) {
          this.emailCheckFlag = true
        } else {
          this.emailCheckFlag = false
        }
      } else {
        this.emailCheckFlag = true
      }
    },

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

    // /**
    //  * Get city options
    //  */
    // getOptionCity() {
    //   MasterApi.getCityOptions().then(res => {
    //     this.optionsCity = MasterMapper.mapCityModelToDto(res.data.data)
    //     this.changeCity()
    //   })
    // },

    /**
     *  Get detail
     */
    getCustomerDetail() {
      let cusId = this.$route.params.id
      if(cusId) {
        customerApi.getCustomerDetailByStore(cusId).then(res => {
          if(res != null && res.data != null && res.data.data != null){
            this.inputs = res.data.data
          }
        }).catch(err => {
          console.log(err)
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

      let customerId = this.$route.params.id
      let params = JSON.parse(JSON.stringify(this.inputs))
      params.id = customerId
      params.phone = this.inputs.phone_number
      params.birthday = this.formatDate(this.inputs.birthday)
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
          this.popToast('danger', errorMess)
        })
      } else {
        // Add
        customerApi.addCustomerByStore(params).then(res => {
          this.saving = false
          if(res != null && res.data != null){

            if (res.data.status == 200) {
              this.$router.push("/customer/list")
            }
          }
        }).catch(err => {
          this.saving = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
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

    // /**
    //  * Get district by city
    //  */
    // changeCity() {
    //   let cityId = this.inputs.city_id
    //   if(cityId != "" && cityId != undefined) {
    //     MasterApi.getDistrictOptions(cityId).then(res => {
    //       this.optionsDistrict = MasterMapper.mapCityModelToDto(res.data.data)
    //     })
    //   } else {
    //     this.inputs.district_id = null
    //   }

    // },

    /**
     * Check phone number
     */
    checkBirthdayFormat(item) {
      let valueInput = item.value
      if (valueInput != null && valueInput != "") {
        if (commonFunc.dateFormatCheck(valueInput)) {
          this.birthdayCheckFlag = true
        } else {
          this.birthdayCheckFlag = false
        }
      } else {
        this.birthdayCheckFlag = true
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push("/customer/list")
    }
  }
}
</script>
