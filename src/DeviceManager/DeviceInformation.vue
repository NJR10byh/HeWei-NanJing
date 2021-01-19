<template>
  <div class="main">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备管理</el-breadcrumb-item>
      <el-breadcrumb-item class="active">设备信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-main class="main-con">
      <!-- 搜索 -->
      <div class="header-search">
        <div class="oper-btns">
          <el-button
            class="Add-btn"
            icon="el-icon-circle-plus-outline"
            @click="addDevice = true"
            >新增设备
          </el-button>
          <el-button
            class="Add-btn"
            icon="el-icon-circle-plus-outline"
            @click="addInformation = true"
            >新增信息</el-button
          >
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
        class="man-table"
        style="width: 100%;height:80%"
        @selection-change="handleDetailSelectionChange"
      >
        <el-table-column fixed type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="设备名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="设备品牌">
                <span>{{ props.row.brand }}</span>
              </el-form-item>
              <el-form-item label="设备型号/规格">
                <span>{{ props.row.model }}</span>
              </el-form-item>
              <el-form-item label="设备编号">
                <span>{{ props.row.number }}</span>
              </el-form-item>
              <el-form-item label="是否为关键设备">
                <span>{{ props.row.keydevice }}</span>
              </el-form-item>
              <el-form-item label="设备分类">
                <span>{{ props.row.kind }}</span>
              </el-form-item>
              <el-form-item label="维护保养标准编号">
                <span>{{ props.row.fixnumber }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column fixed type="selection" width="40"></el-table-column>
        <el-table-column
          fixed
          prop="id"
          label="ID"
          width="40"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="设备名称"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="brand"
          label="设备品牌"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="type"
          label="设备型号/规格"
          width="140"
        ></el-table-column>
        <el-table-column
          prop="deviceNo"
          label="设备编号"
          width="130"
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
        <el-table-column fixed="right" prop="setting" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              class="edit-btn"
              icon="iconfont icon-bianji"
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>
            <el-button
              class="del-btn"
              icon="iconfont icon-shanchu"
              @click="handleDelete(scope.$index, scope.row)"
            ></el-button>
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
      <!-- 新增设备弹窗 -->
      <el-dialog
        title="新增设备"
        class="addDeviceDialog"
        :visible.sync="addDevice"
        :center="true"
      >
        <el-form :model="form" :rules="rules" ref="form" label-position="left">
          <el-form-item
            label="设备名称: "
            prop="name"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.name"
              placeholder="请输入设备号"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="设备品牌: "
            prop="brand"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.brand" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="设备型号/规格: "
            prop="type"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.type" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="设备编号: "
            prop="deviceNo"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.deviceNo" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="是否为关键设备: "
            prop="crux"
            :label-width="formLabelWidth"
          >
            <el-radio-group v-model="form.crux">
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="设备分类: "
            prop="clazz"
            :label-width="formLabelWidth"
          >
            <el-select v-model="form.clazz" placeholder="请选择设备类型">
              <el-option label="电器" value="电器"></el-option>
              <el-option label="机械" value="机械"></el-option>
              <el-option label="测量" value="测量"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="维护保养标准标号: "
            prop="fixnumber"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.fixnumber" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="submitbtn">
          <el-button class="sub-btn" type="primary" @click="submitForm(form)"
            >保存并提交</el-button
          >
        </div>
      </el-dialog>
      <!-- 新增信息弹窗 -->
      <el-dialog
        title="新增信息"
        class="addDeviceDialog"
        :visible.sync="addInformation"
      >
        尚未开发完成
      </el-dialog>
    </el-main>
  </div>
</template>

<script>
// import axios from "axios";
export default {
  name: "DeviceInformation",
  components: {},
  data() {
    return {
      //选择框
      checkedDetail: [],
      // 可选表头数据
      tableHead: [
        {
          prop: "test",
          lable: "啦啦啦",
          width: "100",
        },
      ],
      // 表格数据
      tableData: [
        {
          id: "1",
          name: "显示屏",
          brand: "小米",
          type: "65寸",
          deviceNo: "HW-NJ-E-001",
          crux: "N",
          clazz: "电器",
          fixnumber: "PM-E-001-D",
          test: "aaa",
        },
        {
          id: "2",
          name: "笔记本电脑",
          brand: "Dell",
          type: "灵越5000fit",
          deviceNo: "HW-NJ-E-004",
          crux: "N",
          clazz: "电器",
          fixnumber: "无",
        },
      ],
      multipleSelection: [],
      // 分页
      currentPage4: 4,
      // 弹窗
      addDevice: false,
      addInformation: false,

      form: {},
      rules: {
        name: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        brand: [{ required: true, message: "请输入设备品牌", trigger: "blur" }],
        type: [
          { required: true, message: "请输入设备型号/规格", trigger: "blur" },
        ],
        deviceNo: [
          { required: true, message: "请输入设备编号", trigger: "blur" },
          {
            min: 5,
            max: 10,
            message: "长度在 5 到 10 个字符",
            trigger: "blur",
          },
        ],
        crux: [{ required: true, message: "请选择", trigger: "change" }],
        clazz: [
          { required: true, message: "请选择设备类型", trigger: "change" },
        ],
        fixnumber: [
          {
            required: true,
            message: "请输入维护保养标准标号",
            trigger: "blur",
          },
        ],
      },
      formLabelWidth: "140px",
    };
  },
  methods: {
    // 搜索
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
      this.$confirm("删除后无法更改, 是否确定?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableData.splice(index, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //批量删除
    delectAll() {
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i];
        element.id = i + 1;
      }
      if (this.checkedDetail.length == 0) {
        this.$alert("请先选择要删除的数据", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        this.$confirm("删除后无法更改, 是否确定?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.checkedDetail.forEach((element) => {
              this.tableData.forEach((e, i) => {
                if (element.id == e.id) {
                  this.tableData.splice(i, 1);
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
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    //新增人员
    submitForm(formName) {
      let idnum = this.tableData.length + 1;
      let obj = {};
      let upobj = {};
      obj.id = idnum;
      obj.name = formName.name;
      obj.brand = formName.brand;
      obj.type = formName.type;
      obj.deviceNo = formName.deviceNo;
      obj.crux = formName.crux;
      obj.clazz = formName.clazz;
      obj.fixnumber = formName.fixnumber;
      upobj.id = idnum;
      upobj.name = formName.name;
      upobj.brand = formName.brand;
      upobj.type = formName.type;
      upobj.deviceNo = formName.deviceNo;
      upobj.crux = formName.crux;
      if (formName.crux == "Y") {
        upobj.crux = true;
      } else if (formName.crux == "N") {
        upobj.crux = false;
      }
      upobj.clazz = formName.clazz;
      upobj.fixnumber = formName.fixnumber;
      console.log(upobj);
      if (
        obj.name == undefined ||
        obj.brand == undefined ||
        obj.type == undefined ||
        obj.deviceNo == undefined ||
        obj.crux == undefined ||
        obj.clazz == undefined ||
        obj.fixnumber == undefined
      ) {
        this.$alert("请将信息填写完整", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        // let that = this;
        // axios({
        //   method: "POST",
        //   url: "http://47.102.214.37:8080/device",
        // })
        //   .then((res) => {
        //     console.log(res);
        //     this.tableData.push(obj);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     console.log("请求失败: " + err.status + "," + err.statusText);
        //   });
        this.tableData.push(obj);
      }
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
    console.log("Created");
    // axios({
    //   method: "GET",
    //   url: "http://47.102.214.37:8080/device",
    // })
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     console.log("请求失败: " + err.status + "," + err.statusText);
    //   });
  },
};
</script>
<style lang="scss">
.v-modal {
  opacity: 0;
}
.main {
  height: 100%;
  .breadcrumb {
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    font-size: 16px;
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
  .header-search {
    display: flex;
    justify-content: flex-end;
    // border: 1px solid red;
    .oper-btns {
      display: flex;
      .el-button {
        padding: 0 10px;
        height: 30px;
        border-radius: 4px;
        font-size: 12px;
        &.Add-btn {
          width: 85px;
          border: 1px solid #409eff;
          color: #409eff;
        }
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
.man-table {
  height: calc(100% - 120px);
  // border: 1px solid red;
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
      &:nth-child(2) {
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
  .demo-table-expand {
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
.addDeviceDialog {
  .el-dialog {
    max-width: 500px;

    box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    .el-dialog__header {
      background: linear-gradient(-270deg, #6eb5fc, #409eff);
      border-radius: 6px 6px 0px 0px;

      padding: 16px 20px;
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
  .submitbtn {
    display: flex;
    justify-content: center;
    .sub-btn {
      width: 100px;
      background: linear-gradient(-270deg, #6eb5fc, #409eff);
      padding: 10px;
      font-size: 15px;
      border-radius: 5px;
      margin-right: 75px;
      // border: none;
      &:hover {
        opacity: 0.9;
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
