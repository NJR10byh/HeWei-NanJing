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
      style="width:100%;"
      class="extraTable"
      @selection-change="handleDetailSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="id" label="用户ID" width="100"></el-table-column>
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
axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
export default {
  created: function() {
    let that = this;
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      console.log(res.data);
      that.userRole = res.data.role;
    });
    setTimeout(() => {
      axios.get("http://47.102.214.37:8080/user/query").then((res) => {
        that.total = res.data.content.length;
        for (let i = 0; i < res.data.content.length; i++) {
          if (res.data.content[i].role == "ROOT") {
            that.tableData.unshift({
              id: res.data.content[i].id,
              username: res.data.content[i].username,
              userrole: res.data.content[i].role,
              name: res.data.content[i].name,
              email: res.data.content[i].email,
            });
          } else if (res.data.content[i].role == "ADMIN") {
            that.tableData.push({
              id: res.data.content[i].id,
              username: res.data.content[i].username,
              userrole: res.data.content[i].role,
              name: res.data.content[i].name,
              email: res.data.content[i].email,
            });
          }
        }
        for (let i = 0; i < res.data.content.length; i++) {
          if (
            res.data.content[i].role != "ROOT" &&
            res.data.content[i].role != "ADMIN"
          ) {
            that.tableData.push({
              id: res.data.content[i].id,
              username: res.data.content[i].username,
              userrole: res.data.content[i].role,
              name: res.data.content[i].name,
              email: res.data.content[i].email,
            });
          }
        }
      });
    }, 200);
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
      // 搜索
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
      that.tableData = [];
      axios
        .get("http://47.102.214.37:8080/user/query")
        .then((res) => {
          console.log(res);
          that.total = res.data.content.length;
          for (let i = 0; i < res.data.content.length; i++) {
            if (res.data.content[i].role == "ROOT") {
              that.tableData.unshift({
                id: res.data.content[i].id,
                username: res.data.content[i].username,
                userrole: res.data.content[i].role,
                name: res.data.content[i].name,
                email: res.data.content[i].email,
              });
            } else if (res.data.content[i].role == "ADMIN") {
              that.tableData.push({
                id: res.data.content[i].id,
                username: res.data.content[i].username,
                userrole: res.data.content[i].role,
                name: res.data.content[i].name,
                email: res.data.content[i].email,
              });
            }
          }
          for (let i = 0; i < res.data.content.length; i++) {
            if (
              res.data.content[i].role != "ROOT" &&
              res.data.content[i].role != "ADMIN"
            ) {
              that.tableData.push({
                id: res.data.content[i].id,
                username: res.data.content[i].username,
                userrole: res.data.content[i].role,
                name: res.data.content[i].name,
                email: res.data.content[i].email,
              });
            }
          }
          that.$message({
            message: "列表已更新",
            type: "success",
          });
        })
        .catch((res) => {
          console.log(res.response);
          that.$message({
            message: "列表刷新失败",
            type: "error",
          });
        });
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
          let url =
            "http://47.102.214.37:8080/user/" + that.tableData[index].id;
          console.log(url);
          axios.delete(url).then(() => {
            that.tableData.splice(index, 1);
            that.total--;
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
              that.tableData.forEach((e, i) => {
                if (element.id == e.id) {
                  console.log(element, e, i);
                  let url = "http://47.102.214.37:8080/user/" + e.id;
                  console.log(url);
                  axios.delete(url).then(() => {
                    console.log(i);
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
    // 搜索
    search() {
      let that = this;
      console.log(that.username);
      console.log(that.name);
      console.log(that.email);
      let url =
        "http://47.102.214.37:8080/user/query?name==高凡&username==test-o";
      if (that.username == "" && that.name == "" && that.email == "") {
        that.$message({
          message: "请输入搜索条件",
          type: "warning",
        });
        return;
      } else if (that.username != "") {
        url = "http://47.102.214.37:8080/user/query?username==" + that.username;
        if (that.name != "") {
          url =
            "http://47.102.214.37:8080/user/query?username==" +
            that.username +
            "&name==" +
            that.name;
          if (that.email != "") {
            url =
              "http://47.102.214.37:8080/user/query?username==" +
              that.username +
              "&name==" +
              that.name +
              "&email==" +
              that.email;
          }
        } else if (that.name == "") {
          if (that.email != "") {
            url =
              "http://47.102.214.37:8080/user/query?username==" +
              that.username +
              "&email==" +
              that.email;
          }
        }
      } else if (that.username == "") {
        if (that.name != "") {
          url = "http://47.102.214.37:8080/user/query?name==" + that.name;
          if (that.email != "") {
            url =
              "http://47.102.214.37:8080/user/query?name==" +
              that.name +
              "&email==" +
              that.email;
          }
        } else if (that.name == "") {
          if (that.email != "") {
            url = "http://47.102.214.37:8080/user/query?email==" + that.email;
          }
        }
      }
      console.log(url);
      axios.get(url).then((res) => {
        console.log(res.data);
        that.tableData = [];
        that.total = res.data.content.length;
        for (let i = 0; i < res.data.content.length; i++) {
          that.tableData.unshift({
            id: res.data.content[i].id,
            username: res.data.content[i].username,
            userrole: res.data.content[i].role,
            name: res.data.content[i].name,
            email: res.data.content[i].email,
          });
        }
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
