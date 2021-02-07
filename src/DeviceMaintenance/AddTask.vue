<template>
  <div style="width:100%;height:100%">
    <div
      class="Container-AddTask"
      v-if="['ROOT', 'ADMIN', 'CREATOR'].includes(user)"
    >
      <div class="add" @click="addNewTask">
        <div class="content">
          <h2 style="font-size:5em">+</h2>
        </div>
      </div>
      <div class="card" v-for="(item, index) in taskData" :key="index">
        <div class="content">
          <h2>任务ID：{{ item.taskName }}</h2>
          <div class="Btns">
            <el-button class="btn btn1" @click="showInfo(index)"
              >以此为模版编辑</el-button
            >
            <el-button class="btn btn2" @click="showInfo(index)"
              >删除任务</el-button
            >
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
  name: "AddTask",
  created: function() {
    let that = this;
    let taskid = "";
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
              console.log(res.data.content[i]);
              taskid = res.data.content[i].id;
              that.taskData.push({
                taskName: taskid,
              });
            }
          });
      }
    }, 200);
  },
  data() {
    return {
      user: globaldata.role, //用户类型
      dialogVisible: false,
      devicename: "",
      deviceclazz: "",
      taskData: [],
    };
  },
  methods: {
    //新建维护任务（不使用模版）
    addNewTask() {
      this.$router.push({
        path: "/addTaskInside",
      });
    },
    showInfo(index) {
      console.log(index);
      this.$router.push({
        path: "/addTaskInside",
        query: this.taskData[index],
      });
    },
  },
};
</script>

<style lang="scss">
.nopower {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.Container-AddTask {
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  // border: 1px solid red;
  .card,
  .add {
    position: relative;
    width: 250px;
    height: 300px;
    border-radius: 20px;
    background: #fff;
    transform: scale(0.9);
    transition: 0.5s;
    box-shadow: 5px 5px 20px rgb(231, 231, 231),
      -5px 5px 20px rgb(231, 231, 231);
    .content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      // border: 1px solid red;
      h2 {
        font-size: 1.6em;
      }
      .Btns {
        // border: 1px solid red;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 10px;
        .btn {
          padding: 8px 10px;
          background: #409eff;
          color: #fff;
          border: 0;
          border-radius: 5px;
        }
        .btn2 {
          width: 118px;
          margin: 10px 0 0 0;
          background: #f96b6c;
          letter-spacing: 1px;
        }
      }
    }
  }
  .add {
    cursor: pointer;
    background: #000;
    .content {
      color: #fff;
    }
  }
  .card:hover,
  .add:hover {
    transition: 0.5s;
    transform: scale(1);
  }
}
</style>
