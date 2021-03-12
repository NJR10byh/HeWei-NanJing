<template>
  <div class="Container-DiagnosisDetail">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备维修</el-breadcrumb-item>
      <el-breadcrumb-item class="active"
        >异常ID：{{ errorid }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Task-container">
      <div class="backbtn">
        <el-button @click="TssignFix" v-if="userRole == 'SUPERVISOR'"
          >分配此申请</el-button
        >
        <el-button @click="submitbtn" v-if="userRole == 'OPERATOR'"
          >提交诊断</el-button
        >
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
              <img :src="item.image" alt="" @click="imgurl(item.image)" />
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
            <el-input
              type="textarea"
              v-model="reason"
              style="width:80%"
              :rows="3"
              placeholder="异常发生原因"
            ></el-input>
          </div>
          <div class="part4 Solution" style="width: 40%;">
            <div class="Text">异常解决措施</div>
            <el-input
              type="textarea"
              v-model="solution"
              style="width:80%"
              :rows="3"
              placeholder="异常解决措施"
            ></el-input>
          </div>
          <div class="part4 ExceptionType">
            <div class="Text">异常类型</div>
            <el-input
              type="text"
              v-model="exceptionType"
              placeholder="异常类型"
            ></el-input>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <el-dialog title="选择维修人" :visible.sync="dialogFixVisible">
      <el-select v-model="assigneeOp" placeholder="请选择">
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
            :disabled="item.disabled"
          >
          </el-option>
        </el-option-group>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFixVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTssign">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
  created: function() {
    let that = this;
    console.log(that.$route.query);
    that.errorid = that.$route.query.errorid;
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      that.userRole = res.data.role;
    });
    let url = "http://47.102.214.37:8080/issue/" + that.$route.query.errorid;
    axios.get(url).then((res) => {
      console.log(res.data);
      let usersid = {};
      if (res.data.assignee.length == 2) {
        usersid.fixusersid = res.data.assignee[1].id;
      }
      usersid.applyusersid = res.data.reporter.id;
      that.applyusersid = res.data.reporter.id;
      that.errorcontent = res.data.content;
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
    setTimeout(() => {
      // 获取全部OPERATOR
      axios.get("http://47.102.214.37:8080/user/query").then((res) => {
        // console.log(res.data);
        for (let i = 0; i < res.data.content.length; i++) {
          if (res.data.content[i].role == "OPERATOR") {
            // 禁用报修人为维修人
            if (res.data.content[i].id == that.applyusersid) {
              that.options[0].options.push({
                value: res.data.content[i].id,
                label:
                  res.data.content[i].name +
                  " (用户名：" +
                  res.data.content[i].username +
                  ")",
                disabled: true,
              });
            } else {
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
        }
      });
    }, 300);
  },
  data() {
    return {
      userRole: "",
      applyusersid: "",

      errorid: "",
      applyusers: [], // 报修人员
      fixusers: [], // 维修人员
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

      // 报告接受人
      dialogFixVisible: false,
      assigneeOp: "",
      options: [
        {
          label: "OPERATOR",
          options: [],
        },
      ],
    };
  },
  methods: {
    // 预览图片
    imgurl(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 分配维修
    TssignFix() {
      this.dialogFixVisible = true;
    },
    // 提交分配
    submitTssign() {
      console.log(this.assigneeOp);
      let that = this;
      let url = "http://47.102.214.37:8080/issue/" + that.errorid;
      axios.get(url).then((res) => {
        console.log(res.data);
        let obj = {};
        obj.assignee = res.data.assignee;
        obj.closed = res.data.closed;
        obj.content = res.data.content;
        obj.descriptionPic = res.data.descriptionPic;
        obj.device = res.data.device;
        obj.exceptionType = res.data.exceptionType;
        obj.id = res.data.id;
        obj.reason = res.data.reason;
        obj.record = res.data.record;
        obj.reporter = res.data.reporter;
        obj.solution = res.data.solution;
        obj.assignee.push({
          id: that.assigneeOp,
        });
        console.log(res.data.assignee);
        // axios
        //   .put(url)
        //   .then((res) => {
        //     console.log(res);
        //     that.$message({
        //       message: "分配成功",
        //       type: "success",
        //     });
        //     that.dialogFixVisible = false;
        //   })
        //   .catch(() => {
        //     that.$message({
        //       message: "分配失败",
        //       type: "error",
        //     });
        //   });
      });
    },
    // 提交诊断
    submitbtn() {
      let that = this;
      let obj = {};
      let url = "http://47.102.214.37:8080/issue/" + that.errorid;
      axios.get(url).then((res) => {
        console.log(res.data);
        obj.assignee = res.data.assignee;
        obj.closed = res.data.closed;
        obj.content = res.data.content;
        obj.descriptionPic = res.data.descriptionPic;
        obj.device = res.data.device;
        obj.exceptionType = that.exceptionType;
        obj.id = res.data.id;
        obj.reason = that.reason;
        obj.record = res.data.record;
        obj.reporter = res.data.reporter;
        obj.solution = that.solution;
      });
      setTimeout(() => {
        console.log(obj);
        axios.put(url, obj).then((res) => {
          console.log(res);
          that.$message({
            message: "提交成功",
            type: "success",
          });
        });
      }, 200);
    },
  },
};
</script>
<style lang="scss">
.Container-DiagnosisDetail {
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
      justify-content: flex-end;
      align-items: center;
      // border: 1px solid red;
      .el-button {
        display: flex;
        align-self: flex-start;
        background: #409eff;
        color: #fff;
        border: 0;
        font-size: 15px;
        padding: 8px 10px;
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
            img {
              width: 80px;
            }
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
