<template>
  <div class="ErrorTask-container">
    <div class="Task-info">
      <div class="title">报修申请单</div>
      <div class="Users-Name">
        <div class="part0" style="width: 50%;">
          <div class="Text">报告人员</div>
          <user
            :name="reporter.name"
            :username="reporter.username"
            :useremail="reporter.useremail"
            :avatar="reporter.avatarurl"
            style="margin-top:5px;"
          ></user>
        </div>
        <div class="part0 device" style="width: 50%;">
          <div class="deviceselect">
            <div class="Text">选择设备</div>
            <el-select
              v-model="device"
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.devicename"
                :value="item.value"
              >
                <span style="float: left;font-size:13px;">{{
                  item.devicename
                }}</span>
                <span
                  style="float: right; color: #8492a6;font-size: 13px;margin-right:15px;"
                  >{{ item.devicenumber }}</span
                >
              </el-option>
            </el-select>
          </div>
          <div class="devicesinput" v-if="reporter.role == 'OPERATOR'">
            <div class="Text">按编号添加设备</div>
            <el-input
              v-model="deviceno"
              placeholder="请输入设备编号"
            ></el-input>
          </div>
          <div class="devicesbtn" v-if="reporter.role == 'OPERATOR'">
            <el-button @click="searchdevice">查找</el-button>
          </div>
        </div>
      </div>
      <div class="Content">
        <div class="part2" style="width: 100%;">
          <div class="Text">异常描述和异常处理请求</div>
          <!-- 富文本编辑器 -->
          <quill-editor
            ref="myQuillEditor"
            v-model="content"
            :options="editorOption"
            style="height:70%;margin-top: 5px;width:100%;"
            @change="onEditorChange($event)"
          ></quill-editor>
        </div>
      </div>
      <div class="SelectOpreator ">
        <div class="part3">
          <div class="Text">选择报告接受人</div>
          <el-select v-model="assignee" placeholder="请选择">
            <el-option-group
              v-for="group in options2"
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
    <el-upload
      list-type="picture"
      action=""
      :auto-upload="false"
      accept=".jpg, .png"
      :show-file-list="false"
      :on-change="getFile"
      class="avatar-uploader"
      style="display: none"
    >
    </el-upload>
  </div>
</template>
<script>
import axios from "axios";
import User from "../components/Userinfo";
import { quillEditor } from "vue-quill-editor";
// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  [{ list: "ordered" }, { list: "bullet" }],
  ["image"],
];

export default {
  components: {
    quillEditor,
    User,
  },
  created: function() {
    let that = this;
    let userRole = "";
    console.log();
    // 获取当前登录用户基本信息
    that.reporter.id = this.globaldata.userid;
    that.reporter.name = this.globaldata.name;
    that.reporter.role = this.globaldata.userRole;
    that.reporter.username = this.globaldata.username;
    that.reporter.useremail = this.globaldata.useremail;
    that.reporter.avatarurl = this.globaldata.avatarurl;
    setTimeout(() => {
      // 如果当前登录用户不是 OPERATOR ，则获取全部设备
      if (userRole != "" && userRole != "OPERATOR") {
        // 获取全部设备
        that
          .resquest("device?page=0&size=1000000000", {}, "GET")
          .then((res) => {
            for (var i = 0; i < res.data.content.length; i++) {
              let obj = {};
              obj.value = res.data.content[i].id;
              obj.devicename = res.data.content[i].name;
              obj.devicenumber = res.data.content[i].deviceNo;
              that.options1.push(obj);
            }
          })
          .catch((res) => {
            this.$message({
              message: res.response.data.message,
              type: "error",
            });
          });
        // 获取全部SUPERVISOR
        that
          .resquest("user/query", {}, "GET")
          .then((res) => {
            // console.log(res.data);
            setTimeout(function() {
              for (let i = 0; i < res.data.content.length; i++) {
                if (res.data.content[i].role == "SUPERVISOR") {
                  that.options2[0].options.push({
                    value: res.data.content[i].id,
                    label:
                      res.data.content[i].name +
                      " (用户名：" +
                      res.data.content[i].username +
                      ")",
                  });
                }
              }
            }, 300);
          })
          .catch((res) => {
            this.$message({
              message: res.response.data.message,
              type: "error",
            });
          });
      }
      // 如果当前登录用户是 OPERATOR ，则获取与他关联的设备
      else if (userRole != "" && userRole == "OPERATOR") {
        // 获取全部分配到自己的设备
        that
          .resquest("my/device", {}, "GET")
          .then((res) => {
            console.log(res.data);
            for (var i = 0; i < res.data.length; i++) {
              // console.log(res.data.content[i]);
              let obj = {};
              obj.value = res.data[i].id;
              obj.devicename = res.data[i].name;
              obj.devicenumber = res.data[i].deviceNo;
              that.options1.push(obj);
            }
          })
          .catch((res) => {
            this.$message({
              message: res.response.data.message,
              type: "error",
            });
          });
        // 获取全部SUPERVISOR
        that
          .resquest("user/query", {}, "GET")
          .then((res) => {
            // console.log(res.data);
            for (let i = 0; i < res.data.content.length; i++) {
              if (res.data.content[i].role == "SUPERVISOR") {
                that.options2[0].options.push({
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
      }
    }, 300);
  },
  data() {
    return {
      reporter: {}, // 报告人员
      // 设备选择
      device: [],
      deviceno: "",
      options1: [],
      content: "", // 异常内容

      // 报告接受人
      assignee: "",
      options2: [
        {
          label: "SUPERVISOR",
          options: [],
        },
      ],

      // 富文本编辑器
      editorOption: {
        placeholder: "请输入异常描述和异常处理请求",
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              },
            },
          },
        },
      },
    };
  },
  methods: {
    // 富文本编辑器内容改变
    onEditorChange({ html }) {
      console.log(html);
      this.content = html;
    },
    // 上传图片
    getFile(file) {
      let that = this;
      this.getBase64(file.raw).then((res) => {
        const params = res.split(",");
        console.log(params, "params");
        if (params.length > 0) {
          axios({
            url: "http://47.102.214.37:8080/pic",
            method: "post",
            data: params[1],
            headers: {
              "Content-Type": "text/plain",
            },
          })
            .then((res) => {
              console.log(res);
              let url = "http://47.102.214.37:8080/pic/" + res.data;
              let quill = that.$refs.myQuillEditor.quill;
              // 获取光标所在位置
              let length = quill.getSelection().index;
              // 插入图片
              quill.insertEmbed(length, "image", url);
              // 调整光标到最后
              quill.setSelection(length + 1);
            })
            .catch((res) => {
              this.$message({
                message: res.response.data.message,
                type: "error",
              });
            });
        }
      });
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

    // 提交异常报告
    submit() {
      let that = this;
      let assignee = [];
      let device = [];
      console.log(that.device, that.assignee);
      if (
        that.assignee == "" ||
        that.device.length == 0 ||
        that.content == ""
      ) {
        that.$message({
          message: "请将信息填写完整",
          type: "warning",
        });
      } else {
        device.push({
          id: that.device,
        });
        assignee.push({
          id: that.assignee,
        });
        let obj = {
          assignee: assignee,
          closed: false,
          content: that.content,
          device: device,
          reporter: { id: that.reporter.id },
        };
        console.log(obj);
        that
          .resquest("issue", obj, "POST")
          .then((res) => {
            console.log(res);
            that.$message({
              message: "申请成功",
              type: "success",
            });
            setTimeout(() => {
              that.$router.push({
                path: "./allError",
              });
            }, 1000);
          })
          .catch((res) => {
            this.$message({
              message: res.response.data.message,
              type: "error",
            });
          });
      }
    },
    // OPERATOR查找设备
    searchdevice() {
      let that = this;
      console.log(that.deviceno);
      let url =
        "http://47.102.214.37:8080/device/query?deviceNo==" + that.deviceno;
      that
        .resquest(url, {}, "GET")
        .then((res) => {
          console.log(res.data);
          that.deviceno = "";
          let obj = {};
          obj.value = res.data.content[0].id;
          obj.devicename = res.data.content[0].name;
          obj.devicenumber = res.data.content[0].deviceNo;
          that.options1.push(obj);
          that.$message({
            message: "查找成功，已添加至设备选择列表",
            type: "success",
          });
        })
        .catch((res) => {
          that.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
    },
  },
};
</script>
<style lang="scss">
.ErrorTask-container {
  height: 100%;
  // border: 1px solid red;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .Task-info {
    width: 90%;
    height: 700px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 5px 5px 20px #eeeeee, -5px 5px 20px #eeeeee;
    padding: 20px;
    // border: 1px solid red;
    display: flex;
    flex-direction: column;
    .title {
      display: flex;
      justify-content: center;
      padding-bottom: 10px;
      font-size: 25px;
      font-weight: bold;
      border-bottom: 2px solid black;
    }
    .Users-Name {
      // border: 1px solid red;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: flex-start;
      padding: 10px 0;
      .part0 {
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
        }
        .el-select {
          margin-top: 5px;
        }
      }
      .device {
        display: flex;
        flex-direction: row;
        align-items: center;
        // border: 1px solid red;
        .deviceselect {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .devicesinput {
          margin-left: 20px;
          .el-input {
            margin-top: 5px;
          }
        }
        .devicesbtn {
          display: flex;
          align-self: flex-end;
          margin-left: 10px;
          margin-bottom: 6px;
          .el-button {
            width: 60px;
            background: #409eff;
            border: 0;
            padding: 12px 0;
            color: #fff;
            font-size: 16px;
            border-radius: 5px;
          }
        }
      }
    }
    .Content {
      // border: 1px solid red;
      height: 100%;
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
