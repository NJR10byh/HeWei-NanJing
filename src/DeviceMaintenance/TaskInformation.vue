<template>
  <div style="width:100%;height:100%">
    <div
      class="Container-TaskInfomation"
      v-if="['ROOT', 'ADMIN', 'OPERATOR'].includes(user)"
    >
      <!-- 面包屑 -->
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
        <el-breadcrumb-item class="active">任务信息</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="Tasks">
        <div class="card" v-for="(item, index) in taskData" :key="index">
          <div class="content">
            <h2>任务ID：{{ item.taskName }}</h2>
            <div class="Btns">
              <el-button class="btn btn1" @click="taskdetail(index)"
                >查看任务</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="nopower" v-else>无权限</div>
  </div>
</template>

<script>
import axios from "axios";
import globaldata from "../GlobalData/globaldata";
export default {
  name: "DeviceInformation",
  components: {},
  data() {
    return {
      user: globaldata.role, //用户类型
      taskData: [],
    };
  },
  methods: {
    taskdetail(index) {
      console.log(index);
      this.$router.push({
        path: "/taskDetailInfo",
        query: this.taskData[index],
      });
    },
  },
  created() {
    let that = this;
    let taskid = "";
    // 判断用户类型
    // let url = "http://47.102.214.37:8080/user/" + 1;
    // axios.get(url).then((res) => {
    //   that.user = res.data.role;
    // });
    if (that.user == "ROOT" || that.user == "ADMIN") {
      console.log(globaldata.userID);
      axios
        .get("http://47.102.214.37:8080/ops/schedule?page=0&size=10")
        .then((res) => {
          for (var i = 0; i < res.data.content.length; i++) {
            console.log(res.data.content[i]);
            taskid = res.data.content[i].id;
            that.taskData.push({
              taskName: taskid,
            });
          }
        });
    } else if (that.user == "OPERATOR") {
      let url = "http://47.102.214.37:8080/user/schedule/" + globaldata.userID;
      axios.get(url).then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          console.log(res.data[i]);
          taskid = res.data[i].id;
          that.taskData.push({
            taskName: taskid,
          });
        }
      });
    }
  },
};
</script>
<style lang="scss">
.nopower {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.Container-TaskInfomation {
  .breadcrumb {
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    font-size: 16px;
    // border: 1px solid red;
    padding: 10px;
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
  .Tasks {
    width: 100%;
    // border: 1px solid red;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    .card {
      position: relative;
      width: 220px;
      height: 250px;
      border-radius: 15px;
      background: #fff;
      transition: 0.5s;
      transform: scale(0.9);
      box-shadow: 5px 5px 20px rgb(231, 231, 231),
        -5px 5px 20px rgb(231, 231, 231);
      .content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        transition: 0.5s;
        // border: 1px solid red;
        h2 {
          font-size: 1.6em;
        }
        .Btns {
          // border: 1px solid red;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 10px;
          .btn {
            padding: 8px 10px;
            background: #409eff;
            color: #fff;
            border: 0;
            border-radius: 5px;
          }
          .btn2 {
            margin: 10px 0 0 0;
            background: #f96b6c;
          }
        }
      }
    }
    .card:hover {
      transition: 0.5s;
      transform: scale(1);
      background: #000;
      .content {
        color: #fff;
      }
    }
  }
}
</style>
