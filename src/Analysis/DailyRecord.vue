<template>
  <div class="Container-DailyRecord">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">数据分析</el-breadcrumb-item>
      <el-breadcrumb-item class="active">使用日志</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="refresh">
      <el-button icon="el-icon-refresh" @click="refresh">刷新列表</el-button>
    </div>
    <div class="Result">
      <!-- table -->
      <el-table
        ref="multipleTable"
        :data="LogData"
        stripe
        border
        style="width:100%;"
        class="extraTable"
      >
        <el-table-column
          prop="logid"
          label="日志编号"
          width="200"
        ></el-table-column>
        <el-table-column prop="logtime" label="操作时间"></el-table-column>
        <el-table-column prop="logcontent" label="操作内容"></el-table-column>
        <el-table-column prop="loguser" label="操作人员"></el-table-column>
        <el-table-column prop="setting" label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="detail(scope.$index)">详情</el-button>
          </template>
        </el-table-column>
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
  </div>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  created: function() {
    let that = this;
    // 获取全部任务
    that.refresh();
  },
  data() {
    return {
      LogData: [],

      // 分页
      currentPage: 1, //  页面显示的当前页数
      page_size: 15, //  页面显示的每页显示条数
      page: 1, // 当前页数
      total: 0, // 总数
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
    // 刷新列表
    refresh() {
      let that = this;
      that.LogData = [];
      that.currentPage = 1;
      let url =
        "http://47.102.214.37:8080/logging?page=0&size=" + that.page_size;
      axios.get(url).then((res) => {
        console.log(res.data);
        console.log(JSON.parse(res.data.content[3].opContent));
        that.total = res.data.totalElements;
        for (let i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.logid = res.data.content[i].id;
          obj.logcontent = res.data.content[i].opName;
          obj.opContent = res.data.content[i].opContent;
          obj.logtime = that.renderTime(res.data.content[i].createdAt);
          // 获取人员信息
          setTimeout(() => {
            let searchops =
              "http://47.102.214.37:8080/user/" +
              res.data.content[i].operator.id;
            axios
              .get(searchops)
              .then((res) => {
                obj.loguser = res.data.name;
              })
              .catch(() => {
                obj.loguser = "获取失败";
              });
            setTimeout(() => {
              that.LogData.push(obj);
            }, 1000);
          }, 300);
        }
        setTimeout(() => {
          that.$message({
            message: "刷新成功",
            type: "success",
          });
        }, 600);
      });
    },
    detail(index) {
      let that = this;
      console.log(that.LogData[index]);
      that.$router.push({
        path: "./dailyRecordDetail",
        query: that.LogData[index],
      });
    },
    // 表格方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let that = this;
      that.LogData = [];
      that.currentPage = 1;
      console.log(val);
      that.page_size = val;
      let url =
        "http://47.102.214.37:8080/logging?page=0" + "&size=" + that.page_size;
      console.log(url);
      axios.get(url).then((res) => {
        console.log(res.data);
        that.total = res.data.totalElements;
        for (let i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.logid = res.data.content[i].id;
          obj.logcontent = res.data.content[i].opName;
          obj.opContent = res.data.content[i].opContent;
          obj.logtime = that.renderTime(res.data.content[i].createdAt);
          // 获取人员信息
          setTimeout(() => {
            let searchops =
              "http://47.102.214.37:8080/user/" +
              res.data.content[i].operator.id;
            axios
              .get(searchops)
              .then((res) => {
                console.log(res.data);
                obj.loguser = res.data.name;
              })
              .catch(() => {
                obj.loguser = "获取失败";
              });
            setTimeout(() => {
              that.LogData.push(obj);
            }, 1000);
          }, 300);
        }
        setTimeout(() => {
          that.$message({
            message: "刷新成功",
            type: "success",
          });
        }, 600);
      });
    },
    // // 页变化
    handleCurrentChange(val) {
      let that = this;
      that.LogData = [];
      that.page = val;
      that.currentPage = val;
      let url =
        "http://47.102.214.37:8080/logging?page=" +
        (that.page - 1) +
        "&size=" +
        that.page_size;
      console.log(url);
      axios.get(url).then((res) => {
        console.log(res.data);
        that.total = res.data.totalElements;
        for (let i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.logid = res.data.content[i].id;
          obj.logcontent = res.data.content[i].opName;
          obj.opContent = res.data.content[i].opContent;
          obj.logtime = that.renderTime(res.data.content[i].createdAt);
          // 获取人员信息
          setTimeout(() => {
            let searchops =
              "http://47.102.214.37:8080/user/" +
              res.data.content[i].operator.id;
            axios
              .get(searchops)
              .then((res) => {
                obj.loguser = res.data.name;
              })
              .catch(() => {
                obj.loguser = "获取失败";
              });
            setTimeout(() => {
              that.LogData.push(obj);
            }, 1000);
          }, 300);
        }
        setTimeout(() => {
          that.$message({
            message: "刷新成功",
            type: "success",
          });
        }, 600);
      });
    },
  },
};
</script>

<style lang="scss">
.Container-DailyRecord {
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
  .refresh {
    .el-button {
      padding: 0 10px;
      height: 30px;
      border-radius: 5px;
      font-size: 12px;
      width: 85px;
      border: 1px solid #409eff;
      color: #409eff;
      margin-left: 5px;
    }
  }
  .Result {
    // border: 1px solid red;
    margin-top: 10px;
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
        }
      }
    }
  }
  // 分页
  .el-pagination {
    text-align: center;
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>
