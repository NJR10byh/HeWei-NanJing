<template>
  <div class="Container-Login">
    <div class="Title">合为企业设备管理系统</div>
    <div class="Box">
      <div class="head">
        <div class="head-text">请登录</div>
      </div>
      <div class="input-body">
        <span>您的用户ID是您用于登录系统的唯一识别ID</span>
        <el-input placeholder="用户名" v-model="username" clearable></el-input>
        <el-input
          placeholder="密码"
          v-model="password"
          clearable
          show-password
        ></el-input>
      </div>
      <div class="login-btn">
        <el-button @click="Sign_In">登录</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import qs from "qs";
export default {
  created: function() {
    if (localStorage.getItem("token") != null) {
      this.request("user/me", {}, "GET")
        .then((res) => {
          this.$message({
            message: "登录成功",
            type: "success",
          });
          switch (res.data.role) {
            case "ROOT":
              this.$router.push("/userList");
              break;
            case "ADMIN":
              this.$router.push("/userList");
              break;
            case "OPERATOR":
              this.$router.push("/totalTaskList");
              break;
            case "CREATOR":
              this.$router.push("/totalTaskList");
              break;
            case "SUPERVISOR":
              this.$router.push("/alreadyFix");
              break;
            default:
              break;
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
      username: "",
      password: "",
    };
  },
  methods: {
    // 用户登录
    Sign_In() {
      let that = this;
      let params = qs.stringify({
        username: that.username,
        password: that.password,
      });
      that
        .request("login", params, "POST", {})
        .then((res) => {
          localStorage.setItem("token", res.data);
          this.$message({
            message: "登录成功",
            type: "success",
          });
          this.$router.push("/totalTaskList");
        })
        .catch((res) => {
          this.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
    },
  },
};
</script>
<style lang="scss">
.Container-Login {
  position: absolute;
  width: 100%;
  height: 100%;
  //   border: 1px solid red;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  .Title {
    // border: 1px solid red;
    height: 11%;
    font-size: 36px;
    font-weight: bold;
    color: #409eff;
    letter-spacing: 1px;
  }
  .Box {
    width: 35%;
    height: 70%;
    border-radius: 10px;
    // border: 1px solid red;
    box-shadow: 5px 5px 20px #eeeeee, -5px 5px 20px #eeeeee;
    display: flex;
    flex-direction: column;
    align-items: center;
    .head {
      width: 90%;
      height: 15%;
      border-bottom: 1px solid #000;
      display: flex;
      align-items: center;
      .head-text {
        font-size: 28px;
        font-weight: 400;
        // border: 1px solid red;
      }
    }
    .input-body {
      width: 100%;
      height: 45%;
      //   border: 1px solid red;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      .el-input {
        width: 80%;
        // border: 1px solid red;
        .el-input__inner {
          height: 50px;
          border: 1px solid #d1d1d1;
          border-radius: 10px;
          outline-color: red;
        }
        .el-input__inner:focus {
          border-color: #409eff;
        }
      }
      span {
        font-size: 12px;
        letter-spacing: 1px;
      }
    }
    .login-btn {
      width: 100%;
      height: 15%;
      //   border: 1px solid red;
      display: flex;
      justify-content: center;
      align-items: center;
      .el-button {
        background: #409eff;
        border: 0;
        color: #fff;
        font-size: 17px;
        letter-spacing: 3px;
        width: 80%;
        height: 50px;
        border-radius: 10px;
      }
    }
  }
}
</style>
