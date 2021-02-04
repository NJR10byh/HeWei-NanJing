<template>
  <div class="Container-AddTaskInside">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
      <el-breadcrumb-item class="active"
        >任务编辑（ {{ taskid }} ）</el-breadcrumb-item
      >
    </el-breadcrumb>
    <div class="Task-container">
      <div class="Task-box">
        <el-form ref="form" :model="TaskInfo" label-position="left">
          <div class="part1">
            <el-form-item label="设备名称" class="DeviceName Device">
              <el-input
                v-model="TaskInfo.devicename"
                placeholder="请输入设备名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备类别" class="DeviceClazz Device">
              <el-input
                v-model="TaskInfo.deviceclazz"
                placeholder="请输入设备类别"
              ></el-input>
            </el-form-item>
            <el-form-item label="保养周期" class="TaskTime">
              每
              <el-select
                clearable
                placeholder="请选择"
                class="TaskTime-select"
                v-model="TaskInfo.scheduleType"
              >
                <el-option
                  v-for="item in tasktime"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="part2">
            <el-form-item label="保养部位" style="width:48%">
              <el-input
                v-model="TaskInfo.side"
                placeholder="请输入保养部位"
              ></el-input>
            </el-form-item>
            <el-form-item label="接受标准" style="width:48%">
              <el-input
                v-model="TaskInfo.acceptedStandard"
                placeholder="请输入接受标准"
              ></el-input>
            </el-form-item>
          </div>
          <div class="part2">
            <el-form-item label="保养内容" style="width:32%">
              <el-input
                class="inputStyle"
                type="textarea"
                v-model="TaskInfo.taskcontent"
                :rows="8"
              ></el-input>
            </el-form-item>
            <el-form-item label="保养工具及备件" style="width:32%">
              <el-input
                class="inputStyle"
                type="textarea"
                v-model="TaskInfo.tasktools"
                :rows="8"
              ></el-input>
            </el-form-item>
            <el-form-item label="注意事项" style="width:32%">
              <el-input
                class="inputStyle"
                type="textarea"
                v-model="TaskInfo.attention"
                :rows="8"
              ></el-input>
            </el-form-item>
          </div>
          <div class="Btns">
            <div class="sub-btn">
              <el-button @click="submittask">保存</el-button>
            </div>
            <div class="del-btn">
              <el-button>删除</el-button>
            </div>
          </div>
        </el-form>
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
    // console.log(that.$route.query.device[0].id);
    if (that.$route.query.devicename == undefined) {
      let url =
        "http://47.102.214.37:8080/device/" + that.$route.query.device[0].id;
      axios.get(url).then((res) => {
        that.TaskInfo.devicename = res.data.name;
        that.TaskInfo.deviceclazz = res.data.clazz;
      });
      setTimeout(function() {
        that.taskid = that.$route.query.id;
        that.TaskInfo.side = that.$route.query.side;
        that.TaskInfo.acceptedStandard = that.$route.query.acceptedStandard;
        that.TaskInfo.scheduleType = that.$route.query.scheduleType;
      }, 200);
    } else {
      that.taskid = that.$route.query.devicename;
      that.TaskInfo.devicename = that.$route.query.devicename;
      that.TaskInfo.deviceclazz = that.$route.query.deviceclazz;
    }
  },
  data() {
    return {
      taskid: "",
      TaskInfo: {},
      tasktime: [
        {
          value: "Predictability",
          label: "未知",
        },
        {
          value: "Yearly",
          label: "年",
        },
        {
          value: "Seasonally",
          label: "季度",
        },
        {
          value: "Monthly",
          label: "月",
        },
        {
          value: "Weekly",
          label: "周",
        },
        {
          value: "Daily",
          label: "天",
        },
      ],
      value: "",
    };
  },
  methods: {
    submittask() {
      let that = this;
      console.log(that.TaskInfo);
      axios.post("http://47.102.214.37:8080/ops/schedule", {
        acceptedStandard: that.TaskInfo.acceptedStandard,
        scheduleType: that.TaskInfo.scheduleType,
        side: that.TaskInfo.side,
      });
    },
  },
};
</script>

<style lang="scss">
.Container-AddTaskInside {
  // border: 1px solid red;
  width: 100%;
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
    width: 100%;
    // border: 1px solid red;
    display: flex;
    justify-content: center;
    .Task-box {
      width: 90%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      // border: 1px solid red;
      .el-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        background: #fff;
        border-radius: 20px;
        box-shadow: 5px 5px 20px #eeeeee, -5px 5px 20px #eeeeee;
        padding: 10px 30px 20px 30px;
        .part1 {
          display: flex;
          justify-content: flex-start;
          width: 100%;
        }
        .part2 {
          // border: 1px solid red;
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
        .inputStyle {
          width: 100%;
        }
        .el-form-item {
          margin: 0;
        }
        .Device {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-self: flex-start;
        }
        // 设备名称
        .DeviceName {
          margin-left: 0;
        }
        // 设备类别
        .DeviceClazz {
          margin-left: 20px;
        }
        // 保养周期
        .TaskTime {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-self: flex-start;
          margin-left: 20px;
          .TaskTime-select {
            width: 100px;
            margin-left: 10px;
          }
        }
        // 下面俩按钮
        .Btns {
          display: flex;
          margin-top: 20px;
          justify-content: space-between;
          width: 180px;
          // border: 1px solid red;
          .sub-btn {
            .el-button {
              width: 80px;
              background: linear-gradient(-270deg, #6eb5fc, #409eff);
              color: #fff;
              border: 0;
              padding: 10px;
              font-size: 15px;
              border-radius: 5px;
              &:hover {
                opacity: 0.9;
              }
            }
          }
          .del-btn {
            .el-button {
              width: 80px;
              background: linear-gradient(-270deg, #fca4a4, #f96b6c);
              color: #fff;
              border: 0;
              padding: 10px;
              font-size: 15px;
              border-radius: 5px;
              &:hover {
                opacity: 0.9;
              }
            }
          }
        }
      }
    }
  }
}
</style>
