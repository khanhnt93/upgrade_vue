<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="card-body p-4"  >
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-6">
                <button class="btn btn-outline-secondary pull-left px-4 btn-width-120" @click="back">
                  Quay lại
                </button>
              </div>
              <div class="col-span-6">
                <button class="btn btn-outline-success float-right px-4 btn-width-120" @click="save" :disabled="saving">
                    Lưu
                </button>
              </div>
            </div>
              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-12">
                  <h4 class="mt-2 text-center text-header">Topping</h4>
                </div>
              </div>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-2 mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
                </div>
                <div class="col-span-10">
                  <input
                  id="name"
                  type="text"
                  maxlength="100"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="topping.name">
                  <div class="invalid-feedback invalid-feedback"   :state="!errorName">
                    Đây là mục bắt buộc nhập
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-2 mt-2">
                  <label> Giá </label><span class="error-sybol"></span>
                </div>
                <div class="col-span-10">
                  <input
                  id="price"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="topping.price"
                  @keyup="intergerOnly($event.target)">
                  <div class="invalid-feedback invalid-feedback"   :state="!errorPrice">
                    Đây là mục bắt buộc nhập
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row" v-if="this.$route.params.id">
                <div class="col-span-2 mt-2">
                  <label> Trạng Thái </label><span class="error-sybol"></span>
                </div>
                <div class="col-span-10">
                  <select class="form-control form-control"
                  id="status"
                  type="text"
                  maxlength="1"
                  autocomplete="new-password"
                  v-model="topping.status">
                    <option v-for="option in options" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                </div>
              </div>

            <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-2 mt-2">
                  <label> Nguyên liệu </label>
                </div>
                <div class="col-span-10">
                  <div class="flex gap-2">
                    <button class="list-group-item" @click="showModalResource">
                      <i class="fa fa-plus"/>
                    </button>
                  </div>
                </div>
              </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Modal choose resource -->
    <div v-if="showChooseResourceModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div class="flex items-center justify-between p-4 border-b">
          <h5 class="text-xl font-bold">Chọn nguyên liệu</h5>
          <button @click="showChooseResourceModal = false" class="text-gray-500 hover:text-gray-700">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-12 gap-4" v-show="resourceChosen.length> 0">
            <div class="col-span-full">
              <p class="col-12" v-for="item in this.resourceChosen" :key="item.id">
                <label v-if="item.unit">- {{item.quantity + ' ' + item.unit + ': ' + item.name}}</label>
                <label v-if="!item.unit">- {{item.quantity + ': ' + item.name}}</label>
                <i class="fa fa-trash cursor-pointer text-red-500" @click="deleteResource(item.id)"/>
              </p>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <div>
                <div class="form-group">
                  <label>Nguyên liệu:</label><span class="error-sybol"></span>
                  <select class="form-control form-control"
                    type="text"
                    autocomplete="new-password"
                    v-model="resource.id"
                    @change="changeResource">
                      <option v-for="option in resources" :key="option.value" :value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
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
           </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full text-center">
              <button class="btn px-4 default-btn-bg" @click="addGroupResource">
                Thêm
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 text-right mt-3">
              <button class="btn px-4 default-btn-bg" @click="confirmResource">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
        {value: 'false', text: 'Hết dv'},
        {value: 'true', text: 'Còn dv'}
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
      showChooseResourceModal: false,
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
      if (variant === 'danger') {
        this.$toast.error(content);
      } else if (variant === 'success') {
        this.$toast.success(content);
      } else if (variant === 'warning') {
        this.$toast.warning(content);
      } else {
        this.$toast.info(content);
      }
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
              this.popToast('danger', 'Cập nhật topping thất bại!!! Có lỗi xảy ra, bạn thử lại sau nhé')
            }
          }).catch(err => {
            this.saving = false
            let message = ""
            if(err.response.data.status == 500) {
              message = "Lỗi hệ thống, chúng tôi rất tiếc về sự cố này, bạn thử lại sau vài phút nhé"
            } else {
              message = err.response.data.mess
            }
            this.popToast('danger', 'Cập nhật topping thất bại!!! ' + message)
          })
        } else {
          // Add
          adminAPI.addTopping(this.topping).then(res => {
            this.saving = false
            if (res != null && res.data != null) {
              // Go to list
              this.$router.push('/topping/list')
            } else {
              this.popToast('danger', 'Thêm topping thất bại!!! Có lỗi xảy ra, bạn thử lại nhé')
            }
          }).catch(err => {
            this.saving = false
            let message = ""
            if(err.response.data.status == 500) {
              message = "Lỗi hệ thống, chúng tôi rất tiếc về sự cố này, bạn thử lại sau vài phút nhé"
            } else {
              message = err.response.data.mess
            }
            this.popToast('danger', 'Thêm topping thất bại!!! ' + message)
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
      // this.$bvModal.show('modal-choose-resource')
      this.showChooseResourceModal = true;
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
      // this.$bvModal.hide('modal-choose-resource')
      this.showChooseResourceModal = false
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
