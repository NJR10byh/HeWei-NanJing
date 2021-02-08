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
            <el-form-item label="设备名称" class="DeviceName Device">
              <el-cascader
                placeholder="试试搜索：Apple"
                :options="options"
                :props="{ multiple: true }"
                filterable
                clearable
                @change="change"
                style="width:180px"
                v-model="TaskInfo.devicename"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="保养周期" class="TaskTime">
              <div class="TaskTime_exp">
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
                ></el-input>
              </div>
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
    that.JilianData();
    if (this.$route.query.taskName != undefined) {
      let url =
        "http://47.102.214.37:8080/ops/schedule/detail/" +
        this.$route.query.taskName;
      axios.get(url).then((res) => {
        console.log(res.data);
        that.TaskInfo.scheduleType = res.data.scheduleType;
        that.TaskInfo.scheduleDay = res.data.scheduleDay;
        that.TaskInfo.side = res.data.side;
        that.TaskInfo.acceptedStandard = res.data.acceptedStandard;
      });
    }
  },
  data() {
    return {
      TaskInfo: {
        devicename: "",
        scheduleType: "",
        scheduleDay: "",
        acceptedStandard: "",
        side: "",
        taskcontent: "",
        tasktools: "",
        attention: "",
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
      value: "",
      // 级联选择
      options: [],
      deviceid: [],
    };
  },
  methods: {
    JilianData() {
      let that = this;
      // 设备名称
      axios.get("http://47.102.214.37:8080/device/keys/name").then((res) => {
        // console.log(res.data);
        for (var i = 0; i < res.data.length; i++) {
          let obj = {};
          obj.value = res.data[i];
          obj.label = res.data[i];
          that.options.push(obj);
          // console.log(that.options[0]);
        }
      });
    },
    Plus() {
      // unshift() 从堆顶加入元素
      this.taskData.unshift({
        devicename: this.devicename,
        deviceclazz: this.deviceclazz,
      });
      this.dialogVisible = false;
    },
    change(res) {
      let that = this;
      that.deviceid = [];
      for (var i = 0; i < res.length; i++) {
        let url = "http://47.102.214.37:8080/device/query?name==" + res[i][0];
        axios.get(url).then((res) => {
          that.deviceid.push({
            id: res.data.content[0].id,
          });
        });
      }
    },
    submittask() {
      let that = this;
      console.log(that.TaskInfo);
      console.log(that.deviceid);
      if (that.TaskInfo.scheduleType == "Weekly") {
        if ([1, 2, 3, 4, 5, 6, 7].includes(that.TaskInfo.scheduleDay)) {
          console.log("ok");
        }
      }
      axios
        .post("http://47.102.214.37:8080/ops/schedule", {
          acceptedStandard: that.TaskInfo.acceptedStandard,
          scheduleType: that.TaskInfo.scheduleType,
          scheduleDay: that.TaskInfo.scheduleDay,
          side: that.TaskInfo.side,
          device: that.deviceid,
          manager: null,
          name: "string",
          content: ["string1", "string2"],
          ops: null,
          remark: "string",
          tools: ["string1", "string2"],
          parent: null,
        })
        .then((res) => {
          console.log(res);
          if (res.data.message == "ok") {
            this.$message({
              message: "新建成功",
              type: "success",
            });
          }
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
          margin-left: 20px;
          .TaskTime_exp {
            display: flex;
            .TaskTime-select {
              width: 100px;
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
        }
      }
    }
  }
}
</style>
