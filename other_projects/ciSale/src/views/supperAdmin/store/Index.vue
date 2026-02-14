<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="p-4">
              <div class="form-row">
                <div md='12'>
                  <h4 class="mt-2 text-center">Store</h4>
                </div>
              </div>
              <hr/>
              <div class="form-row">
                <div md="3" class="mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-9 px-2">
                  <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model="store.name"
                  maxlength="100">
                  <div :class="{'invalid-feedback d-block': errorName}">
                    Vui lòng nhập tên
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div md="3" class="mt-2">
                  <label> Thương hiệu </label>
                </div>
                <div class="w-full md:w-9 px-2">
                  <select
                  :options="optionsBrand"
                  id="brand_id"
                  type="text"
                  class="form-control"
                  v-model="store.brand_id"
                  ></select>
                </div>
              </div>

              <div class="form-row">
                <div md="3" class="mt-2">
                  <label> Tỉnh/ Thành Phố </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-9 px-2">
                  <select
                  :options="optionsCity"
                  id="city_id"
                  type="text"
                  class="form-control"
                  v-model="store.city_id"
                  v-on:change="changeCity($event.target)"></select>
                  <div :class="{'invalid-feedback d-block': errorCiti}">
                    Vui lòng nhập tỉnh/thành phố
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div md="3" class="mt-2">
                  <label> Quận </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-9 px-2">
                  <select
                    v-bind="{ disabled: store.city_id=='' }"
                    :options="optionsDistrict"
                    id="district"
                    type="text"
                    class="form-control"
                    v-model="store.district_id"
                    ></select>
                  <div :class="{'invalid-feedback d-block': errorDistrict}">
                    Vui lòng nhập quận
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div md="3" class="mt-2">
                  <label> Địa Chỉ </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-9 px-2">
                  <input
                  id="address"
                  type="text"
                  class="form-control"
                  v-model="store.address">
                  <div :class="{'invalid-feedback d-block': errorAddress}">
                    Vui lòng nhập địa chỉ
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div md="3" class="mt-2">
                  <label> Số điện thoại </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-9 px-2">
                  <input
                  id="phone_number"
                  type="text"
                  class="form-control"
                  v-model="store.phone_number"
                  maxlength="20">
                  <div :class="{'invalid-feedback d-block': errorPhoneNumber}">
                    Vui lòng nhập số điện thoại
                  </div>
                </div>
              </div>

            <div class="form-row">
              <div md="3" class="mt-2">
                <label> Mã số thuế </label>
              </div>
              <div class="w-full md:w-9 px-2">
                <input
                  id="tax_code"
                  type="text"
                  class="form-control"
                  v-model="store.tax_code"
                  @keyup="integerOnly($event.target)"
                  autocomplete="new-password"
                  maxlength="20">
              </div>
            </div>

              <div class="form-row">
                <div md="3" class="mt-2">
                  <label> Hết Hạn Vào </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-9 px-2">
                  <input
                  id="expriedDate"
                  type="text"
                  class="form-control"
                  v-model="store.expired_at"
                  @keyup="inputDateOnly($event.target)"
                  @change="changeExpiredDate">
                  <div :class="{'invalid-feedback d-block': errorExpiredAt}">
                    Vui lòng nhập ngày hết hạn
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div md="3" class="mt-2">
                  <label> Thời hạn </label>
                </div>
                <div class="w-full md:w-9 px-2">
                  <p>{{timeLive}}</p>
                </div>
              </div>

              <div class="mt-3">
                <div cols="6">
                  <button class="btn btn-secondary pull-left px-4" @click="back">
                    Quay lại
                  </button>
                </div>
                <div cols="6">
                  <button class="btn btn-primary pull-left px-4 default-btn-bg" :disabled="saving" @click="save" >
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
import superAdminAPI from '@/api/superAdmin'
import commonFunc from '@/common/commonFunc'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import { useToast } from 'vue-toastification'


export default {
  data () {
    return {
      optionsBrand: [],
      optionsCity: [],
      optionsDistrict: [],
      store: {
        "name": '',
        "brand_id": null,
        "address": '',
        "tax_code": '',
        "phone_number": '',
        "city_id": '',
        "district_id": '',
        "expired_at": ''
      },
      saving: false,
      timeLive: 0
    }
  },
  mounted() {
    // Get brand options
    this.getOptionBrand()

    this.toast = useToast()

    // Get default date
    this.getDefaultDate()

    this.getStoreDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.store.name)
    },
    errorCiti: function () {
      return this.checkInfo(this.store.city_id)
    },
    errorDistrict: function () {
      return this.checkInfo(this.store.district_id)
    },
    errorAddress: function () {
      return this.checkInfo(this.store.address)
    },
    errorPhoneNumber: function () {
      return this.checkInfo(this.store.phone_number)
    },
    errorExpiredAt: function () {
      return this.checkInfo(this.store.expired_at)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.saving && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorName || this.errorCiti || this.errorDistrict || this.errorAddress || this.errorPhoneNumber || this.errorExpiredAt)
    },

    /**
   * Make toast without title
   */
  popToast(variant, content) {
      this.toast(content, variant === 'danger' ? 'error' : variant)
    this.toast(content, variant === 'danger' ? 'error' : variant)
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

      let expiredDate = this.store.expired_at.split("-")
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
      if(!this.route.params.id) {
        let dateNow = new Date()
        let oneMonth = new Date(dateNow.setMonth(dateNow.getMonth() + 1))
        this.store.expired_at = commonFunc.formatDate(oneMonth.toJSON().slice(0,10))

        this.getTimeLive()
      }
    },

    /**
     * Get detail
     */
    getStoreDetail() {
      let storeId = this.route.params.id
      if(storeId){
        superAdminAPI.getStoreDetail(storeId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.store = res.data.data
            // this.getTimeLive()
            this.getOptionCity()
          }
        }).catch(err => {
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

      let result = this.checkValidate()
      if(result) {
        this.saving = true

        // Format date
        let store = JSON.parse(JSON.stringify(this.store))
        store.expired_at = commonFunc.convertDDMMYYYYToYYYYMMDD(this.store.expired_at)

        let storeId = this.route.params.id
        if(storeId){
          // Edit
          store.id = storeId
         console.log(store)
          superAdminAPI.editStore(store).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              let message = ""
              if (res.data.status == 200) {
                // show popup success
                this.toast.success("Cập nhật thành công")
                this.router.push("/store/list")
              }
            }
          }).catch(err => {
            this.saving = false
            // Show notify edit fail: TODO
            let message = ""
            if(err.response.data.status == 422) {
              message = err.response.data.mess
            } else {
              message = "Lỗi hệ thống"
            }
            this.toast.error(message)
          })
        } else {
          // Add
          superAdminAPI.addStore(store).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              let message = ""
              if (res.data.status == 200) {
                // show popup success
                this.toast.success("Thêm thành công")
                this.router.push("/store/list")
              }

            }
          }).catch(err => {
            this.saving = false
            let message = ""
              if(err.response.data.status == 422) {
                message = err.response.data.mess
              } else {
                message = "Lỗi hệ thống"
              }
              this.toast.error(message)
          })
        }
      }
      // else {
      //   this.saving = false
      // }

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
      let cityId = this.store.city_id
      // console.log(cityId)
      if(cityId != "" && cityId != undefined) {
        MasterApi.getDistrictOptions(cityId).then(res => {
          // console.log(res.data.data)
          this.optionsDistrict = MasterMapper.mapCityModelToDto(res.data.data)
        })
      } else {
        this.store.district_id = ""
      }
    },

    /**
     * Change expired date
     */
    changeExpiredDate() {
      if(commonFunc.dateFormatCheck(this.store.expired_at)) {
        this.getTimeLive()
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.router.push("/store/list")
    },

    /**
     * Only input integer
     */
    integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },
  }
}
</script>
