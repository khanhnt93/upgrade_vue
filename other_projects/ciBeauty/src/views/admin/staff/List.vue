<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <button class="btn btn-outline-success float-right px-4 btn-width-120 ml-2 mt-1" @click="gotoAdd()">
                Thêm
              </button>
              <button class="btn btn-outline-primary float-right btn-width-120 mt-1" @click="modalLvStaff = true">
                Cài đặt
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h4 class="mt-2 text-center text-header">Nhân Viên</h4>
            </div>
          </div>
          <hr>

            <div class="grid grid-cols-12 gap-4 row form-row">
              <div class="col-span-4">
                <label> Tên </label>
                <input
                id="name"
                type="text"
                maxlength="100"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.name">
              </div>
              <div class="col-span-4">
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
              <div class="col-span-4">
                <label> Quyền </label>
                <select class="form-control form-control"
                id="permision"
                type="text"
                autocomplete="new-password"
                
                v-model="inputs.role">
                  <option v-for="option in roleOptions" :key="option.value" :value="option.value">
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

          <table class="table table-bordered table-hover table-responsive-stack">
            <thead>
              <tr>
                <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td v-for="field in fields" :key="field.key" :data-label="field.label">
                  <div v-if="field.key === 'actions'">
                    <div class="flex gap-2">
                      <button class="list-group-item" title="Edit" @click="edit(item.id)">
                        <i class="fa fa-edit" />
                      </button>
                      <button class="list-group-item" title="Delete" @click="deleted(item.id, item.name, item.stt)">
                        <i class="fa fa-trash" />
                      </button>
                    </div>
                    <div class="flex flex-col" horizontal v-if="isRoot">
                      <button class="list-group-item" title="Reset password" @click="showModalConfirmResetPass(item)">
                        <i class="fa fa-refresh" />
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
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận reset pass -->
    <!-- Modal xác nhận reset pass -->
    <div v-if="showConfirmResetPassModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div class="p-6">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <h5 class="text-center text-header">Reset password</h5>
              <hr>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <p>Nhân viên: <b>{{currentStaff.name}}</b></p>
              <p>Số điện thoại: <b>{{currentStaff.phone}}</b></p>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full text-center mt-3" v-show="!resetting">
              <button class="btn btn-width-120 btn-outline-secondary" @click="hideModalConfirmResetPass()">
                Đóng
              </button>
              <button class="ml-2 btn btn-width-120 btn-outline-success" @click="resetPass()">
                Xác nhận
              </button>
            </div>
            <div class="col-span-full" v-show="resetting">
              <span class="loading-more" v-show="resetting"><icon name="loading" width="60" /></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal lv staff -->
    <!-- Modal lv staff -->
    <div v-if="modalLvStaff" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 my-6 overflow-hidden flex flex-col max-h-[90vh]">
        <div class="flex items-center justify-between p-4 border-b">
          <h5 class="text-xl font-bold">Thiết lập level nhân viên</h5>
          <button @click="modalLvStaff = false; current_lv = {}" class="text-gray-500 hover:text-gray-700">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        <div class="p-6 overflow-y-auto">
          <!-- Khu vuc add/edit -->
          <div class="grid grid-cols-12 gap-4 row form-row">
            <div class="col-span-3 mt-2">
              <label>Tên level</label><span class="error-sybol"></span>
            </div>
            <div class="col-span-9 mt-2">
              <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="current_lv.lv_name"
              maxlength="255">
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4 row form-row">
            <div class="col-span-3 mt-2">
              <label>% Hoa hồng</label>
            </div>
            <div class="col-span-9 mt-2">
              <input
                id="commission_percent"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="current_lv.commission_percent"
                maxlength="5"
                @keyup="integerAndPointOnly($event.target)">
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4 row form-row">
            <div class="col-span-3 mt-2">
              <label>Số tiền tour</label>
            </div>
            <div class="col-span-9 mt-2">
              <input
                id="tour_amount"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="current_lv.tour_amount"
                maxlength="11"
                @keyup="integerOnly($event.target)">
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4 mt-2">
            <div class="col-span-full text-center">
              <button class="btn px-4 default-btn-bg " @click="addUpdateLvStaff">
                {{current_lv.id ? 'Cập nhật' : 'Thêm mới'}}
              </button>
            </div>
          </div>

          <!-- Khu vuc danh sach -->
          <table
            v-show="lv_items.length"
            class="table table-bordered table-hover mt-2 table-responsive-stack">
            <thead>
              <tr>
                <th v-for="field in lv_fields" :key="field.key">{{ field.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in lv_items" :key="index">
                <td v-for="field in lv_fields" :key="field.key" :data-label="field.label">
                  <div v-if="field.key === 'stt'">
                    {{ index + 1 }}
                  </div>
                  <div v-else-if="field.key === 'actions'">
                    <div class="flex gap-2">
                      <button class="list-group-item" title="Edit" @click="editLv(item)">
                        <i class="fa fa-edit" />
                      </button>
                      <button class="list-group-item" title="Delete" @click="deletedLv(item.id, item.lv_name)">
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
    </div>

  </div>
</template>
<script>
import adminAPI from '@/api/admin'
import staffAPI from '@/api/staff'
import lvStaffAPI from '@/api/lvStaff'
import Mapper from '@/mapper/staff'
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
          key: 'phone',
          label: 'Số Điện Thoại'
        },
        {
          key: 'permission',
          label: 'Quyền'
        },
        {
          key: 'createDate',
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

      modalLvStaff: false,
      showConfirmResetPassModal: false,
      lv_fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'lv_name',
          label: 'Tên level'
        },
        {
          key: 'commission_percent',
          label: '% Hoa hồng'
        },
        {
          key: 'tour_amount',
          label: 'Tiền tour'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      lv_items: [],
      current_lv: {},
      saving: false,
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

    this.getListLvStaff()
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
        if (confirm('Xóa ' + name + ". Bạn có chắc không?")) {
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
          let it = Mapper.mapStaffModelSearchToDto(res.data.data.staffs, this.offset)
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
      // this.$bvModal.show('modal-confirm-reset-pass')
      this.showConfirmResetPassModal = true;
    },

    hideModalConfirmResetPass() {
      // this.$bvModal.hide('modal-confirm-reset-pass')
      this.showConfirmResetPassModal = false
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
        "phone": this.currentStaff.phone
      }

      staffAPI.resetPass(params).then(res => {
        if (res != null && res.data != null && res.data.status == 200) {
          this.hideModalConfirmResetPass()

          let message = "Mật khẩu mới: " + this.currentStaff.phone
          this.popToast('success', "Reset Mật Khẩu Thành Công. " + message)
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

      /**
     * Only input integer
     */
     integerAndPointOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerAndPointOnly(valueInput)
      if(result == '') {
          result = 0
      }
      item.value = result
    },

    getListLvStaff() {
      lvStaffAPI.getListLvStaff().then(res => {
        if (res != null && res.data != null && res.data.data) {
          this.lv_items = res.data.data
        }
      }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
      })
    },

    addUpdateLvStaff() {
      if (this.saving) { return }

      if(!this.current_lv.lv_name || !this.current_lv.lv_name.trim()) {
        this.popToast('danger', 'Vui lòng nhập tên level!')
        return
      }

      this.saving = true

      if(this.current_lv.id) {
        lvStaffAPI.updateLvStaff(this.current_lv).then(res => {
          if (res != null && res.data != null && res.data.data) {
            this.lv_items = res.data.data

            this.current_lv = {}

            this.popToast('success', 'Cập nhật cấp bậc nhân viên thành công!')
          }

          this.saving = false
          }).catch(err => {
            this.saving = false

            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
        })
      } else {
        lvStaffAPI.addLvStaff(this.current_lv).then(res => {
          if (res != null && res.data != null && res.data.data) {
            this.lv_items = res.data.data

            this.current_lv = {}

            this.popToast('success', 'Thêm mới cấp bậc nhân viên thành công!')
          }

          this.saving = false
          }).catch(err => {
            this.saving = false

            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
        })
      }
    },

    editLv(item) {
      this.current_lv = JSON.parse(JSON.stringify(item))
    },

    deletedLv (id, name) {
      if(id && name) {
        if (confirm('Xóa cấp bậc [' + name + "]. Bạn có chắc không?")) {
          lvStaffAPI.deleteLvStaff(id).then(res => {
            if (res != null && res.data != null && res.data.data) {
              this.lv_items = res.data.data

              this.popToast('success', 'Xóa cấp bậc [' + name + "] thành công!")
            }

          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
      }
    },

  }
}
</script>
