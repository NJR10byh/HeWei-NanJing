<template>
  <div class="Container-TaskDetailInfo">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
      <el-breadcrumb-item class="active"
        >任务名称：{{ name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Tabs">
      <el-tabs tab-position="top" v-model="tabsActiveName">
        <el-tab-pane label="基本信息" name="first">
          <div class="BaseInfo_1">
            <div class="Info_part1">
              <div style="width:50%;">
                <div class="Title">保养部位</div>
                <div class="Info">{{ side }}</div>
              </div>
              <div>
                <div class="Title">接受标准</div>
                <div class="Info">{{ acceptedStandard }}</div>
              </div>
            </div>
            <div class="Info_part2">
              <div style="width:50%;">
                <div class="Title">开始时间</div>
                <div class="Info">{{ startDate }}</div>
                <div></div>
              </div>
              <div>
                <div class="Title">保养周期</div>
                <div class="Info">{{ scheduleType_info }}</div>
              </div>
            </div>
          </div>
          <div class="BaseInfo_1 BaseInfo_2">
            <div class="Info_part1">
              <div style="width:50%;">
                <div class="Title">维护人员信息</div>
                <user
                  v-for="(item, index) in users"
                  :key="index"
                  :name="item.name"
                  :username="item.username"
                  :useremail="item.useremail"
                  style="margin-top:20px;"
                ></user>
              </div>
              <div>
                <div class="Title">设备信息</div>
                <el-table
                  :data="devicetableData"
                  stripe
                  border
                  style="margin-top:10px;width:100%;"
                  class="extraTable"
                >
                  <el-table-column prop="id" label="设备ID"></el-table-column>
                  <el-table-column
                    prop="name"
                    label="设备名称"
                  ></el-table-column>
                  <el-table-column
                    prop="brand"
                    label="设备品牌"
                  ></el-table-column>
                  <el-table-column
                    prop="deviceNo"
                    label="设备编号"
                  ></el-table-column>
                  <el-table-column
                    prop="clazz"
                    label="设备分类"
                  ></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="保养内容" name="second">
          <div v-for="(item, index) in content" :key="index" class="content">
            <div class="title">
              <span style="margin-left:5px;">{{ item.contentinfotitle }}</span>
            </div>
            <div class="ql-snow">
              <div class="ql-editor" v-html="item.contentinfodetail"></div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="工具及备件" name="third">
          <div>{{ tools }}</div>
        </el-tab-pane>
        <el-tab-pane label="注意事项" name="fourth">
          <div>{{ remark }}</div>
        </el-tab-pane>
        <el-tab-pane label="保养记录" name="fifth">
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
                    <el-form-item label="「自我修复」的异常修复过程">
                      <span>{{ props.row.fix }}</span>
                    </el-form-item>
                    <el-form-item label="是否存在「不能自我修复」的异常">
                      <span>{{ props.row.hasException }}</span>
                    </el-form-item>
                    <el-form-item label="完成记录">
                      <span>{{ props.row.record }}</span>
                    </el-form-item>
                    <el-form-item label="异常报告">
                      <span>{{ props.row.report }}</span>
                    </el-form-item>
                    <el-form-item label="图片记录">
                      <img :src="props.row.pic" v-if="props.row.ifpicexist" />
                      <span v-if="!props.row.ifpicexist">暂无</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                label="记录ID"
                width="70"
              ></el-table-column>
              <el-table-column
                prop="hasException"
                label="是否存在「不能自我修复」的异常"
              ></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import User from "../components/Userinfo";

export default {
  created: function() {
    let that = this;
    that.taskid = that.$route.query.id;
    let url =
      "http://47.102.214.37:8080/ops/schedule/detail/" + that.$route.query.id;
    axios.get(url).then((res) => {
      console.log(res.data);
      // 任务名称
      that.name = res.data.name;
      if (that.scheduleType == null) {
        switch (res.data.scheduleType) {
          case "Yearly":
            that.scheduleType = "年保养";
            break;
          case "Seasonly":
            that.scheduleType = "季度保养";
            break;
          case "Monthly":
            that.scheduleType = "月保养";
            break;
          case "Weekly":
            that.scheduleType = "周保养";
            break;
          case "Daily":
            that.scheduleType = "日保养";
            break;
          default:
            break;
        }
      }
      // 保养天数
      if (that.startDate == null) {
        that.startDate = res.data.startDate;
      }
      if (that.scheduleType == "日保养") {
        that.scheduleType_info = "日保养（每天）";
      }
      if (that.scheduleType == "周保养") {
        switch (that.startDate) {
          case 1:
            that.scheduleType_info = "周保养（周一）";
            break;
          case 2:
            that.scheduleType_info = "周保养（周二）";
            break;
          case 3:
            that.scheduleType_info = "周保养（周三）";
            break;
          case 4:
            that.scheduleType_info = "周保养（周四）";
            break;
          case 5:
            that.scheduleType_info = "周保养（周五）";
            break;
          case 6:
            that.scheduleType_info = "周保养（周六）";
            break;
          case 7:
            that.scheduleType_info = "周保养（周日）";
            break;
          default:
            break;
        }
      } else if (that.scheduleType == "月保养") {
        that.scheduleType_info =
          "月保养（每月 " + that.startDate.split("-")[2] + " 号）";
      } else if (that.scheduleType == "年保养") {
        that.scheduleType_info = "年保养（每年第" + that.startDate + "天）";
      }
      // 保养部位
      if (that.side == null) {
        that.side = res.data.side;
      }
      // 接受标准
      if (that.acceptedStandard == null) {
        that.acceptedStandard = res.data.acceptedStandard;
      }
      // 保养内容
      if (res.data.content != "") {
        for (let a = 0; a < res.data.content.length; a++) {
          that.content.push({
            contentinfotitle: res.data.content[a].title,
            contentinfodetail: res.data.content[a].detail,
          });
        }
      }
      if (res.data.tools != "") {
        that.tools = res.data.tools;
      }
      if (res.data.remark != "") {
        that.remark = res.data.remark;
      }
      // 设备名称
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
      // 维护人员
      for (let i = 0; i < res.data.ops.length; i++) {
        let searchops = "http://47.102.214.37:8080/user/" + res.data.ops[i].id;
        axios.get(searchops).then((res) => {
          that.users.push({
            name: res.data.name,
            username: res.data.username,
            useremail: res.data.email,
          });
        });
      }
    });

    setTimeout(() => {
      // 保养记录
      let URL =
        "http://47.102.214.37:8080/ops/record/schedule/" +
        that.$route.query.id +
        "?page=0&size=100";
      axios.get(URL).then((res) => {
        console.log(res.data);
        for (let i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.id = res.data.content[i].id;
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
      });
    }, 300);
  },
  data() {
    return {
      taskid: "", //任务ID
      name: null, // 任务名称
      tabsActiveName: "first", // 进入打开第一个栏目

      /* 基本信息 */
      users: [], // 维护人员
      side: null, // 保养部位
      acceptedStandard: null, // 接受标准
      scheduleType: null, // 保养周期
      startDate: null, // 保养开始时间
      scheduleType_info: null, // 保养周期具体信息
      // 设备信息
      devicetableData: [],

      /* 保养内容 */
      content: [], // 保养内容

      /* 工具及备件 */
      tools: null, // 保养工具及备件

      /* 注意事项 */
      remark: null, // 注意事项

      /* 保养记录 */
      taskrecordtableData: [], // 保养记录
    };
  },
  methods: {},
  components: {
    User,
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
    .title {
      border-left: 3px solid #409eff;
    }
  }
  .extraTable {
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
