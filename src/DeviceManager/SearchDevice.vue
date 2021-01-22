<template>
  <div class="main">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb-top" separator="/">
      <el-breadcrumb-item class="pathActive">设备管理</el-breadcrumb-item>
      <el-breadcrumb-item class="active">查询设备</el-breadcrumb-item>
    </el-breadcrumb>
    <el-main class="main-con" style="width:100%">
      <!-- 搜索 -->
      <div class="topsearch">
        <div class="searchleft">
          <el-input
            v-model="formInline.person"
            placeholder="请输入搜索人员"
          ></el-input>
        </div>
        <div class="searchright">
          搜索类别
        </div>
        <div class="select">
          <template v-for="(item, index) in tableHead">
            <el-dropdown :key="index">
              <span class="el-dropdown-link">
                {{ item.lable
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-checkbox
                  :indeterminate="isIndeterminate"
                  v-model="checkAll"
                  @change="handleCheckAllChange"
                  >全选</el-checkbox
                >
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group
                  v-model="checkedCities"
                  @change="handleCheckedCitiesChange"
                >
                  <el-checkbox
                    v-for="city in cities"
                    :label="city"
                    :key="city"
                    >{{ city }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </div>
        <div class="searchbtn">
          <el-button type="primary" icon="el-icon-search">搜索</el-button>
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
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
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
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="id" label="ID" width="40"></el-table-column>
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
      <!-- 新增弹窗 -->
      <el-dialog
        title="新增设备"
        class="addDeviceDialog"
        :visible.sync="dialogFormVisible"
      >
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item
            label="设备号: "
            prop="deviceID"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.deviceID"
              placeholder="请输入设备号"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="设备类型: "
            prop="type"
            :label-width="formLabelWidth"
          >
            <el-select v-model="form.type" placeholder="请选择">
              <el-option label="类型一" value="类型一"></el-option>
              <el-option label="类型二" value="类型二"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="设备状态: "
            prop="State"
            :label-width="formLabelWidth"
          >
            <el-radio-group v-model="form.State">
              <el-radio label="在线">在线</el-radio>
              <el-radio label="离线">离线</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="开始时间: "
            prop="Begin"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.Begin" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="结束时间: "
            prop="End"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.End" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-button class="sub-btn" type="primary" @click="submitForm(form)"
              >保存并提交</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
  </div>
</template>

<script>
import axios from "axios";
const cityOptions = ["上海", "北京", "广州", "深圳"];
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
      // 下拉多选框
      checkAll: false,
      checkedCities: ["上海", "北京"],
      cities: cityOptions,
      isIndeterminate: true,
      //选择框
      checkedDetail: [],
      // 可选表头数据
      tableHead: [],
      // 表格数据
      tableData: [],
      // 设备类型数据
      selectData: [],
      multipleSelection: [],
      // 分页
      currentPage4: 1,
      // 弹窗
      dialogFormVisible: false,
      form: {},
      rules: {
        number: [
          { required: true, message: "请输入工号", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入名字", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        places: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      formLabelWidth: "100px",
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
    // 下拉选择
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
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
      obj.id = idnum;
      obj.deviceID = formName.deviceID;
      obj.type = formName.type;
      obj.State = formName.State;
      obj.Begin = formName.Begin;
      obj.End = formName.End;
      //console.log(obj.type);
      if (
        obj.deviceID == undefined ||
        obj.id == undefined ||
        obj.type == undefined ||
        obj.State == undefined ||
        obj.Begin == undefined ||
        obj.End == undefined
      ) {
        this.$alert("请将信息填写完整", "提示", {
          confirmButtonText: "确定",
        });
      } else {
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
  created() {
    let that = this;
    console.log("Created");
    // 获取所有附加字段
    axios.get("http://47.102.214.37:8080/device/info-field").then((res) => {
      console.log(res.data);
      for (var i = 0; i < res.data.length; i++) {
        let obj = {};
        obj.lable = res.data[i].name;
        obj.width = "100";
        obj.prop = "new" + res.data[i].id;
        that.tableHead.push(obj);
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
    margin-top: 10px;
    overflow: hidden;
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
  .topsearch {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    // border: 1px solid red;
    .searchleft {
      display: flex;
      justify-content: center;
      align-items: center;
      //   border: 1px solid red;
      height: 40px;
      .el-form-item {
        margin-right: 0;
      }
      .el-input__inner {
        width: 180px;
        height: 35px;
        background: #ffffff;
        border: 1px solid #dddddd;
        border-radius: 4px;
        font-size: 14px;
        &:focus {
          border-color: #409eff;
        }
      }
    }
    .searchright {
      border: 1px solid #6eb5fc;
      border-radius: 5px;
      background: #f8f8f8;
      margin-left: 10px;
      padding: 5px;
      font-size: 13px;
      color: #409eff;
      font-weight: bold;
    }
    .select {
      margin-left: 20px;
      .el-dropdown-link {
        cursor: pointer;
        color: #409eff;
      }
      .el-icon-arrow-down {
        font-size: 13px;
      }
    }
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
  height: calc(100% - 120px);
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
        .cell {
          padding-right: 0;
        }
      }
      &:nth-child(2) {
        .cell {
          padding-left: 0;
        }
      }
      .cell {
        padding: 0 20px;
        color: #282828;
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
      &:first-child {
        border-right: none;
        .cell {
          padding-right: 0;
          overflow: auto;
          width: 44px;
        }
      }
      &:nth-child(2) {
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
    .el-form-item__content {
      .el-input__inner {
        width: 300px;
      }
      .el-textarea {
        width: 500px;
        .el-textarea__inner {
          min-height: 120px !important;
        }
      }
    }
    .sub-btn {
      width: 110px;
      background: linear-gradient(-270deg, #6eb5fc, #409eff);
      border-radius: 4px;
      border: none;
      margin-left: 75px;
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
