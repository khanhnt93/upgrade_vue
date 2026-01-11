<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Header buttons -->
      <div class="flex justify-between mb-4">
        <button
          class="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          @click="back">
          Quay lại
        </button>
        <button
          class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400"
          @click="save"
          :disabled="saving">
          Lưu
        </button>
      </div>

      <!-- Title -->
      <div class="text-center mb-4">
        <h4 class="text-2xl font-semibold text-gray-800">PHÒNG</h4>
      </div>
      <hr class="mb-4"/>

      <!-- Loading -->
      <div v-show="loading" class="text-center mb-4">
        <icon name="loading" width="60" />
      </div>

      <!-- Form grid -->
      <div class="grid grid-cols-12 gap-4">
        <!-- Name field -->
        <div class="col-span-12 flex items-center">
          <label class="w-1/4 text-sm font-medium text-gray-700">Tên <span class="text-red-500">*</span></label>
          <div class="w-3/4">
            <input
              id="name"
              type="text"
              autocomplete="new-password"
              :class="['w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500', errorName ? 'border-red-500' : 'border-gray-300']"
              v-model="room.name">
            <div v-if="errorName" class="text-red-500 text-sm mt-1">
              Đây là mục bắt buộc nhập
            </div>
          </div>
        </div>

        <!-- Floor field -->
        <div class="col-span-12 flex items-center">
          <label class="w-1/4 text-sm font-medium text-gray-700">Tầng</label>
          <div class="w-3/4">
            <select
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="room.floor_id">
              <option v-for="option in optionsFloor" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>

        <!-- Room Type field -->
        <div class="col-span-12 flex items-center">
          <label class="w-1/4 text-sm font-medium text-gray-700">Loại phòng</label>
          <div class="w-3/4">
            <select
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="room.room_type_id">
              <option v-for="option in optionsRoomType" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>

        <!-- Two column layout for add buttons and lists -->
        <div class="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left column: Add buttons -->
          <div>
            <div class="flex items-center mb-4">
              <label class="w-2/3 text-sm font-medium text-gray-700">Giá tiền</label>
              <button
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                @click="showModalPrice">
                <i class="fa fa-plus"/>
              </button>
            </div>

            <div class="flex items-center mb-4">
              <label class="w-2/3 text-sm font-medium text-gray-700">Thông tin phòng</label>
              <button
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                @click="showModalRoomInfo">
                <i class="fa fa-plus"/>
              </button>
            </div>

            <div class="flex items-center mb-4">
              <label class="w-2/3 text-sm font-medium text-gray-700">Thiết bị trong phòng</label>
              <button
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                @click="showModalRoomDevice">
                <i class="fa fa-plus"/>
              </button>
            </div>
          </div>

          <!-- Right column: Lists -->
          <div>
            <div v-show="this.room.price.length > 0" class="mb-4">
              <p class="font-semibold mb-2">Giá phòng:</p>
              <p class="flex items-center justify-between" v-for="item in this.room.price" :key="item.code">
                <label>- {{formatCurrency(item.room_price) + ': ' + item.name}}</label>
                <i class="fa fa-trash cursor-pointer text-red-500 hover:text-red-700" @click="deleteResourcePrice(item.code)"/>
              </p>
            </div>

            <div v-show="this.room.room_info.length > 0" class="mb-4">
              <p class="font-semibold mb-2">Thông tin phòng:</p>
              <p class="flex items-center justify-between" v-for="item in this.room.room_info" :key="item.id">
                <label>- {{item.name + ": " + item.room_info_count}}</label>
                <i class="fa fa-trash cursor-pointer text-red-500 hover:text-red-700" @click="deleteResourceInfo(item.id)"/>
              </p>
            </div>

            <div v-show="this.room.room_device.length > 0" class="mb-4">
              <p class="font-semibold mb-2">Thiết bị trong phòng:</p>
              <p class="flex items-center justify-between" v-for="item in this.room.room_device" :key="item.id">
                <label>- {{item.name + ': ' + item.device}}</label>
                <i class="fa fa-trash cursor-pointer text-red-500 hover:text-red-700" @click="deleteResource(item.id)"/>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal choose price -->
  <div v-if="showPriceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
      <div class="text-center mb-4">
        <h5 class="text-xl font-semibold">Đặt giá phòng theo thời gian</h5>
      </div>

      <div class="mb-4">
        <p class="flex items-center justify-between" v-for="item in this.room.price" :key="item.code">
          <label>- {{formatCurrency(item.room_price) + ': ' + item.name}}</label>
          <i class="fa fa-trash cursor-pointer text-red-500 hover:text-red-700" @click="deleteResourcePrice(item.code)"/>
        </p>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian <span class="text-red-500">*</span></label>
        <select
          id="masterPrice"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          v-model="resource_price.code"
          @change="changeResourcePrice">
          <option v-for="option in optionsMasterTime" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Giá phòng <span class="text-red-500">*</span></label>
        <div class="flex items-center">
          <input
            type="text"
            autocomplete="new-password"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="resource_price.room_price"
            @keyup="integerOnly($event.target)"
            maxlength="11">
          <label class="ml-2 text-gray-700">{{unitResourcePrice}}</label>
        </div>
      </div>

      <div class="text-center mb-4">
        <button
          class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          @click="addGroupResourcePrice">
          Thêm
        </button>
      </div>

      <div class="flex justify-end">
        <button
          class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          @click="confirmResourcePrice">
          Xác nhận
        </button>
      </div>
    </div>
  </div>

  <!-- Modal choose room info -->
  <div v-if="showRoomInfoModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
      <div class="text-center mb-4">
        <h5 class="text-xl font-semibold">Thông tin phòng</h5>
      </div>

      <div class="mb-4">
        <p class="flex items-center justify-between" v-for="item in this.room.room_info" :key="item.id">
          <label>- {{item.name + ": " + item.room_info_count}}</label>
          <i class="fa fa-trash cursor-pointer text-red-500 hover:text-red-700" @click="deleteResourceInfo(item.id)"/>
        </p>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Thông tin phòng <span class="text-red-500">*</span></label>
        <select
          id="roomInfo"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          v-model="resource_room_info.id"
          @change="changeResourceInfo">
          <option v-for="option in optionsRoomInfo" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả <span class="text-red-500">*</span></label>
        <div class="flex items-center">
          <input
            type="text"
            autocomplete="new-password"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="resource_room_info.room_info_count"
            maxlength="11">
          <label class="ml-2 text-gray-700">{{unitResourceInfo}}</label>
        </div>
      </div>

      <div class="text-center mb-4">
        <button
          class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          @click="addGroupResourceInfo">
          Thêm
        </button>
      </div>

      <div class="flex justify-end">
        <button
          class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          @click="confirmResourceInfo">
          Xác nhận
        </button>
      </div>
    </div>
  </div>

  <!-- Modal choose room device -->
  <div v-if="showRoomDeviceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
      <div class="text-center mb-4">
        <h5 class="text-xl font-semibold">Thiết bị</h5>
      </div>

      <div class="mb-4">
        <p class="flex items-center justify-between" v-for="item in this.room.room_device" :key="item.id">
          <label>- {{item.name + ': ' + item.device}}</label>
          <i class="fa fa-trash cursor-pointer text-red-500 hover:text-red-700" @click="deleteResource(item.id)"/>
        </p>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Thiết bị <span class="text-red-500">*</span></label>
        <select
          id="deviceName"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          v-model="resource_device.id"
          @change="changeResource">
          <option v-for="option in optionsRoomDevice" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng <span class="text-red-500">*</span></label>
        <div class="flex items-center">
          <input
            type="text"
            autocomplete="new-password"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="resource_device.device"
            @keyup="integerOnly($event.target)"
            maxlength="11">
          <label class="ml-2 text-gray-700">{{unitResource}}</label>
        </div>
      </div>

      <div class="text-center mb-4">
        <button
          class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          @click="addGroupResource">
          Thêm
        </button>
      </div>

      <div class="flex justify-end">
        <button
          class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          @click="confirmResource">
          Xác nhận
        </button>
      </div>
    </div>
  </div>
</template>


<script>
  import adminAPI from '@/api/admin'
  import Mapper from '@/mapper/menu'
  import GMMapper from '@/mapper/group_menu'
  import VueCropper from 'vue-cropperjs'
  import 'cropperjs/dist/cropper.css'
  import commonFunc from '@/common/commonFunc'
  import { useRouter, useRoute } from 'vue-router'
  import { useToast } from '@/composables/useToast'
  import { useFormatters } from '@/composables/useFormatters'


  export default {
    components: {
      VueCropper
    },
    setup() {
      const router = useRouter()
      const route = useRoute()
      const toast = useToast()
      const { formatCurrency } = useFormatters()

      return {
        router,
        route,
        toast,
        formatCurrency
      }
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
        resourceChosenPrice: [],
        showPriceModal: false,
        showRoomInfoModal: false,
        showRoomDeviceModal: false
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
          let roomId = this.route.params.id
          if(roomId){
            this.room.id = roomId

            adminAPI.editRoom(this.room).then(res => {
              this.saving = false
              if(res != null && res.data != null){
                // Show notify edit success
                this.toast.success('Lưu menu thành công!!! ')
              }else{
                // Show notify edit fail
                this.toast.error('Lưu menu thất bại!!! ')
              }
            }).catch(err => {
              this.saving = false

              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.toast.error(errorMess)
            })
          } else {
            // Add
            adminAPI.addRoom(this.room).then(res => {
              this.saving = false
              if(res != null && res.data != null){
                // Go to list
                this.router.push('/room/list')
              }else{
                // Show notify add fail
                this.toast.error('Lưu menu thất bại!!! ')
              }
            }).catch(err => {
              this.saving = false
              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.toast.error(errorMess)
            })
          }
        }
      },

      /**
       * Show modal choose option
       */
      showModalPrice() {
        this.showPriceModal = true
      },

      /**
       * Show modal choose topping
       */
      showModalRoomInfo() {
        this.showRoomInfoModal = true
      },

      /**
       * Show modal choose resource
       */
      showModalRoomDevice() {
        this.showRoomDeviceModal = true
      },

      /**
       * Back to list
       */
      back() {
        // Go to list
        this.router.push('/room/list')
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
            this.toast.error(errorMess)
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
            this.toast.error('Thiết bị đã tồn tại')
          }
        } else {
          this.toast.error('Vui lòng nhập đủ các mục yêu cầu')
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
            this.toast.error('Thông tin đã tồn tại')
          }
        } else {
          this.toast.error('Vui lòng nhập đủ các mục yêu cầu')
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
            this.toast.error('Trùng giờ')
          }
        } else {
          this.toast.error('Vui lòng nhập đủ các mục yêu cầu')
        }
      },

      /**
       * Confirm resource
       */
      confirmResource() {
        this.showRoomDeviceModal = false
      },
      confirmResourceInfo() {
        this.showRoomInfoModal = false
      },
      confirmResourcePrice() {
        this.showPriceModal = false
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
          this.toast.error(errorMess)
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
