import { Request } from "../../util";
import { message } from "ant-design-vue";

const messageTip = message;

const state = {
  friendInfo: {},
  friendGroups: [],
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
  /**
   * 修改备注
   * @param {} { commit }
   * @param {friendInfo, success, error} payload
   */
  updateFriendName({ commit }, payload) {
    Request.patch(
      `/friends/${payload.friendInfo.friendId}?friendName=${payload.friendInfo.friendName}`,
    )
      .then(data => {
        commit("cantact/updateFriendGroups", data, { root: true });
        commit("updateFriendName", payload.friendInfo.friendName);
        messageTip.success("修改成功！");
        payload.success();
      })
      .catch(() => payload.error());
  },
  /**
   *  查询所有分组
   * @param {} param0
   */
  getFriendGroups({ commit }, success) {
    Request.get("/friend-groups/preview").then(data => {
      commit("updateFriendGroups", data);
      success();
    });
  },
  /**
   * 移动分组
   * @param { } { commit }
   * @param { friendId, friendGroupId, success, error } payload
   */
  moveFriendGroup({ commit }, payload) {
    Request.patch(
      `/friends/${payload.friendId}/groups/${payload.friendGroupId}`,
    )
      .then(data => {
        commit("cantact/updateFriendGroups", data, { root: true });
        messageTip.success("修改成功！");
        payload.success();
      })
      .catch(() => payload.error());
  },
};

const mutations = {
  updateFriendInfo(state, payload) {
    state.friendInfo = payload;
  },
  updateFriendGroups(state, payload) {
    state.friendGroups = payload;
  },
  updateFriendName(state, payload) {
    const { friendName, ...rest } = state.friendInfo;
    state.friendInfo = {
      friendName: friendName ? payload : friendName,
      ...rest,
    };
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
