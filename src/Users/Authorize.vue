<template>
  <div class="Container-Authorize">
    <div class="box register">
      <div class="head">
        <div class="head-text">注册</div>
      </div>
      <div class="input-body">
        <span v-if="['ADMIN'].includes(userRole)"
          >可以创建三种普通用户权限</span
        >
        <el-input
          class="userinfoinput"
          v-model="name"
          placeholder="姓名"
          clearable
        ></el-input>
        <el-input
          class="userinfoinput"
          v-model="username"
          placeholder="用户名"
          clearable
        ></el-input>
        <el-input
          class="userinfoinput"
          v-model="email"
          placeholder="邮箱"
          clearable
        ></el-input>
        <el-input
          class="userinfoinput"
          type="password"
          show-password
          v-model="password"
          placeholder="密码"
        ></el-input>
        <el-input
          class="userinfoinput"
          type="password"
          show-password
          v-model="confirmpassword"
          placeholder="确认密码"
        ></el-input>
        <el-select v-model="value_left" placeholder="权限选择" clearable>
          <el-option
            v-for="item in options_left"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
        <!-- <el-switch v-model="more" active-text="批量注册" @change="moreswitch">
        </el-switch>
        <el-input
          class="userinfoinput"
          type="number"
          v-model="piliang"
          placeholder="批量注册个数"
          v-if="more"
        ></el-input> -->
      </div>
      <div class="login-btn">
        <el-button @click="register">注册</el-button>
      </div>
    </div>
    <div class="box">
      <div class="head">
        <div class="head-text">授权</div>
      </div>
      <div class="select-body">
        <span v-if="['ROOT'].includes(userRole)"
          >只能创建一个管理员，以及三种普通用户权限</span
        >
        <span v-if="['ADMIN'].includes(userRole)"
          >可以创建三种普通用户权限</span
        >
        <el-select
          v-model="value1"
          placeholder="人员选择"
          clearable
          filterable
          multiple
        >
          <el-option-group
            v-for="group in options1"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-option-group>
        </el-select>
        <el-select v-model="value2" placeholder="权限选择" clearable>
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </div>
      <div class="login-btn">
        <el-button @click="authorize">确定授权</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  created: function() {
    let that = this;
    that.userRole = this.globaldata.userRole;
    if (this.userRole == "ADMIN") {
      that.options2.shift();
    }
    this.request("user/query?role=!ROOT", {}, "GET")
      .then((res) => {
        console.log(res.data);
        for (let i = 0; i < res.data.content.length; i++) {
          if (res.data.content[i].role == "ADMIN") {
            that.options1[0].options.push({
              value: res.data.content[i].id,
              label:
                res.data.content[i].name +
                " (用户名：" +
                res.data.content[i].username +
                ")",
            });
            that.options2[0].disabled = true;
            // console.log(that.options2[0].disabled);
          }
          if (res.data.content[i].role == "CREATOR") {
            that.options1[1].options.push({
              value: res.data.content[i].id,
              label:
                res.data.content[i].name +
                " (用户名：" +
                res.data.content[i].username +
                ")",
            });
          }
          if (res.data.content[i].role == "OPERATOR") {
            that.options1[2].options.push({
              value: res.data.content[i].id,
              label:
                res.data.content[i].name +
                " (用户名：" +
                res.data.content[i].username +
                ")",
            });
          }
          if (res.data.content[i].role == "SUPERVISOR") {
            that.options1[3].options.push({
              value: res.data.content[i].id,
              label:
                res.data.content[i].name +
                " (用户名：" +
                res.data.content[i].username +
                ")",
            });
          }
        }
      })
      .catch((res) => {
        this.$message({
          message: res.response.data.message,
          type: "error",
        });
      });
  },
  data() {
    return {
      userRole: "",
      // 注册
      name: "",
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
      options_left: [
        {
          value: "CREATOR",
          label: "CREATOR",
        },
        {
          value: "OPERATOR",
          label: "OPERATOR",
        },
        {
          value: "SUPERVISOR",
          label: "SUPERVISOR",
        },
      ],
      value_left: "",
      // 授权
      // 人员信息
      options1: [
        {
          label: "ADMIN",
          options: [],
        },
        {
          label: "CREATOR",
          options: [],
        },
        {
          label: "OPERATOR",
          options: [],
        },
        {
          label: "SUPERVISOR",
          options: [],
        },
      ],
      // 权限
      options2: [
        {
          value: "ADMIN",
          label: "ADMIN",
          disabled: false,
        },
        {
          value: "CREATOR",
          label: "CREATOR",
        },
        {
          value: "OPERATOR",
          label: "OPERATOR",
        },
        {
          value: "SUPERVISOR",
          label: "SUPERVISOR",
        },
      ],
      value1: [],
      value2: "",

      //批量注册
      more: false,
      piliang: "",
    };
  },
  methods: {
    // 批量注册
    // moreswitch(res) {
    //   this.more = res;
    // },
    register() {
      let that = this;
      if (
        that.name == "" ||
        that.username == "" ||
        that.email == "" ||
        that.password == "" ||
        that.confirmpassword == "" ||
        that.value_left == ""
      ) {
        that.$message({
          message: "请将信息填写完整",
          type: "warning",
        });
      } else if (that.password != that.confirmpassword) {
        that.$message({
          message: "两次密码输入不一致",
          type: "error",
        });
      }
      // else if (that.more == true) {
      //   console.log(that.piliang);
      //   let i = 0;
      //   for (i = 0; i < that.piliang; i++) {
      //     axios
      //       .post("http://1.15.236.205:8080/user/register", {
      //         name: that.name,
      //         username: that.username,
      //         email: that.email,
      //         password: that.confirmpassword,
      //         role: that.value_left,
      //       })
      //       .then(() => {
      //         that.name = "";
      //         that.username = "";
      //         that.email = "";
      //         that.password = "";
      //         that.confirmpassword = "";
      //         that.value_left = "";
      //         that.piliang = "";
      //       });
      //   }
      //   if (i == that.piliang) {
      //     that.$message({
      //       message: "批量注册成功",
      //       type: "success",
      //     });
      //   }
      // }
      else {
        let obj = {};
        obj.name = that.name;
        obj.username = that.username;
        obj.email = that.email;
        obj.password = that.confirmpassword;
        obj.role = that.value_left;
        this.request("user/register", obj, "POST")
          .then((res) => {
            console.log(res);
            that.$message({
              message: "注册成功",
              type: "success",
            });
            that.name = "";
            that.username = "";
            that.email = "";
            that.password = "";
            that.confirmpassword = "";
            that.value_left = "";
          })
          .catch((res) => {
            this.$message({
              message: res.response.data.message,
              type: "error",
            });
          });
      }
    },
    authorize() {
      let that = this;
      console.log(that.value1);
      console.log(that.value2);
      for (let i = 0; i < that.value1.length; i++) {
        console.log(that.value1[i]);
        let url = "user/" + that.value1[i];
        this.request(url, {}, "GET").then((res) => {
          // console.log(res.data);
          let obj = {
            email: res.data.email,
            id: res.data.id,
            name: res.data.name,
            role: that.value2,
            username: res.data.username,
            enable: res.data.enable,
          };
          setTimeout(function() {
            console.log(obj);
            that
              .request(url, obj, "PUT")
              .then((res) => {
                console.log(res);
                that.$message({
                  message: "授权成功",
                  type: "success",
                });
                that.$router.push("/userList");
              })
              .catch((res) => {
                console.log(res.response);
                that.$message({
                  message: "授权失败",
                  type: "error",
                });
              });
          }, 200);
        });
      }
    },
  },
};
</script>
<style lang="scss">
.Container-Authorize {
  //   border: 1px solid red;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background: #fff;
  .box {
    width: 30%;
    height: 50%;
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
    .select-body {
      width: 100%;
      height: 65%;
      // border: 1px solid red;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      span {
        font-size: 12px;
        letter-spacing: 1px;
      }
      .el-select {
        // border: 1px solid red;
        width: 75%;
      }
    }
    .input-body {
      width: 100%;
      height: 70%;
      // border: 1px solid red;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      span {
        font-size: 12px;
        letter-spacing: 1px;
      }
      .el-select {
        // border: 1px solid red;
        width: 75%;
      }
      .userinfoinput {
        // border: 1px solid red;
        display: flex;
        justify-content: center;
        .el-input__inner {
          // border: 1px solid red;
          width: 75%;
        }
      }
    }
    .login-btn {
      width: 100%;
      height: 12%;
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
        width: 50%;
        border-radius: 5px;
      }
    }
  }
  .register {
    width: 50%;
    height: 85%;
  }
}
</style>
