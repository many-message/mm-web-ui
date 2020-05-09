import { Request } from "../../util";

const state = {
  // 聊天列表
  chats: [],
  // chatId -> chat
  chatIdMap: new Map(),
  // friendUserId -> chatId
  userIdChatIdMap: new Map(),
  // groupId -> chatId
  groupIdChatIdMap: new Map(),
};

const getters = {
  // 是否有消息
  hasMsg: state => state.chats.filter(chat => chat.hasMsg).length > 0,
};

const actions = {
  /**
   * 查询聊天列表
   *
   * @param {*} { commit }
   */
  getChats({ commit }) {
    Request.get("/chats").then(data => commit("updateChats", data));
  },
  /**
   * 添加一个好友聊天
   *
   * @param {*} { commit }
   * @param {friendUserId, success} payload
   */
  addFriendChat({ commit }, payload) {
    Request.post("/chats", {
      chatObjId: payload.friendUserId,
      chatType: "1",
    }).then(data => {
      commit("updateUserChat", data);
      payload.success(data.chatId);
    });
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

    const chatIdMap = new Map();
    payload.forEach(chat => chatIdMap.set(chat.chatId, { ...chat }));
    state.chatIdMap = chatIdMap;

    const userIdChatIdMap = new Map();
    payload
      .filter(chat => chat.chatType === "1")
      .forEach(chat => userIdChatIdMap.set(chat.chatObjeId, chat.chatId));
    state.userIdChatIdMap = userIdChatIdMap;

    const groupIdChatIdMap = new Map();
    payload
      .filter(chat => chat.chatType === "2")
      .forEach(chat => groupIdChatIdMap.set(chat.chatObjId, chat.chatId));
    state.groupIdChatIdMap = groupIdChatIdMap;
  },
  /**
   * 赋值刚刚添加的一个用户聊天列表
   *
   * @param {*} state
   * @param {*} chat
   */
  updateUserChat(state, chat) {
    const newChats = [...state.chats];
    newChats.unshift(chat);
    state.chats = newChats;

    const newChatIdMap = new Map([...state.chatIdMap]);
    newChatIdMap.set(chat.chatId, { ...chat });
    state.chatIdMap = newChatIdMap;

    const newUserIdChatIdMap = new Map([...state.userIdChatIdMap]);
    newUserIdChatIdMap.set(chat.chatObjeId, chat.chatId);
    state.userIdChatIdMap = newUserIdChatIdMap;
  },
  /**
   * 赋值一个群聊
   *
   * @param {*} state
   * @param {*} chat
   */
  updateGroupChat(state, chat) {
    const newChats = [...state.chats];
    newChats.push(chat);
    state.chats = newChats;

    const newChatIdMap = new Map([...state.chatIdMap]);
    newChatIdMap.set(chat.chatId, { ...chat });
    state.chatIdMap = newChatIdMap;

    const newGroupIdChatIdMap = new Map([...state.groupIdChatIdMap]);
    newGroupIdChatIdMap.set(chat.chatObjId, chat.chatId);
    state.groupIdChatIdMap = newGroupIdChatIdMap;
  },
  /**
   * 接收私聊消息
   *
   * @param {*} state
   * @param {sendUserId, msg, addition, createTime} payload
   */
  updateUserChatMsg(state, payload) {
    const chatId = state.userIdChatIdMap.get(payload.sendUserId);

    const newChat = { ...state.chatIdMap.get(chatId) };

    const { ...rest } = payload;
    const msg = {
      ...rest,
      nickname: newChat.chatName,
      friendName: newChat.chatTitle,
    };
    newChat.messages.push(msg);
    // TODO 判断 hasMsg 属性

    const newChatIdMap = new Map([...state.chatIdMap]);
    newChatIdMap.set(chatId, newChat);
    state.chatIdMap = newChatIdMap;

    const newChats = state.chats.map(item => {
      if (item.chatId === chatId) {
        return { ...newChat };
      }
      return item;
    });
    state.chats = { ...newChats };
  },
  /**
   * 自己发一条消息
   *
   * @param {*} state
   * @param {{sendUserId, nickname, friendName, msg, addition, createTime} as msg, chatId} payload
   */
  updateMeSendMsg(state, payload) {
    const newChat = { ...state.chatIdMap.get(payload.chatId) };

    newChat.messages.push(payload.msg);
    const newChatIdMap = new Map([...state.chatIdMap]);

    newChatIdMap.set(payload.chatId, newChat);
    state.chatIdMap = newChatIdMap;

    const newChats = state.chats.map(item => {
      if (item.chatId === payload.chatId) {
        return { ...newChat };
      }
      return item;
    });
    state.chats = { ...newChats };
  },
  /**
   * 接收一个群聊消息
   *
   * @param {*} state
   * @param {
   *  groupId, sendUserId, sendGroupMemberId,
   *  groupMemberName, nickname, msg, addition,
   *  createTime,
   * } payload
   */
  updateGroupChatMsg(state, payload) {
    const chatId = state.groupIdChatIdMap.get(payload.groupId);
    const newChat = { ...state.chatIdMap.get(chatId) };
    newChat.messages.push(payload);
    // TODO 判断是否具备hasMsg

    const newChatIdMap = new Map([...state.chatIdMap]);
    newChatIdMap.set(chatId, newChat);
    state.chatIdMap = newChatIdMap;

    const newChats = state.chats.map(item => {
      if (item.chatId === chatId) {
        return { ...newChat };
      }
      return item;
    });
    state.chats = { ...newChats };
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
