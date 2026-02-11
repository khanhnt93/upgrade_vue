<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="card-body p-4">

            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/2 px-2">
                <button class="btn btn-outline-secondary pull-left px-4 btn-width-120" @click="back">
                  Quay lại
                </button>
              </div>
              <div class="w-full md:w-1/2 px-2">
                <button class="btn btn-outline-success pull-right px-4 btn-width-120" @click="save" :disabled="saving">
                    Lưu
                </button>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 form-row">
              <div class="w-full px-2">
                <h4 class="mt-2 text-center text-header">Khuyến Mãi</h4>
              </div>
            </div>
            <hr/>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:w-3/4 px-2">
                  <input
                  id="name"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="promo.name"
                  maxlength="100">
                  <div v-if="errorName" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập tên
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap -mx-2 form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Code </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <input
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="promo.code"
                    maxlength="50">
                  </div>
                </div>

              <div class="flex flex-wrap -mx-2 form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Loại </label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <select
                      id="status"
                      class="form-control"
                      v-model="promo.type">
                      <option v-for="option in typeOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
                    </select>
                    <div v-if="errorType" class="text-red-600 text-sm mt-1">
                      Vui lòng nhập loại
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row" v-if="promo.type == 'discount' || promo.type == 'discount_with_max_value'
                || promo.type == 'discount_on_item' || promo.type == 'discount_on_group_item'">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Phần trăm giảm giá (%) </label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <input
                    id="discount_percent"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="promo.discount_percent"
                    maxlength="3"
                    @keyup="integerOnly($event.target)">
                    <div v-if="errorPercentDiscount" class="text-red-600 text-sm mt-1">
                      Vui lòng nhập phần trăm giảm giá
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row" v-if="promo.type == 'discount_with_max_value'">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Giảm giá tối đa </label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <input
                    id="max_discount"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="promo.max_discount"
                    maxlength="20"
                    @keyup="integerOnly($event.target)">
                    <div v-if="errorMaxDiscount" class="text-red-600 text-sm mt-1">
                      Vui lòng nhập giảm giá tối đa
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row" v-if="promo.type == 'discount_with_max_value'">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Trên tổng giá </label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <input
                    id="discount_on_amount"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="promo.discount_on_amount"
                    maxlength="20"
                    @keyup="integerOnly($event.target)">
                    <div v-if="errorDiscountOnAmount" class="text-red-600 text-sm mt-1">
                      Vui lòng nhập trên tổng giá
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row" v-if="promo.type == 'voucher'">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Giá trị voucher </label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <input
                    id="value_of_voucher"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="promo.value_of_voucher"
                    maxlength="20"
                    @keyup="integerOnly($event.target)">
                    <div v-if="errorValueOfVoucher" class="text-red-600 text-sm mt-1">
                      Vui lòng nhập giá trị voucher
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row" v-if="promo.type == 'free_item'">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Item free </label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <select
                      id="item_free"
                      class="form-control"
                      v-model="promo.item_free">
                      <option v-for="option in itemFreeOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
                    </select>
                    <div v-if="errorFreeItem" class="text-red-600 text-sm mt-1">
                      Vui lòng nhập item free
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row" v-if="promo.type == 'discount_on_item'">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Giảm giá trên dv </label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <div>
                      <div class="w-full md:w-1/2 px-2" v-for="item in itemService" :key="item.value">
                        <input :id="item.value" type="checkbox" v-model="promo.on_items" name="discountOnItem" :value="item.value">
                        <label :for="item.value">{{ item.text }}</label>
                      </div>
                    </div>
                    <div v-if="errorDiscountOnItem" class="text-red-600 text-sm mt-1">
                      Vui lòng chọn dv muốn giảm giá
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row" v-if="promo.type == 'discount_on_group_item'">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Giảm giá trên nhóm dv </label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <div>
                      <div class="w-full md:w-1/2 px-2" v-for="item in itemGroupService" :key="item.id">
                        <input :id="item.id" type="checkbox" v-model="promo.on_group_items" name="discountOnGroupItem" :value="item.id">
                        <label :for="item.id">{{ item.name }}</label>
                      </div>
                    </div>
                    <div v-if="errorDiscountOnGroupItem" class="text-red-600 text-sm mt-1">
                      Vui lòng chọn nhóm dv muốn giảm giá
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row" v-show="promo.method == 'trade_point'">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Giá mua(điểm) </label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <input
                    id="price"
                    type="text"
                    maxlength="100"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="promo.cost"
                    @keyup="integerOnly($event.target)">
                    <div v-if="errorCost" class="text-red-600 text-sm mt-1">
                      Vui lòng nhập giá
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row" horizontal>
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Hiệu lực từ </label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
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
                    <div v-if="errorExpiredDateFrom" class="text-red-600 text-sm mt-1">
                      Ngày bắt đầu hiệu lực không đúng
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row" horizontal>
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Hiệu lực đến </label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
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
                    <div v-if="errorExpiredDateTo" class="text-red-600 text-sm mt-1">
                      Ngày hết hiệu lực không đúng
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Số Lượng </label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <input
                    id="number"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    maxlength="100"
                    v-model="promo.quantity"
                    @keyup="integerOnly($event.target)">
                    <div v-if="errorQuantity" class="text-red-600 text-sm mt-1">
                      Vui lòng nhập số lượng
                    </div>
                  </div>
                </div>

                <div v-show="promo.method == 'other'">
                  <div class="w-full px-2">
                    <div class="flex flex-wrap -mx-2 form-row">
                      <div class="w-full md:w-1/4 px-2 mt-2">
                        <label> Khung giờ tự động áp dụng </label>
                      </div>
                      <div class="w-full md:w-3/4 px-2">
                        <input type="radio" id="auto_apply_yes" value="true" v-model="promo.auto_apply">
                        <label for="auto_apply_yes">Có</label>
                        <input type="radio" id="auto_apply_no" value="false" v-model="promo.auto_apply">
                        <label for="auto_apply_no">Không</label>
                      </div>
                    </div>

                    <div class="flex flex-wrap -mx-2 form-row" v-show="promo.auto_apply == true || promo.auto_apply == 'true'">
                      <div class="w-full md:w-1/4 px-2 mt-2">
                        <label> Các ngày trong tuần </label>
                      </div>
                      <div class="w-full md:w-3/4 px-2">
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

                    <div class="flex flex-wrap -mx-2 form-row" v-show="promo.auto_apply == true || promo.auto_apply == 'true'">
                      <div class="w-full md:w-1/4 px-2 mt-2">
                        <label> Khung giờ </label>
                      </div>
                      <div class="w-full md:w-3/4 px-2">
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

                <div class="flex flex-wrap -mx-2 form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Mô tả </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <div class="form-inline">
                      <textarea
                        id="description"
                        class="form-control"
                        style="width:100%;"
                        rows="3"
                        v-model="promo.description"
                      ></textarea>
                    </div>
                  </div>
                </div>


              <div class="flex flex-wrap -mx-2 form-row">
                <div class="w-full md:w-1/4 px-2 mt-2">
                  <label> Hình ảnh </label>
                </div>
                <div class="w-full md:w-3/4 px-2">
                  <div class="flex">
                    <input type="text" v-model="promo.image" class="form-control flex-1" readonly>
                    <button type="button" @click="$refs.file.click()" class="btn btn-secondary">Browse</button>
                  </div>
                  <input class="hidden" type="file" id="file" ref="file" accept="image/*" v-on:change="handleFileUpload"/>
                </div>
              </div>

              <div class="flex flex-wrap -mx-2 form-row">
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


import promotionApi from '@/api/promotion'
import commonFunc from '@/common/commonFunc'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import { useToast } from '@/composables/useToast'
import { useRouter, useRoute } from 'vue-router'


export default {
  components: {
    VueCropper
  },
  setup() {
    const toast = useToast()
    const router = useRouter()
    const route = useRoute()
    return { toast, router, route }
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
        "on_group_items": [],
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
      itemService: [],
      itemGroupService: [],
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

    // this.getPromotionTypeList()
    //
    // this.getListItemFree()
    //
    // this.getListGroupService()

      this.getOptionRelatedPromotion()

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
    errorDiscountOnItem: function () {
      return this.checkDiscountOnItem(this.promo.on_items)
    },
    errorDiscountOnGroupItem: function () {
      return this.checkDiscountOnGroupItem(this.promo.on_group_items)
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
      return (this.click && (this.promo.type == 'discount' || this.promo.type == 'discount_with_max_value' || this.promo.type == 'discount_on_item' || this.promo.type == 'discount_on_group_item') && (info == null || info.length <= 0))
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
    checkDiscountOnItem (info) {
      return (this.click && this.promo.type == 'discount_on_item' && (info == null || info.length <= 0))
    },
    checkDiscountOnGroupItem (info) {
      return (this.click && this.promo.type == 'discount_on_group_item' && (info == null || info.length <= 0))
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
   * Make toast without title
   */
    popToast(variant, content) {
      const mappedVariant = variant === 'danger' ? 'error' : variant
      this.toast(content, mappedVariant)
    },

    /**
     * Make toast with title
     */
    makeToast(variant = null, title="Success!!!", content="Thao tác thành công!!!") {
      const mappedVariant = variant === 'danger' ? 'error' : variant
      this.toast(`${title}: ${content}`, mappedVariant)
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
     * Load list option related promotion
     */
      getOptionRelatedPromotion() {
          let params = {
              "promotion_type": true,
              "item_free": true,
              "group_item_free": true
          }
        promotionApi.getOptionRelatedPromotion(params).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            let data = res.data.data

            this.typeOptions = [{value: null, text: ''}]
            if(data.promotion_type) {
                for(let item of data.promotion_type) {
                    this.typeOptions.push(item)
                }
            }

            this.itemService = data.item_free
            this.itemFreeOptions = data.item_free
            this.itemGroupService = data.group_item_free
          }
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      },

    // /**
    //  * Load list option promotion type
    //  */
    // getPromotionTypeList () {
    //   promotionApi.getListPromotionType().then(res => {
    //     if(res != null && res.data != null && res.data.data != null) {
    //       this.typeOptions = this.typeOptions.concat(res.data.data)
    //     }
    //   }).catch(err => {
    //     // Handle error
    //     let errorMess = commonFunc.handleStaffError(err)
    //     this.popToast('danger', errorMess)
    //   })
    // },
    //
    // /**
    //  * Load list option item free
    //  */
    // getListItemFree () {
    //   promotionApi.getListFreeItem().then(res => {
    //     if(res != null && res.data != null && res.data.data != null) {
    //       this.itemFreeOptions = this.itemFreeOptions.concat(res.data.data)
    //       this.itemService = res.data.data
    //     }
    //   }).catch(err => {
    //     // Handle error
    //     let errorMess = commonFunc.handleStaffError(err)
    //     this.popToast('danger', errorMess)
    //   })
    // },
    //
    // /**
    //  * Load list group service
    //  */
    // getListGroupService () {
    //   promotionApi.getListGroupMenuOption().then(res => {
    //     if(res != null && res.data != null && res.data.data != null) {
    //         this.itemGroupService = []
    //
    //         let groupMenus = res.data.data
    //         for (let index in groupMenus) {
    //           let optionTemp = {
    //             id: groupMenus[index].pk,
    //             name: groupMenus[index].fields.name
    //           }
    //           this.itemGroupService.push(optionTemp)
    //         }
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

        promotionApi.getPromoDetail(promoId).then(res => {
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
            formData.append("on_group_items", dataPost.on_group_items)
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
        formData.append("on_group_items", dataPost.on_group_items)
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
      promotionApi.editPromo(formData).then(res => {
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
            formData.append("on_group_items", dataPost.on_group_items)
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
        formData.append("on_group_items", dataPost.on_group_items)
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
      promotionApi.addPromo(formData).then(res => {
        this.saving = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            this.router.push("/promotion")
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
      this.router.push("/promotion")
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
