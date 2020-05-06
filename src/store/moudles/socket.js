import { Session, CONN } from "../../util";

const state = {
  webSocket: null,
};

const getters = {};

const actions = {
  /**
   * 接收websocket消息
   * @param {*} param0
   * @param {*} payload
   */
  webSocketOnMessage({ commit }, payload) {
    // TODO
    commit("", payload);
  },
};

const mutations = {
  /**
   * 初始化WebSocket
   * @param {*} state
   * @param webSocket
   */
  initWebSocket(state, webSocket) {
    state.webSocket = webSocket;
  },
  webSocketOnOpen(state) {
    // 建立业务上的连接
    const conn = {
      sendUserId: Session.getUserInfo().userId,
      msgType: CONN,
      content: "CONN",
    };
    state.webSocket.send(JSON.stringify(conn));
  },
  webSocketOnClose(state) {
    state.webSocket = null;
  },
  /**
   * 发送消息
   * @param {*} state
   * @param {content,msgType} payload
   */
  sendMsg(state, payload) {
    if (state.webSocket) {
      const data = {
        sendUserId: Session.getUserInfo().userId,
        msgType: payload.msgType,
        content: JSON.stringify(payload.content),
      };
      state.webSocket.send(JSON.stringify(data));
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
