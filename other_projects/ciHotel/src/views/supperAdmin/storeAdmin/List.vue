<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 gap-4">
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="grid grid-cols-1 gap-4">
          <div class="flex justify-end">
            <button
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              @click="gotoAdd()">
              Thêm
            </button>
          </div>

          <div class="col-span-1">
            <h4 class="mt-2 text-center text-orange-500">Admin Store</h4>
          </div>
        </div>
        <hr />

        <!-- Search filters -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mt-3">
          <div>
            <label>Tên</label>
            <input
              id="name"
              type="text"
              class="form-control"
              v-model="inputs.name"
              maxlength="100" />
          </div>

          <div>
            <label>Số Điện Thoại</label>
            <input
              id="phone"
              type="text"
              class="form-control"
              v-model="inputs.phone_number"
              @keyup="integerOnly($event.target)"
              maxlength="20" />
          </div>

          <div>
            <label>Quyền</label>
            <select
              id="role"
              class="form-control"
              v-model="inputs.role_id">
              <option v-for="opt in options" :key="opt.value" :value="opt.value">
                {{ opt.text }}
              </option>
            </select>
          </div>

          <div>
            <label>Tên Cửa Hàng</label>
            <input
              id="nameStore"
              type="text"
              class="form-control"
              maxlength="100"
              v-model="inputs.store_name" />
          </div>

          <div>
            <label>Thương hiệu</label>
            <select
              id="brand_id"
              class="form-control"
              v-model="inputs.brand_id">
              <option v-for="brand in optionsBrand" :key="brand.value" :value="brand.value">
                {{ brand.text }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex justify-end mt-4 mb-4">
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            :disabled="onSearch"
            @click.prevent="prepareToSearch">
            Tìm Kiếm
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 border">STT</th>
                <th class="px-4 py-2 border">Tên</th>
                <th class="px-4 py-2 border">Số Điện Thoại</th>
                <th class="px-4 py-2 border">Thương hiệu</th>
                <th class="px-4 py-2 border">Cửa Hàng</th>
                <th class="px-4 py-2 border">Quyền</th>
                <th class="px-4 py-2 border">Ngày Tạo</th>
                <th class="px-4 py-2 border">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
                <td class="px-4 py-2 border text-center">{{ item.stt }}</td>
                <td class="px-4 py-2 border">{{ item.name }}</td>
                <td class="px-4 py-2 border text-center">{{ item.phone_number }}</td>
                <td class="px-4 py-2 border">{{ item.brand_name }}</td>
                <td class="px-4 py-2 border">{{ item.store_name }}</td>
                <td class="px-4 py-2 border">{{ item.role_name }}</td>
                <td class="px-4 py-2 border text-center">{{ item.created_at }}</td>
                <td class="px-4 py-2 border text-center">
                  <div class="flex justify-center space-x-2">
                    <button
                      class="text-blue-600 hover:text-blue-800"
                      @click="edit(item.id)"
                      title="Edit">
                      <i class="fa fa-edit"></i>
                    </button>
                    <button
                      class="text-red-600 hover:text-red-800"
                      @click="deleted(item.id, item.name, item.stt)"
                      title="Delete">
                      <i class="fa fa-trash"></i>
                    </button>
                    <button
                      class="text-green-600 hover:text-green-800"
                      @click="showModalConfirmResetPass(item)"
                      title="Reset password">
                      <i class="fa fa-refresh"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading -->
        <div v-show="loading" class="text-center mt-4">
          <i class="fa fa-spinner fa-spin fa-3x"></i>
        </div>
        <div v-if="hasNext === false" class="text-center mt-4">Hết</div>
      </div>
    </div>

    <!-- Modal reset password -->
    <div v-if="showResetModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h5 class="text-center text-lg font-semibold">Reset password</h5>
          <hr class="my-3" />

          <div class="space-y-2">
            <p>Nhân viên: <strong>{{ currentStaff.name }}</strong></p>
            <p>Số điện thoại: <strong>{{ currentStaff.phone_number }}</strong></p>
          </div>

          <div class="flex justify-center space-x-2 mt-4" v-show="!resetting">
            <button
              class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
              @click="hideModalConfirmResetPass()">
              Đóng
            </button>
            <button
              class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
              @click="resetPass()">
              Xác nhận
            </button>
          </div>

          <div v-show="resetting" class="text-center mt-4">
            <i class="fa fa-spinner fa-spin fa-3x"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import superAdminAPI from '@/api/superAdmin'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const toast = useToast()
    const router = useRouter()

    return {
      toast,
      router
    }
  },
  data() {
    return {
      items: [],
      options: [
        { value: '', text: 'Tất cả' },
        { value: '1', text: 'Staff' },
        { value: '2', text: 'Admin' }
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
      showResetModal: false
    }
  },
  mounted() {
    this.getOptionBrand()
    window.addEventListener('scroll', this.onScroll)
    this.search()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
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

    getOptionBrand() {
      superAdminAPI.getBrandOption().then(res => {
        this.optionsBrand = [{ value: null, text: "" }]
        if (res && res.data && res.data.data) {
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
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    prepareToSearch() {
      this.offset = 0
      this.items = []
      this.hasNext = true
      this.search()
    },

    deleted(id, name, rowIndex) {
      if (confirm('Xóa [' + name + "]. Bạn có chắc không?")) {
        superAdminAPI.deleteAdminStore(id).then(res => {
          let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
          this.items.splice(indexTemp, 1)
          this.listIdDeleted.push(rowIndex - 1)
        }).catch(err => {
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
      }
    },

    edit(id) {
      this.router.push('/admin-store/index/' + id)
    },

    gotoAdd() {
      this.router.push('/admin-store/index/')
    },

    search() {
      if (this.loading) {
        return
      }

      this.onSearch = true
      this.loading = true

      let req = {
        name: this.inputs.name,
        phone_number: this.inputs.phone_number,
        role_id: this.inputs.role_id,
        store_name: this.inputs.store_name,
        brand_id: this.inputs.brand_id,
        limit: this.pageLimit,
        offset: this.offset
      }

      superAdminAPI.searchAdminStore(req, this.offset).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.staffs

          if (this.loadByScroll) {
            let temp = this.items
            var newArray = temp.concat(it)
            this.items = newArray
          } else {
            this.items = it
          }
          this.loadByScroll = false

          if (this.offset + this.pageLimit >= res.data.data.total_row) {
            this.hasNext = false
          }
        } else {
          this.items = []
        }
        this.onSearch = false
        this.loading = false
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
        this.onSearch = false
        this.loading = false
      })
    },

    integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

    showModalConfirmResetPass(staff) {
      this.currentStaff = staff
      this.showResetModal = true
    },

    hideModalConfirmResetPass() {
      this.showResetModal = false
    },

    resetPass() {
      if (this.resetting) {
        return
      }

      this.resetting = true

      let params = {
        id: this.currentStaff.id,
        phone: this.currentStaff.phone_number
      }

      superAdminAPI.resetPass(params).then(res => {
        if (res != null && res.data != null && res.data.status == 200) {
          this.hideModalConfirmResetPass()
          let message = "Mật khẩu mới: " + this.currentStaff.phone_number
          alert("Reset Mật Khẩu Thành Công\n" + message)
        }
        this.resetting = false
      }).catch(err => {
        this.resetting = false
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    }
  }
}
</script>
