<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-12 flex justify-end">
            <button
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors min-w-[120px]"
              @click="save()"
              :disabled="saving">
              Lưu
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-12">
            <h4 class="mt-1 text-center text-xl font-semibold">CÀI ĐẶT HỆ THỐNG</h4>
          </div>
        </div>
        <hr class="mb-4">
        
        <!-- Loading -->
        <div v-show="loading" class="text-center mb-4">
          <icon name="loading" width="60" />
        </div>

        <!-- Start Time -->
        <div class="mb-4">
          <label>Thời gian bắt đầu <span class="text-red-500">*</span></label>
          <input
            id="startDate"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errorStartTime }"
            v-model="setting.startDate.value"
            maxlength="11">
          <div v-if="errorStartTime" class="text-red-500 text-sm mt-1">
            Vui lòng nhập thời gian bắt đầu
          </div>
        </div>

        <!-- End Time -->
        <div class="mb-4">
          <label>Thời gian kết thúc <span class="text-red-500">*</span></label>
          <input
            id="endDate"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errorEndTime }"
            v-model="setting.endDate.value"
            maxlength="11">
          <div v-if="errorEndTime" class="text-red-500 text-sm mt-1">
            Vui lòng nhập thời gian kết thúc
          </div>
        </div>

        <!-- Hours Until New Date -->
        <div class="mb-4">
          <label>Quá hạn bao nhiêu giờ thì tính ngày mới <span class="text-red-500">*</span></label>
          <input
            id="hoursUntilNewDate"
            type="number"
            autocomplete="new-password"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errorHoursUntilNewDate }"
            v-model="setting.hoursUntilNewDate.value"
            min="0">
          <div v-if="errorHoursUntilNewDate" class="text-red-500 text-sm mt-1">
            Vui lòng nhập số giờ quá hạn
          </div>
        </div>

        <!-- Minutes Until New Hour -->
        <div class="mb-4">
          <label>Quá hạn bao nhiêu phút thì tính giờ mới <span class="text-red-500">*</span></label>
          <input
            type="number"
            autocomplete="new-password"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errorMinutesUntilNewHour }"
            v-model="setting.minutesUntilNewHour.value"
            min="11">
          <div v-if="errorMinutesUntilNewHour" class="text-red-500 text-sm mt-1">
            Vui lòng nhập số phút quá hạn
          </div>
        </div>

        <!-- Auto Update Room -->
        <div class="mb-4">
          <label>Tự động cập nhật phòng dơ khi khách qua đêm <span class="text-red-500">*</span></label>
          <div class="flex items-center gap-6 mt-2">
            <div class="flex items-center">
              <input
                type="radio"
                v-model="setting.auto_update_room.value"
                name="auto_update_room"
                :value="true"
                class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
              <label>Có</label>
            </div>
            <div class="flex items-center">
              <input
                type="radio"
                v-model="setting.auto_update_room.value"
                name="auto_update_room"
                :value="false"
                class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
              <label>Không</label>
            </div>
          </div>
          <div v-if="errorAutoUpdateRoom" class="text-red-500 text-sm mt-1">
            Vui lòng chọn lựa chọn
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/setting'
import commonFunc from '@/common/commonFunc'

export default {
  setup() {
    const toast = useToast()

    return {
      toast
    }
  },
  data() {
    return {
      setting: {
        startDate: {
          "id": null,
          "code": "time_in",
          "value": '12:00'
        },
        endDate: {
          "id": null,
          "code": "time_out",
          "value": '14:00'
        },
        hoursUntilNewDate: {
          "id": null,
          "code": "hours_until_new_date",
          "value": "2"
        },
        minutesUntilNewHour: {
          "id": null,
          "code": "minutes_until_hours",
          "value": "15"
        },
        discountByMoney: {
          "id": null,
          "code": "discount_by_money",
          "value": false
        },
        auto_update_room: {
          "id": null,
          "code": "auto_update_room",
          "value": false
        },
      },
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    this.getSystemConfig()
  },
  computed: {
    errorStartTime: function () {
      return this.checkInfo(this.setting.startDate.value)
    },
    errorEndTime: function () {
      return this.checkInfo(this.setting.endDate.value)
    },
    errorHoursUntilNewDate: function () {
      return this.checkInfo(this.setting.hoursUntilNewDate.value)
    },
    errorMinutesUntilNewHour: function () {
      return this.checkInfo(this.setting.minutesUntilNewHour.value)
    },
    errorAutoUpdateRoom: function () {
      return this.checkInfo(this.setting.auto_update_room.value)
    },
  },
  methods: {
    checkInfo(info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate() {
      return !(this.errorStartTime || this.errorEndTime || this.errorHoursUntilNewDate || this.errorMinutesUntilNewHour || this.errorAutoUpdateRoom)
    },

    /**
     * Save
     */
    save() {
      this.click = true
      this.saving = true

      let result = this.checkValidate()
      if (result) {
        adminAPI.saveSystemConfig(this.setting).then(res => {
          this.saving = false
          if (res != null && res.data != null) {
            if (res.data.status == 200) {
              // show popup success
              this.toast.success('Cập nhật cài đặt thành công!!!')
            }
            this.getSystemConfig()
          }
        }).catch(err => {
          this.saving = false
          let message = "Lỗi hệ thống"
          alert("Cập Nhật Cài Đặt\n\n" + message)
        })
      } else {
        this.saving = false
      }
    },

    /**
     * Get old
     */
    getSystemConfig() {
      this.loading = true

      adminAPI.getSystemConfig().then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.setting = Mapper.mapSysCfgModelToDtoHotel(res.data.data)
        }

        this.loading = false
      }).catch(err => {
        this.loading = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
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
