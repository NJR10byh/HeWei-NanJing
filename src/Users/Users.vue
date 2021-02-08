<template>
  <div class="container">
    <div class="box">
      <div
        class="module"
        @click="Register"
        v-if="['ROOT', 'ADMIN'].includes(userRole)"
      >
        <div class="top">
          <img src="../assets/img/register.png" />
        </div>
        <div class="bottom">
          注册
        </div>
      </div>
      <div class="module" v-if="[''].includes(userRole)">
        <div class="top">
          <img src="../assets/img/login.png" />
        </div>
        <div class="bottom">
          登录
        </div>
      </div>
      <div
        class="module"
        style="cursor: default;"
        v-if="['ROOT', 'ADMIN', 'CREATOR', 'OPERATOR'].includes(userRole)"
      >
        <div class="top">
          <img src="../assets/img/login-success.png" />
        </div>
        <div class="User-info">
          <div>
            用户ID：<span>{{ userID }}</span>
          </div>
          <div class="username">
            用户名：<span>{{ userName }}</span>
          </div>
          <div class="role">
            用户权限：<span>{{ userRole }}</span>
          </div>
        </div>
      </div>
      <div
        class="module"
        @click="Authorize"
        v-if="['ROOT', 'ADMIN'].includes(userRole)"
      >
        <div class="top">
          <img src="../assets/img/authorize.png" />
        </div>
        <div class="bottom">
          授权
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
export default {
  created: function() {
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      console.log(res.data);
      this.userName = res.data.username;
      this.userID = res.data.id;
      this.userRole = res.data.role;
    });
  },
  data() {
    return {
      userRole: "",
      userName: "",
      userID: "",
    };
  },
  methods: {
    Register() {
      console.log("Register");
      this.$router.push({ path: "/register" });
    },
    Authorize() {
      console.log("Authorize");
      this.$router.push({ path: "/authorize" });
    },
  },
};
</script>
<style lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  .box {
    width: 90%;
    height: 80%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .module {
      // border: 1px solid red;
      cursor: pointer;
      width: 30%;
      height: 80%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      background: #fff;
      border-radius: 15px;
      box-shadow: 5px 5px 20px rgb(231, 231, 231),
        -5px 5px 20px rgb(231, 231, 231);
      transition: 0.5s;
      .top {
        width: 80%;
        height: 65%;
        // border: 1px solid red;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 60%;
        }
      }
      .bottom {
        width: 80%;
        height: 35%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        color: #409eff;
        font-size: 30px;
      }
      .User-info {
        // border: 1px solid red;
        height: 35%;
        font-weight: bold;
        span {
          font-weight: normal;
        }
        .username {
          margin-top: 10px;
        }
        .role {
          margin-top: 10px;
          span {
            background: #000;
            border-radius: 4px;
            padding: 3px 6px;
            font-size: 12px;
            font-weight: bold;
            color: #fff;
          }
        }
      }
    }
    .module:hover {
      width: 35%;
      height: 85%;
      transition: 0.5s;
    }
  }
}
</style>
