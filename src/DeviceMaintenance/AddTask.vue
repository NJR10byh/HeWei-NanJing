<template>
  <div class="Container-AddTask">
    <div class="add" @click="dialogVisible = true">
      <div class="content">
        <h2 style="font-size:5em">+</h2>
      </div>
    </div>
    <div class="card" v-for="(item, index) in taskData" :key="index">
      <div class="content">
        <h2>任务ID：{{ item.taskName }}</h2>
        <p>设备名称: {{ item.devicename }}</p>
        <p>设备类别: {{ item.deviceclazz }}</p>
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
    let taskid = "";
    that.JilianData();
    axios
      .get("http://47.102.214.37:8080/ops/schedule?page=0&size=10")
      .then((res) => {
        for (var i = 0; i < res.data.content.length; i++) {
          console.log(res.data.content[i]);
          taskid = res.data.content[i].id;
          let url =
            "http://47.102.214.37:8080/device/" +
            res.data.content[i].device[0].id;
          axios.get(url).then((res) => {
            that.taskData.push({
              taskName: taskid,
              devicename: res.data.name,
              deviceclazz: res.data.clazz,
            });
          });
        }
      });
  },
  data() {
    return {
      dialogVisible: false,
      devicename: "",
      deviceclazz: "",
      taskData: [],
      // 级联选择
      options: [
        {
          value: "name",
          label: "设备列表",
          children: [],
        },
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
    },
    change(res) {
      let that = this;
      this.devicename = res[1];
      let url =
        "http://47.102.214.37:8080/device/query?name==" + this.devicename;
      axios.get(url).then((res) => {
        that.deviceclazz = res.data.content[0].clazz;
      });
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
      // unshift() 从堆顶加入元素
      this.taskData.unshift({
        devicename: this.devicename,
        deviceclazz: this.deviceclazz,
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
    transition: 0.5s;
    transform: scale(1);
  }
}
</style>
