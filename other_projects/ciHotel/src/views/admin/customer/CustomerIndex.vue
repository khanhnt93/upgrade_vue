<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

            <b-row>
              <b-col cols="6">
                <b-button variant="secondary" class="pull-left px-4" @click="back">
                  Quay lại
                </b-button>
              </b-col>
              <b-col cols="6">
                <button class="btn btn-primary pull-right px-4 default-btn-bg" @click="save" :disabled="saving">
                  Lưu
                </button>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-2 text-center">Khách hàng</h4>
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
                    <input type="radio" v-model="inputs.type_id" name="type" value="personal" class="mt-2"><label class="ml-4 mt-1">Cá nhân</label>
                    <input type="radio" v-model="inputs.type_id" name="type" value="company" class="ml-5 mt-2"><label class="ml-4 mt-1">Công ty</label>
                  </div>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
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
                  <label> Số Điện Thoại </label><span class="error-sybol"></span>
                </b-col>
                <b-col md="9">
                  <input
                  id="phone"
                  type="text"
                  class="form-control"
                  v-model="inputs.phone_number"
                  @keyup="integerOnly($event.target)"
                  autocomplete="new-password"
                  maxlength="20"
                  v-on:change="checkPhoneNumberFormat($event.target.value)">
                  <b-form-invalid-feedback class="invalid-feedback" :state="!errorPhone">
                    Số điện thoại không đúng
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> EMail </label>
                </b-col>
                <b-col md="9">
                  <input
                    id="email"
                    type="text"
                    class="form-control"
                    v-model="inputs.email"
                    autocomplete="new-password"
                    maxlength="75">
<!--                  <b-form-invalid-feedback class="invalid-feedback" :state="!errorMail">-->
<!--                    Vui lòng nhập tên-->
<!--                  </b-form-invalid-feedback>-->
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label>Giới Tính</label><span class="error-sybol"></span>
                </b-col>
                <b-col md="9">
                  <b-form-select :options="optionsGender" v-model="inputs.gender"></b-form-select>
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorGender">
                    Vui lòng chọn giới tính
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

            <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label>Ngày Tháng Năm Sinh</label><span class="error-sybol"></span>
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
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorBirthday">
                      Vui lòng nhập ngày sinh
                    </b-form-invalid-feedback>
                    <b-form-invalid-feedback class="invalid-feedback" :state="birthdayCheckFlag">
                      Ngày sinh không đúng
                    </b-form-invalid-feedback>
                </b-col>
              </b-row>

            <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label>Tỉnh/ Thành Phố</label><span class="error-sybol"></span>
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
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorCity">
                      Vui lòng chọn thành phố
                    </b-form-invalid-feedback>
                </b-col>
              </b-row>

            <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label>Quận/ Huyện</label><span class="error-sybol"></span>
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
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorDistrict">
                      Vui lòng nhập quận
                    </b-form-invalid-feedback>
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
                <label> Mô tả </label>
              </b-col>
              <b-col md="9">
                <div class="form-inline">
                  <b-form-textarea
                    id="description"
                    style="width:100%;"
                    rows="3"
                    v-model="inputs.description"
                  ></b-form-textarea>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Hết Hạn Vào </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <input
                  id="expriedDate"
                  type="text"
                  class="form-control"
                  v-model="inputs.expired_at"
                  @keyup="inputDateOnly($event.target)"
                  @change="changeExpiredDate">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorExpiredAt">
                  Vui lòng nhập ngày hết hạn
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Hình ảnh </label>
              </b-col>
              <b-col md="9">
                <b-input-group @click="$refs.file.click()" append="Browse" class="pointer">
                  <b-input v-model="inputs.image"></b-input>
                </b-input-group>
                <input class="d-none" type="file" id="file" ref="file" accept="image/*" v-on:change="handleFileUpload"/>
              </b-col>
            </b-row>
            <b-row class="form-row">
              <div v-if="inputs.image_preview" class="preview-box text-center"  :style="{height: computedWidth, width: '100%'}">
                <vue-cropper
                  ref="cropper"
                  :guides="true"
                  :view-mode="2"
                  :center="true"
                  drag-mode="crop"
                  :auto-crop-area="1"
                  :background="true"
                  :rotatable="true"
                  :src="inputs.image_preview"
                  :initialAspectRatio="1/1"
                  :aspectRatio="1/1"
                  alt="Source Image"
                  :style="computedImg"
                  :crop="cropImage"
                >
                </vue-cropper>
              </div>
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
import VueCropper from 'vue-cropperjs'

export default {
  components: {
    VueCropper
  },
  data () {
    return {
      inputs: {
        // "type": null,
        "name": null,
        "phone_number": null,
        "gender": null,
        "birthday": null,
        "city_id": null,
        "district_id": null,
        "address": null,
        "description": null,
        "expired_at": null ,
        "email" : null,
        "type_id" : null,
        "image": null,
        image_preview: null

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
      saving: false,
      loading: false,
      file: null,
      height: '100px',
      styleImg: {},
    }
  },
  mounted() {
    this.getCustomerDetail()

    this.getOptionCity()

    // Get default date
    this.getDefaultDate()

  },
  computed: {
    computedWidth() {
      return this.height
    },
    computedImg() {
      return this.styleImg
    },
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
    errorExpiredAt: function () {
      return this.checkInfo(this.inputs.expired_at)
    }
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
        || this.errorCity || this.errorDistrict || !this.birthdayCheckFlag || !this.phoneNumberCheckFlag || !this.errorExpiredAt)
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
   * Make toast without title
   */
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      })
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
    getCustomerDetail() {
      let cusId = this.$route.params.id
      if(cusId) {
        customerApi.getCustomerDetailByStore(cusId).then(res => {
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
    },
    /**
     * Only input date
     */
    inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },

    /**
     * Change expired date
     */
    changeExpiredDate() {
      if(commonFunc.dateFormatCheck(this.inputs.expired_at)) {
        this.getTimeLive()
      }
    },

    /**
     * Get time live
     */
    getTimeLive() {
      let dateNow = new Date()
      let dayInMonth = new Date(dateNow.getFullYear(), (dateNow.getMonth() + 1), 0).getDate()

      let year = dateNow.getFullYear()
      let month = dateNow.getMonth() + 1
      let day = dateNow.getDate()

      let expiredDate = this.inputs.expired_at.split("-")
      let eYear = parseInt(expiredDate[2])
      let eMonth = parseInt(expiredDate[1])
      let eDay = parseInt(expiredDate[0])

      let minYear = parseInt(eYear) - parseInt(year)
      let minMon = eMonth - month
      if(minMon < 0) {
        minMon = 12 - parseInt(month) + parseInt(eMonth)
        minYear = minYear - 1
      }
      let minDay = eDay - day
      if(minDay < 0) {
        minDay = parseInt(dayInMonth) - parseInt(day) + parseInt(eDay)
        minMon = minMon - 1
      }
      this.timeLive = minYear + " năm " + minMon + " tháng " + minDay + " ngày"
    },
    /**
     * Handle upload file
     */
    handleFileUpload () { // event
      this.inputs.image_preview = null
      this.file = this.$refs.file.files[0]//event.target.files[0]
      this.inputs.image = this.file.name

      // Render image in review
      let reader  = new FileReader ()
      reader.addEventListener("load", function () {
        // this.$refs.cropper.image = reader.result
        this.inputs.image_preview = reader.result
      }.bind(this), false)
      if( this.file ){
        reader.readAsDataURL( this.file )
        this.height = '300px'
        this.styleImg = {'max-width': '100%', 'max-height': '100%'}
      }
    },
    /**
     * Event crop image
     */
    cropImage() {
      // Use to check reupload image when edit
    },

    /**
     * Get default date
     */
    getDefaultDate() {
      if(!this.$route.params.id) {
        let dateNow = new Date()
        let oneMonth = new Date(dateNow.setMonth(dateNow.getMonth() + 1))
        this.inputs.expired_at = commonFunc.formatDate(oneMonth.toJSON().slice(0,10))

        this.getTimeLive()
      }
    },

  }
}
</script>
