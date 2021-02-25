<template>
  <div class="Container-AddTaskInside">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
      <el-breadcrumb-item class="active"
        >任务名称：{{ name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Task-container">
      <div class="backbtn">
        <el-button @click="back">返回</el-button>
        <el-button @click="error" class="error">异常报告</el-button>
      </div>
      <div class="Task-info">
        <div class="Users">
          <div class="part0" style="width: 40%;">
            <div class="Text">维护人员</div>
            <div class="Info" v-for="(item, index) in users" :key="index">
              {{ item.usersName }}
            </div>
          </div>
        </div>
        <div class="Side-Standard">
          <div class="part1" style="width: 40%;">
            <div class="Text">任务名称</div>
            <div class="Info">{{ name }}</div>
          </div>
          <div class="part1 Side" style="width: 40%;">
            <div class="Text">保养部位</div>
            <div class="Info">{{ side }}</div>
          </div>
          <div class="part1 Standard">
            <div class="Text">接受标准</div>
            <div class="Info">{{ acceptedStandard }}</div>
          </div>
        </div>
        <div class="Name-Clazz-Time">
          <div class="part2 Name" style="width: 40%;">
            <div class="Text">设备名称</div>
            <div class="Info" v-for="(item, index) in deviceinfo" :key="index">
              {{ item.deviceName }}
            </div>
          </div>
          <div class="part2 Clazz" style="width: 40%;">
            <div class="Text">设备类别</div>
            <div class="Info" v-for="(item, index) in deviceinfo" :key="index">
              {{ item.deviceClazz }}
            </div>
          </div>
          <div class="part2 Time">
            <div class="Text">保养周期</div>
            <div class="Info">
              {{ scheduleType }}<span>（每{{ scheduleType_info }}）</span>
            </div>
          </div>
        </div>
        <div class="Content-Tools-Attention">
          <div class="part3 Content" style="width: 40%;">
            <div class="Text">保养内容</div>
            <div class="Info" v-for="(item, index) in content" :key="index">
              {{ item.contentinfo }}
            </div>
          </div>
          <div class="part3 Tools" style="width: 40%;">
            <div class="Text">保养工具及备件</div>
            <div class="Info" v-for="(item, index) in tools" :key="index">
              {{ item.toolsinfo }}
            </div>
          </div>
          <div class="part3 Attention">
            <div class="Text">注意事项</div>
            <div class="Info">{{ remark }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  created: function() {
    let that = this;
    console.log(that.$route.query);
    that.taskid = that.$route.query.taskID;
    let url =
      "http://47.102.214.37:8080/ops/schedule/detail/" +
      that.$route.query.taskID;
    axios.get(url).then((res) => {
      console.log(res.data);
      // 任务名称
      that.name = res.data.name;
      let i = res.data;
      while (i.parent != null) {
        // 保养周期
        if (i.scheduleType != null && that.scheduleType == null) {
          that.scheduleType = i.scheduleType;
        }
        // 保养天数
        if (i.scheduleDay != null && that.scheduleDay == null) {
          that.scheduleDay = i.scheduleDay;
        }
        if (that.scheduleType == "Daily") {
          that.scheduleType_info = "天";
        }
        if (that.scheduleType == "Weekly") {
          switch (that.scheduleDay) {
            case 1:
              that.scheduleType_info = "周一";
              break;
            case 2:
              that.scheduleType_info = "周二";
              break;
            case 3:
              that.scheduleType_info = "周三";
              break;
            case 4:
              that.scheduleType_info = "周四";
              break;
            case 5:
              that.scheduleType_info = "周五";
              break;
            case 6:
              that.scheduleType_info = "周六";
              break;
            case 7:
              that.scheduleType_info = "周日";
              break;
            default:
              break;
          }
        } else if (that.scheduleType == "Monthly") {
          that.scheduleType_info = "月" + that.scheduleDay + "号";
        } else if (that.scheduleType == "Yearly") {
          that.scheduleType_info = "年第" + that.scheduleDay + "天";
        }
        if (i.side != null && that.side == null) {
          that.side = i.side;
        }
        if (i.acceptedStandard != null && that.acceptedStandard == null) {
          that.acceptedStandard = i.acceptedStandard;
        }
        if (i.content != "" && that.content == "") {
          for (let a = 0; a < i.content.length; a++) {
            that.content.push({
              contentinfo: i.content[a],
            });
          }
        }
        if (i.tools != "" && that.tools == "") {
          for (let b = 0; b < i.content.length; b++) {
            that.tools.push({
              toolsinfo: i.tools[b],
            });
          }
        }
        if (i.remark != null && that.remark == null) {
          that.remark = i.remark;
        }
        console.log(i);
        i = i.parent;
      }
      console.log(i);
      if (that.scheduleType == null) {
        that.scheduleType = i.scheduleType;
      }
      // 保养天数
      if (that.scheduleDay == null) {
        that.scheduleDay = i.scheduleDay;
      }
      if (that.scheduleType == "Daily") {
        that.scheduleType_info = "天";
      }
      if (that.scheduleType == "Weekly") {
        switch (that.scheduleDay) {
          case 1:
            that.scheduleType_info = "周一";
            break;
          case 2:
            that.scheduleType_info = "周二";
            break;
          case 3:
            that.scheduleType_info = "周三";
            break;
          case 4:
            that.scheduleType_info = "周四";
            break;
          case 5:
            that.scheduleType_info = "周五";
            break;
          case 6:
            that.scheduleType_info = "周六";
            break;
          case 7:
            that.scheduleType_info = "周日";
            break;
          default:
            break;
        }
      } else if (that.scheduleType == "Monthly") {
        that.scheduleType_info = "月" + that.scheduleDay + "号";
      } else if (that.scheduleType == "Yearly") {
        that.scheduleType_info = "年第" + that.scheduleDay + "天";
      }
      if (that.side == null) {
        that.side = i.side;
      }
      if (that.acceptedStandard == null) {
        that.acceptedStandard = i.acceptedStandard;
      }
      if (i.content != "") {
        for (let a = 0; a < i.content.length; a++) {
          that.content.push({
            contentinfo: i.content[a],
          });
        }
      }
      if (i.tools != "") {
        for (let b = 0; b < i.content.length; b++) {
          that.tools.push({
            toolsinfo: i.tools[b],
          });
        }
      }
      if (that.remark == null) {
        that.remark = i.remark;
      }
      // 设备名称
      for (let i = 0; i < res.data.device.length; i++) {
        let searchdevice =
          "http://47.102.214.37:8080/device/" + res.data.device[i].id;
        axios.get(searchdevice).then((res) => {
          that.deviceinfo.push({
            deviceName: res.data.name,
            deviceClazz: res.data.clazz,
          });
        });
      }
      // 维护人员
      for (let i = 0; i < res.data.ops.length; i++) {
        let searchops =
          "http://47.102.214.37:8080/user/query?id==" + res.data.ops[i].id;
        axios.get(searchops).then((res) => {
          console.log(res.data.content[0]);
          that.users.push({
            usersName:
              res.data.content[0].name +
              "（ id：" +
              res.data.content[0].id +
              " ）",
          });
        });
      }
    });
  },
  data() {
    return {
      taskid: "", //任务ID
      /* part1 */
      users: [], // 维护人员
      name: null, // 任务名称
      side: null, // 保养部位
      acceptedStandard: null, // 接受标准
      /* part2 */
      // 设备信息
      deviceinfo: [],
      // 周期
      scheduleType: null,
      scheduleDay: null,
      scheduleType_info: null,
      /* part3 */
      content: [], // 保养内容
      tools: [], // 保养工具及备件
      remark: null, // 注意事项
    };
  },
  methods: {
    back() {
      this.$router.push({
        path: "/taskInformation",
      });
    },
    error() {
      let that = this;
      axios.get("http://47.102.214.37:8080/user/me").then((res) => {
        console.log(res.data);
        that.$router.push({
          path: "./errorTask",
          query: {
            id: res.data.id,
            name: res.data.name,
            username: res.data.username,
            taskid: that.$route.query.taskID,
          },
        });
      });
      console.log("error", this.$route.query.taskID);
    },
  },
};
</script>

<style lang="scss">
.Container-AddTaskInside {
  // border: 1px solid red;
  width: 100%;
  height: 100%;
  .breadcrumb {
    width: 100%;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    font-size: 16px;
    // border: 1px solid red;
    padding: 10px 0 10px 0;
    .el-breadcrumb__inner {
      font-weight: bold;
      margin-left: 10px;
    }
    .el-breadcrumb__inner.is-link {
      color: #666666;
      font-weight: normal;
    }
    .active {
      font-size: 20px;
    }
  }
  .Task-container {
    // height: 80%;
    // border: 1px solid red;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .backbtn {
      width: 85%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // border: 1px solid red;
      .el-button {
        display: flex;
        align-self: flex-start;
        background: #409eff;
        color: #fff;
        border: 0;
        font-size: 15px;
        padding: 8px 15px;
      }
      .error {
        background: #ffbc05;
      }
    }
    .Task-info {
      width: 85%;
      background: #fff;
      border-radius: 15px;
      box-shadow: 5px 5px 20px #eeeeee, -5px 5px 20px #eeeeee;
      padding: 10px 20px;
      margin-top: 10px;
      // border: 1px solid red;
      .Users {
        // border: 1px solid red;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
        display: flex;
        justify-content: flex-start;
        .part0 {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .Text {
            // border: 1px solid red;
            font-size: 18px;
            font-weight: 600;
          }
          .Info {
            // border: 1px solid red;
            margin-top: 10px;
            display: flex;
            justify-content: flex-start;
            font-size: 14px;
            font-weight: 400;
          }
        }
      }
      .Side-Standard {
        // border: 1px solid red;
        border-bottom: 1px solid #ddd;
        padding: 10px 0;
        display: flex;
        justify-content: flex-start;
        .part1 {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .Text {
            // border: 1px solid red;
            font-size: 18px;
            font-weight: 600;
          }
          .Info {
            // border: 1px solid red;
            margin-top: 10px;
            display: flex;
            justify-content: flex-start;
            font-size: 14px;
            font-weight: 400;
          }
        }
      }
      .Name-Clazz-Time {
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: flex-start;
        .part2 {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .Text {
            // border: 1px solid red;
            font-size: 18px;
            font-weight: 600;
          }
          .Info {
            // border: 1px solid red;
            margin-top: 10px;
            display: flex;
            justify-content: flex-start;
            font-size: 14px;
            font-weight: 400;
          }
        }
      }
      .Content-Tools-Attention {
        padding-top: 10px;
        display: flex;
        justify-content: flex-start;
        .part3 {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          // border: 1px solid red;
          .Text {
            // border: 1px solid red;
            font-size: 18px;
            font-weight: 600;
          }
          .Info {
            // border: 1px solid red;
            margin-top: 10px;
            display: flex;
            justify-content: flex-start;
            font-size: 14px;
            font-weight: 400;
            padding-right: 10px;
          }
        }
      }
    }
  }
}
</style>
