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
    <el-dialog title="选择任务" :visible.sync="dialogFormVisible">
      <el-select v-model="value1" multiple placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
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
    // console.log(new Date().getFullYear());
    that.thismonth = new Date().getMonth() + 1;
    that.thisyear = new Date().getFullYear();
    // axios.get("http://47.102.214.37:8080/user/me").then((res) => {
    //   console.log(res.data);
    // });
    let url =
      "http://47.102.214.37:8080/ops/dates/" +
      new Date().getFullYear() +
      "/" +
      (new Date().getMonth() + 1);
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
    // 获取全部维护任务
    axios
      .get("http://47.102.214.37:8080/ops/schedule?page=0&size=10")
      .then((res) => {
        console.log(res.data);
        for (let i = 0; i < res.data.content.length; i++) {
          that.options.push({
            label: res.data.content[i].name,
            value: res.data.content[i].id,
          });
        }
      });
  },
  data() {
    return {
      thismonth: null, // 当前月
      thisyear: null, // 当前年

      calendarApi: null,
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
          listPlugin,
        ],
        headerToolbar: {
          left: "prevYear nextYear",
          center: "title",
        },
        buttonText: {
          // 文本将显示在headerToolbar / footerToolbar的按钮上。不支持HTML注入。所有特殊字符将被转义。
          today: "今天",
          month: "月",
        },
        events: [],
        initialView: "dayGridMonth",
        editable: true,
        weekends: true,
        dayMaxEvents: true,
        navLinks: true,
        eventClick: this.handleEventClick,
        dateClick: this.handleDateClick,
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
              that.calendarOptions.events = [];
              let url =
                "http://47.102.214.37:8080/ops/dates/" +
                that.thisyear +
                "/" +
                that.thismonth;
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
              that.calendarOptions.events = [];
              let url =
                "http://47.102.214.37:8080/ops/dates/" +
                that.thisyear +
                "/" +
                that.thismonth;
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
              that.thisyear = new Date().getFullYear();
              that.calendarOptions.events = [];
              let url =
                "http://47.102.214.37:8080/ops/dates/" +
                that.thisyear +
                "/" +
                that.thismonth;
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
          prevYear: {
            click: () => {
              this.calendarApi.prevYear();
              let that = this;
              that.thisyear--;
              that.calendarOptions.events = [];
              console.log(that.thisyear);
              let url =
                "http://47.102.214.37:8080/ops/dates/" +
                that.thisyear +
                "/" +
                that.thismonth;
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
          nextYear: {
            click: () => {
              this.calendarApi.nextYear();
              let that = this;
              that.thisyear++;
              that.calendarOptions.events = [];
              console.log(that.thisyear);
              let url =
                "http://47.102.214.37:8080/ops/dates/" +
                that.thisyear +
                "/" +
                that.thismonth;
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

      // 弹出框
      dialogFormVisible: false,
      // 任务选择框
      options: [],
      value1: [],
      // 分配日期
      clickdate: "",
    };
  },
  methods: {
    handleEventClick(clickInfo) {
      let obj = {
        id: clickInfo.event.id,
      };
      this.$router.push({
        path: "./taskDetailInfo",
        query: obj,
      });
    },
    // 点击当天日期回调函数
    handleDateClick(dateClickInfo) {
      if (dateClickInfo.date.getMonth() + 1 < 10) {
        if (dateClickInfo.date.getDate() < 10) {
          this.clickdate =
            dateClickInfo.date.getFullYear() +
            "-0" +
            (dateClickInfo.date.getMonth() + 1) +
            "-0" +
            dateClickInfo.date.getDate();
        } else {
          this.clickdate =
            dateClickInfo.date.getFullYear() +
            "-0" +
            (dateClickInfo.date.getMonth() + 1) +
            "-" +
            dateClickInfo.date.getDate();
        }
      } else {
        if (dateClickInfo.date.getDate() < 10) {
          this.clickdate =
            dateClickInfo.date.getFullYear() +
            "-" +
            (dateClickInfo.date.getMonth() + 1) +
            "-0" +
            dateClickInfo.date.getDate();
        } else {
          this.clickdate =
            dateClickInfo.date.getFullYear() +
            "-" +
            (dateClickInfo.date.getMonth() + 1) +
            "-" +
            dateClickInfo.date.getDate();
        }
      }
      this.dialogFormVisible = true;
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
    submit() {
      let that = this;
      this.dialogFormVisible = false;
      for (var a = 0; a < that.value1.length; a++) {
        let url =
          "http://47.102.214.37:8080/ops/schedule/detail/" + that.value1[a];
        console.log(url);
        axios.get(url).then((res) => {
          console.log(res.data);
          let obj = {};
          obj.acceptedStandard = res.data.acceptedStandard;
          obj.content = res.data.content;
          obj.id = res.data.id;
          obj.name = res.data.name;
          obj.remark = res.data.remark;
          obj.scheduleType = res.data.scheduleType;
          obj.startDate = that.clickdate;
          obj.side = res.data.side;
          obj.tools = res.data.tools;
          obj.device = res.data.device;
          obj.ops = res.data.ops;
          obj.manager = res.data.manager;
          console.log(obj);
          setTimeout(function() {
            axios.put(url, obj).then((res) => {
              console.log(res);
              that.$message({
                message: "分配成功",
                type: "success",
              });
            });
            // location.reload();
          }, 200);
        });
      }
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
