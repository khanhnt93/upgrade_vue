<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <button class="btn btn-outline-success float-right px-4 btn-width-120" @click="goToAdd()">
                Thêm
              </button>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h4 class="mt-2 text-center text-header">Quản lý công nợ</h4>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4">
              <label> Tên </label>
              <input
                id="name"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.customer_name"
                maxlength="75">
            </div>
            <div class="col-span-4">
              <label> Số điện thoại </label>
              <input
                id="price"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.customer_phone_number"
                maxlength="11">
            </div>
            <div class="col-span-4">
              <label>
                Trạng thái
              </label>
              <select class="form-control form-control"
                id="status"
                type="text"
                autocomplete="new-password"
                v-model="inputs.status">
                <option v-for="option in status" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4 mt-2 mb-2">
            <div class="col-span-12">
              <button class="btn btn-outline-primary float-right px-4 btn-width-120" :disabled="onSearch" @click.prevent="prepareToSearch">
                Tìm Kiếm
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              Số kết quả: {{totalRow}}
            </div>
          </div>

          <hr>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <table class="table table-bordered table-hover table-responsive-stack">
                <thead>
                  <tr>
                    <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in items" :key="index">
                    <td v-for="field in fields" :key="field.key" :data-label="field.label">
                      <div v-if="field.key === 'total'">
                        {{ currencyFormat(item.total) }}
                      </div>
                      <div v-else-if="field.key === 'remaining'">
                        {{ currencyFormat(item.remaining) }}
                      </div>
                      <div v-else-if="field.key === 'status'">
                        {{ item.status === 1 ? "Đã trả nợ" :  (item.status === 2 ? "Đã xoá nợ" : "Đang nợ")}}
                      </div>
                      <div v-else-if="field.key === 'actions'">
                        <div class="flex flex-col" horizontal v-show="item.status === 0">
                          <button class="list-group-item" title="Thanh toán" @click="openPayModal(item)">
                            <i class="fa fa-check-square-o" />
                          </button>
                          <button class="list-group-item" title="Sửa" @click="edit(item.id)">
                            <i class="fa fa-edit" />
                          </button>
                          <button class="list-group-item" title="Xoá nợ" @click="deleted(item.id, item.customer_name)">
                            <i class="fa fa-trash" />
                          </button>
                        </div>
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

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more">--Hết--</span>
        </div>
      </div>
    </div>


    <!-- Modal Pay -->
    <div v-if="showPayModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div class="flex items-center justify-between p-4 border-b">
          <h5 class="text-xl font-bold">Thanh toán</h5>
          <button @click="showPayModal = false" class="text-gray-500 hover:text-gray-700">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <div class="col-span-12 mb-4">
                <label>
                  Số tiền còn lại
                </label>
                <input
                  id="remaining"
                  type="number"
                  autocomplete="new-password"
                  class="form-control"
                  disabled
                  v-model="payData.remaining"
                  maxlength="75">
              </div>
              <div class="col-span-12">
                <label>
                  Số tiền trả
                </label>
                <input
                  id="amount"
                  type="number"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="payData.amount"
                  maxlength="75">
              </div>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4 mt-4">
            <div class="col-span-full text-right">
              <button class="btn px-4 default-btn-bg" @click="pay()">
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/topping'
import commonFunc from '@/common/commonFunc'

export default {
  data () {
    return {
      perPage: '10',
      currentPage: '1',
      totalRow: 0,
      status: [
        {value: '', text: ''},
        {value: '1', text: 'Đã trả nợ'},
        {value: '2', text: 'Đã xoá nợ'},
        {value: '0', text: 'Đang nợ'}
      ],
      inputs: {
        customer_name: null,
        customer_phone_number: null,
        status: null,
      },
      fields: [
        {
          key: 'id',
          label: 'STT'
        },
        {
          key: 'customer_name',
          label: 'Tên KH'
        },
        {
          key: 'customer_phone_number',
          label: 'Số Điện thoại'
        },
        {
          key: 'customer_address',
          label: 'Địa chỉ'
        },
        {
          key: 'total',
          label: 'Tổng tiền'
        },
        {
          key: 'remaining',
          label: 'Còn lại'
        },
        {
          key: 'status',
          label: 'Trạng thái'
        },
        {
          key: 'description',
          label: 'Mô tả'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      items: [],
      payData: {
        id: null,
        amount: 0,
        remaining: 0
      },
      showPayModal: false,
      loading: false,
      offset: 0,
      hasNext: true,
    }
  },
  mounted() {
    // Load list when load page
    this.getAll()
  },
  methods: {
    /**
     * Prepare to search
     */
    prepareToSearch() {
      this.offset = 0
      this.items = []
      this.hasNext = true

      this.search()
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
     *  Delete
     */
    deleted (id, name) {

      if (confirm('Xóa nợ [' + name + "]. Bạn có chắc không?")) {
        adminAPI.reliefPublicDebt(id).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.items = res.data.data
          }
          this.getAll()
          this.popToast('success', 'Xóa nợ thành công!!!')
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    },

    /**
     *  Go to edit
     */
    edit (id) {
      this.$router.push('/public-debt/edit/' + id)
    },

    openPayModal(pay) {
      this.payData.id = pay.id;
      this.payData.remaining = pay.remaining
      this.payData.amount = pay.remaining
      this.showPayModal = true;
    },

    /**
     * Thanh toán
     */
    pay() {
      if (this.payData.amount <= 0) {
        this.popToast('danger', 'Số tiền trả phải lớn hơn 0')
        return;
      }

      adminAPI.payPublicDebt(this.payData).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data
        }
        this.payData.id = null
        this.payData.amount = 0
        this.payData.remaining = 0
        this.showPayModal = false
        this.popToast('success', 'Đã thanh toán thành công!!')
        this.getAll()
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     *  Go to add
     */
    goToAdd () {
      this.$router.push('/public-debt/add')
    },

    /**
     *  Search
     */
    getAll() {
      this.loading = true

      // Search
      adminAPI.getListPublicDebt().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data;
          this.totalRow = this.items.length;
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
     *  Search
     */
    search() {
      this.loading = true

      // Search
      adminAPI.searchPublicDebit(this.inputs).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data;
          this.totalRow = this.items.length;
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
     * Currency format
     */
    currencyFormat(value) {
      if (value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return ""
    },

  }
}
</script>
