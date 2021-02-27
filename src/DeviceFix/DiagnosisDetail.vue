<template>
  <div class="Container-AddTaskInside">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备维修</el-breadcrumb-item>
      <el-breadcrumb-item class="active"
        >异常ID：{{ errorid }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Task-container">
      <div class="backbtn">
        <el-button @click="back">返回</el-button>
      </div>
      <div class="Task-info">
        <div class="Users">
          <div class="part0" style="width: 40%;">
            <div class="Text">维修人员</div>
            <div class="Info" v-for="(item, index) in fixusers" :key="index">
              {{ item.fixusersName }}
            </div>
          </div>
        </div>
        <div class="Side-Standard">
          <div class="part1" style="width: 40%;">
            <div class="Text">异常ID</div>
            <div class="Info">{{ errorid }}</div>
          </div>
          <div class="part1 Name" style="width: 40%;">
            <div class="Text">设备名称</div>
            <div class="Info" v-for="(item, index) in deviceinfo" :key="index">
              {{ item.deviceName }}
            </div>
          </div>
          <div class="part1 Clazz">
            <div class="Text">设备类别</div>
            <div class="Info" v-for="(item, index) in deviceinfo" :key="index">
              {{ item.deviceClazz }}
            </div>
          </div>
        </div>
        <div class="Content-Tools-Attention">
          <div class="part3 Content" style="width: 40%;">
            <div class="Text">异常描述</div>
            <div class="Info">
              {{ errordescription }}
            </div>
          </div>
          <div class="part3 Tools" style="width: 40%;">
            <div class="Text">异常处理请求</div>
            <div class="Info">
              {{ errorcontent }}
            </div>
          </div>
        </div>
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
    that.errorid = that.$route.query.errorid;
    let url = "http://47.102.214.37:8080/issue/" + that.$route.query.errorid;
    axios.get(url).then((res) => {
      console.log(res.data);
      let fixusersid = res.data.assignee.id;
      that.errorcontent = res.data.content;
      setTimeout(() => {
        // 维修人员
        let searchops =
          "http://47.102.214.37:8080/user/query?id==" + fixusersid;
        axios.get(searchops).then((res) => {
          that.fixusers.push({
            fixusersName:
              res.data.content[0].name +
              "（ id：" +
              res.data.content[0].id +
              " ）",
          });
        });
      }, 200);
      // 设备名称
      for (let i = 0; i < res.data.device.length; i++) {
        let searchdevice =
          "http://47.102.214.37:8080/device/" + res.data.device[i].id;
        axios.get(searchdevice).then((res) => {
          that.deviceinfo.push({
            deviceName: res.data.name,
            deviceClazz: res.data.clazz,
          });
        });
      }
    });
  },
  data() {
    return {
      errorid: "",
      fixusers: [], // 维修人员
      deviceinfo: [], // 维修设备
      errordescription: "",
      errorcontent: "",
    };
  },
  methods: {
    back() {
      this.$router.push("./fixDiagnosis");
    },
  },
};
</script>
<style lang="scss">
.Container-AddTaskInside {
  // border: 1px solid red;
  width: 100%;
  height: 100%;
  .breadcrumb {
    width: 100%;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    font-size: 16px;
    // border: 1px solid red;
    padding: 10px 0 10px 0;
    .el-breadcrumb__inner {
      font-weight: bold;
      margin-left: 10px;
    }
    .el-breadcrumb__inner.is-link {
      color: #666666;
      font-weight: normal;
    }
    .active {
      font-size: 20px;
    }
  }
  .Task-container {
    // height: 80%;
    // border: 1px solid red;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .backbtn {
      width: 85%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // border: 1px solid red;
      .el-button {
        display: flex;
        align-self: flex-start;
        background: #409eff;
        color: #fff;
        border: 0;
        font-size: 15px;
        padding: 8px 15px;
      }
      .error {
        background: #ffbc05;
      }
    }
    .Task-info {
      width: 85%;
      background: #fff;
      border-radius: 15px;
      box-shadow: 5px 5px 20px #eeeeee, -5px 5px 20px #eeeeee;
      padding: 10px 20px;
      margin-top: 10px;
      // border: 1px solid red;
      .Users {
        // border: 1px solid red;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
        display: flex;
        justify-content: flex-start;
        .part0 {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .Text {
            // border: 1px solid red;
            font-size: 18px;
            font-weight: 600;
          }
          .Info {
            // border: 1px solid red;
            margin-top: 10px;
            display: flex;
            justify-content: flex-start;
            font-size: 14px;
            font-weight: 400;
          }
        }
      }
      .Side-Standard {
        // border: 1px solid red;
        border-bottom: 1px solid #ddd;
        padding: 10px 0;
        display: flex;
        justify-content: flex-start;
        .part1 {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .Text {
            // border: 1px solid red;
            font-size: 18px;
            font-weight: 600;
          }
          .Info {
            // border: 1px solid red;
            margin-top: 10px;
            display: flex;
            justify-content: flex-start;
            font-size: 14px;
            font-weight: 400;
          }
        }
      }
      .Name-Clazz-Time {
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: flex-start;
        .part2 {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .Text {
            // border: 1px solid red;
            font-size: 18px;
            font-weight: 600;
          }
          .Info {
            // border: 1px solid red;
            margin-top: 10px;
            display: flex;
            justify-content: flex-start;
            font-size: 14px;
            font-weight: 400;
          }
        }
      }
      .Content-Tools-Attention {
        padding-top: 10px;
        display: flex;
        justify-content: flex-start;
        .part3 {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          // border: 1px solid red;
          .Text {
            // border: 1px solid red;
            font-size: 18px;
            font-weight: 600;
          }
          .Info {
            // border: 1px solid red;
            margin-top: 10px;
            display: flex;
            justify-content: flex-start;
            font-size: 14px;
            font-weight: 400;
            padding-right: 10px;
          }
        }
      }
    }
  }
}
</style>
