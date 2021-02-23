<template>
  <div class="Container-edituser">
    <div class="box">
      <div class="head">
        <div class="head-text">授权</div>
      </div>
      <div class="input-body">
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
        <el-button @click="submit">确定授权</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  created: function() {
    let that = this;
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      this.userRole = res.data.role;
      if (this.userRole == "ADMIN") {
        that.options2.shift();
      }
    });
    axios.get("http://47.102.214.37:8080/user/query?role=!ROOT").then((res) => {
      console.log(res.data);
      setTimeout(function() {
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
      }, 200);
    });
  },
  data() {
    return {
      userRole: "",
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
    };
  },
  methods: {
    submit() {
      let that = this;
      console.log(that.value1);
      console.log(that.value2);
      for (let i = 0; i < that.value1.length; i++) {
        console.log(that.value1[i]);
        let url = "http://47.102.214.37:8080/user/" + that.value1[i];
        axios.get(url).then((res) => {
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
            axios
              .put(url, obj)
              .then((res) => {
                console.log(res);
                that.$message({
                  message: "授权成功",
                  type: "success",
                });
                that.$router.push("/users");
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
.Container-edituser {
  //   border: 1px solid red;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  .box {
    width: 30%;
    height: 55%;
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
        width: 50%;
        border-radius: 5px;
      }
    }
  }
}
</style>
