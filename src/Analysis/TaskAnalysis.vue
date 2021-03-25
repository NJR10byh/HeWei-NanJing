<template>
  <div class="Container-TaskAnalysis">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">数据分析</el-breadcrumb-item>
      <el-breadcrumb-item class="active">保养分析</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Search">
      <div>
        <el-select
          clearable
          filterable
          multiple
          collapse-tags
          placeholder="请选择任务"
          v-model="task"
        >
          <el-option
            v-for="item in Tasks"
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
  </div>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  created: function() {
    let that = this;
    // 获取全部任务
    axios
      .get("http://47.102.214.37:8080/ops/schedule?page=0&size=100")
      .then((res) => {
        console.log(res.data);
        for (var i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.value = res.data.content[i].id;
          obj.label = res.data.content[i].name;
          that.Tasks.push(obj);
        }
      });
  },
  data() {
    return {
      Tasks: [], // 所有任务列表
      task: [], // 选择的任务

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
    Search() {
      let that = this;
      that.taskAnalysisData = [];
      if (
        that.task.length == 0 ||
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
              obj.completeRate = res.data[that.task[0]].completeRate;
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
              "http://47.102.214.37:8080/analysis/schedule?sid=" + that.task[0];
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
                obj.taskid = that.task[0];
                obj.times = res.data[that.task[0]].times;
                that.timesTotal = res.data[that.task[0]].times;
                obj.incompleteTimes = res.data[that.task[0]].incompleteTimes;
                obj.completeRate = res.data[that.task[0]].completeRate;
                obj.overdueTimes = res.data[that.task[0]].overdueTimes;
                that.overdueTimesTotal = res.data[that.task[0]].overdueTimes;
                obj.recordTimes = res.data[that.task[0]].recordTimes;
                that.recordTimesTotal = res.data[that.task[0]].recordTimes;

                console.log(obj);
                that.taskAnalysisData.push(obj);
              }
              // 总计
              if (i == that.task.length) {
                let obj = {};
                obj.taskid = "总计";
                obj.times = that.timesTotal;
                obj.recordTimes = that.recordTimesTotal;
                obj.overdueTimes = that.overdueTimesTotal;
                console.log(obj);
                that.taskAnalysisData.unshift(obj);
              }
            });
          }
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
