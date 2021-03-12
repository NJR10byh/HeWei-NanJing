<template>
  <div class="ErrorTask-container">
    <div class="Task-info">
      <div class="title">报修申请单</div>
      <div class="Users">
        <div class="part0">
          <div class="Text">报告人员</div>
          <div class="Info">
            {{ reporter }}
          </div>
        </div>
      </div>
      <div class="Name-Number">
        <div class="part1 Name" style="width: 50%;">
          <div class="Text">设备名称</div>
          <el-select
            v-model="device"
            filterable
            clearable
            multiple
            placeholder="请选择"
            @change="change"
            @clear="clear"
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
        <div class="part1 Clazz" style="width: 50%;">
          <div class="Text">设备编号</div>
          <div class="Info" v-if="deviceNo == ''">暂无</div>
          <div
            class="Info"
            v-else
            v-for="(item, index) in deviceNo"
            :key="index"
          >
            {{ item.deviceNoinfo }}
          </div>
        </div>
      </div>
      <div class="Description-Request">
        <div class="part2" style="width: 50%;">
          <div class="Text">异常描述</div>
          <el-upload
            list-type="picture"
            action=""
            accept=".jpg, .png"
            :auto-upload="false"
            :on-change="getFile"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleUploadRemove"
          >
            <el-button size="small" type="primary" style="margin-top:5px;"
              >选择图片上传</el-button
            >
            <span slot="tip" style="font-size:13px;margin-left:10px;"
              >只能上传 jpg/png 文件</span
            >
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </div>
        <div class="part2 Side" style="width: 50%;">
          <div class="Text">异常处理请求</div>
          <el-input
            type="textarea"
            v-model="content"
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
export default {
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
            // console.log(res.data);
            for (var i = 0; i < res.data.content.length; i++) {
              // console.log(res.data.content[i]);
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

      // 设备编号
      deviceNo: [],

      // base64图片上传
      dialogVisible: false,
      dialogImageUrl: "",
      file: null,
      descriptionPic: [],

      // 报告接受人
      assignee: "",
      options2: [
        {
          label: "SUPERVISOR",
          options: [],
        },
      ],
    };
  },
  methods: {
    change(res) {
      let that = this;
      that.deviceNo = [];
      if (res == "") {
        return;
      } else {
        console.log(res);
        for (let i = 0; i < res.length; i++) {
          let url = "http://47.102.214.37:8080/device/" + res[i];
          axios.get(url).then((res) => {
            console.log(res.data);
            that.deviceNo.push({
              deviceNoinfo: res.data.deviceNo,
            });
          });
        }
      }
    },
    clear() {
      this.deviceNo = "";
    },
    // 通过getFile方法获取文件信息
    getFile(file) {
      this.getBase64(file.raw).then((res) => {
        const params = res.split(",");
        console.log(params, "params");
        if (params.length > 0) {
          this.descriptionPic.push({
            base64: params[1],
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
    // 预览和删除
    handleUploadRemove() {
      this.dialogImageUrl = "";
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 提交异常报告
    submit() {
      let that = this;
      let Images = "";
      console.log(that.descriptionPic);
      for (let i = 0; i < that.descriptionPic.length; i++) {
        let base64img = that.descriptionPic[i].base64;
        // console.log(base64img);
        axios
          .post("http://47.102.214.37:8080/pic", base64img, {
            headers: {
              //头部信息
              "Content-Type": "text/plain",
            },
          })
          .then((res) => {
            console.log(res.data);
            Images = Images + res.data + "\n";
          });
      }
      setTimeout(function() {
        console.log(Images);
        let assignee = [];
        let device = [];
        if (
          that.assignee == [] ||
          that.device == [] ||
          Images == "" ||
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
            descriptionPic: Images,
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
      }, 300);
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
    width: 60%;
    min-height: 65%;
    background: #fff;
    border-radius: 15px;
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
    .Name-Number {
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
        .el-select {
          margin-top: 5px;
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
