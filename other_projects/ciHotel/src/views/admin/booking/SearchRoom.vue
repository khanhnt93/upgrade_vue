<template>
  <div class="container-fluid mx-auto p-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <button class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700 w-32 mb-2 md:mb-0" @click.prevent="goBack">
          Quay lại
        </button>
        <h4 class="text-xl font-bold text-center text-[#F85F36] flex-grow">TÌM KIẾM PHÒNG TRỐNG</h4>
        <div class="w-32"></div>
      </div>
      <hr class="my-4">

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Loại phòng</label>
          <select
            v-model="inputs.room_type"
            id="status"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in optionsRoomType" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ngày nhận phòng</label>
          <input
            id="fromDate"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="errorFromDate ? 'border-red-500' : 'border-gray-300'"
            v-model="inputs.fromDate"
            maxlength="16"
            :disabled="onSearch">
          <p v-if="errorFromDate" class="text-red-500 text-xs mt-1">Mục từ ngày không đúng</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ngày trả phòng</label>
          <input
            id="toDate"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="errorToDate ? 'border-red-500' : 'border-gray-300'"
            v-model="inputs.toDate"
            maxlength="16"
            :disabled="onSearch">
          <p v-if="errorToDate" class="text-red-500 text-xs mt-1">Mục đến ngày không đúng</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2 invisible">Tìm kiếm</label>
          <button
            class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="onSearch"
            @click.prevent="prepareToSearch">
            Tìm Kiếm
          </button>
        </div>
      </div>

      <div class="mb-4">
        <p class="text-sm text-gray-600">Số kết quả: {{totalRow}}</p>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">STT</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Tên phòng</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Loại phòng</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Giá phòng</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Trạng thái phòng</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Tầng</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Thông tin phòng</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Thiết bị trong phòng</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm border-r border-gray-300">{{ item.stt }}</td>
              <td class="px-4 py-3 text-sm border-r border-gray-300">{{ item.name }}</td>
              <td class="px-4 py-3 text-sm border-r border-gray-300">{{ item.room_type_name }}</td>
              <td class="px-4 py-3 text-sm border-r border-gray-300">
                <p v-for="price in item.price" :key="price.id" class="mb-1">{{ "- " + price.name + ": " + formatCurrency(price.room_price) }}</p>
              </td>
              <td class="px-4 py-3 text-sm border-r border-gray-300">
                <p class="font-semibold text-[#F85F36]">{{ item.room_status_name }}</p>
                <div v-if="item.room_status_id == 2">
                  <p class="text-left">Nhận phòng: {{ item.time_in }}</p>
                  <p class="text-left">Trả phòng: {{ item.time_out }}</p>
                </div>
              </td>
              <td class="px-4 py-3 text-sm border-r border-gray-300">{{ item.floor_name }}</td>
              <td class="px-4 py-3 text-sm border-r border-gray-300">
                <p v-for="room_info in item.room_info" :key="room_info.id" class="mb-1">{{ "- " + room_info.name + ": " + room_info.room_info_count }}</p>
              </td>
              <td class="px-4 py-3 text-sm border-r border-gray-300">
                <p v-for="room_device in item.room_device" :key="room_device.id" class="mb-1">{{ "- " + room_device.name + ": " + room_device.device }}</p>
              </td>
              <td class="px-4 py-3 text-sm">
                <div class="flex flex-col gap-2">
                  <button
                    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm w-40"
                    @click="router.push('/booking/add/' + item.id)">
                    Đặt phòng
                  </button>
                  <button
                    class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm w-40"
                    @click="router.push('/check-in/' + item.id)">
                    Nhận phòng nhanh
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading -->
      <div v-show="loading" class="text-center mt-4">
        <i class="fas fa-spinner fa-spin fa-3x text-blue-500"></i>
      </div>
      <p class="text-center text-gray-500 mt-4">--Hết--</p>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import adminAPI from '@/api/admin'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'

export default {
  setup() {
    const router = useRouter()
    const toast = useToast()
    const { formatCurrency, formatDate, formatDateTime } = useFormatters()

    return {
      router,
      toast,
      formatCurrency,
      formatDate,
      formatDateTime
    }
  },
  data() {
    return {
      inputs: {
        room_type: null,
        fromDate: null,
        toDate: null
      },
      optionsRoomType: [{value: null, text: ''}],
      items: [],
      offset: 0,
      pageLimit: Constant.PAGE_LIMIT,
      onSearch: false,
      loadByScroll: false,
      loading: false,
      totalRow: 0,
      setting: null
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    },
    errorFromDate() {
      return this.checkDate(this.inputs.fromDate)
    },
    errorToDate() {
      return this.checkDate(this.inputs.toDate)
    }
  },
  mounted() {
    this.getSystemConfig()
    this.getOptionsRoomType()
  },
  methods: {
    checkDate(dateInput) {
      return (this.click && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
    },

    /**
     * Get hotel config
     */
    getSystemConfig() {
      commonFunc.getTimeConfig().then(cfg => {
        let dateNow = new Date()
        this.inputs.fromDate = dateNow.toJSON().slice(0,10) + " " + cfg.startDate.value
        let toDate = new Date(dateNow.setDate(dateNow.getDate() + 1))
        this.inputs.toDate = toDate.toJSON().slice(0,10) + " " + cfg.endDate.value

        // Search
        this.search()
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Prepare to search
     */
    prepareToSearch() {
      this.offset = 0
      this.items = []
      this.hasNext = true

      this.search()
    },

    getDaysInMonth(month, year) {
      return new Date(year, month, 0).getDate()
    },

    getDayByMonthInput(monthInput) {
      if(monthInput) {
        let toMonths = monthInput.split("-")
        let daysOfMonth = this.getDaysInMonth(toMonths[0], toMonths[1])
        return daysOfMonth
      }
    },

    /**
     * Search
     */
    search() {
      this.loading = true

      if(!this.checkFromDateAndToDate()) {
        this.saving = false
        return
      }
      let param = {
        "room_type": this.inputs.room_type,
        "fromDate": this.inputs.fromDate,
        "toDate": this.inputs.toDate,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      adminAPI.getSearchBooking(param).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data.rooms
          this.totalRow = res.data.data.total_row
        }
        this.loading = false
      }).catch(err => {
        this.loading = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    getOptionsRoomType() {
      adminAPI.getListGroupRoomTypeOption().then(res => {
        this.getOptionsRoomType = [{"value": null, "text": ""}]
        if(res && res.data && res.data.data) {
          let types = res.data.data
          for (var index in types) {
            let type = {
              value: types[index].value,
              text: types[index].text
            }
            this.optionsRoomType.push(type)
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    checkFromDateAndToDate() {
      let fromDate = new Date(this.inputs.fromDate)
      let toDate = new Date(this.inputs.toDate)

      if(fromDate > toDate) {
        this.toast.error("Từ ngày không thể lớn hơn đến ngày")
        return false
      }

      return true
    },

    /**
     * Go to table list
     */
    goBack() {
      this.router.push('/booking/list-room')
    },

    /**
     * Only input date
     */
    inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    }
  }
}
</script>
