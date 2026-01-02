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
              <h4 class="text-center text-header">THÔNG TIN ĐẶT PHÒNG</h4>
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

          <b-row>
            <b-col>
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
                <template v-slot:cell(action)="dataId">
                  <b-list-group horizontal>
                    <b-button variant="outline-success" class="btn"  @click="$router.push ('/check-in-from-booking/' + dataId.item.booking_id)" style=" margin-right: 5px;">
                      Nhận phòng
                    </b-button>
                    <b-button variant="outline-primary" class="btn"  @click="$router.push ('/booking/edit/' + dataId.item.booking_id)" style=" margin-right: 5px;">
                      Sửa
                    </b-button>
                    <b-button variant="outline-danger" class="btn"  @click="deleted(dataId.item.booking_id, dataId.item.customer_name)">
                      Xoá
                    </b-button>
                  </b-list-group>
                </template>
              </b-table>

              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
              <span class="loading-more">--Hết--</span>
            </b-col>
          </b-row>


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
          key: 'note',
          label: 'Ghi chú'
        },
        {
          key: 'action',
          label: '',
          class: 'actions-cell'
        }
      ],
      items: [],
      offset: 0,
      click: false,
      pageLimit: Constant.PAGE_LIMIT,
      onSearch: false,
      loadByScroll: false,
      loading: false,
      totalRow: 0,
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

      adminAPI.getCreateBooking(param).then(res => {
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
     * Delete
     */
    deleted (id, name) {
      if(id && name) {
        this.$bvModal.msgBoxConfirm('Xóa đặt phòng của k.h [' + name + "]. Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if(res){
            adminAPI.deleteBookingInfo(id).then(res => {
              if(res != null && res.data != null) {
                this.prepareToSearch()
              }
            }).catch(err => {
              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.popToast('danger', errorMess)
            })
          }
        })
      }
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
