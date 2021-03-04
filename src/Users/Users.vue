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
      <div class="module" style="cursor: pointer;" @click="Edituser">
        <div class="top">
          <img src="../assets/img/login-success.png" />
        </div>
        <div class="bottom">
          修改信息
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
      this.uesrInfo = res.data;
      this.userRole = res.data.role;
    });
  },
  data() {
    return {
      userRole: "",
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
