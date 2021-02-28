<template>
  <div class="Container-AddTaskInside">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
      <el-breadcrumb-item class="active">新增模版</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Task-container">
      <div class="Task-box">
        <el-form ref="form" :model="TaskInfo" label-position="left">
          <div class="part1">
            <el-form-item label="保养周期" class="TaskTime">
              <div class="TaskTime_exp">
                每
                <el-select
                  clearable
                  placeholder="请选择"
                  class="TaskTime-select"
                  v-model="TaskInfo.scheduleType"
                  :disabled="scheduleTypedisabled"
                  @change="changescheduleType"
                >
                  <el-option
                    v-for="item in tasktime"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-input
                  v-model="TaskInfo.scheduleDay"
                  class="TaskTime-input"
                  placeholder="每周几，每月几号，每季度第几月，每年第几天，只填数字 (每天填写0)"
                  type="number"
                  :disabled="scheduleDaydisabled"
                  @input="changescheduleDay"
                ></el-input>
              </div>
            </el-form-item>
          </div>
          <div class="part2">
            <el-form-item label="任务名称" style="width:32%">
              <el-input
                v-model="TaskInfo.name"
                placeholder="请输入任务名称"
                @input="changename"
              ></el-input>
            </el-form-item>
            <el-form-item label="保养部位" style="width:32%">
              <el-input
                v-model="TaskInfo.side"
                placeholder="请输入保养部位"
                :disabled="sidedisabled"
                @input="changeside"
              ></el-input>
            </el-form-item>
            <el-form-item label="接受标准" style="width:32%">
              <el-input
                v-model="TaskInfo.acceptedStandard"
                placeholder="请输入接受标准"
                :disabled="acceptedStandarddisabled"
                @input="changeacceptedStandard"
              ></el-input>
            </el-form-item>
          </div>
          <div class="part2">
            <el-form-item label="保养内容" style="width:32%">
              <el-input
                class="inputStyle"
                type="textarea"
                v-model="TaskInfo.content"
                :rows="8"
                :disabled="contentdisabled"
                @input="changecontent"
              ></el-input>
            </el-form-item>
            <el-form-item label="保养工具及备件" style="width:32%">
              <el-input
                class="inputStyle"
                type="textarea"
                v-model="TaskInfo.tools"
                :rows="8"
                :disabled="toolsdisabled"
                @input="changetools"
              ></el-input>
            </el-form-item>
            <el-form-item label="注意事项" style="width:32%">
              <el-input
                class="inputStyle"
                type="textarea"
                v-model="TaskInfo.remark"
                :rows="8"
                :disabled="remarkdisabled"
                @input="changeremark"
              ></el-input>
            </el-form-item>
          </div>
          <div class="Btns">
            <div class="sub-btn">
              <el-button @click="submittask">保存并提交</el-button>
            </div>
            <div class="cancel-btn">
              <el-button @click="cancel">取消</el-button>
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
    if (this.$route.query.taskID != undefined) {
      let url =
        "http://47.102.214.37:8080/ops/schedule/detail/" +
        this.$route.query.taskID;
      axios.get(url).then((res) => {
        that.submitTaskInfo.parent.id = res.data.id;
        let i = res.data;
        if (i.scheduleType != null) {
          that.TaskInfo.scheduleType = i.scheduleType;
          that.scheduleTypedisabled = false;
        }
        if (i.scheduleDay != null) {
          that.TaskInfo.scheduleDay = i.scheduleDay;
          that.scheduleDaydisabled = false;
        }
        if (i.side != null) {
          that.TaskInfo.side = i.side;
          that.sidedisabled = false;
        }
        if (i.acceptedStandard != null) {
          that.TaskInfo.acceptedStandard = i.acceptedStandard;
          that.acceptedStandarddisabled = false;
        }
        if (i.content != "") {
          that.TaskInfo.content = i.content.join("\n");
          that.contentdisabled = false;
        }
        if (i.tools != "") {
          that.TaskInfo.tools = i.tools.join("\n");
          that.toolsdisabled = false;
        }
        if (i.remark != null) {
          that.TaskInfo.remark = i.remark;
          that.remarkdisabled = false;
        }
      });
    } else {
      that.submitTaskInfo.parent = null;
      that.scheduleTypedisabled = false;
      that.scheduleDaydisabled = false;
      that.sidedisabled = false;
      that.acceptedStandarddisabled = false;
      that.contentdisabled = false;
      that.toolsdisabled = false;
      that.remarkdisabled = false;
    }
  },
  data() {
    return {
      TaskInfo: {
        scheduleType: null,
        scheduleDay: null,
        name: null,
        side: null,
        acceptedStandard: null,
        content: null,
        tools: null,
        remark: null,
      },
      submitTaskInfo: {
        scheduleType: null,
        scheduleDay: null,
        name: null,
        side: null,
        acceptedStandard: null,
        content: null,
        tools: null,
        remark: null,
        parent: { id: "" },
      },
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
      scheduleTypedisabled: true,
      scheduleDaydisabled: true,
      sidedisabled: true,
      acceptedStandarddisabled: true,
      contentdisabled: true,
      toolsdisabled: true,
      remarkdisabled: true,
    };
  },
  methods: {
    // 保养周期改变
    changescheduleType(res) {
      this.submitTaskInfo.scheduleType = null;
      this.submitTaskInfo.scheduleType = res;
    },
    // 保养周期天数改变
    changescheduleDay(res) {
      this.submitTaskInfo.scheduleDay = null;
      this.submitTaskInfo.scheduleDay = res;
    },
    // 任务名称改变
    changename(res) {
      this.submitTaskInfo.name = null;
      this.submitTaskInfo.name = res;
    },
    // 保养部位改变
    changeside(res) {
      this.submitTaskInfo.side = null;
      this.submitTaskInfo.side = res;
    },
    // 接受标准改变
    changeacceptedStandard(res) {
      this.submitTaskInfo.acceptedStandard = null;
      this.submitTaskInfo.acceptedStandard = res;
    },
    // 保养内容改变
    changecontent(res) {
      this.submitTaskInfo.content = null;
      this.submitTaskInfo.content = res.replace(/\n/g, ",").split(",");
    },
    // 保养工具改变
    changetools(res) {
      this.submitTaskInfo.tools = null;
      this.submitTaskInfo.tools = res.replace(/\n/g, ",").split(",");
    },
    // 注意事项改变
    changeremark(res) {
      this.submitTaskInfo.remark = null;
      this.submitTaskInfo.remark = res;
    },
    // 保存编辑并提交
    submittask() {
      let that = this;
      if (this.$route.query.taskID != undefined) {
        if (that.submitTaskInfo.scheduleType == "") {
          that.submitTaskInfo.scheduleType = null;
        }
        if (that.submitTaskInfo.scheduleDay == "") {
          that.submitTaskInfo.scheduleDay = null;
        }
        if (that.submitTaskInfo.side == "") {
          that.submitTaskInfo.side = null;
        }
        if (that.submitTaskInfo.acceptedStandard == "") {
          that.submitTaskInfo.acceptedStandard = null;
        }
        if (that.submitTaskInfo.remark == "") {
          that.submitTaskInfo.remark = null;
        }
        if (that.submitTaskInfo.content == "") {
          that.submitTaskInfo.content = null;
        }
        if (that.submitTaskInfo.tools == "") {
          that.submitTaskInfo.tools = null;
        }
        console.log(that.submitTaskInfo);
        axios
          .post("http://47.102.214.37:8080/ops/schedule", that.submitTaskInfo)
          .then((res) => {
            if (res.data.message == "ok") {
              this.$message({
                message: "新建成功",
                type: "success",
              });
              this.$router.push({
                path: "/addTask",
              });
            }
          });
      } else {
        if (
          that.TaskInfo.scheduleType == null ||
          that.TaskInfo.scheduleDay == null ||
          that.TaskInfo.name == null ||
          that.TaskInfo.side == null ||
          that.TaskInfo.remark == null ||
          that.TaskInfo.content == null ||
          that.TaskInfo.tools == null ||
          that.TaskInfo.acceptedStandard == null ||
          that.TaskInfo.content == "" ||
          that.TaskInfo.tools == "" ||
          that.TaskInfo.scheduleType == "" ||
          that.TaskInfo.scheduleDay == "" ||
          that.TaskInfo.name == "" ||
          that.TaskInfo.side == "" ||
          that.TaskInfo.acceptedStandard == "" ||
          that.TaskInfo.remark == ""
        ) {
          this.$message({
            message: "请将信息填写完整（无内容可填写：无）",
            type: "warning",
          });
          return;
        } else {
          that.submitTaskInfo.scheduleType = that.TaskInfo.scheduleType;
          that.submitTaskInfo.scheduleDay = that.TaskInfo.scheduleDay;
          that.submitTaskInfo.name = that.TaskInfo.name;
          that.submitTaskInfo.side = that.TaskInfo.side;
          that.submitTaskInfo.acceptedStandard = that.TaskInfo.acceptedStandard;
          that.submitTaskInfo.content = that.TaskInfo.content
            .replace(/\n/g, ",")
            .split(",");
          that.submitTaskInfo.tools = that.TaskInfo.tools
            .replace(/\n/g, ",")
            .split(",");
          that.submitTaskInfo.remark = that.TaskInfo.remark;
          console.log(that.submitTaskInfo);
          axios
            .post("http://47.102.214.37:8080/ops/schedule", that.submitTaskInfo)
            .then((res) => {
              if (res.data.message == "ok") {
                this.$message({
                  message: "新建成功",
                  type: "success",
                });
                this.$router.push({
                  path: "/addTask",
                });
              }
            });
        }
      }
    },
    // 取消编辑
    cancel() {
      this.$router.push({
        path: "/addTask",
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
          // border: 1px solid red;
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
          display: flex;
          // border: 1px solid red;
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
          .TaskTime_exp {
            display: flex;
            .TaskTime-select {
              width: 120px;
              margin-left: 10px;
            }
            .TaskTime-input {
              width: 500px;
              margin-left: 10px;
            }
          }
        }
        // 下面俩按钮
        .Btns {
          display: flex;
          margin-top: 20px;
          justify-content: space-between;
          // border: 1px solid red;
          width: 180px;
          .sub-btn {
            .el-button {
              // width: 80px;
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
          .cancel-btn {
            .el-button {
              width: 70px;
              background: linear-gradient(-270deg, #fc9494, #f96b6c);
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
