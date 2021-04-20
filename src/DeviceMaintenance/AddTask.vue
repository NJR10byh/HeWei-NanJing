<template>
  <div class="Container-AddTask">
    <el-breadcrumb class="breadcrumb-top" separator="/">
      <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
      <el-breadcrumb-item class="active">新增标准</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <div class="head-btn">
      <div class="oper-btns-left">
        <div class="refresh">
          <el-button icon="el-icon-plus" @click="addNewTask"
            >新增标准
          </el-button>
          <el-button icon="el-icon-refresh" @click="refresh"
            >刷新列表
          </el-button>
        </div>
      </div>
      <div class="oper-btns-right" v-if="['ROOT', 'ADMIN'].includes(userRole)">
        <el-button
          class="bigdel-btn"
          icon="el-icon-delete"
          @click="delectExtraInfo"
          >批量删除</el-button
        >
      </div>
    </div>
    <!-- table -->
    <el-table
      ref="multipleTable"
      :data="taskData"
      stripe
      border
      style="width:100%;"
      class="extraTable"
      @selection-change="handleDetailSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="name" label="标准名称"></el-table-column>
      <el-table-column prop="no" label="标准编号"></el-table-column>
      <el-table-column
        prop="setting"
        label="操作"
        width="300"
        v-if="['ROOT', 'ADMIN', 'CREATOR'].includes(userRole)"
      >
        <template slot-scope="scope">
          <el-button @click="showInfo(scope.$index)">以此为模版新增</el-button>
          <el-button @click="editTask(scope.$index)">修改标准</el-button>
          <el-button @click="deleteTask(scope.$index)">删除</el-button>
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
    let that = this;
    that.userRole = this.globaldata.userRole;
    that.refresh();
  },
  data() {
    return {
      userRole: "", //用户类型
      dialogVisible: false,
      devicename: "",
      deviceclazz: "",
      taskData: [],
      checkedDetail: [],

      // 分页
      currentPage: 1, //  页面显示的当前页数
      page_size: 15, //  页面显示的每页显示条数
      page: 1, // 当前页数
      total: 0, // 总数
    };
  },
  methods: {
    //新建维护任务（不使用模版）
    addNewTask() {
      this.$router.push({
        path: "/addTaskInside",
      });
    },
    showInfo(index) {
      console.log(index);
      this.$router.push({
        path: "/addTaskInside",
        query: this.taskData[index],
      });
    },
    editTask(index) {
      this.$router.push({
        path: "/alterTaskcontent",
        query: this.taskData[index],
      });
    },
    //单选框选中数据
    handleDetailSelectionChange(selection) {
      this.checkedDetail = selection;
    },
    // 删除单个行
    deleteTask(index) {
      let that = this;
      that
        .$confirm("确定要删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          let url = "ops/schedule/" + that.taskData[index].taskID;
          that
            .request(url, {}, "DELETE")
            .then(() => {
              that.taskData.splice(index, 1);
              this.$message({
                message: "删除成功",
                type: "success",
              });
            })
            .catch((res) => {
              this.$message({
                message: res.response.data.message,
                type: "error",
              });
            });
        })
        .catch(() => {
          that.$message.info("已取消删除");
        });
    },
    // 批量删除字段
    delectExtraInfo() {
      let that = this;
      if (this.checkedDetail.length == 0) {
        that.$alert("请先选择要删除的数据", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        that
          .$confirm("确定要删除吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            that.checkedDetail.forEach((element) => {
              that.taskData.forEach((e, i) => {
                if (element.taskID == e.taskID) {
                  let url = "ops/schedule/" + e.taskID;
                  that
                    .request(url, {}, "DELETE")
                    .then(() => {
                      that.taskData.splice(i, 1);
                      this.$message({
                        message: "删除成功",
                        type: "success",
                      });
                      that.taskData.splice(i, 1);
                      that.checkedDetail.pop();
                    })
                    .catch((res) => {
                      this.$message({
                        message: res.response.data.message,
                        type: "error",
                      });
                    });
                }
              });
            });
          })
          .catch(() => {
            this.$message.info("已取消删除");
          });
      }
    },
    refresh() {
      let that = this;
      that.taskData = [];
      that.currentPage = 1;
      let url = "ops/schedule?page=0&size=" + that.page_size;
      that
        .request(url, {}, "GET")
        .then((res) => {
          that.total = res.data.totalElements;
          for (var i = 0; i < res.data.content.length; i++) {
            that.taskData.push({
              taskID: res.data.content[i].id,
              name: res.data.content[i].name,
              no: res.data.content[i].no,
            });
          }
          that.$message({
            message: "刷新成功",
            type: "success",
          });
        })
        .catch((res) => {
          this.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
    },
    // 表格方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let that = this;
      that.taskData = [];
      that.currentPage = 1;
      console.log(val);
      that.page_size = val;
      let url = "ops/schedule?page=0" + "&size=" + that.page_size;
      that
        .request(url, {}, "GET")
        .then((res) => {
          that.total = res.data.totalElements;
          for (var i = 0; i < res.data.content.length; i++) {
            that.taskData.push({
              taskID: res.data.content[i].id,
              name: res.data.content[i].name,
              no: res.data.content[i].no,
            });
          }
          that.$message({
            message: "刷新成功",
            type: "success",
          });
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
      that.taskData = [];
      that.page = val;
      that.currentPage = val;
      let url =
        "ops/schedule?page=" + (that.page - 1) + "&size=" + that.page_size;
      that
        .request(url, {}, "GET")
        .then((res) => {
          that.total = res.data.totalElements;
          for (var i = 0; i < res.data.content.length; i++) {
            that.taskData.push({
              taskID: res.data.content[i].id,
              name: res.data.content[i].name,
              no: res.data.content[i].no,
            });
          }
          that.$message({
            message: "刷新成功",
            type: "success",
          });
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
.Container-AddTask {
  width: 100%;
  // border: 1px solid red;
  display: flex;
  flex-direction: column;
  .breadcrumb-top {
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    font-size: 16px;
    padding: 10px 10px 5px 10px;
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
  .head-btn {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 5px;
    // border: 1px solid red;
    .oper-btns-left {
      // border: 1px solid red;
      display: flex;
      justify-content: center;
      align-items: center;
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
      .input {
        // border: 1px solid red;
        margin-left: 10px;
        .el-input__inner {
          height: 35px;
        }
      }
      .search {
        .el-button {
          height: 35px;
          padding: 0 10px;
          border-radius: 5px;
          font-size: 15px;
          background: #409eff;
          width: 85px;
          border: 0;
          color: #fff;
          margin-left: 10px;
        }
      }
    }
    .oper-btns-right {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 10px;
      // border: 1px solid red;
      .el-button {
        padding: 0 10px;
        height: 30px;
        border-radius: 5px;
        font-size: 12px;
        &.bigdel-btn {
          width: 85px;
          border: 1px solid #f96b6c;
          color: #f96b6c;
        }
        &.bigdel-btn:hover {
          background: #ffcccc;
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
  .extraTable {
    .el-table__header {
      th {
        background: #fafafa;
        &:first-child {
          border-right: none;
        }
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
        &:first-child {
          border-right: none;
        }
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
