<template>
  <div class="main">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb-top" separator="/">
      <el-breadcrumb-item class="pathActive">设备管理</el-breadcrumb-item>
      <el-breadcrumb-item class="active">生成编码</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="codeimage" v-if="url != undefined">
      <img :src="url" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      url: undefined,
    };
  },
  methods: {},
  created: function() {
    console.log(this.$route.query);
    this.url =
      "http://47.102.214.37:8080/device/barcode/" + this.$route.query.id;
  },
};
</script>
<style lang="scss">
.main {
  height: 100%;
  .breadcrumb-top {
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    font-size: 16px;
    padding: 10px 10px 5px 10px;
    .el-breadcrumb__inner {
      font-weight: bold;
    }
    .el-breadcrumb__inner.is-link {
      color: #666666;
    }

    .active {
      font-size: 20px;
    }
  }
  .codeimage {
    display: flex;
    flex-direction: row;
    justify-content: center;
    img {
      padding: 10px;
      border: 1px solid #eaeaea;
      border-radius: 20px;
      background: #fff;
      box-shadow: 5px 5px 20px #eeeeee, -5px 5px 20px #eeeeee;
    }
  }
}
</style>
