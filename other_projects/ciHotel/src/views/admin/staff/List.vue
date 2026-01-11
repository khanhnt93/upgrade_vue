<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-12 flex justify-end">
            <button
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors min-w-[120px]"
              @click="gotoAdd()">
              Thêm
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-12">
            <h4 class="mt-1 text-center text-xl font-semibold">NHÂN VIÊN</h4>
          </div>
        </div>
        <hr class="mb-4">

        <!-- Search Filters -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label>Tên</label>
            <input
              id="name"
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="inputs.name">
          </div>
          <div>
            <label>Số Điện Thoại</label>
            <input
              id="phone"
              type="text"
              maxlength="20"
              autocomplete="new-password"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="inputs.phone"
              @keyup="integerOnly($event.target)">
          </div>
          <div>
            <label>Quyền</label>
            <select
              id="permision"
              autocomplete="new-password"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="inputs.role">
              <option v-for="option in roleOptions" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
          <div>
            <label class="text-white">Xem</label>
            <button
              class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              :disabled="onSearch"
              @click.prevent="prepareToSearch">
              Tìm Kiếm
            </button>
          </div>
        </div>

        <div class="mb-2">
          Số kết quả: {{ totalRow }}
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="border border-gray-300 px-4 py-2 text-left">STT</th>
                <th class="border border-gray-300 px-4 py-2 text-left">Tên</th>
                <th class="border border-gray-300 px-4 py-2 text-left">Số Điện Thoại</th>
                <th class="border border-gray-300 px-4 py-2 text-left">Quyền</th>
                <th class="border border-gray-300 px-4 py-2 text-left">Ngày Tạo</th>
                <th class="border border-gray-300 px-4 py-2 text-center w-40"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-2">{{ item.stt }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.phone_number }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.role_name }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.created_at }}</td>
                <td class="border border-gray-300 px-4 py-2">
                  <div class="flex justify-center gap-2">
                    <button
                      @click="edit(item.id)"
                      class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      title="Edit">
                      <i class="fa fa-edit" />
                    </button>
                    <button
                      @click="deleted(item.id, item.name, item.stt)"
                      class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      title="Delete">
                      <i class="fa fa-trash" />
                    </button>
                    <button
                      v-if="isRoot"
                      @click="showModalConfirmResetPass(item)"
                      class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                      title="Reset password">
                      <i class="fa fa-refresh" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="items.length === 0">
                <td colspan="6" class="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading -->
        <div v-show="loading" class="text-center mt-4">
          <icon name="loading" width="60" />
        </div>
        <div v-if="hasNext === false" class="text-center mt-4 text-gray-500">--Hết--</div>
        <div v-if="hasNext === true && totalRow != 0" class="text-center mt-4">
          <i class="fa fa-angle-double-down text-2xl text-blue-500"></i>
        </div>
      </div>
    </div>

    <!-- Modal Reset Password -->
    <div v-if="showResetModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="hideModalConfirmResetPass">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="mb-4">
          <h5 class="text-center text-xl font-semibold">Reset password</h5>
          <hr class="mt-2">
        </div>

        <div class="mb-4">
          <p>Nhân viên: <b>{{ currentStaff.name }}</b></p>
          <p>Số điện thoại: <b>{{ currentStaff.phone_number }}</b></p>
        </div>

        <div class="flex justify-center gap-2 mt-6" v-show="!resetting">
          <button
            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors min-w-[120px]"
            @click="hideModalConfirmResetPass()">
            Đóng
          </button>
          <button
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors min-w-[120px]"
            @click="resetPass()">
            Xác nhận
          </button>
        </div>

        <div v-show="resetting" class="text-center">
          <icon name="loading" width="60" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import adminAPI from '@/api/admin'
import staffAPI from '@/api/staff'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'

export default {
  setup() {
    const router = useRouter()
    const toast = useToast()
    const authStore = useAuthStore()

    return {
      router,
      toast,
      authStore
    }
  },
  data() {
    return {
      roleOptions: [],
      perPage: '10',
      currentPage: '1',
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
      showResetModal: false,
    }
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  mounted() {
    if (this.authStore.user && this.authStore.user.isRoot) {
      this.isRoot = true
    }

    // Get role options
    this.getRoleOption()

    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.deleted)
    this.search()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.deleted)
  },
  methods: {
    /**
     * Scroll event
     */
    onScroll(event) {
      if (this.onSearch) {
        return
      }
      event.preventDefault()
      var body = document.body
      var html = document.documentElement
      if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if (this.hasNext) {
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
        if (res != null && res.data != null && res.data.data != null) {
          this.roleOptions = [{ value: null, text: '' }]

          var roles = res.data.data
          if (roles) {
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
    deleted(id, name, rowIndex) {
      if (id && name) {
        if (confirm('Xóa ' + name + ". Bạn có chắc không?")) {
          adminAPI.deleteStaff(id).then(res => {
            // Remove item in list
            let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
            this.items.splice(indexTemp, 1)
            this.listIdDeleted.push(rowIndex - 1)

            this.totalRow = this.totalRow - 1
            this.toast.success('Xóa nhân viên thành công!')
          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.toast.error(errorMess)
          })
        }
      }
    },

    /**
     * Go to edit
     * @param id
     */
    edit(id) {
      this.router.push('/staff/index/' + id)
    },

    /**
     * Go to add
     */
    gotoAdd() {
      this.router.push('/staff/index/')
    },

    /**
     * Search
     */
    search() {
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

      adminAPI.searchStaff(req, this.offset).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.staffs
          this.totalRow = res.data.data.total_row

          // Update items
          if (this.loadByScroll) {
            let temp = this.items
            var newArray = temp.concat(it)
            this.items = newArray
          } else {
            this.items = it
          }
          this.loadByScroll = false

          // Check has next
          if (this.offset + this.pageLimit >= res.data.data.total_row) {
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
        this.toast.error(errorMess)

        this.onSearch = false
        this.loading = false
      })
    },

    showModalConfirmResetPass(staff) {
      this.currentStaff = staff
      this.showResetModal = true
    },

    hideModalConfirmResetPass() {
      this.showResetModal = false
    },

    /**
     * Reset password
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
          alert("Reset Mật Khẩu Thành Công\n\n" + message)
        }

        this.resetting = false
      }).catch(err => {
        this.resetting = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
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
