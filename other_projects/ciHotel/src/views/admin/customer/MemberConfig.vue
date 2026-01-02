<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='12'>
              <b-button variant="primary" class="pull-right px-4 default-btn-bg btn-width-120" @click="save()" :disabled="saving">
                Lưu
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center">Thiết lập thành viên</h4>
            </b-col>
          </b-row>
          <hr>
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <div class="form-group">
            <label>Số điểm của khách hàng sẽ hết hạn sau<span class="error-sybol"></span></label>
            <div class="input-group">
              <input
              id="pasword"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="setting.pmtExpire.value"
              @keyup="integerOnly($event.target)"
              maxlength="11"><span class="input-group-addon">&nbsp;&nbsp;Ngày</span>
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorExpireDay">
              Vui lòng nhập số ngày
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label>Áp dụng khuyến mãi theo số tiền tích lũy<span class="error-sybol"></span></label>
            <div class="input-group">
              <input type="radio" v-model="setting.discountByMoney.value" name="discountByMoney" :value="'true'" class="mt-2" @change="changeDiscountByMoney"><label class="ml-4 mt-1">Có</label>
              <input type="radio" v-model="setting.discountByMoney.value" name="discountByMoney" :value="'false'" class="ml-5 mt-2" @change="changeDiscountByMoney"><label class="ml-4 mt-1">Không</label>
            </div>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorDiscountByMoney">
              Vui lòng chọn một tùy chọn
            </b-form-invalid-feedback>
          </div>

          <b-row v-show="setting.discountByMoney.value == 'true'">
            <b-col md="6">
              <b-row>
                <b-col>
                  <label>Số tiền tích lũy<span class="error-sybol"></span></label>
                  <input
                    id="money"
                    v-model="inputs.money"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    maxlength="11"
                    @keyup="integerOnly($event.target)">
                </b-col>
              </b-row>

              <b-row>
                <b-col>
                  <label>Phần trăm giảm giá<span class="error-sybol"></span></label>
                  <input
                    id="discount_percent"
                    v-model="inputs.discountPercent"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    maxlength="3"
                    @keyup="integerOnly($event.target)">
                </b-col>
              </b-row>

              <b-row class="text-center mt-2">
                <b-col>
                  <b-button variant="primary" class="px-4 default-btn-bg btn-width-120" @click="addListDiscount()" :disabled="saving">
                    Thêm
                  </b-button>
                </b-col>
              </b-row>
            </b-col>
            <b-col md="6">
              <p v-for="item in setting.listDiscount" :key="item.code">
                {{'Tích lũy: '}} <b>{{currencyFormat(item.code)}}</b> {{'vnđ, Giảm giá: '}}  <b>{{item.value}}</b> {{'%'}}
              </p>
            </b-col>
          </b-row>

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
        pmtExpire: {
          "id": null,
          "code": "expired_point",
          "value": 30
        },
        discountByMoney: {
          "id": null,
          "code": "discount_by_money",
          "value": false
        },
        listDiscount: []
      },
      inputs: {
        money: null,
        discountPercent: null
      },
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted () {
    this.getMemberConfig()
  },
  computed: {
    errorExpireDay: function () {
      return this.checkInfo(this.setting.pmtExpire.value)
    },
    errorDiscountByMoney: function () {
      return this.checkInfo(this.setting.discountByMoney.value)
    },
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorExpireDay || this.errorDiscountByMoney)
    },

    /**
     * Event change discount by money
     */
    changeDiscountByMoney() {
      if(this.setting.discountByMoney.value == 'false') {
        this.setting.listDiscount = []
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
        adminAPI.saveMemberConfig(this.setting).then(res => {
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
    getMemberConfig () {
      this.loading = true

      adminAPI.getMemberConfig().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.setting = Mapper.mapMemberConfigModelToDto(res.data.data)

          console.log(JSON.stringify(this.setting))
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
     * Add list discount
     */
    addListDiscount() {
      if(this.inputs.money && this.inputs.discountPercent) {
        let item = {
          code: this.inputs.money,
          value: this.inputs.discountPercent,
          group: 'list_discount'
        }
        this.setting.listDiscount.push(item)

        this.inputs.money = null
        this.inputs.discountPercent = null
      } else {
        this.popToast('danger', "Vui lòng nhập đủ thông tin")
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
   * Currency format
   */
    currencyFormat(num) {
      let result = num
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },
  }
}
</script>
