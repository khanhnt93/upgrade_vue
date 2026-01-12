<template>
  <div class="container-fluid mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-end mb-4">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
          @click="save()"
          :disabled="saving">
          Lưu
        </button>
      </div>

      <div class="text-center mb-4">
        <h4 class="text-xl font-semibold mt-2">Thiết lập thành viên</h4>
      </div>
      <hr class="mb-4">

      <!-- Loading -->
      <div v-show="loading" class="text-center py-4">
        <icon name="loading" width="60" />
      </div>

      <div class="mb-4">
        <label class="block mb-2">Số điểm của khách hàng sẽ hết hạn sau<span class="text-red-500">*</span></label>
        <div class="flex items-center">
          <input
            id="password"
            type="text"
            autocomplete="new-password"
            class="form-control flex-1"
            v-model="setting.pmtExpire.value"
            @keyup="integerOnly($event.target)"
            maxlength="11">
          <span class="ml-2">Ngày</span>
        </div>
        <div v-if="errorExpireDay" class="text-red-500 text-sm mt-1">
          Vui lòng nhập số ngày
        </div>
      </div>

      <div class="mb-4">
        <label class="block mb-2">Áp dụng khuyến mãi theo số tiền tích lũy<span class="text-red-500">*</span></label>
        <div class="flex items-center">
          <input
            type="radio"
            v-model="setting.discountByMoney.value"
            name="discountByMoney"
            value="true"
            class="mt-1"
            @change="changeDiscountByMoney">
          <label class="ml-4 mt-1">Có</label>
          <input
            type="radio"
            v-model="setting.discountByMoney.value"
            name="discountByMoney"
            value="false"
            class="ml-5 mt-1"
            @change="changeDiscountByMoney">
          <label class="ml-4 mt-1">Không</label>
        </div>
        <div v-if="errorDiscountByMoney" class="text-red-500 text-sm mt-1">
          Vui lòng chọn một tùy chọn
        </div>
      </div>

      <div v-show="setting.discountByMoney.value == 'true'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div class="mb-4">
            <label class="block mb-2">Số tiền tích lũy<span class="text-red-500">*</span></label>
            <input
              id="money"
              v-model="inputs.money"
              type="text"
              autocomplete="new-password"
              class="form-control w-full"
              maxlength="11"
              @keyup="integerOnly($event.target)">
          </div>

          <div class="mb-4">
            <label class="block mb-2">Phần trăm giảm giá<span class="text-red-500">*</span></label>
            <input
              id="discount_percent"
              v-model="inputs.discountPercent"
              type="text"
              autocomplete="new-password"
              class="form-control w-full"
              maxlength="3"
              @keyup="integerOnly($event.target)">
          </div>

          <div class="text-center mt-2">
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
              @click="addListDiscount()"
              :disabled="saving">
              Thêm
            </button>
          </div>
        </div>
        <div>
          <p v-for="item in setting.listDiscount" :key="item.code" class="mb-2">
            Tích lũy: <b>{{formatCurrency(item.code)}}</b> vnđ, Giảm giá: <b>{{item.value}}</b> %
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/setting'
import commonFunc from '@/common/commonFunc'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'

export default {
  setup() {
    const router = useRouter()
    const toast = useToast()
    const { formatCurrency } = useFormatters()

    return {
      router,
      toast,
      formatCurrency
    }
  },
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
              this.toast.success('Cập nhật cài đặt thành công!!! ')
            }
          }
        }).catch(err => {
          this.saving = false
          let message = "Lỗi hệ thống"
          alert(message)
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

        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
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
        this.toast.error("Vui lòng nhập đủ thông tin")
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
  }
}
</script>
