import { message } from "ant-design-vue";
import { Request } from "../../util";

const state = {
  // 聊天列表
  chats: [],
  userIdChatIdMap: new Map(),
  groupIdChatIdMap: new Map(),
  // 当前聊天消息列表
  currentChatMsgList: [],
};

const getters = {};

const actions = {
  /**
   * 查询聊天列表
   *
   * @param {*} { commit }
   */
  getChats({ commit }) {
    Request.get("/chats").then(data => commit("updateChats", data));
  },
  getChat(content, payload) {
    Request.get(`/chats/${payload.chatId}`).then(data => payload.success(data));
  },
  /**
   * 添加一个好友聊天
   *
   * @param {*} { commit }
   * @param {userId, success} payload
   */
  addFriendChat({ commit }, payload) {
    Request.post("/chats", {
      chatObjId: payload.userId,
      chatType: "1",
    }).then(data => {
      commit("updateChats", data.chats);
      payload.success(data.chatId);
    });
  },
  /**
   * 签收消息
   *
   * @param {*} { commit }
   * @param {userId, chatId, success} userId
   */
  recvMessage({ commit }, payload) {
    Request.patch(`/messages/${payload.userId}`).then(() => {
      commit("updateRecvMessage", payload.chatId);
    });
  },
  /**
   *添加一个群聊天
   *
   * @param {*} { commit }
   * @param { groupId, success } payload
   */
  addGroupChat({ commit }, payload) {
    Request.post("/chats", {
      chatObjId: payload.groupId,
      chatType: "2",
    }).then(data => {
      commit("updateChats", data.chats);
      payload.success(data.chatId);
    });
  },
  /**
   * 删除一个聊天
   *
   * @param {*} { commit }
   * @param {chatId, success} payload
   */
  deleteChat({ commit }, payload) {
    Request.delete(`/chats/${payload.chatId}`).then(data => {
      commit("updateChats", data);
      message.success("删除成功！");
    });
  },
  /**
   * 查询消息
   *
   * @param {*} { commit }
   * @param {userId, currentIndex, isAppend} payload
   */
  getMessages({ commit }, payload) {
    Request.get(
      `/${payload.userId}/messages?currentIndex=${payload.currentIndex}`,
    ).then(data => {
      if (payload.isAppend) {
        commit("pushMessageList", data);
      } else {
        commit("updateMessageList", data);
      }
    });
  },
  getGroupMessages({ commit }, payload) {
    Request.get(
      `/groups/${payload.groupId}/messages?currentIndex=${payload.currentIndex}`,
    ).then(data => {
      if (payload.isAppend) {
        commit("pushMessageList", data);
      } else {
        commit("updateMessageList", data);
      }
    });
  },
  getGroupMember(content, payload) {
    Request.get(`/groups/${payload.groupId}/members-info`).then(data =>
      payload.success(data),
    );
  },
  getGroupMemberIds(content, payload) {
    Request.get(`/groups/${payload.groupId}/members/user-ids`).then(data =>
      payload.success(data),
    );
  },
};

const mutations = {
  /**
   * 赋值整个聊天列表
   *
   * @param {*} state
   * @param {*} payload
   */
  updateChats(state, payload) {
    state.chats = payload;

    const userIdChatIdMap = new Map();
    payload
      .filter(chat => chat.chatType === "1")
      .forEach(chat => userIdChatIdMap.set(chat.chatObjId, chat.chatId));
    state.userIdChatIdMap = userIdChatIdMap;

    const groupIdChatIdMap = new Map();
    payload
      .filter(chat => chat.chatType === "2")
      .forEach(chat => groupIdChatIdMap.set(chat.chatObjId, chat.chatId));
    state.groupIdChatIdMap = groupIdChatIdMap;
  },
  /**
   * 消息签收
   *
   */
  updateRecvMessage(state, chatId) {
    state.chats.map(item => {
      if (item.chatId === chatId) {
        item.hasMsg = false;
      }
      return item;
    });
  },
  /**
   * 添加一条消息
   *
   * @param {*} state
   * @param {*} msg
   */
  pushChatMsg(state, msg) {
    state.currentChatMsgList.push(msg);
  },
  pushMessageList(state, messages) {
    state.currentChatMsgList = [...messages, ...state.currentChatMsgList];
  },
  updateMessageList(state, messages) {
    state.currentChatMsgList = messages;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
