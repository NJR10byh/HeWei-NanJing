<template>
  <div class="main">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb-top" separator="/">
      <el-breadcrumb-item class="pathActive">设备管理</el-breadcrumb-item>
      <el-breadcrumb-item class="active">设备信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-main class="Main-box" style="width:100%">
      <!-- 搜索 -->
      <div class="head-btn">
        <div class="oper-btns-left">
          <el-button
            class="Add-btn"
            icon="el-icon-refresh"
            @click="refreshDevice"
            >刷新列表</el-button
          >
        </div>
        <div class="oper-btns-right">
          <el-button class="bigdel-btn" icon="el-icon-delete" @click="delectAll"
            >批量删除</el-button
          >
          <el-button class="clear-btn" icon="el-icon-delete" @click="Clear"
            >清空</el-button
          >
        </div>
      </div>
      <!-- table -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        stripe
        class="Table"
        style="width: 100%;"
        height="calc(100% - 100px)"
        @selection-change="handleDetailSelectionChange"
      >
        <el-table-column type="expand" width="25">
          <template slot-scope="props">
            <el-form label-position="left" inline class="Demo-table-expand">
              关键信息:
              <el-form-item label="设备名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="设备品牌">
                <span>{{ props.row.brand }}</span>
              </el-form-item>
              <el-form-item label="设备型号/规格">
                <span>{{ props.row.type }}</span>
              </el-form-item>
              <el-form-item label="设备编号">
                <span>{{ props.row.deviceNo }}</span>
              </el-form-item>
              <el-form-item label="是否为关键设备">
                <span>{{ props.row.crux }}</span>
              </el-form-item>
              <el-form-item label="设备分类">
                <span>{{ props.row.clazz }}</span>
              </el-form-item>
              <el-form-item label="维护保养标准编号">
                <span>{{ props.row.fixnumber }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column prop="id" label="ID" width="40"></el-table-column>
        <el-table-column
          prop="name"
          label="设备名称"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="brand"
          label="设备品牌"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="type"
          label="设备型号/规格"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="deviceNo"
          label="设备编号"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="crux"
          label="是否为关键设备"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="clazz"
          label="设备分类"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="fixnumber"
          label="维护保养标准编号"
          width="160"
        ></el-table-column>
        <template v-for="(item, index) in tableHead">
          <el-table-column
            :prop="item.prop"
            :label="item.lable"
            :key="index"
            :width="item.width"
          ></el-table-column>
        </template>
        <el-table-column prop="setting" label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip content="修改" effect="light" :enterable="false">
              <el-button
                class="edit-btn"
                icon="iconfont icon-bianji"
                @click="handleEdit(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" :enterable="false">
              <el-button
                class="del-btn"
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
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="sizes,total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-main>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "DeviceInformation",
  components: {},
  data() {
    return {
      //选择框
      checkedDetail: [],
      // 可选表头数据
      tableHead: [],
      // 表格数据
      tableData: [],
      multipleSelection: [],
      // 分页
      currentPage: 1,
      page: 1,
      size: 10,
      total: 0,
    };
  },
  methods: {
    // id排序
    sortid() {
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i];
        element.id = i + 1;
      }
    },
    // 搜索
    //单选框选中数据
    handleDetailSelectionChange(selection) {
      this.checkedDetail = selection;
    },
    // 刷新
    refreshDevice() {
      let that = this;
      axios({
        method: "GET",
        url: "http://47.102.214.37:8080/device?page=0&size=10",
      })
        .then((res) => {
          that.tableData = [];
          that.currentPage = 1;
          for (var i = 0; i < res.data.content.length; i++) {
            let obj = {};
            obj.id = res.data.content[i].id;
            obj.name = res.data.content[i].name;
            obj["brand"] = res.data.content[i].brand;
            obj.type = res.data.content[i].type;
            obj.deviceNo = res.data.content[i].deviceNo;
            if (res.data.content[i].extra.length != 0) {
              for (var j = 0; j < res.data.content[i].extra.length; j++) {
                obj[res.data.content[i].extra[j].field.id] =
                  res.data.content[i].extra[j].value;
              }
            }
            if (res.data.content[i].crux == true) {
              obj.crux = "Y";
            } else if (res.data.content[i].crux == false) {
              obj.crux = "N";
            }
            obj.clazz = res.data.content[i].clazz;
            that.tableData.push(obj);
          }
          this.$message({
            message: "设备信息已更新",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 编辑
    handleEdit(index, row) {
      // console.log(index, row);
      let obj = {};
      obj.id = row.id;
      obj.name = row.name;
      obj.brand = row.brand;
      obj.type = row.type;
      obj.deviceNo = row.deviceNo;
      obj.crux = row.crux;
      obj.clazz = row.clazz;
      console.log(obj);
      // this.$router.path({
      //   path: "/editDevice",
      // });
      this.$router.push({
        path: "/editDevice",
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
            "http://47.102.214.37:8080/device/" + that.tableData[index].id;
          axios.delete(url).then((res) => {
            if (res.data.message == "ok") {
              this.refreshDevice();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 批量删除
    delectAll() {
      let that = this;
      if (this.checkedDetail.length == 0) {
        that.$alert("请先选择要删除的数据", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        that
          .$confirm("删除后无法更改, 是否确定?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            that.checkedDetail.forEach((element) => {
              that.tableData.forEach((e, i) => {
                if (element.id == e.id) {
                  console.log(that.tableData[i]);
                  let url =
                    "http://47.102.214.37:8080/device/" + that.tableData[i].id;
                  // console.log(url);
                  axios.delete(url).then((res) => {
                    if (res.data.message == "ok") {
                      // that.tableData.splice(i, 1);
                      that.refreshDevice();
                    }
                  });
                }
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
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
        "http://47.102.214.37:8080/device?page=0" + "&size=" + that.size;
      console.log(url);
      axios.get(url).then((res) => {
        console.log(res.data);
        that.tableData = [];
        for (var i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.id = res.data.content[i].id;
          obj.name = res.data.content[i].name;
          obj["brand"] = res.data.content[i].brand;
          obj.type = res.data.content[i].type;
          obj.deviceNo = res.data.content[i].deviceNo;
          if (res.data.content[i].extra.length != 0) {
            for (var j = 0; j < res.data.content[i].extra.length; j++) {
              obj[res.data.content[i].extra[j].field.id] =
                res.data.content[i].extra[j].value;
            }
          }
          if (res.data.content[i].crux == true) {
            obj.crux = "Y";
          } else if (res.data.content[i].crux == false) {
            obj.crux = "N";
          }
          obj.clazz = res.data.content[i].clazz;
          that.tableData.push(obj);
        }
      });
    },
    // 页变化
    handleCurrentChange(val) {
      let that = this;
      that.page = val;
      that.currentPage = val;
      let url =
        "http://47.102.214.37:8080/device?page=" +
        (that.page - 1) +
        "&size=" +
        that.size;
      console.log(url);
      axios.get(url).then((res) => {
        console.log(res.data);
        that.tableData = [];
        for (var i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.id = res.data.content[i].id;
          obj.name = res.data.content[i].name;
          obj["brand"] = res.data.content[i].brand;
          obj.type = res.data.content[i].type;
          obj.deviceNo = res.data.content[i].deviceNo;
          if (res.data.content[i].extra.length != 0) {
            for (var j = 0; j < res.data.content[i].extra.length; j++) {
              obj[res.data.content[i].extra[j].field.id] =
                res.data.content[i].extra[j].value;
            }
          }
          if (res.data.content[i].crux == true) {
            obj.crux = "Y";
          } else if (res.data.content[i].crux == false) {
            obj.crux = "N";
          }
          obj.clazz = res.data.content[i].clazz;
          that.tableData.push(obj);
        }
      });
    },
    //清空List
    Clear() {
      this.$confirm("清空后无法恢复, 是否确定?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableData = undefined;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  created: function() {
    let that = this;
    console.log("Created");
    // 获取所有附加字段
    axios.get("http://47.102.214.37:8080/device/info-field").then((res) => {
      console.log(res.data);
      for (var i = 0; i < res.data.length; i++) {
        let obj = {};
        obj.lable = res.data[i].name;
        obj.width = "100";
        obj.prop = res.data[i].id;
        that.tableHead.push(obj);
      }
    });
    // 获取所有设备
    axios.get("http://47.102.214.37:8080/device?page=0&size=10").then((res) => {
      console.log(res.data);
      that.total = res.data.totalElements;
      for (var i = 0; i < res.data.content.length; i++) {
        let obj = {};
        obj.id = res.data.content[i].id;
        obj.name = res.data.content[i].name;
        obj["brand"] = res.data.content[i].brand;
        obj.type = res.data.content[i].type;
        obj.deviceNo = res.data.content[i].deviceNo;
        if (res.data.content[i].extra.length != 0) {
          for (var j = 0; j < res.data.content[i].extra.length; j++) {
            obj[res.data.content[i].extra[j].field.id] =
              res.data.content[i].extra[j].value;
          }
        }
        if (res.data.content[i].crux == true) {
          obj.crux = "Y";
        } else if (res.data.content[i].crux == false) {
          obj.crux = "N";
        }
        obj.clazz = res.data.content[i].clazz;
        that.tableData.push(obj);
      }
    });
  },
};
</script>
<style lang="scss">
.v-modal {
  opacity: 0;
}
.main {
  height: 100%;
  .breadcrumb-top {
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    margin-top: 10px;
    font-size: 16px;
    padding: 5px 10px;
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
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px 0;
    .oper-btns-left {
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
    .oper-btns-right {
      display: flex;
      justify-content: flex-start;
      margin-right: 10px;
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
        &.clear-btn {
          width: 65px;
          border: 1px solid #f96b6c;
          color: #f96b6c;
          margin-left: 10px;
        }
        &.clear-btn:hover {
          background: #ffcccc;
        }
      }
    }
  }
}
.Table {
  height: calc(100% - 100px);
  &::before {
    display: none;
  }
  .el-table__header {
    border-left: 1px solid #e9ecf2;
    border-top: 1px solid #e9ecf2;
    th {
      text-align: center;
      background-color: #fafafa;
      border-right: 1px solid #e9ecf2;
      &:first-child {
        border-right: none;
      }
      &:nth-child(2) {
        // border: 1px solid red;
        border-right: none;
        .cell {
          padding-right: 0;
        }
      }
      &:nth-child(3) {
        .cell {
          padding-left: 0;
        }
      }
      .cell {
        padding: 0 20px;
        font-size: 14px;
      }
    }
  }
  .el-checkbox__inner {
    width: 16px;
    height: 16px;
    background: #ffffff;
    border: 1px solid #dddddd;
    border-radius: 4px;
  }
  .el-checkbox__inner::after {
    left: 5px;
  }
  .Demo-table-expand {
    // border: 1px solid red;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 0;
    padding: 0;
    label {
      width: 130px;
      color: #99a9bf;
    }
    .el-form-item {
      // border: 1px solid red;
      height: 35px;
      margin-bottom: 0;
    }
  }
  .el-table__body {
    td {
      text-align: center;
      border-bottom: none;
      &:nth-child(2) {
        border-right: none;
        .cell {
          padding-right: 0;
          overflow: auto;
        }
      }
      &:nth-child(3) {
        .cell {
          padding-left: 0;
        }
      }
      .cell {
        padding: 0 20px;
        color: #444444;
      }
    }
    .el-button {
      border: none;
      padding: 3px;
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
// 新增设备弹窗
.addDevice {
  .el-dialog {
    max-width: 500px;
    box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    .el-dialog__header {
      background: linear-gradient(-270deg, #6eb5fc, #409eff);
      border-radius: 6px 6px 0px 0px;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-dialog__title {
        color: #fff;
        font-size: 18px;
      }
      .el-dialog__headerbtn {
        &:hover {
          .el-dialog__close {
            color: #fff;
          }
        }
        .el-icon-close {
          color: #ccc;
          font-size: 18px;
        }
      }
    }
  }
  .el-form-item {
    // border: 1px solid red;
    margin-bottom: 20px;
  }
  .submitbtn {
    display: flex;
    justify-content: center;
    .sub-btn {
      width: 100px;
      background: linear-gradient(-270deg, #6eb5fc, #409eff);
      padding: 10px;
      font-size: 15px;
      border-radius: 5px;
      // border: none;
      &:hover {
        opacity: 0.9;
      }
    }
  }
}
// 新增信息弹窗
.addInfo {
  .el-dialog {
    max-width: 500px;
    box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    .el-dialog__header {
      background: linear-gradient(-270deg, #6eb5fc, #409eff);
      border-radius: 6px 6px 0px 0px;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-dialog__title {
        color: #fff;
        font-size: 18px;
      }
      .el-dialog__headerbtn {
        &:hover {
          .el-dialog__close {
            color: #fff;
          }
        }
        .el-icon-close {
          color: #ccc;
          font-size: 18px;
        }
      }
    }
    .submitbtn {
      display: flex;
      justify-content: center;
      .el-button {
        width: 100px;
        background: linear-gradient(-270deg, #6eb5fc, #409eff);
        padding: 10px;
        font-size: 15px;
        border-radius: 5px;
        // border: none;
        &:hover {
          opacity: 0.9;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.Main-box {
  height: calc(100% - 60px);
  background: #fff;
  .el-pagination {
    text-align: center;
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>
