<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h4 class="mt-2 text-center text-header">Chi Tiết Lịch Sử Khách Hàng</h4>
            </div>
          </div>
          <hr>
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-6">
              <h5>Tên khách hàng: <b class="text-header">{{customer.name}}</b></h5>
            </div>
            <div class="col-span-6">
              <p>Loại khách hàng: {{customer.type}}</p>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-6">
              <p>Số điện thoại: {{customer.phone_number}}</p>
            </div>
            <div class="col-span-6">
              <p>Giới tính: {{customer.gender}}</p>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-6">
              <p>Ngày sinh: {{customer.birthday}}</p>
            </div>
            <div class="col-span-6">
              <p>Mã số thuế: {{customer.mst}}</p>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <p>Địa chỉ: {{customer.address}}</p>
            </div>
          </div>

          <hr>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h5>Tổng điểm tích lũy: <b class="text-header">{{currencyFormat(customer.point)}}</b></h5>
              <p>(Tương ứng số tiền đã chi tiêu: {{currencyFormat(customer.point*1000)}}đ)</p>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <div class="border-b border-gray-200">
                <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
                  <li class="mr-2">
                    <a href="#" @click.prevent="activeTab = 0" :class="{'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg bg-gray-100': activeTab === 0, 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300': activeTab !== 0}">Lịch sử sử dụng DV</a>
                  </li>
                  <li class="mr-2">
                    <a href="#" @click.prevent="activeTab = 1" :class="{'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg bg-gray-100': activeTab === 1, 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300': activeTab !== 1}">DV đang sở hữu</a>
                  </li>
                </ul>
              </div>

              <div v-show="activeTab === 0" class="p-4 bg-white rounded-lg border">
                  <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-full">
                      Số lần đến: {{services.length}}
                    </div>
                  </div>

                  <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12">
                      <table class="table table-bordered table-hover table-responsive-stack">
                        <thead>
                          <tr>
                            <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in services" :key="index">
                            <td v-for="field in fields" :key="field.key" :data-label="field.label">
                              <div v-if="field.key === 'sub_total'">
                                {{ currencyFormat(item.sub_total) }}
                              </div>
                              <div v-else-if="field.key === 'services'">
                                <p v-for="(service, idx) in item.services" :key="service.name + idx">{{ service.quantity + " x " + service.name }}</p>
                              </div>
                              <div v-else>
                                {{ item[field.key] }}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
              </div>

              <div v-show="activeTab === 1" class="p-4 bg-white rounded-lg border">
                  <table class="table table-bordered table-hover table-responsive-stack">
                    <thead>
                      <tr>
                        <th v-for="field in services_owner_fields" :key="field.key">{{ field.label }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in services_owner" :key="index">
                        <td v-for="field in services_owner_fields" :key="field.key" :data-label="field.label">
                          <div v-if="field.key === 'stt'">
                            {{ index + 1 }}
                          </div>
                          <div v-else-if="field.key === 'price'">
                            {{ currencyFormat(item.price) }}
                          </div>
                          <div v-else>
                            {{ item[field.key] }}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
              </div>
            </div>
          </div>



        </div>

      </div>
    </div>

  </div>
</template>


<script>
import customerApi from '@/api/customer'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'

export default {
  data () {
    return {
      customer: {},
      activeTab: 0,
      services: [],
      services_owner: [],
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'order_at',
          label: 'Giờ vào'
        },
        {
          key: 'payment_at',
          label: 'Giờ ra'
        },
        {
          key: 'sub_total',
          label: 'Tổng tiền dv'
        },
        {
          key: 'services',
          label: 'Dịch vụ'
        },
        {
          key: 'note',
          label: 'Ghi chú'
        }
      ],
      services_owner_fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'name',
          label: 'Dịch vụ'
        },
        {
          key: 'quantity',
          label: 'Số lượng'
        },
        {
          key: 'price',
          label: 'Đơn giá'
        }
      ],
      loading: false
    }
  },
  mounted() {
    this.getCustomerHistoryDetail()
  },
  methods: {

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
     *  Get detail
     */
    getCustomerHistoryDetail() {
      let cusId = this.$route.params.id
      if(cusId) {
        this.loading = true
        customerApi.getCustomerHistoryDetail(cusId).then(res => {
          if(res != null && res.data != null && res.data.data != null){
            this.customer = res.data.data.customer_info
            this.services = res.data.data.services

              // Get list owner services
              this.getCustomerServiceOwner(cusId)
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
     *  Get danh sách dịch vụ đang sở hữu
     */
    getCustomerServiceOwner(cusId) {
        let params = {"store_id": this.$store.state.user.storeId, "customer_id": cusId}
      customerApi.getCustomerServiceOwner(params).then(res => {
          if(res != null && res.data != null && res.data.data != null){
            this.services_owner = res.data.data.services
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
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },
  }
}
</script>
