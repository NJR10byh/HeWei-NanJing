<template>
  <div class="Container-Register">
    <!-- 搜索 -->
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
      :data="tableData"
      stripe
      border
      style="width:100%;"
      class="extraTable"
      @selection-change="handleDetailSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="id" label="任务ID" width="100"></el-table-column>
      <el-table-column prop="name" label="任务名称"></el-table-column>
      <el-table-column prop="nextDate" label="下次保养时间"></el-table-column>
      <el-table-column prop="deadline" label="剩余天数"></el-table-column>
      <el-table-column
        prop="taskuser"
        label="保养人员"
        v-if="['ROOT', 'ADMIN'].includes(userRole)"
      ></el-table-column>
      <el-table-column
        prop="setting"
        label="操作"
        width="200"
        v-if="['ROOT', 'ADMIN'].includes(userRole)"
      >
        <template slot-scope="scope">
          <el-button @click="handleDetail(scope.$index, scope.row)"
            >详情</el-button
          >
          <el-button @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button
          >
          <el-button @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="setting" label="操作" width="160" v-else>
        <template slot-scope="scope">
          <el-button @click="handleDetail(scope.$index, scope.row)"
            >查看任务详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="sizes,total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div> -->
  </div>
</template>
<script>
import axios from "axios";
export default {
  created: function() {
    let that = this;
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      console.log(res.data);
      that.userRole = res.data.role;
    });
    axios
      .get("http://47.102.214.37:8080/ops/schedule?page=0&size=100")
      .then((res) => {
        for (let i = 0; i < res.data.content.length; i++) {
          if (["ROOT", "ADMIN"].includes(that.userRole)) {
            let obj = {};
            obj.id = res.data.content[i].id;
            obj.name = res.data.content[i].name;
            let url =
              "http://47.102.214.37:8080/user/" + res.data.content[i].ops[0].id;
            axios.get(url).then((res) => {
              obj.taskuser = res.data.name + " ( ID：" + res.data.id + " )";
            });
            setTimeout(() => {
              let URL =
                "http://47.102.214.37:8080/ops/schedule/status/" +
                res.data.content[i].id;
              axios.get(URL).then((res) => {
                if (res.data.nextDate == null) {
                  obj.nextDate = "暂无";
                } else {
                  obj.nextDate = res.data.nextDate;
                }
                if (res.data.nextDateDay == null) {
                  obj.deadline = "暂无";
                } else {
                  obj.deadline = res.data.nextDateDay;
                }
              });
              setTimeout(() => {
                that.tableData.push(obj);
                console.log(that.tableData);
              }, 200);
            }, 200);
          } else {
            let URL =
              "http://47.102.214.37:8080/ops/schedule/status/" +
              res.data.content[i].id;
            axios.get(URL).then((res) => {
              console.log(res.data);
              that.nextDate = res.data.nextDate;
              that.deadline = res.data.nextDateDay;
            });
            that.tableData.push({
              id: res.data.content[i].id,
              name: res.data.content[i].name,
              nextDate: that.nextDate,
              deadline: that.deadline,
            });
          }
        }
      });
  },
  data() {
    return {
      userRole: "",
      tableData: [],
      checkedDetail: [],
      // 分页
      currentPage: 1,
      page: 1,
      size: 10,
      total: 0,
    };
  },
  methods: {
    //单选框选中数据
    handleDetailSelectionChange(selection) {
      this.checkedDetail = selection;
      console.log(this.checkedDetail);
    },
    // 刷新列表
    refresh() {
      let that = this;
      let taskuser = "";
      that.tableData = [];
      axios
        .get("http://47.102.214.37:8080/ops/schedule?page=0&size=100")
        .then((res) => {
          for (let i = 0; i < res.data.content.length; i++) {
            if (["ROOT", "ADMIN"].includes(that.userRole)) {
              let url =
                "http://47.102.214.37:8080/user/" +
                res.data.content[i].ops[0].id;
              axios.get(url).then((res) => {
                taskuser = res.data.name + " ( ID：" + res.data.id + " )";
              });
              setTimeout(() => {
                that.tableData.push({
                  id: res.data.content[i].id,
                  name: res.data.content[i].name,
                  taskuser: taskuser,
                });
              }, 200);
            } else {
              that.tableData.push({
                id: res.data.content[i].id,
                name: res.data.content[i].name,
              });
            }
          }
          that.$message({
            message: "刷新成功",
            type: "success",
          });
        });
    },
    // 任务详情
    handleDetail(index) {
      console.log(this.tableData[index]);
      this.$router.push({
        path: "/taskDetailInfo",
        query: this.tableData[index],
      });
    },
    // 修改任务
    handleEdit(index) {
      console.log(this.tableData[index]);
      let obj = {};
      obj.taskID = this.tableData[index].id;
      this.$router.push({
        path: "/editTask",
        query: obj,
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
          .$confirm("此用户将被永久删除, \n是否确定?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            that.checkedDetail.forEach((element) => {
              that.tableData.forEach((e, i) => {
                if (element.id == e.id) {
                  console.log(element, e, i);
                  let url = "http://47.102.214.37:8080/ops/schedule/" + e.id;
                  axios.delete(url).then(() => {
                    this.$message({
                      message: "删除成功",
                      type: "success",
                    });
                    that.tableData.splice(i, 1);
                    that.checkedDetail.pop();
                    that.total--;
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
    // // 表格方法
    // handleSizeChange(val) {
    //   // console.log(`每页 ${val} 条`);
    //   let that = this;
    //   console.log(val);
    //   that.size = val;
    //   let url =
    //     "http://47.102.214.37:8080/device?page=0" + "&size=" + that.size;
    //   console.log(url);
    //   axios.get(url).then((res) => {
    //     console.log(res.data);
    //     that.tableData = [];
    //     for (var i = 0; i < res.data.content.length; i++) {
    //       let obj = {};
    //       obj.id = res.data.content[i].id;
    //       obj.name = res.data.content[i].name;
    //       obj["brand"] = res.data.content[i].brand;
    //       obj.type = res.data.content[i].type;
    //       obj.deviceNo = res.data.content[i].deviceNo;
    //       if (res.data.content[i].extra.length != 0) {
    //         for (var j = 0; j < res.data.content[i].extra.length; j++) {
    //           obj[res.data.content[i].extra[j].field.id] =
    //             res.data.content[i].extra[j].value;
    //         }
    //       }
    //       if (res.data.content[i].crux == true) {
    //         obj.crux = "Y";
    //       } else if (res.data.content[i].crux == false) {
    //         obj.crux = "N";
    //       }
    //       obj.clazz = res.data.content[i].clazz;
    //       that.tableData.push(obj);
    //     }
    //   });
    // },
    // // 页变化
    // handleCurrentChange(val) {
    //   let that = this;
    //   that.page = val;
    //   that.currentPage = val;
    //   console.log(val);
    //   let url =
    //     "http://47.102.214.37:8080/device?page=" +
    //     (that.page - 1) +
    //     "&size=" +
    //     that.size;
    //   axios.get(url).then((res) => {
    //     // console.log(res.data);
    //     that.tableData = [];
    //     for (var i = 0; i < res.data.content.length; i++) {
    //       let obj = {};
    //       obj.id = res.data.content[i].id;
    //       obj.name = res.data.content[i].name;
    //       obj["brand"] = res.data.content[i].brand;
    //       obj.type = res.data.content[i].type;
    //       obj.deviceNo = res.data.content[i].deviceNo;
    //       if (res.data.content[i].extra.length != 0) {
    //         for (var j = 0; j < res.data.content[i].extra.length; j++) {
    //           obj[res.data.content[i].extra[j].field.id] =
    //             res.data.content[i].extra[j].value;
    //         }
    //       }
    //       if (res.data.content[i].crux == true) {
    //         obj.crux = "Y";
    //       } else if (res.data.content[i].crux == false) {
    //         obj.crux = "N";
    //       }
    //       obj.clazz = res.data.content[i].clazz;
    //       that.tableData.push(obj);
    //     }
    //   });
    // },
  },
};
</script>
<style lang="scss">
.Container-Register {
  width: 100%;
  padding: 10px 0;
  // border: 1px solid red;
  display: flex;
  flex-direction: column;
  align-items: center;
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
