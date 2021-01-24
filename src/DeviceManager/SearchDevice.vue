<template>
  <div class="main">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb-Top" separator="/">
      <el-breadcrumb-item class="pathActive">设备管理</el-breadcrumb-item>
      <el-breadcrumb-item class="active">查询设备</el-breadcrumb-item>
    </el-breadcrumb>
    <el-main class="main-con" style="width:100%;">
      <!-- 搜索 -->
      <div class="topsearch">
        <div class="Cascader">
          <el-cascader
            placeholder="试试搜索：Apple"
            :options="options"
            :props="{ multiple: true }"
            filterable
            clearable
            @change="change"
          ></el-cascader>
        </div>
        <div class="searchbtn">
          <el-button type="primary" icon="el-icon-search" @click="SearchDevice"
            >搜索</el-button
          >
        </div>
      </div>
      <!-- table -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        stripe
        class="table"
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
          :current-page="currentPage4"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="sizes,total, prev, pager, next, jumper"
          :total="159"
        ></el-pagination>
      </div>
    </el-main>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      formInline: {
        person: "",
        model: "",
      },
      radiomodel: {
        model: 1,
      },
      // 级联选择
      options: [
        {
          value: "name",
          label: "设备名称",
          children: [],
        },
        {
          value: "brand",
          label: "设备品牌",
          children: [],
        },
        {
          value: "type",
          label: "设备型号/规格",
          children: [],
        },
        {
          value: "clazz",
          label: "设备分类",
          children: [],
        },
      ],
      // 选择框
      checkedDetail: [],
      // 可选表头数据
      tableHead: [],
      // 表格数据
      tableData: [],
      // 分页
      currentPage4: 1,
    };
  },
  methods: {
    // 搜索类别
    change(res) {
      let that = this;
      console.log(res);
      that.tableData = [];
      for (var i = 0; i < res.length; i++) {
        if (res[i][0] == "name") {
          console.log(res[i][1]);
          let url = "http://47.102.214.37:8080/device/query?name==" + res[i][1];
          axios.get(url).then((res) => {
            console.log(res.data.content[0]);
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
        }
        if (res[i][0] == "brand") {
          console.log(res[i][1]);
          let url =
            "http://47.102.214.37:8080/device/query?brand==" + res[i][1];
          axios.get(url).then((res) => {
            console.log(res.data);
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
        }
        if (res[i][0] == "type") {
          console.log(res[i][1]);
          let url = "http://47.102.214.37:8080/device/query?type==" + res[i][1];
          axios.get(url).then((res) => {
            console.log(res.data);
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
        }
        if (res[i][0] == "clazz") {
          console.log(res[i][1]);
          let url =
            "http://47.102.214.37:8080/device/query?clazz==" + res[i][1];
          axios.get(url).then((res) => {
            console.log(res.data);
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
        }
      }
    },
    SearchDevice() {
      console.log("aa");
    },
    //单选框选中数据
    handleDetailSelectionChange(selection) {
      this.checkedDetail = selection;
    },
    // 编辑
    handleEdit(index, row) {
      console.log(index, row);
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
  },
  created() {
    let that = this;
    // 获取所有附加字段
    axios.get("http://47.102.214.37:8080/device/info-field").then((res) => {
      // console.log(res.data);
      for (var i = 0; i < res.data.length; i++) {
        let obj = {};
        obj.lable = res.data[i].name;
        obj.width = "100";
        obj.prop = "new" + res.data[i].id;
        that.tableHead.push(obj);
      }
    });
    // 设备名称
    axios.get("http://47.102.214.37:8080/device/keys/name").then((res) => {
      // console.log(res.data);
      for (var i = 0; i < res.data.length; i++) {
        // console.log(that.options[0]);
        let obj = {};
        obj.value = res.data[i];
        obj.label = res.data[i];
        that.options[0].children.push(obj);
      }
    });
    // 设备品牌
    axios.get("http://47.102.214.37:8080/device/keys/brand").then((res) => {
      // console.log(res.data);
      for (var i = 0; i < res.data.length; i++) {
        let obj = {};
        obj.value = res.data[i];
        obj.label = res.data[i];
        that.options[1].children.push(obj);
      }
    });
    // 设备型号/规格
    axios.get("http://47.102.214.37:8080/device/keys/type").then((res) => {
      // console.log(res.data);
      for (var i = 0; i < res.data.length; i++) {
        let obj = {};
        obj.value = res.data[i];
        obj.label = res.data[i];
        that.options[2].children.push(obj);
      }
    });
    // // 设备编号
    // axios.get("http://47.102.214.37:8080/device/keys/deviceNo").then((res) => {
    //   console.log(res.data);
    //   for (var i = 0; i < res.data.length; i++) {
    //     let obj = {};
    //     obj.value = res.data[i];
    //     obj.label = res.data[i];
    //     that.options[3].children.push(obj);
    //   }
    // });
    // 设备分类
    axios.get("http://47.102.214.37:8080/device/keys/clazz").then((res) => {
      // console.log(res.data);
      for (var i = 0; i < res.data.length; i++) {
        let obj = {};
        obj.value = res.data[i];
        obj.label = res.data[i];
        that.options[3].children.push(obj);
      }
    });
    console.log("Created");
  },
};
</script>
<style lang="scss">
.v-modal {
  opacity: 0;
}
.main {
  height: 100%;
  // border: 1px solid red;
  .breadcrumb-Top {
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
  .topsearch {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 5px;
    padding-bottom: 10px;
    // border: 1px solid red;
    .searchbtn {
      .el-button {
        width: 80px;
        height: 35px;
        text-align: center;
        padding: 0 10px;
        background: linear-gradient(-270deg, #6eb5fc, #409eff);
        border-radius: 5px;
        margin-left: 20px;
        font-size: 15px;
        border: none;
      }
    }
  }
}
.table {
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
</style>
<style lang="scss" scoped>
.main-con {
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
