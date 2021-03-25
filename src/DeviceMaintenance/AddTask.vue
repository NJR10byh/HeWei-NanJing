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
      <el-table-column prop="number" label="标准编号"></el-table-column>
      <el-table-column
        prop="setting"
        label="操作"
        width="280"
        v-if="['ROOT', 'ADMIN'].includes(userRole)"
      >
        <template slot-scope="scope">
          <el-button @click="showInfo(scope.$index)">以此为模版新增</el-button>
          <el-button @click="editTask(scope.$index)">修改</el-button>
          <el-button @click="deleteTask(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AddTask",
  created: function() {
    let that = this;
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      // console.log(res.data);
      that.userRole = res.data.role;
    });
    setTimeout(function() {
      that.refresh();
    }, 300);
  },
  data() {
    return {
      userRole: "", //用户类型
      dialogVisible: false,
      devicename: "",
      deviceclazz: "",
      taskData: [],
      checkedDetail: [],
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
    handleDelete(index) {
      let that = this;
      that
        .$confirm(
          "这个是模版，所有继承它的维护任务也会被删除, \n是否确定?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
        .then(() => {
          let url =
            "http://47.102.214.37:8080/ops/schedule/" +
            that.taskData[index].taskID;
          axios.delete(url).then((res) => {
            if (res.status == 200) {
              that.taskData.splice(index, 1);
              this.$message({
                message: "删除成功",
                type: "success",
              });
            }
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
          .$confirm(
            "这个是模版，所有继承它的维护任务也会被删除, \n是否确定?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
          .then(() => {
            that.checkedDetail.forEach((element) => {
              that.taskData.forEach((e, i) => {
                if (element.taskID == e.taskID) {
                  console.log(i);
                  let url =
                    "http://47.102.214.37:8080/ops/schedule/" + e.taskID;
                  console.log(url);
                  axios.delete(url).then(() => {
                    that.taskData.splice(i, 1);
                    this.$message({
                      message: "删除成功",
                      type: "success",
                    });
                    that.tableData.splice(i, 1);
                    that.checkedDetail.pop();
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
    deleteTask(index) {
      let that = this;
      // console.log(that.taskData[index]);
      that
        .$confirm(
          "这个是模版，所有继承它的维护任务也会被删除, \n是否确定?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
        .then(() => {
          let url =
            "http://47.102.214.37:8080/ops/schedule/" +
            that.taskData[index].taskID;
          axios.delete(url).then((res) => {
            if (res.status == 200) {
              that.taskData.splice(index, 1);
              this.$message({
                message: "删除成功",
                type: "success",
              });
            }
          });
        })
        .catch(() => {
          that.$message.info("已取消删除");
        });
    },
    refresh() {
      let that = this;
      that.taskData = [];
      axios
        .get("http://47.102.214.37:8080/ops/schedule?page=0&size=100")
        .then((res) => {
          console.log(res.data);
          for (var i = 0; i < res.data.content.length; i++) {
            that.taskData.push({
              taskID: res.data.content[i].id,
              name: res.data.content[i].name,
            });
          }
          that.$message({
            message: "刷新成功",
            type: "success",
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
