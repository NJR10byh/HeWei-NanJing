<template>
  <div class="Container_DailyRecordDetail">
    <div class="Box">
      <div class="opuser_optime">
        <div class="opuser">
          操作人员
          <span>{{ opusers }}</span>
        </div>
        <div class="opuser">
          操作时间
          <span>{{ optime }}</span>
        </div>
      </div>
      <div class="opuser_optime opcontent ">
        <div class="opuser content">
          操作具体内容
          <span v-if="$route.query.logcontent != '创建维护记录'">{{
            opContent
          }}</span>
          <div class="ql-snow" v-if="$route.query.logcontent == '创建维护记录'">
            <span>用户创建的维护记录：</span>
            <div class="ql-editor" v-html="opContent"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  created: function() {
    let that = this;
    console.log(this.$route.query);
    console.log(JSON.parse(this.$route.query.opContent));
    // console.log(JSON.parse(this.$route.query.opContent)[0]);
    that.opusers = this.$route.query.loguser;
    that.optime = this.$route.query.logtime;
    switch (this.$route.query.logcontent) {
      case "用户登录":
        that.opContent = "用户进行了登录操作";
        break;
      case "新增报修":
        that.opContent =
          "新增报修的流水号：" + JSON.parse(this.$route.query.opContent)[0].id;
        break;
      case "跟进报修":
        that.opContent =
          "跟进报修的流水号：" + JSON.parse(this.$route.query.opContent)[0];
        break;
      case "撤销报修":
        that.opContent = "用户撤销了报修";
        break;
      case "确认报修完成":
        that.opContent =
          "确认的报修流水号：" + JSON.parse(this.$route.query.opContent)[0];
        break;
      case "添加设备":
        that.opContent =
          "添加的设备：" +
          JSON.parse(this.$route.query.opContent)[0].name +
          "（" +
          JSON.parse(this.$route.query.opContent)[0].deviceNo +
          "）";
        break;
      case "编辑设备":
        that.opContent =
          "编辑的设备：" +
          JSON.parse(this.$route.query.opContent)[0].name +
          "（" +
          JSON.parse(this.$route.query.opContent)[0].deviceNo +
          "）";
        break;
      case "删除设备":
        that.opContent = "删除的设备ID：" + this.$route.query.opContent;
        break;
      case "导入设备":
        that.opContent = "用户进行了导入设备";
        break;
      case "导出设备":
        that.opContent = "用户导出的设备条件：" + this.$route.query.opContent;
        break;
      case "创建维护任务":
        that.opContent =
          "创建的维护标准名称：" +
          JSON.parse(this.$route.query.opContent)[0].name;
        break;
      case "编辑维护任务":
        that.opContent =
          "编辑的维护标准名称：" +
          JSON.parse(this.$route.query.opContent)[1].name;
        break;
      case "删除维护任务":
        that.opContent =
          "删除的维护任务ID：" + JSON.parse(this.$route.query.opContent)[0];
        break;
      case "创建维护记录":
        that.opContent = JSON.parse(this.$route.query.opContent)[0].record;
        break;
      case "编辑用户":
        that.opContent =
          "编辑的用户ID：" + JSON.parse(this.$route.query.opContent)[0];
        break;
      case "删除用户":
        that.opContent = "用户进行了登录操作";
        break;
      case "添加额外字段":
        that.opContent =
          "添加的额外字段名：" +
          JSON.parse(this.$route.query.opContent)[0].name;
        break;
      case "删除额外字段":
        that.opContent =
          "删除的额外字段id：" + JSON.parse(this.$route.query.opContent)[0];
        break;
      default:
        break;
    }
  },
  data() {
    return {
      opusers: "",
      optime: "",
      opContent: "",
    };
  },
  methods: {},
};
</script>
<style lang="scss">
.Container_DailyRecordDetail {
  width: 100%;
  display: flex;
  justify-content: center;
  .Box {
    width: 80%;
    background: #fff;
    border-radius: 20px;
    box-shadow: 5px 5px 20px #eeeeee, -5px 5px 20px #eeeeee;
    padding: 15px;
    margin-top: 20px;
    .opuser_optime {
      padding-bottom: 10px;
      // border: 1px solid red;
      display: flex;
      justify-content: flex-start;
      border-bottom: 1px solid #aaa;
      .opuser {
        display: flex;
        flex-direction: column;
        width: 50%;
        color: #409eff;
        font-weight: bold;
        font-size: 20px;
        span {
          color: #000;
          font-size: 15px;
          font-weight: normal;
          margin-top: 5px;
        }
      }
    }
    .opcontent {
      margin-top: 10px;
      border: 0;
    }
  }
}
</style>
