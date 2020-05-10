<template>
  <a-layout id="component-home">
    <Nav />
    <a-layout>
      <router-view />
    </a-layout>
  </a-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { Session, MsgType, RouterName } from "@/util";
import Nav from "@/views/Nav.vue";

export default {
  components: {
    Nav,
  },
  data() {
    return {
      timer: null,
    };
  },
  beforeCreate() {
    if (!Session.getToken()) {
      // 用户未登录，跳转到登录页面
      this.$router.push("/user/login");
    }
  },
  computed: {
    ...mapState("socket", ["webSocket"]),
    ...mapState("chat", ["userIdChatIdMap", "groupIdChatIdMap"]),
  },
  created() {
    this.handleInitWebSocket();
    // 每2分钟发送一次
    this.timer = setInterval(() => this.handleIdle(), 1000 * 120);
  },
  destroyed() {
    // 关闭webSocket连接
    this.webSocket.close();
    if (this.timer) {
      // 清理定时器
      clearInterval(this.timer);
    }
  },
  methods: {
    ...mapActions("notice", [
      "getFriendReqs",
      "getGroupJoinReqs",
      "getGroupJoinInvites",
    ]),
    ...mapActions("chat", [
      "getChats",
      "addFriendChat",
      "addGroupChat",
      "recvMessage",
    ]),
    ...mapActions("cantact", ["getFriendGroups", "getGroups"]),
    ...mapMutations("socket", [
      "initWebSocket",
      "webSocketOnOpen",
      "webSocketOnClose",
      "sendMsg",
    ]),
    ...mapMutations("chat", ["pushChatMsg"]),
    handleInitWebSocket() {
      const socket = new WebSocket("ws://localhost:8888/ws");
      socket.onopen = this.handleWebSocketOnOpen;
      socket.onerror = this.handleWebSocketOnError;
      socket.onmessage = this.handleWebSocketOnMessage;
      socket.onclose = this.handleWebSocketOnClose;
      this.initWebSocket(socket);
    },
    handleWebSocketOnOpen() {
      this.webSocketOnOpen();
    },
    handleWebSocketOnError() {
      this.handleInitWebSocket();
    },
    handleWebSocketOnClose() {
      this.webSocketOnClose();
    },
    // 心跳包
    handleIdle() {
      this.sendMsg({
        msgType: MsgType.IDLE,
        content: "PING-PONG",
      });
    },
    // 接收 websocket 消息
    handleWebSocketOnMessage(e) {
      const resp = JSON.parse(e.data);
      switch (resp.msgType) {
        case MsgType.IDLE:
          // 心跳检测
          console.log(resp.content);
          break;
        case MsgType.PRIVATE_CHAT:
          // 私聊
          this.handleUserChat(JSON.parse(resp.content));
          break;
        case MsgType.FRIEND_REQ_NOTICE:
          this.handleFriendReqNotice(JSON.parse(resp.content));
          // 好友请求通知
          break;
        case MsgType.DEL_FRIEND_NOTICE:
          // 删除好友通知
          this.handleDelFriendNotice(JSON.parse(resp.content));
          break;
        case MsgType.GROUP_CHAT:
          // 群聊
          this.handleGroupChat(JSON.parse(resp.content));
          break;
        case MsgType.REQ_JOIN_GROUP_NOTICE:
          // 请求加入群通知
          this.handleGroupJoinReq(JSON.parse(resp.content));
          break;
        case MsgType.INVITE_JOIN_GROUP_NOTICE:
          // 邀请加入群通知
          this.handleGroupJoinInvite(JSON.parse(resp.content));
          break;
        case MsgType.DEL_GROUP_MEMBER_NOTICE:
          // 群成员删除通知
          this.handleDeleteGroupMemberNotice(JSON.parse(resp.content));
          break;
        case MsgType.DEL_GROUP_NOTICE:
          // 群解散通知
          this.handleDeleteGroupNotice(JSON.parse(resp.content));
          break;
      }
    },
    handleDelFriendNotice(payload) {
      this.showNotification(
        "很遗憾",
        `[${payload.nickname}]已经和你解除好友关系！你们的友谊已经走到了尽头！`,
      );
      if (RouterName.startWithByName("Cantact")) {
        this.getFriendGroups();
      }
      if (RouterName.startWithByName("Message")) {
        const chatId = this.userIdChatIdMap.get(payload.sendUserId);
        this.getChats();
        if (
          RouterName.startWithByName("MessageUser") &&
          chatId &&
          chatId === RouterName.getParam("chatId")
        ) {
          this.$router.push("/home/message");
        }
      }
    },
    handleFriendReqNotice(payload) {
      this.showNotification(
        "友谊的小船向你驶来",
        `[${payload.nickname}]向你发出好友邀请，快来看看吧！`,
      );
      if (RouterName.startWithByName("Notice")) {
        this.getFriendReqs();
      }
    },
    handleGroupJoinReq(payload) {
      this.showNotification(
        "人才来啦",
        `[${payload.nickname}]请求加入群聊[${payload.groupName}]！`,
      );
      if (RouterName.startWithByName("Notice")) {
        this.getGroupJoinReqs();
      }
    },
    handleGroupJoinInvite(payload) {
      this.showNotification(
        "这里个个是人才",
        `[${payload.nickname}]邀请你加入群聊[${payload.groupName}]！`,
      );
      if (RouterName.startWithByName("Notice")) {
        this.getGroupJoinInvites();
      }
    },
    handleDeleteGroupMemberNotice(payload) {
      this.showNotification(
        "江湖再见",
        `[${payload.nickname}]已将你移出群聊[${payload.groupName}]！`,
      );
      if (RouterName.startWithByName("Cantact")) {
        this.getGroups();
      }
      if (RouterName.startWithByName("Message")) {
        const chatId = this.groupIdChatIdMap.get(payload.groupId);
        this.getChats();
        if (
          RouterName.startWithByName("MessageGroup") &&
          chatId &&
          chatId === RouterName.getParam("chatId")
        ) {
          this.$router.push("/home/message");
        }
      }
    },
    handleDeleteGroupNotice(payload) {
      this.showNotification(
        "局势一团火，散是满天星",
        `[${payload.nickname}]解散了群聊[${payload.groupName}]！`,
      );
      if (RouterName.startWithByName("Cantact")) {
        this.getGroups();
      }
      if (RouterName.startWithByName("Message")) {
        const chatId = this.groupIdChatIdMap.get(payload.groupId);
        this.getChats();
        if (
          RouterName.startWithByName("MessageGroup") &&
          chatId &&
          chatId === RouterName.getParam("chatId")
        ) {
          this.$router.push("/home/message");
        }
      }
    },
    // 处理私聊
    handleUserChat(payload) {
      const chatId = this.userIdChatIdMap.get(payload.sendUserId);
      if (
        RouterName.startWithByName("MessageUser") &&
        chatId &&
        chatId === RouterName.getParam("chatId")
      ) {
        this.pushChatMsg(payload);
        this.recvMessage({
          userId: payload.sendUserId,
          chatId,
        });
      } else {
        this.showNotification("新消息", "您有一条新消息，快去接收吧！");
        if (!chatId) {
          this.addFriendChat({
            userId: payload.sendUserId,
          });
        } else {
          this.getChats();
        }
      }
    },
    handleGroupChat(payload) {
      const chatId = this.groupIdChatIdMap.get(payload.groupId);
      if (
        RouterName.startWithByName("MessageGroup") &&
        chatId &&
        chatId === RouterName.getParam("chatId")
      ) {
        this.pushChatMsg(payload);
      } else {
        this.showNotification("新消息", "您有一大波新消息，快去接收吧！");
        if (!chatId) {
          this.addGroupChat({
            groupId: payload.groupId,
          });
        }
      }
    },
    showNotification(title, msg) {
      // 需要手动关闭
      this.$notification.open({
        message: title,
        description: msg,
        duration: 0,
      });
    },
  },
};
</script>

<style>
#component-home {
  width: 100%;
  height: 100%;
}
</style>
