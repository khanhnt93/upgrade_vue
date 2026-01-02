<template>
  <div class="app flex-row align-items-center is-fixed-page">
  </div>
</template>

<!--<template>-->
<!--  <div class="app flex-row align-items-center is-fixed-page">-->
<!--    <div class="container-fluid">-->
<!--      <b-row class="row justify-content-center">-->
<!--        <b-col md="6">-->
<!--          <b-card-group>-->
<!--            <b-card-->
<!--              no-body>-->
<!--              <b-card-body>-->
<!--                <b-form method="put">-->
<!--                  <h1 class="text-center">-->
<!--                    Quên Mật Khẩu-->
<!--                  </h1>-->
<!--                  <div class="form-group">-->
<!--                    <label>-->
<!--                      Số Điện Thoại-->
<!--                    </label><span class="error-sybol"></span>-->
<!--                    <input id="phone"-->
<!--                      type="text"-->
<!--                      autocomplete="new-password"-->
<!--                      class="form-control"-->
<!--                      v-model="inputs.phone_number"-->
<!--                      maxlength="15"-->
<!--                      @keyup="intergerOnly($event.target)"-->
<!--                      v-on:change="checkPhoneNumberFormat($event.target)">-->
<!--                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorPhone">-->
<!--                      Vui lòng nhập số điện thoại-->
<!--                    </b-form-invalid-feedback>-->
<!--                    <b-form-invalid-feedback  class="invalid-feedback" :state="phoneNumberCheckFlag">-->
<!--                      Số điện thoại không đúng-->
<!--                    </b-form-invalid-feedback>-->
<!--                  </div>-->
<!--                  <div class="form-group">-->
<!--                    <label>-->
<!--                      Mật Khẩu Mới-->
<!--                    </label><span class="error-sybol"></span>-->
<!--                    <input id="newPassword"-->
<!--                      type="password"-->
<!--                      class="form-control"-->
<!--                      v-model="inputs.new_pass"-->
<!--                    autocomplete="new-password">-->
<!--                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorNewPassword">-->
<!--                      Vui lòng nhập mật khẩu-->
<!--                    </b-form-invalid-feedback>-->
<!--                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorLengthPassword">-->
<!--                      Mật khẩu phải ít nhất 6 kí tự-->
<!--                    </b-form-invalid-feedback>-->
<!--                  </div>-->
<!--                  <div class="form-group">-->
<!--                    <label>-->
<!--                      Nhắc lại mật khẩu mới-->
<!--                    </label><span class="error-sybol"></span>-->
<!--                    <input id="confirmPassword"-->
<!--                      type="password"-->
<!--                      class="form-control"-->
<!--                      v-model="confirmPassword">-->
<!--                    <b-form-invalid-feedback class="invalid-feedback" :state="!errorconfirmPassword">-->
<!--                      Vui lòng nhập lại mật khẩu-->
<!--                    </b-form-invalid-feedback>-->
<!--                    <b-form-invalid-feedback class="invalid-feedback" :state="!errorMatch">-->
<!--                      Mật khẩu không khớp-->
<!--                    </b-form-invalid-feedback>-->
<!--                  </div>-->
<!--                  <b-row>-->
<!--                    <b-col>-->
<!--                      <div id="recaptcha-container"></div>-->
<!--                    </b-col>-->
<!--                  </b-row>-->
<!--                  <b-row>-->
<!--                    <b-col cols="12" class="text-center">-->
<!--                      <b-button-->
<!--                        id="btnUpdateStaff"-->
<!--                        @click="update"-->
<!--                        :disabled="onUpdate"-->
<!--                        :variant="onUpdate ? '' : 'primary'" class="default-btn-bg">-->
<!--                        {{ onUpdate ? "Cập Nhật Mật Khẩu..." : "Cập Nhật Mật Khẩu" }}-->
<!--                      </b-button>-->
<!--                    </b-col>-->
<!--                  </b-row>-->
<!--                </b-form>-->
<!--              </b-card-body>-->
<!--            </b-card>-->
<!--          </b-card-group>-->
<!--        </b-col>-->
<!--      </b-row>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->
<!--<script>-->
<!--import AuthenticationAPI from '@/api/authentication'-->
<!--import commonFunc from '@/common/commonFunc'-->
<!--import Cookies from 'js-cookie'-->
<!--import {auth} from 'firebase/app'-->


<!--export default {-->
<!--  data () {-->
<!--    return {-->
<!--      inputs: {-->
<!--        phone_number: null,-->
<!--        new_pass: null,-->
<!--      },-->
<!--      confirmPassword : null,-->
<!--      click: false,-->
<!--      onUpdate: null,-->
<!--      errorMatch: null,-->
<!--      errorLengthPassword: null,-->
<!--      phoneNumberCheckFlag: true-->
<!--    }-->
<!--  },-->
<!--  mounted () {-->
<!--    this.getCaptcha()-->
<!--  },-->
<!--  computed: {-->
<!--    errorPhone () {-->
<!--      return this.checkInfo(this.inputs.phone_number)-->
<!--    },-->
<!--    errorNewPassword () {-->
<!--      return !this.errorLengthPassword && this.checkInfo(this.inputs.new_pass)-->
<!--    },-->
<!--    errorconfirmPassword () {-->
<!--      return this.checkInfo(this.confirmPassword)-->
<!--    },-->
<!--  },-->
<!--  watch: {-->
<!--    confirmPassword () {-->
<!--      this.errorMatch = false-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    checkLengthPassword () {-->
<!--      if(this.errorNewPassword || this.inputs.new_pass.length >= 6)-->
<!--        return false-->
<!--      return true-->
<!--    },-->
<!--    checkConfirmPassword () {-->
<!--      return this.errorconfirmPassword || (this.inputs.new_pass == this.confirmPassword)-->
<!--    },-->
<!--    checkInfo (info) {-->
<!--      return (this.click && (info == null || info.length <= 0))-->
<!--    },-->
<!--    checkValidate () {-->
<!--      return !(this.errorPhone || this.errorNewPassword || this.errorconfirmPassword || this.errorMatch-->
<!--            || this.errorLengthPassword || !this.phoneNumberCheckFlag)-->
<!--    },-->

<!--    /**-->
<!--     * Get captcha-->
<!--     */-->
<!--    getCaptcha() {-->
<!--      let self = this-->

<!--      try {-->
<!--        // Get captcha-->
<!--        window.recaptchaVerifier = new auth.RecaptchaVerifier('btnUpdateStaff', {-->
<!--          'size': 'invisible',-->
<!--          'callback': function (recapchaToken) {-->
<!--            self.changePass(recapchaToken)-->
<!--          }-->
<!--        });-->

<!--        // render the captcha Verifier.-->
<!--        window.recaptchaVerifier.render().then(function (widgetId) {-->
<!--          window.recaptchaWidgetId = widgetId;-->
<!--        });-->
<!--      } catch(error) {-->
<!--        window.recaptchaVerifier.reset(window.recaptchaWidgetId);-->
<!--      }-->
<!--    },-->

<!--    /**-->
<!--     * Reset captcha-->
<!--     */-->
<!--    resetCaptcha() {-->
<!--      setTimeout(function(){-->
<!--        window.recaptchaVerifier.reset(window.recaptchaWidgetId);-->
<!--      }, 500);-->
<!--    },-->

<!--    /**-->
<!--     *  Update pass-->
<!--     */-->
<!--    changePass (recapchaToken) {-->
<!--      this.inputs.captcha = recapchaToken-->
<!--      AuthenticationAPI.staffUpdatePass(this.inputs).then(res => {-->
<!--        if(res && res.data && res.data.status == 200) {-->
<!--          // Redirect to active password-->
<!--          Cookies.set("staffPhoneNumber", this.inputs.phone_number, { expires: 1 })-->
<!--          this.$router.push("/staff-activepass")-->
<!--        }-->
<!--        this.onUpdate = false-->
<!--      }).catch(err => {-->
<!--        this.onUpdate = false-->
<!--        this.resetCaptcha()-->

<!--        let message = ""-->
<!--        if(err.response.data.status == 422) {-->
<!--          message = err.response.data.mess-->
<!--        } else {-->
<!--          message = "Lỗi hệ thống"-->
<!--        }-->
<!--        this.$bvModal.msgBoxOk(message, {-->
<!--          title: "Cập nhật thất bại",-->
<!--          centered: true,-->
<!--          size: 'sm',-->
<!--          headerClass: 'bg-danger',-->
<!--        })-->
<!--      })-->
<!--    },-->

<!--    update () {-->
<!--      this.click = true-->
<!--      this.errorLengthPassword = this.checkLengthPassword()-->
<!--      let result = this.checkValidate()-->
<!--      this.errorMatch = !this.checkConfirmPassword()-->
<!--      if(result && !this.errorMatch) {-->
<!--        this.onUpdate = true-->
<!--        this.getCaptcha()-->
<!--      } else {-->
<!--        this.resetCaptcha()-->
<!--      }-->
<!--    },-->

<!--    /**-->
<!--     * Check phone number-->
<!--     */-->
<!--    checkPhoneNumberFormat(item) {-->
<!--      let valueInput = item.value-->
<!--      if (valueInput != null && valueInput != "") {-->
<!--        if (commonFunc.phoneNumberCheck(valueInput)) {-->
<!--          this.phoneNumberCheckFlag = true-->
<!--        } else {-->
<!--          this.phoneNumberCheckFlag = false-->
<!--        }-->
<!--      } else {-->
<!--        this.phoneNumberCheckFlag = true-->
<!--      }-->
<!--    },-->

<!--    /**-->
<!--     * Only input integer-->
<!--     */-->
<!--     intergerOnly(item) {-->
<!--      let valueInput = item.value-->
<!--      let result = commonFunc.intergerOnly(valueInput)-->
<!--      item.value = result-->

<!--      if(valueInput.length == 10) {-->
<!--        if (commonFunc.phoneNumberCheck(valueInput)) {-->
<!--          this.phoneNumberCheckFlag = true-->
<!--        } else {-->
<!--          this.phoneNumberCheckFlag = false-->
<!--        }-->
<!--      }-->
<!--    },-->
<!--  }-->
<!--}-->
<!--</script>-->
