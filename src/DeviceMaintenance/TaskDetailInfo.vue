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
      </div>
      <div class="Task-info">
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
  name: "AddTaskInside",
  created: function() {
    let that = this;
    console.log(that.$route.query);
    that.taskid = that.$route.query.taskID;
    let url =
      "http://47.102.214.37:8080/ops/schedule/detail/" +
      that.$route.query.taskID;
    axios.get(url).then((res) => {
      console.log(res.data);
      // 保养周期
      if (res.data.scheduleType == null) {
        that.scheduleType = res.data.parent.scheduleType;
      } else {
        that.scheduleType = res.data.scheduleType;
      }
      // 保养天数
      if (res.data.scheduleDay == null) {
        that.scheduleDay = res.data.parent.scheduleDay;
      } else {
        that.scheduleDay = res.data.scheduleDay;
      }
      if (that.scheduleType == "Daily") {
        that.scheduleType_info = "天";
      }
      if (that.scheduleType == "Weekly") {
        switch (res.data.scheduleDay) {
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
      // 任务名称
      that.name = res.data.name;
      // 保养部位
      if (res.data.side == null) {
        that.side = res.data.parent.side;
      } else {
        that.side = res.data.side;
      }
      // 接受标准
      if (res.data.acceptedStandard == null) {
        that.acceptedStandard = res.data.parent.acceptedStandard;
      } else {
        that.acceptedStandard = res.data.acceptedStandard;
      }
      // 保养内容
      if (res.data.content.length == 0) {
        for (let j = 0; j < res.data.parent.content.length; j++) {
          that.content.push({
            contentinfo: res.data.parent.content[j],
          });
        }
      } else {
        for (let j = 0; j < res.data.content.length; j++) {
          that.content.push({
            contentinfo: res.data.content[j],
          });
        }
      }
      // 保养工具
      if (res.data.tools.length == 0) {
        for (let j = 0; j < res.data.parent.tools.length; j++) {
          that.tools.push({
            toolsinfo: res.data.parent.tools[j],
          });
        }
      } else {
        for (let k = 0; k < res.data.tools.length; k++) {
          that.tools.push({
            toolsinfo: res.data.tools[k],
          });
        }
      }
      // 注意事项;
      if (res.data.remark == null) {
        that.remark = res.data.parent.remark;
      } else {
        that.remark = res.data.remark;
      }
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
    });
  },
  data() {
    return {
      taskid: "", //任务ID
      /* part1 */
      name: "", // 任务名称
      side: "", // 保养部位
      acceptedStandard: "", // 接受标准
      /* part2 */
      // 设备信息
      deviceinfo: [],
      // 周期
      scheduleType: "",
      scheduleDay: "",
      scheduleType_info: "",
      /* part3 */
      content: [], // 保养内容
      tools: [], // 保养工具及备件
      remark: "", // 注意事项
    };
  },
  methods: {
    back() {
      this.$router.push({
        path: "/taskInformation",
      });
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
      .Side-Standard {
        // border: 1px solid red;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
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
          // padding-right: 10px;
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
