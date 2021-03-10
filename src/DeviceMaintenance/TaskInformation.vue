<template>
  <div class="Container-TaskInfomation">
    <div class="calendar">
      <FullCalendar
        ref="fullCalendar"
        class="demo-app-calendar"
        :options="calendarOptions"
        @changeMonth="changeMonth"
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
  mounted() {
    // 这里有两点要注意，想要调用插件的方法，要在组件上设置ref
    // 并且在组件未加载的时候this.$refs中是没有fullCalendar的，所以未加载的时候调用方法会报错
    this.calendarApi = this.$refs.fullCalendar.getApi();
  },
  created() {
    let that = this;
    // console.log(new Date().getMonth() + 1);
    that.thismonth = new Date().getMonth() + 1;
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
      thismonth: null, // 当前月

      calendarApi: null,
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
        buttonText: {
          // 文本将显示在headerToolbar / footerToolbar的按钮上。不支持HTML注入。所有特殊字符将被转义。
          today: "今天",
          month: "月",
          week: "周",
          day: "天",
        },
        events: [],
        initialView: "dayGridMonth",
        editable: true,
        weekends: true,
        dayMaxEvents: true,
        navLinks: true,
        eventClick: this.handleEventClick,
        locale: "zh-cn",
        height: "100%",
        customButtons: {
          // 定义可在headerToolbar / footerToolbar中使用的自定义按钮
          prev: {
            // 上个月
            text: "PREV",
            click: () => {
              this.calendarApi.prev();
              let that = this;
              that.thismonth--;
              let url =
                "http://47.102.214.37:8080/ops/dates/2021/" + that.thismonth;
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
          },
          next: {
            // 下个月
            text: "NEXT",
            click: () => {
              this.calendarApi.next();
              let that = this;
              that.thismonth++;
              let url =
                "http://47.102.214.37:8080/ops/dates/2021/" + that.thismonth;
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
          },
          today: {
            text: "今天",
            click: () => {
              this.calendarApi.today();
              let that = this;
              that.thismonth = new Date().getMonth() + 1;
              let url =
                "http://47.102.214.37:8080/ops/dates/2021/" + that.thismonth;
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
          },
        },
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
    // 选择月份
    changeMonth(start, end, current) {
      console.log(
        "changeMonth",
        start.format(),
        end.format(),
        current.format()
      );
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
