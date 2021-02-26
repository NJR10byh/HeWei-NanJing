<template>
  <div class="ErrorTask-container">
    <div class="Task-info">
      <div class="title">异常报告卡</div>
      <div class="Users">
        <div class="part0">
          <div class="Text">报告人员</div>
          <div class="Info">
            {{ reporter }}
          </div>
        </div>
      </div>
      <div class="Name-Clazz">
        <div class="part2 Name" style="width: 50%;">
          <div class="Text">设备名称</div>
          <div class="Info" v-if="deviceinfo.length == 0">暂无</div>
          <div
            class="Info"
            v-else
            v-for="(item, index) in deviceinfo"
            :key="index"
          >
            {{ item.deviceName }}
          </div>
        </div>
        <div class="part2 Clazz" style="width: 50%;">
          <div class="Text">设备类别</div>
          <div class="Info" v-if="deviceinfo.length == 0">暂无</div>
          <div
            class="Info"
            v-else
            v-for="(item, index) in deviceinfo"
            :key="index"
          >
            {{ item.deviceClazz }}
          </div>
        </div>
      </div>
      <div class="Side-Standard">
        <div class="part1" style="width: 50%;">
          <div class="Text">异常描述</div>
          <el-input
            type="textarea"
            :rows="3"
            v-model="textarea1"
            style="width:85%"
          ></el-input>
        </div>
        <div class="part1 Side" style="width: 50%;">
          <div class="Text">异常处理请求</div>
          <el-input
            type="textarea"
            v-model="textarea2"
            :rows="3"
            style="width:85%"
          ></el-input>
        </div>
      </div>
      <div class="submitbtn">
        <el-button>提交</el-button>
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
    that.reporter =
      "姓名：" +
      that.$route.query.name +
      " | 用户名：" +
      that.$route.query.username +
      " | 用户ID：" +
      that.$route.query.id;
    let url =
      "http://47.102.214.37:8080/ops/schedule/detail/" +
      that.$route.query.taskid;
    axios.get(url).then((res) => {
      console.log(res.data);
      // 设备名称
      for (let i = 0; i < res.data.device.length; i++) {
        let searchdevice =
          "http://47.102.214.37:8080/device/" + res.data.device[i].id;
        axios.get(searchdevice).then((res) => {
          console.log(res.data);
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
      reporter: "", // 报告人员
      deviceinfo: [],
      textarea1: "",
      textarea2: "",
    };
  },
};
</script>
<style lang="scss">
.ErrorTask-container {
  height: 100%;
  //   border: 1px solid red;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .Task-info {
    width: 40%;
    // height: 80%;
    background: #fff;
    border-radius: 15px;
    box-shadow: 5px 5px 20px #eeeeee, -5px 5px 20px #eeeeee;
    padding: 10px 20px;
    // border: 1px solid red;
    display: flex;
    flex-direction: column;
    .title {
      display: flex;
      justify-content: center;
      padding-bottom: 10px;
      font-size: 25px;
      font-weight: bold;
      border-bottom: 1px solid black;
    }
    .Users {
      // border: 1px solid red;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 10px;
      display: flex;
      justify-content: flex-start;
      margin-top: 10px;
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
      padding: 10px 0;
      //   border-bottom: 1px solid #e0e0e0;
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
    .Name-Clazz {
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;
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
    .submitbtn {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      .el-button {
        width: 70%;
        background: #409eff;
        border: 0;
        padding: 12px 0;
        color: #fff;
        font-size: 17px;
        letter-spacing: 3px;
        border-radius: 5px;
      }
    }
  }
}
</style>
