<template>
  <div style="width:100%;height:100%">
    <div class="Container-Login">
      <div class="Box">
        <div class="head">
          <div class="head-text">请登录</div>
        </div>
        <div class="input-body">
          <span>您的用户ID是您用于登录系统的唯一识别ID</span>
          <el-input
            placeholder="用户名"
            v-model="username"
            clearable
          ></el-input>
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
  </div>
</template>
<script>
import axios from "axios";
import qs from "qs";
import globaldata from "../GlobalData/globaldata";
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    Sign_In() {
      let that = this;
      let params = qs.stringify({
        username: that.username,
        password: that.password,
      });
      axios.post("http://47.102.214.37:8080/login", params).then((res) => {
        if (res.status == 200) {
          let url =
            "http://47.102.214.37:8080/user/query?username==" + that.username;
          axios.get(url).then((res) => {
            console.log(res.data.content[0]);
            globaldata.role = res.data.content[0].role;
            globaldata.userID = res.data.content[0].id;
            globaldata.userName = res.data.content[0].username;
            console.log(globaldata.userName);
            if (["ROOT", "ADMIN", "OPERATOR"].includes(globaldata.role)) {
              this.$router.push({
                path: "./deviceInformation",
              });
            } else if (["ROOT", "ADMIN", "CREATOR"].includes(globaldata.role)) {
              this.$router.push({
                path: "./addDevice",
              });
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="scss">
.Container-Login {
  height: 100%;
  //   border: 1px solid red;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #fff;
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
