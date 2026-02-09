<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="px-2 w-full">
        <div class="bg-white shadow rounded-lg p-4">

              <div class="flex flex-wrap -mx-2">
              <div class="px-2 w-full md:w-1/2">
                <button class="btn btn-outline-secondary pull-left btn-width-120" @click="back">
                  Quay lại
                </button>
              </div>
              <div class="px-2 w-full md:w-1/2">
                <button class="btn btn-outline-success pull-right btn-width-120" @click="save" :disabled="saving">
                    Lưu
                </button>
              </div>
            </div>

              <div class="flex flex-wrap -mx-2">
                <div class="px-2 w-full">
                  <h4 class="mt-2 text-center">Đơn vị</h4>
                </div>
              </div>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="flex flex-wrap -mx-2 form-row">
                <div class="px-2 w-full md:w-1/4 mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
                </div>
                <div class="px-2 w-full md:w-3/4">
                  <input
                  id="name"
                  type="text"
                  maxlength="100"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="unit.name">
                  <div class="invalid-feedback {'d-block': errorName}" >
                    Vui lòng nhập tên
                  </div>
                </div>
              </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import unitAPI from '@/api/unit'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useRouter, useRoute } from 'vue-router'


export default {
  setup() {
    const { toast } = useToast()
    const router = useRouter()
    const route = useRoute()

    return {
      toast,
      router,
      route
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
   * Make toast without title
   */
    popToast(variant, content) {
      this.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      })
    },

    /**
     * Get detail
     */
    getUnitDetail() {
      let unitId = this.route.params.id
      if(unitId){
        this.loading = true

        unitAPI.getUnitDetail(unitId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.unit = res.data.data
          }

          this.loading = false
        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('error', errorMess)
        })
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.router.push('/unit')
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
          unitAPI.editUnit(unit).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                // show popup success
                this.popToast('success', 'Cập nhật đơn vị thành công!!! ')
              }
            }
          }).catch(err => {
            this.saving = false
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('error', errorMess)
          })
        } else {
          // Add
          unitAPI.addUnit(this.unit).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.router.push("/unit")
              }
            }
          }).catch(err => {
            this.saving = false
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('error', errorMess)
          })
        }
      } else {
        this.saving = false
      }
    }
  }
}
</script>
