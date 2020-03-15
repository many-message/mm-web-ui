import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import {
  Icon,
  Button,
  Form,
  Input,
  Layout,
  Row,
  Col,
  Radio,
} from "ant-design-vue";

Vue.use(Layout);
Vue.use(Row);
Vue.use(Col);
Vue.use(Icon);
Vue.use(Button);
Vue.use(Form);
Vue.use(Input);
Vue.use(Radio);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
