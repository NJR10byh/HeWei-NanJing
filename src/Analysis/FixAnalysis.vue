<template>
  <div class="Container-FixAnalysis">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">数据分析</el-breadcrumb-item>
      <el-breadcrumb-item class="active">维修分析</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Search">
      <div>
        <el-select
          clearable
          filterable
          multiple
          collapse-tags
          placeholder="请选择设备"
          v-model="device"
        >
          <el-option
            v-for="item in Devices"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div>
        <el-date-picker
          v-model="startDate"
          type="date"
          placeholder="开始日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
      <div>
        <el-date-picker
          v-model="endDate"
          type="date"
          placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
      <div>
        <el-button @click="Search">查询</el-button>
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
          label="设备编号"
          width="100"
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
  </div>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  created: function() {
    let that = this;
    // 获取全部设备
    axios.get("http://47.102.214.37:8080/device/query?name=!").then((res) => {
      for (var i = 0; i < res.data.content.length; i++) {
        // console.log(res.data.content[i]);
        let obj = {};
        obj.value = res.data.content[i].id;
        obj.label =
          res.data.content[i].name + "（" + res.data.content[i].deviceNo + "）";
        that.Devices.push(obj);
      }
    });
  },
  data() {
    return {
      Devices: [], // 所有设备列表
      device: [], // 选择的设备

      startDate: "", // 开始时间
      endDate: "", // 结束时间

      deviceAnalysisData: [],
    };
  },
  methods: {
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
            obj.deviceid = that.device[0];
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
            for (let i = 0; i < that.device.length; i++) {
              let obj = {};
              obj.deviceid = that.device[i];
              obj.avgFixPeriod = res.data[that.device[i]].avgFixPeriod;
              obj.avgIssuePeriod = res.data[that.device[i]].avgIssuePeriod;
              obj.unhealthyTime = res.data[that.device[i]].unhealthyTime;
              obj.issueCount = res.data[that.device[i]].issueCount;
              console.log(obj);
              that.deviceAnalysisData.push(obj);
            }
          });
        }
      }
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
    justify-content: space-around;
    align-items: center;
    padding-bottom: 20px;
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
        .el-button {
          border: none;
          padding: 5px 10px;
          background: transparent;
          &:first-child:hover {
            color: #409eff;
          }
          &:nth-child(2):hover {
            color: #f96b6c;
          }
        }
      }
    }
  }
  .el-button {
    width: 80px;
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
</style>
