<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center text-header">DANH SÁCH PHÒNG</h4>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <b-row class="ml-2">
                <span style="color: black" >Tổng số phòng: {{number_of_room}} | </span>
                <span style="color: darkblue" class="ml-1"> Phòng trống: {{number_of_room_empty}} | </span>
                <span style="color: darkorange" class="ml-1"> Có khách: {{number_of_room_busy}} | </span>
                <span style="color:  orangered" class="ml-1"> Đang đến:{{booking_coming}} </span>
              </b-row>
              <b-row>
                <b-col md="6" class="mt-2">
                  <button class="btn btn-primary pull-left default-btn-bg fix-width-btn-250"  @click="$router.push ('/booking/search-room')">
                    Tìm phòng trống
                  </button>
                </b-col>
                <b-col md="6" class="mt-2">
                  <button class="btn btn-primary pull-left default-btn-bg fix-width-btn-250" @click="$router.push ('/booking/search-booking')">
                    Tìm thông tin đặt phòng
                  </button>
                </b-col>
              </b-row>

            </b-col>
            <b-col md="6">
              <b-row>

                <b-col md="3">
                  <label> Trạng Thái </label>
                  <b-form-select
                    :options="optionsRoomStatus"
                    id="status"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    @change="filterCondition"
                    v-model="inputs.status">
                  </b-form-select>
                </b-col>

                <b-col md="3">
                  <label> Loại phòng </label>
                  <b-form-select
                    :options="optionsRoomType"
                    id="status"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    @change="filterCondition"
                    v-model="inputs.type"></b-form-select>
                </b-col>

                <b-col md="3">
                  <label> Tầng </label>
                  <b-form-select
                    :options="optionsFloor"
                    id="status"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    @change="filterCondition"
                    v-model="inputs.floor"></b-form-select>
                </b-col>

                <b-col md="3">
                  <label> Tình trạng phòng </label>
                  <b-form-select
                    :options="optionsRoomState"
                    id="status"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    @change="filterCondition"
                    v-model="inputs.state"></b-form-select>
                </b-col>
              </b-row>
            </b-col>
          </b-row>

          <b-row class="list-room" v-for="floor in items" :key="floor.floor_name">
            <b-col md="12">
              <h2 class="text-header">{{floor.floor_name}}</h2>
            </b-col>
            <b-col md="6" v-for="item in floor.rooms" :key="item.name" @click="showModalBookingList(item)">
              <b-row class="mr-3 mt-3">
                <b-col>
                  <b-row v-bind:class="{'bg-buzy': item.room_status_id === 2, 'bg-non-buzy': item.room_status_id !== 2}">
                    <b-col md="6"  class="text-left" >
                      <h2 class="text-white">Phòng: {{item.name}}</h2>
                      <p class="text-silver">Loại: {{item.room_type_name}}</p>
                      <p v-bind:class="{'text-dark font-weight-bold': item.state_code == 'dirty', 'text-danger font-weight-bold': item.state_code == 'fixing', 'text-silver': item.state_code == 'clean'}">Tình trạng: {{item.state_name}}</p>
                    </b-col>
                    <b-col md="6">
                      <p class="text-silver">Trạng thái: {{item.room_status_name}}</p>
                      <p v-if= "item.room_status_id === 2" class="text-silver">Check in:&nbsp;&nbsp;&nbsp; {{item.check_in}}</p>
                      <p v-if= "item.room_status_id === 2" class="text-silver">Check out: {{item.check_out}}</p>
                      <p v-if= "item.room_status_id === 2" class="text-silver">Tạm tính: {{currencyFormat(item.total)}}</p>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more">--Hết--</span>
        </b-card>

      </b-col>
    </b-row>

    <!-- Modal nhan phong-->
    <b-modal centered hide-footer hide-header id="modal-booking" @hide="hideModalBookingList">
      <b-row class="boder-bottom">
        <b-col class="text-center text-header">
          <h5>Phòng: {{this.currentItemSelected.name}}</h5>
        </b-col>
      </b-row>
      <br>

      <b-row>
        <b-col class="text-left mt-2" md="6" v-show="currentItemSelected.room_status_id == 1">
          <button class="btn btn-primary px-4 default-btn-bg btn-large" @click="addBooking">
            Đặt phòng
          </button>
        </b-col>
        <b-col class="text-left mt-2" md="6"  v-show="currentItemSelected.room_status_id == 1">
          <button class="btn btn-primary px-4 default-btn-bg btn-large" @click="checkIn">
            Nhận phòng nhanh
          </button>
        </b-col>

        <b-col class="text-left mt-2" md="6" v-show="currentItemSelected.room_status_id == 2">
          <button class="btn btn-primary px-4 default-btn-bg btn-large" @click="goToPayment">
            Thông tin thanh toán
          </button>
        </b-col>
        <b-col class="text-left mt-2" md="6">
          <button class="btn btn-primary px-4 default-btn-bg btn-large" @click="showModalUpdateRoomState">
            Cập nhật tình trạng phòng
          </button>
        </b-col>

        <b-col class="text-left mt-2" md="6" v-show="currentItemSelected.room_status_id == 2">
          <button class="btn btn-primary px-4 default-btn-bg btn-large" @click="showModalChangeRoom">
            Đổi phòng
          </button>
        </b-col>

      </b-row>
    </b-modal>

    <!-- Modal cập nhật tình trạng phòng -->
    <b-modal centered hide-footer hide-header id="modal-update-room-state">

      <b-row class="boder-bottom mb-2">
        <b-col md="12" class="text-center text-header">
          <h5>Phòng: {{currentItemSelected.name}}</h5>
        </b-col>
      </b-row>


      <b-row class="mb-2">
        <b-col md="12">
          Tình trạng phòng hiện tại: <b>{{currentItemSelected.state_name}}</b>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          Cập nhật thành:
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <b-form-select
                :options="optionsRoomState"
                id="roomState"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="stateChange">
          </b-form-select>
        </b-col>
      </b-row>

      <b-row class="boder-top mt-3">
        <b-col cols="6">
          <b-button variant="secondary" class="pull-left px-4 btn-width-120" block @click="hideModalUpdateRoomState">
            Hủy
          </b-button>
        </b-col>
        <b-col cols="6">
          <!-- Loading -->
          <span class="loading-more" v-show="loadingUpdateState"><icon name="loading" width="60" /></span>
          <b-button v-show="!loadingUpdateState" variant="outline-success"
                    class="pull-right btn-width-120" @click="updateRoomState">
            Xác nhận
          </b-button>
        </b-col>
      </b-row>
    </b-modal>

    <!-- Modal đổi phòng -->
    <b-modal centered hide-footer hide-header id="modal-change-room">

      <b-row class="boder-bottom mb-2">
        <b-col md="12" class="text-center text-header">
          <h5>Phòng hiện tại: {{currentItemSelected.name}} ({{currentItemSelected.room_type_name}})</h5>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          Đổi tới phòng:
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12" v-show="!loadingEmptyRoom && textEmptyRoom == ''">
          <b-form-select
                :options="optionsEmptyRoom"
                id="roomEmpty"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="changeToRoomId">
          </b-form-select>
        </b-col>
        <b-col md="12" v-show="loadingEmptyRoom">
          <span class="loading-more" v-show="loadingEmptyRoom"><icon name="loading" width="60" /></span>
        </b-col>
        <b-col md="12" v-show="!loadingEmptyRoom && textEmptyRoom != ''">
          <span class="loading-more">{{textEmptyRoom}}</span>
        </b-col>
      </b-row>

      <b-row class="boder-top mt-3">
        <b-col cols="6">
          <b-button variant="secondary" class="pull-left px-4" block @click="hideModalChangeRoom">
            Hủy
          </b-button>
        </b-col>
        <b-col cols="6">
          <!-- Loading -->
          <span class="loading-more" v-show="loadingChangeRoom"><icon name="loading" width="60" /></span>
          <button v-show="!loadingChangeRoom" class="btn btn-primary px-4 default-btn-bg pull-right" @click="confirmChangeRoom">
            Xác nhận
          </button>
        </b-col>
      </b-row>
    </b-modal>

  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Cookies from 'js-cookie'

export default {
  data () {
    return {
      inputs: {
        status: null,
        type: null,
        floor: null,
        state: null
      },
      // modalCurrentId: null,
      // modalCurrentName: null,
      // modalCurrentRoomStatusId: null,
      // modalCurrentRoomStatusName: null,
      // modalCurrentRoomStateName: null,
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
      changeToRoomId: ''
    }
  },
  computed: {
  },
  //   beforeMount() {
  //     console.log("mount")
  //   let user = Cookies.get(Constant.APP_USR)
  //   if(user && user != undefined) {
  //       console.log("init socket")
  //     user = JSON.parse(user)
  //     // var socket = new WebSocket("wss://" + Constant.ROOT_API + "/join-group/NOTI-" + user.hotelId)
  //       var socket = new WebSocket("ws://127.0.0.1:8000/join-group/NOTI-" + user.hotelId)
  //       socket.onopen = event => {
  //           console.log('connected')
  //           this.connected = true
  //           socket.send({})
  //       }
  //       socket.onmessage = event => {
  //         console.log("onmessage")
  //         let json_data = JSON.parse(event.data)
  //         let data = json_data.text
  //           let actions = data.actions
  //           let user_owner_id = data.user_owner_id
  //           console.log(json_data)
  //
  //           // Check actions, do some things
  //           if("load_list_room" in actions) {
  //               console.log("Vào action load_list_room")
  //             this.methods.search()
  //           }
  //       }
  //       socket.onclose = event => {
  //         this.connected = false
  //       }
  //   }
  // },
  mounted() {
      this.initSocket()

    // Get options related room
    this.getOptionsRelatedRoom()

    this.search()

      // Get total info
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

    /**
   * Make toast without title
   */
    showModalBookingList(item) {
      this.currentItemSelected = JSON.parse(JSON.stringify(item))

      this.$bvModal.show('modal-booking')
    },

    /**
     * Go to payment
     */
    goToPayment() {
        this.$bvModal.hide('modal-booking')

      this.$router.push('/booking/payment/' + this.currentItemSelected.payment_id)
    },

     /**
      * Show modal update room state
      **/
     showModalUpdateRoomState() {
        this.$bvModal.hide('modal-booking')
        this.$bvModal.show('modal-update-room-state')
     },

      /**
      * Show modal change room
      **/
     showModalChangeRoom() {
        this.$bvModal.hide('modal-booking')
        this.$bvModal.show('modal-change-room')

          // Get list empty room
          this.getListEmptyRoom()
     },

      /**
       * Get list empty room
       */
      getListEmptyRoom() {
        this.loadingEmptyRoom = true
        this.textEmptyRoom = ''

        // Get list empty room
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

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
    },

    /**
     * Hide modal update room state
     **/
    hideModalUpdateRoomState() {
       this.$bvModal.hide('modal-update-room-state')
    },

    /**
     * Hide modal change room
     **/
    hideModalChangeRoom() {
       this.$bvModal.hide('modal-change-room')
    },

    addBooking() {
      this.$bvModal.hide('modal-booking')
      this.$router.push('/booking/add/' + this.currentItemSelected.id)
    },
    checkIn() {
      this.$router.push('/check-in/' + this.currentItemSelected.id)
    },
    removeBooking() {
      this.$router.push('/booking/payment/' + this.currentItemSelected.id)
    },
    hideModalBookingList() {
      // this.mergeTableId = []

      this.$bvModal.hide('modal-booking')
    },
    hideModalRemoveBookingList() {
      this.$bvModal.hide('modal-remove-booking')
    },
    hideModalStatusBookingList() {
      this.$bvModal.hide('modal-booking-check')
    },
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      })
    },
    getPrice(item) {
      item.map( function(value, key) {
        if(value.room_status_id === 2){
        }
      })
    },

      /**
       * Get total info
       */
      getTotalInfo() {
        adminAPI.getTotalInfo().then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.number_of_room = res.data.data.number_of_room
            this.number_of_room_empty = res.data.data.number_of_room_empty
            this.number_of_room_busy = res.data.data.number_of_room_busy
            this.booking_coming = res.data.data.booking_coming
          }
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      },

    /**
     *  Search
     */
    search() {
      this.loading = true
      // Search
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
          this.getPrice(this.items)
        }
        this.loading = false
      }).catch(err => {
        this.loading = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     *  Confirm change room
     */
    confirmChangeRoom() {
      if(this.changeToRoomId == '') {
          this.popToast('danger', "Hãy chọn phòng muốn đổi")
          return
      }
      this.loadingChangeRoom = true
      // Search
      let param = {
        "fromRoomId": this.currentItemSelected.id,
        "toRoomId": this.changeToRoomId
      }
      adminAPI.confirmChangeRoom(param).then(res => {
        if(res != null && res.data != null) {
          this.search()
          this.$bvModal.hide('modal-change-room')
        }
        this.loadingChangeRoom = false
      }).catch(err => {
        this.loadingChangeRoom = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Update room state
     */
    updateRoomState() {
      // Validate
      if(!this.stateChange) {
        this.popToast('danger', "Vui lòng chọn trạng thái phòng muốn cập nhật")
          return
      }
      if(this.currentItemSelected.state_code == this.stateChange) { // TODO
        this.$bvModal.hide('modal-update-room-state')
        return
      }
      this.loadingUpdateState = true

      // Search
      let param = {
        "roomId": this.currentItemSelected.id,
        "state": this.stateChange
      }
      adminAPI.updateRoomState(param).then(res => {
        if(res != null && res.data != null) {
          // Update room state in list
          let sel = document.getElementById("roomState");
          let stateName = sel.options[sel.selectedIndex].text
          for (let index in this.items) {
            if(this.items[index].id == this.currentItemSelected.id) {
               this.items[index].state_code = this.stateChange
                this.items[index].state_name = stateName
              break
            }
          }

        }
        this.$bvModal.hide('modal-update-room-state')
        this.loadingUpdateState = false
      }).catch(err => {
        this.$bvModal.hide('modal-update-room-state')
        this.loadingUpdateState = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
       * Get option related room
       */
      getOptionsRelatedRoom() {
        adminAPI.getOptionRelatedRoom().then(res => {

          // Add option from db
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
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      },

    /**
   * Currency format
   */
    currencyFormat(num) {
        let result = ""
        if(num) {
            result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }

      return result
    },

      /**
       * Filter condition
       */
      filterCondition() {
          let floors = JSON.parse(JSON.stringify(this.itemStorage))

          // Filter by status
          if(this.inputs.status) {
              for(let index in floors) {
                  floors[index].rooms = floors[index].rooms.filter( i => i.room_status_id == this.inputs.status );
              }
          }

          // Filter by type
          if(this.inputs.type) {
              for(let index in floors) {
                  floors[index].rooms = floors[index].rooms.filter( i => i.room_type_id == this.inputs.type );
              }
          }

          // Filter by floor
          if(this.inputs.floor) {
              for(let index in floors) {
                  floors[index].rooms = floors[index].rooms.filter( i => i.floor_id == this.inputs.floor );
              }
          }

          // Filter by state
          if(this.inputs.state) {
              for(let index in floors) {
                  floors[index].rooms = floors[index].rooms.filter( i => i.state_code == this.inputs.state );
              }
          }

          this.items = floors
      }
  }
}
</script>
<style lang="scss">

  .bg-buzy {
    background-color: #1d97c2;
    color: white !important;
    border-radius: 20px;
  }
  .bg-non-buzy {
    background-color: #919396;
    color: white !important;
    border-radius: 20px;
  }
  .btn-large {
    width: 100% !important;
  }
  .list-room {
    color: white !important;
    margin-top: 10px;
  }
  .list-room h2 p {
    color: white !important;
  }
  .text-white {
    color: white !important;
  }
  .text-silver {
    color: #dddddd !important;
  }
  .fix-width-btn-250 {
    width: 200px;
  }

</style>
