<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center text-header">Nhóm - Loại Thu Chi</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row class="form-row">
            <b-col md="3" class="mt-2">
              <label>Loại<span class="error-sybol"></span></label>
            </b-col>
            <b-col md="9" class="mt-2">
              <div class="input-group">
                <!--Chi-->
                <input type="radio" v-model="fundSetting.type" name="issue_invoice" :value="1" class="mt-2"
                       id="type_expend"  @change="changeType('1')">
                <label class="ml-4 mt-1" for="type_expend">Khoản chi</label>
                <!--Thu-->
                <input type="radio" v-model="fundSetting.type" name="issue_invoice" :value="0" class="ml-5 mt-2"
                       id="type_income"  @change="changeType('0')">
                <label class="ml-4 mt-1" for="type_income">Khoản thu</label>
                <!--Phiếu kế toán-->
                <input type="radio" v-model="fundSetting.type" name="issue_invoice" :value="2" class="ml-5 mt-2"
                       id="type_accounting_slip"  @change="changeType('2')">
                <label class="ml-4 mt-1" for="type_accounting_slip">Phiếu kế toán</label>
              </div>
              <b-form-invalid-feedback class="invalid-feedback" :state="!errorType">
                Vui lòng chọn loại
              </b-form-invalid-feedback>
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="3" class="mt-2">
              <label>Nhóm<span class="error-sybol"></span></label>
            </b-col>
            <b-col md="9" class="mt-2">
              <b-form-select :options="optionsGroup" v-model="fundSetting.group_id"
                             :disabled="fundSetting.type != 1 && fundSetting.type != 0 && fundSetting.type != 2"></b-form-select>
              <b-form-invalid-feedback class="invalid-feedback" :state="!errorGroup">
                Vui lòng chọn nhóm
              </b-form-invalid-feedback>
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="3" class="mt-2">
              <label>Tên loại</label><span class="error-sybol"></span>
            </b-col>
            <b-col md="9" class="mt-2">
              <input
                id="name"
                type="text"
                class="form-control"
                v-model="fundSetting.name"
                autocomplete="new-password"
                maxlength="255">
              <b-form-invalid-feedback class="invalid-feedback" :state="!errorName">
                Vui lòng nhập tên
              </b-form-invalid-feedback>
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="3" class="mt-2">
              <label>Mô tả</label>
            </b-col>
            <b-col md="9" class="mt-2">
              <b-form-textarea
                id="description"
                class="form-control"
                rows="2"
                autocomplete="new-password"
                v-model="fundSetting.description"
              ></b-form-textarea>
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="3" class="mt-2">
              <label>Thứ tự xuất hiện</label>
            </b-col>
            <b-col md="9" class="mt-2">
              <input
                id="index_sort"
                type="text"
                class="form-control"
                v-model="fundSetting.index_sort"
                autocomplete="new-password"
                @keyup="integerOnly($event.target)"
                maxlength="2">
            </b-col>
          </b-row>

          <b-row class="mt-2 mb-2">
            <b-col md="12" class="text-center">
              <b-button v-show="!saving" variant="outline-primary" class="btn-width-120 text-center" :disabled="saving"
                        @click.prevent="addUpdateFundSetting">
                <span>{{btn_text}}</span>
              </b-button>
              <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
            </b-col>
          </b-row>

          <b-row class="mt-3">
            <b-col md="12">
              Số kết quả: <b>{{items.length}}</b>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="12">
              <b-table
                hover
                bordered
                stacked="md"
                :fields="fields"
                :items="items">
                <template v-slot:cell(action)="dataId">
                  <b-list-group horizontal v-if="dataId.item.is_type_can_edit">
                    <b-list-group-item v-b-tooltip.hover title="Cập nhật"
                                       @click="edit(dataId.index)">
                      <i class="fa fa-edit" />
                    </b-list-group-item>
                    <b-list-group-item v-b-tooltip.hover title="Xóa"
                                       @click="deleted(dataId.item.id, dataId.item.name)">
                      <i class="fa fa-trash" />
                    </b-list-group-item>
                  </b-list-group>
                </template>
              </b-table>
            </b-col>
          </b-row>


          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more">--Hết--</span>
        </b-card>

      </b-col>
    </b-row>

  </div>
</template>


<script>
import fundApi from '@/api/fund'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      fundSetting: {
        type: null,
        group_id: null,
        name: null,
        description: null,
        index_sort: null
      },
      optionsGroupStore: [],
      optionsGroup: [],
      optionsType: [
        {value: null, text: ""},
        {value: "expend", text: "Khoản chi"},
        {value: "income", text: "Khoản thu"}
      ],
      btn_text: "Thêm mới",
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'type_str',
          label: 'Loại'
        },
        {
          key: 'group_name',
          label: 'Nhóm'
        },
        {
          key: 'name',
          label: 'Tên'
        },
        {
          key: 'description',
          label: 'Mô tả'
        },
        {
          key: 'index_sort',
          label: 'Thứ tự hiển thị'
        },
        {
          key: 'action',
          label: '',
          class: 'actions-cell'
        }
      ],
      items: [],
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      onSearch: false,
      loading: false,
      click: false,
      saving: false,
    }
  },
  mounted() {

    // Get group option
    this.getOptionGroup()

    // Load list when load page
    this.search()
  },
  computed: {
    errorType () {
      return this.checkInfo(this.fundSetting.type)
    },
    errorGroup () {
      return this.checkInfo(this.fundSetting.group_id)
    },
    errorName () {
      return this.checkInfo(this.fundSetting.name)
    },
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorType || this.errorGroup || this.errorName)
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
     * Get group options
     */
    getOptionGroup() {
      fundApi.getGroupOptions().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.optionsGroupStore = res.data.data
        }
      })
    },

    changeType(type) {
      this.optionsGroup = []
      for(let item of this.optionsGroupStore) {
        if(item.type == type) {
          let group = {"value": item.id, "text": item.name}
          this.optionsGroup.push(group)
        }

      }
    },

    /**
     *  Search
     */
    search() {
      if (this.loading) { return }
      this.loading = true

      // Search
      fundApi.getFundSetting().then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.items = res.data.data
        }else{
          this.items = []
        }
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loading = false
      })
    },

    edit(index) {

      this.fundSetting = this.items[index]
      this.changeType(this.fundSetting.type)
      this.btn_text = "Cập nhật"

      window.scrollTo({ top: 0, behavior: 'smooth' });
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
     * Currency format
     */
    currencyFormat(num) {
      let result = ""
      if(num === 0) {
          return "0"
      }
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },

    deleted (id, name) {
      if(id && name) {
        this.$bvModal.msgBoxConfirm('Xóa [' + name + "]. Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if(res){
            fundApi.deleteFundSetting(id).then(res => {
              if(res != null && res.data != null && res.data.data != null){
                this.items = res.data.data
                this.popToast('success', 'Xoá thành công!')
              }
            }).catch(err => {
              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.popToast('danger', errorMess)
            })
          }
        })
      }
    },

    resetValueSeting() {
        this.click = false
        this.fundSetting = {
        type: null,
        group_id: null,
        name: null,
        description: null,
        index_sort: null
      }
    },

    addUpdateFundSetting () {
      this.click = true

      let checkValidate = this.checkValidate()
      if(!checkValidate) {
        return
      }

      this.saving = true

      let fundSettingId = this.fundSetting.id
      if(fundSettingId){
        // Edit
        fundApi.updateFundSetting(this.fundSetting).then(res => {
          this.saving = false
          if(res != null && res.data != null && res.data.data != null){
            this.items = res.data.data
            this.popToast('success', 'Cập nhật thành công!')

            this.resetValueSeting()
          }
        }).catch(err => {
          this.saving = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      } else {
        // Add
        fundApi.addFundSetting(this.fundSetting).then(res => {
          this.saving = false
          if(res != null && res.data != null && res.data.data != null){
            this.items = res.data.data
            this.popToast('success', 'Thêm mới thành công!')

            this.resetValueSeting()
          }
        }).catch(err => {
          this.saving = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }

    },
  }
}
</script>
