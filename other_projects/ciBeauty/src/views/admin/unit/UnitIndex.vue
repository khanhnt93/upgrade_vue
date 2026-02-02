<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1">
      <div class="w-full">
        <div class="card">
          <div class="card-body p-4">

            <div class="flex justify-start mb-4">
              <button class="btn btn-outline-secondary px-4 btn-width-120" @click="back">
                Quay lại
              </button>
            </div>

            <h4 class="mt-2 text-center text-header mb-4">Đơn vị</h4>
            <hr/>
            
            <!-- Loading -->
            <div v-show="loading" class="text-center py-4">
              <i class="fa fa-spinner fa-spin fa-3x"></i>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
              <div class="md:col-span-3 flex items-center">
                <label class="form-label mb-0">Tên<span class="error-sybol"></span></label>
              </div>
              <div class="md:col-span-9">
                <input class="form-control"
                  :class="{'border-red-500': errorName}"
                  type="text"
                  maxlength="100"
                  autocomplete="new-password"
                  v-model="unit.name">
                <div v-if="errorName" class="text-red-600 text-sm mt-1">
                  Vui lòng nhập tên
                </div>
              </div>
            </div>

            <div class="text-center mt-4">
              <button class="btn btn-outline-success px-4 btn-width-120" @click="save" :disabled="saving">
                {{ saving ? 'Đang lưu...' : 'Lưu' }}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useToastNotification } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'


export default {
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
   * Make toast without title
   */
    popToast(variant, content) {
      const { popToast } = useToastNotification()
      popToast(variant, content)
    },

    /**
     * Get detail
     */
    getUnitDetail() {
      let unitId = this.$route.params.id
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
          this.popToast('danger', errorMess)
        })
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push('/unit/list')
    },

    /**
     * Save
     */
    save () {
      this.click = true
      this.saving = true
      let result = this.checkValidate()
      if(result) {
        let unitId = this.$route.params.id
        if(unitId){
          // Edit
          let unit = this.unit
          unit.id = unitId
          adminAPI.editUnit(unit).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                // show popup success
                this.popToast('success', 'Cập nhật đơn vị thành công!!! ')
                this.$router.push('/unit/list')
              }
            }
          }).catch(err => {
            this.saving = false
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        } else {
          // Add
          adminAPI.addUnit(this.unit).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.popToast('success', 'Thêm đơn vị thành công!!!')
                this.$router.push("/unit/list")
              }
            }
          }).catch(err => {
            this.saving = false
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
      } else {
        this.saving = false
      }
    }
  }
}
</script>
