<template>
  <div
    class="Container-TssignTask"
    v-if="['ROOT', 'ADMIN', 'CREATOR'].includes(userRole)"
  >
    <div style="padding-bottom:20px;width:100%;">
      <!-- 面包屑 -->
      <el-breadcrumb class="Breadcrumb">
        <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
        <el-breadcrumb-item class="active">任务分配</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="chuansuo">
      <div class="kuang">
        <el-transfer
          filterable
          v-model="value1"
          :data="data1"
          :titles="titles1"
          @change="change1"
        >
        </el-transfer>
      </div>
      <div class="kuang kuang3">
        <el-transfer
          filterable
          v-model="value3"
          :data="data3"
          :titles="titles3"
          @change="change3"
        >
        </el-transfer>
      </div>
      <div class="Btns">
        <div class="sub-btn">
          <el-button @click="Next">下一步</el-button>
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
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      console.log(res.data);
      that.userRole = res.data.role;
      that.userID = res.data.id;
    });
    setTimeout(function() {
      if (["ROOT", "ADMIN", "CREATOR"].includes(that.userRole)) {
        // 获取全部任务
        axios
          .get("http://47.102.214.37:8080/ops/schedule?page=0&size=100")
          .then((res) => {
            for (var i = 0; i < res.data.content.length; i++) {
              let obj = {};
              // console.log(res.data.content[i]);
              obj.key = res.data.content[i].id;
              obj.label = res.data.content[i].name;
              that.data1.unshift(obj);
            }
          });
        // 获取全部设备
        axios
          .get("http://47.102.214.37:8080/device/query?name=!")
          .then((res) => {
            console.log(res.data);
            for (var i = 0; i < res.data.content.length; i++) {
              // console.log(res.data.content[i]);
              let obj = {};
              obj.key = res.data.content[i].id;
              obj.label =
                res.data.content[i].name +
                "（" +
                res.data.content[i].deviceNo +
                "）";
              that.data3.push(obj);
            }
          });
      }
    }, 200);
  },
  data() {
    return {
      userRole: "", //用户类型
      // 选择框 1
      data1: [],
      value1: [],
      titles1: ["任务名称", "已选择任务"],
      // 选择框 3
      data3: [],
      value3: [],
      titles3: ["设备列表", "已选择设备"],
      selectedTaskid: [],
      selectedDeviceid: [],
    };
  },
  methods: {
    change1(res) {
      let that = this;
      that.selectedTaskid = [];
      console.log(res);
      for (var i = 0; i < res.length; i++) {
        that.selectedTaskid.push(res[i]);
      }
    },
    change3(res) {
      let that = this;
      that.selectedDeviceid = [];
      console.log(res);
      for (var i = 0; i < res.length; i++) {
        that.selectedDeviceid.push({ id: res[i] });
      }
    },
    Next() {
      let that = this;
      if (
        that.selectedTaskid.length == 0 ||
        that.selectedDeviceid.length == 0
      ) {
        that.$message({
          message: "请将信息填写完整",
          type: "warning",
        });
      } else {
        console.log(that.selectedTaskid);
        console.log(that.selectedDeviceid);
        let obj = {};
        obj.taskid = that.selectedTaskid;
        obj.deviceid = that.selectedDeviceid;
        this.$router.push({
          path: "./tssignTask2",
          query: obj,
        });
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
  .chuansuo {
    // border: 1px solid red;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding-bottom: 10px;
    .kuang3 {
      margin-top: 10px;
    }
  }
  .Btns {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
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
</style>
<style scoped>
.kuang >>> .el-transfer-panel {
  width: 250px;
}
</style>
