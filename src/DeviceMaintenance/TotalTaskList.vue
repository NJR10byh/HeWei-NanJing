<template>
  <div class="Container-TotalTaskList">
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
            style="margin-left:5px;"
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
            style="margin-left:5px;"
          >
            {{ tag }}
          </el-tag>
        </div>
        <div class="search">
          <el-button icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <div class="refresh">
          <el-button icon="el-icon-refresh" @click="refresh"
            >刷新列表
          </el-button>
        </div>
      </div>
      <div class="oper-btns-right" v-if="['ROOT', 'ADMIN'].includes(userRole)">
        <el-button
          class="bigdel-btn"
          icon="el-icon-delete"
          @click="delectExtraInfo"
          >批量删除</el-button
        >
      </div>
    </div>
    <!-- table -->
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
      <el-table-column prop="id" label="任务ID" width="100"></el-table-column>
      <el-table-column prop="name" label="任务名称"></el-table-column>
      <el-table-column prop="nextDate" label="下次保养时间"></el-table-column>
      <el-table-column prop="deadline" label="剩余天数"></el-table-column>
      <el-table-column
        prop="taskuser"
        label="保养人员代表"
        v-if="['ROOT', 'ADMIN', 'CREATOR', 'SUPERVISOR'].includes(userRole)"
      ></el-table-column>
      <el-table-column
        prop="setting"
        label="操作"
        width="200"
        v-if="['ROOT', 'ADMIN', 'CREATOR', 'SUPERVISOR'].includes(userRole)"
      >
        <template slot-scope="scope">
          <el-button @click="handleDetail(scope.$index, scope.row)"
            >详情</el-button
          >
          <el-button @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button
          >
          <el-button @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="setting" label="操作" width="160" v-else>
        <template slot-scope="scope">
          <el-button @click="handleDetail(scope.$index, scope.row)"
            >查看任务详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="sizes,total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div> -->
    <!-- 搜索条件 -->
    <el-dialog title="搜索条件" :visible.sync="dialogSearchVisible" width="35%">
      <el-input
        v-model="selectmodel"
        placeholder="请输入搜索内容"
        v-if="selectvalue == 'name'"
      ></el-input>

      <!-- 保养周期 -->
      <el-select
        v-model="scheduleTypevalue"
        placeholder="请选择保养周期"
        filterable
        clearable
        v-if="selectvalue == 'scheduleType'"
      >
        <el-option-group
          v-for="group in scheduleTypeoptions"
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

      <!-- 设备 -->
      <el-select
        v-model="devicevalue"
        placeholder="请选择设备"
        filterable
        clearable
        v-if="selectvalue == 'device'"
      >
        <el-option-group
          v-for="group in deviceoptions"
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

      <!-- 保养人员 -->
      <el-select
        v-model="opsvalue"
        placeholder="请选择保养人员"
        filterable
        clearable
        v-if="selectvalue == 'ops'"
      >
        <el-option-group
          v-for="group in opsoptions"
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

      <el-date-picker
        v-model="datevalue"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        v-if="selectvalue == 'startDate'"
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
import axios from "axios";
import globaldata from "../GlobalData/globaldata";

export default {
  created: function() {
    let that = this;
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      console.log(res.data);
      that.userRole = res.data.role;
    });
    if (globaldata.taskselectInfo.length != 0) {
      that.selectInfo = globaldata.taskselectInfo;
      that.dynamicTags = globaldata.taskdynamicTags;
      that.search();
    } else {
      setTimeout(() => {
        that.refresh();
      }, 300);
    }

    // 获取全部设备
    axios({
      method: "GET",
      url: "http://47.102.214.37:8080/device?page=0&size=100",
    })
      .then((res) => {
        for (var i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.value = res.data.content[i].id;
          obj.label =
            res.data.content[i].name +
            " (" +
            res.data.content[i].deviceNo +
            ")";
          that.deviceoptions[0].options.push(obj);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // 获取全部OPERATOR
    axios
      .get("http://47.102.214.37:8080/user/query?role==OPERATOR")
      .then((res) => {
        console.log(res.data);
        for (let i = 0; i < res.data.content.length; i++) {
          that.opsoptions[0].options.push({
            value: res.data.content[i].id,
            label:
              res.data.content[i].name +
              " (用户名：" +
              res.data.content[i].username +
              ")",
          });
        }
      });
  },
  data() {
    return {
      userRole: "",
      tableData: [],
      checkedDetail: [],
      /* 搜索 */
      selectoptions: [
        {
          label: "字段",
          options: [
            {
              value: "name",
              label: "任务名称",
            },
            {
              value: "scheduleType",
              label: "保养周期",
            },
            {
              value: "device",
              label: "设备",
            },
            {
              value: "ops",
              label: "人员",
            },
            {
              value: "startDate",
              label: "开始时间",
            },
          ],
        },
      ],
      selectvalue: "",
      selectmodel: "",
      dialogSearchVisible: false,
      selectInfo: [],
      dynamicTags: [], // 搜索标签

      // 保养周期
      scheduleTypevalue: "",
      scheduleTypeoptions: [
        {
          label: "保养周期",
          options: [
            {
              value: "Monthly",
              label: "月保养",
            },
            {
              value: "Yearly",
              label: "年保养",
            },
            {
              value: "Seasonly",
              label: "季度保养",
            },
            {
              value: "Daily",
              label: "日保养",
            },
            {
              value: "Weeklt",
              label: "周保养",
            },
          ],
        },
      ],

      // 设备
      devicevalue: "",
      deviceoptions: [
        {
          label: "设备列表",
          options: [],
        },
      ],

      // 人员
      opsvalue: "",
      opsoptions: [
        {
          label: "人员列表",
          options: [],
        },
      ],

      // 开始时间
      datevalue: "",

      // 分页
      currentPage: 1,
      page: 1,
      size: 10,
      total: 0,
    };
  },
  methods: {
    //单选框选中数据
    handleDetailSelectionChange(selection) {
      this.checkedDetail = selection;
      console.log(this.checkedDetail);
    },
    selectchange() {
      this.dialogSearchVisible = true;
    },
    submitselect() {
      this.dialogSearchVisible = false;
      if (this.selectvalue == "scheduleType") {
        this.selectInfo.push({
          ziduan: this.selectvalue,
          value: this.scheduleTypevalue,
        });
        this.dynamicTags.push(
          this.selectvalue + " / " + this.scheduleTypevalue
        );
      } else if (this.selectvalue == "device") {
        this.selectInfo.push({
          ziduan: this.selectvalue,
          value: this.devicevalue,
        });
        this.dynamicTags.push(this.selectvalue + " / " + this.devicevalue);
      } else if (this.selectvalue == "ops") {
        console.log(this.opsvalue);
        this.selectInfo.push({
          ziduan: this.selectvalue,
          value: this.opsvalue,
        });
        this.dynamicTags.push(this.selectvalue + " / " + this.opsvalue);
      } else if (this.selectvalue == "startDate") {
        console.log(this.opsvalue);
        this.selectInfo.push({
          ziduan: this.selectvalue,
          value: this.datevalue,
        });
        this.dynamicTags.push(this.selectvalue + " / " + this.datevalue);
      } else {
        this.selectInfo.push({
          ziduan: this.selectvalue,
          value: this.selectmodel,
        });
        this.dynamicTags.push(this.selectvalue + " / " + this.selectmodel);
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
      if (that.selectInfo[0].ziduan == "name") {
        url =
          "http://47.102.214.37:8080/ops/query?" +
          that.selectInfo[0].ziduan +
          "=L" +
          that.selectInfo[0].value +
          "%25";
      } else {
        url =
          "http://47.102.214.37:8080/ops/query?" +
          that.selectInfo[0].ziduan +
          "==" +
          that.selectInfo[0].value;
      }
      if (that.selectInfo.length == 1) {
        // that.exporturl = url;
        axios.get(url).then((res) => {
          console.log(res.data);
          that.tableData = [];
          that.total = res.data.totalElements;
          that.currentPage = 1;
          if (res.data.content.length == 0) {
            that.$message({
              message: "无结果",
              type: "warning",
            });
          } else {
            for (let i = 0; i < res.data.content.length; i++) {
              let obj = {};
              obj.id = res.data.content[i].id;
              obj.name = res.data.content[i].name;
              setTimeout(() => {
                let url =
                  "http://47.102.214.37:8080/user/" +
                  res.data.content[i].ops[0].id;
                axios.get(url).then((res) => {
                  obj.taskuser = res.data.name + " ( ID：" + res.data.id + " )";
                });
                setTimeout(() => {
                  let URL =
                    "http://47.102.214.37:8080/ops/schedule/status/" +
                    res.data.content[i].id;
                  axios.get(URL).then((res) => {
                    if (res.data.nextDate == null) {
                      obj.nextDate = "暂无";
                    } else {
                      obj.nextDate = res.data.nextDate;
                    }
                    if (res.data.nextDateDay == null) {
                      obj.deadline = "暂无";
                    } else {
                      obj.deadline = res.data.nextDateDay;
                    }
                  });
                  setTimeout(() => {
                    that.tableData.push(obj);
                  }, 400);
                }, 300);
              }, 300);
            }
            // 搜索条件存入全局变量
            globaldata.taskselectInfo = that.selectInfo;
            globaldata.taskdynamicTags = that.dynamicTags;

            setTimeout(() => {
              that.$message({
                message: "查询成功",
                type: "success",
              });
            }, 800);
          }
        });
      } else {
        for (let i = 1; i < that.selectInfo.length; i++) {
          if (that.selectInfo[i].ziduan == "name") {
            url =
              url +
              "&" +
              that.selectInfo[i].ziduan +
              "=L" +
              that.selectInfo[i].value +
              "%25";
          } else {
            url =
              url +
              "&" +
              that.selectInfo[i].ziduan +
              "==" +
              that.selectInfo[i].value;
          }
        }
        // that.exporturl = url;
        axios.get(url).then((res) => {
          console.log(res.data);
          that.tableData = [];
          that.total = res.data.totalElements;
          that.currentPage = 1;
          for (let i = 0; i < res.data.content.length; i++) {
            let obj = {};
            obj.id = res.data.content[i].id;
            obj.name = res.data.content[i].name;
            setTimeout(() => {
              let url =
                "http://47.102.214.37:8080/user/" +
                res.data.content[i].ops[0].id;
              axios.get(url).then((res) => {
                obj.taskuser = res.data.name + " ( ID：" + res.data.id + " )";
              });
              setTimeout(() => {
                let URL =
                  "http://47.102.214.37:8080/ops/schedule/status/" +
                  res.data.content[i].id;
                axios.get(URL).then((res) => {
                  if (res.data.nextDate == null) {
                    obj.nextDate = "暂无";
                  } else {
                    obj.nextDate = res.data.nextDate;
                  }
                  if (res.data.nextDateDay == null) {
                    obj.deadline = "暂无";
                  } else {
                    obj.deadline = res.data.nextDateDay;
                  }
                });
                setTimeout(() => {
                  that.tableData.push(obj);
                }, 400);
              }, 300);
            }, 300);
          }
          // 搜索条件存入全局变量
          globaldata.taskselectInfo = that.selectInfo;
          globaldata.taskdynamicTags = that.dynamicTags;

          setTimeout(() => {
            that.$message({
              message: "查询成功",
              type: "success",
            });
          }, 800);
        });
      }
    },

    // 刷新列表
    refresh() {
      let that = this;
      that.tableData = [];
      if (["ROOT", "ADMIN", "CREATOR", "SUPERVISOR"].includes(that.userRole)) {
        axios
          .get("http://47.102.214.37:8080/ops/schedule?page=0&size=100")
          .then((res) => {
            console.log(res.data);
            for (let i = 0; i < res.data.content.length; i++) {
              let obj = {};
              obj.id = res.data.content[i].id;
              obj.name = res.data.content[i].name;
              setTimeout(() => {
                let url =
                  "http://47.102.214.37:8080/user/" +
                  res.data.content[i].ops[0].id;
                axios.get(url).then((res) => {
                  obj.taskuser = res.data.name + " ( ID：" + res.data.id + " )";
                });
                setTimeout(() => {
                  let URL =
                    "http://47.102.214.37:8080/ops/schedule/status/" +
                    res.data.content[i].id;
                  axios.get(URL).then((res) => {
                    if (res.data.nextDate == null) {
                      obj.nextDate = "暂无";
                    } else {
                      obj.nextDate = res.data.nextDate;
                    }
                    if (res.data.nextDateDay == null) {
                      obj.deadline = "暂无";
                    } else {
                      obj.deadline = res.data.nextDateDay;
                    }
                  });
                  setTimeout(() => {
                    that.tableData.push(obj);
                  }, 400);
                }, 300);
              }, 300);
            }
            setTimeout(() => {
              that.$message({
                message: "刷新成功",
                type: "success",
              });
            }, 800);
          });
      } else {
        let URL = "http://47.102.214.37:8080/my/schedule";
        axios.get(URL).then((res) => {
          console.log(res.data);
          for (let i = 0; i < res.data.length; i++) {
            let obj = {};
            obj.id = res.data[i].id;
            obj.name = res.data[i].name;
            let url =
              "http://47.102.214.37:8080/user/query?id==" +
              res.data[i].ops[0].id;
            axios.get(url).then((res) => {
              console.log(res.data);
              obj.taskuser =
                res.data.content[0].name +
                " ( ID：" +
                res.data.content[0].id +
                " )";
            });
            setTimeout(() => {
              let URL =
                "http://47.102.214.37:8080/ops/schedule/status/" +
                res.data[i].id;
              axios.get(URL).then((res) => {
                console.log(res.data);
                if (res.data.nextDate == null) {
                  obj.nextDate = "暂无";
                } else {
                  obj.nextDate = res.data.nextDate;
                }
                if (res.data.nextDateDay == null) {
                  obj.deadline = "暂无";
                } else {
                  obj.deadline = res.data.nextDateDay;
                }
              });
              setTimeout(() => {
                that.tableData.push(obj);
              }, 200);
            }, 300);
          }
        });
      }
      // 清空搜索条件，等待下次搜索
      that.selectInfo = [];
      that.selectvalue = "";
      that.selectmodel = "";
      that.dynamicTags = [];
      globaldata.taskselectInfo = [];
      globaldata.taskdynamicTags = [];
    },
    // 任务详情
    handleDetail(index) {
      console.log(this.tableData[index]);
      this.$router.push({
        path: "/taskDetailInfo",
        query: this.tableData[index],
      });
    },
    // 修改任务
    handleEdit(index) {
      console.log(this.tableData[index]);
      let obj = {};
      obj.taskID = this.tableData[index].id;
      this.$router.push({
        path: "/editTask",
        query: obj,
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
            "http://47.102.214.37:8080/ops/schedule/" + that.taskData[index].id;
          axios.delete(url).then((res) => {
            if (res.status == 200) {
              that.taskData.splice(index, 1);
              this.$message({
                message: "删除成功",
                type: "success",
              });
            }
          });
        })
        .catch(() => {
          that.$message.info("已取消删除");
        });
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
          .$confirm("此用户将被永久删除, \n是否确定?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            that.checkedDetail.forEach((element) => {
              that.tableData.forEach((e, i) => {
                if (element.id == e.id) {
                  console.log(element, e, i);
                  let url = "http://47.102.214.37:8080/ops/schedule/" + e.id;
                  axios.delete(url).then(() => {
                    this.$message({
                      message: "删除成功",
                      type: "success",
                    });
                    that.tableData.splice(i, 1);
                    that.checkedDetail.pop();
                    that.total--;
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
    // // 表格方法
    // handleSizeChange(val) {
    //   // console.log(`每页 ${val} 条`);
    //   let that = this;
    //   console.log(val);
    //   that.size = val;
    //   let url =
    //     "http://47.102.214.37:8080/device?page=0" + "&size=" + that.size;
    //   console.log(url);
    //   axios.get(url).then((res) => {
    //     console.log(res.data);
    //     that.tableData = [];
    //     for (var i = 0; i < res.data.content.length; i++) {
    //       let obj = {};
    //       obj.id = res.data.content[i].id;
    //       obj.name = res.data.content[i].name;
    //       obj["brand"] = res.data.content[i].brand;
    //       obj.type = res.data.content[i].type;
    //       obj.deviceNo = res.data.content[i].deviceNo;
    //       if (res.data.content[i].extra.length != 0) {
    //         for (var j = 0; j < res.data.content[i].extra.length; j++) {
    //           obj[res.data.content[i].extra[j].field.id] =
    //             res.data.content[i].extra[j].value;
    //         }
    //       }
    //       if (res.data.content[i].crux == true) {
    //         obj.crux = "Y";
    //       } else if (res.data.content[i].crux == false) {
    //         obj.crux = "N";
    //       }
    //       obj.clazz = res.data.content[i].clazz;
    //       that.tableData.push(obj);
    //     }
    //   });
    // },
    // // 页变化
    // handleCurrentChange(val) {
    //   let that = this;
    //   that.page = val;
    //   that.currentPage = val;
    //   console.log(val);
    //   let url =
    //     "http://47.102.214.37:8080/device?page=" +
    //     (that.page - 1) +
    //     "&size=" +
    //     that.size;
    //   axios.get(url).then((res) => {
    //     // console.log(res.data);
    //     that.tableData = [];
    //     for (var i = 0; i < res.data.content.length; i++) {
    //       let obj = {};
    //       obj.id = res.data.content[i].id;
    //       obj.name = res.data.content[i].name;
    //       obj["brand"] = res.data.content[i].brand;
    //       obj.type = res.data.content[i].type;
    //       obj.deviceNo = res.data.content[i].deviceNo;
    //       if (res.data.content[i].extra.length != 0) {
    //         for (var j = 0; j < res.data.content[i].extra.length; j++) {
    //           obj[res.data.content[i].extra[j].field.id] =
    //             res.data.content[i].extra[j].value;
    //         }
    //       }
    //       if (res.data.content[i].crux == true) {
    //         obj.crux = "Y";
    //       } else if (res.data.content[i].crux == false) {
    //         obj.crux = "N";
    //       }
    //       obj.clazz = res.data.content[i].clazz;
    //       that.tableData.push(obj);
    //     }
    //   });
    // },
  },
};
</script>
<style lang="scss">
.Container-TotalTaskList {
  width: 100%;
  padding: 10px 0;
  // border: 1px solid red;
  display: flex;
  flex-direction: column;
  align-items: center;
  .head-btn {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 5px;
    // border: 1px solid red;
    .oper-btns-left {
      // border: 1px solid red;
      display: flex;
      justify-content: center;
      align-items: center;
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
  .el-pagination {
    text-align: center;
    display: flex;
    justify-content: center;
    margin-top: 10px;
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
      .el-button {
        border: none;
        padding: 5px 10px;
        background: transparent;
        &:first-child:hover {
          color: #409eff;
        }
        &:nth-child(2):hover {
          color: #f96b6c;
        }
      }
    }
  }
}
</style>
