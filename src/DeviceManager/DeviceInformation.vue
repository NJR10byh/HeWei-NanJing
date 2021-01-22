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
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="sizes,total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <!-- 新增设备弹窗 -->
      <el-dialog title="新增设备" class="addDevice" :visible.sync="addDevice">
        <el-form :model="form" :rules="rules" ref="form" label-position="left">
          <el-form-item
            label="设备名称: "
            :label-width="formLabelWidth"
            prop="name"
          >
            <el-input v-model="form.name" placeholder="请输入设备号"></el-input>
          </el-form-item>
          <el-form-item
            label="设备品牌: "
            :label-width="formLabelWidth"
            prop="brand"
          >
            <el-input v-model="form.brand" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="设备型号/规格: "
            :label-width="formLabelWidth"
            prop="type"
          >
            <el-input v-model="form.type" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="设备编号: "
            :label-width="formLabelWidth"
            prop="deviceNo"
          >
            <el-input v-model="form.deviceNo" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="是否为关键设备: "
            :label-width="formLabelWidth"
            prop="crux"
          >
            <el-radio-group v-model="form.crux">
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="设备分类: "
            :label-width="formLabelWidth"
            prop="clazz"
          >
            <el-select v-model="form.clazz" placeholder="请选择设备类型">
              <el-option label="电器" value="电器"></el-option>
              <el-option label="机械" value="机械"></el-option>
              <el-option label="测量" value="测量"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="维护保养标准标号: "
            :label-width="formLabelWidth"
            prop="fixnumber"
          >
            <el-input v-model="form.fixnumber" autocomplete="off"></el-input>
          </el-form-item>
          <template v-for="item in tableHead">
            <el-form-item
              :label="item.lable"
              :label-width="formLabelWidth"
              :key="item.id"
            >
              <el-input autocomplete="off" v-model="item.prop"></el-input
            ></el-form-item>
          </template>
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
        class="addInfo"
        :visible.sync="addInformation"
      >
        <el-form ref="form" :model="form" label-position="left">
          <el-form-item label="新增信息字段: " label-width="120px">
            <el-input v-model="form.lable"></el-input>
          </el-form-item>
        </el-form>
        <div class="submitbtn">
          <el-button type="primary" @click="submitNewinfo(form)"
            >保存并提交</el-button
          >
        </div>
      </el-dialog>
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
      // 弹窗
      addDevice: false,
      addInformation: false,

      form: {},
      rules: {
        name: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        brand: [{ required: true, message: "请输入设备品牌", trigger: "blur" }],
        type: [
          { required: true, message: "请输入设备型号/规格", trigger: "blur" },
        ],
        deviceNo: [
          { required: true, message: "请输入设备编号", trigger: "blur" },
          // {
          //   min: 5,
          //   max: 10,
          //   message: "长度在 5 到 10 个字符",
          //   trigger: "blur",
          // },
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
      formLabelWidth: "180px",
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
        })
        .catch((err) => {
          console.log(err);
        });
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
          console.log(that.tableData[index]);
          let url =
            "http://47.102.214.37:8080/device/" + that.tableData[index].id;
          // console.log(url);
          axios.delete(url).then((res) => {
            console.log(res);
            if (res.message == "ok") {
              this.tableData.splice(index, 1);
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
    // 新增设备
    submitForm(formName) {
      console.log(formName);
      // let idnum = this.tableData.length + 1;
      // let obj = {};
      // let upobj = {};
      // obj.id = idnum;
      // obj.name = formName.name;
      // obj.brand = formName.brand;
      // obj.type = formName.type;
      // obj.deviceNo = formName.deviceNo;
      // obj.crux = formName.crux;
      // obj.clazz = formName.clazz;
      // obj.fixnumber = formName.fixnumber;
      // upobj.id = idnum;
      // upobj.name = formName.name;
      // upobj.brand = formName.brand;
      // upobj.type = formName.type;
      // upobj.deviceNo = formName.deviceNo;
      // if (formName.crux == "Y") {
      //   upobj.crux = true;
      // } else if (formName.crux == "N") {
      //   upobj.crux = false;
      // }
      // upobj.clazz = formName.clazz;
      // upobj.fixnumber = formName.fixnumber;
      // if (
      //   obj.name == undefined ||
      //   obj.brand == undefined ||
      //   obj.type == undefined ||
      //   obj.deviceNo == undefined ||
      //   obj.crux == undefined ||
      //   obj.clazz == undefined ||
      //   obj.fixnumber == undefined
      // ) {
      //   this.$message.error("请将必填信息填写完整！");
      // } else {
      //   let that = this;
      //   axios
      //     .post("http://47.102.214.37:8080/device", {
      //       name: upobj.name,
      //       brand: upobj.brand,
      //       type: upobj.type,
      //       deviceNo: upobj.deviceNo,
      //       crux: upobj.crux,
      //       clazz: upobj.clazz,
      //     })
      //     .then((res) => {
      //       console.log(res);
      //       // this.tableData.push(obj);
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
      //   that.tableData.push(obj);
      //   that.addDevice = false;
      // }
    },
    // 新增信息字段
    submitNewinfo(formname) {
      let that = this;
      let obj = {};
      obj.lable = formname.lable;
      obj.width = "120";
      console.log(obj);
      axios
        .post("http://47.102.214.37:8080/device/info-field", {
          name: obj.lable,
          type: "String",
        })
        .then((res) => {
          console.log(res.data.message);
          if (res.data.message == "ok") {
            axios
              .get("http://47.102.214.37:8080/device/info-field")
              .then((res) => {
                for (var i = 0; i < res.data.length; i++) {
                  let obj = {};
                  obj.lable = res.data[i].name;
                  obj.width = "100";
                  obj.prop = res.data[i].id;
                  that.tableHead.push(obj);
                }
              });
          }
        })
        .catch((err) => {
          console.log(err);
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
      }
    }
    .oper-btns-right {
      display: flex;
      justify-content: flex-start;
      .el-button {
        padding: 0 10px;
        height: 30px;
        border-radius: 5px;
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
