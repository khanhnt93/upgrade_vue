<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col>
                <b-button variant="outline-success" class="pull-right btn-width-120" @click="goToAdd()">
                  Thêm
                </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-1 text-center text-header">PHÒNG</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row>
            <b-col md="3">
              <label> Tên </label>
              <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.name">
            </b-col>
            <b-col md="3">
              <label> Tầng </label>
              <b-form-select
                :options="optionsFloor"
                id="status"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.floor"></b-form-select>
            </b-col>
            <b-col md="3">
              <label> Trạng Thái </label>
              <b-form-select
              :options="optionsRoomStatus"
              id="status"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.status"></b-form-select>
            </b-col>

            <b-col md="3">
              <label> Tình trạng </label>
              <b-form-select
              :options="optionsRoomState"
              id="status"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.state"></b-form-select>
            </b-col>
          </b-row>

          <b-row class="mt-2 mb-2">
            <b-col md="12">
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
            <template v-slot:cell(price)="data">
              <p  v-for="price in data.item.price" :key="price.id">{{"- " + price.name + ": " + currencyFormat(price.room_price)}}</p>
            </template>
            <template v-slot:cell(room_info)="data">
              <p  v-for="room_info in data.item.room_info" :key="room_info.id">{{"- " + room_info.name + ": " + room_info.room_info_count}}</p>
            </template>
            <template v-slot:cell(room_device)="data">
              <p  v-for="room_device in data.item.room_device" :key="room_device.id">{{"- " + room_device.name + ": " + room_device.device}}</p>
            </template>
            <template v-slot:cell(action)="dataId">
              <b-list-group horizontal>
                <b-list-group-item v-b-tooltip.hover title="Edit" @click="edit(dataId.item.id)">
                  <i class="fa fa-edit" />
                </b-list-group-item>
                <b-list-group-item v-b-tooltip.hover title="Delete" @click="deleted(dataId.item.id, dataId.item.name, dataId.item.stt)">
                  <i class="fa fa-trash" />
                </b-list-group-item>
              </b-list-group>
            </template>
          </b-table>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more">--Hết--</span>
        </b-card>

      </b-col>
    </b-row>
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
        floor: null,
        status: null,
        state: null
      },
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'name',
          label: 'Tên'
        },
        {
          key: 'floor_name',
          label: 'Tầng'
        },
        {
          key: 'price',
          label: 'Giá'
        },
        {
          key: 'room_type_name',
          label: 'Loại phòng'
        },
        {
          key: 'room_info',
          label: 'Thông tin phòng'
        },
        {
          key: 'room_device',
          label: 'Thiết bị trong phòng'
        },
        {
          key: 'room_status_name',
          label: 'Trạng thái phòng'
        },
        {
          key: 'room_state',
          label: 'Tình trạng phòng'
        },
        {
          key: 'action',
          label: '',
          class: 'actions-cell'
        }
      ],
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
    // this.getOptionsRoomStatus()
    // this. getOptionsFloor()

    // Get options related room
    this.getOptionsRelatedRoom()

    this.search()
  },
  methods: {

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
        this.popToast('danger', errorMess)
      })
    },

    // getOptionsRoomStatus() {
    //   adminAPI.getListGroupRoomStatusOption().then(res => {
    //     this.getOptionsRoomStatus = [{"value": null, "text": ""}]
    //     if(res && res.data && res.data.data) {
    //       let types = res.data.data
    //       for (var index in types) {
    //
    //         let type = {
    //           value: types[index].value,
    //           text: types[index].text
    //         }
    //         this.optionsRoomStatus.push(type)
    //       }
    //     }
    //   }).catch(err => {
    //     // Handle error
    //     let errorMess = commonFunc.handleStaffError(err)
    //     this.popToast('danger', errorMess)
    //   })
    // },
    // getOptionsFloor() {
    //   adminAPI.getListGroupFloorOption().then(res => {
    //     this.getOptionsFloor = [{"value": null, "text": ""}]
    //     if(res && res.data && res.data.data) {
    //       let types = res.data.data
    //       for (var index in types) {
    //
    //         let type = {
    //           value: types[index].value,
    //           text: types[index].text
    //         }
    //         this.optionsFloor.push(type)
    //       }
    //     }
    //   }).catch(err => {
    //     // Handle error
    //     let errorMess = commonFunc.handleStaffError(err)
    //     this.popToast('danger', errorMess)
    //   })
    // },

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
          this.popToast('danger', errorMess)
        })
      },

    /**
     * Delete
     */
    deleted (id, name, rowIndex) {
      this.$bvModal.msgBoxConfirm('Xóa ' + name + ". Bạn có chắc không?", {
        title: false,
        buttonSize: 'sm',
        centered: true, size: 'sm',
        footerClass: 'p-2'
      }).then(res => {
        if (res) {
          adminAPI.deleteRoom(id).then(res => {

            // Remove item in list
            let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
            this.items.splice(indexTemp, 1)
            this.listIdDeleted.push(rowIndex - 1)

            this.totalRow = this.totalRow - 1
          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
      })
    },

    /**
   * Currency format
   */
    currencyFormat(num) {
      let result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      return result
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
      this.$router.push('/room/edit/' + id)
    },

    /**
     * Go to page add
     */
    goToAdd () {
      this.$router.push('/room/add')
    }
  }
}
</script>
