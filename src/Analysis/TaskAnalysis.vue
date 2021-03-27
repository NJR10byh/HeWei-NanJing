<template>
  <div class="Container-TaskAnalysis">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">数据分析</el-breadcrumb-item>
      <el-breadcrumb-item class="active">保养分析</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Search">
      <div class="searchtask">
        <el-select
          v-model="selectvalue"
          placeholder="请选择搜索字段"
          filterable
          clearable
          @change="selectchange"
        >
          <el-option-group
            v-for="group in selectoptions"
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
        <div>
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            @close="handleClose(tag)"
            style="margin-left:5px;"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
      <div class="searchpart">
        <div>
          <el-date-picker
            v-model="startDate"
            type="date"
            placeholder="开始日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
        <div style="margin-left:10px;">
          <el-date-picker
            v-model="endDate"
            type="date"
            placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
        <div style="margin-left:10px;">
          <el-button @click="search">查询</el-button>
        </div>
      </div>
    </div>
    <div class="Result">
      <!-- table -->
      <el-table
        ref="multipleTable"
        :data="taskAnalysisData"
        stripe
        border
        style="width:100%;"
        class="extraTable"
      >
        <el-table-column
          prop="taskid"
          label="任务编号"
          width="100"
        ></el-table-column>
        <el-table-column prop="times" label="保养总数"></el-table-column>

        <el-table-column
          prop="overdueTimes"
          label="未按时保养次数"
        ></el-table-column>
        <el-table-column prop="recordTimes" label="记录次数"></el-table-column>
        <el-table-column
          prop="incompleteTimes"
          label="保养准点率"
        ></el-table-column>
        <el-table-column
          prop="completeRate"
          label="保养完成率"
        ></el-table-column>
      </el-table>
    </div>
    <!-- 搜索条件 -->
    <el-dialog title="搜索条件" :visible.sync="dialogSearchVisible" width="35%">
      <el-input
        v-model="namevalue"
        placeholder="请输入搜索内容"
        v-if="selectvalue == 'name'"
      ></el-input>

      <!-- 保养周期 -->
      <el-select
        v-model="scheduleTypevalue"
        placeholder="请选择保养周期"
        filterable
        clearable
        v-if="selectvalue == 'scheduleType'"
      >
        <el-option-group
          v-for="group in scheduleTypeoptions"
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

      <!-- 设备 -->
      <el-select
        v-model="devicevalue"
        placeholder="请选择设备"
        filterable
        clearable
        multiple
        v-if="selectvalue == 'device'"
      >
        <el-option-group
          v-for="group in deviceoptions"
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

      <!-- 保养人员 -->
      <el-select
        v-model="opsvalue"
        placeholder="请选择保养人员"
        filterable
        clearable
        multiple
        v-if="selectvalue == 'ops'"
      >
        <el-option-group
          v-for="group in opsoptions"
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

      <el-date-picker
        v-model="datevalue"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        v-if="selectvalue == 'startDate'"
      >
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSearchVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitselect">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import globaldata from "../GlobalData/globaldata";

export default {
  components: {},
  created: function() {
    let that = this;
    if (globaldata.taskAnalysisInfo.length != 0) {
      that.selectInfo = globaldata.taskAnalysisInfo;
      that.dynamicTags = globaldata.taskAnalysisdynamicTags;
    }
    // 获取全部设备
    axios({
      method: "GET",
      url: "http://47.102.214.37:8080/device/query?name=!",
    })
      .then((res) => {
        for (var i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.value = res.data.content[i].id;
          obj.label =
            res.data.content[i].name +
            " (" +
            res.data.content[i].deviceNo +
            ")";
          that.deviceoptions[0].options.push(obj);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // 获取全部OPERATOR
    axios
      .get("http://47.102.214.37:8080/user/query?role==OPERATOR")
      .then((res) => {
        console.log(res.data);
        for (let i = 0; i < res.data.content.length; i++) {
          that.opsoptions[0].options.push({
            value: res.data.content[i].id,
            label:
              res.data.content[i].name +
              " (用户名：" +
              res.data.content[i].username +
              ")",
          });
        }
      });
  },
  data() {
    return {
      /* 搜索 */
      selectoptions: [
        {
          label: "字段",
          options: [
            {
              value: "name",
              label: "标准名称",
            },
            {
              value: "scheduleType",
              label: "保养周期",
            },
            {
              value: "device",
              label: "设备",
            },
            {
              value: "ops",
              label: "人员",
            },
            {
              value: "startDate",
              label: "开始时间",
            },
          ],
        },
        {
          label: "全部保养",
          options: [
            {
              value: "all",
              label: "全部保养分析",
            },
          ],
        },
      ],
      ifall: false,
      selectvalue: "",
      namevalue: "", // 任务名称
      dialogSearchVisible: false,
      selectInfo: [],
      dynamicTags: [], // 搜索标签
      // 保养周期
      scheduleTypevalue: "",
      scheduleTypeoptions: [
        {
          label: "保养周期",
          options: [
            {
              value: "Monthly",
              label: "月保养",
            },
            {
              value: "Yearly",
              label: "年保养",
            },
            {
              value: "Seasonly",
              label: "季度保养",
            },
            {
              value: "Daily",
              label: "日保养",
            },
            {
              value: "Weeklt",
              label: "周保养",
            },
          ],
        },
      ],

      // 设备
      devicevalue: "",
      deviceoptions: [
        {
          label: "设备列表",
          options: [],
        },
      ],

      // 人员
      opsvalue: "",
      opsoptions: [
        {
          label: "人员列表",
          options: [],
        },
      ],

      // 开始时间
      datevalue: "",

      task: [], // 任务id
      startDate: "", // 开始时间
      endDate: "", // 结束时间

      taskAnalysisData: [],

      // 统计总计
      timesTotal: 0,
      overdueTimesTotal: 0,
      recordTimesTotal: 0,
      incompleteTimesTotal: 0,
      completeRateTotal: 0,
    };
  },
  methods: {
    selectchange(res) {
      let that = this;
      that.ifall = false;
      if (res == "all") {
        that.ifall = true;
        that.task = [];
        axios.get("http://47.102.214.37:8080/ops/query?name=! ").then((res) => {
          let i = 0;
          console.log(res.data);
          for (i = 0; i < res.data.content.length; i++) {
            that.task.push(res.data.content[i].id);
          }
          if (i == res.data.content.length) {
            // 清空搜索条件，等待下次搜索
            that.selectInfo = [];
            that.dynamicTags = [];
            globaldata.taskAnalysisInfo = [];
            globaldata.taskAnalysisdynamicTags = [];
          }
        });
      } else {
        this.dialogSearchVisible = true;
      }
    },
    submitselect() {
      this.dialogSearchVisible = false;
      if (this.selectvalue == "scheduleType") {
        this.selectInfo.push({
          ziduan: this.selectvalue,
          value: this.scheduleTypevalue,
        });
        this.dynamicTags.push(
          this.selectvalue + " / " + this.scheduleTypevalue
        );
      } else if (this.selectvalue == "device") {
        this.selectInfo.push({
          ziduan: this.selectvalue,
          value: this.devicevalue,
        });
        this.dynamicTags.push(this.selectvalue + " / " + this.devicevalue);
      } else if (this.selectvalue == "ops") {
        console.log(this.opsvalue);
        this.selectInfo.push({
          ziduan: this.selectvalue,
          value: this.opsvalue,
        });
        this.dynamicTags.push(this.selectvalue + " / " + this.opsvalue);
      } else if (this.selectvalue == "startDate") {
        console.log(this.opsvalue);
        this.selectInfo.push({
          ziduan: this.selectvalue,
          value: this.datevalue,
        });
        this.dynamicTags.push(this.selectvalue + " / " + this.datevalue);
      } else {
        this.selectInfo.push({
          ziduan: this.selectvalue,
          value: this.namevalue,
        });
        this.dynamicTags.push(this.selectvalue + " / " + this.namevalue);
      }
    },
    // 标签移除
    handleClose(tag) {
      let index = this.dynamicTags.indexOf(tag);
      console.log(index);
      this.dynamicTags.splice(index, 1);
      this.selectInfo.splice(index, 1);
    },
    // 搜索
    search() {
      let that = this;
      that.timesTotal = 0;
      that.overdueTimesTotal = 0;
      that.recordTimesTotal = 0;
      that.incompleteTimesTotal = 0;
      that.completeRateTotal = 0;
      that.taskAnalysisData = [];
      if (that.ifall) {
        if (
          that.startDate == "" ||
          that.endDate == "" ||
          that.startDate == null ||
          that.endDate == null
        ) {
          that.$message({
            message: "请输入将查询信息填写完整",
            type: "warning",
          });
        } else if (
          new Date(this.startDate).getTime() >= new Date(this.endDate).getTime()
        ) {
          that.$message({
            message: "结束时间必须大于开始时间",
            type: "warning",
          });
        } else if (new Date(this.endDate).getTime() > new Date().getTime()) {
          that.$message({
            message: "结束时间必须小于今天",
            type: "warning",
          });
        } else {
          let i = 0;
          console.log(that.task);
          let url =
            "http://47.102.214.37:8080/analysis/schedule?sid=" + that.task[0];
          console.log(url);
          for (i = 1; i < that.task.length; i++) {
            url = url + "," + that.task[i];
          }
          if (i == that.task.length) {
            console.log(i);
            url = url + "&start=" + that.startDate + "&end=" + that.endDate;
            console.log(url);
          }
          axios.get(url).then((res) => {
            console.log(res);
            for (let i = 0; i < that.task.length; i++) {
              let obj = {};
              obj.taskid = that.task[i];
              obj.times = res.data[that.task[i]].times;
              that.timesTotal += res.data[that.task[i]].times;
              obj.incompleteTimes = res.data[that.task[i]].incompleteTimes;
              that.incompleteTimesTotal =
                res.data[that.task[i]].incompleteTimes;
              obj.completeRate = res.data[that.task[i]].completeRate;
              that.completeRateTotal += res.data[that.task[i]].completeRate;

              obj.overdueTimes = res.data[that.task[i]].overdueTimes;
              that.overdueTimesTotal += res.data[that.task[i]].overdueTimes;
              obj.recordTimes = res.data[that.task[i]].recordTimes;
              that.recordTimesTotal += res.data[that.task[i]].recordTimes;

              console.log(obj);
              that.taskAnalysisData.push(obj);
            }
            // 总计
            console.log(that.incompleteTimesTotal);
            console.log(that.completeRateTotal);
            if (i == that.task.length) {
              let obj = {};
              obj.taskid = "总计";
              obj.times = that.timesTotal;
              obj.recordTimes = that.recordTimesTotal;
              obj.overdueTimes = that.overdueTimesTotal;
              obj.incompleteTimes =
                that.incompleteTimesTotal / that.task.length;
              obj.completeRate = that.completeRateTotal / that.task.length;
              console.log(obj);
              that.taskAnalysisData.unshift(obj);
            }
            setTimeout(() => {
              that.$message({
                message: "查询成功",
                type: "success",
              });
            }, 300);
          });
        }
      } else if (
        that.selectInfo.length == 0 ||
        that.startDate == "" ||
        that.endDate == "" ||
        that.startDate == null ||
        that.endDate == null
      ) {
        that.$message({
          message: "请输入将查询信息填写完整",
          type: "warning",
        });
      } else if (
        new Date(this.startDate).getTime() >= new Date(this.endDate).getTime()
      ) {
        that.$message({
          message: "结束时间必须大于开始时间",
          type: "warning",
        });
      } else if (new Date(this.endDate).getTime() > new Date().getTime()) {
        that.$message({
          message: "结束时间必须小于今天",
          type: "warning",
        });
      } else {
        let url = "";
        that.task = [];
        // 确定第一部分
        if (that.selectInfo[0].ziduan == "name") {
          url =
            "http://47.102.214.37:8080/ops/query?" +
            that.selectInfo[0].ziduan +
            "=L" +
            that.selectInfo[0].value +
            "%25";
        } else {
          console.log(that.selectInfo[0]);
          // 设备、人员支持多选
          if (
            that.selectInfo[0].ziduan == "device" ||
            that.selectInfo[0].ziduan == "ops"
          ) {
            if (that.selectInfo[0].value.length > 1) {
              url =
                "http://47.102.214.37:8080/ops/query?" +
                that.selectInfo[0].ziduan +
                "=I" +
                that.selectInfo[0].value[0];
              for (let i = 1; i < that.selectInfo[0].value.length; i++) {
                url = url + "," + that.selectInfo[0].value[i];
              }
            } else {
              url =
                "http://47.102.214.37:8080/ops/query?" +
                that.selectInfo[0].ziduan +
                "==" +
                that.selectInfo[0].value;
            }
          } else {
            url =
              "http://47.102.214.37:8080/ops/query?" +
              that.selectInfo[0].ziduan +
              "==" +
              that.selectInfo[0].value;
          }
        }
        if (that.selectInfo.length == 1) {
          console.log(url);
          axios.get(url).then((res) => {
            if (res.data.content.length == 0) {
              that.$message({
                message: "无结果",
                type: "warning",
              });
            } else {
              console.log(res.data);
              for (let a = 0; a < res.data.content.length; a++) {
                that.task.push(res.data.content[a].id);
              }
              if (that.task.length <= 1) {
                let url =
                  "http://47.102.214.37:8080/analysis/schedule?sid=" +
                  that.task[0] +
                  "&start=" +
                  that.startDate +
                  "&end=" +
                  that.endDate;
                axios.get(url).then((res) => {
                  let obj = {};
                  obj.taskid = that.task[0];
                  obj.times = res.data[that.task[0]].times;
                  that.timesTotal = res.data[that.task[0]].times;
                  obj.incompleteTimes = res.data[that.task[0]].incompleteTimes;
                  that.incompleteTimesTotal =
                    res.data[that.task[0]].incompleteTimes;
                  obj.completeRate = res.data[that.task[0]].completeRate;
                  that.completeRateTotal = res.data[that.task[0]].completeRate;
                  obj.overdueTimes = res.data[that.task[0]].overdueTimes;
                  that.overdueTimesTotal = res.data[that.task[0]].overdueTimes;
                  obj.recordTimes = res.data[that.task[0]].recordTimes;
                  that.recordTimesTotal = res.data[that.task[0]].recordTimes;

                  console.log(obj);
                  that.taskAnalysisData.push(obj);
                });
              } else {
                let i = 0;
                let url =
                  "http://47.102.214.37:8080/analysis/schedule?sid=" +
                  that.task[0];
                for (i = 1; i < that.task.length; i++) {
                  url = url + "," + that.task[i];
                }
                if (i == that.task.length) {
                  console.log(i);
                  url =
                    url + "&start=" + that.startDate + "&end=" + that.endDate;
                  console.log(url);
                }
                axios.get(url).then((res) => {
                  console.log(res);
                  for (let i = 0; i < that.task.length; i++) {
                    let obj = {};
                    obj.taskid = that.task[i];
                    obj.times = res.data[that.task[i]].times;
                    that.timesTotal += res.data[that.task[i]].times;
                    obj.incompleteTimes =
                      res.data[that.task[i]].incompleteTimes;
                    that.incompleteTimesTotal =
                      res.data[that.task[i]].incompleteTimes;
                    obj.completeRate = res.data[that.task[i]].completeRate;
                    that.completeRateTotal +=
                      res.data[that.task[i]].completeRate;

                    obj.overdueTimes = res.data[that.task[i]].overdueTimes;
                    that.overdueTimesTotal +=
                      res.data[that.task[i]].overdueTimes;
                    obj.recordTimes = res.data[that.task[i]].recordTimes;
                    that.recordTimesTotal += res.data[that.task[i]].recordTimes;

                    console.log(obj);
                    that.taskAnalysisData.push(obj);
                  }
                  // 总计
                  console.log(that.incompleteTimesTotal);
                  console.log(that.completeRateTotal);
                  if (i == that.task.length) {
                    let obj = {};
                    obj.taskid = "总计";
                    obj.times = that.timesTotal;
                    obj.recordTimes = that.recordTimesTotal;
                    obj.overdueTimes = that.overdueTimesTotal;
                    obj.incompleteTimes =
                      that.incompleteTimesTotal / that.task.length;
                    obj.completeRate =
                      that.completeRateTotal / that.task.length;
                    console.log(obj);
                    that.taskAnalysisData.unshift(obj);
                  }
                });
              }
              // 搜索条件存入全局变量
              globaldata.taskAnalysisInfo = that.selectInfo;
              globaldata.taskAnalysisdynamicTags = that.dynamicTags;

              setTimeout(() => {
                that.$message({
                  message: "查询成功",
                  type: "success",
                });
              }, 300);
            }
          });
        } else {
          console.log(that.selectInfo);
          for (let i = 1; i < that.selectInfo.length; i++) {
            if (that.selectInfo[i].ziduan == "name") {
              url =
                url +
                "&" +
                that.selectInfo[i].ziduan +
                "=L" +
                that.selectInfo[i].value +
                "%25";
            } else {
              if (
                that.selectInfo[i].ziduan == "device" ||
                that.selectInfo[i].ziduan == "ops"
              ) {
                if (that.selectInfo[i].value.length > 1) {
                  url =
                    url +
                    "&" +
                    that.selectInfo[i].ziduan +
                    "=I" +
                    that.selectInfo[i].value[0];
                  for (let j = 1; j < that.selectInfo[i].value.length; j++) {
                    url = url + "," + that.selectInfo[i].value[j];
                  }
                } else {
                  url =
                    url +
                    "&" +
                    that.selectInfo[i].ziduan +
                    "==" +
                    that.selectInfo[i].value;
                }
              } else {
                url =
                  url +
                  "&" +
                  that.selectInfo[i].ziduan +
                  "==" +
                  that.selectInfo[i].value;
              }
            }
          }
          console.log(url);
          axios.get(url).then((res) => {
            if (res.data.content.length == 0) {
              that.$message({
                message: "无结果",
                type: "warning",
              });
            } else {
              console.log(res.data);
              for (let a = 0; a < res.data.content.length; a++) {
                that.task.push(res.data.content[a].id);
              }
              if (that.task.length <= 1) {
                let url =
                  "http://47.102.214.37:8080/analysis/schedule?sid=" +
                  that.task[0] +
                  "&start=" +
                  that.startDate +
                  "&end=" +
                  that.endDate;
                axios.get(url).then((res) => {
                  let obj = {};
                  obj.taskid = that.task[0];
                  obj.times = res.data[that.task[0]].times;
                  that.timesTotal = res.data[that.task[0]].times;
                  obj.incompleteTimes = res.data[that.task[0]].incompleteTimes;
                  that.incompleteTimesTotal =
                    res.data[that.task[0]].incompleteTimes;
                  obj.completeRate = res.data[that.task[0]].completeRate;
                  that.completeRateTotal = res.data[that.task[0]].completeRate;
                  obj.overdueTimes = res.data[that.task[0]].overdueTimes;
                  that.overdueTimesTotal = res.data[that.task[0]].overdueTimes;
                  obj.recordTimes = res.data[that.task[0]].recordTimes;
                  that.recordTimesTotal = res.data[that.task[0]].recordTimes;

                  console.log(obj);
                  that.taskAnalysisData.push(obj);
                });
              } else {
                let i = 0;
                let url =
                  "http://47.102.214.37:8080/analysis/schedule?sid=" +
                  that.task[0];
                for (i = 1; i < that.task.length; i++) {
                  url = url + "," + that.task[i];
                }
                if (i == that.task.length) {
                  console.log(i);
                  url =
                    url + "&start=" + that.startDate + "&end=" + that.endDate;
                  console.log(url);
                }
                axios.get(url).then((res) => {
                  console.log(res);
                  for (let i = 0; i < that.task.length; i++) {
                    let obj = {};
                    obj.taskid = that.task[i];
                    obj.times = res.data[that.task[i]].times;
                    that.timesTotal += res.data[that.task[i]].times;
                    obj.incompleteTimes =
                      res.data[that.task[i]].incompleteTimes;
                    that.incompleteTimesTotal =
                      res.data[that.task[i]].incompleteTimes;
                    obj.completeRate = res.data[that.task[i]].completeRate;
                    that.completeRateTotal +=
                      res.data[that.task[i]].completeRate;

                    obj.overdueTimes = res.data[that.task[i]].overdueTimes;
                    that.overdueTimesTotal +=
                      res.data[that.task[i]].overdueTimes;
                    obj.recordTimes = res.data[that.task[i]].recordTimes;
                    that.recordTimesTotal += res.data[that.task[i]].recordTimes;

                    console.log(obj);
                    that.taskAnalysisData.push(obj);
                  }
                  // 总计
                  console.log(that.incompleteTimesTotal);
                  console.log(that.completeRateTotal);
                  if (i == that.task.length) {
                    let obj = {};
                    obj.taskid = "总计";
                    obj.times = that.timesTotal;
                    obj.recordTimes = that.recordTimesTotal;
                    obj.overdueTimes = that.overdueTimesTotal;
                    obj.incompleteTimes =
                      that.incompleteTimesTotal / that.task.length;
                    obj.completeRate =
                      that.completeRateTotal / that.task.length;
                    console.log(obj);
                    that.taskAnalysisData.unshift(obj);
                  }
                });
              }
              // 搜索条件存入全局变量
              globaldata.taskAnalysisInfo = that.selectInfo;
              globaldata.taskAnalysisdynamicTags = that.dynamicTags;

              setTimeout(() => {
                that.$message({
                  message: "查询成功",
                  type: "success",
                });
              }, 300);
            }
          });
        }
      }
    },
  },
};
</script>

<style lang="scss">
.Container-TaskAnalysis {
  // border: 1px solid red;
  width: 100%;
  height: 100%;
  background: #fcfcfc;
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
  .Search {
    width: 100%;
    border-bottom: 1px solid #000;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 0 20px 5px;
    .searchtask {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .el-button {
      width: 220px;
      background: linear-gradient(-270deg, #6eb5fc, #409eff);
      color: #fff;
      border: 0;
      font-size: 16px;
      border-radius: 5px;
    }
    .searchpart {
      display: flex;
      width: 100%;
      justify-content: flex-start;
      margin-top: 10px;
    }
  }
  .Result {
    margin-top: 20px;
    .extraTable {
      .el-table__header {
        th {
          background: #fafafa;
          &:nth-child(2) {
            .cell {
              padding-right: 0;
              overflow: auto;
            }
          }
        }
      }
      .el-table__body {
        td {
          &:nth-child(2) {
            .cell {
              padding-right: 0;
              overflow: auto;
            }
          }
        }
      }
    }
  }
  .el-button:hover {
    color: #fff;
    opacity: 0.8;
  }
}
</style>
