<template>
  <a-layout id="component-home">
    <Nav />
    <a-layout>
      <router-view />
    </a-layout>
  </a-layout>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { Session, IDLE } from "@/util";
import Nav from "@/views/Nav.vue";

const { mapState, mapMutations } = createNamespacedHelpers("socket");

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
    ...mapState(["webSocket"]),
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
    ...mapMutations([
      "initWebSocket",
      "webSocketOnOpen",
      "webSocketOnClose",
      "webSocketOnMessage",
      "sendMsg",
    ]),
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
    handleWebSocketOnMessage(e) {
      this.webSocketOnMessage(e.data);
    },
    handleWebSocketOnClose() {
      this.webSocketOnClose();
    },
    // 心跳包
    handleIdle() {
      this.sendMsg({
        msgType: IDLE,
        content: "PING-PONG",
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
