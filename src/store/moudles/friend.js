import { Request } from "../../util";

const state = {
  friendInfo: {},
};

const getters = {};

const actions = {
  /**
   * 查询好友信息
   *
   * @param {*} { commit }
   * @param {*} friendId 好友ID
   */
  getFriend({ commit }, friendId) {
    Request.get(`/friends/${friendId}`).then(data =>
      commit("updateFriendInfo", data),
    );
  },
};

const mutations = {
  updateFriendInfo(state, payload) {
    state.friendInfo = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
