<template>
  <div class="Container-FixDiagnosis">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备维修</el-breadcrumb-item>
      <el-breadcrumb-item class="active">分配到我的</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="refresh">
      <el-button icon="el-icon-refresh" @click="refresh">刷新列表 </el-button>
    </div>
    <!-- table -->
    <el-table
      ref="multipleTable"
      :data="taskData"
      stripe
      border
      style="width:100%;"
      class="extraTable"
    >
      <el-table-column
        prop="errorid"
        label="报修流水号"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="errordevicename"
        label="故障设备名称"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="errordeviceNo"
        label="故障设备编号"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="reportername"
        label="报修人员"
        :width="tablewidth"
      ></el-table-column>
      <el-table-column
        prop="reportertime"
        label="报修时间"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="assigneename"
        label="维修人员"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="assigneestatus"
        label="维修状态"
        :width="tablewidth"
      ></el-table-column>
      <el-table-column prop="setting" label="操作" width="180">
        <template slot-scope="scope">
          <el-button @click="errordetail(scope.$index)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15]"
        :page-size="page_size"
        layout="sizes,total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  created: function() {
    this.refresh();
  },
  data() {
    return {
      taskData: [],
      tablewidth: "150",

      // 分页
      currentPage: 1, //  页面显示的当前页数
      page_size: 5, //  页面显示的每页显示条数
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

    refresh() {
      let that = this;
      that.taskData = [];
      let url =
        "http://47.102.214.37:8080/issue/assignee?page=0&size=" +
        that.page_size;
      axios.get(url).then((res) => {
        console.log(res.data);
        that.total = res.data.totalElements;
        for (let i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.errorid = res.data.content[i].id;
          obj.errordevicename = "";
          obj.errordeviceNo = "";
          obj.assigneename = "";
          obj.reportertime = that.renderTime(res.data.content[i].createdAt);
          obj.assigneestatus = res.data.content[i].closed ? "已处理" : "未处理";
          // 获取设备信息
          setTimeout(() => {
            for (let j = 0; j < res.data.content[i].device.length; j++) {
              let deviceurl =
                "http://47.102.214.37:8080/device/" +
                res.data.content[i].device[j].id;
              axios.get(deviceurl).then((res) => {
                obj.errordevicename += res.data.name + " / ";
                obj.errordeviceNo += res.data.deviceNo + " / ";
              });
            }
            setTimeout(() => {
              // 获取报修人员信息
              let assigneeurl =
                "http://47.102.214.37:8080/user/" +
                res.data.content[i].assignee[0].id;
              axios.get(assigneeurl).then((res) => {
                console.log(res.data);
                obj.reportername =
                  res.data.name == undefined ? "未分配" : res.data.name;
              });
              // 获取维修人员信息
              setTimeout(() => {
                if (res.data.content[i].assignee.length == 1) {
                  obj.assigneename = "未分配";
                } else {
                  for (
                    let k = 1;
                    k < res.data.content[i].assignee.length;
                    k++
                  ) {
                    let assigneeurl =
                      "http://47.102.214.37:8080/user/" +
                      res.data.content[i].assignee[k].id;
                    axios.get(assigneeurl).then((res) => {
                      console.log(res.data);
                      obj.assigneename += res.data.name + " / ";
                    });
                  }
                }
                setTimeout(() => {
                  that.taskData.push(obj);
                }, 800);
              }, 300);
            }, 300);
          }, 300);
        }
        setTimeout(() => {
          that.$message({
            message: "刷新成功",
            type: "success",
          });
        }, 1000);
      });
    },
    errordetail(index) {
      let that = this;
      console.log(that.taskData[index]);
      that.$router.push({
        path: "./errorDetail",
        query: that.taskData[index],
      });
    },
    // 表格方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let that = this;
      that.taskData = [];
      console.log(val);
      that.page_size = val;
      that.currentPage = 1;
      let url =
        "http://47.102.214.37:8080/issue/assignee?page=0" +
        "&size=" +
        that.page_size;
      console.log(url);
      axios.get(url).then((res) => {
        console.log(res.data);
        that.total = res.data.totalElements;
        for (let i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.errorid = res.data.content[i].id;
          obj.errordevicename = "";
          obj.errordeviceNo = "";
          obj.assigneename = "";
          obj.reportertime = that.renderTime(res.data.content[i].createdAt);
          obj.assigneestatus = res.data.content[i].closed ? "已处理" : "未处理";
          // 获取设备信息
          setTimeout(() => {
            for (let j = 0; j < res.data.content[i].device.length; j++) {
              let deviceurl =
                "http://47.102.214.37:8080/device/" +
                res.data.content[i].device[j].id;
              axios.get(deviceurl).then((res) => {
                obj.errordevicename += res.data.name + " / ";
                obj.errordeviceNo += res.data.deviceNo + " / ";
              });
            }
            setTimeout(() => {
              // 获取报修人员信息
              let assigneeurl =
                "http://47.102.214.37:8080/user/" +
                res.data.content[i].assignee[0].id;
              axios.get(assigneeurl).then((res) => {
                console.log(res.data);
                obj.reportername =
                  res.data.name == undefined ? "未分配" : res.data.name;
              });
              // 获取维修人员信息
              setTimeout(() => {
                if (res.data.content[i].assignee.length == 1) {
                  obj.assigneename = "未分配";
                } else {
                  for (
                    let k = 1;
                    k < res.data.content[i].assignee.length;
                    k++
                  ) {
                    let assigneeurl =
                      "http://47.102.214.37:8080/user/" +
                      res.data.content[i].assignee[k].id;
                    axios.get(assigneeurl).then((res) => {
                      console.log(res.data);
                      obj.assigneename += res.data.name + " / ";
                    });
                  }
                }
                setTimeout(() => {
                  that.taskData.push(obj);
                }, 800);
              }, 300);
            }, 300);
          }, 300);
        }
        setTimeout(() => {
          that.$message({
            message: "刷新成功",
            type: "success",
          });
        }, 1000);
      });
    },
    // // 页变化
    handleCurrentChange(val) {
      let that = this;
      that.page = val;
      that.currentPage = val;
      console.log(val);
      let url =
        "http://47.102.214.37:8080/issue/assignee?page=0" +
        (that.page - 1) +
        "&size=" +
        that.page_size;
      console.log(url);
      axios.get(url).then((res) => {
        console.log(res.data);
        that.total = res.data.totalElements;
        for (let i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.errorid = res.data.content[i].id;
          obj.errordevicename = "";
          obj.errordeviceNo = "";
          obj.assigneename = "";
          obj.reportertime = that.renderTime(res.data.content[i].createdAt);
          obj.assigneestatus = res.data.content[i].closed ? "已处理" : "未处理";
          // 获取设备信息
          setTimeout(() => {
            for (let j = 0; j < res.data.content[i].device.length; j++) {
              let deviceurl =
                "http://47.102.214.37:8080/device/" +
                res.data.content[i].device[j].id;
              axios.get(deviceurl).then((res) => {
                obj.errordevicename += res.data.name + " / ";
                obj.errordeviceNo += res.data.deviceNo + " / ";
              });
            }
            setTimeout(() => {
              // 获取报修人员信息
              let assigneeurl =
                "http://47.102.214.37:8080/user/" +
                res.data.content[i].assignee[0].id;
              axios.get(assigneeurl).then((res) => {
                console.log(res.data);
                obj.reportername =
                  res.data.name == undefined ? "未分配" : res.data.name;
              });
              // 获取维修人员信息
              setTimeout(() => {
                if (res.data.content[i].assignee.length == 1) {
                  obj.assigneename = "未分配";
                } else {
                  for (
                    let k = 1;
                    k < res.data.content[i].assignee.length;
                    k++
                  ) {
                    let assigneeurl =
                      "http://47.102.214.37:8080/user/" +
                      res.data.content[i].assignee[k].id;
                    axios.get(assigneeurl).then((res) => {
                      console.log(res.data);
                      obj.assigneename += res.data.name + " / ";
                    });
                  }
                }
                setTimeout(() => {
                  that.taskData.push(obj);
                }, 800);
              }, 300);
            }, 300);
          }, 300);
        }
        setTimeout(() => {
          that.$message({
            message: "刷新成功",
            type: "success",
          });
        }, 1000);
      });
    },
  },
};
</script>
<style lang="scss">
.Container-FixDiagnosis {
  .breadcrumb {
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    font-size: 16px;
    // border: 1px solid red;
    padding: 10px;
    .el-breadcrumb__inner {
      font-weight: bold;
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
      margin-left: 10px;
    }
  }
  .extraTable {
    margin-top: 5px;
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
</style>
