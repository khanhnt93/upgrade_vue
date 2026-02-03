<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="flex justify-start">
            <button
              class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors min-w-[120px]"
              @click="back">
              Quay lại
            </button>
          </div>
          <div class="flex justify-end">
            <button
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors min-w-[120px]"
              @click="save"
              :disabled="saving">
              Lưu
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-12">
            <h4 class="mt-1 text-center text-xl font-semibold text-orange-500">NHÓM QUYỀN</h4>
          </div>
        </div>
        <hr class="mb-4" />

        <!-- Loading -->
        <div v-show="loading" class="text-center mb-4">
          <icon name="loading" width="60" />
        </div>

        <!-- Code Field -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-3 mt-2">
            <label>Code <span class="text-red-500">*</span></label>
          </div>
          <div class="md:col-span-9">
            <input
              id="code"
              type="text"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorCode }"
              v-model="role.code"
              autocomplete="new-password"
              maxlength="50">
            <div v-if="errorCode" class="text-red-500 text-sm mt-1">
              Vui lòng nhập code
            </div>
          </div>
        </div>

        <!-- Name Field -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-3 mt-2">
            <label>Name <span class="text-red-500">*</span></label>
          </div>
          <div class="md:col-span-9">
            <input
              id="name"
              type="text"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorName }"
              v-model="role.name"
              autocomplete="new-password"
              maxlength="100">
            <div v-if="errorName" class="text-red-500 text-sm mt-1">
              Vui lòng nhập name
            </div>
          </div>
        </div>

        <!-- Screen Permissions -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 mt-8">
          <div class="md:col-span-12">
            <label class="font-semibold">Phân quyền vào chức năng</label>
            <br>
            <label class="text-gray-600">(Bạn hãy chọn những chức năng mà nhóm quyền này được quyền truy cập)</label>
          </div>
        </div>

        <!-- Permission Groups -->
        <div class="grid grid-cols-1 gap-6">
          <div v-for="group in groupScreen" :key="group.group_name" class="border-b pb-4">
            <p class="font-bold mb-3">{{ group.group_name }}</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div v-for="screen in group.screen" :key="screen.screen_id" class="flex items-center">
                <input
                  :id="screen.screen_id"
                  type="checkbox"
                  v-model="role.screen"
                  name="screens"
                  :value="screen.screen_id"
                  class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label :for="screen.screen_id" class="cursor-pointer">{{ screen.screen_name }}</label>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    const toast = useToast()

    return {
      router,
      route,
      toast
    }
  },
  data() {
    return {
      role: {
        "code": null,
        "name": null,
        "screen": []
      },
      click: false,
      saving: false,
      loading: false,
      groupScreen: [],
    }
  },
  mounted() {
    // Get master screen
    this.getMasterScreen()

    // Get role detail
    this.getRoleDetail()
  },
  computed: {
    errorCode: function () {
      return this.checkInfo(this.role.code)
    },
    errorName: function () {
      return this.checkInfo(this.role.name)
    },
  },
  methods: {
    checkInfo(info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate() {
      return !(this.errorCode || this.errorName)
    },

    /**
     *  Get master screen
     */
    getMasterScreen() {
      adminAPI.getMasterScreen().then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.groupScreen = res.data.data
        }
      })
    },

    /**
     *  Get detail
     */
    getRoleDetail() {
      let roleId = this.route.params.id
      if (roleId) {
        this.loading = true

        adminAPI.getRoleDetail(roleId).then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            this.role = res.data.data
          }

          this.loading = false
        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
      }
    },

    /**
     *  Save
     */
    save() {
      this.click = true

      let checkValidate = this.checkValidate()
      if (!checkValidate) {
        return
      }

      this.saving = true

      let roleId = this.route.params.id
      if (roleId) {
        // Edit
        this.role.id = roleId
        adminAPI.editRole(this.role).then(res => {
          this.saving = false
          if (res != null && res.data != null) {
            if (res.data.status == 200) {
              // show popup success
              this.toast.success('Cập nhật nhóm quyền thành công!!!')
            }
          }
        }).catch(err => {
          this.saving = false
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
      } else {
        // Add
        adminAPI.addRole(this.role).then(res => {
          this.saving = false
          if (res != null && res.data != null) {
            if (res.data.status == 200) {
              this.router.push("/role/list")
            }
          }
        }).catch(err => {
          this.saving = false
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.router.push("/role/list")
    }
  }
}
</script>
