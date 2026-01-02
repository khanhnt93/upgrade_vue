<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>

          <b-row>
            <b-col md="12">
              <h4 class="mt-1 text-center text-header">lịch sử KHÁCH LẺ</h4>
            </b-col>
          </b-row>
          <hr />

          <b-row>
            <b-col md="3">
              <label> Đoàn </label>
              <b-form-select
                id="input-3"
                v-model="inputs.customerGroupId"
                :options="customerGroups"
              ></b-form-select>
            </b-col>
            <b-col md="2">
              <label> Tên khách hàng </label>
              <input
                id="name"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.customerName"
                maxlength="75"
              />
            </b-col>
            <b-col md="2">
              <label> Số điện thoại </label>
              <input
                id="phone"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.phoneNumber"
                maxlength="75"
              />
            </b-col>
            <b-col md="2">
              <label> Số CMND/CCCD </label>
              <input
                id="cmnd"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.identityCardNumber"
                maxlength="75"
              />
            </b-col>
            <b-col md="3">
              <label> Trạng thái </label>
              <b-form-select
                id="input-3"
                v-model="inputs.state"
                :options="states"
                required
              ></b-form-select>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="12" class="mt-2">

              <b-button variant="outline-primary" class="pull-right btn-width-120"
                :disabled="onSearch"
                @click.prevent="search"
              >
                Tìm Kiếm
              </b-button>
              <b-button variant="outline-success" class="mr-2 pull-right btn-width-120" @click="resetConditionSearch()">
                  làm mới
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col> Số kết quả: {{ totalRow }} </b-col>
          </b-row>

          <b-table hover bordered stacked="md" :fields="fields" :items="items">
            <template #cell(state)="data">
              {{ data.value | format_state }}
            </template>

            <template #cell(check_out)="data">
              {{ data.value | format_date }}
            </template>

            <template #cell(check_in)="data">
              {{ data.value | format_date }}
            </template>

            <template v-slot:cell(actions)="dataId">
              <b-list-group horizontal>
                <b-list-group-item v-b-tooltip.hover title="Edit" @click="edit(dataId.item.id)">
                  <i class="fa fa-edit" />
                </b-list-group-item>
              </b-list-group>
            </template>
          </b-table>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"
            ><icon name="loading" width="60"
          /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && totalRow != 0"
            ><i class="fa fa-angle-double-down has-next"></i
          ></span>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { Constant } from "@/common/constant";
import customerManagerApi from "@/api/customerManager";
import commonFunc from "@/common/commonFunc";

export default {
  data() {
    return {
      states: [
        { text: "", value: "" },
        { text: "Đang ở", value: "STAYING" },
        { text: "Đang đến", value: "COMMING" },
        { text: "Đã ở", value: "STAYED" },
      ],
      inputs: {
        customerGroupId: null,
        customerName: null,
        phoneNumber: null,
        identityCardNumber: null,
        state: ""
      },
      onSearch: false,
      totalRow: 0,
      offset: 0,
      loading: false,
      hasNext: true,
      fields: [
        {
          key: "stt",
          label: "STT"
        },
        {
          key: "group_name",
          label: "Đoàn"
        },
        {
          key: "customer_name",
          label: "Tên khách hàng"
        },
        {
          key: "phone_number",
          label: "Số điện thoại"
        },

        {
          key: "identity_card_number",
          label: "Số CMND/CCCD"
        },
        {
          key: "room_name",
          label: "Phòng"
        },
        {
          key: "check_in",
          label: "Ngày đến"
        },
        {
          key: "check_out",
          label: "Ngày đi"
        },
        {
          key: "state",
          label: "Trạng thái"
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      items: [],
      pageLimit: Constant.PAGE_LIMIT,
      loadByScroll: false,
      customerGroups: []
    };
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

    this.getListCustomerGroup()

    this.search();


  },
  methods: {
    goToAdd() {
      this.$router.push("/customer/add");
    },

    /**
     *  Processing on scroll: use for paging
     */
    onScroll (event) {
      if(this.onSearch) {
        return
      }
      event.preventDefault()
      var body = document.body
      var html = document.documentElement
      if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if(this.hasNext) {
          this.offset = this.offset + this.pageLimit
          this.loadByScroll = true
          this.search ()
        }
      }
    },

    getListCustomerGroup() {
      // Get customer group
      customerManagerApi
        .getListCustomerGroup({}).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.customerGroups = res.data.data.map(item => ({text: item.name, value: item.id}));
          this.customerGroups.unshift({text: '', value: ''})
        } else {
          this.customerGroups = [];
        }
        this.onSearch = false;
        this.loading = false;
      }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err);
          this.popToast("danger", errorMess);

          this.onSearch = false;
          this.loading = false;
        });
    },

    search() {
      // Define params
      let params = {
        "customer_group_id": this.inputs.customerGroupId,
        "customer_name": this.inputs.customerName,
        "phone_number": this.inputs.phoneNumber,
        "identity_card_number": this.inputs.identityCardNumber,
        "state": this.inputs.state,
        "limit": this.pageLimit,
        "offset": this.offset
      };
      this.filter(params);
    },
    filter(params) {
      if (this.loading) {
        return;
      }

      this.loading = true;
      this.onSearch = true;
      // Search
      customerManagerApi
        .getListCustomer(params)
        .then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            let it = res.data.data.customers;
            this.totalRow = res.data.data.total_row;

            // Update items
            if (this.loadByScroll) {
              let temp = this.items;
              var newArray = temp.concat(it);
              this.items = newArray;
            } else {
              this.items = it;
            }
            this.loadByScroll = false;

            // Check has next
            if (this.offset + this.pageLimit >= res.data.data.total_row) {
              this.hasNext = false;
            } else {
                this.hasNext = true;
            }
          } else {
            this.items = [];
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
    edit(id) {
      this.$router.push('/customer-history/edit/' + id)
    },
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: "my-toast",
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      });
    },
    deleted (id, name) {
      if(id) {
          this.$bvModal.msgBoxConfirm('Xóa ' + name + ". Bạn có chắc không?", {
            title: false,
            buttonSize: 'sm',
            centered: true, size: 'sm',
            footerClass: 'p-2'
          }).then(res => {
            if (res) {
              customerManagerApi.deleteCustomer(id).then(res => {
                this.filter();
              }).catch(err => {
                let errorMess = commonFunc.handleStaffError(err)
                this.makeToast('danger', "Xóa thất bại!!!", errorMess)
              })
            }
          })
        }
    },
    makeToast(variant = null, title="Success!!!", content="Thao tác thành công!!!") {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true,
        autoHideDelay: 3000
      })
    },

      resetConditionSearch() {
        this.inputs.customerGroupId = null
        this.inputs.customerName = null
        this.inputs.phoneNumber = null
        this.inputs.identityCardNumber = null
        this.inputs.state = ""
      }
  }
};
</script>

<style lang="scss" scoped>
</style>
