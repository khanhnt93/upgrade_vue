<template>
    <div class="container-fluid">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-full">
            <div class="bg-white rounded-lg shadow-md p-4">
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
                <button class="btn btn-outline-secondary pull-left px-4" @click="goBack">
                  Quay lại
                </button>
              </div>
            </div>
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12">
                <h4 class="mt-2 text-center text-header">Quản lý lịch hẹn</h4>
              </div>
            </div>
            <hr>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-2">
                <label> Tên </label>
                <input
                  id="name"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.name"
                  maxlength="75">
              </div>
              <div class="col-span-2">
                <label> Số điện thoại </label>
                <input
                  id="phone"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.phone"
                  maxlength="11"
                  >
              </div>
              <div class="col-span-2">
                <label> Nhân viên </label>
                <select class="form-control form-control"
                  autocomplete="new-password"
                  v-model="inputs.staff"
                  :disabled="onSearch">
                  <option v-for="option in staffOption" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
              <div class="col-span-3">
                <label> Thời gian từ </label>
                <Datepicker
                  format="YYYY-MM-DD H:i:s"
                  v-model="inputs.from"
                />
              </div>
              <div class="col-span-3">
                <label> Đến </label>
                <Datepicker
                  format="YYYY-MM-DD H:i:s"
                  v-model="inputs.to"
                />
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 mt-2 mb-2">
              <div class="col-span-12">
                <button class="btn btn-outline-primary float-right px-4 btn-width-120" :disabled="onSearch" @click.prevent="prepareToSearch">
                  Tìm Kiếm
                </button>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
                Số kết quả: {{totalRow}}
              </div>
            </div>

            <table class="table table-bordered table-hover table-responsive-stack">
              <thead>
                <tr>
                  <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index">
                  <td v-for="field in fields" :key="field.key" :data-label="field.label">
                    <div v-if="field.key === 'stt'">
                      {{ index + 1 }}
                    </div>
                    <div v-else-if="field.key === 'services'">
                      <ul>
                        <li v-for="e in item.services" :key="e.service_name || e.id">{{e.service_name}}</li>
                      </ul>
                    </div>
                    <div v-else-if="field.key === 'arrive_time'">
                      {{formatTime(item.arrive_time)}}
                    </div>
                    <div v-else-if="field.key === 'leave_time'">
                      {{formatTime(item.leave_time)}}
                    </div>
                    <div v-else-if="field.key === 'status'">
                      {{item.status == 1 ? 'Chờ xác nhận ': (item.status == 2 ? 'Đã xác nhận':'')}}
                    </div>
                    <div v-else-if="field.key === 'action'">
                      <div class="flex gap-2">
                        <button class="list-group-item" v-if="item.status==1"
                          title="Xác nhận" @click="showConfirmModal(item)"><i class="fa fa-check-square-o" />
                        </button>

                        <button class="list-group-item"  title="Sửa" @click="showModalUpdate(item.id)"><i class="fa fa-edit" />
                        </button>
                        <button class="list-group-item" title="Xóa" @click="deleteAppointment(item)"><i class="fa fa-trash" />
                        </button>
                      </div>
                    </div>
                    <div v-else>
                      {{ item[field.key] }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
            <span class="loading-more" v-if="hasNext === false">--Hết--</span>
            <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>


          </div>

        </div>
      </div>

      <!-- Modal confirm appointment -->
      <div v-if="showConfirmAppointmentModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
          <div class="flex items-center justify-between p-4 border-b">
            <h4 class="text-xl font-bold">Xác nhận lịch hẹn</h4>
            <button @click="showConfirmAppointmentModal = false; selectedItem = {}" class="text-gray-500 hover:text-gray-700">
              <span class="text-2xl">&times;</span>
            </button>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
                <p><b>Dịch vụ: </b></p>
                <span class="ml-2" v-for="(item, index) in this.selectedItem.services">
                  - {{item.service_name}}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 mt-2">
              <div class="col-span-full">
                <p><b>Thời gian bắt đầu:</b> {{this.selectedItem.arrive_time}}</p>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 mt-2">
              <div class="col-span-full">
                <p><b>Thời gian kết thúc: </b></p>
                  <Datepicker
                    format="YYYY-MM-DD H:i:s"
                    v-model="selectedItem.leave_time"
                  />
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 mt-2">
              <div class="col-span-full">
                <p><b>Nhân viên phụ trách: </b></p>
                  <select class="form-control form-control"
                      autocomplete="new-password"
                      v-model="selectedItem.staff_id">
                      <option v-for="option in staffOption" :key="option.value" :value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                </div>
              </div>

            <div class="grid grid-cols-12 gap-4 mt-4">
              <div class="col-span-full flex justify-between">
                <button class="btn btn-danger btn-width-120" @click="()=>{
                  showConfirmAppointmentModal = false
                  selectedItem = {};
                  }">Hủy</button>

                <button class="btn btn-success btn-width-120"
                          @click="confirm">
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal update appointment -->
      <div v-if="showUpdateAppointmentModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 my-6 overflow-hidden flex flex-col max-h-[90vh]"> 
          <div class="flex items-center justify-between p-4 border-b">
            <h4 class="text-xl font-bold">Cập nhật thông tin đặt lịch</h4>
            <button @click="hideModalUpdate" class="text-gray-500 hover:text-gray-700">
              <span class="text-2xl">&times;</span>
            </button>
          </div>
          <div class="p-6 overflow-y-auto">
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12 my-2">
                <label> Tên </label>
                <input
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="update.customer_name"
                  maxlength="75">
              </div>

              <div class="col-span-12 my-2">
                <label> Số điện thoại </label>
                <input
                  type="number"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="update.customer_phone_number"
                  maxlength="11"
                >
              </div>

              <div class="col-span-12 my-2">
                <label> Giới tính </label>
                <select class="form-control form-control"
                  autocomplete="new-password"
                  v-model="update.gender"
                >
                  <option v-for="gender in genderOption" :key="gender" :value="gender">
                    {{ gender }}
                  </option>
                </select>
              </div>

              <div class="col-span-12 my-2">
                <label> Nhân viên </label>
                <select class="form-control form-control"
                  autocomplete="new-password"
                  v-model="update.staff_id"
                >
                  <option v-for="option in staffOption" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
              <div class="col-span-12 my-2">
                <label> Dịch vụ </label>
                <multiselect
                  :options="spa_services"
                  label="service_name"
                  track-by="service_id"
                  v-model="update.services"
                  :multiple="true"
                  :allow-epmty="true"
                  placeholder="Chọn dịch vụ"
                  selectLabel="Click hoặc ấn Enter để chọn"
                  deselectLabel ='Click hoặc ấn Enter để bỏ chọn'
                  selectedLabel="Đã chọn"
                  :showNoOptions="false"
                  :showNoResults="false"
                />
              </div>
              <div class="col-span-6 my-2">
                <label> Thời gian từ </label>
                <Datepicker
                  format="YYYY-MM-DD H:i:s"
                  v-model="update.arrive_time"
                />
              </div>
              <div class="col-span-6 my-2">
                <label> Đến </label>
                <Datepicker
                  format="YYYY-MM-DD H:i:s"
                  v-model="update.leave_time"
                />
              </div>
              <div class="col-span-12 my-2">
                <label> Ghi chú </label>
                <textarea class="form-control"
                  id="note"
                  size="sm"
                  v-model="update.note"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div class="grid grid-cols-12 gap-4 justify-content-center my-3">
              <button class="btn btn-dark" @click="confirmUpdate"> Xác nhận</button>
              <button class="btn btn-dark ml-2" @click="hideModalUpdate">Hủy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import {Constant} from "@/common/constant";
import adminAPI from "@/api/admin";
import Datepicker from "vue3-datepicker"
import moment from "moment";
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

export default {
  components:{
    Datepicker, Multiselect
  },
  data(){
    return {
      totalRow: 0,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      hasNext: true,
      onSearch: false,
      loadByScroll: false,
      loading: false,
      selectedItem: {},
      spa_staffs:[],
      spa_services:[],
      genderOption:['Anh','Chị'],
      fields:[
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'customer_name',
          label: 'Tên'
        },
        {
          key: 'customer_phone_number',
          label: 'Số điện thoại'
        },
        {
          key: 'staff_name',
          label: 'Nhân viên làm'
        },
        {
          key: 'services',
          label: 'Dịch vụ làm'
        },
        {
          key: 'arrive_time',
          label: 'Thời gian từ'
        },
        {
          key: 'leave_time',
          label: 'Thời gian đến'
        },
        {
          key: 'status',
          label: 'Trạng thái'
        },
        {
          key: 'action',
          label: '',
          class: 'actions-cell'
        }
      ],
      items:[],
      inputs:{
        name:null,
        phone:null,
        staff:null,
        service:null,
        from:null,
        to:null
      },
    itemConfirm: {
      leave_time: null,
        staff_id: null
    },
      update:{
        "id": null,
        "customer_phone_number": "",
        "gender": "Chị",
        "customer_name": "",
        "arrive_time": "",
        "leave_time": "",
        "staff_id": null,
        "note": "",
        "services": []
      },
      showConfirmAppointmentModal: false,
      showUpdateAppointmentModal: false,
    }
  },
  mounted() {
    // Get default date
    let dateNow = new Date()
    this.inputs.from = dateNow
    let toDate = new Date()
    toDate.setDate(dateNow.getDate() + 7)
    this.inputs.to = toDate

    window.addEventListener('scroll', this.onScroll);

    // Load option staff and service
    this.fetchStaff()
    this.fetchService()

    // Load list when load page
    this.search()
  },
  computed:{
    staffOption() {
      if (this.spa_staffs===null) return [];
      let staffOption = this.spa_staffs.map((staff) => {
        if (staff.value && staff.text) {
             return staff;
        }
        return {
          value: staff.staff_id || staff.id,
          text: staff.name || staff.full_name,
        };
      });
      staffOption.push({text:'',value:null})
      return staffOption;
    },
    serviceOption() {
      return this.spa_services.map((service) => {
        return {
          value: service.service_id,
          text: service.service_name,
        };
      });
    },

  },
  methods:{
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
    formatTime(time){
      if (!time) {return null}
      return moment(time).format("DD-MM-YYYY HH:mm:ss")
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
    showConfirmModal(item) {
      this.selectedItem = {...item}
      if (this.selectedItem.leave_time) {
        this.selectedItem.leave_time = new Date(this.selectedItem.leave_time)
      }
      this.showConfirmAppointmentModal = true
    },
    showModalUpdate(appId){
      const appIndex = this.items.findIndex(e => e.id == appId)
      this.update = {...this.items[appIndex]}
      if (this.update.arrive_time) this.update.arrive_time = new Date(this.update.arrive_time)
      if (this.update.leave_time) this.update.leave_time = new Date(this.update.leave_time)

      if (this.update.staff_name == null) {
        this.update.staff_id == null
      } else {
        const staffIndex = this.spa_staffs.findIndex(e => e.name == this.update.staff_name);
        if(staffIndex > -1) {
          this.update.staff_id = this.spa_staffs[staffIndex].staff_id;
        }
      }
      this.showUpdateAppointmentModal = true;
    },
    hideModalUpdate(){
      this.update = {
        "id": null,
        "customer_phone_number": "",
        "gender": "Chị",
        "customer_name": "",
        "arrive_time": "",
        "leave_time": "",
        "staff_id": null,
        "note": "",
        "services": []
      }
      this.showUpdateAppointmentModal = false
    },
    confirmUpdate(){
      let params = {...this.update}
      if (params.arrive_time instanceof Date) params.arrive_time = moment(params.arrive_time).format("YYYY-MM-DD HH:mm:ss")
      if (params.leave_time instanceof Date) params.leave_time = moment(params.leave_time).format("YYYY-MM-DD HH:mm:ss")
      
      adminAPI.updateAppointment(params).then(res => {
        if (res.data.status == 200) {
          this.popToast('success', 'Cập nhật thành công')
          this.hideModalUpdate();
          this.search();
        }
      }).catch(err => {
        this.popToast('danger', err.message)
      })
    },
    confirm(){
        let leaveTime = this.selectedItem.leave_time
        if (leaveTime instanceof Date) leaveTime = moment(leaveTime).format("YYYY-MM-DD HH:mm:ss")

        let params = {
            id: this.selectedItem.id,
            leave_time: leaveTime,
            staff_id: this.selectedItem.staff_id
        }
      adminAPI.confirmAppointment(params).then(res => {
          if (res.data.status == 200) {
            this.popToast('success', 'Xác nhận lịch hẹn thành công')
            this.showConfirmAppointmentModal = false

              // Reload data
              this.search ()
          }
        }).catch(err => {
        this.popToast('danger', err.message)
      })
    },
    deleteAppointment(appointment){
      if (confirm(`Xóa lịch hẹn của ${appointment.customer_name}. Thời gian: ${this.formatTime(appointment.arrive_time)} đến ${this.formatTime(appointment.leave_time)}. Bạn có chắc không?`)) {
          adminAPI.deleteAppointment({id:appointment.id}).then(res => {
            if (res.data.status == 200) {
              this.popToast('success', 'Xóa thành công')
              this.search()
            }
          }).catch(err => {
            this.popToast('danger', err.message)
          })
        }
    },
    fetchStaff(){
      let storeId = null;
      if (this.$store && this.$store.state && this.$store.state.user) {
        storeId = this.$store.state.user.storeId;
      }
      adminAPI.getStaffOption({
        store_id: storeId
      }).then(res =>{
        if (res.data.status == 200){
          this.spa_staffs = res.data.data;
        }
      }).catch(err=>{
        this.popToast('danger',err.message)
      })
    },
    fetchService(){
      let storeId = null;
      if (this.$store && this.$store.state && this.$store.state.user) {
        storeId = this.$store.state.user.storeId;
      }
      adminAPI.getServices({store_id:storeId}).then(response => {
      if (response.status == 200) {
        this.spa_services = response.data.data.services
      }
    }).catch(e=> {
    this.popToast("danger", e.message);
    })
    },
    prepareToSearch() {
      this.offset = 0
      this.items = []
      this.hasNext = true

      this.search()
    },
    search(){
      if (this.loading) {return}

      this.onSearch = true
      this.loading = true
      let fromDate = this.inputs.from
      if (fromDate && fromDate instanceof Date) {
          fromDate = moment(fromDate).format("YYYY-MM-DD HH:mm:ss")
      }
      let toDate = this.inputs.to
      if (toDate && toDate instanceof Date) {
          toDate = moment(toDate).format("YYYY-MM-DD HH:mm:ss")
      }

      adminAPI.searchAppointment({
        "customer_name": this.inputs.name,
        "customer_phone_number": this.inputs.phone,
        "service_id": this.inputs.service,
        "staff_id": this.inputs.staff,
        "from": fromDate,
        "to": toDate,
        "offset": this.offset,
        "limit": this.pageLimit
      }).then(res =>{
        if(res != null && res.data != null && res.data.data != null){
          let it = res.data.data.appointments
          this.totalRow = res.data.data.total_row

          // Update items
          if(this.loadByScroll) {
            let temp = this.items
            var newArray = temp.concat(it)
            this.items = newArray
          } else {
            this.items = it
          }
          this.loadByScroll = false

          // Check has next
          if(this.offset + this.pageLimit >= res.data.data.total_row) {
            this.hasNext = false
          }
        }else{
          this.items = []
        }
        this.onSearch = false
        this.loading = false
      }).catch(err=>{
        this.onSearch = false
        this.loading = false

        this.popToast('danger',err.message)
      })
    },

    /**
     * Go back
     */
    goBack () {
      this.$router.push('/schedule')
    },
  }
}
</script>

<!-- <style src="vue-multiselect/dist/vue-multiselect.min.css"></style> -->
<style>

input#tj-datetime-input{
  display: block;
  width: 100%;
  height: calc(1.5em + .75rem + 2px);
  padding: .375rem .75rem;
  font-size: .875rem;
  font-weight: 400;
  line-height: 1.5;
  color: #5c6873;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #e4e7ea;
  border-radius: .25rem;
}

</style>
