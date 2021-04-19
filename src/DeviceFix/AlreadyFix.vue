<template>
  <div class="Container-AlreadyFix">
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
        :page-sizes="[15, 30, 50, 100]"
        :page-size="page_size"
        layout="sizes,total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
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
        return new Date(+new Date(dateee) + 16 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, " ")
          .replace(/\.[\d]{3}Z/, "");
      }
    },

    refresh() {
      let that = this;
      that.taskData = [];
      let url = "issue/assignee?page=0&size=" + that.page_size;
      that
        .request(url, {}, "GET")
        .then((res) => {
          console.log(res.data);
          that.total = res.data.totalElements;
          for (let i = 0; i < res.data.content.length; i++) {
            let obj = {};
            obj.errorid = res.data.content[i].id;
            obj.errordevicename = "";
            obj.errordeviceNo = "";
            obj.assigneename = "";
            obj.reportertime = that.renderTime(res.data.content[i].createdAt);
            if (res.data.content[i].assignedAt == null) {
              obj.assigneestatus = "已申请";
            } else if (res.data.content[i].fixedAt == null) {
              obj.assigneestatus = "已分配";
            } else if (res.data.content[i].closedAt == null) {
              obj.assigneestatus = "已修复";
            } else if (res.data.content[i].closedAt != null) {
              obj.assigneestatus = "已完成";
            }
            // 获取设备信息
            setTimeout(() => {
              for (let j = 0; j < res.data.content[i].device.length; j++) {
                let deviceurl = "device/" + res.data.content[i].device[j].id;
                that
                  .request(deviceurl, {}, "GET")
                  .then((res) => {
                    obj.errordevicename += res.data.name + " / ";
                    obj.errordeviceNo += res.data.deviceNo + " / ";
                  })
                  .catch((res) => {
                    this.$message({
                      message: res.response.data.message,
                      type: "error",
                    });
                  });
              }
              setTimeout(() => {
                // 获取报修人员信息
                let assigneeurl = "user/" + res.data.content[i].reporter.id;
                that
                  .request(assigneeurl, {}, "GET")
                  .then((res) => {
                    console.log(res.data);
                    obj.reportername =
                      res.data.name == undefined ? "未分配" : res.data.name;
                  })
                  .catch((res) => {
                    this.$message({
                      message: res.response.data.message,
                      type: "error",
                    });
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
                        "user/" + res.data.content[i].assignee[k].id;
                      that
                        .request(assigneeurl, {}, "GET")
                        .then((res) => {
                          console.log(res.data);
                          obj.assigneename += res.data.name + " / ";
                        })
                        .catch((res) => {
                          this.$message({
                            message: res.response.data.message,
                            type: "error",
                          });
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
        })
        .catch((res) => {
          this.$message({
            message: res.response.data.message,
            type: "error",
          });
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
      let url = "issue/assignee?page=0" + "&size=" + that.page_size;
      console.log(url);
      that
        .request(url, {}, "GET")
        .then((res) => {
          console.log(res.data);
          that.total = res.data.totalElements;
          for (let i = 0; i < res.data.content.length; i++) {
            let obj = {};
            obj.errorid = res.data.content[i].id;
            obj.errordevicename = "";
            obj.errordeviceNo = "";
            obj.assigneename = "";
            obj.reportertime = that.renderTime(res.data.content[i].createdAt);
            if (res.data.content[i].assignedAt == null) {
              obj.assigneestatus = "已申请";
            } else if (res.data.content[i].fixedAt == null) {
              obj.assigneestatus = "已分配";
            } else if (res.data.content[i].closedAt == null) {
              obj.assigneestatus = "已修复";
            } else if (res.data.content[i].closedAt != null) {
              obj.assigneestatus = "已完成";
            }
            // 获取设备信息
            setTimeout(() => {
              for (let j = 0; j < res.data.content[i].device.length; j++) {
                let deviceurl = "device/" + res.data.content[i].device[j].id;
                that
                  .request(deviceurl, {}, "GET")
                  .then((res) => {
                    obj.errordevicename += res.data.name + " / ";
                    obj.errordeviceNo += res.data.deviceNo + " / ";
                  })
                  .catch((res) => {
                    this.$message({
                      message: res.response.data.message,
                      type: "error",
                    });
                  });
              }
              setTimeout(() => {
                // 获取报修人员信息
                let assigneeurl = "user/" + res.data.content[i].reporter.id;
                that
                  .request(assigneeurl, {}, "GET")
                  .then((res) => {
                    console.log(res.data);
                    obj.reportername =
                      res.data.name == undefined ? "未分配" : res.data.name;
                  })
                  .catch((res) => {
                    this.$message({
                      message: res.response.data.message,
                      type: "error",
                    });
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
                        "user/" + res.data.content[i].assignee[k].id;
                      that
                        .request(assigneeurl, {}, "GET")
                        .then((res) => {
                          console.log(res.data);
                          obj.assigneename += res.data.name + " / ";
                        })
                        .catch((res) => {
                          this.$message({
                            message: res.response.data.message,
                            type: "error",
                          });
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
        })
        .catch((res) => {
          this.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
    },
    // // 页变化
    handleCurrentChange(val) {
      let that = this;
      that.page = val;
      that.currentPage = val;
      console.log(val);
      let url =
        "issue/assignee?page=0" + (that.page - 1) + "&size=" + that.page_size;
      console.log(url);
      that
        .request(url, {}, "GET")
        .then((res) => {
          console.log(res.data);
          that.total = res.data.totalElements;
          for (let i = 0; i < res.data.content.length; i++) {
            let obj = {};
            obj.errorid = res.data.content[i].id;
            obj.errordevicename = "";
            obj.errordeviceNo = "";
            obj.assigneename = "";
            obj.reportertime = that.renderTime(res.data.content[i].createdAt);
            if (res.data.content[i].assignedAt == null) {
              obj.assigneestatus = "已申请";
            } else if (res.data.content[i].fixedAt == null) {
              obj.assigneestatus = "已分配";
            } else if (res.data.content[i].closedAt == null) {
              obj.assigneestatus = "已修复";
            } else if (res.data.content[i].closedAt != null) {
              obj.assigneestatus = "已完成";
            }
            // 获取设备信息
            setTimeout(() => {
              for (let j = 0; j < res.data.content[i].device.length; j++) {
                let deviceurl = "device/" + res.data.content[i].device[j].id;
                that
                  .request(deviceurl, {}, "GET")
                  .then((res) => {
                    obj.errordevicename += res.data.name + " / ";
                    obj.errordeviceNo += res.data.deviceNo + " / ";
                  })
                  .catch((res) => {
                    this.$message({
                      message: res.response.data.message,
                      type: "error",
                    });
                  });
              }
              setTimeout(() => {
                // 获取报修人员信息
                let assigneeurl = "user/" + res.data.content[i].reporter.id;
                that
                  .request(assigneeurl, {}, "GET")
                  .then((res) => {
                    console.log(res.data);
                    obj.reportername =
                      res.data.name == undefined ? "未分配" : res.data.name;
                  })
                  .catch((res) => {
                    this.$message({
                      message: res.response.data.message,
                      type: "error",
                    });
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
                      if (res.data.content[i].assignee.length == 1) {
                        obj.assigneename = "未分配";
                      } else {
                        for (
                          let k = 1;
                          k < res.data.content[i].assignee.length;
                          k++
                        ) {
                          let assigneeurl =
                            "user/" + res.data.content[i].assignee[k].id;
                          that
                            .request(assigneeurl, {}, "GET")
                            .then((res) => {
                              console.log(res.data);
                              obj.assigneename += res.data.name + " / ";
                            })
                            .catch((res) => {
                              this.$message({
                                message: res.response.data.message,
                                type: "error",
                              });
                            });
                        }
                      }
                      setTimeout(() => {
                        that.taskData.push(obj);
                      }, 800);
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
        })
        .catch((res) => {
          this.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
    },
  },
};
</script>
<style lang="scss">
.Container-AlreadyFix {
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
  .el-pagination {
    text-align: center;
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>
