<template>
  <div class="Container-TaskInfomation">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
      <el-breadcrumb-item class="active">任务信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="head-btn">
      <div class="oper-btns-left">
        <div class="refresh">
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
      <el-table-column prop="id" label="任务ID" width="100"></el-table-column>
      <el-table-column
        prop="deadline"
        label="剩余天数"
        width="120"
      ></el-table-column>
      <el-table-column prop="name" label="任务名称"></el-table-column>
      <el-table-column prop="side" label="保养部位"></el-table-column>
      <el-table-column
        prop="acceptedStandard"
        label="接受标准"
      ></el-table-column>
      <el-table-column prop="setting" label="操作" width="160">
        <template slot-scope="scope">
          <el-tooltip content="详情" effect="light" :enterable="false">
            <el-button
              icon="iconfont icon-xiangqing"
              @click="handleDetail(scope.$index, scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            content="删除"
            :enterable="false"
            v-if="['ROOT', 'ADMIN'].includes(userRole)"
          >
            <el-button
              icon="iconfont icon-shanchu"
              @click="handleDelete(scope.$index, scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[8, 16, 24, 32, 40]"
        :page-size="8"
        layout="sizes,total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "DeviceInformation",
  components: {},
  data() {
    return {
      userRole: "", //用户类型
      userID: "",
      taskData: [],
      checkedDetail: null,
      // 分页
      currentPage: 1,
      page: 1,
      size: 10,
      total: 0,
      nextDateDay: "",
    };
  },
  methods: {
    //单选框选中数据
    handleDetailSelectionChange(selection) {
      this.checkedDetail = selection;
    },
    // 查看任务详情
    handleDetail(index) {
      console.log(this.taskData[index]);
      this.$router.push({
        path: "/taskDetailInfo",
        query: this.taskData[index],
      });
    },
    // 删除单个行
    handleDelete(index) {
      let that = this;
      this.$confirm("删除后无法更改, 是否确定?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let url =
            "http://47.102.214.37:8080/ops/schedule/" + that.taskData[index].id;
          console.log(url);
          axios.delete(url).then(() => {
            that.tableData.splice(index, 1);
            this.$message({
              message: "删除成功",
              type: "success",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
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
          .$confirm("此用户将被永久删除, \n是否确定?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            that.checkedDetail.forEach((element) => {
              that.taskData.forEach((e, i) => {
                if (element.id == e.id) {
                  console.log(element, e, i);
                  let url = "http://47.102.214.37:8080/ops/schedule/" + e.id;
                  console.log(url);
                  axios.delete(url).then(() => {
                    that.tableData.splice(i, 1);
                    this.$message({
                      message: "删除成功",
                      type: "success",
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
    // 表格方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let that = this;
      console.log(val);
      that.size = val;
      let url =
        "http://47.102.214.37:8080/ops/schedule?page=0" + "&size=" + that.size;
      console.log(url);
      axios.get(url).then((res) => {
        console.log(res.data);
      });
    },
    // 页变化
    handleCurrentChange(val) {
      let that = this;
      that.page = val;
      that.currentPage = val;
      console.log(that.page);
    },
    // 刷新
    refresh() {
      let that = this;
      console.log("aaa");
      that.userRole = "";
      that.userID = "";
      that.total = 0;
      that.taskData = [];
      axios.get("http://47.102.214.37:8080/user/me").then((res) => {
        console.log(res.data);
        that.userRole = res.data.role;
        that.userID = res.data.id;
      });
      setTimeout(() => {
        console.log("aaaa");
        if (["ROOT", "ADMIN", "CREATOR"].includes(that.userRole)) {
          axios
            .get("http://47.102.214.37:8080/ops/schedule?page=0&size=10")
            .then((res) => {
              console.log(res.data);
              for (var i = 0; i < res.data.content.length; i++) {
                let taskID = res.data.content[i].id;
                let taskname = res.data.content[i].name;
                let taskside = res.data.content[i].side;
                let taskacceptedStandard = res.data.content[i].acceptedStandard;
                let url =
                  "http://47.102.214.37:8080/ops/schedule/status/" +
                  res.data.content[i].id;
                setTimeout(() => {
                  axios.get(url).then((res) => {
                    that.taskData.push({
                      id: taskID,
                      deadline: res.data.nextDateDay,
                      name: taskname,
                      side: taskside,
                      acceptedStandard: taskacceptedStandard,
                    });
                    that.total++;
                  });
                }, 300);
              }
              that.$message({
                message: "任务更新成功",
                type: "success",
              });
            });
        } else if (that.userRole == "OPERATOR") {
          let url = "http://47.102.214.37:8080/my/schedule";
          console.log(url);
          axios.get(url).then((res) => {
            console.log(res.data);
            for (var i = 0; i < res.data.length; i++) {
              let taskID = res.data[i].id;
              let taskname = res.data[i].name;
              let taskside = res.data[i].side;
              let taskacceptedStandard = res.data[i].acceptedStandard;
              let url =
                "http://47.102.214.37:8080/ops/schedule/status/" +
                res.data[i].id;
              setTimeout(() => {
                axios.get(url).then((res) => {
                  that.taskData.push({
                    id: taskID,
                    deadline: res.data.nextDateDay,
                    name: taskname,
                    side: taskside,
                    acceptedStandard: taskacceptedStandard,
                  });
                  that.total++;
                });
              }, 300);
            }
            that.$message({
              message: "任务更新成功",
              type: "success",
            });
          });
        }
      }, 500);
    },
  },
  created() {
    let that = this;
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      console.log(res.data);
      that.userRole = res.data.role;
      that.userID = res.data.id;
    });
    setTimeout(() => {
      console.log("aaaa");
      if (["ROOT", "ADMIN", "CREATOR"].includes(that.userRole)) {
        axios
          .get("http://47.102.214.37:8080/ops/schedule?page=0&size=10")
          .then((res) => {
            console.log(res.data);
            for (var i = 0; i < res.data.content.length; i++) {
              let taskID = res.data.content[i].id;
              let taskname = res.data.content[i].name;
              let taskside = res.data.content[i].side;
              let taskacceptedStandard = res.data.content[i].acceptedStandard;
              let url =
                "http://47.102.214.37:8080/ops/schedule/status/" +
                res.data.content[i].id;
              setTimeout(() => {
                axios.get(url).then((res) => {
                  that.taskData.push({
                    id: taskID,
                    deadline: res.data.nextDateDay,
                    name: taskname,
                    side: taskside,
                    acceptedStandard: taskacceptedStandard,
                  });
                  that.total++;
                });
              }, 300);
            }
          });
      } else if (that.userRole == "OPERATOR") {
        let url = "http://47.102.214.37:8080/my/schedule";
        console.log(url);
        axios.get(url).then((res) => {
          console.log(res.data);
          for (var i = 0; i < res.data.length; i++) {
            let taskID = res.data[i].id;
            let taskname = res.data[i].name;
            let taskside = res.data[i].side;
            let taskacceptedStandard = res.data[i].acceptedStandard;
            let url =
              "http://47.102.214.37:8080/ops/schedule/status/" + res.data[i].id;
            setTimeout(() => {
              axios.get(url).then((res) => {
                that.taskData.push({
                  id: taskID,
                  deadline: res.data.nextDateDay,
                  name: taskname,
                  side: taskside,
                  acceptedStandard: taskacceptedStandard,
                });
                that.total++;
              });
            }, 300);
          }
        });
      }
    }, 500);
  },
};
</script>
<style lang="scss">
.Container-TaskInfomation {
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
          .iconfont {
            color: #409eff;
          }
        }
        &:nth-child(2):hover {
          .iconfont {
            color: #f96b6c;
          }
        }
      }
    }
  }
}
</style>
