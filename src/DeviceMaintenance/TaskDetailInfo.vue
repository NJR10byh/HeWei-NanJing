<template>
  <div class="Container-AddTaskInside">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
      <el-breadcrumb-item class="active"
        >任务ID：{{ taskid }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Task-container">
      <div class="backbtn">
        <el-button @click="back">返回</el-button>
      </div>
      <div class="Task-info">
        <div class="Side-Standard">
          <div class="part1 Side" style="width: 40%;">
            <div class="Text">保养部位</div>
            <div class="Info">{{ side }}</div>
          </div>
          <div class="part1 Standard">
            <div class="Text">接受标准</div>
            <div class="Info">{{ standard }}</div>
          </div>
          <div class="part1" style="margin-right: 20px;"></div>
        </div>
        <div class="Name-Clazz-Time">
          <div class="part2 Name" style="width: 40%;">
            <div class="Text">设备名称</div>
            <div class="Info" v-for="(item, index) in deviceinfo" :key="index">
              {{ item.deviceName }}
            </div>
          </div>
          <div class="part2 Clazz" style="width: 40%;">
            <div class="Text" style="width:126px">设备类别</div>
            <div class="Info" v-for="(item, index) in deviceinfo" :key="index">
              {{ item.deviceClazz }}
            </div>
          </div>
          <div class="part2 Time">
            <div class="Text">保养周期</div>
            <div class="Info">
              {{ Time }}<span>（每{{ Time_info }}）</span>
            </div>
          </div>
        </div>
        <div class="Content-Tools-Attention">
          <div class="part3 Content" style="width: 40%;">
            <div class="Text">保养内容</div>
            <div class="Info">{{ content }}</div>
          </div>
          <div class="part3 Tools" style="width: 40%;">
            <div class="Text">保养工具及备件</div>
            <div class="Info">{{ tools }}</div>
          </div>
          <div class="part3 Attention">
            <div class="Text">注意事项</div>
            <div class="Info">{{ attention }}</div>
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
    that.taskid = that.$route.query.taskName;
    let url =
      "http://47.102.214.37:8080/ops/schedule/detail/" +
      that.$route.query.taskName;
    axios.get(url).then((res) => {
      console.log(res.data);
      that.standard = res.data.acceptedStandard;
      that.side = res.data.side;
      that.Time = res.data.scheduleType;
      if (that.Time == "Daily") {
        that.Time_info = "天";
      }
      if (that.Time == "Weekly") {
        switch (res.data.scheduleDay) {
          case 1:
            that.Time_info = "周一";
            break;
          case 2:
            that.Time_info = "周二";
            break;
          case 3:
            that.Time_info = "周三";
            break;
          case 4:
            that.Time_info = "周四";
            break;
          case 5:
            that.Time_info = "周五";
            break;
          case 6:
            that.Time_info = "周六";
            break;
          case 7:
            that.Time_info = "周日";
            break;
          default:
            break;
        }
      } else if (that.Time == "Monthly") {
        that.Time_info = "月" + res.data.scheduleDay + "号";
      } else if (that.Time == "Yearly") {
        that.Time_info = "年第" + res.data.scheduleDay + "天";
      }
      for (var i = 0; i < res.data.device.length; i++) {
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
      side: "", // 保养部位
      standard: "", // 接受标准
      /* part2 */
      // 设备信息
      deviceinfo: [],
      // 周期
      Time: "",
      Time_info: "a",
      /* part3 */
      content: "", // 保养内容
      tools: "", // 保养工具及备件
      attention: "", // 注意事项
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
    }
  }
}
</style>
