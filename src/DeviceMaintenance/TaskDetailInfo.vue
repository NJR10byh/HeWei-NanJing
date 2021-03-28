<template>
  <div class="Container-TaskDetailInfo">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
      <el-breadcrumb-item class="active"
        >任务名称：{{ name }}（编号：{{ no }}）
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Tabs">
      <el-tabs tab-position="top" v-model="tabsActiveName">
        <el-tab-pane label="保养内容" name="first">
          <div v-for="(item, index) in content" :key="index" class="content">
            <el-checkbox-group v-model="checkList">
              <el-checkbox :label="index">
                <div class="title">
                  <span style="margin-left:5px;">{{
                    item.contentinfotitle
                  }}</span>
                </div>
                <div class="ql-snow">
                  <div class="ql-editor" v-html="item.contentinfodetail"></div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="tools_remark">
            <div class="tools">
              工具及备件：
              <span>{{ tools }}</span>
            </div>
            <div class="tools">
              注意事项：
              <span>{{ remark }}</span>
            </div>
          </div>
          <div v-if="checkList.length == content.length" class="form">
            <div style="font-size:20px;font-weight:bold;color:#409eff;">
              记录：
            </div>
            <el-form
              :model="form"
              ref="form"
              label-position="left"
              style="margin-top:10px;"
            >
              <el-form-item
                label="完成记录: "
                :label-width="formLabelWidth"
                prop="record"
              >
                <el-input
                  v-model="form.record"
                  autocomplete="off"
                  placeholder="完成记录（概括）"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="记录图片:"
                :label-width="formLabelWidth"
                prop="pic"
              >
                <el-upload
                  list-type="picture"
                  action=""
                  accept=".jpg, .png"
                  :limit="1"
                  :auto-upload="false"
                  :file-list="fileList"
                  :on-change="getFile"
                >
                  <el-button size="small" type="primary"
                    >选择图片上传</el-button
                  >
                  <div slot="tip" class="el-upload__tip">
                    只能上传一张jpg/png文件
                  </div>
                </el-upload>
              </el-form-item>
              <el-form-item
                label="是否「不能自我修复」:"
                label-width="180px"
                prop="hasException"
              >
                <el-switch v-model="form.hasException" active-text="是">
                </el-switch>
              </el-form-item>
              <el-form-item
                label="异常报告: "
                :label-width="formLabelWidth"
                prop="report"
                v-if="form.hasException"
              >
                <el-input
                  v-model="form.report"
                  autocomplete="off"
                  placeholder="报告「不能自我修复」的异常详情"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="「自我修复」过程: "
                :label-width="formLabelWidth"
                prop="fix"
                v-if="form.hasException"
              >
                <el-input
                  v-model="form.fix"
                  placeholder="简述「自我修复」过程"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogAddRecord = false">取 消</el-button>
              <el-button type="primary" @click="submitrecord">确 定</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="保养记录" name="second">
          <div>
            <el-table
              :data="taskrecordtableData"
              stripe
              border
              style="width:100%;"
              class="extraTable"
            >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form
                    label-position="left"
                    inline
                    class="demo-table-expand"
                  >
                    <el-form-item label="完成记录">
                      <span>{{ props.row.record }}</span>
                    </el-form-item>
                    <el-form-item label="图片记录">
                      <img :src="props.row.pic" v-if="props.row.ifpicexist" />
                      <span v-if="!props.row.ifpicexist">暂无</span>
                    </el-form-item>
                    <el-form-item label="异常报告">
                      <span>{{ props.row.report }}</span>
                    </el-form-item>
                    <el-form-item label="「自我修复」的异常修复过程">
                      <span>{{ props.row.fix }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                label="记录ID"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="date"
                label="计划保养时间"
              ></el-table-column>
              <el-table-column
                prop="realDate"
                label="实际保养时间"
              ></el-table-column>
              <el-table-column
                prop="hasException"
                label="是否存在「不能自我修复」的异常"
                width="140"
              ></el-table-column>
              <el-table-column prop="opUser" label="保养人员"></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[15, 30, 50, 100]"
                :page-size="page_size"
                layout="sizes,total, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  created: function() {
    let that = this;
    that.taskid = that.$route.query.id;
    let url =
      "http://47.102.214.37:8080/ops/schedule/detail/" + that.$route.query.id;
    axios.get(url).then((res) => {
      console.log(res.data);
      that.name = res.data.name;
      that.no = res.data.no;
      // 保养内容
      if (res.data.content != "") {
        for (let a = 0; a < res.data.content.length; a++) {
          that.content.push({
            contentinfotitle: res.data.content[a].title,
            contentinfodetail: res.data.content[a].detail,
          });
        }
      }
      that.tools = res.data.tools;
      that.remark = res.data.remark;
      // 维护人员
      for (let i = 0; i < res.data.ops.length; i++) {
        let searchops = "http://47.102.214.37:8080/user/" + res.data.ops[i].id;
        axios.get(searchops).then((res) => {
          that.users.push({
            name: res.data.name,
            username: res.data.username,
            useremail: res.data.email,
            avatar: "http://47.102.214.37:8080/pic/" + res.data.avatar,
          });
        });
      }
    });

    setTimeout(() => {
      // 保养记录
      let URL =
        "http://47.102.214.37:8080/ops/record/schedule/" +
        that.$route.query.id +
        "?page=0&size=" +
        that.page_size;
      axios.get(URL).then((res) => {
        console.log(res.data);
        that.total = res.data.totalElements;
        for (let i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.id = res.data.content[i].id;
          res.data.content[i].date == null
            ? (obj.date = "暂无")
            : (obj.date = res.data.content[i].date);
          res.data.content[i].realDate == null
            ? (obj.realDate = "暂无")
            : (obj.realDate = res.data.content[i].realDate);
          res.data.content[i].fix == null
            ? (obj.fix = "暂无")
            : (obj.fix = res.data.content[i].fix);
          res.data.content[i].hasException == false
            ? (obj.hasException = "否")
            : (obj.hasException = "是");
          res.data.content[i].record == null
            ? (obj.record = "暂无")
            : (obj.record = res.data.content[i].record);
          res.data.content[i].report == null
            ? (obj.report = "暂无")
            : (obj.report = res.data.content[i].report);
          obj.ifpicexist = true;
          res.data.content[i].pic == null
            ? (obj.ifpicexist = false)
            : (obj.pic =
                "http://47.102.214.37:8080/pic/" + res.data.content[i].pic);
          setTimeout(() => {
            if (res.data.content[i].opUser == null) {
              obj.opUser = "暂无";
            } else {
              let searchops =
                "http://47.102.214.37:8080/user/" +
                res.data.content[i].opUser.id;
              axios
                .get(searchops)
                .then((res) => {
                  obj.opUser = res.data.name;
                })
                .catch(() => {
                  obj.opUser = "获取失败，请刷新重试";
                });
            }
          }, 300);
          that.taskrecordtableData.unshift(obj);
        }
      });
    }, 300);
  },
  data() {
    return {
      taskid: "", //任务ID
      name: null, // 任务名称
      no: null, // 标准编号
      opUserid: "", // 维护人员id
      tabsActiveName: "first", // 进入打开第一个栏目

      /* 基本信息 */
      users: [], // 维护人员
      scheduleType: null, // 保养周期
      startDate: null, // 保养开始时间
      scheduleType_info: null, // 保养周期具体信息
      // 设备信息
      devicetableData: [],

      /* 保养内容 */
      content: [], // 保养内容
      checkList: [],

      /* 工具及备件 */
      tools: null, // 保养工具及备件

      /* 注意事项 */
      remark: null, // 注意事项

      /* 保养记录 */
      taskrecordtableData: [], // 保养记录
      // 新增保养记录弹出框
      dialogAddRecord: false,
      form: {
        fix: "",
        record: "",
        report: "",
        hasException: false,
        pic: "",
      },
      formLabelWidth: "150px",
      // 图片上传
      fileList: [],
      dialogVisible: false,
      // 分页
      currentPage: 1, //  页面显示的当前页数
      page_size: 15, //  页面显示的每页显示条数
      page: 1, // 当前页数
      total: 0, // 总数
    };
  },
  methods: {
    getFile(file) {
      this.getBase64(file.raw).then((res) => {
        const params = res.split(",");
        console.log(params, "params");
        if (params.length > 0) {
          this.form.pic = params[1];
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

    // 新增保养记录
    submitrecord() {
      let that = this;
      console.log(that.checkList);
      axios.get("http://47.102.214.37:8080/user/me").then((res) => {
        console.log(res.data);
        that.opUserid = res.data.id;
      });
      setTimeout(() => {
        if (that.form.record == "" || that.form.pic == "") {
          that.$message({
            message: "请将信息填写完整",
            type: "warning",
          });
        } else {
          let obj = {};
          let picurl = "http://47.102.214.37:8080/pic";
          obj.fix = that.form.fix;
          obj.record = that.form.record;
          obj.report = that.form.report;
          if (that.form.hasException == false) {
            obj.hasException = false;
          } else {
            obj.hasException = true;
          }
          obj.schedule = { id: that.$route.query.id * 1 };
          obj.opUser = { id: that.opUserid };
          setTimeout(() => {
            axios({
              url: picurl,
              method: "post",
              data: that.form.pic,
              headers: {
                "Content-Type": "text/plain",
              },
            }).then((res) => {
              console.log(res);
              obj.pic = res.data;
            });
            setTimeout(() => {
              console.log(obj);
              axios
                .post("http://47.102.214.37:8080/ops/record", obj)
                .then((res) => {
                  console.log(res);
                  that.$message({
                    message: "新增成功",
                    type: "success",
                  });
                  that.dialogAddRecord = false;
                })
                .catch((res) => {
                  console.log(res.response);
                  that.$message({
                    message: res.response.data.message,
                    type: "error",
                  });
                });
            }, 300);
          }, 300);
        }
      }, 300);
    },
    // 表格方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let that = this;
      that.currentPage = 1;
      that.page_size = val;
      that.taskrecordtableData = [];
      console.log(val);
      let url =
        "http://47.102.214.37:8080/ops/record/schedule/" +
        that.$route.query.id +
        "?page=0" +
        "&size=" +
        that.page_size;
      console.log(url);
      axios.get(url).then((res) => {
        console.log(res.data);
        that.total = res.data.totalElements;
        for (let i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.id = res.data.content[i].id;
          res.data.content[i].date == null
            ? (obj.date = "暂无")
            : (obj.date = res.data.content[i].date);
          res.data.content[i].realDate == null
            ? (obj.realDate = "暂无")
            : (obj.realDate = res.data.content[i].realDate);
          res.data.content[i].fix == null
            ? (obj.fix = "暂无")
            : (obj.fix = res.data.content[i].fix);
          res.data.content[i].hasException == false
            ? (obj.hasException = "否")
            : (obj.hasException = "是");
          res.data.content[i].record == null
            ? (obj.record = "暂无")
            : (obj.record = res.data.content[i].record);
          res.data.content[i].report == null
            ? (obj.report = "暂无")
            : (obj.report = res.data.content[i].report);
          obj.ifpicexist = true;
          res.data.content[i].pic == null
            ? (obj.ifpicexist = false)
            : (obj.pic =
                "http://47.102.214.37:8080/pic/" + res.data.content[i].pic);
          that.taskrecordtableData.unshift(obj);
        }
        setTimeout(() => {
          that.$message({
            message: "刷新成功",
            type: "success",
          });
        }, 300);
      });
    },
    // // 页变化
    handleCurrentChange(val) {
      let that = this;
      that.page = val;
      that.currentPage = val;
      console.log(val);
      let url =
        "http://47.102.214.37:8080/ops/record/schedule/" +
        that.$route.query.id +
        "?page=" +
        (that.page - 1) +
        "&size=" +
        that.page_size;
      console.log(url);
      axios.get(url).then((res) => {
        console.log(res.data);
        that.taskrecordtableData = [];
        that.total = res.data.totalElements;
        for (let i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.id = res.data.content[i].id;
          res.data.content[i].date == null
            ? (obj.date = "暂无")
            : (obj.date = res.data.content[i].date);
          res.data.content[i].realDate == null
            ? (obj.realDate = "暂无")
            : (obj.realDate = res.data.content[i].realDate);
          res.data.content[i].fix == null
            ? (obj.fix = "暂无")
            : (obj.fix = res.data.content[i].fix);
          res.data.content[i].hasException == false
            ? (obj.hasException = "否")
            : (obj.hasException = "是");
          res.data.content[i].record == null
            ? (obj.record = "暂无")
            : (obj.record = res.data.content[i].record);
          res.data.content[i].report == null
            ? (obj.report = "暂无")
            : (obj.report = res.data.content[i].report);
          obj.ifpicexist = true;
          res.data.content[i].pic == null
            ? (obj.ifpicexist = false)
            : (obj.pic =
                "http://47.102.214.37:8080/pic/" + res.data.content[i].pic);
          that.taskrecordtableData.unshift(obj);
        }
        setTimeout(() => {
          that.$message({
            message: "刷新成功",
            type: "success",
          });
        }, 300);
      });
    },
  },
};
</script>

<style lang="scss">
.Container-TaskDetailInfo {
  // border: 1px solid red;
  width: 100%;
  height: 100%;
  background: #fafafa;
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
    .active {
      font-size: 20px;
    }
  }
  .Tabs {
    // border: 1px solid red;
    margin: 0 10px;
    .BaseInfo_1 {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-bottom: 1px solid #aaa;
      .Title {
        font-size: 25px;
        font-weight: bold;
        color: #00438b;
      }
      .Info {
        // border: 1px solid red;
        margin-top: 10px;
        font-size: 16px;
      }
      .Info_part1 {
        width: 100%;
        padding-bottom: 10px;
        display: flex;
        justify-content: flex-start;
      }
      .Info_part2 {
        width: 100%;
        padding: 10px 0;
        // border: 1px solid red;
        display: flex;
        justify-content: flex-start;
      }
    }
    .BaseInfo_2 {
      margin-top: 10px;
      border-bottom: 0;
    }
  }
  .content {
    padding-bottom: 10px;
    .title {
      border-left: 3px solid #409eff;
    }
  }
  .tools_remark {
    padding: 10px 0;
    // border: 1px solid red;
    display: flex;
    justify-content: flex-start;
    border-bottom: 1px solid #aaa;
    .tools {
      display: flex;
      flex-direction: column;
      width: 50%;
      color: #409eff;
      font-weight: bold;
      font-size: 20px;
      span {
        color: #000;
        font-size: 15px;
        font-weight: normal;
      }
    }
  }
  .form {
    margin-top: 10px;
    font-weight: bold;
  }
  .addrecord {
    .el-button {
      padding: 0 10px;
      height: 30px;
      border-radius: 5px;
      font-size: 12px;
      width: 110px;
      border: 1px solid #409eff;
      color: #409eff;
    }
  }
  .el-pagination {
    text-align: center;
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
  .extraTable {
    margin-top: 10px;
    .el-table__header {
      th {
        background: #f6f6f6;
      }
    }
    .demo-table-expand {
      label {
        color: #99a9bf;
      }
      .el-form-item {
        width: 100%;
        // border: 1px solid #409eff;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
    .el-button {
      border: none;
      padding: 5px 0;
      background: transparent;
      &:hover {
        color: #409eff;
      }
    }
  }
}
</style>
