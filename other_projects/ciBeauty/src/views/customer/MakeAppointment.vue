<template>
  <div class="container mx-auto px-4" v-if="show">
    <div class="header p-5" style="background-color: #f85f36; color: white">
      <h2>Đặt lịch hẹn tại {{store_name}}</h2>
      <div class="description">
        Quý khách vui lòng đặt lịch hẹn trước để không phải chờ đợi khi đến
        spa.Cám ơn và hẹn gặp lại quý khách ở spa.
      </div>
    </div>
    <div class="grid grid-cols-12 gap-4 justify-content-center mt-5">
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
              <select class="form-control" v-model="selectedGender" :options="genderOption" />
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
              <select class="form-control" v-model="selectedSpaStaff" :options="staffOption" @change="fetchSchedule">
                <option
                  :value="null"
                  >-- Tất cả nhân viên --</option
                >
              </select>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4 px-0"> Thời gian đặt lịch </div>
            <div class="col-span-8 text-right">
              <span class="instruction">
                {{ selectedTimeString }}
              </span>
            </div>
            <div class="col-span-8"></div>
            <div class="col-span-4 px-0">
              <DatePicker v-model="selectedDate" format="YYYY-MM-DD" @input="fetchSchedule"/>
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
                @click="selectedTime = element.time"
                :style="
                  element.time === selectedTime
                    ? 'background:#f85f36;color:white'
                    : ''
                "
              >
                <p style="font-weight: bold">{{ element.time }}</p>
                <span v-show="width_percent == 70">
                  {{ element.status === "AVAILABLE" ? "Còn chỗ" : "Hết chỗ" }}
                </span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
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
            <div class="col-span-8">
              <button class="btn btn-dark" block style="height: 50px" type="submit" @click="submit">
                <i class="fa fa-pencil-square-o" style="margin-right: 5px" />
                Đặt lịch hẹn
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import Datepicker from "vue3-datepicker";
import moment from "moment";
import CustomerAPI from "@/api/customer";
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

    try {
      this.store_id = atob(this.$route.query.id);
      const res = await CustomerAPI.getStoreInfo({ store_id: this.store_id });
      if (res.data && res.data && res.data.data) {
        this.store_name = res.data.data.store_name;
        this.spa_staffs = res.data.data.spa_staffs;
        const response = await CustomerAPI.getServices({store_id:this.store_id});
        if (response.status == 200) {
          this.spa_services = response.data.data.services
        }
        this.show = true;
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
        return {
          value: staff.staff_id,
          text: staff.name,
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
      selectedDate: moment().format("YYYY-MM-DD"),
      selectedSpaStaff: null,
      selectedPartOfDay: "morning",
      selectedTime: "",
      selectedService: [],
      note: "",
      clickSubmit: false,
      width_percent:100
    };
  },
  methods: {
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: "my-toast",
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000,
      });
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
        this.errorSelectedDate
      );
    },
    fetchSchedule() {
      this.selectedTime=""
      if (this.errorSelectedDate) return;
      CustomerAPI.getSchedule({
        store_id: this.store_id,
        staff_id: this.selectedSpaStaff,
        date: this.selectedDate,
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
        appointment_date: this.selectedDate,
        arrive_time: this.selectedTime,
        services: this.selectedService,
        note:this.note
      };
      CustomerAPI.makeAppointment(appointmentData)
        .then((res) => {
          if (res != null && res.data != null) {
            if (res.data.status == 200) {
              // show popup success
              this.popToast(
                "success",
                "Đặt lịch hẹn thành công. Cám ơn quý khách!!! "
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
      this.selectedDate = moment().format("YYYY-MM-DD");
      this.selectedSpaStaff = null;
      this.selectedPartOfDay = "morning";
      this.selectedTime = "";
      this.selectedService = [];
      this.note = "";
      this.clickSubmit=false;
      this.fetchSchedule();
    },
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
  margin-top: 50px;
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
</style>
