<template>
  <div style="width:100%;height:100%">
    <div class="nopower" v-if="user != 'CREATOR'">无权限</div>
    <div class="Main" v-if="user == 'CREATOR'">
      <!-- 面包屑 -->
      <el-breadcrumb class="Breadcrumb">
        <el-breadcrumb-item class="left">设备管理</el-breadcrumb-item>
        <el-breadcrumb-item class="right">新增设备</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="AddDeviceInfo">
        <div class="BaseInfo">
          <div class="BaseInfoText">基本信息</div>
          <div class="BaseInfoTable">
            <el-form
              :model="form"
              ref="form"
              label-position="left"
              :rules="rules"
            >
              <el-form-item
                label="设备名称: "
                :label-width="formLabelWidth"
                prop="name"
              >
                <el-input
                  v-model="form.name"
                  placeholder="请输入设备名称"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="设备品牌: "
                :label-width="formLabelWidth"
                prop="brand"
              >
                <el-input
                  v-model="form.brand"
                  autocomplete="off"
                  placeholder="请输入设备品牌"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="设备型号/规格: "
                :label-width="formLabelWidth"
                prop="type"
              >
                <el-input
                  v-model="form.type"
                  autocomplete="off"
                  placeholder="请输入设备型号/规格"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="设备编号: "
                :label-width="formLabelWidth"
                prop="deviceNo"
              >
                <el-input
                  v-model="form.deviceNo"
                  autocomplete="off"
                  placeholder="请输入设备编号"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="是否为关键设备:"
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
                <el-input
                  v-model="form.clazz"
                  autocomplete="off"
                  placeholder="请输入设备分类"
                ></el-input>
              </el-form-item>
            </el-form>
            <div class="submitbtn">
              <el-button type="primary" @click="submitNewDevice(form)"
                >保存并提交</el-button
              >
            </div>
          </div>
        </div>
        <div class="ExtraInfo">
          <div class="ExtraInfoText">拓展信息</div>
          <div class="Btns">
            <el-button
              class="AddBtn"
              icon="el-icon-circle-plus-outline"
              @click="dialogFormVisible = true"
              >新增字段</el-button
            >
            <el-button
              class="DelBtn"
              icon="el-icon-delete"
              @click="delectExtraInfo"
              >删除字段</el-button
            >
          </div>
          <el-dialog
            title="新增字段"
            :visible.sync="dialogFormVisible"
            class="addExtraInfoDialog"
          >
            <el-form :model="ExtraInfoDialog">
              <el-form-item label="字段名称: " label-width="100px">
                <el-input
                  v-model="ExtraInfoDialog.name"
                  autocomplete="off"
                  placeholder="请输入字段名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="字段类型: " label-width="100px">
                <el-select
                  v-model="ExtraInfoDialog.type"
                  placeholder="请选择字段类型"
                >
                  <el-option
                    label="String (字符串型)"
                    value="String"
                  ></el-option>
                  <el-option label="Date (日期型)" value="Date"></el-option>
                  <el-option
                    label="Integer (数字型)"
                    value="Integer"
                  ></el-option>
                  <el-option label="Bool (布尔型)" value="Bool"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button
                type="primary"
                @click="SubmitNewExtraInfo(ExtraInfoDialog)"
                >确 定</el-button
              >
            </div>
          </el-dialog>
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
            <el-table-column prop="extraname" label="字段名"></el-table-column>
            <el-table-column label="字段信息">
              <template slot-scope="scope">
                <el-input
                  v-if="scope.row.type == 'String'"
                  v-model="scope.row.extrainfo"
                  placeholder="请输入字段信息"
                ></el-input>
                <el-input
                  v-if="scope.row.type == 'Integer'"
                  type="number"
                  v-model="scope.row.extrainfo"
                  placeholder="请输入字段信息"
                ></el-input>
                <el-date-picker
                  v-if="scope.row.type == 'Date'"
                  v-model="scope.row.extrainfo"
                  type="date"
                  placeholder="选择日期"
                  size="large"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
                <el-radio-group
                  v-model="scope.row.extrainfo"
                  v-if="scope.row.type == 'Bool'"
                >
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
          </el-table>
          <div class="ExtraInfoTable"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      user: "CREATOR",
      form: {},
      ExtraInfoDialog: {},
      formLabelWidth: "150px",
      dialogFormVisible: false,
      //选择框
      checkedDetail: [],
      tableData: [],
      extraid: [],
      extraobj: [],
      rules: {
        name: [
          {
            required: true,
            message: "必填字段不能为空！",
            trigger: "blur",
          },
        ],
        brand: [
          {
            required: true,
            message: "必填字段不能为空！",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "必填字段不能为空！",
            trigger: "blur",
          },
        ],
        deviceNo: [
          {
            required: true,
            message: "必填字段不能为空！",
            trigger: "blur",
          },
        ],
        crux: [
          {
            required: true,
            message: "必填字段不能为空！",
            trigger: "blur",
          },
        ],
        clazz: [
          {
            required: true,
            message: "必填字段不能为空！",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //单选框选中数据
    handleDetailSelectionChange(selection) {
      this.checkedDetail = selection;
    },
    // 新增额外字段
    SubmitNewExtraInfo(Info) {
      let that = this;
      console.log(Info);
      if (Info.name == "" || Info.type == undefined) {
        this.$alert("请将基本信息填写完整！", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        axios
          .post("http://47.102.214.37:8080/device/info-field", {
            name: Info.name,
            type: Info.type,
          })
          .then((res) => {
            if (res.status == 201) {
              that.tableData.push({
                extraname: Info.name,
                extrainfo: "",
              });
              // 在此进行字段id获取，避免axios异步请求导致的  _ob_: Observer无法遍历
              axios
                .get("http://47.102.214.37:8080/device/info-field")
                .then((res) => {
                  for (var j = 0; j < res.data.length; j++) {
                    if (res.data[j].name == Info.name) {
                      that.extraid.push(res.data[j].id);
                      break;
                    }
                  }
                });
              that.dialogFormVisible = false;
            }
          });
      }
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
            "现有的设备中属于该字段的所有信息都会被删除, \n是否确定?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
          .then(() => {
            that.checkedDetail.forEach((element) => {
              that.tableData.forEach((e, i) => {
                if (element.extraname == e.extraname) {
                  console.log(that.tableData[i]);
                  console.log(that.extraid[i]);
                  let url =
                    "http://47.102.214.37:8080/device/info-field/" +
                    that.extraid[i];
                  axios.delete(url).then((res) => {
                    console.log(res);
                    if (res.status == 200) {
                      that.tableData.splice(i, 1);
                      this.$message({
                        message: "删除成功",
                        type: "success",
                      });
                    } else {
                      this.$message.error("删除失败");
                    }
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
    // 提交新增设备
    submitNewDevice(formData) {
      var bbb = [];
      let that = this;
      if (
        formData.name == undefined ||
        formData.brand == undefined ||
        formData.type == undefined ||
        formData.deviceNo == undefined ||
        formData.crux == undefined ||
        formData.clazz == undefined
      ) {
        this.$alert("请将基本信息填写完整！", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        let obj = {};
        if (formData.crux == "Y") {
          obj.crux = true;
        } else if (formData.crux == "N") {
          obj.crux = false;
        }
        for (var i = 0; i < that.tableData.length; i++) {
          bbb.push({
            field: { id: that.extraid[i] },
            value: that.tableData[i].extrainfo,
          });
        }
        axios
          .post("http://47.102.214.37:8080/device", {
            name: formData.name,
            brand: formData.brand,
            type: formData.type,
            deviceNo: formData.deviceNo,
            crux: obj.crux,
            clazz: formData.clazz,
            extra: bbb,
          })
          .then((res) => {
            if (res.data.message == "ok") {
              this.$message({
                message: "添加成功",
                type: "success",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  created: function() {
    let that = this;
    let url = "http://47.102.214.37:8080/user/" + 1;
    axios.get(url).then((res) => {
      that.user = res.data.role;
    });
    setTimeout(function() {
      if (that.user == "CREATOR") {
        axios.get("http://47.102.214.37:8080/device/info-field").then((res) => {
          console.log(res.data);
          for (var i = 0; i < res.data.length; i++) {
            that.extraid.push(res.data[i].id);
            that.tableData.push({
              extraname: res.data[i].name,
              extrainfo: "",
              type: res.data[i].type,
            });
          }
        });
      }
    }, 200);
  },
};
</script>
<style lang="scss">
.nopower {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.Main {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fcfcfc;
  .Breadcrumb {
    align-self: flex-start;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    font-size: 16px;
    padding: 10px 10px 5px 10px;
    .left {
      font-size: 16px;
      font-weight: bold;
    }
    .right {
      font-size: 20px;
    }
  }
  .AddDeviceInfo {
    // border: 1px solid red;
    display: flex;
    justify-content: space-around;
    width: 100%;
    .BaseInfo {
      width: 36%;
      background: #fff;
      padding: 15px 20px;
      border-radius: 20px;
      box-shadow: 5px 5px 20px #eeeeee, -5px 5px 20px #eeeeee;
      .BaseInfoText {
        font-size: 20px;
        text-align: center;
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
          &:hover {
            opacity: 0.9;
          }
        }
      }
    }
    .ExtraInfo {
      width: 48%;
      background: #fff;
      padding: 15px 20px;
      border-radius: 20px;
      box-shadow: 5px 5px 20px #eeeeee, -5px 5px 20px #eeeeee;
      .ExtraInfoText {
        font-size: 20px;
        text-align: center;
      }
      .Btns {
        width: 100%;
        // border: 1px solid red;
        display: flex;
        justify-content: center;
        padding: 0 0 10px 0;
        .AddBtn {
          height: 30px;
          padding: 0 10px;
          border-radius: 5px;
          font-size: 12px;
          width: 85px;
          border-color: #409eff;
          color: #409eff;
        }
        .DelBtn {
          height: 30px;
          padding: 0 10px;
          border-radius: 5px;
          font-size: 12px;
          width: 85px;
          border-color: #f96b6c;
          color: #f96b6c;
        }
        .MoreDelBtn {
          height: 30px;
          padding: 0 10px;
          border-radius: 5px;
          font-size: 12px;
          width: 85px;
          border-color: #f96b6c;
          color: #f96b6c;
        }
        .DelBtn:hover {
          background: #ffcfcf;
        }
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
        }
      }
    }
  }
  .addExtraInfoDialog {
    .el-dialog {
      max-width: 450px;
      box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      .el-dialog__header {
        background: linear-gradient(-270deg, #6eb5fc, #409eff);
        border-radius: 10px 10px 0px 0px;
        padding: 16px 20px;
        .el-dialog__title {
          color: #fff;
          font-size: 18px;
        }
        .el-dialog__headerbtn {
          &:hover {
            .el-dialog__close {
              color: #fffdef;
            }
          }
          .el-icon-close {
            color: #ccc;
            font-size: 18px;
          }
        }
      }
      .dialog-footer {
        // border: 1px solid red;
        margin-top: -20px;
      }
    }
  }
}
</style>
