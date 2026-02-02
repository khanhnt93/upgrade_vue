<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
    <div class="col-span-full">
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="grid grid-cols-12 gap-4 justify-content-end my-3">
          <div class="col-span-12">
            <button class="btn btn-outline-primary float-right btn-width-160 mt-2 mr-2" @click="manageSchedule">
              Quản lý lịch hẹn
            </button>
            <button class="btn btn-outline-success float-right btn-width-160 mt-2 mr-2" @click="$router.push('/schedule/appointment')">
              Đặt lịch hẹn
            </button>
          </div>

          <!--<div class="col-span-3 justify-content-end my-3">-->
            <!--<button class="btn btn-primary float-right px-2 default-btn-bg btn-width-160" @click="$router.push('/schedule/appointment')">-->
              <!--Đặt lịch hẹn-->
            <!--</button>-->
          <!--</div>-->
          <!--<div class="col-span-3 justify-content-end my-3">-->
            <!--<button class="btn btn-primary float-right default-btn-bg btn-width-160" @click="manageSchedule">-->
              <!--Quản lý lịch hẹn-->
            <!--</button>-->
          <!--</div>-->
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <h4 class="mt-2 text-center text-header">Lịch hẹn</h4>
          </div>
        </div>
        <hr>

        <div class="flex justify-content-end my-3">
          <div class="col-md-4 pr-0">
            <label>Nhập ngày cần tìm: </label>
            <input
              id="date"
              type="date"
              :value="dateInput"
              class="form-control"
              @change="dateInput=$event.target.value">
          </div>

          <div class="col-md-2 justify-content-end">
            <button class="btn btn-outline-primary float-right btn-width-160 mt-4" @click="fetchSchedules" >
              Tìm kiếm
            </button>
          </div>
        </div>


        <div class="grid grid-cols-12 gap-4 my-2">
          <div class="col-span-12 px-3">
          </div>
        </div>

        <div class="justify-content-end my-3">
          <div class="col-span-full">
            <p>
              Thời gian làm việc từ <b>{{workStartHour}}</b> đến <b>{{workEndHour}}</b>
            </p>
            Số kết quả: {{rows.length}}
          </div>
        </div>
        <div class="mx-[-15px]">
          <schedule-table
            id="schedule-table"
            locale="vi"
            :chart-start="from"
            :chart-end="to"
          >
            <staff-schedule
              v-for="row in styledRows"
              :key="row.label"
              :label="row.staff_name"
              :bars="row.schedules"
              bar-start="arrive_time"
              bar-end="leave_time"
            >
              <template #bar-label="{bar}">
                <span><b>{{barLabel(bar)}}</b></span>
              </template>
            </staff-schedule>
          </schedule-table>
        </div>

      </div>

    </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import GGanttChart from "@/components/Ganttastic/GGanttChart.vue"
import GGanttRow from "@/components/Ganttastic/GGanttRow.vue"
import adminAPI from "@/api/admin"

export default {
  components:{'schedule-table':GGanttChart,'staff-schedule':GGanttRow},
  data(){
    return {
      dateInput: null,
      from:null,to:null,
      rows:[]
    }
  },
  mounted(){
    this.dateInput = moment().format("YYYY-MM-DD")
    this.fetchSchedules();
  },
  computed:{
    workStartHour(){
      if (!this.from) return '';
      return moment(this.from).format("HH:mm");
    },
    workEndHour(){
      if (!this.to) return '';
      return moment(this.to).format("HH:mm");
    },
    styledRows(){
      return this.rows.map(row=>{
        const newSchedules = row.schedules.map( bar => {
          return {
            ...bar,ganttBarConfig:{background: "#f85f36"}
          }
        })
        return {...row,schedules:newSchedules}
      })
    }
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
    manageSchedule(){
      this.$router.push('/schedule/manage')
    },
    fetchSchedules(){
      adminAPI.getConfirmedSchedules({date:this.dateInput}).then(res=>{
        if(res.data.status == 200){
          console.log(res.data.data)
          const {schedules,from,to} = res.data.data;
          this.from = from;
          this.to = to;
          this.rows = schedules;
        }
      }).catch(err=>{
        this.popToast('danger',err.message)
      })
    },
    barLabel(bar){
      return `${moment(bar.arrive_time).format("HH:mm")} - ${moment(bar.leave_time).format("HH:mm")}`
    },

  }
}


</script>
<style>
.g-timeaxis-hour{
  font-weight: bold;
}
</style>
