<template>
  <div id="general-information" class="container-fluid">
    <b-card>
      <b-card-body class="p-4">
        <b-row>
          <b-col md='12'>
            <h4 class="text-center text-header">THÔNG TIN CHUNG</h4>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="8">
            <b-row>
              <b-col md="3">
                <b-button
                class="fix-width-btn-150 mt-1"
                key="arrivals"
                size="sm"
                variant="dark"
                :style="buttonStates.arrivals ? 'background:#F85F36' : ''"
                @click="switchToArrivals"
                >Sẽ Đến</b-button>
              </b-col>
              <b-col md="3">
                <b-button
                class="fix-width-btn-150 mt-1"
                key="departures"
                size="sm"
                variant="dark"
                :style="buttonStates.departures ? 'background:#F85F36' : ''"
                @click="switchToDepartures"
                >Sẽ Đi</b-button>
              </b-col>
              <b-col md="3">
                <b-button
                class="fix-width-btn-150 mt-1"
                key="stay_overs"
                size="sm"
                variant="dark"
                :style="buttonStates.stay_overs ? 'background:#F85F36' : ''"
                @click="switchToStayOvers"
                >Khách quá hạn đến</b-button>
              </b-col>
              <b-col md="3">
                <b-button
                class="fix-width-btn-150 mt-1"
                key="inhouse_guest"
                size="sm"
                variant="dark"
                :style="buttonStates.inhouse_guest ? 'background:#F85F36' : ''"
                @click="switchToInhouseGuest"
                >Khách đang lưu trú</b-button>
              </b-col>
            </b-row>
          </b-col>
          <b-col md="4">
            <b-row>
              <b-col md="6" class="mt-1">
                <b-form-select
                  v-model="selectedFilter"
                  :options="options"
                  @change="filterData"
                ></b-form-select>
              </b-col>
              <b-col md="6" class="mt-1">
                <b-form-input placeholder="Lọc" v-model="filterString" @keyup="filterData($event.target)" />
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <b-row style="margin-top: 20px">
          <b-table
            hover
            bordered
            stacked="md"
            :items="filteredRows"
            :fields="fields"
          >

            <template v-slot:cell(checkInTime)="data">
              {{data.value | format_date}}
            </template>

            <template v-slot:cell(checkOutTime)="data">
              {{data.value | format_date}}
            </template>

          </b-table>
        </b-row>
      </b-card-body>

      <!-- Loading -->
      <span class="loading-more" v-show="loading"><icon name="loading" width="60"/></span>
      <span class="loading-more">--Hết--</span>
    </b-card>
  </div>
</template>


<script>
import commonFunc from '@/common/commonFunc'
import adminAPI from "../../../api/admin";
export default {
  data() {
    return {
      fields: [
        {
          key: "room_name",
          label: "Tên phòng"
        },
        {
          key: "customer_name",
          label: "Tên KH"
        },
        {
          key: "phone_number",
          label: "Số điện thoại"
        },
        {
          key: "check_in",
          label: "Thời gian Check-in"
        },
        {
          key: "check_out",
          label: "Thời gian Check-out"
        }
      ],
      options: [
        { value: "customerName", text: "Tên KH" },
        { value: "customerPhone", text: "Số điện thoại KH" },
        { value: "roomName", text: "Tên phòng" }

      ],
      filterString: "",
      selectedFilter: "customerName",
      selectedGuestState: 'ARRIVALS',
      loading: true,
      filteredRows: [],
      filteredRowsStore: []
    };
  },
  mounted () {
    this.fetchGuestInformations();
  },
  computed: {
    buttonStates() {
      return {
        arrivals: this.selectedGuestState === "ARRIVALS",
        departures: this.selectedGuestState === "DEPARTURES",
        stay_overs: this.selectedGuestState === "STAY_OVERS",
        inhouse_guest: this.selectedGuestState === "INHOUSE_GUEST"
      };
    },
    // filteredRows() {
    //   if (this.selectedFilter)
    //     return this.selectedInformation.filter(row => {
    //       const searchTerm = this.filterString.toLowerCase();
    //       return row[this.selectedFilter].toLowerCase().includes(searchTerm);
    //     });
    //   return this.selectedInformation;
    // }
  },
  methods: {
    fetchGuestInformations() {
      this.filterString = ""
      this.selectedFilter = "customerName"

      // const params ={
      //   state: this.selectedGuestState,
      //   date: moment().format("YYYY-MM-DD")
      // }
      this.loading = true;
      adminAPI
        .getGeneralInfo(this.selectedGuestState)
        .then(res => {
          this.loading = false;
          if (res.data.data) {
            this.filteredRows = res.data.data;
            this.filteredRowsStore = JSON.parse(JSON.stringify(res.data.data))
          }
        })
        .catch(err => {
          this.loading = false;

          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        });
    },
    switchToArrivals() {
      this.selectedGuestState = "ARRIVALS";
      this.fetchGuestInformations();
    },
    switchToDepartures() {
      this.selectedGuestState = "DEPARTURES";
      this.fetchGuestInformations();
    },
    switchToStayOvers() {
      this.selectedGuestState = "STAY_OVERS";
      this.fetchGuestInformations();
    },
    switchToInhouseGuest() {
      this.selectedGuestState = "INHOUSE_GUEST";
      this.fetchGuestInformations();
    },

      filterData(item) {
        let items = JSON.parse(JSON.stringify(this.filteredRowsStore))

        let valueInput = item.value
          if(!valueInput) {
              valueInput = ""
          }
        if(this.selectedFilter == "customerName") {
            items = items.filter( i => i.customer_name.includes(valueInput) );
        }
        if(this.selectedFilter == "roomName") {
            items = items.filter( i => i.room_name.includes(valueInput) );
        }
        if(this.selectedFilter == "customerPhone") {
            items = items.filter( i => i.phone_number.includes(valueInput) );
        }

        this.filteredRows = items
      },
  }
};
</script>
<style scoped>
  #general-information .fix-width-btn-150 {
    width: 90%;
  }
</style>
