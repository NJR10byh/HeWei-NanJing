<template>
  <div class="container">
    <div class="box">
      <div class="module" @click="UserList">
        <div class="top">
          <img src="../assets/img/register.png" />
        </div>
        <div class="bottom">
          用户列表
        </div>
      </div>
      <div
        class="module"
        style="cursor: pointer;"
        v-if="['ROOT', 'ADMIN', 'CREATOR', 'OPERATOR'].includes(userRole)"
        @click="Edituser"
      >
        <div class="top">
          <img src="../assets/img/login-success.png" />
        </div>
        <div class="User-info">
          <div>
            姓名：<span>{{ name }}</span>
          </div>
          <div class="userid">
            用户ID：<span>{{ userID }}</span>
          </div>
          <div class="username">
            用户名：<span>{{ userName }}</span>
          </div>
          <div class="role">
            用户权限：<span>{{ userRole }}</span>
          </div>
          <div class="role email">
            用户邮箱：<span>{{ userEmail }}</span>
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
          人员管理
        </div>
      </div>
    </div>
    <div class="loginout">
      <el-button @click="loginOut">
        注销
      </el-button>
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
      // this.uesrInfo.push(res.data.username);
      // this.uesrInfo.push(res.data.id);
      // this.uesrInfo.push(res.data.role);
      // this.uesrInfo.push(res.data.email);
      this.uesrInfo = res.data;
      this.userName = res.data.username;
      this.name = res.data.name;
      this.userID = res.data.id;
      this.userRole = res.data.role;
      this.userEmail = res.data.email;
    });
  },
  data() {
    return {
      userRole: "",
      userName: "",
      userID: "",
      userEmail: "",
      name: "",
      uesrInfo: {},
    };
  },
  methods: {
    // 注册用户
    UserList() {
      console.log("UserList");
      this.$router.push({ path: "/userList" });
    },
    // 授权用户
    Authorize() {
      console.log("Authorize");
      this.$router.push({ path: "/authorize" });
    },
    // 编辑用户信息
    Edituser() {
      console.log("Edituser");
      let that = this;
      this.$router.push({ path: "/edituser", query: that.uesrInfo });
    },
    // 注销账户
    loginOut() {
      let that = this;
      this.$confirm("您确定要退出吗?", "退出管理平台", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          localStorage.clear();
          setTimeout(function() {
            that.$router.push({ path: "/" });
          }, 1000);
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .box {
    width: 90%;
    height: 80%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    // border: 1px solid red;
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
        height: 60%;
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
        height: 40%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        color: #409eff;
        font-size: 30px;
        // border: 1px solid red;
      }
      .User-info {
        // border: 1px solid red;
        height: 45%;
        font-weight: bold;
        span {
          font-weight: normal;
        }
        .userid {
          margin-top: 10px;
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
        .email {
          span {
            background: #409eff;
            padding: 3px 8px;
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
  .loginout {
    width: 100%;
    height: 15%;
    // border: 1px solid red;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-button {
      width: 25%;
      background: #f96b6c;
      border: 0;
      color: #fff;
      font-size: 17px;
      letter-spacing: 2px;
      border-radius: 6px;
      transition: 0.5s;
    }
    .el-button:hover {
      transform: scale(1.15);
      transition: 0.5s;
    }
  }
}
</style>
