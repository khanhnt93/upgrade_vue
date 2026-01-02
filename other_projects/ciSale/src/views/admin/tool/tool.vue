<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <h2 class="text-center text-header">Công Cụ</h2>

          <b-row>
            <b-col md="6">
              <b-button variant="outline-success" class="pull-left" @click="showModalCafeCalBy" :disabled="loading">
                Tính toán số lượng thực tế dựa trên độ ẩm và tạp<br>
                (Dùng cho đại lý cafe)
              </b-button>
            </b-col>
          </b-row>

          <!--Modal tính số lượng thực tế dựa trên tạp và độ ẩm -->
          <b-modal centered hide-footer hide-header size="lg" id="modal-cal-impurities-moisture">
            <b-row>
              <b-col md="12">
                <h4 class="modal-title text-center text-header">Tính toán dựa trên độ ẩm và tạp</h4>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="12">
                <label> Độ ẩm tiêu chuẩn </label><span class="error-sybol"></span>
                <div class="input-group">
                  <input
                    id="moisture_default"
                    type="text"
                    maxlength="20"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="cafe_impurities_and_moisture.moisture_default"
                    @keyup="integerAndPointOnly($event.target)"
                    :disabled="!edit_moisture_default">
                  <b-button v-show="edit_moisture_default == false" variant="outline-primary" class="ml-2 pull-right text-center btn-width-80"
                            @click="edit_moisture_default = true">
                    Sửa
                  </b-button>
                  <b-button v-show="edit_moisture_default == true" variant="outline-success" class="ml-2 pull-right text-center btn-width-80"
                            @click="updateStoreSetting('moisture_default')">
                    Lưu
                  </b-button>
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="12">
                <label> % tạp tiêu chuẩn </label><span class="error-sybol"></span>
                <div class="input-group">
                <input
                  id="impurities_default"
                  type="text"
                  maxlength="20"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="cafe_impurities_and_moisture.impurities_default"
                  @keyup="integerAndPointOnly($event.target)"
                  :disabled="!edit_impurities_default">
                  <b-button v-show="edit_impurities_default == false" variant="outline-primary" class="ml-2 pull-right text-center btn-width-80"
                            @click="edit_impurities_default = true">
                    Sửa
                  </b-button>
                  <b-button v-show="edit_impurities_default == true" variant="outline-success" class="ml-2 pull-right text-center btn-width-80"
                            @click="updateStoreSetting('impurities_default')">
                    Lưu
                  </b-button>
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="12">
                <label> Cân nặng bì tiêu chuẩn </label><span class="error-sybol"></span>
                <div class="input-group">
                  <input
                    id="bad_weight_default"
                    type="text"
                    maxlength="20"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="cafe_impurities_and_moisture.bad_weight_default"
                    @keyup="integerAndPointOnly($event.target)"
                    :disabled="!edit_bad_weight_default">
                  <b-button v-show="edit_bad_weight_default == false" variant="outline-primary" class="ml-2 pull-right text-center btn-width-80"
                            @click="edit_bad_weight_default = true">
                    Sửa
                  </b-button>
                  <b-button v-show="edit_bad_weight_default == true" variant="outline-success" class="ml-2 pull-right text-center btn-width-80"
                            @click="updateStoreSetting('bad_weight_default')">
                    Lưu
                  </b-button>
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="12">
                <label> Độ ẩm thực tế </label> <span class="error-sybol"></span>
                <input
                  id="moisture_input"
                  type="text"
                  maxlength="20"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="cafe_impurities_and_moisture.moisture_input"
                  @keyup="integerAndPointOnly($event.target)">
              </b-col>
            </b-row>

            <b-row>
              <b-col md="12">
                <label> % tạp thực tế </label> <span class="error-sybol"></span>
                <input
                  id="impurities_input"
                  type="text"
                  maxlength="20"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="cafe_impurities_and_moisture.impurities_input"
                  @keyup="integerAndPointOnly($event.target)">
              </b-col>
            </b-row>

            <b-row>
              <b-col md="12">
                <label> Số lượng bì </label> <span class="error-sybol"></span>
                <input
                  id="number_bag_input"
                  type="text"
                  maxlength="20"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="cafe_impurities_and_moisture.number_bag_input"
                  @keyup="integerOnly($event.target)">
              </b-col>
            </b-row>

            <b-row>
              <b-col md="12">
                <label> Số lượng nhập </label> <span class="error-sybol"></span>
                <input
                  id="phone"
                  type="text"
                  maxlength="20"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="cafe_impurities_and_moisture.quantity"
                  @keyup="integerAndPointOnly($event.target)">
              </b-col>
            </b-row>

            <b-row>
              <b-col md="12">
                <p> Mỗi đơn vị trừ: <b>{{currencyFormat(result_cal_cafe_impurities_and_moisture.minus_in_1_kg)}} đơn vị</b></p>
                <p> Tổng số lượng trừ ẩm, tạp: <b>{{currencyFormat(result_cal_cafe_impurities_and_moisture.minus_in_all_1)}} đơn vị</b></p>
                <p> Tổng số lượng trừ bì: <b>{{currencyFormat(result_cal_cafe_impurities_and_moisture.minus_in_all_2)}} đơn vị</b></p>
                <p> Số lượng thực tế nhập kho: <b>{{currencyFormat(result_cal_cafe_impurities_and_moisture.current_quantity)}} đơn vị</b></p>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="12">
                <b-button variant="outline-secondary" class="pull-left text-center btn-width-120" :disabled="loading"
                          @click="hideModalCafeCalBy">
                  Quay lại
                </b-button>

                <b-button variant="outline-primary" class="pull-right text-center btn-width-120" :disabled="loading"
                          @click="calQuantityByImpuritiesAndMoisture">
                  Xác nhận
                </b-button>
              </b-col>
            </b-row>

          </b-modal>

        </b-card>
      </b-col>
    </b-row>

  </div>
</template>

<script>
import toolAPI from "@/api/tool";
import settingAPI from "@/api/setting";
import commonFunc from "@/common/commonFunc";

export default {
  data() {
    return {
      cafe_impurities_and_moisture: {
        "impurities_default": 0, // Độ tạp
        "moisture_default": 0, // Độ ẩm
        "bad_weight_default": 0, // Cân nặng bao
        "impurities_input": null,
        "moisture_input": null,
        "number_bag_input": null,
        "quantity": null,
      },
      result_cal_cafe_impurities_and_moisture: {
        "minus_in_1_kg": 0,
        "minus_in_all_1": 0,
        "minus_in_all_2": 0,
        "current_quantity": 0,
      },
      edit_moisture_default: false,
      edit_impurities_default: false,
      edit_bad_weight_default: false,
      loading: false,

    };
  },
  computed: {
  },
  mounted() {
    // Get độ tạp, độ ẩm tiêu chuẩn từ setting
    this.getSettingByGroup()

  },
  methods: {
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: "my-toast",
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      });
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
     * Only input integer
     */
    integerAndPointOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerAndPointOnly(valueInput)
      item.value = result
    },

    showModalCafeCalBy() {
      this.$bvModal.show('modal-cal-impurities-moisture')
    },

    hideModalCafeCalBy() {
      this.$bvModal.hide('modal-cal-impurities-moisture')
    },

    /**
     * Get độ tạp, độ ẩm tiêu chuẩn từ setting
     */
    getSettingByGroup() {
      let params = {"group": "cafe_impurities_and_moisture"}
      settingAPI.getSettingByGroup(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let datas = res.data.data

          let is_edit_impurities_default = false
          let is_edit_moisture_default = false
          let is_edit_bag_weight_default = false
          for (let i in datas) {
            if(datas[i].code == "impurities_default") {
              this.cafe_impurities_and_moisture.impurities_default = datas[i].value
              this.edit_impurities_default = false
              is_edit_impurities_default = true
            }
            if(datas[i].code == "moisture_default") {
              this.cafe_impurities_and_moisture.moisture_default = datas[i].value
              this.edit_moisture_default = false
              is_edit_moisture_default = true
            }
            if(datas[i].code == "bad_weight_default") {
              this.cafe_impurities_and_moisture.bad_weight_default = datas[i].value
              this.edit_bad_weight_default = false
              is_edit_bag_weight_default = true
            }
          }

          if(is_edit_impurities_default == false) {
            this.edit_impurities_default = true
          }
          if(is_edit_moisture_default == false) {
            this.edit_moisture_default = true
          }
          if(is_edit_bag_weight_default == false) {
            this.edit_bad_weight_default = true
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Tính toán số lượng dựa trên độ ẩm và tạp
     */
    calQuantityByImpuritiesAndMoisture() {
      // Validate ở đây
      if(!this.cafe_impurities_and_moisture.impurities_default) {
        this.popToast('danger', "Hãy nhập giá trị độ tạp tiêu chuẩn")
        return
      }
      if(!this.cafe_impurities_and_moisture.moisture_default) {
        this.popToast('danger', "Hãy nhập giá trị độ ẩm tiêu chuẩn")
        return
      }

      if(!this.cafe_impurities_and_moisture.impurities_default || !this.cafe_impurities_and_moisture.moisture_input || !this.cafe_impurities_and_moisture.quantity) {
        this.popToast('danger', "Hãy nhập đủ các giá trị bắt buộc")
        return
      }

      this.result_cal_cafe_impurities_and_moisture = commonFunc.calQuantityCafe(
        this.cafe_impurities_and_moisture.impurities_input,
        this.cafe_impurities_and_moisture.impurities_default,
        this.cafe_impurities_and_moisture.bad_weight_default,
        this.cafe_impurities_and_moisture.moisture_input,
        this.cafe_impurities_and_moisture.moisture_default,
        this.cafe_impurities_and_moisture.number_bag_input,
        this.cafe_impurities_and_moisture.quantity)
    },

    /**
     * Update store setting
     */
    updateStoreSetting(code) {
      let params = {
        "code": code,
        "value": "",
        "group": "cafe_impurities_and_moisture"
      }
      if(code == "moisture_default") {
        params.value = this.cafe_impurities_and_moisture.moisture_default
      }
      if(code == "impurities_default") {
        params.value = this.cafe_impurities_and_moisture.impurities_default
      }
      if(code == "bad_weight_default") {
        params.value = this.cafe_impurities_and_moisture.bad_weight_default
      }
      settingAPI.updateStoreSetting(params).then(res => {
        if(res != null && res.data != null) {
          this.popToast('success', "Lưu giá trị thành công!")

          if(code == "moisture_default") {
            this.edit_moisture_default = false
          }
          if(code == "impurities_default") {
            this.edit_impurities_default = false
          }
          if(code == "bad_weight_default") {
            this.edit_bad_weight_default = false
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

      /**
   * Currency format
   */
    currencyFormat(num) {
      let result = ""
        if(num == 0) {
            return "0"
        }
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },

  }
};
</script>

<style lang="scss" scoped>

</style>
