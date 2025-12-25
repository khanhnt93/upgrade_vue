<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 gap-4">
      <div class="w-full">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="p-4">
              <div class="grid grid-cols-1 gap-4 form-row">
                <div class="w-full">
                  <h4 class="mt-2 text-center">Store</h4>
                </div>
              </div>
              <hr/>
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row mt-4">
                <div class="w-full md:col-span-3 mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:col-span-9">
                  <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model="store.name"
                  maxlength="100">
                  <div class="text-red-600 text-sm mt-1" v-if="errorName">
                    Vui lòng nhập tên
                  </div>
                </div>
              </div>
            
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row mt-4">
                <div class="w-full md:col-span-3 mt-2">
                  <label> Số điện thoại </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:col-span-9">
                  <input
                  id="phone_number"
                  type="text"
                  class="form-control"
                  v-model="store.phone_number"
                  maxlength="20">
                  <div class="text-red-600 text-sm mt-1" v-if="errorPhoneNumber">
                    Vui lòng nhập số điện thoại
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row mt-4">
                <div class="w-full md:col-span-3 mt-2">
                  <label> Hết Hạn Vào </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:col-span-9">
                  <datepicker v-model="store.expired_at" format="yyyy-MM-dd"
                                placeholder="2022-12-31" input-class="datepicker-cus" 
                      @input="getTimeLive()"></datepicker>
                  <div class="text-red-600 text-sm mt-1" v-if="errorExpiredAt">
                    Vui lòng nhập ngày hết hạn
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row mt-4">
                <div class="w-full md:col-span-3 mt-2">
                  <label> Thời hạn </label>
                </div>
                <div class="w-full md:col-span-9">
                  <p>{{timeLive}}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div class="w-full">
                  <button class="btn btn-secondary pull-left px-4 py-2" @click="back">
                    Quay lại
                  </button>
                </div>
                <div class="w-full">
                  <button class="btn btn-primary pull-left px-4 py-2 default-btn-bg" :disabled="saving" @click="save" >
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
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'


export default {
  components: {
    Datepicker
  },
  data () {
    return {
      // optionsCity: [],
      // optionsDistrict: [],
      store: {
        "name": '',
        // "address": '',
        // "tax_code": '',
        "phone_number": '',
        // "city_id": '',
        // "district_id": '',
        "expired_at": '2024-06-06'
      },
      saving: false,
      timeLive: 0
    }
  },
  mounted() {
    // Init expire date
    let dateNow = new Date()
    this.store.expired_at = new Date(dateNow.setMonth(dateNow.getMonth() + 2))

    this.getStoreDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.store.name)
    },
    // errorCiti: function () {
    //   return this.checkInfo(this.store.city_id)
    // },
    // errorDistrict: function () {
    //   return this.checkInfo(this.store.district_id)
    // },
    // errorAddress: function () {
    //   return this.checkInfo(this.store.address)
    // },
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
      return !(this.errorName || this.errorPhoneNumber || this.errorExpiredAt
          // || this.errorCiti || this.errorDistrict || this.errorAddress 
      )
    },

    /**
   * Make toast without title
   */
  popToast(variant, content) {
    console.log(`[${variant}] ${content}`);
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

        let eYear = 2000
        let eMonth = 1
        let eDay = 1
        if(this.store.expired_at.length == 10) {
            let expired_at = this.store.expired_at.split('-')
            eYear = expired_at[0]
            eMonth = expired_at[1]
            eDay = expired_at[2]
        } else {
            eYear = this.store.expired_at.getFullYear()
          eMonth = this.store.expired_at.getMonth() + 1
          eDay = this.store.expired_at.getDate()
        }


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
     * Get detail
     */
    getStoreDetail() {
      let storeId = this.$route.params.id
      if(storeId){
        superAdminAPI.getStoreDetail(storeId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.store = res.data.data
            this.getTimeLive()
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
     * Save
     */
    save () {

      let result = this.checkValidate()
      if(result) {
        this.saving = true

        let storeId = this.$route.params.id
        if(storeId){
          // Edit
          this.store.id = storeId
         console.log(this.store)
          superAdminAPI.editStore(this.store).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              let message = ""
              if (res.data.status == 200) {
                // show popup success
                alert("Cập nhật thành công")
                this.$router.push("/store/list")
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
            alert(message)
          })
        } else {
          // Add
          superAdminAPI.addStore(this.store).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              let message = ""
              if (res.data.status == 200) {
                // show popup success
                alert("Thêm thành công")
                this.$router.push("/store/list")
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
              alert(message)
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

    // /**
    //  * Get city options
    //  */
    // getOptionCity() {
    //   MasterApi.getCityOptions().then(res => {
    //     this.optionsCity = MasterMapper.mapCityModelToDto(res.data.data)
    //     this.changeCity()
    //   }).catch(err => {
    //     // Handle error
    //       let errorMess = commonFunc.handleStaffError(err)
    //       this.popToast('danger', errorMess)
    //   })
    // },
    //
    // /**
    //  * Get district by city
    //  */
    // changeCity() {
    //   let cityId = this.store.city_id
    //   // console.log(cityId)
    //   if(cityId != "" && cityId != undefined) {
    //     MasterApi.getDistrictOptions(cityId).then(res => {
    //       // console.log(res.data.data)
    //       this.optionsDistrict = MasterMapper.mapCityModelToDto(res.data.data)
    //     })
    //   } else {
    //     this.store.district_id = ""
    //   }
    // },

    // /**
    //  * Change expired date
    //  */
    // changeExpiredDate() {
    //   this.getTimeLive()
    // },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push("/store/list")
    },

    /**
     * Only input integer
     */
    integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerOnly(valueInput)
      item.value = result
    },
  }
}
</script>
