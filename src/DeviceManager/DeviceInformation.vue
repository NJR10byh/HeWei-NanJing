<template>
  <div class="Box">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb-top" separator="/">
      <el-breadcrumb-item class="pathActive">设备管理</el-breadcrumb-item>
      <el-breadcrumb-item class="active">设备信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-main class="Main-Box">
      <!-- 搜索 -->
      <div class="head-btn">
        <div class="oper-btns-left">
          <div class="input" style="margin-left:0;">
            <el-input placeholder="设备名称" v-model="devicename"></el-input>
          </div>
          <div class="input">
            <el-input placeholder="设备品牌" v-model="devicebrand"></el-input>
          </div>
          <div class="input">
            <el-input
              placeholder="设备型号/规格"
              v-model="devicetype"
            ></el-input>
          </div>
          <div class="input">
            <el-input placeholder="设备编号" v-model="deviceclazz"></el-input>
          </div>
          <div class="search">
            <el-button icon="el-icon-search" @click="search">搜索</el-button>
          </div>
          <div class="getall refresh">
            <el-button icon="el-icon-document-copy" @click="getAllDevice"
              >获取全部设备
            </el-button>
          </div>
          <div class="import refresh">
            <el-button icon="el-icon-upload2" @click="dialogVisible = true"
              >导入
            </el-button>
          </div>
          <div class="export refresh">
            <el-button icon="el-icon-download" @click="exportExcel"
              >导出
            </el-button>
          </div>
        </div>
        <div class="oper-btns-right">
          <el-button class="bigdel-btn" icon="el-icon-delete" @click="delectAll"
            >批量删除</el-button
          >
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="35%">
          <div
            style="display:flex;flex-direction: column;justify-content: center;align-items: center"
          >
            <el-upload
              ref="upload"
              drag
              action="http://47.102.214.37:8080/device/import"
              multiple
              :http-request="UpLoad"
              :auto-upload="false"
              accept=".xlsx"
              :on-preview="handlePreview"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                只能上传 xlsx 文件
              </div>
            </el-upload>
            <div style="margin-top: 10px;">
              <el-button
                style="border: 0;background:#409eff;color:#fff;font-weight:bold;"
                @click="submitUpload"
                >确认上传</el-button
              >
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- table -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        stripe
        class="tablestyle"
        style="width: 100%;"
        height="460"
        id="outTable"
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
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
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
        <template v-for="(item, index) in tableHead">
          <el-table-column
            :prop="item.prop"
            :label="item.lable"
            :key="index"
            :width="item.width"
          ></el-table-column>
        </template>
        <el-table-column prop="setting" label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)"
              >修改</el-button
            >
            <el-button @click="handleCode(scope.$index, scope.row)"
              >编码</el-button
            >
            <el-button @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
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
// import XLSX from "xlsx";
// import FileSaver from "file-saver";
export default {
  name: "DeviceInformation",
  components: {},
  data() {
    return {
      dialogVisible: false, //对话框
      fileList: [], //上传文件列表
      searchurl: "", // 导出URL
      exporturl: "", // 导出URL
      userRole: "", //用户类型
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
      // 搜索
      devicename: "",
      devicebrand: "",
      devicetype: "",
      deviceclazz: "",
      query: 0,
      query_value: [],
    };
  },
  methods: {
    //单选框选中数据
    handleDetailSelectionChange(selection) {
      this.checkedDetail = selection;
    },
    // 搜索
    search() {
      let that = this;
      that.query = 0;
      if (that.devicename != "") {
        that.query++;
      }
      if (that.devicebrand != "") {
        that.query++;
      }
      if (that.devicetype != "") {
        that.query++;
      }
      if (that.deviceclazz != "") {
        that.query++;
      }
      if (that.query == 0) {
        that.$message({
          message: "请输入搜索信息",
          type: "warning",
        });
      } else {
        that.query_value = [];
        that.tableData = [];
        console.log(that.devicename);
        console.log(that.devicebrand);
        console.log(that.devicetype);
        console.log(that.deviceclazz);
        console.log(that.query);
        switch (that.query) {
          case 1:
            if (that.devicename != "") {
              that.searchurl =
                "http://47.102.214.37:8080/device/query?name=L" +
                that.devicename +
                "%25";
              that.exporturl =
                "http://47.102.214.37:8080/device/query?name=L" +
                that.devicename +
                "%25";
            } else if (that.devicebrand != "") {
              that.searchurl =
                "http://47.102.214.37:8080/device/query?brand=L" +
                that.devicebrand +
                "%25";
              that.exporturl =
                "http://47.102.214.37:8080/device/export?name=L" +
                that.devicebrand +
                "%25";
            } else if (that.devicetype != "") {
              that.searchurl =
                "http://47.102.214.37:8080/device/query?type=L" +
                that.devicetype.toUpperCase() +
                "%25";
              that.exporturl =
                "http://47.102.214.37:8080/device/export?name=L" +
                that.devicetype.toUpperCase() +
                "%25";
            } else if (that.deviceclazz != "") {
              that.searchurl =
                "http://47.102.214.37:8080/device/query?clazz=L" +
                that.deviceclazz +
                "%25";
              that.exporturl =
                "http://47.102.214.37:8080/device/export?name=L" +
                that.deviceclazz +
                "%25";
            }
            break;
          case 2:
            if (that.devicename != "") {
              that.query_value.push({
                name: "name",
                value: that.devicename,
              });
            }
            if (that.devicebrand != "") {
              that.query_value.push({
                name: "brand",
                value: that.devicebrand,
              });
            }
            if (that.devicetype != "") {
              that.query_value.push({
                name: "type",
                value: that.devicetype.toUpperCase(),
              });
            }
            if (that.deviceclazz != "") {
              that.query_value.push({
                name: "clazz",
                value: that.deviceclazz,
              });
            }
            console.log(that.query_value);
            that.searchurl =
              "http://47.102.214.37:8080/device/query?" +
              that.query_value[0].name +
              "=L" +
              that.query_value[0].value +
              "%25&" +
              that.query_value[1].name +
              "=L" +
              that.query_value[1].value +
              "%25";
            that.exporturl =
              "http://47.102.214.37:8080/device/export?" +
              that.query_value[0].name +
              "=L" +
              that.query_value[0].value +
              "%25&" +
              that.query_value[1].name +
              "=L" +
              that.query_value[1].value +
              "%25";
            break;
          case 3:
            if (that.devicename != "") {
              that.query_value.push({
                name: "name",
                value: that.devicename,
              });
            }
            if (that.devicebrand != "") {
              that.query_value.push({
                name: "brand",
                value: that.devicebrand,
              });
            }
            if (that.devicetype != "") {
              that.query_value.push({
                name: "type",
                value: that.devicetype.toUpperCase(),
              });
            }
            if (that.deviceclazz != "") {
              that.query_value.push({
                name: "clazz",
                value: that.deviceclazz,
              });
            }
            console.log(that.query_value);
            that.searchurl =
              "http://47.102.214.37:8080/device/query?" +
              that.query_value[0].name +
              "=L" +
              that.query_value[0].value +
              "%25&" +
              that.query_value[1].name +
              "=L" +
              that.query_value[1].value +
              "%25&" +
              that.query_value[2].name +
              "=L" +
              that.query_value[2].value +
              "%25";
            that.exporturl =
              "http://47.102.214.37:8080/device/export?" +
              that.query_value[0].name +
              "=L" +
              that.query_value[0].value +
              "%25&" +
              that.query_value[1].name +
              "=L" +
              that.query_value[1].value +
              "%25&" +
              that.query_value[2].name +
              "=L" +
              that.query_value[2].value +
              "%25";
            break;
          case 4:
            that.searchurl =
              "http://47.102.214.37:8080/device/query?name==" +
              that.devicename +
              "&brand==" +
              that.devicebrand +
              "&type==" +
              that.devicetype.toUpperCase() +
              "&clazz==" +
              that.deviceclazz;
            that.exporturl =
              "http://47.102.214.37:8080/device/export?name=L" +
              that.devicename +
              "%25&brand=L" +
              that.devicebrand +
              "%25&type=L" +
              that.devicetype.toUpperCase() +
              "%25&clazz=L" +
              that.deviceclazz +
              "%25";
            break;
          default:
            break;
        }
        console.log(that.searchurl);
        axios.get(that.searchurl).then((res) => {
          console.log(res.data);
          for (let i = 0; i < res.data.content.length; i++) {
            let obj = {};
            obj.id = res.data.content[i].id;
            obj.name = res.data.content[i].name;
            obj["brand"] = res.data.content[i].brand;
            obj.type = res.data.content[i].type;
            obj.deviceNo = res.data.content[i].deviceNo;
            if (res.data.content[i].extra.length != 0) {
              for (let j = 0; j < res.data.content[i].extra.length; j++) {
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
    },
    // 获取全部全部信息
    getAllDevice() {
      let that = this;
      axios({
        method: "GET",
        url: "http://47.102.214.37:8080/device?page=0&size=10",
      })
        .then((res) => {
          that.tableData = [];
          that.total = res.data.totalElements;
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
            message: "已获取全部设备",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 导入
    handlePreview(file, fileList) {
      console.log(file, fileList);
    },
    UpLoad(val) {
      let that = this;
      console.log(val.file);
      let fd = new FormData();
      fd.append("file", val.file);
      console.log(fd);
      axios.post("http://47.102.214.37:8080/device/import", fd).then((res) => {
        console.log(res);
        if (res.status == 200) {
          that.dialogVisible = false;
          that.$message({
            message: "上传成功",
            type: "success",
          });
          setTimeout(function() {
            that.getAllDevice();
          }, 200);
        }
      });
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 导出
    exportExcel() {
      /* 前端导出 */
      // var xlsxParam = { raw: true }; //转换成excel时，使用原始的格式
      // var wb = XLSX.utils.table_to_book(
      //   document.querySelector("#outTable"),
      //   xlsxParam
      // ); //outTable为列表id
      // // console.log(wb.Sheets.Sheet1);
      // var wbout = XLSX.write(wb, {
      //   bookType: "xlsx",
      //   bookSST: true,
      //   type: "array",
      // });
      // try {
      //   FileSaver.saveAs(
      //     new Blob([wbout], { type: "application/octet-stream;charset=utf-8" }),
      //     "data.xlsx"
      //   );
      // } catch (e) {
      //   if (typeof console !== "undefined") console.log(e, wbout);
      // }
      // return wbout;
      /* 后段导出 */
      let that = this;
      if (
        that.devicename == "" &&
        that.devicebrand == "" &&
        that.devicetype == "" &&
        that.deviceclazz == ""
      ) {
        that.exporturl = "http://47.102.214.37:8080/device/export?name=!";
      }
      axios
        .get(that.exporturl, {
          responseType: "blob", // 二进制流
        })
        .then((res) => {
          console.log(res);
          if (!res) return;
          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download", "data.xlsx");
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
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
                    console.log(res);
                  });
                }
              });
            });
            setTimeout(function() {
              that.getAllDevice();
            }, 200);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    // 修改设备信息
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
      axios.get("http://47.102.214.37:8080/device/info-field").then((res) => {
        console.log(res.data);
        for (var i = 0; i < res.data.length; i++) {
          obj[res.data[i].id] = row[res.data[i].id];
        }
        // console.log(obj);
        // this.$router.path({
        //   path: "/editDevice",
        // });
        this.$router.push({
          path: "/editDevice",
          query: obj,
        });
      });
    },
    // 生成编码
    handleCode(index, row) {
      console.log(row);
      this.$router.push({
        path: "./code",
        query: row,
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
              this.getAllDevice();
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
      console.log(val);
      let url =
        "http://47.102.214.37:8080/device?page=" +
        (that.page - 1) +
        "&size=" +
        that.size;
      axios.get(url).then((res) => {
        // console.log(res.data);
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
  created: function() {
    let that = this;
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      that.userRole = res.data.role;
    });
    setTimeout(function() {
      // 获取所有附加字段
      axios.get("http://47.102.214.37:8080/device/info-field").then((res) => {
        // console.log(res.data);
        for (let i = 0; i < res.data.length; i++) {
          let obj = {};
          obj.lable = res.data[i].name;
          obj.width = "130";
          obj.prop = res.data[i].id;
          that.tableHead.push(obj);
        }
      });
      // 获取所有设备
      axios
        .get("http://47.102.214.37:8080/device?page=0&size=10")
        .then((res) => {
          // console.log(res);
          that.total = res.data.totalElements;
          for (let i = 0; i < res.data.content.length; i++) {
            let obj = {};
            obj.id = res.data.content[i].id;
            obj.name = res.data.content[i].name;
            obj["brand"] = res.data.content[i].brand;
            obj.type = res.data.content[i].type;
            obj.deviceNo = res.data.content[i].deviceNo;
            if (res.data.content[i].extra.length != 0) {
              for (let j = 0; j < res.data.content[i].extra.length; j++) {
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
    }, 200);
  },
};
</script>
<style lang="scss">
.Box {
  // height: calc(100%);
  // border: 1px solid blue;
  padding: 0px;
  .breadcrumb-top {
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
  .head-btn {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 5px;
    .oper-btns-left {
      // border: 1px solid red;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 5px;
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
          width: 120px;
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
      .getall {
        .el-button {
          width: 110px;
        }
      }
      .import,
      .export {
        .el-button {
          width: 65px;
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
}
.tablestyle {
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
      &:first-child {
        border-right: none;
      }
      &:nth-child(2) {
        border-right: none;
        .cell {
          padding-right: 0;
        }
      }
      &:nth-child(3) {
        // border: 1px solid red;
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
        color: #409eff;
      }
      &:nth-child(2):hover {
        color: #409eff;
      }
      &:nth-child(3):hover {
        color: #f96b6c;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.Main-Box {
  width: 100%;
  background: #fff;
  // border: 1px solid red;
  .el-pagination {
    text-align: center;
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>
