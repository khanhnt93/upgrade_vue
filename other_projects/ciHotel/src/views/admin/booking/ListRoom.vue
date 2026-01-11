<template>
  <div class="container mx-auto p-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h4 class="text-xl font-bold text-center text-[#F85F36] mb-4">DANH SÁCH PHÒNG</h4>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <div class="flex flex-wrap gap-2 ml-2 mb-4">
            <span class="text-black">Tổng số phòng: {{number_of_room}} |</span>
            <span class="text-blue-800 ml-1">Phòng trống: {{number_of_room_empty}} |</span>
            <span class="text-orange-500 ml-1">Có khách: {{number_of_room_busy}} |</span>
            <span class="text-red-600 ml-1">Đang đến: {{booking_coming}}</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full md:w-60" @click="router.push('/booking/search-room')">
              Tìm phòng trống
            </button>
            <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full md:w-60" @click="router.push('/booking/search-booking')">
              Tìm thông tin đặt phòng
            </button>
          </div>
        </div>

        <div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Trạng Thái</label>
              <select
                v-model="inputs.status"
                @change="filterCondition"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="option in optionsRoomStatus" :key="option.value" :value="option.value">{{ option.text }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Loại phòng</label>
              <select
                v-model="inputs.type"
                @change="filterCondition"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="option in optionsRoomType" :key="option.value" :value="option.value">{{ option.text }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tầng</label>
              <select
                v-model="inputs.floor"
                @change="filterCondition"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="option in optionsFloor" :key="option.value" :value="option.value">{{ option.text }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tình trạng phòng</label>
              <select
                v-model="inputs.state"
                @change="filterCondition"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="option in optionsRoomState" :key="option.value" :value="option.value">{{ option.text }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div v-for="floor in items" :key="floor.floor_name" class="mb-6">
        <h2 class="text-2xl font-bold text-[#F85F36] mb-4">{{floor.floor_name}}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="item in floor.rooms" :key="item.name" @click="showModalBookingList(item)" class="cursor-pointer">
            <div
              class="rounded-lg p-4"
              :class="item.room_status_id === 2 ? 'bg-[#1d97c2]' : 'bg-gray-500'">
              <div class="grid grid-cols-2 gap-4 text-white">
                <div class="text-left">
                  <h2 class="text-xl font-bold">Phòng: {{item.name}}</h2>
                  <p class="text-gray-200">Loại: {{item.room_type_name}}</p>
                  <p
                    :class="{
                      'text-gray-800 font-bold': item.state_code == 'dirty',
                      'text-red-500 font-bold': item.state_code == 'fixing',
                      'text-gray-200': item.state_code == 'clean'
                    }">
                    Tình trạng: {{item.state_name}}
                  </p>
                </div>
                <div>
                  <p class="text-gray-200">Trạng thái: {{item.room_status_name}}</p>
                  <p v-if="item.room_status_id === 2" class="text-gray-200">Check in: {{item.check_in}}</p>
                  <p v-if="item.room_status_id === 2" class="text-gray-200">Check out: {{item.check_out}}</p>
                  <p v-if="item.room_status_id === 2" class="text-gray-200">Tạm tính: {{formatCurrency(item.total)}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-show="loading" class="text-center mt-4">
        <i class="fas fa-spinner fa-spin fa-3x text-blue-500"></i>
      </div>
      <p class="text-center text-gray-500 mt-4">--Hết--</p>
    </div>

    <!-- Modal booking -->
    <div v-if="showBookingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="hideModalBookingList">
      <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <div class="border-b pb-4 mb-4">
          <h5 class="text-xl font-bold text-center text-[#F85F36]">Phòng: {{currentItemSelected.name}}</h5>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button
            v-if="currentItemSelected.room_status_id == 1"
            class="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="addBooking">
            Đặt phòng
          </button>
          <button
            v-if="currentItemSelected.room_status_id == 1"
            class="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="checkIn">
            Nhận phòng nhanh
          </button>
          <button
            v-if="currentItemSelected.room_status_id == 2"
            class="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="goToPayment">
            Thông tin thanh toán
          </button>
          <button
            class="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="showModalUpdateRoomState">
            Cập nhật tình trạng phòng
          </button>
          <button
            v-if="currentItemSelected.room_status_id == 2"
            class="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="showModalChangeRoom">
            Đổi phòng
          </button>
        </div>
      </div>
    </div>

    <!-- Modal update room state -->
    <div v-if="showUpdateStateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="hideModalUpdateRoomState">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="border-b pb-4 mb-4">
          <h5 class="text-xl font-bold text-center text-[#F85F36]">Phòng: {{currentItemSelected.name}}</h5>
        </div>

        <div class="mb-4">
          <p>Tình trạng phòng hiện tại: <strong>{{currentItemSelected.state_name}}</strong></p>
        </div>

        <div class="mb-4">
          <p class="mb-2">Cập nhật thành:</p>
          <select
            v-model="stateChange"
            id="roomState"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in optionsRoomState" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-4 border-t">
          <button
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            @click="hideModalUpdateRoomState">
            Hủy
          </button>
          <div>
            <div v-show="loadingUpdateState" class="text-center">
              <i class="fas fa-spinner fa-spin fa-2x text-blue-500"></i>
            </div>
            <button
              v-show="!loadingUpdateState"
              class="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              @click="updateRoomState">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal change room -->
    <div v-if="showChangeRoomModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="hideModalChangeRoom">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="border-b pb-4 mb-4">
          <h5 class="text-xl font-bold text-center text-[#F85F36]">
            Phòng hiện tại: {{currentItemSelected.name}} ({{currentItemSelected.room_type_name}})
          </h5>
        </div>

        <div class="mb-4">
          <p class="mb-2">Đổi tới phòng:</p>
          <div v-if="!loadingEmptyRoom && textEmptyRoom == ''">
            <select
              v-model="changeToRoomId"
              id="roomEmpty"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="option in optionsEmptyRoom" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
          <div v-if="loadingEmptyRoom" class="text-center">
            <i class="fas fa-spinner fa-spin fa-2x text-blue-500"></i>
          </div>
          <div v-if="!loadingEmptyRoom && textEmptyRoom != ''" class="text-center text-gray-600">
            {{textEmptyRoom}}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-4 border-t">
          <button
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            @click="hideModalChangeRoom">
            Hủy
          </button>
          <div>
            <div v-show="loadingChangeRoom" class="text-center">
              <i class="fas fa-spinner fa-spin fa-2x text-blue-500"></i>
            </div>
            <button
              v-show="!loadingChangeRoom"
              class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              @click="confirmChangeRoom">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
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
import Cookies from 'js-cookie'

export default {
  setup() {
    const router = useRouter()
    const toast = useToast()
    const { formatCurrency } = useFormatters()

    return {
      router,
      toast,
      formatCurrency
    }
  },
  data() {
    return {
      inputs: {
        status: null,
        type: null,
        floor: null,
        state: null
      },
      optionsRoomStatus: [{value: null, text: ''}],
      optionsRoomType: [{value: null, text: ''}],
      optionsFloor: [{value: null, text: ''}],
      optionsRoomState: [{value: null, text: ''}],
      optionsEmptyRoom: [{value: null, text: ''}],
      items: [],
      itemStorage: [],
      onSearch: false,
      loading: false,
      loadingEmptyRoom: false,
      loadingUpdateState: false,
      loadingChangeRoom: false,
      number_of_room: 0,
      number_of_room_empty: 0,
      number_of_room_busy: 0,
      booking_coming: 0,
      stateChange: null,
      currentItemSelected: {},
      textEmptyRoom: '',
      changeToRoomId: '',
      showBookingModal: false,
      showUpdateStateModal: false,
      showChangeRoomModal: false
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    }
  },
  mounted() {
    this.initSocket()
    this.getOptionsRelatedRoom()
    this.search()
    this.getTotalInfo()
  },
  methods: {
    /**
     * Init socket
     */
    initSocket() {
      let user = Cookies.get(Constant.APP_USR)
      if(user) {
        console.log("init socket")
        user = JSON.parse(user)
        var socket = new WebSocket("wss://" + Constant.ROOT_API + "/join-group/NOTI-" + user.hotelId)
        socket.onopen = event => {
          console.log('connected')
          this.connected = true
          socket.send({})
        }
        socket.onmessage = event => {
          console.log("onmessage")
          let json_data = JSON.parse(event.data)
          let data = json_data.text
          let actions = data.actions
          let user_owner_id = data.user_owner_id
          console.log(json_data)

          // Check actions, do some things
          if(actions.includes("load_list_room")) {
            console.log("Vào action load_list_room")
            this.search()
          }
        }
        socket.onclose = event => {
          this.connected = false
        }
      }
    },

    showModalBookingList(item) {
      this.currentItemSelected = JSON.parse(JSON.stringify(item))
      this.showBookingModal = true
    },

    goToPayment() {
      this.showBookingModal = false
      this.router.push('/booking/payment/' + this.currentItemSelected.payment_id)
    },

    showModalUpdateRoomState() {
      this.showBookingModal = false
      this.showUpdateStateModal = true
    },

    showModalChangeRoom() {
      this.showBookingModal = false
      this.showChangeRoomModal = true
      this.getListEmptyRoom()
    },

    getListEmptyRoom() {
      this.loadingEmptyRoom = true
      this.textEmptyRoom = ''

      adminAPI.getListEmptyRoom(this.currentItemSelected.id).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.optionsEmptyRoom = [{value: null, text: ''}]
          let rooms = res.data.data
          if(rooms.length > 0) {
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

    hideModalUpdateRoomState() {
      this.showUpdateStateModal = false
    },

    hideModalChangeRoom() {
      this.showChangeRoomModal = false
    },

    addBooking() {
      this.showBookingModal = false
      this.router.push('/booking/add/' + this.currentItemSelected.id)
    },

    checkIn() {
      this.router.push('/check-in/' + this.currentItemSelected.id)
    },

    hideModalBookingList() {
      this.showBookingModal = false
    },

    getTotalInfo() {
      adminAPI.getTotalInfo().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.number_of_room = res.data.data.number_of_room
          this.number_of_room_empty = res.data.data.number_of_room_empty
          this.number_of_room_busy = res.data.data.number_of_room_busy
          this.booking_coming = res.data.data.booking_coming
        }
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    search() {
      this.loading = true
      let param = {
        "type": this.inputs.type,
        "status": this.inputs.status,
        "floor": this.inputs.floor,
        "state": this.inputs.state
      }
      adminAPI.getBooking(param).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data.floors
          this.itemStorage = JSON.parse(JSON.stringify(this.items))
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    confirmChangeRoom() {
      if(this.changeToRoomId == '') {
        this.toast.error("Hãy chọn phòng muốn đổi")
        return
      }
      this.loadingChangeRoom = true
      let param = {
        "fromRoomId": this.currentItemSelected.id,
        "toRoomId": this.changeToRoomId
      }
      adminAPI.confirmChangeRoom(param).then(res => {
        if(res != null && res.data != null) {
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

    updateRoomState() {
      if(!this.stateChange) {
        this.toast.error("Vui lòng chọn trạng thái phòng muốn cập nhật")
        return
      }
      if(this.currentItemSelected.state_code == this.stateChange) {
        this.showUpdateStateModal = false
        return
      }
      this.loadingUpdateState = true

      let param = {
        "roomId": this.currentItemSelected.id,
        "state": this.stateChange
      }
      adminAPI.updateRoomState(param).then(res => {
        if(res != null && res.data != null) {
          let sel = document.getElementById("roomState")
          let stateName = sel.options[sel.selectedIndex].text
          for (let index in this.items) {
            for (let roomIndex in this.items[index].rooms) {
              if(this.items[index].rooms[roomIndex].id == this.currentItemSelected.id) {
                this.items[index].rooms[roomIndex].state_code = this.stateChange
                this.items[index].rooms[roomIndex].state_name = stateName
                break
              }
            }
          }
        }
        this.showUpdateStateModal = false
        this.loadingUpdateState = false
      }).catch(err => {
        this.showUpdateStateModal = false
        this.loadingUpdateState = false
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    getOptionsRelatedRoom() {
      adminAPI.getOptionRelatedRoom().then(res => {
        if(res && res.data && res.data.data) {
          // Type
          let types = res.data.data.types
          for (let index in types) {
            let type = {
              value: types[index].value,
              text: types[index].text
            }
            this.optionsRoomType.push(type)
          }

          // Master status
          let statuss = res.data.data.statuss
          for (let index in statuss) {
            let status = {
              value: statuss[index].value,
              text: statuss[index].text
            }
            this.optionsRoomStatus.push(status)
          }

          // Floor
          let floors = res.data.data.floors
          for (let index in floors) {
            let floor = {
              value: floors[index].value,
              text: floors[index].text
            }
            this.optionsFloor.push(floor)
          }

          // Master states
          let states = res.data.data.states
          for (let index in states) {
            let state = {
              value: states[index].value,
              text: states[index].text
            }
            this.optionsRoomState.push(state)
          }
        }
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    filterCondition() {
      let floors = JSON.parse(JSON.stringify(this.itemStorage))

      // Filter by status
      if(this.inputs.status) {
        for(let index in floors) {
          floors[index].rooms = floors[index].rooms.filter(i => i.room_status_id == this.inputs.status)
        }
      }

      // Filter by type
      if(this.inputs.type) {
        for(let index in floors) {
          floors[index].rooms = floors[index].rooms.filter(i => i.room_type_id == this.inputs.type)
        }
      }

      // Filter by floor
      if(this.inputs.floor) {
        for(let index in floors) {
          floors[index].rooms = floors[index].rooms.filter(i => i.floor_id == this.inputs.floor)
        }
      }

      // Filter by state
      if(this.inputs.state) {
        for(let index in floors) {
          floors[index].rooms = floors[index].rooms.filter(i => i.state_code == this.inputs.state)
        }
      }

      this.items = floors
    }
  }
}
</script>
