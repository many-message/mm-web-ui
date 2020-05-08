import Vue from "vue";
import Vuex from "vuex";
import user from "./moudles/user";
import cantact from "./moudles/cantact";
import friend from "./moudles/friend";
import find from "./moudles/find";
import group from "./moudles/group";
import notice from "./moudles/notice";
import socket from "./moudles/socket";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    cantact,
    friend,
    find,
    group,
    notice,
    socket,
  },
});
