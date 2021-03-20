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
          <el-step title="申请" :description="applytime"></el-step>
          <el-step title="分配" :description="assigntime"></el-step>
          <el-step title="修复" :description="fixtime"></el-step>
          <el-step title="完成" :description="completetime"></el-step>
        </el-steps>
      </div>
      <div class="Task-info">
        <div class="Part">
          <div class="part">
            <div
              class="Text"
              style="color:#409eff;font-size:30px;font-weight:normal;"
            >
              申请
            </div>
          </div>
        </div>
        <div class="Part">
          <div class="part" style="width: 50%;">
            <div class="Text">异常ID</div>
            <div class="Info">{{ errorid }}</div>
          </div>
          <div class="part" style="width: 50%;">
            <div class="Text">报修人员</div>
            <user
              v-for="(item, index) in applyusers"
              :key="index"
              :name="item.name"
              :username="item.username"
              :useremail="item.useremail"
              style="margin-top:10px;"
            ></user>
          </div>
        </div>
        <div class="Part lastpart">
          <div class="part" style="width: 100%;">
            <div class="Text">异常描述和异常处理请求</div>
            <div class="ql-snow">
              <div class="ql-editor" v-html="errorcontent"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="Task-info">
        <div class="Part">
          <div class="part">
            <div
              class="Text"
              style="color:#409eff;font-size:30px;font-weight:normal;"
            >
              分配
            </div>
          </div>
        </div>
        <div class="Part">
          <div class="part" style="width: 50%;">
            <div class="Text">维修人员-Supervisor</div>
            <user
              v-for="(item, index) in supervisor"
              :key="index"
              :name="item.name"
              :username="item.username"
              :useremail="item.useremail"
              style="margin-top:10px;"
            ></user>
          </div>
          <div class="part" style="width: 50%;">
            <div class="Text">维修人员-Operator</div>
            <user
              v-for="(item, index) in operator"
              :key="index"
              :name="item.name"
              :username="item.username"
              :useremail="item.useremail"
              style="margin-top:10px;"
            ></user>
          </div>
        </div>
        <div class="Part lastpart">
          <div class="part" style="width: 100%;">
            <div class="Text">报修设备</div>
            <el-table
              :data="devicetableData"
              stripe
              border
              style="margin-top:10px;width:100%;"
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
      <div class="Task-info Last">
        <div class="Part">
          <div class="part">
            <div
              class="Text"
              style="color:#409eff;font-size:30px;font-weight:normal;"
            >
              修复
            </div>
          </div>
        </div>
        <div class="Part">
          <div class="part" style="width: 50%;">
            <div class="Text">异常类型</div>
            <div class="Info">{{ exceptionType }}</div>
          </div>
          <div class="part" style="width: 50%;">
            <div class="Text">发生原因</div>
            <div class="Info">{{ reason }}</div>
          </div>
        </div>
        <div class="Part lastpart">
          <div class="part" style="width: 100%;">
            <div class="Text">异常解决措施和处理结果</div>
            <div class="ql-snow">
              <div class="ql-editor" v-html="solution"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="Task-info Last" v-if="reporterid == userid && !closed">
        <div class="Part">
          <div class="part">
            <div
              class="Text"
              style="color:#409eff;font-size:30px;font-weight:normal;"
            >
              完成
            </div>
          </div>
        </div>
        <div class="Part lastpart">
          <div class="part" style="width: 100%;">
            <div class="Text ">接受维修处理</div>
            <div class="backbtn_right">
              <el-button @click="confirm" class="confirm">确认</el-button>
              <el-button @click="refuse" class="refuse">拒绝</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import User from "../components/Userinfo";

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
      that.errordescription = res.data.descriptionPic;
      that.reason = res.data.reason;
      that.solution = res.data.solution;
      that.exceptionType = res.data.exceptionType;
      that.closed = res.data.closed;
      that.applytime = that.renderTime(res.data.createdAt);
      that.assigntime = that.renderTime(res.data.assignedAt);
      that.fixtime = that.renderTime(res.data.fixedAt);
      that.completetime = that.renderTime(res.data.closedAt);
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
        let searchreporters =
          "http://47.102.214.37:8080/user/query?id==" + usersid.applyusersid;
        axios.get(searchreporters).then((res) => {
          that.applyusers.push({
            name: res.data.content[0].name,
            username: res.data.content[0].username,
            useremail: res.data.content[0].email,
          });
        });
        // 维修人员
        if (usersid.fixusersid != undefined) {
          // supervisor
          let searchops =
            "http://47.102.214.37:8080/user/query?id==" +
            usersid.fixusersid[0].assigneeid;
          axios.get(searchops).then((res) => {
            console.log(res.data);
            that.supervisor.push({
              name: res.data.content[0].name,
              username: res.data.content[0].username,
              useremail: res.data.content[0].email,
            });
          });
          if (usersid.fixusersid.length == 1) {
            that.operator.push({
              name: "暂未分配",
              username: "暂未分配",
              useremail: "暂未分配",
            });
          } else {
            for (let i = 1; i < usersid.fixusersid.length; i++) {
              // operator
              let searchops =
                "http://47.102.214.37:8080/user/query?id==" +
                usersid.fixusersid[i].assigneeid;
              axios.get(searchops).then((res) => {
                that.operator.push({
                  name: res.data.content[0].name,
                  username: res.data.content[0].username,
                  useremail: res.data.content[0].email,
                });
              });
            }
          }
        }
      }, 200);
      // 设备信息
      for (let i = 0; i < res.data.device.length; i++) {
        let searchdevice =
          "http://47.102.214.37:8080/device/" + res.data.device[i].id;
        axios.get(searchdevice).then((res) => {
          let obj = {};
          obj.id = res.data.id;
          obj.name = res.data.name;
          obj.brand = res.data.brand;
          obj.deviceNo = res.data.deviceNo;
          obj.clazz = res.data.clazz;
          that.devicetableData.push(obj);
        });
      }
    });
  },
  data() {
    return {
      userid: "", // 当前登录人员id
      reporterid: "",
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

      /* 修复 */
      reason: "", // 异常发生原因
      solution: "", // 异常解决措施和处理结果
      exceptionType: "", // 异常类型

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
    confirm() {
      let that = this;
      that
        .$confirm("确定接受处理吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          let url =
            "http://47.102.214.37:8080/issue/close/" +
            that.$route.query.errorid +
            "?closed=true";
          axios.post(url).then((res) => {
            console.log(res.data);
            that.$message({
              message: "接受处理成功",
              type: "success",
            });
            setTimeout(() => {
              location.reload(); // 成功后更新UI
            }, 300);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    refuse() {
      let that = this;
      that
        .$confirm("确定拒绝处理吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          let url =
            "http://47.102.214.37:8080/issue/close/" +
            that.$route.query.errorid +
            "?closed=false";
          axios.post(url).then((res) => {
            console.log(res.data);
            that.$message({
              message: "拒绝处理成功",
              type: "success",
            });
            setTimeout(() => {
              location.reload(); // 成功后更新UI
            }, 300);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 预览图片
    imgurl(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
  },
  components: {
    User,
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
        margin-top: 10px;
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
                background: #f5f5f5;
              }
            }
          }
          .backbtn_right {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 10px;
            .el-button {
              display: flex;
              align-self: flex-start;
              background: #409eff;
              color: #fff;
              border: 0;
              font-size: 15px;
              padding: 8px 15px;
            }
            .confirm {
              background: #5ed100;
            }
            .refuse {
              background: #ff6060;
            }
          }
        }
      }
      .lastpart {
        border-bottom: 0;
      }
    }
  }
  .Last {
    margin-bottom: 20px;
  }
}
</style>
