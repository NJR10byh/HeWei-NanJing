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
        <div class="input">
          <el-input placeholder="用户名" v-model="username"></el-input>
        </div>
        <div class="input">
          <el-input placeholder="姓名" v-model="name"></el-input>
        </div>
        <div class="input">
          <el-input placeholder="邮箱" v-model="email"></el-input>
        </div>
        <div class="search">
          <el-button icon="el-icon-search" @click="search">搜索</el-button>
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
      style="width: 100%"
      class="extraTable"
      @selection-change="handleDetailSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="index" label="序号" width="60"></el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        width="150"
      ></el-table-column>
      <el-table-column prop="name" label="姓名" width="150"></el-table-column>
      <el-table-column prop="email" label="用户邮箱"></el-table-column>
      <el-table-column prop="userrole" label="用户权限"></el-table-column>
      <el-table-column
        prop="setting"
        label="操作"
        width="160"
        v-if="['ROOT', 'ADMIN'].includes(userRole)"
      >
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button
          >
          <el-button @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-if="!ifsearch">
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
  created: function () {
    let that = this;
    that.userRole = this.globaldata.userRole;
    setTimeout(() => {
      that.refresh();
    }, 300);
  },
  data() {
    return {
      userRole: "",
      tableData: [],
      checkedDetail: [],
      // 分页
      currentPage: 1, //  页面显示的当前页数
      page_size: 15, //  页面显示的每页显示条数
      page: 1, // 当前页数
      total: 0, // 总数
      // 搜索
      ifsearch: false,
      username: "",
      name: "",
      email: "",
    };
  },
  methods: {
    //单选框选中数据
    handleDetailSelectionChange(selection) {
      this.checkedDetail = selection;
    },
    // 刷新列表
    refresh() {
      let that = this;
      let index = 1;
      that.tableData = [];
      that.ifsearch = false;
      that.username = "";
      that.name = "";
      that.email = "";
      that.currentPage = 1;
      if (["ROOT", "ADMIN"].includes(that.userRole)) {
        let url = "user?page=0&size=" + that.page_size;
        this.request(url, {}, "GET")
          .then((res) => {
            console.log(res);
            that.total = res.data.totalElements;
            for (let i = 0; i < res.data.content.length; i++) {
              if (res.data.content[i].role == "ROOT") {
                let obj = {};
                obj.id = res.data.content[i].id;
                obj.index = index++;
                obj.username = res.data.content[i].username;
                obj.userrole = res.data.content[i].role;
                obj.name = res.data.content[i].name;
                obj.email = res.data.content[i].email;
                that.tableData.push(obj);
              } else if (res.data.content[i].role == "ADMIN") {
                let obj = {};
                obj.id = res.data.content[i].id;
                obj.index = index++;
                obj.username = res.data.content[i].username;
                obj.userrole = res.data.content[i].role;
                obj.name = res.data.content[i].name;
                obj.email = res.data.content[i].email;
                that.tableData.push(obj);
              }
            }
            for (let i = 0; i < res.data.content.length; i++) {
              if (
                res.data.content[i].role != "ROOT" &&
                res.data.content[i].role != "ADMIN"
              ) {
                let obj = {};
                obj.id = res.data.content[i].id;
                obj.index = index++;
                obj.username = res.data.content[i].username;
                obj.userrole = res.data.content[i].role;
                obj.name = res.data.content[i].name;
                obj.email = res.data.content[i].email;
                that.tableData.push(obj);
              }
            }
            that.$message({
              message: "列表已更新",
              type: "success",
            });
          })
          .catch((res) => {
            this.$message({
              message: res.response.data.message,
              type: "error",
            });
          });
      } else {
        this.request("user/query", {}, "GET")
          .then((res) => {
            console.log(res);
            that.total = res.data.totalElements;
            for (let i = 0; i < res.data.content.length; i++) {
              if (res.data.content[i].role == "ROOT") {
                let obj = {};
                obj.id = res.data.content[i].id;
                obj.index = index++;
                obj.username = res.data.content[i].username;
                obj.userrole = res.data.content[i].role;
                obj.name = res.data.content[i].name;
                obj.email = res.data.content[i].email;
                that.tableData.push(obj);
              } else if (res.data.content[i].role == "ADMIN") {
                let obj = {};
                obj.id = res.data.content[i].id;
                obj.index = index++;
                obj.username = res.data.content[i].username;
                obj.userrole = res.data.content[i].role;
                obj.name = res.data.content[i].name;
                obj.email = res.data.content[i].email;
                that.tableData.push(obj);
              }
            }
            for (let i = 0; i < res.data.content.length; i++) {
              if (
                res.data.content[i].role != "ROOT" &&
                res.data.content[i].role != "ADMIN"
              ) {
                let obj = {};
                obj.id = res.data.content[i].id;
                obj.index = index++;
                obj.username = res.data.content[i].username;
                obj.userrole = res.data.content[i].role;
                obj.name = res.data.content[i].name;
                obj.email = res.data.content[i].email;
                that.tableData.push(obj);
              }
            }
            that.$message({
              message: "列表已更新",
              type: "success",
            });
          })
          .catch((res) => {
            this.$message({
              message: res.response.data.message,
              type: "error",
            });
          });
      }
    },
    // 编辑员工信息
    handleEdit(index) {
      console.log(this.tableData[index]);
      this.$router.push({
        path: "/edituser",
        query: this.tableData[index],
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
          let url = "user/" + that.tableData[index].id;
          console.log(url);
          this.request(url, {}, "DELETE")
            .then(() => {
              that.tableData.splice(index, 1);
              that.total--;
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
              that.tableData.forEach((e, i) => {
                if (element.id == e.id) {
                  console.log(element, e, i);
                  let url = "user/" + e.id;
                  this.request(url, {}, "DELETE")
                    .then(() => {
                      this.$message({
                        message: "删除成功",
                        type: "success",
                      });
                      that.tableData.splice(i, 1);
                      that.checkedDetail.pop();
                      that.total--;
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
    // 表格方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let that = this;
      let index = 1;
      that.tableData = [];
      that.currentPage = 1;
      console.log(val);
      that.page_size = val;
      let url = "user?page=0&size=" + that.page_size;
      this.request(url, {}, "GET")
        .then((res) => {
          that.total = res.data.totalElements;
          for (let i = 0; i < res.data.content.length; i++) {
            if (res.data.content[i].role == "ROOT") {
              let obj = {};
              obj.id = res.data.content[i].id;
              obj.index = index++;
              obj.username = res.data.content[i].username;
              obj.userrole = res.data.content[i].role;
              obj.name = res.data.content[i].name;
              obj.email = res.data.content[i].email;
              that.tableData.push(obj);
            } else if (res.data.content[i].role == "ADMIN") {
              let obj = {};
              obj.id = res.data.content[i].id;
              obj.index = index++;
              obj.username = res.data.content[i].username;
              obj.userrole = res.data.content[i].role;
              obj.name = res.data.content[i].name;
              obj.email = res.data.content[i].email;
              that.tableData.push(obj);
            }
          }
          for (let i = 0; i < res.data.content.length; i++) {
            if (
              res.data.content[i].role != "ROOT" &&
              res.data.content[i].role != "ADMIN"
            ) {
              let obj = {};
              obj.id = res.data.content[i].id;
              obj.index = index++;
              obj.username = res.data.content[i].username;
              obj.userrole = res.data.content[i].role;
              obj.name = res.data.content[i].name;
              obj.email = res.data.content[i].email;
              that.tableData.push(obj);
            }
          }
          that.$message({
            message: "列表已更新",
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
      let index = 1;
      that.tableData = [];
      that.page = val;
      that.currentPage = val;
      console.log(val);
      let url = "user?page=" + (that.page - 1) + "&size=" + that.page_size;
      this.request(url, {}, "GET")
        .then((res) => {
          that.total = res.data.totalElements;
          for (let i = 0; i < res.data.content.length; i++) {
            if (res.data.content[i].role == "ROOT") {
              let obj = {};
              obj.id = res.data.content[i].id;
              obj.index = index++;
              obj.username = res.data.content[i].username;
              obj.userrole = res.data.content[i].role;
              obj.name = res.data.content[i].name;
              obj.email = res.data.content[i].email;
              that.tableData.push(obj);
            } else if (res.data.content[i].role == "ADMIN") {
              let obj = {};
              obj.id = res.data.content[i].id;
              obj.index = index++;
              obj.username = res.data.content[i].username;
              obj.userrole = res.data.content[i].role;
              obj.name = res.data.content[i].name;
              obj.email = res.data.content[i].email;
              that.tableData.push(obj);
            }
          }
          for (let i = 0; i < res.data.content.length; i++) {
            if (
              res.data.content[i].role != "ROOT" &&
              res.data.content[i].role != "ADMIN"
            ) {
              let obj = {};
              obj.id = res.data.content[i].id;
              obj.index = index++;
              obj.username = res.data.content[i].username;
              obj.userrole = res.data.content[i].role;
              obj.name = res.data.content[i].name;
              obj.email = res.data.content[i].email;
              that.tableData.push(obj);
            }
          }
          that.$message({
            message: "列表已更新",
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
    // 搜索
    search() {
      let that = this;
      let index = 1;
      that.ifsearch = true;
      let url = "";
      if (that.username == "" && that.name == "" && that.email == "") {
        that.$message({
          message: "请输入搜索条件",
          type: "warning",
        });
        return;
      } else if (that.username != "") {
        url = "user/query?username=L" + that.username;
        if (that.name != "") {
          url = "user/query?username=L" + that.username + "&name=L" + that.name;
          if (that.email != "") {
            url =
              "user/query?username=L" +
              that.username +
              "&name=L" +
              that.name +
              "&email==" +
              that.email;
          }
        } else if (that.name == "") {
          if (that.email != "") {
            url =
              "user/query?username=L" + that.username + "&email==" + that.email;
          }
        }
      } else if (that.username == "") {
        if (that.name != "") {
          url = "user/query?name=L" + that.name;
          if (that.email != "") {
            url = "user/query?name=L" + that.name + "&email==" + that.email;
          }
        } else if (that.name == "") {
          if (that.email != "") {
            url = "user/query?email==" + that.email;
          }
        }
      }
      console.log(url);
      this.request(url, {}, "GET")
        .then((res) => {
          console.log(res.data);
          that.tableData = [];
          that.total = res.data.content.length;
          if (res.data.content.length == 0) {
            this.$message({
              message: "未找到结果",
              type: "warning",
            });
          } else {
            for (let i = 0; i < res.data.content.length; i++) {
              let obj = {};
              obj.id = res.data.content[i].id;
              obj.index = index++;
              obj.username = res.data.content[i].username;
              obj.userrole = res.data.content[i].role;
              obj.name = res.data.content[i].name;
              obj.email = res.data.content[i].email;
              that.tableData.push(obj);
            }
          }
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
