<template>
  <div class="Container-TaskInfomation">
    <div class="calendar">
      <FullCalendar
        class="demo-app-calendar"
        :options="calendarOptions"
      ></FullCalendar>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

export default {
  name: "DeviceInformation",
  components: {
    FullCalendar,
  },
  created() {
    let that = this;
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      console.log(res.data);
    });
    let url =
      "http://47.102.214.37:8080/ops/dates/2021/" + (new Date().getMonth() + 1);
    axios.get(url).then((res) => {
      console.log(res);
      for (let i = 0; i < res.data.length; i++) {
        that.calendarOptions.events.push({
          id: res.data[i].schedule.id,
          title: res.data[i].schedule.name,
          start: res.data[i].date,
          backgroundColor: "#409eff",
          borderColor: "#409eff",
          textColor: "#fff",
        });
      }
    });
  },
  data() {
    return {
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
          listPlugin,
        ],
        headerToolbar: {
          left: "prevYear prev,next nextYear today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
        },
        events: [
          // put the array in the `events` property
          {
            title: "event1",
            start: "2021-03-04",
            backgroundColor: "#fa5555",
            borderColor: "#fa5555",
            textColor: "#fff",
          },
        ],
        initialView: "dayGridMonth",
        editable: true,
        weekends: true,
        dayMaxEvents: true,
        navLinks: true,
        eventClick: this.handleEventClick,
        height: "100%",
        /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
      },
      currentEvents: [],

      userRole: "", //用户类型
      userID: "",
    };
  },
  methods: {
    handleEventClick(clickInfo) {
      console.log(clickInfo);
      let obj = {
        id: clickInfo.event.id,
      };
      this.$router.push({
        path: "./taskDetailInfo",
        query: obj,
      });
    },
  },
};
</script>
<style lang="scss">
.Container-TaskInfomation {
  width: 100%;
  height: 95%;
  padding: 10px 0;
  // border: 1px solid blue;
  display: flex;
  justify-content: center;
  align-items: center;
  .calendar {
    // border: 1px solid red;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    .demo-app-calendar {
      // border: 1px solid red;
      width: 97%;
      height: 100%;
    }
  }
}
</style>
