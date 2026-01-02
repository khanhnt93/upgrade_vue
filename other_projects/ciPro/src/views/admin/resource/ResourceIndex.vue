<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

            <b-row>
              <b-col cols="6">
                <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="back">
                  Quay lại
                </b-button>
              </b-col>
              <b-col cols="6">
                <b-button variant="outline-success" class="pull-right btn-width-120" @click="save" :disabled="saving">
                    Lưu
                </b-button>
              </b-col>
            </b-row>

              <b-row>
                <b-col md='12'>
                  <h4 class="mt-2 text-center">Nguyên liệu - Mặt hàng</h4>
                </b-col>
              </b-row>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Tên<span class="error-sybol"></span></label>
                </b-col>
                <b-col md="9">
                  <input
                  id="name"
                  type="text"
                  maxlength="100"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="resource.name">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorName">
                    Vui lòng nhập tên
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Đơn vị </label>
                </b-col>
                <b-col md="9">
                  <b-form-select
                  :options="units"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="resource.unit">
                  </b-form-select>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Số lượng<span class="error-sybol"></span></label>
                </b-col>
                <b-col md="9">
                  <input
                  id="quantity"
                  type="text"
                  maxlength="100"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="resource.quantity"
                  :disabled="this.$route.params.id"
                  @keyup="integerAndPointOnly($event.target)">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorQuantity">
                    Vui lòng nhập số lượng
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Số lượng tối thiểu<span class="error-sybol"></span></label>
                </b-col>
                <b-col md="9">
                  <input
                  id="min_quantity"
                  type="text"
                  maxlength="100"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="resource.min_quantity"
                  @keyup="integerAndPointOnly($event.target)">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorMinQuantity">
                    Vui lòng nhập số lượng tối thiểu
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import adminAPI from '@/api/admin'
import unitAPI from '@/api/unit'
import commonFunc from '@/common/commonFunc'


export default {
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
      this.$bvToast.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      })
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
      let Id = this.$route.params.id
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
      this.$router.push('/resource/list')
    },

    /**
     * Save
     */
    save () {
      this.click = true
      this.saving = true
      let result = this.checkValidate()
      if(result) {
        let id = this.$route.params.id
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
                this.$router.push("/resource/list")
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
