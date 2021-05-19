<template>
  <div class="Container-TotalTaskList">
    <!-- 搜索 -->
    <div class="head-btn">
      <div class="oper-btns-left">
        <div class="select" v-if="userRole != 'OPERATOR'">
          <el-select
            v-model="selectvalue"
            placeholder="请选择搜索字段"
            filterable
            clearable
            @change="selectchange"
            style="margin-left: 5px"
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
        <div v-if="userRole != 'OPERATOR'">
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
        <div class="search" v-if="userRole != 'OPERATOR'">
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
      style="width: 100%"
      class="extraTable"
    >
      <!-- <el-table-column type="selection"></el-table-column> -->
      <el-table-column prop="id" label="序号" width="60"></el-table-column>
      <el-table-column prop="devicename" label="设备名称"></el-table-column>
      <el-table-column prop="deviceNo" label="设备编号"></el-table-column>
      <el-table-column prop="taskname" label="标准名称"></el-table-column>
      <el-table-column
        prop="taskno"
        label="标准编号"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="nextDate"
        label="下次保养时间"
        width="120"
      ></el-table-column>
      <el-table-column prop="opuser" label="人员"></el-table-column>
      <el-table-column prop="deadline" label="剩余天数"></el-table-column>
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
            >解绑</el-button
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
        layout="slot, sizes, prev, pager, next, jumper"
        :total="total"
      >
        <span style="font-size: 14px; color: #888; font-weight: normal"
          >共<span style="font-size: 14px; color: #000; font-weight: bold">{{
            total
          }}</span
          >个设备&nbsp;&nbsp;（当前页最多展示<span
            style="font-size: 14px; color: #000; font-weight: bold"
            >{{ page_size }}</span
          >个设备）
        </span>
      </el-pagination>
    </div>
    <!-- 搜索条件 -->
    <el-dialog title="搜索条件" :visible.sync="dialogSearchVisible" width="35%">
      <el-input
        v-model="selectmodel"
        placeholder="请输入搜索内容"
        v-if="['name', 'no'].includes(selectvalue)"
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
      <div v-if="selectvalue == 'device'" style="margin-top: 10px">
        <el-tag
          :key="tag"
          v-for="tag in devicedynamicTags"
          closable
          @close="devicehandleClose(tag)"
          style="margin-left: 5px"
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
      <span v-if="selectvalue == 'timeChoose'">开始时间：</span>
      <el-date-picker
        v-model="start"
        type="date"
        placeholder="选择开始日期"
        value-format="yyyy-MM-dd"
        v-if="selectvalue == 'timeChoose'"
      >
      </el-date-picker
      ><br />
      <span v-if="selectvalue == 'timeChoose'">结束时间：</span>
      <el-date-picker
        v-model="end"
        type="date"
        placeholder="选择结束日期"
        value-format="yyyy-MM-dd"
        v-if="selectvalue == 'timeChoose'"
        style="margin-top: 20px"
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
  created: function () {
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
      // tablewidth: "150",
      // checkedDetail: [],
      /* 搜索 */
      ifsearch: false,
      selectoptions: [
        {
          label: "字段",
          options: [
            {
              value: "name",
              label: "标准名称",
            },
            {
              value: "no",
              label: "标准编号",
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
              label: "时间范围（下次保养时间）",
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

      //序号
      index: 1,
      push_obj: {},
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
      this.devicevalue = "";
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
        that.selectInfo2[0].value;
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
            that.selectInfo2[i].value;
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
        console.log(this.start);
        if (
          this.start == "" ||
          this.start == null ||
          this.end == "" ||
          this.end == null
        ) {
          this.$message({
            message: "请将起止日期填写完整",
            type: "warning",
          });
        } else {
          that.tableData = [];
          that.ifsearch = true;
          // 清空搜索条件，等待下次搜索
          that.selectInfo = [];
          that.selectvalue = "";
          that.selectmodel = "";
          that.dynamicTags = [];
          that.globaldata.deviceselectInfo = [];
          that.globaldata.devicedynamicTags = [];
          this.dynamicTags.push(this.start + " 至 " + this.end);
          let url = "ops/query?nextDate=B" + this.start + "," + this.end;
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
                obj.id =
                  res.data.content[i].device.length == 0
                    ? "暂无"
                    : res.data.content[i].device[0].id;
                obj.taskname =
                  res.data.content[i].name == null
                    ? "未分配"
                    : res.data.content[i].name;
                obj.taskno =
                  res.data.content[i].no == null
                    ? "未分配"
                    : res.data.content[i].no;
                obj.taskid = res.data.content[i].id;
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
                          obj.devicename = res.data.name;
                          obj.deviceNo = res.data.deviceNo;
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
                            obj.opuser = res.data.name;
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
      } else {
        this.selectInfo.push({
          ziduan: this.selectvalue,
          value: this.selectmodel,
        });
        this.dynamicTags.push(this.selectvalue + " / " + this.selectmodel);
      }
      this.dialogSearchVisible = false;
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
      that.index = 1;
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
            that.selectInfo[0].value;
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
                obj.deviceID = "";
                obj.id =
                  res.data.content[i].device.length == 0
                    ? "暂无"
                    : that.index++;
                obj.taskname =
                  res.data.content[i].name == null
                    ? "未分配"
                    : res.data.content[i].name;
                obj.taskno =
                  res.data.content[i].no == null
                    ? "未分配"
                    : res.data.content[i].no;
                obj.taskid = res.data.content[i].id;
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
                          obj.devicename = res.data.name;
                          obj.deviceNo = res.data.deviceNo;
                          obj.deviceID = res.data.id;
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
                            obj.opuser = res.data.name;
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
              that.globaldata.taskselectInfo = that.selectInfo;
              that.globaldata.taskdynamicTags = that.dynamicTags;
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
                that.selectInfo[i].value;
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
                obj.deviceID = "";
                obj.id =
                  res.data.content[i].device.length == 0
                    ? "暂无"
                    : that.index++;
                obj.taskname =
                  res.data.content[i].name == null
                    ? "未分配"
                    : res.data.content[i].name;
                obj.taskno =
                  res.data.content[i].no == null
                    ? "未分配"
                    : res.data.content[i].no;
                obj.taskid = res.data.content[i].id;
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
                          obj.devicename += res.data.name;
                          obj.deviceNo += res.data.deviceNo;
                          obj.deviceID = res.data.id;
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
                            obj.opuser = res.data.name;
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
              that.globaldata.taskselectInfo = that.selectInfo;
              that.globaldata.taskdynamicTags = that.dynamicTags;
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
      console.log(row);
      this.$router.push({
        path: "/taskDetailInfo",
        query: row,
      });
    },
    // 递归载入列表数据
    getData(a, length, data, role) {
      let that = this;
      let devicename = "";
      let deviceID = "";
      let deviceNo = "";
      let searchtask = "";
      if (role != "OPERATOR") {
        devicename = data.content[a].name;
        deviceNo = data.content[a].deviceNo;
        deviceID = data.content[a].id;
        searchtask = "device/" + data.content[a].id + "/bind";
      } else {
        devicename = data[a].name;
        deviceNo = data[a].deviceNo;
        deviceID = data[a].id;
        searchtask = "device/" + data[a].id + "/bind";
      }
      that.request(searchtask, {}, "GET").then((res) => {
        console.log(res.data);
        if (res.data.length != 0) {
          // 获取此设备下的任务
          that.getDeviceTask(
            0,
            res.data.length,
            res.data,
            devicename,
            deviceNo,
            deviceID,
            {}
          );
          if (++a < length) {
            setTimeout(() => {
              that.getData(a, length, data, role);
            }, 500);
          }
        } else {
          let obj = {};
          obj.devicename = devicename;
          obj.deviceNo = deviceNo;
          obj.deviceID = deviceID;
          obj.id = that.index++;
          that.tableData.push(obj);
          if (++a < length) {
            that.getData(a, length, data, role);
          }
        }
      });
    },
    // 递归获取此设备下任务数据
    getDeviceTask(d, length, data, devicename, deviceNo, deviceID, push_obj) {
      let that = this;
      push_obj.devicename = devicename;
      push_obj.deviceNo = deviceNo;
      push_obj.deviceID = deviceID;
      push_obj.taskid = data[d].id;
      push_obj.taskname = data[d].name;
      push_obj.taskno = data[d].no;
      //获取人员信息
      that.getUserData(0, data[d].ops.length, data[d].ops, push_obj, {});
      setTimeout(() => {
        if (++d < length) {
          that.getDeviceTask(
            d,
            length,
            data,
            devicename,
            deviceNo,
            deviceID,
            {}
          );
        }
      }, 300);
    },
    // 递归获取人员数据
    getUserData(t, length, opsdata, obj, obj_push) {
      obj_push.opuser = "";
      let that = this;
      let searchops = "user/" + opsdata[t].id;
      that.request(searchops, {}, "GET").then((res) => {
        if (that.userRole == "OPERATOR") {
          if (res.data.id == that.userid) {
            obj_push.devicename = obj.devicename;
            obj_push.deviceNo = obj.deviceNo;
            obj_push.deviceID = obj.deviceID;
            obj_push.taskid = obj.taskid;
            obj_push.taskname = obj.taskname;
            obj_push.taskno = obj.taskno;
            obj_push.opuser = res.data.name;
            obj_push.id = that.index++;
            let URL = "ops/schedule/status/" + obj.taskid;
            that.request(URL, {}, "GET").then((res) => {
              if (res.data.nextDate == null) {
                obj_push.nextDate = "暂无";
              } else {
                obj_push.nextDate = res.data.nextDate;
              }
              if (res.data.nextDateDay == null) {
                obj_push.deadline = "暂无";
              } else {
                obj_push.deadline = res.data.nextDateDay;
              }
              that.tableData.push(obj_push);
            });
          }
        } else {
          obj_push.devicename = obj.devicename;
          obj_push.deviceNo = obj.deviceNo;
          obj_push.deviceID = obj.deviceID;
          obj_push.taskid = obj.taskid;
          obj_push.taskname = obj.taskname;
          obj_push.taskno = obj.taskno;
          obj_push.opuser = res.data.name;
          obj_push.id = that.index++;
          let URL = "ops/schedule/status/" + obj.taskid;
          that.request(URL, {}, "GET").then((res) => {
            if (res.data.nextDate == null) {
              obj_push.nextDate = "暂无";
            } else {
              obj_push.nextDate = res.data.nextDate;
            }
            if (res.data.nextDateDay == null) {
              obj_push.deadline = "暂无";
            } else {
              obj_push.deadline = res.data.nextDateDay;
            }
            that.tableData.push(obj_push);
          });
        }
      });
      if (++t < length) {
        setTimeout(() => {
          that.getUserData(t, length, opsdata, obj, {});
        }, 200);
      }
    },
    // 获取全部全部信息
    getAllDevice() {
      let that = this;
      that.ifsearch = false;
      that.index = 1;
      let url = "";
      if (that.userRole != "OPERATOR") {
        url = "device?page=0&size=" + that.page_size;
      } else {
        url = "my/device";
      }
      that
        .request(url, {}, "GET")
        .then((res) => {
          console.log(res.data);
          that.tableData = [];
          that.total = res.data.totalElements;
          that.currentPage = 1;
          if (res.data.length == 0) {
            this.$message({
              message: "暂无保养任务",
              type: "warning",
            });
          } else {
            if (that.userRole != "OPERATOR") {
              that.getData(0, res.data.content.length, res.data, that.userRole);
            } else {
              that.getData(0, res.data.length, res.data, that.userRole);
            }
            this.$message({
              message: "数据已更新",
              type: "success",
            });
          }
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
      this.$router.push({
        path: "/editTask",
        query: row,
      });
    },
    // 删除单个行
    handleDelete(row) {
      let that = this;
      console.log(row);
      this.$confirm(
        "解绑会解除该标准和设备之间的绑定，和该标准相关的人员都会被清空，并且会删除该标准在此设备的保养记录，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let url = "ops/schedule/" + row.taskid;
          that
            .request(url, {}, "DELETE")
            .then((res) => {
              console.log(res.data);
              that.$message({
                message: "解绑成功",
                type: "success",
              });
              that.getAllDevice();
            })
            .catch((res) => {
              this.$message({
                message: res.response.data.message,
                type: "error",
              });
            });
        })
        .catch(() => {
          that.$message.info("已取消解绑");
        });
    },
    // 表格方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let that = this;
      that.index = 1;
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
            that.getData(0, res.data.content.length, res.data, that.userRole);
          } else {
            that.getData(0, res.data.length, res.data, that.userRole);
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
      that.index = 1;
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
          console.log(res.data);
          if (that.userRole != "OPERATOR") {
            that.getData(0, res.data.content.length, res.data, that.userRole);
          } else {
            that.getData(0, res.data.length, res.data, that.userRole);
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
