<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right btn-width-120" @click="save()" :disabled="saving">
                Lưu
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-1 text-center text-header">CÀI ĐẶT HỆ THỐNG</h4>
            </b-col>
          </b-row>
          <hr>
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <div class="form-group">
            <label>Thời gian bắt đầu<span class="error-sybol"></span></label>
            <div class="input-group">
              <input
                id="startDate"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="setting.startDate.value"
                maxlength="11">
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorStartTime">
              Vui lòng nhập thời gian bắt đầu
            </b-form-invalid-feedback>
          </div>
          <div class="form-group">
            <label>Thời gian kết thúc<span class="error-sybol"></span></label>
            <div class="input-group">
              <input
                id="endDate"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="setting.endDate.value"
                maxlength="11">
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorEndTime">
              Vui lòng nhập thời gian kết thúc
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label>Quá hạn bao nhiêu giờ thì tính ngày mới <span class="error-sybol"></span></label>
            <div class="input-group">
              <input
                id="hoursUntilNewDate"
                type="number"
                autocomplete="new-password"
                class="form-control"
                v-model="setting.hoursUntilNewDate.value"
                min="0">
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorHoursUntilNewDate">
              Vui lòng nhập số giờ quá hạn
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label>Quá hạn bao nhiêu phút thì tính giờ mới<span class="error-sybol"></span></label>
            <div class="input-group">
              <input
                type="number"
                autocomplete="new-password"
                class="form-control"
                v-model="setting.minutesUntilNewHour.value"
                min="11">
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorMinutesUntilNewHour">
              Vui lòng nhập số phút quá hạn
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label>Tự động cập nhật phòng dơ khi khách qua đêm<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.auto_update_room.value" name="auto_update_room" :value="true" class="mt-2"><label class="ml-4 mt-1">Có</label>
              <input type="radio" v-model="setting.auto_update_room.value" name="auto_update_room" :value="false" class="ml-5 mt-2"><label class="ml-4 mt-1">Không</label>
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorAutoUpdateRoom">
              Vui lòng chọn lựa chọn
            </b-form-invalid-feedback>
          </div>

        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
  import adminAPI from '@/api/admin'
  import Mapper from '@/mapper/setting'
  import commonFunc from '@/common/commonFunc'


  export default {
    data () {
      return {
        setting: {
          startDate: {
            "id": null,
            "code": "time_in",
            "value": '12:00'
          },
          endDate: {
            "id": null,
            "code": "time_out",
            "value": '14:00'
          },
          hoursUntilNewDate: {
            "id": null,
            "code": "hours_until_new_date",
            "value": "2"
          },
          minutesUntilNewHour: {
            "id": null,
            "code": "minutes_until_hours",
            "value": "15"
          },
          discountByMoney: {
            "id": null,
            "code": "discount_by_money",
            "value": false
          },
          auto_update_room: {
            "id": null,
            "code": "auto_update_room",
            "value": false
          },
        },
        click: false,
        saving: false,
        loading: false,
      }
    },
    mounted () {
    this.getSystemConfig()
    },
    computed: {
      errorStartTime: function () {
        return this.checkInfo(this.setting.startDate.value)
      },
      errorEndTime: function () {
        return this.checkInfo(this.setting.startDate.value)
      },
      errorHoursUntilNewDate: function(){
        return this.checkInfo(this.setting.hoursUntilNewDate.value)
      },
      errorMinutesUntilNewHour: function() {
          return this.checkInfo(this.setting.minutesUntilNewHour.value)
      },
      errorAutoUpdateRoom: function () {
        return this.checkInfo(this.setting.auto_update_room.value)
      },
    },
    methods: {
      checkInfo (info) {
        return (this.click && (info == null || info.length <= 0))
      },
      checkValidate () {
        return !(this.errorStartTime || this.errorEndTime || this.errorHoursUntilNewDate || this.errorMinutesUntilNewHour || this.errorAutoUpdateRoom)
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
       * Save
       */
      save () {
        this.click = true
        this.saving = true

        let result = this.checkValidate()
        if(result) {
          adminAPI.saveSystemConfig(this.setting).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                // show popup success
                this.popToast('success', 'Cập nhật cài đặt thành công!!! ')

              }
              this.getSystemConfig()
            }
          }).catch(err => {
            this.saving = false
            let message = "Lỗi hệ thống"
            this.$bvModal.msgBoxOk(message, {
              title: "Cập Nhật Cài Đặt",
              centered: true,
              size: 'sm',
              headerClass: 'bg-danger',
            })
          })
        } else {
          this.saving = false
        }
      },

      /**
       * Get old
       */
    getSystemConfig () {
        this.loading = true

      adminAPI.getSystemConfig().then(res => {
          if(res != null && res.data != null && res.data.data != null) {
          this.setting = Mapper.mapSysCfgModelToDtoHotel(res.data.data)
            console.log(this.setting)
          }

          this.loading = false
        }).catch(err => {
          console.log(err)
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      },

      /**
       * Only input integer
       */
      integerOnly(item) {
        let valueInput = item.value
        let result = commonFunc.intergerOnly(valueInput)
        item.value = result
      },
    }
  }
</script>
