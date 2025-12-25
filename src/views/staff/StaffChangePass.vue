<template>
  <div class="app flex-row align-items-center is-fixed-page">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card-group">
            <div class="card">
              <div class="card-body">
                <form @submit.prevent="update">
                  <h1 class="text-center">
                    Đổi Mật Khẩu
                  </h1>
                  <div class="form-group">
                    <label>
                      Mật Khẩu Hiện Tại
                    </label><span class="error-sybol"></span>
                    <input id="oldPassword"  
                      type="password" 
                      class="form-control"
                      :class="{ 'is-invalid': errorOldPassword }"
                      v-model="inputs.old_password">
                    <div v-if="errorOldPassword" class="invalid-feedback d-block">
                      Vui lòng nhập mật khẩu hiện tại
                    </div>
                  </div>
                  <div class="form-group">
                    <label>
                      Mật Khẩu Mới
                    </label><span class="error-sybol"></span>
                    <input id="newPassword"
                      type="password" 
                      class="form-control"
                      :class="{ 'is-invalid': errorNewPassword || errorNewPasswordCompare }"
                      v-model="inputs.new_password">
                    <div v-if="errorNewPassword" class="invalid-feedback d-block">
                      Vui lòng nhập mật khẩu mới
                    </div>
                    <div v-if="errorNewPasswordCompare" class="invalid-feedback d-block">
                      Mật khẩu mới không được trùng mật khẩu cũ
                    </div>
                  </div>
                  <div class="form-group">
                    <label>
                      Nhắc lại mật khẩu mới
                    </label><span class="error-sybol"></span>
                    <input id="confirmPassword"
                      type="password" 
                      class="form-control"
                      :class="{ 'is-invalid': errorConfirmPassword || errorMatch }"
                      v-model="confirmPass">
                    <div v-if="errorConfirmPassword" class="invalid-feedback d-block">
                      Vui lòng nhập lại mật khẩu mới
                    </div>
                    <div v-if="errorMatch" class="invalid-feedback d-block">
                      Nhắc lại mật khẩu không đúng
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 text-center">
                      <button
                        type="button"
                        @click="update" 
                        :disabled="onUpdate"
                        class="btn btn-primary default-btn-bg">
                        {{ onUpdate ? "Cập Nhật Mật Khẩu..." : "Cập Nhật Mật Khẩu" }}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthenticationAPI from '@/api/authentication'

const router = useRouter()
const authStore = useAuthStore()

const inputs = ref({
  new_password: null,
  old_password: null,
})
const confirmPass = ref(null)
const click = ref(false)
const onUpdate = ref(false)
const errorMatch = ref(false)

const errorNewPassword = computed(() => checkInfo(inputs.value.new_password))
const errorNewPasswordCompare = computed(() => comparePass())
const errorConfirmPassword = computed(() => checkInfo(confirmPass.value))
const errorOldPassword = computed(() => checkInfo(inputs.value.old_password))

watch(confirmPass, () => {
  errorMatch.value = false
})

const checkConfirmPass = () => {
  return errorConfirmPassword.value || (inputs.value.new_password == confirmPass.value)
}

const comparePass = () => {
  return (click.value && (inputs.value.new_password != null && inputs.value.new_password.length > 0)
    && (inputs.value.old_password != null || inputs.value.old_password.length > 0)
    && (inputs.value.new_password == inputs.value.old_password))
}

const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkValidate = () => {
  return !(errorNewPassword.value || errorConfirmPassword.value || errorMatch.value || errorNewPasswordCompare.value)
}

const update = () => {
  if (onUpdate.value == true) {
    return
  }

  click.value = true
  let result = checkValidate()
  errorMatch.value = !checkConfirmPass()
  
  if (result && !errorMatch.value) {
    onUpdate.value = true

    AuthenticationAPI.staffChangePass(inputs.value).then(res => {
      if (res && res.data && res.data.status == 200) {
        // Redirect to login page
        authStore.logout()
        router.push('/login')
      }
      onUpdate.value = false
    }).catch(err => {
      onUpdate.value = false

      let message = ''
      if (err.response?.data?.status == 422) {
        message = err.response.data.mess
      } else {
        message = 'Lỗi hệ thống'
      }
      alert(message)
    })
  }
}
</script>

<style scoped>
.error-sybol {
  color: red;
}
</style>
