<template>
  <div class="Container-TssignTask2">
    <div style="padding-bottom:20px;width:100%;">
      <!-- 面包屑 -->
      <el-breadcrumb class="Breadcrumb">
        <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
        <el-breadcrumb-item class="active">任务分配</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="datepicker">
      开始日期：
      <el-date-picker
        v-model="value1"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
    </div>
    <div class="chuansuo">
      <div class="kuang kuang2">
        <el-transfer
          filterable
          v-model="value2"
          :data="data2"
          :titles="titles2"
          @change="change2"
        >
        </el-transfer>
      </div>

      <div class="Btns">
        <div class="back-btn">
          <el-button @click="Back">返回</el-button>
        </div>
        <div class="sub-btn">
          <el-button @click="SubTssign">保存并提交</el-button>
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
    that.selectedTaskid = that.$route.query.taskid;
    that.selectedDeviceid = that.$route.query.deviceid;
    // 获取全部 OPERATOR 员工
    axios
      .get("http://47.102.214.37:8080/user/query?role==OPERATOR")
      .then((res) => {
        for (var i = 0; i < res.data.content.length; i++) {
          // console.log(res.data.content[i]);
          let obj = {};
          obj.key = res.data.content[i].id;
          obj.label = res.data.content[i].username;
          that.data2.unshift(obj);
        }
      });
  },
  data() {
    return {
      // 选择框 2
      data2: [],
      value2: [],
      titles2: ["人员列表", "已选择人员"],

      // 日期选择
      value1: "",

      selectedTaskid: [],
      selectedUserid: [],
      selectedDeviceid: [],
    };
  },
  methods: {
    change2(res) {
      let that = this;
      console.log(res);
      for (var i = 0; i < res.length; i++) {
        that.selectedUserid.push({
          id: res[i],
        });
      }
    },
    Back() {
      this.$router.push({
        path: "./tssignTask",
      });
    },
    SubTssign() {
      let that = this;
      if (that.selectedTaskid.length == 0) {
        that.$message({
          message: "请将信息填写完整",
          type: "warning",
        });
      } else {
        for (var a = 0; a < that.selectedTaskid.length; a++) {
          let url =
            "http://47.102.214.37:8080/ops/schedule/detail/" +
            that.selectedTaskid[a];
          axios.get(url).then((res) => {
            console.log(res.data);
            let obj = {};
            obj.acceptedStandard = res.data.acceptedStandard;
            obj.content = res.data.content;
            obj.id = res.data.id;
            obj.name = res.data.name;
            obj.remark = res.data.remark;
            obj.scheduleDay = that.value1;
            obj.scheduleType = res.data.scheduleType;
            obj.side = res.data.side;
            obj.tools = res.data.tools;
            obj.deviceid = that.selectedDeviceid;
            obj.ops = that.selectedUserid;
            console.log(obj);
            setTimeout(function() {
              axios.put(url, obj).then((res) => {
                console.log(res);
                that.$message({
                  message: "分配成功",
                  type: "success",
                });
              });
            }, 200);
          });
        }
      }
    },
  },
};
</script>

<style lang="scss">
.Container-TssignTask2 {
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
  .chuansuo {
    // border: 1px solid red;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 20px;
    // overflow: hidden;
    .kuang2 {
      margin-top: 10px;
    }
  }
  .datepicker {
    width: 100%;
    text-align: center;
    // border: 1px solid red;
  }
  .Btns {
    display: flex;
    justify-content: space-between;
    width: 200px;
    margin-top: 20px;
    // border: 1px solid red;
    .back-btn {
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
    .sub-btn {
      .el-button {
        width: 100px;
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
