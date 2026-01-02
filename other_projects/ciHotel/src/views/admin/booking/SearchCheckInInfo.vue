<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='4'>
              <b-button variant="outline-secondary" class="pull-left btn-width-120" @click.prevent="goBack()">
                Quay lại
              </b-button>
            </b-col>
            <b-col md='8'>
              <h4 class="text-center text-header">THÔNG TIN KHÁCH ĐANG Ở</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row>
            <b-col md="3">
              <label> Tên khách </label>
              <input
                id="name"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.name">
            </b-col>
            <b-col md="3">
              <label>Số điện thoại </label>
              <input
                id="std"
                type="number"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.sdt">
            </b-col>
            <b-col md="3">
              <label>Chứng minh nhân dân </label>
              <input
                id="cmnd"
                type="number"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.cmnd">
            </b-col>

            <b-col md="3">
              <label class="label-width text-white">
                 Tìm kiếm
              </label>
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch" @click.prevent="prepareToSearch">
                Tìm Kiếm
              </b-button>
            </b-col>

          </b-row>

          <b-row>
            <b-col>
              Số kết quả: {{totalRow}}
            </b-col>
          </b-row>

          <b-table
            hover
            bordered
            stacked="md"
            :fields="fields"
            :items="items">
            <template v-slot:cell(adult)="data">
              <span>- {{ data.item.adult }} Người lớn</span><br>
              <span v-show="data.item.children != 0">- {{ data.item.children }} Trẻ em</span>
            </template>
            <template v-slot:cell(cmnd_number)="data">
              <p>{{ data.item.cmnd_number }}</p>
              <div v-show="data.item.cmnd_image_front || data.item.cmnd_image_end">
                <span>
                  Ảnh cmnd/cccd:
                  <i v-show="!isShowCMNDImage" class="fa fa-plus pl-3" @click="isShowCMNDImage = !isShowCMNDImage"></i>
                  <i v-show="isShowCMNDImage" class="fa fa-minus pl-3" @click="isShowCMNDImage = !isShowCMNDImage"></i>
                </span>
                <div v-show="isShowCMNDImage">
                  <img  :src="data.item.cmnd_image_front" style="width: 100%; height: auto; max-width: 200px">
                  <img  :src="data.item.cmnd_image_end" style="width: 100%; height: auto; max-width: 200px">
                </div>
              </div>

            </template>
            <template v-slot:cell(action)="dataId">
              <b-list-group horizontal>
                <b-button variant="outline-primary" class="btn btn-width-120 mt-1"  @click="$router.push ('/update-check-in-info/' + dataId.item.booking_id)">
                  Sửa
                </b-button>
              </b-list-group>

              <b-list-group horizontal>
                <b-button variant="outline-success" class="btn btn-width-120 mt-1"  @click="showModalChangeRoom(dataId.item)">
                  Đổi phòng
                </b-button>
              </b-list-group>

              <b-list-group horizontal>
                <b-button variant="outline-danger" class="btn btn-width-120 mt-1"  @click="$router.push ('/booking/payment/' + dataId.item.payment_id)">
                  Thanh toán
                </b-button>
              </b-list-group>
            </template>
          </b-table>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more">--Hết--</span>
        </b-card>

      </b-col>
    </b-row>

    <!-- Modal đổi phòng -->
    <b-modal centered hide-footer hide-header id="modal-change-room">

      <b-row class="boder-bottom mb-2">
        <b-col md="12" class="text-center text-header">
          <h5>Phòng hiện tại: {{currentItemSelected.room_name}} ({{currentItemSelected.room_type_name}})</h5>
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


export default {
  data () {
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
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'customer_name',
          label: 'Tên khách'
        },
        {
          key: 'phone_number',
          label: 'Số điện thoại'
        },
        {
          key: 'cmnd_number',
          label: 'CMND'
        },
        {
          key: 'room_name',
          label: 'Tên phòng'
        },
        {
          key: 'room_type_name',
          label: 'Loại phòng'
        },
        {
          key: 'check_in',
          label: 'Ngày nhận phòng'
        },
        {
          key: 'check_out',
          label: 'Ngày trả phòng'
        },
        {
          key: 'adult',
          label: 'Số lương khách'
        },
        {
          key: 'action',
          label: '',
          class: 'actions-cell'
        }
      ],
      optionsEmptyRoom: [{value: null, text: ''}],
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
      isShowCMNDImage: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)
    this.search()
  },
  methods: {
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      })
    },

    /**
     *  Processing on scroll: use for paging
     */
    onScroll (event) {
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
          this.search ()
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
     *  Search
     */
    search() {
      this.loading = true

      // Search
      let param = {
        "name": this.inputs.name,
        "sdt": this.inputs.sdt,
        "cmnd": this.inputs.cmnd,
        "status": this.inputs.status,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      adminAPI.searchCheckInInfo(param).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data.bookings
          console.log(res.data.data.bookings)
          this.totalRow = res.data.data.total_row
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
    * Show modal change room
    **/
   showModalChangeRoom(bookingInfo) {
      this.$bvModal.hide('modal-booking')
      this.$bvModal.show('modal-change-room')

        console.log("aaaaaaaa")
        this.currentItemSelected = bookingInfo
        console.log(bookingInfo)

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
      adminAPI.getListEmptyRoom(this.currentItemSelected.room_id).then(res => {
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
        "fromRoomId": this.currentItemSelected.room_id,
        "toRoomId": this.changeToRoomId
      }
      adminAPI.confirmChangeRoom(param).then(res => {
        if(res != null && res.data != null) {
          this.search()
          this.$bvModal.hide('modal-change-room')
        }
        console.log(this.items)
        this.loadingChangeRoom = false
      }).catch(err => {
        this.loadingChangeRoom = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Hide modal change room
     **/
    hideModalChangeRoom() {
       this.$bvModal.hide('modal-change-room')
    },

    /**
     * Only input date
     */
    inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },

    /**
     * Currency format
     */
    currencyFormat(num) {
      let result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      return result
    },

    /**
     * Go to table list
     */
    goBack() {
      this.$router.push('/booking/list-room')
    },
  }
}
</script>
