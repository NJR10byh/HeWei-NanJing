<template>
  <div class="Container-TaskInfomation">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
      <el-breadcrumb-item class="active">任务信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Tasks">
      <div
        class="card"
        v-for="(item, index) in taskData"
        :key="'taskData' + index"
      >
        <div class="content">
          <h2>{{ item.taskname }}</h2>
          <div class="Btns">
            <el-button class="btn btn1" @click="taskdetail(index)"
              >查看任务</el-button
            >
          </div>
        </div>
      </div>
      <div
        class="card card_5"
        v-for="(item, index) in taskData_5"
        :key="'taskData_5' + index"
      >
        <div class="content">
          <h2>{{ item.taskname }}</h2>
          <div class="Btns">
            <el-button class="btn btn2" @click="taskdetail(index)"
              >查看任务</el-button
            >
          </div>
        </div>
      </div>
      <div
        class="card card_10"
        v-for="(item, index) in taskData_10"
        :key="'taskData_10' + index"
      >
        <div class="content">
          <h2>{{ item.taskname }}</h2>
          <div class="Btns">
            <el-button class="btn btn3" @click="taskdetail(index)"
              >查看任务</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "DeviceInformation",
  components: {},
  data() {
    return {
      userRole: "", //用户类型
      userID: "",
      taskData_10: [],
      taskData_5: [],
      taskData: [],
      nextDateDay: "",
    };
  },
  methods: {
    taskdetail(index) {
      // console.log(index);
      this.$router.push({
        path: "/taskDetailInfo",
        query: this.taskData[index],
      });
    },
  },
  created() {
    let that = this;
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      console.log(res.data);
      that.userRole = res.data.role;
      that.userID = res.data.id;
    });
    setTimeout(function() {
      if (["ROOT", "ADMIN", "CREATOR"].includes(that.userRole)) {
        axios
          .get("http://47.102.214.37:8080/ops/schedule?page=0&size=100")
          .then((res) => {
            console.log(res.data);
            for (var i = 0; i < res.data.content.length; i++) {
              let taskID = res.data.content[i].id;
              let taskname = res.data.content[i].name;
              let url =
                "http://47.102.214.37:8080/ops/schedule/status/" +
                res.data.content[i].id;
              setTimeout(function() {
                axios.get(url).then((res) => {
                  console.log(res.data);
                  if (res.data.nextDateDay >= 10) {
                    that.taskData_10.unshift({
                      taskID: taskID,
                      taskname: taskname,
                    });
                    console.log(that.taskData_10);
                  } else if (
                    res.data.nextDateDay < 10 &&
                    res.data.nextDateDay >= 5
                  ) {
                    that.taskData_5.unshift({
                      taskID: taskID,
                      taskname: taskname,
                    });
                  } else if (res.data.nextDateDay < 5) {
                    that.taskData.unshift({
                      taskID: taskID,
                      taskname: taskname,
                    });
                  }
                });
              }, 200);
            }
          });
      } else if (that.userRole == "OPERATOR") {
        let url = "http://47.102.214.37:8080/my/schedule";
        console.log(url);
        axios.get(url).then((res) => {
          console.log(res);
          for (var i = 0; i < res.data.length; i++) {
            // console.log(res.data[i]);
            that.taskData.unshift({
              taskID: res.data[i].id,
              taskname: res.data[i].name,
            });
            setTimeout(function() {
              let url =
                "http://47.102.214.37:8080/ops/schedule/status/" +
                res.data[i].id;
              axios.get(url).then((res) => {
                console.log(res);
              });
            }, 200);
          }
        });
      }
    }, 200);
  },
};
</script>
<style lang="scss">
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
      border: 3px solid #ff4848;
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
          padding: 0 10px;
        }
        .Btns {
          // border: 1px solid red;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 10px;
          .btn {
            padding: 10px;
            width: 90px;
            background: #ff4848;
            color: #fff;
            border: 0;
            border-radius: 5px;
            font-size: 15px;
            font-weight: bold;
          }
          .btn2 {
            background: #fdbd0c;
          }
          .btn3 {
            background: #09da02;
          }
        }
      }
    }
    .card:hover {
      transition: 0.5s;
      transform: scale(1);
      background: #000;
      border: 0;
      .content {
        color: #fff;
      }
    }
    .card_5 {
      border: 3px solid #fdbd0c;
    }
    .card_3 {
      border: 3px solid #a5ff14;
    }
  }
}
</style>
