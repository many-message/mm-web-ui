import { Request } from "../../util";
import { message } from "ant-design-vue";
import Axios from "axios";

const messageTip = message;

const state = {
  // 我的所有分组，包括好友
  friendGroups: [],
  // 我的群聊
  myGroups: [],
  // 我加入的群聊
  joinGroups: [],
};

const getters = {};

const actions = {
  /**
   * 查询我的所有分组
   *
   * @param {*} { commit }
   */
  getFriendGroups({ commit }) {
    Request.get("/friend-groups").then(data =>
      commit("updateFriendGroups", data),
    );
  },
  /**
   * 修改分组
   *
   * @param {*} { commit }
   * @param { friednGroup, success, error } payload
   */
  updateFriendGroup({ commit }, payload) {
    Request.put("/friend-groups", payload.friendGroup)
      .then(data => {
        commit("updateFriendGroups", data);
        messageTip.success("编辑成功！");
        payload.success();
      })
      .catch(() => payload.error());
  },
  /**
   * 添加一个分组
   *
   * @param {*} { commit }
   * @param { friendGroupName, success, error } payload
   */
  addFriendGroup({ commit }, payload) {
    Request.post(`/friend-groups/${payload.friendGroupName}`)
      .then(data => {
        commit("updateFriendGroups", data);
        messageTip.success("添加成功！");
        payload.success();
      })
      .catch(() => payload.error());
  },
  /**
   * 删除一个分组
   *
   * @param {*} { commit }
   * @param {*} friendGroupId
   */
  deleteFriendGroup({ commit }, friendGroupId) {
    Request.delete(`/friend-groups/${friendGroupId}`).then(data => {
      commit("updateFriendGroups", data);
      messageTip.success("删除成功！");
    });
  },
  /**
   * 添加群聊
   *
   * @param {*} { commit }
   * @param { group, success, error } payload
   */
  addGroup({ commit }, payload) {
    Request.post("/groups", payload.group)
      .then(data => {
        commit("updateMyGroups", data);
        payload.success();
        messageTip.success("添加成功！");
      })
      .catch(() => payload.error());
  },
  /**
   * 查询群聊信息
   *  并发调用两个接口
   * @param {*} { commit }
   */
  getGroups({ commit }) {
    Axios.all([queryMyGroups(), queryMyJoinGroups()]).then(
      Axios.spread((myGroups, joinGroups) =>
        commit("updateGroups", { myGroups, joinGroups }),
      ),
    );
  },
};

/**
 * 我的群聊
 *
 * @returns
 */
function queryMyGroups() {
  return Request.get("/groups?type=1");
}
/**
 * 我加入的群聊
 *
 * @returns
 */
function queryMyJoinGroups() {
  return Request.get("/groups?type=2");
}

const mutations = {
  updateFriendGroups(state, payload) {
    state.friendGroups = payload;
  },
  updateGroups(state, payload) {
    state.myGroups = payload.myGroups;
    state.joinGroups = payload.joinGroups;
  },
  updateMyGroups(state, payload) {
    state.myGroups = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
