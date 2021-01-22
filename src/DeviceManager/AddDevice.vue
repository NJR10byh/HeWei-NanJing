<template>
  <div class="Main">
    <!-- 面包屑 -->
    <el-breadcrumb class="BreadCrumb">
      <el-breadcrumb-item class="left">设备管理</el-breadcrumb-item>
      <el-breadcrumb-item class="right">新增设备</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="BaseInfo">
      <div class="BaseInfoText">基本信息</div>
      <div class="BaseInfoTable">
        <el-table></el-table>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.Main {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .BreadCrumb {
    align-self: flex-start;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    padding: 5px 10px;
    .left {
      font-size: 15px;
      font-weight: bold;
    }
    .right {
      font-size: 20px;
    }
  }
  .BaseInfo {
    width: 70%;
    // border: 1px solid red;
    .BaseInfoText {
      font-size: 20px;
      // border: 1px solid red;
      text-align: center;
    }
    .BaseInfoTable {
      margin-top: 10px;
    }
  }
}
</style>
