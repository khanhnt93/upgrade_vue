<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1">
      <div>
        <div class="bg-white rounded-lg shadow-md">
          <div class="p-4">

              <div class="grid grid-cols-2 gap-4">
              <div>
                <button
                  class="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 float-left w-30"
                  @click="back">
                  Quay lại
                </button>
              </div>
              <div>
                <button
                  class="px-4 py-2 border border-green-500 text-green-600 rounded hover:bg-green-50 float-right w-30"
                  @click="save"
                  :disabled="saving">
                  Lưu
                </button>
              </div>
            </div>

              <div class="grid grid-cols-1 mt-4">
                <div>
                  <h4 class="mt-2 text-center text-xl font-semibold text-orange-500">Đơn vị</h4>
                </div>
              </div>
              <hr class="my-4"/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="grid grid-cols-12 gap-4 mb-4">
                <div class="col-span-3 mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
                </div>
                <div class="col-span-9">
                  <input
                  id="name"
                  type="text"
                  maxlength="100"
                  autocomplete="new-password"
                  :class="['form-control', {'border-red-500': errorName}]"
                  v-model="unit.name">
                  <div class="text-red-500 text-sm mt-1" v-if="errorName">
                    Vui lòng nhập tên
                  </div>
                </div>
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
      unit: {
        "name": null,
      },
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    this.getUnitDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.unit.name)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorName)
    },

    /**
     * Get detail
     */
    getUnitDetail() {
      let unitId = this.route.params.id
      if(unitId){
        this.loading = true

        adminAPI.getUnitDetail(unitId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.unit = res.data.data
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
      this.router.push('/unit/list')
    },

    /**
     * Save
     */
    save () {
      this.click = true
      this.saving = true
      let result = this.checkValidate()
      if(result) {
        let unitId = this.route.params.id
        if(unitId){
          // Edit
          let unit = this.unit
          unit.id = unitId
          adminAPI.editUnit(unit).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                // show popup success
                this.toast.success('Cập nhật đơn vị thành công!!! ')
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
          adminAPI.addUnit(this.unit).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.router.push("/unit/list")
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
    }
  }
}
</script>

