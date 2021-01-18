import Vue from "vue";
import VueRouter from "vue-router";
/* 用户管理 */
import Users from "@/Users/Users";
/* 设备管理 */
// 设备信息
import DeviceInformation from "@/DeviceManager/DeviceInformation";
/* 设备保养 */
import TaskInformation from "@/DeviceMaintenance/TaskInformation";

const Home = () => import("../components/Home.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/users",
        component: Users,
      },
      {
        path: "/deviceInformation",
        component: DeviceInformation,
      },
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
