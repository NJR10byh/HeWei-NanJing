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
          <el-button icon="el-icon-refresh" @click="getAllDevice"
            >刷新列表
          </el-button>
        </div>
        <div class="refresh check">
          <el-button
            icon="el-icon-coordinate"
            @click="checkall"
            v-if="['ROOT'].includes(userRole)"
            >立即检查所有保养完成状态
          </el-button>
        </div>
      </div>
      <!-- <div class="oper-btns-right" v-if="['ROOT', 'ADMIN'].includes(userRole)">
        <el-button
          class="bigdel-btn"
          icon="el-icon-delete"
          @click="delectExtraInfo"
          >批量删除</el-button
        >
      </div> -->
    </div>
    <!-- table -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      stripe
      border
      style="width:100%;"
      class="extraTable"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <!-- <el-table-column type="selection"></el-table-column> -->
      <el-table-column prop="id" label="设备ID" width="120"></el-table-column>
      <el-table-column
        prop="devicename"
        label="设备名称"
        width="240"
      ></el-table-column>
      <el-table-column
        prop="deviceNo"
        label="设备编号"
        width="240"
      ></el-table-column>
      <el-table-column
        prop="taskname"
        label="保养标准"
        :width="tablewidth"
      ></el-table-column>
      <el-table-column
        prop="taskno"
        label="保养编号"
        :width="tablewidth"
      ></el-table-column>
      <el-table-column
        prop="nextDate"
        label="下次保养时间"
        :width="tablewidth"
      ></el-table-column>
      <el-table-column
        prop="opuser"
        label="人员"
        :width="tablewidth"
      ></el-table-column>
      <el-table-column
        prop="deadline"
        label="剩余天数"
        :width="tablewidth"
      ></el-table-column>
      <el-table-column
        prop="setting"
        label="操作"
        width="200"
        v-if="['ROOT', 'ADMIN', 'CREATOR', 'SUPERVISOR'].includes(userRole)"
      >
        <template slot-scope="scope">
          <el-button
            @click="handleDetail(scope.row)"
            v-if="
              scope.row.taskname != undefined && ['OPERATOR'].includes(userRole)
            "
            >执行</el-button
          >
          <el-button
            @click="handleDetail(scope.row)"
            v-if="
              scope.row.taskname != undefined &&
                !['OPERATOR'].includes(userRole)
            "
            >查看</el-button
          >
          <el-button
            @click="handleEdit(scope.row)"
            v-if="scope.row.taskname != undefined"
            >修改</el-button
          >
          <el-button
            @click="handleDelete(scope.row)"
            v-if="scope.row.taskname != undefined"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="setting" label="操作" width="160" v-else>
        <template slot-scope="scope">
          <el-button @click="handleDetail(scope.row)">执行</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-if="!ifsearch && userRole != 'OPERATOR'">
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
        v-model="selectvalue2"
        placeholder="请选择搜索字段"
        filterable
        clearable
        @change="deviceselectchange"
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
      <div v-if="selectvalue == 'device'" style="margin-top:10px;">
        <el-tag
          :key="tag"
          v-for="tag in devicedynamicTags"
          closable
          @close="devicehandleClose(tag)"
          style="margin-left:5px;"
        >
          {{ tag }}
        </el-tag>
      </div>

      <!-- 保养人员 -->
      <el-select
        v-model="opsvalue"
        placeholder="请选择保养人员"
        filterable
        clearable
        multiple
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

      <!-- 开始时间 -->
      <el-date-picker
        v-model="datevalue"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        v-if="selectvalue == 'startDate'"
      >
      </el-date-picker>

      <!-- 时间范围 -->
      <el-date-picker
        v-model="start"
        type="date"
        placeholder="选择开始日期"
        value-format="yyyy-MM-dd"
        v-if="selectvalue == 'timeChoose'"
      >
      </el-date-picker>
      <el-date-picker
        v-model="end"
        type="date"
        placeholder="选择结束日期"
        value-format="yyyy-MM-dd"
        v-if="selectvalue == 'timeChoose'"
        style="margin-top:20px;"
      >
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSearchVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitselect">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 搜索条件-设备 -->
    <el-dialog
      title="搜索条件"
      :visible.sync="dialogSearchDeviceVisible"
      width="35%"
    >
      <el-input v-model="devicevalue" placeholder="请输入搜索内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSearchDeviceVisible = false">取 消</el-button>
        <el-button type="primary" @click="devicesubmitselect">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created: function() {
    let that = this;
    that.userRole = that.globaldata.userRole;
    that.userid = that.globaldata.userid;
    if (that.globaldata.taskselectInfo.length != 0) {
      that.selectInfo = that.globaldata.taskselectInfo;
      that.dynamicTags = that.globaldata.taskdynamicTags;
      that.search();
    } else {
      setTimeout(() => {
        that.getAllDevice();
      }, 300);
    }
    // 获取所有附加字段
    that
      .request("device/info-field", {}, "GET")
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          that.deviceoptions[1].options.push({
            value: res.data[i].id,
            label: res.data[i].name,
          });
        }
      })
      .catch((res) => {
        this.$message({
          message: res.response.data.message,
          type: "error",
        });
      });

    // 获取全部OPERATOR
    that
      .request("user/query?role==OPERATOR", {}, "GET")
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
      })
      .catch((res) => {
        this.$message({
          message: res.response.data.message,
          type: "error",
        });
      });
  },
  data() {
    return {
      userRole: "",
      userid: -1,
      tableData: [],
      tablewidth: "150",
      // checkedDetail: [],
      /* 搜索 */
      ifsearch: false,
      selectoptions: [
        {
          label: "字段",
          options: [
            {
              value: "name",
              label: "保养标准",
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
        {
          label: "时间范围",
          options: [
            {
              value: "timeChoose",
              label: "时间范围",
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
              value: "Seasonally",
              label: "季度保养",
            },
            {
              value: "Daily",
              label: "日保养",
            },
            {
              value: "Weekly",
              label: "周保养",
            },
          ],
        },
      ],

      // 设备
      devicevalue: "",
      deviceoptions: [
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
              label: "设备型号/规格",
            },
            {
              value: "deviceNo",
              label: "设备编号",
            },
            {
              value: "crux",
              label: "是否为关键设备",
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
      devicedynamicTags: [], // 设备搜索标签
      selectvalue2: "",
      selectInfo2: [],
      dialogSearchDeviceVisible: false,

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

      /* 时间范围 */
      // 开始
      start: "",
      // 结束
      end: "",
      // 分页
      currentPage: 1, //  页面显示的当前页数
      page_size: 15, //  页面显示的每页显示条数
      page: 1, // 当前页数
      total: 0, // 总数
    };
  },
  methods: {
    // //单选框选中数据
    // handleDetailSelectionChange(selection) {
    //   this.checkedDetail = selection;
    //   console.log(this.checkedDetail);
    // },
    selectchange() {
      this.dialogSearchVisible = true;
    },
    // 设备
    deviceselectchange() {
      this.dialogSearchDeviceVisible = true;
    },
    // 设备选择
    devicesubmitselect() {
      this.dialogSearchDeviceVisible = false;
      this.selectInfo2.push({
        ziduan: this.selectvalue2,
        value: this.devicevalue,
      });
      this.devicedynamicTags.push(this.selectvalue + " / " + this.devicevalue);
    },
    // 搜索设备
    searchDevice() {
      let that = this;
      let arr = [];
      let url = "";
      url =
        "device/query?" +
        that.selectInfo2[0].ziduan +
        "=L" +
        that.selectInfo2[0].value +
        "%25";
      if (that.selectInfo2.length == 1) {
        that
          .request(url, {}, "GET")
          .then((res) => {
            console.log(res.data);
            for (let i = 0; i < res.data.content.length; i++) {
              arr.push(res.data.content[i].id);
            }
            that.selectInfo.push({
              ziduan: "device",
              value: arr,
            });
            that.dynamicTags.push("device / " + arr);
          })
          .catch((res) => {
            this.$message({
              message: res.response.data.message,
              type: "error",
            });
          });
      } else {
        for (let i = 1; i < that.selectInfo2.length; i++) {
          url =
            url +
            "&" +
            that.selectInfo2[i].ziduan +
            "=L" +
            that.selectInfo2[i].value +
            "%25";
        }
        that
          .request(url, {}, "GET")
          .then((res) => {
            console.log(res.data);
            for (let i = 0; i < res.data.content.length; i++) {
              arr.push(res.data.content[i].id);
            }
            that.selectInfo.push({
              ziduan: "device",
              value: arr,
            });
            that.dynamicTags.push("device / " + arr);
          })
          .catch((res) => {
            this.$message({
              message: res.response.data.message,
              type: "error",
            });
          });
      }
    },
    //  设备标签移除
    devicehandleClose(tag) {
      let index = this.devicedynamicTags.indexOf(tag);
      console.log(index);
      this.devicedynamicTags.splice(index, 1);
      this.selectInfo2.splice(index, 1);
    },
    submitselect() {
      let that = this;
      this.dialogSearchVisible = false;
      if (this.selectvalue == "scheduleType") {
        this.selectInfo.push({
          ziduan: this.selectvalue,
          value: this.scheduleTypevalue,
        });
        this.dynamicTags.push(
          this.selectvalue + " / " + this.scheduleTypevalue
        );
      } else if (this.selectvalue == "ops") {
        console.log(this.opsvalue);
        this.selectInfo.push({
          ziduan: this.selectvalue,
          value: this.opsvalue,
        });
        this.dynamicTags.push(this.selectvalue + " / " + this.opsvalue);
      } else if (this.selectvalue == "device") {
        console.log(this.devicevalue);
        that.searchDevice();
      } else if (this.selectvalue == "timeChoose") {
        that.tableData = [];
        that.ifsearch = true;
        // 清空搜索条件，等待下次搜索
        that.selectInfo = [];
        that.selectvalue = "";
        that.selectmodel = "";
        that.dynamicTags = [];
        that.globaldata.deviceselectInfo = [];
        that.globaldata.devicedynamicTags = [];
        let url = "ops/query?startDate=B" + this.start + "," + this.end;
        that
          .request(url, {}, "GET")
          .then((res) => {
            console.log(res.data);
            that.total = res.data.totalElements;
            for (let i = 0; i < res.data.content.length; i++) {
              let obj = {};
              obj.opuser = "";
              obj.devicename = "";
              obj.deviceNo = "";
              obj.id = res.data.content[i].id;
              obj.taskname =
                res.data.content[i].name == null
                  ? "未分配"
                  : res.data.content[i].name;
              obj.taskno =
                res.data.content[i].no == null
                  ? "未分配"
                  : res.data.content[i].no;
              let URL = "ops/schedule/status/" + res.data.content[i].id;
              that
                .request(URL, {}, "GET")
                .then((res) => {
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
                })
                .catch((res) => {
                  this.$message({
                    message: res.response.data.message,
                    type: "error",
                  });
                });
              // 获取设备信息
              setTimeout(() => {
                if (res.data.content[i].device.length == 0) {
                  obj.devicename = "暂未分配";
                  obj.deviceNo = "暂未分配";
                } else {
                  for (let j = 0; j < res.data.content[i].device.length; j++) {
                    let url = "device/" + res.data.content[i].device[j].id;
                    that
                      .request(url, {}, "GET")
                      .then((res) => {
                        obj.devicename += res.data.name + " / ";
                        obj.deviceNo += res.data.deviceNo + " / ";
                      })
                      .catch((res) => {
                        this.$message({
                          message: res.response.data.message,
                          type: "error",
                        });
                      });
                  }
                }

                // 获取人员信息
                setTimeout(() => {
                  if (res.data.content[i].ops.length == 0) {
                    obj.opuser = "暂未分配";
                  } else {
                    for (let k = 0; k < res.data.content[i].ops.length; k++) {
                      let searchops = "user/" + res.data.content[i].ops[k].id;
                      that
                        .request(searchops, {}, "GET")
                        .then((res) => {
                          obj.opuser += res.data.name + " / ";
                        })
                        .catch((res) => {
                          this.$message({
                            message: res.response.data.message,
                            type: "error",
                          });
                        });
                    }
                  }
                  setTimeout(() => {
                    that.tableData.push(obj);
                  }, 600);
                }, 300);
              }, 300);
            }
            setTimeout(() => {
              that.$message({
                message: "刷新成功",
                type: "success",
              });
            }, 600);
          })
          .catch((res) => {
            this.$message({
              message: res.response.data.message,
              type: "error",
            });
          });
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
    // 立即检查所有保养完成状态
    checkall() {
      this.request("root/refresh", {}, "GET")
        .then((res) => {
          console.log(res.data);
          if (res.data.message == "ok") {
            this.$message({
              message: "已更新至最新状态",
              type: "success",
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "更新失败",
            type: "error",
          });
        });
    },
    // 搜索
    search() {
      let that = this;
      let url = "";
      that.ifsearch = true;
      that.tableData = [];
      if (that.selectInfo.length == 0) {
        that.$message({
          message: "请输入搜索字段",
          type: "warning",
        });
      } else {
        // 确定第一部分
        if (that.selectInfo[0].ziduan == "name") {
          url =
            "ops/query?" +
            that.selectInfo[0].ziduan +
            "=L" +
            that.selectInfo[0].value +
            "%25";
        } else {
          console.log(that.selectInfo[0]);
          // 设备、人员支持多选
          if (
            that.selectInfo[0].ziduan == "device" ||
            that.selectInfo[0].ziduan == "ops"
          ) {
            if (that.selectInfo[0].value.length > 1) {
              url =
                "ops/query?" +
                that.selectInfo[0].ziduan +
                "=I" +
                that.selectInfo[0].value[0];
              for (let i = 1; i < that.selectInfo[0].value.length; i++) {
                url = url + "," + that.selectInfo[0].value[i];
              }
            } else {
              url =
                "ops/query?" +
                that.selectInfo[0].ziduan +
                "==" +
                that.selectInfo[0].value;
            }
          } else {
            url =
              "ops/query?" +
              that.selectInfo[0].ziduan +
              "==" +
              that.selectInfo[0].value;
          }
        }
        if (that.selectInfo.length == 1) {
          that
            .request(url, {}, "GET")
            .then((res) => {
              console.log(res.data);
              that.total = res.data.totalElements;
              for (let i = 0; i < res.data.content.length; i++) {
                let obj = {};
                obj.opuser = "";
                obj.devicename = "";
                obj.deviceNo = "";
                obj.id = res.data.content[i].id;
                obj.taskname =
                  res.data.content[i].name == null
                    ? "未分配"
                    : res.data.content[i].name;
                obj.taskno =
                  res.data.content[i].no == null
                    ? "未分配"
                    : res.data.content[i].no;
                let URL = "ops/schedule/status/" + res.data.content[i].id;
                that
                  .request(URL, {}, "GET")
                  .then((res) => {
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
                  })
                  .catch((res) => {
                    this.$message({
                      message: res.response.data.message,
                      type: "error",
                    });
                  });
                // 获取设备信息
                setTimeout(() => {
                  if (res.data.content[i].device.length == 0) {
                    obj.devicename = "暂未分配";
                    obj.deviceNo = "暂未分配";
                  } else {
                    for (
                      let j = 0;
                      j < res.data.content[i].device.length;
                      j++
                    ) {
                      let url = "device/" + res.data.content[i].device[j].id;
                      that
                        .request(url, {}, "GET")
                        .then((res) => {
                          obj.devicename += res.data.name + " / ";
                          obj.deviceNo += res.data.deviceNo + " / ";
                        })
                        .catch((res) => {
                          this.$message({
                            message: res.response.data.message,
                            type: "error",
                          });
                        });
                    }
                  }

                  // 获取人员信息
                  setTimeout(() => {
                    if (res.data.content[i].ops.length == 0) {
                      obj.opuser = "暂未分配";
                    } else {
                      for (let k = 0; k < res.data.content[i].ops.length; k++) {
                        let searchops = "user/" + res.data.content[i].ops[k].id;
                        that
                          .request(searchops, {}, "GET")
                          .then((res) => {
                            obj.opuser += res.data.name + " / ";
                          })
                          .catch((res) => {
                            this.$message({
                              message: res.response.data.message,
                              type: "error",
                            });
                          });
                      }
                    }
                    setTimeout(() => {
                      that.tableData.push(obj);
                    }, 600);
                  }, 300);
                }, 300);
              }
              setTimeout(() => {
                that.$message({
                  message: "刷新成功",
                  type: "success",
                });
              }, 600);
            })
            .catch((res) => {
              this.$message({
                message: res.response.data.message,
                type: "error",
              });
            });
        } else {
          console.log(that.selectInfo);
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
              if (
                that.selectInfo[i].ziduan == "device" ||
                that.selectInfo[i].ziduan == "ops"
              ) {
                if (that.selectInfo[i].value.length > 1) {
                  url =
                    url +
                    "&" +
                    that.selectInfo[i].ziduan +
                    "=I" +
                    that.selectInfo[i].value[0];
                  for (let j = 1; j < that.selectInfo[i].value.length; j++) {
                    url = url + "," + that.selectInfo[i].value[j];
                  }
                } else {
                  url =
                    url +
                    "&" +
                    that.selectInfo[i].ziduan +
                    "==" +
                    that.selectInfo[i].value;
                }
              } else {
                url =
                  url +
                  "&" +
                  that.selectInfo[i].ziduan +
                  "==" +
                  that.selectInfo[i].value;
              }
            }
          }
          let url = "ops/query?startDate=B" + this.start + "," + this.end;
          that
            .request(url, {}, "GET")
            .then((res) => {
              console.log(res.data);
              that.total = res.data.totalElements;
              for (let i = 0; i < res.data.content.length; i++) {
                let obj = {};
                obj.opuser = "";
                obj.devicename = "";
                obj.deviceNo = "";
                obj.id = res.data.content[i].id;
                obj.taskname =
                  res.data.content[i].name == null
                    ? "未分配"
                    : res.data.content[i].name;
                obj.taskno =
                  res.data.content[i].no == null
                    ? "未分配"
                    : res.data.content[i].no;
                let URL = "ops/schedule/status/" + res.data.content[i].id;
                that
                  .request(URL, {}, "GET")
                  .then((res) => {
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
                  })
                  .catch((res) => {
                    this.$message({
                      message: res.response.data.message,
                      type: "error",
                    });
                  });
                // 获取设备信息
                setTimeout(() => {
                  if (res.data.content[i].device.length == 0) {
                    obj.devicename = "暂未分配";
                    obj.deviceNo = "暂未分配";
                  } else {
                    for (
                      let j = 0;
                      j < res.data.content[i].device.length;
                      j++
                    ) {
                      let url = "device/" + res.data.content[i].device[j].id;
                      that
                        .request(url, {}, "GET")
                        .then((res) => {
                          obj.devicename += res.data.name + " / ";
                          obj.deviceNo += res.data.deviceNo + " / ";
                        })
                        .catch((res) => {
                          this.$message({
                            message: res.response.data.message,
                            type: "error",
                          });
                        });
                    }
                  }

                  // 获取人员信息
                  setTimeout(() => {
                    if (res.data.content[i].ops.length == 0) {
                      obj.opuser = "暂未分配";
                    } else {
                      for (let k = 0; k < res.data.content[i].ops.length; k++) {
                        let searchops = "user/" + res.data.content[i].ops[k].id;
                        that
                          .request(searchops, {}, "GET")
                          .then((res) => {
                            obj.opuser += res.data.name + " / ";
                          })
                          .catch((res) => {
                            this.$message({
                              message: res.response.data.message,
                              type: "error",
                            });
                          });
                      }
                    }
                    setTimeout(() => {
                      that.tableData.push(obj);
                    }, 600);
                  }, 300);
                }, 300);
              }
              setTimeout(() => {
                that.$message({
                  message: "刷新成功",
                  type: "success",
                });
              }, 600);
            })
            .catch((res) => {
              this.$message({
                message: res.response.data.message,
                type: "error",
              });
            });
        }
      }
    },
    // 任务详情
    handleDetail(row) {
      this.$router.push({
        path: "/taskDetailInfo",
        query: row,
      });
    },
    // 获取全部全部信息
    getAllDevice() {
      let that = this;
      let url = "";
      if (that.userRole != "OPERATOR") {
        url = "device?page=0&size=" + that.page_size;
      } else {
        url = "my/device";
      }
      that
        .request(url, {}, "GET")
        .then((res) => {
          that.tableData = [];
          that.total = res.data.totalElements;
          that.currentPage = 1;
          console.log(res.data);
          if (that.userRole != "OPERATOR") {
            for (let a = 0; a < res.data.content.length; a++) {
              let obj = {};
              obj.children = [];
              obj.opuser = "";
              let searchtask = "device/" + res.data.content[a].id + "/bind";
              let devicename = res.data.content[a].name;
              let deviceNo = res.data.content[a].deviceNo;
              let deviceId = res.data.content[a].id;
              obj.id = res.data.content[a].id;
              obj.devicename = res.data.content[a].name;
              obj.deviceNo = res.data.content[a].deviceNo;
              setTimeout(() => {
                that.request(searchtask, {}, "GET").then((res) => {
                  if (res.data.length != 0) {
                    obj.taskid = res.data[0].id;
                    obj.taskname = res.data[0].name;
                    obj.taskno = res.data[0].no;
                    let URL = "ops/schedule/status/" + obj.taskid;
                    that.request(URL, {}, "GET").then((res) => {
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

                    // 获取人员信息
                    setTimeout(() => {
                      if (res.data[0].ops.length == 0) {
                        obj.opuser = "暂未分配";
                      } else {
                        for (let k = 0; k < res.data[0].ops.length; k++) {
                          let searchops = "user/" + res.data[0].ops[k].id;
                          that
                            .request(searchops, {}, "GET")
                            .then((res) => {
                              obj.opuser += res.data.name + " / ";
                            })
                            .catch(() => {
                              obj.opuser = "获取失败";
                            });
                        }
                      }
                    }, 200);
                    if (res.data.length > 1) {
                      for (let i = 1; i < res.data.length; i++) {
                        let arr = {};
                        arr.id = deviceId + " - " + i;
                        arr.opuser = "";
                        arr.devicename = devicename;
                        arr.deviceNo = deviceNo;
                        arr.taskid = res.data[i].id;
                        arr.taskname = res.data[i].name;
                        arr.taskno = res.data[i].no;
                        let URL = "ops/schedule/status/" + arr.taskid;
                        that.request(URL, {}, "GET").then((res) => {
                          if (res.data.nextDate == null) {
                            arr.nextDate = "暂无";
                          } else {
                            arr.nextDate = res.data.nextDate;
                          }
                          if (res.data.nextDateDay == null) {
                            arr.deadline = "暂无";
                          } else {
                            arr.deadline = res.data.nextDateDay;
                          }
                        });

                        // 获取人员信息
                        setTimeout(() => {
                          if (res.data[i].ops.length == 0) {
                            arr.opuser = "暂未分配";
                          } else {
                            for (let k = 0; k < res.data[i].ops.length; k++) {
                              let searchops = "user/" + res.data[i].ops[k].id;
                              that
                                .request(searchops, {}, "GET")
                                .then((res) => {
                                  arr.opuser += res.data.name + " / ";
                                })
                                .catch(() => {
                                  arr.opuser = "获取失败";
                                });
                            }
                          }
                        }, 200);
                        obj.children.push(arr);
                      }
                    }
                  }
                });
              }, 300);
              that.tableData.push(obj);
            }
          } else {
            for (let a = 0; a < res.data.length; a++) {
              let obj = {};
              obj.children = [];
              obj.opuser = "";
              let searchtask = "device/" + res.data[a].id + "/bind";
              let devicename = res.data[a].name;
              let deviceNo = res.data[a].deviceNo;
              let deviceId = res.data[a].id;
              obj.id = res.data[a].id;
              obj.devicename = res.data[a].name;
              obj.deviceNo = res.data[a].deviceNo;
              setTimeout(() => {
                that.request(searchtask, {}, "GET").then((res) => {
                  console.log(res.data);
                  let mytask = [];
                  for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].ops[0].id == that.userid) {
                      mytask.push(res.data[i]);
                    }
                  }
                  if (mytask != 0) {
                    console.log(mytask);
                    obj.taskid = mytask[0].id;
                    obj.taskname = mytask[0].name;
                    obj.taskno = mytask[0].no;
                    let URL = "ops/schedule/status/" + obj.taskid;
                    that.request(URL, {}, "GET").then((res) => {
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

                    // 获取人员信息
                    setTimeout(() => {
                      if (mytask[0].ops.length == 0) {
                        obj.opuser = "暂未分配";
                      } else {
                        for (let k = 0; k < mytask[0].ops.length; k++) {
                          let searchops = "user/" + mytask[0].ops[k].id;
                          that
                            .request(searchops, {}, "GET")
                            .then((res) => {
                              obj.opuser += res.data.name + " / ";
                            })
                            .catch(() => {
                              obj.opuser = "获取失败";
                            });
                        }
                      }
                    }, 200);
                    if (mytask.length > 1) {
                      for (let i = 1; i < mytask.length; i++) {
                        let arr = {};
                        arr.id = deviceId + " - " + i;
                        arr.opuser = "";
                        arr.devicename = devicename;
                        arr.deviceNo = deviceNo;
                        arr.taskid = mytask[i].id;
                        arr.taskname = mytask[i].name;
                        arr.taskno = mytask[i].no;
                        let URL = "ops/schedule/status/" + arr.taskid;
                        that.request(URL, {}, "GET").then((res) => {
                          console.log(res.data);
                          if (res.data.nextDate == null) {
                            arr.nextDate = "暂无";
                          } else {
                            arr.nextDate = res.data.nextDate;
                          }
                          if (res.data.nextDateDay == null) {
                            arr.deadline = "暂无";
                          } else {
                            arr.deadline = res.data.nextDateDay;
                          }
                        });

                        // 获取人员信息
                        setTimeout(() => {
                          if (mytask[i].ops.length == 0) {
                            arr.opuser = "暂未分配";
                          } else {
                            for (let k = 0; k < mytask[i].ops.length; k++) {
                              let searchops = "user/" + mytask[i].ops[k].id;
                              that
                                .request(searchops, {}, "GET")
                                .then((res) => {
                                  arr.opuser += res.data.name + " / ";
                                })
                                .catch(() => {
                                  arr.opuser = "获取失败";
                                });
                            }
                          }
                        }, 200);
                        // obj.children.push(arr);
                        obj.children.push(arr);
                      }
                    }
                  }
                });
              }, 300);
              console.log(obj);
              that.tableData.push(obj);
            }
          }
          this.$message({
            message: "数据已更新",
            type: "success",
          });
          // 清空搜索条件，等待下次搜索
          that.selectInfo = [];
          that.selectvalue = "";
          that.selectmodel = "";
          that.dynamicTags = [];
          that.globaldata.deviceselectInfo = [];
          that.globaldata.devicedynamicTags = [];
        })
        .catch((res) => {
          this.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
    },
    // 修改任务
    handleEdit(row) {
      console.log(row);
      let obj = {};
      obj.deviceID = row.id;
      obj.deviceNo = row.deviceNo;
      obj.devicename = row.devicename;
      obj.taskID = row.taskid;
      this.$router.push({
        path: "/editTask",
        query: obj,
      });
    },
    // 删除单个行
    handleDelete(row) {
      let that = this;
      console.log(row);
      this.$confirm("删除后无法更改, 是否确定?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let url = "http://47.102.214.37:8080/ops/schedule/" + row.taskid;
          that
            .request(url, {}, "DELETE")
            .then(() => {
              that.getAllDevice();
              this.$message({
                message: "删除成功",
                type: "success",
              });
            })
            .catch((res) => {
              this.$message({
                message: res.response.data.message,
                type: "error",
              });
            });
        })
        .catch(() => {
          that.$message.info("已取消删除");
        });
    },
    // 表格方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let that = this;
      that.tableData = [];
      that.currentPage = 1;
      console.log(val);
      that.page_size = val;
      let url = "device?page=0" + "&size=" + that.page_size;
      console.log(url);
      that
        .request(url, {}, "GET")
        .then((res) => {
          that.tableData = [];
          that.total = res.data.totalElements;
          that.currentPage = 1;
          console.log(res.data);
          if (that.userRole != "OPERATOR") {
            for (let a = 0; a < res.data.content.length; a++) {
              let obj = {};
              obj.children = [];
              obj.opuser = "";
              let searchtask = "device/" + res.data.content[a].id + "/bind";
              let devicename = res.data.content[a].name;
              let deviceNo = res.data.content[a].deviceNo;
              let deviceId = res.data.content[a].id;
              obj.id = res.data.content[a].id;
              obj.devicename = res.data.content[a].name;
              obj.deviceNo = res.data.content[a].deviceNo;
              setTimeout(() => {
                that.request(searchtask, {}, "GET").then((res) => {
                  if (res.data.length != 0) {
                    obj.taskid = res.data[0].id;
                    obj.taskname = res.data[0].name;
                    obj.taskno = res.data[0].no;
                    let URL = "ops/schedule/status/" + obj.taskid;
                    that.request(URL, {}, "GET").then((res) => {
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

                    // 获取人员信息
                    setTimeout(() => {
                      if (res.data[0].ops.length == 0) {
                        obj.opuser = "暂未分配";
                      } else {
                        for (let k = 0; k < res.data[0].ops.length; k++) {
                          let searchops = "user/" + res.data[0].ops[k].id;
                          that
                            .request(searchops, {}, "GET")
                            .then((res) => {
                              obj.opuser += res.data.name + " / ";
                            })
                            .catch(() => {
                              obj.opuser = "获取失败";
                            });
                        }
                      }
                    }, 200);
                    if (res.data.length > 1) {
                      for (let i = 1; i < res.data.length; i++) {
                        let arr = {};
                        arr.id = deviceId + " - " + i;
                        arr.opuser = "";
                        arr.devicename = devicename;
                        arr.deviceNo = deviceNo;
                        arr.taskid = res.data[i].id;
                        arr.taskname = res.data[i].name;
                        arr.taskno = res.data[i].no;
                        let URL = "ops/schedule/status/" + arr.taskid;
                        that.request(URL, {}, "GET").then((res) => {
                          if (res.data.nextDate == null) {
                            arr.nextDate = "暂无";
                          } else {
                            arr.nextDate = res.data.nextDate;
                          }
                          if (res.data.nextDateDay == null) {
                            arr.deadline = "暂无";
                          } else {
                            arr.deadline = res.data.nextDateDay;
                          }
                        });

                        // 获取人员信息
                        setTimeout(() => {
                          if (res.data[i].ops.length == 0) {
                            arr.opuser = "暂未分配";
                          } else {
                            for (let k = 0; k < res.data[i].ops.length; k++) {
                              let searchops = "user/" + res.data[i].ops[k].id;
                              that
                                .request(searchops, {}, "GET")
                                .then((res) => {
                                  arr.opuser += res.data.name + " / ";
                                })
                                .catch(() => {
                                  arr.opuser = "获取失败";
                                });
                            }
                          }
                        }, 200);
                        obj.children.push(arr);
                      }
                    }
                  }
                });
              }, 300);
              that.tableData.push(obj);
            }
          } else {
            for (let a = 0; a < res.data.length; a++) {
              let obj = {};
              obj.children = [];
              obj.opuser = "";
              let searchtask = "device/" + res.data[a].id + "/bind";
              let devicename = res.data[a].name;
              let deviceNo = res.data[a].deviceNo;
              let deviceId = res.data[a].id;
              obj.id = res.data[a].id;
              obj.devicename = res.data[a].name;
              obj.deviceNo = res.data[a].deviceNo;
              setTimeout(() => {
                that.request(searchtask, {}, "GET").then((res) => {
                  console.log(res.data);
                  let mytask = [];
                  for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].ops[0].id == that.userid) {
                      mytask.push(res.data[i]);
                    }
                  }
                  if (mytask != 0) {
                    console.log(mytask);
                    obj.taskid = mytask[0].id;
                    obj.taskname = mytask[0].name;
                    obj.taskno = mytask[0].no;
                    let URL = "ops/schedule/status/" + obj.taskid;
                    that.request(URL, {}, "GET").then((res) => {
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

                    // 获取人员信息
                    setTimeout(() => {
                      if (mytask[0].ops.length == 0) {
                        obj.opuser = "暂未分配";
                      } else {
                        for (let k = 0; k < mytask[0].ops.length; k++) {
                          let searchops = "user/" + mytask[0].ops[k].id;
                          that
                            .request(searchops, {}, "GET")
                            .then((res) => {
                              obj.opuser += res.data.name + " / ";
                            })
                            .catch(() => {
                              obj.opuser = "获取失败";
                            });
                        }
                      }
                    }, 200);
                    if (mytask.length > 1) {
                      for (let i = 1; i < mytask.length; i++) {
                        let arr = {};
                        arr.id = deviceId + " - " + i;
                        arr.opuser = "";
                        arr.devicename = devicename;
                        arr.deviceNo = deviceNo;
                        arr.taskid = mytask[i].id;
                        arr.taskname = mytask[i].name;
                        arr.taskno = mytask[i].no;
                        let URL = "ops/schedule/status/" + arr.taskid;
                        that.request(URL, {}, "GET").then((res) => {
                          console.log(res.data);
                          if (res.data.nextDate == null) {
                            arr.nextDate = "暂无";
                          } else {
                            arr.nextDate = res.data.nextDate;
                          }
                          if (res.data.nextDateDay == null) {
                            arr.deadline = "暂无";
                          } else {
                            arr.deadline = res.data.nextDateDay;
                          }
                        });

                        // 获取人员信息
                        setTimeout(() => {
                          if (mytask[i].ops.length == 0) {
                            arr.opuser = "暂未分配";
                          } else {
                            for (let k = 0; k < mytask[i].ops.length; k++) {
                              let searchops = "user/" + mytask[i].ops[k].id;
                              that
                                .request(searchops, {}, "GET")
                                .then((res) => {
                                  arr.opuser += res.data.name + " / ";
                                })
                                .catch(() => {
                                  arr.opuser = "获取失败";
                                });
                            }
                          }
                        }, 200);
                        // obj.children.push(arr);
                        obj.children.push(arr);
                      }
                    }
                  }
                });
              }, 300);
              console.log(obj);
              that.tableData.push(obj);
            }
          }
          this.$message({
            message: "数据已更新",
            type: "success",
          });
          // 清空搜索条件，等待下次搜索
          that.selectInfo = [];
          that.selectvalue = "";
          that.selectmodel = "";
          that.dynamicTags = [];
          that.globaldata.deviceselectInfo = [];
          that.globaldata.devicedynamicTags = [];
        })
        .catch((res) => {
          this.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
    },
    // // 页变化
    handleCurrentChange(val) {
      let that = this;
      that.tableData = [];
      that.page = val;
      that.currentPage = val;
      console.log(val);
      let url = "device?page=" + (that.page - 1) + "&size=" + that.page_size;
      that
        .request(url, {}, "GET")
        .then((res) => {
          that.tableData = [];
          that.total = res.data.totalElements;
          that.currentPage = 1;
          console.log(res.data);
          if (that.userRole != "OPERATOR") {
            for (let a = 0; a < res.data.content.length; a++) {
              let obj = {};
              obj.children = [];
              obj.opuser = "";
              let searchtask = "device/" + res.data.content[a].id + "/bind";
              let devicename = res.data.content[a].name;
              let deviceNo = res.data.content[a].deviceNo;
              let deviceId = res.data.content[a].id;
              obj.id = res.data.content[a].id;
              obj.devicename = res.data.content[a].name;
              obj.deviceNo = res.data.content[a].deviceNo;
              setTimeout(() => {
                that.request(searchtask, {}, "GET").then((res) => {
                  if (res.data.length != 0) {
                    obj.taskid = res.data[0].id;
                    obj.taskname = res.data[0].name;
                    obj.taskno = res.data[0].no;
                    let URL = "ops/schedule/status/" + obj.taskid;
                    that.request(URL, {}, "GET").then((res) => {
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

                    // 获取人员信息
                    setTimeout(() => {
                      if (res.data[0].ops.length == 0) {
                        obj.opuser = "暂未分配";
                      } else {
                        for (let k = 0; k < res.data[0].ops.length; k++) {
                          let searchops = "user/" + res.data[0].ops[k].id;
                          that
                            .request(searchops, {}, "GET")
                            .then((res) => {
                              obj.opuser += res.data.name + " / ";
                            })
                            .catch(() => {
                              obj.opuser = "获取失败";
                            });
                        }
                      }
                    }, 200);
                    if (res.data.length > 1) {
                      for (let i = 1; i < res.data.length; i++) {
                        let arr = {};
                        arr.id = deviceId + " - " + i;
                        arr.opuser = "";
                        arr.devicename = devicename;
                        arr.deviceNo = deviceNo;
                        arr.taskid = res.data[i].id;
                        arr.taskname = res.data[i].name;
                        arr.taskno = res.data[i].no;
                        let URL = "ops/schedule/status/" + arr.taskid;
                        that.request(URL, {}, "GET").then((res) => {
                          if (res.data.nextDate == null) {
                            arr.nextDate = "暂无";
                          } else {
                            arr.nextDate = res.data.nextDate;
                          }
                          if (res.data.nextDateDay == null) {
                            arr.deadline = "暂无";
                          } else {
                            arr.deadline = res.data.nextDateDay;
                          }
                        });

                        // 获取人员信息
                        setTimeout(() => {
                          if (res.data[i].ops.length == 0) {
                            arr.opuser = "暂未分配";
                          } else {
                            for (let k = 0; k < res.data[i].ops.length; k++) {
                              let searchops = "user/" + res.data[i].ops[k].id;
                              that
                                .request(searchops, {}, "GET")
                                .then((res) => {
                                  arr.opuser += res.data.name + " / ";
                                })
                                .catch(() => {
                                  arr.opuser = "获取失败";
                                });
                            }
                          }
                        }, 200);
                        obj.children.push(arr);
                      }
                    }
                  }
                });
              }, 300);
              that.tableData.push(obj);
            }
          } else {
            for (let a = 0; a < res.data.length; a++) {
              let obj = {};
              obj.children = [];
              obj.opuser = "";
              let searchtask = "device/" + res.data[a].id + "/bind";
              let devicename = res.data[a].name;
              let deviceNo = res.data[a].deviceNo;
              let deviceId = res.data[a].id;
              obj.id = res.data[a].id;
              obj.devicename = res.data[a].name;
              obj.deviceNo = res.data[a].deviceNo;
              setTimeout(() => {
                that.request(searchtask, {}, "GET").then((res) => {
                  console.log(res.data);
                  let mytask = [];
                  for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].ops[0].id == that.userid) {
                      mytask.push(res.data[i]);
                    }
                  }
                  if (mytask != 0) {
                    console.log(mytask);
                    obj.taskid = mytask[0].id;
                    obj.taskname = mytask[0].name;
                    obj.taskno = mytask[0].no;
                    let URL = "ops/schedule/status/" + obj.taskid;
                    that.request(URL, {}, "GET").then((res) => {
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

                    // 获取人员信息
                    setTimeout(() => {
                      if (mytask[0].ops.length == 0) {
                        obj.opuser = "暂未分配";
                      } else {
                        for (let k = 0; k < mytask[0].ops.length; k++) {
                          let searchops = "user/" + mytask[0].ops[k].id;
                          that
                            .request(searchops, {}, "GET")
                            .then((res) => {
                              obj.opuser += res.data.name + " / ";
                            })
                            .catch(() => {
                              obj.opuser = "获取失败";
                            });
                        }
                      }
                    }, 200);
                    if (mytask.length > 1) {
                      for (let i = 1; i < mytask.length; i++) {
                        let arr = {};
                        arr.id = deviceId + " - " + i;
                        arr.opuser = "";
                        arr.devicename = devicename;
                        arr.deviceNo = deviceNo;
                        arr.taskid = mytask[i].id;
                        arr.taskname = mytask[i].name;
                        arr.taskno = mytask[i].no;
                        let URL = "ops/schedule/status/" + arr.taskid;
                        that.request(URL, {}, "GET").then((res) => {
                          console.log(res.data);
                          if (res.data.nextDate == null) {
                            arr.nextDate = "暂无";
                          } else {
                            arr.nextDate = res.data.nextDate;
                          }
                          if (res.data.nextDateDay == null) {
                            arr.deadline = "暂无";
                          } else {
                            arr.deadline = res.data.nextDateDay;
                          }
                        });

                        // 获取人员信息
                        setTimeout(() => {
                          if (mytask[i].ops.length == 0) {
                            arr.opuser = "暂未分配";
                          } else {
                            for (let k = 0; k < mytask[i].ops.length; k++) {
                              let searchops = "user/" + mytask[i].ops[k].id;
                              that
                                .request(searchops, {}, "GET")
                                .then((res) => {
                                  arr.opuser += res.data.name + " / ";
                                })
                                .catch(() => {
                                  arr.opuser = "获取失败";
                                });
                            }
                          }
                        }, 200);
                        // obj.children.push(arr);
                        obj.children.push(arr);
                      }
                    }
                  }
                });
              }, 300);
              console.log(obj);
              that.tableData.push(obj);
            }
          }
          this.$message({
            message: "数据已更新",
            type: "success",
          });
          // 清空搜索条件，等待下次搜索
          that.selectInfo = [];
          that.selectvalue = "";
          that.selectmodel = "";
          that.dynamicTags = [];
          that.globaldata.deviceselectInfo = [];
          that.globaldata.devicedynamicTags = [];
        })
        .catch((res) => {
          this.$message({
            message: res.response.data.message,
            type: "error",
          });
        });
    },
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
      .check {
        .el-button {
          width: 190px;
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
          color: #409eff;
        }
        &:nth-child(3):hover {
          color: #f96b6c;
        }
      }
    }
  }
}
</style>
