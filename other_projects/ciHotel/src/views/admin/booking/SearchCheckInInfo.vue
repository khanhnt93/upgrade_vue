<template>
  <div class="container-fluid mx-auto p-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between mb-4">
        <button class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" @click="goBack">
          Quay lại
        </button>
        <h4 class="text-xl font-bold text-center text-[#F85F36]">THÔNG TIN KHÁCH ĐANG Ở</h4>
      </div>
      <hr class="my-4">

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tên khách</label>
          <input
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.name">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
          <input
            type="number"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.sdt">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Chứng minh nhân dân</label>
          <input
            type="number"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.cmnd">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2 text-white">Tìm kiếm</label>
          <button
            class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="onSearch"
            @click="prepareToSearch">
            Tìm Kiếm
          </button>
        </div>
      </div>

      <div class="mb-2">
        <span class="text-sm text-gray-600">Số kết quả: {{totalRow}}</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-300 px-4 py-2 text-left">STT</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Tên khách</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Số điện thoại</th>
              <th class="border border-gray-300 px-4 py-2 text-left">CMND</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Tên phòng</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Loại phòng</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Ngày nhận phòng</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Ngày trả phòng</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Số lượng khách</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
              <td class="border border-gray-300 px-4 py-2">{{item.stt}}</td>
              <td class="border border-gray-300 px-4 py-2">{{item.customer_name}}</td>
              <td class="border border-gray-300 px-4 py-2">{{item.phone_number}}</td>
              <td class="border border-gray-300 px-4 py-2">
                <p>{{item.cmnd_number}}</p>
                <div v-show="item.cmnd_image_front || item.cmnd_image_end">
                  <span class="text-sm text-blue-600 cursor-pointer" @click="isShowCMNDImage = !isShowCMNDImage">
                    Ảnh cmnd/cccd:
                    <i v-show="!isShowCMNDImage" class="fa fa-plus pl-3"></i>
                    <i v-show="isShowCMNDImage" class="fa fa-minus pl-3"></i>
                  </span>
                  <div v-show="isShowCMNDImage" class="mt-2 space-y-2">
                    <img :src="item.cmnd_image_front" class="w-full max-w-[200px] h-auto">
                    <img :src="item.cmnd_image_end" class="w-full max-w-[200px] h-auto">
                  </div>
                </div>
              </td>
              <td class="border border-gray-300 px-4 py-2">{{item.room_name}}</td>
              <td class="border border-gray-300 px-4 py-2">{{item.room_type_name}}</td>
              <td class="border border-gray-300 px-4 py-2">{{item.check_in}}</td>
              <td class="border border-gray-300 px-4 py-2">{{item.check_out}}</td>
              <td class="border border-gray-300 px-4 py-2">
                <span class="block">- {{item.adult}} Người lớn</span>
                <span v-show="item.children != 0" class="block">- {{item.children}} Trẻ em</span>
              </td>
              <td class="border border-gray-300 px-4 py-2">
                <div class="space-y-2">
                  <button
                    class="w-full px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    @click="router.push('/update-check-in-info/' + item.booking_id)">
                    Sửa
                  </button>
                  <button
                    class="w-full px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    @click="showModalChangeRoom(item)">
                    Đổi phòng
                  </button>
                  <button
                    class="w-full px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    @click="router.push('/booking/payment/' + item.payment_id)">
                    Thanh toán
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-show="loading" class="text-center my-4">
        <i class="fas fa-spinner fa-spin fa-3x text-blue-500"></i>
      </div>
      <div class="text-center my-4 text-gray-500">--Hết--</div>
    </div>

    <!-- Modal đổi phòng -->
    <div v-show="showChangeRoomModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="border-b pb-3 mb-4">
          <h5 class="text-center text-lg font-bold text-[#F85F36]">
            Phòng hiện tại: {{currentItemSelected.room_name}} ({{currentItemSelected.room_type_name}})
          </h5>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Đổi tới phòng:</label>

          <select
            v-show="!loadingEmptyRoom && textEmptyRoom == ''"
            v-model="changeToRoomId"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in optionsEmptyRoom" :key="option.value" :value="option.value">
              {{option.text}}
            </option>
          </select>

          <div v-show="loadingEmptyRoom" class="text-center">
            <i class="fas fa-spinner fa-spin fa-3x text-blue-500"></i>
          </div>

          <div v-show="!loadingEmptyRoom && textEmptyRoom != ''" class="text-center text-red-500">
            {{textEmptyRoom}}
          </div>
        </div>

        <div class="flex gap-4 border-t pt-4">
          <button
            class="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            @click="hideModalChangeRoom">
            Hủy
          </button>
          <div v-show="loadingChangeRoom" class="flex-1 flex items-center justify-center">
            <i class="fas fa-spinner fa-spin fa-2x text-blue-500"></i>
          </div>
          <button
            v-show="!loadingChangeRoom"
            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="confirmChangeRoom">
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
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
      optionsEmptyRoom: [{ value: null, text: '' }],
      items: [],
      offset: 0,
      click: false,
      pageLimit: Constant.PAGE_LIMIT,
      onSearch: false,
      loadByScroll: false,
      loading: false,
      loadingEmptyRoom: false,
      loadingChangeRoom: false,
      totalRow: 0,
      textEmptyRoom: '',
      currentItemSelected: {},
      changeToRoomId: '',
      isShowCMNDImage: false,
      showChangeRoomModal: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)
    this.search()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll(event) {
      if (this.onSearch) {
        return
      }
      event.preventDefault()
      var body = document.body
      var html = document.documentElement
      if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if (this.hasNext) {
          this.offset = this.offset + this.pageLimit
          this.loadByScroll = true
          this.search()
        }
      }
    },

    prepareToSearch() {
      this.saving = true
      this.click = true
      this.search()
    },

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

      adminAPI.searchCheckInInfo(param).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data.bookings
          this.totalRow = res.data.data.total_row
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    showModalChangeRoom(bookingInfo) {
      this.showChangeRoomModal = true
      this.currentItemSelected = bookingInfo
      this.getListEmptyRoom()
    },

    getListEmptyRoom() {
      this.loadingEmptyRoom = true
      this.textEmptyRoom = ''

      adminAPI.getListEmptyRoom(this.currentItemSelected.room_id).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.optionsEmptyRoom = [{ value: null, text: '' }]
          let rooms = res.data.data
          if (rooms.length > 0) {
            for (let index in rooms) {
              let room = {
                value: rooms[index].value,
                text: rooms[index].text
              }
              this.optionsEmptyRoom.push(room)
            }
          } else {
            this.textEmptyRoom = 'Không còn phòng trống phù hợp với thời gian bạn booking. Bạn hãy cập nhật lại thời gian booking và tìm lại thử nhé!!!'
          }
        }
        this.loadingEmptyRoom = false
      }).catch(err => {
        this.loadingEmptyRoom = false
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    confirmChangeRoom() {
      if (this.changeToRoomId == '') {
        this.toast.error("Hãy chọn phòng muốn đổi")
        return
      }
      this.loadingChangeRoom = true
      let param = {
        "fromRoomId": this.currentItemSelected.room_id,
        "toRoomId": this.changeToRoomId
      }
      adminAPI.confirmChangeRoom(param).then(res => {
        if (res != null && res.data != null) {
          this.search()
          this.showChangeRoomModal = false
        }
        this.loadingChangeRoom = false
      }).catch(err => {
        this.loadingChangeRoom = false
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    hideModalChangeRoom() {
      this.showChangeRoomModal = false
    },

    goBack() {
      this.router.push('/booking/list-room')
    }
  }
}
</script>
