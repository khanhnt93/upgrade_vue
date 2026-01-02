<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col>
              <b-button variant="outline-success" class="pull-right btn-width-120"
                @click="goToAdd()"
              >
                Thêm
              </b-button>
            </b-col>
            
          </b-row>

          <b-row>
            <b-col md="12">
              <h4 class="mt-1 text-center text-header">KHÁCH ĐOÀN</h4>
            </b-col>
          </b-row>
          <hr />

          <b-row>
            <b-col md="3">
              <label> Tên đoàn </label>
              <input
                id="name"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.name"
                maxlength="75"
              />
            </b-col>
            <b-col md="3">
              <label> Số điện thoại </label>
              <input
                id="phone"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.phone_number"
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
            <b-col md="3">
              <label class="label-width text-white">
                 Tìm kiếm
              </label>
              <b-button variant="outline-primary" class="pull-right btn-width-120"
                :disabled="onSearch"
                @click.prevent="prepareToSearch"
              >
                Tìm Kiếm
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col> Số kết quả: {{ totalRow }} </b-col>
          </b-row>

          <b-table hover bordered stacked="md" :fields="fields" :items="items">
            <template v-slot:cell(state)="data">
              {{formatState(data.item.state)}}
            </template>

            <template v-slot:cell(actions)="dataId">
              <b-list-group horizontal>
                <b-list-group-item v-b-tooltip.hover title="Edit" @click="edit(dataId.item.id)">
                  <i class="fa fa-edit" />
                </b-list-group-item>
                <b-list-group-item v-b-tooltip.hover title="Delete"
                                   @click="deleted(dataId.item.id, dataId.item.name)">
                  <i class="fa fa-trash" />
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
        { text: "", value: null },
        { text: "Đang đến", value: 0 },
        { text: "Đang ở", value: 1 },
        { text: "Đã ở", value: 2 },
      ],
      inputs: {
        name: null,
        phone_number: null,
        state: ""
      },
      onSearch: false,
      totalRow: 0,
      offset: 0,
      loading: false,
      hasNext: false,
      fields: [
        {
          key: "stt",
          label: "STT"
        },
        {
          key: "name",
          label: "Tên đoàn"
        },
        {
          key: "phone_number",
          label: "Số điện thoại"
        },
        {
          key: "note",
          label: "Mô tả"
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
      loadByScroll: false
    };
  },
  mounted() {
    this.filter({});
  },
  methods: {
    goToAdd() {
      this.$router.push("/customer-group/add");
    },
    prepareToSearch() {
      this.search();
    },
    search() {

      // Define params
      let params = {
        "name": this.inputs.name,
        "phone_number": this.inputs.phone_number,
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
        .getListCustomerGroup(params)
        .then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            let it = res.data.data;
            this.totalRow = res.data.data.length;

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
      this.$router.push('/customer-group/edit/' + id)
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
          this.$bvModal.msgBoxConfirm('Xóa [' + name + "]. Bạn có chắc không?", {
            title: false,
            buttonSize: 'sm',
            centered: true, size: 'sm',
            footerClass: 'p-2'
          }).then(res => {
            if (res) {
              customerManagerApi.deleteCustomerGroup(id).then(res => {
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
