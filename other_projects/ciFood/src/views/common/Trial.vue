<template>
  <!--<div class="app flex-row align-items-center is-fixed-page">-->
    <div class="container-fluid">
      <b-row class="row justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card
              no-body>
              <b-card-body>
                <b-form method="put">
                  <h1 class="text-center text-header">Đăng Ký Dùng Thử</h1>
                  <div class="form-group">
                    <label>
                      Tên nhà hàng:
                    </label><span class="error-sybol"></span>
                    <input
                      id="store_name"
                      type="text"
                      class="form-control"
                      v-model="store.store_name"
                      maxlength="100">
                      <b-form-invalid-feedback  class="invalid-feedback" :state="!errorStoreName">
                        Vui lòng nhập tên nhà hàng
                      </b-form-invalid-feedback>
                  </div>
                  <div class="form-group">
                    <label>
                      Tên chủ quán:
                    </label><span class="error-sybol"></span>
                    <input
                      id="user_name"
                      type="text"
                      class="form-control"
                      v-model="store.user_name"
                      maxlength="100">
                      <b-form-invalid-feedback  class="invalid-feedback" :state="!errorUserName">
                        Vui lòng nhập tên chủ quán
                      </b-form-invalid-feedback>
                  </div>
                  <div class="form-group">
                    <label>
                      Số điện thoại:
                    </label><span class="error-sybol"></span>
                    <input
                      id="phone"
                      type="text"
                      class="form-control"
                      v-model="store.phone_number"
                      maxlength="12"
                      @keyup="integerOnly($event.target)"
                      v-on:change="checkPhoneNumberFormat($event.target)">
                      <b-form-invalid-feedback  class="invalid-feedback" :state="!errorPhoneNumber">
                        Vui lòng nhập số điện thoại
                      </b-form-invalid-feedback>
                      <b-form-invalid-feedback  class="invalid-feedback" :state="phoneNumberCheckFlag">
                        Số điện thoại không đúng
                      </b-form-invalid-feedback>
                  </div>
                  <div class="form-group">
                    <label>
                      Tỉnh/Thành phố:
                    </label><span class="error-sybol"></span>
                    <b-form-select
                      :options="optionsCity"
                      id="city_id"
                      type="text"
                      class="form-control"
                      v-model="store.city_id"
                      v-on:change="changeCity($event.target)">
                    </b-form-select>
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorCiti">
                      Vui lòng nhập tỉnh/thành phố
                    </b-form-invalid-feedback>
                  </div>
                  <div class="form-group">
                    <label>
                      Quận/Huyện:
                    </label><span class="error-sybol"></span>
                    <b-form-select
                      v-bind="{ disabled: store.city_id=='' }"
                      :options="optionsDistrict"
                      id="district"
                      type="text"
                      class="form-control"
                      v-model="store.district_id"
                      :disabled="!store.city_id"
                      ></b-form-select>
                    <b-form-invalid-feedback class="invalid-feedback" :state="!errorDistrict">
                      Vui lòng nhập quận/huyện
                    </b-form-invalid-feedback>
                  </div>
                  <div class="form-group">
                    <label>
                      Địa chỉ:
                    </label><span class="error-sybol"></span>
                    <input
                    id="address"
                    type="text"
                    class="form-control"
                    v-model="store.address">
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorAddress">
                      Vui lòng nhập địa chỉ
                    </b-form-invalid-feedback>
                  </div>
                  <div class="form-group">
                    <label>
                      Loại hình kinh doanh:
                    </label>
                    <input
                    id="type"
                    type="text"
                    class="form-control"
                    v-model="store.type"
                    placeholder="Cafe, trà sữa, quán ăn, ....">
                  </div>
                  <div class="form-group">
                    <label>
                      Mã voucher:
                    </label>
                    <input
                    id="voucherCode"
                    type="text"
                    class="form-control"
                    v-model="store.voucher_code"
                    maxlength="10">
                  </div>
                  <p>**Cảm ơn bạn đã quan tâm sản phẩm của chúng tôi. Thời hạn dùng thử là 15 ngày
                    (Nếu không có mã voucher). Chúng tôi sẽ liên hệ với bạn ngay để hướng dẫn chi tiết hơn.
                    Xin chân thành cảm ơn!
                  </p>
                  <b-row>
                    <b-col cols="12" class="text-center">
                      <b-button
                        @click="update"
                        :disabled="onUpdate"
                        :variant="onUpdate ? '' : 'primary'" class="default-btn-bg">
                        {{ onUpdate ? "Đăng ký..." : "Đăng ký" }}
                      </b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>

      <!-- Modal xác nhận đăng ký thành công -->
      <b-modal centered hide-footer hide-header :no-close-on-backdrop="true" id="modal-confirm-info">
        <b-row>
          <b-col class="text-center text-header">
            <h5>Đăng Ký thành công!!!</h5>
          </b-col>
        </b-row>
        <br>

        <b-row>
          <b-col>
            <p>Thông tin đăng nhập: </p>
            <p class="pl-5">Số điện thoại: {{phone_number_signup}}</p>
            <p class="pl-5">Mật khẩu: {{phone_number_signup}}</p>
        </b-col>
        </b-row>

        <b-row>
          <b-col>
            <p class="text-danger">**Phía trên là thông tin đăng nhập của bạn, bạn hãy ghi nhớ trước khi xác nhận.</p>
          </b-col>
          <b-col cols="12" class="text-right mt-3">
            <button class="btn btn-primary px-4 default-btn-bg" @click="confirmInfoSignup">
              Xác nhận
            </button>
          </b-col>
        </b-row>

      </b-modal>

    </div>
  <!--</div>-->
</template>
<script>
import AuthenticationAPI from '@/api/authentication'
import {Constant} from '@/common/constant'
import MasterApi from "../../api/master";
import MasterMapper from "../../mapper/master";
import commonFunc from "../../common/commonFunc";


export default {
  data () {
    return {
      store: {
        store_name: null,
        user_name: null,
        phone_number: null,
        city_id: null,
        district_id: null,
        address: null,
        type: null,
        voucher_code: null
      },
      optionsCity: [],
      optionsDistrict: [],
      phoneNumberCheckFlag: true,
      click: false,
      onUpdate: null,
      phone_number_signup: null
    }
  },
  mounted() {
    // Get city options
    this.getOptionCity()
  },
  computed: {
    errorStoreName: function () {
      return this.checkInfo(this.store.store_name)
    },
    errorUserName: function () {
      return this.checkInfo(this.store.user_name)
    },
    errorPhoneNumber: function () {
      return this.checkInfo(this.store.phone_number)
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
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorStoreName || this.errorUserName || this.errorPhoneNumber || this.errorCiti || this.errorDistrict || this.errorAddress)
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


    update () {
      if(this.onUpdate == true) {
        return
      }

      this.click = true
      let result = this.checkValidate()
      if(result) {
        this.onUpdate = true

        AuthenticationAPI.signUpTrial(this.store).then(res => {
          if(res && res.data && res.data.status == 200) {
            this.phone_number_signup = res.data.data.phone_number

            // Show modal xác nhận thông tin đăng ký
            this.$bvModal.show('modal-confirm-info')
          }
          this.onUpdate = false
        }).catch(err => {
          this.onUpdate = false

          let message = ""
          if(err.response.data.status == 422) {
            message = err.response.data.mess
          } else {
            message = "Lỗi hệ thống"
          }
          this.$bvModal.msgBoxOk(message, {
            title: "Cập nhật thất bại",
            centered: true,
            size: 'sm',
            headerClass: 'bg-danger',
          })
        })
      }
    },

    /**
     * Xác nhận thông tin đăng ký
     */
    confirmInfoSignup() {
      // Redirect to login page
      this.$store.commit('removeToken')
      this.$router.push('/staff-login')
    },

      /**
     * Only input integer
     */
     integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result

      if(valueInput.length == 10) {
        if (commonFunc.phoneNumberCheck(valueInput)) {
          this.phoneNumberCheckFlag = true
        } else {
          this.phoneNumberCheckFlag = false
        }
      }
    },

      /**
     * Check phone number
     */
    checkPhoneNumberFormat(item) {
      let valueInput = item.value
      if (valueInput != null && valueInput != "") {
        if (commonFunc.phoneNumberCheck(valueInput)) {
          this.phoneNumberCheckFlag = true
        } else {
          this.phoneNumberCheckFlag = false
        }
      } else {
        this.phoneNumberCheckFlag = true
      }
    },
  }
}
</script>
