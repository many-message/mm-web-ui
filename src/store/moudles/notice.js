import { Request } from "../../util";
import Axios from "axios";
import { message } from "ant-design-vue";

const state = {
  friendReqs: [],
  groupJoinReqs: [],
  groupJoinInvites: [],
  friendReqInfo: {},
  groupJoinReqInfo: {},
  groupJoinInviteInfo: {},
};

const getters = {};

const actions = {
  /**
   * 查询所有通知
   * @param {*} param0
   */
  getAllNotices({ commit }) {
    Axios.all([
      findFriendReqs(),
      findGroupJoinReqs(),
      findGroupJoinInvites(),
    ]).then(
      Axios.spread((friendReqs, groupJoinReqs, groupJoinInvites) =>
        commit("updateAllNotices", {
          friendReqs,
          groupJoinReqs,
          groupJoinInvites,
        }),
      ),
    );
  },
  getFriendReqs({ commit }) {
    findFriendReqs().then(data => commit("updateFriendReqs", data));
  },
  getGroupJoinReqs({ commit }) {
    findGroupJoinReqs().then(data => commit("updateGroupJoinReqs", data));
  },
  getGroupJoinInvites({ commit }) {
    findGroupJoinInvites().then(data => commit("updateGroupJoinInvites", data));
  },
  /**
   * 查询好友请求详情
   * @param {*} param0
   * @param {*} friendReqId
   */
  getFriendReqInfo({ commit }, friendReqId) {
    Request.get(`/friend-reqs/${friendReqId}`).then(data =>
      commit("updateFriendReqInfo", data),
    );
  },
  /**
   * 删除好友请求
   * @param {*} param0
   * @param {friendReqId} payload
   */
  deleteFriendReqInfo({ commit }, payload) {
    Request.delete(`/friend-reqs/${payload.friendReqId}`).then(data => {
      commit("updateFriendReqs", data);
      message.success("删除成功！");
      payload.success();
    });
  },
  /**
   * 同意好友请求
   * @param {*} param0
   * @param {agreeFriendReqInfo, success, error} payload
   */
  agreeFriendReq({ commit }, payload) {
    Request.patch("/friend-reqs", payload.agreeFriendReqInfo)
      .then(data => {
        commit("updateFriendReqs", data);
        message.success("该用户已添加到联系人中！");
        payload.success();
      })
      .catch(() => payload.error());
  },
  /**
   * 查询入群请求详情
   * @param {*} param0
   * @param {*} groupJoinReqId
   */
  getGroupJoinReqInfo({ commit }, groupJoinReqId) {
    Request.get(`/group-join-reqs/${groupJoinReqId}`).then(data =>
      commit("updateGroupJoinReqInfo", data),
    );
  },
  /**
   * 删除入群请求
   * @param {*} param0
   * @param {groupJoinReqId, success} payload
   */
  deleteGroupJoinReqInfo({ commit }, payload) {
    Request.delete(`/group-join-reqs/${payload.groupJoinReqId}`).then(data => {
      commit("updateGroupJoinReqs", data);
      message.success("删除成功！");
      payload.success();
    });
  },
  /**
   * 同意入群请求
   * @param {*} param0
   * @param {groupJoinReqId, success} payload
   */
  agreeGroupJoinReqInfo({ commit }, payload) {
    Request.patch(`/group-join-reqs/${payload.groupJoinReqId}`).then(data => {
      commit("updateGroupJoinReqs", data);
      message.success("该用户已被添加到群聊中！");
      payload.success();
    });
  },
  /**
   * 查询群聊邀请详情
   * @param {*} param0
   * @param {*} groupJoinInviteId
   */
  getGroupJoinInviteInfo({ commit }, groupJoinInviteId) {
    Request.get(`/group-join-invites/${groupJoinInviteId}`).then(data =>
      commit("updateGroupJoinInviteInfo", data),
    );
  },
  /**
   * 删除群聊邀请
   * @param {*} param0
   * @param {groupJoinInviteId, success} payload
   */
  deleteGroupJoinInviteInfo({ commit }, payload) {
    Request.delete(`/group-join-invites/${payload.groupJoinInviteId}`).then(
      data => {
        commit("updateGroupJoinInvites", data);
        message.success("删除成功！");
        payload.success();
      },
    );
  },
  /**
   * 同意群聊邀请
   * @param {*} param0
   * @param {groupJoinInviteId, success} payload
   */
  agreeGroupJoinInviteInfo({ commit }, payload) {
    Request.patch(`/group-join-invites/${payload.groupJoinInviteId}`).then(
      data => {
        commit("updateGroupJoinInvites", data);
        message.success("您已成功加入到该群聊中！");
        payload.success();
      },
    );
  },
};

/**
 * 查询我的好友请求
 */
function findFriendReqs() {
  return Request.get("/friend-reqs");
}
/**
 * 查询我的群聊加入请求
 */
function findGroupJoinReqs() {
  return Request.get("/group-join-reqs");
}
/**
 * 查询我的群聊邀请请求
 */
function findGroupJoinInvites() {
  return Request.get("/group-join-invites");
}

const mutations = {
  updateAllNotices(state, payload) {
    state.friendReqs = payload.friendReqs;
    state.groupJoinReqs = payload.groupJoinReqs;
    state.groupJoinInvites = payload.groupJoinInvites;
  },
  updateFriendReqs(state, payload) {
    state.friendReqs = payload;
  },
  updateGroupJoinReqs(state, payload) {
    state.groupJoinReqs = payload;
  },
  updateGroupJoinInvites(state, payload) {
    state.groupJoinInvites = payload;
  },
  updateFriendReqInfo(state, payload) {
    state.friendReqInfo = payload;
  },
  updateGroupJoinReqInfo(state, payload) {
    state.groupJoinReqInfo = payload;
  },
  updateGroupJoinInviteInfo(state, payload) {
    state.groupJoinInviteInfo = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
