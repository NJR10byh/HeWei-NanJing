<template>
  <div
    class="Container-AddTask"
    v-if="['ROOT', 'ADMIN', 'CREATOR'].includes(userRole)"
  >
    <div class="add" @click="addNewTask">
      <div class="content">
        <h2 style="font-size:5em">+</h2>
      </div>
    </div>
    <div class="card" v-for="(item, index) in taskData" :key="index">
      <div class="content">
        <h2>{{ item.taskname }}</h2>
        <div class="Btns">
          <el-button class="btn btn1" @click="showInfo(index)"
            >以此为模版新增</el-button
          >
          <el-button class="btn btn2" @click="editTask(index)"
            >编辑模版</el-button
          >
          <el-button class="btn btn3" @click="deleteTask(index)"
            >删除模版</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AddTask",
  created: function() {
    let that = this;
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      // console.log(res.data);
      that.userRole = res.data.role;
    });
    setTimeout(function() {
      axios
        .get("http://47.102.214.37:8080/ops/schedule?page=0&size=100")
        .then((res) => {
          // console.log(res);
          for (var i = 0; i < res.data.content.length; i++) {
            // console.log(res.data.content[i]);
            that.taskData.unshift({
              taskID: res.data.content[i].id,
              taskname: res.data.content[i].name,
            });
          }
        });
    }, 300);
  },
  data() {
    return {
      userRole: "", //用户类型
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
      this.$router.push({
        path: "/addTaskInside",
        query: this.taskData[index],
      });
    },
    editTask(index) {
      this.$router.push({
        path: "/editTask",
        query: this.taskData[index],
      });
    },
    deleteTask(index) {
      let that = this;
      // console.log(that.taskData[index]);
      that
        .$confirm(
          "这个是模版，所有继承它的维护任务也会被删除, \n是否确定?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
        .then(() => {
          let url =
            "http://47.102.214.37:8080/ops/schedule/" +
            that.taskData[index].taskID;
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
  },
};
</script>

<style lang="scss">
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
    width: 230px;
    height: 280px;
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
        // border: 1px solid red;
        padding: 0 10px;
      }
      .Btns {
        // border: 1px solid red;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 10px;
        .btn {
          padding: 8px 10px;
          color: #fff;
          border: 0;
          border-radius: 5px;
        }
        .btn1 {
          width: 150px;
          padding: 12px 0;
          background: #409eff;
          font-size: 17px;
        }
        .btn2 {
          width: 118px;
          margin: 10px 0 0 0;
          background: #f8be20;
          letter-spacing: 1px;
        }
        .btn3 {
          width: 118px;
          margin: 10px 0 0 0;
          background: #fa5555;
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
