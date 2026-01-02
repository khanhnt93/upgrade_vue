<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">
            <b-row>
              <b-col cols="6">
                <b-button variant="outline-secondary" class="pull-left btn-width-120"
                  @click="back"
                >
                  Quay lại
                </b-button>
              </b-col>
              <b-col cols="6">
                <b-button variant="outline-success" class="pull-right btn-width-120"
                  @click="save"
                  :disabled="saving"
                >
                  Lưu
                </b-button>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="12">
                <h4 class="mt-1 text-center text-header">KHÁCH LẺ</h4>
              </b-col>
            </b-row>
            <hr />

            <!-- Loading -->
            <span class="loading-more" v-show="loading"
              ><icon name="loading" width="60"
            /></span>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Đoàn </label>
              </b-col>
              <b-col md="9">
                <b-form-select
                id="input-3"
                v-model="inputs.customer_group_id"
                :options="customerGroups"
              ></b-form-select>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Tên khách hàng </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <input
                  id="name"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.customer_name"
                  maxlength="255"
                />
                <b-form-invalid-feedback
                  class="invalid-feedback"
                  :state="!errorName"
                >
                  Vui lòng nhập tên khách hàng
                </b-form-invalid-feedback>
              </b-col>
            </b-row>
            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Số điện thoại </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <input
                  id="phone"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.phone_number"
                  maxlength="255"
                />
                <b-form-invalid-feedback
                  class="invalid-feedback"
                  :state="!errorPhoneNumber"
                >
                  Vui lòng nhập Số điện thoại
                </b-form-invalid-feedback>
              </b-col>
            </b-row>
            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Số CMND/CCCD </label>
              </b-col>
              <b-col md="9">
                <input
                  id="cmnd"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.identity_card_number"
                  maxlength="255"
                />

              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import customerManagerApi from "@/api/customerManager";
import commonFunc from "@/common/commonFunc";

export default {
  data() {
    return {
      inputs: {
        id: null,
        customer_group_id: null,
        customer_name: '',
        phone_number: '',
        identity_card_number: '',
      },
      click: false,
      saving: false,
      loading: false,
      customerGroups: []
    };
  },
  mounted() {
    this.getCustomerDetail();
    customerManagerApi
        .getListCustomerGroup({}).then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            this.customerGroups = res.data.data.map(item => ({text: item.name, value: item.id}));
            this.customerGroups.unshift({text: '', value: null})
            console.log(this.customerGroups)
          } else {
            this.customerGroups = [];
          }
          this.onSearch = false;
          this.loading = false;
        })
        .catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err);
          this.popToast("danger", errorMess);

          this.onSearch = false;
          this.loading = false;
        });
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.inputs.customer_name) ;
    },
    errorPhoneNumber: function () {
      return this.checkInfo(this.inputs.phone_number);
    },
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    getCustomerDetail() {
      let id = this.$route.params.id;
      if (id) {
        this.loading = true;

        customerManagerApi
          .getCustomerDetail(id)
          .then(res => {
            if (res != null && res.data != null && res.data.data != null) {
              this.inputs = res.data.data;
            }

            this.loading = false;
          })
          .catch(err => {
            this.loading = false;

            // Handle error
            let errorMess = commonFunc.handleStaffError(err);
            this.popToast("danger", errorMess);
          });
      }
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
      validate() {
        return !(this.errorName || this.errorPhoneNumber)
      },
      /**
       * Save promotion
       */
      save () {
        this.click = true
        this.saving = true
        // Check validate
        if(!this.validate()) {
          this.saving = false
          return
        }

        let id = this.$route.params.id
        if(id){
          this.inputs.id = id
          customerManagerApi.editCustomer(this.inputs).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
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
        }  else {
            this.makeToast('danger', "ID khách hàng không đúng", message)
        }
      },

      /**
       * Back to list
       */
      back() {
        // Go to list
        this.$router.push('/customer-history')
      },
  }
};
</script>

<style lang="scss" scoped></style>
