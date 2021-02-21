<template>
  <div class="Container-AddTaskInside">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
      <el-breadcrumb-item class="active">编辑模版</el-breadcrumb-item>
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
                  placeholder="请填写每周几，每月几号，每季度第几月，每年第几天，只填写数字即可"
                  type="number"
                  v-if="
                    ['Weekly', 'Monthly', 'Seasonally', 'Yearly'].includes(
                      TaskInfo.scheduleType
                    )
                  "
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
                @input="changeside"
              ></el-input>
            </el-form-item>
            <el-form-item label="接受标准" style="width:32%">
              <el-input
                v-model="TaskInfo.acceptedStandard"
                placeholder="请输入接受标准"
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
                @input="changecontent"
              ></el-input>
            </el-form-item>
            <el-form-item label="保养工具及备件" style="width:32%">
              <el-input
                class="inputStyle"
                type="textarea"
                v-model="TaskInfo.tools"
                :rows="8"
                @input="changetools"
              ></el-input>
            </el-form-item>
            <el-form-item label="注意事项" style="width:32%">
              <el-input
                class="inputStyle"
                type="textarea"
                v-model="TaskInfo.remark"
                :rows="8"
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
        console.log(res.data);
        that.submitTaskInfo.id = res.data.id;
        that.submitTaskInfo.ops = res.data.ops;
        that.submitTaskInfo.device = res.data.device;
        that.submitTaskInfo.parent = res.data.parent;
        // 保养周期
        that.TaskInfo.scheduleType = res.data.scheduleType;
        // 保养天数
        that.TaskInfo.scheduleDay = res.data.scheduleDay;
        // 任务名称
        that.TaskInfo.name = res.data.name;
        // 保养部位
        that.TaskInfo.side = res.data.side;
        // 接受标准
        that.TaskInfo.acceptedStandard = res.data.acceptedStandard;
        // 保养内容
        that.TaskInfo.content = res.data.content.join("\n");
        // 保养工具
        that.TaskInfo.tools = res.data.tools.join("\n");
        // 注意事项
        that.TaskInfo.remark = res.data.remark;
      });
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
        id: null,
        device: null,
        ops: null,
        parent: null,
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
    };
  },
  methods: {
    // 清空submitTaskInfo
    Clear() {
      this.submitTaskInfo.scheduleType = null;
      this.submitTaskInfo.scheduleDay = null;
      this.submitTaskInfo.name = null;
      this.submitTaskInfo.side = null;
      this.submitTaskInfo.acceptedStandard = null;
      this.submitTaskInfo.content = null;
      this.submitTaskInfo.tools = null;
      this.submitTaskInfo.remark = null;
    },
    // 保养周期改变
    changescheduleType(res) {
      this.Clear();
      this.submitTaskInfo.scheduleType = res;
    },
    // 保养周期天数改变
    changescheduleDay(res) {
      this.Clear();
      this.submitTaskInfo.scheduleDay = res;
    },
    // 任务名称改变
    changename(res) {
      this.Clear();
      this.submitTaskInfo.name = res;
    },
    // 保养部位改变
    changeside(res) {
      this.Clear();
      this.submitTaskInfo.side = res;
    },
    // 接受标准改变
    changeacceptedStandard(res) {
      this.Clear();
      this.submitTaskInfo.acceptedStandard = res;
    },
    // 保养内容改变
    changecontent(res) {
      this.Clear();
      console.log(res);
      this.submitTaskInfo.content = res;
    },
    // 保养工具改变
    changetools(res) {
      this.Clear();
      console.log(res);
      this.submitTaskInfo.tools = res;
    },
    // 注意事项改变
    changeremark(res) {
      this.Clear();
      this.submitTaskInfo.remark = res;
    },
    // 保存编辑并提交
    submittask() {
      let that = this;
      if (that.submitTaskInfo.scheduleType == null) {
        that.submitTaskInfo.scheduleType = that.TaskInfo.scheduleType;
      }
      if (that.submitTaskInfo.scheduleDay == null) {
        that.submitTaskInfo.scheduleDay = that.TaskInfo.scheduleDay;
      }
      if (that.submitTaskInfo.name == null) {
        that.submitTaskInfo.name = that.TaskInfo.name;
      }
      if (that.submitTaskInfo.side == null) {
        that.submitTaskInfo.side = that.TaskInfo.side;
      }
      if (that.submitTaskInfo.acceptedStandard == null) {
        that.submitTaskInfo.acceptedStandard = that.TaskInfo.acceptedStandard;
      }
      if (that.submitTaskInfo.remark == null) {
        that.submitTaskInfo.remark = that.TaskInfo.remark;
      }
      if (that.submitTaskInfo.content != null) {
        that.submitTaskInfo.content = that.submitTaskInfo.content
          .replace(/\r\n/g, ",")
          .replace(/\n/g, ",")
          .split(",");
        console.log(that.submitTaskInfo.content);
      } else {
        that.submitTaskInfo.content = that.TaskInfo.content
          .replace(/\r\n/g, ",")
          .replace(/\n/g, ",")
          .split(",");
      }
      if (that.submitTaskInfo.tools != null) {
        that.submitTaskInfo.tools = that.submitTaskInfo.tools
          .replace(/\r\n/g, ",")
          .replace(/\n/g, ",")
          .split(",");
        console.log(that.submitTaskInfo.tools);
      } else {
        that.submitTaskInfo.tools = that.TaskInfo.tools
          .replace(/\r\n/g, ",")
          .replace(/\n/g, ",")
          .split(",");
      }
      console.log(that.submitTaskInfo);
      let url =
        "http://47.102.214.37:8080/ops/schedule/detail/" +
        this.$route.query.taskID;
      axios
        .put(url, {
          acceptedStandard: that.submitTaskInfo.acceptedStandard,
          content: that.submitTaskInfo.content,
          device: that.submitTaskInfo.device,
          id: that.submitTaskInfo.id,
          name: that.submitTaskInfo.name,
          ops: that.submitTaskInfo.ops,
          parent: that.submitTaskInfo.parent,
          remark: that.submitTaskInfo.remark,
          scheduleDay: that.submitTaskInfo.scheduleDay,
          scheduleType: that.submitTaskInfo.scheduleType,
          side: that.submitTaskInfo.side,
          tools: that.submitTaskInfo.tools,
        })
        .then((res) => {
          console.log(res);
          that.$message({
            message: "修改成功",
            type: "success",
          });
          that.$router.push("/addTask");
        });
    },
    // 取消编辑
    cancel() {
      this.$router.push({
        path: "/addTask",
      });
      this.$message("已取消编辑");
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
