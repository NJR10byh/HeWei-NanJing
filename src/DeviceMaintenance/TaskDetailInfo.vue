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
      <div class="Task-info">
        <div class="Side-Standard">
          <div class="part1 Side">
            <div class="Text">保养部位</div>
            <div class="Info">{{ side }}</div>
          </div>
          <div class="part1 Standard">
            <div class="Text" style="width:126px">接受标准</div>
            <div class="Info">{{ standard }}</div>
          </div>
          <div class="part1" style="margin-right: 20px;width:72px"></div>
        </div>
        <div class="Name-Clazz-Time">
          <div class="part2 Name">
            <div class="Text">设备名称</div>
            <div class="Info" v-for="(item, index) in deviceinfo" :key="index">
              {{ item.deviceName }}
            </div>
          </div>
          <div class="part2 Clazz">
            <div class="Text" style="width:126px">设备类别</div>
            <div class="Info" v-for="(item, index) in deviceinfo" :key="index">
              {{ item.deviceClazz }}
            </div>
          </div>
          <div class="part2 Time">
            <div class="Text">保养周期</div>
            <div class="Info">{{ Time }}</div>
          </div>
        </div>
        <div class="Content-Tools-Attention">
          <div class="part3 Content">
            <div class="Text">保养内容</div>
            <div class="Info">{{ content }}</div>
          </div>
          <div class="part3 Tools">
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
      deviceinfo: [
        {
          deviceName: "iPad Pro",
          deviceClazz: "平板电脑",
        },
        {
          deviceName: "iPad Pro",
          deviceClazz: "平板电脑",
        },
      ],
      // 周期
      Time: "Weekly",
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
    padding: 10px 0 20px 0;
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
    justify-content: center;
    .Task-info {
      width: 85%;
      background: #fff;
      border-radius: 15px;
      box-shadow: 5px 5px 20px #eeeeee, -5px 5px 20px #eeeeee;
      padding: 10px 20px;
      // border: 1px solid red;
      .Side-Standard {
        // border: 1px solid red;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
        display: flex;
        justify-content: space-between;
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
        justify-content: space-between;
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
        .Time {
          margin-right: 20px;
        }
      }
      .Content-Tools-Attention {
        padding-top: 10px;
        display: flex;
        justify-content: space-between;
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
        .Attention {
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
