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
                  <h4 class="mt-2 text-center text-header">Dịch vụ</h4>
                </div>
              </div>
              <hr/>

              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Danh mục <span class="error-sybol"></span></label>
                </div>
                <div class="col-span-9">
                  <select class="form-control form-control"
                  type="text"
                  autocomplete="new-password"
                  v-model="menu.group"
                  @change="changeGroup">
                    <option v-for="option in groupMenus" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                  <div class="invalid-feedback invalid-feedback"   :state="!errorGroup">
                    Đây là mục bắt buộc nhập
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row" v-if="isCard">
                <div class="col-span-3 mt-2">
                  <label> Loại thẻ <span class="error-sybol"></span></label>
                </div>
                <div class="col-span-9">
                  <select class="form-control form-control"
                  type="text"
                  autocomplete="new-password"
                  v-model="menu.type">
                    <option v-for="option in typeOptions" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                  <div class="invalid-feedback invalid-feedback"   :state="!errorType">
                    Đây là mục bắt buộc nhập
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row" v-if="isCard && menu.type == 2">
                <div class="col-span-3 mt-2">
                  <label> Áp dụng cho dịch vụ <span class="error-sybol"></span></label>
                </div>
                <div class="col-span-9">
                  <select class="form-control form-control"
                  type="text"
                  autocomplete="new-password"
                  v-model="menu.sub_service_id">
                    <option v-for="option in services" :key="option.id || option.value" :value="option.id || option.value">
                      {{ option.name || option.text }}
                    </option>
                  </select>
                  <div class="invalid-feedback invalid-feedback"   :state="!errorSubServiceId">
                    Đây là mục bắt buộc nhập
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row" v-if="isCard && menu.type == 2">
                <div class="col-span-3 mt-2">
                  <label> Số lần sử dụng <span class="error-sybol"></span></label>
                </div>
                <div class="col-span-9">
                  <input
                  id="number_of_use"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="menu.number_of_use"
                  @keyup="integerOnly($event.target)"
                  maxlength="11">
                  <div class="invalid-feedback invalid-feedback"   :state="!errorNumberOfUse">
                    Đây là mục bắt buộc nhập
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row" v-if="isCard && menu.type == 3">
                <div class="col-span-3 mt-2">
                  <label> Hạn mức thẻ <span class="error-sybol"></span></label>
                </div>
                <div class="col-span-9">
                  <input
                  id="card_amount_limit"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="menu.card_amount_limit"
                  @keyup="integerOnly($event.target)"
                  maxlength="11">
                  <div class="invalid-feedback invalid-feedback"   :state="!errorCardAmountLimit">
                    Đây là mục bắt buộc nhập
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row" v-if="isCard">
                <div class="col-span-3 mt-2">
                  <label> Hết hạn sau (ngày) <span class="error-sybol"></span></label>
                </div>
                <div class="col-span-9">
                  <input
                  id="day_to_expiry"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="menu.day_to_expiry"
                  @keyup="integerOnly($event.target)"
                  maxlength="5">
                  <!-- <div class="invalid-feedback invalid-feedback"   :state="!errorDayToExpiry">
                    Đây là mục bắt buộc nhập
                  </div> -->
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Tên dịch vụ <span class="error-sybol"></span></label>
                </div>
                <div class="col-span-9">
                  <input
                  id="name"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="menu.name">
                  <div class="invalid-feedback invalid-feedback"   :state="!errorName">
                    Đây là mục bắt buộc nhập
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Giá dịch vụ <span class="error-sybol"></span></label>
                </div>
                <div class="col-span-9">
                  <input
                  id="price"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="menu.price"
                  @keyup="integerOnly($event.target)"
                  maxlength="11">
                  <div class="invalid-feedback invalid-feedback"   :state="!errorPrice">
                    Đây là mục bắt buộc nhập
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> % Hoa hồng </label>
                </div>
                <div class="col-span-9">
                  <input
                    id="commission_percent"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="menu.commission_percent"
                    maxlength="5"
                    @keyup="integerAndPointOnly($event.target)">
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Số tiền tour </label>
                </div>
                <div class="col-span-9">
                  <input
                    id="tour_amount"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="menu.tour_amount"
                    maxlength="11"
                    @keyup="integerOnly($event.target)">
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Thời gian làm (Phút) </label>
                </div>
                <div class="col-span-9">
                  <input
                    id="work_time_minute"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="menu.work_time_minute"
                    maxlength="4"
                    @keyup="integerOnly($event.target)">
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Nguyên liệu </label>
                </div>
                <div class="col-span-9">
                  <div class="flex gap-2">
                    <button class="list-group-item" @click="showModalResource">
                      <i class="fa fa-plus"/>
                    </button>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Cho phép sửa giá </label>
                </div>
                <div class="col-span-9">
                  <div class="input-group">
                    <input type="radio" v-model="menu.can_edit_price" name="canEditPrice" :value="false" class="mt-2"><label class="ml-4 mt-1">Không</label>
                    <input type="radio" v-model="menu.can_edit_price" name="canEditPrice" :value="true" class="ml-5 mt-2"><label class="ml-4 mt-1">Có</label>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Cho phép sửa số lượng </label>
                </div>
                <div class="col-span-9">
                  <div class="input-group">
                    <input type="radio" v-model="menu.can_edit_quantity" name="canEditQuantity" :value="false" class="mt-2"><label class="ml-4 mt-1">Không</label>
                    <input type="radio" v-model="menu.can_edit_quantity" name="canEditQuantity" :value="true" class="ml-5 mt-2"><label class="ml-4 mt-1">Có</label>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row" v-if="this.$route.params.id">
                <div class="col-span-3 mt-2">
                  <label> Trạng thái </label><span class="error-sybol"></span>
                </div>
                <div class="col-span-9">
                  <select class="form-control form-control"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  v-model="menu.status">
                    <option v-for="option in options" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Thứ tự xuất hiện trên menu </label>
                </div>
                <div class="col-span-9">
                  <input
                  id="index"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="menu.index"
                  @keyup="integerOnly($event.target)"
                  maxlength="4">
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Mô tả dịch vụ </label>
                </div>
                <div class="col-span-9 mt-2">
                  <textarea class="form-control"
                    id="description"
                    v-model="menu.description"
                    rows="5"
                  ></textarea>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Tên dịch vụ viết tắt</label>
                </div>
                <div class="col-span-9">
                  <input
                  id="name_abbreviation"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="menu.name_abbreviation">
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Hình ảnh </label>
                </div>
                <div class="col-span-9 mt-2">
                  <div class="input-group cursor-pointer" @click="$refs.file.click()">
                    <input class="form-control" v-model="menu.image">
                    <div class="input-group-append">
                      <span class="input-group-text">Browse</span>
                    </div>
                  </div>
                  <input class="d-none" type="file" id="file" ref="file" accept="image/*" v-on:change="handleFileUpload"/>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div v-if="menu.imagePreview" class="preview-box text-center"  :style="{height: computedWidth, width: '100%'}">
                    <vue-cropper
                      ref="cropper"
                      :guides="true"
                      :view-mode="2"
                      :center="true"
                      drag-mode="crop"
                      :auto-crop-area="1"
                      :background="true"
                      :rotatable="true"
                      :src="menu.imagePreview"
                      :initialAspectRatio="1/1"
                      :aspectRatio="1/1"
                      alt="Source Image"
                      :style="computedImg"
                      :crop="cropImage"
                    >
                    </vue-cropper>
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
                      <option v-for="option in resources" :key="option.id || option.value" :value="option.id || option.value">
                        {{ option.name || option.text }}
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
import Mapper from '@/mapper/menu'
import commonFunc from '@/common/commonFunc'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'


export default {
  components: {
    VueCropper
  },
  data () {
    return {
      options: [
        {value: 'true', text: 'Còn dv'},
        {value: 'false', text: 'Hết dv'}
      ],
      menu: {
        "id": null,
        "name": null,
        "price": null,
        "status": null,
        "options": [],
        "toppings": [],
        "group": null,
        "can_edit_price": false,
        "can_edit_quantity": false,
        "index": null,
        "description": null,
        "image": null,
        imagePreview: null,
        commission_percent: 0,
        tour_amount: 0,
        work_time_minute: null,
        type: null,
        number_of_use: null,
        day_to_expiry: null,
        card_amount_limit: null,
        sub_service_id: null,
        name_abbreviation: null,
      },
      file: null,
      height: '100px',
      styleImg: {},
      saving: false,
      click: false,
      groupMenus: [],
      toppings: [],
      services: [],
      optionDefault: "false",
      loading: false,
      resources: [{value: null, text: ''}],
      resource: {id: '', quantity: ''},
      unitResource: null,
      resourceChosen: [],
      isCard: false,
      isCardMoney: false,
      isCardService: false,
      typeOptions: [
        {value: null, text: '-- Chọn loại thẻ --'},
        {value: 2, text: 'Thẻ dịch vụ lần'},
        {value: 3, text: 'Thẻ tiền'}
      ],
      showChooseResourceModal: false,
    }
  },
  mounted() {
    this.getOptionRelatedService()

    // this.getGroupMenuOptions()

    // this.getTopping()

    // // Load option resource
    // this.getResourceOptions()

    this.getMenuDetail()
  },
  computed: {
    computedWidth() {
      return this.height
    },
    computedImg() {
      return this.styleImg
    },
    errorGroup: function () {
      return this.checkInfo(this.menu.group)
    },
    errorName: function () {
      return this.checkInfo(this.menu.name)
    },
    errorPrice: function () {
      return this.checkInfo(this.menu.price)
    },
    errorType: function () {
      return this.checkType(this.menu.type)
    },
    errorNumberOfUse: function () {
      return this.checkNumberOfUse(this.menu.number_of_use)
    },
    errorCardAmountLimit: function () {
      return this.checkCardAmountLimit(this.menu.card_amount_limit)
    },
    errorSubServiceId: function () {
      return this.checkSubServiceId(this.menu.sub_service_id)
    },
    // errorDayToExpiry: function () {
    //   return this.checkDayToExpiry(this.menu.day_to_expiry)
    // },

  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkType (info) {
      return (this.click && this.isCard && (info == null || info.length <= 0))
    },
    checkNumberOfUse (info) {
      return (this.click && this.isCard && this.menu.type == 2 && (info == null || info.length <= 0))
    },
    checkSubServiceId (info) {
      return (this.click && this.isCard && this.menu.type == 2 && (info == null || info.length <= 0))
    },
    checkCardAmountLimit (info) {
      return (this.click && this.isCard && this.menu.type == 3 && (info == null || info.length <= 0))
    },
    // checkDayToExpiry (info) {
    //   return (this.click && this.isCard && this.menu.type == 2 && (info == null || info.length <= 0))
    // },
    checkValidate () {
      return !(this.errorName || this.errorPrice)
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
     * Load list option
     */
     getOptionRelatedService () {
      adminAPI.getOptionRelatedService().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          // group_menus
          let groups = res.data.data.group_menus
          this.groupMenuStore = groups
          this.groupMenus = [{value:null, text: "-- Chọn nhóm dịch vụ --"}]

          for (let group of  groups) {
            let optionTemp = { value: group.id, text: group.name }
            this.groupMenus.push(optionTemp)
          }

          // resources
          this.resources = res.data.data.resources

          // services
          this.services = res.data.data.services
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    // /**
    //  * Load list option group menu
    //  */
    // getGroupMenuOptions () {
    //   adminAPI.getListGroupMenuOption().then(res => {
    //     if(res != null && res.data != null && res.data.data != null) {
    //       let groups = res.data.data
    //       this.groupMenuStore = groups
    //       this.groupMenus = [{value:null, text: "-- Chọn nhóm dịch vụ --"}]

    //       for (let group of  groups) {
    //         let optionTemp = { value: group.id, text: group.name }
    //         this.groupMenus.push(optionTemp)
    //       }
    //     }
    //   }).catch(err => {
    //     // Handle error
    //     let errorMess = commonFunc.handleStaffError(err)
    //     this.popToast('danger', errorMess)
    //   })
    // },

    // /**
    //  * Load list option resource
    //  */
    // getResourceOptions () {
    //   adminAPI.getListResourceOption().then(res => {
    //     if(res != null && res.data != null && res.data.data != null) {
    //       let items = res.data.data
    //       if(items) {
    //         for (let i in items) {
    //           this.resources.push(items[i])
    //         }
    //       }
    //     }
    //   }).catch(err => {
    //     // Handle error
    //     let errorMess = commonFunc.handleStaffError(err)
    //     this.popToast('danger', errorMess)
    //   })
    // },

    /**
     * Get menu detail
     */
    getMenuDetail() {
      let menuId = this.$route.params.id
      if(menuId){
        this.loading = true

        adminAPI.getMenuDetail(menuId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.menu = Mapper.mapMenuDetailModelToDto(res.data.data)
            this.file = this.menu.imagePreview

            this.resourceChosen = this.menu.resource

            if(this.menu.type == 3 || this.menu.type == 2) {
              this.isCard = true
            }
          }

          this.loading = false
        }).catch(err => {
          console.log(err)
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
      this.menu.imagePreview = null
      this.file = this.$refs.file.files[0]//event.target.files[0]
      this.menu.image = this.file.name

      // Render image in review
      let reader  = new FileReader ()
      reader.addEventListener("load", function () {
        // this.$refs.cropper.image = reader.result
        this.menu.imagePreview = reader.result
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

      // Kiểm tra loại dịch vụ
      if(this.isCard) {
        // Thẻ lần
        if(this.menu.type == 2) {
          this.menu.card_amount_limit = null
        } else {
          this.menu.number_of_use = null
          this.menu.sub_service_id = null
        }
      } else {
        this.menu.type = 1
        this.menu.number_of_use = null
        this.menu.day_to_expiry = null
        this.menu.card_amount_limit = null
        this.menu.sub_service_id = null
      }

      let result = this.checkValidate()

      if(result) {
        if(this.menu.imagePreview) {
          this.$refs.cropper
            .getCroppedCanvas({
              width: 300,
              height: 300
            })
            .toBlob(blob => {
              const formData = new FormData();
              formData.append("file", blob, this.menu.image)
              formData.append("name", this.menu.name)
              formData.append("name_abbreviation", this.menu.name_abbreviation)
              formData.append("price", this.menu.price)
              formData.append("options", JSON.stringify(this.menu.options))
              formData.append("toppings", this.menu.toppings)
              formData.append("group", this.menu.group)
              formData.append("quantity", this.menu.quantity)
              formData.append("resource", JSON.stringify(this.resourceChosen))
              formData.append("can_edit_price", this.menu.can_edit_price)
              formData.append("can_edit_quantity", this.menu.can_edit_quantity)
              formData.append("index", this.menu.index)
              formData.append("description", this.menu.description)
              formData.append("commission_percent", this.menu.commission_percent)
              formData.append("tour_amount", this.menu.tour_amount)
              formData.append("work_time_minute", this.menu.work_time_minute)

              formData.append("type", this.menu.type)
              formData.append("card_amount_limit", this.menu.card_amount_limit)
              formData.append("number_of_use", this.menu.number_of_use)
              formData.append("day_to_expiry", this.menu.day_to_expiry)
              formData.append("sub_service_id", this.menu.sub_service_id)

              this.doSave(formData);
            });
        } else {
          const formData = new FormData();
          formData.append("file", null)
          formData.append("name", this.menu.name)
          formData.append("name_abbreviation", this.menu.name_abbreviation)
          formData.append("price", this.menu.price)
          formData.append("options", JSON.stringify(this.menu.options))
          formData.append("toppings", this.menu.toppings)
          formData.append("group", this.menu.group)
          formData.append("quantity", this.menu.quantity)
          formData.append("resource", JSON.stringify(this.resourceChosen))
          formData.append("can_edit_price", this.menu.can_edit_price)
          formData.append("can_edit_quantity", this.menu.can_edit_quantity)
          formData.append("index", this.menu.index)
          formData.append("description", this.menu.description)
          formData.append("commission_percent", this.menu.commission_percent)
          formData.append("tour_amount", this.menu.tour_amount)
          formData.append("work_time_minute", this.menu.work_time_minute)

          formData.append("type", this.menu.type)
          formData.append("card_amount_limit", this.menu.card_amount_limit)
          formData.append("number_of_use", this.menu.number_of_use)
          formData.append("day_to_expiry", this.menu.day_to_expiry)
          formData.append("sub_service_id", this.menu.sub_service_id)

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
            this.popToast('success', 'Lưu dịch vụ thành công!!! ')
          }else{
            // Show notify edit fail
            this.popToast('danger', 'Lưu dịch vụ thất bại!!! ')
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
     * Show modal choose resource
     */
    showModalResource() {
      this.showChooseResourceModal = true
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
     * Only input integer
     */
     integerAndPointOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerAndPointOnly(valueInput)
      if(result == '') {
          result = 0
      }
          this.menu.commission_percent = result
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
     * Event change group
     */
    changeGroup() {
      if(this.menu.group) {
        // Kiểm tra loại group
        for(let group of this.groupMenuStore) {
          if(group.id == this.menu.group) {
            this.isCard = group.type == 2
            return
          }
        }
      }
      this.isCard = false
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
  }
}
</script>

<style lang="scss">

  .width-33 {
    width: 31%;
    float: left;
  }

</style>
