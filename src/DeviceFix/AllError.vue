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
        <div
          v-for="(item, index) in selectInfo"
          :key="index"
          style="margin-left:5px;"
        >
          <span>{{ item.ziduan }}: {{ item.value }} |</span>
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
        label="异常ID"
        width="100"
      ></el-table-column>
      <el-table-column prop="assigneeid" label="维修人员"></el-table-column>
      <el-table-column prop="reporterid" label="报修人员"></el-table-column>
      <el-table-column
        prop="setting"
        label="操作"
        v-if="['ROOT', 'ADMIN'].includes(userRole)"
      >
        <template slot-scope="scope">
          <el-button @click="errordetail(scope.$index)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 搜索条件 -->
    <el-dialog title="搜索条件" :visible.sync="dialogSearchVisible" width="35%">
      <!-- <el-input v-model="selectmodel" placeholder="请输入搜索内容"></el-input> -->
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

      <!-- 报修人员 -->
      <el-select
        v-model="scheduleTypevalue"
        placeholder="请选择报修人员"
        filterable
        clearable
        v-if="selectvalue == 'reporter'"
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

      <!-- 维修人员 -->
      <el-select
        v-model="scheduleTypevalue"
        placeholder="请选择维修人员"
        filterable
        clearable
        v-if="selectvalue == 'assignee'"
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSearchVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitselect">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
  created: function() {
    let that = this;
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      console.log(res.data);
      that.userRole = res.data.role;
    });
    setTimeout(() => {
      that.refresh();
    }, 200);

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
  },
  data() {
    return {
      userRole: "",

      taskData: [],
      /* 搜索 */
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
      selectvalue: "",
      selectInfo: [],
      dialogSearchVisible: false,
    };
  },
  methods: {
    selectchange() {
      this.dialogSearchVisible = true;
    },
    submitselect() {
      this.dialogSearchVisible = false;
      if (this.selectvalue == "device") {
        this.selectInfo.push({
          ziduan: this.selectvalue,
          value: this.devicevalue,
        });
      } else {
        this.selectInfo.push({
          ziduan: this.selectvalue,
          value: this.selectmodel,
        });
      }
    },
    refresh() {
      let that = this;
      that.taskData = [];
      axios
        .get("http://47.102.214.37:8080/issue?page=0&size=10")
        .then((res) => {
          console.log(res.data);
          for (let i = 0; i < res.data.content.length; i++) {
            let assigneeid = "";
            for (let j = 0; j < res.data.content[i].assignee.length; j++) {
              assigneeid =
                assigneeid +
                "id：" +
                res.data.content[i].assignee[j].id +
                " / ";
            }
            that.taskData.unshift({
              errorid: res.data.content[i].id,
              assigneeid: assigneeid,
              reporterid: "id：" + res.data.content[i].reporter.id,
            });
          }
          that.$message({
            message: "刷新成功",
            type: "success",
          });
        });
    },
    errordetail(index) {
      let that = this;
      console.log(that.taskData[index]);
      that.$router.push({
        path: "./mySubmitDetail",
        query: that.taskData[index],
      });
    },

    // 搜索
    search() {
      let that = this;
      let url = "";
      url =
        "http://47.102.214.37:8080/issue/query?" +
        that.selectInfo[0].ziduan +
        "==" +
        that.selectInfo[0].value;
      if (that.selectInfo.length == 1) {
        // that.exporturl = url;
        axios.get(url).then((res) => {
          console.log(res.data);
          that.taskData = [];
          // that.total = res.data.totalElements;
          // that.currentPage = 1;
          if (res.data.content.length == 0) {
            that.$message({
              message: "无结果",
              type: "warning",
            });
          } else {
            for (let i = 0; i < res.data.content.length; i++) {
              let assigneeid = "";
              for (let j = 0; j < res.data.content[i].assignee.length; j++) {
                assigneeid =
                  assigneeid +
                  "id：" +
                  res.data.content[i].assignee[j].id +
                  " / ";
              }
              that.taskData.unshift({
                errorid: res.data.content[i].id,
                assigneeid: assigneeid,
                reporterid: "id：" + res.data.content[i].reporter.id,
              });
            }
            setTimeout(() => {
              that.$message({
                message: "查询成功",
                type: "success",
              });
            }, 200);
          }
          that.selectInfo = [];
          // that.exporturl = "";
          that.selectvalue = "";
          that.selectmodel = "";
        });
      } else {
        console.log("aaa");
      }
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
