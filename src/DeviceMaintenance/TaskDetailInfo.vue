<template>
  <div class="Container-TaskDetailInfo">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
      <el-breadcrumb-item class="active"
        >任务名称：{{ name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Task-container">
      <div class="Task-info">
        <div class="part">
          <div
            class="Text"
            style="font-size:20px;font-weight: 600;color:#409eff;"
          >
            任务卡
          </div>
        </div>
        <div class="Users">
          <div class="part0" style="width: 40%;">
            <div class="Text">维护人员</div>
            <div class="Info" v-for="(item, index) in users" :key="index">
              {{ item.usersName }}
            </div>
          </div>
        </div>
        <div class="Side-Standard">
          <div class="part1">
            <div class="Text">任务名称</div>
            <div class="Info">{{ name }}</div>
          </div>
          <div class="part1 Side">
            <div class="Text">保养部位</div>
            <div class="Info">{{ side }}</div>
          </div>
          <div class="part1 Standard">
            <div class="Text">接受标准</div>
            <div class="Info">{{ acceptedStandard }}</div>
          </div>
        </div>
        <div class="Name-Clazz-Time">
          <div class="part2 Name">
            <div class="Text">设备名称</div>
            <div class="Info" v-for="(item, index) in deviceinfo" :key="index">
              {{ item.deviceName }}
            </div>
          </div>
          <div class="part2 Clazz">
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
          <div class="part3 Content">
            <div class="Text">保养内容</div>
            <div
              class="Info contentInfo"
              v-for="(item, index) in content"
              :key="index"
            >
              <div style="font-size:18px;font-weight:bold;">
                <span style="font-size:15px;font-weight:bolder;color:#409eff;"
                  >|</span
                >
                {{ item.contentinfotitle }}
              </div>
              <div style="font-size:13px;">{{ item.contentinfotext }}</div>
            </div>
          </div>
          <div class="part3 Tools">
            <div class="Text">保养工具及备件</div>
            <div class="Info">
              {{ remark }}
            </div>
          </div>
          <div class="part3 Attention">
            <div class="Text">注意事项</div>
            <div class="Info">{{ remark }}</div>
          </div>
        </div>
      </div>
      <!-- 保养记录 -->
      <div class="Task-info Tasknotes-info">
        <div class="Users">
          <div class="part0" style="width: 40%;">
            <div class="Text" style="font-size:20px;color:#409eff;">
              保养记录
            </div>
          </div>
        </div>
        <div class="Side-Standard">
          <div class="part1" style="width: 45%;">
            <div class="Text">自我修复记录</div>
            <div class="Info">{{ fix }}</div>
          </div>
          <div class="part1 Side" style="width: 45%;">
            <div class="Text">是否存在「不能自我修复」的异常</div>
            <div class="Info">{{ hasException }}</div>
          </div>
        </div>
        <div class="Name-Clazz-Time">
          <div class="part2 Name" style="width: 45%;">
            <div class="Text">完成记录</div>
            <div class="Info" :style="aaa">
              <el-steps
                direction="vertical"
                :active="active"
                finish-status="success"
              >
                <el-step
                  v-for="(item, index) in records"
                  :title="item.record"
                  :key="index"
                >
                  <img :src="item.imgUrl"
                /></el-step>
              </el-steps>
            </div>
          </div>
          <div class="part2 Clazz" style="width: 45%;">
            <div class="Text">异常报告</div>
            <div class="Info" v-for="(item, index) in reports" :key="index">
              {{ item.report }}
            </div>
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
    that.taskid = that.$route.query.id;
    let url =
      "http://47.102.214.37:8080/ops/schedule/detail/" + that.$route.query.id;
    axios.get(url).then((res) => {
      console.log(res.data);
      // 任务名称
      that.name = res.data.name;
      if (that.scheduleType == null) {
        switch (res.data.scheduleType) {
          case "Yearly":
            that.scheduleType = "年保养";
            break;
          case "Seasonly":
            that.scheduleType = "季度保养";
            break;
          case "Monthly":
            that.scheduleType = "月保养";
            break;
          case "Weekly":
            that.scheduleType = "周保养";
            break;
          case "Daily":
            that.scheduleType = "日保养";
            break;
          default:
            break;
        }
      }
      // 保养天数
      if (that.startDate == null) {
        that.startDate = res.data.startDate;
      }
      if (that.scheduleType == "日保养") {
        that.scheduleType_info = "天";
      }
      if (that.scheduleType == "周保养") {
        switch (that.startDate) {
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
      } else if (that.scheduleType == "月保养") {
        that.scheduleType_info = "月 " + that.startDate.split("-")[2] + " 号";
      } else if (that.scheduleType == "年保养") {
        that.scheduleType_info = "年第" + that.startDate + "天";
      }
      // 保养部位
      if (that.side == null) {
        that.side = res.data.side;
      }
      // 接受标准
      if (that.acceptedStandard == null) {
        that.acceptedStandard = res.data.acceptedStandard;
      }
      // 保养内容
      if (res.data.content != "") {
        for (let a = 0; a < res.data.content.length; a++) {
          that.content.push({
            contentinfotitle: res.data.content[a].title,
            contentinfotext: res.data.content[a].detail,
          });
        }
      }
      if (res.data.tools != "") {
        that.tools = res.data.tools;
      }
      if (res.data.remark != "") {
        that.remark = res.data.remark;
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
        let searchops = "http://47.102.214.37:8080/user/" + res.data.ops[i].id;
        axios.get(searchops).then((res) => {
          that.users.push({
            usersName: res.data.name + "（ id：" + res.data.id + " ）",
          });
        });
      }
    });

    setTimeout(() => {
      // 保养记录
      let URL =
        "http://47.102.214.37:8080/ops/record/schedule/" +
        that.$route.query.id +
        "?page=0&size=100";
      axios.get(URL).then((res) => {
        console.log(res.data);
        that.active = res.data.content.length - 1;
        that.aaa = "height: " + (res.data.content.length - 1) * 70 + "px;";
        for (let i = 0; i < res.data.content.length; i++) {
          that.records.push({
            record: res.data.content[i].record,
            imgUrl: "http://47.102.214.37:8080/pic/" + res.data.content[i].pic,
          });
          that.reports.push({
            report: res.data.content[i].report,
          });
          if (i == res.data.content.length - 1) {
            console.log(res.data.content[i]);
            that.fix = res.data.content[i].fix;
            that.hasException = res.data.content[i].hasException;
          }
        }
      });
    }, 300);
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
      startDate: null,
      scheduleType_info: null,
      /* part3 */
      content: [], // 保养内容
      tools: null, // 保养工具及备件
      remark: null, // 注意事项

      /* 保养记录 */
      // Part1
      fix: "", // 自我修复记录
      hasException: false, // 是否存在「不能自我修复」的异常
      records: [], // 完成记录
      aaa: "",
      active: 0,
      reports: [], // 异常报告
      // Part2
    };
  },
  methods: {},
};
</script>

<style lang="scss">
.Container-TaskDetailInfo {
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
    }
    .Task-info {
      width: 85%;
      background: #fff;
      border-radius: 15px;
      box-shadow: 5px 5px 20px #eeeeee, -5px 5px 20px #eeeeee;
      padding: 10px 20px;
      margin-top: 10px;
      // border: 1px solid red;
      .part {
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
        display: flex;
        justify-content: flex-start;
      }
      .Users {
        // border: 1px solid red;
        border-bottom: 1px solid #ddd;
        padding: 10px 0;
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
        width: 100%;
        .part1 {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 33%;
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
        width: 100%;
        .part2 {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          // border: 1px solid red;
          width: 33%;
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
        // border: 1px solid red;
        padding-top: 10px;
        display: flex;
        justify-content: flex-start;
        width: 100%;
        .part3 {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 33%;
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
          .contentInfo {
            // border: 1px solid red;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
          }
        }
      }
    }
    .Tasknotes-info {
      margin-bottom: 20px;
    }
  }
}
</style>
