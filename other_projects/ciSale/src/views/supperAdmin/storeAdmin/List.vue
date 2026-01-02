<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>

          <b-row>
            <b-col>
                <b-button variant="primary" class="pull-right px-4 default-btn-bg" @click="gotoAdd()">
                  Thêm
                </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center">Admin Store</h4>
            </b-col>
          </b-row>
          <hr>

            <b-row>
              <b-col md="3">
                <label>Tên</label>
                <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model="inputs.name"
                  maxlength="100">
              </b-col>
            <b-col md="3">
                <label>Số Điện Thoại</label>
                <input
                  id="phone"
                  type="text"
                  class="form-control"
                  v-model="inputs.phone_number"
                  @keyup="integerOnly($event.target)"
                  maxlength="20">
              </b-col>
            <b-col md="2">
                <label>Quyền</label>
                <b-form-select
                  :options="options"
                  id="phone"
                  type="text"
                  class="form-control"
                  v-model="inputs.role_id"></b-form-select>
              </b-col>
              <b-col md="2">
                <label>Tên Cửa Hàng</label>
                <input
                  id="nameStore"
                  type="text"
                  class="form-control"
                  maxlength="100"
                  v-model="inputs.store_name">
              </b-col>

              <b-col md="2">
                <label>Thương hiệu</label>
                <b-form-select
                  :options="optionsBrand"
                  id="brand_id"
                  type="text"
                  class="form-control"
                  v-model="inputs.brand_id"></b-form-select>
              </b-col>
          </b-row>

          <b-row class="mt-2 mb-2">
            <b-col md="12">
              <b-button variant="primary" class="mb-3 pull-right px-4 default-btn-bg" :disabled="onSearch" @click.prevent="prepareToSearch">
              Tìm Kiếm
            </b-button>
            </b-col>
            </b-row>

          <b-table
          hover
          bordered
          stacked="md"
          :fields="fields"
          :items="items">
          <template v-slot:cell(actions)="dataId">
            <b-list-group horizontal>
              <b-list-group-item v-b-tooltip.hover title="Edit" @click="edit(dataId.item.id)">
                <i class="fa fa-edit" />
              </b-list-group-item>
              <b-list-group-item v-b-tooltip.hover title="Delete" @click="deleted(dataId.item.id, dataId.item.name, dataId.item.stt)">
                <i class="fa fa-trash" />
              </b-list-group-item>
            </b-list-group>
            <b-list-group horizontal>
              <b-list-group-item v-b-tooltip.hover title="Reset password" @click="showModalConfirmResetPass(dataId.item)">
                <i class="fa fa-refresh" />
              </b-list-group-item>
            </b-list-group>
          </template>
          </b-table>
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">Hết</span>
        </b-card>
      </b-col>
    </b-row>

    <!-- Modal xác nhận reset pass -->
    <b-modal centered hide-footer hide-header id="modal-confirm-reset-pass">
      <b-row>
        <b-col>
          <h5 class="text-center text-header">Reset password</h5>
          <hr>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <p>Nhân viên: <b>{{currentStaff.name}}</b></p>
          <p>Số điện thoại: <b>{{currentStaff.phone_number}}</b></p>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="text-center mt-3" v-show="!resetting">
          <button class="btn btn-width-120 btn-outline-secondary" @click="hideModalConfirmResetPass()">
            Đóng
          </button>
          <button class="ml-2 btn btn-width-120 btn-outline-success" @click="resetPass()">
            Xác nhận
          </button>
        </b-col>
        <b-col v-show="resetting">
          <span class="loading-more" v-show="resetting"><icon name="loading" width="60" /></span>
        </b-col>
      </b-row>
    </b-modal>

  </div>
</template>
<script>
import superAdminAPI from '@/api/superAdmin'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'name',
          label: 'Tên'
        },
        {
          key: 'phone_number',
          label: 'Số Điện Thoại'
        },
        {
          key: 'brand_name',
          label: 'Thương hiệu'
        },
        {
          key: 'store_name',
          label: 'Cửa Hàng'
        },
        {
          key: 'role_name',
          label: 'Quyền'
        },
        {
          key: 'created_at',
          label: 'Ngày Tạo'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      items: [],
      options: [
        {value: '', text: 'Tất cả'},
        {value: '1', text: 'Staff'},
        {value: '2', text: 'Admin'},
      ],
      optionsBrand: [],
      inputs: {
        name: '',
        phone_number: '',
        role_id: '',
        store_name: '',
        brand_id: null
      },
      loadByScroll: false,
      onSearch: false,
      hasNext: true,
      loading: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      listIdDeleted: [],
      currentStaff: {},
      resetting: false,
    }
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  mounted() {
    // Get brand options
    this.getOptionBrand()

    window.addEventListener('scroll', this.onScroll)
    this.search()
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
     * Event scroll
     */
    onScroll (event) {
      if(this.onSearch) {
        return
      }
      event.preventDefault()
      var body = document.body
      var html = document.documentElement
      if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if(this.hasNext) {
          this.offset = this.offset + this.pageLimit
          this.loadByScroll = true
          this.search ()
        }
      }
    },

    /**
     * Get brand options
     */
    getOptionBrand() {
      superAdminAPI.getBrandOption().then(res => {
        this.optionsBrand = [{"value": null, "text": ""}]
        if(res && res.data && res.data.data) {
          let brands = res.data.data
          for (var index in brands) {
            let brand = {
              value: brands[index].value,
              text: brands[index].text
            }
            this.optionsBrand.push(brand)
          }
        }

      }).catch(err => {
        // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
      })
    },

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
     * Delete
     */
    deleted (id, name, rowIndex) {
      this.$bvModal.msgBoxConfirm('Xóa [' + name + "]. Bạn có chắc không?", {
        title: false,
        buttonSize: 'sm',
        centered: true, size: 'sm',
        footerClass: 'p-2'
      }).then(res => {
        if(res){
          superAdminAPI.deleteAdminStore(id).then(res => {
            // Remove item in list
            let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
            this.items.splice(indexTemp, 1)
            this.listIdDeleted.push(rowIndex - 1)
          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
      })
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.$router.push('/admin-store/index/' + id)
    },

    /**
     * Go to add
     */
    gotoAdd () {
      this.$router.push('/admin-store/index/')
    },

    /**
     * Search
     */
    search () {
      if (this.loading) { return }

      this.onSearch = true
      this.loading = true

      let req = {
        "name": this.inputs.name,
        "phone_number": this.inputs.phone_number,
        "role_id": this.inputs.role_id,
        "store_name": this.inputs.store_name,
        "brand_id": this.inputs.brand_id,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      superAdminAPI.searchAdminStore(req).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.staffs

          // Update items
          if(this.loadByScroll) {
            let temp = this.items
            var newArray = temp.concat(it)
            this.items = newArray
          } else {
            this.items = it
          }
          this.loadByScroll = false

          // Check has next
          if(this.offset + this.pageLimit >= res.data.data.total_row) {
            this.hasNext = false
          }
        } else {
          this.items = []
        }
          this.onSearch = false
          this.loading = false
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)

          this.onSearch = false
          this.loading = false
      })
    },

    /**
     * Only input integer
     */
     integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

    showModalConfirmResetPass(staff) {
      this.currentStaff = staff
      this.$bvModal.show('modal-confirm-reset-pass')
    },

    hideModalConfirmResetPass() {
      this.$bvModal.hide('modal-confirm-reset-pass')
    },

    /**
     * Go to edit
     * @param id
     */
     resetPass() {
      if (this.resetting) { return }

      this.resetting = true

      let params = {
        "id": this.currentStaff.id,
        "phone": this.currentStaff.phone_number
      }

      superAdminAPI.resetPass(params).then(res => {
        if (res != null && res.data != null && res.data.status == 200) {
          this.hideModalConfirmResetPass()

          let message = "Mật khẩu mới: " + this.currentStaff.phone_number
          this.$bvModal.msgBoxOk(message, {
            title: "Reset Mật Khẩu Thành Công",
            centered: true,
            size: 'sm',
            headerClass: 'bg-success',
          })
        }

        this.resetting = false
        }).catch(err => {
          this.resetting = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
      })
    },
  }
}
</script>
