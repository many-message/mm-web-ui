import Vue from "vue";
import Vuex from "vuex";
import user from "./moudles/user";
import cantact from "./moudles/cantact";
import friend from "./moudles/friend";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    cantact,
    friend,
  },
});
