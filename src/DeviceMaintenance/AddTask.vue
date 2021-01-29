<template>
  <div class="container">
    <div class="add">
      <div class="content">
        <h2 style="font-size:5em">+</h2>
      </div>
    </div>
    <div class="card" v-for="(item,index) in taskData" :key="index">
      <div class="content">
        <h2>{{item.taskName}}</h2>
        <el-button class="Btn" @click="showInfo(index)">进入编辑</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddTask",
  data(){
    return{
      taskData:[
        {
          taskName:"任务1"
        },
        {
          taskName:"任务2"
        }
      ],
    };
  },
  methods:{
    showInfo(index){
      console.log(index);
      this.$router.push({
        path: "/addTaskInside",
        query: index,
      });
    }
  }
}
</script>

<style lang="scss">
.container{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  transition: 0.5s;
  /*border: 1px solid red;*/
  .add{
    cursor: pointer;
  }
  .card,.add{
    position: relative;
    width: 250px;
    height: 300px;
    border-radius: 20px;
    background: #fff;
    transition: 0.5s;
    box-shadow: 5px 5px 20px rgb(231, 231, 231),
      -5px 5px 20px rgb(231, 231, 231);
    .content{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: 0.5s;
      h2{
        font-size: 2em;
      }
      .Btn{
        margin-top: 15px;
        padding: 8px 10px;
        background: #262626;
        color: #fff;
        border: 0;
        border-radius: 5px;
      }
    }
  }
}
.container:hover {
  .add{
    transform: scale(.8);
    background: #000;
    .content{
      color: #fff;
    }
  }
  .add:hover{
    transform: scale(1);
  }
  .card {
    filter: blur(5px);
    transform: scale(.8);
    box-shadow: 5px 5px 20px rgb(231, 231, 231),
    -5px 5px 20px rgb(231, 231, 231);
  }
  .card:hover {
    filter: blur(0px);
    transform: scale(1);
    background: #000;
    box-shadow: 5px 5px 20px rgb(231, 231, 231),
    -5px 5px 20px rgb(231, 231, 231);
    .content{
      color: #fff;
      .Btn{
        background: #409eff;
        border-radius: 5px;
      }
    }
  }
}

</style>
