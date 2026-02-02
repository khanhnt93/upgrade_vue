<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <button class="btn btn-outline-success float-right px-4 btn-width-120" @click="save()" :disabled="saving">
                Lưu
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h4 class="mt-2 text-center text-header">Cài Đặt</h4>
            </div>
          </div>
          <hr>
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <div class="form-group">
            <label>In QR code chuyển khoản trên hóa đơn thanh toán<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.qr_code.value" name="qr_code" :value="true" class="mt-2"><label class="ml-4 mt-1">Có</label>
              <input type="radio" v-model="setting.qr_code.value" name="qr_code" :value="false" class="ml-5 mt-2"><label class="ml-4 mt-1">Không</label>
            </div>
            <div class="invalid-feedback invalid-feedback" :state="!errorQRCode">
              Vui lòng chọn in QR code chuyển khoản trên hóa đơn thanh toán
            </div>
          </div>

          <div class="form-group">
            <label>Bao gồm thuế VAT khi thanh toán<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.vat.value" name="vat" :value="true" class="mt-2"><label class="ml-4 mt-1">Có</label>
              <input type="radio" v-model="setting.vat.value" name="vat" :value="false" class="ml-5 mt-2"><label class="ml-4 mt-1">Không</label>
            </div>
            <div class="invalid-feedback invalid-feedback" :state="!errorVat">
              Vui lòng chọn thuế khi thanh toán
            </div>
          </div>

          <div class="form-group">
            <label>Nhân viên spa được phép tính tiền<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.is_waiter_pay.value" name="waiterPay" :value="true" class="mt-2"><label class="ml-4 mt-1">Có</label>
              <input type="radio" v-model="setting.is_waiter_pay.value" name="waiterPay" :value="false" class="ml-5 mt-2"><label class="ml-4 mt-1">Không</label>
            </div>
            <div class="invalid-feedback invalid-feedback" :state="!errorIsWaiterPay">
              Vui lòng chọn lựa chọn
            </div>
          </div>

          <div class="form-group">
            <label>Sử dụng kho hàng<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.use_reponsetory.value" name="use_reponsetory" :value="true" class="mt-2"><label class="ml-4 mt-1">Có</label>
              <input type="radio" v-model="setting.use_reponsetory.value" name="use_reponsetory" :value="false" class="ml-5 mt-2"><label class="ml-4 mt-1">Không</label>
            </div>
            <div class="invalid-feedback invalid-feedback" :state="!errorUseReponsetory">
              Vui lòng chọn lựa chọn
            </div>
          </div>

          <div class="form-group">
            <label>Tự động đóng ngày vào 00:00 hàng ngày<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.auto_close.value" name="auto_close" :value="true" class="mt-2"><label class="ml-4 mt-1">Có</label>
              <input type="radio" v-model="setting.auto_close.value" name="auto_close" :value="false" class="ml-5 mt-2"><label class="ml-4 mt-1">Không</label>
            </div>
            <div class="invalid-feedback invalid-feedback" :state="!errorAutoClose">
              Vui lòng chọn lựa chọn
            </div>
          </div>

          <div class="form-group">
            <label>Show giảm giá, tăng giá trên bill khi thực hiện sửa giá dịch vụ<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.editPrice.value" name="editPrice" :value="true" class="mt-2"><label class="ml-4 mt-1">Có</label>
              <input type="radio" v-model="setting.editPrice.value" name="editPrice" :value="false" class="ml-5 mt-2"><label class="ml-4 mt-1">Không</label>
            </div>
            <div class="invalid-feedback invalid-feedback" :state="!errorEditPrice">
              Vui lòng chọn một tùy chọn
            </div>
          </div>

          <div class="form-group">
            <label>Số lượng khuyến mãi áp dụng khi thanh toán<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.quantityPmt.value" name="quantityPmt" :value="1" class="mt-2" @change="changeQuantityPmt"><label class="ml-4 mt-1">Một</label>
              <input type="radio" v-model="setting.quantityPmt.value" name="quantityPmt" :value="2" class="ml-5 mt-2" @change="changeQuantityPmt"><label class="ml-4 mt-1">Nhiều</label>
            </div>
            <div class="invalid-feedback invalid-feedback" :state="!errorQuantityPmt">
              Vui lòng chọn số lượng khuyến mãi khi thanh toán
            </div>
          </div>

          <div class="form-group" v-show="setting.quantityPmt.value > 1">
            <label>Số lượng giảm giá áp dụng khi thanh toán<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.quantityDiscount.value" name="quantityDiscount" :value="1" class="mt-2"><label class="ml-4 mt-1">Một</label>
              <input type="radio" v-model="setting.quantityDiscount.value" name="quantityDiscount" :value="2" class="ml-5 mt-2"><label class="ml-4 mt-1">Nhiều</label>
            </div>
            <div class="invalid-feedback invalid-feedback" :state="!errorQuantityDiscount">
              Vui lòng chọn số lượng giảm giá khi thanh toán
            </div>
          </div>

          <div class="form-group" v-show="setting.quantityPmt.value > 1">
            <label>Số lượng voucher áp dụng khi thanh toán<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.quantityVoucher.value" name="quantityVoucher" :value="1" class="mt-2"><label class="ml-4 mt-1">Một</label>
              <input type="radio" v-model="setting.quantityVoucher.value" name="quantityVoucher" :value="2" class="ml-5 mt-2"><label class="ml-4 mt-1">Nhiều</label>
            </div>
            <div class="invalid-feedback invalid-feedback" :state="!errorQuantityVoucher">
              Vui lòng chọn số lượng voucher khi thanh toán
            </div>
          </div>

          <div class="form-group" v-show="setting.quantityPmt.value > 1">
            <label>Số lượng miễn phí dv áp dụng khi thanh toán<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.quantityFreeItem.value" name="quantityFreeItem" :value="1" class="mt-2"><label class="ml-4 mt-1">Một</label>
              <input type="radio" v-model="setting.quantityFreeItem.value" name="quantityFreeItem" :value="2" class="ml-5 mt-2"><label class="ml-4 mt-1">Nhiều</label>
            </div>
            <div class="invalid-feedback invalid-feedback" :state="!errorQuantityFreeItem">
              Vui lòng chọn số lượng miễn phí dv khi thanh toán
            </div>
          </div>
          <div class="form-group">
            <label>Giờ bắt đầu làm việc<span class="error-sybol"></span></label>
            <div class="input-group">
              <input
                id="workStartHour"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="setting.workStartHour.value"
                maxlength="11">
            </div>
            <div class="invalid-feedback invalid-feedback" :state="!errorWorkStartHour">
              Vui lòng nhập giờ bắt đầu làm việc
            </div>
          </div>

          <div class="form-group">
            <label>Giờ kết thúc làm việc<span class="error-sybol"></span></label>
            <div class="input-group">
              <input
                id="workEndHour"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="setting.workEndHour.value"
                maxlength="11">
            </div>
            <div class="invalid-feedback invalid-feedback" :state="!errorWorkEndHour">
              Vui lòng nhập giờ kết thúc làm việc
            </div>
          </div>

          <!--<div class="form-group">-->
            <!--<label>Số điểm của khách hàng sẽ hết hạn sau<span class="error-sybol"></span></label>-->
            <!--<div class="input-group">-->
              <!--<input-->
              <!--id="pasword"-->
              <!--type="text"-->
              <!--autocomplete="new-password"-->
              <!--class="form-control"-->
              <!--v-model="setting.pmtExpire.value"-->
              <!--@keyup="integerOnly($event.target)"-->
              <!--maxlength="30"><span class="input-group-addon">&nbsp;&nbsp;Ngày</span>-->
            <!--</div>-->
            <!--<div class="invalid-feedback invalid-feedback" :state="!errorExpireDay">-->
              <!--Vui lòng nhập số ngày-->
            <!--</div>-->
          <!--</div>-->

        </div>
      </div>
    </div>
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
        // pmtExpire: {
        //   "id": null,
        //   "code": "expired_point",
        //   "value": null
        // },
        qr_code: {
          "id": null,
          "code": "is_print_qr_code",
          "value": true
        },
        vat: {
          "id": null,
          "code": "is_include_vat",
          "value": false
        },
        is_waiter_pay: {
          "id": null,
          "code": "is_waiter_pay",
          "value": false
        },
        use_reponsetory: {
          "id": null,
          "code": "use_reponsetory",
          "value": false
        },
        auto_close: {
          "id": null,
          "code": "auto_close",
          "value": false
        },
        cusLogin: {
          "id": null,
          "code": "is_customer_login",
          "value": false
        },
        editPrice: {
          "id": null,
          "code": "is_show_edit_price",
          "value": true
        },
        quantityPmt: {
          "id": null,
          "code": "quantity_pmt",
          "value": false
        },
        quantityDiscount: {
          "id": null,
          "code": "quantity_discount",
          "value": false
        },
        quantityVoucher: {
          "id": null,
          "code": "quantity_voucher",
          "value": false
        },
        quantityFreeItem: {
          "id": null,
          "code": "quantity_free_item",
          "value": false
        },
        workStartHour:{
          "id": null,
          "code": "work_start_hour",
          "value": '08:00'
        },
        workEndHour:{
          "id": null,
          "code": "work_end_hour",
          "value": '17:00'
        }
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
    // errorExpireDay: function () {
    //   return this.checkInfo(this.setting.pmtExpire.value)
    // },
    errorQRCode: function () {
      return this.checkInfo(this.setting.qr_code.value)
    },
    errorVat: function () {
      return this.checkInfo(this.setting.vat.value)
    },
    errorIsWaiterPay: function () {
      return this.checkInfo(this.setting.is_waiter_pay.value)
    },
    errorUseReponsetory: function () {
      return this.checkInfo(this.setting.use_reponsetory.value)
    },
    errorAutoClose: function () {
      return this.checkInfo(this.setting.auto_close.value)
    },
    errorCusLogin: function () {
      return this.checkInfo(this.setting.cusLogin.value)
    },
    errorEditPrice: function () {
      return this.checkInfo(this.setting.editPrice.value)
    },
    errorQuantityPmt: function () {
      return this.checkInfo(this.setting.quantityPmt.value)
    },
    errorQuantityDiscount: function () {
      return this.checkInfo(this.setting.quantityDiscount.value)
    },
    errorQuantityVoucher: function () {
      return this.checkInfo(this.setting.quantityVoucher.value)
    },
    errorQuantityFreeItem: function () {
      return this.checkInfo(this.setting.quantityFreeItem.value)
    },
    errorWorkStartHour: function () {
      return this.checkInfo(this.setting.workStartHour.value)
    },
    errorWorkEndHour: function () {
      return this.checkInfo(this.setting.workEndHour.value)
    }

  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorVat || this.errorIsWaiterPay || this.errorUseReponsetory || this.errorAutoClose
         || this.errorCusLogin || this.errorEditPrice || this.errorQuantityPmt  || this.errorQuantityDiscount
        || this.errorQuantityVoucher || this.errorQuantityFreeItem || this.workStartHour || this.workEndHour)
    },

    /**
     * Event change quantity pmt
     */
    changeQuantityPmt() {
      if(this.setting.quantityPmt.value == 1) {
        this.setting.quantityDiscount.value = 1
        this.setting.quantityVoucher.value = 1
        this.setting.quantityFreeItem.value = 1
      }
    },

    /**
   * Make toast without title
   */
    popToast(variant, content) {
      if (variant === 'danger') {
        this.$toast.error(content);
      } else if (variant === 'success') {
        this.$toast.success(content);
      } else if (variant === 'warning') {
        this.$toast.warning(content);
      } else {
        this.$toast.info(content);
      }
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
          }
        }).catch(err => {
          this.saving = false
          let message = "Lỗi hệ thống"
          this.popToast('danger', message)
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
          this.setting = Mapper.mapSysCfgModelToDto(res.data.data)
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
