<template>
  <div class="Main">
    <!-- 面包屑 -->
    <el-breadcrumb class="BreadCrumb">
      <el-breadcrumb-item class="left">设备管理</el-breadcrumb-item>
      <el-breadcrumb-item class="right">编辑设备</el-breadcrumb-item>
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
              label="设备型号: "
              :label-width="formLabelWidth"
              prop="type"
            >
              <el-input
                v-model="form.type"
                autocomplete="off"
                placeholder="请输入设备型号"
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
              label="关键设备:"
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
            <el-button type="primary" @click="submitEditDevice(form)"
              >确认修改</el-button
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
            class="EditBtn"
            icon="el-icon-edit"
            @click="EditExtraInfoDialog = true"
            >修改字段</el-button
          >
          <el-button
            class="DelBtn"
            icon="el-icon-delete"
            @click="delectExtraInfo"
            >删除字段</el-button
          >
        </div>
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
            <el-option label="String (字符串型)" value="String"></el-option>
            <el-option label="Date (日期型)" value="Date"></el-option>
            <el-option label="Integer (数字型)" value="Integer"></el-option>
            <el-option label="Bool (布尔型)" value="Bool"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="SubmitNewExtraInfo(ExtraInfoDialog)"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="修改字段"
      :visible.sync="EditExtraInfoDialog"
      class="EditExtraInfoDialog"
    >
      <el-form :model="EditedExtraInfoDialog">
        <el-form-item label="字段: " label-width="100px">
          <el-select
            v-model="EditedExtraInfoDialog.id"
            placeholder="请选择需要修改的字段"
          >
            <el-option
              v-for="item in ExtraInfoOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段名称: " label-width="100px">
          <el-input
            v-model="EditedExtraInfoDialog.name"
            autocomplete="off"
            placeholder="需要修改的字段名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="字段类型: " label-width="100px">
          <el-select
            v-model="EditedExtraInfoDialog.type"
            placeholder="需要修改的字段类型"
            size="larger"
          >
            <el-option label="String (字符串型)" value="String"></el-option>
            <el-option label="Date (日期型)" value="Date"></el-option>
            <el-option label="Integer (数字型)" value="Integer"></el-option>
            <el-option label="Bool (布尔型)" value="Bool"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button class="editcancel" @click="EditExtraInfoDialog = false"
          >取 消</el-button
        >
        <el-button
          type="warning"
          @click="SubmitEditedExtraInfo(EditedExtraInfoDialog)"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: "",
        brand: "",
        type: "",
        deviceNo: "",
        crux: "",
        clazz: "",
      },
      formLabelWidth: "150px",
      dialogFormVisible: false,
      EditExtraInfoDialog: false,
      EditedExtraInfoDialog: {}, // 修改的字段信息
      ExtraInfoDialog: {},
      ExtraInfoOptions: [],
      tableData: [],
      extraid: [],
      //选择框
      checkedDetail: [],
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
    // 获取额外字段
    getExtraInfo() {
      let that = this;
      that.tableData = [];
      that.extraid = [];
      that
        .request("device/info-field", {}, "GET")
        .then((res) => {
          console.log(res.data);
          for (var i = 0; i < res.data.length; i++) {
            that.extraid.push(res.data[i].id);
            if (res.data[i].type == "Bool") {
              that.tableData.push({
                extraname: res.data[i].name,
                extrainfo:
                  that.$route.query[res.data[i].id] == "true" ? "Y" : "N",
                type: res.data[i].type,
              });
            } else {
              that.tableData.push({
                extraname: res.data[i].name,
                extrainfo: that.$route.query[res.data[i].id],
                type: res.data[i].type,
              });
            }
            let obj = {};
            obj.value = res.data[i].id;
            obj.label = res.data[i].name + "（" + res.data[i].type + "）";
            that.ExtraInfoOptions.push(obj);
          }
        })
        .catch((res) => {
          this.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
    },
    // 新增额外字段
    SubmitNewExtraInfo(Info) {
      let that = this;
      if (Info.name == "" || Info.type == undefined) {
        this.$alert("请将基本信息填写完整！", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        that
          .request(
            "device/info-field",
            {
              name: Info.name,
              type: Info.type,
            },
            "POST"
          )
          .then((res) => {
            console.log(res);
            that.$message({
              message: "新增字段成功",
              type: "success",
            });
            that.tableData.push({
              extraname: Info.name,
              extrainfo: "",
              type: Info.type,
            });
            that
              .request("device/info-field", {}, "GET")
              .then((res) => {
                console.log(res);
                for (var j = 0; j < res.data.length; j++) {
                  if (res.data[j].name == Info.name) {
                    that.extraid.push(res.data[j].id);
                    break;
                  }
                }
              })
              .catch((res) => {
                this.$message({
                  message: res.response.data.message,
                  type: "error",
                });
              });
            that.dialogFormVisible = false;
          })
          .catch((res) => {
            this.$message({
              message: res.response.data.message,
              type: "error",
            });
          });
      }
    },
    // 提交修改后的字段信息
    SubmitEditedExtraInfo() {
      let that = this;
      // that.EditExtraInfoDialog = false;
      console.log(that.EditedExtraInfoDialog);
      let url = "device/info-field/id" + that.EditedExtraInfoDialog.id;
      that
        .request(url, that.EditedExtraInfoDialog, "POST")
        .then(() => {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          that.EditExtraInfoDialog = false;
          that.getExtraInfo();
        })
        .catch((res) => {
          this.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
    },
    // 删除字段
    delectExtraInfo() {
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
            console.log(that.checkedDetail);
            that.checkedDetail.forEach((element) => {
              that.tableData.forEach((e, i) => {
                console.log(element, e);
                if (element.extraname == e.extraname) {
                  console.log(that.tableData[i]);
                  let url = "device/info-field/" + that.extraid[i];
                  that
                    .request(url, {}, "DELETE")
                    .then((res) => {
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
            setTimeout(function () {
              that.getExtraInfo();
            }, 300);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    // 提交修改设备
    submitEditDevice(formData) {
      let that = this;
      console.log(formData);
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
        // if (formData.crux == "Y") {
        //   obj.crux = true;
        // } else if (formData.crux == "N") {
        //   obj.crux = false;
        // }
        obj.crux = obj.crux == "Y" ? true : false;
        let extraobj = [];
        for (var i = 0; i < that.tableData.length; i++) {
          if (
            that.tableData[i].extrainfo == "Y" ||
            that.tableData[i].extrainfo == "N"
          ) {
            that.tableData[i].extrainfo =
              that.tableData[i].extrainfo == "Y" ? "true" : "false";
          }
          extraobj.push({
            field: { id: that.extraid[i] },
            value: that.tableData[i].extrainfo,
          });
        }
        console.log(extraobj);
        that
          .request(
            "device",
            {
              id: this.$route.query.id,
              name: formData.name,
              brand: formData.brand,
              type: formData.type,
              deviceNo: formData.deviceNo,
              crux: obj.crux,
              clazz: formData.clazz,
              extra: extraobj,
            },
            "PUT"
          )
          .then((res) => {
            console.log(res);
            if (res.status == 200) {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.$router.push("/deviceInformation");
            }
          })
          .catch((res) => {
            this.$message({
              message: res.response.data.message,
              type: "error",
            });
          });
      }
    },
  },
  created: function () {
    console.log(this.$route.query);
    let that = this;
    that.form.name = this.$route.query.name;
    that.form.brand = this.$route.query.brand;
    that.form.type = this.$route.query.type;
    that.form.deviceNo = this.$route.query.deviceNo;
    this.$route.query.crux == "true"
      ? (that.form.crux = "Y")
      : (that.form.crux = "N");
    that.form.clazz = this.$route.query.clazz;
    that.getExtraInfo();
  },
};
</script>
<style lang="scss">
.Main {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fcfcfc;
  .BreadCrumb {
    align-self: flex-start;
    height: 30px;
    line-height: 30px;
    margin-top: 10px;
    overflow: hidden;
    padding: 5px 10px;
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
    margin-top: 5px;
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
      .BaseInfoTable {
        margin-top: 10px;
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
        margin-top: 10px;
        .AddBtn {
          height: 30px;
          padding: 0 10px;
          border-radius: 5px;
          font-size: 12px;
          width: 85px;
          border-color: #409eff;
          color: #409eff;
        }
        .EditBtn {
          height: 30px;
          padding: 0 10px;
          border-radius: 5px;
          font-size: 12px;
          width: 85px;
          border-color: #f79f1f;
          color: #f79f1f;
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
        .EditBtn:hover {
          background: #ffe7bc;
        }
        .DelBtn:hover {
          background: #ffcfcf;
        }
      }
      .ExtraInfoTable {
        margin-top: 10px;
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
  .EditExtraInfoDialog {
    .el-dialog {
      max-width: 450px;
      box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      .el-dialog__header {
        background: linear-gradient(-270deg, #ffbc40, #f79f1f);
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
    .editcancel:hover {
      color: #f79f1f;
      background: #ffe7bc;
      border-color: #f79f1f;
    }
  }
}
</style>
