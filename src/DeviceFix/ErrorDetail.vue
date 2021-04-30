<template>
  <div class="Container-ErrorDetail">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备维修</el-breadcrumb-item>
      <el-breadcrumb-item class="active">查看详情 </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Task-container">
      <div class="Step">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="申请" :description="applytime"></el-step>
          <el-step title="分配" :description="assigntime"></el-step>
          <el-step title="修复" :description="fixtime"></el-step>
          <el-step title="确认" :description="completetime"></el-step>
        </el-steps>
      </div>
      <div class="Task-info">
        <div class="Part">
          <div class="part">
            <div
              class="Text"
              style="color: #409eff; font-size: 30px; font-weight: normal"
            >
              申请
            </div>
          </div>
        </div>
        <div class="Part">
          <div class="part" style="width: 50%">
            <div class="Text">报修流水号</div>
            <div class="Info">{{ errorid }}</div>
          </div>
          <div class="part" style="width: 50%">
            <div class="Text">报修人员</div>
            <user
              v-for="(item, index) in applyusers"
              :key="index"
              :name="item.name"
              :username="item.username"
              :useremail="item.useremail"
              :avatar="item.avatar"
              style="margin-top: 10px"
            ></user>
          </div>
        </div>
        <div class="Part">
          <div class="part" style="width: 100%">
            <div class="Text">异常描述和异常处理请求</div>
            <div class="ql-snow">
              <div class="ql-editor" v-html="errorcontent"></div>
            </div>
          </div>
        </div>
        <div class="Part lastpart">
          <div class="part" style="width: 100%">
            <div class="Text">报修设备</div>
            <el-table
              :data="devicetableData"
              stripe
              border
              style="margin-top: 10px; width: 100%"
              class="extraTable"
            >
              <el-table-column prop="id" label="设备ID"></el-table-column>
              <el-table-column prop="name" label="设备名称"></el-table-column>
              <el-table-column prop="brand" label="设备品牌"></el-table-column>
              <el-table-column
                prop="deviceNo"
                label="设备编号"
              ></el-table-column>
              <el-table-column prop="clazz" label="设备分类"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="Task-info">
        <div class="Part">
          <div class="part">
            <div
              class="Text"
              style="color: #409eff; font-size: 30px; font-weight: normal"
            >
              分配
            </div>
          </div>
        </div>
        <div class="Part lastpart">
          <div class="part" style="width: 50%">
            <div class="Text">维修分配人员-Supervisor</div>
            <user
              v-for="(item, index) in supervisor"
              :key="index"
              :name="item.name"
              :username="item.username"
              :useremail="item.useremail"
              :avatar="item.avatar"
              style="margin-top: 10px"
            ></user>
          </div>
          <div class="part" style="width: 50%">
            <div class="Text">维修人员-Operator</div>
            <user
              v-for="(item, index) in operator"
              :key="index"
              :name="item.name"
              :username="item.username"
              :useremail="item.useremail"
              :avatar="item.avatar"
              style="margin-top: 10px"
            ></user>
          </div>
        </div>
        <div
          class="Part lastpart TssignFixBtn"
          v-if="userRole == 'SUPERVISOR' && assigned == false"
        >
          <div class="part" style="width: 100%">
            <div class="Text">分配申请</div>
            <el-button @click="TssignFix">分配此申请</el-button>
          </div>
        </div>
      </div>
      <!-- 是维修人员且未完成 -->
      <div class="Task-info Last" v-if="assigned && opstofix && !closed">
        <div class="Part">
          <div class="part">
            <div
              class="Text"
              style="color: #409eff; font-size: 30px; font-weight: normal"
            >
              修复
            </div>
          </div>
        </div>
        <div class="Part">
          <div class="part" style="width: 50%">
            <div class="Text">异常类型</div>
            <el-input
              type="text"
              v-model="exceptionType"
              placeholder="异常类型"
            ></el-input>
          </div>
          <div class="part" style="width: 50%">
            <div class="Text">发生原因</div>
            <el-input
              type="text"
              v-model="reason"
              placeholder="发生原因"
            ></el-input>
          </div>
        </div>
        <div class="Part lastpart">
          <div class="part result" style="width: 100%">
            <div class="Text">异常解决措施和处理结果</div>
            <!-- 富文本编辑器 -->
            <quill-editor
              ref="myQuillEditor"
              v-model="solution"
              :options="editorOption"
              style="height: 70%; margin-top: 5px; width: 100%"
              @change="onEditorChange($event)"
            ></quill-editor>
          </div>
        </div>
        <div
          class="Part lastpart TssignFixBtn"
          v-if="userRole == 'OPERATOR' && !closed"
        >
          <div class="part" style="width: 100%">
            <div class="Text">提交诊断</div>
            <el-button @click="submitbtn">确认提交</el-button>
          </div>
        </div>
      </div>
      <!-- 不是维修人员或以完成 -->
      <div
        class="Task-info Last"
        v-if="(assigned && !opstofix) || (assigned && closed)"
      >
        <div class="Part">
          <div class="part">
            <div
              class="Text"
              style="color: #409eff; font-size: 30px; font-weight: normal"
            >
              修复
            </div>
          </div>
        </div>
        <div class="Part">
          <div class="part" style="width: 50%">
            <div class="Text">异常类型</div>
            <div class="Info">{{ exceptionType }}</div>
          </div>
          <div class="part" style="width: 50%">
            <div class="Text">发生原因</div>
            <div class="Info">{{ reason }}</div>
          </div>
        </div>
        <div class="Part lastpart">
          <div class="part" style="width: 50%">
            <div class="Text">异常解决措施和处理结果</div>
            <div class="ql-snow">
              <div class="ql-editor" v-html="solution"></div>
            </div>
          </div>
          <div class="part" style="width: 50%">
            <div class="Text">报修人员拒绝原因</div>
            <div class="Info">{{ refusereason }}</div>
          </div>
        </div>
      </div>
    </div>
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
  created: function () {
    let that = this;
    that.active = 0;
    console.log(that.$route.query);
    that.errorid = that.$route.query.errorid;
    that.userid = this.globaldata.userid;
    that.userRole = this.globaldata.userRole;
    let url = "issue/" + that.$route.query.errorid;
    that
      .request(url, {}, "GET")
      .then((res) => {
        that.reporterid = res.data.reporter.id;
        that.errorcontent = res.data.content;
        that.reason = res.data.reason;
        that.solution = res.data.solution;
        that.exceptionType = res.data.exceptionType;
        that.closed = res.data.closed;
        if (res.data.createdAt != null) {
          that.applytime = that.renderTime(res.data.createdAt);
        }
        if (res.data.assignedAt != null) {
          that.assigntime = that.renderTime(res.data.assignedAt);
        }
        if (res.data.fixedAt != null) {
          that.fixtime = that.renderTime(res.data.fixedAt);
          that.openconfirm = true;
        }
        if (res.data.closed == true) {
          if (res.data.closedAt != null) {
            that.completetime = that.renderTime(res.data.closedAt);
          }
        }
        let usersid = {};
        usersid.fixusersid = [];
        for (let i = 0; i < res.data.assignee.length; i++) {
          usersid.fixusersid.push({
            assigneeid: res.data.assignee[i].id,
          });
        }
        usersid.applyusersid = res.data.reporter.id;
        setTimeout(() => {
          // 报修人员
          let searchreporters = "user/query?id==" + usersid.applyusersid;
          that
            .request(searchreporters, {}, "GET")
            .then((res) => {
              that.applyusers.push({
                name: res.data.content[0].name,
                userid: res.data.content[0].id,
                username: res.data.content[0].username,
                useremail: res.data.content[0].email,
                avatar:
                  res.data.content[0].avatar == null
                    ? undefined
                    : "http://1.15.236.205/api/pic/" +
                      res.data.content[0].avatar,
              });
            })
            .catch((res) => {
              this.$message({
                message: res.response.data.message,
                type: "error",
              });
            });
          // 维修人员
          if (usersid.fixusersid != undefined) {
            // supervisor
            let searchops =
              "user/query?id==" + usersid.fixusersid[0].assigneeid;
            that
              .request(searchops, {}, "GET")
              .then((res) => {
                that.supervisor.push({
                  name: res.data.content[0].name,
                  userid: res.data.content[0].id,
                  username: res.data.content[0].username,
                  useremail: res.data.content[0].email,
                  avatar:
                    res.data.content[0].avatar == null
                      ? undefined
                      : "http://1.15.236.205/api/pic/" +
                        res.data.content[0].avatar,
                });
              })
              .catch((res) => {
                this.$message({
                  message: res.response.data.message,
                  type: "error",
                });
              });
            if (usersid.fixusersid.length == 1) {
              that.operator.push({
                name: "暂未分配",
                username: "暂未分配",
                useremail: "暂未分配",
                avatar: undefined,
              });
            } else {
              that.assigned = true;
              for (let i = 1; i < usersid.fixusersid.length; i++) {
                // operator
                if (usersid.fixusersid[i].assigneeid == this.userid) {
                  that.opstofix = true;
                }
                let searchops =
                  "user/query?id==" + usersid.fixusersid[i].assigneeid;

                that
                  .request(searchops, {}, "GET")
                  .then((res) => {
                    that.operator.push({
                      name: res.data.content[0].name,
                      username: res.data.content[0].username,
                      useremail: res.data.content[0].email,
                      avatar:
                        res.data.content[0].avatar == null
                          ? undefined
                          : "http://1.15.236.205/api/pic/" +
                            res.data.content[0].avatar,
                    });
                  })
                  .catch((res) => {
                    this.$message({
                      message: res.response.data.message,
                      type: "error",
                    });
                  });
              }
            }
          }
        }, 200);
        // 设备信息
        for (let i = 0; i < res.data.device.length; i++) {
          let searchdevice = "device/" + res.data.device[i].id;
          that
            .request(searchdevice, {}, "GET")
            .then((res) => {
              let obj = {};
              obj.id = res.data.id;
              obj.name = res.data.name;
              obj.brand = res.data.brand;
              obj.deviceNo = res.data.deviceNo;
              obj.clazz = res.data.clazz;
              that.devicetableData.push(obj);
            })
            .catch((res) => {
              this.$message({
                message: res.response.data.message,
                type: "error",
              });
            });
        }
      })
      .catch((res) => {
        this.$message({
          message: res.response.data.message,
          type: "error",
        });
      });
    setTimeout(() => {
      // 获取全部OPERATOR
      that
        .request("user/query", {}, "GET")
        .then((res) => {
          console.log(res);
          for (let i = 0; i < res.data.content.length; i++) {
            if (res.data.content[i].role == "OPERATOR") {
              if (that.applyusers[0].userid == res.data.content[i].id) {
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
        })
        .catch((res) => {
          console.log(res);
          this.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
    }, 500);
  },
  data() {
    return {
      userid: "", // 当前登录人员id
      userRole: "", // 当前登录人员Role
      reporterid: "",
      assigned: false, // 是否已分配
      opstofix: false, // 是否是维修人员
      // 步骤条
      active: 0,
      closed: false, // 是否确认

      /* 申请 */
      errorid: "",
      applyusers: [], // 报修人员
      errorcontent: "", // 异常内容

      /* 分配 */
      fixusers: [], // 维修人员
      assigneeid: "", // 接受人员
      supervisor: [],
      operator: [],
      devicetableData: [],
      deviceinfo: [], // 维修设备
      // 报告接受人
      dialogFixVisible: false,
      assigneeOp: "",
      options: [
        {
          label: "OPERATOR",
          options: [],
        },
      ],

      /* 修复 */
      reason: "", // 异常发生原因
      solution: "", // 异常解决措施和处理结果
      exceptionType: "", // 异常类型
      refusereason: "", // 拒绝原因

      // 富文本编辑器
      editorOption: {
        placeholder: "请输入异常描述和异常处理请求",
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function (value) {
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
      picid: "",

      // 时间线
      applytime: "",
      assigntime: "",
      fixtime: "",
      completetime: "",
    };
  },
  methods: {
    // 处理时间格式
    renderTime(date) {
      if (date == null) {
        return "暂无";
      } else {
        var dateee = new Date(date).toJSON();
        this.active++;
        return new Date(+new Date(dateee) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, " ")
          .replace(/\.[\d]{3}Z/, "");
      }
    },
    // 分配维修
    TssignFix() {
      this.dialogFixVisible = true;
    },
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
        if (params.length > 0) {
          that
            .request("pic", params[1], "POST", {
              "Content-Type": "text/plain",
            })
            .then((res) => {
              that.picid = res.data;
              let url = "http://1.15.236.205/api/pic/" + res.data;
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
      return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
          imgResult = reader.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(imgResult);
        };
      });
    },
    // 提交分配
    submitTssign() {
      let that = this;
      let url = "issue/" + that.errorid;
      console.log(that.assigneeOp == "");
      if (that.assigneeOp == "") {
        this.$message({
          message: "请选择维修人员",
          type: "warning",
        });
      } else {
        that
          .request(url, {}, "GET")
          .then((res) => {
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
            that
              .request(url, obj, "PUT")
              .then(() => {
                that.$message({
                  message: "分配成功",
                  type: "success",
                });
                that.dialogFixVisible = false;
                setTimeout(() => {
                  location.reload(); // 成功后更新UI
                }, 300);
              })
              .catch(() => {
                that.$message({
                  message: "分配失败",
                  type: "error",
                });
              });
          })
          .catch((res) => {
            this.$message({
              message: res.response.data.message,
              type: "error",
            });
          });
      }
    },
    // 提交诊断
    submitbtn() {
      let that = this;
      console.log(that.exceptionType, that.reason, that.solution);
      if (
        that.exceptionType == "" ||
        that.reason == "" ||
        that.solution == "" ||
        that.exceptionType == null ||
        that.reason == null ||
        that.solution == null
      ) {
        that.$message({
          message: "请将修复信息填写完整",
          type: "warning",
        });
      } else {
        let obj = {};
        let url = "issue/" + that.errorid;
        that
          .request(url, {}, "GET")
          .then((res) => {
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
          })
          .catch((res) => {
            this.$message({
              message: res.response.data.message,
              type: "error",
            });
          });
        setTimeout(() => {
          console.log(obj);
          that
            .request(url, obj, "PUT")
            .then(() => {
              that.$message({
                message: "提交成功",
                type: "success",
              });
              setTimeout(() => {
                location.reload(); // 成功后更新UI
              }, 300);
            })
            .catch((res) => {
              this.$message({
                message: res.response.data.message,
                type: "error",
              });
            });
        }, 200);
      }
    },
  },
  components: {
    User,
    quillEditor,
  },
};
</script>
<style lang="scss">
.Container-ErrorDetail {
  // border: 1px solid red;
  width: 100%;
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
    .Task-info {
      width: 85%;
      background: #fff;
      border-radius: 10px;
      box-shadow: 5px 5px 20px #eeeeee, -5px 5px 20px #eeeeee;
      padding: 10px 20px;
      margin-top: 10px;
      // border: 1px solid red;
      .Part {
        // border: 1px solid red;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
        padding: 10px 0;
        display: flex;
        justify-content: flex-start;
        .part {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .el-input {
            // border: 1px solid red;
            margin-top: 5px;
            width: 80%;
          }
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
          .extraTable {
            .el-table__header {
              th {
                background: #f6f6f6;
              }
            }
          }
        }
        .result {
          height: 300px;
        }
      }
      .lastpart {
        border-bottom: 0;
      }
      .TssignFixBtn {
        .el-button {
          display: flex;
          align-self: flex-start;
          background: #409eff;
          color: #fff;
          border: 0;
          font-size: 15px;
          padding: 8px 10px;
          margin-top: 10px;
        }
      }
    }
  }
  .Last {
    margin-bottom: 20px;
  }
}
</style>
