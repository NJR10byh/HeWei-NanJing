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
            <el-form-item
              label="维护保养标准标号: "
              :label-width="formLabelWidth"
              prop="fixnumber"
            >
              <el-input
                v-model="form.fixnumber"
                autocomplete="off"
                placeholder="请输入维护保养标准标号"
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
                <el-option label="String (字符串型)" value="String"></el-option>
                <el-option label="Date (日期型)" value="Date"></el-option>
                <el-option label="Integer (数字型)" value="Integer"></el-option>
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
                v-model="scope.row.extrainfo"
                placeholder="请输入字段信息"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div class="ExtraInfoTable"></div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
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
      ExtraInfoDialog: {},
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
    // 新增额外字段
    SubmitNewExtraInfo(Info) {
      let that = this;
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
        if (formData.crux == "Y") {
          obj.crux = true;
        } else if (formData.crux == "N") {
          obj.crux = false;
        }
        let extraobj = [];
        for (var i = 0; i < that.tableData.length; i++) {
          extraobj.push({
            field: { id: that.extraid[i] },
            value: that.tableData[i].extrainfo,
          });
        }
        axios
          .put("http://47.102.214.37:8080/device", {
            id: this.$route.query.id,
            name: formData.name,
            brand: formData.brand,
            type: formData.type,
            deviceNo: formData.deviceNo,
            crux: obj.crux,
            clazz: formData.clazz,
            extra: extraobj,
          })
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
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  created: function() {
    // console.log(this.$route.query);
    let that = this;
    that.form.name = this.$route.query.name;
    that.form.brand = this.$route.query.brand;
    that.form.type = this.$route.query.type;
    that.form.deviceNo = this.$route.query.deviceNo;
    that.form.crux = this.$route.query.crux;
    that.form.clazz = this.$route.query.clazz;
    axios.get("http://47.102.214.37:8080/device/info-field").then((res) => {
      console.log(res.data);
      for (var i = 0; i < res.data.length; i++) {
        that.extraid.push(res.data[i].id);
        that.tableData.push({
          extraname: res.data[i].name,
          extrainfo: this.$route.query[res.data[i].id],
        });
      }
    });
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
      .ExtraInfoTable {
        margin-top: 10px;
      }
    }
  }
}
</style>
