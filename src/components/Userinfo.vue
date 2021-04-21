<template>
  <div class="User_info">
    <div class="user_info_icon">
      <img :src="avatar" v-if="ifavator == true" id="img" />
      <img src="@/assets/img/avator.png" v-else />
    </div>
    <div class="user_info_detail">
      <div class="info"><span>姓名：</span>{{ name }}</div>
      <div class="info"><span>用户名：</span>{{ username }}</div>
      <div class="info"><span>用户邮箱：</span>{{ useremail }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ifavator: "",
    };
  },
  props: {
    name: String,
    username: String,
    useremail: String,
    avatar: String,
  },
  created() {
    setTimeout(() => {
      this.ifavator = false;
      console.log(this.avatar);
      this.ifavator = this.avatar == undefined ? false : true;
    }, 500);
  },
  methods: {},
};
</script>

<style lang="scss">
.User_info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  // border: 1px solid red;
  width: 300px;
  .user_info_icon {
    border-right: 1px solid #aaa;
    padding-right: 20px;
    img {
      width: 40px;
      height: 40px;
    }
  }
  .user_info_detail {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin-left: 20px;
    .info {
      color: #409eff;
      font-size: 13px;
      font-weight: bold;
      span {
        color: #111;
        font-weight: normal;
      }
    }
  }
}
</style>
