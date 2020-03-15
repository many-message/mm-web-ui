import Vue from "vue";
import Vuex from "vuex";
import user from "./moudles/user";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
  },
});
