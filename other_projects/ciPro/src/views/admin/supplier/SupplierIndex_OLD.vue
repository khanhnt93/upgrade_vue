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
                  <h4 class="mt-2 text-center text-header">{{prefix_title}} Nhà Cung Cấp</h4>
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
                  v-model="supplier.name">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorName">
                    Vui lòng nhập tên
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Số điện thoại </label>
              </b-col>
              <b-col md="9">
                <input
                  id="phone_number"
                  type="text"
                  maxlength="30"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="supplier.phone_number">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Địa chỉ </label>
              </b-col>
              <b-col md="9">
                <input
                  id="address"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="supplier.address">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Mã số thuế </label>
              </b-col>
              <b-col md="9">
                <input
                  id="tax_code"
                  type="text"
                  maxlength="20"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="supplier.tax_code">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>
                  <span>Tên người liên hệ</span>
                </label>
              </b-col>
              <b-col md="9">
                <input
                  id="contact_person"
                  type="text"
                  maxlength="100"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="supplier.contact_person_name">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>
                  <span>Sđt người liên hệ</span>
                </label>
              </b-col>
              <b-col md="9">
                <input
                  id="contact_person_phone"
                  type="text"
                  maxlength="14"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="supplier.contact_person_phone"
                  @keyup="integerOnly($event.target)">
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import supplierAPI from '@/api/supplier'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

export default {
  setup() {
    const { popToast } = useToast()
    return { popToast }
  },
  data () {
    return {
      prefix_title: "Thêm Mới",
      supplier: {
        "name": null,
        "phone_number": null,
        "address": null,
        "tax_code": null,
        "contact_person_name": null,
        "contact_person_phone": null,
      },
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    // Check prefix
    if(this.$route.params.id) {
      this.prefix_title = "Cập Nhật"
    } else {
      this.prefix_title = "Thêm Mới"
    }

    this.getSupplierDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.supplier.name)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorName)
    },

    /**
     * Get detail
     */
    getSupplierDetail() {
      let supplierId = this.$route.params.id
      if(supplierId){
        this.loading = true

        supplierAPI.getSupplierDetail(supplierId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.supplier = res.data.data
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
      this.$router.push('/supplier')
    },

    /**
     * Save
     */
    save () {
      this.click = true
      this.saving = true
      let result = this.checkValidate()
      if(result) {
        let supplierId = this.$route.params.id
        if(supplierId){
          // Edit
          let supplier = this.supplier
          supplier.id = supplierId
          supplierAPI.editSupplier(supplier).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                // show popup success
                this.popToast('success', 'Cập nhật đơn vị thành công!!! ')
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
          supplierAPI.addSupplier(this.supplier).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.$router.push("/supplier")
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
     * Only input integer
     */
    integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },
  }
}
</script>
