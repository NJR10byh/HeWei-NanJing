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
          <span>{{ opContent }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  created: function() {
    let that = this;
    console.log(this.$route.query);
    console.log(JSON.parse(this.$route.query.opContent)[0]);
    that.opusers = this.$route.query.loguser;
    that.optime = this.$route.query.logtime;
    that.opContent = JSON.parse(this.$route.query.opContent)[0];
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
