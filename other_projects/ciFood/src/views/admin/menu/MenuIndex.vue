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
                  <h4 class="mt-2 text-center text-header">Thực Đơn</h4>
                </b-col>
              </b-row>
              <hr/>

              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Danh mục </label>
                </b-col>
                <b-col md="9">
                  <b-form-select
                  :options="groupMenus"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="menu.group_id">
                  </b-form-select>
                </b-col>
              </b-row>

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
                  v-model="menu.name">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorName">
                    Đây là mục bắt buộc nhập
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
                  v-model="menu.price"
                  @keyup="integerOnly($event.target)"
                  maxlength="11">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorPrice">
                    Đây là mục bắt buộc nhập
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Lựa chọn </label>
                </b-col>
                <b-col md="9">
                  <b-list-group horizontal>
                    <b-list-group-item @click="showModalOption">
                      <i class="fa fa-plus"/>
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
              </b-row>

              <b-row>
                <b-col md="3">
                </b-col>
                <b-col md="9">
                  <p class="col-12" v-for="option in this.menu.options" :key="option.type + option.value">
                      - Loại: {{option.type}},
                    Giá trị: {{option.value}},
                    <span v-show="option.price">Giá thêm: {{currencyFormat(option.price)}}vnđ,</span>
                    Mặc định: {{option.default == "true"? 'Đúng': 'Không'}}
                      <!-- <i class="fa fa-trash" @click="deleteOption(option.type, option.value, option.price)"/> -->
                  </p>
                </b-col>
              </b-row>

              <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label> Topping </label>
                  </b-col>
                  <b-col md="9">
                    <b-list-group horizontal>
                      <b-list-group-item @click="showModalTopping">
                        <i class="fa fa-plus"/>
                      </b-list-group-item>
                    </b-list-group>
                  </b-col>
              </b-row>

              <b-row>
                <b-col md="3">
                </b-col>
                <b-col md="9">
                  <p class="col-12" v-for="(topping, index) in this.menu.toppings" :key="topping.name">
                      <label>- {{ toppings[index].name }}   +{{currencyFormat(toppings[index].price)}}</label>
                  </p>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Nguyên liệu </label>
                </b-col>
                <b-col md="9">
                  <b-list-group horizontal>
                    <b-list-group-item @click="showModalResource">
                      <i class="fa fa-plus"/>
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
              </b-row>

              <b-row>
                <b-col md="3">
                </b-col>
                <b-col md="9">
                  <p class="col-12" v-for="item in this.resourceChosen" :key="item.id">
                    <label v-if="item.unit">- {{item.quantity + ' ' + item.unit + ': ' + item.name}}</label>
                    <label v-if="!item.unit">- {{item.quantity + ': ' + item.name}}</label>
                    <!-- <i class="fa fa-trash" @click="deleteResource(item.id)"/> -->
                  </p>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Cho phép sửa giá </label>
                </b-col>
                <b-col md="9">
                  <div class="input-group">
                    <input type="radio" v-model="menu.can_edit_price" name="canEditPrice" :value="false" class="mt-2"><label class="ml-4 mt-1">Không</label>
                    <input type="radio" v-model="menu.can_edit_price" name="canEditPrice" :value="true" class="ml-5 mt-2"><label class="ml-4 mt-1">Có</label>
                  </div>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Cho phép sửa số lượng </label>
                </b-col>
                <b-col md="9">
                  <div class="input-group">
                    <input type="radio" v-model="menu.can_edit_quantity" name="canEditQuantity" :value="false" class="mt-2"><label class="ml-4 mt-1">Không</label>
                    <input type="radio" v-model="menu.can_edit_quantity" name="canEditQuantity" :value="true" class="ml-5 mt-2"><label class="ml-4 mt-1">Có</label>
                  </div>
                </b-col>
              </b-row>

              <b-row class="form-row" v-show="kitchenAreas.length > 0">
                <b-col md="3" class="mt-2">
                  <label> Khu vực in </label>
                </b-col>
                <b-col md="9">
                  <b-form-select
                  :options="kitchenAreas"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="menu.kitchen_area_id">
                  </b-form-select>
                </b-col>
              </b-row>

              <b-row class="form-row" v-if="this.$route.params.id">
                <b-col md="3" class="mt-2">
                  <label> Trạng thái </label><span class="error-sybol"></span>
                </b-col>
                <b-col md="9">
                  <b-form-select
                  :options="options"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="menu.status"></b-form-select>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Thứ tự xuất hiện trên menu </label>
                </b-col>
                <b-col md="9">
                  <input
                  id="index"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="menu.index"
                  @keyup="integerOnly($event.target)"
                  maxlength="4">
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Hình ảnh </label>
                </b-col>
                <b-col md="9">
                  <b-input-group @click="$refs.file.click()" append="Browse" class="pointer">
                    <b-input v-model="menu.image"></b-input>
                  </b-input-group>
                  <input class="d-none" type="file" id="file" ref="file" accept="image/*" v-on:change="handleFileUpload"/>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <div v-if="menu.image_preview" class="preview-box text-center"  :style="{height: computedWidth, width: '100%'}">
                    <vue-cropper
                      ref="cropper"
                      :guides="true"
                      :view-mode="2"
                      :center="true"
                      drag-mode="crop"
                      :auto-crop-area="1"
                      :background="true"
                      :rotatable="true"
                      :src="menu.image_preview"
                      :initialAspectRatio="1/1"
                      :aspectRatio="1/1"
                      alt="Source Image"
                      :style="computedImg"
                      :crop="cropImage"
                    >
                    </vue-cropper>
                </div>
              </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <!-- Modal choose option -->
    <b-modal centered hide-footer hide-header id="modal-choose-option">
      <b-row>
        <b-col class="text-center text-header">
          <h5>Thêm lựa chọn</h5>
        </b-col>
      </b-row>
      <br>

      <b-row>
        <b-col>
           <p class="col-12" v-for="option in this.menu.options" :key="option.type + option.value">
              - Loại: {{option.type}},
             Giá trị: {{option.value}},
             <span v-show="option.price">Giá thêm: {{currencyFormat(option.price)}}vnđ,</span>
             Mặc định: {{option.default == "true"? 'Đúng': 'Không'}}
              <i class="fa fa-trash" @click="deleteOption(option.type, option.value, option.price)"/>
           </p>
        </b-col>
      </b-row>

      <div class="form-group">
        <label>Loại</label>
        <input
          id="optionType"
          type="text"
          class="form-control"
          maxlength="100">
      </div>
      <div class="form-group">
        <label>Giá trị</label>
        <input
          id="optionValue"
          type="text"
          class="form-control"
          maxlength="100">
      </div>
      <div class="form-group">
        <label>Giá thêm</label>
        <input
          id="optionPrice"
          type="text"
          class="form-control"
          maxlength="11"
          @keyup="integerOnly($event.target)"
        >
      </div>
      <div class="form-group">
        <label>Mặc định</label>
        <input type="radio" v-model="optionDefault" name="default" value="true">
        <label>Đúng</label>
        <input type="radio" v-model="optionDefault" name="default" value="false">
        <label>Không</label>
      </div>

      <b-row>
        <b-col class="text-center">
          <button class="btn btn-primary px-4 default-btn-bg " @click="addNewRowChooseOption">
            Thêm
          </button>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12" class="text-right mt-3">
          <button class="btn btn-primary px-4 default-btn-bg" @click="confirmOption">
            Xác nhận
          </button>
        </b-col>
      </b-row>

    </b-modal>

    <!-- Modal choose topping -->
    <b-modal centered hide-footer hide-header id="modal-choose-topping">
      <b-row>
        <b-col class="text-center text-header">
          <h5>Chọn topping</h5>
        </b-col>
      </b-row>
      <br>

      <b-row>
        <b-col>
          <div v-for="topping in toppings" :key="topping.name">
            <input type="checkbox" v-model="menu.toppings" name="toppingName" :value="topping.id">
            <label>{{ topping.name }}   +{{currencyFormat(topping.price)}}</label>
          </div>
       </b-col>
      </b-row>

      <b-row>
        <b-col cols="12" class="text-right mt-3">
          <button class="btn btn-primary px-4 default-btn-bg" @click="confirmTopping">
            Xác nhận
          </button>
        </b-col>
      </b-row>

    </b-modal>

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
import Mapper from '@/mapper/menu'
import GMMapper from '@/mapper/group_menu'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import commonFunc from '@/common/commonFunc'


export default {
  components: {
    VueCropper
  },
  data () {
    return {
      options: [
        {value: 'true', text: 'Còn món'},
        {value: 'false', text: 'Hết món'}
      ],
      menu: {
        "id": null,
        "name": null,
        "price": null,
        "status": null,
        "options": [],
        "toppings": [],
        "group_id": null,
        "can_edit_price": false,
        "can_edit_quantity": false,
        "kitchen_area_id": null,
        "index": null,
        "image": null,
        image_preview: null,
      },
      file: null,
      height: '100px',
      styleImg: {},
      saving: false,
      click: false,
      groupMenus: [],
      toppings: [],
      kitchenAreas: [],
      optionDefault: "false",
      loading: false,
      resources: [{value: null, text: ''}],
      resource: {id: '', quantity: ''},
      unitResource: null,
      resourceChosen: []
    }
  },
  mounted() {
    this.getGroupMenuOptions()

    this.getTopping()

    this.getKitchenArea()

    // Load option resource
    this.getResourceOptions()

    this.getMenuDetail()
  },
  computed: {
    computedWidth() {
      return this.height
    },
    computedImg() {
      return this.styleImg
    },
    errorName: function () {
      return this.checkInfo(this.menu.name)
    },
    errorPrice: function () {
      return this.checkInfo(this.menu.price)
    },

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
     * Load list option group menu
     */
    getGroupMenuOptions () {
      adminAPI.getListGroupMenuOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.groupMenus = GMMapper.mapGroupMenuOptionModelToDto(res.data.data)
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
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
     * Get list topping
     */
    getTopping() {
      adminAPI.getTopping().then(res => {
        this.toppings = res.data.data
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Get kitchen area
     */
    getKitchenArea() {
      adminAPI.getKitchenArea().then(res => {
        let items = res.data.data
        let options = []
        for (let index in items) {
          let item = {
            "value": items[index].id,
            "text": items[index].name
          }
          options.push(item)
        }
        this.kitchenAreas = options
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Get menu detail
     */
    getMenuDetail() {
      let menuId = this.$route.params.id
      if(menuId){
        this.loading = true

        adminAPI.getMenuDetail(menuId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            // this.menu = Mapper.mapMenuDetailModelToDto(res.data.data)
            this.menu = res.data.data
            this.file = this.menu.image_preview

            this.resourceChosen = this.menu.resource
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
     * Handle upload file
     */
    handleFileUpload () { // event
      this.menu.image_preview = null
      this.file = this.$refs.file.files[0]//event.target.files[0]
      this.menu.image = this.file.name

      // Render image in review
      let reader  = new FileReader ()
      reader.addEventListener("load", function () {
        // this.$refs.cropper.image = reader.result
        this.menu.image_preview = reader.result
      }.bind(this), false)
      if( this.file ){
        reader.readAsDataURL( this.file )
        this.height = '300px'
        this.styleImg = {'max-width': '100%', 'max-height': '100%'}
      }
    },

    /**
     * Prepare info to save
     */
    save() {
      this.click = true
      let result = this.checkValidate()
      if(result) {
        if(this.menu.image_preview) {
          this.$refs.cropper
            .getCroppedCanvas({
              width: 300,
              height: 300
            })
            .toBlob(blob => {
              const formData = new FormData();
              formData.append("file", blob, this.menu.image)
              formData.append("name", this.menu.name)
              formData.append("price", this.menu.price)
              formData.append("options", JSON.stringify(this.menu.options))
              formData.append("toppings", this.menu.toppings)
              formData.append("group", this.menu.group_id)
              formData.append("quantity", this.menu.quantity)
              formData.append("resource", JSON.stringify(this.resourceChosen))
              formData.append("can_edit_price", this.menu.can_edit_price)
              formData.append("can_edit_quantity", this.menu.can_edit_quantity)
              formData.append("index", this.menu.index)
              formData.append("kitchen_area_id", this.menu.kitchen_area_id)

              this.doSave(formData);
            });
        } else {
          const formData = new FormData();
          formData.append("file", null)
          formData.append("name", this.menu.name)
          formData.append("price", this.menu.price)
          formData.append("options", JSON.stringify(this.menu.options))
          formData.append("toppings", this.menu.toppings)
          formData.append("group", this.menu.group_id)
          formData.append("quantity", this.menu.quantity)
          formData.append("resource", JSON.stringify(this.resourceChosen))
          formData.append("can_edit_price", this.menu.can_edit_price)
          formData.append("can_edit_quantity", this.menu.can_edit_quantity)
          formData.append("index", this.menu.index)
          formData.append("kitchen_area_id", this.menu.kitchen_area_id)

          this.doSave(formData);
        }
      }
    },

    /**
     * Call api, save data
     * @param formData
     */
    doSave(formData) {
      this.saving = true
      let menuId = this.$route.params.id
      if(menuId){
        // Edit
        formData.append("status", this.menu.status)
        formData.append("id", menuId)

        adminAPI.editMenu(formData).then(res => {
          this.saving = false
          if(res != null && res.data != null){
            // Show notify edit success
            this.popToast('success', 'Lưu menu thành công!!! ')
          }else{
            // Show notify edit fail
            this.popToast('danger', 'Lưu menu thất bại!!! ')
          }
        }).catch(err => {
          this.saving = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      } else {
        // Add
        adminAPI.addMenu(formData).then(res => {
          this.saving = false
          if(res != null && res.data != null){
            // Go to list
            this.$router.push('/menu/list')
          }else{
            // Show notify add fail
            this.popToast('danger', 'Lưu menu thất bại!!! ')
          }
        }).catch(err => {
          this.saving = false
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    },

    /**
     * Show modal choose option
     */
    showModalOption() {
      this.$bvModal.show('modal-choose-option')
    },

    /**
     * Show modal choose topping
     */
    showModalTopping() {
      this.$bvModal.show('modal-choose-topping')
    },

    /**
     * Show modal choose resource
     */
    showModalResource() {
      this.$bvModal.show('modal-choose-resource')
    },

    /**
     * Add new row choose option
     */
    addNewRowChooseOption() {
      let optionType = document.getElementById("optionType").value.trim()
      let optionValue = document.getElementById("optionValue").value.trim()
      let optionPrice = document.getElementById("optionPrice").value.trim()
      let optionDefault = JSON.parse(JSON.stringify(this.optionDefault))

      let option = {
        "type": optionType,
        "value": optionValue,
        "price": optionPrice,
        "default": optionDefault
      }
      this.menu.options.push(option)

      document.getElementById("optionType").value = ""
      document.getElementById("optionValue").value = ""
      document.getElementById("optionPrice").value = ""
      this.optionDefault = "false"
    },

    /**
     * Delete option
     */
    deleteOption(type, value, price) {
      let index = 0
      for (var i in this.menu.options) {
        if(this.menu.options[i].type == type && this.menu.options[i].value == value && this.menu.options[i].price == price) {
          this.menu.options.splice(index, 1)
        }
        index += 1
      }
    },

    /**
     * Confirm option
     */
    confirmOption() {
      this.$bvModal.hide('modal-choose-option')
    },

    /**
     * Confirm topping
     */
    confirmTopping() {
      this.$bvModal.hide('modal-choose-topping')
    },

    /**
     * Event crop image
     */
    cropImage() {
      // Use to check reupload image when edit
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push('/menu/list')
    },

    /**
   * Currency format
   */
    currencyFormat(num) {
      if(num) {
        let result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        return result
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
      for (let index in this.resourceChosen) {
        if(this.resourceChosen[index].id == id) {
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
  }
}
</script>

<style lang="scss">

  .width-33 {
    width: 31%;
    float: left;
  }

</style>
