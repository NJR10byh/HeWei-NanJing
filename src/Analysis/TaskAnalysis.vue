<template>
  <div class="Container-TaskAnalysis">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">数据分析</el-breadcrumb-item>
      <el-breadcrumb-item class="active">保养分析</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Search">
      <!-- 设备选择 -->
      <div class="searchtask">
        选择设备：
        <el-select
          v-model="deviceselectvalue"
          placeholder="请选择搜索字段"
          filterable
          clearable
          @change="deviceselectchange"
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
        <div>
          <el-tag
            :key="tag"
            v-for="tag in devicedynamicTags"
            closable
            @close="devicehandleClose(tag)"
            style="margin-left:5px;"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
      <!-- 人员选择 -->
      <div class="searchtask">
        选择人员：
        <el-select
          v-model="opsvalue"
          placeholder="请选择保养人员"
          filterable
          clearable
          multiple
          collapse-tags
          @change="opsselectchange"
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
      </div>
      <!-- 保养选择 -->
      <div class="searchtask">
        选择保养：
        <el-select
          v-model="taskselectvalue"
          placeholder="请选择搜索字段"
          filterable
          clearable
          @change="taskselectchange"
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
            v-for="tag in taskdynamicTags"
            closable
            @close="taskhandleClose(tag)"
            style="margin-left:5px;"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
      <div class="searchpart">
        <div style="margin-left:5px;">
          <el-date-picker
            v-model="start"
            type="date"
            placeholder="开始日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
        <div style="margin-left:10px;">
          <el-date-picker
            v-model="end"
            type="date"
            placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
        <div style="margin-left:10px;">
          <el-button @click="search">查询</el-button>
        </div>
        <div style="margin-left:10px;">
          <el-button class="clear" @click="clear">清空条件</el-button>
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
          label="序号"
          width="60"
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
    <!-- 搜索条件-保养 -->
    <el-dialog
      title="搜索条件"
      :visible.sync="dialogSearchTaskVisible"
      width="35%"
    >
      <el-input
        v-model="namevalue"
        placeholder="请输入搜索内容"
        v-if="taskselectvalue == 'name'"
      ></el-input>

      <!-- 保养周期 -->
      <el-select
        v-model="scheduleTypevalue"
        placeholder="请选择保养周期"
        filterable
        clearable
        v-if="taskselectvalue == 'scheduleType'"
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

      <el-date-picker
        v-model="datevalue"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        v-if="taskselectvalue == 'startDate'"
      >
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSearchTaskVisible = false">取 消</el-button>
        <el-button type="primary" @click="tasksubmitselect">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 搜索条件-设备 -->
    <el-dialog
      title="搜索条件"
      :visible.sync="dialogSearchDeviceVisible"
      width="35%"
    >
      <el-input v-model="devicevalue" placeholder="请输入搜索内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSearchDeviceVisible = false">取 消</el-button>
        <el-button type="primary" @click="devicesubmitselect">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  created: function() {
    let that = this;
    that.$message({
      message: "选取了全部人员时，请勿选择其他人员，以免搜索结果有误",
      type: "warning",
      duration: 5000,
    });
    // 获取所有附加字段
    axios.get("http://47.102.214.37:8080/device/info-field").then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        that.deviceoptions[1].options.push({
          value: res.data[i].id,
          label: res.data[i].name,
        });
      }
    });

    // 获取全部OPERATOR
    axios
      .get("http://47.102.214.37:8080/user/query?role==OPERATOR")
      .then((res) => {
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
      url: "",
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
              value: "startDate",
              label: "开始时间",
            },
          ],
        },
        {
          label: "全部保养",
          options: [
            {
              value: "taskall",
              label: "全部保养分析",
            },
          ],
        },
      ],
      ifdeviceall: false, // 是否设备是全部
      iftaskall: false, // 是否标准是全部
      ifopsall: false, // 是否人员是全部
      deviceselectvalue: "",
      taskselectvalue: "",
      namevalue: "", // 任务名称
      dialogSearchTaskVisible: false,
      dialogSearchDeviceVisible: false,
      deviceselectInfo: [],
      taskselectInfo: [],
      opsselectInfo: [],
      devicedynamicTags: [], // 设备搜索标签
      taskdynamicTags: [], // 保养搜索标签
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
              value: "Weekly",
              label: "周保养",
            },
          ],
        },
      ],

      // 设备
      devicevalue: "",
      deviceoptions: [
        {
          label: "基本字段",
          options: [
            {
              value: "name",
              label: "设备名称",
            },
            {
              value: "brand",
              label: "设备品牌",
            },
            {
              value: "type",
              label: "设备型号/规格",
            },
            {
              value: "deviceNo",
              label: "设备编号",
            },
            {
              value: "clazz",
              label: "设备分类",
            },
          ],
        },
        {
          label: "附加字段",
          options: [],
        },
        {
          label: "全部",
          options: [
            {
              value: "deviceall",
              label: "全部设备",
            },
          ],
        },
      ],

      // 人员
      opsvalue: [],
      opsoptions: [
        {
          label: "人员列表",
          options: [],
        },
        {
          label: "全部人员",
          options: [
            {
              value: "opsall",
              label: "全部人员",
            },
          ],
        },
      ],

      // 开始时间
      datevalue: "",

      task: [], // 任务id
      device: [], // 设备id
      // 用于取交集存入task
      task1: [],
      task2: [],
      task3: [],
      start: "", // 开始时间
      end: "", // 结束时间

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
    // 搜索保养
    taskselectchange(res) {
      let that = this;
      that.devicedisabled = true;
      that.opsdisabled = true;
      that.iftaskall = false;
      if (res == "taskall") {
        that.iftaskall = true;
        that.task = [];
        axios.get("http://47.102.214.37:8080/ops/query?name=! ").then((res) => {
          let i = 0;
          console.log(res.data);
          for (i = 0; i < res.data.content.length; i++) {
            that.task.push(res.data.content[i].id);
          }
          if (i == res.data.content.length) {
            // 清空搜索条件，等待下次搜索
            that.taskselectInfo = [];
            that.dynamicTags = [];
          }
        });
      } else {
        this.dialogSearchTaskVisible = true;
      }
    },
    // 搜索设备
    deviceselectchange(res) {
      let that = this;
      that.taskdisabled = true;
      that.ifdeviceall = false;
      if (res == "deviceall") {
        that.ifdeviceall = true;
        that.device = [];
        // 清空搜索条件，等待下次搜索
        that.deviceselectInfo = [];
        that.devicedynamicTags = [];
      } else {
        this.dialogSearchDeviceVisible = true;
      }
    },
    // 搜索人员
    opsselectchange(res) {
      let that = this;
      if (res == "opsall") {
        that.ifopsall = true;
        that.opsselectInfo = [];
      } else {
        that.opsselectInfo.unshift({
          ziduan: "ops",
          value: that.opsvalue,
        });
      }
      console.log(that.opsvalue);
    },
    // 选择保养
    tasksubmitselect() {
      this.dialogSearchTaskVisible = false;
      if (this.taskselectvalue == "scheduleType") {
        this.taskselectInfo.push({
          ziduan: this.taskselectvalue,
          value: this.scheduleTypevalue,
        });
        this.taskdynamicTags.push(
          this.taskselectvalue + " / " + this.scheduleTypevalue
        );
      } else if (this.taskselectvalue == "startDate") {
        console.log(this.opsvalue);
        this.taskselectInfo.push({
          ziduan: this.taskselectvalue,
          value: this.datevalue,
        });
        this.taskdynamicTags.push(
          this.taskselectvalue + " / " + this.datevalue
        );
      } else {
        this.taskselectInfo.push({
          ziduan: this.taskselectvalue,
          value: this.namevalue,
        });
        this.taskdynamicTags.push(
          this.taskselectvalue + " / " + this.namevalue
        );
      }
    },
    // 设备选择
    devicesubmitselect() {
      this.dialogSearchDeviceVisible = false;
      this.deviceselectInfo.push({
        ziduan: this.deviceselectvalue,
        value: this.devicevalue,
      });
      this.devicedynamicTags.push(
        this.deviceselectvalue + " / " + this.devicevalue
      );
    },
    //  设备标签移除
    devicehandleClose(tag) {
      let index = this.devicedynamicTags.indexOf(tag);
      console.log(index);
      this.devicedynamicTags.splice(index, 1);
      this.deviceselectInfo.splice(index, 1);
    },
    // 保养标签移除
    taskhandleClose(tag) {
      let index = this.taskdynamicTags.indexOf(tag);
      console.log(index);
      this.taskdynamicTags.splice(index, 1);
      this.taskselectInfo.splice(index, 1);
    },
    /* 搜索 */
    searchdata() {
      let that = this;
      if (
        that.start == "" ||
        that.end == "" ||
        that.start == null ||
        that.end == null
      ) {
        that.$message({
          message: "请选择起止日期",
          type: "warning",
        });
      } else if (
        new Date(that.start).getTime() >= new Date(that.end).getTime()
      ) {
        that.$message({
          message: "结束时间必须大于开始时间",
          type: "warning",
        });
      } else if (new Date(that.end).getTime() > new Date().getTime()) {
        that.$message({
          message: "结束时间必须小于今天",
          type: "warning",
        });
      } else {
        let index = 1;
        that.taskAnalysisData = [];
        console.log(that.task);
        // 保养任务不唯一的
        if (that.task.length == 0) {
          that.$message({
            message: "无结果",
            type: "warning",
          });
        } else if (that.task.length > 1) {
          let url =
            "http://47.102.214.37:8080/analysis/schedule?sid=" + that.task[0];
          for (let i = 1; i < that.task.length; i++) {
            url = url + "," + that.task[i];
          }
          url = url + "&start=" + that.start + "&end=" + that.end;
          console.log(url);
          axios.get(url).then((res) => {
            for (let i = 0; i < that.task.length; i++) {
              let obj = {};
              obj.taskid = index++;
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
              setTimeout(() => {
                that.taskAnalysisData.push(obj);
              }, 600);
            }
            // 总计
            let obj = {};
            obj.taskid = "总计";
            obj.times = that.timesTotal;
            obj.recordTimes = that.recordTimesTotal;
            obj.overdueTimes = that.overdueTimesTotal;
            obj.incompleteTimes = that.incompleteTimesTotal / that.task.length;
            obj.completeRate = that.completeRateTotal / that.task.length;
            console.log(obj);
            that.taskAnalysisData.unshift(obj);
            setTimeout(() => {
              that.$message({
                message: "查询成功",
                type: "success",
              });
            }, 300);
          });
        } else {
          let url =
            "http://47.102.214.37:8080/analysis/schedule?sid=" + that.task[0];
          url = url + "&start=" + that.start + "&end=" + that.end;
          axios.get(url).then((res) => {
            console.log(res);
            for (let i = 0; i < that.task.length; i++) {
              let obj = {};
              obj.taskid = index++;
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
              setTimeout(() => {
                that.taskAnalysisData.push(obj);
              }, 600);
            }
            setTimeout(() => {
              that.$message({
                message: "查询成功",
                type: "success",
              });
            }, 300);
          });
        }
      }
    },
    // if (
    //     that.deviceselectInfo.length == 0 ||
    //     that.taskselectInfo.length == 0
    //   ) {
    //     that.$message({
    //       message: "请输入将查询信息填写完整",
    //       type: "warning",
    //     });
    //   }
    search() {
      let that = this;
      that.timesTotal = 0;
      that.recordTimesTotal = 0;
      that.incompleteTimesTotal = 0;
      that.overdueTimesTotal = 0;
      that.completeRateTotal = 0;
      if (
        that.deviceselectInfo.length == 0 ||
        that.opsvalue.length == 0 ||
        that.taskselectInfo.length == 0
      ) {
        that.$message({
          message: "请将搜索信息填写完整",
          type: "warning",
        });
      } else {
        switch (true) {
          case that.ifdeviceall == true &&
            that.ifopsall == true &&
            that.iftaskall == true:
            that.searchdata();
            break;
          case that.ifdeviceall == true &&
            that.ifopsall == true &&
            that.iftaskall == false:
            that.confirmtask();
            setTimeout(() => {
              that.task = that.task3;
              that.searchdata();
            }, 1000);
            break;
          case that.ifdeviceall == true &&
            that.ifopsall == false &&
            that.iftaskall == true:
            that.confirmops();
            setTimeout(() => {
              that.task = that.task2;
              that.searchdata();
            }, 1000);
            break;
          case that.ifdeviceall == false &&
            that.ifopsall == true &&
            that.iftaskall == true:
            that.confirmdevice();
            setTimeout(() => {
              that.task = that.task1;
              that.searchdata();
            }, 1000);
            break;
          case that.ifdeviceall == false &&
            that.ifopsall == false &&
            that.iftaskall == true:
            that.confirmdevice();
            that.confirmops();
            setTimeout(() => {
              that.task = [];
              if (that.task2.length > that.task1.length) {
                for (let i = 0; i < that.task2.length; i++) {
                  for (let j = 0; j < that.task1.length; j++) {
                    if (that.task1[j] === that.task2[i]) {
                      that.task.push(that.task1[j]);
                    }
                  }
                }
              } else {
                for (let i = 0; i < that.task1.length; i++) {
                  for (let j = 0; j < that.task2.length; j++) {
                    if (that.task2[j] === that.task1[i]) {
                      that.task.push(that.task2[j]);
                    }
                  }
                }
              }
              that.searchdata();
            }, 1000);
            break;
          case that.ifdeviceall == true &&
            that.ifopsall == false &&
            that.iftaskall == false:
            that.confirmops();
            that.confirmtask();
            setTimeout(() => {
              that.task = [];
              if (that.task3.length > that.task2.length) {
                for (let i = 0; i < that.task3.length; i++) {
                  for (let j = 0; j < that.task2.length; j++) {
                    if (that.task2[j] === that.task3[i]) {
                      that.task.push(that.task2[j]);
                    }
                  }
                }
              } else {
                for (let i = 0; i < that.task2.length; i++) {
                  for (let j = 0; j < that.task3.length; j++) {
                    if (that.task3[j] === that.task2[i]) {
                      that.task.push(that.task3[j]);
                    }
                  }
                }
              }
              that.searchdata();
            }, 1000);
            break;
          case that.ifdeviceall == false &&
            that.ifopsall == true &&
            that.iftaskall == false:
            that.confirmdevice();
            that.confirmtask();
            setTimeout(() => {
              console.log(that.task1);
              console.log(that.task3);
              that.task = [];
              if (that.task3.length > that.task1.length) {
                for (let i = 0; i < that.task3.length; i++) {
                  for (let j = 0; j < that.task1.length; j++) {
                    if (that.task1[j] === that.task3[i]) {
                      that.task.push(that.task1[j]);
                    }
                  }
                }
              } else {
                for (let i = 0; i < that.task1.length; i++) {
                  for (let j = 0; j < that.task3.length; j++) {
                    if (that.task3[j] === that.task1[i]) {
                      that.task.push(that.task3[j]);
                    }
                  }
                }
              }
              that.searchdata();
            }, 1000);
            break;
          case that.ifdeviceall == false &&
            that.ifopsall == false &&
            that.iftaskall == false:
            that.confirmdevice();
            that.confirmops();
            that.confirmtask();
            setTimeout(() => {
              console.log(that.task1);
              console.log(that.task2);
              console.log(that.task3);
              that.task = [];
              if (that.task1.length > that.task2.length) {
                if (that.task1.length > that.task3.length) {
                  let arr1 = [];
                  let arr2 = [];
                  for (let i = 0; i < that.task1.length; i++) {
                    for (let j = 0; j < that.task3.length; j++) {
                      if (that.task3[j] === that.task1[i]) {
                        arr1.push(that.task3[j]);
                      }
                    }
                  }
                  for (let i = 0; i < that.task2.length; i++) {
                    for (let j = 0; j < that.task1.length; j++) {
                      if (that.task1[j] === that.task2[i]) {
                        arr2.push(that.task1[j]);
                      }
                    }
                  }
                  if (arr1.length > arr2.length) {
                    for (let i = 0; i < arr1.length; i++) {
                      for (let j = 0; j < arr2.length; j++) {
                        if (arr2[j] === arr1[i]) {
                          that.task.push(arr2[j]);
                        }
                      }
                    }
                    that.searchdata();
                  } else {
                    for (let i = 0; i < arr2.length; i++) {
                      for (let j = 0; j < arr1.length; j++) {
                        if (arr1[j] === arr2[i]) {
                          that.task.push(arr1[j]);
                        }
                      }
                    }
                    that.searchdata();
                  }
                } else {
                  let arr1 = [];
                  let arr2 = [];
                  for (let i = 0; i < that.task3.length; i++) {
                    for (let j = 0; j < that.task1.length; j++) {
                      if (that.task1[j] === that.task3[i]) {
                        arr1.push(that.task1[j]);
                      }
                    }
                  }
                  for (let i = 0; i < that.task3.length; i++) {
                    for (let j = 0; j < that.task2.length; j++) {
                      if (that.task2[j] === that.task3[i]) {
                        arr2.push(that.task2[j]);
                      }
                    }
                  }
                  if (arr1.length > arr2.length) {
                    for (let i = 0; i < arr1.length; i++) {
                      for (let j = 0; j < arr2.length; j++) {
                        if (arr2[j] === arr1[i]) {
                          that.task.push(arr2[j]);
                        }
                      }
                    }
                    that.searchdata();
                  } else {
                    for (let i = 0; i < arr2.length; i++) {
                      for (let j = 0; j < arr1.length; j++) {
                        if (arr1[j] === arr2[i]) {
                          that.task.push(arr1[j]);
                        }
                      }
                    }
                    that.searchdata();
                  }
                }
              } else {
                if (that.task3.length > that.task2.length) {
                  let arr1 = [];
                  let arr2 = [];
                  for (let i = 0; i < that.task3.length; i++) {
                    for (let j = 0; j < that.task1.length; j++) {
                      if (that.task1[j] === that.task3[i]) {
                        arr1.push(that.task1[j]);
                      }
                    }
                  }
                  for (let i = 0; i < that.task3.length; i++) {
                    for (let j = 0; j < that.task2.length; j++) {
                      if (that.task2[j] === that.task3[i]) {
                        arr2.push(that.task2[j]);
                      }
                    }
                  }
                  if (arr1.length > arr2.length) {
                    for (let i = 0; i < arr1.length; i++) {
                      for (let j = 0; j < arr2.length; j++) {
                        if (arr2[j] === arr1[i]) {
                          that.task.push(arr2[j]);
                        }
                      }
                    }
                    that.searchdata();
                  } else {
                    for (let i = 0; i < arr2.length; i++) {
                      for (let j = 0; j < arr1.length; j++) {
                        if (arr1[j] === arr2[i]) {
                          that.task.push(arr1[j]);
                        }
                      }
                    }
                    that.searchdata();
                  }
                } else {
                  let arr1 = [];
                  let arr2 = [];
                  for (let i = 0; i < that.task2.length; i++) {
                    for (let j = 0; j < that.task1.length; j++) {
                      if (that.task1[j] === that.task2[i]) {
                        arr1.push(that.task1[j]);
                      }
                    }
                  }
                  for (let i = 0; i < that.task2.length; i++) {
                    for (let j = 0; j < that.task3.length; j++) {
                      if (that.task3[j] === that.task2[i]) {
                        arr2.push(that.task3[j]);
                      }
                    }
                  }
                  if (arr1.length > arr2.length) {
                    for (let i = 0; i < arr1.length; i++) {
                      for (let j = 0; j < arr2.length; j++) {
                        if (arr2[j] === arr1[i]) {
                          that.task.push(arr2[j]);
                        }
                      }
                    }
                    that.searchdata();
                  } else {
                    for (let i = 0; i < arr2.length; i++) {
                      for (let j = 0; j < arr1.length; j++) {
                        if (arr1[j] === arr2[i]) {
                          that.task.push(arr1[j]);
                        }
                      }
                    }
                    that.searchdata();
                  }
                }
              }
            }, 1000);
            break;
          default:
            break;
        }
      }
    },
    // 确定设备下的taskid
    confirmdevice() {
      let that = this;
      that.device = [];
      that.url =
        "http://47.102.214.37:8080/device/query?" +
        that.deviceselectInfo[0].ziduan +
        "=L" +
        that.deviceselectInfo[0].value +
        "%25";
      if (that.deviceselectInfo.length == 1) {
        axios.get(that.url).then((res) => {
          console.log(res.data);
          for (let i = 0; i < res.data.content.length; i++) {
            that.device.push(res.data.content[i].id);
          }
        });
      } else {
        for (let i = 1; i < that.deviceselectInfo.length; i++) {
          that.url =
            that.url +
            "&" +
            that.deviceselectInfo[i].ziduan +
            "=L" +
            that.deviceselectInfo[i].value +
            "%25";
        }
        axios.get(that.url).then((res) => {
          console.log(res.data);
          for (let i = 0; i < res.data.content.length; i++) {
            that.device.push(res.data.content[i].id);
          }
        });
      }
      setTimeout(() => {
        console.log(that.device[0]);
        if (that.device.length > 1) {
          that.url =
            "http://47.102.214.37:8080/ops/query?device=I" + that.device[0];
          for (let j = 1; j < that.device.length; j++) {
            that.url = that.url + "," + that.device[j];
          }
        } else {
          that.url =
            "http://47.102.214.37:8080/ops/query?device=I" + that.device[0];
        }
        console.log(that.url);
        axios.get(that.url).then((res) => {
          console.log(res.data);
          that.task1 = [];
          for (let i = 0; i < res.data.content.length; i++) {
            that.task1.push(res.data.content[i].id);
          }
        });
      }, 300);
    },
    // 确定人员下的taskid
    confirmops() {
      let that = this;
      if (that.opsselectInfo[0].value.length > 1) {
        that.url =
          "http://47.102.214.37:8080/ops/query?" +
          that.opsselectInfo[0].ziduan +
          "=I" +
          that.opsselectInfo[0].value[0];
        for (let j = 1; j < that.opsselectInfo[0].value.length; j++) {
          that.url = that.url + "," + that.opsselectInfo[0].value[j];
        }
      } else {
        that.url =
          "http://47.102.214.37:8080/ops/query?" +
          that.opsselectInfo[0].ziduan +
          "==" +
          that.opsselectInfo[0].value;
      }
      console.log(that.url);
      axios.get(that.url).then((res) => {
        console.log(res.data);
        that.task2 = [];
        for (let i = 0; i < res.data.content.length; i++) {
          that.task2.push(res.data.content[i].id);
        }
      });
    },
    // 确定标准下的taskid
    confirmtask() {
      let that = this;
      // 确定第一部分
      if (that.taskselectInfo[0].ziduan == "name") {
        that.url =
          "http://47.102.214.37:8080/ops/query?" +
          that.taskselectInfo[0].ziduan +
          "=L" +
          that.taskselectInfo[0].value +
          "%25";
      } else {
        that.url =
          "http://47.102.214.37:8080/ops/query?" +
          that.taskselectInfo[0].ziduan +
          "==" +
          that.taskselectInfo[0].value;
      }
      if (that.taskselectInfo.length == 1) {
        axios.get(that.url).then((res) => {
          console.log(res.data);
          that.task3 = [];
          for (let i = 0; i < res.data.content.length; i++) {
            that.task3.push(res.data.content[i].id);
          }
        });
      } else {
        for (let i = 1; i < that.taskselectInfo.length; i++) {
          if (that.taskselectInfo[i].ziduan == "name") {
            that.url =
              that.url +
              "&" +
              that.taskselectInfo[i].ziduan +
              "=L" +
              that.taskselectInfo[i].value +
              "%25";
          } else {
            that.url =
              that.url +
              "&" +
              that.taskselectInfo[i].ziduan +
              "==" +
              that.taskselectInfo[i].value;
          }
        }
        axios.get(that.url).then((res) => {
          console.log(res.data);
          that.task3 = [];
          for (let i = 0; i < res.data.content.length; i++) {
            that.task3.push(res.data.content[i].id);
          }
        });
      }
    },
    clear() {
      this.ifall = false; // 是否是全部
      this.taskselectvalue = "";
      this.deviceselectvalue = "";
      this.opsvalue = "";
      this.deviceselectInfo = [];
      this.taskselectInfo = [];
      this.opsselectInfo = [];
      this.devicedynamicTags = []; // 设备搜索标签
      this.taskdynamicTags = []; // 保养搜索标签
      this.start = "";
      this.end = "";
      this.taskAnalysisData = [];
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
      margin: 0 0 10px 5px;
    }
    .el-button {
      width: 220px;
      background: linear-gradient(-270deg, #6eb5fc, #409eff);
      color: #fff;
      border: 0;
      font-size: 16px;
      border-radius: 5px;
    }
    .clear {
      background: coral;
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
