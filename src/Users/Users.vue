<template>
  <div class="container">
    <div class="box">
      <div class="module" @click="Register">
        <div class="top">
          <img src="../assets/img/register.png" />
        </div>
        <div class="bottom">
          注册
        </div>
      </div>
      <div class="module" @click="Login">
        <div class="top">
          <img src="../assets/img/login.png" />
        </div>
        <div class="bottom">
          登录
        </div>
      </div>
      <div class="module" @click="Authorize">
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
export default {
  data() {
    return {};
  },
  methods: {
    Register() {
      console.log("Register");
      this.$router.push({ path: "/register" });
    },
    Login() {
      console.log("Login");
      this.$router.push({ path: "/login" });
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
    }
    .module:hover {
      width: 35%;
      height: 85%;
      transition: 0.5s;
    }
  }
}
</style>
