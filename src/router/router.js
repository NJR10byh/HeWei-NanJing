import Vue from "vue";
import VueRouter from "vue-router";
/* 用户管理 */
import Users from "@/Users/Users";
/* 设备管理 */
import AddDevice from "@/DeviceManager/AddDevice"; // 新增设备
import DeviceInformation from "@/DeviceManager/DeviceInformation"; // 设备信息
import EditDevice from "@/DeviceManager/EditDevice"; // 编辑设备
import Code from "@/DeviceManager/Code"; // 生成编码
import SearchDevice from "@/DeviceManager/SearchDevice"; // 设备查询
/* 设备保养 */
import AddTask from "@/DeviceMaintenance/AddTask"; // 新增任务
import AddTaskInside from "@/DeviceMaintenance/AddTaskInside"; // 新增任务详情页
import TaskInformation from "@/DeviceMaintenance/TaskInformation"; // 任务信息

const Home = () => import("../components/Home.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    redirect: "/users",
    children: [
      /* 用户管理 */

      {
        path: "/users",
        component: Users,
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
      // 设备查询
      {
        path: "/searchDevice",
        component: SearchDevice,
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
      // 任务信息
      {
        path: "/taskInformation",
        component: TaskInformation,
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
