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
                <h4 class="mt-1 text-center text-xl font-semibold">KHUYẾN MÃI</h4>
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
                  autocomplete="new-password"
                  :class="['form-control', {'border-red-500': errorName}]"
                  v-model="promo.name"
                  maxlength="100">
                  <div class="text-red-500 text-sm mt-1" v-if="errorName">
                    Vui lòng nhập tên
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 mb-4">
                  <div class="col-span-3 mt-2">
                    <label> Code </label>
                  </div>
                  <div class="col-span-9">
                    <input
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="promo.code"
                    maxlength="50">
                  </div>
                </div>

              <div class="grid grid-cols-12 gap-4 mb-4">
                  <div class="col-span-3 mt-2">
                    <label> Loại </label><span class="error-sybol"></span>
                  </div>
                  <div class="col-span-9">
                    <select
                    id="status"
                    type="text"
                    autocomplete="new-password"
                    :class="['form-control', {'border-red-500': errorType}]"
                    v-model="promo.type">
                      <option v-for="option in typeOptions" :key="option.value" :value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                    <div class="text-red-500 text-sm mt-1" v-if="errorType">
                      Vui lòng nhập loại
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 mb-4" v-if="promo.type == 'discount' || promo.type == 'discount_with_max_value' || promo.type == 'discount_on_item'">
                  <div class="col-span-3 mt-2">
                    <label> Phần trăm giảm giá (%) </label><span class="error-sybol"></span>
                  </div>
                  <div class="col-span-9">
                    <input
                    id="discount_percent"
                    type="text"
                    autocomplete="new-password"
                    :class="['form-control', {'border-red-500': errorPercentDiscount}]"
                    v-model="promo.discount_percent"
                    maxlength="3"
                    @keyup="integerOnly($event.target)">
                    <div class="text-red-500 text-sm mt-1" v-if="errorPercentDiscount">
                      Vui lòng nhập phần trăm giảm giá
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 mb-4" v-if="promo.type == 'discount_with_max_value'">
                  <div class="col-span-3 mt-2">
                    <label> Giảm giá tối đa </label><span class="error-sybol"></span>
                  </div>
                  <div class="col-span-9">
                    <input
                    id="max_discount"
                    type="text"
                    autocomplete="new-password"
                    :class="['form-control', {'border-red-500': errorMaxDiscount}]"
                    v-model="promo.max_discount"
                    maxlength="20"
                    @keyup="integerOnly($event.target)">
                    <div class="text-red-500 text-sm mt-1" v-if="errorMaxDiscount">
                      Vui lòng nhập giảm giá tối đa
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 mb-4" v-if="promo.type == 'discount_with_max_value'">
                  <div class="col-span-3 mt-2">
                    <label> Trên tổng giá </label><span class="error-sybol"></span>
                  </div>
                  <div class="col-span-9">
                    <input
                    id="discount_on_amount"
                    type="text"
                    autocomplete="new-password"
                    :class="['form-control', {'border-red-500': errorDiscountOnAmount}]"
                    v-model="promo.discount_on_amount"
                    maxlength="20"
                    @keyup="integerOnly($event.target)">
                    <div class="text-red-500 text-sm mt-1" v-if="errorDiscountOnAmount">
                      Vui lòng nhập trên tổng giá
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 mb-4" v-if="promo.type == 'voucher'">
                  <div class="col-span-3 mt-2">
                    <label> Giá trị voucher </label><span class="error-sybol"></span>
                  </div>
                  <div class="col-span-9">
                    <input
                    id="value_of_voucher"
                    type="text"
                    autocomplete="new-password"
                    :class="['form-control', {'border-red-500': errorValueOfVoucher}]"
                    v-model="promo.value_of_voucher"
                    maxlength="20"
                    @keyup="integerOnly($event.target)">
                    <div class="text-red-500 text-sm mt-1" v-if="errorValueOfVoucher">
                      Vui lòng nhập giá trị voucher
                    </div>
                  </div>
                </div>

<!--                <b-row class="form-row" v-if="promo.type == 'free_item'">-->
<!--                  <b-col md="3" class="mt-2">-->
<!--                    <label> Miễn phí tiền phòng </label><span class="error-sybol"></span>-->
<!--                  </b-col>-->
<!--                  <b-col md="9">-->
<!--                    <b-form-select-->
<!--                    :options="itemFreeOptions"-->
<!--                    id="item_free"-->
<!--                    type="text"-->
<!--                    autocomplete="new-password"-->
<!--                    class="form-control"-->
<!--                    v-model="promo.item_free">-->
<!--                    </b-form-select>-->
<!--                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorFreeItem">-->
<!--                      Vui lòng nhập item free-->
<!--                    </b-form-invalid-feedback>-->
<!--                  </b-col>-->
<!--                </b-row>-->

<!--                <b-row class="form-row" v-if="promo.type == 'discount_on_item'">-->
<!--                  <b-col md="3" class="mt-2">-->
<!--                    <label> Giảm giá trên tiền phòng </label><span class="error-sybol"></span>-->
<!--                  </b-col>-->
<!--                  <b-col md="9">-->
<!--                    <b-row>-->
<!--                      <b-col md="6" v-for="item in itemFood" :key="item.value">-->
<!--                        <input :id="item.value" type="checkbox" v-model="promo.on_items" name="discountOnItem" :value="item.value">-->
<!--                        <label :for="item.value">{{ item.text }}</label>-->
<!--                      </b-col>-->
<!--                    </b-row>-->
<!--                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorFreeItem">-->
<!--                      Vui lòng món muốn giảm giá-->
<!--                    </b-form-invalid-feedback>-->
<!--                  </b-col>-->
<!--                </b-row>-->

                <div class="grid grid-cols-12 gap-4 mb-4" v-show="promo.method == 'trade_point'">
                  <div class="col-span-3 mt-2">
                    <label> Giá mua(điểm) </label><span class="error-sybol"></span>
                  </div>
                  <div class="col-span-9">
                    <input
                    id="price"
                    type="text"
                    maxlength="100"
                    autocomplete="new-password"
                    :class="['form-control', {'border-red-500': errorCost}]"
                    v-model="promo.cost"
                    @keyup="integerOnly($event.target)">
                    <div class="text-red-500 text-sm mt-1" v-if="errorCost">
                      Vui lòng nhập giá
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 mb-4">
                  <div class="col-span-3 mt-2">
                    <label> Hiệu lực từ </label><span class="error-sybol"></span>
                  </div>
                  <div class="col-span-9">
                    <div class="flex">
                    <input
                    id="expiredDateFrom"
                    type="text"
                    autocomplete="new-password"
                    :class="['form-control', {'border-red-500': errorExpiredDateFrom}]"
                    v-model="promo.expired_date_from"
                    maxlength="10"
                    @keyup="inputDateOnly($event.target)">
                    </div>
                    <div class="text-red-500 text-sm mt-1" v-if="errorExpiredDateFrom">
                      Ngày bắt đầu hiệu lực không đúng
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 mb-4">
                  <div class="col-span-3 mt-2">
                    <label> Hiệu lực đến </label><span class="error-sybol"></span>
                  </div>
                  <div class="col-span-9">
                    <div class="flex">
                    <input
                    id="expiredDateTo"
                    type="text"
                    autocomplete="new-password"
                    :class="['form-control', {'border-red-500': errorExpiredDateTo}]"
                    v-model="promo.expired_date_to"
                    maxlength="10"
                    @keyup="inputDateOnly($event.target)">
                    </div>
                    <div class="text-red-500 text-sm mt-1" v-if="errorExpiredDateTo">
                      Ngày hết hiệu lực không đúng
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 mb-4">
                  <div class="col-span-3 mt-2">
                    <label> Số Lượng </label><span class="error-sybol"></span>
                  </div>
                  <div class="col-span-9">
                    <input
                    id="number"
                    type="text"
                    autocomplete="new-password"
                    :class="['form-control', {'border-red-500': errorQuantity}]"
                    maxlength="100"
                    v-model="promo.quantity"
                    @keyup="integerOnly($event.target)">
                    <div class="text-red-500 text-sm mt-1" v-if="errorQuantity">
                      Vui lòng nhập số lượng
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1" v-show="promo.method == 'other'">
                  <div>
                    <div class="grid grid-cols-12 gap-4 mb-4">
                      <div class="col-span-3 mt-2">
                        <label> Khung giờ tự động áp dụng </label>
                      </div>
                      <div class="col-span-9">
                        <input type="radio" id="auto_apply_yes" value="true" v-model="promo.auto_apply">
                        <label for="auto_apply_yes">Có</label>
                        <input type="radio" id="auto_apply_no" value="false" v-model="promo.auto_apply">
                        <label for="auto_apply_no">Không</label>
                      </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4 mb-4" v-show="promo.auto_apply == true || promo.auto_apply == 'true'">
                      <div class="col-span-3 mt-2">
                        <label> Các ngày trong tuần </label>
                      </div>
                      <div class="col-span-9">
                        <input type="checkbox" id="t2" value="1" v-model="promo.day_of_week">
                        <label for="t2">Thứ 2</label>
                        <input type="checkbox" id="t3" value="2" v-model="promo.day_of_week">
                        <label for="t3">Thứ 3</label>
                        <input type="checkbox" id="t4" value="3" v-model="promo.day_of_week">
                        <label for="t4">Thứ 4</label>
                        <input type="checkbox" id="t5" value="4" v-model="promo.day_of_week">
                        <label for="t5">Thứ 5</label>
                        <input type="checkbox" id="t6" value="5" v-model="promo.day_of_week">
                        <label for="t6">Thứ 6</label>
                        <input type="checkbox" id="t7" value="6" v-model="promo.day_of_week">
                        <label for="t7">Thứ 7</label>
                        <input type="checkbox" id="cn" value="7" v-model="promo.day_of_week">
                        <label for="cn">Chủ nhật</label>
                      </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4 mb-4" v-show="promo.auto_apply == true || promo.auto_apply == 'true'">
                      <div class="col-span-3 mt-2">
                        <label> Khung giờ </label>
                      </div>
                      <div class="col-span-9">
                        <div class="form-inline">
                          <input
                            id="start_time"
                            v-model="promo.start_time"
                            type="text"
                            autocomplete="new-password"
                            class="form-control input-width-100"
                            @keyup="integerTimeOnly($event.target)"
                            maxlength="5"
                            > :
                          <input
                            id="end_time"
                            v-model="promo.end_time"
                            type="text"
                            autocomplete="new-password"
                            class="form-control input-width-100"
                            @keyup="integerTimeOnly($event.target)"
                            maxlength="5"
                            >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 mb-4">
                  <div class="col-span-3 mt-2">
                    <label> Mô tả </label>
                  </div>
                  <div class="col-span-9">
                    <div class="form-inline">
                      <textarea
                        id="description"
                        style="width:100%;"
                        rows="3"
                        class="form-control"
                        v-model="promo.description"
                      ></textarea>
                    </div>
                  </div>
                </div>


              <div class="grid grid-cols-12 gap-4 mb-4">
                <div class="col-span-3 mt-2">
                  <label> Hình ảnh </label>
                </div>
                <div class="col-span-9">
                  <div @click="$refs.file.click()" class="flex cursor-pointer">
                    <input v-model="promo.image" class="form-control flex-1">
                    <button type="button" class="px-4 py-2 bg-gray-200 border border-gray-300 rounded-r hover:bg-gray-300">Browse</button>
                  </div>
                  <input class="hidden" type="file" id="file" ref="file" accept="image/*" v-on:change="handleFileUpload"/>
                </div>
              </div>

              <div class="grid grid-cols-1 mb-4">
                <div v-if="promo.image_preview" class="preview-box text-center"  :style="{height: computedWidth, width: '100%'}">
                    <vue-cropper
                      ref="cropper"
                      :guides="true"
                      :view-mode="2"
                      :center="true"
                      drag-mode="crop"
                      :auto-crop-area="1"
                      :background="true"
                      :rotatable="true"
                      :src="promo.image_preview"
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
  </div>
</template>
<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'


export default {
  components: {
    VueCropper
  },
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
      promo: {
        "id": null,
        "code": null,
        "method": "other",
        "name": null,
        "type": null,
        "discount_percent": null,
        "max_discount": null,
        "discount_on_amount": null,
        "value_of_voucher": null,
        "item_free": null,
        "on_items": [],
        "cost": null,
        "expired_date_from": null,
        "expired_date_to": null,
        "quantity": null,
        "auto_apply": false,
        "day_of_week": [],
        "start_time": "00:00",
        "end_time": "23:59",
        "description": null,
        "image": null,
        image_preview: null
      },
      typeOptions: [{value: null, text: ''}],
      // itemFreeOptions: [{value: null, text: ''}],
      // itemFood: [],
      file: null,
      height: '100px',
      styleImg: {},
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    this.getDefaultDate()

    this.getPromotionTypeList()

    // this.getListItemFree()

    this.getPromoDetail()
  },
  computed: {
    computedWidth() {
      return this.height
    },
    computedImg() {
      return this.styleImg
    },
    errorMethod: function () {
      return this.checkInfo(this.promo.method)
    },
    errorName: function () {
      return this.checkInfo(this.promo.name)
    },
    errorType: function () {
      return this.checkInfo(this.promo.type)
    },
    errorPercentDiscount: function () {
      return this.checkPercentDiscount(this.promo.discount_percent)
    },
    errorMaxDiscount: function () {
      return this.checkDiscountWithMaxValue(this.promo.max_discount)
    },
    errorDiscountOnAmount: function () {
      return this.checkDiscountWithMaxValue(this.promo.discount_on_amount)
    },
    errorValueOfVoucher: function () {
      return this.checkValueOfVoucher(this.promo.value_of_voucher)
    },
    errorFreeItem: function () {
      return this.checkFreeItem(this.promo.item_free)
    },
    errorCost: function () {
      return this.checkCost(this.promo.cost)
    },
    errorExpiredDateFrom: function () {
      return this.checkDate(this.promo.expired_date_from)
    },
    errorExpiredDateTo: function () {
      return this.checkDate(this.promo.expired_date_to)
    },
    errorQuantity: function () {
      return this.checkInfo(this.promo.quantity)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkPercentDiscount (info) {
      return (this.click && (this.promo.type == 'discount' || this.promo.type == 'discount_with_max_value' || this.promo.type == 'discount_on_item') && (info == null || info.length <= 0))
    },
    checkDiscountWithMaxValue (info) {
      return (this.click && this.promo.type == 'discount_with_max_value' && (info == null || info.length <= 0))
    },
    checkValueOfVoucher (info) {
      return (this.click && this.promo.type == 'voucher' && (info == null || info.length <= 0))
    },
    checkFreeItem (info) {
      return (this.click && this.promo.type == 'free_item' && (info == null || info.length <= 0))
    },
    checkCost (info) {
      return (this.click && this.promo.method == 'trade_point' && (info == null || info.length <= 0))
    },
    checkDate (dateInput) {
      return (this.click && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
    },
    checkValidate () {
      return !(this.errorMethod || this.errorName || this.errorType || this.errorCost || this.errorExpiredDateFrom
        || this.errorExpiredDateTo || this.errorQuantity || this.errorPercentDiscount || this.errorMaxDiscount
        || this.errorDiscountOnAmount || this.errorValueOfVoucher)
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
     * Get default date
     */
    getDefaultDate() {
      // Get default date
      let dateNow = new Date()
      this.promo.expired_date_from = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
      let todate = new Date(dateNow.setMonth(dateNow.getMonth() + 1))
      this.promo.expired_date_to = commonFunc.formatDate(todate.toJSON().slice(0,10))
    },

    /**
     * Load list option promotion type
     */
    getPromotionTypeList () {
      adminAPI.getListPromotionType().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.typeOptions = this.typeOptions.concat(res.data.data)
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    // /**
    //  * Load list option item free
    //  */
    // getListItemFree () {
    //   adminAPI.getListFreeItem().then(res => {
    //     if(res != null && res.data != null && res.data.data != null) {
    //       this.itemFreeOptions = this.itemFreeOptions.concat(res.data.data)
    //       // this.itemFood = res.data.data
    //     }
    //   }).catch(err => {
    //     // Handle error
    //     let errorMess = commonFunc.handleStaffError(err)
    //     this.popToast('danger', errorMess)
    //   })
    // },

   /**
     * Get detail
     */
    getPromoDetail() {
      let promoId = this.route.params.id
      if(promoId){
        this.loading = true

        adminAPI.getPromoDetail(promoId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.promo = res.data.data

            if(this.promo.day_of_week) {
              // Convert string to array
              let itemString = JSON.parse(JSON.stringify(this.promo.day_of_week))
              itemString = itemString.replace("[", "").replace("]", "").replaceAll(" ", "").replaceAll("'", "").replaceAll("\"", "")
              let items = itemString.split(",")
              this.promo.day_of_week = items
            } else {
              this.promo.day_of_week = []
            }
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
     * Handle upload file
     */
    handleFileUpload () { // event
      this.promo.image_preview = null
      this.file = this.$refs.file.files[0]//event.target.files[0]
      this.promo.image = this.file.name

      // Render image in review
      let reader  = new FileReader ()
      reader.addEventListener("load", function () {
        // this.$refs.cropper.image = reader.result
        this.promo.image_preview = reader.result
      }.bind(this), false)
      if( this.file ){
        reader.readAsDataURL( this.file )
        this.height = '300px'
        this.styleImg = {'max-width': '100%', 'max-height': '100%'}
      }
    },

    /**
     * Check valid from date and to date
     */
    checkFromDateAndToDate() {
      if(this.promo.expired_date_from && this.promo.expired_date_to) {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.promo.expired_date_from))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.promo.expired_date_to))

        if(fromDate > toDate) {
          this.toast.error("Ngày bắt đầu hiệu lực không thể lớn hớn ngày hết hiệu lực")
          return false
        }
      }

      return true
    },

    /**
     * Edit promotion
     */
    editPromotion(dataPost) {
      if(dataPost.image_preview) {
        this.$refs.cropper
          .getCroppedCanvas({
            width: 300,
            height: 300
          })
          .toBlob(blob => {
            const formData = new FormData();
            formData.append("id", dataPost.id)
            formData.append("code", dataPost.code)
            formData.append("method", dataPost.method)
            formData.append("name", dataPost.name)
            formData.append("type", dataPost.type)
            formData.append("discount_percent", dataPost.discount_percent)
            formData.append("max_discount", dataPost.max_discount)
            formData.append("discount_on_amount", dataPost.discount_on_amount)
            formData.append("value_of_voucher", dataPost.value_of_voucher)
            formData.append("item_free", dataPost.item_free)
            formData.append("on_items", dataPost.on_items)
            formData.append("cost", dataPost.cost)
            formData.append("expired_date_from", dataPost.expired_date_from)
            formData.append("expired_date_to", dataPost.expired_date_to)
            formData.append("quantity", dataPost.quantity)
            formData.append("auto_apply", dataPost.auto_apply)
            formData.append("start_time", dataPost.start_time)
            formData.append("end_time", dataPost.end_time)
            formData.append("day_of_week", dataPost.day_of_week)
            formData.append("description", dataPost.description)
            formData.append("image", blob, dataPost.image)

            this.doEdit(formData)
          });
      } else {
        const formData = new FormData();
        formData.append("id", dataPost.id)
        formData.append("code", dataPost.code)
        formData.append("method", dataPost.method)
        formData.append("name", dataPost.name)
        formData.append("type", dataPost.type)
        formData.append("discount_percent", dataPost.discount_percent)
        formData.append("max_discount", dataPost.max_discount)
        formData.append("discount_on_amount", dataPost.discount_on_amount)
        formData.append("value_of_voucher", dataPost.value_of_voucher)
        formData.append("item_free", dataPost.item_free)
        formData.append("on_items", dataPost.on_items)
        formData.append("cost", dataPost.cost)
        formData.append("expired_date_from", dataPost.expired_date_from)
        formData.append("expired_date_to", dataPost.expired_date_to)
        formData.append("quantity", dataPost.quantity)
        formData.append("auto_apply", dataPost.auto_apply)
        formData.append("start_time", dataPost.start_time)
        formData.append("end_time", dataPost.end_time)
        formData.append("day_of_week", dataPost.day_of_week)
        formData.append("description", dataPost.description)
        formData.append("image", null)

        this.doEdit(formData)
      }
    },

    /**
     * Do edit
     */
    doEdit(formData) {
      adminAPI.editPromo(formData).then(res => {
        this.saving = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            // show popup success
            this.toast.success('Cập nhật khuyến mãi thành công!!! ')
          }
        }
      }).catch(err => {
        this.saving = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Add promotion
     */
    addPromotion(dataPost) {
      if(dataPost.image_preview) {
        this.$refs.cropper
          .getCroppedCanvas({
            width: 300,
            height: 300
          })
          .toBlob(blob => {
            const formData = new FormData();
            formData.append("id", dataPost.id)
            formData.append("code", dataPost.code)
            formData.append("method", dataPost.method)
            formData.append("name", dataPost.name)
            formData.append("type", dataPost.type)
            formData.append("discount_percent", dataPost.discount_percent)
            formData.append("max_discount", dataPost.max_discount)
            formData.append("discount_on_amount", dataPost.discount_on_amount)
            formData.append("value_of_voucher", dataPost.value_of_voucher)
            formData.append("item_free", dataPost.item_free)
            formData.append("on_items", dataPost.on_items)
            formData.append("cost", dataPost.cost)
            formData.append("expired_date_from", dataPost.expired_date_from)
            formData.append("expired_date_to", dataPost.expired_date_to)
            formData.append("quantity", dataPost.quantity)
            formData.append("auto_apply", dataPost.auto_apply)
            formData.append("start_time", dataPost.start_time)
            formData.append("end_time", dataPost.end_time)
            formData.append("day_of_week", dataPost.day_of_week)
            formData.append("description", dataPost.description)
            formData.append("image", blob, dataPost.image)

            this.doAddPmt(formData)
          });
      } else {
        const formData = new FormData();
        formData.append("id", dataPost.id)
        formData.append("code", dataPost.code)
        formData.append("method", dataPost.method)
        formData.append("name", dataPost.name)
        formData.append("type", dataPost.type)
        formData.append("discount_percent", dataPost.discount_percent)
        formData.append("max_discount", dataPost.max_discount)
        formData.append("discount_on_amount", dataPost.discount_on_amount)
        formData.append("value_of_voucher", dataPost.value_of_voucher)
        formData.append("item_free", dataPost.item_free)
        formData.append("on_items", dataPost.on_items)
        formData.append("cost", dataPost.cost)
        formData.append("expired_date_from", dataPost.expired_date_from)
        formData.append("expired_date_to", dataPost.expired_date_to)
        formData.append("quantity", dataPost.quantity)
        formData.append("auto_apply", dataPost.auto_apply)
        formData.append("start_time", dataPost.start_time)
        formData.append("end_time", dataPost.end_time)
        formData.append("day_of_week", dataPost.day_of_week)
        formData.append("description", dataPost.description)
        formData.append("image", null)

        this.doAddPmt(formData)
      }
    },

    /**
     * Do add
     */
    doAddPmt(formData) {
      adminAPI.addPromo(formData).then(res => {
        this.saving = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            this.router.push("/promo/list")
          }
        }
      }).catch(err => {
        this.saving = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
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
      if(!this.checkFromDateAndToDate()) {
        this.saving = false
        return
      }
      let dataPost = JSON.parse(JSON.stringify(this.promo))

      // Reformat date
      dataPost.expired_date_from = commonFunc.convertDDMMYYYYToYYYYMMDD(this.promo.expired_date_from)
      dataPost.expired_date_to = commonFunc.convertDDMMYYYYToYYYYMMDD(this.promo.expired_date_to)

      let promoId = this.route.params.id
      if(promoId){
        // Edit
        dataPost.id = promoId
        this.editPromotion(dataPost)
      } else { // Add
        this.addPromotion(dataPost)
      }
    },

    /**
     * Event crop image
     */
    cropImage() {
      // Use to check reupload image when edit
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
     * Only input date
     */
     inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },

    /**
     * Only input integer and :
     */
     integerTimeOnly(item) {
      let valueInput = item.value
      if (valueInput != '') {
        valueInput = valueInput.replace(/[^0-9:]+/g,'');
      }
      item.value = valueInput
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.router.push("/promo/list")
    },

    /**
     * Event change method to other
     */
    setMethodIsOther() {
      this.promo.cost = null
    },

    /**
     * Event change method to trade point
     */
    setMethodIsTradePoint() {
      this.promo.auto_apply = false
      this.promo.start_time = "00:00"
      this.promo.end_time = "23:59"
      this.promo.day_of_week = []
    }


  }
}
</script>
