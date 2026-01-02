<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right btn-width-120" @click="goToAdd">
                Thêm
              </b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center text-header">Danh Sách Công Nợ</h4>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="4">
              <label> Tên </label>
              <input
                id="name"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.customer_name"
                maxlength="75">
            </b-col>
            <b-col md="4">
              <label> Số điện thoại </label>
              <input
                id="price"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.customer_phone_number"
                maxlength="11">
            </b-col>
            <b-col md="4">
              <label>
                Trạng thái
              </label>
              <b-form-select
                :options="status"
                id="status"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.status">
              </b-form-select>
            </b-col>
          </b-row>

          <b-row class="mt-2 mb-2">
            <b-col md="12">
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch" @click="prepareToSearch">
                Tìm Kiếm
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              Số kết quả: {{totalRow}}
            </b-col>
          </b-row>

          <hr>

          <b-row>
            <b-col md='12'>
              <b-table
                hover
                bordered
                stacked="md"
                :fields="fields"
                :items="items">

                <template v-slot:cell(total)="data">
                  {{ data.item.total | format_currency }}
                </template>

                <template v-slot:cell(remaining)="data">
                  {{ data.item.remaining | format_currency }}
                </template>

                <template v-slot:cell(status)="data">
                  {{ data.item.status === 1 ? "Đã trả nợ" :  (data.item.status === 2 ? "Đã xoá nợ" : "Đang nợ")}}
                </template>

                <template v-slot:cell(actions)="data">
                  <b-list-group horizontal v-show="data.item.status === 0">
                    <b-list-group-item v-b-tooltip.hover title="Thanh toán" @click="openPayModal(data.item)">
                      <i class="fa fa-check-square-o" />
                    </b-list-group-item>
                    <b-list-group-item v-b-tooltip.hover title="Sửa" @click="edit(data.item.id)">
                      <i class="fa fa-edit" />
                    </b-list-group-item>
                    <b-list-group-item v-b-tooltip.hover title="Xoá nợ" @click="deleted(data.item.id, data.item.customer_name)">
                      <i class="fa fa-trash" />
                    </b-list-group-item>
                  </b-list-group>
                </template>
              </b-table>
            </b-col>
          </b-row>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more">--Hết--</span>
        </b-card>
      </b-col>
    </b-row>


    <b-modal centered hide-footer hide-header id="modal-pay">
      <b-row>
        <b-col>
          <h5 class="text-center">Thanh toán</h5>
          <hr>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-col md="12">
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
          </b-col>
          <b-col md="12">
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
          </b-col>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="text-right mt-3">
          <button class="btn btn-primary px-4 default-btn-bg" @click="pay()">
            Thanh toán
          </button>
        </b-col>
      </b-row>
    </b-modal>
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
      loading: false,
      onSearch: false,
      offset: 0,
      hasNext: true,
    }
  },
  computed: {
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
     *  Delete
     */
    deleted (id, name) {

      this.$bvModal.msgBoxConfirm('Xóa nợ [' + name + "]. Bạn có chắc không?", {
        title: false,
        buttonSize: 'sm',
        centered: true, size: 'sm',
        footerClass: 'p-2'
      }).then(res => {
        if(res){
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
      })
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
      this.$bvModal.show('modal-pay')
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
        this.$bvModal.hide('modal-pay')
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
        if(this.onSearch) {
            return
        }
      this.loading = true
      this.onSearch = true

      // Search
      adminAPI.searchPublicDebit(this.inputs).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data;
          this.totalRow = this.items.length;
        }
        this.loading = false
        this.onSearch = false
      }).catch(err => {
        this.loading = false
        this.onSearch = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

  }
}
</script>
