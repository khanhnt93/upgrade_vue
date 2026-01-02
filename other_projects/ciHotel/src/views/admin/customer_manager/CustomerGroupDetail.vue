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
                <h4 class="mt-1 text-center text-header">KHÁCH ĐOÀN</h4>
              </b-col>
            </b-row>
            <hr />

            <!-- Loading -->
            <span class="loading-more" v-show="loading"
              ><icon name="loading" width="60"
            /></span>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Tên khách đoàn </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <input
                  id="name"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.name"
                  maxlength="255"
                />
                <b-form-invalid-feedback
                  class="invalid-feedback"
                  :state="!errorName"
                >
                  Vui lòng nhập tên
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Số điện thoại liên hệ </label><span class="error-sybol"></span>
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
                  :state="!errorPhone"
                >
                  Vui lòng nhập số điện thoại liên hệ
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Mô tả </label>
              </b-col>
              <b-col md="9">
                <b-form-textarea
                    id="description"
                    style="width:100%;"
                    rows="3"
                    v-model="inputs.note"
                  ></b-form-textarea>
              </b-col>
            </b-row>

            <b-row class="form-row" v-show="this.$route.params.id">
              <b-col md="3" class="mt-2">
                <label> Trạng thái </label>
              </b-col>
              <b-col md="9">
                <p>{{formatState(this.inputs.state)}}</p>
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
        name: null,
        phone_number: null,
        note: null,
        state: null,
      },
      click: false,
      saving: false,
      loading: false,
    };
  },
  mounted() {
    this.getCustomerGroupDetail();
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.inputs.name)
    },
    errorPhone: function () {
      return this.checkInfo(this.inputs.phone_number)
    },
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    getCustomerGroupDetail() {
      let id = this.$route.params.id;
      if (id) {
        this.loading = true;

        customerManagerApi
          .getCustomerGroupDetail(id)
          .then(res => {
            if (res != null && res.data != null && res.data.data != null) {
              this.inputs = res.data.data;

              console.log(this.inputs);
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
        return !(this.errorName || this.errorPhone)
      },
      /**
       * Save promotion
       */
      save () {
        this.click = true

        // Check validate
        if(!this.validate()) {
          return
        }
        this.saving = true

        let id = this.$route.params.id
        if(id){
          this.inputs.id = id
          customerManagerApi.editCustomerGroup(this.inputs).then(res => {
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
        } else {
          customerManagerApi.addCustomerGroup(this.inputs).then(res => {
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.$router.push('/customer-group')
              }
            }
            this.saving = false
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
       * Back to list
       */
      back() {
        // Go to list
        this.$router.push('/customer-group')
      },

      /**
       * Format group state
       */
      formatState(state) {
        if(state == 0) {
            return "Đang đến"
        }
        if(state == 1) {
            return "Đang ở"
        }
        if(state == 2) {
            return "Đã ở"
        }
        return ""
      },
  }
};
</script>

<style lang="scss" scoped></style>
