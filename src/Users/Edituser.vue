<template>
  <div class="Container-edituser">
    <div class="Box">
      <div class="head">
        <div class="head-text">修改信息</div>
      </div>
      <div class="input-body">
        <span>仅能修改姓名、邮箱和密码</span>
        <span>（注：不需要修改的内容可不用填写）</span>
        <el-input placeholder="姓名" v-model="name" clearable></el-input>
        <el-input
          placeholder="电子邮件"
          v-model="email"
          @change="Email"
          clearable
        ></el-input>
        <el-input
          placeholder="密码"
          v-model="password"
          clearable
          show-password
        ></el-input>
        <el-input
          v-if="password != ''"
          placeholder="确认密码"
          v-model="confirmpassword"
          clearable
          show-password
        ></el-input>
      </div>
      <div class="login-btn">
        <el-button @click="submit">保存修改</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  created: function() {
    let that = this;
    console.log(this.$route.query);
    that.userid = this.$route.query.id;
    that.name = this.$route.query.name;
    that.email = this.$route.query.email;
  },
  data() {
    return {
      name: "",
      userid: "",
      email: "",
      password: "",
      confirmpassword: "",
    };
  },
  methods: {
    // 验证邮箱
    Email: function() {
      //   let Email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      let Email = new RegExp(
        "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
      );
      if (!Email.test(this.email)) {
        this.$message({
          message: "请输入正确的邮箱地址",
          type: "error",
        });
        this.email = "";
      }
    },
    submit() {
      let that = this;
      console.log(that.name);
      console.log(that.email);
      console.log(that.userid);
      let url = "http://47.102.214.37:8080/user/" + that.userid;
      axios.get(url).then((res) => {
        // console.log(res.data);
        let obj = {
          email: that.email,
          id: res.data.id,
          name: that.name,
          role: res.data.role,
          username: res.data.username,
          enable: res.data.enable,
        };
        setTimeout(function() {
          console.log(obj);
          axios
            .put(url, obj)
            .then((res) => {
              console.log(res);
              that.$message({
                message: "修改成功",
                type: "success",
              });
            })
            .catch((res) => {
              console.log(res.response);
              that.$message({
                message: "修改失败",
                type: "error",
              });
            });
        }, 200);
      });
    },
  },
};
</script>
<style lang="scss">
.Container-edituser {
  //   border: 1px solid red;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  .Box {
    width: 40%;
    height: 80%;
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
      height: 65%;
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
        letter-spacing: 2px;
        width: 80%;
        height: 50px;
        border-radius: 10px;
      }
    }
  }
}
</style>
