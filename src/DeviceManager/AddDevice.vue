<template>
  <div class="Main">
    <!-- 面包屑 -->
    <el-breadcrumb class="BreadCrumb">
      <el-breadcrumb-item class="left">设备管理</el-breadcrumb-item>
      <el-breadcrumb-item class="right">新增设备</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="AddDeviceInfo">
      <div class="BaseInfo">
        <div class="BaseInfoText">基本信息</div>
        <div class="BaseInfoTable">
          <el-form :model="form" ref="form" label-position="left">
            <el-form-item label="设备名称: " :label-width="formLabelWidth">
              <el-input
                v-model="form.name"
                placeholder="请输入设备号"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备品牌: " :label-width="formLabelWidth">
              <el-input v-model="form.brand" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="设备型号/规格: " :label-width="formLabelWidth">
              <el-input v-model="form.type" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="设备编号: " :label-width="formLabelWidth">
              <el-input v-model="form.deviceNo" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              label="是否为关键设备: "
              :label-width="formLabelWidth"
            >
              <el-radio-group v-model="form.crux">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="设备分类: " :label-width="formLabelWidth">
              <el-select v-model="form.clazz" placeholder="请选择设备类型">
                <el-option label="电器" value="电器"></el-option>
                <el-option label="机械" value="机械"></el-option>
                <el-option label="测量" value="测量"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="维护保养标准标号: "
              :label-width="formLabelWidth"
            >
              <el-input v-model="form.fixnumber" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div class="submitbtn">
            <el-button type="primary" @click="submitNewinfo(form)"
              >保存并提交</el-button
            >
          </div>
        </div>
      </div>
      <div class="ExtraInfo">
        <div class="ExtraInfoText">拓展信息</div>
        <div class="Btns">
          <el-button class="AddBtn" icon="el-icon-circle-plus-outline"
            >新增字段</el-button
          >
          <el-button class="DelBtn" icon="el-icon-delete">删除字段</el-button>
          <el-button class="MoreDelBtn" icon="el-icon-delete"
            >批量删除</el-button
          >
        </div>
        <div class="ExtraInfoTable">
          <el-form :model="form" ref="form" label-position="left">
            <el-form-item label="设备名称: " :label-width="formLabelWidth">
              <el-input
                v-model="form.name"
                placeholder="请输入设备号"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备品牌: " :label-width="formLabelWidth">
              <el-input v-model="form.brand" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="设备型号/规格: " :label-width="formLabelWidth">
              <el-input v-model="form.type" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="设备编号: " :label-width="formLabelWidth">
              <el-input v-model="form.deviceNo" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              label="是否为关键设备: "
              :label-width="formLabelWidth"
            >
              <el-radio-group v-model="form.crux">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="设备分类: " :label-width="formLabelWidth">
              <el-select v-model="form.clazz" placeholder="请选择设备类型">
                <el-option label="电器" value="电器"></el-option>
                <el-option label="机械" value="机械"></el-option>
                <el-option label="测量" value="测量"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="维护保养标准标号: "
              :label-width="formLabelWidth"
            >
              <el-input v-model="form.fixnumber" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {},
      formLabelWidth: "150px",
    };
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
