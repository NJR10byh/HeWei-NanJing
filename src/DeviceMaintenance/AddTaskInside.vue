<template>
  <div class="Container-AddTaskInside">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
      <el-breadcrumb-item class="active">新增模版</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Task-container">
      <div class="Task-box">
        <el-form ref="form" :model="TaskInfo" label-position="left">
          <div class="part">
            <div class="part_left">
              <div class="part_left_0 part_left_1">
                <el-form-item label="保养周期" class="task tasktime">
                  <el-select
                    clearable
                    placeholder="请选择保养周期"
                    class="TaskTime-select"
                    v-model="TaskInfo.scheduleType"
                  >
                    <el-option
                      v-for="item in tasktime"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="任务名称" class="task taskname">
                  <el-input
                    v-model="TaskInfo.name"
                    placeholder="请输入任务名称"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="part_left_0 part_left_2">
                <el-form-item label="保养部位" class="task side">
                  <el-input
                    v-model="TaskInfo.side"
                    placeholder="请输入保养部位"
                  ></el-input>
                </el-form-item>
                <el-form-item label="接受标准" class="task acceptedStandard">
                  <el-input
                    v-model="TaskInfo.acceptedStandard"
                    placeholder="请输入接受标准"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="part_left_0 part_left_3">
                <el-form-item label="保养工具及备件" class="task tools">
                  <el-input
                    class="inputStyle"
                    type="textarea"
                    v-model="TaskInfo.tools"
                    :rows="8"
                  ></el-input>
                </el-form-item>
                <el-form-item label="注意事项" class="task remark">
                  <el-input
                    class="inputStyle"
                    type="textarea"
                    v-model="TaskInfo.remark"
                    :rows="8"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="part_right">
              <el-form-item label="保养内容">
                <el-input
                  class="inputStyle"
                  type="textarea"
                  v-model="TaskInfo.content"
                  :autosize="{ minRows: 6, maxRows: 15 }"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="Btns">
            <div class="sub-btn">
              <el-button @click="submittask">保存并提交</el-button>
            </div>
            <div class="cancel-btn">
              <el-button @click="cancel">取消</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
export default {
  name: "AddTaskInside",
  created: function() {
    // let that = this;
    if (this.$route.query.taskID != undefined) {
      console.log("aaa");
    } else {
      console.log("bbb");
    }
  },
  data() {
    return {
      TaskInfo: {
        scheduleType: null,
        name: null,
        side: null,
        acceptedStandard: null,
        content: null,
        tools: null,
        remark: null,
      },
      tasktime: [
        {
          value: "Predictability",
          label: "未知",
        },
        {
          value: "Yearly",
          label: "每年",
        },
        {
          value: "Seasonally",
          label: "每季度",
        },
        {
          value: "Monthly",
          label: "每月",
        },
        {
          value: "Weekly",
          label: "每周",
        },
        {
          value: "Daily",
          label: "每天",
        },
      ],
    };
  },
  methods: {
    // 保存编辑并提交
    submittask() {
      // let that = this;
      console.log("submit");
    },
    // 取消编辑
    cancel() {
      this.$router.push({
        path: "/addTask",
      });
    },
  },
};
</script>

<style lang="scss">
.Container-AddTaskInside {
  // border: 1px solid red;
  width: 100%;
  .breadcrumb {
    width: 100%;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    font-size: 16px;
    // border: 1px solid red;
    padding: 10px 0 20px 0;
    .el-breadcrumb__inner {
      font-weight: bold;
      margin-left: 10px;
    }
    .el-breadcrumb__inner.is-link {
      color: #666666;
      font-weight: normal;
    }

    .active {
      font-size: 20px;
    }
  }
  .Task-container {
    width: 100%;
    // border: 1px solid red;
    display: flex;
    justify-content: center;
    .Task-box {
      width: 90%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      // border: 1px solid red;
      .el-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        background: #fff;
        border-radius: 20px;
        box-shadow: 5px 5px 20px #eeeeee, -5px 5px 20px #eeeeee;
        // padding: 10px 20px 20px 20px;
        .part {
          display: flex;
          justify-content: space-evenly;
          align-items: flex-start;
          width: 100%;
          .part_left {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 48%;
            padding-bottom: 20px;
            // border: 1px solid #409eff;
            .part_left_0 {
              width: 95%;
              // border: 1px solid red;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .task {
                width: 48%;
              }
            }
          }
          .part_right {
            // border: 1px solid red;
            width: 48%;
            padding: 0 5px 20px 5px;
          }
        }
        // 下面俩按钮
        .Btns {
          display: flex;
          margin-top: 20px;
          justify-content: space-between;
          // border: 1px solid red;
          width: 180px;
          .sub-btn {
            .el-button {
              // width: 80px;
              background: linear-gradient(-270deg, #6eb5fc, #409eff);
              color: #fff;
              border: 0;
              padding: 10px;
              font-size: 15px;
              border-radius: 5px;
              &:hover {
                opacity: 0.9;
              }
            }
          }
          .cancel-btn {
            .el-button {
              width: 70px;
              background: linear-gradient(-270deg, #fc9494, #f96b6c);
              color: #fff;
              border: 0;
              padding: 10px;
              font-size: 15px;
              border-radius: 5px;
              &:hover {
                opacity: 0.9;
              }
            }
          }
        }
      }
    }
  }
}
</style>
