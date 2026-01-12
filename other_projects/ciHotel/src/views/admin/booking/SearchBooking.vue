<template>
  <div class="container-fluid mx-auto p-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <button class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700 w-32 mb-2 md:mb-0" @click.prevent="goBack">
          Quay lại
        </button>
        <h4 class="text-xl font-bold text-center text-[#F85F36] flex-grow">THÔNG TIN ĐẶT PHÒNG</h4>
        <div class="w-32"></div>
      </div>
      <hr class="my-4">

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tên khách</label>
          <input
            id="name"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.name">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
          <input
            id="std"
            type="number"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.sdt">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Chứng minh nhân dân</label>
          <input
            id="cmnd"
            type="number"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.cmnd">
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
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Tên khách</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Số điện thoại</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">CMND</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Tên phòng</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Loại phòng</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Ngày nhận phòng</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Ngày trả phòng</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Số lượng khách</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Ghi chú</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm border-r border-gray-300">{{ item.stt }}</td>
              <td class="px-4 py-3 text-sm border-r border-gray-300">{{ item.customer_name }}</td>
              <td class="px-4 py-3 text-sm border-r border-gray-300">{{ item.phone_number }}</td>
              <td class="px-4 py-3 text-sm border-r border-gray-300">{{ item.cmnd_number }}</td>
              <td class="px-4 py-3 text-sm border-r border-gray-300">{{ item.room_name }}</td>
              <td class="px-4 py-3 text-sm border-r border-gray-300">{{ item.room_type_name }}</td>
              <td class="px-4 py-3 text-sm border-r border-gray-300">{{ item.check_in }}</td>
              <td class="px-4 py-3 text-sm border-r border-gray-300">{{ item.check_out }}</td>
              <td class="px-4 py-3 text-sm border-r border-gray-300">
                <span>- {{ item.adult }} Người lớn</span><br>
                <span v-show="item.children != 0">- {{ item.children }} Trẻ em</span>
              </td>
              <td class="px-4 py-3 text-sm border-r border-gray-300">{{ item.note }}</td>
              <td class="px-4 py-3 text-sm">
                <div class="flex gap-2">
                  <button
                    class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    @click="router.push('/check-in-from-booking/' + item.booking_id)">
                    Nhận phòng
                  </button>
                  <button
                    class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    @click="router.push('/booking/edit/' + item.booking_id)">
                    Sửa
                  </button>
                  <button
                    class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    @click="deleted(item.booking_id, item.customer_name)">
                    Xoá
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
import adminAPI from '@/api/admin'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'

export default {
  setup() {
    const router = useRouter()
    const toast = useToast()

    return {
      router,
      toast
    }
  },
  data() {
    return {
      inputs: {
        name: null,
        sdt: null,
        cmnd: null
      },
      bookingStatus: [
        {"value": null, "text": "Tất cả"},
        {"value": "booking", "text": "Đã đặt phòng"},
        {"value": "checkIn", "text": "Đã nhận phòng"}
      ],
      items: [],
      offset: 0,
      click: false,
      pageLimit: Constant.PAGE_LIMIT,
      onSearch: false,
      loadByScroll: false,
      loading: false,
      totalRow: 0
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)
    this.search()
  },
  methods: {
    /**
     * Processing on scroll: use for paging
     */
    onScroll(event) {
      if(this.onSearch) {
        return
      }
      event.preventDefault()
      var body = document.body
      var html = document.documentElement
      if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if(this.hasNext) {
          this.offset = this.offset + this.pageLimit
          this.loadByScroll = true
          this.search()
        }
      }
    },

    /**
     * Prepare to search
     */
    prepareToSearch() {
      this.saving = true
      this.click = true

      this.search()
    },

    /**
     * Search
     */
    search() {
      this.loading = true

      let param = {
        "name": this.inputs.name,
        "sdt": this.inputs.sdt,
        "cmnd": this.inputs.cmnd,
        "status": this.inputs.status,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      adminAPI.getCreateBooking(param).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data.bookings
          console.log(res.data.data.bookings)
          this.totalRow = res.data.data.total_row
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Delete
     */
    deleted(id, name) {
      if(id && name) {
        if(confirm('Xóa đặt phòng của k.h [' + name + "]. Bạn có chắc không?")) {
          adminAPI.deleteBookingInfo(id).then(res => {
            if(res != null && res.data != null) {
              this.prepareToSearch()
            }
          }).catch(err => {
            let errorMess = commonFunc.handleStaffError(err)
            this.toast.error(errorMess)
          })
        }
      }
    },

    /**
     * Go to table list
     */
    goBack() {
      this.router.push('/booking/list-room')
    }
  }
}
</script>
