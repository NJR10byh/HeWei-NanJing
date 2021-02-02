<template>
  <div class="Container-AddTaskInside">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
      <el-breadcrumb-item class="active"
        >任务编辑（ {{ taskid }} ）</el-breadcrumb-item
      >
    </el-breadcrumb>
    <div class="Task-container">
      <div class="Task-box">
        <el-form ref="form" :model="TaskInfo" label-position="left">
          <div class="number-name">
            <el-form-item label="任务名称" style="width:48%">
              <el-input
                v-model="TaskInfo.taskname"
                placeholder="请输入任务名称"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item label="保养周期" class="TaskTime">
            每
            <el-input
              class="TaskTime-input inputStyle"
              v-model="TaskInfo.tasktime"
            ></el-input>
            <el-select
              v-model="value"
              clearable
              placeholder="请选择"
              class="TaskTime-select"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <div class="number-name">
            <el-form-item label="保养内容" style="width:48%">
              <el-input
                class="inputStyle"
                type="textarea"
                v-model="TaskInfo.taskcontent"
                :rows="8"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="保养工具及备件"
              style="margin-left:10px;width:48%"
            >
              <el-input
                class="inputStyle"
                type="textarea"
                v-model="TaskInfo.tasktools"
                :rows="8"
              ></el-input>
            </el-form-item>
          </div>
          <div class="Btns">
            <div class="sub-btn">
              <el-button>保存</el-button>
            </div>
            <div class="del-btn">
              <el-button>删除</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddTaskInside",
  created: function() {
    // console.log(this.$route.query);
    this.taskid = this.$route.query.taskName;
  },
  data() {
    return {
      taskid: "",
      TaskInfo: {},
      options: [
        {
          value: "year",
          label: "年",
        },
        {
          value: "month",
          label: "月",
        },
        {
          value: "day",
          label: "天",
        },
        {
          value: "hour",
          label: "小时",
        },
        {
          value: "minute",
          label: "分钟",
        },
      ],
      value: "",
    };
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
    padding: 10px 10px 20px 10px;
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
        padding: 10px 30px 20px 30px;
        .number-name {
          // border: 1px solid red;
          display: flex;
          width: 100%;
        }
        .inputStyle {
          width: 100%;
        }
        .el-form-item {
          margin: 0;
        }
        .TaskTime {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-self: flex-start;
          .TaskTime-input {
            width: 60px;
          }
          .TaskTime-select {
            width: 100px;
            margin-left: 10px;
          }
        }
        .Btns {
          display: flex;
          margin-top: 20px;
          justify-content: space-between;
          width: 180px;
          // border: 1px solid red;
          .sub-btn {
            .el-button {
              width: 80px;
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
          .del-btn {
            .el-button {
              width: 80px;
              background: linear-gradient(-270deg, #fca4a4, #f96b6c);
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
