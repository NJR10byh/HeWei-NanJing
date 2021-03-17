<template>
  <div class="Container-AddTaskInside">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
      <el-breadcrumb-item class="active">新增任务</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Task-container">
      <div class="Task-box">
        <el-form ref="form" :model="TaskInfo" label-position="left">
          <div class="part">
            <div class="part_left">
              <div class="part_left_0 part_left_1">
                <el-form-item label="保养周期" class="task tasktime">
                  <el-select
                    clearable
                    placeholder="请选择保养周期"
                    class="TaskTime-select"
                    v-model="TaskInfo.scheduleType"
                  >
                    <el-option
                      v-for="item in tasktime"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="任务名称" class="task taskname">
                  <el-input
                    v-model="TaskInfo.name"
                    placeholder="请输入任务名称"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="part_left_0 part_left_2">
                <el-form-item label="保养部位" class="task side">
                  <el-input
                    v-model="TaskInfo.side"
                    placeholder="请输入保养部位"
                  ></el-input>
                </el-form-item>
                <el-form-item label="接受标准" class="task acceptedStandard">
                  <el-input
                    v-model="TaskInfo.acceptedStandard"
                    placeholder="请输入接受标准"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="part_left_0 part_left_3">
                <el-form-item label="保养工具及备件" class="task tools">
                  <el-input
                    class="inputStyle"
                    type="textarea"
                    v-model="TaskInfo.tools"
                    :rows="8"
                  ></el-input>
                </el-form-item>
                <el-form-item label="注意事项" class="task remark">
                  <el-input
                    class="inputStyle"
                    type="textarea"
                    v-model="TaskInfo.remark"
                    :rows="8"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="part_right">
              <el-form-item label="保养内容">
                <i
                  class="el-icon-circle-plus-outline addicon"
                  @click="addcontent = true"
                ></i>
                <div style="margin-top:0px;">
                  <el-collapse
                    @change="handleChange"
                    v-for="(item, index) in TaskInfo.content"
                    :key="index"
                  >
                    <el-collapse-item :title="item.title" :name="index">
                      <div class="ql-snow">
                        <div class="ql-editor" v-html="item.detail"></div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-form-item>
            </div>
          </div>
          <div class="Btns">
            <div class="sub-btn">
              <el-button @click="submittask">保存并提交</el-button>
            </div>
            <div class="cancel-btn">
              <el-button @click="cancel">取消</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog title="新增保养内容" :visible.sync="addcontent" width="670px">
      <el-form :model="TaskInfo">
        <el-form-item label="标题">
          <el-input v-model="TaskInfo.title"></el-input>
        </el-form-item>
      </el-form>
      <div>
        内容<br />
        <quill-editor
          ref="myTextEditor"
          v-model="TaskInfo.detail"
          :options="editorOption"
          style="height:180px;"
          @change="onEditorChange($event)"
        ></quill-editor>
      </div>
      <div slot="footer" style="margin-top:40px;">
        <el-button @click="addcontent = false">取 消</el-button>
        <el-button type="primary" @click="submitcontent">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改保养内容" :visible.sync="fixcontent" width="670px">
      <el-form :model="TaskInfo">
        <el-form-item label="标题">
          <el-input v-model="TaskInfo.title"></el-input>
        </el-form-item>
      </el-form>
      <div>
        内容<br />
        <quill-editor
          ref="myTextEditor"
          v-model="TaskInfo.detail"
          :options="editorOption"
          style="height:180px;"
          @change="onEditorChange($event)"
        ></quill-editor>
      </div>
      <div slot="footer" style="margin-top:40px;">
        <el-button @click="fixcontent = false">取 消</el-button>
        <el-button type="primary" @click="submitfix">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="功能选择"
      :visible.sync="confirmfunction"
      width="350px"
      center
      class=""
    >
      <el-button type="primary" @click="confirmfunction = false"
        >仅查看</el-button
      >
      <el-button type="warning" @click="editcontent">修改内容</el-button>
      <el-button type="danger" @click="deletecontent">删除内容</el-button>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { quillEditor } from "vue-quill-editor";
// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "../assets/css/quill.css";

export default {
  name: "AddTaskInside",
  components: {
    quillEditor,
  },
  created: function() {
    let that = this;
    if (this.$route.query.taskID != undefined) {
      console.log(this.$route.query);
      let url =
        "http://47.102.214.37:8080/ops/schedule/detail/" +
        this.$route.query.taskID;
      axios.get(url).then((res) => {
        console.log(res.data);
        that.TaskInfo.scheduleType = res.data.scheduleType;
        that.TaskInfo.name = res.data.name;
        that.TaskInfo.side = res.data.side;
        that.TaskInfo.acceptedStandard = res.data.acceptedStandard;
        that.TaskInfo.tools = res.data.tools;
        that.TaskInfo.remark = res.data.remark;
        that.TaskInfo.content = res.data.content;
      });
    } else {
      console.log("bbb");
    }
  },
  data() {
    return {
      TaskInfo: {
        scheduleType: "",
        name: "",
        side: "",
        acceptedStandard: "",
        tools: "",
        remark: "",
        title: "",
        detail: "",
        content: [],
      },
      tasktime: [
        {
          value: "Predictability",
          label: "未知",
        },
        {
          value: "Yearly",
          label: "每年",
        },
        {
          value: "Seasonally",
          label: "每季度",
        },
        {
          value: "Monthly",
          label: "每月",
        },
        {
          value: "Weekly",
          label: "每周",
        },
        {
          value: "Daily",
          label: "每天",
        },
      ],
      addcontent: false, // 新增内容弹窗
      fixcontent: false, // 修改内容弹窗
      confirmfunction: false, // 确认功能弹窗

      contentindex: -1, // 用户展开的内容下标

      editorOption: {
        placeholder: "请输入保养内容",
      },
    };
  },
  methods: {
    handleChange(val) {
      console.log(this.TaskInfo.content[val]);
      if (this.TaskInfo.content[val] != undefined) {
        this.confirmfunction = true;
      }
      this.contentindex = val;
    },
    // 富文本编辑器内容改变
    onEditorChange({ html }) {
      console.log(html);
      this.TaskInfo.detail = html;
    },
    // 修改内容
    editcontent() {
      console.log(this.TaskInfo.content[this.contentindex]);
      this.TaskInfo.title = this.TaskInfo.content[this.contentindex].title;
      this.TaskInfo.detail = this.TaskInfo.content[this.contentindex].detail;
      this.fixcontent = true;
    },
    // 提交修改
    submitfix() {
      this.TaskInfo.content.splice(this.contentindex, 1, {
        title: this.TaskInfo.title,
        detail: this.TaskInfo.detail,
      });
      this.fixcontent = false;
      this.confirmfunction = false;
      this.$message({
        message: "修改成功",
        type: "success",
      });
    },
    // 删除内容
    deletecontent() {
      console.log(this.TaskInfo.content[this.contentindex]);
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.TaskInfo.content.splice(this.contentindex, 1);
          this.confirmfunction = false;
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    submitcontent() {
      this.addcontent = false;
      this.TaskInfo.content.push({
        title: this.TaskInfo.title,
        detail: this.TaskInfo.detail,
      });
      console.log(this.TaskInfo);
    },
    // 保存编辑并提交
    submittask() {
      let that = this;
      let obj = {};
      if (
        that.TaskInfo.scheduleType == "" ||
        that.TaskInfo.name == "" ||
        that.TaskInfo.side == "" ||
        that.TaskInfo.acceptedStandard == "" ||
        that.TaskInfo.tools == "" ||
        that.TaskInfo.remark == "" ||
        that.TaskInfo.content.length == 0
      ) {
        that.$message({
          message: "请将信息填写完整",
          type: "warning",
        });
      } else {
        obj.scheduleType = that.TaskInfo.scheduleType;
        obj.name = that.TaskInfo.name;
        obj.side = that.TaskInfo.side;
        obj.acceptedStandard = that.TaskInfo.acceptedStandard;
        obj.tools = that.TaskInfo.tools;
        obj.remark = that.TaskInfo.remark;
        obj.content = that.TaskInfo.content;
        axios
          .post("http://47.102.214.37:8080/ops/schedule", obj)
          .then((res) => {
            console.log(res);
            that.$message({
              message: "新增成功",
              type: "success",
            });
          })
          .catch((res) => {
            console.log(res.response.data.message);
          });
      }
      console.log(obj);
    },
    // 取消编辑
    cancel() {
      this.$router.push({
        path: "/addTask",
      });
    },
  },
};
</script>

<style lang="scss">
.Container-AddTaskInside {
  // border: 1px solid red;
  width: 100%;
  .breadcrumb {
    width: 100%;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    font-size: 16px;
    // border: 1px solid red;
    padding: 10px 0;
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
    width: 100%;
    // border: 1px solid red;
    display: flex;
    justify-content: center;
    .Task-box {
      width: 90%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      // border: 1px solid red;
      .el-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        background: #fff;
        border-radius: 20px;
        box-shadow: 5px 5px 20px #eeeeee, -5px 5px 20px #eeeeee;
        padding: 15px 0;
        .part {
          display: flex;
          justify-content: space-evenly;
          align-items: flex-start;
          width: 100%;
          .part_left {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 48%;
            // border: 1px solid #409eff;
            .part_left_0 {
              width: 95%;
              // border: 1px solid red;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .task {
                width: 48%;
                font-weight: 500;
              }
            }
          }
          .part_right {
            // border: 1px solid red;
            width: 48%;
            font-weight: 500;
            .addicon {
              cursor: pointer;
              transition: 0.5s;
              font-size: 20px;
              // border: 1px solid red;
              padding-top: 10px;
            }
            .addicon:hover {
              color: #409eff;
              transition: 0.3s;
            }
          }
        }
        // 下面俩按钮
        .Btns {
          display: flex;
          margin-top: 20px;
          justify-content: space-between;
          // border: 1px solid red;
          width: 180px;
          .sub-btn {
            .el-button {
              // width: 80px;
              background: linear-gradient(-270deg, #6eb5fc, #409eff);
              color: #fff;
              border: 0;
              padding: 10px;
              font-size: 15px;
              border-radius: 5px;
              &:hover {
                opacity: 0.9;
              }
            }
          }
          .cancel-btn {
            .el-button {
              width: 70px;
              background: linear-gradient(-270deg, #fc9494, #f96b6c);
              color: #fff;
              border: 0;
              padding: 10px;
              font-size: 15px;
              border-radius: 5px;
              &:hover {
                opacity: 0.9;
              }
            }
          }
        }
      }
    }
  }
}
</style>
