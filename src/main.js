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
  message,
  Menu,
  Avatar,
  Tabs,
  Collapse,
  List,
  Dropdown,
  Modal,
  Result,
  Descriptions,
  Select,
  Divider,
  Drawer,
  Table,
  Card,
  Tag,
  Popconfirm,
  Transfer,
  Badge,
} from "ant-design-vue";

Vue.use(Layout);
Vue.use(Row);
Vue.use(Col);
Vue.use(Icon);
Vue.use(Button);
Vue.use(Form);
Vue.use(Input);
Vue.use(Radio);
Vue.use(Menu);
Vue.use(Avatar);
Vue.use(Tabs);
Vue.use(Collapse);
Vue.use(List);
Vue.use(Dropdown);
Vue.use(Modal);
Vue.use(Result);
Vue.use(Descriptions);
Vue.use(Select);
Vue.use(Divider);
Vue.use(Drawer);
Vue.use(Table);
Vue.use(Card);
Vue.use(Tag);
Vue.use(Popconfirm);
Vue.use(Transfer);
Vue.use(Badge);

Vue.prototype.$message = message;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
