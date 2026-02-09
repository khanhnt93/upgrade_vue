<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <button class="btn btn-outline-success pull-right btn-width-120" @click="gotoAdd()">
                Thêm
              </button>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <h4 class="mt-1 text-center text-header">NHÂN VIÊN</h4>
            </div>
          </div>
          <hr>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full md:w-1/4 px-2">
                <label> Tên </label>
                <input
                id="name"
                type="text"
                maxlength="100"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.name">
              </div>
              <div class="w-full md:w-1/4 px-2">
                <label> Số Điện Thoại </label>
                <input
                id="phone"
                type="text"
                maxlength="20"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.phone"
                @keyup="integerOnly($event.target)">
              </div>
              <div class="w-full md:w-1/4 px-2">
                <label> Quyền </label>
                <select
                id="permision"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.role">
                  <option v-for="option in roleOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>

              <div class="w-full md:w-1/4 px-2">
                  <label class="label-width text-white">
                     Xem
                  </label>
                  <button class="btn btn-outline-primary pull-right btn-width-120" :disabled="onSearch" @click.prevent="prepareToSearch">
                    Tìm Kiếm
                  </button>
              </div>
            </div>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              Số kết quả: {{totalRow}}
            </div>
          </div>

          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th v-for="field in fields" :key="field.key" :class="field.class">{{ field.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td>{{ item.stt }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.phone_number }}</td>
                <td>{{ item.role_name }}</td>
                <td>{{ item.created_at }}</td>
                <td class="actions-cell">
                  <div class="d-flex gap-2">
                    <button type="button" class="btn btn-sm btn-link" title="Edit" @click="edit(item.id)">
                      <i class="fa fa-edit" />
                    </button>
                    <button type="button" class="btn btn-sm btn-link" title="Delete" @click="deleted(item.id, item.name, item.stt)">
                      <i class="fa fa-trash" />
                    </button>
                    <button v-if="isRoot" type="button" class="btn btn-sm btn-link" title="Reset password" @click="showModalConfirmResetPass(item)">
                      <i class="fa fa-refresh" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận reset pass -->
    <div centered hide-footer hide-header id="modal-confirm-reset-pass">
      <div class="flex flex-wrap -mx-2">
        <div class="w-full px-2">
          <h5 class="text-center text-header">Reset password</h5>
          <hr>
        </div>
      </div>
      <div class="flex flex-wrap -mx-2">
        <div class="w-full px-2">
          <p>Nhân viên: <b>{{currentStaff.name}}</b></p>
          <p>Số điện thoại: <b>{{currentStaff.phone_number}}</b></p>
        </div>
      </div>

      <div class="flex flex-wrap -mx-2">
        <div class="w-full px-2 text-center mt-3" v-show="!resetting">
          <button class="btn btn-width-120 btn-outline-secondary" @click="hideModalConfirmResetPass()">
            Đóng
          </button>
          <button class="ml-2 btn btn-width-120 btn-outline-success" @click="resetPass()">
            Xác nhận
          </button>
        </div>
        <div class="w-full px-2" v-show="resetting">
          <span class="loading-more" v-show="resetting"><icon name="loading" width="60" /></span>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import adminAPI from '@/api/admin'
import staffAPI from '@/api/staff'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()

    return {
      authStore
    }
  },
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
    if(this.authStore.user && this.authStore.user.isRoot) {
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
      if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if(this.hasNext) {
          this.offset = this.offset + this.pageLimit
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
        "store_name": "store ".concat(this.authStore.user.storeId),
        "limit": this.pageLimit,
        "offset": this.offset
      }

      adminAPI.searchStaff(req).then(res => {
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
