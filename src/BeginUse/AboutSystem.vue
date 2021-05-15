<template>
  <div class="Container-AboutSystem">
    <div style="padding-bottom: 20px; width: 100%">
      <!-- 面包屑 -->
      <el-breadcrumb class="Breadcrumb">
        <el-breadcrumb-item class="pathActive">使用说明</el-breadcrumb-item>
        <el-breadcrumb-item class="active">关于系统</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="About">
      <div class="About_Box">
        <div class="Info_header">
          <div class="logo">
            <a href="http://cs.njupt.edu.cn/" target="_blank">
              <img src="../assets/HeWeiLogo.png" alt />
            </a>
          </div>
          <div class="systemname">合而有为设备管理系统</div>
        </div>
        <div class="Info_body">
          <div>Version. 1.0.0（2021.5.15）</div>
          <div>Copyright © 南京合为企业管理咨询有限公司</div>
          <div>保留一切权利。</div>
          <div>联系方式：softwarehelpdesk@heweinanjing.com</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.Container-AboutSystem {
  background: #ffffff;
  width: 100%;
  height: 100%;
  //   border: 1px solid red;
  .Breadcrumb {
    line-height: 30px;
    overflow: hidden;
    font-size: 16px;
    // border: 1px solid red;
    padding: 10px 10px 0 10px;
    .el-breadcrumb__inner {
      font-weight: bold;
    }
    .el-breadcrumb__inner.is-link {
      color: #666666;
      font-weight: normal;
    }

    .active {
      font-size: 20px;
    }
  }
  .About {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 30px;
    .About_Box {
      width: 500px;
      height: 300px;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #000;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .Info_header {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 60%;
        // border: 1px solid red;
        .logo {
          display: flex;
          align-items: center;
          img {
            width: 400px;
            margin-top: 6px;
          }
        }
        .systemname {
          margin-top: 20px;
          //   border: 1px solid red;
          font-size: 25px;
        }
      }
      .Info_body {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 40%;
        // border: 1px solid red;
      }
    }
  }
}
</style>
