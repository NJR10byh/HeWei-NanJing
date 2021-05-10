<template>
  <div class="Container-BeginUse">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">使用说明</el-breadcrumb-item>
      <el-breadcrumb-item class="active">开始使用</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Tabs">
      <el-tabs tab-position="top" v-model="tabsActiveName">
        <el-tab-pane label="开始使用" name="begin">
          <el-timeline style="padding: 0 5px">
            <el-timeline-item timestamp="Tip1" placement="top">
              <el-card>
                <h4>1、软件首次使用者获得授权方的注册账号及密码；</h4>
                <h4>2、该账号为系统管理员，具有Root权限；</h4>
                <h4>
                  3、使用该账号登录后可先更改密码，然后创建一个具有管理员权限的用户进行日常管理。
                </h4>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="Tip2" placement="top">
              <el-card>
                <h4>
                  使用管理员账号登录后可创建并管理普通用户账号，分配普通用户权限，权限分为：
                </h4>
                <p style="margin-top: 10px">
                  <span style="font-weight: bold">Creator</span> -
                  可创建维护设备、保养标准及协助<span style="font-weight: bold">
                    Supervisor </span
                  >分配保养任务和查看维修任务，<span
                    style="font-weight: bold; color: red"
                  >
                    但不能进行数据分析 </span
                  ><br />
                  <span style="font-weight: bold">Supervisor</span> -
                  可查看设备清单，可管理、分配保养和维修任务及进行数据分析，<span
                    style="font-weight: bold; color: red"
                  >
                    但不能创建和编辑 </span
                  ><br />
                  <span style="font-weight: bold">Operator</span> -
                  可对分配到自己的设备进行保养、维修及报修
                </p>
                <img
                  src="@/assets/LeadtoUse/beginuseinfo1.png"
                  style="width: 98%; margin-top: 10px"
                />
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="Tip3" placement="top">
              <el-card>
                <h4>
                  1、用户使用管理员分配的账号及密码登录，密码可在登录后进行修改；
                </h4>
                <h4>2、当前登录用户的信息和权限显示在程序界面右上角。</h4>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="Tip4" placement="top">
              <el-card>
                <h4>用户根据权限完成相应的设备管理、保养维修及数据分析任务</h4>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
        <el-tab-pane label="用户管理" name="first">
          <el-timeline style="padding: 0 5px">
            <el-timeline-item timestamp="创建管理员账号" placement="top">
              <el-card>
                <h4>1、以Root权限账号和密码登录系统；</h4>
                <h4>
                  2、在"用户管理"菜单项下，点击<a href="./#/authorize"
                    >人员管理</a
                  >命令；
                </h4>
                <h4>3、填入管理员用户注册信息，其中权限可随意选择；</h4>
                <h4>4、点击"注册"按钮完成用户注册；</h4>
                <h4>
                  5、重新回到<a href="./#/authorize">人员管理</a
                  >页面在右侧的授权区选择管理员用户名；
                </h4>
                <h4>6、更改权限为ADMIN。</h4>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="创建普通用户账号" placement="top">
              <el-card>
                <h4>1、以Root权限账号和密码登录系统；</h4>
                <h4>
                  2、在"用户管理"菜单项下，点击<a href="./#/authorize"
                    >人员管理</a
                  >命令；
                </h4>
                <h4>3、填入普通用户注册信息，根据需要选择权限；</h4>
                <h4>4、点击"注册"按钮完成用户注册。</h4>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="更改注册信息" placement="top">
              <el-card>
                <h4>1、以自己的账号和密码登录系统；</h4>
                <h4>
                  2、在"用户管理"菜单项下，点击<a href="./#/edituser"
                    >修改信息</a
                  >命令；
                </h4>
                <h4>3、可修改姓名、头像、邮箱和密码；</h4>
                <h4>4、修改完成后，点击"保存修改"。</h4>
              </el-card>
            </el-timeline-item>
            <el-timeline-item
              timestamp="管理员修改普通用户注册信息"
              placement="top"
            >
              <el-card>
                <h4>1、以管理员账号和密码登录系统；</h4>
                <h4>
                  2、在"用户管理"菜单项下，点击<a href="./#/userList"
                    >用户列表</a
                  >命令，可看到当前所有注册用户；
                </h4>
                <h4>
                  3、选择需要修改信息的用户，在最右列的"操作"项下点击"修改"；
                </h4>
                <h4>4、更新用户注册信息；</h4>
                <h4>5、点击"保存修改"。</h4>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="管理员删除普通用户" placement="top">
              <el-card>
                <h4>1、以管理员账号和密码登录系统；</h4>
                <h4>
                  2、在"用户管理"菜单项下，点击<a href="./#/userList"
                    >用户列表</a
                  >命令，可看到当前所有注册用户；
                </h4>
                <h4>3、选择需要删除的用户，在最右列的"操作"项下点击"删除"；</h4>
                <h4>4、该用户将从用户列表中删除，不能再登录系统。</h4>
              </el-card>
            </el-timeline-item>
            <el-timeline-item
              timestamp="管理员更改普通用户权限"
              placement="top"
            >
              <el-card>
                <h4>1、以管理员账号和密码登录系统；</h4>
                <h4>
                  2、在"用户管理"菜单项下，点击<a href="./#/authorize"
                    >人员管理</a
                  >命令；
                </h4>
                <h4>3、在右侧的授权区选择要更改权限的用户及新的权限；</h4>
                <h4>4、点击"保存修改"。</h4>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
        <el-tab-pane label="设备管理" name="second"> </el-tab-pane>
        <el-tab-pane label="设备保养" name="third"> </el-tab-pane>
        <el-tab-pane label="设备维修" name="fourth"> </el-tab-pane>
        <el-tab-pane label="数据分析" name="fifth"> </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabsActiveName: "begin",
    };
  },
};
</script>

<style lang="scss">
.Container-BeginUse {
  // border: 1px solid red;
  width: 100%;
  height: 100%;
  background: #fafafa;
  .breadcrumb {
    width: 100%;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    font-size: 16px;
    // border: 1px solid red;
    padding: 10px 0;
    .el-breadcrumb__inner {
      font-weight: bold;
      margin-left: 10px;
    }
    .active {
      font-size: 20px;
    }
  }
  .Tabs {
    // border: 1px solid red;
    margin: 0 10px;
    a {
      font-weight: bold;
      text-decoration: none;
      color: #409eff;
      padding: 0 2px;
    }
  }
}
</style>
