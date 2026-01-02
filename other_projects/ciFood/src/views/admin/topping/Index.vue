<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">
            <b-row>
              <b-col cols="12">
                <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="back">
                  Quay lại
                </b-button>

                <b-button variant="outline-success" class="pull-right btn-width-120" @click="save" :disabled="saving">
                  Lưu
                </b-button>
              </b-col>
            </b-row>
              <b-row class="form-row">
                <b-col md='12'>
                  <h4 class="mt-2 text-center text-header">Topping</h4>
                </b-col>
              </b-row>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <b-row class="form-row">
                <b-col md="2" class="mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
                </b-col>
                <b-col md="10">
                  <input
                  id="name"
                  type="text"
                  maxlength="100"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="topping.name">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorName">
                    Đây là mục bắt buộc nhập
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="2" class="mt-2">
                  <label> Giá </label><span class="error-sybol"></span>
                </b-col>
                <b-col md="10">
                  <input
                  id="price"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="topping.price"
                  @keyup="intergerOnly($event.target)">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorPrice">
                    Đây là mục bắt buộc nhập
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row" v-if="this.$route.params.id">
                <b-col md="2" class="mt-2">
                  <label> Trạng Thái </label><span class="error-sybol"></span>
                </b-col>
                <b-col md="10">
                  <b-form-select
                  :options="options"      
                  id="status"
                  type="text"
                  maxlength="1"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="topping.status">
                  </b-form-select>
                </b-col>
              </b-row>

            <b-row class="form-row">
                <b-col md="2" class="mt-2">
                  <label> Nguyên liệu </label>
                </b-col>
                <b-col md="10">
                  <b-list-group horizontal>
                    <b-list-group-item @click="showModalResource">
                      <i class="fa fa-plus"/>
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
              </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <!-- Modal choose resource -->
    <b-modal centered hide-footer hide-header id="modal-choose-resource">
      <b-row>
        <b-col class="text-center text-header">
          <h5>Chọn nguyên liệu</h5>
        </b-col>
      </b-row>
      <br>
      <b-row v-show="resourceChosen.length > 0">
        <b-col>
          <p class="col-12" v-for="item in this.resourceChosen" :key="item.id">
            <label v-if="item.unit">- {{item.quantity + ' ' + item.unit + ': ' + item.name}}</label>
            <label v-if="!item.unit">- {{item.quantity + ': ' + item.name}}</label>
            <i class="fa fa-trash" @click="deleteResource(item.id)"/>
          </p>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <div>
            <div class="form-group">
              <label>Nguyên liệu:</label><span class="error-sybol"></span>
              <b-form-select
                :options="resources"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="resource.id"
                @change="changeResource">
                </b-form-select>
            </div>
            <div class="form-group">
              <label>Số lượng</label><span class="error-sybol"></span>
              <div class="input-group">
                <input
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="resource.quantity"
                  @keyup="integerOnly($event.target)"
                  maxlength="11">
                <label class="pl-2">{{unitResource}}</label>
              </div>
            </div>
          </div>
       </b-col>
      </b-row>

      <b-row>
        <b-col class="text-center">
          <button class="btn btn-primary px-4 default-btn-bg " @click="addGroupResource">
            Thêm
          </button>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12" class="text-right mt-3">
          <button class="btn btn-primary px-4 default-btn-bg" @click="confirmResource">
            Xác nhận
          </button>
        </b-col>
      </b-row>

    </b-modal>
  </div>
</template>
<script>
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/topping'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      options: [
        {value: 'false', text: 'Hết món'},
        {value: 'true', text: 'Còn món'}
      ],
      topping: {
        "id": null,
        "name": null,
        "price": null,
        "status": null,
        resource: null
      },
      click: false,
      saving: false,
      loading: false,
      resources: [{value: null, text: ''}],
      resourceChosen: [],
      unitResource: null,
      resource: {id: '', quantity: ''},
    }
  },
  mounted() {
    this.getToppingDetail()

    // Load option resource
    this.getResourceOptions()
  },
  computed: {
    errorName () {
      return this.checkInfo(this.topping.name)
    },
    errorPrice () {
      return this.checkInfo(this.topping.price)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorName || this.errorType || this.errorPrice)
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
   * Make toast with title
   */
    makeToast(variant = null, title, content) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true,
        autoHideDelay: 3000
      })
    },

    /**
     * Load list option resource
     */
    getResourceOptions () {
      adminAPI.getListResourceOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.resources = res.data.data
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Get menu detail
     */
    getToppingDetail() {
      let toppingId = this.$route.params.id
      if(toppingId){
        this.loading = true

        adminAPI.getToppingDetail(toppingId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.topping = res.data.data

            try {
              this.resourceChosen = JSON.parse(this.topping.resource)
            } catch (e) {
              this.resourceChosen = []
            }

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
     * Save
     */
    save() {
      this.saving = true
      this.click = true
      let result = this.checkValidate()
      if(result) {
        let toppingId = this.$route.params.id
        this.topping.resource = JSON.stringify(this.resourceChosen)
        if (toppingId) {
          // Edit
          adminAPI.updateTopping(this.topping).then(res => {
            this.saving = false
            if (res != null && res.data != null) {
              this.popToast('success', 'Cập nhật topping thành công!!!')
            } else {
              this.makeToast('danger', 'Cập nhật topping thất bại!!!', 'Có lỗi xảy ra, bạn thử lại sau nhé')
            }
          }).catch(err => {
            this.saving = false
            let message = ""
            if(err.response.data.status == 500) {
              message = "Lỗi hệ thống, chúng tôi rất tiếc về sự cố này, bạn thử lại sau vài phút nhé"
            } else {
              message = err.response.data.mess
            }
            this.makeToast('danger', 'Cập nhật topping thất bại!!!', message)
          })
        } else {
          // Add
          adminAPI.addTopping(this.topping).then(res => {
            this.saving = false
            if (res != null && res.data != null) {
              // Go to list
              this.$router.push('/topping/list')
            } else {
              this.makeToast('danger', 'Thêm topping thất bại!!!', 'Có lỗi xảy ra, bạn thử lại nhé')
            }
          }).catch(err => {
            this.saving = false
            let message = ""
            if(err.response.data.status == 500) {
              message = "Lỗi hệ thống, chúng tôi rất tiếc về sự cố này, bạn thử lại sau vài phút nhé"
            } else {
              message = err.response.data.mess
            }
            this.makeToast('danger', 'Thêm topping thất bại!!!', message)
          })
        }
      } else {
        this.saving = false
      }
    },

    /**
     * Event change resource
     */
    changeResource() {
      if(this.resource.id) {
        let item = this.getUnitByResourceId(this.resource.id)
        if(item) {
          this.unitResource = item.unit
        }
      }
    },

    /**
     * Show modal choose resource
     */
    showModalResource() {
      this.$bvModal.show('modal-choose-resource')
    },

    /**
     * Check exist resource id
     */
    checkExistResourceId(id) {
      for (let index in this.resourceChosen) {
        if(this.resourceChosen[index].id == id) {
          return true
        }
      }
      return false
    },

    /**
     * Get unit by resource id
     */
    getUnitByResourceId(id) {
      for(let index in this.resources) {
        if(this.resources[index].value == id) {
          return this.resources[index]
        }
      }
      return ""
    },

    /**
     * Add group resource
     */
    addGroupResource() {
      if(this.resource.id && this.resource.quantity) {
        // Check exist resource id
        if(!this.checkExistResourceId(this.resource.id)) {
          let item = this.getUnitByResourceId(this.resource.id)
          let itemTemp = {
            id: item.value,
            name: item.text,
            quantity: this.resource.quantity,
            unit: item.unit
          }
          this.resourceChosen.push(itemTemp)

          // Reset value
          this.resource.id = ''
          this.resource.quantity = ''
          this.unitResource = ''
        } else {
          this.popToast('danger', 'Nhập trùng nguyên liệu')
        }
      } else {
        this.popToast('danger', 'Vui lòng nhập đủ các mục yêu cầu')
      }
    },

    /**
     * Confirm resource
     */
    confirmResource() {
      this.$bvModal.hide('modal-choose-resource')
    },

    /**
     * Get index by id
     */
    getIndexById(id) {
      let index = 0
      for(var i in this.resourceChosen) {
        if(this.resourceChosen[i].id == id) {
          return index
        }
        index += 1
      }
      return false
    },

    /**
     * Remove resource
     */
    deleteResource(id) {

      // Get index pmt by id
      let indexTemp = this.getIndexById(id)

      if(indexTemp !== false) {
        this.resourceChosen.splice(indexTemp, 1)
      }
    },

    /**
     * Only input integer
     */
     intergerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push('/topping/list')
    }
  }
}
</script>
