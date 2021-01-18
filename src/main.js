import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";

// 引入Element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/element-variables.scss";

// 导入字体图标
import "./assets/fonts/iconfont.css";

Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  el: "#app",
  router,
  render: (h) => h(App),
}).$mount("#app");
