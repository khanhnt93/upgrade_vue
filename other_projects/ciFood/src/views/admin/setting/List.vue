<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right btn-width-120" @click="save" :disabled="saving">
                Lưu
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center text-header">Cài Đặt</h4>
            </b-col>
          </b-row>
          <hr>
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <div class="form-group">
            <label>Bao gồm thuế VAT khi thanh toán<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.vat.value" name="vat" :value="true" class="mt-2"><label class="ml-4 mt-1">Có</label>
              <input type="radio" v-model="setting.vat.value" name="vat" :value="false" class="ml-5 mt-2"><label class="ml-4 mt-1">Không</label>
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorVat">
              Vui lòng chọn thuế khi thanh toán
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label>Nhân viên phục vụ được phép tính tiền<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.is_waiter_pay.value" name="waiterPay" :value="true" class="mt-2"><label class="ml-4 mt-1">Có</label>
              <input type="radio" v-model="setting.is_waiter_pay.value" name="waiterPay" :value="false" class="ml-5 mt-2"><label class="ml-4 mt-1">Không</label>
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorIsWaiterPay">
              Vui lòng chọn lựa chọn
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label>Sử dụng kho hàng<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.use_reponsetory.value" name="use_reponsetory" :value="true" class="mt-2"><label class="ml-4 mt-1">Có</label>
              <input type="radio" v-model="setting.use_reponsetory.value" name="use_reponsetory" :value="false" class="ml-5 mt-2"><label class="ml-4 mt-1">Không</label>
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorUseReponsetory">
              Vui lòng chọn lựa chọn
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label>Tự động đóng ngày vào 00:00 hàng ngày<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.auto_close.value" name="auto_close" :value="true" class="mt-2"><label class="ml-4 mt-1">Có</label>
              <input type="radio" v-model="setting.auto_close.value" name="auto_close" :value="false" class="ml-5 mt-2"><label class="ml-4 mt-1">Không</label>
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorAutoClose">
              Vui lòng chọn lựa chọn
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label>Khách hàng phải đăng nhập để order tại bàn<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.cusLogin.value" name="cusLogin" :value="true" class="mt-2"><label class="ml-4 mt-1">Có</label>
              <input type="radio" v-model="setting.cusLogin.value" name="cusLogin" :value="false" class="ml-5 mt-2"><label class="ml-4 mt-1">Không</label>
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorCusLogin">
              Vui lòng chọn một tùy chọn
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label>Show giảm giá, tăng giá trên bill khi thực hiện sửa giá món<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.editPrice.value" name="editPrice" :value="true" class="mt-2"><label class="ml-4 mt-1">Có</label>
              <input type="radio" v-model="setting.editPrice.value" name="editPrice" :value="false" class="ml-5 mt-2"><label class="ml-4 mt-1">Không</label>
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorEditPrice">
              Vui lòng chọn một tùy chọn
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label>Số lượng khuyến mãi áp dụng khi thanh toán<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.quantityPmt.value" name="quantityPmt" :value="1" class="mt-2" @change="changeQuantityPmt"><label class="ml-4 mt-1">Một</label>
              <input type="radio" v-model="setting.quantityPmt.value" name="quantityPmt" :value="2" class="ml-5 mt-2" @change="changeQuantityPmt"><label class="ml-4 mt-1">Nhiều</label>
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorQuantityPmt">
              Vui lòng chọn số lượng khuyến mãi khi thanh toán
            </b-form-invalid-feedback>
          </div>

          <div class="form-group" v-show="setting.quantityPmt.value > 1">
            <label>Số lượng giảm giá áp dụng khi thanh toán<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.quantityDiscount.value" name="quantityDiscount" :value="1" class="mt-2"><label class="ml-4 mt-1">Một</label>
              <input type="radio" v-model="setting.quantityDiscount.value" name="quantityDiscount" :value="2" class="ml-5 mt-2"><label class="ml-4 mt-1">Nhiều</label>
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorQuantityDiscount">
              Vui lòng chọn số lượng giảm giá khi thanh toán
            </b-form-invalid-feedback>
          </div>

          <div class="form-group" v-show="setting.quantityPmt.value > 1">
            <label>Số lượng voucher áp dụng khi thanh toán<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.quantityVoucher.value" name="quantityVoucher" :value="1" class="mt-2"><label class="ml-4 mt-1">Một</label>
              <input type="radio" v-model="setting.quantityVoucher.value" name="quantityVoucher" :value="2" class="ml-5 mt-2"><label class="ml-4 mt-1">Nhiều</label>
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorQuantityVoucher">
              Vui lòng chọn số lượng voucher khi thanh toán
            </b-form-invalid-feedback>
          </div>

          <div class="form-group" v-show="setting.quantityPmt.value > 1">
            <label>Số lượng miễn phí món áp dụng khi thanh toán<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.quantityFreeItem.value" name="quantityFreeItem" :value="1" class="mt-2"><label class="ml-4 mt-1">Một</label>
              <input type="radio" v-model="setting.quantityFreeItem.value" name="quantityFreeItem" :value="2" class="ml-5 mt-2"><label class="ml-4 mt-1">Nhiều</label>
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorQuantityFreeItem">
              Vui lòng chọn số lượng miễn phí món khi thanh toán
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label>Sử dụng chức năng in tem, nhãn<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.printLabel.value" name="printLabel" :value="true" class="mt-2"><label class="ml-4 mt-1">Có</label>
              <input type="radio" v-model="setting.printLabel.value" name="printLabel" :value="false" class="ml-5 mt-2"><label class="ml-4 mt-1">Không</label>
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorPrintLabel">
              Vui lòng chọn một tùy chọn
            </b-form-invalid-feedback>
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
            <!--<b-form-invalid-feedback class="invalid-feedback" :state="!errorExpireDay">-->
              <!--Vui lòng nhập số ngày-->
            <!--</b-form-invalid-feedback>-->
          <!--</div>-->

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
        // pmtExpire: {
        //   "id": null,
        //   "code": "expired_point",
        //   "value": null
        // },
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
        printLabel: {
          "id": null,
          "code": "print_label",
          "value": false
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
    errorPrintLabel: function(){
      return this.checkInfo(this.setting.printLabel.value)
    }

  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorVat || this.errorIsWaiterPay || this.errorUseReponsetory || this.errorAutoClose
         || this.errorCusLogin || this.errorEditPrice || this.errorQuantityPmt  || this.errorQuantityDiscount
        || this.errorQuantityVoucher || this.errorQuantityFreeItem)
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
