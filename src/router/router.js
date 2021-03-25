import Vue from "vue";
import VueRouter from "vue-router";
/* 用户管理 */
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
import EditTask from "@/DeviceMaintenance/EditTask"; // 编辑任务（非内容）
import AlterTaskContent from "@/DeviceMaintenance/AlterTaskContent"; // 编辑任务（内容）
import TaskDetailInfo from "@/DeviceMaintenance/TaskDetailInfo"; // 任务信息详情
import TotalTaskList from "@/DeviceMaintenance/TotalTaskList"; // 任务信息列表
import TssignTask from "@/DeviceMaintenance/TssignTask"; // 任务分配
import TssignTask2 from "@/DeviceMaintenance/TssignTask2"; // 任务分配2
/* 设备维修*/
import FixApply from "@/DeviceFix/FixApply"; // 报修申请
import AllError from "@/DeviceFix/AllError"; // 全部报修
import ErrorDetail from "@/DeviceFix/ErrorDetail"; // 报修详情
import AlreadyFixOp from "@/DeviceFix/AlreadyFixOp"; // 分配到我的（OPERATOR）
import AlreadyFixSu from "@/DeviceFix/AlreadyFixSu"; // 分配到我的（SUPERVISOR）
import MySubmit from "@/DeviceFix/MySubmit"; // 我发布的
import MySubmitDetail from "@/DeviceFix/MySubmitDetail"; // 我发布的详情
/* 数据分析 */
import DailyRecord from "@/Analysis/DailyRecord"; // 使用日志
import FixAnalysis from "@/Analysis/FixAnalysis"; // 维修分析
import TaskAnalysis from "@/Analysis/TaskAnalysis"; // 保养分析

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
    redirect: "/userList",
    children: [
      /* 用户管理 */
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
      // 编辑任务（非内容）
      {
        path: "/editTask",
        component: EditTask,
      },
      // 修改任务（内容）
      {
        path: "/alterTaskContent",
        component: AlterTaskContent,
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
      // 异常详情
      {
        path: "/errorDetail",
        component: ErrorDetail,
      },
      // 维修申请
      {
        path: "/fixApply",
        component: FixApply,
      },
      // 分配给我的（OPERATOR）
      {
        path: "/alreadyFixOp",
        component: AlreadyFixOp,
      },
      // 分配给我的（SUPERVISOR）
      {
        path: "/alreadyFixSu",
        component: AlreadyFixSu,
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

      /* 数据分析 */
      {
        path: "/dailyRecord",
        component: DailyRecord,
      },
      {
        path: "/fixAnalysis",
        component: FixAnalysis,
      },
      {
        path: "/taskAnalysis",
        component: TaskAnalysis,
      },
    ],
  },
];

var router = new VueRouter({
  routes,
});
export default router;
