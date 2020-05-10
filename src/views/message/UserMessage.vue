<template>
  <a-card
    :bordered="false"
    :hoverable="true"
    :bodyStyle="{ width: '100%', height: '400px', overflowY: 'scroll' }"
  >
    <template slot="title">
      <a-avatar class="photo">{{ sliceName(chatInfo.chatName) }}</a-avatar>
      <span :style="{ marginLeft: '10px' }">{{ chatInfo.chatTitle }}</span>
    </template>
    <div>
      <div
        v-for="(msg, index) in currentChatMsgList"
        :key="index"
        :class="{
          left: msg.sendUserId !== userInfo.userId,
          right: msg.sendUserId === userInfo.userId,
        }"
      >
        <a-avatar v-if="msg.sendUserId !== userInfo.userId" class="photo">{{
          sliceName(chatInfo.chatName)
        }}</a-avatar>
        <a-tag color="green">
          {{ msg.createTime }}
        </a-tag>
        <a-avatar v-if="msg.sendUserId === userInfo.userId" class="photo">{{
          sliceName(userInfo.nickname)
        }}</a-avatar>
        <div :class="{ 'div-left': msg.msgContent.length > 20 }">
          {{ msg.msgContent }}
        </div>
      </div>
    </div>
    <template slot="actions">
      <div>
        <a-button
          @click="handleSendMsg"
          type="primary"
          :style="{ float: 'right', right: '10px' }"
        >
          发送
        </a-button>
        <a-textarea
          placeholder="Basic usage"
          :rows="2"
          :autoSize="{ minRows: 2, maxRows: 2 }"
          :allowClear="true"
          :maxLength="255"
          :style="{ marginTop: '5px' }"
          v-model="msg"
          @change="handleChangeMsg"
          @pressEnter="handleSendMsg"
        />
      </div>
    </template>
  </a-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { sliceNickname, MsgType, getCurrentDate } from "@/util";

export default {
  props: ["chatId"],
  data() {
    return {
      chatInfo: {},
      msg: null,
    };
  },
  computed: {
    ...mapState("chat", ["currentChatMsgList"]),
    ...mapState("user", ["userInfo"]),
  },
  watch: {
    // 监听路由变化
    $route: "handleGetChatInfo",
  },
  updated() {
    this.handleScrollToBottom();
  },
  methods: {
    ...mapActions("chat", ["recvMessage", "getChat", "getMessages"]),
    ...mapMutations("chat", ["pushChatMsg"]),
    ...mapMutations("socket", ["sendMsg"]),
    handleScrollToBottom() {
      this.$nextTick(() => {
        const div = this.$el.querySelector(".ant-card-body");
        div.scrollTop = div.scrollHeight;
      });
    },
    handleGetChatInfo() {
      this.getChat({
        chatId: this.chatId,
        success: data => {
          this.chatInfo = data;
          this.getMessages({
            userId: data.chatObjId,
            currentIndex: 0,
          });
          if (data.hasMsg) {
            this.recvMessage({
              chatId: this.chatId,
              userId: data.chatObjId,
            });
          }
        },
      });
    },
    sliceName(name) {
      return sliceNickname(name);
    },
    handleChangeMsg() {
      if (this.msg) {
        this.msg = this.msg.trim();
      }
    },
    handleSendMsg() {
      if (this.msg) {
        this.sendMsg({
          msgType: MsgType.PRIVATE_CHAT,
          content: {
            recvUserId: this.chatInfo.chatObjId,
            msgContent: this.msg,
            msgAddition: "",
          },
        });
        this.pushChatMsg({
          sendUserId: this.userInfo.userId,
          nickname: this.userInfo.nickname,
          friendName: this.userInfo.nickname,
          msgContent: this.msg,
          msgAddition: "",
          createTime: getCurrentDate(),
        });
        this.msg = null;
      }
    },
  },
  mounted() {
    this.handleGetChatInfo();
    this.handleScrollToBottom();
  },
};
</script>

<style lang="less" scoped>
.photo {
  background: #1da57a;
}
.left {
  margin-bottom: 20px;
  span {
    margin-right: 10px;
  }
  div {
    margin-left: 40px;
    margin-right: 50%;
    margin-top: 10px;
    font-size: 16px;
  }
}
.right {
  text-align: right;
  margin-bottom: 20px;
  div {
    margin-left: 50%;
    margin-right: 40px;
    margin-top: 10px;
    font-size: 16px;
    text-align: right;
  }
  .div-left {
    text-align: left !important;
  }
}
</style>
