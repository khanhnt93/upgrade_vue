<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">
            <b-row>
              <b-col cols="6">
                <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="back">
                  Quay lại
                </b-button>
              </b-col>
              <b-col cols="6">
                <b-button variant="outline-success" class="pull-right btn-width-120" @click="save" :disabled="saving">
                  Lưu
                </b-button>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-1 text-center text-header">PHÒNG</h4>
              </b-col>
            </b-row>
            <hr/>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Tên </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <input
                  id="name"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="room.name">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorName">
                  Đây là mục bắt buộc nhập
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>  Tầng </label>
              </b-col>
              <b-col md="9">
                <b-form-select
                  :options="optionsFloor"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="room.floor_id">
                </b-form-select>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>  Loại phòng </label>
              </b-col>
              <b-col md="9">
                <b-form-select
                  :options="optionsRoomType"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="room.room_type_id">
                </b-form-select>
              </b-col>
            </b-row>

            <!--<b-row class="form-row">-->
              <!--<b-col md="3" class="mt-2">-->
                <!--<label> Trạng thái phòng </label><span class="error-sybol"></span>-->
              <!--</b-col>-->
              <!--<b-col md="9">-->
                <!--<b-form-select-->
                  <!--:options="optionsRoomStatus"-->
                  <!--type="text"-->
                  <!--autocomplete="new-password"-->
                  <!--class="form-control"-->
                  <!--v-model="room.room_status_id">-->
                <!--</b-form-select>-->
              <!--</b-col>-->
            <!--</b-row>-->

            <!--<b-row class="form-row">-->
              <!--<b-col md="3" class="mt-2">-->
                <!--<label> Tình trạng phòng </label><span class="error-sybol"></span>-->
              <!--</b-col>-->
              <!--<b-col md="9">-->
                <!--<b-form-select-->
                  <!--:options="optionsMasterState"-->
                  <!--type="text"-->
                  <!--autocomplete="new-password"-->
                  <!--class="form-control"-->
                  <!--v-model="room.room_state">-->
                <!--</b-form-select>-->
              <!--</b-col>-->
            <!--</b-row>-->

            <b-row>
              <b-col md="6">
                <b-row class="form-row">
                  <b-col md="6" class="mt-2">
                    <label> Giá tiền </label><span class="error-sybol"></span>
                  </b-col>
                  <b-col md="6">
                    <b-list-group horizontal>
                      <b-list-group-item @click="showModalPrice">
                        <i class="fa fa-plus"/>
                      </b-list-group-item>
                    </b-list-group>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="6" class="mt-2">
                    <label> Thông tin phòng </label><span class="error-sybol"></span>
                  </b-col>
                  <b-col md="6">
                    <b-list-group horizontal>
                      <b-list-group-item @click="showModalRoomInfo">
                        <i class="fa fa-plus"/>
                      </b-list-group-item>
                    </b-list-group>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="6" class="mt-2">
                    <label> Thiết bị trong phòng </label><span class="error-sybol"></span>
                  </b-col>
                  <b-col md="6">
                    <b-list-group horizontal>
                      <b-list-group-item @click="showModalRoomDevice">
                        <i class="fa fa-plus"/>
                      </b-list-group-item>
                    </b-list-group>
                  </b-col>
                </b-row>
              </b-col>

              <b-col md="6">
                <b-row v-show="this.room.price.length > 0">
                  <b-col>
                    <p><b>Giá phòng: </b></p>
                    <p class="col-12" v-for="item in this.room.price" :key="item.code">
                      <label>- {{currencyFormat(item.room_price) + ': ' + item.name}}</label>
                      <i class="fa fa-trash" @click="deleteResourcePrice(item.code)"/>
                    </p>
                  </b-col>
                </b-row>

                <b-row v-show="this.room.room_info.length > 0">
                  <b-col>
                    <p><b>Thông tin phòng: </b></p>
                    <p class="col-12" v-for="item in this.room.room_info" :key="item.id">
                      <label>- {{item.name + ": " + item.room_info_count}}</label>
                      <i class="fa fa-trash" @click="deleteResourceInfo(item.id)"/>
                    </p>
                  </b-col>
                </b-row>

                <b-row v-show="this.room.room_device.length > 0">
                  <b-col>
                    <p><b>Thiết bị trong phòng: </b></p>
                    <p class="col-12" v-for="item in this.room.room_device" :key="item.id">
                      <label>- {{item.name + ': ' + item.device}}</label>
                      <i class="fa fa-trash" @click="deleteResource(item.id)"/>
                    </p>
                  </b-col>
                </b-row>

              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <!-- Modal choose price -->
    <b-modal centered hide-footer hide-header id="modal-choose-price">
      <b-row>
        <b-col class="text-center text-header">
          <h5>Đặt giá phòng theo thời gian</h5>
        </b-col>
      </b-row>
      <br>
      <b-row>
        <b-col>
          <p class="col-12" v-for="item in this.room.price" :key="item.code">
            <label>- {{currencyFormat(item.room_price) + ': ' + item.name}}</label>
            <i class="fa fa-trash" @click="deleteResourcePrice(item.code)"/>
          </p>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <div>
            <div class="form-group">
              <label> Thời gian </label><span class="error-sybol"></span>
              <b-form-select
                :options="optionsMasterTime"
                id="masterPrice"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="resource_price.code"
                @change="changeResourcePrice">
              </b-form-select>
            </div>
            <div class="form-group">
              <label> Giá phòng </label><span class="error-sybol"></span>
              <div class="input-group">
                <input
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="resource_price.room_price"
                  @keyup="integerOnly($event.target)"
                  maxlength="11">
                <label class="pl-2">{{unitResourcePrice}}</label>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="text-center">
          <button class="btn btn-primary px-4 default-btn-bg " @click="addGroupResourcePrice">
            Thêm
          </button>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12" class="text-right mt-3">
          <button class="btn btn-primary px-4 default-btn-bg" @click="confirmResourcePrice">
            Xác nhận
          </button>
        </b-col>
      </b-row>

    </b-modal>

    <!-- Modal choose room info -->
    <b-modal centered hide-footer hide-header id="modal-choose-room-info">
      <b-row>
        <b-col class="text-center text-header">
          <h5> Thông tin phòng</h5>
        </b-col>
      </b-row>
      <br>
      <b-row>
        <b-col>
          <p class="col-12" v-for="item in this.room.room_info" :key="item.id">
            <label>- {{item.name + ": " + item.room_info_count}}</label>
            <i class="fa fa-trash" @click="deleteResourceInfo(item.id)"/>
          </p>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <div>
            <div class="form-group">
              <label>Thông tin phòng :</label><span class="error-sybol"></span>
              <b-form-select
                :options="optionsRoomInfo"
                id="roomInfo"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="resource_room_info.id"
                @change="changeResourceInfo">
              </b-form-select>
            </div>
            <div class="form-group">
              <label>Mô tả</label><span class="error-sybol"></span>
              <div class="input-group">
                <input
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="resource_room_info.room_info_count"
                  maxlength="11">
                <label class="pl-2">{{unitResourceInfo}}</label>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="text-center">
          <button class="btn btn-primary px-4 default-btn-bg " @click="addGroupResourceInfo">
            Thêm
          </button>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12" class="text-right mt-3">
          <button class="btn btn-primary px-4 default-btn-bg" @click="confirmResourceInfo">
            Xác nhận
          </button>
        </b-col>
      </b-row>
    </b-modal>

    <!-- Modal choose room device -->
    <b-modal centered hide-footer hide-header id="modal-choose-room-device">
      <b-row>
        <b-col class="text-center text-header">
          <h5>Thiết bị</h5>
        </b-col>
      </b-row>
      <br>
      <b-row>
        <b-col>
          <p class="col-12" v-for="item in this.room.room_device" :key="item.id">
            <label>- {{item.name + ': ' + item.device}}</label>
            <i class="fa fa-trash" @click="deleteResource(item.id)"/>
          </p>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <div>
            <div class="form-group">
              <label>Thiết bị :</label><span class="error-sybol"></span>
              <b-form-select
                :options="optionsRoomDevice"
                id="deviceName"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="resource_device.id"
                @change="changeResource">
              </b-form-select>
            </div>
            <div class="form-group">
              <label>Số lượng</label><span class="error-sybol"></span>
              <div class="input-group">
                <input
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="resource_device.device"
                  @keyup="integerOnly($event.target)"
                  maxlength="11">
                <label class="pl-2">{{unitResource}}</label>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="text-center">
          <button class="btn btn-primary px-4 default-btn-bg " @click="addGroupResource">
            Thêm
          </button>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12" class="text-right mt-3">
          <button class="btn btn-primary px-4 default-btn-bg" @click="confirmResource">
            Xác nhận
          </button>
        </b-col>
      </b-row>

    </b-modal>
  </div>
</template>


<script>
  import adminAPI from '@/api/admin'
  import Mapper from '@/mapper/menu'
  import GMMapper from '@/mapper/group_menu'
  import VueCropper from 'vue-cropperjs'
  import 'cropperjs/dist/cropper.css'
  import commonFunc from '@/common/commonFunc'


  export default {
    components: {
      VueCropper
    },
    data () {
      return {
        room: {
          "id": null,
          "name": null,
          "floor_id": null,
          "room_type_id": null,
          "room_status_id": null,
          "room_state": null,
          "price": [],
          "room_info": [],
          "room_device": [],
          "status": null,
        },
        optionsFloor: [{value: null, text: ''}],
        optionsRoomStatus: [{value: null, text: ''}],
        optionsRoomType: [{value: null, text: ''}],
        optionsRoomInfo: [{value: null, text: ''}],
        optionsRoomDevice: [{value: null, text: ''}],
        optionsMasterTime: [{value: null, text: ''}],
        optionsMasterState: [{value: null, text: ''}],

        file: null,
        height: '100px',
        styleImg: {},
        saving: false,
        click: false,
        optionDefault: "false",
        loading: false,
        resource: {id: '', quantity: ''},
        resource_device: {id: '', device: ''},
        resource_room_info: {id: '', room_info_count: ''},
        resource_price: {code: '', name: '', room_price: ''},
        unitResource: null,
        unitResourceInfo: null,
        unitResourcePrice: null,
        resourceChosen: [],
        resourceChosenInfo: [],
        resourceChosenPrice: []
      }
    },
    mounted() {
      // Get options related room
      this.getOptionsRelatedRoom()

      // Get room detail
      this.getRoomDetail()

      // // Get room status options
      // this.getOptionsRoomStatus()
      //
      // // Get room type
      // this. getOptionsRoomType()
      // this. getOptionsRoomInfo()
      // this. getOptionsRoomDevice()
      // this. getOptionsMasterTime()


    },
    computed: {
      computedWidth() {
        return this.height
      },
      computedImg() {
        return this.styleImg
      },
      errorName: function () {
        return this.checkInfo(this.room.name)
      },


    },
    methods: {
      checkInfo (info) {
        return (this.click && (info == null || info.length <= 0))
      },
      checkValidate () {
        return !(this.errorName )
      },

      /**
       * Make toast without title
       */
      popToast(variant, content) {
        this.$bvToast.toast(content, {
          toastClass: 'my-toast',
          noCloseButton: true,
          variant: variant,
          autoHideDelay: 3000
        })
      },

      /**
       * Prepare info to save
       */
      save() {
        this.saving = true
        this.click = true
        let result = this.checkValidate()
        if(!result) {
          this.saving = false
          return
        }
        if(result) {
          let roomId = this.$route.params.id
          if(roomId){
            this.room.id = roomId

            adminAPI.editRoom(this.room).then(res => {
              this.saving = false
              if(res != null && res.data != null){
                // Show notify edit success
                this.popToast('success', 'Lưu menu thành công!!! ')
              }else{
                // Show notify edit fail
                this.popToast('danger', 'Lưu menu thất bại!!! ')
              }
            }).catch(err => {
              this.saving = false

              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.popToast('danger', errorMess)
            })
          } else {
            // Add
            adminAPI.addRoom(this.room).then(res => {
              this.saving = false
              if(res != null && res.data != null){
                // Go to list
                this.$router.push('/room/list')
              }else{
                // Show notify add fail
                this.popToast('danger', 'Lưu menu thất bại!!! ')
              }
            }).catch(err => {
              this.saving = false
              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.popToast('danger', errorMess)
            })
          }
        }
      },

      /**
       * Show modal choose option
       */
      showModalPrice() {
        this.$bvModal.show('modal-choose-price')
      },

      /**
       * Show modal choose topping
       */
      showModalRoomInfo() {
        this.$bvModal.show('modal-choose-room-info')
      },

      /**
       * Show modal choose resource
       */
      showModalRoomDevice() {
        this.$bvModal.show('modal-choose-room-device')
      },

      /**
       * Back to list
       */
      back() {
        // Go to list
        this.$router.push('/room/list')
      },

      /**
       * Currency format
       */
      currencyFormat(num) {
        if(num) {
          let result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          return result
        }
      },

      /**
       * Only input integer
       */
      integerOnly(item) {
        let valueInput = item.value
        let result = commonFunc.intergerOnly(valueInput)
        item.value = result
      },

      /**
       * Get menu detail
       */
      getRoomDetail() {
        let hotelId = this.$route.params.id
        if(hotelId){
          this.loading = true

          adminAPI.getRoomDetail(hotelId).then(res => {
            if(res != null && res.data != null && res.data.data != null) {
              this.room = res.data.data
              // this.room.room_device = res.data.data.room_device
              // this.room.room_info = res.data.data.room_info
              // this.room.price = JSON.parse(this.room.price)
              // this.resourceChosen = JSON.parse(this.room.room_device)
              // this.resourceChosenInfo = JSON.parse(this.room.room_info)
              //this.resourceChosenPrice = JSON.parse(this.room.price)
            }
            console.log(this.room)
            this.loading = false
          }).catch(err => {
            console.log(err)
            this.loading = false

            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
      },

      /**
       * Get unit by resource id
       */
      getUnitByResourceId(id) {
        for(let index in this.optionsRoomDevice) {
          if(this.optionsRoomDevice[index].value == id) {
            return this.optionsRoomDevice[index]
          }
        }
        return ""
      },
      getUnitInByResourceInfoId(id) {
        for(let index in this.optionsRoomInfo) {
          if(this.optionsRoomInfo[index].value == id) {
            return this.optionsRoomInfo[index]
          }
        }
        return ""
      },
      /**
       * Event change resource
       */
      changeResource() {
        if(this.resource.id) {
          let item = this.getUnitByResourceId(this.resource.id)
          if(item) {
            this.unitResource = item.unit
          }
        }
      },
      changeResourceInfo() {
        if(this.resource.id) {
          let item = this.getUnitInByResourceInfoId(this.resource.id)
          if(item) {
            this.unitResourceInfo = item.unit
          }
        }
      },
      changeResourcePrice() {
        if(this.resource.id) {
          let item = this.getUnitInByResourcePriceId(this.resource.id)
          if(item) {
            this.unitResourcePrice = item.unit
          }
        }
      },
      /**
       * Check exist resource id
       */
      checkExistResourceId(id) {
        for (let index in this.room.room_device) {
          if(this.room.room_device[index].id == id) {
            return true
          }
        }
        return false
      },
      checkExistResourceInfoId(id) {
        for (let index in this.room.room_info) {
          if(this.room.room_info[index].id == id) {
            return true
          }
        }
        return false
      },
      checkExistResourcePriceId(code) {
        for (let index in this.room.price) {
          if(this.room.price[index].code == code) {
            return true
          }
        }
        return false
      },
      /**
       * Add group resource
       */
      addGroupResource() {
        if(this.resource_device.id && this.resource_device.device) {
          // Check exist resource id
          if(!this.checkExistResourceId(this.resource_device.id)) {
            var sel = document.getElementById("deviceName");
            var deviceName = sel.options[sel.selectedIndex].text;
            let item = {
              id: JSON.parse(JSON.stringify(this.resource_device.id)),
              name: deviceName,
              device: JSON.parse(JSON.stringify(this.resource_device.device))
            }
            this.room.room_device.push(item)

            // Reset value
            this.resource_device.id = ''
            this.resource_device.name = ''
            this.resource_device.device = ''
          } else {
            this.popToast('danger', 'Thiết bị đã tồn tại')
          }
        } else {
          this.popToast('danger', 'Vui lòng nhập đủ các mục yêu cầu')
        }
      },

      addGroupResourceInfo() {
        if(this.resource_room_info.id && this.resource_room_info.room_info_count) {
          // Check exist resource id
          if(!this.checkExistResourceInfoId(this.resource_room_info.id)) {
            var sel = document.getElementById("roomInfo");
            var infoName = sel.options[sel.selectedIndex].text;
            let item = {
              id: JSON.parse(JSON.stringify(this.resource_room_info.id)),
              name: infoName,
              room_info_count: JSON.parse(JSON.stringify(this.resource_room_info.room_info_count))
            }
            this.room.room_info.push(item)

            // Reset value
            this.resource_room_info.id = ''
            this.resource_room_info.name = ''
            this.resource_room_info.room_info_count = ''
          } else {
            this.popToast('danger', 'Thông tin đã tồn tại')
          }
        } else {
          this.popToast('danger', 'Vui lòng nhập đủ các mục yêu cầu')
        }
      },

      addGroupResourcePrice() {
        if(this.resource_price.code && this.resource_price.room_price) {
          // Check exist resource id
          if(!this.checkExistResourcePriceId(this.resource_price.code)) {
            var sel = document.getElementById("masterPrice");
            var priceName= sel.options[sel.selectedIndex].text;
            let item = {
              code: JSON.parse(JSON.stringify(this.resource_price.code)),
              name: priceName,
              room_price: JSON.parse(JSON.stringify(this.resource_price.room_price))
            }
            this.room.price.push(item)

            // Reset value
            this.resource_price.code = ''
            this.resource_price.name = ''
            this.resource_price.room_price = ''
          } else {
            this.popToast('danger', 'Trùng giờ')
          }
        } else {
          this.popToast('danger', 'Vui lòng nhập đủ các mục yêu cầu')
        }
      },

      /**
       * Confirm resource
       */
      confirmResource() {
        this.$bvModal.hide('modal-choose-room-device')
      },
      confirmResourceInfo() {
        this.$bvModal.hide('modal-choose-room-info')
      },
      confirmResourcePrice() {
        this.$bvModal.hide('modal-choose-price')
      },
      /**
       * Get index by id
       */
      getIndexById(id) {
        let index = 0
        for(var i in this.room.room_device) {
          if(this.room.room_device[i].id == id) {
            return index
          }
          index += 1
        }
        return false
      },
      getIndexByIdInfo(id) {
        let index = 0
        for(var i in this.room.room_info) {
          if(this.room.room_info[i].id == id) {
            return index
          }
          index += 1
        }
        return false
      },
      getIndexByIdPrice(code) {
        let index = 0
        for(var i in this.room.price) {
          if(this.room.price[i].code == code) {
            return index
          }
          index += 1
        }
        return false
      },
      /**
       * Remove resource
       */
      deleteResource(id) {

        // Get index pmt by id
        let indexTemp = this.getIndexById(id)

        if(indexTemp !== false) {
          this.room.room_device.splice(indexTemp, 1)
        }
      },

      deleteResourceInfo(id) {

        // Get index pmt by id
        let indexTemp = this.getIndexByIdInfo(id)

        if(indexTemp !== false) {
          this.room.room_info.splice(indexTemp, 1)
        }
      },
      deleteResourcePrice(code) {

        // Get index pmt by id
        let indexTemp = this.getIndexByIdPrice(code)

        if(indexTemp !== false) {
          this.room.price.splice(indexTemp, 1)
        }
      },

      /**
       * Get option related room
       */
      getOptionsRelatedRoom() {
        adminAPI.getOptionRelatedRoom().then(res => {

          // Add option from db
          if(res && res.data && res.data.data) {

            // Floor
            let floors = res.data.data.floors
            for (let index in floors) {
              let floor = {
                value: floors[index].value,
                text: floors[index].text
              }
              this.optionsFloor.push(floor)
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

            // Type
            let types = res.data.data.types
            for (let index in types) {
              let type = {
                value: types[index].value,
                text: types[index].text
              }
              this.optionsRoomType.push(type)
            }

            // Info
            let infos = res.data.data.infos
            for (let index in infos) {
              let info = {
                value: infos[index].value,
                text: infos[index].text
              }
              this.optionsRoomInfo.push(info)
            }

            // Device
            let devices = res.data.data.devices
            for (let index in devices) {
              let device = {
                value: devices[index].value,
                text: devices[index].text
              }
              this.optionsRoomDevice.push(device)
            }

            // Master time
            let times = res.data.data.times
            for (let index in times) {
              let time = {
                value: times[index].value,
                text: times[index].text
              }
              this.optionsMasterTime.push(time)
            }

            // Master states
            let states = res.data.data.states
            for (let index in states) {
              let state = {
                value: states[index].value,
                text: states[index].text
              }
              this.optionsMasterState.push(state)
            }

          }
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      },
    }
  }
</script>

<style lang="scss">

  .width-33 {
    width: 31%;
    float: left;
  }

</style>
