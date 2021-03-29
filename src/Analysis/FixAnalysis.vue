<template>
  <div class="Container-FixAnalysis">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">数据分析</el-breadcrumb-item>
      <el-breadcrumb-item class="active">维修分析</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Search">
      <!-- 设备选择 -->
      <div class="searchtask">
        选择设备：
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
          placeholder="请选择人员"
          filterable
          clearable
          multiple
          disabled
          collapse-tags
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
      <div class="searchpart">
        <div style="margin-left:5px;">
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
        <div style="margin-left:10px;">
          <el-button class="clear" @click="clear">清空条件</el-button>
        </div>
      </div>
    </div>
    <div class="Result">
      <!-- table -->
      <el-table
        ref="multipleTable"
        :data="deviceAnalysisData"
        stripe
        border
        style="width:100%;"
        class="extraTable"
      >
        <el-table-column
          prop="deviceid"
          label="序号"
          width="60"
        ></el-table-column>
        <el-table-column
          prop="unhealthyTime"
          label="设备故障总时间（分钟）"
        ></el-table-column>
        <el-table-column prop="issueCount" label="设备故障数"></el-table-column>
        <el-table-column
          prop="avgFixPeriod"
          label="设备平均维修耗时（分钟）"
        ></el-table-column>
        <el-table-column
          prop="avgIssuePeriod"
          label="设备平均故障周期（分钟）"
        ></el-table-column>
      </el-table>
    </div>
    <!-- 搜索条件 -->
    <el-dialog title="搜索条件" :visible.sync="dialogSearchVisible" width="35%">
      <el-input v-model="selectmodel" placeholder="请输入搜索内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSearchVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitselect">确 定</el-button>
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
    // 获取所有附加字段
    axios.get("http://47.102.214.37:8080/device/info-field").then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        that.selectoptions[1].options.push({
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
      selectoptions: [
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
              value: "crux",
              label: "是否为关键设备",
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
          label: "全部维修",
          options: [
            {
              value: "all",
              label: "全部维修设备分析",
            },
          ],
        },
      ],
      ifall: false,
      selectvalue: "",
      selectmodel: "",
      dialogSearchVisible: false,
      selectInfo: [],
      dynamicTags: [], // 搜索标签
      device: [], // 选择的设备

      startDate: "", // 开始时间
      endDate: "", // 结束时间

      deviceAnalysisData: [],

      // 人员
      opsvalue: [],
      opsoptions: [
        {
          label: "人员列表",
          options: [],
        },
      ],

      // 统计总计
      avgFixPeriodTotal: 0,
      avgIssuePeriodTotal: 0,
      unhealthyTimeTotal: 0,
      issueCountTotal: 0,
    };
  },
  methods: {
    selectchange(res) {
      let that = this;
      that.ifall = false;
      if (res == "all") {
        that.ifall = true;
        that.device = [];
        axios
          .get("http://47.102.214.37:8080/device?page=0&size=1000000000")
          .then((res) => {
            let i = 0;
            console.log(res.data);
            for (i = 0; i < res.data.content.length; i++) {
              that.device.push(res.data.content[i].id);
            }
            if (i == res.data.content.length) {
              console.log(that.device);
              // 清空搜索条件，等待下次搜索
              that.selectInfo = [];
              that.dynamicTags = [];
            }
          });
      } else {
        this.dialogSearchVisible = true;
      }
    },
    submitselect() {
      this.dialogSearchVisible = false;
      this.selectInfo.push({
        ziduan: this.selectvalue,
        value: this.selectmodel,
      });
      this.dynamicTags.push(this.selectvalue + " / " + this.selectmodel);
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
      let index = 1;
      that.avgFixPeriodTotal = 0;
      that.avgIssuePeriodTotal = 0;
      that.unhealthyTimeTotal = 0;
      that.issueCountTotal = 0;
      that.deviceAnalysisData = [];
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
          let url =
            "http://47.102.214.37:8080/analysis/device?did=" + that.device[0];
          for (i = 1; i < that.device.length; i++) {
            url = url + "," + that.device[i];
          }
          if (i == that.device.length) {
            console.log(i);
            url = url + "&start=" + that.startDate + "&end=" + that.endDate;
            console.log(url);
          }
          axios.get(url).then((res) => {
            console.log(res);
            let i = 0;
            for (i = 0; i < that.device.length; i++) {
              let obj = {};
              obj.deviceid = index++;
              obj.avgFixPeriod = res.data[that.device[i]].avgFixPeriod;
              that.avgFixPeriodTotal += res.data[that.device[i]].avgFixPeriod;
              obj.avgIssuePeriod = res.data[that.device[i]].avgIssuePeriod;
              that.avgIssuePeriodTotal +=
                res.data[that.device[i]].avgIssuePeriod;
              obj.unhealthyTime = res.data[that.device[i]].unhealthyTime;
              that.unhealthyTimeTotal += res.data[that.device[i]].unhealthyTime;
              obj.issueCount = res.data[that.device[i]].issueCount;
              that.issueCountTotal += res.data[that.device[i]].issueCount;
              console.log(obj);
              setTimeout(() => {
                that.deviceAnalysisData.push(obj);
              }, 600);
            }
            // 总计
            if (i == that.device.length) {
              console.log(that.avgFixPeriodTotal);
              let obj = {};
              obj.deviceid = "总计";
              obj.avgFixPeriod = that.avgFixPeriodTotal;
              obj.avgIssuePeriod = that.avgIssuePeriodTotal;
              obj.unhealthyTime = that.unhealthyTimeTotal;
              obj.issueCount = that.issueCountTotal;
              console.log(obj);
              that.deviceAnalysisData.push(obj);
            }
          });
          setTimeout(() => {
            that.$message({
              message: "查询成功",
              type: "success",
            });
          }, 300);
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
        that.device = [];
        let url =
          "http://47.102.214.37:8080/device/query?" +
          that.selectInfo[0].ziduan +
          "=L" +
          that.selectInfo[0].value +
          "%25";
        let exportURL =
          "http://47.102.214.37:8080/device/export?" +
          that.selectInfo[0].ziduan +
          "=L" +
          that.selectInfo[0].value +
          "%25";
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
                that.device.push(res.data.content[a].id);
              }
              if (that.device.length <= 1) {
                let url =
                  "http://47.102.214.37:8080/analysis/device?did=" +
                  that.device[0] +
                  "&start=" +
                  that.startDate +
                  "&end=" +
                  that.endDate;
                axios.get(url).then((res) => {
                  console.log(res.data);
                  let obj = {};
                  obj.deviceid = index++;
                  obj.avgFixPeriod = res.data[that.device[0]].avgFixPeriod;
                  obj.avgIssuePeriod = res.data[that.device[0]].avgIssuePeriod;
                  obj.unhealthyTime = res.data[that.device[0]].unhealthyTime;
                  obj.issueCount = res.data[that.device[0]].issueCount;
                  console.log(obj);
                  setTimeout(() => {
                    that.deviceAnalysisData.push(obj);
                  }, 600);
                });
              } else {
                let i = 0;
                let url =
                  "http://47.102.214.37:8080/analysis/device?did=" +
                  that.device[0];
                for (i = 1; i < that.device.length; i++) {
                  url = url + "," + that.device[i];
                }
                if (i == that.device.length) {
                  console.log(i);
                  url =
                    url + "&start=" + that.startDate + "&end=" + that.endDate;
                  console.log(url);
                }
                axios.get(url).then((res) => {
                  console.log(res);
                  let i = 0;
                  for (i = 0; i < that.device.length; i++) {
                    let obj = {};
                    obj.deviceid = index++;
                    obj.avgFixPeriod = res.data[that.device[i]].avgFixPeriod;
                    that.avgFixPeriodTotal +=
                      res.data[that.device[i]].avgFixPeriod;
                    obj.avgIssuePeriod =
                      res.data[that.device[i]].avgIssuePeriod;
                    that.avgIssuePeriodTotal +=
                      res.data[that.device[i]].avgIssuePeriod;
                    obj.unhealthyTime = res.data[that.device[i]].unhealthyTime;
                    that.unhealthyTimeTotal +=
                      res.data[that.device[i]].unhealthyTime;
                    obj.issueCount = res.data[that.device[i]].issueCount;
                    that.issueCountTotal += res.data[that.device[i]].issueCount;
                    console.log(obj);
                    setTimeout(() => {
                      that.deviceAnalysisData.push(obj);
                    }, 600);
                  }
                  // 总计
                  if (i == that.device.length) {
                    console.log(that.avgFixPeriodTotal);
                    let obj = {};
                    obj.deviceid = "总计";
                    obj.avgFixPeriod = that.avgFixPeriodTotal;
                    obj.avgIssuePeriod = that.avgIssuePeriodTotal;
                    obj.unhealthyTime = that.unhealthyTimeTotal;
                    obj.issueCount = that.issueCountTotal;
                    console.log(obj);
                    that.deviceAnalysisData.push(obj);
                  }
                });
              }

              setTimeout(() => {
                that.$message({
                  message: "查询成功",
                  type: "success",
                });
              }, 300);
            }
          });
        } else {
          for (let i = 1; i < that.selectInfo.length; i++) {
            url =
              url +
              "&" +
              that.selectInfo[i].ziduan +
              "=L" +
              that.selectInfo[i].value +
              "%25";
            exportURL =
              exportURL +
              "&" +
              that.selectInfo[i].ziduan +
              "=L" +
              that.selectInfo[i].value +
              "%25";
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
                that.device.push(res.data.content[a].id);
              }
              if (that.device.length <= 1) {
                let url =
                  "http://47.102.214.37:8080/analysis/device?did=" +
                  that.device[0] +
                  "&start=" +
                  that.startDate +
                  "&end=" +
                  that.endDate;
                axios.get(url).then((res) => {
                  console.log(res.data);
                  let obj = {};
                  obj.deviceid = index++;
                  obj.avgFixPeriod = res.data[that.device[0]].avgFixPeriod;
                  obj.avgIssuePeriod = res.data[that.device[0]].avgIssuePeriod;
                  obj.unhealthyTime = res.data[that.device[0]].unhealthyTime;
                  obj.issueCount = res.data[that.device[0]].issueCount;
                  console.log(obj);
                  setTimeout(() => {
                    that.deviceAnalysisData.push(obj);
                  }, 600);
                });
              } else {
                let i = 0;
                let url =
                  "http://47.102.214.37:8080/analysis/device?did=" +
                  that.device[0];
                for (i = 1; i < that.device.length; i++) {
                  url = url + "," + that.device[i];
                }
                if (i == that.device.length) {
                  console.log(i);
                  url =
                    url + "&start=" + that.startDate + "&end=" + that.endDate;
                  console.log(url);
                }
                axios.get(url).then((res) => {
                  console.log(res);
                  let i = 0;
                  for (i = 0; i < that.device.length; i++) {
                    let obj = {};
                    obj.avgFixPeriod = res.data[that.device[i]].avgFixPeriod;
                    that.avgFixPeriodTotal +=
                      res.data[that.device[i]].avgFixPeriod;
                    obj.avgIssuePeriod =
                      res.data[that.device[i]].avgIssuePeriod;
                    that.avgIssuePeriodTotal +=
                      res.data[that.device[i]].avgIssuePeriod;
                    obj.unhealthyTime = res.data[that.device[i]].unhealthyTime;
                    that.unhealthyTimeTotal +=
                      res.data[that.device[i]].unhealthyTime;
                    obj.issueCount = res.data[that.device[i]].issueCount;
                    that.issueCountTotal += res.data[that.device[i]].issueCount;
                    console.log(obj);
                    setTimeout(() => {
                      that.deviceAnalysisData.push(obj);
                    }, 600);
                  }
                  // 总计
                  if (i == that.device.length) {
                    console.log(that.avgFixPeriodTotal);
                    let obj = {};
                    obj.deviceid = "总计";
                    obj.avgFixPeriod = that.avgFixPeriodTotal;
                    obj.avgIssuePeriod = that.avgIssuePeriodTotal;
                    obj.unhealthyTime = that.unhealthyTimeTotal;
                    obj.issueCount = that.issueCountTotal;
                    console.log(obj);
                    that.deviceAnalysisData.push(obj);
                  }
                });
              }
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

    Search() {
      let that = this;
      that.deviceAnalysisData = [];
      if (
        that.device.length == 0 ||
        that.startDate == "" ||
        that.endDate == "" ||
        that.startDate == null ||
        that.endDate == null
      ) {
        that.$message({
          message: "请将搜索信息填写完整",
          typeo: "warning",
        });
      } else {
        // 判断开始时间以及结束时间
        // 结束时间不得早于开始时间
        // 结束时间不得超过今天
        if (
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
          if (that.device.length <= 1) {
            let url =
              "http://47.102.214.37:8080/analysis/device?did=" +
              that.device[0] +
              "&start=" +
              that.startDate +
              "&end=" +
              that.endDate;
            axios.get(url).then((res) => {
              console.log(res.data);
              let obj = {};
              obj.avgFixPeriod = res.data[that.device[0]].avgFixPeriod;
              obj.avgIssuePeriod = res.data[that.device[0]].avgIssuePeriod;
              obj.unhealthyTime = res.data[that.device[0]].unhealthyTime;
              obj.issueCount = res.data[that.device[0]].issueCount;
              console.log(obj);
              that.deviceAnalysisData.push(obj);
            });
          } else {
            let i = 0;
            let url =
              "http://47.102.214.37:8080/analysis/device?did=" + that.device[0];
            for (i = 1; i < that.device.length; i++) {
              url = url + "," + that.device[i];
            }
            if (i == that.device.length) {
              console.log(i);
              url = url + "&start=" + that.startDate + "&end=" + that.endDate;
              console.log(url);
            }
            axios.get(url).then((res) => {
              console.log(res);
              let i = 0;
              for (i = 0; i < that.device.length; i++) {
                let obj = {};
                obj.avgFixPeriod = res.data[that.device[i]].avgFixPeriod;
                that.avgFixPeriodTotal += res.data[that.device[i]].avgFixPeriod;
                obj.avgIssuePeriod = res.data[that.device[i]].avgIssuePeriod;
                that.avgIssuePeriodTotal +=
                  res.data[that.device[i]].avgIssuePeriod;
                obj.unhealthyTime = res.data[that.device[i]].unhealthyTime;
                that.unhealthyTimeTotal +=
                  res.data[that.device[i]].unhealthyTime;
                obj.issueCount = res.data[that.device[i]].issueCount;
                that.issueCountTotal += res.data[that.device[i]].issueCount;
                console.log(obj);
                that.deviceAnalysisData.push(obj);
              }
              // 总计
              if (i == that.device.length) {
                console.log(that.avgFixPeriodTotal);
                let obj = {};
                obj.deviceid = "总计";
                obj.avgFixPeriod = that.avgFixPeriodTotal;
                obj.avgIssuePeriod = that.avgIssuePeriodTotal;
                obj.unhealthyTime = that.unhealthyTimeTotal;
                obj.issueCount = that.issueCountTotal;
                console.log(obj);
                that.deviceAnalysisData.push(obj);
              }
            });
          }
        }
      }
    },
    clear() {
      this.ifall = false; // 是否是全部
      this.selectvalue = "";
      this.selectInfo = [];
      this.dynamicTags = []; // 搜索标签
      this.startDate = "";
      this.endDate = "";
      this.deviceAnalysisData = [];
    },
  },
};
</script>

<style lang="scss">
.Container-FixAnalysis {
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
}
</style>
