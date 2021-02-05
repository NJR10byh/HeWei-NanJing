<template>
  <div style="width:100%;height:100%">
    <div class="Container-Login">
      <div class="Box">
        <div class="head">
          <div class="head-text">请登录</div>
        </div>
        <div class="input-body">
          <span>您的用户ID是您用于登录系统的唯一识别ID</span>
          <el-input placeholder="用户ID"></el-input>
          <el-input placeholder="密码"></el-input>
        </div>
        <div class="login-btn">
          <el-button>登录</el-button>
        </div>
        <div class="foot-register">
          <a href=".#/register">没有用户ID？立即创建一个</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import axios from "axios";
export default {};
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
    .foot-register {
      //   border: 1px solid red;
      width: 100%;
      height: 15%;
      display: flex;
      justify-content: center;
      margin-top: 5px;
      a {
        // border: 1px solid red;
        font-size: 12px;
        color: #409eff;
        letter-spacing: 1px;
        text-decoration: none;
      }
    }
  }
}
</style>
