<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right btn-width-120" @click="gotoAdd()">
                Thêm
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-1 text-center text-header">Danh Sách Nhân Viên</h4>
            </b-col>
          </b-row>
          <hr>

            <b-row class="form-row">
              <b-col md="3">
                <label> Tên </label>
                <input
                id="name"
                type="text"
                maxlength="100"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.name">
              </b-col>
              <b-col md="3">
                <label> Số Điện Thoại </label>
                <input
                id="phone"
                type="text"
                maxlength="20"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.phone"
                @keyup="integerOnly($event.target)">
              </b-col>
              <b-col md="3">
                <label> Quyền </label>
                <b-form-select
                id="permision"
                :options="roleOptions"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.role"></b-form-select>
              </b-col>

              <b-col md="3">
                  <label class="label-width text-white">
                     Xem
                  </label>
                  <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch" @click.prevent="prepareToSearch">
                    Tìm Kiếm
                  </b-button>
              </b-col>
            </b-row>

          <b-row>
            <b-col>
              Số kết quả: {{totalRow}}
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
            <b-list-group horizontal v-if="isRoot">
              <b-list-group-item v-b-tooltip.hover title="Reset password" @click="showModalConfirmResetPass(dataId.item)">
                <i class="fa fa-refresh" />
              </b-list-group-item>
            </b-list-group>
          </template>
          </b-table>
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
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
import adminAPI from '@/api/admin'
import staffAPI from '@/api/staff'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      roleOptions:[],
      perPage: '10',
      currentPage: '1',
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
      inputs: {
        name: '',
        phone: '',
        role: ''
      },
      loadByScroll: false,
      onSearch: false,
      hasNext: true,
      loading: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      listIdDeleted: [],
      totalRow: 0,
      currentStaff: {},
      isRoot: false,
      resetting: false,
    }
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  mounted() {
    if(this.$store.state && this.$store.state.user && this.$store.state.user.isRoot) {
      this.isRoot = true
    }

    // Get role options
    this.getRoleOption()

    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.deleted)
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
     * Scroll event
     */
    onScroll (event) {
      if(this.onSearch) {
        return
      }
      event.preventDefault()
      var body = document.body
      var html = document.documentElement
      if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if(this.hasNext) {
          this.offset = this.offset + 10
          this.loadByScroll = true
          this.search()
        }
      }
    },

    /**
     *  Get role options
     */
    getRoleOption() {
      adminAPI.getRoleOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.roleOptions = [{value: null, text: ''}]

          var roles = res.data.data
          if(roles) {
            for (let i in roles) {
              this.roleOptions.push(roles[i])
            }
          }
        }
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
     * @param id
     * @param name
     * @param rowIndex
     */
    deleted (id, name, rowIndex) {
      if(id && name) {
        this.$bvModal.msgBoxConfirm('Xóa ' + name + ". Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if(res){
            adminAPI.deleteStaff(id).then(res => {
              // Remove item in list
              let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
              this.items.splice(indexTemp, 1)
              this.listIdDeleted.push(rowIndex - 1)

              this.totalRow = this.totalRow - 1
            }).catch(err => {
              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.popToast('danger', errorMess)
            })
          }
        })
      }
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.$router.push('/staff/index/' + id)
    },

    /**
     * Go to add
     */
    gotoAdd () {
      this.$router.push('/staff/index/')
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
        "phone_number": this.inputs.phone,
        "role_id": this.inputs.role,
        "store_name": "store ".concat(this.$store.state.user.storeId),
        "limit": this.pageLimit,
        "offset": this.offset
      }

      adminAPI.searchStaff(req, this.offset).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.staffs //Mapper.mapStaffModelSearchToDto(res.data.data.staffs, this.offset)
          this.totalRow = res.data.data.total_row

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

      staffAPI.resetPass(params).then(res => {
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
