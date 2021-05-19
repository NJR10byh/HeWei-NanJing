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
          <div class="select">
            <el-select
              v-model="selectvalue"
              placeholder="请选择搜索字段"
              filterable
              clearable
              @change="selectchange"
            >
              <el-option-group
                v-for="group in selectoptions"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-option-group>
            </el-select>
          </div>
          <div>
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              @close="handleClose(tag)"
              style="margin-left: 5px"
            >
              {{ tag }}
            </el-tag>
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
            <el-button
              icon="el-icon-upload2"
              @click="dialogVisible = true"
              v-if="['ROOT', 'ADMIN', 'CREATOR'].includes(userRole)"
              >导入
            </el-button>
          </div>
          <div class="export refresh">
            <el-button
              icon="el-icon-download"
              @click="exportExcel"
              v-if="['ROOT', 'ADMIN', 'CREATOR'].includes(userRole)"
              >导出
            </el-button>
          </div>
        </div>
        <div class="oper-btns-right">
          <el-button
            class="bigdel-btn"
            icon="el-icon-delete"
            @click="delectAll"
            v-if="['ROOT', 'ADMIN', 'CREATOR'].includes(userRole)"
            >批量删除</el-button
          >
        </div>
      </div>
      <!-- table -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        stripe
        class="tablestyle"
        style="width: 100%"
        id="outTable"
        @selection-change="handleDetailSelectionChange"
      >
        <el-table-column type="selection" width="44"></el-table-column>
        <el-table-column prop="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="name" label="设备名称"></el-table-column>
        <el-table-column prop="brand" label="设备品牌"></el-table-column>
        <el-table-column prop="type" label="设备型号"></el-table-column>
        <el-table-column
          prop="deviceNo"
          label="设备编号"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="crux"
          label="关键设备"
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
            :label="item.label"
            :key="index"
            :width="item.width"
          ></el-table-column>
        </template>
        <el-table-column
          prop="setting"
          label="操作"
          width="200"
          v-if="['ROOT', 'ADMIN', 'CREATOR'].includes(userRole)"
        >
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)">修改</el-button>
            <el-button @click="handleCode(scope.row)">编码</el-button>
            <el-button @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" v-if="!ifsearch">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15, 30, 50, 100]"
          :page-size="page_size"
          layout="sizes,total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-main>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="35%">
      <div
        style="
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        "
      >
        <el-upload
          ref="upload"
          drag
          action="http://1.15.236.205/api/device/import"
          multiple
          :http-request="UpLoad"
          :auto-upload="false"
          accept=".xlsx"
          :on-preview="handlePreview"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传 xlsx 文件</div>
        </el-upload>
        <div style="margin-top: 10px">
          <el-button
            style="
              border: 0;
              background: #409eff;
              color: #fff;
              font-weight: bold;
            "
            @click="submitUpload"
            >确认上传</el-button
          >
        </div>
      </div>
    </el-dialog>
    <!-- 搜索条件 -->
    <el-dialog title="搜索条件" :visible.sync="dialogSearchVisible" width="35%">
      <el-input
        v-model="selectmodel"
        placeholder="请输入搜索内容"
        v-if="ExtraInfo_String.includes(selectvalue)"
      ></el-input>
      <el-input
        v-model="selectmodel"
        type="number"
        placeholder="请输入搜索内容"
        v-if="ExtraInfo_Int.includes(selectvalue)"
      ></el-input>
      <el-radio-group
        v-model="selectmodel"
        v-if="ExtraInfo_Bool.includes(selectvalue)"
      >
        <el-radio-button label="是"></el-radio-button>
        <el-radio-button label="否"></el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-model="selectmodel"
        v-if="ExtraInfo_Date.includes(selectvalue)"
        type="daterange"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSearchVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitselect">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import axios from "axios";
// import XLSX from "xlsx";
// import FileSaver from "file-saver";
import globaldata from "../GlobalData/globaldata";

export default {
  name: "DeviceInformation",
  components: {},
  data() {
    return {
      ifsearch: false,
      selectoptions: [
        {
          label: "基本字段",
          options: [
            {
              value: "name",
              label: "设备名称",
            },
            {
              value: "brand",
              label: "设备品牌",
            },
            {
              value: "type",
              label: "设备型号",
            },
            {
              value: "deviceNo",
              label: "设备编号",
            },
            {
              value: "clazz",
              label: "设备分类",
            },
          ],
        },
        {
          label: "附加字段",
          options: [],
        },
      ],
      ExtraInfo_Date: [], // 日期型附加字段
      ExtraInfo_String: ["name", "brand", "type", "deviceNo", "clazz"], // 字符型附加字段
      ExtraInfo_Int: [], // 整数型附加字段
      ExtraInfo_Bool: [], // 布尔型附加字段
      selectvalue: "",
      selectmodel: "",
      dialogSearchVisible: false,
      selectInfo: [],
      dynamicTags: [], // 搜索标签

      /* 上传、导出 */
      dialogVisible: false, //上传文件对话框
      fileList: [], //上传文件列表
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
      currentPage: 1, //  页面显示的当前页数
      page_size: 15, //  页面显示的每页显示条数
      page: 1, // 当前页数
      total: 0, // 总数
    };
  },
  methods: {
    //单选框选中数据
    handleDetailSelectionChange(selection) {
      this.checkedDetail = selection;
    },
    selectchange() {
      this.dialogSearchVisible = true;
      this.selectmodel = "";
    },
    submitselect() {
      if (this.ExtraInfo_Date.includes(this.selectvalue)) {
        if (this.selectmodel == null) {
          this.$message({
            message: "请选择起止日期",
            type: "warning",
          });
        } else if (
          new Date(this.selectmodel[0]).getTime() > new Date().getTime() ||
          new Date(this.selectmodel[1]).getTime() > new Date().getTime()
        ) {
          this.$message({
            message: "开始或结束日期必须小于今天",
            type: "warning",
          });
        } else {
          this.dialogSearchVisible = false;
          this.selectInfo.push({
            ziduan: this.selectvalue,
            value: this.selectmodel,
          });
          this.dynamicTags.push(this.selectvalue + " / " + this.selectmodel);
        }
      } else {
        if (this.selectmodel == "") {
          this.$message({
            message: "请将查询信息填写完整",
            type: "warning",
          });
        } else {
          this.dialogSearchVisible = false;
          this.selectInfo.push({
            ziduan: this.selectvalue,
            value: this.selectmodel,
          });
          this.dynamicTags.push(this.selectvalue + " / " + this.selectmodel);
        }
      }
    },
    // 标签移除
    handleClose(tag) {
      let index = this.dynamicTags.indexOf(tag);
      console.log(index);
      this.dynamicTags.splice(index, 1);
      this.selectInfo.splice(index, 1);
    },
    // 搜索
    search() {
      let that = this;
      let url = "";
      let exportURL = "";
      let index = 1;
      that.ifsearch = true;
      console.log(that.selectInfo);
      if (globaldata.extrainfo_Date.includes(that.selectInfo[0].ziduan)) {
        url =
          "device/query?" +
          that.selectInfo[0].ziduan +
          "=B" +
          that.selectInfo[0].value;
        exportURL =
          "device/export?" +
          that.selectInfo[0].ziduan +
          "=B" +
          that.selectInfo[0].value;
      } else {
        url =
          "device/query?" +
          that.selectInfo[0].ziduan +
          "=L" +
          that.selectInfo[0].value;
        exportURL =
          "device/export?" +
          that.selectInfo[0].ziduan +
          "=L" +
          that.selectInfo[0].value;
      }
      if (that.selectInfo.length == 1) {
        that.exporturl = exportURL;
        that
          .request(url, {}, "GET")
          .then((res) => {
            console.log(res.data);
            that.tableData = [];
            if (res.data.content.length == 0) {
              that.$message({
                message: "无结果",
                type: "warning",
              });
            } else {
              that.total = res.data.totalElements;
              that.currentPage = 1;
              for (var i = 0; i < res.data.content.length; i++) {
                let obj = {};
                obj.id = res.data.content[i].id;
                obj.index = index++;
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
                  obj.crux = "true";
                } else if (res.data.content[i].crux == false) {
                  obj.crux = "false";
                }
                obj.clazz = res.data.content[i].clazz;
                that.tableData.push(obj);
              }
              that.$message({
                message: "查询成功",
                type: "success",
              });

              // 搜索条件存入全局变量
              globaldata.deviceselectInfo = that.selectInfo;
              globaldata.devicedynamicTags = that.dynamicTags;
            }
          })
          .catch((res) => {
            that.$message({
              message: res.response.data.message,
              type: "error",
            });
          });
      } else {
        console.log(globaldata.extrainfo_Date);
        for (let i = 1; i < that.selectInfo.length; i++) {
          if (globaldata.extrainfo_Date.includes(that.selectInfo[i].ziduan)) {
            url +=
              "&" + that.selectInfo[i].ziduan + "=B" + that.selectInfo[i].value;
            exportURL +=
              "&" + that.selectInfo[i].ziduan + "=B" + that.selectInfo[i].value;
          } else {
            url +=
              "&" + that.selectInfo[i].ziduan + "=L" + that.selectInfo[i].value;
            exportURL +=
              "&" + that.selectInfo[i].ziduan + "=L" + that.selectInfo[i].value;
          }
        }
        that.exporturl = exportURL;
        that
          .request(url, {}, "GET")
          .then((res) => {
            console.log(res.data);
            that.tableData = [];
            if (res.data.content.length == 0) {
              that.$message({
                message: "无结果",
                type: "warning",
              });
            } else {
              that.total = res.data.totalElements;
              that.currentPage = 1;
              for (var i = 0; i < res.data.content.length; i++) {
                let obj = {};
                obj.id = res.data.content[i].id;
                obj.index = index++;
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
                  obj.crux = "true";
                } else if (res.data.content[i].crux == false) {
                  obj.crux = "false";
                }
                obj.clazz = res.data.content[i].clazz;
                that.tableData.push(obj);
              }
              that.$message({
                message: "查询成功",
                type: "success",
              });

              // 搜索条件存入全局变量
              globaldata.deviceselectInfo = that.selectInfo;
              globaldata.devicedynamicTags = that.dynamicTags;
            }
          })
          .catch((res) => {
            that.$message({
              message: res.response.data.message,
              type: "error",
            });
          });
      }
    },
    // 获取全部全部信息
    getAllDevice() {
      let that = this;
      let index = 1;
      that.ifsearch = false;
      let url = "device?page=0&size=" + that.page_size;
      that
        .request(url, {}, "GET")
        .then((res) => {
          console.log(res.data);
          that.tableData = [];
          that.total = res.data.totalElements;
          that.currentPage = 1;
          for (var i = 0; i < res.data.content.length; i++) {
            let obj = {};
            obj.id = res.data.content[i].id;
            obj.index = index++;
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
              obj.crux = "true";
            } else if (res.data.content[i].crux == false) {
              obj.crux = "false";
            }
            obj.clazz = res.data.content[i].clazz;
            that.tableData.push(obj);
          }
          this.$message({
            message: "已获取全部设备",
            type: "success",
          });
          // 清空搜索条件，等待下次搜索
          that.selectInfo = [];
          that.selectvalue = "";
          that.selectmodel = "";
          that.dynamicTags = [];
          globaldata.deviceselectInfo = [];
          globaldata.devicedynamicTags = [];

          // 改变导出url
          that.exporturl = "device/export?name=! ";
        })
        .catch((res) => {
          that.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
    },
    // 导入
    handlePreview(file, fileList) {
      console.log(file, fileList);
    },
    UpLoad(val) {
      let that = this;
      let fd = new FormData();
      fd.append("file", val.file);
      that
        .request("device/import", fd, "POST")
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            that.dialogVisible = false;
            that.$message({
              message: "上传成功",
              type: "success",
            });
            setTimeout(function () {
              that.getAllDevice();
            }, 200);
          }
        })
        .catch((res) => {
          console.log(res);
          that.$message({
            message: res.response.data.message,
            type: "error",
          });
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
      console.log(that.exporturl);
      // that
      //   .request(
      //     that.exporturl,
      //     {
      //       responseType: "blob", // 二进制流
      //     },
      //     "GET"
      //   )
      that
        .request(that.exporturl, {}, "GET", {}, "blob")
        // axios
        //   .get("http://1.15.236.205/api/" + that.exporturl, {
        //     responseType: "blob", // 二进制流
        //   })
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
        })
        .catch((res) => {
          that.$message({
            message: res.response.data.message,
            type: "error",
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
          .$confirm(
            "删除后无法更改, 是否确定?（当前页全选仅删除当前页的设备）",
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
                if (element.id == e.id) {
                  console.log(that.tableData[i]);
                  let url = "device/" + that.tableData[i].id;
                  that.request(url, {}, "DELETE").catch((res) => {
                    that.$message({
                      message: res.response.data.message,
                      type: "error",
                    });
                  });
                }
              });
            });
            setTimeout(function () {
              that.getAllDevice();
              setTimeout(function () {
                that.getAllDevice();
              }, 1000);
            }, 1000);
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
    handleEdit(row) {
      console.log(row);
      let that = this;
      let obj = {};
      obj.id = row.id;
      obj.name = row.name;
      obj.brand = row.brand;
      obj.type = row.type;
      obj.deviceNo = row.deviceNo;
      obj.crux = row.crux;
      obj.clazz = row.clazz;
      that
        .request("device/info-field", {}, "GET")
        .then((res) => {
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
        })
        .catch((res) => {
          this.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
    },
    // 生成编码
    handleCode(row) {
      console.log(row);
      this.$router.push({
        path: "./code",
        query: row,
      });
    },
    // 删除单个行
    handleDelete(row) {
      let that = this;
      this.$confirm("删除后无法更改, 是否确定?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let url = "device/" + row.id;
          that
            .request(url, {}, "DELETE")
            .then((res) => {
              if (res.data.message == "ok") {
                this.getAllDevice();
              }
            })
            .catch((res) => {
              that.$message({
                message: res.response.data.message,
                type: "error",
              });
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
      let index = 1;
      that.tableData = [];
      console.log(val);
      that.page_size = val;
      let url = "device?page=0" + "&size=" + that.page_size;
      that
        .request(url, {}, "GET")
        .then((res) => {
          that.total = res.data.totalElements;
          that.currentPage = 1;
          for (var i = 0; i < res.data.content.length; i++) {
            let obj = {};
            obj.id = res.data.content[i].id;
            obj.index = index++;
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
              obj.crux = "true";
            } else if (res.data.content[i].crux == false) {
              obj.crux = "false";
            }
            obj.clazz = res.data.content[i].clazz;
            that.tableData.push(obj);
          }
          // 清空搜索条件，等待下次搜索
          that.selectInfo = [];
          that.selectvalue = "";
          that.selectmodel = "";
          that.dynamicTags = [];
          globaldata.deviceselectInfo = [];
          globaldata.devicedynamicTags = [];

          // 改变导出url
          that.exporturl = "device/export?name=! ";
        })
        .catch((res) => {
          that.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
    },
    // 页变化
    handleCurrentChange(val) {
      let that = this;
      let index = 1;
      that.page = val;
      that.currentPage = val;
      console.log(val);
      let url = "device?page=" + (that.page - 1) + "&size=" + that.page_size;
      that
        .request(url, {}, "GET")
        .then((res) => {
          that.tableData = [];
          that.total = res.data.totalElements;
          for (var i = 0; i < res.data.content.length; i++) {
            let obj = {};
            obj.id = res.data.content[i].id;
            obj.index = index++;
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
              obj.crux = "true";
            } else if (res.data.content[i].crux == false) {
              obj.crux = "false";
            }
            obj.clazz = res.data.content[i].clazz;
            that.tableData.push(obj);
          }
          // 清空搜索条件，等待下次搜索
          that.selectInfo = [];
          that.selectvalue = "";
          that.selectmodel = "";
          that.dynamicTags = [];
          globaldata.deviceselectInfo = [];
          globaldata.devicedynamicTags = [];

          // 改变导出url
          that.exporturl = "device/export?name=! ";
        })
        .catch((res) => {
          that.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
    },
  },
  created: function () {
    let that = this;
    that.userRole = that.globaldata.userRole;
    // 先检查是否有搜索记录
    if (globaldata.deviceselectInfo.length != 0) {
      console.log(globaldata.deviceselectInfo);
      that.selectInfo = globaldata.deviceselectInfo;
      that.dynamicTags = globaldata.devicedynamicTags;
      that.search();
    } else {
      setTimeout(function () {
        // 获取所有附加字段
        that
          .request("device/info-field", {}, "GET")
          .then((res) => {
            console.log(res.data);
            for (let i = 0; i < res.data.length; i++) {
              let obj = {};
              obj.label = res.data[i].name;
              obj.width = "130";
              obj.prop = res.data[i].id;
              that.tableHead.push(obj);
            }
            for (let i = 0; i < res.data.length; i++) {
              that.selectoptions[1].options.push({
                value: res.data[i].id,
                label: res.data[i].name,
              });
              switch (res.data[i].type) {
                case "String":
                  that.ExtraInfo_String.push(res.data[i].id);
                  break;
                case "Integer":
                  that.ExtraInfo_Int.push(res.data[i].id);
                  break;
                case "Bool":
                  that.ExtraInfo_Bool.push(res.data[i].id);
                  break;
                case "Date":
                  that.ExtraInfo_Date.push(res.data[i].id);
                  globaldata.extrainfo_Date = [];
                  globaldata.extrainfo_Date.push(res.data[i].id);
                  break;
                default:
                  break;
              }
            }
          })
          .catch((res) => {
            that.$message({
              message: res.response.data.message,
              type: "error",
            });
          });
        // 获取所有设备
        that.getAllDevice();
      }, 200);
    }
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
        border-right: 1px solid #e9ecf2;
      }
      &:nth-child(2) {
        border-right: 1px solid #e9ecf2;
      }
      .cell {
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
      }
      .cell {
        color: #333;
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
