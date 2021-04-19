import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";

// 引入Element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import "./assets/css/element-variables.scss";

// 引入vue-quill-editor富文本编辑器
import { quillEditor } from "vue-quill-editor";
// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

// 导入字体图标
import "./assets/fonts/iconfont.css";

// 引入axios
import axios from "axios";
Vue.prototype.$http = axios;

// 引入自己封装的接口函数
import request from "./API/api";
Vue.prototype.request = request;

// 引入全局变量
import globaldata from "./GlobalData/globaldata";
Vue.prototype.globaldata = globaldata;

Vue.config.productionTip = false;

// 安装 ElementUI 插件
Vue.use(ElementUI);
// 安装 vue-quill-editor 插件
Vue.use(quillEditor);

new Vue({
  el: "#app",
  router,
  render: (h) => h(App),
}).$mount("#app");
