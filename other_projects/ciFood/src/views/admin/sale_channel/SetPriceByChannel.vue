<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">
            <b-row>
              <b-col cols="6">
              </b-col>
              <b-col cols="6">
                <b-button variant="outline-success" class="pull-right btn-width-120" @click="save" :disabled="saving">
                  Lưu
                </b-button>
              </b-col>
            </b-row>
              <b-row class="form-row">
                <b-col md='12'>
                  <h4 class="mt-2 text-center text-header">Đặt Giá Cho Món Theo Kênh Bán Hàng</h4>
                </b-col>
              </b-row>
              <hr/>
              <b-row class="form-row">
                <b-col md='12'>
                  <label> Chọn kênh bán hàng </label>
                  <b-form-select
                  :options="options"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.sale_channel"
                  @change="loadFoodBySaleChannel"></b-form-select>
                </b-col>
              </b-row>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <table class="table table-bordered table-striped mt-4">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên món</th>
                    <th>Giá bán gốc</th>
                    <th>Giá bán theo kênh bán hàng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(data, index) in inputs.foods" :key="data.id">
                    <td>{{index + 1}}</td>
                    <td>{{data.name}}</td>
                    <td class="text-right">{{currencyFormat(data.root_price)}}</td>
                    <td class="text-right">
                      <input
                      id="name"
                      type="text"
                      autocomplete="new-password"
                      class="form-control"
                      maxlength="10"
                      @keyup="intergerOnly($event.target)"
                      v-model="inputs.foods[index].price_by_channel"></td>
                  </tr>
                </tbody>
              </table>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>


  </div>
</template>
<script>
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/topping'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      options: [
        {value: 'false', text: 'Hết món'},
        {value: 'true', text: 'Còn món'}
      ],
      inputs: {
        "sale_channel": null,
        "foods": []
      },
      saving: false,
      loading: false
    }
  },
  mounted() {
    // Load option sale channel
    this.getSaleChannelOptions()
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
   * Make toast with title
   */
    makeToast(variant = null, title, content) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true,
        autoHideDelay: 3000
      })
    },

    /**
     * Load list option sale channel
     */
    getSaleChannelOptions () {
      adminAPI.getListSaleChannelOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.options = res.data.data

          if (this.options.length > 0) {
            this.inputs.sale_channel = this.options[0].value

            // Get list food
            this.getFoodBySaleChannel()
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Get food by sale channel
     */
    getFoodBySaleChannel() {
      let sale_channel_id = this.inputs.sale_channel
      if(sale_channel_id){
        this.loading = true

        adminAPI.getFoodBySaleChannel(sale_channel_id).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.inputs.foods = res.data.data
          }
          this.loading = false
        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    },

    /**
     * Load food by sale channel
     */
    loadFoodBySaleChannel() {
      this.getFoodBySaleChannel()
    },


    /**
     * Save
     */
    save() {
      this.saving = true
      adminAPI.savePriceFoodBySaleChannel(this.inputs).then(res => {
        this.saving = false
        if (res != null && res.data != null) {
          this.popToast('success', 'Lưu thành công!!!')
        }
      }).catch(err => {
        this.saving = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
   * Currency format
   */
    currencyFormat(num) {
      let result = null

      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      } else {
        if(num == 0) {
          return 0
        }
      }
      return result
    },

    /**
     * Only input integer
     */
     intergerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },
  }
}
</script>
