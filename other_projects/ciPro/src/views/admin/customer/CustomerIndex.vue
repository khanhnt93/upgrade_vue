<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

            <b-row>
              <b-col cols="12">
                <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="back">
                  Quay lại
                </b-button>

                <b-button variant="outline-success" class="pull-right btn-width-120" @click="save" :disabled="saving">
                  Lưu
                </b-button>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-2 text-center text-header">{{prefix_title}} Khách Hàng</h4>
              </b-col>
            </b-row>
            <hr/>
            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Loại khách hàng </label>
                </b-col>
                <b-col md="9">
                  <div class="input-group">
                    <input type="radio" v-model="inputs.type" name="type" value="0" class="mt-2">
                    <label class="ml-4 mt-1">Cá nhân</label>
                    <input type="radio" v-model="inputs.type" name="type" value="1" class="ml-5 mt-2">
                    <label class="ml-4 mt-1">Công ty</label>
                  </div>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Tên<span class="error-sybol"></span></label>
                </b-col>
                <b-col md="9">
                  <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model="inputs.name"
                  autocomplete="new-password"
                  maxlength="75">
                  <b-form-invalid-feedback class="invalid-feedback" :state="!errorName">
                    Vui lòng nhập tên
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

            <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Mã khách hàng </label><span class="error-sybol"></span>
                </b-col>
                <b-col md="9">
                  <input
                  id="code"
                  type="text"
                  class="form-control"
                  v-model="inputs.code"
                  @keyup="integerOnly($event.target)"
                  autocomplete="new-password"
                  maxlength="20"
                  placeholder="Số điện thoại hoặc mã số thuế">
                  <b-form-invalid-feedback class="invalid-feedback" :state="!errorCode">
                    Vui lòng nhập mã khách hàng
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Số Điện Thoại </label>
                </b-col>
                <b-col md="9">
                  <input
                  id="phone"
                  type="text"
                  class="form-control"
                  v-model="inputs.phone_number"
                  @keyup="integerOnly($event.target)"
                  autocomplete="new-password"
                  maxlength="15"
                  v-on:change="checkPhoneNumberFormat($event.target.value)">
                  <b-form-invalid-feedback class="invalid-feedback" :state="!errorPhone">
                    Số điện thoại không đúng
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

            <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Email </label>
                </b-col>
                <b-col md="9">
                  <input
                  id="email"
                  type="text"
                  class="form-control"
                  v-model="inputs.email"
                  autocomplete="new-password"
                  maxlength="255">
                  <b-form-invalid-feedback class="invalid-feedback" :state="!errorEmail">
                    Email không đúng định dạng
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Mã số thuế <span v-show="inputs.type == 1" class="error-sybol"></span></label>
              </b-col>
              <b-col md="9">
                <input
                id="tax_code"
                type="text"
                class="form-control"
                v-model="inputs.tax_code"
                @keyup="integerOnly($event.target)"
                autocomplete="new-password"
                maxlength="20">
                <b-form-invalid-feedback class="invalid-feedback" :state="!errorTaxCode">
                  Vui lòng nhập mã số thuế
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row" v-show="inputs.type == 1">
              <b-col md="3" class="mt-2">
                <label>Phân loại</label>
              </b-col>
              <b-col md="9">
                <b-form-select :options="optionsCompanyType" v-model="inputs.company_type"></b-form-select>
              </b-col>
            </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label>Giới Tính</label>
                </b-col>
                <b-col md="9">
                  <b-form-select :options="optionsGender" v-model="inputs.gender"></b-form-select>
                </b-col>
              </b-row>

            <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label>Ngày Tháng Năm Sinh</label>
                </b-col>
                <b-col md="9">
                  <input
                      id="birthday"
                      v-model="inputs.birthday"
                      type="text"
                      placeholder="dd-mm-yyyy"
                      autocomplete="new-password"
                      class="form-control"
                      v-on:change="checkBirthdayFormat($event.target)">
                    <b-form-invalid-feedback class="invalid-feedback" :state="birthdayCheckFlag">
                      Ngày sinh không đúng
                    </b-form-invalid-feedback>
                </b-col>
              </b-row>

            <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label>Tỉnh/ Thành Phố</label>
                </b-col>
                <b-col md="9">
                  <b-form-select
                      id="city_id"
                      :options="optionsCity"
                      v-model="inputs.city_id"
                      type="text"
                      class="form-control"
                      v-on:change="changeCity($event.target)"
                    ></b-form-select>
                </b-col>
              </b-row>

            <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label>Quận/ Huyện</label>
                </b-col>
                <b-col md="9">
                  <b-form-select
                      id="district_id"
                      :options="optionsDistrict"
                      v-model="inputs.district_id"
                      type="text"
                      class="form-control"
                      :disabled="!inputs.city_id"
                    ></b-form-select>
                </b-col>
              </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Địa chỉ </label>
              </b-col>
              <b-col md="9">
                <input
                id="address"
                type="text"
                class="form-control"
                v-model="inputs.address"
                autocomplete="new-password"
                maxlength="255">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>
                  <span>Tên người liên hệ</span>
                </label>
              </b-col>
              <b-col md="9">
                <input
                  id="contact_person"
                  type="text"
                  maxlength="100"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.contact_person_name">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>
                  <span>Sđt người liên hệ</span>
                </label>
              </b-col>
              <b-col md="9">
                <input
                  id="contact_person_phone"
                  type="text"
                  maxlength="14"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.contact_person_phone"
                  @keyup="integerOnly($event.target)">
                <b-form-invalid-feedback class="invalid-feedback" :state="!errorContactPersonPhone">
                    Số điện thoại không đúng
                  </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Email người liên hệ </label>
                </b-col>
                <b-col md="9">
                  <input
                  id="contact_person_email"
                  type="text"
                  class="form-control"
                  v-model="inputs.contact_person_email"
                  autocomplete="new-password"
                  maxlength="255">
                  <b-form-invalid-feedback class="invalid-feedback" :state="!errorEmail">
                    Email không đúng định dạng
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

            <b-row class="form-row" v-show="userRole == 'admin'">
              <b-col md="3" class="mt-2">
                <label> Nhân viên phụ trách </label>
              </b-col>
              <b-col md="9">
                <b-form-select
                  id="created_by"
                  :options="optionsStaff"
                  v-model="inputs.created_by"
                  type="text"
                  class="form-control"
                ></b-form-select>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
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
      prefix_title: "Thêm Mới",
      inputs: {
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
      },
      optionsGender: [
        {value: '1', text: 'Nam'},
        {value: '2', text: 'Nữ'},
        {value: '3', text: 'Khác'}
      ],
      optionsCompanyType: [
        {value: null, text: ''},
        {value: 1, text: 'Thương mại'},
        {value: 2, text: 'Nhà máy'},
        {value: 3, text: 'Công trình'}
      ],
      optionsCity: [],
      optionsDistrict: [],
      optionsStaff: [],
      click: false,
      phoneNumberCheckFlag: true,
      birthdayCheckFlag: true,
      saving: false,
      loading: false,
      userRole: "staff"
    }
  },
  mounted() {
    // Check prefix
    if(this.$route.params.id) {
      this.prefix_title = "Cập Nhật"
    } else {
      this.prefix_title = "Thêm Mới"
    }

    // UI by staff
    let url = location.href
    if(url.includes("customer-sale")) {
      this.userRole = "staff"
    } else {
        this.userRole = "admin"
    }

    this.getCustomerDetail()

    this.getOptionCity()

    this.getOptionStaff()
  },
  computed: {
    errorName () {
      return this.checkInfo(this.inputs.name)
    },
    errorPhone () {
      return this.checkPhoneNumber(this.inputs.phone_number)
    },
    errorEmail () {
      return this.checkEmail(this.inputs.email)
    },
    errorContactPersonPhone () {
      return this.checkPhoneNumber(this.inputs.contact_person_phone)
    },
    errorCode () {
      return this.checkInfo(this.inputs.code)
    },
    errorTaxCode () {
      return this.checkTaxCode(this.inputs.tax_code, this.inputs.type)
    },
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkPhoneNumber (info) {
      return (this.click && !this.checkPhoneNumberFormat(info))
    },
    checkTaxCode (tax_code, type) {
      return (this.click && (type == 1 && (tax_code == null || tax_code.length <= 0)))
    },
    checkEmail (info) {
      return (this.click && !this.checkEmailFormat(info))
    },
    checkValidate () {
      return !(this.errorName || this.errorCode || this.errorTaxCode || this.errorPhone
          || this.errorEmail || this.errorContactPersonPhone
          || !this.birthdayCheckFlag || !this.phoneNumberCheckFlag)
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
     * Check email
     */
    checkEmailFormat(item) {
      let valueInput = item
      if (valueInput != null && valueInput != "") {
        if (!commonFunc.emailCheck(valueInput)) {
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
     * Get staff options
     */
    getOptionStaff() {
        if(this.userRole == "staff") {
            return
        }

      customerApi.getStaffOptions().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.optionsStaff = [{value: null, text: ''}]

          var staffs = res.data.data
          if(staffs) {
            for (let i in staffs) {
              this.optionsStaff.push(staffs[i])
            }
          }
        }
      })
    },

    /**
     *  Get detail
     */
    getCustomerDetail() {
      let cusId = this.$route.params.id
      if(cusId) {
        customerApi.getCustomerDetailByStore(cusId, this.userRole).then(res => {
          if(res != null && res.data != null && res.data.data != null){
            this.inputs = res.data.data
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
                if(this.userRole == "staff") {
                  this.$router.push("/customer-sale")
                } else {
                  this.$router.push("/customer")
                }

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
        this.inputs.district_id = null
      }

    },

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
        if(this.userRole == "admin") {
            this.$router.push("/customer")
        } else {
            this.$router.push("/customer-sale")
        }

    }
  }
}
</script>
