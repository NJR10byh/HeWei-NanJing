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
import TotalTaskList from "@/DeviceMaintenance/TotalTaskList"; // 任务信息列表
import TssignTask from "@/DeviceMaintenance/TssignTask"; // 任务分配
import TssignTask2 from "@/DeviceMaintenance/TssignTask2"; // 任务分配2
/* 设备维修*/
import FixApply from "@/DeviceFix/FixApply"; // 维修诊断
import AllError from "@/DeviceFix/AllError"; // 维修诊断
import FixDiagnosis from "@/DeviceFix/FixDiagnosis"; // 维修诊断
import DiagnosisDetail from "@/DeviceFix/DiagnosisDetail"; // 异常详情
import MySubmit from "@/DeviceFix/MySubmit"; // 我发布的
import MySubmitDetail from "@/DeviceFix/MySubmitDetail"; // 我发布的详情

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
      // 任务信息列表
      {
        path: "/totalTaskList",
        component: TotalTaskList,
      },
      // 任务分配
      {
        path: "/tssignTask",
        component: TssignTask,
      },
      // 任务分配2
      {
        path: "/tssignTask2",
        component: TssignTask2,
      },
      /* 设备维修*/
      // 全部异常
      {
        path: "/allError",
        component: AllError,
      },
      {
        path: "/fixApply",
        component: FixApply,
      },
      // 维修诊断
      {
        path: "/fixDiagnosis",
        component: FixDiagnosis,
      },
      // 异常详情
      {
        path: "/diagnosisDetail",
        component: DiagnosisDetail,
      },
      // 我发布的
      {
        path: "/mySubmit",
        component: MySubmit,
      },
      // 我发布的详情
      {
        path: "/mySubmitDetail",
        component: MySubmitDetail,
      },
    ],
  },
];

var router = new VueRouter({
  routes,
});
export default router;
