<template>
  <div id="general-information" class="container-fluid mx-auto px-4 py-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-6">
        <h4 class="text-2xl font-bold text-center text-gray-800">THÔNG TIN CHUNG</h4>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        <div class="lg:col-span-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              class="px-4 py-2 text-sm font-medium text-white rounded hover:opacity-90 transition-opacity"
              :class="buttonStates.arrivals ? 'bg-[#F85F36]' : 'bg-gray-700'"
              @click="switchToArrivals">
              Sẽ Đến
            </button>
            <button
              class="px-4 py-2 text-sm font-medium text-white rounded hover:opacity-90 transition-opacity"
              :class="buttonStates.departures ? 'bg-[#F85F36]' : 'bg-gray-700'"
              @click="switchToDepartures">
              Sẽ Đi
            </button>
            <button
              class="px-4 py-2 text-sm font-medium text-white rounded hover:opacity-90 transition-opacity"
              :class="buttonStates.stay_overs ? 'bg-[#F85F36]' : 'bg-gray-700'"
              @click="switchToStayOvers">
              Khách quá hạn đến
            </button>
            <button
              class="px-4 py-2 text-sm font-medium text-white rounded hover:opacity-90 transition-opacity"
              :class="buttonStates.inhouse_guest ? 'bg-[#F85F36]' : 'bg-gray-700'"
              @click="switchToInhouseGuest">
              Khách đang lưu trú
            </button>
          </div>
        </div>
        <div class="lg:col-span-4">
          <div class="grid grid-cols-2 gap-3">
            <select
              v-model="selectedFilter"
              @change="filterData"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="customerName">Tên KH</option>
              <option value="customerPhone">Số điện thoại KH</option>
              <option value="roomName">Tên phòng</option>
            </select>
            <input
              type="text"
              placeholder="Lọc"
              v-model="filterString"
              @keyup="filterData($event.target)"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                Tên phòng
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                Tên KH
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                Số điện thoại
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                Thời gian Check-in
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Thời gian Check-out
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(row, index) in filteredRows"
              :key="index"
              class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                {{ row.room_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                {{ row.customer_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                {{ row.phone_number }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                {{ formatDate(row.check_in) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(row.check_out) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading -->
      <div v-show="loading" class="text-center py-4">
        <i class="fa fa-spinner fa-spin text-4xl text-blue-600"></i>
      </div>
      <div class="text-center py-4 text-gray-500">--Hết--</div>
    </div>
  </div>
</template>

<script>
import commonFunc from '@/common/commonFunc'
import adminAPI from '@/api/admin'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'

export default {
  data() {
    return {
      fields: [
        {
          key: "room_name",
          label: "Tên phòng"
        },
        {
          key: "customer_name",
          label: "Tên KH"
        },
        {
          key: "phone_number",
          label: "Số điện thoại"
        },
        {
          key: "check_in",
          label: "Thời gian Check-in"
        },
        {
          key: "check_out",
          label: "Thời gian Check-out"
        }
      ],
      options: [
        { value: "customerName", text: "Tên KH" },
        { value: "customerPhone", text: "Số điện thoại KH" },
        { value: "roomName", text: "Tên phòng" }
      ],
      filterString: "",
      selectedFilter: "customerName",
      selectedGuestState: 'ARRIVALS',
      loading: true,
      filteredRows: [],
      filteredRowsStore: []
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    },
    buttonStates() {
      return {
        arrivals: this.selectedGuestState === "ARRIVALS",
        departures: this.selectedGuestState === "DEPARTURES",
        stay_overs: this.selectedGuestState === "STAY_OVERS",
        inhouse_guest: this.selectedGuestState === "INHOUSE_GUEST"
      }
    }
  },
  mounted() {
    this.fetchGuestInformations()
  },
  methods: {
    ...useFormatters(),

    fetchGuestInformations() {
      const { error } = useToast()
      this.filterString = ""
      this.selectedFilter = "customerName"

      this.loading = true
      adminAPI
        .getGeneralInfo(this.selectedGuestState)
        .then(res => {
          this.loading = false
          if (res.data.data) {
            this.filteredRows = res.data.data
            this.filteredRowsStore = JSON.parse(JSON.stringify(res.data.data))
          }
        })
        .catch(err => {
          this.loading = false
          let errorMess = commonFunc.handleStaffError(err)
          error(errorMess)
        })
    },

    switchToArrivals() {
      this.selectedGuestState = "ARRIVALS"
      this.fetchGuestInformations()
    },

    switchToDepartures() {
      this.selectedGuestState = "DEPARTURES"
      this.fetchGuestInformations()
    },

    switchToStayOvers() {
      this.selectedGuestState = "STAY_OVERS"
      this.fetchGuestInformations()
    },

    switchToInhouseGuest() {
      this.selectedGuestState = "INHOUSE_GUEST"
      this.fetchGuestInformations()
    },

    filterData(item) {
      let items = JSON.parse(JSON.stringify(this.filteredRowsStore))

      let valueInput = item.value
      if(!valueInput) {
        valueInput = ""
      }

      if(this.selectedFilter == "customerName") {
        items = items.filter( i => i.customer_name.includes(valueInput) )
      }
      if(this.selectedFilter == "roomName") {
        items = items.filter( i => i.room_name.includes(valueInput) )
      }
      if(this.selectedFilter == "customerPhone") {
        items = items.filter( i => i.phone_number.includes(valueInput) )
      }

      this.filteredRows = items
    }
  }
}
</script>

<style scoped>
  /* No custom styles needed - all using Tailwind */
</style>
