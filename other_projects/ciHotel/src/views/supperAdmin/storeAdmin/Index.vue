<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 gap-4">
      <div class="bg-white rounded-lg shadow-md">
        <div class="p-4">
          <div class="grid grid-cols-1 gap-4">
            <div class="col-span-1">
              <h4 class="mt-2 text-center text-orange-500">{{ $route.params.id ? 'Sửa Admin Store' : 'Thêm Admin Store' }}</h4>
            </div>
          </div>
          <hr />

          <!-- Form content -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
            <div class="md:col-span-3 flex items-center">
              <label>Tên <span class="text-red-500">*</span></label>
            </div>
            <div class="md:col-span-9">
              <input
                id="name"
                type="text"
                :class="['form-control', { 'border-red-500': errorName }]"
                v-model="adminStore.name"
                maxlength="100" />
              <div v-if="errorName" class="text-red-500 text-sm mt-1">
                Vui lòng nhập tên
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
            <div class="md:col-span-3 flex items-center">
              <label>Số Điện Thoại <span class="text-red-500">*</span></label>
            </div>
            <div class="md:col-span-9">
              <input
                id="phone"
                type="text"
                :class="['form-control', { 'border-red-500': errorPhone }]"
                v-model="adminStore.phone_number"
                autocomplete="new-password"
                maxlength="20" />
              <div v-if="errorPhone" class="text-red-500 text-sm mt-1">
                Vui lòng nhập số điện thoại
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
            <div class="md:col-span-3 flex items-center">
              <label>Thương hiệu</label>
            </div>
            <div class="md:col-span-9">
              <select
                id="brand_id"
                class="form-control"
                v-model="adminStore.brand_id"
                @change="changeBrand()">
                <option v-for="brand in optionsBrand" :key="brand.value" :value="brand.value">
                  {{ brand.text }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
            <div class="md:col-span-3 flex items-center">
              <label>Cửa Hàng</label>
            </div>
            <div class="md:col-span-9">
              <select
                id="store_id"
                class="form-control"
                v-model="adminStore.store_id"
                @change="changeStore()">
                <option v-for="store in optionsStore" :key="store.value" :value="store.value">
                  {{ store.text }}
                </option>
              </select>
            </div>
          </div>

          <div v-if="!$route.params.id" class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
            <div class="md:col-span-3 flex items-center">
              <label>Mật Khẩu <span class="text-red-500">*</span></label>
            </div>
            <div class="md:col-span-9">
              <input
                id="password"
                type="password"
                :class="['form-control', { 'border-red-500': errorPassword || errorLengthPassword }]"
                v-model="adminStore.password"
                autocomplete="new-password"
                maxlength="100" />
              <div v-if="errorPassword" class="text-red-500 text-sm mt-1">
                Vui lòng nhập mật khẩu
              </div>
              <div v-if="errorLengthPassword" class="text-red-500 text-sm mt-1">
                Mật khẩu phải ít nhất 6 kí tự
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="flex justify-start">
              <button class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded" @click="back">
                Quay lại
              </button>
            </div>
            <div class="flex justify-start">
              <button
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                :disabled="saving"
                @click="save">
                {{ saving ? 'Đang lưu...' : 'Lưu' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import superAdminAPI from '@/api/superAdmin'
import Mapper from '@/mapper/staff'
import MapperStore from '@/mapper/store'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useRouter, useRoute } from 'vue-router'

export default {
  setup() {
    const toast = useToast()
    const router = useRouter()
    const route = useRoute()

    return {
      toast,
      router,
      route
    }
  },
  data() {
    return {
      optionsStore: [],
      optionsBrand: [],
      adminStore: {
        name: '',
        phone_number: '',
        password: '',
        store_id: null,
        brand_id: null
      },
      saving: false
    }
  },
  mounted() {
    this.getOptionBrand()
    this.getStoreListDB()
    this.getAdminStoreDetail()
  },
  computed: {
    errorName() {
      return this.checkInfo(this.adminStore.name)
    },
    errorPhone() {
      return this.checkInfo(this.adminStore.phone_number)
    },
    errorPassword() {
      if (!this.route.params.id) {
        return this.checkInfo(this.adminStore.password)
      }
      return false
    },
    errorLengthPassword() {
      if (this.errorPassword || !this.adminStore.password)
        return false
      if (this.saving)
        return (this.adminStore.password.length < 6)
      return false
    }
  },
  methods: {
    checkInfo(info) {
      return this.saving && (info == null || info.length <= 0)
    },
    checkValidate() {
      return !(this.errorName || this.errorPhone || this.errorPassword || this.errorLengthPassword)
    },

    getStoreListDB() {
      superAdminAPI.getStoreListDB().then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.optionsStore = MapperStore.mapStoreModelListToDto(res.data.data)
        }
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    getAdminStoreDetail() {
      let AdminStoreId = this.route.params.id
      if (AdminStoreId) {
        superAdminAPI.getAdminStoreDetail(AdminStoreId).then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            this.adminStore = Mapper.mapAdminStoreDetailModelToDto(res.data.data)
          }
        }).catch(err => {
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
      }
    },

    save() {
      this.saving = true
      let result = this.checkValidate()
      if (result) {
        let adminStoreId = this.route.params.id
        if (adminStoreId) {
          // Edit
          let adminStore = this.adminStore
          adminStore.id = adminStoreId
          superAdminAPI.editAdminStore(adminStore).then(res => {
            this.saving = false
            if (res != null && res.data != null) {
              if (res.data.status == 200) {
                alert("Cập nhật thành công")
                this.router.push("/admin-store/list")
              }
            }
          }).catch(err => {
            this.saving = false
            let message = ""
            if (err.response.data.status == 422) {
              message = err.response.data.mess
            } else {
              message = "Lỗi hệ thống"
            }
            alert(message)
          })
        } else {
          // Add
          superAdminAPI.addAdminStore(this.adminStore).then(res => {
            this.saving = false
            if (res != null && res.data != null) {
              if (res.data.status == 200) {
                alert("Thêm thành công")
                this.router.push("/admin-store/list")
              }
            }
          }).catch(err => {
            this.saving = false
            let message = ""
            if (err.response.data.status == 422) {
              message = err.response.data.mess
            } else {
              message = "Lỗi hệ thống"
            }
            alert(message)
          })
        }
      } else {
        this.saving = false
      }
    },

    getOptionBrand() {
      superAdminAPI.getBrandOption().then(res => {
        this.optionsBrand = [{ value: null, text: "" }]
        if (res && res.data && res.data.data) {
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
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    changeBrand() {
      let brandId = this.adminStore.brand_id
      if (brandId) {
        this.adminStore.store_id = null
      }
    },

    changeStore() {
      let storeId = this.adminStore.store_id
      if (storeId) {
        this.adminStore.brand_id = null
      }
    },

    back() {
      this.router.push("/admin-store/list")
    }
  }
}
</script>
