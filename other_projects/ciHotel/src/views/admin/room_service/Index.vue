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

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-1 text-center text-header">DỊCH VỤ PHÒNG</h4>
              </b-col>
            </b-row>
            <hr/>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Tên </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <input
                  id="name"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.name"
                  maxlength="255">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorName">
                  Vui lòng nhập tên
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Giá </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <input
                  id="price"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.price"
                  maxlength="11"
                  @keyup="integerOnly($event.target)">

                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorPrice">
                  Vui lòng nhập value
                </b-form-invalid-feedback>
              </b-col>

            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Nguyên liệu </label>
              </b-col>
              <b-col md="9">
                <b-list-group horizontal>
                  <b-list-group-item @click="$bvModal.show('modal-choose-resource')">
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
      <b-row v-show="inputs.resources.length > 0">
        <b-col>
          <p class="col-12" v-for="item in this.inputs.resources" :key="item.id">
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
  import Mapper from '@/mapper/promotion'
  import commonFunc from '@/common/commonFunc'


  export default {
    data () {
      return {
        inputs: {
          "id": null,
          "name": null,
          "price": null,
          "resources":[]
        },
        resources: [{value: null, text: ''}],
        resource: {id: '', quantity: ''},
        unitResource: null,
        click: false,
        saving: false,
        loading: false,
      }
    },
    mounted() {

      this.getRoomServiceDetail()
      this.getResourceOptions()
    },
    computed: {
      errorName: function () {
        return this.checkInfo(this.inputs.name)
      },
      errorPrice: function () {
        return this.checkInfo(this.inputs.price)
      }
    },
    methods: {
      checkInfo (info) {
        return (this.click && (info == null || info.length <= 0))
      },
      checkValidate () {
        return !(this.errorName || this.errorPrice)
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
      makeToast(variant = null, title="Success!!!", content="Thao tác thành công!!!") {
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
            let items = res.data.data
            if(items) {
              for (let i in items) {
                this.resources.push(items[i])
              }
            }
          }
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      },

      /**
       * Get kitchen area detail
       */
      getRoomServiceDetail () {
        let id = this.$route.params.id
        if(id){
          this.loading = true

          adminAPI.getRoomServiceDetail(id).then(res => {
            if(res != null && res.data != null && res.data.data != null) {
              this.inputs = res.data.data
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
       * Check exist resource id
       */
      checkExistResourceId(id) {
        for (let index in this.inputs.resources) {
          if(this.inputs.resources[index].id == id) {
            return true
          }
        }
        return false
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
            this.inputs.resources.push(itemTemp)

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
       * Save promotion
       */
      save () {
        this.click = true
        this.saving = true

        // Check validate
        if(!this.checkValidate()) {
          this.saving = false
          return
        }

        let id = this.$route.params.id
        if(id){
          // Edit
          this.inputs.id = id
          adminAPI.editRoomService(this.inputs).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                // show popup success
                this.popToast('success', 'Cập nhật tầng thành công!!! ')
              }
            }
          }).catch(err => {
            this.saving = false
            // Show notify edit fail
            let message = ""
            if(err.response.data.status == 422) {
              message = err.response.data.mess
            } else {
              message = "Lỗi hệ thống"
            }
            this.makeToast('danger', "Cập nhật thất bại!!!", message)
          })
        } else {
          // Add
          adminAPI.addRoomService(this.inputs).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.$router.push('/room-service/list')
              }
            }
          }).catch(err => {
            this.saving = false
            let message = ""
            if(err.response.data.status == 422) {
              message = err.response.data.mess
            } else {
              message = "Lỗi hệ thống"
            }
            this.makeToast('danger', "Tạo mới thất bại!!!", message)
          })
        }
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
      integerOnly(item) {
        let valueInput = item.value
        let result = commonFunc.intergerOnly(valueInput)
        item.value = result
      },
      /**
       * Back to list
       */
      back() {
        // Go to list
        this.$router.push('/room-service/list')
      },
    }
  }
</script>
