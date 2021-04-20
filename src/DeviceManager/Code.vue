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
    <div class="download">
      <el-button @click="Download">下载到本地</el-button>
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
  methods: {
    // 将图片保留在本地
    downloadIamge(imgsrc, name) {
      //下载图片地址和图片名
      var image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

        var a = document.createElement("a"); // 生成一个a元素
        var event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    },
    Download() {
      this.downloadIamge(this.url, "image");
    },
  },
  created: function() {
    console.log(this.$route.query);
    this.url = "device/barcode/" + this.$route.query.id;
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
    justify-content: center;
    img {
      padding: 10px;
      border: 1px solid #eaeaea;
      border-radius: 20px;
      background: #fff;
      box-shadow: 5px 5px 20px #eeeeee, -5px 5px 20px #eeeeee;
    }
  }
  .download {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    .el-button {
      height: 35px;
      padding: 0 10px;
      border-radius: 5px;
      font-size: 15px;
      background: #409eff;
      width: 150px;
      border: 0;
      color: #fff;
      margin-left: 10px;
    }
  }
}
</style>
