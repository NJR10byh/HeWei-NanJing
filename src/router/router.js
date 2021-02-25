import Vue from "vue";
import VueRouter from "vue-router";
/* 用户管理 */
import Users from "@/Users/Users";
import UserList from "@/Users/UserList"; // 注册
import Authorize from "@/Users/Authorize"; // 授权
import Edituser from "@/Users/Edituser"; // 编辑用户信息
/* 设备管理 */
import AddDevice from "@/DeviceManager/AddDevice"; // 新增设备
import DeviceInformation from "@/DeviceManager/DeviceInformation"; // 设备信息
import EditDevice from "@/DeviceManager/EditDevice"; // 编辑设备
import Code from "@/DeviceManager/Code"; // 生成编码
/* 设备保养 */
import AddTask from "@/DeviceMaintenance/AddTask"; // 新增任务
import AddTaskInside from "@/DeviceMaintenance/AddTaskInside"; // 新增任务详情页
import EditTask from "@/DeviceMaintenance/EditTask"; // 编辑任务（模版）
import TaskInformation from "@/DeviceMaintenance/TaskInformation"; // 任务信息
import TaskDetailInfo from "@/DeviceMaintenance/TaskDetailInfo"; // 任务信息详情
import TssignTask from "@/DeviceMaintenance/TssignTask"; // 任务分配
import ErrorTask from "@/DeviceMaintenance/ErrorTask"; // 异常报告

const LoginSystem = () => import("../components/LoginSystem.vue");
const Home = () => import("../components/Home.vue");

Vue.use(VueRouter);

var routes = [
  {
    path: "/",
    name: "Login",
    component: LoginSystem,
  },
  {
    path: "/",
    component: Home,
    redirect: "/users",
    children: [
      /* 用户管理 */
      {
        path: "/users",
        component: Users,
      },
      // 注册用户
      {
        path: "/userList",
        component: UserList,
      },
      // 授权用户
      {
        path: "/authorize",
        component: Authorize,
      },
      // 编辑用户信息
      {
        path: "/edituser",
        component: Edituser,
      },
      /* 设备管理 */
      // 新增设备
      {
        path: "/addDevice",
        component: AddDevice,
      },
      // 设备信息
      {
        path: "/deviceInformation",
        component: DeviceInformation,
      },
      // 编辑设备
      {
        path: "/editDevice",
        component: EditDevice,
      },
      // 生成编码
      {
        path: "/code",
        component: Code,
      },
      /* 设备保养 */
      // 新增任务
      {
        path: "/addTask",
        component: AddTask,
      },
      // 新增任务详情页
      {
        path: "/addTaskInside",
        component: AddTaskInside,
      },
      // 编辑任务（模版）
      {
        path: "/editTask",
        component: EditTask,
      },
      // 任务信息
      {
        path: "/taskInformation",
        component: TaskInformation,
      },
      // 任务信息详情
      {
        path: "/taskDetailInfo",
        component: TaskDetailInfo,
      },
      // 任务分配
      {
        path: "/tssignTask",
        component: TssignTask,
      },
      // 异常报告
      {
        path: "/errorTask",
        component: ErrorTask,
      },
    ],
  },
];

var router = new VueRouter({
  routes,
});
export default router;
