<template>
  <div class="Container-FixDiagnosis">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备维修</el-breadcrumb-item>
      <el-breadcrumb-item class="active">分配到我的</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Tasks">
      <div class="card" v-for="(item, index) in taskData" :key="index">
        <div class="content">
          <h2>异常ID：{{ item.errorid }}</h2>
          <div class="Btns">
            <el-button class="btn btn1" @click="errordetail(index)"
              >诊断异常</el-button
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
  created: function() {
    let that = this;
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      console.log(res.data);
      if (res.data.role != "OPERATOR") {
        setTimeout(() => {
          axios
            .get("http://47.102.214.37:8080/issue?page=0&size=10")
            .then((res) => {
              console.log(res.data);
              for (let i = 0; i < res.data.content.length; i++) {
                that.taskData.unshift({
                  errorid: res.data.content[i].id,
                });
              }
            });
        }, 200);
      } else {
        setTimeout(() => {
          axios
            .get("http://47.102.214.37:8080/issue/assignee?page=0&size=10")
            .then((res) => {
              console.log(res.data);
              for (let i = 0; i < res.data.content.length; i++) {
                that.taskData.unshift({
                  errorid: res.data.content[i].id,
                });
              }
            });
        }, 200);
      }
    });
  },
  data() {
    return {
      taskData: [],
    };
  },
  methods: {
    errordetail(index) {
      let that = this;
      console.log(that.taskData[index]);
      that.$router.push({
        path: "./diagnosisDetail",
        query: that.taskData[index],
      });
    },
  },
};
</script>
<style lang="scss">
.Container-FixDiagnosis {
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
            background: #409eff;
            color: #fff;
            border: 0;
            border-radius: 5px;
            font-size: 15px;
            font-weight: bold;
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
