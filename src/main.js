import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "reset-css";
import animated from "animate.css";
import wx from "jweixin-module";
import { Toast } from "vant";
Vue.use(Toast);
Vue.use(animated);
Toast.setDefaultOptions({ className: "bm-toast", getContainer: "#app" }); // 修改默认配置

Vue.prototype.$wx = wx;
Vue.config.productionTip = false;

/* 手机查看console */
if (process.env.NODE_ENV !== 'production') {
  var VConsole = require('vconsole/dist/vconsole.min.js')
  localStorage.setItem('vConsole_switch_y', 300)
  new VConsole()
}

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
