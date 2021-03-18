<template>
  <div class="Container-FixDiagnosis">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备维修</el-breadcrumb-item>
      <el-breadcrumb-item class="active">我发布的</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="refresh">
      <el-button icon="el-icon-refresh" @click="refresh">刷新列表 </el-button>
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
      <el-table-column prop="assigneeid" label="维修人员"></el-table-column>
      <el-table-column prop="reporterid" label="报修人员"></el-table-column>
      <el-table-column prop="setting" label="操作">
        <template slot-scope="scope">
          <el-button @click="errordetail(scope.$index)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import axios from "axios";
export default {
  created: function() {
    this.refresh();
  },
  data() {
    return {
      taskData: [],
    };
  },
  methods: {
    refresh() {
      let that = this;
      that.taskData = [];
      axios
        .get("http://47.102.214.37:8080/issue/reporter?page=0&size=10")
        .then((res) => {
          console.log(res.data);
          for (let i = 0; i < res.data.content.length; i++) {
            let assigneeid = "";
            for (let j = 1; j < res.data.content[i].assignee.length; j++) {
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
  },
};
</script>
<style lang="scss">
.Container-FixDiagnosis {
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
  .extraTable {
    margin-top: 5px;
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
