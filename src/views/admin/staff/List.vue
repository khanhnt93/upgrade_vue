<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div class="w-full md:col-span-12">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="w-full md:col-span-12">
              <button class="btn btn-outline-success pull-right btn-width-120 px-4 py-2" @click="gotoAdd()">
                Thêm
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="w-full md:col-span-12">
              <h4 class="mt-1 text-center text-header">Thành Viên</h4>
            </div>
          </div>
          <hr>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
              <div class="w-full md:col-span-3">
                <label> Tên </label>
                <input
                id="name"
                type="text"
                maxlength="100"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.name">
              </div>
              <div class="w-full md:col-span-3">
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
              <div class="w-full md:col-span-3">
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

              <div class="w-full md:col-span-3">
                  <label class="label-width text-white">
                     Xem
                  </label>
                  <button class="btn btn-outline-primary pull-right btn-width-120 px-4 py-2" :disabled="onSearch" @click.prevent="prepareToSearch">
                    Tìm Kiếm
                  </button>
              </div>
            </div>

          <div class="grid grid-cols-1 gap-4">
            <div class="w-full">
              Số kết quả: {{totalRow}}
            </div>
          </div>

          <table class="min-w-full divide-y divide-gray-200 border">
            <thead class="bg-gray-50">
              <tr>
                <th v-for="field in fields" :key="field.key" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  {{ field.label }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap border">{{ item.stt }}</td>
                <td class="px-6 py-4 whitespace-nowrap border">{{ item.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap border">{{ item.phone_number }}</td>
                <td class="px-6 py-4 whitespace-nowrap border">{{ item.role_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap border">{{ item.created_at }}</td>
                <td class="px-6 py-4 whitespace-nowrap border actions-cell">
                  <div class="flex gap-2">
                    <button class="px-3 py-2 hover:bg-gray-100" title="Edit" @click="edit(item.id)">
                      <i class="fa fa-edit" />
                    </button>
                    <button class="px-3 py-2 hover:bg-gray-100" title="Delete" @click="deleted(item.id, item.name, item.stt)">
                      <i class="fa fa-trash" />
                    </button>
                    <button v-if="isRoot" class="px-3 py-2 hover:bg-gray-100" title="Reset password" @click="showModalConfirmResetPass(item)">
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
    <div v-if="showResetPassModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full">
            <h5 class="text-center text-header">Reset password</h5>
            <hr>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full">
            <p>Nhân viên: <b>{{currentStaff.name}}</b></p>
            <p>Số điện thoại: <b>{{currentStaff.phone_number}}</b></p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div class="w-full text-center mt-3" v-show="!resetting">
            <button class="btn btn-width-120 btn-outline-secondary px-4 py-2" @click="hideModalConfirmResetPass()">
              Đóng
            </button>
            <button class="ml-2 btn btn-width-120 btn-outline-success px-4 py-2" @click="resetPass()">
              Xác nhận
            </button>
          </div>
          <div class="w-full" v-show="resetting">
            <span class="loading-more" v-show="resetting"><icon name="loading" width="60" /></span>
          </div>
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
import { useToast } from 'vue-toastification'


export default {
  setup() {
    const authStore = useAuthStore()
    const toast = useToast()
    return { authStore, toast }
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
      totalRow: 0,
      currentStaff: {},
      isRoot: false,
      resetting: false,
      showResetPassModal: false,
    }
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  mounted() {
    // Check if user is root
    if(this.authStore.user && this.authStore.user.is_root) {
      this.isRoot = true
    }
    
    // Get role options
    this.getRoleOption()

    window.addEventListener('scroll', this.onScroll)
    
    // Call search to load initial data
    this.search()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    /**
     * Make toast without title
     */
    popToast(variant, content) {
      switch(variant) {
        case 'success':
          this.toast.success(content)
          break
        case 'danger':
          this.toast.error(content)
          break
        case 'warning':
          this.toast.warning(content)
          break
        default:
          this.toast.info(content)
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
        const confirmed = confirm(`Xóa ${name}. Bạn có chắc không?`)
        if(confirmed){
          adminAPI.deleteStaff(id).then(res => {
            if(res != null && res.data != null && res.data.status == 200) {
              this.search()
            }
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
      this.$router.push('/member/index/' + id)
    },

    /**
     * Go to add
     */
    gotoAdd () {
      this.$router.push('/member/index/')
    },

    /**
     * Search
     */
    search () {
      if (this.loading) { return }

      this.onSearch = true
      this.loading = true

      // Check if user exists
      if (!this.authStore.user || !this.authStore.user.store_id) {
        this.popToast('danger', 'Không tìm thấy thông tin người dùng')
        this.onSearch = false
        this.loading = false
        return
      }

      let req = {
        "name": this.inputs.name,
        "phone_number": this.inputs.phone,
        "role_id": this.inputs.role,
        "store_name": "store ".concat(this.authStore.user.store_id),
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

    /**
     * Only input integer
     */
     integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerOnly(valueInput)
      item.value = result
    },
    
    showModalConfirmResetPass(staff) {
      this.currentStaff = staff
      this.showResetPassModal = true
    },

    hideModalConfirmResetPass() {
      this.showResetPassModal = false
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
          alert(`Reset Mật Khẩu Thành Công\n\n${message}`)
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
