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
    <div class="Box Avatar">
      <div class="head">
        <div class="head-text">修改头像</div>
      </div>
      <div class="upload">
        <el-upload
          list-type="picture"
          action=""
          :auto-upload="false"
          accept=".jpg, .png"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-change="getFile"
          class="avatar-uploader"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  created: function() {
    let that = this;
    console.log(that.$route.query);
    if (that.$route.query.id != undefined) {
      let url = "user/" + that.$route.query.id;
      this.request(url, {}, "GET")
        .then((res) => {
          that.userid = res.data.id;
          that.name = res.data.name;
          that.email = res.data.email;
        })
        .catch((res) => {
          this.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
    } else {
      this.request("user/me", {}, "GET")
        .then((res) => {
          that.userid = res.data.id;
          that.name = res.data.name;
          that.email = res.data.email;
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
      name: "",
      userid: "",
      email: "",
      password: "",
      confirmpassword: "",

      /* 头像 */
      imageUrl: "",
      picid: "",
    };
  },
  methods: {
    // 上传头像
    getFile(file) {
      let that = this;
      this.imageUrl = file.url;
      this.getBase64(file.raw).then((res) => {
        const params = res.split(",");
        console.log(params, "params");
        if (params.length > 0) {
          axios({
            url: "http://1.15.236.205:8080/pic",
            method: "post",
            data: params[1],
            headers: {
              "Content-Type": "text/plain",
            },
          }).then((res) => {
            console.log(res);
            that.picid = res.data;
          });
        }
      });
    },
    // 上传前检验图片大小
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 获取图片转base64
    getBase64(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function() {
          imgResult = reader.result;
        };
        reader.onerror = function(error) {
          reject(error);
        };
        reader.onloadend = function() {
          resolve(imgResult);
        };
      });
    },

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
    // 确认修改
    submit() {
      let that = this;
      console.log(that.name);
      console.log(that.email);
      console.log(that.userid);
      console.log(that.password);
      console.log(that.confirmpassword);
      if (that.password === that.confirmpassword) {
        if (that.$route.query.id != undefined) {
          let url = "user/" + that.userid;
          this.request(url, {}, "GET")
            .then((res) => {
              let obj = {
                email: that.email,
                id: res.data.id,
                name: that.name,
                role: res.data.role,
                username: res.data.username,
                enable: res.data.enable,
                password: that.confirmpassword,
                avatar: that.picid,
              };
              setTimeout(function() {
                this.request(url, obj, "PUT")
                  .then((res) => {
                    console.log(res);
                    that.$message({
                      message: "修改成功",
                      type: "success",
                    });
                    // location.reload();
                  })
                  .catch((res) => {
                    console.log(res.response);
                    that.$message({
                      message: "修改失败",
                      type: "error",
                    });
                  });
              }, 300);
            })
            .catch((res) => {
              this.$message({
                message: res.response.data.message,
                type: "error",
              });
            });
        } else {
          let obj = {
            email: that.email,
            name: that.name,
            password: that.confirmpassword,
            avatar: that.picid,
          };
          let url = "user/me/edit";
          this.request(url, obj, "POST")
            .then((res) => {
              console.log(res);
              that.$message({
                message: "修改成功",
                type: "success",
              });
              location.reload();
            })
            .catch((res) => {
              that.$message({
                message: res.response.data.message,
                type: "error",
              });
            });
        }
      } else {
        this.$message({
          message: "两次密码输入不一致，请重新输入",
          type: "warning",
        });
        this.password = "";
        this.confirmpassword = "";
      }
    },
  },
};
</script>
<style lang="scss">
.Container-edituser {
  // border: 1px solid red;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
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
  .Avatar {
    .upload {
      width: 100%;
      height: 80%;
      display: flex;
      justify-content: center;
      align-items: center;
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 300px;
        height: 300px;
        line-height: 300px;
        text-align: center;
      }
      .avatar {
        width: 300px;
        height: 300px;
      }
    }
  }
}
</style>
