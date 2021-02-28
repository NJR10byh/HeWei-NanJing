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
        <div class="part1 Name" style="width: 50%;">
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
        <div class="part1 Clazz" style="width: 50%;">
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
      <div class="Description-Request">
        <div class="part2" style="width: 50%;">
          <div class="Text">异常描述</div>
          <el-input
            type="textarea"
            :rows="3"
            v-model="textarea1"
            style="width:85%;margin-top: 5px;"
          ></el-input>
        </div>
        <div class="part2 Side" style="width: 50%;">
          <div class="Text">异常处理请求</div>
          <el-input
            type="textarea"
            v-model="textarea2"
            :rows="3"
            style="width:85%;margin-top: 5px;"
          ></el-input>
        </div>
      </div>
      <div class="SelectOpreator">
        <div class="part3">
          <div class="Text">选择报告接受人</div>
          <el-select v-model="assignee" placeholder="请选择">
            <el-option-group
              v-for="group in options"
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
        </div>
      </div>
      <div class="submitbtn">
        <el-button @click="submit">提交</el-button>
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
            deviceID: res.data.id,
          });
        });
      }
    });
    axios.get("http://47.102.214.37:8080/user/query").then((res) => {
      console.log(res.data);
      setTimeout(function() {
        for (let i = 0; i < res.data.content.length; i++) {
          if (res.data.content[i].role == "OPERATOR") {
            that.options[0].options.push({
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
      reporter: "", // 报告人员
      deviceinfo: [],
      textarea1: "",
      textarea2: "",
      // 报告接受人
      assignee: "",
      options: [
        {
          label: "OPERATOR",
          options: [],
        },
      ],
    };
  },
  methods: {
    submit() {
      let that = this;
      console.log(this.value);
      let device = [];
      for (let i = 0; i < that.deviceinfo.length; i++) {
        device.push({
          id: that.deviceinfo[0].deviceID,
        });
      }
      let obj = {
        assignee: { id: that.assignee },
        closed: false,
        content: that.textarea2,
        descriptionPic: null,
        device: device,
        reporter: { id: that.$route.query.id * 1 },
        record: null,
      };
      console.log(obj);
      axios.post("http://47.102.214.37:8080/issue", obj).then((res) => {
        console.log(res);
      });
    },
  },
};
</script>
<style lang="scss">
.ErrorTask-container {
  height: 100%;
  //   border: 1px solid red;
  padding: 10px 0;
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
    .Name-Clazz {
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;
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
    .Description-Request {
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
    .SelectOpreator {
      padding: 10px 0;
      // border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: flex-start;
      .part3 {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .Text {
          // border: 1px solid red;
          font-size: 18px;
          font-weight: 600;
        }
        .el-select {
          margin-top: 5px;
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
