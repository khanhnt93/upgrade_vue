<template>
  <div class="container mx-auto px-4">
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
          <h4 class="mt-2 text-center text-header">Đặt lịch hẹn</h4>
        </div>
      </div>
      <hr>
    <div class="grid grid-cols-12 gap-4 justify-content-center">
      <div :class="'col-span-12 content-width-' + width_percent">
        <form onsubmit="submit">
          <p class="instruction">Quý khách vui lòng cho biết thông tin:</p>
          <div class="grid grid-cols-12 gap-4">
            <input class="form-control"
              type="number"
              id="phone"
              v-model="phoneInput"
              placeholder="Số điện thoại"
            />
            <div class="invalid-feedback invalid-feedback"
              
              :state="!errorPhoneInput"
            >
              Vui lòng nhập số điện thoại
            </div>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4 px-0">
              <select class="form-control" v-model="selectedGender">
                <option v-for="gender in genderOption" :key="gender" :value="gender">
                  {{ gender }}
                </option>
              </select>
            </div>
            <div class="col-span-8 pr-0">
              <input class="form-control"
                id="name"
                v-model="nameInput"
                placeholder="Họ và tên"
              />
              <div class="invalid-feedback invalid-feedback"
                
                :state="!errorNameInput"
              >
                Vui lòng nhập tên
              </div>
            </div>
          </div>

          <p class="instruction">Thông tin dịch vụ:</p>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 px-0">
              <multiselect
                :options="spa_services"
                label="service_name"
                track-by="service_id"
                v-model="selectedService"
                :multiple="true"
                :allow-epmty="true"
                placeholder="Chọn dịch vụ"
                selectLabel="Click hoặc ấn Enter để chọn"
                deselectLabel ='Click hoặc ấn Enter để bỏ chọn'
                selectedLabel="Đã chọn"
                :showNoOptions="false"
                :showNoResults="false"
                @input="changeService"
              />
              <div class="invalid-feedback invalid-feedback"
                
                :state="!errorSelectedService"
              >
                Vui lòng chọn dịch vụ
              </div>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 px-0">
              <select class="form-control" v-model="selectedSpaStaff" @change="fetchSchedule">
                <option :value="null">-- Nhân viên --</option>
                <option v-for="staff in staffOption" :key="staff.value" :value="staff.value">
                  {{ staff.text }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4 instruction">Thời gian đặt lịch</div>
            <div class="col-span-8 text-right">
              <span class="instruction">
                {{ selectedTimeString }}
              </span>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-8"></div>
            <div class="col-span-4 px-0">
              <Datepicker v-model="selectedDate" format="YYYY-MM-DD" @input="fetchSchedule"/>
              <div class="invalid-feedback invalid-feedback"
                
                :state="!errorSelectedDate"
              >
                Vui lòng chọn ngày từ hôm nay trở đi
              </div>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4 my-4">
            <div class="col-span-4 pl-0">
              <button class="btn"
                block
                @click="selectedPartOfDay = 'morning'"
                :style="
                  selectedPartOfDay == 'morning' ? 'background:#F85F36;color:white' : ''
                "
              >
                Buổi sáng
              </button>
            </div>
            <div class="col-span-4 px-0">
              <button class="btn"
                block
                @click="selectedPartOfDay = 'afternoon'"
                :style="
                  selectedPartOfDay == 'afternoon' ? 'background:#F85F36;color:white' : ''
                "
              >
                Buổi chiều
              </button>
            </div>
            <div class="col-span-4 pr-0">
              <button class="btn"
                block
                @click="selectedPartOfDay = 'night'"
                :style="
                  selectedPartOfDay == 'night' ? 'background:#F85F36;color:white' : ''
                "
              >
                Buổi tối
              </button>
            </div>
          </div>
          <p>Chọn khung giờ phục vụ (*)</p>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 px-0">
              <button class="btn m-1 time-button"
                v-for="(element, index) in filteredSchedule"
                :key="index"
                :disabled="element.status === 'UNAVAILABLE'"
                @click="selectTime(element)"
                :style="
                  element.time === selectedTime
                    ? 'background:#f85f36;color:white'
                    : ''
                "
              >
                <p style="font-weight: bold">{{ element.time }}</p>
                <span v-show="width_percent == 70">{{ element.status === "AVAILABLE" ? "Còn chỗ" : "Hết chỗ" }}</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4 my-3">
            <div class="col-span-8 px-0 text-right">Thời gian kết thúc</div>
            <div class="col-span-4 px-0">
              <Datepicker v-model="leaveTime" format="H:i"/>
              <div class="invalid-feedback invalid-feedback"
                
                :state="!errorLeaveTime"
              >
                Vui lòng chọn thời gian kết thúc sau thời bắt đầu lịch hẹn
              </div>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4 my-3">
            <div class="col-span-12 px-0">
              <textarea class="form-control"
                id="note"
                size="sm"
                v-model="note"
                placeholder="Ghi chú"
                rows="3"
              ></textarea>
            </div>
          </div>


          <div class="grid grid-cols-12 gap-4 justify-content-center">
            <div class="col-span-8 text-center">
              <button class="btn btn-outline-success" block style="height: 50px" type="submit" @click="submit">
                <i class="fa fa-pencil-square-o" style="margin-right: 5px" />
                Đặt lịch hẹn
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import Datepicker from "vue3-datepicker";
import moment from "moment";
import adminAPI from "@/api/admin";
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

export default {
  components: { Datepicker,Multiselect },
  async mounted() {
      // Set content width
      let content_width = window.innerWidth
      console.log("content_width: " + content_width)
      if(content_width >= 750) {
          this.width_percent = 70
      } else {
          this.width_percent = 100
      }


      // Get schedule
    if (this.$store && this.$store.state && this.$store.state.user) {
      this.store_id = this.$store.state.user.storeId
    }
    try {
      // Use getStaff for store info if needed, or separate calls. 
      // Assuming getStaff still returns store_name but maybe correct spa_staffs is from getStaffOption. 
      // Or just call getStaffOption for staff.
      
      const res = await adminAPI.getStaffOption({ store_id: this.store_id });
      if (res.data && res.data.status == 200) {
        this.spa_staffs = res.data.data;
      }
      
      const response = await adminAPI.getServices({store_id:this.store_id});
      if (response.status == 200) {
        this.spa_services = response.data.data.services
      }
      this.fetchSchedule();
    } catch (e) {
      this.popToast("danger", e.message);
    }
  },
  computed: {
    staffOption() {
      if (this.spa_staffs===null) return [];
      return this.spa_staffs.map((staff) => {
        if (staff.value && staff.text) {
             return staff;
        }
        return {
          value: staff.staff_id || staff.id,
          text: staff.name || staff.full_name,
        };
      });
    },
    selectedTimeString() {
      moment.locale("vi");
      return `${this.selectedTime} ${moment(this.selectedDate).format(
        "dddd"
      )} ${moment(this.selectedDate).format("LL")}`;
    },
    filteredSchedule() {
      return this.schedules[this.selectedPartOfDay];
    },
    errorNameInput() {
      return this.checkInfo(this.nameInput);
    },
    errorPhoneInput() {
      return this.checkInfo(this.phoneInput);
    },
    errorSelectedDate() {
      return moment(this.selectedDate).diff(moment().format("YYYY-MM-DD")) < 0;
    },
    errorLeaveTime(){
      if (this.clickSubmit && this.leaveTime == null) return true;
      if (this.selectedTime == "") return false;
      
      let dateStr = moment(this.selectedDate).format("YYYY-MM-DD")
      let startTime = moment(dateStr + ' ' + this.selectedTime, "YYYY-MM-DD HH:mm")
      let leave = moment(this.leaveTime)
      return leave.diff(startTime) < 0;
    },
    errorSelectedService() {
      return this.checkInfo(this.selectedService);
    },
    errorSelectedTime() {
      return this.checkInfo(this.selectedTime);
    },
  },
  data() {
    return {
      show: false,
      store_id: null,
      store_name: null,
      genderOption: ["Anh", "Chị"],
      spa_staffs: null,
      spa_services: [],
      schedules: {
        morning: [],
        afternoon: [],
        night: [],
      },
      nameInput: "",
      phoneInput: "",
      selectedGender: "Chị",
      selectedDate: new Date(),
      selectedSpaStaff: null,
      selectedPartOfDay: "morning",
      selectedTime: "",
      leaveTime: null,
      selectedService: [],
      note: "",
      clickSubmit: false,
      width_percent:100,
      total_work_time_minute: 0
    };
  },
  methods: {
    goBack(){
      this.$router.push('/schedule');
    },
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
    checkInfo(info) {
      if (this.clickSubmit) {
        if (info == null || info.length === 0) return true;
        if (typeof info === "string" && info.trim().length === 0) return true;
        return false;
      } else return false;
    },
    checkValidate() {
      return !(
        this.errorNameInput ||
        this.errorPhoneInput ||
        this.errorSelectedService ||
        this.errorSelectedTime ||
        this.errorSelectedDate ||
        this.errorLeaveTime
      );
    },
    fetchSchedule() {
      this.selectedTime=""
      if (this.errorSelectedDate) {return};
      let dateStr = moment(this.selectedDate).format("YYYY-MM-DD");
      adminAPI.getSchedule({
        store_id: this.store_id,
        staff_id: this.selectedSpaStaff,
        date: dateStr,
        current_time: moment().format("YYYY-MM-DD HH:mm:ss"),
      })
        .then((res) => {
          if (res.status == 200) {
            this.schedules = res.data.data.schedules;
          }
        })
        .catch((e) => {
          this.popToast("danger", e.message);
        });
    },
    submit(e) {
      e.preventDefault();
      this.clickSubmit = true;
      if (!this.checkValidate()) {
        this.popToast(
          "warning",
          "Vui lòng kiểm tra lại thông tin đặt lịch hẹn"
        );
        return;
      }
      const appointmentData = {
        store_id: this.store_id,
        staff_id: this.selectedSpaStaff,
        current_time: moment().format("YYYY-MM-DD HH:mm:ss"),
        customer_name: this.nameInput,
        customer_phone_number: this.phoneInput,
        gender: this.selectedGender,
        appointment_date: moment(this.selectedDate).format("YYYY-MM-DD"),
        arrive_time: this.selectedTime,
        leave_time: moment(this.leaveTime).format("HH:mm"),
        services: this.selectedService,
        note:this.note
      };
      adminAPI.makeAppointment(appointmentData)
        .then((res) => {
          if (res != null && res.data != null) {
            if (res.data.status == 200) {
              // show popup success
              this.popToast(
                "success",
                "Đặt lịch hẹn thành công!!! "
              );
            }
          }
          this.reset();
        })
        .catch((err) => {
          this.popToast("danger", err.message);
        });
    },
    reset() {
      this.nameInput = "";
      this.phoneInput = "";
      this.selectedGender = "Chị";
      this.selectedDate = new Date();
      this.selectedSpaStaff = null;
      this.selectedPartOfDay = "morning";
      this.selectedTime = "";
      this.selectedService = [];
      this.leaveTime = null;
      this.note = "";
      this.clickSubmit=false;
      this.fetchSchedule();
    },

      changeService() {
        this.total_work_time_minute = 0
        for(let item of this.selectedService) {
            this.total_work_time_minute += parseInt(item.work_time_minute)
        }
        this.calLeaveTime()
      },

      selectTime(element) {
        this.selectedTime = element.time
        console.log("this.selectedTime: " + this.selectedTime)
        this.calLeaveTime()


      },

      calLeaveTime() {
        if(this.selectedDate && this.selectedTime) {
          let dateStr = moment(this.selectedDate).format("YYYY-MM-DD")
          let startTime = new Date(dateStr + " " + this.selectedTime + ":00")
          console.log("this.startTime: " + startTime)
          let leaveMs = startTime.getTime() + (parseInt(this.total_work_time_minute)*60000)
          this.leaveTime = new Date(leaveMs)
        }
      }
  },
};
</script>
<!-- <style src="vue-multiselect/dist/vue-multiselect.min.css"></style> -->
<style>
.row {
  margin: 5px 0px;
}
.instruction {
  color: #f85f36;
  font-weight: bold;
}
p.instruction {
  margin-top: 20px;
}
.col-12 {
  margin: 10px 0px;
}
#tj-datetime-input{
  border-radius: .25rem;
}
.time-button{
  width: 100px;
  background: white;
  color: #f85f36;
  border-color: #f85f36;
}
.time-button.disabled,
.time-button:disabled {
  color: grey;
  border-color: black;
}

  .content-width-100 {
    width: 100%;
  }

  .content-width-70 {
    width: 70%;
  }
</style>
