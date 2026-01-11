<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Header with Add button -->
      <div class="flex justify-end mb-4">
        <button 
          class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          @click="goToAdd()">
          Thêm
        </button>
      </div>

      <!-- Title -->
      <div class="text-center mb-4">
        <h4 class="text-2xl font-semibold text-gray-800">PHÒNG</h4>
      </div>
      <hr class="mb-4">

      <!-- Search filters -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tên</label>
          <input
            id="name"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.name">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tầng</label>
          <select
            id="floor"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.floor">
            <option v-for="option in optionsFloor" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Trạng Thái</label>
          <select
            id="status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.status">
            <option v-for="option in optionsRoomStatus" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tình trạng</label>
          <select
            id="state"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.state">
            <option v-for="option in optionsRoomState" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <!-- Search button -->
      <div class="flex justify-end mb-4">
        <button 
          class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          :disabled="onSearch" 
          @click.prevent="prepareToSearch">
          Tìm Kiếm
        </button>
      </div>

      <!-- Total results -->
      <div class="mb-4 text-gray-700">
        Số kết quả: {{totalRow}}
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-300 px-4 py-2 text-left">STT</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Tên</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Tầng</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Giá</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Loại phòng</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Thông tin phòng</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Thiết bị trong phòng</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Trạng thái phòng</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Tình trạng phòng</th>
              <th class="border border-gray-300 px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
              <td class="border border-gray-300 px-4 py-2">{{ item.stt }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.floor_name }}</td>
              <td class="border border-gray-300 px-4 py-2">
                <p v-for="price in item.price" :key="price.id">
                  - {{ price.name }}: {{ formatCurrency(price.room_price) }}
                </p>
              </td>
              <td class="border border-gray-300 px-4 py-2">{{ item.room_type_name }}</td>
              <td class="border border-gray-300 px-4 py-2">
                <p v-for="room_info in item.room_info" :key="room_info.id">
                  - {{ room_info.name }}: {{ room_info.room_info_count }}
                </p>
              </td>
              <td class="border border-gray-300 px-4 py-2">
                <p v-for="room_device in item.room_device" :key="room_device.id">
                  - {{ room_device.name }}: {{ room_device.device }}
                </p>
              </td>
              <td class="border border-gray-300 px-4 py-2">{{ item.room_status_name }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.room_state }}</td>
              <td class="border border-gray-300 px-4 py-2">
                <div class="flex justify-center space-x-2">
                  <button 
                    class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    @click="edit(item.id)"
                    title="Edit">
                    <i class="fa fa-edit" />
                  </button>
                  <button 
                    class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    @click="deleted(item.id, item.name, item.stt)"
                    title="Delete">
                    <i class="fa fa-trash" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading -->
      <div v-show="loading" class="text-center mt-4">
        <icon name="loading" width="60" />
      </div>
      <div class="text-center mt-4 text-gray-500">--Hết--</div>
    </div>
  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'


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
  data () {
    return {
      inputs: {
        name: null,
        floor: null,
        status: null,
        state: null
      },
      optionsFloor: [{value: null, text: ''}],
      optionsRoomStatus: [{value: null, text: ''}],
      optionsRoomState: [{value: null, text: ''}],
      items: [],
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      hasNext: true,

      onSearch: false,
      loadByScroll: false,
      listIdDeleted: [],
      loading: false,
      groupMenus: [],
      totalRow: 0
    }
  },
  computed: {
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

    window.addEventListener('resize', this.delete)

    // Get options related room
    this.getOptionsRelatedRoom()

    this.search()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.delete)
  },
  methods: {

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
      this.offset = 0
      this.items = []
      this.hasNext = true

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
        "floor": this.inputs.floor,
        "status": this.inputs.status,
        "state": this.inputs.state,
        "limit": this.pageLimit,
        "offset": this.offset
      }
      adminAPI.getRoom(param).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data.hotels
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
          this.toast.error(errorMess)
        })
      },

    /**
     * Delete
     */
    deleted (id, name, rowIndex) {
      if (confirm('Xóa ' + name + '. Bạn có chắc không?')) {
        adminAPI.deleteRoom(id).then(res => {

          // Remove item in list
          let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
          this.items.splice(indexTemp, 1)
          this.listIdDeleted.push(rowIndex - 1)

          this.totalRow = this.totalRow - 1
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
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
     * Go to page edit
     */
    edit (id) {
      this.router.push('/room/edit/' + id)
    },

    /**
     * Go to page add
     */
    goToAdd () {
      this.router.push('/room/add')
    }
  }
}
</script>
