<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="bg-white shadow rounded-lg">
          <div class="p-4">

            <div class="flex flex-wrap -mx-2">
              <div class="w-1/2 px-2">
                <button class="btn btn-outline-secondary pull-left btn-width-120" @click="back">
                  Quay lại
                </button>
              </div>
              <div class="w-1/2 px-2">
                <button class="btn btn-outline-success pull-right btn-width-120" @click="save" :disabled="saving">
                    Lưu
                </button>
              </div>
            </div>

              <div class="flex flex-wrap -mx-2">
                <div class="w-full px-2">
                  <h4 class="mt-2 text-center">Nguyên liệu - Mặt hàng</h4>
                </div>
              </div>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-3/4 px-2">
                  <input
                  id="name"
                  type="text"
                  maxlength="100"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="resource.name">
                  <div class="invalid-feedback {'d-block': errorName}" >
                    Vui lòng nhập tên
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Đơn vị </label>
                </div>
                <div class="w-full md:w-3/4 px-2">
                  <select
                  :options="units"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  class="form-select"
                  v-model="resource.unit">
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Số lượng </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-3/4 px-2">
                  <input
                  id="quantity"
                  type="text"
                  maxlength="100"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="resource.quantity"
                  :disabled="route.params.id"
                  @keyup="integerAndPointOnly($event.target)">
                  <div class="invalid-feedback {'d-block': errorQuantity}" >
                    Vui lòng nhập số lượng
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Số lượng tối thiểu </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-3/4 px-2">
                  <input
                  id="min_quantity"
                  type="text"
                  maxlength="100"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="resource.min_quantity"
                  @keyup="integerAndPointOnly($event.target)">
                  <div class="invalid-feedback {'d-block': errorMinQuantity}" >
                    Vui lòng nhập số lượng tối thiểu
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
   * Make toast without title
   */
    popToast(variant, content) {
      this.toast(content, variant === 'danger' ? 'error' : variant)
    },

    /**
     * Load list option group menu
     */
    getUnitOptions () {
      unitAPI.getListUnitOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let units = res.data.data
          for (let index in units) {
            this.units.push(units[index])
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
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
          this.popToast('danger', errorMess)
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
                this.popToast('success', 'Cập nhật nguyên liệu thành công!!! ')
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
            this.popToast('danger', errorMess)
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
