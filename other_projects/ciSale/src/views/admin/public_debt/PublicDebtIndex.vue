<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card card-overflow-visible">
          <div class="p-4">

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <button class="btn btn-outline-secondary float-left btn-width-120" @click="back">
                  Quay lại
                </button>

                <button class="btn btn-outline-success float-right btn-width-120" @click="save" :disabled="saving">
                  Lưu
                </button>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full px-2">
                <h4 class="mt-2 text-center text-header">{{prefix_title}}Nợ Công</h4>
              </div>
            </div>
            <hr/>
            <!-- Loading -->
            <span class="loading-more" v-show="loading"><i class="fa fa-spinner fa-spin fa-3x text-primary"></i></span>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label> Khách hàng </label>
              </div>
              <div class="w-full md:w-3/4 px-2 mt-2">
                <multiselect
                  v-model="customerSelect"
                  :options="customerOptions"
                  :loading="loadingGetOptions"
                  placeholder="--Chọn khách hàng--"
                  label="name"
                  track-by="name"
                  @input="changeCustomer">
                </multiselect>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label> Tên khách hàng </label><span class="error-sybol"></span>
              </div>
              <div class="w-full md:w-3/4 px-2 mt-2">
                <input
                  id="customer_name"
                  type="text"
                  class="form-control"
                  v-model="debt.customer_name"
                  autocomplete="new-password"
                  maxlength="50">
                <div v-if="errorName" class="text-red-600 text-sm mt-1">
                  Vui lòng nhập tên khách hàng
                </div>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label> Số điện thoại </label><span class="error-sybol"></span>
              </div>
              <div class="w-full md:w-3/4 px-2 mt-2">
                <input
                  id="customer_phone_number"
                  type="text"
                  class="form-control"
                  v-model="debt.customer_phone_number"
                  autocomplete="new-password"
                  @keyup="integerOnly($event.target)"
                  maxlength="100">
                <div v-if="errorPhone" class="text-red-600 text-sm mt-1">
                  Vui lòng nhập số điện thoại
                </div>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>Địa chỉ</label>
              </div>
              <div class="w-full md:w-3/4 px-2 mt-2">
                <input
                  id="customer_address"
                  type="text"
                  class="form-control"
                  v-model="debt.customer_address"
                  autocomplete="new-password"
                  maxlength="100">
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>Mô tả</label>
              </div>
              <div class="w-full md:w-3/4 px-2 mt-2">
                <input
                  id="description"
                  type="text"
                  class="form-control"
                  v-model="debt.description"
                  autocomplete="new-password"
                  maxlength="100">
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>Số tiền</label><span class="error-sybol"></span>
              </div>
              <div class="w-full md:w-3/4 px-2 mt-2">
                <input
                  id="amount"
                  type="text"
                  class="form-control"
                  v-model="debt.total"
                  autocomplete="new-password"
                  maxlength="14"
                  @keyup="integerOnly($event.target)"
                  @change="changeTotal()">
                <div v-if="errorTotal" class="text-red-600 text-sm mt-1">
                  Vui lòng nhập số tiền
                </div>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>Lãi suất</label>
              </div>
              <div class="w-full md:w-3/4 px-2 mt-2">
                <input
                  id="interest_rate"
                  type="text"
                  class="form-control"
                  v-model="debt.interest_rate"
                  autocomplete="new-password"
                  maxlength="5"
                  @keyup="integerAndPointOnly($event.target)">
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>Kỳ hạn tính lãi</label>
              </div>
              <div class="w-full md:w-3/4 px-2 mt-2">
                <select
                  id="interest_period"
                  class="form-control"
                  v-model="debt.interest_period">
                  <option v-for="option in periodOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>Ngày mượn</label>
              </div>
              <div class="w-full md:w-3/4 px-2 mt-2">
                <datepicker v-model="debt.created_at" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus" :typeable="true"  ></datepicker>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>Ngày hẹn trả</label>
              </div>
              <div class="w-full md:w-3/4 px-2 mt-2">
                <datepicker v-model="debt.appointment_date" format="yyyy-MM-dd" :typeable="true"
                            placeholder="yyyy-mm-dd" input-class="datepicker-cus" ></datepicker>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>Số ngày nhắc trước khi đến hạn</label>
              </div>
              <div class="w-full md:w-3/4 px-2 mt-2">
                <input
                  id="forewarning"
                  type="text"
                  class="form-control"
                  v-model="debt.forewarning"
                  autocomplete="new-password"
                  maxlength="10"
                  @keyup="integerOnly($event.target)">
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>


import debitAPI from '@/api/debt'
import tradeApi from '@/api/trade'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'
import { useToast } from '@/composables/useToast'
import { useRouter, useRoute } from 'vue-router'
import moment from 'moment'


export default {
  components: {
    Datepicker,
    Multiselect
  },
  setup() {
    const { popToast } = useToast()
    const router = useRouter()
    const route = useRoute()
    return { popToast, router, route }
  },
  data() {
    return {
      prefix_title: "",
      periodOptions: [
        {value: 'day', text: 'Ngày'},
        {value: 'month', text: 'Tháng'},
        {value: 'year', text: 'Năm'}
      ],
      loadingGetOptions: false,
      customerSelect: {},
      customerOptions: [],
      debt: {
        customer_name: null,
        customer_phone_number: null,
        customer_address: null,
        description: null,
        total: null,
        order_id: null,
        customer_id: null,
        appointment_date: null,
        forewarning: 30,
        created_at: null,
        interest_rate: 0,
        interest_period: "month"
      },
      click: false,
      saving: false,
      loading: false,
      isEdit: false
    }
  },
  mounted() {
    let dateNow = new Date()
    let toDate = new Date(dateNow.setDate(dateNow.getDate() + 60))
    this.debt.appointment_date = toDate
    this.debt.created_at = new Date()

    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()

    // Get sale channel detail
    this.getDeptDetail()
  },
  watch: {
    customerSelect(val) {
      if(val && val.id) {
        this.debt.customer_id = val.id
        this.debt.customer_name = val.name
        this.debt.customer_phone_number = val.phone_number
        this.debt.customer_address = val.address
      } else {
        this.debt.customer_id = null
        this.debt.customer_name = null
        this.debt.customer_phone_number = null
        this.debt.customer_address = null
      }
    }
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.debt.customer_name)
    },
    errorPhone: function () {
      return this.checkInfo(this.debt.customer_phone_number)
    },
    errorTotal: function () {
      return this.checkInfo(this.debt.total)
    },
  },
  methods: {



    checkInfo(info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate() {
      return !(this.errorName || this.errorPhone || this.errorTotal)
    },

    /**
     *  Get tất cả các options liên quan
     */
    getOptionsRelated() {
      this.loadingGetOptions = true
      let params = {
        "customers": true
      }
      tradeApi.getAllOptionsRelated(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          // customers
          if(params.customers) {
            this.customerOptions = options.customers
            this.customerOptions.unshift({"id": null, "name": ''})
          }
        }
        this.loadingGetOptions = false
      }).catch(err => {
        this.loadingGetOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('error', errorMess)
      })
    },

    /**
     *  Event change customer
     */
    changeCustomer() {
      // Handled by watcher
    },

    /**
     *  Get detail
     */
    getDeptDetail() {
      let id = this.route.params.id
      if (id) {
        this.prefix_title = "Cập Nhật "

        this.loading = true
        this.isEdit = true;
        debitAPI.getPublicDeptDetail(id).then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            this.debt = res.data.data

            this.debt.created_at = new Date(this.debt.created_at)
            this.debt.appointment_date = new Date(this.debt.appointment_date)
            this.debt.total = this.currencyFormat(this.debt.total)
          }

          this.loading = false
        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.toast(errorMess, 'error')
        })
      } else {
        this.prefix_title = "Tạo Mới "
      }
    },

    /**
     *  Save
     */
    save() {
      this.click = true

      let checkValidate = this.checkValidate()
      if (!checkValidate) {
        return
      }

      this.saving = true

      let params = {
        ...this.debt,
        total: (this.debt.total + "").replaceAll(".", "").replaceAll(",", ""),
        created_at: moment(this.debt.created_at).format('YYYY-MM-DD'),
        appointment_date: moment(this.debt.appointment_date).format('YYYY-MM-DD')
      }

      let id = this.route.params.id
      if (id) {
        // Edit
        params.id = id
        debitAPI.updatePublicDept(params).then(res => {
          this.saving = false
          if (res != null && res.data != null) {
            if (res.data.status == 200) {
              // show popup success
              this.popToast('success', 'Cập nhật thành công!!! ')
              this.router.push("/public-debt")
            }
          }
        }).catch(err => {
          this.saving = false
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('error', errorMess)
        })
      } else {
        // Add
        debitAPI.addPublicDept(params).then(res => {
          this.saving = false
          if (res != null && res.data != null) {

            if (res.data.status == 200) {
              this.router.push("/public-debt")
            }
          }
        }).catch(err => {
          this.saving = false
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('error', errorMess)
        })
      }
    },

      changeTotal() {
        if(this.debt.total) {
            let total = this.debt.total.replaceAll(".", "").replaceAll(",", "")
            this.debt.total = this.currencyFormat(total)
        }
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

      /**
     * Only input integer
     */
     integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

      /**
     * Only input float
     */
    integerAndPointOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerAndPointOnly(valueInput)
      item.value = result
    },

    /**
     * Only input date
     */
    inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.router.push("/public-debt")
    }
  }
}
</script>

<style>
.card-overflow-visible {
  overflow: visible !important;
}
</style>
