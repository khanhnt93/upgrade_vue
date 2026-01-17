<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <h4 class="text-xl font-semibold text-center">Chi Tiết Phiếu {{fund.type == 0 ? 'Thu' : 'Chi'}}</h4>
      </div>
      <hr class="my-4">

      <div v-show="loading" class="flex justify-center my-4">
        <icon name="loading" width="60" />
      </div>

      <div class="space-y-4">
        <div>
          <label class="font-medium">Số phiếu: {{fund.fund_number}}</label>
        </div>

        <div>
          <label class="font-medium">Ngày tạo: {{fund.date_input}}</label>
        </div>

        <div>
          <label class="font-medium">Ngày hoạch toán: {{fund.accounting_date}}</label>
        </div>

        <div>
          <label class="font-medium">Khoản thu cho ĐH: {{fund.order_sell_number ? fund.order_sell_number : fund.order_buy_number}}</label>
        </div>

        <div>
          <label class="font-medium">Đối tượng thu-chi: {{fund.object_type_str}}</label>
        </div>

        <div>
          <label class="font-medium">Số tiền: {{currencyFormat(fund.amount)}}</label>
        </div>

        <div>
          <label class="font-medium">Sổ khoản thu-chi: {{fund.money_type_str}}</label>
          <p class="ml-3" v-show="fund.bank_account_name">{{fund.bank_account_name}}</p>
        </div>

        <div>
          <label class="font-medium">Nhóm khoản thu-chi: {{fund.expend_income_group_name}}</label>
        </div>

        <div>
          <label class="font-medium">Loại khoản thu-chi: {{fund.expend_income_type_name}}</label>
        </div>

        <div>
          <label class="font-medium">Diễn giải nội dung: {{fund.description}}</label>
        </div>

        <div>
          <label class="font-medium" :class="fund.is_active ? 'text-green-600' : 'text-red-600'">
            Trạng thái: {{fund.is_active ? 'Đang hoạt động' : 'Đã xoá'}}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'
import fundApi from '@/api/fund'
import commonFunc from '@/common/commonFunc'

const route = useRoute()
const { popToast } = useToast()

const fund = ref({
  name: '',
  phone_number: '',
  role_name: ''
})
const loading = ref(false)

const getFundHisDetail = () => {
  loading.value = true
  let id = route.params.id
  fundApi.getFundHisDetail(id).then(res => {
    if(res != null && res.data != null && res.data.data != null){
      fund.value = res.data.data
    }
    loading.value = false
  }).catch(err => {
    loading.value = false
    let errorMess = commonFunc.handleCusError(err)
    popToast('danger', errorMess)
  })
}

const currencyFormat = (num) => {
  let result = ""
  if(num == 0) {
    return "0"
  }
  if(num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

onMounted(() => {
  getFundHisDetail()
})
</script>
