<template>
  <div class="Container-MySubmitDetail">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备维修</el-breadcrumb-item>
      <el-breadcrumb-item class="active"
        >异常ID：{{ errorid }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Task-container">
      <div class="Step">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="申请"></el-step>
          <el-step title="分配"></el-step>
          <el-step title="修复"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </div>
      <div class="backbtn">
        <div class="backbtn_right" v-if="reporterid == userid">
          <el-button @click="confirm" class="confirm">确认</el-button>
          <el-button @click="refuse" class="refuse">拒绝</el-button>
        </div>
      </div>
      <div class="Task-info">
        <div class="Users">
          <div class="part0" style="width: 40%;">
            <div class="Text">报修人员</div>
            <div class="Info" v-for="(item, index) in applyusers" :key="index">
              {{ item.applyusersName }}
            </div>
          </div>
          <div class="part0" style="width: 40%;">
            <div class="Text">维修人员</div>
            <div class="Info" v-for="(item, index) in fixusers" :key="index">
              {{ item.fixusersName }}
            </div>
          </div>
        </div>
        <div class="Error-name-clazz">
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
        <div class="Errordescription-Errorcontent">
          <div class="part3 Errordescription" style="width: 40%;">
            <div class="Text">异常描述</div>
            <div class="Info" v-for="(item, index) in Images" :key="index">
              <img
                :src="item.image"
                alt=""
                @click="imgurl(item.image)"
                width="60"
              />
            </div>
          </div>
          <div class="part3 Errorcontent" style="width: 40%;">
            <div class="Text">异常处理请求</div>
            <div class="Info">
              {{ errorcontent }}
            </div>
          </div>
        </div>
        <div class="Type-Reason-Solution">
          <div class="part4 Reason" style="width: 40%;">
            <div class="Text">异常发生原因</div>
            <div class="Info">
              {{ reason }}
            </div>
          </div>
          <div class="part4 Solution" style="width: 40%;">
            <div class="Text">异常解决措施</div>
            <div class="Info">
              {{ solution }}
            </div>
          </div>
          <div class="part4 ExceptionType">
            <div class="Text">异常类型</div>
            <div class="Info">
              {{ exceptionType }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
  created: function() {
    let that = this;
    that.active = 0;
    console.log(that.$route.query);
    that.errorid = that.$route.query.errorid;
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      console.log(res.data);
      this.userid = res.data.id;
    });
    let url = "http://47.102.214.37:8080/issue/" + that.$route.query.errorid;
    axios.get(url).then((res) => {
      console.log(res.data);
      that.reporterid = res.data.reporter.id;
      that.errorcontent = res.data.content;
      that.reason = res.data.reason;
      that.solution = res.data.solution;
      that.exceptionType = res.data.exceptionType;
      let usersid = {};
      if (res.data.assignee.length == 2) {
        usersid.fixusersid = res.data.assignee[1].id;
      }
      usersid.applyusersid = res.data.reporter.id;
      that.applyusersid = res.data.reporter.id;
      setTimeout(() => {
        // 报修人员
        let searchreporters =
          "http://47.102.214.37:8080/user/query?id==" + usersid.applyusersid;
        axios.get(searchreporters).then((res) => {
          that.applyusers.push({
            applyusersName:
              res.data.content[0].name +
              "（ id：" +
              res.data.content[0].id +
              " ）",
          });
          setTimeout(() => {
            that.active++;
          }, 500);
        });
        // 维修人员
        if (usersid.fixusersid != undefined) {
          let searchops =
            "http://47.102.214.37:8080/user/query?id==" + usersid.fixusersid;
          axios.get(searchops).then((res) => {
            that.fixusers.push({
              fixusersName:
                res.data.content[0].name +
                "（ id：" +
                res.data.content[0].id +
                " ）",
            });
            that.active++;
          });
        }
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
      // 异常图片
      if (res.data.descriptionPic != null) {
        for (
          let i = 0;
          i < res.data.descriptionPic.split("\n").length - 1;
          i++
        ) {
          that.Images.push({
            image:
              "http://47.102.214.37:8080/pic/" +
              res.data.descriptionPic.split("\n")[i],
          });
        }
      }
    });
  },
  data() {
    return {
      applyusersid: "",
      // 步骤条
      active: 0,

      errorid: "",
      userid: "", // 当前登录人员
      assigneeid: "", // 接受人员
      reporterid: "", // 报修人员
      fixusers: [], // 维修人员
      applyusers: [],
      deviceinfo: [], // 维修设备
      errordescription: "", // 异常描述
      errorcontent: "", // 异常处理请求
      reason: "", // 异常发生原因
      solution: "", // 异常解决措施
      exceptionType: "", // 异常类型

      // 异常描述图片
      Images: [],
      dialogVisible: false,
      dialogImageUrl: "",
    };
  },
  methods: {
    confirm() {},
    refuse() {},
    // 预览图片
    imgurl(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
  },
};
</script>
<style lang="scss">
.Container-MySubmitDetail {
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
    .Step {
      width: 100%;
      margin-top: 10px;
    }
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
      .backbtn_right {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .confirm {
        background: #5ed100;
      }
      .refuse {
        background: #ff6060;
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
      .Error-name-clazz {
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
      .Errordescription-Errorcontent {
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
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
      .Type-Reason-Solution {
        padding: 10px 0;
        // border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: flex-start;
        .part4 {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          // border: 1px solid red;
          .Text {
            // border: 1px solid red;
            font-size: 18px;
            font-weight: 600;
            padding-bottom: 10px;
          }
        }
        .ExceptionType {
          .el-input__inner {
            width: 80%;
          }
        }
      }
    }
  }
}
</style>
