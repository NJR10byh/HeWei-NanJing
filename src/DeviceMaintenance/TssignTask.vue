<template>
  <div style="width:100%;height:100%;">
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
          <div class="sub-btn">
            <el-button @click="SubTssign">保存</el-button>
          </div>
          <div class="del-btn">
            <el-button>删除</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="nopower" v-else>无权限</div>
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
          .get("http://47.102.214.37:8080/ops/schedule?page=0&size=10")
          .then((res) => {
            for (var i = 0; i < res.data.content.length; i++) {
              // console.log(res.data.content[i].device[0]);
              that.data1.push({
                key: res.data.content[i].id,
              });
            }
          });
        // 获取全部 OPERATOR 员工
        axios
          .get("http://47.102.214.37:8080/user/query?role==OPERATOR")
          .then((res) => {
            for (var i = 0; i < res.data.content.length; i++) {
              res.data.content[i];
              that.data2.push({
                lable: res.data.content[i].username,
                key: res.data.content[i].username,
              });
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
      titles1: ["任务 ID", "已选择任务"],
      // 选择框 2
      data2: [],
      value2: [],
      titles2: ["人员列表", "已选择人员"],
      selectedTaskid: [],
      selectedUsername: [],
      selectedUserid: [],
    };
  },
  methods: {
    change1(res) {
      let that = this;
      console.log(res.length);
      for (var i = 0; i < res.length; i++) {
        that.selectedTaskid.push(res[i]);
      }
    },
    change2(res) {
      let that = this;
      console.log(res.length);
      for (var i = 0; i < res.length; i++) {
        that.selectedUsername.push(res[i]);
      }
    },
    SubTssign() {
      let that = this;
      console.log(that.selectedTaskid);
      console.log(that.selectedUsername);
      for (var i = 0; i < that.selectedUsername.length; i++) {
        let url =
          "http://47.102.214.37:8080/user/query?username==" +
          that.selectedUsername[i];
        axios.get(url).then((res) => {
          that.selectedUserid.push(res.data.content[0].id);
        });
      }
      setTimeout(function() {
        console.log(that.selectedUserid);
        for (var a = 0; a < that.selectedUserid.length; a++) {
          for (var b = 0; b < that.selectedTaskid.length; b++) {
            let URL =
              "http://47.102.214.37:8080/user/schedule/" +
              that.selectedUserid[a] +
              "?scheduleId=" +
              that.selectedTaskid[b];
            console.log(URL);
            axios.post(URL).then((res) => {
              console.log(res);
              if (res.status == 200) {
                that.$message({
                  message: "分配成功",
                  type: "success",
                });
              }
            });
          }
        }
      }, 200);
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
    // overflow: hidden;
    .kuang {
      // border: 1px solid red;
      width: 600px;
    }
    .kuang2 {
      margin-top: 10px;
    }
  }
  .Btns {
    display: flex;
    justify-content: space-between;
    width: 180px;
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
</style>
