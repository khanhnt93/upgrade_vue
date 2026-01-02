<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='4'>
              <b-button variant="outline-secondary" class="pull-left btn-width-120" @click.prevent="goBack">
                Quay lại
              </b-button>
            </b-col>
            <b-col md='8'>
              <h4 class="text-center text-header">TÌM KIẾM PHÒNG TRỐNG</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row>
            <b-col md="3">
              <label> Loại phòng </label>
              <b-form-select
                :options="optionsRoomType"
                id="status"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.room_type"></b-form-select>
            </b-col>

            <b-col md="3">
              <label> Ngày nhận phòng </label>
              <input
                id="fromDate"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.fromDate"
                maxlength="16"
                :disabled="onSearch">
              <b-form-invalid-feedback  class="invalid-feedback" :state="!errorFromDate">
                Mục từ ngày không đúng
              </b-form-invalid-feedback>
            </b-col>
            <b-col md="3">
              <label> Ngày trả phòng </label>
              <input
                id="toDate"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.toDate"
                maxlength="16"
                :disabled="onSearch">
              <b-form-invalid-feedback  class="invalid-feedback" :state="!errorToDate">
                Mục đến ngày không đúng
              </b-form-invalid-feedback>
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
            <template v-slot:cell(price)="data">
              <p  v-for="price in data.item.price" :key="price.id">{{"- " + price.name + ": " + currencyFormat(price.room_price)}}</p>
            </template>
            <template v-slot:cell(room_info)="data">
              <p  v-for="room_info in data.item.room_info" :key="room_info.id">{{"- " + room_info.name + ": " + room_info.room_info_count}}</p>
            </template>
            <template v-slot:cell(room_device)="data">
              <p  v-for="room_device in data.item.room_device" :key="room_device.id">{{"- " + room_device.name + ": " + room_device.device}}</p>
            </template>
            <template v-slot:cell(room_status_name)="data">
              <p class="text-header">{{data.item.room_status_name}}</p>
              <div v-if="data.item.room_status_id == 2">
                <p class="text-left">Nhận phòng: {{data.item.time_in}}</p>
                <p class="text-left">Trả phòng:  {{data.item.time_out}}</p>
              </div>
            </template>
            <template v-slot:cell(action)="dataId">
              <b-row class="mt-1">
                <b-col>
                  <b-button variant="outline-primary" class="btn btn-width-160"  @click="$router.push ('/booking/add/' + dataId.item.id)" style=" margin-right: 5px;">
                  Đặt phòng
                </b-button>
                </b-col>
              </b-row>
              <b-row class="mt-1">
                <b-col>
                  <b-button variant="outline-success" class="btn btn-width-160"  @click="$router.push ('/check-in/' + dataId.item.id)">
                    Nhận phòng nhanh
                  </b-button>
                </b-col>
              </b-row>

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
        room_type: null,
        fromDate: null,
        toDate: null
      },
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'name',
          label: 'Tên phòng'
        },
        {
          key: 'room_type_name',
          label: 'Loại phòng'
        },
        {
          key: 'price',
          label: 'Giá phòng'
        },
        {
          key: 'room_status_name',
          label: 'Trạng thái phòng'
        },
        {
          key: 'floor_name',
          label: 'Tầng'
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
          key: 'action',
          label: '',
          class: 'actions-cell'
        }
      ],
      optionsRoomType: [{value: null, text: ''}],
      items: [],
      offset: 0,
      pageLimit: Constant.PAGE_LIMIT,
      onSearch: false,
      loadByScroll: false,
      loading: false,
      totalRow: 0,
      setting: null,
    }
  },
  computed: {
    errorFromDate: function () {
      return this.checkDate(this.inputs.fromDate)
    },
    errorToDate: function () {
      return this.checkDate(this.inputs.toDate)
    },
    // errorFromMonth: function () {
    //   return this.checkMonth(this.inputs.fromMonth)
    // },
    // errorToMonth: function () {
    //   return this.checkMonth(this.inputs.toMonth)
    // },
  },
  mounted() {

      // Get setting time
      this.getSystemConfig()


    // window.addEventListener('scroll', this.onScroll)
    this.getOptionsRoomType()

   //  let dateNow = new Date()
   // // this.inputs.fromDate = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
   // //  let toDate = new Date(dateNow.setDate(dateNow.getDate() + 1))
   // //  this.inputs.toDate = commonFunc.formatDate(toDate.toJSON().slice(0,10))
   //    this.inputs.fromDate = dateNow.toJSON().slice(0,16).replace("T", " ")
   //  let toDate = new Date(dateNow.setDate(dateNow.getDate() + 1))
   //  this.inputs.toDate = toDate.toJSON().slice(0,16).replace("T", " ")


  },
  methods: {
    checkDate (dateInput) {
      return (this.click && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
    },
    // checkMonth (monthInput) {
    //   return (this.click && (monthInput == "" || monthInput == null || commonFunc.dateFormatCheck("01-" + monthInput) == false))
    // },
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      })
    },

      /**
       * Get hotel config
       */
    getSystemConfig () {
        commonFunc.getTimeConfig().then(cfg =>{
            let dateNow = new Date()
            this.inputs.fromDate = dateNow.toJSON().slice(0,10) + " " + cfg.startDate.value
            let toDate = new Date(dateNow.setDate(dateNow.getDate() + 1))
            this.inputs.toDate = toDate.toJSON().slice(0,10) + " " + cfg.endDate.value

            // Search
            this.search()
        }).catch(err =>{
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
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

    getDaysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    },
    getDayByMonthInput(monthInput) {
      if(monthInput) {
        let toMonths = monthInput.split("-")
        let daysOfMonth = this.getDaysInMonth(toMonths[0], toMonths[1])
        return daysOfMonth
      }
    },
    /**
     *  Search
     */
    search() {
      this.loading = true

      if(!this.checkFromDateAndToDate()) {
        this.saving = false
        return
      }
      let param = {
        "room_type": this.inputs.room_type,
        "fromDate": this.inputs.fromDate,
        "toDate": this.inputs.toDate,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      adminAPI.getSearchBooking(param).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data.rooms
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

    getOptionsRoomType() {
      adminAPI.getListGroupRoomTypeOption().then(res => {
        this.getOptionsRoomType = [{"value": null, "text": ""}]
        if(res && res.data && res.data.data) {
          let types = res.data.data
          for (var index in types) {
            let type = {
              value: types[index].value,
              text: types[index].text
            }
            this.optionsRoomType.push(type)
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    // changeChartBy() {
    //   let dateNow = new Date()
    //
    //   if(this.inputs.chartBy == "Day") {
    //     // Get default date
    //     this.inputs.fromDate = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
    //     let toDate = new Date(dateNow.setDate(dateNow.getDate() + 7))
    //     this.inputs.toDate = commonFunc.formatDate(toDate.toJSON().slice(0,10))
    //   }
    //
    //   if(this.inputs.chartBy == "Hour") {
    //     // Get default week
    //     this.inputs.fromDate = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
    //     let toDate = new Date(dateNow.setHours(dateNow.getHours() + 2))
    //     this.inputs.toDate = commonFunc.formatDate(toDate.toJSON().slice(0,10))
    //   }
    //
    //   if(this.inputs.chartBy == "Month") {
    //     // Get default month
    //     this.inputs.fromMonth = commonFunc.formatDate(dateNow.toJSON().slice(0,10)).substring(3, 10)
    //     dateNow.setMonth(dateNow.getMonth() + 11)
    //     this.inputs.toMonth = commonFunc.formatDate(dateNow.toJSON().slice(0,10)).substring(3, 10)
    //
    //   }
    // },

    checkFromDateAndToDate() {
      let fromDate = new Date(this.inputs.fromDate)
      let toDate = new Date(this.inputs.toDate)

      if(fromDate > toDate) {
        this.popToast('danger', "Từ ngày không thể lớn hớn đến ngày")
        return false
      }

      return true
    },

    /**
     * Go to table list
     */
    goBack() {
      this.$router.push('/booking/list-room')
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
  }
}
</script>
