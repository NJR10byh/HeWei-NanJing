<template>
  <div class="Container-edituser">
    <div class="box">
      <div class="head">
        <div class="head-text">授权</div>
      </div>
      <div class="input-body">
        <span>只能创建一个管理员，以及三种普通用户权限</span>
        <el-select
          v-model="value1"
          placeholder="人员选择"
          clearable
          filterable
          multiple
          @change="change1"
        >
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="value2"
          placeholder="权限选择"
          clearable
          @change="change2"
        >
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
    axios.get("http://47.102.214.37:8080/user/query?role=!ROOT").then((res) => {
      console.log(res);
    });
  },
  data() {
    return {
      options1: [],
      options2: [
        {
          value: "ADMIN",
          label: "ADMIN",
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
    change1(res) {
      console.log(res);
    },
    change2(res) {
      console.log(res);
    },
    submit() {
      let that = this;
      console.log(that.value2);
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
