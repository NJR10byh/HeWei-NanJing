<template>
  <div style="width:100%;">
    <div
      class="Container-TssignTask"
      v-if="['ROOT', 'ADMIN', 'CREATOR'].includes(user)"
    >
      <div style="padding-bottom:20px;width:100%;">
        <!-- 面包屑 -->
        <el-breadcrumb class="Breadcrumb">
          <el-breadcrumb-item class="pathActive">设备保养</el-breadcrumb-item>
          <el-breadcrumb-item class="active">任务分配</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="chuansuo">
        <div class="kuang">
          <el-transfer
            filterable
            v-model="value1"
            :data="data1"
            :titles="titles1"
          >
          </el-transfer>
        </div>
        <div class="kuang kuang2">
          <el-transfer
            filterable
            v-model="value2"
            :data="data2"
            :titles="titles2"
          >
          </el-transfer>
        </div>
        <div class="kuang kuang3">
          <el-transfer
            filterable
            filter-placeholder=""
            v-model="value3"
            :data="data3"
            :titles="titles3"
          >
          </el-transfer>
        </div>
        <div class="Btns">
          <div class="sub-btn">
            <el-button>保存</el-button>
          </div>
          <div class="del-btn">
            <el-button>删除</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="nopower" v-else>无权限</div>
  </div>
</template>

<script>
import axios from "axios";
import globaldata from "../GlobalData/globaldata";
export default {
  name: "AddTaskInside",
  created: function() {
    let that = this;
    // 判断用户类型
    // let url = "http://47.102.214.37:8080/user/" + 1;
    // axios.get(url).then((res) => {
    //   that.user = res.data.role;
    // });
    setTimeout(function() {
      if (
        that.user == "ROOT" ||
        that.user == "ADMIN" ||
        that.user == "CREATOR"
      ) {
        axios
          .get("http://47.102.214.37:8080/ops/schedule?page=0&size=10")
          .then((res) => {
            for (var i = 0; i < res.data.content.length; i++) {
              // console.log(res.data.content[i].device[0]);
              that.data1.push({
                lable: "任务 " + `${res.data.content[i].id}`,
                key: "任务 " + res.data.content[i].id,
              });
            }
          });
        // 所有设备名称
        axios.get("http://47.102.214.37:8080/device/keys/name").then((res) => {
          // console.log(res.data);
          for (var i = 0; i < res.data.length; i++) {
            let obj = {};
            obj.key = res.data[i];
            obj.label = res.data[i];
            that.data3.push({
              lable: `${res.data[i]}`,
              key: res.data[i],
            });
            // console.log(that.options[0]);
          }
        });
      }
    }, 200);
  },
  data() {
    return {
      user: globaldata.role, //用户类型
      // 选择框 1
      data1: [],
      value1: [],
      titles1: ["任务列表", "已选择任务"],
      // 选择框 2
      data2: [],
      value2: [],
      titles2: ["人员列表", "已选择人员"],
      // 选择框 3
      data3: [],
      value3: [],
      titles3: ["设备列表", "已选择设备"],
    };
  },
  methods: {},
};
</script>

<style lang="scss">
.Container-TssignTask {
  // border: 1px solid red;
  padding-bottom: 20px;
  .Breadcrumb {
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    font-size: 16px;
    // border: 1px solid red;
    padding: 10px 10px 0 10px;
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
  .chuansuo {
    // border: 1px solid red;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding-bottom: 10px;
    // overflow: hidden;
    .kuang {
      // border: 1px solid red;
      width: 600px;
    }
    .kuang2 {
      margin-top: 10px;
    }
    .kuang3 {
      margin-top: 10px;
    }
  }
  .Btns {
    display: flex;
    justify-content: space-between;
    width: 180px;
    margin-top: 20px;
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
</style>
