<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">
            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-2 text-center">Hotel</h4>
              </b-col>
            </b-row>
            <hr/>
            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Tên </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model="hotel.name"
                  maxlength="100">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorName">
                  Vui lòng nhập tên
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Thương hiệu </label>
              </b-col>
              <b-col md="9">
                <b-form-select
                  :options="optionsBrand"
                  id="brand_id"
                  type="text"
                  class="form-control"
                  v-model="hotel.brand_id"
                ></b-form-select>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Tỉnh/ Thành Phố </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <b-form-select
                  :options="optionsCity"
                  id="city_id"
                  type="text"
                  class="form-control"
                  v-model="hotel.city_id"
                  v-on:change="changeCity($event.target)"></b-form-select>
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorCiti">
                  Vui lòng nhập tỉnh/thành phố
                </b-form-invalid-feedback>
              </b-col>
            </b-row>
            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Quận </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <b-form-select
                  v-bind="{ disabled: hotel.city_id=='' }"
                  :options="optionsDistrict"
                  id="district"
                  type="text"
                  class="form-control"
                  v-model="hotel.district_id"
                ></b-form-select>
                <b-form-invalid-feedback class="invalid-feedback" :state="!errorDistrict">
                  Vui lòng nhập quận
                </b-form-invalid-feedback>
              </b-col>
            </b-row>
            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Địa Chỉ </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <input
                  id="address"
                  type="text"
                  class="form-control"
                  v-model="hotel.address">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorAddress">
                  Vui lòng nhập địa chỉ
                </b-form-invalid-feedback>
              </b-col>
            </b-row>
            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Số điện thoại </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <input
                  id="phone_number"
                  type="text"
                  class="form-control"
                  v-model="hotel.phone_number"
                  maxlength="20">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorPhoneNumber">
                  Vui lòng nhập số điện thoại
                </b-form-invalid-feedback>
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
                  v-model="hotel.expired_at"
                  @keyup="inputDateOnly($event.target)"
                  @change="changeExpiredDate">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorExpiredAt">
                  Vui lòng nhập ngày hết hạn
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Thời hạn </label>
              </b-col>
              <b-col md="9">
                <p>{{timeLive}}</p>
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
                  v-model="hotel.email"
                  autocomplete="new-password"
                  maxlength="75">
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
                    v-model="hotel.description"
                  ></b-form-textarea>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Loại khách hàng </label>
              </b-col>
              <b-col md="9">
                <b-form-select
                  :options="optionsType"
                  id="brand_id"
                  type="text"
                  class="form-control"
                  v-model="hotel.type_id"
                ></b-form-select>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Hình ảnh </label>
              </b-col>
              <b-col md="9">
                <b-input-group @click="$refs.file.click()" append="Browse" class="pointer">
                  <b-input v-model="hotel.image"></b-input>
                </b-input-group>
                <input class="d-none" type="file" id="file" ref="file" accept="image/*" v-on:change="handleFileUpload"/>
              </b-col>
            </b-row>
            <b-row class="form-row">
              <div v-if="hotel.image_preview" class="preview-box text-center"  :style="{height: computedWidth, width: '100%'}">
                <vue-cropper
                  ref="cropper"
                  :guides="true"
                  :view-mode="2"
                  :center="true"
                  drag-mode="crop"
                  :auto-crop-area="1"
                  :background="true"
                  :rotatable="true"
                  :src="hotel.image_preview"
                  :initialAspectRatio="1/1"
                  :aspectRatio="1/1"
                  alt="Source Image"
                  :style="computedImg"
                  :crop="cropImage"
                >
                </vue-cropper>
              </div>
            </b-row>
            <b-row class="mt-3">
              <b-col cols="6">
                <b-button variant="secondary" class="pull-left px-4" @click="back">
                  Quay lại
                </b-button>
              </b-col>
              <b-col cols="6">
                <button class="btn btn-primary pull-left px-4 default-btn-bg" :disabled="saving" @click="save" >
                  Lưu
                </button>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
  import superAdminAPI from '@/api/superAdmin'
  import Mapper from '@/mapper/store'
  import commonFunc from '@/common/commonFunc'
  import MasterApi from '@/api/master'
  import MasterMapper from '@/mapper/master'
  import VueCropper from "vue-cropperjs";


  export default {
    components: {
      VueCropper
    },
    data () {
      return {
        optionsBrand: [],
        optionsType: [],
        optionsCity: [],
        optionsDistrict: [],
        hotel: {
          "name": '',
          "brand_id": null,
          "address": '',
          "phone_number": '',
          "city_id": '',
          "district_id": '',
          "expired_at": '',
          "email" : null,
          "type_id" : null,
          "image": null,
          "description": null,
          image_preview: null
        },
        saving: false,
        timeLive: 0,
        file: null,
        height: '100px',
        styleImg: {},
        click: false,
      }
    },
    mounted() {
      // Get brand options
      this.getOptionBrand()
      // Get type options
      this.getOptionType()

      // Get default date
      this.getDefaultDate()

      this.getHotelDetail()
    },
    computed: {
      computedWidth() {
        return this.height
      },
      computedImg() {
        return this.styleImg
      },
      errorName: function () {
        return this.checkInfo(this.hotel.name)
      },
      errorCiti: function () {
        return this.checkInfo(this.hotel.city_id)
      },
      errorDistrict: function () {
        return this.checkInfo(this.hotel.district_id)
      },
      errorAddress: function () {
        return this.checkInfo(this.hotel.address)
      },
      errorPhoneNumber: function () {
        return this.checkInfo(this.hotel.phone_number)
      },
      errorExpiredAt: function () {
        return this.checkInfo(this.hotel.expired_at)
      }
    },
    methods: {
      checkInfo (info) {
        return (this.click && (info == null || info.length <= 0))
      },
      checkValidate () {
        return !(this.errorName || this.errorCiti || this.errorDistrict || this.errorAddress || this.errorPhoneNumber || this.errorExpiredAt)
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
       * Get time live
       */
      getTimeLive() {
        let dateNow = new Date()
        let dayInMonth = new Date(dateNow.getFullYear(), (dateNow.getMonth() + 1), 0).getDate()

        let year = dateNow.getFullYear()
        let month = dateNow.getMonth() + 1
        let day = dateNow.getDate()

        let expiredDate = this.hotel.expired_at.split("-")
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
       * Get default date
       */
      getDefaultDate() {
        if(!this.$route.params.id) {
          let dateNow = new Date()
          let oneMonth = new Date(dateNow.setMonth(dateNow.getMonth() + 1))
          this.hotel.expired_at = commonFunc.formatDate(oneMonth.toJSON().slice(0,10))

          this.getTimeLive()
        }
      },

      /**
       * Get detail
       */
      getHotelDetail() {
        let hotelId = this.$route.params.id
        if(hotelId){
          this.loading = true
          superAdminAPI.getHotelDetail(hotelId).then(res => {
            if(res != null && res.data != null && res.data.data != null) {
              this.hotel = res.data.data // Mapper.mapStoreDetailModelToDto(res.data.data)
              this.hotel.expired_at = commonFunc.formatDate(res.data.data.expired_at)
              this.file = this.hotel.image_preview
              this.height = '300px'
              this.styleImg = {'max-width': '100%', 'max-height': '100%'}
              this.getTimeLive()
              this.getOptionCity()
            }
            this.loading = false
          }).catch(err => {
            console.log(err)
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        } else {
          this.getOptionCity()
        }
      },

      /**
       * Save
       */
      save () {
        this.saving = true
        this.click = true
        let result = this.checkValidate()
        if(!result) {
          this.saving = false
          return
        }
        if(result) {
          // Format date
          if(this.hotel.image_preview) {
            this.$refs.cropper
              .getCroppedCanvas({
                width: 300,
                height: 300
              })
              .toBlob(blob => {
                const formData = new FormData();
                formData.append("name", this.hotel.name)
                formData.append("file", blob, this.hotel.image)
                formData.append("brand_id", this.hotel.brand_id)
                formData.append("district_id", this.hotel.district_id)
                formData.append("address", this.hotel.address)
                formData.append("phone_number", this.hotel.phone_number)
                formData.append("city_id", this.hotel.city_id)
                formData.append("expired_at",commonFunc.convertDDMMYYYYToYYYYMMDD(this.hotel.expired_at))
                formData.append("email", this.hotel.email)
                formData.append("type_id", this.hotel.type_id)
                formData.append("description", this.hotel.description)
                this.doSave(formData);
              });
          } else {
            const formData = new FormData();
            formData.append("file", null)
            formData.append("name", this.hotel.name)
            formData.append("district_id", this.hotel.district_id)
            formData.append("brand_id", this.hotel.brand_id)
            formData.append("address", this.hotel.address)
            formData.append("phone_number", this.hotel.phone_number)
            formData.append("city_id", this.hotel.city_id)
            formData.append("expired_at", commonFunc.convertDDMMYYYYToYYYYMMDD(this.hotel.expired_at))
            formData.append("email", this.hotel.email)
            formData.append("type_id", this.hotel.type_id)
            formData.append("description", this.hotel.description)
            this.doSave(formData);
          }
          let hotelId = this.$route.params.id
        }
        // else {
        //   this.saving = false
        // }

      },
      doSave(formData) {

        this.saving = true
        let hotelId = this.$route.params.id
        if(hotelId){
          // Edit
          formData.append("id", hotelId)

          superAdminAPI.editHotel(formData).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              // Show notify edit success
              this.popToast('success', 'Lưu menu thành công!!! ')
            }else{
              // Show notify edit fail
              this.popToast('danger', 'Lưu thất bại!!! ')
            }
          }).catch(err => {
            this.saving = false

            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        } else {
          // Add
          superAdminAPI.addHotel(formData).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              // Go to list
              this.$router.push("/hotel/list")
            }else{
              // Show notify add fail
              this.popToast('danger', 'Lưu thất bại!!! ')
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
       * Only input date
       */
      inputDateOnly(item) {
        let valueInput = item.value
        let result = commonFunc.inputDateOnly(valueInput)
        item.value = result
      },

      /**
       * Get brand options
       */
      getOptionBrand() {
        superAdminAPI.getBrandOption().then(res => {
          this.optionsBrand = [{"value": null, "text": ""}]
          if(res && res.data && res.data.data) {
            let brands = res.data.data
            for (var index in brands) {
              let brand = {
                value: brands[index].value,
                text: brands[index].text
              }
              this.optionsBrand.push(brand)
            }
          }

        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      },
      /**
       * Get brand options
       */
      getOptionType() {
        superAdminAPI.getOptionType().then(res => {

          this.getOptionType = [{"value": null, "text": ""}]
          if(res && res.data && res.data.data) {
            let types = res.data.data
            for (var index in types) {

              let type = {
                value: types[index].value,
                text: types[index].text
              }
              // console.log(type);
              this.optionsType.push(type)
            }
          }

        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      },

      /**
       * Get city options
       */
      getOptionCity() {
        MasterApi.getCityOptions().then(res => {
          this.optionsCity = MasterMapper.mapCityModelToDto(res.data.data)
          this.changeCity()
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      },

      /**
       * Get district by city
       */
      changeCity() {
        let cityId = this.hotel.city_id
        // console.log(cityId)
        if(cityId != "" && cityId != undefined) {
          MasterApi.getDistrictOptions(cityId).then(res => {
            // console.log(res.data.data)
            this.optionsDistrict = MasterMapper.mapCityModelToDto(res.data.data)
          })
        } else {
          this.hotel.district_id = ""
        }
      },

      /**
       * Change expired date
       */
      changeExpiredDate() {
        if(commonFunc.dateFormatCheck(this.hotel.expired_at)) {
          this.getTimeLive()
        }
      },
      /**
       * Handle upload file
       */
      handleFileUpload () { // event
        this.hotel.image_preview = null
        this.file = this.$refs.file.files[0]//event.target.files[0]
        console.log( this.hotel.image)
        this.hotel.image = this.file.name

        // Render image in review
        let reader  = new FileReader ()
        reader.addEventListener("load", function () {
          // this.$refs.cropper.image = reader.result
          this.hotel.image_preview = reader.result
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
          this.hotel.expired_at = commonFunc.formatDate(oneMonth.toJSON().slice(0,10))

          this.getTimeLive()
        }
      },

      /**
       * Back to list
       */
      back() {
        // Go to list
        this.$router.push("/hotel/list")
      }
    }
  }
</script>
