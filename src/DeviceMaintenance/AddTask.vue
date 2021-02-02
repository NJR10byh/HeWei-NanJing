<template>
  <div class="Container-AddTask">
    <div class="add" @click="dialogVisible = true">
      <div class="content">
        <h2 style="font-size:5em">+</h2>
      </div>
    </div>
    <div class="card" v-for="(item, index) in taskData" :key="index">
      <div class="content">
        <h2>{{ item.taskName }}</h2>
        <div class="Btns">
          <el-button class="btn btn1" @click="showInfo(index)"
            >进入编辑</el-button
          >
          <el-button class="btn btn2" @click="showInfo(index)"
            >删除任务</el-button
          >
        </div>
      </div>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <div class="Cascader">
        <p>选择需要维护的设备</p>
        <el-cascader
          placeholder="试试搜索：Apple"
          :options="options"
          filterable
          clearable
          @change="change"
          style="width:80%;margin-top:10px"
        ></el-cascader>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Plus">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AddTask",
  created: function() {
    let that = this;
    that.JilianData();
    axios.get("");
  },
  data() {
    return {
      dialogVisible: false,
      taskname: "",
      taskData: [
        {
          taskName: "iPad Pro",
        },
      ],
      // 级联选择
      options: [
        {
          value: "name",
          label: "设备列表",
          children: [],
        },
        // {
        //   value: "brand",
        //   label: "设备品牌",
        //   children: [],
        // },
      ],
    };
  },
  methods: {
    // JilianData
    JilianData() {
      let that = this;
      // 设备名称
      axios.get("http://47.102.214.37:8080/device/keys/name").then((res) => {
        // console.log(res.data);
        for (var i = 0; i < res.data.length; i++) {
          let obj = {};
          obj.value = res.data[i];
          obj.label = res.data[i];
          that.options[0].children.push(obj);
          // console.log(that.options[0]);
        }
      });
      // // 设备品牌
      // axios.get("http://47.102.214.37:8080/device/keys/brand").then((res) => {
      //   // console.log(res.data);
      //   for (var i = 0; i < res.data.length; i++) {
      //     let obj = {};
      //     obj.value = res.data[i];
      //     obj.label = res.data[i];
      //     that.options[1].children.push(obj);
      //   }
      // });
    },
    change(res) {
      console.log(res);
      this.taskname = res[1];
    },
    showInfo(index) {
      console.log(index);
      this.$router.push({
        path: "/addTaskInside",
        query: this.taskData[index],
      });
    },
    // 添加任务卡
    Plus() {
      console.log(this.taskname);
      this.taskData.push({
        taskName: this.taskname,
      });
      this.dialogVisible = false;
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
  transition: 0.5s;
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
          margin: 10px 0 0 0;
          background: #f96b6c;
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
    transform: scale(1);
    transition: 0.5s;
  }
}
</style>
