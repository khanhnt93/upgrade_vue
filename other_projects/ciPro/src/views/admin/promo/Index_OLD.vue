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
                <h4 class="mt-2 text-center text-header">Khuyến Mãi</h4>
              </b-col>
            </b-row>
            <hr/>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <!--<b-row class="form-row">-->
                <!--<b-col md="3" class="mt-2">-->
                  <!--<label> Hình thức phát hành </label><span class="error-sybol"></span>-->
                <!--</b-col>-->
                <!--<b-col md="9">-->
                  <!--<input type="radio" id="trade_point" value="trade_point" v-model="promo.method" @click="setMethodIsTradePoint">-->
                  <!--<label for="trade_point">Đổi điểm</label>-->
                  <!--<input type="radio" id="other" value="other" v-model="promo.method" @click="setMethodIsOther">-->
                  <!--<label for="other">Khác</label>-->
                  <!--<b-form-invalid-feedback  class="invalid-feedback" :state="!errorMethod">-->
                    <!--Vui lòng chọn hình thức phát hành-->
                  <!--</b-form-invalid-feedback>-->
                <!--</b-col>-->
              <!--</b-row>-->

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Tên<span class="error-sybol"></span></label>
                </b-col>
                <b-col md="9">
                  <input
                  id="name"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="promo.name"
                  maxlength="100">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorName">
                    Vui lòng nhập tên
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label> Code </label>
                  </b-col>
                  <b-col md="9">
                    <input
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="promo.code"
                    maxlength="50">
                  </b-col>
                </b-row>

              <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label> Loại<span class="error-sybol"></span></label>
                  </b-col>
                  <b-col md="9">
                    <b-form-select
                    :options="typeOptions"
                    id="status"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="promo.type"></b-form-select>
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorType">
                      Vui lòng nhập loại
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>

                <b-row class="form-row" v-if="promo.type == 'discount' || promo.type == 'discount_with_max_value' || promo.type == 'discount_on_item'">
                  <b-col md="3" class="mt-2">
                    <label> Phần trăm giảm giá (%)<span class="error-sybol"></span></label>
                  </b-col>
                  <b-col md="9">
                    <input
                    id="discount_percent"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="promo.discount_percent"
                    maxlength="3"
                    @keyup="integerOnly($event.target)">
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorPercentDiscount">
                      Vui lòng nhập phần trăm giảm giá
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>

                <b-row class="form-row" v-if="promo.type == 'discount_with_max_value'">
                  <b-col md="3" class="mt-2">
                    <label> Giảm giá tối đa<span class="error-sybol"></span></label>
                  </b-col>
                  <b-col md="9">
                    <input
                    id="max_discount"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="promo.max_discount"
                    maxlength="20"
                    @keyup="integerOnly($event.target)">
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorMaxDiscount">
                      Vui lòng nhập giảm giá tối đa
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>

                <b-row class="form-row" v-if="promo.type == 'discount_with_max_value'">
                  <b-col md="3" class="mt-2">
                    <label> Trên tổng giá<span class="error-sybol"></span></label>
                  </b-col>
                  <b-col md="9">
                    <input
                    id="discount_on_amount"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="promo.discount_on_amount"
                    maxlength="20"
                    @keyup="integerOnly($event.target)">
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorDiscountOnAmount">
                      Vui lòng nhập trên tổng giá
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>

                <b-row class="form-row" v-if="promo.type == 'voucher'">
                  <b-col md="3" class="mt-2">
                    <label> Giá trị voucher<span class="error-sybol"></span></label>
                  </b-col>
                  <b-col md="9">
                    <input
                    id="value_of_voucher"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="promo.value_of_voucher"
                    maxlength="20"
                    @keyup="integerOnly($event.target)">
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorValueOfVoucher">
                      Vui lòng nhập giá trị voucher
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>

                <b-row class="form-row" v-if="promo.type == 'free_item'">
                  <b-col md="3" class="mt-2">
                    <label> Item free<span class="error-sybol"></span></label>
                  </b-col>
                  <b-col md="9">
                    <b-form-select
                    :options="itemFreeOptions"
                    id="item_free"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="promo.item_free">
                    </b-form-select>
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorFreeItem">
                      Vui lòng nhập item free
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>

                <b-row class="form-row" v-if="promo.type == 'discount_on_item'">
                  <b-col md="3" class="mt-2">
                    <label> Giảm giá trên món<span class="error-sybol"></span></label>
                  </b-col>
                  <b-col md="9">
                    <b-row>
                      <b-col md="6" v-for="item in itemFood" :key="item.value">
                        <input :id="item.value" type="checkbox" v-model="promo.on_items" name="discountOnItem" :value="item.value">
                        <label :for="item.value">{{ item.text }}</label>
                      </b-col>
                    </b-row>
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorFreeItem">
                      Vui lòng món muốn giảm giá
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>

                <b-row class="form-row" v-show="promo.method == 'trade_point'">
                  <b-col md="3" class="mt-2">
                    <label> Giá mua(điểm)<span class="error-sybol"></span></label>
                  </b-col>
                  <b-col md="9">
                    <input
                    id="price"
                    type="text"
                    maxlength="100"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="promo.cost"
                    @keyup="integerOnly($event.target)">
                    <b-form-invalid-feedback class="invalid-feedback" :state="!errorCost">
                      Vui lòng nhập giá
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>

                <b-row class="form-row" horizontal>
                  <b-col md="3" class="mt-2">
                    <label> Hiệu lực từ<span class="error-sybol"></span></label>
                  </b-col>
                  <b-col md="9">
                    <div class="input-group">
                    <input
                    id="expiredDateFrom"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="promo.expired_date_from"
                    maxlength="10"
                    @keyup="inputDateOnly($event.target)">
                    </div>
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorExpiredDateFrom">
                      Ngày bắt đầu hiệu lực không đúng
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>

                <b-row class="form-row" horizontal>
                  <b-col md="3" class="mt-2">
                    <label> Hiệu lực đến<span class="error-sybol"></span></label>
                  </b-col>
                  <b-col md="9">
                    <div class="input-group">
                    <input
                    id="expiredDateTo"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="promo.expired_date_to"
                    maxlength="10"
                    @keyup="inputDateOnly($event.target)">
                    </div>
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorExpiredDateTo">
                      Ngày hết hiệu lực không đúng
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label> Số Lượng<span class="error-sybol"></span></label>
                  </b-col>
                  <b-col md="9">
                    <input
                    id="number"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    maxlength="100"
                    v-model="promo.quantity"
                    @keyup="integerOnly($event.target)">
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorQuantity">
                      Vui lòng nhập số lượng
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>

                <b-row v-show="promo.method == 'other'">
                  <b-col>
                    <b-row class="form-row">
                      <b-col md="3" class="mt-2">
                        <label> Khung giờ tự động áp dụng </label>
                      </b-col>
                      <b-col md="9">
                        <input type="radio" id="auto_apply_yes" value="true" v-model="promo.auto_apply">
                        <label for="auto_apply_yes">Có</label>
                        <input type="radio" id="auto_apply_no" value="false" v-model="promo.auto_apply">
                        <label for="auto_apply_no">Không</label>
                      </b-col>
                    </b-row>

                    <b-row class="form-row" v-show="promo.auto_apply == true || promo.auto_apply == 'true'">
                      <b-col md="3" class="mt-2">
                        <label> Các ngày trong tuần </label>
                      </b-col>
                      <b-col md="9">
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
                      </b-col>
                    </b-row>

                    <b-row class="form-row" v-show="promo.auto_apply == true || promo.auto_apply == 'true'">
                      <b-col md="3" class="mt-2">
                        <label> Khung giờ </label>
                      </b-col>
                      <b-col md="9">
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
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label> Mô tả </label>
                  </b-col>
                  <b-col md="9">
                    <div class="form-inline">
                      <b-form-textarea
                        id="description"
                        style="width:100%;"
                        rows="3"
                        v-model="promo.description"
                      ></b-form-textarea>
                    </div>
                  </b-col>
                </b-row>


              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Hình ảnh </label>
                </b-col>
                <b-col md="9">
                  <b-input-group @click="$refs.file.click()" append="Browse" class="pointer">
                    <b-input v-model="promo.image"></b-input>
                  </b-input-group>
                  <input class="d-none" type="file" id="file" ref="file" accept="image/*" v-on:change="handleFileUpload"/>
                </b-col>
              </b-row>

              <b-row class="form-row">
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
              </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import promotionAPI from '@/api/promotion'
import commonFunc from '@/common/commonFunc'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import { useToast } from '@/composables/useToast'

export default {
  setup() {
    const { popToast } = useToast()
    const toast = useToast()
    return { popToast, toast }
  },
  components: {
    VueCropper
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
      itemFreeOptions: [{value: null, text: ''}],
      itemFood: [],
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

    this.getListItemFree()

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
        || this.errorDiscountOnAmount || this.errorValueOfVoucher || this.errorFreeItem)
    },

   /**
     * Make toast with title
     */
    makeToast(variant = null, title="Success!!!", content="Thao tác thành công!!!") {
      this.toast.toast(content, {
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
      promotionAPI.getListPromotionType().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.typeOptions = this.typeOptions.concat(res.data.data)
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Load list option item free
     */
    getListItemFree () {
      promotionAPI.getListFreeItem().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.itemFreeOptions = this.itemFreeOptions.concat(res.data.data)
          this.itemFood = res.data.data
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
    getPromoDetail() {
      let promoId = this.$route.params.id
      if(promoId){
        this.loading = true

        promotionAPI.getPromoDetail(promoId).then(res => {
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
          this.popToast('danger', errorMess)
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
      let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.promo.expired_date_from))
      let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.promo.expired_date_to))

      if(fromDate > toDate) {
        this.popToast('danger', "Ngày bắt đầu hiệu lực không thể lớn hớn ngày hết hiệu lực")
        return false
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
      promotionAPI.editPromo(formData).then(res => {
        this.saving = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            // show popup success
            this.popToast('success', 'Cập nhật khuyến mãi thành công!!! ')
          }
        }
      }).catch(err => {
        this.saving = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.makeToast('danger', "Cập nhật thất bại!!!", errorMess)
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
      promotionAPI.addPromo(formData).then(res => {
        this.saving = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            this.$router.push("/promo/list")
          }
        }
      }).catch(err => {
        this.saving = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.makeToast('danger', "Thêm mới thất bại!!!", errorMess)
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

      let promoId = this.$route.params.id
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
      this.$router.push("/promo/list")
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
