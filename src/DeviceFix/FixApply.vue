<template>
  <div class="ErrorTask-container">
    <div class="Task-info">
      <div class="title">报修申请单</div>
      <div class="Users-Name">
        <div class="part0" style="width: 50%;">
          <div class="Text">报告人员</div>
          <div class="Info">
            {{ reporter }}
          </div>
        </div>
        <div class="part0" style="width: 50%;">
          <div class="Text">设备名称</div>
          <el-select
            v-model="device"
            filterable
            clearable
            multiple
            collapse-tags
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
      </div>
      <div class="Description">
        <div class="part2" style="width: 100%;">
          <div class="Text">异常描述</div>
          <quill-editor
            ref="myTextEditor"
            v-model="descriptionPic"
            :options="editorOption"
            style="height:70%;margin-top: 5px;"
            @change="onEditorChange($event)"
          ></quill-editor>
        </div>
      </div>
      <div class="Request-SelectOpreator ">
        <div class="part3" style="width: 50%;">
          <div class="Text">异常处理请求</div>
          <el-input
            type="textarea"
            v-model="content"
            :rows="3"
            style="width:85%;margin-top: 5px;"
          ></el-input>
        </div>
        <div class="part3" style="width: 50%;">
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
  </div>
</template>
<script>
import axios from "axios";
import { quillEditor } from "vue-quill-editor";
// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  components: {
    quillEditor,
  },
  created: function() {
    let that = this;
    let userRole = "";
    // 获取当前登录用户基本信息
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      console.log(res.data);
      that.reporter =
        "姓名：" +
        res.data.name +
        " | 用户名：" +
        res.data.username +
        " | 用户ID：" +
        res.data.id;
      that.userid = res.data.id;
      userRole = res.data.role;
    });
    setTimeout(() => {
      if (userRole != "OPERATOR") {
        // 获取全部设备
        axios
          .get("http://47.102.214.37:8080/device/query?name=!")
          .then((res) => {
            for (var i = 0; i < res.data.content.length; i++) {
              let obj = {};
              obj.value = res.data.content[i].id;
              obj.devicename = res.data.content[i].name;
              obj.devicenumber = res.data.content[i].deviceNo;
              that.options1.push(obj);
            }
          });
        // 获取全部SUPERVISOR
        axios.get("http://47.102.214.37:8080/user/query").then((res) => {
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
          }, 200);
        });
      } else if (userRole == "OPERATOR") {
        // 获取全部分配到自己的设备
        axios.get("http://47.102.214.37:8080/my/device").then((res) => {
          console.log(res.data);
          for (var i = 0; i < res.data.length; i++) {
            // console.log(res.data.content[i]);
            let obj = {};
            obj.value = res.data[i].id;
            obj.devicename = res.data[i].name;
            obj.devicenumber = res.data[i].deviceNo;
            that.options1.push(obj);
          }
        });
        // 获取全部SUPERVISOR
        axios.get("http://47.102.214.37:8080/user/query").then((res) => {
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
        });
      }
    }, 300);
  },
  data() {
    return {
      reporter: "", // 报告人员
      userid: "",
      // 设备选择
      device: [],
      options1: [],
      content: "",

      // 异常描述
      descriptionPic: "",

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
        placeholder: "请输入保养内容",
      },
    };
  },
  methods: {
    // 富文本编辑器内容改变
    onEditorChange({ html }) {
      console.log(html);
      this.descriptionPic = html;
    },

    // 提交异常报告
    submit() {
      let that = this;
      console.log(that.descriptionPic);
      let assignee = [];
      let device = [];
      if (
        that.assignee == [] ||
        that.device == [] ||
        that.descriptionPic == "" ||
        that.content == ""
      ) {
        that.$message({
          message: "请将信息填写完整",
          type: "warning",
        });
      } else {
        for (let i = 0; i < that.device.length; i++) {
          device.push({
            id: that.device[i],
          });
        }
        assignee.push({
          id: that.assignee,
        });
        // console.log(descriptionPic);
        let obj = {
          assignee: assignee,
          closed: false,
          content: that.content,
          descriptionPic: that.descriptionPic,
          device: device,
          reporter: { id: that.userid },
        };
        console.log(obj);
        axios
          .post("http://47.102.214.37:8080/issue", obj)
          .then((res) => {
            console.log(res);
            that.$message({
              message: "申请成功",
              type: "success",
            });
          })
          .catch((res) => {
            console.log(res.response);
            this.$message({
              message: "申请失败",
              type: "error",
            });
          });
      }
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
    width: 80%;
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
    }
    .Description {
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
    .Request-SelectOpreator {
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
