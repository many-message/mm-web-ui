import { Request } from "../../util";

const state = {
  users: [],
  userInfo: {},
  groups: [],
  groupInfo: {},
};

const getters = {};

const actions = {
  /**
   * 搜索用户
   * @param {*} param0
   * @param {*} keyword 邮箱、昵称
   */
  searchUsers({ commit }, keyword) {
    Request.get(`/users/${keyword}/search`).then(data =>
      commit("updateUsers", data),
    );
  },
  /**
   * 查询用户详情
   * @param {*} param0
   * @param {*} userId
   */
  getUser({ commit }, userId) {
    Request.get(`/users/${userId}`).then(data => commit("updateUser", data));
  },
  /**
   * 搜索群聊
   * @param {*} param0
   * @param {*} keyword
   */
  searchGroups({ commit }, keyword) {
    Request.get(`/groups/${keyword}/search`).then(data =>
      commit("updateGroups", data),
    );
  },
  /**
   * 查询群详情
   * @param {*} param0
   * @param {*} groupId
   */
  getGroup({ commit }, groupId) {
    Request.get(`/groups/${groupId}`).then(data => commit("updateGroup", data));
  },
  /**
   * 发送好友请求
   * @param {*} param0
   * @param {friendReqInfo, success, error} payload
   */
  sendFriendReq(content, payload) {
    Request.post("/friend-reqs", payload.friendReqInfo)
      .then(() => payload.success())
      .catch(() => payload.error());
  },
  /**
   * 入群请求
   * @param {*} content
   * @param {joinGorupInfo, success, error} payload
   */
  sendJoinGroupReq(content, payload) {
    Request.post("/group-join-reqs", payload.joinGorupInfo)
      .then(data => payload.success(data))
      .catch(() => payload.error());
  },
};

const mutations = {
  updateUsers(state, payload) {
    state.users = payload;
  },
  updateUser(state, payload) {
    state.userInfo = payload;
  },
  updateGroups(state, payload) {
    state.groups = payload;
  },
  updateGroup(state, payload) {
    state.groupInfo = payload;
  },
  clearData(state) {
    state.groups = [];
    state.users = [];
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
