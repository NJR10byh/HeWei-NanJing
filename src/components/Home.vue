<template>
  <el-container class="Home">
    <el-header style="height:80px">
      <div class="logo-wrap">
        <div class="logo">
          <a href="http://cs.njupt.edu.cn/" target="_blank">
            <img src="../assets/logo.png" alt />
          </a>
        </div>
        <div class="toggle-button" @click="toggleCollapse">
          <i class="iconfont icon-caidan1"></i>
        </div>
      </div>
      <div class="title">合为企业设备管理系统</div>
      <div class="hd-btns">
        <div class="nowtime">
          <div class="timeinfo">
            <nowTime></nowTime>
            <div class="am-pm" ref="timeTips">{{ timeTip }}</div>
          </div>
        </div>
      </div>
    </el-header>
    <el-container v-if="['ROOT', 'ADMIN'].includes(userRole)">
      <el-aside :width="isCollapse ? '80px' : '200px'">
        <el-menu
          class="el-menu-vertical-demo"
          :unique-opened="true"
          :collapse-transition="false"
          :router="true"
          :collapse="isCollapse"
          :default-active="$route.path"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList1"
            :key="item.id"
          >
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本-->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              class="subItem"
            >
              <span slot="title">{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-container v-if="['CREATOR'].includes(userRole)">
      <el-aside :width="isCollapse ? '80px' : '200px'">
        <el-menu
          class="el-menu-vertical-demo"
          :unique-opened="true"
          :collapse-transition="false"
          :router="true"
          :collapse="isCollapse"
          :default-active="$route.path"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList2"
            :key="item.id"
          >
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本-->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              class="subItem"
            >
              <span slot="title">{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-container v-if="['OPERATOR'].includes(userRole)">
      <el-aside :width="isCollapse ? '80px' : '200px'">
        <el-menu
          class="el-menu-vertical-demo"
          :unique-opened="true"
          :collapse-transition="false"
          :router="true"
          :collapse="isCollapse"
          :default-active="$route.path"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList3"
            :key="item.id"
          >
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本-->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              class="subItem"
            >
              <span slot="title">{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import nowTime from "./Timer";
import axios from "axios";
export default {
  created() {
    this.getMycount();
    axios.get("http://47.102.214.37:8080/user/me").then((res) => {
      console.log(res.data);
      this.userRole = res.data.role;
    });
  },
  data() {
    return {
      isCollapse: false,
      userRole: "",
      timeTip: "",
      // ROOT，ADMIN权限
      menuList1: [
        {
          id: 1,
          authName: "用户管理",
          children: [
            {
              id: 10,
              authName: "用户",
              path: "users",
            },
          ],
        },
        {
          id: 2,
          authName: "设备管理",
          children: [
            {
              id: 20,
              authName: "新增设备",
              path: "addDevice",
            },
            {
              id: 21,
              authName: "设备信息",
              path: "deviceInformation",
            },
          ],
        },
        {
          id: 3,
          authName: "设备保养",
          children: [
            {
              id: 30,
              authName: "新增任务",
              path: "addTask",
            },
            {
              id: 31,
              authName: "任务信息",
              path: "taskInformation",
            },
            {
              id: 32,
              authName: "任务分配",
              path: "tssignTask",
            },
            {
              id: 33,
              authName: "保养记录",
              path: "maintenanceNotes",
            },
            {
              id: 34,
              authName: "保养查询",
              path: "searchMaintenance",
            },
          ],
        },
        {
          id: 4,
          authName: "设备维修",
          children: [
            {
              id: 40,
              authName: "报修申请",
              path: "fixApply",
            },
            {
              id: 41,
              authName: "维修诊断",
              path: "fixDiagnosis",
            },
            {
              id: 43,
              authName: "维修查询",
              path: "fixSearch",
            },
          ],
        },
        {
          id: 5,
          authName: "数据分析",
          children: [
            {
              id: 50,
              authName: "故障分析",
              path: "faultAnalysis",
            },
            {
              id: 51,
              authName: "保养分析",
              path: "maintenanceAnalysis",
            },
            {
              id: 52,
              authName: "维修分析",
              path: "fixAnalysis",
            },
            {
              id: 53,
              authName: "使用日志",
              path: "useLogs",
            },
            {
              id: 54,
              authName: "维修日志",
              path: "fixLogs",
            },
          ],
        },
      ],
      // CREATOR权限
      menuList2: [
        {
          id: 1,
          authName: "用户管理",
          children: [
            {
              id: 10,
              authName: "用户",
              path: "users",
            },
          ],
        },
        {
          id: 2,
          authName: "设备管理",
          children: [
            {
              id: 20,
              authName: "新增设备",
              path: "addDevice",
            },
            {
              id: 21,
              authName: "设备信息",
              path: "deviceInformation",
            },
          ],
        },
        {
          id: 3,
          authName: "设备保养",
          children: [
            {
              id: 30,
              authName: "新增任务",
              path: "addTask",
            },
            {
              id: 31,
              authName: "任务信息",
              path: "taskInformation",
            },
            {
              id: 32,
              authName: "任务分配",
              path: "tssignTask",
            },
            {
              id: 33,
              authName: "保养记录",
              path: "maintenanceNotes",
            },
            {
              id: 34,
              authName: "保养查询",
              path: "searchMaintenance",
            },
          ],
        },
        {
          id: 4,
          authName: "设备维修",
          children: [
            {
              id: 40,
              authName: "报修申请",
              path: "fixApply",
            },
            {
              id: 41,
              authName: "维修诊断",
              path: "fixDiagnosis",
            },
            {
              id: 43,
              authName: "维修查询",
              path: "fixSearch",
            },
          ],
        },
      ],
      // OPERATOR权限
      menuList3: [
        {
          id: 1,
          authName: "用户管理",
          children: [
            {
              id: 10,
              authName: "用户",
              path: "users",
            },
          ],
        },
        {
          id: 2,
          authName: "设备管理",
          children: [
            {
              id: 21,
              authName: "设备信息",
              path: "deviceInformation",
            },
          ],
        },
        {
          id: 3,
          authName: "设备保养",
          children: [
            {
              id: 31,
              authName: "任务信息",
              path: "taskInformation",
            },
            {
              id: 33,
              authName: "保养记录",
              path: "maintenanceNotes",
            },
            {
              id: 34,
              authName: "保养查询",
              path: "searchMaintenance",
            },
          ],
        },
        {
          id: 4,
          authName: "设备维修",
          children: [
            {
              id: 40,
              authName: "报修申请",
              path: "fixApply",
            },
            {
              id: 41,
              authName: "维修诊断",
              path: "fixDiagnosis",
            },
            {
              id: 43,
              authName: "维修查询",
              path: "fixSearch",
            },
          ],
        },
        {
          id: 5,
          authName: "数据分析",
          children: [
            {
              id: 50,
              authName: "故障分析",
              path: "faultAnalysis",
            },
            {
              id: 51,
              authName: "保养分析",
              path: "maintenanceAnalysis",
            },
            {
              id: 52,
              authName: "维修分析",
              path: "fixAnalysis",
            },
            {
              id: 53,
              authName: "使用日志",
              path: "useLogs",
            },
            {
              id: 54,
              authName: "维修日志",
              path: "fixLogs",
            },
          ],
        },
      ],
      // 导航图标
      iconsObj: {
        1: "iconfont icon-yonghu",
        2: "iconfont icon-guanli",
        3: "iconfont icon-baoyang",
        4: "iconfont icon-weixiu",
        5: "iconfont icon-shujufenxi",
      },
    };
  },
  methods: {
    // 切换菜单的折叠展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    getMycount: function() {
      let that = this;
      let date = new Date();
      if (date.getHours() >= 0 && date.getHours() < 12) {
        that.timeTip = "AM";
      } else if (date.getHours() >= 12 && date.getHours() < 18) {
        that.timeTip = "PM";
      } else {
        that.timeTip = "PM";
      }
    },
  },
  components: {
    nowTime,
  },
};
</script>

<style lang="scss">
.Home {
  position: absolute;
  width: 100%;
  height: 100%;
  .el-container {
    height: 100%;
  }
  .el-header {
    width: 100%;
    background-color: #fff;
    box-shadow: 1px 0 14px 0 rgba(0, 0, 0, 0.04);
    border-bottom: 2px solid #f6f6f6;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #409eff;
    .logo-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 260px;
      padding-left: 10px;
      // border: 1px solid red;
      .logo {
        display: flex;
        align-items: center;
        img {
          width: 200px;
          margin-top: 6px;
        }
      }
      .toggle-button {
        text-align: center;
        // border: 1px solid red;
        cursor: pointer;
        margin-left: 35px;
        .iconfont {
          font-size: 25px;
          color: #666;
          transition: 0.3s ease all;
        }
        &:hover {
          .iconfont {
            color: #409eff;
          }
        }
      }
      .icon-login {
        color: #000;
        font-size: 25px;
        transition: 0.3s ease all;
        margin-left: 30px;
      }
      .icon-login:hover {
        color: #409eff;
      }
    }
    .title {
      font-size: 36px;
      font-weight: bold;
      // border: 1px solid red;
    }
    .nowtime {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 260px;
      // border: 1px solid red;
      .icon {
        color: #000;
        margin-right: 30px;
        width: 20px;
        height: 20px;
      }
      .timeinfo {
        display: flex;
        justify-content: center;
        .nowDate {
          font-size: 40px;
          font-weight: bold;
          color: #409eff;
        }
        .am-pm {
          color: #409eff;
          font-size: 15px;
          font-weight: bold;
          position: relative;
          top: 3px;
          margin-left: 6px;
        }
      }
    }
  }
  // 侧边导航栏
  .el-aside {
    // border: 1px solid red;
    height: 100%;
    background-color: #fff;
    padding: 20px 10px;
    .el-menu {
      border-right: none;

      .el-submenu {
        .el-submenu__title {
          height: 40px;
          line-height: 40px;
        }
        .iconfont {
          margin-right: 14px;
          font-size: 26px;
        }
      }
    }
  }
  // 一级菜单
  .el-submenu {
    // border: 1px solid red;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: start;
    border-radius: 4px;
    margin-bottom: 20px;
    background: #fff;
    i {
      color: #333;
    }
    &.is-opened {
      .el-submenu__title {
        background: linear-gradient(-270deg, #81bdfa, #409eff);
        border-radius: 4px;
        color: #fff !important;
        font-weight: bold;
        .iconfont {
          color: #fff;
        }
        i {
          color: #fff;
        }
      }
    }
  }
  // 未折叠菜单栏
  .el-submenu .el-menu-item {
    height: 40px;
    line-height: 40px;
    min-width: auto;
    padding-left: 60px !important;

    &.subItem {
      background: #dfecf8; //二级菜单背景颜色
      display: flex;
      justify-content: flex-start;
      &:hover {
        background: #eaeaea;
        border-radius: 3px;
      }
    }
    &.subItem.is-active {
      span {
        color: #409eff;
        position: relative;
        font-weight: bold;
        font-size: 16px; //选中的项目字体加粗、放大
        //text-decoration: underline;  //在选中的项目下添加下划线
        &::before {
          content: "";
          position: absolute;
          top: 50%;
          left: -16px;
          margin-top: -3px;
          width: 6px;
          height: 6px;
          background: linear-gradient(-270deg, #6eb5fc, #409eff);
          border-radius: 3px;
        }
      }
    }
  }
  .el-submenu__title .el-submenu__icon-arrow {
    transform: rotate(-90deg);
    color: #b8c1c5;
  }
  .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
    transform: rotate(0deg);
  }
  .el-main {
    background-color: #f8f8f8;
    padding: 0;
    height: 100%;
    // border: 1px solid red;
  }
}
// 折叠后菜单栏
.el-menu--vertical {
  .el-menu--popup {
    padding: 0;
  }

  .subItem {
    background: #dfecf8;
    padding-left: 30px !important;
  }

  .subItem.is-active {
    span {
      color: #409eff;
      position: relative;
      font-weight: bold;
      font-size: 16px;

      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: -16px;
        margin-top: -3px;
        width: 6px;
        height: 6px;
        background: linear-gradient(-270deg, #6eb5fc, #409eff);
        border-radius: 3px;
      }
    }
  }
}
</style>
