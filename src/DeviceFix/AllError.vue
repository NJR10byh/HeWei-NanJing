<template>
  <div class="Container-AllError">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备维修</el-breadcrumb-item>
      <el-breadcrumb-item class="active">全部异常</el-breadcrumb-item>
    </el-breadcrumb>
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
    </div>
    <!-- table -->
    <el-table
      ref="multipleTable"
      :data="taskData"
      stripe
      border
      style="width:100%;"
      class="extraTable"
    >
      <el-table-column
        prop="errorid"
        label="报修流水号"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="errordevicename"
        label="故障设备名称"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="errordeviceNo"
        label="故障设备编号"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="reportername"
        label="报修人员"
        :width="tablewidth"
      ></el-table-column>
      <el-table-column
        prop="reportertime"
        label="报修时间"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="assigneename"
        label="维修人员"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="assigneestatus"
        label="维修状态"
        :width="tablewidth"
      ></el-table-column>
      <el-table-column
        prop="setting"
        label="操作"
        v-if="userRole != 'OPERATOR'"
        width="180"
      >
        <template slot-scope="scope">
          <el-button @click="errordetail(scope.$index)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-if="!ifsearch">
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
      <!-- <el-input v-model="selectmodel" placeholder="请输入搜索内容"></el-input> -->
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

      <!-- 报修人员 -->
      <el-select
        v-model="reportervalue"
        placeholder="请选择报修人员"
        filterable
        clearable
        multiple
        v-if="selectvalue == 'reporter'"
      >
        <el-option-group
          v-for="group in reporteroptions"
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

      <!-- 维修人员 -->
      <el-select
        v-model="assigneevalue"
        placeholder="请选择维修人员"
        filterable
        clearable
        multiple
        v-if="selectvalue == 'assignee'"
      >
        <el-option-group
          v-for="group in assigneeoptions"
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
import axios from "axios";
import globaldata from "../GlobalData/globaldata";

export default {
  created: function() {
    let that = this;
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      console.log(res.data);
      that.userRole = res.data.role;
    });
    if (globaldata.fixselectInfo.length != 0) {
      that.selectInfo = globaldata.fixselectInfo;
      that.dynamicTags = globaldata.fixdynamicTags;
      that.search();
    } else {
      setTimeout(() => {
        that.refresh();
      }, 200);
    }

    setTimeout(() => {
      // 获取全部OPERATOR
      axios.get("http://47.102.214.37:8080/user/query").then((res) => {
        // console.log(res.data);
        for (let i = 0; i < res.data.content.length; i++) {
          if (res.data.content[i].role == "ROOT") {
            let obj = {};
            obj.value = res.data.content[i].id;
            obj.label =
              res.data.content[i].name +
              " (用户名：" +
              res.data.content[i].username +
              ")";
            that.reporteroptions[0].options.push(obj);
          } else if (res.data.content[i].role == "ADMIN") {
            let obj = {};
            obj.value = res.data.content[i].id;
            obj.label =
              res.data.content[i].name +
              " (用户名：" +
              res.data.content[i].username +
              ")";
            that.reporteroptions[1].options.push(obj);
          } else if (res.data.content[i].role == "CREATER") {
            let obj = {};
            obj.value = res.data.content[i].id;
            obj.label =
              res.data.content[i].name +
              " (用户名：" +
              res.data.content[i].username +
              ")";
            that.reporteroptions[2].options.push(obj);
          } else if (res.data.content[i].role == "SUPERVISOR") {
            let obj = {};
            obj.value = res.data.content[i].id;
            obj.label =
              res.data.content[i].name +
              " (用户名：" +
              res.data.content[i].username +
              ")";
            that.reporteroptions[3].options.push(obj);
          } else if (res.data.content[i].role == "OPERATOR") {
            let obj = {};
            obj.value = res.data.content[i].id;
            obj.label =
              res.data.content[i].name +
              " (用户名：" +
              res.data.content[i].username +
              ")";
            that.reporteroptions[4].options.push(obj);
            that.assigneeoptions[0].options.push(obj);
          }
        }
      });
    }, 300);
  },
  data() {
    return {
      userRole: "",

      taskData: [],
      tablewidth: "150",
      /* 搜索 */
      ifsearch: false,
      selectoptions: [
        {
          label: "字段",
          options: [
            {
              value: "device",
              label: "设备",
            },
            {
              value: "reporter",
              label: "报修人员",
            },
            {
              value: "assignee",
              label: "维修人员",
            },
            {
              value: "timeChoose",
              label: "时间范围",
            },
          ],
        },
      ],
      dynamicTags: [], // 搜索标签

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

      // 维修人员
      assigneevalue: "",
      assigneeoptions: [
        {
          label: "OPERATOR",
          options: [],
        },
      ],

      // 报修人员
      reportervalue: "",
      reporteroptions: [
        {
          label: "ROOT",
          options: [],
        },
        {
          label: "ADMIN",
          options: [],
        },
        {
          label: "CREATER",
          options: [],
        },
        {
          label: "SUPERVISOR",
          options: [],
        },
        {
          label: "OPERATOR",
          options: [],
        },
      ],
      /* 时间范围 */
      // 开始
      start: "",
      // 结束
      end: "",

      selectvalue: "",
      selectInfo: [],
      dialogSearchVisible: false,

      // 分页
      currentPage: 1, //  页面显示的当前页数
      page_size: 15, //  页面显示的每页显示条数
      page: 1, // 当前页数
      total: 0, // 总数
    };
  },
  methods: {
    // 处理时间格式
    renderTime(date) {
      if (date == null) {
        return "暂无";
      } else {
        var dateee = new Date(date).toJSON();
        this.active++;
        return new Date(+new Date(dateee) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, " ")
          .replace(/\.[\d]{3}Z/, "");
      }
    },
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
        "http://47.102.214.37:8080/device/query?" +
        that.selectInfo2[0].ziduan +
        "=L" +
        that.selectInfo2[0].value +
        "%25";
      if (that.selectInfo2.length == 1) {
        axios.get(url).then((res) => {
          console.log(res.data);
          for (let i = 0; i < res.data.content.length; i++) {
            arr.push(res.data.content[i].id);
          }
          that.selectInfo.push({
            ziduan: "device",
            value: arr,
          });
          that.dynamicTags.push("device / " + arr);
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
        axios.get(url).then((res) => {
          console.log(res.data);
          for (let i = 0; i < res.data.content.length; i++) {
            arr.push(res.data.content[i].id);
          }
          that.selectInfo.push({
            ziduan: "device",
            value: arr,
          });
          that.dynamicTags.push("device / " + arr);
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
      this.dialogSearchVisible = false;
      switch (this.selectvalue) {
        case "device":
          this.searchDevice();
          break;
        case "assignee":
          this.selectInfo.push({
            ziduan: this.selectvalue,
            value: this.assigneevalue,
          });
          this.dynamicTags.push(this.selectvalue + " / " + this.assigneevalue);
          break;
        case "reporter":
          this.selectInfo.push({
            ziduan: this.selectvalue,
            value: this.reportervalue,
          });
          this.dynamicTags.push(this.selectvalue + " / " + this.reportervalue);
          break;
        case "timeChoose":
          var that = this;
          that.taskData = [];
          that.ifsearch = true;
          // 清空搜索条件，等待下次搜索
          that.selectInfo = [];
          that.selectvalue = "";
          that.selectmodel = "";
          that.dynamicTags = [];
          globaldata.deviceselectInfo = [];
          globaldata.devicedynamicTags = [];
          var url =
            "http://47.102.214.37:8080/issue/query?createdAt=B" +
            this.start +
            "T00:00," +
            this.end +
            "T00:00";
          axios.get(url).then((res) => {
            console.log(res.data);
            that.total = res.data.totalElements;
            for (let i = 0; i < res.data.content.length; i++) {
              let obj = {};
              obj.errorid = res.data.content[i].id;
              obj.errordevicename = "";
              obj.errordeviceNo = "";
              obj.assigneename = "";
              obj.reportertime = that.renderTime(res.data.content[i].createdAt);
              obj.assigneestatus = res.data.content[i].closed
                ? "已完成"
                : "未完成";
              // 获取设备信息
              setTimeout(() => {
                for (let j = 0; j < res.data.content[i].device.length; j++) {
                  let deviceurl =
                    "http://47.102.214.37:8080/device/" +
                    res.data.content[i].device[j].id;
                  axios.get(deviceurl).then((res) => {
                    obj.errordevicename += res.data.name + " / ";
                    obj.errordeviceNo += res.data.deviceNo + " / ";
                  });
                }
                setTimeout(() => {
                  // 获取报修人员信息
                  let assigneeurl =
                    "http://47.102.214.37:8080/user/" +
                    res.data.content[i].reporter.id;
                  axios.get(assigneeurl).then((res) => {
                    console.log(res.data);
                    obj.reportername =
                      res.data.name == undefined ? "未分配" : res.data.name;
                  });
                  // 获取维修人员信息
                  setTimeout(() => {
                    if (res.data.content[i].assignee.length == 1) {
                      obj.assigneename = "未分配";
                    } else {
                      for (
                        let k = 1;
                        k < res.data.content[i].assignee.length;
                        k++
                      ) {
                        let assigneeurl =
                          "http://47.102.214.37:8080/user/" +
                          res.data.content[i].assignee[k].id;
                        axios.get(assigneeurl).then((res) => {
                          console.log(res.data);
                          obj.assigneename += res.data.name + " / ";
                        });
                      }
                    }
                    setTimeout(() => {
                      that.taskData.push(obj);
                    }, 800);
                  }, 300);
                }, 300);
              }, 300);
            }
            setTimeout(() => {
              that.$message({
                message: "刷新成功",
                type: "success",
              });
            }, 1000);
          });
          break;
        default:
          break;
      }
    },
    // 标签移除
    handleClose(tag) {
      let index = this.dynamicTags.indexOf(tag);
      console.log(index);
      this.dynamicTags.splice(index, 1);
      this.selectInfo.splice(index, 1);
    },
    // 刷新
    refresh() {
      let that = this;
      that.taskData = [];
      that.ifsearch = false;
      let url = "http://47.102.214.37:8080/issue?page=0&size=" + that.page_size;
      axios.get(url).then((res) => {
        console.log(res.data);
        that.total = res.data.totalElements;
        for (let i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.errorid = res.data.content[i].id;
          obj.errordevicename = "";
          obj.errordeviceNo = "";
          obj.assigneename = "";
          obj.reportertime = that.renderTime(res.data.content[i].createdAt);
          obj.assigneestatus = res.data.content[i].closed ? "已完成" : "未完成";
          // 获取设备信息
          setTimeout(() => {
            for (let j = 0; j < res.data.content[i].device.length; j++) {
              let deviceurl =
                "http://47.102.214.37:8080/device/" +
                res.data.content[i].device[j].id;
              axios.get(deviceurl).then((res) => {
                obj.errordevicename += res.data.name + " / ";
                obj.errordeviceNo += res.data.deviceNo + " / ";
              });
            }
            setTimeout(() => {
              // 获取报修人员信息
              let assigneeurl =
                "http://47.102.214.37:8080/user/" +
                res.data.content[i].reporter.id;
              axios.get(assigneeurl).then((res) => {
                console.log(res.data);
                obj.reportername =
                  res.data.name == undefined ? "未分配" : res.data.name;
              });
              // 获取维修人员信息
              setTimeout(() => {
                if (res.data.content[i].assignee.length == 1) {
                  obj.assigneename = "未分配";
                } else {
                  for (
                    let k = 1;
                    k < res.data.content[i].assignee.length;
                    k++
                  ) {
                    let assigneeurl =
                      "http://47.102.214.37:8080/user/" +
                      res.data.content[i].assignee[k].id;
                    axios.get(assigneeurl).then((res) => {
                      console.log(res.data);
                      obj.assigneename += res.data.name + " / ";
                    });
                  }
                }
                setTimeout(() => {
                  that.taskData.push(obj);
                }, 800);
              }, 300);
            }, 300);
          }, 300);
        }
        setTimeout(() => {
          that.$message({
            message: "刷新成功",
            type: "success",
          });
        }, 1000);
      });
      // 清空搜索条件，等待下次搜索
      that.selectInfo = [];
      that.selectvalue = "";
      that.selectmodel = "";
      that.dynamicTags = [];
      globaldata.fixselectInfo = [];
      globaldata.fixdynamicTags = [];
    },
    errordetail(index) {
      let that = this;
      console.log(that.taskData[index]);
      that.$router.push({
        path: "./errorDetail",
        query: that.taskData[index],
      });
    },

    // 搜索
    search() {
      let that = this;
      let url = "";
      that.taskData = [];
      that.currentPage = 1;
      that.ifsearch = true;
      if (
        that.selectInfo[0].ziduan == "device" ||
        that.selectInfo[0].ziduan == "reporter" ||
        that.selectInfo[0].ziduan == "assignee"
      ) {
        if (that.selectInfo[0].value.length > 1) {
          url =
            "http://47.102.214.37:8080/issue/query?" +
            that.selectInfo[0].ziduan +
            "=I" +
            that.selectInfo[0].value[0];
          for (let i = 1; i < that.selectInfo[0].value.length; i++) {
            url = url + "," + that.selectInfo[0].value[i];
          }
        } else {
          url =
            "http://47.102.214.37:8080/issue/query?" +
            that.selectInfo[0].ziduan +
            "==" +
            that.selectInfo[0].value;
        }
      } else {
        url =
          "http://47.102.214.37:8080/issue/query?" +
          that.selectInfo[0].ziduan +
          "==" +
          that.selectInfo[0].value;
      }
      if (that.selectInfo.length == 1) {
        axios.get(url).then((res) => {
          console.log(res.data);
          that.total = res.data.totalElements;
          for (let i = 0; i < res.data.content.length; i++) {
            let obj = {};
            obj.errorid = res.data.content[i].id;
            obj.errordevicename = "";
            obj.errordeviceNo = "";
            obj.assigneename = "";
            obj.reportertime = that.renderTime(res.data.content[i].createdAt);
            obj.assigneestatus = res.data.content[i].closed
              ? "已完成"
              : "未完成";
            // 获取设备信息
            setTimeout(() => {
              for (let j = 0; j < res.data.content[i].device.length; j++) {
                let deviceurl =
                  "http://47.102.214.37:8080/device/" +
                  res.data.content[i].device[j].id;
                axios.get(deviceurl).then((res) => {
                  obj.errordevicename += res.data.name + " / ";
                  obj.errordeviceNo += res.data.deviceNo + " / ";
                });
              }
              setTimeout(() => {
                // 获取报修人员信息
                let assigneeurl =
                  "http://47.102.214.37:8080/user/" +
                  res.data.content[i].reporter.id;
                axios.get(assigneeurl).then((res) => {
                  console.log(res.data);
                  obj.reportername =
                    res.data.name == undefined ? "未分配" : res.data.name;
                });
                // 获取维修人员信息
                setTimeout(() => {
                  if (res.data.content[i].assignee.length == 1) {
                    obj.assigneename = "未分配";
                  } else {
                    for (
                      let k = 1;
                      k < res.data.content[i].assignee.length;
                      k++
                    ) {
                      let assigneeurl =
                        "http://47.102.214.37:8080/user/" +
                        res.data.content[i].assignee[k].id;
                      axios.get(assigneeurl).then((res) => {
                        console.log(res.data);
                        obj.assigneename += res.data.name + " / ";
                      });
                    }
                  }
                  setTimeout(() => {
                    that.taskData.push(obj);
                  }, 800);
                }, 300);
              }, 300);
            }, 300);
          }
          setTimeout(() => {
            that.$message({
              message: "刷新成功",
              type: "success",
            });
          }, 1000);
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
        axios.get(url).then((res) => {
          console.log(res.data);
          that.total = res.data.totalElements;
          for (let i = 0; i < res.data.content.length; i++) {
            let obj = {};
            obj.errorid = res.data.content[i].id;
            obj.errordevicename = "";
            obj.errordeviceNo = "";
            obj.assigneename = "";
            obj.reportertime = that.renderTime(res.data.content[i].createdAt);
            obj.assigneestatus = res.data.content[i].closed
              ? "已完成"
              : "未完成";
            // 获取设备信息
            setTimeout(() => {
              for (let j = 0; j < res.data.content[i].device.length; j++) {
                let deviceurl =
                  "http://47.102.214.37:8080/device/" +
                  res.data.content[i].device[j].id;
                axios.get(deviceurl).then((res) => {
                  obj.errordevicename += res.data.name + " / ";
                  obj.errordeviceNo += res.data.deviceNo + " / ";
                });
              }
              setTimeout(() => {
                // 获取报修人员信息
                let assigneeurl =
                  "http://47.102.214.37:8080/user/" +
                  res.data.content[i].reporter.id;
                axios.get(assigneeurl).then((res) => {
                  console.log(res.data);
                  obj.reportername =
                    res.data.name == undefined ? "未分配" : res.data.name;
                });
                // 获取维修人员信息
                setTimeout(() => {
                  if (res.data.content[i].assignee.length == 1) {
                    obj.assigneename = "未分配";
                  } else {
                    for (
                      let k = 1;
                      k < res.data.content[i].assignee.length;
                      k++
                    ) {
                      let assigneeurl =
                        "http://47.102.214.37:8080/user/" +
                        res.data.content[i].assignee[k].id;
                      axios.get(assigneeurl).then((res) => {
                        console.log(res.data);
                        obj.assigneename += res.data.name + " / ";
                      });
                    }
                  }
                  setTimeout(() => {
                    that.taskData.push(obj);
                  }, 800);
                }, 300);
              }, 300);
            }, 300);
          }
          setTimeout(() => {
            that.$message({
              message: "刷新成功",
              type: "success",
            });
          }, 1000);
        });
      }
    },
    // 表格方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let that = this;
      that.taskData = [];
      console.log(val);
      that.page_size = val;
      that.currentPage = 1;
      let url =
        "http://47.102.214.37:8080/issue?page=0" + "&size=" + that.page_size;
      console.log(url);
      axios.get(url).then((res) => {
        console.log(res.data);
        that.total = res.data.totalElements;
        for (let i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.errorid = res.data.content[i].id;
          obj.errordevicename = "";
          obj.errordeviceNo = "";
          obj.assigneename = "";
          obj.reportertime = that.renderTime(res.data.content[i].createdAt);
          obj.assigneestatus = res.data.content[i].closed ? "已完成" : "未完成";
          // 获取设备信息
          setTimeout(() => {
            for (let j = 0; j < res.data.content[i].device.length; j++) {
              let deviceurl =
                "http://47.102.214.37:8080/device/" +
                res.data.content[i].device[j].id;
              axios.get(deviceurl).then((res) => {
                obj.errordevicename += res.data.name + " / ";
                obj.errordeviceNo += res.data.deviceNo + " / ";
              });
            }
            setTimeout(() => {
              // 获取报修人员信息
              let assigneeurl =
                "http://47.102.214.37:8080/user/" +
                res.data.content[i].reporter.id;
              axios.get(assigneeurl).then((res) => {
                console.log(res.data);
                obj.reportername =
                  res.data.name == undefined ? "未分配" : res.data.name;
              });
              // 获取维修人员信息
              setTimeout(() => {
                if (res.data.content[i].assignee.length == 1) {
                  obj.assigneename = "未分配";
                } else {
                  for (
                    let k = 1;
                    k < res.data.content[i].assignee.length;
                    k++
                  ) {
                    let assigneeurl =
                      "http://47.102.214.37:8080/user/" +
                      res.data.content[i].assignee[k].id;
                    axios.get(assigneeurl).then((res) => {
                      console.log(res.data);
                      obj.assigneename += res.data.name + " / ";
                    });
                  }
                }
                setTimeout(() => {
                  that.taskData.push(obj);
                }, 800);
              }, 300);
            }, 300);
          }, 300);
        }
        setTimeout(() => {
          that.$message({
            message: "刷新成功",
            type: "success",
          });
        }, 1000);
      });
    },
    // // 页变化
    handleCurrentChange(val) {
      let that = this;
      that.page = val;
      that.currentPage = val;
      console.log(val);
      let url =
        "http://47.102.214.37:8080/issue?page=" +
        (that.page - 1) +
        "&size=" +
        that.page_size;
      console.log(url);
      axios.get(url).then((res) => {
        console.log(res.data);
        that.total = res.data.totalElements;
        for (let i = 0; i < res.data.content.length; i++) {
          let obj = {};
          obj.errorid = res.data.content[i].id;
          obj.errordevicename = "";
          obj.errordeviceNo = "";
          obj.assigneename = "";
          obj.reportertime = that.renderTime(res.data.content[i].createdAt);
          obj.assigneestatus = res.data.content[i].closed ? "已完成" : "未完成";
          // 获取设备信息
          setTimeout(() => {
            for (let j = 0; j < res.data.content[i].device.length; j++) {
              let deviceurl =
                "http://47.102.214.37:8080/device/" +
                res.data.content[i].device[j].id;
              axios.get(deviceurl).then((res) => {
                obj.errordevicename += res.data.name + " / ";
                obj.errordeviceNo += res.data.deviceNo + " / ";
              });
            }
            setTimeout(() => {
              // 获取报修人员信息
              let assigneeurl =
                "http://47.102.214.37:8080/user/" +
                res.data.content[i].reporter.id;
              axios.get(assigneeurl).then((res) => {
                console.log(res.data);
                obj.reportername =
                  res.data.name == undefined ? "未分配" : res.data.name;
              });
              // 获取维修人员信息
              setTimeout(() => {
                if (res.data.content[i].assignee.length == 1) {
                  obj.assigneename = "未分配";
                } else {
                  for (
                    let k = 1;
                    k < res.data.content[i].assignee.length;
                    k++
                  ) {
                    let assigneeurl =
                      "http://47.102.214.37:8080/user/" +
                      res.data.content[i].assignee[k].id;
                    axios.get(assigneeurl).then((res) => {
                      console.log(res.data);
                      obj.assigneename += res.data.name + " / ";
                    });
                  }
                }
                setTimeout(() => {
                  that.taskData.push(obj);
                }, 800);
              }, 300);
            }, 300);
          }, 300);
        }
        setTimeout(() => {
          that.$message({
            message: "刷新成功",
            type: "success",
          });
        }, 1000);
      });
    },
  },
};
</script>
<style lang="scss">
.Container-AllError {
  .breadcrumb {
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    font-size: 16px;
    // border: 1px solid red;
    padding: 10px;
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
          color: #f96b6c;
        }
      }
    }
  }
}
</style>
