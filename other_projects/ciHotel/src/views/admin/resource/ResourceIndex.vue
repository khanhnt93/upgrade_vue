<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between mb-4">
        <button class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 w-[120px]" @click="back">
          Quay lại
        </button>
        <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-[120px]" @click="save" :disabled="saving">
          Lưu
        </button>
      </div>

      <h4 class="text-xl font-semibold text-center mt-2 mb-4 text-orange-500">Nguyên liệu - Mặt hàng</h4>
      <hr class="mb-4"/>

      <!-- Loading -->
      <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div class="md:col-span-3">
            <label>Tên<span class="error-sybol"></span></label>
          </div>
          <div class="md:col-span-9">
            <input
              id="name"
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorName }"
              v-model="resource.name">
            <div v-if="errorName" class="text-red-500 text-sm mt-1">
              Vui lòng nhập tên
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div class="md:col-span-3">
            <label>Đơn vị</label>
          </div>
          <div class="md:col-span-9">
            <select
              id="unit"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="resource.unit">
              <option v-for="unit in units" :key="unit.value" :value="unit.value">{{ unit.text }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div class="md:col-span-3">
            <label>Số lượng<span class="error-sybol"></span></label>
          </div>
          <div class="md:col-span-9">
            <input
              id="quantity"
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorQuantity }"
              v-model="resource.quantity"
              :disabled="this.route.params.id"
              @keyup="integerAndPointOnly($event.target)">
            <div v-if="errorQuantity" class="text-red-500 text-sm mt-1">
              Vui lòng nhập số lượng
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div class="md:col-span-3">
            <label>Số lượng tối thiểu<span class="error-sybol"></span></label>
          </div>
          <div class="md:col-span-9">
            <input
              id="min_quantity"
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorMinQuantity }"
              v-model="resource.min_quantity"
              @keyup="integerAndPointOnly($event.target)">
            <div v-if="errorMinQuantity" class="text-red-500 text-sm mt-1">
              Vui lòng nhập số lượng tối thiểu
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'

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
  data () {
    return {
      resource: {
        "name": null,
        "unit": null,
        "quantity": 0,
        "min_quantity": 0,
      },
      units: [{value: null, text: ''}],
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    // Load option unit
    this.getUnitOptions()

    this.getUnitDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.resource.name)
    },
    errorQuantity: function () {
      return this.checkInfo(this.resource.quantity)
    },
    errorMinQuantity: function () {
      return this.checkInfo(this.resource.min_quantity)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorName || this.errorQuantity || this.errorMinQuantity)
    },

    /**
     * Load list option group menu
     */
    getUnitOptions () {
      adminAPI.getListUnitOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let units = res.data.data
          for (let index in units) {
            this.units.push(units[index])
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Get detail
     */
    getUnitDetail() {
      let Id = this.route.params.id
      if(Id){
        this.loading = true

        adminAPI.getResourceDetail(Id).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.resource = res.data.data
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
     * Back to list
     */
    back() {
      // Go to list
      this.router.push('/resource/list')
    },

    /**
     * Save
     */
    save () {
      this.click = true
      this.saving = true
      let result = this.checkValidate()
      if(result) {
        let id = this.route.params.id
        if(id){
          // Edit
          let resource = this.resource
          resource.id = id
          adminAPI.editResource(resource).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                // show popup success
                this.toast.success('Cập nhật nguyên liệu thành công!!! ')
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
          adminAPI.addResource(this.resource).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.router.push("/resource/list")
              }
            }
          }).catch(err => {
            this.saving = false
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.toast.error(errorMess)
          })
        }
      } else {
        this.saving = false
      }
    },

    /**
     * Only input integer and point
     */
     integerAndPointOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerAndPointOnly(valueInput)
      item.value = result
    },
  }
}
</script>
