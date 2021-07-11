<template>
  <div
    class="Container-TssignTask"
    v-if="['ROOT', 'ADMIN', 'CREATOR', 'SUPERVISOR'].includes(userRole)"
  >
    <div style="padding-bottom: 20px; width: 100%">
      <!-- 面包屑 -->
      <el-breadcrumb class="Breadcrumb">
        <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
        <el-breadcrumb-item class="active">任务标准分配</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="selectPart">
      <div>
        第一步:
        <el-select v-model="devicevalue" placeholder="请选择设备" filterable>
          <el-option
            v-for="item in deviceoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div>
        第二步:
        <el-select v-model="taskvalue" placeholder="请选择标准" filterable>
          <el-option
            v-for="item in taskoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div>
        第三步:
        <el-select
          v-model="opsvalue"
          placeholder="请选择保养人员"
          filterable
          size="large"
        >
          <el-option
            v-for="item in opsoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div>
        第四步:
        <el-date-picker
          v-model="datevalue"
          type="date"
          placeholder="选择下次保养开始日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="Btns">
      <div class="sub-btn">
        <el-button @click="SubTssign">保存并提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddTaskInside",
  created: function () {
    let that = this;
    that.userRole = this.globaldata.userRole;
    that.userID = this.globaldata.userid;
    if (["ROOT", "ADMIN", "CREATOR", "SUPERVISOR"].includes(that.userRole)) {
      // 获取全部任务
      that
        .request("ops/schedule?page=0&size=1000000000", {}, "GET")
        .then((res) => {
          for (var i = 0; i < res.data.content.length; i++) {
            let obj = {};
            console.log(res.data.content[i]);
            obj.value = res.data.content[i].id;
            obj.label =
              res.data.content[i].name + "(" + res.data.content[i].no + ")";
            that.taskoptions.push(obj);
          }
        })
        .catch((res) => {
          this.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
      // 获取全部设备
      that
        .request("device?page=0&size=1000000000", {}, "GET")
        .then((res) => {
          console.log(res.data);
          for (var i = 0; i < res.data.content.length; i++) {
            // console.log(res.data.content[i]);
            let obj = {};
            obj.value =
              res.data.content[i].id + "/" + res.data.content[i].deviceNo;
            obj.label =
              res.data.content[i].name +
              "(" +
              res.data.content[i].deviceNo +
              ")";
            that.deviceoptions.push(obj);
          }
        })
        .catch((res) => {
          this.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
      // 获取全部 OPERATOR 员工
      that
        .request("user/query?role==OPERATOR", {}, "GET")
        .then((res) => {
          for (var i = 0; i < res.data.content.length; i++) {
            // console.log(res.data.content[i]);
            let obj = {};
            obj.value = res.data.content[i].id;
            obj.label =
              res.data.content[i].username +
              "(姓名: " +
              res.data.content[i].name +
              ")";
            that.opsoptions.push(obj);
          }
        })
        .catch((res) => {
          this.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
    }
  },
  data() {
    return {
      userRole: "", //用户类型

      // 选择任务
      taskvalue: "",
      taskoptions: [],

      // 选择设备
      devicevalue: "",
      deviceoptions: [],

      // 选择开始日期
      datevalue: "",

      // 选择人员
      opsvalue: "",
      opsoptions: [],
    };
  },
  methods: {
    // 提交分配
    SubTssign() {
      let that = this;
      if (
        that.taskvalue == "" ||
        that.devicevalue == "" ||
        that.datevalue == "" ||
        that.opsvalue == ""
      ) {
        that.$message({
          message: "请将信息填写完整",
          type: "warning",
        });
      } else {
        let deviceid = [];
        let ops = [];
        let url = "ops/schedule/detail/" + that.taskvalue;
        let url_task = "ops/schedule/bind/" + that.taskvalue;
        if (new Date(that.datevalue).getTime() < new Date().getTime()) {
          that.$message({
            message: "下次开始日期应大于今天",
            type: "warning",
          });
        } else {
          that
            .request(url, {}, "GET")
            .then((res) => {
              console.log(res.data);
              let obj = {};
              deviceid.push({
                id: that.devicevalue.split("/")[0] * 1,
                deviceNo: that.devicevalue.split("/")[1],
              });
              ops.push({
                id: that.opsvalue,
              });
              obj.acceptedStandard = res.data.acceptedStandard;
              obj.content = [
                {
                  title: res.data.content[0].title,
                  detail: res.data.content[0].detail,
                },
              ];
              obj.id = res.data.id;
              obj.name = res.data.name;
              obj.no = res.data.no;
              obj.remark = res.data.remark;
              obj.scheduleType = res.data.scheduleType;
              obj.startDate = that.datevalue;
              obj.side = res.data.side;
              obj.tools = res.data.tools;
              obj.device = deviceid;
              obj.ops = ops;
              obj.manager = null;
              console.log(obj);
              setTimeout(function () {
                that
                  .request(url_task, obj, "PUT")
                  .then((res) => {
                    console.log(res);
                    that.$message({
                      message: "分配成功",
                      type: "success",
                    });
                  })
                  .catch(() => {
                    that.$message({
                      message: "设备和标准已绑定！",
                      type: "error",
                    });
                  });
              }, 200);
            })
            .catch((res) => {
              this.$message({
                message: res.response.data.message,
                type: "error",
              });
            });
        }
      }
    },
  },
};
</script>

<style lang="scss">
.Container-TssignTask {
  // border: 1px solid red;
  padding-bottom: 20px;
  .Breadcrumb {
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    font-size: 16px;
    // border: 1px solid red;
    padding: 10px 10px 0 10px;
    .el-breadcrumb__inner {
      font-weight: bold;
    }
    .el-breadcrumb__inner.is-link {
      color: #666666;
      font-weight: normal;
    }

    .active {
      font-size: 20px;
    }
  }
  .selectPart {
    // border: 1px solid red;
    display: flex;
    justify-content: space-around;
  }
  .Btns {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    .sub-btn {
      .el-button {
        width: 200px;
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
</style>
<style scoped>
.kuang >>> .el-transfer-panel {
  width: 250px;
}
</style>
