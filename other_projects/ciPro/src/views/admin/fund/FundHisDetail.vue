<template>
  <div class="container-fluid">
    <b-card-group>
      <b-card no-body>
        <b-card-body>
            <b-row>
              <b-col cols="12">
                <h4>Chi Tiết Phiếu {{fund.type == 0 ? 'Thu' : 'Chi'}}</h4>
              </b-col>
            </b-row>
            <hr>
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>Số phiếu: {{fund.fund_number}}</label>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>Ngày tạo: {{fund.date_input}}</label>
              </b-col>
            </b-row>

          <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>Ngày hoạch toán: {{fund.accounting_date}}</label>
              </b-col>
            </b-row>

          <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>Khoản thu cho ĐH: {{fund.order_sell_number ? fund.order_sell_number : fund.order_buy_number}}</label>
              </b-col>
            </b-row>

          <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>Đối tượng thu-chi: {{fund.object_type_str}}</label>
              </b-col>
            </b-row>

          <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>Số tiền: {{currencyFormat(fund.amount)}}</label>
              </b-col>
            </b-row>

          <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>Sổ khoản thu-chi: {{fund.money_type_str}}</label>
                <p class="ml-3" v-show="fund.bank_account_name">{{fund.bank_account_name}}</p>
              </b-col>
            </b-row>

          <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>Nhóm khoản thu-chi: {{fund.expend_income_group_name}}</label>
              </b-col>
            </b-row>

          <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>Loại khoản thu-chi: {{fund.expend_income_type_name}}</label>
              </b-col>
            </b-row>

          <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label>Diễn giải nội dung: {{fund.description}}</label>
              </b-col>
            </b-row>

          <b-row class="form-row">
              <b-col md="12" class="mt-2">
                <label v-bind:class="fund.is_active ? 'text-success' : 'text-danger'">Trạng thái: {{fund.is_active ? 'Đang hoạt động' : 'Đã xoá'}}</label>
              </b-col>
            </b-row>
        </b-card-body>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import fundApi from '@/api/fund'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'


export default {
  setup() {
    const { popToast } = useToast()
    return { popToast }
  },
  data () {
    return {
      fund: {
        name: '',
        phone_number: '',
        role_name: ''
      },
      loading: false,
    }
  },
  mounted () {
    this.getFundHisDetail()
  },
  methods: {



    /**
     * Get staff information
     */
    getFundHisDetail () {
      this.loading = true
      let id = this.$route.params.id
      fundApi.getFundHisDetail(id).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.fund = res.data.data
        }

        this.loading = false
      }).catch(err => {
        this.loading = false

        // Handle error
          let errorMess = commonFunc.handleCusError(err)
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
}
</script>
